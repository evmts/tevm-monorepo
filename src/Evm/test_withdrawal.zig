const std = @import("std");
const testing = std.testing;

// Simple version of Address type
const Address = @import("../Address/package.zig").Address;

// Basic logger implementation
const Logger = struct {
    pub fn debug(self: Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        std.debug.print(fmt ++ "\n", args);
    }
    
    pub fn info(self: Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        std.debug.print(fmt ++ "\n", args);
    }
    
    pub fn warn(self: Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        std.debug.print("[WARN] " ++ fmt ++ "\n", args);
    }
    
    pub fn err(self: Logger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        std.debug.print("[ERROR] " ++ fmt ++ "\n", args);
    }
    
    pub fn deinit(self: Logger) void {
        _ = self;
    }
};

// Simple scoped logger
fn createScopedLogger(parent: Logger, name: []const u8) Logger {
    _ = parent;
    _ = name;
    return Logger{};
}

// Define Account type for consistency
const Account = struct {
    balance: u128,
    nonce: u64 = 0,
};

// WithdrawalData represents a withdrawal from the beacon chain to the EVM
// as defined in EIP-4895
pub const WithdrawalData = struct {
    /// The unique identifier for this withdrawal
    index: u64,
    
    /// The validator index in the beacon chain
    validatorIndex: u64,
    
    /// The recipient address in the EVM
    address: Address,
    
    /// Amount in Gwei (must be converted to Wei for EVM)
    amount: u64,
    
    /// Create a withdrawal from its components
    pub fn init(index: u64, validatorIndex: u64, address: Address, amount: u64) WithdrawalData {
        var logger = Logger{};
        
        logger.debug("Creating new withdrawal record", .{});
        logger.debug("  Index: {d}", .{index});
        logger.debug("  Validator Index: {d}", .{validatorIndex});
        logger.debug("  Amount (Gwei): {d}", .{amount});
        
        return WithdrawalData{
            .index = index,
            .validatorIndex = validatorIndex,
            .address = address,
            .amount = amount,
        };
    }
    
    /// Convert amount from Gwei to Wei (multiplication by 10^9)
    pub fn amountInWei(self: *const WithdrawalData) u128 {
        const GWEI_TO_WEI: u128 = 1_000_000_000; // 10^9
        return @as(u128, self.amount) * GWEI_TO_WEI;
    }
};

// Mock StateManager for testing withdrawal processing
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
        self.balances.deinit();
    }
    
    // Convert address to string key for storage
    fn addressToKey(address: Address) [40]u8 {
        var key: [40]u8 = undefined;
        for (address, 0..) |byte, i| {
            const high = (byte >> 4) & 0xF;
            const low = byte & 0xF;
            key[i*2] = switch (high) {
                0...9 => '0' + @as(u8, @intCast(high)),
                10...15 => 'a' + @as(u8, @intCast(high - 10)),
                else => unreachable,
            };
            key[i*2 + 1] = switch (low) {
                0...9 => '0' + @as(u8, @intCast(low)),
                10...15 => 'a' + @as(u8, @intCast(low - 10)),
                else => unreachable,
            };
        }
        return key;
    }
    
    // StateManager interface implementations
    pub fn getAccount(self: *MockStateManager, address: Address) !?Account {
        const key = addressToKey(address);
        
        // We need to allocate a string that will persist in the hash map
        const key_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{&key});
        
        if (self.balances.get(key_str)) |balance| {
            return Account{
                .balance = balance,
            };
        }
        self.balances.allocator.free(key_str);
        return null;
    }
    
    pub fn createAccount(self: *MockStateManager, address: Address, balance: u128) !Account {
        const key = addressToKey(address);
        
        // We need to allocate a string that will persist in the hash map
        const key_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{&key});
        
        try self.balances.put(key_str, balance);
        return Account{
            .balance = balance,
        };
    }
    
    pub fn putAccount(self: *MockStateManager, address: Address, account: Account) !void {
        const key = addressToKey(address);
        
        // We need to allocate a string that will persist in the hash map
        const key_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{&key});
        
        // Check if key already exists and free the previous key if it does
        if (self.balances.contains(key_str)) {
            const existing_key = self.balances.getKey(key_str) orelse unreachable;
            // Don't allocate a new key, use the existing one
            self.balances.allocator.free(key_str);
            try self.balances.put(existing_key, account.balance);
        } else {
            try self.balances.put(key_str, account.balance);
        }
    }
    
    // Helper function to get balance
    pub fn getBalance(self: *MockStateManager, address: Address) !u128 {
        const key = addressToKey(address);
        
        // Temporary key for lookup
        const key_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{&key});
        defer self.balances.allocator.free(key_str);
        
        return self.balances.get(key_str) orelse 0;
    }
};

// Processes a list of withdrawals by crediting the recipient accounts
pub fn processWithdrawals(
    stateManager: *MockStateManager, 
    withdrawals: []const WithdrawalData,
    isEIP4895Enabled: bool
) !void {
    var logger = Logger{};
    var scoped = createScopedLogger(logger, "processWithdrawals()");
    defer scoped.deinit();
    
    if (!isEIP4895Enabled) {
        logger.warn("Attempted to process withdrawals with EIP-4895 disabled", .{});
        return error.EIP4895NotEnabled;
    }
    
    logger.debug("Processing {d} withdrawals", .{withdrawals.len});
    
    for (withdrawals, 0..) |withdrawal, i| {
        logger.debug("Processing withdrawal {d}/{d} (index {d})", .{i + 1, withdrawals.len, withdrawal.index});
        
        const amountInWei = withdrawal.amountInWei();
        logger.debug("  Amount: {d} Gwei ({d} Wei)", .{withdrawal.amount, amountInWei});
        
        try rewardAccount(stateManager, withdrawal.address, amountInWei);
        
        logger.debug("  Withdrawal processed successfully", .{});
    }
    
    logger.info("All withdrawals processed successfully", .{});
}

// Rewards an account by increasing its balance
fn rewardAccount(stateManager: *MockStateManager, address: Address, amount: u128) !void {
    var logger = Logger{};
    var scoped = createScopedLogger(logger, "rewardAccount()");
    defer scoped.deinit();
    
    logger.debug("Rewarding account", .{});
    logger.debug("Amount: {d} Wei", .{amount});
    
    // Get the account from state (or create a new one if it doesn't exist)
    var account = try stateManager.getAccount(address) orelse blk: {
        logger.debug("Account does not exist, creating new account", .{});
        break :blk try stateManager.createAccount(address, 0);
    };
    
    // Increase the account balance
    const oldBalance = account.balance;
    account.balance += amount;
    
    logger.debug("Balance updated: {d} -> {d}", .{oldBalance, account.balance});
    
    // Save the updated account state
    try stateManager.putAccount(address, account);
    
    logger.debug("Account rewarded successfully", .{});
}

// Create a buffer with 20 bytes to represent an address
fn createAddressBuffer(byte_value: u8) Address {
    var buffer: Address = undefined;
    for (0..20) |i| {
        buffer[i] = byte_value;
    }
    return buffer;
}

test "WithdrawalData initialization and Gwei conversion" {
    // Create test address
    const address = createAddressBuffer(0xAA);
    
    // Create withdrawal data
    const withdrawal = WithdrawalData.init(
        123,  // index
        456,  // validator index
        address, // recipient address
        2_000_000_000,  // amount in Gwei (2 ETH)
    );
    
    // Check initialization
    try testing.expectEqual(@as(u64, 123), withdrawal.index);
    try testing.expectEqual(@as(u64, 456), withdrawal.validatorIndex);
    try testing.expectEqualSlices(u8, &address, &withdrawal.address);
    try testing.expectEqual(@as(u64, 2_000_000_000), withdrawal.amount);
    
    // Check Gwei to Wei conversion (2 ETH = 2 * 10^18 Wei = 2 * 10^9 * 10^9 Wei)
    const expected_wei: u128 = 2_000_000_000_000_000_000;
    try testing.expectEqual(expected_wei, withdrawal.amountInWei());
}

test "Process single withdrawal" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create mock state manager
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Create test address
    const address = createAddressBuffer(0xBB);
    
    // Create a withdrawal
    const withdrawal = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address, // recipient address
        1_000_000_000,  // amount in Gwei (1 ETH)
    );
    
    // Create withdrawals array with single entry
    var withdrawals = [_]WithdrawalData{withdrawal};
    
    // Process withdrawals with EIP-4895 enabled
    try processWithdrawals(
        state_manager, 
        &withdrawals, 
        true // EIP-4895 enabled
    );
    
    // Check that the account balance was updated correctly
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 1_000_000_000_000_000_000), balance); // 1 ETH in Wei
}

test "Process multiple withdrawals" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create mock state manager
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Create test addresses
    const address1 = createAddressBuffer(0xCC);
    const address2 = createAddressBuffer(0xDD);
    
    // Create withdrawals
    const withdrawal1 = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address1, // recipient address
        1_000_000_000,  // amount in Gwei (1 ETH)
    );
    
    const withdrawal2 = WithdrawalData.init(
        2,  // index
        101,  // validator index
        address2, // recipient address
        500_000_000,  // amount in Gwei (0.5 ETH)
    );
    
    const withdrawal3 = WithdrawalData.init(
        3,  // index
        100,  // validator index (same validator as withdrawal1)
        address1, // recipient address (same as withdrawal1)
        2_000_000_000,  // amount in Gwei (2 ETH)
    );
    
    // Create withdrawals array
    var withdrawals = [_]WithdrawalData{withdrawal1, withdrawal2, withdrawal3};
    
    // Process withdrawals with EIP-4895 enabled
    try processWithdrawals(
        state_manager, 
        &withdrawals, 
        true // EIP-4895 enabled
    );
    
    // Check that account balances were updated correctly
    const balance1 = try state_manager.getBalance(address1);
    try testing.expectEqual(@as(u128, 3_000_000_000_000_000_000), balance1); // 3 ETH in Wei (1+2)
    
    const balance2 = try state_manager.getBalance(address2);
    try testing.expectEqual(@as(u128, 500_000_000_000_000_000), balance2); // 0.5 ETH in Wei
}

test "EIP-4895 disabled should fail" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create mock state manager
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Create test address
    const address = createAddressBuffer(0xEE);
    
    // Create a withdrawal
    const withdrawal = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address, // recipient address
        1_000_000_000,  // amount in Gwei (1 ETH)
    );
    
    // Create withdrawals array
    var withdrawals = [_]WithdrawalData{withdrawal};
    
    // Process withdrawals with EIP-4895 disabled
    const result = processWithdrawals(
        state_manager, 
        &withdrawals, 
        false // EIP-4895 disabled
    );
    
    // Should return an error
    try testing.expectError(error.EIP4895NotEnabled, result);
    
    // Balance should remain zero
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 0), balance);
}