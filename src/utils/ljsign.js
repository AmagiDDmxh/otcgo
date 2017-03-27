// 登录钱包
export function decrypt(enckey, pwd) {
  //解密私钥
  return CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8);
}

export function doSign(prvkey, msg) {
  //签名
  const sig = new KJUR.crypto.Signature({
    'alg': 'SHA256withECDSA',
  });
  sig.initSign({
    'ecprvhex': prvkey,
    'eccurvename': 'secp256r1',
  });
  sig.updateString(msg);
  return sig.sign();
}

export function doVerify(pubkey, msg, sigval) {
  //验证签名
  var sig = new KJUR.crypto.Signature({
    'alg': 'SHA256withECDSA',
    'prov': 'cryptojs/jsrsa',
  });
  sig.initVerifyByPublicKey({
    'ecpubhex': pubkey,
    'eccurvename': 'secp256r1',
  });
  sig.updateString(msg);
  return sig.verify(sigval);
}

export function doValidatePwd(prvkey, pubkey) {
  //验证密码
  //返回true,说明用户输入的密码正确
  //返回false,说哦名密码有误
  if (0 == prvkey.length) return false;
  const msg = 'aaa';
  const sigval = doSign(prvkey, msg);
  return doVerify(pubkey, msg, sigval);
}
