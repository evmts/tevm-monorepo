# EIP-3541 Implementation Details

## Overview

EIP-3541 is implemented in the Tevm Zig EVM by adding a validation check in both the `CREATE` and `CREATE2` opcodes to reject contract creation if the contract bytecode starts with `0xEF`. This implementation is controlled by the `IsEIP3541` flag in the `ChainRules` struct. Note that this EIP reserves the `0xEF` prefix for future protocol upgrades.

## Code Structure

### Flag Declaration

The implementation begins with adding the `IsEIP3541` flag to the `ChainRules` struct in `evm.zig`:

```zig
pub const ChainRules = struct {
    // Other flags...
    
    /// Is EIP3541 rules enabled (London, reject new contracts that start with 0xEF)
    /// Rejects new contract code starting with the 0xEF byte
    IsEIP3541: bool = true,
    
    // Rest of the struct...
};
```

### Implementation in CREATE Opcode

The check is implemented in the `opCreate` function in `calls.zig`:

```zig
// Get the contract code
var contract_code = std.ArrayList(u8).init(interpreter.allocator);
defer contract_code.deinit();

if (size_usize > 0) {
    const mem = frame.memory.data();
    if (offset_usize + size_usize <= mem.len) {
        try contract_code.appendSlice(mem[offset_usize..offset_usize + size_usize]);
        
        // EIP-3541: Reject new contracts starting with the 0xEF byte
        if (interpreter.evm.chainRules.IsEIP3541 and contract_code.items.len > 0 and contract_code.items[0] == 0xEF) {
            file_logger.err("EIP-3541: Cannot deploy a contract starting with the 0xEF byte", .{});
            try frame.stack.push(0); // Failure
            return "";
        }
    } else {
        return ExecutionError.OutOfOffset;
    }
}
```

### Implementation in CREATE2 Opcode

Similarly, the check is implemented in the `opCreate2` function in `calls.zig`:

```zig
// Get the contract code
var contract_code = std.ArrayList(u8).init(interpreter.allocator);
defer contract_code.deinit();

if (size_usize > 0) {
    const mem = frame.memory.data();
    if (offset_usize + size_usize <= mem.len) {
        try contract_code.appendSlice(mem[offset_usize..offset_usize + size_usize]);
        
        // EIP-3541: Reject new contracts starting with the 0xEF byte
        if (interpreter.evm.chainRules.IsEIP3541 and contract_code.items.len > 0 and contract_code.items[0] == 0xEF) {
            file_logger.err("EIP-3541: Cannot deploy a contract starting with the 0xEF byte", .{});
            try frame.stack.push(0); // Failure
            return "";
        }
    } else {
        return ExecutionError.OutOfOffset;
    }
}
```

## Hardfork Integration

The EIP is enabled in the London hardfork, as shown in the `forHardfork` function in `evm.zig`:

```zig
// Berlin hardfork before London does not enable EIP-3541
.Berlin => {
    rules.IsLondon = false;
    rules.IsMerge = false;
    rules.IsShanghai = false;
    rules.IsCancun = false;
    rules.IsEIP1559 = false;
    rules.IsEIP3541 = false; // EIP-3541 not enabled in Berlin
    // Other EIPs...
},

// London hardfork enables EIP-3541
.London => {
    rules.IsMerge = false;
    rules.IsShanghai = false;
    rules.IsCancun = false;
    // EIP-3541 is enabled by default in the ChainRules struct
    // Other EIPs...
},
```

## Testing

The implementation is thoroughly tested in `eip3541.test.zig`, which includes:

1. Tests to verify that CREATE and CREATE2 reject contracts starting with 0xEF when EIP-3541 is enabled
2. Tests to verify that CREATE and CREATE2 accept contracts not starting with 0xEF when EIP-3541 is enabled
3. Tests to verify that CREATE and CREATE2 accept contracts starting with 0xEF when EIP-3541 is disabled

These tests use a custom `setupInterpreter` function to create an EVM instance with EIP-3541 either enabled or disabled, allowing for comprehensive testing of both scenarios.

## Error Handling

When a contract creation is rejected due to the 0xEF first byte, the implementation:

1. Logs an error message: "EIP-3541: Cannot deploy a contract starting with the 0xEF byte"
2. Pushes 0 onto the stack to indicate failure
3. Returns an empty string to continue execution

This ensures that contract creation fails correctly without causing the entire transaction to revert unnecessarily.

## Integration with Other EIPs

The EIP-3541 check is performed in the same section of code that also implements other contract creation-related EIPs, such as EIP-3860 (which limits initcode size). Both checks are executed independently, ensuring that all active restrictions are properly enforced.