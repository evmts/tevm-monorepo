const std = @import("std");
const Contract = @import("Contract.zig").Contract;
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;

const Allocator = std.mem.Allocator;

pub const Frame = struct {
    const Self = @This();

    allocator: Allocator,
    contract: *const Contract,
    pc: usize = 0,
    stack: Stack,
    memory: Memory,
    gas: u64 = 0,
    gas_used: u64 = 0,
    
    // Contract context
    caller: []u8 = &[_]u8{},
    callvalue: u256 = 0,
    calldata: []u8 = &[_]u8{},
    return_data: []u8 = &[_]u8{},
    
    // TODO: Add additional fields for contract state, storage, etc.

    pub fn create(allocator: Allocator, contract: *const Contract) Self {
        // Create stack and memory
        const stack = Stack.create(allocator) catch {
            // Handle error in production code
            @panic("Failed to create stack");
        };
        
        const memory = Memory.create(allocator) catch {
            // Handle error in production code
            @panic("Failed to create memory");
        };
        
        return Frame{
            .allocator = allocator,
            .contract = contract,
            .stack = stack,
            .memory = memory,
        };
    }

    pub fn destroy(self: *Self) void {
        self.stack.destroy();
        self.memory.destroy();
        // Cleanup will happen here in the future
    }
};