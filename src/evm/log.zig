const std = @import("std");

/// Professional logger for the EVM that provides consistent, clean logging
/// Only debug and error logging are provided - no info logging for performance
const Log = @This();

/// Private logger instance
const logger = std.log;

/// Debug log that only compiles in debug builds
/// This is an inline function that gets optimized away in release builds
pub inline fn debug(comptime format: []const u8, args: anytype) void {
    logger.debug("[EVM] " ++ format, args);
}

/// Error log for critical issues
pub inline fn err(comptime format: []const u8, args: anytype) void {
    logger.err("[EVM] " ++ format, args);
}

/// Warning log for non-critical issues
pub inline fn warn(comptime format: []const u8, args: anytype) void {
    logger.warn("[EVM] " ++ format, args);
}