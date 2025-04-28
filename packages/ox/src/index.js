// Export all Effect modules
export * from './address/index.js'
export * from './bytes/index.js'
export * from './errors/index.js'
export * from './hex/index.js'

// Re-export original Ox for convenience
export { 
  Abi, 
  AbiConstructor, 
  AbiError, 
  AbiEvent, 
  AbiFunction, 
  AbiItem, 
  AbiParameters, 
  AccessList, 
  AccountProof, 
  Address, 
  AesGcm, 
  Authorization, 
  Base58, 
  Base64, 
  BinaryStateTree, 
  Blobs, 
  Block, 
  BlockOverrides, 
  Bloom, 
  Bls, 
  BlsPoint, 
  Bytes, 
  Caches, 
  ContractAddress, 
  Ens, 
  Errors, 
  Fee, 
  Filter, 
  Hash, 
  HdKey, 
  Hex, 
  Json, 
  Kzg, 
  Log, 
  Mnemonic, 
  P256, 
  PersonalMessage, 
  Provider, 
  PublicKey, 
  Rlp, 
  RpcRequest, 
  RpcResponse, 
  RpcSchema, 
  RpcTransport, 
  Secp256k1, 
  Signature, 
  Siwe, 
  Solidity, 
  StateOverrides, 
  Transaction, 
  TransactionEnvelope, 
  TransactionEnvelopeEip1559, 
  TransactionEnvelopeEip2930, 
  TransactionEnvelopeEip4844, 
  TransactionEnvelopeEip7702, 
  TransactionEnvelopeLegacy, 
  TransactionReceipt, 
  TransactionRequest, 
  TypedData, 
  ValidatorData, 
  Value, 
  WebAuthnP256, 
  WebCryptoP256, 
  Withdrawal 
} from 'ox'

// Create the main OxEffect layer that provides all services
import { Layer } from 'effect'
import { AddressEffectLayer } from './address/AddressEffect.js'
import { BytesEffectLayer } from './bytes/BytesEffect.js'
import { ErrorsEffectLayer } from './errors/ErrorsEffect.js'
import { HexEffectLayer } from './hex/HexEffect.js'

/**
 * Layer that provides all Ox Effect services
 */
export const OxEffectLayer = Layer.merge(
  AddressEffectLayer,
  BytesEffectLayer,
  ErrorsEffectLayer,
  HexEffectLayer
)