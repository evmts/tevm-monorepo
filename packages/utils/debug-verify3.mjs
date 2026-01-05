import { secp256k1 } from '@noble/curves/secp256k1.js'
import { hexToBytes, toHex, keccak256, toBytes } from 'viem'

const privateKey = hexToBytes('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
const message = 'Hello world'

// Hash the message like EIP-191
const prefix = '\x19Ethereum Signed Message:\n' + message.length
const msgHash = hexToBytes(keccak256(toBytes(prefix + message)))
console.log('msgHash:', toHex(msgHash))

// Get public key
const pubKey = secp256k1.getPublicKey(privateKey, false)
console.log('pubKey:', toHex(pubKey))

// Sign directly with noble-curves
const sig = secp256k1.sign(msgHash, privateKey)
console.log('noble sign result type:', typeof sig, sig instanceof Uint8Array)
console.log('noble sign result:', sig)

// If it's a Uint8Array, parse it
if (sig instanceof Uint8Array) {
  console.log('sig is Uint8Array of length:', sig.length)
  const sigObj = secp256k1.Signature.fromBytes(sig)
  console.log('sigObj.r:', sigObj.r.toString(16))
  console.log('sigObj.s:', sigObj.s.toString(16))
  
  // Verify
  const isValid = secp256k1.verify(sig, msgHash, pubKey)
  console.log('verify with Uint8Array sig:', isValid)
  
  // Also try sigObj.verify
  const isValid2 = sigObj.verify(msgHash, pubKey)
  console.log('sigObj.verify:', isValid2)
}

