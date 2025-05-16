const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;

/// EVM execution state 
pub const ExecutionState = struct {
    memory: Memory,
    stack: Stack,
    pc: usize,
    gas: struct {
        remaining: u64,
        refunded: u64,
    },
    returnData: []const u8,
    
    pub fn init(allocator: std.mem.Allocator, gasLimit: u64) ExecutionState {
        return ExecutionState{
            .memory = Memory.init(allocator),
            .stack = Stack.init(allocator),
            .pc = 0,
            .gas = .{
                .remaining = gasLimit,
                .refunded = 0,
            },
            .returnData = &[_]u8{},
        };
    }
    
    pub fn deinit(self: *ExecutionState) void {
        self.memory.deinit();
        self.stack.deinit();
    }
};