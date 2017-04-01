
// 登录钱包
function decrypt(enckey, pwd) {
    //解密私钥
    var prvkey = CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8);
    return prvkey;
}

function doSign(prvkey, msg) {
    //签名
    var sig = new KJUR.crypto.Signature({
        'alg': 'SHA256withECDSA'
    });
    sig.initSign({
        'ecprvhex': prvkey,
        'eccurvename': 'secp256r1'
    });
    sig.updateString(msg);
    var sigval = sig.sign();
    return sigval;
}

function doVerify(pubkey, msg, sigval) {
    //验证签名
    var sig = new KJUR.crypto.Signature({
        "alg": 'SHA256withECDSA',
        "prov": "cryptojs/jsrsa"
    });
    sig.initVerifyByPublicKey({
        'ecpubhex': pubkey,
        'eccurvename': 'secp256r1'
    });
    sig.updateString(msg);
    var result = sig.verify(sigval);
    return result;
}

function doValidatePwd(prvkey, pubkey) {
    //验证密码
    //返回true,说明用户输入的密码正确
    //返回false,说哦名密码有误
    if (0 == prvkey.length) return false;
    var msg = 'aaa';
    var sigval = doSign(prvkey, msg);
    var result = doVerify(pubkey, msg, sigval);
    return result;
}
