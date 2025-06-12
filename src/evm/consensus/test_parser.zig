const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const HashMap = std.HashMap;

pub const TestParserError = error{
    InvalidJson,
    MissingField,
    InvalidHexString,
    InvalidAddress,
    InvalidU256,
    ParseError,
    OutOfMemory,
};

pub const TestEnvironment = struct {
    current_coinbase: [20]u8,
    current_difficulty: u256,
    current_gas_limit: u64,
    current_number: u64,
    current_timestamp: u64,
    current_base_fee: ?u64,
    current_blob_base_fee: ?u64,
    current_excess_blob_gas: ?u64,
    parent_blob_gas_used: ?u64,
    parent_excess_blob_gas: ?u64,
    current_random: ?u256,
    withdrawals_root: ?u256,
    parent_beacon_block_root: ?u256,
};

pub const TestAccount = struct {
    balance: u256,
    nonce: u64,
    code: []const u8,
    storage: HashMap(u256, u256, std.hash_map.AutoContext(u256), std.hash_map.default_max_load_percentage),
    
    pub fn deinit(self: *TestAccount, allocator: Allocator) void {
        allocator.free(self.code);
        self.storage.deinit();
    }
};

pub const TestTransaction = struct {
    data: [][]const u8,
    gas_limit: []u64,
    gas_price: ?u64,
    max_fee_per_gas: ?u64,
    max_priority_fee_per_gas: ?u64,
    nonce: u64,
    to: ?[20]u8,
    value: []u256,
    v: []u64,
    r: []u256,
    s: []u256,
    sender: [20]u8,
    secret_key: ?u256,
    max_fee_per_blob_gas: ?u64,
    blob_versioned_hashes: ?[]u256,
    
    pub fn deinit(self: *TestTransaction, allocator: Allocator) void {
        for (self.data) |data_item| {
            allocator.free(data_item);
        }
        allocator.free(self.data);
        allocator.free(self.gas_limit);
        allocator.free(self.value);
        allocator.free(self.v);
        allocator.free(self.r);
        allocator.free(self.s);
        if (self.blob_versioned_hashes) |hashes| {
            allocator.free(hashes);
        }
    }
};

pub const StateTest = struct {
    name: []const u8,
    env: TestEnvironment,
    pre: HashMap([20]u8, TestAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage),
    transaction: TestTransaction,
    post: HashMap([]const u8, HashMap([20]u8, TestAccount, std.hash_map.AutoContext([20]u8), std.hash_map.default_max_load_percentage), std.hash_map.StringContext, std.hash_map.default_max_load_percentage),
    
    pub fn deinit(self: *StateTest, allocator: Allocator) void {
        allocator.free(self.name);
        
        var pre_iter = self.pre.iterator();
        while (pre_iter.next()) |entry| {
            entry.value_ptr.deinit(allocator);
        }
        self.pre.deinit();
        
        self.transaction.deinit(allocator);
        
        var post_iter = self.post.iterator();
        while (post_iter.next()) |fork_entry| {
            allocator.free(fork_entry.key_ptr.*);
            var account_iter = fork_entry.value_ptr.iterator();
            while (account_iter.next()) |account_entry| {
                account_entry.value_ptr.deinit(allocator);
            }
            fork_entry.value_ptr.deinit();
        }
        self.post.deinit();
    }
};

// Helper parsing functions

fn parseAddress(hex_str: []const u8) TestParserError![20]u8 {
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return TestParserError.InvalidAddress;
    }
    
    var address: [20]u8 = undefined;
    const data_str = hex_str[2..];
    
    for (0..20) |i| {
        const hex_byte = data_str[i * 2..i * 2 + 2];
        address[i] = std.fmt.parseInt(u8, hex_byte, 16) catch return TestParserError.InvalidAddress;
    }
    
    return address;
}

fn parseU256(hex_str: []const u8) TestParserError!u256 {
    if (!std.mem.startsWith(u8, hex_str, "0x")) {
        return TestParserError.InvalidU256;
    }
    
    const data_str = hex_str[2..];
    return std.fmt.parseInt(u256, data_str, 16) catch TestParserError.InvalidU256;
}

fn parseU64(hex_str: []const u8) TestParserError!u64 {
    if (std.mem.startsWith(u8, hex_str, "0x")) {
        return std.fmt.parseInt(u64, hex_str[2..], 16) catch TestParserError.ParseError;
    }
    return std.fmt.parseInt(u64, hex_str, 10) catch TestParserError.ParseError;
}

fn parseHexBytes(allocator: Allocator, hex_str: []const u8) TestParserError![]const u8 {
    if (!std.mem.startsWith(u8, hex_str, "0x")) {
        return TestParserError.InvalidHexString;
    }
    
    const data_str = hex_str[2..];
    if (data_str.len % 2 != 0) {
        return TestParserError.InvalidHexString;
    }
    
    const bytes = try allocator.alloc(u8, data_str.len / 2);
    errdefer allocator.free(bytes);
    
    for (0..bytes.len) |i| {
        const hex_byte = data_str[i * 2..i * 2 + 2];
        bytes[i] = std.fmt.parseInt(u8, hex_byte, 16) catch return TestParserError.InvalidHexString;
    }
    
    return bytes;
}

// Test parsing function for loading test files
pub fn parseStateTestFile(allocator: Allocator, file_path: []const u8) !ArrayList(StateTest) {
    const file_content = std.fs.cwd().readFileAlloc(allocator, file_path, std.math.maxInt(usize)) catch |err| {
        std.log.err("Failed to read test file '{}': {}", .{ file_path, err });
        return err;
    };
    defer allocator.free(file_content);
    
    const parsed = std.json.parseFromSlice(std.json.Value, allocator, file_content, .{}) catch |err| {
        std.log.err("Failed to parse JSON from '{}': {}", .{ file_path, err });
        return TestParserError.InvalidJson;
    };
    defer parsed.deinit();
    
    const result = ArrayList(StateTest).init(allocator);
    
    // For now, return empty list as placeholder
    // TODO: Implement full JSON parsing logic
    return result;
}

test "parse address" {
    const address_str = "0x1000000000000000000000000000000000000000";
    const address = try parseAddress(address_str);
    
    try testing.expect(address[0] == 0x10);
    for (address[1..]) |byte| {
        try testing.expect(byte == 0x00);
    }
}

test "parse u256" {
    const u256_str = "0x1000000000000000000000000000000000000000000000000000000000000000";
    const u256_val = try parseU256(u256_str);
    
    try testing.expect(u256_val != 0);
}

test "parse hex bytes" {
    const allocator = testing.allocator;
    const hex_str = "0x1234abcd";
    const bytes = try parseHexBytes(allocator, hex_str);
    defer allocator.free(bytes);
    
    try testing.expect(bytes.len == 4);
    try testing.expect(bytes[0] == 0x12);
    try testing.expect(bytes[1] == 0x34);
    try testing.expect(bytes[2] == 0xab);
    try testing.expect(bytes[3] == 0xcd);
}

test "parse u64" {
    const hex_str = "0x100";
    const value = try parseU64(hex_str);
    try testing.expect(value == 256);
    
    const dec_str = "256";
    const value2 = try parseU64(dec_str);
    try testing.expect(value2 == 256);
}