# EIP-3541 Implementation Details

## Overview

EIP-3541 introduces a new restriction in the EVM's contract creation mechanism:

- Reject new contract creation if the contract bytecode starts with the `0xEF` byte
- This change maintains forward compatibility for a potential EVM update that would change the meaning of bytecode starting with `0xEF`

The implementation enforces this check in both the `CREATE` and `CREATE2` opcodes.

## Implementation Components

### 1. Chain Rules Flag

In `Evm.zig`, the `IsEIP3541` flag in the `ChainRules` struct controls whether EIP-3541 is active:

```zig
/// Is EIP3541 rules enabled (London, reject new contracts that start with 0xEF)
/// Rejects new contract code starting with the 0xEF byte
IsEIP3541: bool = true,
```

This flag is set based on the hardfork, being enabled for London (July 2021) and later hardforks.

### 2. Bytecode Validation in CREATE and CREATE2 Opcodes

Both the `CREATE` and `CREATE2` opcodes check the bytecode's first byte and reject contracts starting with `0xEF`:

```zig
// EIP-3541: Reject new contracts starting with the 0xEF byte
if (interpreter.evm.chainRules.IsEIP3541 and contract_code.items.len > 0 and contract_code.items[0] == 0xEF) {
    file_logger.err("EIP-3541: Cannot deploy a contract starting with the 0xEF byte", .{});
    try frame.stack.push(0); // Failure
    return "";
}
```

## Important Details

### Error Handling

When a contract deployment is rejected due to EIP-3541, the operation fails silently (by pushing 0 to the stack) rather than reverting the entire transaction. This is consistent with how other EVM errors in contract creation are handled.

### Existing Contracts

This EIP and implementation only affect new contract deployments - existing contracts starting with `0xEF` (if any) remain valid and callable.

### Optimization

The implementation is minimal and only adds a small check to the contract creation path, with negligible performance impact.

## Test Suite

Comprehensive tests have been created in `eip3541.test.zig` to verify:

1. CREATE and CREATE2 reject contracts starting with 0xEF when EIP-3541 is enabled
2. CREATE and CREATE2 accept contracts not starting with 0xEF when EIP-3541 is enabled
3. CREATE and CREATE2 accept any contract (including those starting with 0xEF) when EIP-3541 is disabled

## Edge Cases

### Empty Contract

The implementation correctly handles the case of empty contract code (not affected by EIP-3541).

### Length Check

The implementation checks if `contract_code.items.len > 0` before examining the first byte to avoid out-of-bounds access.

## Future Considerations

While EIP-3541 only rejects a specific prefix (0xEF), future EVM upgrades might introduce further restrictions or new bytecode semantics. The current implementation can easily be extended to accommodate such changes.