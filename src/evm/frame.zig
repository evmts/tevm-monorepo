const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack.zig");
const Contract = @import("contract.zig");
const ExecutionError = @import("execution_error.zig");
const Log = @import("log.zig");

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

pub fn init(allocator: std.mem.Allocator, contract: *Contract) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = try Memory.init_default(allocator),
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
) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = memory orelse try Memory.init_default(allocator),
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

pub const ConsumeGasError = error{
    OutOfGas,
};
pub fn consume_gas(self: *Self, amount: u64) ConsumeGasError!void {
    if (amount > self.gas_remaining) {
        return ConsumeGasError.OutOfGas;
    }
    self.gas_remaining -= amount;
}
