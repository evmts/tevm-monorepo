# EVM Gas Calculation Rules

This document provides a comprehensive guide to gas calculation rules for all EVM opcodes, following the Ethereum Yellow Paper specifications.

## Table of Contents

1. [Overview](#overview)
2. [Base Gas Costs](#base-gas-costs)
3. [Dynamic Gas Calculations](#dynamic-gas-calculations)
4. [Memory Expansion](#memory-expansion)
5. [Storage Operations](#storage-operations)
6. [Call Operations](#call-operations)
7. [Create Operations](#create-operations)
8. [Copy Operations](#copy-operations)
9. [Hardfork-Specific Changes](#hardfork-specific-changes)
10. [Access Lists (EIP-2929)](#access-lists-eip-2929)

## Overview

Gas costs in the EVM serve two purposes:
1. **Resource Metering**: Fairly price computational resources
2. **DoS Prevention**: Prevent infinite loops and resource exhaustion

Gas costs consist of:
- **Base Cost**: Fixed cost for opcode execution
- **Dynamic Cost**: Variable cost based on operation parameters

## Base Gas Costs

Base gas costs are defined in `gas_constants.zig`:

```zig
// Gas cost groups
pub const GasQuickStep = 2;      // Cheapest operations
pub const GasFastestStep = 3;    // Very fast operations
pub const GasFastStep = 5;       // Fast operations
pub const GasMidStep = 8;        // Medium operations
pub const GasSlowStep = 10;      // Slow operations
pub const GasExtStep = 20;       // External operations

// Specific base costs
pub const GasBalance = 0;        // 0 in Berlin+ (dynamic cost added)
pub const GasSload = 0;          // 0 in Berlin+ (dynamic cost added)
pub const GasSha3 = 30;         // Base SHA3 cost
pub const GasCreate = 32000;    // CREATE base cost
pub const GasCall = 0;          // 0 in Berlin+ (dynamic cost added)
pub const GasCallValue = 9000;  // Additional for non-zero value
pub const GasCallStipend = 2300; // Stipend for called contract
pub const GasNewAccount = 25000; // Creating new account
pub const GasLog = 375;         // Base LOG cost
pub const GasLogTopic = 375;    // Per topic cost
pub const GasLogData = 8;       // Per byte of data
pub const GasExp = 10;          // Base EXP cost
pub const GasExpByte = 50;      // Per byte of exponent
pub const GasSelfDestruct = 5000; // Base SELFDESTRUCT
```

## Dynamic Gas Calculations

### Arithmetic Operations

Most arithmetic operations have fixed costs, except:

#### EXP (Exponentiation)
```zig
gas_cost = 10 + 50 * byte_size_of_exponent

// Example:
// 2^8: gas = 10 + 50 * 1 = 60
// 2^256: gas = 10 + 50 * 32 = 1610
```

### Bitwise Operations

All bitwise operations have fixed costs except:

#### BYTE
```zig
gas_cost = 3  // Fixed cost
```

## Memory Expansion

Memory expansion follows a quadratic cost formula:

```zig
pub fn memory_gas_cost(memory_size: u64) u64 {
    const memory_size_word = (memory_size + 31) / 32;
    const memory_cost = (memory_size_word * memory_size_word) / 512 + (3 * memory_size_word);
    return memory_cost;
}

// When memory expands:
additional_cost = new_memory_cost - current_memory_cost
```

### Operations That Expand Memory

1. **MLOAD/MSTORE/MSTORE8**: Expand to `offset + 32`
2. **CALLDATACOPY/CODECOPY/RETURNDATACOPY**: Expand to `dest_offset + size`
3. **EXTCODECOPY**: Expand to `dest_offset + size`
4. **CALL/DELEGATECALL/STATICCALL**: Expand for both input and output regions
5. **CREATE/CREATE2**: Expand to `offset + size`
6. **RETURN/REVERT**: Expand to `offset + size`
7. **LOG0-LOG4**: Expand to `offset + size`
8. **SHA3**: Expand to `offset + size`
9. **MCOPY**: Expand to `max(dest_offset + size, src_offset + size)`

### Memory Expansion Examples

```zig
// First 32 bytes (1 word)
cost = 3 * 1 + 1²/512 = 3 gas

// First 64 bytes (2 words)
cost = 3 * 2 + 2²/512 = 6 gas

// First 1024 bytes (32 words)
cost = 3 * 32 + 32²/512 = 96 + 2 = 98 gas
```

## Storage Operations

### SLOAD (Storage Load)

```zig
// Pre-Berlin
gas_cost = 800  // Istanbul
gas_cost = 200  // Tangerine Whistle
gas_cost = 50   // Frontier

// Berlin+ with access lists
if (is_cold_access) {
    gas_cost = 2100;  // First access (cold)
} else {
    gas_cost = 100;   // Subsequent access (warm)
}
```

### SSTORE (Storage Store)

SSTORE has complex gas calculation based on current and new values:

```zig
// Simplified Berlin+ rules
if (is_cold_access) {
    gas_cost += 2100;  // Cold access surcharge
}

if (current_value == new_value) {
    // No-op
    gas_cost += 100;  // Warm storage read
} else if (current_value == 0 && new_value != 0) {
    // Storage addition
    gas_cost += 20000;
} else if (current_value != 0 && new_value == 0) {
    // Storage deletion (with refund)
    gas_cost += 5000;
    // Refund up to 19900 (20000 - 100)
} else {
    // Storage modification
    gas_cost += 5000;
}
```

### Transient Storage (EIP-1153)

```zig
// TLOAD
gas_cost = 100;

// TSTORE
gas_cost = 100;
```

## Call Operations

### CALL/CALLCODE

```zig
base_cost = 0;  // Berlin+ (was 700)

// Cold address access (Berlin+)
if (is_cold_address) {
    base_cost += 2600;
}

// Value transfer
if (value > 0) {
    base_cost += 9000;  // CallValueTransferGas
    
    // New account creation
    if (destination_balance == 0) {
        base_cost += 25000;  // CallNewAccountGas
    }
}

// Memory expansion for input/output
base_cost += memory_expansion_cost;

// Gas given to called contract
gas_given = min(requested_gas, available_gas * 63 / 64);
if (value > 0) {
    gas_given += 2300;  // CallStipend
}

total_cost = base_cost + gas_given;
```

### DELEGATECALL/STATICCALL

```zig
base_cost = 0;  // Berlin+ (was 700)

// Cold address access (Berlin+)
if (is_cold_address) {
    base_cost += 2600;
}

// Memory expansion for input/output
base_cost += memory_expansion_cost;

// Gas given to called contract (no stipend)
gas_given = min(requested_gas, available_gas * 63 / 64);

total_cost = base_cost + gas_given;
```

## Create Operations

### CREATE

```zig
base_cost = 32000;  // CreateGas

// Memory expansion for init code
base_cost += memory_expansion_cost;

// Init code cost (200 per byte)
base_cost += init_code_size * 200;

// Gas given to initialization
gas_given = available_gas * 63 / 64;

total_cost = base_cost + gas_given;
```

### CREATE2

```zig
base_cost = 32000;  // CreateGas

// Memory expansion for init code
base_cost += memory_expansion_cost;

// Init code cost (200 per byte)
base_cost += init_code_size * 200;

// Hashing cost for address calculation (6 per word)
hash_cost = 6 * ((init_code_size + 31) / 32);
base_cost += hash_cost;

// Gas given to initialization
gas_given = available_gas * 63 / 64;

total_cost = base_cost + gas_given;
```

## Copy Operations

All copy operations follow similar patterns:

```zig
// Base cost
base_cost = 3;

// Copy cost (3 per word)
copy_cost = 3 * ((size + 31) / 32);

// Memory expansion
memory_cost = memory_expansion_cost;

total_cost = base_cost + copy_cost + memory_cost;
```

### Specific Copy Operations

- **CALLDATACOPY**: Copy from calldata to memory
- **CODECOPY**: Copy from code to memory
- **EXTCODECOPY**: Copy from external contract code (+ cold access cost)
- **RETURNDATACOPY**: Copy from return data buffer
- **MCOPY**: Copy within memory (Cancun+)

## Hardfork-Specific Changes

### Tangerine Whistle (EIP-150)
Increased costs for IO-heavy operations:
- BALANCE: 20 → 400
- EXTCODESIZE: 20 → 700
- EXTCODECOPY: 20 → 700
- SLOAD: 50 → 200
- CALL/CALLCODE/DELEGATECALL: 40 → 700
- SELFDESTRUCT: 0 → 5000

### Istanbul (EIP-1884)
Further adjustments:
- BALANCE: 400 → 700
- SLOAD: 200 → 800

### Berlin (EIP-2929)
Introduced access lists:
- Base costs set to 0 for state access operations
- Cold access surcharges: 2600 (address), 2100 (storage)
- Warm access: 100

## Access Lists (EIP-2929)

### Cold/Warm Tracking

Operations that access addresses or storage slots:

#### Address Access (2600 cold, 100 warm)
- BALANCE
- EXTCODESIZE
- EXTCODECOPY
- EXTCODEHASH
- CALL/CALLCODE/DELEGATECALL/STATICCALL (target)
- SELFDESTRUCT (beneficiary)

#### Storage Access (2100 cold, 100 warm)
- SLOAD
- SSTORE

### Pre-warming

Addresses/slots can be pre-warmed by:
1. Transaction access list (EIP-2930)
2. Being accessed earlier in the same transaction
3. Special addresses (origin, coinbase, precompiles)

## SHA3 (KECCAK256)

```zig
base_cost = 30;

// 6 gas per word of data
word_cost = 6 * ((data_size + 31) / 32);

// Memory expansion
memory_cost = memory_expansion_cost;

total_cost = base_cost + word_cost + memory_cost;
```

## LOG Operations

```zig
// LOG0 to LOG4
base_cost = 375;

// Per topic (n = 0 to 4)
topic_cost = 375 * n;

// Per byte of data
data_cost = 8 * data_size;

// Memory expansion
memory_cost = memory_expansion_cost;

total_cost = base_cost + topic_cost + data_cost + memory_cost;
```

## SELFDESTRUCT

```zig
base_cost = 5000;  // Since Tangerine Whistle

// Cold beneficiary (Berlin+)
if (is_cold_address(beneficiary)) {
    base_cost += 2600;
}

// New account creation (if sending value)
if (balance > 0 && beneficiary_balance == 0) {
    base_cost += 25000;
}

total_cost = base_cost;
```

## Gas Calculation Best Practices

1. **Calculate Before Execute**: Always calculate gas before making state changes
2. **Check Gas Availability**: Ensure sufficient gas before expensive operations
3. **Memory Expansion**: Calculate memory costs before accessing high offsets
4. **Access Lists**: Track cold/warm access throughout transaction
5. **Overflow Protection**: Handle arithmetic overflow in gas calculations
6. **Atomic Operations**: Ensure gas consumption and effects are atomic

## Common Gas Calculation Patterns

```zig
// Pattern 1: Operation with memory expansion
pub fn op_with_memory(frame: *Frame, offset: u256, size: u256) !void {
    // Calculate memory expansion first
    const mem_cost = try frame.memory.expansionCost(offset + size);
    try frame.gas.consume(base_gas + mem_cost);
    
    // Then perform operation
    // ...
}

// Pattern 2: Operation with cold/warm access
pub fn op_with_access(vm: *VM, frame: *Frame, address: Address) !void {
    var gas_cost = base_gas;
    
    if (vm.is_address_cold(address)) {
        gas_cost += ColdAccountAccessCost;
        try vm.mark_address_warm(address);
    } else {
        gas_cost += WarmStorageReadCost;
    }
    
    try frame.gas.consume(gas_cost);
    // ...
}

// Pattern 3: Operation with dynamic cost
pub fn op_with_dynamic(frame: *Frame, data_size: u64) !void {
    const word_size = (data_size + 31) / 32;
    const dynamic_cost = word_size * cost_per_word;
    
    try frame.gas.consume(base_gas + dynamic_cost);
    // ...
}
```

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-1884: Repricing opcodes](https://eips.ethereum.org/EIPS/eip-1884)
- [EIP-2929: Gas cost for state access](https://eips.ethereum.org/EIPS/eip-2929)
- [EIP-1153: Transient storage](https://eips.ethereum.org/EIPS/eip-1153)