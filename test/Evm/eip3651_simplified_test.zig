const std = @import("std");
const testing = std.testing;

// Constants for our simplified tests
const ADDR_SIZE = 20;
const COLD_ACCESS_COST = 2100;
const WARM_ACCESS_COST = 100;
pub const Address = [ADDR_SIZE]u8;

// Logger for debug output
const DebugLogger = struct {
    name: []const u8,
    
    pub fn init(name: []const u8) DebugLogger {
        return DebugLogger{ .name = name };
    }
    
    pub fn debug(self: DebugLogger, comptime fmt: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("[DEBUG {s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
    
    pub fn info(self: DebugLogger, comptime fmt: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("[INFO {s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
    
    pub fn err(self: DebugLogger, comptime fmt: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("[ERROR {s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
};

var logger = DebugLogger.init("EIP-3651 Test");

// Implementation of the ChainRules, which determine which EIPs are active
const ChainRules = struct {
    // EIP-3651: Warm COINBASE
    IsEIP3651: bool = false,
    
    pub fn init(eip3651_enabled: bool) ChainRules {
        return ChainRules{
            .IsEIP3651 = eip3651_enabled,
        };
    }
};

// Simple access list to track warm/cold addresses
const AccessList = struct {
    warm_addresses: std.ArrayList(Address),
    
    pub fn init(allocator: std.mem.Allocator) AccessList {
        return AccessList{
            .warm_addresses = std.ArrayList(Address).init(allocator),
        };
    }
    
    pub fn deinit(self: *AccessList) void {
        self.warm_addresses.deinit();
    }
    
    pub fn addAddress(self: *AccessList, address: Address) !void {
        // Check if address is already in the list to avoid duplicates
        for (self.warm_addresses.items) |addr| {
            if (std.mem.eql(u8, &addr, &address)) {
                logger.debug("Address {any} already warm", .{address});
                return;
            }
        }
        
        logger.debug("Adding address {any} to warm list", .{address});
        try self.warm_addresses.append(address);
    }
    
    pub fn isWarm(self: *const AccessList, address: Address) bool {
        for (self.warm_addresses.items) |addr| {
            if (std.mem.eql(u8, &addr, &address)) {
                logger.debug("Address {any} is warm", .{address});
                return true;
            }
        }
        
        logger.debug("Address {any} is cold", .{address});
        return false;
    }
};

// Create a struct to simulate EVM state
const EVMState = struct {
    chain_rules: ChainRules,
    access_list: AccessList,
    coinbase: Address,
    
    pub fn init(allocator: std.mem.Allocator, rules: ChainRules) EVMState {
        return EVMState{
            .chain_rules = rules,
            .access_list = AccessList.init(allocator),
            .coinbase = std.mem.zeroes(Address),
        };
    }
    
    pub fn deinit(self: *EVMState) void {
        self.access_list.deinit();
    }
    
    pub fn setCoinbase(self: *EVMState, coinbase: Address) void {
        self.coinbase = coinbase;
    }
    
    // Initialize EVM with base warm addresses
    pub fn initializeAccessList(self: *EVMState) !void {
        // With EIP-3651, COINBASE should be warm by default
        if (self.chain_rules.IsEIP3651) {
            logger.debug("EIP-3651 enabled, making COINBASE warm by default", .{});
            try self.access_list.addAddress(self.coinbase);
        } else {
            logger.debug("EIP-3651 disabled, COINBASE will be cold by default", .{});
        }
    }
    
    // Simulate the COINBASE opcode to retrieve coinbase address
    pub fn opCoinbase(self: *EVMState) !struct { gas_cost: u64, address: Address } {
        const is_warm = self.access_list.isWarm(self.coinbase);
        const gas_cost: u64 = if (is_warm) WARM_ACCESS_COST else COLD_ACCESS_COST;
        
        logger.debug("COINBASE opcode execution: gas_cost={d}, is_warm={}", .{gas_cost, is_warm});
        
        // Make the address warm for future accesses regardless of initial state
        try self.access_list.addAddress(self.coinbase);
        
        return .{ .gas_cost = gas_cost, .address = self.coinbase };
    }
};

test "EIP-3651: COINBASE should be warm by default when enabled" {
    logger.info("Starting test: COINBASE should be warm by default when EIP-3651 is enabled", .{});
    
    // Setup test environment with EIP-3651 enabled
    const rules = ChainRules.init(true);
    var evm_state = EVMState.init(testing.allocator, rules);
    defer evm_state.deinit();
    
    // Set a specific coinbase address
    var coinbase = std.mem.zeroes(Address);
    coinbase[0] = 0xAA;
    coinbase[1] = 0xBB;
    evm_state.setCoinbase(coinbase);
    
    // Initialize access list
    try evm_state.initializeAccessList();
    
    // Check if coinbase is in the warm access list
    try testing.expect(evm_state.access_list.isWarm(coinbase));
    
    // Execute COINBASE opcode and check gas cost
    const result = try evm_state.opCoinbase();
    
    // With EIP-3651, the first COINBASE access should use warm access cost
    try testing.expectEqual(@as(u64, WARM_ACCESS_COST), result.gas_cost);
    
    // Verify the returned coinbase address is correct
    try testing.expect(std.mem.eql(u8, &coinbase, &result.address));
    
    logger.info("Test PASSED: COINBASE was warm by default with EIP-3651 enabled", .{});
}

test "EIP-3651: COINBASE should be cold by default when disabled" {
    logger.info("Starting test: COINBASE should be cold by default when EIP-3651 is disabled", .{});
    
    // Setup test environment with EIP-3651 disabled
    const rules = ChainRules.init(false);
    var evm_state = EVMState.init(testing.allocator, rules);
    defer evm_state.deinit();
    
    // Set a specific coinbase address
    var coinbase = std.mem.zeroes(Address);
    coinbase[0] = 0xCC;
    coinbase[1] = 0xDD;
    evm_state.setCoinbase(coinbase);
    
    // Initialize access list
    try evm_state.initializeAccessList();
    
    // Check if coinbase is not in the warm access list
    try testing.expect(!evm_state.access_list.isWarm(coinbase));
    
    // Execute COINBASE opcode and check gas cost
    const result = try evm_state.opCoinbase();
    
    // Without EIP-3651, the first COINBASE access should use cold access cost
    try testing.expectEqual(@as(u64, COLD_ACCESS_COST), result.gas_cost);
    
    // Second COINBASE access should now be warm
    const result2 = try evm_state.opCoinbase();
    try testing.expectEqual(@as(u64, WARM_ACCESS_COST), result2.gas_cost);
    
    logger.info("Test PASSED: COINBASE was cold by default with EIP-3651 disabled", .{});
}

test "EIP-3651: Multiple COINBASE accesses" {
    logger.info("Starting test: Multiple COINBASE accesses", .{});
    
    // Setup test environment with EIP-3651 enabled
    const rules = ChainRules.init(true);
    var evm_state = EVMState.init(testing.allocator, rules);
    defer evm_state.deinit();
    
    // Set a specific coinbase address
    var coinbase = std.mem.zeroes(Address);
    coinbase[0] = 0xEE;
    coinbase[1] = 0xFF;
    evm_state.setCoinbase(coinbase);
    
    // Initialize access list
    try evm_state.initializeAccessList();
    
    // Execute COINBASE opcode multiple times
    const result1 = try evm_state.opCoinbase();
    try testing.expectEqual(@as(u64, WARM_ACCESS_COST), result1.gas_cost);
    
    const result2 = try evm_state.opCoinbase();
    try testing.expectEqual(@as(u64, WARM_ACCESS_COST), result2.gas_cost);
    
    const result3 = try evm_state.opCoinbase();
    try testing.expectEqual(@as(u64, WARM_ACCESS_COST), result3.gas_cost);
    
    logger.info("Test PASSED: All COINBASE accesses were warm with EIP-3651 enabled", .{});
}

test "EIP-3651: Change coinbase after initialization" {
    logger.info("Starting test: Changing coinbase after initialization", .{});
    
    // Setup test environment with EIP-3651 enabled
    const rules = ChainRules.init(true);
    var evm_state = EVMState.init(testing.allocator, rules);
    defer evm_state.deinit();
    
    // Set initial coinbase address
    var initial_coinbase = std.mem.zeroes(Address);
    initial_coinbase[0] = 0x11;
    initial_coinbase[1] = 0x22;
    evm_state.setCoinbase(initial_coinbase);
    
    // Initialize access list
    try evm_state.initializeAccessList();
    
    // First coinbase should be warm
    try testing.expect(evm_state.access_list.isWarm(initial_coinbase));
    
    // Change coinbase to new address
    var new_coinbase = std.mem.zeroes(Address);
    new_coinbase[0] = 0x33;
    new_coinbase[1] = 0x44;
    evm_state.setCoinbase(new_coinbase);
    
    // New coinbase should be cold since we didn't reinitialize
    try testing.expect(!evm_state.access_list.isWarm(new_coinbase));
    
    // Access to new coinbase should be cold
    const result = try evm_state.opCoinbase();
    try testing.expectEqual(@as(u64, COLD_ACCESS_COST), result.gas_cost);
    
    // After access, new coinbase should be warm
    try testing.expect(evm_state.access_list.isWarm(new_coinbase));
    
    logger.info("Test PASSED: New coinbase was cold after changing", .{});
}