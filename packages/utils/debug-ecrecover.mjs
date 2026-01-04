// Debug ecrecover to see what's happening
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { hexToBytes, keccak256, toHex, toBytes, recoverPublicKey as viemRecoverPublicKey } from 'viem'

const testVectors = {
  messageHash: '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede',
  r: 0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87n,
  s: 0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78n,
  v: 27,
  expectedAddress: '0xED54a7C1d8634BB589f24Bb7F05a5554b36F9618',
}

// Convert to bytes
const msgHash = hexToBytes(testVectors.messageHash)
const rBytes = hexToBytes('0x' + testVectors.r.toString(16).padStart(64, '0'))
const sBytes = hexToBytes('0x' + testVectors.s.toString(16).padStart(64, '0'))

console.log('msgHash:', toHex(msgHash))
console.log('rBytes:', toHex(rBytes))  
console.log('sBytes:', toHex(sBytes))

// Create concatenated signature
const concatSig = new Uint8Array(64)
concatSig.set(rBytes, 0)
concatSig.set(sBytes, 32)

const recovery = testVectors.v - 27
console.log('recovery:', recovery)

// What does viem's recoverPublicKey return?
const fullSig = '0x' + testVectors.r.toString(16).padStart(64, '0') + testVectors.s.toString(16).padStart(64, '0') + testVectors.v.toString(16).padStart(2, '0')
const viemPubKey = await viemRecoverPublicKey({ hash: testVectors.messageHash, signature: fullSig })
console.log('viem recoverPublicKey:', viemPubKey)

// Try using sig.recoverPublicKey directly (the "buggy" way)
console.log('\n--- Method: sig.recoverPublicKey ---')
const sigObj = secp256k1.Signature.fromBytes(concatSig).addRecoveryBit(recovery)
console.log('sigObj.r:', sigObj.r.toString(16))
console.log('sigObj.s:', sigObj.s.toString(16))
console.log('sigObj.recovery:', sigObj.recovery)

const pubKeyPoint = sigObj.recoverPublicKey(msgHash)
console.log('pubKeyPoint x:', pubKeyPoint.x.toString(16))
console.log('pubKeyPoint y:', pubKeyPoint.y.toString(16))

const pubKeyUncompressed = pubKeyPoint.toRawBytes(false)
console.log('pubKeyUncompressed:', toHex(pubKeyUncompressed))

const pubKeyHash = keccak256(pubKeyUncompressed.slice(1))
const addr = '0x' + pubKeyHash.slice(-40)
console.log('Address from sig.recoverPublicKey:', addr)

// Method with secp256k1.recoverPublicKey(sig65, msgHash)
console.log('\n--- Method: secp256k1.recoverPublicKey(sig65, msgHash) ---')
const sig65 = sigObj.toBytes('recovered')
console.log('sig65 first byte:', sig65[0])
const recoveredCompressed = secp256k1.recoverPublicKey(sig65, msgHash)
console.log('recoveredCompressed:', toHex(recoveredCompressed))

const point = secp256k1.Point.fromBytes(recoveredCompressed)
const uncompressedPubKey = point.toBytes(false).slice(1)
const pubKeyHash2 = keccak256(uncompressedPubKey)
const addr2 = '0x' + pubKeyHash2.slice(-40)
console.log('Address from secp256k1.recoverPublicKey:', addr2)

