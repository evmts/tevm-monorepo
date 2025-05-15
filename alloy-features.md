# Alloy Features Documentation

This document lists alloy features and checks tevm zig code for feature completeness. A revm equivelent will follow.

## What is alloy

Alloy is a collection of core libraries for Ethereum development in Rust. It's a rewrite of `ethers-rs` with better performance, more features, and improved documentation.
This document outlines the key features of Alloy and provides code examples for each.

## Features List

1. **Unsigned Integers** - ✅ Not necessary, Zig supports `u256` natively
2. **Signed Integers** - ✅ Not necessary, Zig supports `i256` natively
3. **Fixed-Size Byte Arrays** - ✅ Using Zig's native arrays
4. **Address Type** - ⚠️ Basic implementation exists, lacks checksumming (Scaffolded in `src/Address/address_formatting.zig`)
5. **Signatures** - 🚧 Implementation scaffolded in `src/Signature/signature.zig`
6. **Static Type Encoding/Decoding** - ⚠️ Basic implementation exists, needs review
7. **Struct Types** - 🚧 Scaffolded in `src/Abi/struct_type.zig`
8. **User-Defined Value Types** - 🚧 Scaffolded in `src/Abi/udt.zig`
9. **Contract Definitions** - 🔄 WIP in our compiler package
10. **Function Calls** - ⚠️ Basic implementation exists, needs review
11. **Events** - ⚠️ Basic implementation exists, needs review
12. **Constructor Calls** - ⚠️ Basic implementation exists, needs review
13. **Dynamic Type Representation** - 🚧 Scaffolded in `src/Abi/dynamic_type.zig`
14. **Dynamic Encoding/Decoding** - 🚧 Scaffolded in `src/Abi/dynamic_type.zig`
15. **Dynamic Token Handling** - 🚧 Scaffolded in `src/Abi/dynamic_type.zig`
16. **JSON ABI Parsing** - 🚧 Scaffolded in `src/Abi/json_abi.zig`
17. **Contract Interface Generation** - 🔄 WIP in compiler package
18. **EIP-712 Typed Data Signing** - 🚧 Scaffolded in `src/Signature/eip712.zig`
19. **EIP-712 Domain Separation** - 🚧 Scaffolded in `src/Signature/eip712.zig`
20. **sol! Macro** - 🚧 TODO: comptime equivalent needed
21. **Solidity Parser** - 🚧 TODO: Wrap solar (Rust)

## Detailed Feature Analysis

### Address Type

Current implementation in `src/Address/address.zig` is very basic:

```zig
pub const Address = [20]u8;
pub const ZERO_ADDRESS: Address = [_]u8{0} ** 20;
pub fn addressFromHex(comptime hex: [42]u8) Address { /* ... */ }
```

Missing features compared to Alloy:

- EIP-55 checksum support
- EIP-1191 chain-specific checksum support
- Methods for formatting and validation
- Runtime hex parsing (not just comptime)

**Scaffolded in**: `src/Address/address_formatting.zig` with the following functions:

- `toChecksum` - Format address with EIP-55 checksums
- `validateChecksum` - Validate address checksums
- `addressFromHexString` - Runtime address parsing
- `addressToString` - Format addresses with options

### Signatures

Scaffolded new implementation in `src/Signature/signature.zig`. This implements:

- Signature structure with r, s components and y_parity
- Methods for creating signatures from various sources
- Conversion to/from raw format and hex strings
- Public key and address recovery
- Message hashing

**Key methods**:

- `fromRsAndYParity` - Create from r, s components and y_parity
- `fromRaw` - Parse from 65-byte raw format
- `asBytes` - Convert to raw bytes
- `recoverPublicKey` and `recoverAddress` - Signature recovery
- `hashMessage` - Create Ethereum-prefixed hashes

### Static Type Encoding/Decoding

Current implementation in `src/Abi/encode_abi_parameters.zig` and `src/Abi/decode_abi_parameters.zig` provides basic functionality.

Need to review for feature parity with Alloy:

- Support for more complex nested types
- Proper tuple handling
- Integrated error handling
- Optimized memory usage

### Struct Types

We need to implement Solidity struct encoding/decoding. This should include:

- Defining struct layouts matching Solidity
- ABI encoding/decoding for structs
- Support for nested structs

**Scaffolded in**: `src/Abi/struct_type.zig` with the following key types:

- `StructType` - Represents a Solidity struct definition
- `Struct` - Runtime instance of a struct
- Methods for ABI encoding/decoding

### User-Defined Value Types

Solidity's user-defined value types (UDTs) are custom types that wrap around a primitive type for type safety. Example in Solidity:

```solidity
type Percentage is uint256;
```

**Scaffolded in**: `src/Abi/udt.zig` with the following key types:

- `UserDefinedType` - Type definition for a UDT
- `UdtValue` - Runtime instance of a UDT value
- Methods for ABI encoding/decoding that delegate to the underlying type

### Dynamic Type Representation

This feature allows handling Solidity types that are only known at runtime (not compile time).

**Scaffolded in**: `src/Abi/dynamic_type.zig` with the `DynamicType` union that can represent:

- Primitives (bool, integers, address)
- Fixed-size and dynamic bytes, strings
- Arrays (fixed and dynamic)
- Tuples and structs
- User-defined types

**Key methods**:

- `fromString` - Parse type from string
- `toString` - Convert back to string representation
- `isCompatible` - Check if a value matches this type

### Dynamic Encoding/Decoding

This enables encoding/decoding of values when the type is only known at runtime.

**Scaffolded in**: `src/Abi/dynamic_type.zig` with the following key components:

- `DynamicValue` - Runtime representation of values
- `encodeDynamic` and `decodeDynamic` functions
- Support for all Solidity types

### Dynamic Token Handling

Low-level representation of ABI values as tokens.

**Scaffolded in**: `src/Abi/dynamic_type.zig` with the `DynamicToken` union:

- Abstraction between values and encoded bytes
- Token creation, manipulation, and conversion
- ABI encoding/decoding at the token level

### JSON ABI Parsing

**Scaffolded in**: `src/Abi/json_abi.zig` with the following key types:

- `JsonAbi` - Complete contract ABI
- `JsonAbiItem` - Single item (function, event, error)
- `JsonAbiParam` - Parameter definition
- Methods for parsing JSON and converting to Solidity interfaces

### EIP-712 Typed Data Signing

Implementation for structured data signing according to EIP-712.

**Scaffolded in**: `src/Signature/eip712.zig` with the following key types:

- `Eip712Domain` - Domain separator fields
- `Eip712Type` - Interface for signable types
- `Eip712Encoder` - Struct encoding for EIP-712
- Methods for calculating hashes and creating/verifying signatures

## TODO List

1. **Address Type**:

   - Implement methods in `src/Address/address_formatting.zig`
   - Add tests for EIP-55 and EIP-1191 checksums
   - Integrate with existing address code

2. **Signatures**:

   - Implement the scaffolded methods in `src/Signature/signature.zig`
   - Add tests for signature functionality
   - Integrate with crypto libraries

3. **Encoding/Decoding**:

   - Review current implementation for feature gaps
   - Add support for more complex nested types
   - Improve tuple handling
   - Add comprehensive tests

4. **Struct Types**:

   - Implement methods in `src/Abi/struct_type.zig`
   - Add tests for struct encoding/decoding
   - Integrate with existing ABI code

5. **User-Defined Value Types**:

   - Implement methods in `src/Abi/udt.zig`
   - Add tests for UDT encoding/decoding
   - Integrate with existing ABI code

6. **Dynamic Types**:

   - Implement methods in `src/Abi/dynamic_type.zig`
   - Add tests for dynamic type handling
   - Ensure compatibility with static encoding/decoding

7. **JSON ABI**:

   - Implement methods in `src/Abi/json_abi.zig`
   - Add tests with real contract ABIs
   - Add integration with compiler

8. **EIP-712**:

   - Implement methods in `src/Signature/eip712.zig`
   - Add tests for typed data signing
   - Integrate with signature code

9. **Comptime Features**:

   - Create comptime equivalent to sol! macro
   - Design API for compile-time Solidity parsing
   - Integrate with compiler package

10. **Solidity Parser**:

- Research solar integration
- Wrap Rust solar parser for Zig use
- Integrate with compiler package
