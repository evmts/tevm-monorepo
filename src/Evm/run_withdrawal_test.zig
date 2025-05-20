const std = @import("std");

// Import modules
const withdrawal_test = @import("Withdrawal.test.zig");

pub fn main() !void {
    std.debug.print("Running Withdrawal tests...\n", .{});
    
    // Run withdrawal tests
    std.testing.refAllDeclsRecursive(withdrawal_test);
    
    std.debug.print("All tests have been run successfully!\n", .{});
}