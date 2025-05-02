# Alloy Primitive Types

This document lists all primitive types available in the Alloy library.

## Fixed-Size Types

- ✅ `FixedBytes<N>` - Generic fixed-size byte array
- ✅ `B160` - 20-byte fixed array (alias for `FixedBytes<20>`)
- ✅ `B256` - 32-byte fixed array (commonly used for hashes)
- ✅ `Address` - 20-byte Ethereum address
- ✅ `Function` - 24-byte function selector
- ✅ `Selector` - 4-byte function selector
- ✅ `KeccakOutput<32>` - 32-byte Keccak hash output
- ✅ `MerkleTreeItem<32>` - 32-byte Merkle tree item

## Integer Types

- ✅ `Uint<BITS, LIMBS>` - Generic unsigned integer
- ✅ `Signed<BITS, LIMBS>` - Generic signed integer
- ✅ `I0` - 0-bit signed integer
- ✅ `I1` - 1-bit signed integer
- ✅ `BlockNumber` - u64
- ✅ `BlockTimestamp` - u64
- ✅ `TxNumber` - u64
- ✅ `TxNonce` - u64
- ✅ `TxIndex` - u64
- ✅ `ChainId` - u64

## Hash Types

- ✅ `Keccak256` - Keccak-256 hash
- ✅ `Bloom<256>` - 256-byte bloom filter

## Transaction Types

- ✅ `TxHash` - B256
- ✅ `TxKind` - Enum for transaction types

## Storage Types

- ✅ `StorageKey` - B256
- ✅ `StorageValue` - U256

## Utility Types

- ✅ `Bytes` - Dynamic byte array (provided by ox)
- ✅ `Signature` - Transaction signature
- ✅ `Log` - Event log (provided via logs in Bloom.ts)
- ✅ `LogData` - Log data structure (provided via logs in Bloom.ts)
- ⚠️ `Sealed<T>` - Generic sealed type with hash (not implemented - would require more complex TypeScript)
- ⚠️ `Unit` - Unit type for Ethereum units (not implemented - would require more specific use case)
- ⚠️ `AddressChecksumBuffer` - Buffer for address checksumming (not needed - using viem's functions)
- ✅ `BloomInput<'a>` - Input type for bloom filters

## Collection Types

- ⚠️ `FbMap<N, V>` - HashMap with fixed-size byte keys (not implemented - use Map<B160/B256, V> for similar functionality)
- ⚠️ `FbHashMap<N, V>` - Alias for FbMap (not implemented)
- ⚠️ `FbSet<N>` - HashSet with fixed-size byte keys (not implemented - use Set<B160/B256> for similar functionality)
- ⚠️ `FbHashSet<N>` - Alias for FbSet (not implemented)
- ⚠️ `FbIndexMap<N, V>` - IndexMap with fixed-size byte keys (not implemented)
- ⚠️ `FbIndexSet<N>` - IndexSet with fixed-size byte keys (not implemented)
- ⚠️ `HashMap<K, V, S>` - Generic HashMap (not implemented - use JavaScript Map)
- ⚠️ `HashSet<V, S>` - Generic HashSet (not implemented - use JavaScript Set)
- ⚠️ `IndexMap<K, V, S>` - Generic IndexMap (not implemented)
- ⚠️ `IndexSet<V, S>` - Generic IndexSet (not implemented)

## Error Types

- ✅ `SignatureError` - Signature-related errors (implemented as part of Signature.ts)
- ⚠️ Other error types are not implemented as they're typically replaced by TypeScript/JavaScript Error objects

## Helper Types

- ⚠️ Collection-related helper types not implemented
- ✅ `Sign` - Enum for sign representation (implemented in Signed.ts)

## Type Aliases

- ✅ `PrimitiveSignature` - Alias for `Signature` (implemented in Signature.ts)
- ⚠️ `Units` - Alias for `Unit` (not implemented)