const std = @import("std");
const Address = @import("Address");
const AccessListStorageKey = @import("access_list_storage_key.zig");
const AccessListStorageKeyContext = @import("access_list_storage_key_context.zig");

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

// Error types for AccessList operations
pub const Error = std.mem.Allocator.Error;
pub const AccessAddressError = Error;
pub const AccessStorageSlotError = Error;
pub const PreWarmAddressesError = Error;
pub const PreWarmStorageSlotsError = Error;
pub const InitTransactionError = Error;
pub const GetCallCostError = Error;

pub const AccessList = @This();


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
storage_slots: std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80),

pub fn init(allocator: std.mem.Allocator) AccessList {
    return .{
        .allocator = allocator,
        .addresses = std.AutoHashMap(Address.Address, void).init(allocator),
        .storage_slots = std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80).init(allocator),
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
pub fn access_address(self: *AccessList, address: Address.Address) std.mem.Allocator.Error!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) {
        @branchHint(.likely);
        return WARM_ACCOUNT_ACCESS_COST;
    }
    return COLD_ACCOUNT_ACCESS_COST;
}

/// Mark a storage slot as accessed and return the gas cost
/// Returns COLD_SLOAD_COST if first access, WARM_SLOAD_COST if already accessed
pub fn access_storage_slot(self: *AccessList, address: Address.Address, slot: u256) std.mem.Allocator.Error!u64 {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    const result = try self.storage_slots.getOrPut(key);
    if (result.found_existing) {
        @branchHint(.likely);
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
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    return self.storage_slots.contains(key);
}

/// Pre-warm addresses from EIP-2930 access list
pub fn pre_warm_addresses(self: *AccessList, addresses: []const Address.Address) std.mem.Allocator.Error!void {
    for (addresses) |address| {
        try self.addresses.put(address, {});
    }
}

/// Pre-warm storage slots from EIP-2930 access list
pub fn pre_warm_storage_slots(self: *AccessList, address: Address.Address, slots: []const u256) std.mem.Allocator.Error!void {
    for (slots) |slot| {
        const key = AccessListStorageKey{ .address = address, .slot = slot };
        try self.storage_slots.put(key, {});
    }
}

/// Initialize transaction access list with pre-warmed addresses
/// According to EIP-2929, tx.origin and block.coinbase are always pre-warmed
pub fn init_transaction(self: *AccessList, tx_origin: Address.Address, coinbase: Address.Address, to: ?Address.Address) std.mem.Allocator.Error!void {
    // Clear previous transaction data
    self.clear();
    
    try self.addresses.put(tx_origin, {});
    try self.addresses.put(coinbase, {});
    
    if (to) |to_address| {
        try self.addresses.put(to_address, {});
    }
}

/// Get the extra gas cost for accessing an address (for CALL operations)
/// Returns 0 if warm, COLD_CALL_EXTRA_COST if cold
pub fn get_call_cost(self: *AccessList, address: Address.Address) std.mem.Allocator.Error!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) {
        @branchHint(.likely);
        return 0;
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

// ============================================================================
// Comprehensive tests based on EIP-2929 and EIP-2930 specifications
// ============================================================================

test "AccessList: Edge case - zero address handling" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const zero_address = [_]u8{0} ** 20;
    
    // Zero address should behave like any other address
    const cost1 = try access_list.access_address(zero_address);
    try testing.expectEqual(COLD_ACCOUNT_ACCESS_COST, cost1);
    
    const cost2 = try access_list.access_address(zero_address);
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, cost2);
    
    try testing.expect(access_list.is_address_warm(zero_address));
}

test "AccessList: Edge case - maximum value addresses and slots" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const max_address = [_]u8{0xFF} ** 20;
    const max_slot = std.math.maxInt(u256);
    
    // Test with maximum address value
    const cost1 = try access_list.access_address(max_address);
    try testing.expectEqual(COLD_ACCOUNT_ACCESS_COST, cost1);
    
    const cost2 = try access_list.access_address(max_address);
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, cost2);
    
    // Test with maximum slot value
    const contract_address = [_]u8{0x03} ** 20;
    const cost3 = try access_list.access_storage_slot(contract_address, max_slot);
    try testing.expectEqual(COLD_SLOAD_COST, cost3);
    
    const cost4 = try access_list.access_storage_slot(contract_address, max_slot);
    try testing.expectEqual(WARM_SLOAD_COST, cost4);
}

test "AccessList: Storage slot collision detection" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const alice_address = [_]u8{0x01} ** 20;
    const bob_address = [_]u8{0x02} ** 20;
    const slot = 42;
    
    // Same slot on different addresses should be independent
    _ = try access_list.access_storage_slot(alice_address, slot);
    
    // Same slot on different address should still be cold
    const cost = try access_list.access_storage_slot(bob_address, slot);
    try testing.expectEqual(COLD_SLOAD_COST, cost);
    
    // Verify independence
    try testing.expect(access_list.is_storage_slot_warm(alice_address, slot));
    try testing.expect(access_list.is_storage_slot_warm(bob_address, slot));
}

test "AccessList: Multiple slots per address" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const contract_address = [_]u8{0x03} ** 20;
    const test_slots = [_]u256{ 0, 1, 42, 1000, std.math.maxInt(u256) };
    
    // Access multiple slots for the same address
    for (test_slots) |slot| {
        const cost1 = try access_list.access_storage_slot(contract_address, slot);
        try testing.expectEqual(COLD_SLOAD_COST, cost1);
        
        const cost2 = try access_list.access_storage_slot(contract_address, slot);
        try testing.expectEqual(WARM_SLOAD_COST, cost2);
        
        try testing.expect(access_list.is_storage_slot_warm(contract_address, slot));
    }
}

test "AccessList: Transaction initialization clears previous state" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const alice_address = [_]u8{0x01} ** 20;
    const bob_address = [_]u8{0x02} ** 20;
    const coinbase_address = [_]u8{0x04} ** 20;
    const contract_address = [_]u8{0x03} ** 20;
    
    // Pre-warm some addresses and slots
    _ = try access_list.access_address(bob_address);
    _ = try access_list.access_storage_slot(contract_address, 42);
    
    // Verify they are warm
    try testing.expect(access_list.is_address_warm(bob_address));
    try testing.expect(access_list.is_storage_slot_warm(contract_address, 42));
    
    // Initialize new transaction
    try access_list.init_transaction(alice_address, coinbase_address, null);
    
    // Previous state should be cleared
    try testing.expect(!access_list.is_address_warm(bob_address));
    try testing.expect(!access_list.is_storage_slot_warm(contract_address, 42));
    
    // New transaction addresses should be warm
    try testing.expect(access_list.is_address_warm(alice_address));
    try testing.expect(access_list.is_address_warm(coinbase_address));
}

test "AccessList: Call cost with pre-warmed address" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const alice_address = [_]u8{0x01} ** 20;
    
    // Pre-warm address
    try access_list.pre_warm_addresses(&[_]Address.Address{alice_address});
    
    // Call cost should be zero (no extra cost)
    const cost = try access_list.get_call_cost(alice_address);
    try testing.expectEqual(@as(u64, 0), cost);
}

test "AccessList: Gas cost constants validation" {
    // Verify gas cost constants match EIP-2929 specification
    try testing.expectEqual(@as(u64, 2600), COLD_ACCOUNT_ACCESS_COST);
    try testing.expectEqual(@as(u64, 100), WARM_ACCOUNT_ACCESS_COST);
    try testing.expectEqual(@as(u64, 2100), COLD_SLOAD_COST);
    try testing.expectEqual(@as(u64, 100), WARM_SLOAD_COST);
    try testing.expectEqual(@as(u64, 2500), COLD_CALL_EXTRA_COST);
}

test "AccessList: Clear functionality" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const alice_address = [_]u8{0x01} ** 20;
    const bob_address = [_]u8{0x02} ** 20;
    const contract_address = [_]u8{0x03} ** 20;
    
    // Populate with some data
    _ = try access_list.access_address(alice_address);
    _ = try access_list.access_address(bob_address);
    _ = try access_list.access_storage_slot(contract_address, 0);
    _ = try access_list.access_storage_slot(contract_address, 1);
    
    // Verify data is present
    try testing.expect(access_list.is_address_warm(alice_address));
    try testing.expect(access_list.is_address_warm(bob_address));
    try testing.expect(access_list.is_storage_slot_warm(contract_address, 0));
    try testing.expect(access_list.is_storage_slot_warm(contract_address, 1));
    
    // Clear the access list
    access_list.clear();
    
    // All data should be cleared
    try testing.expect(!access_list.is_address_warm(alice_address));
    try testing.expect(!access_list.is_address_warm(bob_address));
    try testing.expect(!access_list.is_storage_slot_warm(contract_address, 0));
    try testing.expect(!access_list.is_storage_slot_warm(contract_address, 1));
}

test "AccessList: Storage key equality testing" {
    const alice_address = [_]u8{0x01} ** 20;
    const bob_address = [_]u8{0x02} ** 20;
    
    // Test AccessListStorageKey equality
    const key1 = AccessListStorageKey{ .address = alice_address, .slot = 0 };
    const key2 = AccessListStorageKey{ .address = alice_address, .slot = 0 };
    const key3 = AccessListStorageKey{ .address = alice_address, .slot = 1 };
    const key4 = AccessListStorageKey{ .address = bob_address, .slot = 0 };
    
    // Same address and slot should be equal
    try testing.expect(key1.eql(key2));
    
    // Different slot should not be equal
    try testing.expect(!key1.eql(key3));
    
    // Different address should not be equal
    try testing.expect(!key1.eql(key4));
}

test "AccessList: EIP-2929 compliance - always warm addresses" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const alice_address = [_]u8{0x01} ** 20;
    const coinbase_address = [_]u8{0x04} ** 20;
    
    // According to EIP-2929, tx.origin and block.coinbase are always warm
    try access_list.init_transaction(alice_address, coinbase_address, null);
    
    // These addresses should always cost WARM_ACCOUNT_ACCESS_COST
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(alice_address));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(coinbase_address));
}

test "AccessList: EIP-2930 compliance - access list pre-warming" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const alice_address = [_]u8{0x01} ** 20;
    const bob_address = [_]u8{0x02} ** 20;
    const contract_address = [_]u8{0x03} ** 20;
    const coinbase_address = [_]u8{0x04} ** 20;
    
    // Simulate EIP-2930 access list transaction
    const access_list_addresses = [_]Address.Address{ contract_address, bob_address };
    const access_list_slots = [_]u256{ 0, 1, 42 };
    
    // Initialize transaction with origin/coinbase
    try access_list.init_transaction(alice_address, coinbase_address, null);
    
    // Pre-warm access list addresses
    try access_list.pre_warm_addresses(&access_list_addresses);
    
    // Pre-warm access list storage slots  
    try access_list.pre_warm_storage_slots(contract_address, &access_list_slots);
    
    // All should be warm from the start
    for (access_list_addresses) |addr| {
        try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(addr));
    }
    
    for (access_list_slots) |slot| {
        try testing.expectEqual(WARM_SLOAD_COST, try access_list.access_storage_slot(contract_address, slot));
    }
}
