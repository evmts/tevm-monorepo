const std = @import("std");

pub const LogLevel = enum {
    Debug,
    Info,
    Warning,
    Error,
    Critical,
};

pub const Logger = struct {
    allocator: std.mem.Allocator,
    level: LogLevel,
    name: []const u8,
    
    pub fn init(allocator: std.mem.Allocator, level: LogLevel, name: []const u8) Logger {
        return Logger{
            .allocator = allocator,
            .level = level,
            .name = name,
        };
    }
    
    pub fn deinit(self: *Logger) void {
        _ = self;
        // Nothing to deinit in this simple logger implementation
    }
    
    pub fn debug(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) <= @intFromEnum(LogLevel.Debug)) {
            self.log(LogLevel.Debug, fmt, args);
        }
    }
    
    pub fn info(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) <= @intFromEnum(LogLevel.Info)) {
            self.log(LogLevel.Info, fmt, args);
        }
    }
    
    pub fn warn(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) <= @intFromEnum(LogLevel.Warning)) {
            self.log(LogLevel.Warning, fmt, args);
        }
    }
    
    pub fn err(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) <= @intFromEnum(LogLevel.Error)) {
            self.log(LogLevel.Error, fmt, args);
        }
    }
    
    pub fn critical(self: *Logger, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) <= @intFromEnum(LogLevel.Critical)) {
            self.log(LogLevel.Critical, fmt, args);
        }
    }
    
    fn log(self: *Logger, level: LogLevel, comptime fmt: []const u8, args: anytype) void {
        const stderr = std.io.getStdErr().writer();
        
        // Get current time
        const timestamp = std.time.timestamp();
        var buffer: [30]u8 = undefined;
        const time_str = std.fmt.bufPrint(&buffer, "{}", .{timestamp}) catch "??:??:??";
        
        // Format message with timestamp, level, and name
        stderr.print("[{s}] [{s}] [{s}] ", .{
            time_str,
            @tagName(level),
            self.name,
        }) catch return;
        
        // Print the actual message
        stderr.print(fmt, args) catch return;
        stderr.print("\n", .{}) catch return;
    }
};

test "Logger - basic functionality" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var logger = Logger.init(allocator, .Debug, "test-logger");
    defer logger.deinit();
    
    // Test all log levels - these won't fail but should print to stderr
    logger.debug("Debug message: {}", .{123});
    logger.info("Info message: {}", .{456});
    logger.warn("Warning message: {}", .{789});
    logger.err("Error message: {}", .{101112});
    logger.critical("Critical message: {}", .{131415});
    
    // Test with higher log level that should filter out lower messages
    var info_logger = Logger.init(allocator, .Info, "info-only");
    defer info_logger.deinit();
    
    info_logger.debug("This debug message should not appear", .{}); // Should be filtered
    info_logger.info("This info message should appear", .{});       // Should appear
    info_logger.err("This error message should appear", .{});     // Should appear
}

test "Logger - level filtering" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create logger with Error level - should filter out Debug, Info, Warning
    var error_logger = Logger.init(allocator, .Error, "error-only");
    defer error_logger.deinit();
    
    // These should be filtered out
    error_logger.debug("Debug message should not appear", .{});
    error_logger.info("Info message should not appear", .{});
    error_logger.warn("Warning message should not appear", .{});
    
    // These should appear
    error_logger.err("Error message should appear", .{});
    error_logger.critical("Critical message should appear", .{});
}