const std = @import("std");
const testing = std.testing;
const evm_mod = @import("evm.zig");
const Evm = evm_mod.Evm;
const ChainRules = evm_mod.ChainRules;

// Test basic initialization of the EVM with default chain rules
test "EVM init with default chain rules" {
    const evm = try Evm.init(null, null);
    
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
    
    const evm = try Evm.init(null, custom_rules);
    
    // Verify that the custom rule was applied
    try testing.expect(!evm.chainRules.IsEIP3541); // Should be disabled
    try testing.expect(evm.chainRules.IsEIP3855); // Default rule should still be on
    try testing.expect(evm.chainRules.IsEIP3860); // Default rule should still be on
}

// Test initialization with allocator (though not fully used in current implementation)
test "EVM init with allocator" {
    const allocator = std.testing.allocator;
    const evm = try Evm.init(allocator, null);
    
    // Just verify that initialization doesn't fail
    try testing.expect(evm.chainRules.IsEIP3541); // Default rules should be applied
}