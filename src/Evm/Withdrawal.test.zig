const std = @import("std");
const testing = std.testing;
const Withdrawal = @import("Withdrawal.zig");
const WithdrawalData = Withdrawal.WithdrawalData;
const processWithdrawals = Withdrawal.processWithdrawals;
const Address = @import("../Address/address.zig").Address;
const StateManager = @import("../StateManager/StateManager.zig").StateManager;
const evm = @import("evm.zig");
const ChainRules = evm.ChainRules;

// Mock StateManager for testing withdrawal processing
const MockStateManager = struct {
    // Track balances for testing
    balances: std.StringHashMap(u128),
    
    fn init(allocator: std.mem.Allocator) !*MockStateManager {
        var self = try allocator.create(MockStateManager);
        self.* = .{
            .balances = std.StringHashMap(u128).init(allocator),
        };
        return self;
    }
    
    fn deinit(self: *MockStateManager) void {
        self.balances.deinit();
    }
    
    // StateManager interface implementations
    pub fn getAccount(self: *MockStateManager, address: Address) !?struct {
        balance: u128 = 0,
        nonce: u64 = 0,
    } {
        const addr_str = try address.toString();
        if (self.balances.get(addr_str)) |balance| {
            return .{
                .balance = balance,
            };
        }
        return null;
    }
    
    pub fn createAccount(self: *MockStateManager, address: Address, balance: u128) !struct {
        balance: u128,
        nonce: u64 = 0,
    } {
        const addr_str = try address.toString();
        try self.balances.put(addr_str, balance);
        return .{
            .balance = balance,
        };
    }
    
    pub fn putAccount(self: *MockStateManager, address: Address, account: anytype) !void {
        const addr_str = try address.toString();
        try self.balances.put(addr_str, account.balance);
    }
    
    // Helper function to get balance
    pub fn getBalance(self: *MockStateManager, address: Address) !u128 {
        const addr_str = try address.toString();
        return self.balances.get(addr_str) orelse 0;
    }
};

// Create a buffer with 20 bytes to represent an address
fn createAddressBuffer(byte_value: u8) [20]u8 {
    var buffer: [20]u8 = undefined;
    for (0..20) |i| {
        buffer[i] = byte_value;
    }
    return buffer;
}

test "WithdrawalData initialization and Gwei conversion" {
    // Create test address
    const addr_bytes = createAddressBuffer(0xAA);
    const address = try Address.fromBytes(&addr_bytes);
    
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
    try testing.expectEqual(address, withdrawal.address);
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
    const addr_bytes = createAddressBuffer(0xBB);
    const address = try Address.fromBytes(&addr_bytes);
    
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
        @ptrCast(*StateManager, state_manager), 
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
    const addr1_bytes = createAddressBuffer(0xCC);
    const address1 = try Address.fromBytes(&addr1_bytes);
    
    const addr2_bytes = createAddressBuffer(0xDD);
    const address2 = try Address.fromBytes(&addr2_bytes);
    
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
        @ptrCast(*StateManager, state_manager), 
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
    const addr_bytes = createAddressBuffer(0xEE);
    const address = try Address.fromBytes(&addr_bytes);
    
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
        @ptrCast(*StateManager, state_manager), 
        &withdrawals, 
        false // EIP-4895 disabled
    );
    
    // Should return an error
    try testing.expectError(error.EIP4895NotEnabled, result);
    
    // Balance should remain zero
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 0), balance);
}

test "ChainRules correctly identifies EIP-4895 activation" {
    // Shanghai should have EIP-4895
    const shanghai_rules = ChainRules.forHardfork(.Shanghai);
    try testing.expect(shanghai_rules.IsEIP4895);
    
    // Cancun should have EIP-4895
    const cancun_rules = ChainRules.forHardfork(.Cancun);
    try testing.expect(cancun_rules.IsEIP4895);
    
    // London should not have EIP-4895
    const london_rules = ChainRules.forHardfork(.London);
    try testing.expect(!london_rules.IsEIP4895);
}