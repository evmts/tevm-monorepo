const std = @import("std");
const testing = std.testing;

// Import using evm module
const evm = @import("src/evm/evm.zig");

test "ECPAIRING basic functionality" {
    // This is a basic smoke test
    const gas_result = evm.precompiles.ecpairing.calculate_gas(0, evm.hardforks.ChainRules.for_hardfork(.ISTANBUL));
    try testing.expectEqual(@as(u64, 45000), gas_result);
    
    const output_size = evm.precompiles.ecpairing.get_output_size(192);
    try testing.expectEqual(@as(usize, 32), output_size);
}