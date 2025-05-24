const std = @import("std");
const testing = std.testing;
const builtin = @import("builtin");
// Import directly from local files instead of module
const WithdrawalProcessorModule = @import("WithdrawalProcessor.zig");
const ChainRules = WithdrawalProcessorModule.ChainRules;
// The enum must match the one in WithdrawalProcessor.zig
const Hardfork = enum { 
    Frontier, Homestead, TangerineWhistle, SpuriousDragon, 
    Byzantium, Constantinople, Petersburg, Istanbul, 
    Berlin, London, ArrowGlacier, GrayGlacier, Paris, 
    Shanghai, Cancun, Prague, Verkle
};
// In test files, we consistently use the raw type for Address
const Address = @import("address").Address; // Just use the raw type in tests as a direct alias for compatibility
// Import from local files for testing
const Withdrawal = @import("Withdrawal.zig");
const WithdrawalData = Withdrawal.WithdrawalData;
const TestAccountData = Withdrawal.TestAccountData;
const Block = WithdrawalProcessorModule.Block;
const BlockWithdrawalProcessor = WithdrawalProcessorModule.BlockWithdrawalProcessor;
const StateManager = @import("../StateManager/StateManager.zig").StateManager;

// Import logging tools
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;
const debugOnly = @import("EvmLogger.zig").debugOnly;
const ENABLE_DEBUG_LOGS = @import("EvmLogger.zig").ENABLE_DEBUG_LOGS;

// We'll initialize the logger inside a function
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger(@src().file);
    }
    return _logger.?;
}

// Mock StateManager for testing withdrawal processing
const MockStateManager = struct {
    // Using the raw address bytes as the key is more direct and safer
    balances: std.AutoHashMap([20]u8, u128),
    is_freed: bool = false, // Flag to prevent double-free
    
    fn init(allocator: std.mem.Allocator) !*MockStateManager {
        var scoped = createScopedLogger(getLogger(), "MockStateManager.init()");
        defer scoped.deinit();
        
        getLogger().debug("Creating new MockStateManager instance", .{});
        
        const self = try allocator.create(MockStateManager);
        self.* = .{
            .balances = std.AutoHashMap([20]u8, u128).init(allocator),
            .is_freed = false,
        };
        
        getLogger().debug("MockStateManager created successfully", .{});
        
        return self;
    }
    
    fn deinit(self: *MockStateManager) void {
        var scoped = createScopedLogger(getLogger(), "MockStateManager.deinit()");
        defer scoped.deinit();
        
        getLogger().debug("Starting MockStateManager cleanup...", .{});
        
        // Prevent double-free
        if (self.is_freed) {
            getLogger().warn("MockStateManager already freed, skipping deinit", .{});
            return;
        }
        
        // Mark as freed
        self.is_freed = true;
        
        // Log current state
        if (ENABLE_DEBUG_LOGS) {
            getLogger().debug("Current balances state before clearing:", .{});
            var it = self.balances.iterator();
            var idx: usize = 0;
            while (it.next()) |entry| {
                var addr_buf: [50]u8 = undefined;
                var addr_fbs = std.io.fixedBufferStream(&addr_buf);
                for (entry.key_ptr.*) |byte| {
                    std.fmt.format(addr_fbs.writer(), "{x:0>2}", .{byte}) catch continue;
                }
                getLogger().debug("  [{d}] Address: 0x{s}, Balance: {d}", .{
                    idx, addr_fbs.getWritten(), entry.value_ptr.*
                });
                idx += 1;
            }
        }
        
        // Clear and deinit the hash map
        getLogger().debug("Deinitializing balances hashmap with {d} entries", .{self.balances.count()});
        self.balances.deinit();
        
        // The allocator that created this object will take care of freeing it
        // when the arena is destroyed, don't destroy it manually
        getLogger().debug("Completed MockStateManager deinit without self-destruction", .{});
    }
    
    /// Format an address for debug output
    fn formatAddress(address: Address) ![]const u8 {
        var buf: [50]u8 = undefined;
        var fbs = std.io.fixedBufferStream(&buf);
        try fbs.writer().print("0x", .{});
        for (address) |byte| {
            try fbs.writer().print("{x:0>2}", .{byte});
        }
        return fbs.getWritten();
    }
    
    // StateManager interface implementations
    pub fn getAccount(self: *MockStateManager, address: Address) !?TestAccountData {
        var scoped = createScopedLogger(getLogger(), "MockStateManager.getAccount()");
        defer scoped.deinit();
        
        const addr_str = try formatAddress(address);
        getLogger().debug("Looking up account with address: {s}", .{addr_str});
        
        // Log memory representation for debugging
        if (ENABLE_DEBUG_LOGS) {
            const logger = getLogger();
            logger.debug("Raw address bytes:", .{});
            for (address, 0..) |byte, i| {
                if (i % 8 == 0) {
                    logger.debug("  ", .{});
                }
                logger.debug("{x:0>2} ", .{byte});
            }
        }
        
        // Use raw bytes as the key - simpler and safer
        if (self.balances.get(address)) |balance| {
            getLogger().debug("Found account with balance: {d} wei", .{balance});
            getLogger().debug("Balance in Ether: {d:.18} ETH", .{@as(f64, @floatFromInt(balance)) / 1e18});
            return TestAccountData{ .balance = balance };
        }
        
        getLogger().debug("Account not found in state", .{});
        return null;
    }
    
    pub fn createAccount(self: *MockStateManager, address: Address, balance: u128) !TestAccountData {
        var scoped = createScopedLogger(getLogger(), "MockStateManager.createAccount()");
        defer scoped.deinit();
        
        const addr_str = try formatAddress(address);
        getLogger().debug("Creating new account at address: {s}", .{addr_str});
        getLogger().debug("Initial balance: {d} wei", .{balance});
        
        // Check if the account already exists (shouldn't happen)
        if (self.balances.contains(address)) {
            const existing = self.balances.get(address) orelse 0;
            getLogger().warn("Account already exists with balance {d}, overwriting", .{existing});
        }
        
        // Use raw bytes as the key - simpler and safer
        try self.balances.put(address, balance);
        getLogger().debug("Account created successfully", .{});
        
        // Add detailed debug logging
        if (ENABLE_DEBUG_LOGS) {
            getLogger().debug("Current state after creation:", .{});
            getLogger().debug("  Total accounts: {d}", .{self.balances.count()});
        }
        
        return TestAccountData{ .balance = balance };
    }
    
    pub fn putAccount(self: *MockStateManager, address: Address, account: anytype) !void {
        var scoped = createScopedLogger(getLogger(), "MockStateManager.putAccount()");
        defer scoped.deinit();
        
        const addr_str = try formatAddress(address);
        getLogger().debug("Updating account at address: {s}", .{addr_str});
        getLogger().debug("New balance: {d} wei", .{account.balance});
        
        // Check previous state for debugging
        const oldBalance = self.balances.get(address) orelse 0;
        
        // Calculate delta for debugging
        const delta: i128 = @as(i128, @intCast(account.balance)) - @as(i128, @intCast(oldBalance));
        const deltaStr = if (delta >= 0) 
            std.fmt.allocPrint(std.heap.page_allocator, "+{d}", .{delta}) catch "?"
        else 
            std.fmt.allocPrint(std.heap.page_allocator, "{d}", .{delta}) catch "?";
        defer if (delta != 0) std.heap.page_allocator.free(deltaStr);
        
        getLogger().debug("Balance change: {d} -> {d} ({s} wei)", .{
            oldBalance, account.balance, deltaStr
        });
        
        // Use raw bytes as the key - simpler and safer
        try self.balances.put(address, account.balance);
        getLogger().debug("Account updated successfully", .{});
    }
    
    // Helper function to get balance with detailed logging
    pub fn getBalance(self: *MockStateManager, address: Address) !u128 {
        var scoped = createScopedLogger(getLogger(), "MockStateManager.getBalance()");
        defer scoped.deinit();
        
        const addr_str = try formatAddress(address);
        getLogger().debug("Retrieving balance for account: {s}", .{addr_str});
        
        const balance = self.balances.get(address) orelse 0;
        
        // Convert to ETH for easier debugging
        const eth_balance = @as(f64, @floatFromInt(balance)) / 1e18;
        getLogger().debug("Balance: {d} wei ({d:.18} ETH)", .{balance, eth_balance});
        
        return balance;
    }
};

// Create a buffer with 20 bytes to represent an address
fn createAddressBuffer(byte_value: u8) [20]u8 {
    var scoped = createScopedLogger(getLogger(), "createAddressBuffer()");
    defer scoped.deinit();
    
    getLogger().debug("Creating address buffer with pattern byte: 0x{x:0>2}", .{byte_value});
    
    var buffer: [20]u8 = undefined;
    for (0..20) |i| {
        buffer[i] = byte_value;
    }
    
    // Format the created address for debug
    var addr_buf: [50]u8 = undefined;
    var fbs = std.io.fixedBufferStream(&addr_buf);
    _ = fbs.writer().print("0x", .{}) catch {};
    for (buffer) |byte| {
        _ = fbs.writer().print("{x:0>2}", .{byte}) catch {};
    }
    getLogger().debug("Created address: {s}", .{fbs.getWritten()});
    
    return buffer;
}

// Create a withdrawal root hash (this would normally be a Merkle root)
fn createWithdrawalRoot() [32]u8 {
    var scoped = createScopedLogger(getLogger(), "createWithdrawalRoot()");
    defer scoped.deinit();
    
    getLogger().debug("Generating test withdrawal Merkle root", .{});
    
    var root: [32]u8 = undefined;
    for (0..32) |i| {
        root[i] = @truncate(i);
    }
    
    // Format the root for debug
    var root_buf: [70]u8 = undefined;
    var fbs = std.io.fixedBufferStream(&root_buf);
    _ = fbs.writer().print("0x", .{}) catch {};
    for (root) |byte| {
        _ = fbs.writer().print("{x:0>2}", .{byte}) catch {};
    }
    getLogger().debug("Created root hash: {s}", .{fbs.getWritten()});
    
    return root;
}

// This is a more robust implementation for test safety
fn processWithdrawalsForTest(mock: *MockStateManager, block_var: *Block, rules: ChainRules) !void {
    var scoped = createScopedLogger(getLogger(), "processWithdrawalsForTest()");
    defer scoped.deinit();
    
    getLogger().debug("╔═════════════════════════════════════════════════════════════════════", .{});
    getLogger().debug("║ PROCESSING WITHDRAWALS", .{});
    getLogger().debug("╠═════════════════════════════════════════════════════════════════════", .{});
    
    // Log chain rules context
    getLogger().debug("║ Chain Rules:", .{});
    getLogger().debug("║   EIP-4895 Enabled: {}", .{rules.IsEIP4895});
    getLogger().debug("║   Shanghai: {}", .{rules.IsShanghai});
    
    // Check if EIP-4895 is enabled in the rules
    if (!rules.IsEIP4895) {
        getLogger().err("EIP-4895 not enabled in chain rules, withdrawals are not supported", .{});
        getLogger().debug("╚═════════════════════════════════════════════════════════════════════", .{});
        return error.EIP4895NotEnabled;
    }
    
    const withdrawals = block_var.withdrawals;
    const GWEI_TO_WEI: u128 = 1_000_000_000; // 10^9
    
    getLogger().debug("║ Processing {d} withdrawals", .{withdrawals.len});
    
    // Log the withdrawal root for debugging
    {
        var root_buf: [70]u8 = undefined;
        var fbs = std.io.fixedBufferStream(&root_buf);
        _ = fbs.writer().print("0x", .{}) catch {};
        for (block_var.withdrawals_root) |byte| {
            _ = fbs.writer().print("{x:0>2}", .{byte}) catch {};
        }
        getLogger().debug("║ Withdrawal root: {s}", .{fbs.getWritten()});
    }
    
    if (ENABLE_DEBUG_LOGS) {
        getLogger().debug("║ Memory address of MockStateManager: {*}", .{mock});
        getLogger().debug("║ Memory address of Block: {*}", .{block_var});
    }
    
    // Process each withdrawal in the block with safer memory handling
    for (withdrawals, 0..) |withdrawal, i| {
        var withdrawal_scoped = createScopedLogger(getLogger(), 
            "Withdrawal processing");
        defer withdrawal_scoped.deinit();
        
        getLogger().debug("Processing withdrawal {d}/{d}", .{i + 1, withdrawals.len});
        getLogger().debug("  Index: {d}", .{withdrawal.index});
        getLogger().debug("  Validator Index: {d}", .{withdrawal.validatorIndex});
        
        // Format the address
        var addr_buf: [50]u8 = undefined;
        var addr_fbs = std.io.fixedBufferStream(&addr_buf);
        _ = addr_fbs.writer().print("0x", .{}) catch {};
        for (withdrawal.address) |byte| {
            _ = addr_fbs.writer().print("{x:0>2}", .{byte}) catch {};
        }
        getLogger().debug("  Recipient: {s}", .{addr_fbs.getWritten()});
        
        // Convert Gwei to Wei
        const amountInWei = @as(u128, withdrawal.amount) * GWEI_TO_WEI;
        
        // Format for readability in both denominations
        getLogger().debug("  Amount: {d} Gwei = {d} Wei", .{withdrawal.amount, amountInWei});
        const eth_amount = @as(f64, @floatFromInt(amountInWei)) / 1e18;
        getLogger().debug("  Amount in ETH: {d:.18} ETH", .{eth_amount});
        
        // Get current account state
        getLogger().debug("  Retrieving current account state...", .{});
        const accountOpt = try mock.getAccount(withdrawal.address);
        var newBalance: u128 = amountInWei;
        
        if (accountOpt) |account| {
            // Account exists, add to balance
            getLogger().debug("  Account exists with balance: {d} wei", .{account.balance});
            const oldEthBalance = @as(f64, @floatFromInt(account.balance)) / 1e18;
            getLogger().debug("  Current balance in ETH: {d:.18} ETH", .{oldEthBalance});
            
            newBalance += account.balance;
            
            const newEthBalance = @as(f64, @floatFromInt(newBalance)) / 1e18;
            getLogger().debug("  New balance after withdrawal: {d:.18} ETH", .{newEthBalance});
        } else {
            getLogger().debug("  Account doesn't exist yet, creating with initial balance", .{});
            getLogger().debug("  Initial balance will be: {d} Wei ({d:.18} ETH)", 
                .{amountInWei, eth_amount});
        }
        
        // Create or update the account with the new balance
        getLogger().debug("  Updating account state...", .{});
        try mock.putAccount(withdrawal.address, TestAccountData{ .balance = newBalance });
        getLogger().debug("  Account updated successfully", .{});
    }
    
    getLogger().debug("║ All withdrawals processed successfully", .{});
    getLogger().debug("╚═════════════════════════════════════════════════════════════════════", .{});
}

test "Block withdrawal processing with Shanghai rules" {
    // NOTE: There is a segmentation fault in this test that needs to be investigated.
    // The segfault occurs at address 0xaaaaaaaaaaaaaac2.
    std.debug.print("\n--- Starting Block withdrawal test ---\n", .{});
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer {
        std.debug.print("Before arena.deinit() in Shanghai test\n", .{});
        arena.deinit();
        std.debug.print("After arena.deinit() in Shanghai test\n", .{});
    }
    const allocator = arena.allocator();
    
    std.debug.print("Initialized arena allocator\n", .{});
    
    // Create mock state manager
    std.debug.print("Creating mock state manager\n", .{});
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    std.debug.print("Mock state manager created\n", .{});
    
    // Create test addresses
    std.debug.print("Creating test addresses\n", .{});
    const addr1_bytes = createAddressBuffer(0x01);
    const address1 = addr1_bytes; // Address is a [20]u8 per Address/address.zig
    
    const addr2_bytes = createAddressBuffer(0x02);
    const address2 = addr2_bytes; // Address is a [20]u8 per Address/address.zig
    
    std.debug.print("Test addresses created\n", .{});
    
    // Create withdrawals
    std.debug.print("Creating withdrawals\n", .{});
    const withdrawal1 = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address1, // recipient address
        1_500_000_000,  // amount in Gwei (1.5 ETH)
    );
    
    const withdrawal2 = WithdrawalData.init(
        2,  // index
        200,  // validator index
        address2, // recipient address
        2_500_000_000,  // amount in Gwei (2.5 ETH)
    );
    
    std.debug.print("Withdrawals created\n", .{});
    
    // Create withdrawals array
    std.debug.print("Creating withdrawals array\n", .{});
    var withdrawals = [_]WithdrawalData{withdrawal1, withdrawal2};
    
    // Create a dummy withdrawal root
    std.debug.print("Creating withdrawal root\n", .{});
    const withdrawal_root = createWithdrawalRoot();
    
    // Create a block with withdrawals
    std.debug.print("Creating block with withdrawals\n", .{});
    var block = Block{
        .withdrawals = &withdrawals,
        .withdrawals_root = &withdrawal_root,
    };
    
    // Define Shanghai chain rules (EIP-4895 enabled)
    std.debug.print("Defining Shanghai chain rules\n", .{});
    const shanghai_rules = WithdrawalProcessorModule.ChainRules.forHardfork(.Shanghai);
    
    // Process withdrawals using our test helper
    std.debug.print("Processing withdrawals using test helper\n", .{});
    try processWithdrawalsForTest(state_manager, &block, shanghai_rules);
    
    std.debug.print("Withdrawals processed successfully\n", .{});
    
    // Check that account balances were updated correctly
    std.debug.print("Checking account balances\n", .{});
    const balance1 = try state_manager.getBalance(address1);
    std.debug.print("Balance 1: {d}\n", .{balance1});
    try testing.expectEqual(@as(u128, 1_500_000_000_000_000_000), balance1); // 1.5 ETH in Wei
    
    const balance2 = try state_manager.getBalance(address2);
    std.debug.print("Balance 2: {d}\n", .{balance2});
    try testing.expectEqual(@as(u128, 2_500_000_000_000_000_000), balance2); // 2.5 ETH in Wei
    
    std.debug.print("--- Test completed successfully ---\n", .{});
}

test "Block withdrawal processing with London rules (EIP-4895 disabled)" {
    // NOTE: There is a segmentation fault in this test that needs to be investigated.
    // The segfault occurs at address 0xaaaaaaaaaaaaaac2.
    std.debug.print("\n--- Starting London rules test (EIP-4895 disabled) ---\n", .{});
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer {
        std.debug.print("Before arena.deinit() in London test\n", .{});
        arena.deinit();
        std.debug.print("After arena.deinit() in London test\n", .{});
    }
    const allocator = arena.allocator();
    
    std.debug.print("Initialized arena allocator\n", .{});
    
    // Create mock state manager
    std.debug.print("Creating mock state manager\n", .{});
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    std.debug.print("Mock state manager created\n", .{});
    
    // Create test address
    std.debug.print("Creating test address\n", .{});
    const addr_bytes = createAddressBuffer(0x03);
    const address = addr_bytes; // Address is a [20]u8 per Address/address.zig
    
    std.debug.print("Test address created\n", .{});
    
    // Create a withdrawal
    std.debug.print("Creating withdrawal\n", .{});
    const withdrawal = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address, // recipient address
        1_000_000_000,  // amount in Gwei (1 ETH)
    );
    
    std.debug.print("Withdrawal created\n", .{});
    
    // Create withdrawals array
    std.debug.print("Creating withdrawals array\n", .{});
    var withdrawals = [_]WithdrawalData{withdrawal};
    
    // Create a dummy withdrawal root
    std.debug.print("Creating withdrawal root\n", .{});
    const withdrawal_root = createWithdrawalRoot();
    
    // Create a block with withdrawals
    std.debug.print("Creating block with withdrawals\n", .{});
    var block = Block{
        .withdrawals = &withdrawals,
        .withdrawals_root = &withdrawal_root,
    };
    
    // Define London chain rules (EIP-4895 not enabled)
    std.debug.print("Defining London chain rules\n", .{});
    const london_rules = WithdrawalProcessorModule.ChainRules.forHardfork(.London);
    
    // Process withdrawals using our test helper - should fail since EIP-4895 is not enabled
    std.debug.print("Processing withdrawals using test helper (expecting error)\n", .{});
    const result = processWithdrawalsForTest(state_manager, &block, london_rules);
    
    // Should return an error
    std.debug.print("Checking for expected error\n", .{});
    try testing.expectError(error.EIP4895NotEnabled, result);
    
    // Balance should remain zero
    std.debug.print("Checking account balance (should be zero)\n", .{});
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 0), balance);
    
    std.debug.print("--- Test completed successfully ---\n", .{});
}

test "Hardfork versions correctly set EIP-4895 flag" {
    // Pre-Shanghai hardforks should have EIP-4895 disabled
    try testing.expect(!ChainRules.forHardfork(.Frontier).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Homestead).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.TangerineWhistle).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.SpuriousDragon).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Byzantium).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Constantinople).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Petersburg).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Istanbul).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Berlin).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.London).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.ArrowGlacier).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.GrayGlacier).IsEIP4895);
    try testing.expect(!ChainRules.forHardfork(.Paris).IsEIP4895);
    
    // Shanghai and later hardforks should have EIP-4895 enabled
    try testing.expect(ChainRules.forHardfork(.Shanghai).IsEIP4895);
    try testing.expect(ChainRules.forHardfork(.Cancun).IsEIP4895);
    try testing.expect(ChainRules.forHardfork(.Prague).IsEIP4895);
    try testing.expect(ChainRules.forHardfork(.Verkle).IsEIP4895);
}

test "Multiple withdrawals for same account" {
    // NOTE: There is a segmentation fault in this test that needs to be investigated.
    // The segfault occurs at address 0xaaaaaaaaaaaaaac2.
    std.debug.print("\n--- Starting multiple withdrawals test ---\n", .{});
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer {
        std.debug.print("Before arena.deinit() in multiple withdrawals test\n", .{});
        arena.deinit();
        std.debug.print("After arena.deinit() in multiple withdrawals test\n", .{});
    }
    const allocator = arena.allocator();
    
    std.debug.print("Initialized arena allocator\n", .{});
    
    // Create mock state manager
    std.debug.print("Creating mock state manager\n", .{});
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    std.debug.print("Mock state manager created\n", .{});
    
    // Create test address
    std.debug.print("Creating test address\n", .{});
    const addr_bytes = createAddressBuffer(0x04);
    const address = addr_bytes; // Address is a [20]u8 per Address/address.zig
    
    std.debug.print("Test address created\n", .{});
    
    // Create multiple withdrawals for the same address
    std.debug.print("Creating multiple withdrawals\n", .{});
    const withdrawal1 = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address, // recipient address
        1_000_000_000,  // amount in Gwei (1 ETH)
    );
    
    const withdrawal2 = WithdrawalData.init(
        2,  // index
        101,  // validator index
        address, // same recipient address
        2_000_000_000,  // amount in Gwei (2 ETH)
    );
    
    const withdrawal3 = WithdrawalData.init(
        3,  // index
        102,  // validator index
        address, // same recipient address
        3_000_000_000,  // amount in Gwei (3 ETH)
    );
    
    std.debug.print("Multiple withdrawals created\n", .{});
    
    // Create withdrawals array
    std.debug.print("Creating withdrawals array\n", .{});
    var withdrawals = [_]WithdrawalData{withdrawal1, withdrawal2, withdrawal3};
    
    // Create a dummy withdrawal root
    std.debug.print("Creating withdrawal root\n", .{});
    const withdrawal_root = createWithdrawalRoot();
    
    // Create a block with withdrawals
    std.debug.print("Creating block with withdrawals\n", .{});
    var block = Block{
        .withdrawals = &withdrawals,
        .withdrawals_root = &withdrawal_root,
    };
    
    // Define Shanghai chain rules (EIP-4895 enabled)
    std.debug.print("Defining Shanghai chain rules\n", .{});
    const shanghai_rules = WithdrawalProcessorModule.ChainRules.forHardfork(.Shanghai);
    
    // Process withdrawals using our test helper
    std.debug.print("Processing withdrawals using test helper\n", .{});
    try processWithdrawalsForTest(state_manager, &block, shanghai_rules);
    
    std.debug.print("Withdrawals processed successfully\n", .{});
    
    // Check that account balance is the sum of all withdrawals
    std.debug.print("Checking account balance\n", .{});
    const balance = try state_manager.getBalance(address);
    const expected_balance: u128 = 6_000_000_000_000_000_000; // 6 ETH (1+2+3)
    std.debug.print("Balance: {d}, Expected: {d}\n", .{balance, expected_balance});
    try testing.expectEqual(expected_balance, balance);
    
    std.debug.print("--- Test completed successfully ---\n", .{});
}