const std = @import("std");
const testing = std.testing;
const evm_mod = @import("evm.zig");
const Evm = evm_mod.Evm;
const ChainRules = evm_mod.ChainRules;

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