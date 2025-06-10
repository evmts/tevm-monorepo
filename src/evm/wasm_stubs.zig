// Comprehensive WASM compatibility stubs and utilities
const std = @import("std");
const builtin = @import("builtin");

// Thread stub for single-threaded WASM
pub const DummyMutex = struct {
    pub fn lock(self: *@This()) void { _ = self; }
    pub fn unlock(self: *@This()) void { _ = self; }
};

// Always use DummyMutex for maximum WASM compatibility
pub const Mutex = DummyMutex;

// Logging stub for WASM - completely no-op to avoid any I/O
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

// Check if we're building for WASM/freestanding
pub const is_wasm_target = builtin.target.cpu.arch == .wasm32 or 
                          builtin.target.cpu.arch == .wasm64 or 
                          builtin.target.os.tag == .freestanding;