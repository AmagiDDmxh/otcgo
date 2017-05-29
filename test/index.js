const ba58 = require('bs58')
const CryptoJS = require('crypto-js')

/**
 * Created by Amagi on 5/13/2017.
 */

function translateW(publicKeyCompressed) {
  const redeem = '21' + publicKeyCompressed + 'ac'
  const unhex = CryptoJS.enc.Hex.parse(redeem)
  const scriptHash = CryptoJS.enc.Hex.parse('17' + CryptoJS.RIPEMD160(CryptoJS.SHA256(unhex)).toString())
  const address = scriptHash + CryptoJS.SHA256(CryptoJS.SHA256(scriptHash)).toString().substring(0, 8)
  const bytes = Buffer.from(address, 'hex')
  return ba58.encode(bytes)
}

const json = {
  "02467ff70c2c26f51150cef52971705b2ea3f02cbd0d15febbc136d1e472527fd7": "AJfLiQuzWR1Eba7WRsVpi1mm81cLYd22Kf",
  "03f5330ebf04f3865ee29d03659afef296c74312f4208d4459f7ecb3d8111b69b0": "ANXwnGms3HsCasDRVJkHTSkDodKVkHZ1bx",
  "030ea1e1beac3690d8577fc31b13b80b5545ea2fce8256677c043ba4327018427a": "ARNJq921QUk7qTe2G3Z4as8WWqoruuH5Re",
  "022853a8d10b77e59b9feac00bf8101736eeee286e648f4b084e0a160f610349e8": "AZKeNwfiqm7ff3jV7nLrcMbLhVFdrM1KNH",
  "03ecc5523800f95fa87f5150f37453e6a70494747e1a81d687556c374080bc2035": "AcmPw3KUjfH7XRZiH588LhDVA9ArSHLis9",
  "036d5d3466706c8451a2db8003462a318e0a4f02d85789f709f9bd1f8f8ec85a50": "AM6PhPEK3VXb81eVmJwBZNgDMRzrkbyhkb",
  "02fc03c67530e8358377ab3bed8578f76cfccb54a70d7d9a7aa7bf83196a054055": "AVuUkfMX4YPivApYWUVqCNnm7mUivGyXfr",
  "03a51482ce5299652d787f02422e4d57f647848392f024b8580fa39137a2342a7f": "AJnNUn6HynVcco1p8LER72s4zXtNFYDnys",
  "02b0b345cc7fa6552d14e1af28deb1713e345057705410ed6cbf46c9342dd515e9": "AZepCd95jtuk3zaMXmQ1ACJFc3pKVMB5fA",
  "031ca6107ddee378d6c3e8c68ac61c3e82024de357cbcacc04d935780695308200": "AHY2D4ahdFjhk5pos4jeDd8RP9hL3ARvzY",
  "03fa02cf9f618b97be144a3f2f4a86ea289c70e6e9150d2aac8670fc80a94ea851": "AdBZW1EaB18PM9r3wPTZBH5naR8EwEMJf4",
  "02845ae7c192aeddf1ed7ab102ef1bf8807acdaa496c6143f69ba9113a4d244076": "Ada4yLLMGugaWe71BYJbLtoYfdnJq8BXB9",
  "033ce7165f4d798296bff5327e16ca82eed79f9143fa23ee535a54fb768991d9a9": "ASE3wkPQR4mFHwpwkdNqbSZps6D3wPZjCg"
}

Object.keys(json).forEach((pubKeyCom, i) => {
  console.log(`[${i}]: ${translateW(pubKeyCom) === json[pubKeyCom]}`)
})

console.log(translateW('03f84936879fe91ba51e3e9166a59753cbde6398ad1e53269b896b608495d495a7'))
