const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;

// TODO rename Frame

pub const InterpreterState = struct {
    // InterpreterState contains the execution state of the EVM interpreter

    // Core execution context
    op: []const u8 = undefined, // Current operation bytecode
    pc: usize = 0, // Program counter
    cost: u64 = 0, // Gas cost accumulated in the current execution

    // Execution resources
    // Memory and Stack would be initialized during interpreter setup
    mem: ?Memory = null, // EVM memory
    stack: ?Stack = null, // EVM stack

    // Additional fields that could be added:
    // returnData: []u8, // Return data from last call
    // returnSize: usize, // Size of return data
    // depth: u16, // Call depth
    // err: ?Error, // Any error encountered during execution
    // lastTrace: ?Trace, // Execution trace

    // Methods that could be implemented:
    // - gasUsed: Calculate total gas used
    // - createSnapshot: Create a snapshot of the current state for reverting
    // - revertToSnapshot: Revert to a previous state snapshot
    // - clearReturnData: Clear return data buffer

    pub fn init(allocator: std.mem.Allocator) !InterpreterState {
        return InterpreterState{
            .mem = Memory.init(allocator),
            .stack = Stack.init(allocator),
        };
    }

    pub fn deinit(self: *InterpreterState) void {
        if (self.mem) |*mem| {
            mem.deinit();
        }
        if (self.stack) |*stack| {
            stack.deinit();
        }
    }
};

// Constructor for creating a new interpreter state
pub fn createInterpreterState(allocator: std.mem.Allocator) !InterpreterState {
    return InterpreterState.init(allocator);
}

// Tests
test "InterpreterState.init initializes with default values" {
    const allocator = std.testing.allocator;
    
    var state = try InterpreterState.init(allocator);
    defer state.deinit();
    
    // Check default values
    try std.testing.expectEqual(@as(usize, 0), state.pc);
    try std.testing.expectEqual(@as(u64, 0), state.cost);
    try std.testing.expect(state.mem != null);
    try std.testing.expect(state.stack != null);
}

test "InterpreterState.deinit properly cleans up resources" {
    const allocator = std.testing.allocator;
    
    var state = try InterpreterState.init(allocator);
    // Should not leak memory
    state.deinit();
    
    // Test double deinit is safe
    state.deinit();
}

test "InterpreterState fields can be modified" {
    const allocator = std.testing.allocator;
    
    var state = try InterpreterState.init(allocator);
    defer state.deinit();
    
    // Test modifying fields
    state.pc = 100;
    state.cost = 21000;
    state.op = &[_]u8{0x60, 0x00}; // PUSH1 0x00
    
    try std.testing.expectEqual(@as(usize, 100), state.pc);
    try std.testing.expectEqual(@as(u64, 21000), state.cost);
    try std.testing.expectEqualSlices(u8, &[_]u8{0x60, 0x00}, state.op);
}

test "createInterpreterState creates valid state" {
    const allocator = std.testing.allocator;
    
    var state = try createInterpreterState(allocator);
    defer state.deinit();
    
    try std.testing.expect(state.mem != null);
    try std.testing.expect(state.stack != null);
    try std.testing.expectEqual(@as(usize, 0), state.pc);
}

test "InterpreterState with null memory and stack" {
    var state = InterpreterState{};
    
    // Should handle null mem and stack safely
    state.deinit();
    
    try std.testing.expectEqual(@as(?Memory, null), state.mem);
    try std.testing.expectEqual(@as(?Stack, null), state.stack);
}
