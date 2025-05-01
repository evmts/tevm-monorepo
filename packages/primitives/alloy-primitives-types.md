# Alloy Primitive Types

This document lists all primitive types available in the Alloy library.

## Fixed-Size Types

- `FixedBytes<N>` - Generic fixed-size byte array
- `B160` - 20-byte fixed array (alias for `FixedBytes<20>`)
- `B256` - 32-byte fixed array (commonly used for hashes)
- `Address` - 20-byte Ethereum address
- `Function` - 24-byte function selector
- `Selector` - 4-byte function selector
- `KeccakOutput<32>` - 32-byte Keccak hash output
- `MerkleTreeItem<32>` - 32-byte Merkle tree item

## Integer Types

- `Uint<BITS, LIMBS>` - Generic unsigned integer
- `Signed<BITS, LIMBS>` - Generic signed integer
- `I0` - 0-bit signed integer
- `I1` - 1-bit signed integer
- `BlockNumber` - u64
- `BlockTimestamp` - u64
- `TxNumber` - u64
- `TxNonce` - u64
- `TxIndex` - u64
- `ChainId` - u64

## Hash Types

- `Keccak256` - Keccak-256 hash
- `Bloom<256>` - 256-byte bloom filter

## Transaction Types

- `TxHash` - B256
- `TxKind` - Enum for transaction types

## Storage Types

- `StorageKey` - B256
- `StorageValue` - U256

## Utility Types

- `Bytes` - Dynamic byte array
- `Signature` - Transaction signature
- `Log` - Event log
- `LogData` - Log data structure
- `Sealed<T>` - Generic sealed type with hash
- `Unit` - Unit type for Ethereum units
- `AddressChecksumBuffer` - Buffer for address checksumming
- `BloomInput<'a>` - Input type for bloom filters

## Collection Types

- `FbMap<N, V>` - HashMap with fixed-size byte keys
- `FbHashMap<N, V>` - Alias for FbMap
- `FbSet<N>` - HashSet with fixed-size byte keys
- `FbHashSet<N>` - Alias for FbSet
- `FbIndexMap<N, V>` - IndexMap with fixed-size byte keys
- `FbIndexSet<N>` - IndexSet with fixed-size byte keys
- `HashMap<K, V, S>` - Generic HashMap
- `HashSet<V, S>` - Generic HashSet
- `IndexMap<K, V, S>` - Generic IndexMap
- `IndexSet<V, S>` - Generic IndexSet

## Error Types

- `SignatureError` - Signature-related errors
- `UnitsError` - Unit conversion errors
- `ParseUnits` - Unit parsing errors
- `ParseSignedError` - Signed integer parsing errors
- `BigIntConversionError` - Big integer conversion errors
- `AddressError` - Address-related errors
- `ToSqlError` - SQL serialization errors
- `FromSqlError` - SQL deserialization errors
- `DecimalSeparator` - Enum for decimal separator types

## Helper Types

- `FbBuildHasher<N>` - BuildHasher for fixed-size bytes
- `FbHasher<N>` - Hasher for fixed-size bytes
- `FxBuildHasher` - Fast hash builder
- `DefaultHashBuilder` - Default hash builder
- `DefaultHasher` - Default hasher
- `Sign` - Enum for sign representation

## Type Aliases

- `PrimitiveSignature` - Alias for `Signature`
- `Units` - Alias for `Unit`