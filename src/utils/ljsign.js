import CryptoJS from 'crypto-js'
import { KJUR } from 'jsrsasign'

// 登录钱包
// 解密私钥
export const decrypt = (enckey, pwd) => CryptoJS.AES
                                                .decrypt(enckey, pwd)
                                                .toString(CryptoJS.enc.Utf8)

// 签名
export function doSign(prvkey, msg) {
  const sig = new KJUR.crypto.Signature({ 'alg': 'SHA256withECDSA' })
  sig.initSign({
    'ecprvhex': prvkey,
    'eccurvename': 'secp256r1'
  })
  sig.updateString(msg)
  return sig.sign()
}

export function doVerify(pubkey, msg, sigval) {
  const sig = new KJUR.crypto.Signature({
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

// 验证密码
// 返回true,说明用户输入的密码正确
// 返回false,说哦名密码有误
export function doValidatePwd(prvkey, pubkey) {
  if (prvkey.length === 0) return false
  const msg = 'aaa'
  const sigval = doSign(prvkey, msg)
  return doVerify(pubkey, msg, sigval)
}


// 创建钱包
export function genKeyPairHex() {
  const keypair = new KJUR.crypto.ECDSA({
    'curve': 'secp256r1'
  }).generateKeyPairHex()
  return {
    'pubhex': keypair.ecpubhex,
    'prvhex': keypair.ecprvhex
  }
}

export const encryptPrivateKey = (prvkey, pwd) => CryptoJS.AES.encrypt(prvkey, pwd).toString()

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
