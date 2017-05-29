import CryptoJS from 'crypto-js'


// 登录钱包
export const decrypt = (enckey, pwd) => CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8)

export function doSign(prvkey, msg) {
    // 签名
  var sig = new KJUR.crypto.Signature({
    'alg': 'SHA256withECDSA'
  })
  sig.initSign({
    'ecprvhex': prvkey,
    'eccurvename': 'secp256r1'
  })
  sig.updateString(msg)

  const sigval = sig.sign()
  return sigval
}

export function doVerify(pubkey, msg, sigval) {
    // 验证签名
  let sig = new KJUR.crypto.Signature({
    'alg': 'SHA256withECDSA',
    'prov': 'cryptojs/jsrsa'
  })
  sig.initVerifyByPublicKey({
    'ecpubhex': pubkey,
    'eccurvename': 'secp256r1'
  })

  sig.updateString(msg)

  return sig.verify(sigval)
}

export function doValidatePwd(prvkey, pubkey) {
    // 验证密码
    // 返回true,说明用户输入的密码正确
    // 返回false,说哦名密码有误
  if (prvkey.length === 0) return false
  const msg = 'aaa'
  const sigval = doSign(prvkey, msg)
  return doVerify(pubkey, msg, sigval)
}

export function genKeyPairHex() {
  const keypair = new KJUR.crypto.ECDSA({
    'curve': 'secp256r1'
  }).generateKeyPairHex()
  return {
    'pubhex': keypair.ecpubhex,
    'prvhex': keypair.ecprvhex
  }
}

export function encryptPrivateKey(prvkey, pwd) {
  return CryptoJS.AES.encrypt(prvkey, pwd).toString()
}

export function getCompressedPubHex(pubhex) {
  const ec = new KJUR.crypto.ECDSA({
    'curve': 'secp256r1',
    'pub': pubhex
  })
  const result = ec.getPublicKeyXYHex()
  const y = result['y']
  const prefix = parseInt('0x' + y[y.length - 1]) % 2 ? '03' : '02'
  return prefix + result['x']
}
