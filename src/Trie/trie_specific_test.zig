const std = @import("std");

test {
    // Run the tests from the proof module
    _ = @import("proof.test.zig");
}