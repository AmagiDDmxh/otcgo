const { LJBigInteger } = require('./biginteger')
const Base58 = require('bs58')
const jsSHA = require('jssha')

/*
* flow@蓝鲸淘
* Licensed under the MIT License.
*/
// secp256r1
const _p = new LJBigInteger('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF')
const _a = new LJBigInteger('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC')
const _b = new LJBigInteger('0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B')
const _Gx = new LJBigInteger('0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296')
const _Gy = new LJBigInteger('0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5')
const _r = new LJBigInteger('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551')

const and = function(a, b) {
  const smallLen = a.length <= b.length ? a.length : b.length
  a = a.substring(a.length - smallLen, a.length)
  b = b.substring(b.length - smallLen, b.length)
  const andResult = new Array(smallLen)

  for (let i = 0; i < smallLen; i++) {
    if (a[i] === b[i] && a[i] === '1') andResult[i] = '1'
    else andResult[i] = '0'
  }
  return LJBigInteger.parse(andResult.join(''), 2)
}

const inverseMod = function(a, m) {
  if (a.compare(0) === -1 || m.compare(a) <= 0) {
    a = a.remainder(m)
    if (a.compare(0) === -1) {
      a = m.add(a)
    }
  }
  let c = a
  let d = m
  let uc = LJBigInteger.ONE
  let vc = LJBigInteger.ZERO
  let ud = LJBigInteger.ZERO
  let vd = LJBigInteger.ONE

  while (!c.isZero()) {
    const result = d.divRem(c)
    d = c
    const q = result[0]
    c = result[1]
    const tUc = uc
    const tVc = vc
    uc = ud.subtract(q.multiply(uc))
    vc = vd.subtract(q.multiply(vc))
    ud = tUc
    vd = tVc
  }
  if (d.compare(1) !== 0) {
    console.log('error d=' + d.toJSValue())
  }
  if (ud.compare(0) === 1) {
    return ud
  } else {
    return ud.add(m)
  }
}// test OK

class LJCurveFp {
  constructor(p, a, b) {
    this.__p = p
    this.__a = a
    this.__b = b
  }

  p() {
    return this.__p
  }

  a() {
    return this.__a
  }

  b() {
    return this.__b
  }

  containsPoint(x, y) {
    return (y.multiply(y).subtract(x.multiply(x).multiply(x).add(this.__a.multiply(x)).add(this.__b))).remainder(this.__p).isZero()
  }
}

class LJPoint {
  constructor(curve, x, y, order = null) {
    this.__curve = curve
    this.__x = x
    this.__y = y
    this.__order = order

    if (this.__curve) {
      if (!this.__curve.containsPoint(x, y)) throw new Error('point no in the curve')
    }
  }

  x() { return this.__x }

  y() { return this.__y }

  curve() { return this.__curve }

  order() { return this.__order }

  double() {
    if (this.x() === null && this.y() === null && this.curve() === null) { return INFINITY }
    var p = this.__curve.p()
    var a = this.__curve.a()
    var l = this.__x.multiply(3).multiply(this.__x)
                .add(a).multiply(inverseMod(this.__y.multiply(2), p))
                .remainder(p)
    if (l.compare(0) === -1) {
      l = p.add(l)
    }

    var x3 = l
        .multiply(l).subtract(this.__x.multiply(2))
        .remainder(p)

    if (x3.compare(0) === -1) {
      x3 = p.add(x3)
    }

    var y3 = l
        .multiply(this.__x.subtract(x3))
        .subtract(this.__y).remainder(p)
    if (y3.compare(0) === -1) { y3 = p.add(y3) }
    return new LJPoint(this.__curve, x3, y3)
  }

  add(other) {
    if (this.__x.compare(other.__x) === 0) {
      if (this.__y.add(other.__y).remainder(this.__curve.p()).isZero()) {
        return INFINITY
      } else {
        return this.double()
      }
    }
    const p = this.__curve.p()
    let l = other.__y.subtract(this.__y).multiply(inverseMod(other.__x.subtract(this.__x), p)).remainder(p)
    // console.log('origin l:'+l.toString());
    if (l.compare(0) === -1) {
      l = p.add(l)
    }
    let x3 = l.multiply(l).subtract(this.__x).subtract(other.__x).remainder(p)
    if (x3.compare(0) === -1) {
      x3 = p.add(x3)
    }
    let y3 = l.multiply(this.__x.subtract(x3)).subtract(this.__y).remainder(p)
    if (y3.compare(0) === -1) {
      y3 = p.add(y3)
    }
    return new LJPoint(this.__curve, x3, y3)
  }

  mul(other) {
    const leftmostBit = function(x) {
      var result = LJBigInteger.ONE
      while (result.compare(x) <= 0) {
        result = result.multiply(2)
      }
      return result.divide(2)
    }// test OK
    var e = other
    if (!this.__order.isZero()) {
      e = e.remainder(this.__order)
    }
    // console.log('e = '+e.toString());
    if (e.isZero()) { return INFINITY }
    if (this.x() === null && this.y() === null && this.curve() === null) return INFINITY
    if (e.compare(0) <= 0) throw new Error('e must be a positive LJBigInteger')
    var e3 = e.multiply(3)
    var negativeSelf = new LJPoint(this.__curve, this.__x, this.__y.multiply(-1), this.__order)
    var i = leftmostBit(e3).divide(2)
    let result = this
    while (i.compare(1) === 1) {
      result = result.double()

      if (!and(e3.toString(2), i.toString(2)).isZero() && and(e.toString(2), i.toString(2)).isZero()) {
        result = result.add(this)
      }
      if (and(e3.toString(2), i.toString(2)).isZero() && !and(e.toString(2), i.toString(2)).isZero()) {
        result = result.add(negativeSelf)
      }
      i = i.divide(2)
    }
    return result
  }

}

// es4
/*const LJPoint = function(curve, x, y, order = null) {
  this.__curve = curve
  this.__x = x
  this.__y = y
  this.__order = order
  if (this.__curve) {
    if (!this.__curve.containsPoint(x, y)) throw new Error('point no in the curve')
  }
}

LJPoint.prototype.x = function() { return this.__x }
LJPoint.prototype.y = function() { return this.__y }
LJPoint.prototype.curve = function() { return this.__curve }
LJPoint.prototype.order = function() { return this.__order }
LJPoint.prototype.double = function() {
  if (this.x() === null && this.y() === null && this.curve() === null) { return INFINITY }
  var p = this.__curve.p()
  var a = this.__curve.a()
  var l = this.__x.multiply(3).multiply(this.__x)
              .add(a).multiply(inverseMod(this.__y.multiply(2), p))
              .remainder(p)
  if (l.compare(0) === -1) {
    l = p.add(l)
  }

  var x3 = l
      .multiply(l).subtract(this.__x.multiply(2))
      .remainder(p)

  if (x3.compare(0) === -1) {
    x3 = p.add(x3)
  }

  var y3 = l
      .multiply(this.__x.subtract(x3))
      .subtract(this.__y).remainder(p)
  if (y3.compare(0) === -1) {
    y3 = p.add(y3)
  }
  return new LJPoint(this.__curve, x3, y3)
}

LJPoint.prototype.add = function(other) {
  if (this.__x.compare(other.__x) === 0) {
    if (this.__y.add(other.__y).remainder(this.__curve.p()).isZero()) {
      return INFINITY
    } else {
      return this.double()
    }
  }
  var p = this.__curve.p()
  var l = other.__y.subtract(this.__y).multiply(inverseMod(other.__x.subtract(this.__x), p)).remainder(p)
    // console.log('origin l:'+l.toString());
  if (l.compare(0) === -1) {
    l = p.add(l)
  }
  var x3 = l.multiply(l).subtract(this.__x).subtract(other.__x).remainder(p)
  if (x3.compare(0) === -1) {
    x3 = p.add(x3)
  }
  var y3 = l.multiply(this.__x.subtract(x3)).subtract(this.__y).remainder(p)
  if (y3.compare(0) === -1) {
    y3 = p.add(y3)
  }
  return new LJPoint(this.__curve, x3, y3)
}
LJPoint.prototype.mul = function(other) {
  const leftmost_bit = function(x) {
    var result = LJBigInteger.ONE
    while (result.compare(x) <= 0) {
      result = result.multiply(2)
    }
    return result.divide(2)
  }// test OK
  var e = other
  if (!this.__order.isZero()) {
    e = e.remainder(this.__order)
  }
    // console.log('e = '+e.toString());
  if (e.isZero()) { return INFINITY }
  if (this.x() === null && this.y() === null && this.curve() === null) return INFINITY
  if (e.compare(0) <= 0) throw new Error('e must be a positive LJBigInteger')
  var e3 = e.multiply(3)
  var negative_self = new LJPoint(this.__curve, this.__x, this.__y.multiply(-1), this.__order)
  var i = leftmost_bit(e3).divide(2)
  let result = this
  while (i.compare(1) === 1) {
    result = result.double()

    if (!and(e3.toString(2), i.toString(2)).isZero() && and(e.toString(2), i.toString(2)).isZero()) {
      result = result.add(this)
    }
    if (and(e3.toString(2), i.toString(2)).isZero() && !and(e.toString(2), i.toString(2)).isZero()) {
      result = result.add(negative_self)
    }
    i = i.divide(2)
  }
  return result
}*/

var INFINITY = new LJPoint(null, null, null)

class LJSignature {
  constructor(r, s) {
    this.r = r
    this.s = s
  }
}
/*let LJSignature = function(r, s) {
  this.r = r
  this.s = s
}*/


class LJPublicKey {
  constructor(generator, point) {
    this.curve = generator.curve()
    this.generator = generator
    this.point = point
  }
}

/*let LJPublicKey = function(generator, point) {
  this.curve = generator.curve()
  this.generator = generator
  this.point = point
}*/

class LJPrivateKey {
  constructor(publicKey, secretMultiplier) {
    this.publicKey = publicKey
    this.secretMultiplier = secretMultiplier
  }

  sign(hash, randomK) {
    const G = this.publicKey.generator
    const n = G.order()
    const k = randomK.remainder(n)
    const p1 = G.mul(k)
    const r = p1.x()
    if (r.isZero()) { throw new Error('amazingly unlucky random number r') }
    const s = inverseMod(k, n).multiply(hash.add(this.secretMultiplier.multiply(r).remainder(n))).remainder(n)
    if (s.isZero()) { throw new Error('amazingly unlucky random number s') }
    return new LJSignature(r, s)
  }
}

/*
let LJPrivateKey = function(public_key, secret_multiplier) {
  this.public_key = public_key
  this.secret_multiplier = secret_multiplier
}

LJPrivateKey.prototype.sign = function(hash, random_k) {
  var G = this.public_key.generator
  var n = G.order()
  var k = random_k.remainder(n)
  var p1 = G.mul(k)
  var r = p1.x()
  if (r.isZero()) { alert('amazingly unlucky random number r') }
  var s = inverseMod(k, n).multiply(hash.add(this.secret_multiplier.multiply(r).remainder(n))).remainder(n)
  if (s.isZero()) { alert('amazingly unlucky random number s') }
  return new LJSignature(r, s)
}
*/

/*class LJCurve {
  constructor(name, curve, generator, oid, opensslName = null) {
    this.name = name
    // this.openssl_name = openssl_name;
    this.curve = curve
    this.generator = generator
    this.order = generator.order()
    this.baselen = 32
    // this.verifying_key_length = 2*this.baselen;
    // this.signature_length = 2*this.baselen;
    // this.oid = oid;
  }
}*/

const LJCurve = function(name, curve, generator, oid, opensslName = null) {
  this.name = name
  // this.openssl_name = openssl_name;
  this.curve = curve
  this.generator = generator
  this.order = generator.order()
  this.baselen = 32
  // this.verifying_key_length = 2*this.baselen;
  // this.signature_length = 2*this.baselen;
  // this.oid = oid;
}

function calcHash(msghex) {
  const hashObj = new jsSHA('SHA-256', 'HEX', { numRounds: 1 })
  hashObj.update(msghex)
  return hashObj.getHash('HEX')
}// test OK
function toHexString(bytes) {
  let s = ''
  const x = bytes
  for (let i = 0; i < x.length; i++) {
    s = s + ('00' + (x[i] & 0xFF).toString(16)).slice(-2)
  }
  return s
}
const randrange = function(order) {
  while (true) {
    const bytes = new Array(32)
    for (let i = 0; i < bytes.length; i++) { bytes[i] = Math.floor(Math.random() * 256) }
    const k = LJBigInteger.parse(toHexString(bytes), 16)
    if (k.compare(order) === -1 && k.compare(LJBigInteger.ZERO) === 1) return k
  }
}
const numberToHex = function(numStr) {
  switch (numStr) {
    case '10':return 'a'
    case '11':return 'b'
    case '12':return 'c'
    case '13':return 'd'
    case '14':return 'e'
    case '15':return 'f'
    default: return numStr
  }
}
const numberToString = function(n) {
  let hexArray = []
  do {
    const result = n.divRem(16)
    var div = result[0]
    const rem = result[1]
    hexArray = [numberToHex(rem.toString())].concat(hexArray)
    n = div
  } while (div.compare(16) >= 0)

  hexArray = [numberToHex(div.toString())].concat(hexArray)
  let s = hexArray.join('')

  if (s.length < 64) {
    let pres = ''
    for (let i = 0; i < 64 - s.length; i++, pres += 0) { }
    s = pres + s
  }
  return s
}

const sigencodeString = (r, s) => numberToString(r) + numberToString(s)

class LJSigningKey {
  constructor(prvhex, curve = SECP256r1) {
    this.curve = curve
    this.baselen = 32
    const n = curve.order
    this.order = n
    this.secexp = LJBigInteger.parse(prvhex, 16)
    if (this.secexp.compare(1) === -1 || this.secexp.compare(n) >= 0) {
      throw new Error('invalid private key for SECP256r1')
    }
    const pubkeyPoint = curve.generator.mul(this.secexp)
    // console.log('x:'+pubkey_point.x().toString()+'\ny:'+pubkey_point.y().toString());
    const pubkey = new LJPublicKey(curve.generator, pubkeyPoint)
    pubkey.order = n
    this.prvkey = new LJPrivateKey(pubkey, this.secexp)
    return this
  }

  sign(msghex) {
    const msghash = calcHash(msghex)
    const biMsghash = LJBigInteger.parse(msghash, 16)
    const k = randrange(this.order)
    const ljsignatue = this.prvkey.sign(biMsghash, k)
    return sigencodeString(ljsignatue.r, ljsignatue.s)
  }
}

/*
const LJSigningKey = function(prvhex, curve = SECP256r1) {
  this.curve = curve
    // this.hashfunc = 'sha256';
  this.baselen = 32
  var n = curve.order
  this.order = n
  this.secexp = LJBigInteger.parse(prvhex, 16)
  if (this.secexp.compare(1) === -1 || this.secexp.compare(n) >= 0) {
    throw new Error('invalid private key for SECP256r1')
  }
  const pubkeyPoint = curve.generator.mul(this.secexp)
    // console.log('x:'+pubkey_point.x().toString()+'\ny:'+pubkey_point.y().toString());
  const pubkey = new LJPublicKey(curve.generator, pubkeyPoint)
  pubkey.order = n
  this.prvkey = new LJPrivateKey(pubkey, this.secexp)
  return this
}

LJSigningKey.prototype.sign = function(msghex) {
  var msghash = calcHash(msghex)
  var bi_msghash = LJBigInteger.parse(msghash, 16)
  var k = randrange(this.order)
  var ljsignatue = this.prvkey.sign(bi_msghash, k)
  return sigencodeString(ljsignatue.r, ljsignatue.s)
}
*/

const curveSecp256r1 = new LJCurveFp(_p, _a, _b)
const generatorSecp256r1 = new LJPoint(curveSecp256r1, _Gx, _Gy, _r)
const SECP256r1 = new LJCurve('SECP256r1', curveSecp256r1, generatorSecp256r1, [1, 3, 132, 0, 10], 'SECP256r1')

export const ljSign = (prvhex, msghex) => (new LJSigningKey(prvhex)).sign(msghex)

export const ljWifkeyToBinkey = wif => Base58.decode(wif).subarray(1, 33)

export const ljWifkeyToHexkey = function(wif) {
  let s = ''
  const x = ljWifkeyToBinkey(wif)
  for (let i = 0; i < x.length; i++) {
    s = s + ('00' + (x[i] & 0xFF).toString(16)).slice(-2)
  }
  return s
}

export const ljPrikeyToPubkey = function(prvhex) {
  const secexp = LJBigInteger.parse(prvhex, 16)
  const n = LJBigInteger('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551')
  if (secexp.compare(1) === -1 || secexp.compare(n) >= 0) {
    throw new Error('invalid private key for SECP256r1')
  }
  const pubkeyPoint = generatorSecp256r1.mul(secexp)
  let sX = pubkeyPoint.x().toString(16)
  let sY = pubkeyPoint.y().toString(16)
  const sXLength = sX.length
  const sYLength = sY.length

  for (let i = 0; i < 64 - sXLength; i++, sX = '0' + sX) {}
  for (let i = 0; i < 64 - sYLength; i++, sY = '0' + sY) {}
  return ('04' + sX + sY).toLowerCase()
}

export const ljWifkeyToPubkey = function(wif) {
  const prvhex = ljWifkeyToHexkey(wif)
  return ljPrikeyToPubkey(prvhex)
}

export default {
  ljWifkeyToHexkey,
  ljWifkeyToPubkey,
  ljSign
}
