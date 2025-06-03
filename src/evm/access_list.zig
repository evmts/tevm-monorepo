const std = @import("std");
const Address = @import("Address");

/// EIP-2929 & EIP-2930: Access list management for gas cost calculation
/// 
/// Tracks which addresses and storage slots have been accessed during transaction
/// execution. First access (cold) costs more gas than subsequent accesses (warm).
/// 
/// Gas costs:
/// - Cold address access: 2600 gas
/// - Warm address access: 100 gas  
/// - Cold storage slot access: 2100 gas
/// - Warm storage slot access: 100 gas
pub const AccessList = @This();

/// Storage slot key combining address and slot
pub const StorageKey = struct {
    address: Address.Address,
    slot: u256,
    
    pub fn hash(self: StorageKey) u64 {
        var hasher = std.hash.Wyhash.init(0);
        hasher.update(&self.address);
        hasher.update(std.mem.asBytes(&self.slot));
        return hasher.final();
    }
    
    pub fn eql(self: StorageKey, other: StorageKey) bool {
        return std.mem.eql(u8, &self.address, &other.address) and self.slot == other.slot;
    }
};

const StorageKeyContext = struct {
    pub fn hash(ctx: StorageKeyContext, key: StorageKey) u64 {
        _ = ctx;
        return key.hash();
    }
    
    pub fn eql(ctx: StorageKeyContext, a: StorageKey, b: StorageKey) bool {
        _ = ctx;
        return a.eql(b);
    }
};

// Gas costs defined by EIP-2929
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_ACCOUNT_ACCESS_COST: u64 = 100;
pub const COLD_SLOAD_COST: u64 = 2100;
pub const WARM_SLOAD_COST: u64 = 100;

// Additional costs for CALL operations
pub const COLD_CALL_EXTRA_COST: u64 = COLD_ACCOUNT_ACCESS_COST - WARM_ACCOUNT_ACCESS_COST;

allocator: std.mem.Allocator,
/// Warm addresses - addresses that have been accessed
addresses: std.AutoHashMap(Address.Address, void),
/// Warm storage slots - storage slots that have been accessed
storage_slots: std.HashMap(StorageKey, void, StorageKeyContext, 80),

pub fn init(allocator: std.mem.Allocator) AccessList {
    return .{
        .allocator = allocator,
        .addresses = std.AutoHashMap(Address.Address, void).init(allocator),
        .storage_slots = std.HashMap(StorageKey, void, StorageKeyContext, 80).init(allocator),
    };
}

pub fn deinit(self: *AccessList) void {
    self.addresses.deinit();
    self.storage_slots.deinit();
}

/// Clear all access lists for a new transaction
pub fn clear(self: *AccessList) void {
    self.addresses.clearRetainingCapacity();
    self.storage_slots.clearRetainingCapacity();
}

/// Mark an address as accessed and return the gas cost
/// Returns COLD_ACCOUNT_ACCESS_COST if first access, WARM_ACCOUNT_ACCESS_COST if already accessed
pub fn access_address(self: *AccessList, address: Address.Address) !u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) {
        return WARM_ACCOUNT_ACCESS_COST;
    }
    return COLD_ACCOUNT_ACCESS_COST;
}

/// Mark a storage slot as accessed and return the gas cost
/// Returns COLD_SLOAD_COST if first access, WARM_SLOAD_COST if already accessed
pub fn access_storage_slot(self: *AccessList, address: Address.Address, slot: u256) !u64 {
    const key = StorageKey{ .address = address, .slot = slot };
    const result = try self.storage_slots.getOrPut(key);
    if (result.found_existing) {
        return WARM_SLOAD_COST;
    }
    return COLD_SLOAD_COST;
}

/// Check if an address is warm (has been accessed)
pub fn is_address_warm(self: *const AccessList, address: Address.Address) bool {
    return self.addresses.contains(address);
}

/// Check if a storage slot is warm (has been accessed)
pub fn is_storage_slot_warm(self: *const AccessList, address: Address.Address, slot: u256) bool {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.storage_slots.contains(key);
}

/// Pre-warm addresses from EIP-2930 access list
pub fn pre_warm_addresses(self: *AccessList, addresses: []const Address.Address) !void {
    for (addresses) |address| {
        try self.addresses.put(address, {});
    }
}

/// Pre-warm storage slots from EIP-2930 access list
pub fn pre_warm_storage_slots(self: *AccessList, address: Address.Address, slots: []const u256) !void {
    for (slots) |slot| {
        const key = StorageKey{ .address = address, .slot = slot };
        try self.storage_slots.put(key, {});
    }
}

/// Initialize transaction access list with pre-warmed addresses
/// According to EIP-2929, tx.origin and block.coinbase are always pre-warmed
pub fn init_transaction(self: *AccessList, tx_origin: Address.Address, coinbase: Address.Address, to: ?Address.Address) !void {
    // Clear previous transaction data
    self.clear();
    
    // Pre-warm tx.origin
    try self.addresses.put(tx_origin, {});
    
    // Pre-warm block.coinbase
    try self.addresses.put(coinbase, {});
    
    // Pre-warm to address if it exists (not a contract creation)
    if (to) |to_address| {
        try self.addresses.put(to_address, {});
    }
}

/// Get the extra gas cost for accessing an address (for CALL operations)
/// Returns 0 if warm, COLD_CALL_EXTRA_COST if cold
pub fn get_call_cost(self: *AccessList, address: Address.Address) !u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) {
        return 0; // No extra cost for warm address
    }
    return COLD_CALL_EXTRA_COST;
}

// Tests
const testing = std.testing;

test "AccessList basic operations" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const test_address = [_]u8{1} ** 20;
    
    // First access should be cold
    const cost1 = try access_list.access_address(test_address);
    try testing.expectEqual(COLD_ACCOUNT_ACCESS_COST, cost1);
    
    // Second access should be warm
    const cost2 = try access_list.access_address(test_address);
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, cost2);
    
    // Check warmth
    try testing.expect(access_list.is_address_warm(test_address));
    
    const cold_address = [_]u8{2} ** 20;
    try testing.expect(!access_list.is_address_warm(cold_address));
}

test "AccessList storage slots" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const test_address = [_]u8{1} ** 20;
    const slot1: u256 = 42;
    const slot2: u256 = 100;
    
    // First access to slot1 should be cold
    const cost1 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(COLD_SLOAD_COST, cost1);
    
    // Second access to slot1 should be warm
    const cost2 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(WARM_SLOAD_COST, cost2);
    
    // First access to slot2 should be cold
    const cost3 = try access_list.access_storage_slot(test_address, slot2);
    try testing.expectEqual(COLD_SLOAD_COST, cost3);
    
    // Check warmth
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot1));
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot2));
    try testing.expect(!access_list.is_storage_slot_warm(test_address, 999));
}

test "AccessList transaction initialization" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const tx_origin = [_]u8{1} ** 20;
    const coinbase = [_]u8{2} ** 20;
    const to_address = [_]u8{3} ** 20;
    
    try access_list.init_transaction(tx_origin, coinbase, to_address);
    
    // All should be pre-warmed
    try testing.expect(access_list.is_address_warm(tx_origin));
    try testing.expect(access_list.is_address_warm(coinbase));
    try testing.expect(access_list.is_address_warm(to_address));
    
    // Accessing them should return warm cost
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(tx_origin));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(coinbase));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(to_address));
}

test "AccessList pre-warming from EIP-2930" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const addresses = [_]Address.Address{
        [_]u8{1} ** 20,
        [_]u8{2} ** 20,
        [_]u8{3} ** 20,
    };
    
    try access_list.pre_warm_addresses(&addresses);
    
    // All should be warm
    for (addresses) |address| {
        try testing.expect(access_list.is_address_warm(address));
        try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(address));
    }
    
    // Test storage slot pre-warming
    const contract_address = [_]u8{4} ** 20;
    const slots = [_]u256{ 1, 2, 3, 100 };
    
    try access_list.pre_warm_storage_slots(contract_address, &slots);
    
    for (slots) |slot| {
        try testing.expect(access_list.is_storage_slot_warm(contract_address, slot));
        try testing.expectEqual(WARM_SLOAD_COST, try access_list.access_storage_slot(contract_address, slot));
    }
}

test "AccessList call costs" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const cold_address = [_]u8{1} ** 20;
    const warm_address = [_]u8{2} ** 20;
    
    // Pre-warm one address
    try access_list.pre_warm_addresses(&[_]Address.Address{warm_address});
    
    // Cold address should have extra cost
    try testing.expectEqual(COLD_CALL_EXTRA_COST, try access_list.get_call_cost(cold_address));
    
    // Warm address should have no extra cost
    try testing.expectEqual(@as(u64, 0), try access_list.get_call_cost(warm_address));
    
    // After getting cost, cold address should now be warm
    try testing.expect(access_list.is_address_warm(cold_address));
}