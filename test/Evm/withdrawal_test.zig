const std = @import("std");
const testing = std.testing;

// Simplified B160 type for testing
const B160 = struct {
    bytes: [20]u8,
};

// Define a common Account type
const Account = struct {
    balance: u128,
    nonce: u64,
};

// A test Withdrawal type that mimics EIP-4895 withdrawal
const Withdrawal = struct {
    index: u64,
    validatorIndex: u64,
    address: [20]u8,
    amount: u64, // Gwei

    // Safely convert Gwei to Wei 
    pub fn amountInWei(self: *const Withdrawal) u128 {
        const GWEI_TO_WEI: u128 = 1_000_000_000; // 10^9
        return @as(u128, self.amount) * GWEI_TO_WEI;
    }
};

// Mock state manager for testing
const MockStateManager = struct {
    accounts: std.AutoHashMap(u8, Account), // Very simplified - uses first byte of address as key
    allocator: std.mem.Allocator,

    fn init(allocator: std.mem.Allocator) MockStateManager {
        return MockStateManager{
            .accounts = std.AutoHashMap(u8, Account).init(allocator),
            .allocator = allocator,
        };
    }

    fn deinit(self: *MockStateManager) void {
        self.accounts.deinit();
    }

    fn getAccount(self: *MockStateManager, address: [20]u8) ?Account {
        return self.accounts.get(address[0]);
    }

    fn createAccount(self: *MockStateManager, address: [20]u8, balance: u128) !Account {
        const account = Account{
            .balance = balance,
            .nonce = 0,
        };
        try self.accounts.put(address[0], account);
        return account;
    }

    fn putAccount(self: *MockStateManager, address: [20]u8, account: Account) !void {
        try self.accounts.put(address[0], account);
    }
};

// Memory safe implementation of a withdrawal processor
test "Memory safety in withdrawal processing" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state_manager = MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Test 1: Basic withdrawal processing
    {
        // Create an address
        var address = [_]u8{0} ** 20;
        address[0] = 0x01;
        
        // Create a withdrawal
        const withdrawal = Withdrawal{
            .index = 1,
            .validatorIndex = 100,
            .address = address,
            .amount = 1_000_000_000, // 1 ETH in Gwei
        };
        
        // Process the withdrawal safely
        try safeProcessWithdrawal(&state_manager, &withdrawal);
        
        // Verify account was created and balance updated correctly
        const account = state_manager.getAccount(address).?;
        try testing.expectEqual(@as(u128, 1_000_000_000_000_000_000), account.balance); // 1 ETH in Wei
    }

    // Test 2: Multiple withdrawals to the same account
    {
        // Create an address
        var address = [_]u8{0} ** 20;
        address[0] = 0x02;
        
        // Create withdrawals
        const withdrawal1 = Withdrawal{
            .index = 2,
            .validatorIndex = 200,
            .address = address,
            .amount = 1_500_000_000, // 1.5 ETH in Gwei
        };
        
        const withdrawal2 = Withdrawal{
            .index = 3,
            .validatorIndex = 201,
            .address = address,
            .amount = 2_500_000_000, // 2.5 ETH in Gwei
        };
        
        // Process withdrawals safely
        try safeProcessWithdrawal(&state_manager, &withdrawal1);
        try safeProcessWithdrawal(&state_manager, &withdrawal2);
        
        // Verify account was created and balance is correctly summed
        const account = state_manager.getAccount(address).?;
        try testing.expectEqual(@as(u128, 4_000_000_000_000_000_000), account.balance); // 4 ETH in Wei
    }
    
    // Test 3: Array of withdrawals with bounds checking
    {
        var withdrawals = [_]Withdrawal{
            Withdrawal{
                .index = 4,
                .validatorIndex = 300,
                .address = [_]u8{0x03} ++ [_]u8{0} ** 19,
                .amount = 1_000_000_000,
            },
            Withdrawal{
                .index = 5,
                .validatorIndex = 301,
                .address = [_]u8{0x04} ++ [_]u8{0} ** 19,
                .amount = 2_000_000_000,
            },
        };
        
        // Process array of withdrawals safely
        try safeProcessWithdrawals(&state_manager, &withdrawals);
        
        // Verify both accounts were updated
        const account1 = state_manager.getAccount([_]u8{0x03} ++ [_]u8{0} ** 19).?;
        try testing.expectEqual(@as(u128, 1_000_000_000_000_000_000), account1.balance);
        
        const account2 = state_manager.getAccount([_]u8{0x04} ++ [_]u8{0} ** 19).?;
        try testing.expectEqual(@as(u128, 2_000_000_000_000_000_000), account2.balance);
    }
}

// Safely process a single withdrawal
fn safeProcessWithdrawal(state_manager: *MockStateManager, withdrawal: *const Withdrawal) !void {
    // Safe address handling
    const address = withdrawal.address;
    
    // Calculate Wei amount safely
    const amount_in_wei = withdrawal.amountInWei();
    
    // Get or create account with proper error handling
    var account = if (state_manager.getAccount(address)) |acct| acct else blk: {
        break :blk try state_manager.createAccount(address, 0);
    };
    
    // Check for overflow before adding the amount
    const old_balance = account.balance;
    account.balance += amount_in_wei;
    if (account.balance < old_balance) {
        return error.BalanceOverflow;
    }
    
    // Save the updated account
    try state_manager.putAccount(address, account);
}

// Safely process multiple withdrawals
fn safeProcessWithdrawals(state_manager: *MockStateManager, withdrawals: []const Withdrawal) !void {
    // Iterate through withdrawals safely with bounds checking
    for (withdrawals) |*withdrawal| {
        try safeProcessWithdrawal(state_manager, withdrawal);
    }
}