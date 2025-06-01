const std = @import("std");
const Memory = @import("Memory.zig");
const Stack = @import("Stack.zig");
const Contract = @import("Contract.zig");
const ExecutionError = @import("ExecutionError.zig");

const Self = @This();

op: []const u8 = undefined,
pc: usize = 0,
cost: u64 = 0,
err: ?ExecutionError.Error = null,
memory: Memory,
stack: Stack,
contract: *Contract,
returnData: ?[]u8 = null,
allocator: std.mem.Allocator,
stop: bool = false,

pub fn init(allocator: std.mem.Allocator, contract: *Contract) Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = Memory.init(allocator) catch @panic("Failed to initialize memory"),
        .stack = .{},
    };
}

pub fn initWithState(
    allocator: std.mem.Allocator,
    contract: *Contract,
    op: ?[]const u8,
    pc: ?usize,
    cost: ?u64,
    err: ?ExecutionError.Error,
    memory: ?Memory,
    stack: ?Stack,
    returnData: ?[]u8,
    stop: ?bool,
) Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = memory orelse Memory.init(allocator) catch @panic("Failed to initialize memory"),
        .stack = stack orelse .{},
        .op = op orelse undefined,
        .pc = pc orelse 0,
        .cost = cost orelse 0,
        .err = err,
        .returnData = returnData,
        .stop = stop orelse false,
    };
}
