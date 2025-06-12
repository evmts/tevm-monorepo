// Integration tests module

// Import test helpers module
pub const test_helpers = @import("test_helpers");
pub const arithmetic_sequences_test = @import("arithmetic_sequences_test.zig");
pub const memory_storage_test = @import("memory_storage_test.zig");
pub const control_flow_test = @import("control_flow_test.zig");
pub const environment_system_test = @import("environment_system_test.zig");
pub const complex_interactions_test = @import("complex_interactions_test.zig");

// EVMone equivalence tests
pub const evmone_equivalence_test = @import("evmone_equivalence_test.zig");
pub const evmone_storage_equivalence_test = @import("evmone_storage_equivalence_test.zig");
pub const evmone_memory_equivalence_test = @import("evmone_memory_equivalence_test.zig");
pub const evmone_calls_equivalence_test = @import("evmone_calls_equivalence_test.zig");
pub const evmone_regression_equivalence_test = @import("evmone_regression_equivalence_test.zig");

test {
    _ = arithmetic_sequences_test;
    _ = memory_storage_test;
    _ = control_flow_test;
    _ = environment_system_test;
    _ = complex_interactions_test;
    
    // EVMone equivalence tests
    _ = evmone_equivalence_test;
    _ = evmone_storage_equivalence_test;
    _ = evmone_memory_equivalence_test;
    _ = evmone_calls_equivalence_test;
    _ = evmone_regression_equivalence_test;
}