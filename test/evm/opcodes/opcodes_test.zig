// Main entry point for opcodes tests

// Import test helpers
const test_helpers = @import("test_helpers.zig");

// Import all test files
test {
    // Test helpers are already imported above
    
    // Opcode tests
    _ = @import("arithmetic_test.zig");
    _ = @import("bitwise_test.zig");
    _ = @import("comparison_test.zig");
    _ = @import("block_test.zig");
    _ = @import("crypto_test.zig");
    _ = @import("environment_test.zig");
    _ = @import("log_test.zig");
    _ = @import("memory_test.zig");
    _ = @import("stack_test.zig");
    _ = @import("storage_test.zig");
    _ = @import("system_test.zig");
    _ = @import("control_test.zig");
    _ = @import("shift_crypto_comprehensive_test.zig");
    _ = @import("invalid_opcodes_test.zig");
    _ = @import("environment_comprehensive_test.zig");
    _ = @import("returndata_block_comprehensive_test.zig");
    _ = @import("block_info_comprehensive_test.zig");
    _ = @import("stack_memory_control_comprehensive_test.zig");
    _ = @import("msize_gas_jumpdest_comprehensive_test.zig");
    _ = @import("transient_mcopy_push_comprehensive_test.zig");
}