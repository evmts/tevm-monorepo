# EIP-1153 Implementation Details

## Overview

EIP-1153 adds transient storage to the EVM, introducing two new opcodes:
- `TLOAD` (0x5C): Load a value from transient storage
- `TSTORE` (0x5D): Store a value to transient storage

Transient storage persists only for the duration of a transaction, including all internal calls made during that transaction, and is automatically cleared afterward.

## Implementation Components

1. **Chain Rules Flag**
   - Added `IsEIP1153` flag to the `ChainRules` struct in `Evm.zig`
   - This flag controls whether the TLOAD and TSTORE opcodes are active

2. **Transient Storage Data Structure**
   - The EVM maintains a transient storage map in the `TransientStorage` struct
   - This is a simple mapping of 32-byte keys to 32-byte values

3. **TLOAD and TSTORE Implementations**
   - Both opcodes check the `IsEIP1153` flag before executing
   - `TLOAD`: Retrieves a value from transient storage at the specified key
   - `TSTORE`: Stores a value in transient storage at the specified key

4. **Gas Costs**
   - Both TLOAD and TSTORE have a flat gas cost of 100 gas
   - No additional gas costs for "cold" access (unlike SLOAD/SSTORE in EIP-2929)
   - No gas refunds (unlike SSTORE)

5. **Transaction Boundaries**
   - Transient storage is cleared at the beginning of each transaction
   - The EVM's `execute` or `executeTransaction` method is responsible for clearing the transient storage

## Code Implementation

### Opcode Definitions

The implementation in `transient.zig` includes:

```zig
/// TLOAD operation - loads a value from transient storage at the specified key
/// EIP-1153: Transient Storage
pub fn opTload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-1153 is enabled
    if (!interpreter.evm.chainRules.IsEIP1153) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Get the key from the stack
    const key = try frame.stack.pop();
    
    // Load value from transient storage (defaults to 0 if not set)
    var value: u256 = 0;
    if (interpreter.evm.transient_storage) |ts| {
        if (ts.get(key)) |stored_value| {
            value = stored_value;
        }
    }
    
    // Push the value onto the stack
    try frame.stack.push(value);
    
    return "";
}

/// TSTORE operation - stores a value to transient storage at the specified key
/// EIP-1153: Transient Storage
pub fn opTstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-1153 is enabled
    if (!interpreter.evm.chainRules.IsEIP1153) {
        return ExecutionError.InvalidOpcode;
    }
    
    // Pop key and value from the stack
    const key = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    // Store the value in transient storage
    if (interpreter.evm.transient_storage) |ts| {
        try ts.set(key, value);
    }
    
    return "";
}
```

### Gas Costs

Gas costs are handled in the `JumpTable.zig`:

```zig
JumpTable[TLOAD] = JumpTableEntry{
    .handler = opTload,
    .gas_cost = 100,
    .stack_in_size = 1,
    .stack_out_size = 1,
};

JumpTable[TSTORE] = JumpTableEntry{
    .handler = opTstore,
    .gas_cost = 100,
    .stack_in_size = 2,
    .stack_out_size = 0,
};
```

### Transient Storage Implementation

The TransientStorage struct:

```zig
pub const TransientStorage = struct {
    storage: std.AutoHashMap(u256, u256),
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) !*TransientStorage {
        var ts = try allocator.create(TransientStorage);
        ts.storage = std.AutoHashMap(u256, u256).init(allocator);
        ts.allocator = allocator;
        return ts;
    }

    pub fn deinit(self: *TransientStorage) void {
        self.storage.deinit();
        self.allocator.destroy(self);
    }

    pub fn get(self: *const TransientStorage, key: u256) ?u256 {
        return self.storage.get(key);
    }

    pub fn set(self: *TransientStorage, key: u256, value: u256) !void {
        try self.storage.put(key, value);
    }

    pub fn clear(self: *TransientStorage) void {
        self.storage.clearRetainingCapacity();
    }
};
```

### Hardfork Configuration

The EIP-1153 flag is set in the hardfork configuration:

```zig
// From Evm.zig
pub fn forHardfork(allocator: std.mem.Allocator, hardfork: Hardfork) !Evm {
    return switch (hardfork) {
        // Earlier hardforks...
        
        .Paris => init(allocator, .{
            // Paris configuration...
            .IsEIP1153 = false, // Not yet enabled
        }),
        .Shanghai => init(allocator, .{
            // Shanghai configuration...
            .IsEIP1153 = false, // Not yet enabled
        }),
        .Cancun => init(allocator, .{
            // Cancun configuration...
            .IsEIP1153 = true, // Enabled in Cancun
        }),
        .Latest => init(allocator, .{
            // Latest configuration...
            .IsEIP1153 = true, // Enabled in Latest
        }),
    };
}
```

## Usage Notes

1. Transient storage is separate from regular storage:
   - `SLOAD`/`SSTORE` operate on permanent contract storage
   - `TLOAD`/`TSTORE` operate on temporary transaction-bound storage

2. Transient storage doesn't persist across transactions:
   - All values are cleared at the end of each transaction
   - This is true even for failed transactions (reverts)

3. Transient storage isn't included in state roots:
   - It doesn't affect the blockchain state
   - It doesn't appear in account snapshots or state proofs

4. Ideal for within-transaction data passing:
   - Sharing data between different contract calls within the same transaction
   - Storing temporary flags and state (like reentrancy guards)
   - Reducing gas costs for temporary data storage