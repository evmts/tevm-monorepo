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
const Address = [20]u8; // Just use the raw type in tests as a direct alias for compatibility
// Import from local files for testing
const Withdrawal = @import("Withdrawal.zig");
const WithdrawalData = Withdrawal.WithdrawalData;
const TestAccountData = Withdrawal.TestAccountData;
const Block = WithdrawalProcessorModule.Block;
const BlockWithdrawalProcessor = WithdrawalProcessorModule.BlockWithdrawalProcessor;
const StateManager = @import("../StateManager/StateManager.zig").StateManager;

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
        // Free all allocated keys before deinitializing the hashmap
        var key_it = self.balances.keyIterator();
        while (key_it.next()) |key_ptr| {
            self.balances.allocator.free(key_ptr.*);
        }
        self.balances.deinit();
    }
    
    // StateManager interface implementations
    pub fn getAccount(self: *MockStateManager, address: Address) !?TestAccountData {
        // Convert Address to a consistent string representation for storage
        var addr_bytes: [20]u8 = undefined;
        if (@TypeOf(address) == [20]u8) {
            addr_bytes = address;
        } else {
            @memcpy(addr_bytes[0..20], address[0..20]);
        }
        
        const addr_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{std.fmt.fmtSliceHexLower(&addr_bytes)});
        defer self.balances.allocator.free(addr_str);
        
        if (self.balances.get(addr_str)) |balance| {
            return TestAccountData{ .balance = balance };
        }
        return null;
    }
    
    pub fn createAccount(self: *MockStateManager, address: Address, balance: u128) !TestAccountData {
        // Convert Address to a consistent string representation for storage
        var addr_bytes: [20]u8 = undefined;
        if (@TypeOf(address) == [20]u8) {
            addr_bytes = address;
        } else {
            @memcpy(addr_bytes[0..20], address[0..20]);
        }
        
        const addr_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{std.fmt.fmtSliceHexLower(&addr_bytes)});
        
        // Create a copy for long-term storage in the hash map
        const key_dupe = try self.balances.allocator.dupe(u8, addr_str);
        errdefer self.balances.allocator.free(key_dupe);
        
        // Check if key already exists to avoid memory leaks
        if (self.balances.getKey(addr_str)) |existing_key| {
            self.balances.allocator.free(existing_key);
        }
        
        try self.balances.put(key_dupe, balance);
        self.balances.allocator.free(addr_str);
        
        return TestAccountData{ .balance = balance };
    }
    
    pub fn putAccount(self: *MockStateManager, address: Address, account: anytype) !void {
        // Convert Address to a consistent string representation for storage
        var addr_bytes: [20]u8 = undefined;
        if (@TypeOf(address) == [20]u8) {
            addr_bytes = address;
        } else {
            @memcpy(addr_bytes[0..20], address[0..20]);
        }
        
        const addr_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{std.fmt.fmtSliceHexLower(&addr_bytes)});
        defer self.balances.allocator.free(addr_str);
        
        // If key already exists, update the value
        if (self.balances.contains(addr_str)) {
            try self.balances.put(addr_str, account.balance);
        } else {
            // Create a copy for long-term storage
            const key_dupe = try self.balances.allocator.dupe(u8, addr_str);
            errdefer self.balances.allocator.free(key_dupe);
            
            try self.balances.put(key_dupe, account.balance);
        }
    }
    
    // Helper function to get balance
    pub fn getBalance(self: *MockStateManager, address: Address) !u128 {
        // Convert Address to a consistent string representation for storage
        var addr_bytes: [20]u8 = undefined;
        if (@TypeOf(address) == [20]u8) {
            addr_bytes = address;
        } else {
            @memcpy(addr_bytes[0..20], address[0..20]);
        }
        
        const addr_str = try std.fmt.allocPrint(self.balances.allocator, "{s}", .{std.fmt.fmtSliceHexLower(&addr_bytes)});
        defer self.balances.allocator.free(addr_str);
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

// Create a withdrawal root hash (this would normally be a Merkle root)
fn createWithdrawalRoot() [32]u8 {
    var root: [32]u8 = undefined;
    for (0..32) |i| {
        root[i] = @truncate(i);
    }
    return root;
}

// This is a workaround for directly processing withdrawals in tests
// We implement the same logic as in Withdrawal.processWithdrawals but directly
// using our MockStateManager instead of going through the StateManager interface
fn processWithdrawalsForTest(mock: *MockStateManager, block_var: *Block, rules: ChainRules) !void {
    // Directly process withdrawals without going through the normal path
    // This is a workaround for testing only
    if (!rules.IsEIP4895) {
        return error.EIP4895NotEnabled;
    }
    
    const withdrawals = block_var.withdrawals;
    const GWEI_TO_WEI: u128 = 1_000_000_000; // 10^9
    
    for (withdrawals) |withdrawal| {
        const amountInWei = @as(u128, withdrawal.amount) * GWEI_TO_WEI;
        
        // Get or create account
        var account = try mock.getAccount(withdrawal.address) orelse 
            try mock.createAccount(withdrawal.address, 0);
            
        // Update balance
        account.balance += amountInWei;
        
        // Save account
        try mock.putAccount(withdrawal.address, account);
    }
}

test "Block withdrawal processing with Shanghai rules" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create mock state manager
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Create test addresses
    const addr1_bytes = createAddressBuffer(0x01);
    const address1 = addr1_bytes; // Address is a [20]u8 per Address/address.zig
    
    const addr2_bytes = createAddressBuffer(0x02);
    const address2 = addr2_bytes; // Address is a [20]u8 per Address/address.zig
    
    // Create withdrawals
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
    
    // Create withdrawals array
    var withdrawals = [_]WithdrawalData{withdrawal1, withdrawal2};
    
    // Create a dummy withdrawal root
    const withdrawal_root = createWithdrawalRoot();
    
    // Create a block with withdrawals
    var block = Block{
        .withdrawals = &withdrawals,
        .withdrawals_root = &withdrawal_root,
    };
    
    // Define Shanghai chain rules (EIP-4895 enabled)
    const shanghai_rules = WithdrawalProcessorModule.ChainRules.forHardfork(.Shanghai);
    
    // First, make the proper cast and conversion to use our state manager implementation
    const state_manager_ptr: *Withdrawal.StateManager = @ptrCast(@alignCast(state_manager));
    
    // Register the implementation methods
    state_manager_ptr.*.getAccount = (
        struct {
            pub fn getAccount(self: *anyopaque, addr: anytype) !?TestAccountData {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.getAccount(addr);
            }
        }
    ).getAccount;
    
    state_manager_ptr.*.createAccount = (
        struct {
            pub fn createAccount(self: *anyopaque, addr: anytype, balance: u128) !TestAccountData {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.createAccount(addr, balance);
            }
        }
    ).createAccount;
    
    state_manager_ptr.*.putAccount = (
        struct {
            pub fn putAccount(self: *anyopaque, addr: anytype, acct: anytype) !void {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.putAccount(addr, acct);
            }
        }
    ).putAccount;
    
    // Process withdrawals in the block
    try block.processWithdrawals(
        state_manager_ptr,
        shanghai_rules
    );
    
    // Check that account balances were updated correctly
    const balance1 = try state_manager.getBalance(address1);
    try testing.expectEqual(@as(u128, 1_500_000_000_000_000_000), balance1); // 1.5 ETH in Wei
    
    const balance2 = try state_manager.getBalance(address2);
    try testing.expectEqual(@as(u128, 2_500_000_000_000_000_000), balance2); // 2.5 ETH in Wei
}

test "Block withdrawal processing with London rules (EIP-4895 disabled)" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create mock state manager
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Create test address
    const addr_bytes = createAddressBuffer(0x03);
    const address = addr_bytes; // Address is a [20]u8 per Address/address.zig
    
    // Create a withdrawal
    const withdrawal = WithdrawalData.init(
        1,  // index
        100,  // validator index
        address, // recipient address
        1_000_000_000,  // amount in Gwei (1 ETH)
    );
    
    // Create withdrawals array
    var withdrawals = [_]WithdrawalData{withdrawal};
    
    // Create a dummy withdrawal root
    const withdrawal_root = createWithdrawalRoot();
    
    // Create a block with withdrawals
    var block = Block{
        .withdrawals = &withdrawals,
        .withdrawals_root = &withdrawal_root,
    };
    
    // Define London chain rules (EIP-4895 not enabled)
    const london_rules = WithdrawalProcessorModule.ChainRules.forHardfork(.London);
    
    // Create a properly typed state manager pointer
    const state_manager_ptr: *Withdrawal.StateManager = @ptrCast(@alignCast(state_manager));
    
    // Register the implementation methods
    state_manager_ptr.*.getAccount = (
        struct {
            pub fn getAccount(self: *anyopaque, addr: anytype) !?TestAccountData {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.getAccount(addr);
            }
        }
    ).getAccount;
    
    state_manager_ptr.*.createAccount = (
        struct {
            pub fn createAccount(self: *anyopaque, addr: anytype, balance: u128) !TestAccountData {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.createAccount(addr, balance);
            }
        }
    ).createAccount;
    
    state_manager_ptr.*.putAccount = (
        struct {
            pub fn putAccount(self: *anyopaque, addr: anytype, acct: anytype) !void {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.putAccount(addr, acct);
            }
        }
    ).putAccount;
    
    // Process withdrawals in the block - should fail
    const result = block.processWithdrawals(
        state_manager_ptr,
        london_rules
    );
    
    // Should return an error
    try testing.expectError(error.EIP4895NotEnabled, result);
    
    // Balance should remain zero
    const balance = try state_manager.getBalance(address);
    try testing.expectEqual(@as(u128, 0), balance);
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
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create mock state manager
    var state_manager = try MockStateManager.init(allocator);
    defer state_manager.deinit();
    
    // Create test address
    const addr_bytes = createAddressBuffer(0x04);
    const address = addr_bytes; // Address is a [20]u8 per Address/address.zig
    
    // Create multiple withdrawals for the same address
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
    
    // Create withdrawals array
    var withdrawals = [_]WithdrawalData{withdrawal1, withdrawal2, withdrawal3};
    
    // Create a dummy withdrawal root
    const withdrawal_root = createWithdrawalRoot();
    
    // Create a block with withdrawals
    var block = Block{
        .withdrawals = &withdrawals,
        .withdrawals_root = &withdrawal_root,
    };
    
    // Define Shanghai chain rules (EIP-4895 enabled)
    const shanghai_rules = WithdrawalProcessorModule.ChainRules.forHardfork(.Shanghai);
    
    // First, make the proper cast and conversion to use our state manager implementation
    const state_manager_ptr: *Withdrawal.StateManager = @ptrCast(@alignCast(state_manager));
    
    // Register the implementation methods
    state_manager_ptr.*.getAccount = (
        struct {
            pub fn getAccount(self: *anyopaque, addr: anytype) !?TestAccountData {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.getAccount(addr);
            }
        }
    ).getAccount;
    
    state_manager_ptr.*.createAccount = (
        struct {
            pub fn createAccount(self: *anyopaque, addr: anytype, balance: u128) !TestAccountData {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.createAccount(addr, balance);
            }
        }
    ).createAccount;
    
    state_manager_ptr.*.putAccount = (
        struct {
            pub fn putAccount(self: *anyopaque, addr: anytype, acct: anytype) !void {
                const mock: *MockStateManager = @ptrCast(@alignCast(self));
                return mock.putAccount(addr, acct);
            }
        }
    ).putAccount;
    
    // Process withdrawals in the block
    try block.processWithdrawals(
        state_manager_ptr,
        shanghai_rules
    );
    
    // Check that account balance is the sum of all withdrawals
    const balance = try state_manager.getBalance(address);
    const expected_balance: u128 = 6_000_000_000_000_000_000; // 6 ETH (1+2+3)
    try testing.expectEqual(expected_balance, balance);
}