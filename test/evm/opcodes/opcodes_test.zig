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
    _ = @import("push4_push12_comprehensive_test.zig");
    _ = @import("push14_push32_comprehensive_test.zig");
    _ = @import("dup1_dup16_comprehensive_test.zig");
    _ = @import("swap1_swap16_comprehensive_test.zig");
    _ = @import("log0_log4_comprehensive_test.zig");
    _ = @import("create_call_comprehensive_test.zig");
    _ = @import("control_system_comprehensive_test.zig");
    _ = @import("arithmetic_comprehensive_test.zig");
    _ = @import("bitwise_comprehensive_test.zig");
    _ = @import("storage_comprehensive_test.zig");
    _ = @import("memory_comprehensive_test.zig");
    _ = @import("control_flow_comprehensive_test.zig");
}