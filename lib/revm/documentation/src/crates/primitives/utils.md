# Utilities

This Rust module provides utility functions and constants for handling Keccak hashing (used in Ethereum) and creating Ethereum addresses via legacy and `CREATE2` methods. It also includes serialization and deserialization methods for hexadecimal strings representing byte arrays.

The `KECCAK_EMPTY` constant represents the Keccak-256 hash of an empty input.

The `keccak256` function takes a byte slice input and returns its Keccak-256 hash as a `B256` value.

`create_address` function implements the address calculation for the Ethereum `CREATE` operation. It takes as parameters the address of the caller (`caller`) and a nonce (`nonce`). The function serializes these inputs using Recursive Length Prefix (RLP) encoding, calculates the Keccak-256 hash of the result, and returns the last 20 bytes of this hash as the created address.

`create2_address` function implements the address calculation for the Ethereum `CREATE2` operation. It takes as parameters the address of the caller (`caller`), a hash of the initializing code (`code_hash`), and a "salt" value (`salt`). The function hashes these inputs together in a specific way, as per the Ethereum `CREATE2` rules, and returns the last 20 bytes of the result as the created address.

The `serde_hex_bytes` module includes helper functions for serialization and deserialization of hexadecimal strings representing byte arrays. These functions will be used if the "serde" feature flag is enabled. serialize `function` converts a byte array into a hexadecimal string, while `deserialize` function does the reverse, converting a hexadecimal string back into a byte array.
