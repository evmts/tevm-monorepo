const std = @import("std");

/// Professional isomorphic logger for the EVM that works across all target architectures
/// including native platforms, WASI, and WASM environments. Uses the std_options.logFn
/// system for automatic platform adaptation.
///
/// Provides debug, error, and warning logging with EVM-specific prefixing.
/// Debug logs are optimized away in release builds for performance.

/// Debug log for development and troubleshooting
/// Optimized away in release builds for performance
pub fn debug(comptime format: []const u8, args: anytype) void {
    std.log.debug("[EVM] " ++ format, args);
}

/// Error log for critical issues that require attention
pub fn err(comptime format: []const u8, args: anytype) void {
    std.log.err("[EVM] " ++ format, args);
}

/// Warning log for non-critical issues and unexpected conditions
pub fn warn(comptime format: []const u8, args: anytype) void {
    std.log.warn("[EVM] " ++ format, args);
}

/// Info log for general information (use sparingly for performance)
pub fn info(comptime format: []const u8, args: anytype) void {
    std.log.info("[EVM] " ++ format, args);
}
