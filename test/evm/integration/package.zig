// Integration tests module

// Import test helpers module
pub const test_helpers = @import("test_helpers");
pub const arithmetic_sequences_test = @import("arithmetic_sequences_test.zig");
pub const memory_storage_test = @import("memory_storage_test.zig");
pub const control_flow_test = @import("control_flow_test.zig");
pub const environment_system_test = @import("environment_system_test.zig");
pub const complex_interactions_test = @import("complex_interactions_test.zig");

test {
    _ = arithmetic_sequences_test;
    _ = memory_storage_test;
    _ = control_flow_test;
    _ = environment_system_test;
    _ = complex_interactions_test;
}