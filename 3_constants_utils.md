# EVM Constants and Utilities Module

## Overview
Create a centralized constants and utilities module for the EVM implementation. This module will contain all EVM-related constants, limits, gas costs, and utility functions that are used throughout the codebase.

## Motivation
Currently, constants and utility functions are scattered across multiple files in the EVM implementation. This creates several issues:
- Duplicate definitions of the same constants
- Difficulty maintaining consistency across the codebase
- Potential circular dependency issues
- Harder to verify compliance with EVM specifications

By centralizing these in a dedicated module, we can:
- Eliminate circular dependencies (constants depend on nothing)
- Ensure single source of truth for all EVM limits and values
- Make it easier to update values for different hardforks
- Improve code maintainability and testing

## Requirements

### 1. Opcode Constants
Define all opcode byte values as constants:
```zig
// Arithmetic opcodes
pub const ADD: u8 = 0x01;
pub const MUL: u8 = 0x02;
pub const SUB: u8 = 0x03;
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
pub const EXP: u8 = 0x0a;
pub const SIGNEXTEND: u8 = 0x0b;

// Comparison & bitwise logic
pub const LT: u8 = 0x10;
pub const GT: u8 = 0x11;
pub const SLT: u8 = 0x12;
pub const SGT: u8 = 0x13;
pub const EQ: u8 = 0x14;
pub const ISZERO: u8 = 0x15;
pub const AND: u8 = 0x16;
pub const OR: u8 = 0x17;
pub const XOR: u8 = 0x18;
pub const NOT: u8 = 0x19;
pub const BYTE: u8 = 0x1a;
pub const SHL: u8 = 0x1b;
pub const SHR: u8 = 0x1c;
pub const SAR: u8 = 0x1d;

// SHA3
pub const KECCAK256: u8 = 0x20;

// Environmental information
pub const ADDRESS: u8 = 0x30;
pub const BALANCE: u8 = 0x31;
pub const ORIGIN: u8 = 0x32;
pub const CALLER: u8 = 0x33;
pub const CALLVALUE: u8 = 0x34;
pub const CALLDATALOAD: u8 = 0x35;
pub const CALLDATASIZE: u8 = 0x36;
pub const CALLDATACOPY: u8 = 0x37;
pub const CODESIZE: u8 = 0x38;
pub const CODECOPY: u8 = 0x39;
pub const GASPRICE: u8 = 0x3a;
pub const EXTCODESIZE: u8 = 0x3b;
pub const EXTCODECOPY: u8 = 0x3c;
pub const RETURNDATASIZE: u8 = 0x3d;
pub const RETURNDATACOPY: u8 = 0x3e;
pub const EXTCODEHASH: u8 = 0x3f;

// Block information
pub const BLOCKHASH: u8 = 0x40;
pub const COINBASE: u8 = 0x41;
pub const TIMESTAMP: u8 = 0x42;
pub const NUMBER: u8 = 0x43;
pub const DIFFICULTY: u8 = 0x44;
pub const GASLIMIT: u8 = 0x45;
pub const CHAINID: u8 = 0x46;
pub const SELFBALANCE: u8 = 0x47;
pub const BASEFEE: u8 = 0x48;
pub const BLOBHASH: u8 = 0x49;
pub const BLOBBASEFEE: u8 = 0x4a;

// Stack, memory, storage and flow operations
pub const POP: u8 = 0x50;
pub const MLOAD: u8 = 0x51;
pub const MSTORE: u8 = 0x52;
pub const MSTORE8: u8 = 0x53;
pub const SLOAD: u8 = 0x54;
pub const SSTORE: u8 = 0x55;
pub const JUMP: u8 = 0x56;
pub const JUMPI: u8 = 0x57;
pub const PC: u8 = 0x58;
pub const MSIZE: u8 = 0x59;
pub const GAS: u8 = 0x5a;
pub const JUMPDEST: u8 = 0x5b;
pub const TLOAD: u8 = 0x5c;
pub const TSTORE: u8 = 0x5d;
pub const MCOPY: u8 = 0x5e;
pub const PUSH0: u8 = 0x5f;

// Push operations
pub const PUSH1: u8 = 0x60;
pub const PUSH2: u8 = 0x61;
// ... through PUSH32 = 0x7f

// Duplication operations
pub const DUP1: u8 = 0x80;
// ... through DUP16 = 0x8f

// Exchange operations
pub const SWAP1: u8 = 0x90;
// ... through SWAP16 = 0x9f

// Logging operations
pub const LOG0: u8 = 0xa0;
pub const LOG1: u8 = 0xa1;
pub const LOG2: u8 = 0xa2;
pub const LOG3: u8 = 0xa3;
pub const LOG4: u8 = 0xa4;

// System operations
pub const CREATE: u8 = 0xf0;
pub const CALL: u8 = 0xf1;
pub const CALLCODE: u8 = 0xf2;
pub const RETURN: u8 = 0xf3;
pub const DELEGATECALL: u8 = 0xf4;
pub const CREATE2: u8 = 0xf5;
pub const STATICCALL: u8 = 0xfa;
pub const REVERT: u8 = 0xfd;
pub const INVALID: u8 = 0xfe;
pub const SELFDESTRUCT: u8 = 0xff;

// Common aliases
pub const STOP: u8 = 0x00;
pub const SHA3: u8 = KECCAK256;
pub const SUICIDE: u8 = SELFDESTRUCT;
```

### 2. EVM Limits and Sizes
```zig
// Stack limits
pub const STACK_LIMIT: usize = 1024;
pub const MAX_STACK_SIZE: usize = 1024;

// Call depth
pub const CALL_DEPTH_LIMIT: usize = 1024;

// Code size limits
pub const MAX_CODE_SIZE: usize = 24576; // 24KB (EIP-170)
pub const MAX_INITCODE_SIZE: usize = 49152; // 48KB (EIP-3860)

// Memory and word sizes
pub const WORD_SIZE: usize = 32;
pub const WORD_SIZE_BITS: usize = 256;
pub const ADDRESS_SIZE: usize = 20;
pub const HASH_SIZE: usize = 32;

// Transaction limits
pub const MAX_BLOB_GAS_PER_BLOCK: u64 = 786432; // 6 * 131072 (EIP-4844)
pub const TARGET_BLOB_GAS_PER_BLOCK: u64 = 393216; // 3 * 131072
pub const BLOB_TX_MIN_BLOB_GASPRICE: u64 = 1;
pub const BLOB_TX_BLOB_GASPRICE_UPDATE_FRACTION: u64 = 3338477;

// Precompile addresses
pub const PRECOMPILE_ECRECOVER: u8 = 0x01;
pub const PRECOMPILE_SHA256: u8 = 0x02;
pub const PRECOMPILE_RIPEMD160: u8 = 0x03;
pub const PRECOMPILE_IDENTITY: u8 = 0x04;
pub const PRECOMPILE_MODEXP: u8 = 0x05;
pub const PRECOMPILE_ECADD: u8 = 0x06;
pub const PRECOMPILE_ECMUL: u8 = 0x07;
pub const PRECOMPILE_ECPAIRING: u8 = 0x08;
pub const PRECOMPILE_BLAKE2F: u8 = 0x09;
pub const PRECOMPILE_POINT_EVALUATION: u8 = 0x0a;
```

### 3. Gas Constants
```zig
// Base gas costs
pub const G_ZERO: u64 = 0;
pub const G_BASE: u64 = 2;
pub const G_VERYLOW: u64 = 3;
pub const G_LOW: u64 = 5;
pub const G_MID: u64 = 8;
pub const G_HIGH: u64 = 10;
pub const G_JUMPDEST: u64 = 1;

// Memory gas costs
pub const G_MEMORY: u64 = 3;
pub const G_QUADRATIC_WORD: u64 = 512; // Memory expansion quadratic cost divisor

// Storage gas costs (EIP-2200)
pub const G_SLOAD: u64 = 2100;
pub const G_SSET: u64 = 20000;
pub const G_SRESET: u64 = 2900;
pub const R_SCLEAR: u64 = 15000;
pub const G_SELFDESTRUCT: u64 = 5000;

// Transaction gas costs
pub const G_TRANSACTION: u64 = 21000;
pub const G_TRANSACTION_DATA_ZERO: u64 = 4;
pub const G_TRANSACTION_DATA_NONZERO: u64 = 16; // Pre-EIP-2028
pub const G_TRANSACTION_DATA_NONZERO_EIP2028: u64 = 16;

// Create operation gas costs
pub const G_CREATE: u64 = 32000;
pub const G_CODEDEPOSIT: u64 = 200;
pub const G_INITCODE_WORD: u64 = 2; // EIP-3860

// Call operation gas costs
pub const G_CALL: u64 = 700;
pub const G_CALLVALUE: u64 = 9000;
pub const G_CALLSTIPEND: u64 = 2300;
pub const G_NEWACCOUNT: u64 = 25000;

// Precompile gas costs
pub const G_ECRECOVER: u64 = 3000;
pub const G_SHA256_BASE: u64 = 60;
pub const G_SHA256_WORD: u64 = 12;
pub const G_RIPEMD160_BASE: u64 = 600;
pub const G_RIPEMD160_WORD: u64 = 120;
pub const G_IDENTITY_BASE: u64 = 15;
pub const G_IDENTITY_WORD: u64 = 3;

// Log operation gas costs
pub const G_LOG: u64 = 375;
pub const G_LOGTOPIC: u64 = 375;
pub const G_LOGDATA: u64 = 8;

// Other operation gas costs
pub const G_KECCAK256: u64 = 30;
pub const G_KECCAK256_WORD: u64 = 6;
pub const G_COPY: u64 = 3;
pub const G_BLOCKHASH: u64 = 20;
pub const G_EXP_BYTE: u64 = 50;

// EIP-2929 access list gas costs
pub const COLD_SLOAD_COST: u64 = 2100;
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_STORAGE_READ_COST: u64 = 100;

// EIP-3529 gas refund changes
pub const MAX_REFUND_QUOTIENT: u64 = 5; // Pre-London
pub const MAX_REFUND_QUOTIENT_EIP3529: u64 = 5; // Post-London
```

### 4. Utility Functions
```zig
/// Check if an opcode is a PUSH instruction
pub fn isPush(opcode: u8) bool {
    return opcode >= PUSH1 and opcode <= PUSH32;
}

/// Check if an opcode is a DUP instruction
pub fn isDup(opcode: u8) bool {
    return opcode >= DUP1 and opcode <= DUP16;
}

/// Check if an opcode is a SWAP instruction
pub fn isSwap(opcode: u8) bool {
    return opcode >= SWAP1 and opcode <= SWAP16;
}

/// Check if an opcode is a LOG instruction
pub fn isLog(opcode: u8) bool {
    return opcode >= LOG0 and opcode <= LOG4;
}

/// Get the number of items pushed by a PUSH opcode
pub fn getPushSize(opcode: u8) u8 {
    if (\!isPush(opcode)) return 0;
    if (opcode == PUSH0) return 0;
    return opcode - PUSH1 + 1;
}

/// Get the number of items duplicated by a DUP opcode
pub fn getDupSize(opcode: u8) u8 {
    if (\!isDup(opcode)) return 0;
    return opcode - DUP1 + 1;
}

/// Get the swap depth for a SWAP opcode
pub fn getSwapSize(opcode: u8) u8 {
    if (\!isSwap(opcode)) return 0;
    return opcode - SWAP1 + 1;
}

/// Get the number of topics for a LOG opcode
pub fn getLogTopics(opcode: u8) u8 {
    if (\!isLog(opcode)) return 0;
    return opcode - LOG0;
}

/// Calculate memory expansion cost
pub fn memoryGasCost(size: u64) u64 {
    if (size == 0) return 0;
    const word_size = (size + 31) / 32;
    const linear_cost = word_size * G_MEMORY;
    const quadratic_cost = (word_size * word_size) / G_QUADRATIC_WORD;
    return linear_cost + quadratic_cost;
}

/// Calculate initcode gas cost (EIP-3860)
pub fn initCodeGasCost(size: u64) u64 {
    if (size == 0) return 0;
    const word_size = (size + 31) / 32;
    return word_size * G_INITCODE_WORD;
}

/// Check if an address is a precompile
pub fn isPrecompile(address: [20]u8) bool {
    // Check if address is 0x00...01 through 0x00...0a
    for (address[0..19]) |byte| {
        if (byte \!= 0) return false;
    }
    return address[19] >= PRECOMPILE_ECRECOVER and address[19] <= PRECOMPILE_POINT_EVALUATION;
}
```

### 5. Common Types
```zig
/// Memory size calculation result
pub const MemorySize = struct {
    size: u64,
    overflow: bool,
};

/// Gas calculation result
pub const GasResult = struct {
    cost: u64,
    overflow: bool,
};
```

### 6. Error Types
```zig
/// EVM execution errors
pub const EvmError = error{
    OutOfGas,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    OutOfBounds,
    WriteProtection,
    DepthLimit,
    InsufficientBalance,
    ContractAddressCollision,
    CodeSizeExceeded,
    InitCodeSizeExceeded,
    Revert,
    Stop,
    Invalid,
};
```

## Implementation Notes

1. **Organization**: Group related constants together with clear section headers
2. **Naming Convention**: Use UPPER_SNAKE_CASE for constants, camelCase for functions
3. **Documentation**: Each constant should have a comment explaining its purpose and any relevant EIP
4. **Hardfork Support**: Consider creating separate constant sets for different hardforks where values change
5. **Testing**: Include comprehensive tests for all utility functions
6. **No Dependencies**: This module should not import any other EVM modules to avoid circular dependencies

## Testing Requirements

1. Test all utility functions with edge cases
2. Verify gas calculation functions against known test vectors
3. Test that all opcode classification functions work correctly
4. Ensure memory gas cost calculations match EVM specifications

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EVM Opcodes Reference](https://www.evm.codes/)
- [Ethereum EIPs](https://eips.ethereum.org/)
- Go-Ethereum constants: `params/protocol_params.go`
- Reth constants: `crates/primitives/src/constants.rs`
- Evmone constants: `lib/evmone/instructions.hpp`
EOF < /dev/null
## Additional Constants from Reference Implementations

### 7. Block and Chain Constants
```zig
// Block limits
pub const BLOCK_HASH_HISTORY: u64 = 256; // Number of recent block hashes available
pub const MAX_WITHDRAWALS_PER_PAYLOAD: usize = 16; // EIP-4895
pub const MAX_BLOB_NUMBER_PER_BLOCK: usize = 6; // EIP-4844

// Chain constants
pub const MAINNET_CHAIN_ID: u64 = 1;
pub const GOERLI_CHAIN_ID: u64 = 5;
pub const SEPOLIA_CHAIN_ID: u64 = 11155111;

// Difficulty/Prevrandao
pub const DIFFICULTY_BOUND_DIVISOR: u64 = 2048;
pub const MIN_DIFFICULTY: u64 = 131072;
```

### 8. Hash Constants
```zig
// Empty hashes - these are commonly used in state management
pub const KECCAK_EMPTY: [32]u8 = .{ 
    0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
    0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
    0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
    0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
}; // Keccak256("")

pub const KECCAK_NULL_RLP: [32]u8 = .{
    0x56, 0xe8, 0x1f, 0x17, 0x1b, 0xcc, 0x55, 0xa6,
    0xff, 0x83, 0x45, 0xe6, 0x92, 0xc0, 0xf8, 0x6e,
    0x5b, 0x48, 0xe0, 0x1b, 0x99, 0x6c, 0xad, 0xc0,
    0x01, 0x62, 0x2f, 0xb5, 0xe3, 0x63, 0xb4, 0x21
}; // Keccak256(RLP(null))

pub const EMPTY_UNCLES_HASH: [32]u8 = .{
    0x1d, 0xcc, 0x4d, 0xe8, 0xde, 0xc7, 0x5d, 0x7a,
    0xab, 0x85, 0xb5, 0x67, 0xb6, 0xcc, 0xd4, 0x1a,
    0xd3, 0x12, 0x45, 0x1b, 0x94, 0x8a, 0x74, 0x13,
    0xf0, 0xa1, 0x42, 0xfd, 0x40, 0xd4, 0x93, 0x47
}; // Keccak256(RLP([]))
```

### 9. System Addresses
```zig
// System contract addresses
pub const SYSTEM_ADDRESS: [20]u8 = .{0xff} ** 19 ++ .{0xfe}; // 0xfffffffffffffffffffffffffffffffffffffffe
pub const BEACON_ROOTS_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0b}; // EIP-4788
pub const HISTORY_STORAGE_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0c}; // EIP-2935
pub const WITHDRAWAL_REQUEST_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0d}; // EIP-7002
pub const CONSOLIDATION_REQUEST_ADDRESS: [20]u8 = .{0} ** 19 ++ .{0x0e}; // EIP-7251
```

### 10. Mathematical Constants
```zig
// Maximum values
pub const MAX_UINT64: u64 = 0xFFFFFFFFFFFFFFFF;
pub const MAX_UINT256: u256 = (1 << 256) - 1;

// Secp256k1 curve constants (for signature validation)
pub const SECP256K1_ORDER: u256 = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141;
pub const SECP256K1_HALF_ORDER: u256 = 0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;
```

### 11. Refund Constants
```zig
// Gas refund quotients
pub const REFUND_QUOTIENT: u64 = 2; // Legacy (pre-London)
pub const REFUND_QUOTIENT_EIP3529: u64 = 5; // Post-London

// Storage refunds (pre-London)
pub const SSTORE_REFUND_GAS: u64 = 15000;
pub const SSTORE_SET_GAS: u64 = 20000;
pub const SSTORE_RESET_GAS: u64 = 5000;
pub const SSTORE_CLEARS_SCHEDULE_REFUND_GAS: u64 = 15000;

// Self-destruct refunds (removed in EIP-3529)
pub const SELF_DESTRUCT_REFUND_GAS: u64 = 24000; // Pre-London only
```

### 12. Access List Constants (EIP-2930)
```zig
// Access list costs
pub const ACCESS_LIST_STORAGE_KEY_COST: u64 = 1900;
pub const ACCESS_LIST_ADDRESS_COST: u64 = 2400;
```

### 13. Base Fee Constants (EIP-1559)
```zig
// Base fee
pub const INITIAL_BASE_FEE: u64 = 1000000000; // 1 gwei
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;
pub const ELASTICITY_MULTIPLIER: u64 = 2;
```

### 14. Blob Transaction Constants (EIP-4844)
```zig
// Blob constants
pub const BLOB_TX_BLOB_GASPRICE_UPDATE_FRACTION: u64 = 3338477;
pub const MIN_BLOB_GASPRICE: u64 = 1;
pub const BLOB_COMMITMENT_SIZE: usize = 48;
pub const BLOB_SIZE: usize = 131072; // 128KB
pub const FIELD_ELEMENTS_PER_BLOB: usize = 4096;
pub const BYTES_PER_FIELD_ELEMENT: usize = 32;
```

### 15. Additional Precompile Gas Costs
```zig
// BN256 curve operations (EIP-196, EIP-197)
pub const G_BN256_ADD: u64 = 150; // Istanbul reduction from 500
pub const G_BN256_MUL: u64 = 6000; // Istanbul reduction from 40000
pub const G_BN256_PAIRING_BASE: u64 = 45000; // Istanbul reduction from 100000
pub const G_BN256_PAIRING_POINT: u64 = 34000; // Istanbul reduction from 80000

// Blake2f (EIP-152)
pub const G_BLAKE2F_ROUND: u64 = 1;

// BLS12-381 operations (EIP-2537)
pub const G_BLS12_381_ADD: u64 = 500;
pub const G_BLS12_381_MUL: u64 = 12000;
pub const G_BLS12_381_PAIRING_BASE: u64 = 65000;
pub const G_BLS12_381_PAIRING_PAIR: u64 = 43000;
pub const G_BLS12_381_MAP_TO_G1: u64 = 5500;
pub const G_BLS12_381_MAP_TO_G2: u64 = 75000;

// Point evaluation precompile (EIP-4844)
pub const G_POINT_EVALUATION: u64 = 50000;
```

### 16. Additional Utility Functions
```zig
/// Calculate the cost of accessing an account (EIP-2929)
pub fn accountAccessGasCost(is_cold: bool) u64 {
    return if (is_cold) COLD_ACCOUNT_ACCESS_COST else 0;
}

/// Calculate the cost of accessing storage (EIP-2929)
pub fn storageAccessGasCost(is_cold: bool) u64 {
    return if (is_cold) COLD_SLOAD_COST else WARM_STORAGE_READ_COST;
}

/// Check if a block number is within the accessible history
pub fn isBlockHashAccessible(current_block: u64, requested_block: u64) bool {
    if (requested_block >= current_block) return false;
    return current_block - requested_block <= BLOCK_HASH_HISTORY;
}

/// Calculate blob gas price (EIP-4844)
pub fn calcBlobGasPrice(excess_blob_gas: u64) u64 {
    return @max(
        MIN_BLOB_GASPRICE,
        fakeExponential(MIN_BLOB_GASPRICE, excess_blob_gas, BLOB_TX_BLOB_GASPRICE_UPDATE_FRACTION)
    );
}

/// Fake exponential function for blob gas pricing
fn fakeExponential(base: u64, exponent: u64, divisor: u64) u64 {
    // Implementation of the fake exponential formula from EIP-4844
    // This is a simplified version - full implementation needed
    var accum = divisor;
    var output = base;
    // ... implementation details
    return output;
}

/// Get the number of effective bytes in a data array for gas calculation
pub fn dataGasCost(data: []const u8, is_contract_creation: bool) u64 {
    var cost: u64 = 0;
    for (data) |byte| {
        if (byte == 0) {
            cost += G_TRANSACTION_DATA_ZERO;
        } else {
            cost += G_TRANSACTION_DATA_NONZERO;
        }
    }
    if (is_contract_creation) {
        cost += initCodeGasCost(data.len);
    }
    return cost;
}

/// Check if an opcode is terminal (ends execution)
pub fn isTerminal(opcode: u8) bool {
    return switch (opcode) {
        STOP, RETURN, REVERT, INVALID, SELFDESTRUCT => true,
        else => false,
    };
}

/// Get opcode name from byte value
pub fn getOpcodeName(opcode: u8) []const u8 {
    return switch (opcode) {
        0x00 => "STOP",
        0x01 => "ADD",
        0x02 => "MUL",
        0x03 => "SUB",
        0x04 => "DIV",
        0x05 => "SDIV",
        0x06 => "MOD",
        0x07 => "SMOD",
        0x08 => "ADDMOD",
        0x09 => "MULMOD",
        0x0a => "EXP",
        0x0b => "SIGNEXTEND",
        // ... (complete list needed)
        0xfe => "INVALID",
        0xff => "SELFDESTRUCT",
        else => "UNKNOWN",
    };
}
```

## Hardfork Considerations

Consider organizing constants by hardfork for values that change:
```zig
pub const Hardfork = enum {
    Frontier,
    Homestead,
    TangerineWhistle,
    SpuriousDragon,
    Byzantium,
    Constantinople,
    Petersburg,
    Istanbul,
    Berlin,
    London,
    Paris,
    Shanghai,
    Cancun,
};

pub fn getGasConstants(hardfork: Hardfork) GasConstants {
    return switch (hardfork) {
        .Frontier => .{
            .sload = 50,
            .selfdestruct = 0,
            // ...
        },
        .TangerineWhistle => .{
            .sload = 200,
            .selfdestruct = 5000,
            // ...
        },
        // ... other hardforks
    };
}
```

## References for Implementation

- [Go-Ethereum protocol_params.go](https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go)
- [Reth constants.rs](https://github.com/paradigmxyz/reth/blob/main/crates/primitives/src/constants.rs)
- [Evmone instructions.hpp](https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp)
- [EVM.codes - Opcode Reference](https://www.evm.codes/)
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)

## Notes

1. Many constants change between hardforks, so consider a hardfork-aware design
2. Some constants are derived (e.g., blob gas pricing uses a complex formula)
3. Gas costs especially need careful attention as they affect consensus
4. Consider adding validation functions to ensure constants are used correctly
5. Document which EIP introduced or changed each constant
EOF < /dev/null