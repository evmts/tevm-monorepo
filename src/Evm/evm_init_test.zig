const std = @import("std");
const testing = std.testing;
const evm_mod = @import("evm.zig");
const Evm = evm_mod.Evm;
const ChainRules = evm_mod.ChainRules;
const precompile = @import("precompile/Precompiles.zig");

// Test basic initialization of the EVM with default chain rules
test "EVM init with default chain rules" {
    const evm = try Evm.init(null);
    
    // Verify that the EVM is properly initialized with default rules
    try testing.expect(evm.chainRules.IsEIP3541); // Should be enabled by default (Cancun)
    try testing.expect(evm.chainRules.IsEIP3855); // Should be enabled by default (Cancun)
    try testing.expect(evm.chainRules.IsEIP3860); // Should be enabled by default (Cancun)
}

// Test initialization with custom chain rules
test "EVM init with custom chain rules" {
    // Create custom chain rules with EIP-3541 disabled
    var custom_rules = ChainRules{};
    custom_rules.IsEIP3541 = false; // Disable EIP-3541
    
    const evm = try Evm.init(custom_rules);
    
    // Verify that the custom rule was applied
    try testing.expect(!evm.chainRules.IsEIP3541); // Should be disabled
    try testing.expect(evm.chainRules.IsEIP3855); // Default rule should still be on
    try testing.expect(evm.chainRules.IsEIP3860); // Default rule should still be on
}

// Test precompiles initialization
test "EVM precompiles initialization" {
    const allocator = testing.allocator;
    
    // Create EVM with default rules (Cancun)
    var evm = try Evm.init(null);
    
    // Initially, precompiles should be null
    try testing.expect(evm.precompiles == null);
    
    // Initialize precompiles
    try evm.initPrecompiles(allocator);
    
    // Verify precompiles were initialized
    try testing.expect(evm.precompiles != null);
    
    // Check that we have the expected number of precompiles for Cancun
    // Cancun should have 10 precompiles (0x01-0x0a)
    if (evm.precompiles) |contracts| {
        try testing.expectEqual(@as(usize, 10), contracts.count());
        
        // Clean up
        contracts.deinit();
        allocator.destroy(contracts);
    }
}

// Test precompiles for different hardforks
test "EVM precompiles for different hardforks" {
    const allocator = testing.allocator;
    
    // Test Homestead precompiles (should have 4)
    {
        var rules = ChainRules.forHardfork(.Homestead);
        var evm = try Evm.init(rules);
        try evm.initPrecompiles(allocator);
        
        if (evm.precompiles) |contracts| {
            try testing.expectEqual(@as(usize, 4), contracts.count());
            contracts.deinit();
            allocator.destroy(contracts);
        }
    }
    
    // Test Byzantium precompiles (should have 8)
    {
        var rules = ChainRules.forHardfork(.Byzantium);
        var evm = try Evm.init(rules);
        try evm.initPrecompiles(allocator);
        
        if (evm.precompiles) |contracts| {
            try testing.expectEqual(@as(usize, 8), contracts.count());
            contracts.deinit();
            allocator.destroy(contracts);
        }
    }
    
    // Test Istanbul precompiles (should have 9)
    {
        var rules = ChainRules.forHardfork(.Istanbul);
        var evm = try Evm.init(rules);
        try evm.initPrecompiles(allocator);
        
        if (evm.precompiles) |contracts| {
            try testing.expectEqual(@as(usize, 9), contracts.count());
            contracts.deinit();
            allocator.destroy(contracts);
        }
    }
}