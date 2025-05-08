//! Storage operations for ZigEVM
//! This module implements the SLOAD and SSTORE opcodes with EIP-2929 warm/cold access tracking

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;

/// Gas costs for storage operations according to latest EIPs
pub const StorageGasCosts = struct {
    // EIP-2200 and EIP-2929 constants
    cold_sload: u64 = 2100,      // Gas cost for first (cold) access to a storage slot
    warm_sload: u64 = 100,       // Gas cost for subsequent (warm) accesses
    warm_sstore_unchanged: u64 = 100,  // Gas cost for SSTORE that doesn't change value (warm access)
    
    // SSTORE costs when changing values
    sstore_set: u64 = 20000,     // Changing slot from zero to non-zero
    sstore_reset: u64 = 5000,    // Changing slot from non-zero to non-zero
    sstore_clears_refund: u64 = 15000, // Refund for clearing a slot (changing non-zero to zero)
};

/// Storage represents the storage of a contract
/// It manages key-value pairs and access tracking for EIP-2929
pub const Storage = struct {
    /// Internal storage mapping
    slots: std.StringHashMap(U256),
    
    /// Set of storage slots accessed - for EIP-2929 warm access tracking
    accessed_slots: std.StringHashMap(void),
    
    /// Allocator used for this storage
    allocator: std.mem.Allocator,
    
    /// Gas costs configuration
    gas_costs: StorageGasCosts,
    
    /// Initialize a new storage instance
    pub fn init(allocator: std.mem.Allocator) !Storage {
        return Storage{
            .slots = std.StringHashMap(U256).init(allocator),
            .accessed_slots = std.StringHashMap(void).init(allocator),
            .allocator = allocator,
            .gas_costs = StorageGasCosts{},
        };
    }
    
    /// Free the storage resources
    pub fn deinit(self: *Storage) void {
        // Free all allocated keys
        var key_it = self.slots.keyIterator();
        while (key_it.next()) |key| {
            self.allocator.free(key.*);
        }
        self.slots.deinit();
        
        // Free all accessed slot keys
        var access_it = self.accessed_slots.keyIterator();
        while (access_it.next()) |key| {
            self.allocator.free(key.*);
        }
        self.accessed_slots.deinit();
    }
    
    /// Convert a U256 key to a string key for the hashmaps
    fn keyToString(key: U256) [32]u8 {
        var key_bytes: [32]u8 = undefined;
        key.toBytes(&key_bytes);
        return key_bytes;
    }
    
    /// Get the value at a storage slot
    /// Returns the value and whether this was a cold or warm access
    pub fn get(self: *Storage, key: U256) !struct { value: U256, is_cold: bool } {
        // Convert key to a string key for hashmap
        const key_bytes = keyToString(key);
        const key_str = &key_bytes;
        
        // Check if this is a cold or warm access
        const is_cold = !self.accessed_slots.contains(key_str);
        
        // Mark slot as accessed for future warm access
        if (is_cold) {
            const dupe_key = try self.allocator.dupe(u8, key_str);
            try self.accessed_slots.put(dupe_key, {});
        }
        
        // Get the value from storage (zero if not found)
        var value = U256.zero();
        if (self.slots.get(key_str)) |stored_value| {
            value = stored_value;
        }
        
        return .{ .value = value, .is_cold = is_cold };
    }
    
    /// Set the value at a storage slot
    /// Returns the original value, new value, and whether this was a cold access
    pub fn set(self: *Storage, key: U256, value: U256) !struct { old_value: U256, new_value: U256, is_cold: bool } {
        // Convert key to a string key for hashmap
        const key_bytes = keyToString(key);
        const key_str = &key_bytes;
        
        // Check if this is a cold or warm access
        const is_cold = !self.accessed_slots.contains(key_str);
        
        // Mark slot as accessed for future warm access
        if (is_cold) {
            const dupe_key = try self.allocator.dupe(u8, key_str);
            try self.accessed_slots.put(dupe_key, {});
        }
        
        // Get the original value
        var old_value = U256.zero();
        if (self.slots.get(key_str)) |stored_value| {
            old_value = stored_value;
        }
        
        // Set the new value
        if (value.isZero()) {
            // Remove the slot if value is zero (gas optimization)
            if (self.slots.fetchRemove(key_str)) |kv| {
                self.allocator.free(kv.key);
            }
        } else {
            // Use duplicate key to avoid potential reference issues
            const dupe_key = try self.allocator.dupe(u8, key_str);
            try self.slots.put(dupe_key, value);
        }
        
        return .{ .old_value = old_value, .new_value = value, .is_cold = is_cold };
    }
    
    /// Reset access tracking (for a new transaction)
    pub fn resetAccessTracking(self: *Storage) void {
        // Free all access tracking keys
        var it = self.accessed_slots.keyIterator();
        while (it.next()) |key| {
            self.allocator.free(key.*);
        }
        self.accessed_slots.clearAndFree();
    }
    
    /// Calculate gas cost and refund for an SSTORE operation based on EIP-2200 and EIP-2929
    pub fn calculateSstoreGasCost(
        self: *Storage,
        old_value: U256,
        new_value: U256,
        current_value: U256,
        is_cold: bool,
    ) struct { gas_cost: u64, gas_refund: i64 } {
        var gas_cost: u64 = 0;
        var gas_refund: i64 = 0;
        
        // EIP-2929 cold access cost if this is a cold access
        if (is_cold) {
            gas_cost += self.gas_costs.cold_sload;
        }
        
        // Optimization for no-change case
        if (new_value.eq(current_value)) {
            // EIP-2200: No change in value
            gas_cost += self.gas_costs.warm_sstore_unchanged;
            return .{ .gas_cost = gas_cost, .gas_refund = gas_refund };
        }
        
        // Slot value is being changed
        if (current_value.eq(old_value)) {
            // Original and current values are the same
            if (old_value.isZero()) {
                // Changing from 0 to non-zero: charge the full set cost
                gas_cost += self.gas_costs.sstore_set;
            } else if (new_value.isZero()) {
                // Changing from non-zero to zero: charge reset cost and add refund
                gas_cost += self.gas_costs.sstore_reset;
                gas_refund += @intCast(self.gas_costs.sstore_clears_refund);
            } else {
                // Changing from non-zero to non-zero: charge reset cost
                gas_cost += self.gas_costs.sstore_reset;
            }
        } else {
            // Original and current values are different
            
            // Charge the warm SSTORE unchanged cost
            gas_cost += self.gas_costs.warm_sstore_unchanged;
            
            // Additional refund logic for changing back to original value
            if (!old_value.isZero() and current_value.isZero()) {
                // Current value is zero (slot was cleared) and we're changing it to non-zero
                // Remove refund for clearing the slot
                gas_refund -= @intCast(self.gas_costs.sstore_clears_refund);
            }
            
            if (new_value.eq(old_value)) {
                // Reverting to original value
                if (old_value.isZero()) {
                    // Original value was zero - refund the difference between set and warm costs
                    gas_refund += @intCast(self.gas_costs.sstore_set - self.gas_costs.warm_sstore_unchanged);
                } else {
                    // Original value was non-zero - refund the difference between reset and warm costs
                    gas_refund += @intCast(self.gas_costs.sstore_reset - self.gas_costs.warm_sstore_unchanged);
                }
            } else if (new_value.isZero() and !old_value.isZero()) {
                // Setting to zero when original was non-zero - add refund for clearing
                gas_refund += @intCast(self.gas_costs.sstore_clears_refund);
            }
        }
        
        return .{ .gas_cost = gas_cost, .gas_refund = gas_refund };
    }
    
    /// Mark a storage slot as accessed (for precompiles, etc.)
    pub fn markSlotAccessed(self: *Storage, key: U256) !void {
        const key_bytes = keyToString(key);
        const key_str = &key_bytes;
        
        if (!self.accessed_slots.contains(key_str)) {
            const dupe_key = try self.allocator.dupe(u8, key_str);
            try self.accessed_slots.put(dupe_key, {});
        }
    }
    
    /// Clear all storage slots but maintain access tracking
    pub fn clear(self: *Storage) void {
        // Free all allocated keys
        var key_it = self.slots.keyIterator();
        while (key_it.next()) |key| {
            self.allocator.free(key.*);
        }
        self.slots.clearAndFree();
    }
    
    /// Get the number of storage slots in use
    pub fn slotCount(self: *const Storage) usize {
        return self.slots.count();
    }
};

/// Load a value from storage (SLOAD)
pub fn sload(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    storage: *Storage,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Pop the key from the stack
    const key = try stack.pop();
    
    // Get the value from storage and track whether it's a cold access
    const result = try storage.get(key);
    const value = result.value;
    const is_cold = result.is_cold;
    
    // Calculate gas cost based on warm/cold access (EIP-2929)
    const gas_cost = if (is_cold) storage.gas_costs.cold_sload else storage.gas_costs.warm_sload;
    
    // Check gas
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Push the value to the stack
    try stack.push(value);
    
    // Advance PC
    pc.* += 1;
}

/// Store a value in storage (SSTORE)
pub fn sstore(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    storage: *Storage,
    is_static: bool,
) !void {
    _ = memory;
    _ = code;
    
    // In static context, SSTORE is not allowed
    if (is_static) {
        return Error.StaticStateChange;
    }
    
    // Pop the key and value from the stack
    const value = try stack.pop();
    const key = try stack.pop();
    
    // Get the current value from storage (also marks it as accessed)
    const get_result = try storage.get(key);
    const current_value = get_result.value;
    const is_cold = get_result.is_cold;
    
    // Calculate gas cost and potential refund
    const gas_result = storage.calculateSstoreGasCost(
        current_value, // original value
        value,         // new value
        current_value, // current value
        is_cold
    );
    
    // Check gas
    if (gas_left.* < gas_result.gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_result.gas_cost;
    
    // Apply gas refund if applicable
    if (gas_refund != null and gas_result.gas_refund != 0) {
        if (gas_result.gas_refund > 0) {
            // Add refund
            gas_refund.?.* += @intCast(gas_result.gas_refund);
        } else {
            // Subtract from refund (negative refund)
            const refund_to_remove = @as(u64, @intCast(-gas_result.gas_refund));
            gas_refund.?.* = if (gas_refund.?.* > refund_to_remove) gas_refund.?.* - refund_to_remove else 0;
        }
    }
    
    // Store the value
    _ = try storage.set(key, value);
    
    // Advance PC
    pc.* += 1;
}

// Tests
test "Storage basic operations" {
    var storage = try Storage.init(std.testing.allocator);
    defer storage.deinit();
    
    // Test storing and retrieving values
    const key1 = U256.fromU64(42);
    const value1 = U256.fromU64(100);
    
    // Set a value
    const result1 = try storage.set(key1, value1);
    try std.testing.expect(result1.is_cold); // First access should be cold
    try std.testing.expect(result1.old_value.isZero()); // Initially zero
    try std.testing.expect(result1.new_value.eq(value1)); // New value set correctly
    
    // Get the value back
    const get_result1 = try storage.get(key1);
    try std.testing.expect(!get_result1.is_cold); // Second access should be warm
    try std.testing.expect(get_result1.value.eq(value1)); // Value should match
    
    // Update the value
    const value2 = U256.fromU64(200);
    const result2 = try storage.set(key1, value2);
    try std.testing.expect(!result2.is_cold); // Access should be warm now
    try std.testing.expect(result2.old_value.eq(value1)); // Old value should be 100
    try std.testing.expect(result2.new_value.eq(value2)); // New value should be 200
    
    // Test another key
    const key2 = U256.fromU64(43);
    const get_result2 = try storage.get(key2);
    try std.testing.expect(get_result2.is_cold); // First access to new key should be cold
    try std.testing.expect(get_result2.value.isZero()); // Should be zero
    
    // Reset access tracking
    storage.resetAccessTracking();
    
    // Key1 should be cold again after reset
    const get_result3 = try storage.get(key1);
    try std.testing.expect(get_result3.is_cold); // Should be cold after reset
    try std.testing.expect(get_result3.value.eq(value2)); // But value remains
}

test "SLOAD opcode" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var storage = try Storage.init(std.testing.allocator);
    defer storage.deinit();
    
    // Setup test data
    const key = U256.fromU64(0x1234);
    const value = U256.fromU64(0xABCD);
    
    // Store a value directly in storage
    _ = try storage.set(key, value);
    
    // Reset access tracking to simulate a new transaction
    storage.resetAccessTracking();
    
    // Prepare stack for SLOAD (key on top)
    try stack.push(key);
    
    // Execute SLOAD
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 3000;
    var gas_refund: u64 = 0;
    
    try sload(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &storage);
    
    // Verify PC advanced
    try std.testing.expectEqual(@as(usize, 1), pc);
    
    // Verify gas consumption (cold access)
    try std.testing.expectEqual(@as(u64, 3000 - storage.gas_costs.cold_sload), gas_left);
    
    // Verify value on stack
    try std.testing.expectEqual(value, try stack.peek().*);
    
    // Execute another SLOAD (should be warm now)
    try stack.pop(); // Clear previous result
    try stack.push(key);
    gas_left = 3000;
    pc = 0;
    
    try sload(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &storage);
    
    // Verify gas consumption (warm access)
    try std.testing.expectEqual(@as(u64, 3000 - storage.gas_costs.warm_sload), gas_left);
}

test "SSTORE opcode" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var storage = try Storage.init(std.testing.allocator);
    defer storage.deinit();
    
    // Setup test data
    const key = U256.fromU64(0x1234);
    const value = U256.fromU64(0xABCD);
    
    // Prepare stack for SSTORE (value then key)
    try stack.push(key);
    try stack.push(value);
    
    // Execute SSTORE
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 30000;
    var gas_refund: u64 = 0;
    const is_static = false;
    
    try sstore(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &storage, is_static);
    
    // Verify PC advanced
    try std.testing.expectEqual(@as(usize, 1), pc);
    
    // Verify gas consumption (cold access, zero to non-zero)
    try std.testing.expectEqual(
        @as(u64, 30000 - storage.gas_costs.cold_sload - storage.gas_costs.sstore_set), 
        gas_left
    );
    
    // Verify stored value
    const result = try storage.get(key);
    try std.testing.expect(!result.is_cold); // Should be warm now
    try std.testing.expectEqual(value, result.value);
    
    // Test SSTORE that changes non-zero to zero (generates refund)
    try stack.push(key);
    try stack.push(U256.zero());
    
    gas_left = 30000;
    gas_refund = 0;
    pc = 0;
    
    try sstore(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &storage, is_static);
    
    // Verify gas consumption and refund
    try std.testing.expectEqual(
        @as(u64, 30000 - storage.gas_costs.warm_sload - storage.gas_costs.sstore_reset), 
        gas_left
    );
    try std.testing.expectEqual(storage.gas_costs.sstore_clears_refund, gas_refund);
    
    // Verify value is now zero
    const result2 = try storage.get(key);
    try std.testing.expect(result2.value.isZero());
}

test "SSTORE error cases" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var storage = try Storage.init(std.testing.allocator);
    defer storage.deinit();
    
    // Setup test data
    const key = U256.fromU64(0x1234);
    const value = U256.fromU64(0xABCD);
    
    // Prepare stack for SSTORE
    try stack.push(key);
    try stack.push(value);
    
    // Test static state violation
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 30000;
    var gas_refund: u64 = 0;
    const is_static = true; // Static context
    
    // Should fail with StaticStateChange error
    try std.testing.expectError(Error.StaticStateChange, sstore(
        &stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &storage, is_static
    ));
    
    // Test gas cost too high
    const non_static = false;
    gas_left = 100; // Too little gas
    
    // Should fail with OutOfGas error
    try std.testing.expectError(Error.OutOfGas, sstore(
        &stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund, &storage, non_static
    ));
}

test "Gas cost calculation for SSTORE" {
    var storage = try Storage.init(std.testing.allocator);
    defer storage.deinit();
    
    // Test case: cold access, zero to non-zero
    var gas_result = storage.calculateSstoreGasCost(
        U256.zero(),       // original value
        U256.fromU64(100), // new value
        U256.zero(),       // current value
        true               // cold access
    );
    try std.testing.expectEqual(
        storage.gas_costs.cold_sload + storage.gas_costs.sstore_set,
        gas_result.gas_cost
    );
    try std.testing.expectEqual(@as(i64, 0), gas_result.gas_refund);
    
    // Test case: warm access, non-zero to zero (with refund)
    gas_result = storage.calculateSstoreGasCost(
        U256.fromU64(100), // original value
        U256.zero(),       // new value
        U256.fromU64(100), // current value
        false              // warm access
    );
    try std.testing.expectEqual(storage.gas_costs.sstore_reset, gas_result.gas_cost);
    try std.testing.expectEqual(@as(i64, @intCast(storage.gas_costs.sstore_clears_refund)), gas_result.gas_refund);
    
    // Test case: warm access, no change in value
    gas_result = storage.calculateSstoreGasCost(
        U256.fromU64(100), // original value
        U256.fromU64(100), // new value (same as current)
        U256.fromU64(100), // current value
        false              // warm access
    );
    try std.testing.expectEqual(storage.gas_costs.warm_sstore_unchanged, gas_result.gas_cost);
    try std.testing.expectEqual(@as(i64, 0), gas_result.gas_refund);
}