import { secp256k1 } from '@noble/curves/secp256k1.js'
import { hexToBytes, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const privateKey = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1'
const message = 'Hello world'

// Sign with viem
const account = privateKeyToAccount(privateKey)
const sig = await account.signMessage({ message })
console.log('viem signature:', sig)

// Parse
const r = sig.slice(2, 66)
const s = sig.slice(66, 130)
const v = parseInt(sig.slice(130, 132), 16)
console.log('r:', r)
console.log('s:', s)
console.log('v:', v)

// Hash the message
const prefix = '\x19Ethereum Signed Message:\n' + message.length
import { keccak256, toBytes } from 'viem'
const msgHash = keccak256(toBytes(prefix + message))
console.log('msgHash:', msgHash)

// Now verify with noble-curves
const privKeyBytes = hexToBytes(privateKey)
const pubKey = secp256k1.getPublicKey(privKeyBytes, false)

const sig64 = hexToBytes('0x' + r + s)
const msgHashBytes = hexToBytes(msgHash)

console.log('sig64 length:', sig64.length)
console.log('msgHashBytes length:', msgHashBytes.length)

// Try verify
const isValid = secp256k1.verify(sig64, msgHashBytes, pubKey)
console.log('Direct verify:', isValid)

// The signature might be low-s normalized - need to check
const rBigInt = BigInt('0x' + r)
const sBigInt = BigInt('0x' + s)
console.log('s is low?:', sBigInt < secp256k1.CURVE.n / 2n)

// Try using Signature object
const sigObj = secp256k1.Signature.fromBytes(sig64)
console.log('sigObj r:', sigObj.r.toString(16))
console.log('sigObj s:', sigObj.s.toString(16))

const isValid2 = sigObj.verify(msgHashBytes, pubKey)
console.log('sigObj.verify:', isValid2)

