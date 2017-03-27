export function genKeyPairHex() {
	var ec = new KJUR.crypto.ECDSA({
		'curve': 'secp256r1'
	});
	var keypair = ec.generateKeyPairHex();
	var pubhex = keypair.ecpubhex;
	var prvhex = keypair.ecprvhex;
	return {
		'pubhex': pubhex,
		'prvhex': prvhex
	};
}

export function encryptPrivateKey(prvkey, pwd) {

	var enckey = CryptoJS.AES.encrypt(prvkey, pwd);
	return enckey.toString();
}

export function getCompressedPubHex(pubhex) {
	var ec = new KJUR.crypto.ECDSA({
		'curve': 'secp256r1',
		'pub': pubhex
	});
	var result = ec.getPublicKeyXYHex();
	var y = result['y'];
	var prefix = parseInt('0x' + y[y.length - 1]) % 2 ? '03' : '02';
	return prefix + result['x'];
}


export function download(text, name, type) {
	const file = new Blob([text], {
    type: type,
  });
	const aLink = document.createElement('a');
	aLink.href = URL.createObjectURL(file);
	aLink.download = name.replace(/[.].(.*)/, '.json');
	aLink.click();
}