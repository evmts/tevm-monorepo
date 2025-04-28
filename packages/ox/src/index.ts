// Export all Effect modules
export * from './abi/index.js'
export * from './address/index.js'
export * from './aesGcm/index.js'
export * from './base58/index.js'
export * from './base64/index.js'
export * from './block/index.js'
export * from './bytes/index.js'
export * from './errors/index.js'
export * from './hash/index.js'
export * from './hex/index.js'
export * from './json/index.js'
export * from './kzg/index.js'
export * from './personalMessage/index.js'
export * from './publicKey/index.js'
export * from './rlp/index.js'
export * from './signature/index.js'
export * from './solidity/index.js'
export * from './transaction/index.js'
export * from './transactionReceipt/index.js'
export * from './typedData/index.js'
export * from './value/index.js'

// Create the main OxEffect layer that provides all services
import { Layer } from 'effect'
import { AbiEffectLayer } from './abi/AbiEffect.js'
import { AbiConstructorEffectLayer } from './abi/AbiConstructorEffect.js'
import { AbiItemEffectLayer } from './abi/AbiItemEffect.js'
import { AbiParametersEffectLayer } from './abi/AbiParametersEffect.js'
import { AddressEffectLayer } from './address/AddressEffect.js'
import { AesGcmEffectLayer } from './aesGcm/AesGcmEffect.js'
import { Base58EffectLayer } from './base58/Base58Effect.js'
import { Base64EffectLayer } from './base64/Base64Effect.js'
import { BlockEffectLayer } from './block/BlockEffect.js'
import { BytesEffectLayer } from './bytes/BytesEffect.js'
import { ErrorsEffectLayer } from './errors/ErrorsEffect.js'
import { HashEffectLayer } from './hash/HashEffect.js'
import { HexEffectLayer } from './hex/HexEffect.js'
import { JsonEffectLayer } from './json/JsonEffect.js'
import { KzgEffectLayer } from './kzg/KzgEffect.js'
import { PersonalMessageEffectLayer } from './personalMessage/PersonalMessageEffect.js'
import { PublicKeyEffectLayer } from './publicKey/PublicKeyEffect.js'
import { RlpEffectLayer } from './rlp/RlpEffect.js'
import { SignatureEffectLayer } from './signature/SignatureEffect.js'
import { SolidityEffectLayer } from './solidity/SolidityEffect.js'
import { TransactionEffectLayer } from './transaction/TransactionEffect.js'
import { TransactionReceiptEffectLayer } from './transactionReceipt/TransactionReceiptEffect.js'
import { TypedDataEffectLayer } from './typedData/TypedDataEffect.js'
import { ValueEffectLayer } from './value/ValueEffect.js'

/**
 * Layer that provides all Ox Effect services
 */
export const OxEffectLayer = Layer.merge(
  AbiEffectLayer,
  AbiConstructorEffectLayer,
  AbiItemEffectLayer,
  AbiParametersEffectLayer,
  AddressEffectLayer,
  AesGcmEffectLayer,
  Base58EffectLayer,
  Base64EffectLayer,
  BlockEffectLayer,
  BytesEffectLayer,
  ErrorsEffectLayer,
  HashEffectLayer,
  HexEffectLayer,
  JsonEffectLayer,
  KzgEffectLayer,
  PersonalMessageEffectLayer,
  PublicKeyEffectLayer,
  RlpEffectLayer,
  SignatureEffectLayer,
  SolidityEffectLayer,
  TransactionEffectLayer,
  TransactionReceiptEffectLayer,
  TypedDataEffectLayer,
  ValueEffectLayer
)

// Re-export the original Ox library for convenience
export { Abi, AbiConstructor, AbiError, AbiEvent, AbiFunction, AbiItem, AbiParameters, AccessList, AccountProof, Address, AesGcm, Authorization, Base58, Base64, BinaryStateTree, Blobs, Block, BlockOverrides, Bloom, Bls, BlsPoint, Bytes, Caches, ContractAddress, Ens, Errors, Fee, Filter, Hash, HdKey, Hex, Json, Kzg, Log, Mnemonic, P256, PersonalMessage, Provider, PublicKey, Rlp, RpcRequest, RpcResponse, RpcSchema, RpcTransport, Secp256k1, Signature, Siwe, Solidity, StateOverrides, Transaction, TransactionEnvelope, TransactionEnvelopeEip1559, TransactionEnvelopeEip2930, TransactionEnvelopeEip4844, TransactionEnvelopeEip7702, TransactionEnvelopeLegacy, TransactionReceipt, TransactionRequest, TypedData, ValidatorData, Value, WebAuthnP256, WebCryptoP256, Withdrawal } from 'ox'