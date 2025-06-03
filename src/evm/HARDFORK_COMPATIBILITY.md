# EVM Hardfork Compatibility Matrix

This document provides a comprehensive overview of EVM hardfork changes, including new opcodes, gas cost modifications, and behavioral changes across all major Ethereum hardforks.

## Table of Contents

1. [Hardfork Timeline](#hardfork-timeline)
2. [Opcode Introduction Matrix](#opcode-introduction-matrix)
3. [Gas Cost Evolution](#gas-cost-evolution)
4. [Behavioral Changes](#behavioral-changes)
5. [Removed/Deprecated Features](#removeddeprecated-features)
6. [Implementation Checklist](#implementation-checklist)

## Hardfork Timeline

| Hardfork | Block Number (Mainnet) | Date | Key Features |
|----------|------------------------|------|--------------|
| **Frontier** | 0 | July 30, 2015 | Initial release |
| **Homestead** | 1,150,000 | March 14, 2016 | Bug fixes, DELEGATECALL |
| **Tangerine Whistle** | 2,463,000 | October 18, 2016 | Gas repricing (EIP-150) |
| **Spurious Dragon** | 2,675,000 | November 22, 2016 | State clearing, replay protection |
| **Byzantium** | 4,370,000 | October 16, 2017 | REVERT, RETURNDATASIZE, STATICCALL |
| **Constantinople** | 7,280,000 | February 28, 2019 | CREATE2, EXTCODEHASH, bitwise shifts |
| **Istanbul** | 9,069,000 | December 8, 2019 | CHAINID, SELFBALANCE, gas repricing |
| **Berlin** | 12,244,000 | April 15, 2021 | Access lists (EIP-2929) |
| **London** | 12,965,000 | August 5, 2021 | BASEFEE, EIP-1559 |
| **Shanghai** | 17,034,870 | April 12, 2023 | PUSH0 |
| **Cancun** | 19,426,587 | March 13, 2024 | Transient storage, blob transactions |

## Opcode Introduction Matrix

### Legend
- ✅ Available
- ❌ Not available
- 🔄 Modified behavior
- 💰 Gas cost changed

| Opcode | Hex | Frontier | Homestead | Byzantium | Constantinople | Istanbul | Berlin | London | Shanghai | Cancun |
|--------|-----|----------|-----------|-----------|----------------|----------|--------|--------|----------|---------|
| **Arithmetic** |
| ADD | 0x01 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MUL | 0x02 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SUB | 0x03 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DIV | 0x04 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SDIV | 0x05 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MOD | 0x06 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SMOD | 0x07 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ADDMOD | 0x08 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MULMOD | 0x09 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EXP | 0x0a | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SIGNEXTEND | 0x0b | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bitwise** |
| LT | 0x10 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GT | 0x11 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SLT | 0x12 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SGT | 0x13 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EQ | 0x14 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ISZERO | 0x15 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| AND | 0x16 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| OR | 0x17 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| XOR | 0x18 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| NOT | 0x19 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| BYTE | 0x1a | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SHL | 0x1b | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SHR | 0x1c | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SAR | 0x1d | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SHA3** |
| SHA3 | 0x20 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Environment** |
| ADDRESS | 0x30 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| BALANCE | 0x31 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅ | ✅ |
| ORIGIN | 0x32 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CALLER | 0x33 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CALLVALUE | 0x34 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CALLDATALOAD | 0x35 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CALLDATASIZE | 0x36 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CALLDATACOPY | 0x37 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CODESIZE | 0x38 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CODECOPY | 0x39 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GASPRICE | 0x3a | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EXTCODESIZE | 0x3b | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅💰 | ✅ | ✅ | ✅ |
| EXTCODECOPY | 0x3c | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅💰 | ✅ | ✅ | ✅ |
| RETURNDATASIZE | 0x3d | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| RETURNDATACOPY | 0x3e | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EXTCODEHASH | 0x3f | ❌ | ❌ | ❌ | ✅ | ✅💰 | ✅💰 | ✅ | ✅ | ✅ |
| **Block** |
| BLOCKHASH | 0x40 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| COINBASE | 0x41 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| TIMESTAMP | 0x42 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| NUMBER | 0x43 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DIFFICULTY | 0x44 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GASLIMIT | 0x45 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CHAINID | 0x46 | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SELFBALANCE | 0x47 | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| BASEFEE | 0x48 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| BLOBHASH | 0x49 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| BLOBBASEFEE | 0x4a | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Storage** |
| SLOAD | 0x54 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅ | ✅ |
| SSTORE | 0x55 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅ |
| **Flow** |
| JUMP | 0x56 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| JUMPI | 0x57 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PC | 0x58 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MSIZE | 0x59 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GAS | 0x5a | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| JUMPDEST | 0x5b | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| TLOAD | 0x5c | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| TSTORE | 0x5d | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| MCOPY | 0x5e | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| PUSH0 | 0x5f | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Push** |
| PUSH1-32 | 0x60-0x7f | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dup/Swap** |
| DUP1-16 | 0x80-0x8f | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SWAP1-16 | 0x90-0x9f | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Log** |
| LOG0-4 | 0xa0-0xa4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **System** |
| CREATE | 0xf0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CALL | 0xf1 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅💰 | ✅ | ✅ | ✅ |
| CALLCODE | 0xf2 | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅💰 | ✅ | ✅ | ✅ |
| RETURN | 0xf3 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DELEGATECALL | 0xf4 | ❌ | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅💰 | ✅ | ✅ | ✅ |
| CREATE2 | 0xf5 | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| STATICCALL | 0xfa | ❌ | ❌ | ✅ | ✅ | ✅ | ✅💰 | ✅ | ✅ | ✅ |
| REVERT | 0xfd | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| INVALID | 0xfe | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SELFDESTRUCT | 0xff | ✅💰 | ✅💰 | ✅💰 | ✅💰 | ✅ | ✅💰 | ✅🔄 | ✅ | ✅ |

## Gas Cost Evolution

### Major Gas Repricing Events

#### Tangerine Whistle (EIP-150)
| Operation | Old Cost | New Cost | Rationale |
|-----------|----------|----------|-----------|
| BALANCE | 20 | 400 | Mitigate DoS attacks |
| EXTCODESIZE | 20 | 700 | Mitigate DoS attacks |
| EXTCODECOPY | 20 | 700 | Mitigate DoS attacks |
| SLOAD | 50 | 200 | Mitigate DoS attacks |
| CALL/CALLCODE/DELEGATECALL | 40 | 700 | Mitigate DoS attacks |
| SELFDESTRUCT | 0 | 5000 | Prevent state bloat attacks |

#### Istanbul (EIP-1884)
| Operation | Old Cost | New Cost | Rationale |
|-----------|----------|----------|-----------|
| BALANCE | 400 | 700 | Actual resource usage |
| SLOAD | 200 | 800 | Actual resource usage |

#### Berlin (EIP-2929)
| Operation | Cold Cost | Warm Cost | Notes |
|-----------|-----------|-----------|-------|
| BALANCE | 2600 | 100 | First access is cold |
| EXTCODESIZE | 2600 | 100 | First access is cold |
| EXTCODECOPY | 2600 | 100 | First access is cold |
| EXTCODEHASH | 2600 | 100 | First access is cold |
| SLOAD | 2100 | 100 | First access is cold |
| CALL variants | +2600 | +0 | If address is cold |

## Behavioral Changes

### Homestead
- **Contract Creation**: Failed CREATE returns empty contract instead of throwing
- **Call Depth**: Maximum call depth set to 1024
- **DELEGATECALL**: New opcode for calling with current storage context

### Byzantium  
- **REVERT**: Allows returning error data without consuming all gas
- **RETURNDATASIZE/RETURNDATACOPY**: Access return data from calls
- **STATICCALL**: Call that guarantees no state modifications
- **Precompiles**: New elliptic curve and pairing check precompiles

### Constantinople
- **CREATE2**: Deterministic contract addresses
- **EXTCODEHASH**: Cheaper than EXTCODECOPY for verification
- **Bitwise Shifts**: Native SHL, SHR, SAR operations

### Istanbul
- **CHAINID**: Access chain ID in contracts
- **SELFBALANCE**: Cheaper than BALANCE for own balance

### Berlin
- **Access Lists**: Pre-declare addresses/slots for gas savings
- **First Access Penalty**: Cold access costs more than warm

### London
- **BASEFEE**: Access current base fee
- **EIP-1559**: New transaction type with base fee burn
- **SELFDESTRUCT**: Refunds removed

### Shanghai
- **PUSH0**: Efficient zero push operation
- **Withdrawals**: Validator withdrawals enabled

### Cancun
- **Transient Storage**: TLOAD/TSTORE for temporary storage
- **BLOBHASH/BLOBBASEFEE**: Blob transaction support
- **MCOPY**: Efficient memory-to-memory copy
- **SELFDESTRUCT**: Only works in same transaction as creation

## Removed/Deprecated Features

### Gas Refunds
- **Constantinople**: SSTORE refund reduced
- **London**: SELFDESTRUCT refund removed
- **London**: SSTORE refund further reduced

### Opcodes
- **CALLCODE**: Deprecated in favor of DELEGATECALL
- **DIFFICULTY**: Replaced with PREVRANDAO post-merge

## Implementation Checklist

### For Each Hardfork Support

1. **Opcode Availability**
   - [ ] Enable/disable opcodes based on hardfork
   - [ ] Return appropriate error for unavailable opcodes

2. **Gas Costs**
   - [ ] Update static gas costs
   - [ ] Implement dynamic gas calculations
   - [ ] Handle access list tracking (Berlin+)

3. **Behavioral Changes**
   - [ ] Update CREATE behavior (Homestead+)
   - [ ] Implement REVERT logic (Byzantium+)
   - [ ] Handle deterministic addresses (Constantinople+)

4. **State Management**
   - [ ] Implement access lists (Berlin+)
   - [ ] Handle transient storage (Cancun+)
   - [ ] Update refund logic per hardfork

5. **Testing**
   - [ ] Test against known hardfork test vectors
   - [ ] Verify gas consumption
   - [ ] Check edge cases for each hardfork

### Code Example

```zig
pub fn init_from_hardfork(hardfork: Hardfork) JumpTable {
    var table = JumpTable{};
    
    // Base Frontier opcodes
    table.init_frontier();
    
    // Progressive hardfork additions
    switch (hardfork) {
        .Frontier => {},
        .Homestead => table.add_homestead_opcodes(),
        .TangerineWhistle => {
            table.add_homestead_opcodes();
            table.update_tangerine_whistle_gas();
        },
        .Byzantium => {
            table.add_homestead_opcodes();
            table.update_tangerine_whistle_gas();
            table.add_byzantium_opcodes();
        },
        // ... continue for each hardfork
    }
    
    return table;
}
```

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-1884: Repricing opcodes](https://eips.ethereum.org/EIPS/eip-1884)
- [EIP-2929: Gas cost for state access](https://eips.ethereum.org/EIPS/eip-2929)
- [EIP-3529: Reduction in refunds](https://eips.ethereum.org/EIPS/eip-3529)
- [EIP-3855: PUSH0 instruction](https://eips.ethereum.org/EIPS/eip-3855)
- [EIP-1153: Transient storage](https://eips.ethereum.org/EIPS/eip-1153)
- [EIP-4844: Shard blob transactions](https://eips.ethereum.org/EIPS/eip-4844)