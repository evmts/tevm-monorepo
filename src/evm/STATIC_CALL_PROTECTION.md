# Static Call Protection Implementation

This document describes how static call protection is implemented in the EVM to prevent state modifications during read-only contexts.

## Overview

Static calls (introduced in EIP-214 with the STATICCALL opcode) guarantee that no state modifications can occur during execution. This is enforced throughout the EVM to ensure security and predictability.

## Implementation Details

### VM-Level Protection

The VM maintains a `read_only` boolean flag that tracks whether execution is in a static context:

```zig
pub const Vm = struct {
    // ...
    read_only: bool = false,
    // ...
};
```

### Protected Operations

The following operations are protected against execution in static contexts:

1. **Storage Modifications**
   - `SSTORE` - Storage write
   - `TSTORE` - Transient storage write (EIP-1153)

2. **Account State Changes**
   - `CREATE` - Contract creation
   - `CREATE2` - Contract creation with deterministic address
   - `SELFDESTRUCT` - Contract destruction

3. **Value Transfers**
   - `CALL` with non-zero value
   - `CALLCODE` with non-zero value

4. **Event Emission**
   - `LOG0`, `LOG1`, `LOG2`, `LOG3`, `LOG4` - All logging operations

### Protection Methods

The VM provides protected versions of state-modifying methods:

```zig
// Core validation method
pub fn validate_static_context(self: *const Self) !void {
    if (self.read_only) {
        return error.WriteProtection;
    }
}

// Protected state modification methods
pub fn set_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) !void
pub fn set_transient_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) !void
pub fn set_balance_protected(self: *Self, address: Address.Address, balance: u256) !void
pub fn set_code_protected(self: *Self, address: Address.Address, code: []const u8) !void
pub fn emit_log_protected(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) !void
pub fn create_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) !CreateResult
pub fn create2_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) !CreateResult
pub fn selfdestruct_protected(self: *Self, contract: Address.Address, beneficiary: Address.Address) !void

// Value transfer validation
pub fn validate_value_transfer(self: *const Self, value: u256) !void {
    if (self.read_only and value != 0) {
        return error.WriteProtection;
    }
}
```

### Context Propagation

Static context is propagated through nested calls:

1. **Normal Execution**: `interpret()` - Sets `is_static = false`
2. **Static Execution**: `interpret_static()` - Sets `is_static = true`
3. **Context Preservation**: Once in static context, all nested calls remain static

```zig
pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) ![]const u8 {
    // Save previous read_only state
    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;
    
    // If entering a static context or already in one, maintain read-only
    self.read_only = self.read_only or is_static;
    
    // ... execution continues with protection enabled
}
```

### Frame-Level Checks

Each execution frame maintains its own `is_static` flag, synchronized with the VM's `read_only` state:

```zig
var frame = Frame.init(self.allocator, contract);
frame.is_static = self.read_only;
```

### Opcode-Level Implementation

Individual opcodes check the static context before performing state modifications:

```zig
// Example from SSTORE
if (frame.is_static) {
    return ExecutionError.Error.WriteProtection;
}

// Example from LOG operations
if (frame.is_static) {
    return ExecutionError.Error.WriteProtection;
}

// Example from CALL with value
if (frame.is_static and value != 0) {
    return ExecutionError.Error.WriteProtection;
}
```

## Error Handling

When a state modification is attempted in a static context, the operation returns:
- **Error**: `ExecutionError.Error.WriteProtection`
- **Description**: "Write to protected storage"

## Testing

Comprehensive tests are provided in `test/evm/static_call_protection_test.zig` covering:
- Storage operations (SSTORE, TSTORE)
- Balance modifications
- Code modifications
- Log emissions
- Contract creation (CREATE, CREATE2)
- Value transfers
- SELFDESTRUCT

## Security Considerations

1. **No Bypassing**: All state modifications must go through protected methods
2. **Context Inheritance**: Static context cannot be "downgraded" in nested calls
3. **Value Transfer Protection**: Even zero-value calls check the context
4. **Complete Coverage**: All state-modifying opcodes are protected

## Future Considerations

When implementing new state-modifying operations:
1. Always check `frame.is_static` or use VM's protected methods
2. Return `WriteProtection` error in static contexts
3. Add corresponding tests
4. Update this documentation

## References

- [EIP-214: New opcode STATICCALL](https://eips.ethereum.org/EIPS/eip-214)
- Ethereum Yellow Paper, Section 9.4.2 (Call Operations)