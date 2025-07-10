const std = @import("std");
const builtin = @import("builtin");

/// WASM-compatible logger for the EVM that works across all target architectures
/// including native platforms and WASM environments.
///
/// For WASM targets, uses external JavaScript console functions.
/// For native targets, falls back to std.log.

// External JavaScript console functions for WASM
extern fn console_log(ptr: [*]const u8, len: usize) void;
extern fn console_error(ptr: [*]const u8, len: usize) void;
extern fn console_warn(ptr: [*]const u8, len: usize) void;
extern fn console_info(ptr: [*]const u8, len: usize) void;

/// Debug log for development and troubleshooting
/// Optimized away in release builds for performance
pub fn debug(comptime format: []const u8, args: anytype) void {
    if (builtin.target.isWasm()) {
        if (builtin.mode == .Debug) {
            var buf: [1024]u8 = undefined;
            const msg = std.fmt.bufPrint(&buf, "[EVM] " ++ format, args) catch return;
            console_log(msg.ptr, msg.len);
        }
    } else {
        std.log.debug("[EVM] " ++ format, args);
    }
}

/// Error log for critical issues that require attention
pub fn err(comptime format: []const u8, args: anytype) void {
    if (builtin.target.isWasm()) {
        var buf: [1024]u8 = undefined;
        const msg = std.fmt.bufPrint(&buf, "[EVM] " ++ format, args) catch return;
        console_error(msg.ptr, msg.len);
    } else {
        std.log.err("[EVM] " ++ format, args);
    }
}

/// Warning log for non-critical issues and unexpected conditions
pub fn warn(comptime format: []const u8, args: anytype) void {
    if (builtin.target.isWasm()) {
        var buf: [1024]u8 = undefined;
        const msg = std.fmt.bufPrint(&buf, "[EVM] " ++ format, args) catch return;
        console_warn(msg.ptr, msg.len);
    } else {
        std.log.warn("[EVM] " ++ format, args);
    }
}

/// Info log for general information (use sparingly for performance)
pub fn info(comptime format: []const u8, args: anytype) void {
    if (builtin.target.isWasm()) {
        var buf: [1024]u8 = undefined;
        const msg = std.fmt.bufPrint(&buf, "[EVM] " ++ format, args) catch return;
        console_info(msg.ptr, msg.len);
    } else {
        std.log.info("[EVM] " ++ format, args);
    }
}