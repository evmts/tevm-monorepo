const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack.zig");
const Contract = @import("contract.zig");
const ExecutionError = @import("execution_error.zig");
const logger = @import("logger.zig").logger;

/// Error types for Frame operations
pub const FrameError = error{
    OutOfMemory,
    InvalidContract,
    InvalidMemoryOperation,
    InvalidStackOperation,
};

const Self = @This();

op: []const u8 = undefined,
pc: usize = 0,
cost: u64 = 0,
err: ?ExecutionError.Error = null,
memory: Memory,
stack: Stack,
contract: *Contract,
return_data: ?[]u8 = null,
allocator: std.mem.Allocator,
stop: bool = false,
gas_remaining: u64 = 0,
is_static: bool = false,
return_data_buffer: []const u8 = &[_]u8{},
input: []const u8 = &[_]u8{},
depth: u32 = 0,
output: []const u8 = &[_]u8{},
program_counter: usize = 0,

pub fn init(allocator: std.mem.Allocator, contract: *Contract) FrameError!Self {
    // Don't call finalize_root here - let the caller do it after Frame is at its final location
    const memory = Memory.init_default(allocator) catch |err| {
        logger.debug("Failed to initialize memory: {any}", .{err});
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => FrameError.OutOfMemory,
        };
    };

    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = memory,
        .stack = .{},
    };
}

pub fn init_with_state(
    allocator: std.mem.Allocator,
    contract: *Contract,
    op: ?[]const u8,
    pc: ?usize,
    cost: ?u64,
    err: ?ExecutionError.Error,
    memory: ?Memory,
    stack: ?Stack,
    return_data: ?[]u8,
    stop: ?bool,
    gas_remaining: ?u64,
    is_static: ?bool,
    return_data_buffer: ?[]const u8,
    input: ?[]const u8,
    depth: ?u32,
    output: ?[]const u8,
    program_counter: ?usize,
) FrameError!Self {
    // Create memory if not provided
    const mem: Memory = if (memory) |m| m else blk: {
        const new_memory = Memory.init_default(allocator) catch |mem_err| {
            logger.debug("Failed to initialize memory: {any}", .{mem_err});
            return switch (mem_err) {
                std.mem.Allocator.Error.OutOfMemory => FrameError.OutOfMemory,
            };
        };
        // Don't finalize_root here - memory will be copied
        break :blk new_memory;
    };

    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = mem,
        .stack = stack orelse .{},
        .op = op orelse undefined,
        .pc = pc orelse 0,
        .cost = cost orelse 0,
        .err = err,
        .return_data = return_data,
        .stop = stop orelse false,
        .gas_remaining = gas_remaining orelse 0,
        .is_static = is_static orelse false,
        .return_data_buffer = return_data_buffer orelse &[_]u8{},
        .input = input orelse &[_]u8{},
        .depth = depth orelse 0,
        .output = output orelse &[_]u8{},
        .program_counter = program_counter orelse 0,
    };
}

pub fn deinit(self: *Self) void {
    self.memory.deinit();
}

pub fn consume_gas(self: *Self, amount: u64) ExecutionError.Error!void {
    if (amount > self.gas_remaining) {
        return ExecutionError.Error.OutOfGas;
    }
    self.gas_remaining -= amount;
}
