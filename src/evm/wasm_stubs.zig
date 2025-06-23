// Minimal stubs for WASM/freestanding build
const std = @import("std");

// Thread stub for single-threaded WASM
pub const DummyMutex = struct {
    pub fn lock(self: *@This()) void { _ = self; }
    pub fn unlock(self: *@This()) void { _ = self; }
};

// Logging stub for WASM
pub fn log(
    comptime level: std.log.Level,
    comptime scope: @TypeOf(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = level;
    _ = scope;
    _ = format;
    _ = args;
    // No-op in WASM
}

// Panic stub for WASM
pub fn panic(msg: []const u8, error_return_trace: ?*std.builtin.StackTrace, ret_addr: ?usize) noreturn {
    _ = msg;
    _ = error_return_trace;
    _ = ret_addr;
    unreachable;
}
