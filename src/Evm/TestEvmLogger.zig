// Stub version of EvmLogger for testing
const std = @import("std");

// Whether debug logging is enabled
// When set to false, all logging functions are compiled away with zero runtime overhead
pub const ENABLE_DEBUG_LOGS = true;

// Log levels
pub const LogLevel = enum {
    debug,
    info,
    warn,
    error_level, // Can't use 'error' as it's a reserved keyword
};

// The EvmLogger struct provides comptime debug logging
pub const EvmLogger = struct {
    /// The tag for this logger instance (typically the module or component name)
    tag: []const u8,
    
    /// Creates a new logger with the specified tag
    pub fn init(tag: []const u8) EvmLogger {
        return EvmLogger{ .tag = tag };
    }
    
    /// Log a debug message if debug logging is enabled
    pub fn debug(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
        // Stub implementation that does nothing
    }

    /// Log an info message if debug logging is enabled
    pub fn info(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
        // Stub implementation that does nothing
    }

    /// Log a warning message if debug logging is enabled
    pub fn warn(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
        // Stub implementation that does nothing
    }

    /// Log an error message if debug logging is enabled
    pub fn err(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
        // Stub implementation that does nothing
    }
};

// Create a logger with file name as the tag
pub fn createLogger(comptime file_path: []const u8) EvmLogger {
    // Extract file name from path
    comptime var file_name_start: usize = 0;
    inline for (file_path, 0..) |c, i| {
        if (c == '/' or c == '\\') {
            file_name_start = i + 1;
        }
    }
    
    // Use the file name as the logger tag
    const file_name = comptime file_path[file_name_start..file_path.len];
    
    return EvmLogger.init(file_name);
}

// A debug-only function that is stripped out when debug logs are disabled
pub fn debugOnly(comptime callback: anytype) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        callback();
    }
}

// A logger that automatically logs when a scope is entered and exited
pub const ScopedLogger = struct {
    logger: EvmLogger,
    scope_name: []const u8,
    
    pub fn deinit(self: ScopedLogger) void {
        _ = self;
        // Stub implementation that does nothing
    }
};

// Create a scoped logger that will log entering/exiting a scope
pub fn createScopedLogger(logger: EvmLogger, scope_name: []const u8) ScopedLogger {
    return ScopedLogger{
        .logger = logger, 
        .scope_name = scope_name,
    };
}

// Stub for hex bytes logging
pub fn logHexBytes(logger: EvmLogger, name: []const u8, bytes: []const u8) void {
    _ = logger;
    _ = name;
    _ = bytes;
    // Stub implementation that does nothing
}