const std = @import("std");
const testing = std.testing;
const builtin = @import("builtin");

// Key types
const Address = @import("../Address/package.zig").Address;

const B160 = struct {
    bytes: [20]u8,
};

// Account structure
const Account = struct {
    balance: u128,
    nonce: u64 = 0,
};

// MockStateManager should be the same as in the main test
const MockStateManager = struct {
    // Track balances for testing
    balances: std.StringHashMap(u128),
    
    fn init(allocator: std.mem.Allocator) !*MockStateManager {
        const self = try allocator.create(MockStateManager);
        self.* = .{
            .balances = std.StringHashMap(u128).init(allocator),
        };
        return self;
    }
    
    fn deinit(self: *MockStateManager) void {
        // Free all allocated keys
        var it = self.balances.iterator();
        while (it.next()) |entry| {
            self.balances.allocator.free(entry.key_ptr.*);
        }
        self.balances.deinit();
    }
    
    // Helper to get a consistent string key from any address type
    fn getAddressKey(self: *MockStateManager, address: anytype) ![]const u8 {
        var key_buf: [40]u8 = undefined;
        
        if (@TypeOf(address) == B160) {
            std.debug.print("B160 address: {any}\n", .{address.bytes});
            _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        } else if (@TypeOf(address) == Address) {
            std.debug.print("Address: {any}\n", .{address});
            _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        } else {
            @compileError("Unsupported address type");
        }
        
        std.debug.print("Generated key: {s}\n", .{key_buf});
        
        // Make a copy for the hash map
        return try self.balances.allocator.dupe(u8, key_buf[0..]);
    }
    
    // StateManager interface implementations
    pub fn getAccount(self: *MockStateManager, address: B160) !?Account {
        // Create a temporary key for lookup
        var key_buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        std.debug.print("getAccount with key: {s}\n", .{key_buf});
        
        if (self.balances.get(&key_buf)) |balance| {
            std.debug.print("Found account with balance: {d}\n", .{balance});
            return Account{
                .balance = balance,
            };
        } else {
            std.debug.print("Account not found\n", .{});
        }
        return null;
    }
    
    pub fn createAccount(self: *MockStateManager, address: B160, balance: u128) !Account {
        // Get a durable key
        const key = try self.getAddressKey(address);
        std.debug.print("createAccount with key: {s}, balance: {d}\n", .{key, balance});
        
        // Check if key already exists
        var buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        
        if (self.balances.getKey(&buf)) |existing_key| {
            // Update existing entry
            std.debug.print("Account exists, updating balance\n", .{});
            try self.balances.put(existing_key, balance);
            self.balances.allocator.free(key);
        } else {
            // Create a new entry
            std.debug.print("New account created\n", .{});
            try self.balances.put(key, balance);
        }
        
        return Account{
            .balance = balance,
        };
    }
    
    pub fn putAccount(self: *MockStateManager, address: B160, account: Account) !void {
        // Create a temporary key for lookup
        var buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        std.debug.print("putAccount with key: {s}, balance: {d}\n", .{buf, account.balance});
        
        if (self.balances.getKey(&buf)) |existing_key| {
            // Update existing entry
            std.debug.print("Updating existing account\n", .{});
            try self.balances.put(existing_key, account.balance);
        } else {
            // Create a new entry
            std.debug.print("Creating new account in putAccount\n", .{});
            const key = try self.getAddressKey(address);
            try self.balances.put(key, account.balance);
        }
    }
    
    // Helper function to get balance
    pub fn getBalance(self: *MockStateManager, address: Address) !u128 {
        var buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        std.debug.print("getBalance with key: {s}\n", .{buf});
        
        if (self.balances.get(&buf)) |balance| {
            std.debug.print("Found balance: {d}\n", .{balance});
            return balance;
        } else {
            std.debug.print("Balance not found\n", .{});
        }
        return 0;
    }
    
    // Debug function to print all balances
    pub fn printAllBalances(self: *MockStateManager) void {
        std.debug.print("\n--- All Balances ---\n", .{});
        var it = self.balances.iterator();
        var count: usize = 0;
        while (it.next()) |entry| {
            std.debug.print("Key: {s}, Balance: {d}\n", .{entry.key_ptr.*, entry.value_ptr.*});
            count += 1;
        }
        std.debug.print("Total entries: {d}\n", .{count});
        std.debug.print("-------------------\n\n", .{});
    }
};

// Simple reward function
fn rewardAccount(stateManager: *MockStateManager, address: Address, amount: u128) !void {
    std.debug.print("\nRewardAccount start\n", .{});
    
    // Create B160 from Address
    const b160 = B160{ .bytes = address };
    
    // Get the account from state or create one
    var account = try stateManager.getAccount(b160) orelse blk: {
        std.debug.print("Account doesn't exist, creating new one\n", .{});
        break :blk try stateManager.createAccount(b160, 0);
    };
    
    // Increase the account balance
    const oldBalance = account.balance;
    account.balance += amount;
    
    std.debug.print("Balance updated: {d} -> {d}\n", .{oldBalance, account.balance});
    
    // Save the updated account state
    try stateManager.putAccount(b160, account);
    
    std.debug.print("RewardAccount complete\n", .{});
}

// Create a test address
fn createTestAddress(value: u8) Address {
    var addr: Address = undefined;
    for (0..20) |i| {
        addr[i] = value;
    }
    return addr;
}

test "Simple state manager test" {
    std.debug.print("\n=== Simple State Manager Test ===\n", .{});
    
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var stateManager = try MockStateManager.init(allocator);
    defer stateManager.deinit();
    
    // Create a test address
    const addr = createTestAddress(0xAA);
    
    // Print initial state
    stateManager.printAllBalances();
    
    // Add balance to the account (1 ETH)
    try rewardAccount(stateManager, addr, 1_000_000_000_000_000_000);
    
    // Print state after first reward
    stateManager.printAllBalances();
    
    // Check the balance
    const balance = try stateManager.getBalance(addr);
    
    // Should be 1 ETH in Wei
    try testing.expectEqual(@as(u128, 1_000_000_000_000_000_000), balance);
    
    // Add more (2 ETH)
    try rewardAccount(stateManager, addr, 2_000_000_000_000_000_000);
    
    // Print final state
    stateManager.printAllBalances();
    
    // Check the balance again
    const finalBalance = try stateManager.getBalance(addr);
    
    // Should now be 3 ETH in Wei
    try testing.expectEqual(@as(u128, 3_000_000_000_000_000_000), finalBalance);
    
    std.debug.print("=== Test Complete ===\n", .{});
}