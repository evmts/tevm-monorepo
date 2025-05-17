const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;

pub const InterpreterState = struct {
    // InterpreterState contains the execution state of the EVM interpreter
    
    // Core execution context
    op: []const u8 = undefined, // Current operation bytecode
    pc: usize = 0, // Program counter
    cost: u64 = 0, // Gas cost accumulated in the current execution
    
    // Execution resources
    mem: Memory = Memory.default(), // EVM memory
    stack: Stack = Stack.default(), // EVM stack
    
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
};

// Constructor for creating a new interpreter state
pub fn createInterpreterState() InterpreterState {
    return InterpreterState{};
}