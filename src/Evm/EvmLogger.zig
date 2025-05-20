const std = @import("std");

/// Whether debug logging is enabled
pub const ENABLE_DEBUG_LOGS = true;

/// Log levels
pub const LogLevel = enum {
    debug,
    info,
    warn,
    error,
};

/// Formatting for log levels
const LevelColor = struct {
    const reset = "\x1b[0m";
    const debug = "\x1b[36m"; // Cyan
    const info = "\x1b[32m";  // Green
    const warn = "\x1b[33m";  // Yellow
    const error = "\x1b[31m"; // Red
};

/// Format string for different log levels
fn levelFormat(comptime level: LogLevel) []const u8 {
    return switch (level) {
        .debug => LevelColor.debug ++ "[DEBUG]" ++ LevelColor.reset,
        .info => LevelColor.info ++ "[INFO]" ++ LevelColor.reset,
        .warn => LevelColor.warn ++ "[WARN]" ++ LevelColor.reset,
        .error => LevelColor.error ++ "[ERROR]" ++ LevelColor.reset,
    };
}

/// The EvmLogger struct provides comptime debug logging
pub const EvmLogger = struct {
    /// The tag for this logger instance (typically the module or component name)
    tag: []const u8,

    /// Creates a new logger with the specified tag
    pub fn init(tag: []const u8) EvmLogger {
        return EvmLogger{ .tag = tag };
    }

    /// Log a debug message if debug logging is enabled
    pub fn debug(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        logMessage(self, .debug, fmt, args);
    }

    /// Log an info message if debug logging is enabled
    pub fn info(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        logMessage(self, .info, fmt, args);
    }

    /// Log a warning message if debug logging is enabled
    pub fn warn(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        logMessage(self, .warn, fmt, args);
    }

    /// Log an error message if debug logging is enabled
    pub fn err(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        logMessage(self, .error, fmt, args);
    }

    /// Internal function to format and print log messages
    fn logMessage(self: EvmLogger, comptime level: LogLevel, comptime fmt: []const u8, args: anytype) void {
        if (comptime ENABLE_DEBUG_LOGS) {
            const level_str = levelFormat(level);
            std.debug.print("{s} {s}: " ++ fmt ++ "\n", .{ level_str, self.tag } ++ args);
        }
    }
};

/// Create a logger with file name as the tag
pub fn createLogger(comptime file_path: []const u8) EvmLogger {
    // Extract file name from path
    comptime var file_name_start: usize = 0;
    inline for (file_path, 0..) |c, i| {
        if (c == '/' or c == '\\') {
            file_name_start = i + 1;
        }
    }
    
    // Use the file name as the logger tag
    comptime const file_name = file_path[file_name_start:];
    
    return EvmLogger.init(file_name);
}

/// A debug-only function that is stripped out when debug logs are disabled
pub fn debugOnly(comptime callback: anytype) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        callback();
    }
}

/// Logs EVM stack contents for debugging
pub fn logStack(logger: EvmLogger, stack_data: []const u256) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        logger.debug("Stack:", .{});
        if (stack_data.len == 0) {
            logger.debug("  (empty)", .{});
        } else {
            for (stack_data, 0..) |value, i| {
                logger.debug("  [{d}]: {x}", .{ i, value });
            }
        }
    }
}

/// Logs EVM memory contents for debugging
pub fn logMemory(logger: EvmLogger, memory_data: []const u8, max_bytes: usize) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        logger.debug("Memory:", .{});
        if (memory_data.len == 0) {
            logger.debug("  (empty)", .{});
        } else {
            const bytes_to_show = @min(memory_data.len, max_bytes);
            
            var i: usize = 0;
            while (i < bytes_to_show) : (i += 32) {
                const end = @min(i + 32, bytes_to_show);
                
                // Format each line as "[offset]: byte1 byte2 byte3..."
                var line_buf: [256]u8 = undefined;
                var line_fbs = std.io.fixedBufferStream(&line_buf);
                const line_writer = line_fbs.writer();
                
                std.fmt.format(line_writer, "  [0x{x:0>4}]: ", .{i}) catch continue;
                
                for (memory_data[i..end]) |byte| {
                    std.fmt.format(line_writer, "{x:0>2} ", .{byte}) catch continue;
                }
                
                logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
            }
            
            if (bytes_to_show < memory_data.len) {
                logger.debug("  ... ({d} more bytes)", .{memory_data.len - bytes_to_show});
            }
        }
    }
}

/// Logs EVM storage contents for debugging
pub fn logStorage(logger: EvmLogger, storage: anytype) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        logger.debug("Storage:", .{});
        
        // Implementation depends on how storage is represented
        // This is a placeholder
        logger.debug("  (storage logging not yet implemented)", .{});
    }
}

/// Logs opcode execution information
pub fn logOpcode(logger: EvmLogger, pc: usize, op: u8, op_name: []const u8, gas_cost: u64, gas_left: u64) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        logger.debug("Executing opcode: pc={d}, op=0x{x:0>2} ({s}), gas_cost={d}, gas_left={d}", 
            .{ pc, op, op_name, gas_cost, gas_left });
    }
}