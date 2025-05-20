# EIP-3860 Implementation Details

## Overview

EIP-3860 introduces two key changes to the EVM's contract creation mechanism:

1. A size limit for initcode of 49152 bytes (2 * MAX_CODE_SIZE)
2. A gas cost of 2 gas per 32-byte word of initcode

This implementation enforces both aspects of the EIP in the CREATE and CREATE2 opcodes.

## Implementation Components

### 1. Constants in JumpTable.zig

Two new constants were added to support EIP-3860:

```zig
// EIP-3860: Limit and meter initcode
pub const InitcodeWordGas: u64 = 2;          /// Gas per 32-byte word of initcode (EIP-3860)
pub const MaxInitcodeSize: u64 = 49152;      /// Maximum initcode size (2 * 24576 bytes) (EIP-3860)
```

### 2. Chain Rules Flag

In Evm.zig, the IsEIP3860 flag in the ChainRules struct controls whether EIP-3860 is active:

```zig
/// Is EIP3860 rules enabled (Shanghai, limit and meter initcode)
/// Limits maximum initcode size and adds gas metering
IsEIP3860: bool = true,
```

This flag is set based on the hardfork, being enabled for Shanghai and later hardforks.

### 3. Size Limit Check in CREATE and CREATE2 Opcodes

Both the CREATE and CREATE2 opcodes check the initcode size and reject executions that exceed the limit:

```zig
// EIP-3860: Limit and meter initcode
// Check if initcode size exceeds MAX_INITCODE_SIZE (49152 bytes)
if (interpreter.evm.chainRules.IsEIP3860 and size_usize > JumpTableModule.MaxInitcodeSize) {
    file_logger.err("EIP-3860: Initcode size exceeds maximum allowed size: {} > {}", .{size_usize, JumpTableModule.MaxInitcodeSize});
    try frame.stack.push(0); // Failure
    return "";
}
```

### 4. Gas Metering Implementation

The `createGas` function was modified to include the additional gas cost for initcode:

```zig
// EIP-3860: Add gas cost for initcode (2 gas per 32-byte word)
if (interpreter.evm.chainRules.IsEIP3860 and size_usize > 0) {
    const word_count = (size_usize + 31) / 32; // Round up division to get word count
    const initcode_gas_cost = word_count * JumpTableModule.InitcodeWordGas;
    gas += initcode_gas_cost;
    
    file_logger.debug("EIP-3860 gas cost for initcode: {} words * {} gas = {} gas", 
        .{word_count, JumpTableModule.InitcodeWordGas, initcode_gas_cost});
}
```

## Important Details

### Word Size Calculation

The gas cost is determined based on word count, where a word is 32 bytes. The calculation uses a ceiling division to ensure partial words are counted as full words:

```zig
const word_count = (size_usize + 31) / 32; // Round up division to get word count
```

### Error Handling

When initcode exceeds the maximum allowed size, the operation fails silently (by pushing 0 to the stack) rather than reverting the entire transaction. This aligns with how other EVM errors in creation are handled.

### Gas Calculation Specifics

1. The base gas cost for contract creation remains the same (CREATE_GAS = 32000)
2. For each full or partial 32-byte word of initcode, 2 additional gas is charged
3. The base gas is charged first, and if there's not enough gas, the operation fails
4. The additional initcode gas metering is only applied when EIP-3860 is active

## Test Suite

Comprehensive tests have been created in `eip3860.test.zig` to verify:

1. CREATE and CREATE2 reject oversized initcode with EIP-3860 enabled
2. CREATE and CREATE2 accept valid initcode sizes with EIP-3860 enabled
3. CREATE and CREATE2 accept any size with EIP-3860 disabled
4. Gas cost calculation includes initcode gas with EIP-3860 enabled
5. Gas cost calculation does not include initcode gas with EIP-3860 disabled

## Edge Cases

### Initcode Size of Zero

When initcode size is 0, no additional gas is charged, as word_count would be 0.

### Word Count Calculation

The word count calculation correctly handles the edge case where the size is not an exact multiple of 32 bytes by rounding up.

### Maximum Size Exactly Allowed

The implementation correctly allows initcode that is exactly 49152 bytes in size.

### Gas Cost for Empty Initcode

For empty initcode (size = 0), no additional gas cost is applied.

## Future Considerations

While this implementation fully satisfies EIP-3860, a complete solution would integrate with a fuller transaction validation system to reject transactions with oversized initcode before they're included in a block. However, that is outside the scope of the EVM implementation.