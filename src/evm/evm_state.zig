const std = @import("std");
const Address = @import("Address");
const EvmLog = @import("evm_log.zig");
const StorageKey = @import("storage_key.zig");
const Log = @import("log.zig");

const Self = @This();

allocator: std.mem.Allocator,
storage: std.AutoHashMap(StorageKey, u256),
balances: std.AutoHashMap(Address.Address, u256),
code: std.AutoHashMap(Address.Address, []const u8),
nonces: std.AutoHashMap(Address.Address, u64),
transient_storage: std.AutoHashMap(StorageKey, u256),
logs: std.ArrayList(EvmLog),

pub fn init(allocator: std.mem.Allocator) std.mem.Allocator.Error!Self {
    var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    return Self{
        .allocator = allocator,
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
    };
}

pub fn deinit(self: *Self) void {
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
    self.transient_storage.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();
}

// State access methods
pub fn get_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.storage.get(key) orelse 0;
}

pub fn set_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.storage.put(key, value);
}

pub fn get_balance(self: *const Self, address: Address.Address) u256 {
    return self.balances.get(address) orelse 0;
}

pub fn set_balance(self: *Self, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    try self.balances.put(address, balance);
}

pub fn get_code(self: *const Self, address: Address.Address) []const u8 {
    return self.code.get(address) orelse &[_]u8{};
}

pub fn set_code(self: *Self, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    try self.code.put(address, code);
}

pub fn get_nonce(self: *const Self, address: Address.Address) u64 {
    return self.nonces.get(address) orelse 0;
}

pub fn set_nonce(self: *Self, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    try self.nonces.put(address, nonce);
}

pub fn increment_nonce(self: *Self, address: Address.Address) std.mem.Allocator.Error!u64 {
    const current_nonce = self.get_nonce(address);
    const new_nonce = current_nonce + 1;
    try self.set_nonce(address, new_nonce);
    return current_nonce;
}

// Transient storage methods
pub fn get_transient_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.transient_storage.get(key) orelse 0;
}

pub fn set_transient_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.transient_storage.put(key, value);
}

// Log methods
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) std.mem.Allocator.Error!void {
    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = EvmLog{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
}