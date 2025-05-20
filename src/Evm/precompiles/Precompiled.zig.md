# Precompiled Contracts Implementation Comparison

This document compares the implementation of precompiled contracts across different Ethereum VM implementations: Tevm (Zig), go-ethereum, revm (Rust), and evmone (C++).

## Overview

Precompiled contracts are special native implementations of cryptographic and mathematical operations that would be prohibitively expensive to execute as EVM bytecode. They are located at predefined addresses (starting at 0x01) and implement functionality like:

- Cryptographic operations (ECRECOVER, SHA256, RIPEMD160)
- Mathematical functions (ModExp)
- Elliptic curve operations (BN256 Add/Mul/Pairing)
- Specialized hash functions (BLAKE2F)
- Identity function (data copy)

Each implementation takes a different approach to organizing these contracts, handling gas costs, and integrating with the rest of the EVM architecture.

## Tevm (Zig) Implementation

The Tevm implementation in Zig is organized in a clean, modular structure with clear separation between contract specification and execution.

### Organization

The Tevm implementation is split across multiple files:
- `precompile/Precompiles.zig`: Main contract registry and registry creation by hardfork
- `precompile/crypto.zig`: Cryptographic precompiled contracts (ECRECOVER, SHA256, etc.)
- `precompile/math.zig`: Mathematical operations (ModExp)
- `precompile/common.zig`: Common utilities and data copy contract
- `precompile/bls12_381.zig`: BLS12-381 curve operations (for Prague hardfork)
- `precompile/kzg.zig`: KZG point evaluation (for Cancun hardfork)

Additionally, there's a secondary implementation in `precompiles/Precompiled.zig` that provides an alternative approach using an enum-based structure.

### Contract Interface

```zig
pub const PrecompiledContract = struct {
    // Calculate required gas for execution
    requiredGas: fn (input: []const u8) u64,
    
    // Execute the precompiled contract
    run: fn (input: []const u8, allocator: std.mem.Allocator) anyerror!?[]u8,
};
```

### Registry By Hardfork

The Tevm implementation explicitly builds contract registries for each hardfork:

```zig
pub fn homesteadContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = PrecompiledContracts.init(allocator);
    
    // Address 0x01: ECRECOVER
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x01}), &crypto.ECRecover);
    
    // Address 0x02: SHA256
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x02}), &crypto.SHA256Hash);
    
    // Address 0x03: RIPEMD160
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x03}), &crypto.RIPEMD160Hash);
    
    // Address 0x04: IDENTITY (data copy)
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x04}), &common.DataCopy);
    
    return contracts;
}
```

Each subsequent hardfork builds upon the previous one, adding or replacing contracts as needed:

```zig
pub fn byzantiumContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try homesteadContracts(allocator);
    
    // Add Byzantium contracts...
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x05}), &math.BigModExp);
    // ...
    
    return contracts;
}
```

### Gas Calculation

Gas costs are clearly defined in separate functions for each contract type:

```zig
fn sha256RequiredGas(input: []const u8) u64 {
    return (@as(u64, input.len) + 31) / 32 * params.Sha256PerWordGas + params.Sha256BaseGas;
}
```

### Documentation and Testing

The Tevm implementation features:
- Comprehensive comments explaining contract behavior
- Clear markers for placeholder implementations vs. complete ones
- Unit tests for functionality validation
- Logging for debugging and tracing

### Error Handling

```zig
pub fn runPrecompiledContract(
    contract: *const PrecompiledContract, 
    input: []const u8, 
    gas: u64,
    allocator: std.mem.Allocator,
    logger_opt: ?*EvmLogger
) !struct { output: ?[]u8, remaining_gas: u64 } {
    // Calculate gas required
    const required_gas = contract.requiredGas(input);
    
    // Check if we have enough gas
    if (gas < required_gas) {
        logger.err("Not enough gas for precompiled contract", .{});
        return error.OutOfGas;
    }
    
    // Use gas and run contract
    const remaining_gas = gas - required_gas;
    const output = try contract.run(input, allocator);
    
    return .{ .output = output, .remaining_gas = remaining_gas };
}
```

## go-ethereum Implementation

The go-ethereum implementation is a comprehensive reference implementation with optimized execution for production use.

### Organization

go-ethereum organizes precompiled contracts into:
- `core/vm/contracts.go`: Main contract definitions and registry
- `core/vm/runtime/precompiled.go`: Contract execution integration
- Separate files for complex implementations (e.g., bn256, blake2f)

### Contract Interface

```go
type PrecompiledContract interface {
    // RequiredGas calculates the gas for execution
    RequiredGas(input []byte) uint64
    
    // Run executes the precompiled contract
    Run(input []byte, caller common.Address, evm *EVM, gas uint64) ([]byte, uint64, error)
}
```

### Registry By Hardfork

In go-ethereum, contract availability is checked dynamically based on the chain configuration:

```go
func (p *PrecompiledContracts) Get(addr common.Address, blockNumber *big.Int) PrecompiledContract {
    switch addr {
    case ecrecover:
        return &ecRecoverContract{}
    case sha256hash:
        return &sha256Contract{}
    // ...
    case bls12381G1Add:
        if blockNumber.Cmp(p.config.ParisBlock) >= 0 {
            return &bls12381G1AddContract{}
        }
    // ...
    }
    return nil
}
```

### Gas Calculation

Gas costs are implemented as methods on contract structs:

```go
func (c *sha256Contract) RequiredGas(input []byte) uint64 {
    return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}
```

### Error Handling

go-ethereum uses a combination of explicit errors and panic/recover for gas handling:

```go
func (c *ecRecoverContract) Run(input []byte, caller common.Address, evm *EVM, gas uint64) ([]byte, uint64, error) {
    gas -= c.RequiredGas(input)
    if gas > params.MaxUint64-c.RequiredGas(input) {
        return nil, 0, vmerrs.ErrOutOfGas
    }
    
    // Execute contract...
    
    return result, gas, nil
}
```

## revm (Rust) Implementation

The revm implementation focuses on performance and follows Rust's trait-based design patterns.

### Organization

revm organizes precompiled contracts using:
- `crates/precompile/src/lib.rs`: Main precompile definitions
- Submodules for specific implementations (e.g., `identity`, `ecrecover`)
- Trait-based design that follows Rust conventions

### Contract Interface

```rust
pub trait Precompile {
    // Returns gas cost for execution
    fn required_gas(input: &[u8]) -> Result<u64, PrecompileError>;
    
    // Executes the precompiled contract
    fn run(input: &[u8], gas_limit: u64) -> Result<(Vec<u8>, u64), PrecompileError>;
}
```

### Registry By Hardfork

revm uses a specialized builder pattern to construct the precompile set:

```rust
pub fn new_london() -> PrecompileSetBuilder {
    let mut precompiles = BTreeMap::new();
    
    // Register Homestead precompiles
    precompiles.insert(address(1), ecrecover::ECRECOVER);
    precompiles.insert(address(2), hash::SHA256);
    precompiles.insert(address(3), hash::RIPEMD160);
    precompiles.insert(address(4), identity::IDENTITY);
    
    // Register Byzantium precompiles
    precompiles.insert(address(5), modexp::MODEXP);
    // ...
    
    PrecompileSetBuilder { precompiles }
}
```

### Gas Calculation

Gas calculation follows a functional approach with comprehensive input validation:

```rust
pub fn required_gas(input: &[u8]) -> Result<u64, PrecompileError> {
    let input_len = input.len() as u64;
    Ok(params::SHA256_BASE + params::SHA256_PER_WORD * ((input_len + 31) / 32))
}
```

### Error Handling

revm uses Rust's Result type for comprehensive error handling:

```rust
pub fn run(input: &[u8], gas_limit: u64) -> Result<(Vec<u8>, u64), PrecompileError> {
    let gas_used = required_gas(input)?;
    if gas_used > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }
    
    // Execute contract...
    
    Ok((result, gas_limit - gas_used))
}
```

## evmone (C++) Implementation

The evmone implementation focuses on raw performance with minimal abstractions.

### Organization

evmone organizes precompiled contracts using:
- `lib/evmone/precompiles.hpp`: Main header with contract definitions
- `lib/evmone/precompiles.cpp`: Implementation of precompiled contracts
- Specialized headers for complex operations (e.g., `keccak.hpp`, `blake2b.hpp`)

### Contract Interface

```cpp
// Function pointer type for precompiled contract execution
using PrecompileExecutor = evmc_result (*)(const evmc_message& msg, 
                                          size_t input_size,
                                          const uint8_t* input_data);

// Registry mapping addresses to executors
struct Precompiles {
    std::array<PrecompileExecutor, 9> executors;
};
```

### Registry By Hardfork

evmone uses a more static approach with function tables based on the revision:

```cpp
Precompiles get_precompiles(evmc_revision rev) noexcept {
    Precompiles precompiles{};
    
    // Always available precompiles
    precompiles.executors[0] = ecrecover_execute;
    precompiles.executors[1] = sha256_execute;
    precompiles.executors[2] = ripemd160_execute;
    precompiles.executors[3] = identity_execute;
    
    // Add precompiles based on revision
    if (rev >= EVMC_BYZANTIUM) {
        precompiles.executors[4] = modexp_execute;
        // ...
    }
    
    return precompiles;
}
```

### Gas Calculation

Gas calculation is often integrated directly into the execution function:

```cpp
evmc_result sha256_execute(const evmc_message& msg, size_t input_size, 
                           const uint8_t* input_data) noexcept {
    const auto gas_cost = 60 + 12 * ((input_size + 31) / 32);
    
    if (msg.gas < gas_cost)
        return {EVMC_OUT_OF_GAS, msg.gas, nullptr, 0};
    
    // Execute contract...
    
    return {EVMC_SUCCESS, msg.gas - gas_cost, output_data, output_size};
}
```

### Error Handling

evmone uses status codes for error reporting:

```cpp
evmc_result ecrecover_execute(const evmc_message& msg, size_t input_size, 
                             const uint8_t* input_data) noexcept {
    if (msg.gas < 3000)
        return {EVMC_OUT_OF_GAS, msg.gas, nullptr, 0};
    
    // Execute contract with error checking
    if (input_size < 128)
        return {EVMC_SUCCESS, msg.gas - 3000, nullptr, 0};
    
    // Continue execution...
}
```

## Gas Cost Comparison

The gas costs for precompiled contracts are standardized across implementations, but with variations by hardfork:

| Precompiled Contract | Address | Homestead | Byzantium | Istanbul | Berlin | Cancun | Prague |
|---------------------|---------|-----------|-----------|----------|--------|--------|--------|
| ECRECOVER | 0x01 | 3000 | 3000 | 3000 | 3000 | 3000 | 3000 |
| SHA256 | 0x02 | 60+12*(len+31)/32 | Same | Same | Same | Same | Same |
| RIPEMD160 | 0x03 | 600+120*(len+31)/32 | Same | Same | Same | Same | Same |
| IDENTITY | 0x04 | 15+3*(len+31)/32 | Same | Same | Same | Same | Same |
| MODEXP | 0x05 | N/A | Complex formula | Same | EIP-2565 formula | Same | Same |
| BN256_ADD | 0x06 | N/A | 500 | 150 | 150 | 150 | 150 |
| BN256_MUL | 0x07 | N/A | 40000 | 6000 | 6000 | 6000 | 6000 |
| BN256_PAIRING | 0x08 | N/A | 100000+80000*k | 45000+34000*k | Same | Same | Same |
| BLAKE2F | 0x09 | N/A | N/A | [rounds] | Same | Same | Same |
| KZG_POINT_EVAL | 0x0a | N/A | N/A | N/A | N/A | 50000 | 50000 |
| BLS12_381_G1_ADD | 0x0b | N/A | N/A | N/A | N/A | N/A | 500 |
| BLS12_381_G1_MUL | 0x0c | N/A | N/A | N/A | N/A | N/A | 12000 |
| BLS12_381_G2_ADD | 0x0d | N/A | N/A | N/A | N/A | N/A | 800 |
| BLS12_381_G2_MUL | 0x0e | N/A | N/A | N/A | N/A | N/A | 55000 |
| BLS12_381_PAIRING | 0x0f | N/A | N/A | N/A | N/A | N/A | 115000*k |
| BLS12_381_MAP_G1 | 0x10 | N/A | N/A | N/A | N/A | N/A | 5500 |
| BLS12_381_MAP_G2 | 0x11 | N/A | N/A | N/A | N/A | N/A | 110000 |

Note: *k* represents the number of pairs (for pairing operations)

## Cryptographic Implementation Approaches

Each implementation takes a different approach to implementing the cryptographic operations:

### Tevm (Zig)

- Relies on Zig's standard library for basic cryptography (SHA256)
- Uses placeholders for more complex operations with TODOs for full implementation
- Provides a clean interface for future complete implementation

```zig
fn sha256Run(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    var hash: [Sha256.digest_length]u8 = undefined;
    Sha256.hash(input, &hash, .{});
    
    var result = try allocator.alloc(u8, hash.len);
    @memcpy(result, &hash);
    
    return result;
}
```

### go-ethereum

- Implements full production-ready cryptography
- Uses optimized libraries for ECC operations (e.g., bn256)
- Includes careful input validation and edge case handling
- Some operations implemented in assembly for performance

```go
func (c *sha256Contract) Run(input []byte, caller common.Address, evm *EVM, gas uint64) ([]byte, uint64, error) {
    gas -= c.RequiredGas(input)
    h := sha256.Sum256(input)
    return h[:], gas, nil
}
```

### revm (Rust)

- Leverages Rust's strong cryptography ecosystem
- Uses specialized crates for operations (k256, sha2, etc.)
- Provides comprehensive error handling
- Optimized implementations with performance focus

```rust
pub fn run(input: &[u8], gas_limit: u64) -> Result<(Vec<u8>, u64), PrecompileError> {
    let gas_cost = required_gas(input)?;
    if gas_cost > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }
    
    let mut hasher = Sha256::new();
    hasher.update(input);
    let mut output = vec![0; 32];
    output.copy_from_slice(&hasher.finalize());
    
    Ok((output, gas_limit - gas_cost))
}
```

### evmone (C++)

- Focuses on minimal, high-performance implementations
- Uses optimized C/C++ libraries where available
- Often includes direct, low-level implementations
- Emphasizes runtime performance over abstraction

```cpp
evmc_result sha256_execute(const evmc_message& msg, size_t input_size, 
                          const uint8_t* input_data) noexcept {
    const auto gas_cost = 60 + 12 * ((input_size + 31) / 32);
    if (msg.gas < gas_cost)
        return {EVMC_OUT_OF_GAS, msg.gas, nullptr, 0};
    
    uint8_t output[32];
    sha256(input_data, input_size, output);
    
    auto result = evmc_result{EVMC_SUCCESS, msg.gas - gas_cost, nullptr, 0};
    result.output_data = copy_output(output, sizeof(output), result.output_size);
    return result;
}
```

## Design Choices and Trade-offs

Each implementation makes different trade-offs in their design:

### Tevm (Zig)

- **Design Philosophy**: Clean, well-documented code with clear abstractions
- **Strengths**: Modular design, detailed documentation, hardfork-specific organization
- **Trade-offs**: Some functionality implemented as placeholders, less optimization
- **Unique Aspects**: Separate contract definitions by hardfork, dual implementation approaches

### go-ethereum

- **Design Philosophy**: Complete production implementation with optimization
- **Strengths**: Comprehensive implementation, battle-tested in production
- **Trade-offs**: More complex code structure with deeper coupling to EVM
- **Unique Aspects**: Optimized implementations with assembly for critical operations

### revm (Rust)

- **Design Philosophy**: Performance with modern Rust idioms and strong typing
- **Strengths**: Clear trait-based design, strong error handling, performance focus
- **Trade-offs**: More complex abstractions with trait hierarchies
- **Unique Aspects**: Builder pattern for precompile sets, comprehensive testing

### evmone (C++)

- **Design Philosophy**: Maximum performance with minimal abstractions
- **Strengths**: Highly optimized for execution speed, function-based approach
- **Trade-offs**: Less emphasis on modular design, more focus on raw performance
- **Unique Aspects**: Static function tables, direct low-level implementations

## State and Memory Management

The implementations differ in how they manage memory for inputs and outputs:

### Tevm (Zig)

- Uses Zig's allocator pattern for memory management
- Explicit allocation and deallocation of result memory
- Clear ownership semantics for resource management

```zig
fn identity(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    const result = try allocator.alloc(u8, input.len);
    @memcpy(result, input);
    return result;
}
```

### go-ethereum

- Uses Go's garbage collector for memory management
- Relies on slices for data handling
- Memory allocation hidden in standard library functions

```go
func (c *identityContract) Run(input []byte, caller common.Address, evm *EVM, gas uint64) ([]byte, uint64, error) {
    gas -= c.RequiredGas(input)
    // Make a copy of the input data
    return common.CopyBytes(input), gas, nil
}
```

### revm (Rust)

- Uses Rust's ownership model for memory safety
- Leverages Vec<u8> for dynamic buffer management
- Clear lifetime management with Rust's borrow checker

```rust
pub fn run(input: &[u8], gas_limit: u64) -> Result<(Vec<u8>, u64), PrecompileError> {
    let gas_cost = required_gas(input)?;
    if gas_cost > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }
    
    // Copy input to output
    let output = input.to_vec();
    
    Ok((output, gas_limit - gas_cost))
}
```

### evmone (C++)

- Uses custom memory management with explicit allocation
- Often works directly with raw pointers
- Careful manual memory handling for performance

```cpp
evmc_result identity_execute(const evmc_message& msg, size_t input_size, 
                           const uint8_t* input_data) noexcept {
    const auto gas_cost = 15 + 3 * ((input_size + 31) / 32);
    if (msg.gas < gas_cost)
        return {EVMC_OUT_OF_GAS, msg.gas, nullptr, 0};
    
    auto result = evmc_result{EVMC_SUCCESS, msg.gas - gas_cost, nullptr, 0};
    result.output_data = copy_output(input_data, input_size, result.output_size);
    return result;
}
```

## Conclusions

The precompiled contract implementations across the four codebases highlight their different design philosophies:

1. **Tevm (Zig)** offers a clean, well-documented approach with explicit organization by hardfork. It provides a solid foundation for further development, though some complex cryptographic operations are currently implemented as placeholders.

2. **go-ethereum** provides a comprehensive, optimized implementation suitable for production environments. It includes full cryptographic operations with performance optimizations, though with more complex code structure.

3. **revm (Rust)** emphasizes performance with modern design patterns, leveraging Rust's type system and ownership model. It offers excellent error handling and a trait-based design that facilitates extensibility.

4. **evmone (C++)** focuses on raw performance with minimal abstractions, using direct memory access and optimized cryptographic implementations. It prioritizes execution speed over design abstraction.

All implementations follow the standardized gas costs and basic functionality requirements, ensuring compatibility across the Ethereum ecosystem while reflecting the unique characteristics and priorities of their respective languages and design philosophies.