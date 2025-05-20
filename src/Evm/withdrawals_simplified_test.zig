const std = @import("std");
const testing = std.testing;
const builtin = @import("builtin");

// Simple types
const Address = [20]u8;

const B160 = struct {
    bytes: [20]u8,
};

const TestAccountData = struct {
    balance: u128,
    nonce: u64 = 0,
};

// Simple StateManager interface for test
const StateManager = struct {
    // Balances storage
    balances: std.StringHashMap(u128),
    allocator: std.mem.Allocator,
    
    fn init(allocator: std.mem.Allocator) !*StateManager {
        const self = try allocator.create(StateManager);
        self.* = .{
            .balances = std.StringHashMap(u128).init(allocator),
            .allocator = allocator,
        };
        return self;
    }
    
    fn deinit(self: *StateManager) void {
        var it = self.balances.iterator();
        while (it.next()) |entry| {
            self.allocator.free(entry.key_ptr.*);
        }
        self.balances.deinit();
    }
    
    // Create a durable string key from address bytes
    fn getAddressKey(self: *StateManager, address: Address) ![]const u8 {
        var key_buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        return try self.allocator.dupe(u8, &key_buf);
    }
    
    // Implementation of StateManager interface
    fn getAccount(self: *StateManager, address: Address) !?TestAccountData {
        var key_buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        
        if (self.balances.get(&key_buf)) |balance| {
            return TestAccountData{ .balance = balance };
        }
        return null;
    }
    
    fn createAccount(self: *StateManager, address: Address, balance: u128) !TestAccountData {
        const key = try self.getAddressKey(address);
        errdefer self.allocator.free(key);
        
        // Check if key already exists
        var key_buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        
        if (self.balances.getKey(&key_buf)) |existing_key| {
            // Update existing entry
            try self.balances.put(existing_key, balance);
            // Free the newly created key
            self.allocator.free(key);
        } else {
            // Create a new entry
            try self.balances.put(key, balance);
        }
        
        return TestAccountData{ .balance = balance };
    }
    
    fn putAccount(self: *StateManager, address: Address, account: TestAccountData) !void {
        var key_buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        
        if (self.balances.getKey(&key_buf)) |existing_key| {
            // Update existing entry
            try self.balances.put(existing_key, account.balance);
        } else {
            // Create a new entry
            const key = try self.getAddressKey(address);
            try self.balances.put(key, account.balance);
        }
    }
    
    // Debug helper
    fn getBalance(self: *StateManager, address: Address) !u128 {
        var key_buf: [40]u8 = undefined;
        _ = try std.fmt.bufPrint(&key_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address)});
        return self.balances.get(&key_buf) orelse 0;
    }
    
    // Debug helper to print balances
    fn printBalances(self: *StateManager) void {
        std.debug.print("Current balances:\n", .{});
        var it = self.balances.iterator();
        var count: usize = 0;
        while (it.next()) |entry| {
            std.debug.print("  {s}: {d}\n", .{entry.key_ptr.*, entry.value_ptr.*});
            count += 1;
        }
        std.debug.print("Total entries: {d}\n", .{count});
    }
};

// WithdrawalData represents withdrawals from the beacon chain
const WithdrawalData = struct {
    index: u64,
    validatorIndex: u64,
    address: Address,
    amount: u64,
    
    fn init(index: u64, validatorIndex: u64, address: Address, amount: u64) WithdrawalData {
        return .{
            .index = index,
            .validatorIndex = validatorIndex,
            .address = address,
            .amount = amount,
        };
    }
    
    fn amountInWei(self: *const WithdrawalData) u128 {
        const GWEI_TO_WEI: u128 = 1_000_000_000; // 10^9
        return @as(u128, self.amount) * GWEI_TO_WEI;
    }
};

// ChainRules struct to match what's in WithdrawalProcessor.zig
const ChainRules = struct {
    IsEIP4895: bool = false,
    
    fn forHardfork(hardfork: enum {
        Frontier, Homestead, TangerineWhistle, SpuriousDragon,
        Byzantium, Constantinople, Petersburg, Istanbul,
        Berlin, London, ArrowGlacier, GrayGlacier, Paris,
        Shanghai, Cancun, Prague, Verkle,
    }) ChainRules {
        var rules = ChainRules{};
        
        if (hardfork == .Shanghai or hardfork == .Cancun or hardfork == .Prague or hardfork == .Verkle) {
            rules.IsEIP4895 = true;
        }
        
        return rules;
    }
};

// Process withdrawals implementation
fn processWithdrawals(state_manager: *StateManager, withdrawals: []const WithdrawalData, isEIP4895Enabled: bool) !void {
    if (!isEIP4895Enabled) {
        return error.EIP4895NotEnabled;
    }
    
    for (withdrawals) |withdrawal| {
        const amountInWei = withdrawal.amountInWei();
        
        // Get or create account
        var account = (try state_manager.getAccount(withdrawal.address)) orelse 
            try state_manager.createAccount(withdrawal.address, 0);
        
        // Update balance
        account.balance += amountInWei;
        
        // Save account
        try state_manager.putAccount(withdrawal.address, account);
    }
}

// Create a test address
fn createTestAddress(value: u8) Address {
    var addr: Address = undefined;
    for (0..20) |i| {
        addr[i] = value;
    }
    return addr;
}

// Simple test
test "Process single withdrawal" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var state_manager = try StateManager.init(allocator);
    defer state_manager.deinit();
    
    const address = createTestAddress(0xAA);
    
    const withdrawal = WithdrawalData.init(
        1,
        100,
        address,
        1_000_000_000, // 1 ETH in Gwei
    );
    
    var withdrawals = [_]WithdrawalData{withdrawal};
    
    // Process with EIP-4895 enabled
    try processWithdrawals(state_manager, &withdrawals, true);
    
    // Check balance
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 1_000_000_000_000_000_000), balance); // 1 ETH in Wei
}

// Test multiple withdrawals
test "Process multiple withdrawals" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var state_manager = try StateManager.init(allocator);
    defer state_manager.deinit();
    
    const address1 = createTestAddress(0xBB);
    const address2 = createTestAddress(0xCC);
    
    const withdrawals = [_]WithdrawalData{
        WithdrawalData.init(1, 100, address1, 1_000_000_000), // 1 ETH
        WithdrawalData.init(2, 200, address2, 2_000_000_000), // 2 ETH
        WithdrawalData.init(3, 300, address1, 3_000_000_000), // 3 ETH
    };
    
    // Process with EIP-4895 enabled
    try processWithdrawals(state_manager, &withdrawals, true);
    
    // Check balances
    const balance1 = try state_manager.getBalance(address1);
    try testing.expectEqual(@as(u128, 4_000_000_000_000_000_000), balance1); // 4 ETH (1+3)
    
    const balance2 = try state_manager.getBalance(address2);
    try testing.expectEqual(@as(u128, 2_000_000_000_000_000_000), balance2); // 2 ETH
}

// Test EIP-4895 disabled
test "EIP-4895 disabled fails" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var state_manager = try StateManager.init(allocator);
    defer state_manager.deinit();
    
    const address = createTestAddress(0xDD);
    
    const withdrawal = WithdrawalData.init(
        1,
        100,
        address,
        1_000_000_000, // 1 ETH in Gwei
    );
    
    var withdrawals = [_]WithdrawalData{withdrawal};
    
    // Process with EIP-4895 disabled
    const result = processWithdrawals(state_manager, &withdrawals, false);
    try testing.expectError(error.EIP4895NotEnabled, result);
    
    // Check balance (should be 0)
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 0), balance);
}

// Test hardfork rules
test "Hardfork rules set EIP-4895 correctly" {
    // Should have EIP-4895 enabled
    try testing.expect(ChainRules.forHardfork(.Shanghai).IsEIP4895);
    try testing.expect(ChainRules.forHardfork(.Cancun).IsEIP4895);
    try testing.expect(ChainRules.forHardfork(.Prague).IsEIP4895);
    try testing.expect(ChainRules.forHardfork(.Verkle).IsEIP4895);
    
    // Should have EIP-4895 disabled
    try testing.expect(!ChainRules.forHardfork(.London).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Paris).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Berlin).IsEIP4895);
}