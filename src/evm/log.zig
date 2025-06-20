const std = @import("std");
const builtin = @import("builtin");

/// Professional isomorphic logger for the EVM that works across all target architectures
/// including native platforms, WASI, and WASM environments.
///
/// For WASM freestanding targets, uses external JavaScript console methods.
/// For all other targets, uses std.log as normal.
///
/// Provides debug, error, and warning logging with EVM-specific prefixing.
/// Debug logs are optimized away in release builds for performance.

// External JavaScript console functions for WASM
// These must be provided by the JavaScript host environment
extern fn console_log(ptr: [*]const u8, len: u32) void;
extern fn console_error(ptr: [*]const u8, len: u32) void;
extern fn console_warn(ptr: [*]const u8, len: u32) void;
extern fn console_info(ptr: [*]const u8, len: u32) void;

/// Helper function to format and send log to console
fn logToConsole(comptime level: []const u8, comptime format: []const u8, args: anytype) void {
    var buf: [1024]u8 = undefined;
    const msg = std.fmt.bufPrint(&buf, "[EVM] " ++ format, args) catch {
        // If formatting fails, at least try to log something
        const fallback = "[EVM] Log formatting failed";
        if (std.mem.eql(u8, level, "error")) {
            console_error(fallback.ptr, fallback.len);
        } else if (std.mem.eql(u8, level, "warn")) {
            console_warn(fallback.ptr, fallback.len);
        } else if (std.mem.eql(u8, level, "info")) {
            console_info(fallback.ptr, fallback.len);
        } else {
            console_log(fallback.ptr, fallback.len);
        }
        return;
    };
    
    if (std.mem.eql(u8, level, "error")) {
        console_error(msg.ptr, @intCast(msg.len));
    } else if (std.mem.eql(u8, level, "warn")) {
        console_warn(msg.ptr, @intCast(msg.len));
    } else if (std.mem.eql(u8, level, "info")) {
        console_info(msg.ptr, @intCast(msg.len));
    } else {
        console_log(msg.ptr, @intCast(msg.len));
    }
}

/// Debug log for development and troubleshooting
/// Optimized away in release builds for performance
pub fn debug(comptime format: []const u8, args: anytype) void {
    if (comptime builtin.mode != .Debug) {
        // No-op in release builds
        return;
    }
    
    if (comptime builtin.target.os.tag == .freestanding) {
        logToConsole("debug", format, args);
    } else {
        std.log.debug("[EVM] " ++ format, args);
    }
}

/// Error log for critical issues that require attention
pub fn err(comptime format: []const u8, args: anytype) void {
    if (comptime builtin.target.os.tag == .freestanding) {
        logToConsole("error", format, args);
    } else {
        std.log.err("[EVM] " ++ format, args);
    }
}

/// Warning log for non-critical issues and unexpected conditions
pub fn warn(comptime format: []const u8, args: anytype) void {
    if (comptime builtin.target.os.tag == .freestanding) {
        logToConsole("warn", format, args);
    } else {
        std.log.warn("[EVM] " ++ format, args);
    }
}

/// Info log for general information (use sparingly for performance)
pub fn info(comptime format: []const u8, args: anytype) void {
    if (comptime builtin.target.os.tag == .freestanding) {
        logToConsole("info", format, args);
    } else {
        std.log.info("[EVM] " ++ format, args);
    }
}
