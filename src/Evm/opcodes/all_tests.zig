// Central test runner for all opcode tests
// This file imports all opcode modules to ensure their tests are run

comptime {
    // Import all opcode modules that contain tests
    _ = @import("math.zig");
    _ = @import("math2.zig");
    _ = @import("bitwise.zig");
    _ = @import("comparison.zig");
    _ = @import("memory.zig");
    _ = @import("controlflow.zig");
    _ = @import("environment.zig");
    _ = @import("block.zig");
    _ = @import("crypto.zig");
    _ = @import("log.zig");
    _ = @import("calls.zig");
    _ = @import("blob.zig");
    _ = @import("storage.zig");
    _ = @import("transient.zig");
    _ = @import("push.zig");
    
    // Import test-specific files if they exist
    _ = @import("storage.test.zig");
    _ = @import("fixed_controlflow.test.zig");
    _ = @import("environment.test.zig");
    _ = @import("calls.test.zig");
    _ = @import("transient.test.zig");
    _ = @import("eip1153.test.zig");
    _ = @import("eip4844.test.zig");
}