// Package for opcode tests
pub const test_helpers = @import("test_helpers.zig");

// Re-export all test modules
pub const arithmetic_test = @import("arithmetic_test.zig");
pub const bitwise_test = @import("bitwise_test.zig");
pub const block_test = @import("block_test.zig");
pub const comparison_test = @import("comparison_test.zig");
pub const control_test = @import("control_test.zig");
pub const crypto_test = @import("crypto_test.zig");
pub const environment_test = @import("environment_test.zig");
pub const log_test = @import("log_test.zig");
pub const memory_test = @import("memory_test.zig");
pub const stack_test = @import("stack_test.zig");
pub const storage_test = @import("storage_test.zig");
pub const system_test = @import("system_test.zig");

// Run all tests
test {
    _ = arithmetic_test;
    _ = bitwise_test;
    _ = block_test;
    _ = comparison_test;
    _ = control_test;
    _ = crypto_test;
    _ = environment_test;
    _ = log_test;
    _ = memory_test;
    _ = stack_test;
    _ = storage_test;
    _ = system_test;
}