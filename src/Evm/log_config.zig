const std = @import("std");

/// Log configuration, to be referenced by modules
pub const LogConfig = struct {
    // By default, use .debug when compiling in Debug mode,
    // and .info when compiling in Release mode
    pub const log_level: std.log.Level = switch (std.builtin.Mode) {
        .Debug => .debug,
        .ReleaseSafe => .info,
        .ReleaseFast, .ReleaseSmall => .warn,
    };
    
    /// Override the default log function to customize formatting
    pub fn logFn(
        comptime level: std.log.Level,
        comptime scope: @TypeOf(.enum_literal),
        comptime format: []const u8,
        args: anytype,
    ) void {
        // Format timestamp
        const millis = std.time.milliTimestamp() % 1000;
        const seconds = @divFloor(std.time.milliTimestamp(), 1000);
        
        const writer = std.io.getStdErr().writer();
        writer.print(
            "[{d:4}.{d:3}][{s}][{s}] ", 
            .{
                seconds,
                millis,
                @tagName(level),
                @tagName(scope),
            }
        ) catch return;
        
        writer.print(format ++ "\n", args) catch return;
    }
};

/// Global log level options that affect the entire application
pub const std_options = struct {
    // Log level from LogConfig
    pub const log_level = LogConfig.log_level;
    
    // Custom log function from LogConfig
    pub const logFn = LogConfig.logFn;
};