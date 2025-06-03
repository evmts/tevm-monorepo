# EVM Hardfork Compatibility Matrix

This document provides a comprehensive overview of EVM changes across all major Ethereum hardforks, from Frontier to Cancun.

## Table of Contents

1. [Hardfork Timeline](#hardfork-timeline)
2. [Opcode Additions by Hardfork](#opcode-additions-by-hardfork)
3. [Gas Cost Changes by Hardfork](#gas-cost-changes-by-hardfork)
4. [Behavioral Changes by Hardfork](#behavioral-changes-by-hardfork)
5. [Complete Opcode Support Matrix](#complete-opcode-support-matrix)
6. [Implementation Guide](#implementation-guide)

## Hardfork Timeline

| Hardfork | Block Number (Mainnet) | Date | Key Changes |
|----------|------------------------|------|--------------|
| Frontier | 0 | July 30, 2015 | Initial release |
| Homestead | 1,150,000 | March 14, 2016 | DELEGATECALL, CREATE fixes |
| Tangerine Whistle | 2,463,000 | October 18, 2016 | Gas repricing (EIP-150) |
| Spurious Dragon | 2,675,000 | November 22, 2016 | State clearing (EIP-161) |
| Byzantium | 4,370,000 | October 16, 2017 | REVERT, RETURNDATASIZE, STATICCALL |
| Constantinople | 7,280,000 | February 28, 2019 | CREATE2, EXTCODEHASH, bitwise shifts |
| Petersburg | 7,280,000 | February 28, 2019 | Same block (removed EIP-1283) |
| Istanbul | 9,069,000 | December 8, 2019 | CHAINID, SELFBALANCE, repricing |
| Muir Glacier | 9,200,000 | January 2, 2020 | Difficulty bomb delay only |
| Berlin | 12,244,000 | April 15, 2021 | Access lists (EIP-2929) |
| London | 12,965,000 | August 5, 2021 | BASEFEE, EIP-1559 |
| Arrow Glacier | 13,773,000 | December 9, 2021 | Difficulty bomb delay only |
| Gray Glacier | 15,050,000 | June 30, 2022 | Difficulty bomb delay only |
| Paris (Merge) | 15,537,394 | September 15, 2022 | DIFFICULTY → PREVRANDAO |
| Shanghai | 17,034,870 | April 12, 2023 | PUSH0 |
| Cancun | 19,426,587 | March 13, 2024 | BLOBHASH, MCOPY, transient storage |

## Opcode Additions by Hardfork

### Homestead
- **0xf4 DELEGATECALL**: Execute code in another contract using current storage

### Byzantium
- **0x3d RETURNDATASIZE**: Get size of return data from last call
- **0x3e RETURNDATACOPY**: Copy return data to memory
- **0xfa STATICCALL**: Call without state modifications
- **0xfd REVERT**: Revert with return data

### Constantinople
- **0x1b SHL**: Shift left
- **0x1c SHR**: Logical shift right
- **0x1d SAR**: Arithmetic shift right
- **0x3f EXTCODEHASH**: Get keccak256 of contract code
- **0xf5 CREATE2**: Create contract with deterministic address

### Istanbul
- **0x46 CHAINID**: Get chain ID
- **0x47 SELFBALANCE**: Get balance of current contract

### London
- **0x48 BASEFEE**: Get current block's base fee

### Shanghai
- **0x5f PUSH0**: Push 0 onto stack (more efficient than PUSH1 0)

### Cancun
- **0x49 BLOBHASH**: Get blob hash from blob transaction
- **0x4a BLOBBASEFEE**: Get current blob base fee
- **0x5c TLOAD**: Load from transient storage
- **0x5d TSTORE**: Store to transient storage
- **0x5e MCOPY**: Memory copy

## Gas Cost Changes by Hardfork

### Tangerine Whistle (EIP-150)

| Opcode | Old Cost | New Cost | Change |
|--------|----------|----------|---------|
| BALANCE | 20 | 400 | +1900% |
| EXTCODESIZE | 20 | 700 | +3400% |
| EXTCODECOPY | 20 | 700 | +3400% |
| SLOAD | 50 | 200 | +300% |
| CALL | 40 | 700 | +1650% |
| CALLCODE | 40 | 700 | +1650% |
| DELEGATECALL | 40 | 700 | +1650% |
| SELFDESTRUCT | 0 | 5000 | New |

### Istanbul (EIP-1884, EIP-2200)

| Opcode | Old Cost | New Cost | Change |
|--------|----------|----------|---------|
| BALANCE | 400 | 700 | +75% |
| SLOAD | 200 | 800 | +300% |
| SELFBALANCE | N/A | 5 | New opcode |
| CHAINID | N/A | 2 | New opcode |

### Berlin (EIP-2929)

Introduced cold/warm access patterns:

| Operation | Cold Cost | Warm Cost |
|-----------|-----------|-----------|
| BALANCE | 2600 | 100 |
| EXTCODESIZE | 2600 | 100 |
| EXTCODECOPY | 2600 | 100 |
| EXTCODEHASH | 2600 | 100 |
| CALL (address) | 2600 | 100 |
| SLOAD | 2100 | 100 |

## Behavioral Changes by Hardfork

### Homestead

1. **Contract Creation**:
   - Empty contract creation now fails (must return code)
   - Out-of-gas during creation consumes all gas

2. **CALL Depth**:
   - Maximum call depth enforced at 1024

### Byzantium

1. **Empty Account Handling**:
   - Empty accounts can now receive value

2. **Precompiles**:
   - Added modular exponentiation, EC operations

### Constantinople

1. **CREATE2 Behavior**:
   - Deterministic addresses using salt
   - Address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]

### Istanbul

1. **SSTORE Refunds**:
   - Net gas metering for storage operations

### Berlin

1. **Access Lists**:
   - Transaction format includes optional access list
   - Pre-declared addresses/slots are warm from start

### London

1. **Gas Pricing**:
   - Base fee burns, priority fee to miner
   - GASPRICE returns effective gas price

### Paris (Merge)

1. **DIFFICULTY → PREVRANDAO**:
   - DIFFICULTY opcode returns beacon chain randomness

### Cancun

1. **Transient Storage**:
   - Cleared after each transaction
   - Cannot be accessed by external calls

## Complete Opcode Support Matrix

| Opcode | Hex | Frontier | Homestead | Byzantium | Constantinople | Istanbul | Berlin | London | Shanghai | Cancun |
|--------|-----|----------|-----------|-----------|----------------|----------|---------|---------|----------|---------|
| **Arithmetic** |
| ADD | 0x01 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MUL | 0x02 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SUB | 0x03 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DIV | 0x04 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SDIV | 0x05 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MOD | 0x06 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SMOD | 0x07 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ADDMOD | 0x08 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MULMOD | 0x09 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EXP | 0x0a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SIGNEXTEND | 0x0b | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Comparison** |
| LT | 0x10 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GT | 0x11 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SLT | 0x12 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SGT | 0x13 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EQ | 0x14 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ISZERO | 0x15 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Bitwise** |
| AND | 0x16 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| OR | 0x17 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| XOR | 0x18 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NOT | 0x19 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| BYTE | 0x1a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SHL | 0x1b | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SHR | 0x1c | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SAR | 0x1d | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **SHA3** |
| SHA3 | 0x20 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Environment** |
| ADDRESS | 0x30 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| BALANCE | 0x31 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ORIGIN | 0x32 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALLER | 0x33 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALLVALUE | 0x34 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALLDATALOAD | 0x35 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALLDATASIZE | 0x36 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALLDATACOPY | 0x37 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CODESIZE | 0x38 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CODECOPY | 0x39 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GASPRICE | 0x3a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EXTCODESIZE | 0x3b | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EXTCODECOPY | 0x3c | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RETURNDATASIZE | 0x3d | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RETURNDATACOPY | 0x3e | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| EXTCODEHASH | 0x3f | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Block** |
| BLOCKHASH | 0x40 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| COINBASE | 0x41 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TIMESTAMP | 0x42 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NUMBER | 0x43 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DIFFICULTY | 0x44 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* |
| GASLIMIT | 0x45 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CHAINID | 0x46 | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SELFBALANCE | 0x47 | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| BASEFEE | 0x48 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| BLOBHASH | 0x49 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| BLOBBASEFEE | 0x4a | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| **Stack/Memory/Storage** |
| POP | 0x50 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MLOAD | 0x51 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MSTORE | 0x52 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MSTORE8 | 0x53 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SLOAD | 0x54 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SSTORE | 0x55 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| JUMP | 0x56 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| JUMPI | 0x57 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| PC | 0x58 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MSIZE | 0x59 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GAS | 0x5a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| JUMPDEST | 0x5b | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| TLOAD | 0x5c | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| TSTORE | 0x5d | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| MCOPY | 0x5e | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| PUSH0 | 0x5f | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| **Push Operations** |
| PUSH1-PUSH32 | 0x60-0x7f | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Dup/Swap** |
| DUP1-DUP16 | 0x80-0x8f | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SWAP1-SWAP16 | 0x90-0x9f | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Logging** |
| LOG0-LOG4 | 0xa0-0xa4 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **System** |
| CREATE | 0xf0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALL | 0xf1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CALLCODE | 0xf2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RETURN | 0xf3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DELEGATECALL | 0xf4 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CREATE2 | 0xf5 | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| STATICCALL | 0xfa | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| REVERT | 0xfd | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| INVALID | 0xfe | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SELFDESTRUCT | 0xff | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*Note: DIFFICULTY returns PREVRANDAO in Paris+

## Implementation Guide

### Hardfork Detection

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
    MuirGlacier,
    Berlin,
    London,
    ArrowGlacier,
    GrayGlacier,
    Paris,
    Shanghai,
    Cancun,
    
    pub fn fromBlockNumber(chain_id: u64, block: u64) Hardfork {
        // Mainnet fork blocks
        if (chain_id == 1) {
            if (block >= 19_426_587) return .Cancun;
            if (block >= 17_034_870) return .Shanghai;
            if (block >= 15_537_394) return .Paris;
            if (block >= 15_050_000) return .GrayGlacier;
            if (block >= 13_773_000) return .ArrowGlacier;
            if (block >= 12_965_000) return .London;
            if (block >= 12_244_000) return .Berlin;
            if (block >= 9_200_000) return .MuirGlacier;
            if (block >= 9_069_000) return .Istanbul;
            if (block >= 7_280_000) return .Petersburg;
            if (block >= 4_370_000) return .Byzantium;
            if (block >= 2_675_000) return .SpuriousDragon;
            if (block >= 2_463_000) return .TangerineWhistle;
            if (block >= 1_150_000) return .Homestead;
            return .Frontier;
        }
        // Other chains...
        return .Cancun; // Default to latest
    }
    
    pub fn hasOpcode(self: Hardfork, opcode: u8) bool {
        return switch (opcode) {
            0xf4 => self.isAtLeast(.Homestead),
            0x3d, 0x3e, 0xfa, 0xfd => self.isAtLeast(.Byzantium),
            0x1b, 0x1c, 0x1d, 0x3f, 0xf5 => self.isAtLeast(.Constantinople),
            0x46, 0x47 => self.isAtLeast(.Istanbul),
            0x48 => self.isAtLeast(.London),
            0x5f => self.isAtLeast(.Shanghai),
            0x49, 0x4a, 0x5c, 0x5d, 0x5e => self.isAtLeast(.Cancun),
            else => true, // Available in all forks
        };
    }
    
    pub fn isAtLeast(self: Hardfork, other: Hardfork) bool {
        return @intFromEnum(self) >= @intFromEnum(other);
    }
};
```

### Gas Cost Resolution

```zig
pub fn getGasCost(hardfork: Hardfork, opcode: u8, is_cold: bool) u64 {
    return switch (opcode) {
        // Storage operations
        0x54 => { // SLOAD
            if (hardfork.isAtLeast(.Berlin)) {
                return if (is_cold) 2100 else 100;
            } else if (hardfork.isAtLeast(.Istanbul)) {
                return 800;
            } else if (hardfork.isAtLeast(.TangerineWhistle)) {
                return 200;
            } else {
                return 50;
            }
        },
        
        // Balance operation
        0x31 => { // BALANCE
            if (hardfork.isAtLeast(.Berlin)) {
                return if (is_cold) 2600 else 100;
            } else if (hardfork.isAtLeast(.Istanbul)) {
                return 700;
            } else if (hardfork.isAtLeast(.TangerineWhistle)) {
                return 400;
            } else {
                return 20;
            }
        },
        
        // ... other opcodes
        else => getBaseCost(opcode),
    };
}
```

### Feature Flags

```zig
pub const Features = struct {
    has_delegate_call: bool,
    has_static_call: bool,
    has_revert: bool,
    has_return_data: bool,
    has_bitwise_shifting: bool,
    has_create2: bool,
    has_extcodehash: bool,
    has_chainid: bool,
    has_selfbalance: bool,
    has_basefee: bool,
    has_push0: bool,
    has_blob_transactions: bool,
    has_transient_storage: bool,
    has_mcopy: bool,
    has_access_lists: bool,
    
    pub fn fromHardfork(hardfork: Hardfork) Features {
        return .{
            .has_delegate_call = hardfork.isAtLeast(.Homestead),
            .has_static_call = hardfork.isAtLeast(.Byzantium),
            .has_revert = hardfork.isAtLeast(.Byzantium),
            .has_return_data = hardfork.isAtLeast(.Byzantium),
            .has_bitwise_shifting = hardfork.isAtLeast(.Constantinople),
            .has_create2 = hardfork.isAtLeast(.Constantinople),
            .has_extcodehash = hardfork.isAtLeast(.Constantinople),
            .has_chainid = hardfork.isAtLeast(.Istanbul),
            .has_selfbalance = hardfork.isAtLeast(.Istanbul),
            .has_basefee = hardfork.isAtLeast(.London),
            .has_push0 = hardfork.isAtLeast(.Shanghai),
            .has_blob_transactions = hardfork.isAtLeast(.Cancun),
            .has_transient_storage = hardfork.isAtLeast(.Cancun),
            .has_mcopy = hardfork.isAtLeast(.Cancun),
            .has_access_lists = hardfork.isAtLeast(.Berlin),
        };
    }
};
```

## Testing Hardfork Compatibility

```zig
test "Hardfork opcode availability" {
    const frontier = Hardfork.Frontier;
    const istanbul = Hardfork.Istanbul;
    const cancun = Hardfork.Cancun;
    
    // DELEGATECALL not in Frontier
    try testing.expect(!frontier.hasOpcode(0xf4));
    try testing.expect(istanbul.hasOpcode(0xf4));
    
    // CHAINID only in Istanbul+
    try testing.expect(!frontier.hasOpcode(0x46));
    try testing.expect(istanbul.hasOpcode(0x46));
    
    // MCOPY only in Cancun+
    try testing.expect(!istanbul.hasOpcode(0x5e));
    try testing.expect(cancun.hasOpcode(0x5e));
}
```

## References

- [EIP-150: Gas cost changes for IO-heavy operations](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-1884: Repricing for trie-size-dependent opcodes](https://eips.ethereum.org/EIPS/eip-1884)
- [EIP-2929: Gas cost increases for state access opcodes](https://eips.ethereum.org/EIPS/eip-2929)
- [EIP-1559: Fee market change](https://eips.ethereum.org/EIPS/eip-1559)
- [EIP-3198: BASEFEE opcode](https://eips.ethereum.org/EIPS/eip-3198)
- [EIP-3855: PUSH0 instruction](https://eips.ethereum.org/EIPS/eip-3855)
- [EIP-1153: Transient storage opcodes](https://eips.ethereum.org/EIPS/eip-1153)
- [EIP-5656: MCOPY instruction](https://eips.ethereum.org/EIPS/eip-5656)