const std = @import("std");
const testing = std.testing;

// Constants for COINBASE access gas costs
const COLD_ACCESS_COST = 2100;
const WARM_ACCESS_COST = 100;

// Interface for a chain rules configuration
const ChainRules = struct {
    IsEIP3651: bool = false, // EIP-3651: Warm COINBASE
    
    pub fn init(eip3651_enabled: bool) ChainRules {
        return ChainRules{
            .IsEIP3651 = eip3651_enabled,
        };
    }
};

// Simple representation of an address
const Address = [20]u8;

// Implementation of an access list to track warm addresses
const AccessList = struct {
    warm_addresses: std.ArrayList(Address),
    
    pub fn init(allocator: std.mem.Allocator) !AccessList {
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
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("Address {any} already warm\n", .{address});
                }
                return;
            }
        }
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Adding address {any} to warm list\n", .{address});
        }
        try self.warm_addresses.append(address);
    }
    
    pub fn isWarm(self: *const AccessList, address: Address) bool {
        for (self.warm_addresses.items) |addr| {
            if (std.mem.eql(u8, &addr, &address)) {
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("Address {any} is warm\n", .{address});
                }
                return true;
            }
        }
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Address {any} is cold\n", .{address});
        }
        return false;
    }
};

// Create a struct to simulate EVM state
const EVMState = struct {
    chain_rules: ChainRules,
    access_list: AccessList,
    coinbase: Address,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator, rules: ChainRules) !EVMState {
        const access_list = try AccessList.init(allocator);
        
        return EVMState{
            .chain_rules = rules,
            .access_list = access_list,
            .coinbase = std.mem.zeroes(Address),
            .allocator = allocator,
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
            if (@import("builtin").mode == .Debug) {
                std.debug.print("EIP-3651 enabled, making COINBASE warm by default\n", .{});
            }
            try self.access_list.addAddress(self.coinbase);
        } else {
            if (@import("builtin").mode == .Debug) {
                std.debug.print("EIP-3651 disabled, COINBASE will be cold by default\n", .{});
            }
        }
    }
    
    // Simulate the COINBASE opcode to retrieve coinbase address
    pub fn opCoinbase(self: *EVMState) !struct { gas_cost: u64, address: Address } {
        const is_warm = self.access_list.isWarm(self.coinbase);
        const gas_cost: u64 = if (is_warm) WARM_ACCESS_COST else COLD_ACCESS_COST;
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("COINBASE opcode execution: gas_cost={d}, is_warm={}\n", .{gas_cost, is_warm});
        }
        
        // Make the address warm for future accesses regardless of initial state
        try self.access_list.addAddress(self.coinbase);
        
        return .{ .gas_cost = gas_cost, .address = self.coinbase };
    }
};

test "EIP-3651: COINBASE should be warm by default when enabled" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: COINBASE should be warm by default when EIP-3651 is enabled\n", .{});
    }
    
    // Setup test environment with EIP-3651 enabled
    const rules = ChainRules.init(true);
    var evm_state = try EVMState.init(testing.allocator, rules);
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
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: COINBASE was warm by default with EIP-3651 enabled\n", .{});
    }
}

test "EIP-3651: COINBASE should be cold by default when disabled" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: COINBASE should be cold by default when EIP-3651 is disabled\n", .{});
    }
    
    // Setup test environment with EIP-3651 disabled
    const rules = ChainRules.init(false);
    var evm_state = try EVMState.init(testing.allocator, rules);
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
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: COINBASE was cold by default with EIP-3651 disabled\n", .{});
    }
}

test "EIP-3651: Multiple COINBASE accesses" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: Multiple COINBASE accesses\n", .{});
    }
    
    // Setup test environment with EIP-3651 enabled
    const rules = ChainRules.init(true);
    var evm_state = try EVMState.init(testing.allocator, rules);
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
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: All COINBASE accesses were warm with EIP-3651 enabled\n", .{});
    }
}

test "EIP-3651: Change coinbase after initialization" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: Changing coinbase after initialization\n", .{});
    }
    
    // Setup test environment with EIP-3651 enabled
    const rules = ChainRules.init(true);
    var evm_state = try EVMState.init(testing.allocator, rules);
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
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: New coinbase was cold after changing\n", .{});
    }
}