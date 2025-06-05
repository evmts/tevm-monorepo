# EVM Gas Calculation Rules

This document details the gas calculation rules for EVM opcodes, including both static and dynamic gas costs as defined in the Ethereum Yellow Paper and various EIPs.

## Table of Contents

1. [Gas Cost Categories](#gas-cost-categories)
2. [Static Gas Costs](#static-gas-costs)
3. [Dynamic Gas Calculations](#dynamic-gas-calculations)
4. [Memory Expansion Costs](#memory-expansion-costs)
5. [Storage Operation Costs](#storage-operation-costs)
6. [Call Operation Costs](#call-operation-costs)
7. [Hardfork-Specific Changes](#hardfork-specific-changes)
8. [Implementation Guidelines](#implementation-guidelines)

## Gas Cost Categories

Gas costs in the EVM fall into several categories:

- **GasZero** (0): Free operations
- **GasQuickStep** (2): Very fast operations  
- **GasFastestStep** (3): Fastest paid operations
- **GasFastStep** (5): Fast operations
- **GasMidStep** (8): Medium cost operations
- **GasSlowStep** (10): Slow operations
- **GasExtStep** (20+): External/expensive operations

## Static Gas Costs

These opcodes have fixed gas costs regardless of input:

### Zero Cost (0 gas)
- `STOP`, `RETURN`, `REVERT`, `INVALID`, `SELFDESTRUCT` (base cost)

### Quick Operations (2 gas)
- Stack: `POP`
- Environment: `ADDRESS`, `ORIGIN`, `CALLER`, `CALLVALUE`, `CALLDATASIZE`, `CODESIZE`, `GASPRICE`, `RETURNDATASIZE`
- Block: `COINBASE`, `TIMESTAMP`, `NUMBER`, `DIFFICULTY`, `GASLIMIT`, `CHAINID`, `BASEFEE`, `BLOBBASEFEE`

### Fastest Operations (3 gas)
- Arithmetic: `ADD`, `SUB`, `NOT`, `LT`, `GT`, `SLT`, `SGT`, `EQ`, `ISZERO`
- Bitwise: `AND`, `OR`, `XOR`, `BYTE`, `SHL`, `SHR`, `SAR`
- Stack: `PUSH1`-`PUSH32`, `DUP1`-`DUP16`, `SWAP1`-`SWAP16`
- Memory: `MLOAD`, `MSTORE`, `MSTORE8`
- Control: `JUMP`, `JUMPI`, `PC`, `MSIZE`, `GAS`, `JUMPDEST`
- System: `BLOBHASH`

### Fast Operations (5 gas)
- Arithmetic: `MUL`, `DIV`, `SDIV`, `MOD`, `SMOD`, `SIGNEXTEND`
- Stack: `PUSH0` (Shanghai+)

### Medium Operations (8 gas)
- Arithmetic: `ADDMOD`, `MULMOD`

### Slow Operations (10 gas)
- Arithmetic: `EXP` (base cost, see dynamic calculation)

## Dynamic Gas Calculations

Many opcodes have dynamic gas costs based on their inputs or current state:

### 1. EXP (Exponentiation)
```
gas = 10 + 50 * byte_size_of_exponent

where byte_size_of_exponent = ⌈log₂₅₆(exponent + 1)⌉
```

### 2. SHA3/KECCAK256
```
gas = 30 + 6 * ⌈data_size / 32⌉

where data_size is the number of bytes to hash
```

### 3. CALLDATACOPY, CODECOPY, RETURNDATACOPY
```
gas = 3 + 3 * ⌈data_size / 32⌉ + memory_expansion_cost

where data_size is the number of bytes to copy
```

### 4. EXTCODECOPY
```
gas = 700 + 3 * ⌈data_size / 32⌉ + memory_expansion_cost + access_cost

where:
- data_size is the number of bytes to copy
- access_cost = 2600 if address is cold, 0 if warm (Berlin+)
```

### 5. LOG Operations (LOG0-LOG4)
```
gas = 375 + 375 * num_topics + 8 * data_size + memory_expansion_cost

where:
- num_topics = 0 for LOG0, 1 for LOG1, etc.
- data_size is the number of bytes in the log data
```

### 6. MCOPY (Memory Copy - Cancun+)
```
gas = 3 + 3 * ⌈data_size / 32⌉ + memory_expansion_cost

Similar to other copy operations but copies within memory
```

## Memory Expansion Costs

Memory expansion happens when an operation accesses memory beyond the current allocated size:

```
memory_cost = memory_gas_cost(new_size) - memory_gas_cost(current_size)

where memory_gas_cost(size_in_bytes) = 
    size_in_words = ⌈size_in_bytes / 32⌉
    3 * size_in_words + size_in_words² / 512
```

Operations that trigger memory expansion:
- `MLOAD`, `MSTORE`, `MSTORE8`
- `CALLDATACOPY`, `CODECOPY`, `RETURNDATACOPY`, `EXTCODECOPY`
- `MCOPY`, `CREATE`, `CREATE2`
- `CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`
- `LOG0`, `LOG1`, `LOG2`, `LOG3`, `LOG4`
- `RETURN`, `REVERT`

## Storage Operation Costs

Storage operations have complex gas calculations that depend on current and new values:

### SLOAD
- **Pre-Berlin**: 800 gas (Istanbul), 200 gas (Tangerine Whistle), 50 gas (Frontier)
- **Berlin+**: 
  - Cold access: 2100 gas
  - Warm access: 100 gas

### SSTORE
- **Pre-Berlin**: Complex rules based on current and new values
- **Berlin+**:
  - Cold access: 22100 gas (20000 + 2100)
  - Warm access: 20000 gas base
  
Additional rules:
- Setting from zero to non-zero: 20000 gas
- Setting from non-zero to zero: refund 15000 gas (capped)
- Modifying existing non-zero: 5000 gas (pre-Berlin) or 2900 gas (Berlin+)
- No-op (same value): 200 gas (Istanbul+) or 100 gas (Berlin+)

### Transient Storage (Cancun+)
- `TLOAD`: 100 gas
- `TSTORE`: 100 gas

## Call Operation Costs

Call operations have the most complex gas calculations:

### Base Formula
```
total_gas = base_cost + value_transfer_cost + new_account_cost + 
            access_cost + memory_expansion_cost - gas_to_call

where:
- base_cost = 700 (pre-Berlin) or 0 (Berlin+)
- value_transfer_cost = 9000 if value > 0, else 0
- new_account_cost = 25000 if creating new account, else 0
- access_cost = 2600 if address is cold (Berlin+), else 0
- gas_to_call = min(requested_gas, all_but_one_64th)
```

### CREATE and CREATE2
```
gas = 32000 + 200 * init_code_size + memory_expansion_cost + 
      hash_cost (CREATE2 only)

where:
- init_code_size is the size of initialization code
- hash_cost = 6 * ⌈init_code_size / 32⌉ (CREATE2 only)
```

## Hardfork-Specific Changes

### Tangerine Whistle (EIP-150)
- Increased costs for IO-heavy operations:
  - `BALANCE`: 20 → 400
  - `EXTCODESIZE`, `EXTCODECOPY`: 20 → 700
  - `SLOAD`: 50 → 200
  - `CALL`, `CALLCODE`, `DELEGATECALL`: 40 → 700
  - `SELFDESTRUCT`: 0 → 5000

### Istanbul (EIP-1884)
- Further adjustments:
  - `BALANCE`: 400 → 700
  - `SLOAD`: 200 → 800

### Berlin (EIP-2929)
- Introduced access lists and cold/warm accounting:
  - Cold address access: 2600 gas
  - Cold storage slot: 2100 gas
  - Warm access: 100 gas
  - Base costs for state-accessing opcodes set to 0

### London (EIP-3529)
- Reduced refunds:
  - `SELFDESTRUCT` refund removed
  - `SSTORE` refund reduced

## Implementation Guidelines

### 1. Gas Consumption Pattern
```zig
// Calculate dynamic gas first
const dynamic_gas = calculate_dynamic_gas(params);

// Check if enough gas available
if (frame.gas_remaining < dynamic_gas) {
    return ExecutionError.Error.OutOfGas;
}

// Consume the gas
frame.gas_remaining -= dynamic_gas;

// Execute operation
// ...
```

### 2. Memory Expansion
```zig
// Calculate memory expansion before operation
const current_size = frame.memory.size();
const new_size = offset + size;

if (new_size > current_size) {
    const expansion_cost = gas_constants.memory_gas_cost(new_size) - 
                          gas_constants.memory_gas_cost(current_size);
    
    if (frame.gas_remaining < expansion_cost) {
        return ExecutionError.Error.OutOfGas;
    }
    
    frame.gas_remaining -= expansion_cost;
}
```

### 3. Access List Tracking
```zig
// Check if address/slot is cold
const is_cold = vm.is_address_cold(address);

// Calculate access cost
const access_cost = if (is_cold) gas_constants.ColdAccountAccessCost else gas_constants.WarmStorageReadCost;

// Mark as warm for future access
if (is_cold) {
    vm.mark_address_warm(address);
}
```

### 4. Call Gas Calculation
```zig
// Calculate gas to give to called contract
const all_but_one_64th = frame.gas_remaining - (frame.gas_remaining / 64);
const gas_to_call = @min(requested_gas, all_but_one_64th);

// Calculate total cost including call
const total_cost = base_cost + value_transfer_cost + 
                   new_account_cost + access_cost;

if (frame.gas_remaining < total_cost + gas_to_call) {
    return ExecutionError.Error.OutOfGas;
}
```

## Testing Gas Calculations

All gas calculations should be tested against:
1. Ethereum Yellow Paper specifications
2. Official test vectors
3. Known gas consumption patterns
4. Edge cases (e.g., memory expansion to maximum size)

See `test/evm/gas/gas_accounting_test.zig` for comprehensive gas calculation tests.

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-1884: Repricing opcodes](https://eips.ethereum.org/EIPS/eip-1884)
- [EIP-2929: Access lists](https://eips.ethereum.org/EIPS/eip-2929)
- [EIP-3529: Reduction in refunds](https://eips.ethereum.org/EIPS/eip-3529)