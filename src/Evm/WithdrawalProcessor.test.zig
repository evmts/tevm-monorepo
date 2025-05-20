const std = @import("std");
const testing = std.testing;
const evm = @import("Evm");
const ChainRules = evm.ChainRules;
const Hardfork = evm.Hardfork;
// Import using modules defined in build.zig
const Address = @import("Address").Address;
const Withdrawal = @import("Withdrawal");
const WithdrawalData = Withdrawal.WithdrawalData;
const WithdrawalProcessor = @import("WithdrawalProcessor");
const Block = WithdrawalProcessor.Block;
const BlockWithdrawalProcessor = WithdrawalProcessor.BlockWithdrawalProcessor;
const StateManager = @import("StateManager").StateManager;

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
    
    // StateManager interface implementations
    pub fn getAccount(self: *MockStateManager, address: StateManager.B160) !?struct {
        balance: u128 = 0,
        nonce: u64 = 0,
    } {
        // Create a hex string representation of the address
        var addr_str_buf: [40]u8 = undefined;
        const addr_str = try std.fmt.bufPrint(&addr_str_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        
        if (self.balances.get(addr_str)) |balance| {
            return .{
                .balance = balance,
            };
        }
        return null;
    }
    
    pub fn createAccount(self: *MockStateManager, address: StateManager.B160, balance: u128) !struct {
        balance: u128,
        nonce: u64 = 0,
    } {
        // Create a hex string representation of the address
        var addr_str_buf: [40]u8 = undefined;
        const addr_str = try std.fmt.bufPrint(&addr_str_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        
        try self.balances.put(addr_str, balance);
        return .{
            .balance = balance,
        };
    }
    
    pub fn putAccount(self: *MockStateManager, address: StateManager.B160, account: anytype) !void {
        // Create a hex string representation of the address
        var addr_str_buf: [40]u8 = undefined;
        const addr_str = try std.fmt.bufPrint(&addr_str_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        
        try self.balances.put(addr_str, account.balance);
    }
    
    // Helper function to get balance
    pub fn getBalance(self: *MockStateManager, address: StateManager.B160) !u128 {
        // Create a hex string representation of the address
        var addr_str_buf: [40]u8 = undefined;
        const addr_str = try std.fmt.bufPrint(&addr_str_buf, "{s}", .{std.fmt.fmtSliceHexLower(&address.bytes)});
        
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

// Fix to use Address directly since that's what mock implementation expects
fn convertToAddress(addr_bytes: [20]u8) Address {
    // Since Address is already a [20]u8, we can just return it directly
    return addr_bytes;
}

// Create a withdrawal root hash (this would normally be a Merkle root)
fn createWithdrawalRoot() [32]u8 {
    var root: [32]u8 = undefined;
    for (0..32) |i| {
        root[i] = @truncate(i);
    }
    return root;
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
    const address1 = convertToAddress(addr1_bytes);
    
    const addr2_bytes = createAddressBuffer(0x02);
    const address2 = convertToAddress(addr2_bytes);
    
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
    const shanghai_rules = ChainRules.forHardfork(.Shanghai);
    
    // Process withdrawals in the block
    try block.processWithdrawals(
        @ptrCast(state_manager),
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
    const address = convertToAddress(addr_bytes);
    
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
    const london_rules = ChainRules.forHardfork(.London);
    
    // Process withdrawals in the block - should fail
    const result = block.processWithdrawals(
        @ptrCast(state_manager),
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
    try testing.expect(!ChainRules.forHardfork(.Merge).IsEIP4895);
    
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
    const address = convertToAddress(addr_bytes);
    
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
    const shanghai_rules = ChainRules.forHardfork(.Shanghai);
    
    // Process withdrawals in the block
    try block.processWithdrawals(
        @ptrCast(state_manager),
        shanghai_rules
    );
    
    // Check that account balance is the sum of all withdrawals
    const balance = try state_manager.getBalance(address);
    const expected_balance: u128 = 6_000_000_000_000_000_000; // 6 ETH (1+2+3)
    try testing.expectEqual(expected_balance, balance);
}