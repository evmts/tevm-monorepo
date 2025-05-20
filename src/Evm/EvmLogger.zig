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
    
    /// Optional custom writer (if null, uses std.debug.print)
    writer: ?std.io.Writer(anytype, std.io.Error!usize, std.io.write) = null,

    /// Creates a new logger with the specified tag
    pub fn init(tag: []const u8) EvmLogger {
        return EvmLogger{ .tag = tag };
    }
    
    /// Creates a new logger with the specified tag and custom writer
    pub fn initWithWriter(tag: []const u8, writer: anytype) EvmLogger {
        return EvmLogger{ 
            .tag = tag,
            .writer = writer,
        };
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
            
            if (self.writer) |writer| {
                // Use the custom writer if available
                const message = std.fmt.allocPrint(
                    std.heap.page_allocator, 
                    "{s} {s}: " ++ fmt ++ "\n", 
                    .{ level_str, self.tag } ++ args
                ) catch return;
                defer std.heap.page_allocator.free(message);
                
                writer.write(message) catch {};
            } else {
                // Fall back to std.debug.print
                std.debug.print("{s} {s}: " ++ fmt ++ "\n", .{ level_str, self.tag } ++ args);
            }
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

/// SLOP (Stack-Log-Output-Projector) provides a compact visual
/// representation of the stack for easier debugging
pub fn logStackSlop(logger: EvmLogger, stack_data: []const u256, op_name: []const u8, pc: usize) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        // Create a compact representation header
        logger.debug("SLOP [pc:{d}, op:{s}] Stack depth: {d}", .{ pc, op_name, stack_data.len });
        
        // If stack is empty, show a simple message
        if (stack_data.len == 0) {
            logger.debug("  │ (empty stack)", .{});
            return;
        }
        
        // Define how many stack items to show (all if <= 8, otherwise top and bottom)
        const compact_view = stack_data.len > 8;
        const top_items = if (compact_view) 4 else stack_data.len;
        const bottom_items = if (compact_view) 2 else 0;
        
        // Show top N items
        var i: usize = 0;
        while (i < top_items and i < stack_data.len) : (i += 1) {
            const idx = stack_data.len - 1 - i;
            logger.debug("  │ {d}: {x}", .{ stack_data.len - 1 - i, stack_data[idx] });
        }
        
        // If using compact view, show ellipsis if there are items in the middle
        if (compact_view and stack_data.len > (top_items + bottom_items)) {
            logger.debug("  │ ... ({d} more items) ...", .{stack_data.len - top_items - bottom_items});
        }
        
        // Show bottom N items if using compact view
        if (compact_view) {
            var j: usize = 0;
            while (j < bottom_items and j < stack_data.len - top_items) : (j += 1) {
                logger.debug("  │ {d}: {x}", .{ j, stack_data[j] });
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

/// Log storage with specific key-value pairs for debugging
pub fn logStorageKV(logger: EvmLogger, keys: []const u256, values: []const u256) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        logger.debug("Storage contents:", .{});
        
        if (keys.len == 0) {
            logger.debug("  (empty storage)", .{});
            return;
        }
        
        const len = @min(keys.len, values.len);
        for (keys[0..len], values[0..len], 0..) |key, value, i| {
            logger.debug("  [{d}] {x} => {x}", .{ i, key, value });
        }
        
        if (keys.len > len or values.len > len) {
            logger.debug("  Note: keys and values arrays have different lengths (keys:{d}, values:{d})", 
                .{ keys.len, values.len });
        }
    }
}

/// Logs opcode execution information
pub fn logOpcode(logger: EvmLogger, pc: usize, op: u8, op_name: []const u8, gas_cost: u64, gas_left: u64) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        logger.debug("Executing opcode: pc={d}, op=0x{x:0>2} ({s}), gas_cost={d}, gas_left={d}", 
            .{ pc, op, op_name, gas_cost, gas_left });
    }
}

/// Logs detailed opcode execution with stack impacts and context
pub fn logOpcodeDetailed(logger: EvmLogger, pc: usize, op: u8, op_name: []const u8, 
                         gas_cost: u64, gas_left: u64, 
                         stack_before: []const u256, stack_after: []const u256,
                         context: ?[]const u8) void {
    if (comptime ENABLE_DEBUG_LOGS) {
        // Calculate stack impact (delta)
        const stack_delta = @as(i32, @intCast(stack_after.len)) - @as(i32, @intCast(stack_before.len));
        const stack_impact = if (stack_delta > 0) 
                               std.fmt.allocPrint(std.heap.page_allocator, "+{d}", .{stack_delta}) catch "?" 
                             else if (stack_delta < 0) 
                               std.fmt.allocPrint(std.heap.page_allocator, "{d}", .{stack_delta}) catch "?" 
                             else "±0";
        defer if (stack_delta != 0) std.heap.page_allocator.free(stack_impact);
        
        // Header line with opcode info
        logger.debug("EXEC [{d}] 0x{x:0>2} {s} (gas: {d}, left: {d}, stack: {s})",
            .{ pc, op, op_name, gas_cost, gas_left, stack_impact });
        
        // Additional context if provided
        if (context) |ctx| {
            logger.debug("  Context: {s}", .{ctx});
        }
        
        // Log stack differences if there was a change
        if (stack_before.len > 0 or stack_after.len > 0) {
            // Show what was popped (consumed by the opcode)
            if (stack_before.len > stack_after.len) {
                const popped_count = stack_before.len - stack_after.len;
                logger.debug("  Popped {d} item(s):", .{popped_count});
                
                var i: usize = 0;
                while (i < popped_count and stack_before.len > i) : (i += 1) {
                    logger.debug("    [-] {x}", .{stack_before[stack_before.len - 1 - i]});
                }
            }
            
            // Show what was pushed (produced by the opcode)
            if (stack_after.len > stack_before.len) {
                const pushed_count = stack_after.len - stack_before.len;
                logger.debug("  Pushed {d} item(s):", .{pushed_count});
                
                var i: usize = 0;
                while (i < pushed_count and stack_after.len > i) : (i += 1) {
                    logger.debug("    [+] {x}", .{stack_after[stack_after.len - 1 - i]});
                }
            }
        }
    }
}