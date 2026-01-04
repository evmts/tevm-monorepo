import { secp256k1 } from '@noble/curves/secp256k1.js'
import { hexToBytes, toHex } from 'viem'

// Use test vector from signature.spec.ts - this is a real signature
// Private key: 0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1
const privateKey = hexToBytes('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
const msgHash = hexToBytes('0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede')
const r = hexToBytes('0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87')
const s = hexToBytes('0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78')

// Get the public key from private key
const pubKey = secp256k1.getPublicKey(privateKey, false) // uncompressed
console.log('Public key from private key:', toHex(pubKey))

// Create the signature for verification
const sig64 = new Uint8Array(64)
sig64.set(r, 0)
sig64.set(s, 32)

// Verify with the known public key
const isValid1 = secp256k1.verify(sig64, msgHash, pubKey)
console.log('Verify with privkey-derived pubkey:', isValid1)

// Now try recovery
const sigObj = secp256k1.Signature.fromBytes(sig64).addRecoveryBit(0)
const recoveredPoint = sigObj.recoverPublicKey(msgHash)
const recoveredPubKey = recoveredPoint.toBytes(false)
console.log('Recovered pubkey:', toHex(recoveredPubKey))

// Verify with recovered key
const isValid2 = secp256k1.verify(sig64, msgHash, recoveredPubKey)
console.log('Verify with recovered pubkey:', isValid2)

// Check if they match
console.log('Pubkeys match:', toHex(pubKey) === toHex(recoveredPubKey))

// Fresh sign to see what we get
const freshSig = secp256k1.sign(msgHash, privateKey)
console.log('Fresh sign r:', freshSig.r.toString(16))
console.log('Fresh sign s:', freshSig.s.toString(16))
console.log('Fresh sign recovery:', freshSig.recovery)

// Compare r and s
console.log('r matches fresh:', toHex(r) === ('0x' + freshSig.r.toString(16).padStart(64, '0')))
console.log('s matches fresh:', toHex(s) === ('0x' + freshSig.s.toString(16).padStart(64, '0')))

