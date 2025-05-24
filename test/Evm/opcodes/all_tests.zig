// Central test runner for all opcode tests
// This file imports all opcode test modules to ensure their tests are run

comptime {
    // Import test-specific files
    _ = @import("storage.test.zig");
    _ = @import("fixed_controlflow.test.zig");
    _ = @import("environment.test.zig");
    _ = @import("calls.test.zig");
    _ = @import("transient.test.zig");
    _ = @import("eip1153.test.zig");
    _ = @import("eip4844.test.zig");
    _ = @import("math2.test.zig");
    _ = @import("tests/math2_test.zig");
    
    // Import expanded test files
    _ = @import("calls_expanded_test.zig");
    _ = @import("transient_expanded_test.zig");
    _ = @import("mcopy_expanded_test.zig");
    _ = @import("frame_returndata_test.zig");
    
    // Import test utilities
    _ = @import("test_utils.zig");
    _ = @import("fixed_test_utils.zig");
}