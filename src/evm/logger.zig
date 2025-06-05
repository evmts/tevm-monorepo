const std = @import("std");

/// Professional logger for the EVM that provides consistent, clean logging
/// Only debug and error logging are provided - no info logging for performance
pub const Logger = struct {
    const Self = @This();
    
    /// Debug log that only compiles in debug builds
    /// This is an inline function that gets optimized away in release builds
    pub inline fn debug(comptime format: []const u8, args: anytype) void {
        if (@import("builtin").mode == .Debug) {
            std.log.debug("[EVM] " ++ format, args);
        }
    }
    
    /// Error log for critical issues
    pub inline fn err(comptime format: []const u8, args: anytype) void {
        std.log.err("[EVM] " ++ format, args);
    }
    
    /// Warning log for non-critical issues
    pub inline fn warn(comptime format: []const u8, args: anytype) void {
        std.log.warn("[EVM] " ++ format, args);
    }
};

/// Global logger instance
pub const logger = Logger{};