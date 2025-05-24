# Frame Implementation Issue

## Overview

Frame.zig provides the execution context for EVM operations, managing the stack, memory, program counter, and other execution state for a single call frame with support for nested calls and proper resource management.

## Requirements

- Manage execution state (PC, stack, memory, gas)
- Track current operation and costs
- Handle return data from calls
- Support error propagation and halt conditions
- Provide clean initialization and cleanup
- Enable state inspection for debugging
- Maintain contract context (caller, value, etc.)
- Track execution depth for call limits
- Support both regular and static call contexts
- Optimize for common execution patterns

## Interface

```zig
const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;
const Contract = @import("Contract.zig").Contract;
const Address = @import("address").Address;
const Gas = @import("Gas.zig").Gas;

pub const FrameError = error{
    OutOfMemory,
    StackError,
    InvalidPC,
    ExecutionHalted,
};

/// Execution halt reasons
pub const HaltReason = enum {
    None,
    Stop,
    Return,
    Revert,
    OutOfGas,
    InvalidOpcode,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    WriteProtection,
    DepthLimit,
    InvalidCall,
};

pub const Frame = struct {
    /// EVM stack (operand stack)
    stack: Stack,
    /// EVM memory (byte-addressable)
    memory: Memory,
    /// Contract being executed
    contract: *Contract,
    /// Gas meter for this frame
    gas: *Gas,
    /// Program counter
    pc: usize,
    /// Return data from last call
    return_data: ?[]u8,
    /// Halt reason if execution stopped
    halt_reason: HaltReason,
    /// Whether frame is in static mode (no state changes)
    is_static: bool,
    /// Call depth (for limit checking)
    depth: u32,
    /// Memory allocator
    allocator: std.mem.Allocator,

    // Initialization

    /// Create a new execution frame
    pub fn init(
        allocator: std.mem.Allocator,
        contract: *Contract,
        gas: *Gas,
        is_static: bool,
        depth: u32,
    ) !Frame {
        return Frame{
            .stack = Stack{},
            .memory = try Memory.init(allocator),
            .contract = contract,
            .gas = gas,
            .pc = 0,
            .return_data = null,
            .halt_reason = .None,
            .is_static = is_static,
            .depth = depth,
            .allocator = allocator,
        };
    }

    /// Clean up frame resources
    pub fn deinit(self: *Frame) void {
        self.memory.deinit();
        if (self.return_data) |data| {
            self.allocator.free(data);
        }
    }

    // Execution Control

    /// Get current operation byte
    pub inline fn currentOp(self: *const Frame) ?u8 {
        if (self.pc >= self.contract.code.len) {
            return null;
        }
        return self.contract.code[self.pc];
    }

    /// Advance program counter
    pub inline fn advance(self: *Frame, n: usize) void {
        self.pc += n;
    }

    /// Jump to address (with validation)
    pub fn jump(self: *Frame, dest: usize) FrameError!void {
        if (dest >= self.contract.code.len) {
            self.halt_reason = .InvalidJump;
            return error.InvalidPC;
        }
        self.pc = dest;
    }

    /// Check if execution should halt
    pub inline fn shouldHalt(self: *const Frame) bool {
        return self.halt_reason != .None;
    }

    /// Halt execution with reason
    pub inline fn halt(self: *Frame, reason: HaltReason) void {
        self.halt_reason = reason;
    }

    // Stack Operations (delegated)

    /// Push value to stack
    pub inline fn push(self: *Frame, value: u256) !void {
        try self.stack.push(value);
    }

    /// Pop value from stack
    pub inline fn pop(self: *Frame) !u256 {
        return try self.stack.pop();
    }

    /// Peek at stack top
    pub inline fn peek(self: *Frame) !*u256 {
        return try self.stack.peek();
    }

    /// Duplicate stack item
    pub inline fn dup(self: *Frame, n: usize) !void {
        try self.stack.dup(n);
    }

    /// Swap stack items
    pub inline fn swap(self: *Frame, n: usize) !void {
        try self.stack.swap(n);
    }

    // Memory Operations

    /// Ensure memory is sized for access
    pub fn ensureMemory(self: *Frame, offset: usize, size: usize) !void {
        if (size == 0) return;

        const required = offset + size;
        const mem_result = self.gas.memoryGasCost(offset, size);
        if (mem_result.overflow) {
            return error.OutOfMemory;
        }

        try self.gas.consume(mem_result.cost);
        try self.memory.resize(required);
        self.gas.expandMemory(required);
    }

    /// Read word from memory
    pub fn readMemoryWord(self: *Frame, offset: usize) !u256 {
        try self.ensureMemory(offset, 32);
        const word = try self.memory.getWord(offset);
        var result: u256 = 0;
        for (word) |byte| {
            result = (result << 8) | byte;
        }
        return result;
    }

    /// Write word to memory
    pub fn writeMemoryWord(self: *Frame, offset: usize, value: u256) !void {
        try self.ensureMemory(offset, 32);
        var word: [32]u8 = undefined;
        var val = value;
        var i: usize = 32;
        while (i > 0) {
            i -= 1;
            word[i] = @truncate(u8, val);
            val >>= 8;
        }
        try self.memory.setWord(offset, word);
    }

    /// Read bytes from memory
    pub fn readMemory(self: *Frame, offset: usize, size: usize) ![]const u8 {
        if (size == 0) return &[_]u8{};
        try self.ensureMemory(offset, size);
        return try self.memory.getSlice(offset, size);
    }

    /// Write bytes to memory
    pub fn writeMemory(self: *Frame, offset: usize, data: []const u8) !void {
        if (data.len == 0) return;
        try self.ensureMemory(offset, data.len);
        try self.memory.setData(offset, data);
    }

    // Return Data Management

    /// Set return data from execution
    pub fn setReturnData(self: *Frame, data: []const u8) !void {
        // Free existing return data
        if (self.return_data) |old_data| {
            self.allocator.free(old_data);
        }

        // Allocate and copy new data
        if (data.len > 0) {
            self.return_data = try self.allocator.dupe(u8, data);
        } else {
            self.return_data = null;
        }
    }

    /// Get return data slice
    pub fn getReturnData(self: *const Frame) []const u8 {
        return self.return_data orelse &[_]u8{};
    }

    /// Get return data size
    pub fn getReturnDataSize(self: *const Frame) usize {
        if (self.return_data) |data| {
            return data.len;
        }
        return 0;
    }

    // Context Accessors

    /// Get caller address
    pub inline fn getCaller(self: *const Frame) Address {
        return self.contract.caller;
    }

    /// Get contract address
    pub inline fn getAddress(self: *const Frame) Address {
        return self.contract.address;
    }

    /// Get call value
    pub inline fn getValue(self: *const Frame) u256 {
        return self.contract.value;
    }

    /// Get call input data
    pub inline fn getInput(self: *const Frame) []const u8 {
        return self.contract.input;
    }

    /// Get contract code
    pub inline fn getCode(self: *const Frame) []const u8 {
        return self.contract.code;
    }

    /// Get code size
    pub inline fn getCodeSize(self: *const Frame) usize {
        return self.contract.code.len;
    }

    /// Check if valid jump destination
    pub fn isValidJump(self: *const Frame, dest: usize) bool {
        if (dest >= self.contract.code.len) return false;
        if (self.contract.code[dest] != 0x5b) return false; // JUMPDEST
        return self.contract.isValidJumpdest(dest);
    }

    // State Inspection

    /// Get current stack depth
    pub inline fn stackDepth(self: *const Frame) usize {
        return self.stack.len();
    }

    /// Get current memory size
    pub inline fn memorySize(self: *const Frame) usize {
        return self.memory.size();
    }

    /// Check if frame can write state
    pub inline fn canWrite(self: *const Frame) bool {
        return !self.is_static;
    }

    /// Check if at depth limit
    pub inline fn atDepthLimit(self: *const Frame) bool {
        return self.depth >= 1024;
    }

    // Debug Support

    /// Dump frame state (for debugging)
    pub fn dumpState(self: *const Frame) void {
        std.debug.print("Frame State:\n", .{});
        std.debug.print("  PC: {}\n", .{self.pc});
        std.debug.print("  Gas: {}\n", .{self.gas.remaining});
        std.debug.print("  Stack depth: {}\n", .{self.stack.len()});
        std.debug.print("  Memory size: {}\n", .{self.memory.size()});
        std.debug.print("  Depth: {}\n", .{self.depth});
        std.debug.print("  Static: {}\n", .{self.is_static});
        if (self.halt_reason != .None) {
            std.debug.print("  Halted: {}\n", .{self.halt_reason});
        }
    }

    /// Get stack as slice (for debugging)
    pub fn getStackSlice(self: *const Frame) []const u256 {
        return self.stack.data[0..self.stack.size];
    }

    /// Get memory as slice (for debugging)
    pub fn getMemorySlice(self: *const Frame) []const u8 {
        return self.memory.data.items;
    }
};
```

## Implementation Notes

### Memory Expansion

Memory expansion must be handled before any memory access:

```zig
pub fn ensureMemory(self: *Frame, offset: usize, size: usize) !void {
    if (size == 0) return;

    // Calculate required size
    const required = offset + size;

    // Calculate gas cost for expansion
    const mem_result = self.gas.memoryGasCost(self.memory.size(), required);
    if (mem_result.overflow) {
        self.halt_reason = .OutOfGas;
        return error.OutOfMemory;
    }

    // Charge gas before expanding
    self.gas.consume(mem_result.cost) catch {
        self.halt_reason = .OutOfGas;
        return error.OutOfGas;
    };

    // Expand memory
    try self.memory.resize(required);
    self.gas.expandMemory(required);
}
```

### Stack Error Handling

Stack operations should set appropriate halt reasons:

```zig
pub fn pop(self: *Frame) !u256 {
    return self.stack.pop() catch |err| {
        switch (err) {
            error.StackUnderflow => self.halt_reason = .StackUnderflow,
            else => {},
        }
        return err;
    };
}
```

## Usage Example

```zig
// Create execution context
var contract = Contract{
    .address = contract_address,
    .caller = caller_address,
    .value = call_value,
    .input = call_data,
    .code = bytecode,
    // ... other fields
};

var gas_meter = Gas.init(gas_limit);
var frame = try Frame.init(allocator, &contract, &gas_meter, false, 0);
defer frame.deinit();

// Execute operations
while (!frame.shouldHalt()) {
    const op = frame.currentOp() orelse {
        frame.halt(.Stop);
        break;
    };

    switch (op) {
        0x01 => { // ADD
            const b = try frame.pop();
            const a = try frame.pop();
            try frame.push(a + b);
            frame.advance(1);
        },
        0x35 => { // CALLDATALOAD
            const offset = try frame.pop();
            const data = frame.getInput();
            var value: u256 = 0;
            // Load 32 bytes from calldata
            // ... implementation
            try frame.push(value);
            frame.advance(1);
        },
        // ... other opcodes
    }
}

// Get execution results
const return_data = frame.getReturnData();
const gas_used = gas_meter.used;
```

## Performance Considerations

1. **Inline Hot Functions**: Use `inline` for frequently called methods
2. **Stack/Memory Access**: Direct field access where possible
3. **Error Handling**: Fast paths for common cases
4. **Memory Pooling**: Reuse memory allocations across frames
5. **Lazy Initialization**: Defer return data allocation until needed

## Testing Requirements

1. **Basic Operations**:

   - Test frame initialization and cleanup
   - Test PC advancement and jumps
   - Test halt conditions

2. **Stack/Memory Integration**:

   - Test delegated stack operations
   - Test memory expansion and gas costs
   - Test memory read/write operations

3. **Context Management**:

   - Test static mode enforcement
   - Test depth limit checking
   - Test return data handling

4. **Error Cases**:

   - Test invalid jumps
   - Test out of gas scenarios
   - Test memory overflow

5. **Integration**:
   - Test with Contract
   - Test with Gas metering
   - Test nested frame creation

## References

- [Go-Ethereum interpreter.go](https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go)
- [evmone execution_state.hpp](https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp)
- [revm Interpreter](https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs)

## Reference Implementation Insights

### revm Approach

revm separates concerns into multiple components that compose the interpreter:

```rust
pub struct Interpreter<WIRE: InterpreterTypes = EthInterpreter> {
    pub bytecode: WIRE::Bytecode,
    pub stack: WIRE::Stack,
    pub return_data: WIRE::ReturnData,
    pub memory: WIRE::Memory,
    pub input: WIRE::Input,
    pub sub_routine: WIRE::SubRoutineStack,
    pub control: WIRE::Control,
    pub runtime_flag: WIRE::RuntimeFlag,
    pub extend: WIRE::Extend,
}
```

Key insights from revm:
1. **Shared Memory**: Uses `SharedMemory` type that can be shared between frames
2. **Runtime Flags**: Encapsulates execution mode (static, EOF, spec_id) in a separate struct
3. **Loop Control**: Separates execution control from frame state
4. **Subroutine Stack**: Supports EOF subroutines with dedicated stack
5. **Generic Types**: Uses trait-based design for extensibility

### evmone Approach

evmone optimizes for performance with careful memory management:

```cpp
class StackSpace {
    static constexpr auto limit = 1024;
    std::unique_ptr<uint256, Deleter> m_stack_space;
    
    // Allocates aligned memory for better cache performance
    static uint256* allocate() noexcept {
        static constexpr auto alignment = sizeof(uint256);
        static constexpr auto size = limit * sizeof(uint256);
        return static_cast<uint256*>(std::aligned_alloc(alignment, size));
    }
};

class Memory {
    static constexpr size_t page_size = 4 * 1024;  // Initial allocation
    // Grows with 2x factor
};
```

Key insights from evmone:
1. **Aligned Stack**: Stack items aligned to 256 bits for cache efficiency
2. **Memory Pages**: Uses 4KB initial allocation with 2x growth factor
3. **Stack Pointer**: Uses pointer arithmetic for stack operations
4. **Execution State**: Minimal state tracking for performance

### Optimization Opportunities

1. **Memory Pooling**: Both revm and evmone reuse memory allocations
2. **Stack as Array**: Direct array access is faster than dynamic structures
3. **Inline Everything**: Hot path functions should be inlined
4. **Separate Concerns**: Keep execution control separate from resource management
5. **Minimal Abstractions**: Avoid virtual calls in the execution loop

## Tests

These are tests from prototype for reference

```zig
const std = @import("std");
const testing = std.testing;

const Frame = @import("evm").Frame;
const ExecutionError = @import("interpreter.zig").InterpreterError;
const Contract = @import("Contract.zig").Contract;
const u256_native = u256;

const address = @import("address");
const Address = address.Address;

// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    return addr;
}

test "Frame initialization and basic operations" {
    const allocator = std.testing.allocator;

    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();

    try std.testing.expectEqual(@as(usize, 0), frame.pc);
    try std.testing.expectEqual(@as(u64, 0), frame.cost);
    try std.testing.expect(frame.err == null);

    try frame.memory.resize(64);
    try std.testing.expectEqual(@as(u64, 64), frame.memory.len());

    try frame.stack.push(42);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.len());

    const test_data = [_]u8{ 1, 2, 3, 4 };
    try frame.setReturnData(&test_data);
    try std.testing.expectEqual(@as(usize, 4), frame.returnSize);
    try std.testing.expectEqualSlices(u8, &test_data, frame.returnData.?);

    try std.testing.expectEqual(caller, frame.caller());
    try std.testing.expectEqual(contract_addr, frame.address());
    try std.testing.expectEqual(@as(u256, 100), frame.callValue());
}

test "Frame memory and stack access" {
    const allocator = std.testing.allocator;

    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();

    try frame.memory.resize(32);
    const data = [_]u8{0xFF} ** 8;
    if (@hasDecl(@TypeOf(frame.memory), "set")) {
        try frame.memory.set(0, data.len, &data);
    } else if (@hasDecl(@TypeOf(frame.memory), "store")) {
        try frame.memory.store(0, &data);
    }

    const mem_data = frame.memoryData();
    try std.testing.expectEqualSlices(u8, &data, mem_data[0..data.len]);

    try frame.stack.push(123);
    try frame.stack.push(456);

    const stack_data = frame.stackData();
    try std.testing.expectEqual(@as(usize, 2), stack_data.len);
    try std.testing.expectEqual(@as(u256, 123), stack_data[0]);
    try std.testing.expectEqual(@as(u256, 456), stack_data[1]);
}

test "Frame error handling" {
    const allocator = std.testing.allocator;

    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);

    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();

    frame.err = ExecutionError.OutOfGas;

    try std.testing.expectEqual(ExecutionError.OutOfGas, frame.err.?);
}
```
