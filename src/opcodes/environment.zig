//! Environment information operations for ZigEVM
//! This module implements opcodes that provide blockchain context to smart contracts

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Hash = types.Hash;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;

/// Environment data that must be provided to the EVM
pub const EvmEnvironment = struct {
    // Block information
    block_number: u64,
    timestamp: u64,
    block_gas_limit: u64,
    difficulty: U256,
    base_fee: ?U256 = null, // Only available post-London
    prev_randao: ?U256 = null, // Only available post-Merge
    chain_id: u64,
    
    // Coinbase address (miner)
    coinbase: Address,
    
    // Contract/execution information
    address: Address, // Currently executing address
    origin: Address, // Original sender of the transaction
    caller: Address, // Immediate caller
    value: U256, // Value passed in the call
    
    // Block hashes cache
    block_hashes: std.AutoHashMap(u64, Hash),
    
    /// Initialize with default values
    pub fn init(allocator: std.mem.Allocator) EvmEnvironment {
        return EvmEnvironment{
            .block_number = 0,
            .timestamp = 0,
            .block_gas_limit = 30_000_000,
            .difficulty = U256.zero(),
            .base_fee = null,
            .prev_randao = null,
            .chain_id = 1, // Default to Ethereum mainnet
            .coinbase = Address.zero(),
            .address = Address.zero(),
            .origin = Address.zero(),
            .caller = Address.zero(),
            .value = U256.zero(),
            .block_hashes = std.AutoHashMap(u64, Hash).init(allocator),
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *EvmEnvironment) void {
        self.block_hashes.deinit();
    }
    
    /// Set block hash for a given block number
    pub fn setBlockHash(self: *EvmEnvironment, block_number: u64, hash: Hash) !void {
        try self.block_hashes.put(block_number, hash);
    }
    
    /// Get block hash for a given block number
    pub fn getBlockHash(self: *EvmEnvironment, block_number: u64) Hash {
        if (self.block_hashes.get(block_number)) |hash| {
            return hash;
        }
        return Hash.zero();
    }
};

// Environment operations

/// Get address of currently executing account (ADDRESS)
pub fn address(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push address as U256
    var addr_u256 = U256.zero();
    
    // Convert address bytes to U256
    for (0..20) |i| {
        if (i < 20) {
            addr_u256 = addr_u256.shl(8);
            addr_u256 = addr_u256.add(U256.fromU64(env.address.bytes[i]));
        }
    }
    
    try stack.push(addr_u256);
    
    // Advance PC
    pc.* += 1;
}

/// Get balance of the given account (BALANCE)
pub fn balance(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
    getBalanceFn: *const fn(Address) U256,
    is_cold_access: bool,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    _ = env;
    
    // Gas cost: 100 (warm) or 2600 (cold) as of EIP-2929
    const gas_cost: u64 = if (is_cold_access) 2600 else 100;
    
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Pop address from stack
    const addr_u256 = try stack.pop();
    
    // Convert U256 to Address
    var addr_bytes: [20]u8 = [_]u8{0} ** 20;
    
    // Extract address bytes from U256
    var temp_u256 = addr_u256;
    var i: i64 = 19;
    while (i >= 0) : (i -= 1) {
        addr_bytes[@intCast(i)] = @intCast(temp_u256.words[0] & 0xFF);
        temp_u256 = temp_u256.shr(8);
    }
    
    const addr = Address{ .bytes = addr_bytes };
    
    // Get balance using the provided callback
    const balance_value = getBalanceFn(addr);
    
    // Push balance to stack
    try stack.push(balance_value);
    
    // Advance PC
    pc.* += 1;
}

/// Get caller address (CALLER)
pub fn caller(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push caller address as U256
    var caller_u256 = U256.zero();
    
    // Convert address bytes to U256
    for (0..20) |i| {
        caller_u256 = caller_u256.shl(8);
        caller_u256 = caller_u256.add(U256.fromU64(env.caller.bytes[i]));
    }
    
    try stack.push(caller_u256);
    
    // Advance PC
    pc.* += 1;
}

/// Get value sent with call (CALLVALUE)
pub fn callvalue(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push value to stack
    try stack.push(env.value);
    
    // Advance PC
    pc.* += 1;
}

/// Get calldata size (CALLDATASIZE)
pub fn calldatasize(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    calldata: []const u8,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push calldata size to stack
    try stack.push(U256.fromU64(calldata.len));
    
    // Advance PC
    pc.* += 1;
}

/// Copy calldata to memory (CALLDATACOPY)
pub fn calldatacopy(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    calldata: []const u8,
) !void {
    _ = code;
    _ = gas_refund;
    
    // Pop values from stack
    const size = try stack.pop();
    const offset = try stack.pop();
    const dest_offset = try stack.pop();
    
    // Ensure the parameters fit in usize
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_size = @as(usize, size.words[0]);
    const data_offset = @as(usize, offset.words[0]);
    const mem_offset = @as(usize, dest_offset.words[0]);
    
    // Skip operation for zero size
    if (mem_size == 0) {
        pc.* += 1;
        return;
    }
    
    // CALLDATACOPY costs 3 base gas + 3 per word
    var gas_cost: u64 = 3;
    
    // Additional word gas (3 gas per word, rounded up)
    const words = (mem_size + 31) / 32;
    gas_cost += words * 3;
    
    // Calculate memory expansion cost
    const mem_gas = memory.expand(mem_offset + mem_size);
    gas_cost += mem_gas;
    
    // Check gas
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Copy data from calldata to memory
    const to_copy = mem_size;
    var i: usize = 0;
    
    while (i < to_copy) : (i += 1) {
        const calldata_pos = data_offset + i;
        const byte = if (calldata_pos < calldata.len) calldata[calldata_pos] else 0;
        memory.page.buffer[mem_offset + i] = byte;
    }
    
    // Advance PC
    pc.* += 1;
}

/// Load byte from calldata (CALLDATALOAD)
pub fn calldataload(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    calldata: []const u8,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 3 (base tier)
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop offset from stack
    const offset_u256 = try stack.pop();
    
    // Ensure the offset fits in usize
    if (offset_u256.words[1] != 0 or offset_u256.words[2] != 0 or offset_u256.words[3] != 0) {
        // If offset is too large, return 0 because it's past the calldata
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    // Convert to usize
    const offset = @as(usize, offset_u256.words[0]);
    
    // If offset is beyond calldata, return 0
    if (offset >= calldata.len) {
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    // Load 32 bytes (or less if we're at the end of calldata)
    var value = U256.zero();
    const bytes_to_load = @min(32, calldata.len - offset);
    
    for (0..bytes_to_load) |i| {
        value = value.shl(8);
        value = value.add(U256.fromU64(calldata[offset + i]));
    }
    
    // Push value to stack
    try stack.push(value);
    
    // Advance PC
    pc.* += 1;
}

/// Get size of code running in current environment (CODESIZE)
pub fn codesize(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push code size to stack
    try stack.push(U256.fromU64(code.len));
    
    // Advance PC
    pc.* += 1;
}

/// Copy code to memory (CODECOPY)
pub fn codecopy(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = gas_refund;
    
    // Pop values from stack
    const size = try stack.pop();
    const offset = try stack.pop();
    const dest_offset = try stack.pop();
    
    // Ensure the parameters fit in usize
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_size = @as(usize, size.words[0]);
    const code_offset = @as(usize, offset.words[0]);
    const mem_offset = @as(usize, dest_offset.words[0]);
    
    // Skip operation for zero size
    if (mem_size == 0) {
        pc.* += 1;
        return;
    }
    
    // CODECOPY costs 3 base gas + 3 per word
    var gas_cost: u64 = 3;
    
    // Additional word gas (3 gas per word, rounded up)
    const words = (mem_size + 31) / 32;
    gas_cost += words * 3;
    
    // Calculate memory expansion cost
    const mem_gas = memory.expand(mem_offset + mem_size);
    gas_cost += mem_gas;
    
    // Check gas
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Copy data from code to memory
    const to_copy = mem_size;
    var i: usize = 0;
    
    while (i < to_copy) : (i += 1) {
        const code_pos = code_offset + i;
        const byte = if (code_pos < code.len) code[code_pos] else 0;
        memory.page.buffer[mem_offset + i] = byte;
    }
    
    // Advance PC
    pc.* += 1;
}

/// Get address of original transaction sender (ORIGIN)
pub fn origin(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push origin address as U256
    var origin_u256 = U256.zero();
    
    // Convert address bytes to U256
    for (0..20) |i| {
        origin_u256 = origin_u256.shl(8);
        origin_u256 = origin_u256.add(U256.fromU64(env.origin.bytes[i]));
    }
    
    try stack.push(origin_u256);
    
    // Advance PC
    pc.* += 1;
}

/// Get gas price of the transaction (GASPRICE)
pub fn gasprice(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    gas_price: U256,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push gas price to stack
    try stack.push(gas_price);
    
    // Advance PC
    pc.* += 1;
}

/// Get current block coinbase address (COINBASE)
pub fn coinbase(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push coinbase address as U256
    var coinbase_u256 = U256.zero();
    
    // Convert address bytes to U256
    for (0..20) |i| {
        coinbase_u256 = coinbase_u256.shl(8);
        coinbase_u256 = coinbase_u256.add(U256.fromU64(env.coinbase.bytes[i]));
    }
    
    try stack.push(coinbase_u256);
    
    // Advance PC
    pc.* += 1;
}

/// Get current block timestamp (TIMESTAMP)
pub fn timestamp(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push timestamp to stack
    try stack.push(U256.fromU64(env.timestamp));
    
    // Advance PC
    pc.* += 1;
}

/// Get current block number (NUMBER)
pub fn number(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push block number to stack
    try stack.push(U256.fromU64(env.block_number));
    
    // Advance PC
    pc.* += 1;
}

/// Get current block difficulty or prevrandao (DIFFICULTY/PREVRANDAO)
pub fn difficulty(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // After the merge, this returns PREVRANDAO instead of difficulty
    if (env.prev_randao != null) {
        try stack.push(env.prev_randao.?);
    } else {
        try stack.push(env.difficulty);
    }
    
    // Advance PC
    pc.* += 1;
}

/// Get current block gas limit (GASLIMIT)
pub fn gaslimit(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push gas limit to stack
    try stack.push(U256.fromU64(env.block_gas_limit));
    
    // Advance PC
    pc.* += 1;
}

/// Get chain ID (CHAINID) - EIP-1344
pub fn chainid(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push chain ID to stack
    try stack.push(U256.fromU64(env.chain_id));
    
    // Advance PC
    pc.* += 1;
}

/// Get current block's base fee (BASEFEE) - EIP-3198
pub fn basefee(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 2 (base tier)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // Push base fee to stack (defaults to zero if not available)
    try stack.push(env.base_fee orelse U256.zero());
    
    // Advance PC
    pc.* += 1;
}

/// Get the hash of one of the 256 most recent complete blocks (BLOCKHASH)
pub fn blockhash(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    env: *const EvmEnvironment,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost: 20 (special tier)
    if (gas_left.* < 20) {
        return Error.OutOfGas;
    }
    gas_left.* -= 20;
    
    // Pop block number from stack
    const block_num_u256 = try stack.pop();
    
    // Ensure block number fits in u64
    if (block_num_u256.words[1] != 0 or block_num_u256.words[2] != 0 or block_num_u256.words[3] != 0) {
        // Block number too large, return zero
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    const block_num = block_num_u256.words[0];
    
    // Check if block number is in valid range (current - 256)
    if (block_num >= env.block_number or env.block_number - block_num > 256) {
        // Out of range, return zero
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    // Get block hash from environment
    const hash = env.getBlockHash(block_num);
    
    // Convert hash to U256
    var hash_u256 = U256.zero();
    
    // Convert hash bytes to U256
    for (0..32) |i| {
        hash_u256 = hash_u256.shl(8);
        hash_u256 = hash_u256.add(U256.fromU64(hash.bytes[i]));
    }
    
    try stack.push(hash_u256);
    
    // Advance PC
    pc.* += 1;
}

// Tests
test "Environment operations - basic" {
    // Test setup
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var env = EvmEnvironment.init(std.testing.allocator);
    defer env.deinit();
    
    // Set some test values
    env.block_number = 12345;
    env.timestamp = 1623456789;
    env.chain_id = 1; // Ethereum mainnet
    
    // Custom coinbase address
    var coinbase_addr = Address.zero();
    coinbase_addr.bytes[19] = 0x42;
    env.coinbase = coinbase_addr;
    
    // Test ADDRESS opcode
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 1000;
    var gas_refund: u64 = 0;
    
    try address(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result (should be the zero address)
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const addr_result = try stack.pop();
    try std.testing.expectEqual(U256.zero(), addr_result);
    
    // Test TIMESTAMP opcode
    pc = 0;
    gas_left = 1000;
    
    try timestamp(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const ts_result = try stack.pop();
    try std.testing.expectEqual(U256.fromU64(1623456789), ts_result);
    
    // Test NUMBER opcode
    pc = 0;
    gas_left = 1000;
    
    try number(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const num_result = try stack.pop();
    try std.testing.expectEqual(U256.fromU64(12345), num_result);
    
    // Test COINBASE opcode
    pc = 0;
    gas_left = 1000;
    
    try coinbase(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const cb_result = try stack.pop();
    
    // Verify the last byte of the coinbase address
    try std.testing.expectEqual(@as(u64, 0x42), cb_result.words[0] & 0xFF);
}

test "Calldata operations" {
    // Test setup
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Test calldata
    const calldata = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05};
    
    // Test CALLDATASIZE
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 1000;
    var gas_refund: u64 = 0;
    
    try calldatasize(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &calldata);
    
    // Check result
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const size_result = try stack.pop();
    try std.testing.expectEqual(U256.fromU64(5), size_result);
    
    // Test CALLDATALOAD
    pc = 0;
    gas_left = 1000;
    
    // Push offset 0
    try stack.push(U256.zero());
    
    try calldataload(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &calldata);
    
    // Check result - should load the calldata padded with zeros
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const load_result = try stack.pop();
    
    // Expected: 0x0102030400...00 (32 bytes)
    var expected = U256.zero();
    expected = expected.shl(8).add(U256.fromU64(0x01));
    expected = expected.shl(8).add(U256.fromU64(0x02));
    expected = expected.shl(8).add(U256.fromU64(0x03));
    expected = expected.shl(8).add(U256.fromU64(0x04));
    expected = expected.shl(8).add(U256.fromU64(0x05));
    
    // Shift left for the remaining 27 bytes (zeros)
    expected = expected.shl(27 * 8);
    
    try std.testing.expectEqual(expected, load_result);
    
    // Test CALLDATACOPY
    pc = 0;
    gas_left = 1000;
    
    // Push dest offset, data offset, size
    try stack.push(U256.fromU64(10));  // Memory destination
    try stack.push(U256.fromU64(1));   // Calldata offset
    try stack.push(U256.fromU64(3));   // Size to copy
    
    try calldatacopy(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &calldata);
    
    // Check memory - should have copied bytes 1, 2, 3 from calldata to memory position 10, 11, 12
    try std.testing.expectEqual(@as(u8, 0x02), memory.page.buffer[10]);
    try std.testing.expectEqual(@as(u8, 0x03), memory.page.buffer[11]);
    try std.testing.expectEqual(@as(u8, 0x04), memory.page.buffer[12]);
}

test "BLOCKHASH operation" {
    // Test setup
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var env = EvmEnvironment.init(std.testing.allocator);
    defer env.deinit();
    
    // Set block number and add some block hashes
    env.block_number = 1000;
    
    // Create a test hash
    var test_hash = Hash.zero();
    test_hash.bytes[0] = 0xAA;
    test_hash.bytes[31] = 0xBB;
    
    // Store the hash for block 999
    try env.setBlockHash(999, test_hash);
    
    // Test BLOCKHASH for an existing block
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 1000;
    var gas_refund: u64 = 0;
    
    // Push block number 999
    try stack.push(U256.fromU64(999));
    
    try blockhash(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const hash_result = try stack.pop();
    
    // Convert expected hash to U256 for comparison
    var expected = U256.zero();
    expected = expected.add(U256.fromU64(0xAA));
    expected = expected.shl(8 * 31);
    expected = expected.add(U256.fromU64(0xBB));
    
    try std.testing.expectEqual(expected, hash_result);
    
    // Test BLOCKHASH for a non-existent block within range
    pc = 0;
    gas_left = 1000;
    
    // Push block number 800 (in range but not stored)
    try stack.push(U256.fromU64(800));
    
    try blockhash(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result - should be zero
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const zero_result = try stack.pop();
    try std.testing.expectEqual(U256.zero(), zero_result);
    
    // Test BLOCKHASH for a block out of range
    pc = 0;
    gas_left = 1000;
    
    // Push block number 700 (out of range)
    try stack.push(U256.fromU64(700));
    
    try blockhash(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &env);
    
    // Check result - should be zero
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    const out_of_range_result = try stack.pop();
    try std.testing.expectEqual(U256.zero(), out_of_range_result);
}