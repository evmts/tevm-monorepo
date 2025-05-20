const std = @import("std");
const B256 = @import("../../Types/B256.ts");
const Address = @import("../../Address/address.zig").Address;
const StateDB = @import("StateDB.zig").StateDB;
const Account = @import("Account.zig").Account;
const testing = std.testing;

/// Access list tracking for EIP-2929
pub const AccessList = struct {
    /// Addresses that have been accessed (warm)
    warm_addresses: std.AutoHashMap(Address, void),
    
    /// Storage slots that have been accessed (warm)
    warm_storage: std.AutoHashMap(struct { Address, B256 }, void),
    
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize a new access list
    pub fn init(allocator: std.mem.Allocator) AccessList {
        return AccessList{
            .warm_addresses = std.AutoHashMap(Address, void).init(allocator),
            .warm_storage = std.AutoHashMap(struct { Address, B256 }, void).init(allocator),
            .allocator = allocator,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *AccessList) void {
        self.warm_addresses.deinit();
        self.warm_storage.deinit();
    }
    
    /// Check if an address is warm
    pub fn isWarm(self: *const AccessList, address: Address) bool {
        return self.warm_addresses.contains(address);
    }
    
    /// Check if a storage slot is warm
    pub fn isSlotWarm(self: *const AccessList, address: Address, slot: B256) bool {
        return self.warm_storage.contains(.{ address, slot });
    }
    
    /// Mark an address as warm
    /// Returns true if the address was cold before
    pub fn addAddress(self: *AccessList, address: Address) !bool {
        if (self.isWarm(address)) {
            return false;
        }
        
        try self.warm_addresses.put(address, {});
        return true;
    }
    
    /// Mark a storage slot as warm
    /// Returns true if the slot was cold before
    pub fn addSlot(self: *AccessList, address: Address, slot: B256) !bool {
        const key = .{ address, slot };
        if (self.isSlotWarm(address, slot)) {
            return false;
        }
        
        try self.warm_storage.put(key, {});
        return true;
    }
    
    /// Clear all warm records
    pub fn clear(self: *AccessList) void {
        self.warm_addresses.clearRetainingCapacity();
        self.warm_storage.clearRetainingCapacity();
    }
};

/// StateManager is the interface between the EVM and the state DB
pub const StateManager = struct {
    /// The underlying state database
    state: StateDB,
    
    /// EIP-2929 access list
    access_list: AccessList,
    
    /// Current transaction context (for prefilled access lists)
    tx_context: struct {
        // The sender of the transaction (always warm)
        sender: ?Address,
        
        // The recipient of the transaction (always warm for contract calls)
        recipient: ?Address,
        
        // Pre-warm access list (from EIP-2930 transactions)
        prewarm_addresses: std.ArrayList(Address),
        prewarm_slots: std.ArrayList(struct { Address, B256 }),
    },
    
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize a new state manager
    pub fn init(allocator: std.mem.Allocator) StateManager {
        return StateManager{
            .state = StateDB.init(allocator),
            .access_list = AccessList.init(allocator),
            .tx_context = .{
                .sender = null,
                .recipient = null,
                .prewarm_addresses = std.ArrayList(Address).init(allocator),
                .prewarm_slots = std.ArrayList(struct { Address, B256 }).init(allocator),
            },
            .allocator = allocator,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *StateManager) void {
        self.state.deinit();
        self.access_list.deinit();
        self.tx_context.prewarm_addresses.deinit();
        self.tx_context.prewarm_slots.deinit();
    }
    
    /// Begin a new transaction
    pub fn beginTransaction(self: *StateManager, sender: Address, recipient: ?Address) !void {
        // Set transaction context
        self.tx_context.sender = sender;
        self.tx_context.recipient = recipient;
        
        // Clear previous access lists
        self.access_list.clear();
        self.tx_context.prewarm_addresses.clearRetainingCapacity();
        self.tx_context.prewarm_slots.clearRetainingCapacity();
        
        // Mark sender as warm
        try self.access_list.addAddress(sender);
        
        // Mark recipient as warm if provided
        if (recipient) |addr| {
            try self.access_list.addAddress(addr);
        }
    }
    
    /// Add addresses to pre-warm for EIP-2930
    pub fn addPrewarmAddresses(self: *StateManager, addresses: []const Address) !void {
        for (addresses) |addr| {
            try self.tx_context.prewarm_addresses.append(addr);
            try self.access_list.addAddress(addr);
        }
    }
    
    /// Add storage slots to pre-warm for EIP-2930
    pub fn addPrewarmSlots(self: *StateManager, slots: []const struct { Address, B256 }) !void {
        for (slots) |slot| {
            try self.tx_context.prewarm_slots.append(slot);
            try self.access_list.addSlot(slot[0], slot[1]);
        }
    }
    
    /// Get account balance
    /// Marks the address as accessed (warm) for EIP-2929 gas metering
    pub fn getBalance(self: *StateManager, address: Address) !struct { u256, bool } {
        // Mark the address as accessed
        const was_cold = try self.access_list.addAddress(address);
        
        // Get the balance
        const balance = self.state.getBalance(address);
        return .{ balance, was_cold };
    }
    
    /// Get account code
    /// Marks the address as accessed (warm) for EIP-2929 gas metering
    pub fn getCode(self: *StateManager, address: Address) !struct { ?[]const u8, bool } {
        // Mark the address as accessed
        const was_cold = try self.access_list.addAddress(address);
        
        // Get the code
        const code = self.state.getCode(address);
        return .{ code, was_cold };
    }
    
    /// Get account code hash
    /// Marks the address as accessed (warm) for EIP-2929 gas metering
    pub fn getCodeHash(self: *StateManager, address: Address) !struct { B256, bool } {
        // Mark the address as accessed
        const was_cold = try self.access_list.addAddress(address);
        
        // Get the code hash
        const hash = self.state.getCodeHash(address);
        return .{ hash, was_cold };
    }
    
    /// Get account code size
    /// Marks the address as accessed (warm) for EIP-2929 gas metering
    pub fn getCodeSize(self: *StateManager, address: Address) !struct { usize, bool } {
        // Mark the address as accessed
        const was_cold = try self.access_list.addAddress(address);
        
        // Get the code size
        const size = self.state.getCodeSize(address);
        return .{ size, was_cold };
    }
    
    /// Get account nonce
    /// Marks the address as accessed (warm) for EIP-2929 gas metering
    pub fn getNonce(self: *StateManager, address: Address) !struct { u64, bool } {
        // Mark the address as accessed
        const was_cold = try self.access_list.addAddress(address);
        
        // Get the nonce
        const nonce = self.state.getNonce(address);
        return .{ nonce, was_cold };
    }
    
    /// Get storage value
    /// Marks the address and slot as accessed (warm) for EIP-2929 gas metering
    pub fn getStorage(self: *StateManager, address: Address, key: B256) !struct { B256, bool, bool } {
        // Mark the address as accessed
        const addr_was_cold = try self.access_list.addAddress(address);
        
        // Mark the slot as accessed
        const slot_was_cold = try self.access_list.addSlot(address, key);
        
        // Get the storage value
        const value = try self.state.getState(address, key);
        return .{ value, addr_was_cold, slot_was_cold };
    }
    
    /// Set storage value
    /// Marks the address and slot as accessed (warm) for EIP-2929 gas metering
    pub fn setStorage(self: *StateManager, address: Address, key: B256, value: B256) !struct { bool, bool } {
        // Mark the address as accessed
        const addr_was_cold = try self.access_list.addAddress(address);
        
        // Mark the slot as accessed
        const slot_was_cold = try self.access_list.addSlot(address, key);
        
        // Set the storage value
        try self.state.setState(address, key, value);
        return .{ addr_was_cold, slot_was_cold };
    }
    
    /// Add to account balance
    pub fn addBalance(self: *StateManager, address: Address, amount: u256) !void {
        try self.state.addBalance(address, amount);
    }
    
    /// Subtract from account balance
    pub fn subBalance(self: *StateManager, address: Address, amount: u256) !void {
        try self.state.subBalance(address, amount);
    }
    
    /// Create a new account
    pub fn createAccount(self: *StateManager, address: Address) !void {
        try self.state.createAccount(address);
        
        // Mark the address as accessed
        try self.access_list.addAddress(address);
    }
    
    /// Mark an account for deletion (self-destruct)
    pub fn selfDestruct(self: *StateManager, address: Address) !void {
        try self.state.deleteAccount(address);
    }
    
    /// Set account code
    pub fn setCode(self: *StateManager, address: Address, code: []const u8) !void {
        try self.state.setCode(address, code);
    }
    
    /// Add to gas refund counter
    pub fn addRefund(self: *StateManager, amount: u64) !void {
        try self.state.addRefund(amount);
    }
    
    /// Get the current gas refund counter
    pub fn getRefund(self: *const StateManager) u64 {
        return self.state.getRefund();
    }
    
    /// Create a snapshot of the current state
    pub fn snapshot(self: *StateManager) !u64 {
        return self.state.snapshot();
    }
    
    /// Revert to a previous snapshot
    pub fn revertToSnapshot(self: *StateManager, id: u64) !void {
        try self.state.revertToSnapshot(id);
    }
    
    /// Check if an address is warm (for EIP-2929)
    pub fn isAddressWarm(self: *const StateManager, address: Address) bool {
        return self.access_list.isWarm(address);
    }
    
    /// Check if a storage slot is warm (for EIP-2929)
    pub fn isSlotWarm(self: *const StateManager, address: Address, slot: B256) bool {
        return self.access_list.isSlotWarm(address, slot);
    }
    
    /// Check if an account exists
    pub fn accountExists(self: *StateManager, address: Address) !bool {
        // Mark the address as accessed
        _ = try self.access_list.addAddress(address);
        
        return self.state.accountExists(address);
    }
    
    /// Check if an account is empty
    pub fn isEmpty(self: *StateManager, address: Address) !bool {
        // Mark the address as accessed
        _ = try self.access_list.addAddress(address);
        
        return self.state.isEmpty(address);
    }
};

// Tests
test "StateManager initialization" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    try testing.expectEqual(@as(u64, 0), manager.getRefund());
}

test "Transaction context and access lists" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    const sender = Address.fromString("0x1111111111111111111111111111111111111111");
    const recipient = Address.fromString("0x2222222222222222222222222222222222222222");
    
    // Begin a transaction
    try manager.beginTransaction(sender, recipient);
    
    // Sender and recipient should be warm
    try testing.expect(manager.isAddressWarm(sender));
    try testing.expect(manager.isAddressWarm(recipient));
    
    // Other addresses should be cold
    const other = Address.fromString("0x3333333333333333333333333333333333333333");
    try testing.expect(!manager.isAddressWarm(other));
    
    // Add pre-warm addresses
    const prewarm = [_]Address{other};
    try manager.addPrewarmAddresses(&prewarm);
    
    // Other address should now be warm
    try testing.expect(manager.isAddressWarm(other));
    
    // Storage slots should be cold
    const slot = B256.fromInt(123);
    try testing.expect(!manager.isSlotWarm(other, slot));
    
    // Add pre-warm slots
    const prewarm_slot = [_]struct { Address, B256 }{.{ other, slot }};
    try manager.addPrewarmSlots(&prewarm_slot);
    
    // Storage slot should now be warm
    try testing.expect(manager.isSlotWarm(other, slot));
}

test "Account operations with EIP-2929 tracking" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    const addr = Address.fromString("0x1234567890123456789012345678901234567890");
    
    // Initial access should be cold
    const balance_result = try manager.getBalance(addr);
    try testing.expectEqual(@as(u256, 0), balance_result[0]);
    try testing.expect(balance_result[1]); // was cold
    
    // Subsequent access should be warm
    const balance_result2 = try manager.getBalance(addr);
    try testing.expectEqual(@as(u256, 0), balance_result2[0]);
    try testing.expect(!balance_result2[1]); // was warm
    
    // Create account
    try manager.createAccount(addr);
    try testing.expect(manager.isAddressWarm(addr));
    
    // Add balance
    try manager.addBalance(addr, 1000);
    
    // Check balance
    const balance_result3 = try manager.getBalance(addr);
    try testing.expectEqual(@as(u256, 1000), balance_result3[0]);
    try testing.expect(!balance_result3[1]); // was warm
}

test "Storage operations with EIP-2929 tracking" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    const addr = Address.fromString("0x1234567890123456789012345678901234567890");
    const key = B256.fromInt(123);
    const value = B256.fromInt(456);
    
    // Create account
    try manager.createAccount(addr);
    
    // Initial storage access should have cold address and cold slot
    const storage_result = try manager.getStorage(addr, key);
    try testing.expect(B256.isZero(storage_result[0])); // value is zero
    try testing.expect(!storage_result[1]); // address was warm (created above)
    try testing.expect(storage_result[2]); // slot was cold
    
    // Set storage
    const set_result = try manager.setStorage(addr, key, value);
    try testing.expect(!set_result[0]); // address was warm
    try testing.expect(!set_result[1]); // slot was warm
    
    // Get storage again
    const storage_result2 = try manager.getStorage(addr, key);
    try testing.expect(B256.equal(value, storage_result2[0])); // value is set
    try testing.expect(!storage_result2[1]); // address was warm
    try testing.expect(!storage_result2[2]); // slot was warm
}

test "Account code operations" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    const addr = Address.fromString("0x1234567890123456789012345678901234567890");
    
    // Create account
    try manager.createAccount(addr);
    
    // Initial code should be null
    const code_result = try manager.getCode(addr);
    try testing.expect(code_result[0] == null);
    try testing.expect(!code_result[1]); // address was warm
    
    // Set code
    const code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0x52 }; // PUSH1 0 PUSH1 0 MSTORE
    try manager.setCode(addr, &code);
    
    // Get code again
    const code_result2 = try manager.getCode(addr);
    try testing.expect(code_result2[0] != null);
    try testing.expect(!code_result2[1]); // address was warm
    try testing.expectEqualSlices(u8, &code, code_result2[0].?);
    
    // Check code size
    const size_result = try manager.getCodeSize(addr);
    try testing.expectEqual(code.len, size_result[0]);
    try testing.expect(!size_result[1]); // address was warm
    
    // Check code hash
    const hash_result = try manager.getCodeHash(addr);
    try testing.expect(!B256.isZero(hash_result[0]));
    try testing.expect(!hash_result[1]); // address was warm
}

test "State snapshots and reverting" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    const addr = Address.fromString("0x1234567890123456789012345678901234567890");
    const key = B256.fromInt(123);
    const value = B256.fromInt(456);
    
    // Create account and set initial state
    try manager.createAccount(addr);
    try manager.addBalance(addr, 1000);
    const nonce_result = try manager.getNonce(addr);
    try testing.expectEqual(@as(u64, 0), nonce_result[0]);
    
    // Create snapshot
    const snapshot = try manager.snapshot();
    
    // Modify state
    try manager.addBalance(addr, 500);
    try manager.setStorage(addr, key, value);
    
    // Verify modifications
    const balance_result = try manager.getBalance(addr);
    try testing.expectEqual(@as(u256, 1500), balance_result[0]);
    
    const storage_result = try manager.getStorage(addr, key);
    try testing.expect(B256.equal(value, storage_result[0]));
    
    // Revert to snapshot
    try manager.revertToSnapshot(snapshot);
    
    // Verify state was reverted
    const balance_result2 = try manager.getBalance(addr);
    try testing.expectEqual(@as(u256, 1000), balance_result2[0]);
    
    const storage_result2 = try manager.getStorage(addr, key);
    try testing.expect(B256.isZero(storage_result2[0]));
}

test "Self-destruct and existence checks" {
    const allocator = testing.allocator;
    var manager = StateManager.init(allocator);
    defer manager.deinit();
    
    const addr = Address.fromString("0x1234567890123456789012345678901234567890");
    
    // Check non-existent account
    const exists_result = try manager.accountExists(addr);
    try testing.expect(!exists_result);
    
    // Create account
    try manager.createAccount(addr);
    
    // Check existence
    const exists_result2 = try manager.accountExists(addr);
    try testing.expect(exists_result2);
    
    // Check emptiness
    const empty_result = try manager.isEmpty(addr);
    try testing.expect(empty_result);
    
    // Add balance
    try manager.addBalance(addr, 1000);
    
    // Check emptiness after adding balance
    const empty_result2 = try manager.isEmpty(addr);
    try testing.expect(!empty_result2);
    
    // Self-destruct
    try manager.selfDestruct(addr);
    
    // Check existence after self-destruct
    const exists_result3 = try manager.accountExists(addr);
    try testing.expect(!exists_result3);
}