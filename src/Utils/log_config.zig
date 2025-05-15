const std = @import("std");

/// Logging level configuration for different modules
pub const LogLevel = enum {
    debug,
    info,
    warn,
    err,
    none,
};

/// Log configuration for the EVM modules
pub const LogConfig = struct {
    /// Global log level (all modules)
    global: LogLevel = .info,
    /// EVM module log level
    evm: LogLevel = .info,
    /// Frame module log level
    frame: LogLevel = .info,
    /// Tracer module log level
    tracer: LogLevel = .info,
    /// Performance module log level
    perf: LogLevel = .info,
    /// Benchmarking module log level
    bench: LogLevel = .info,

    /// Apply the configuration to the global log level
    pub fn apply(self: LogConfig) void {
        // Set standard library log level
        std.log.level = switch (self.global) {
            .debug => .debug,
            .info => .info,
            .warn => .warn,
            .err => .err,
            .none => .err,
        };
    }

    /// Determine if a specific module should log at a given level
    pub fn shouldLog(self: LogConfig, module: []const u8, level: std.log.Level) bool {
        // Get the module's log level
        const module_level = if (std.mem.eql(u8, module, "evm"))
            self.evm
        else if (std.mem.eql(u8, module, "frame"))
            self.frame
        else if (std.mem.eql(u8, module, "tracer"))
            self.tracer
        else if (std.mem.eql(u8, module, "perf"))
            self.perf
        else if (std.mem.eql(u8, module, "bench"))
            self.bench
        else
            self.global;

        // Check if the level is enabled
        return switch (module_level) {
            .debug => true, // Debug shows all logs
            .info => @intFromEnum(level) >= @intFromEnum(std.log.Level.info),
            .warn => @intFromEnum(level) >= @intFromEnum(std.log.Level.warn),
            .err => level == .err,
            .none => false, // None disables all logs
        };
    }
};

/// Global instance of log configuration
pub var log_config = LogConfig{};

/// Initialize the log configuration at comptime
pub fn initLog() void {
    log_config.apply();
}

/// Implementation of the standard library log function
pub fn log(
    comptime level: std.log.Level,
    comptime scope: @TypeOf(.EnumLiteral),
    comptime format: []const u8,
    args: anytype,
) void {
    const scope_name = @tagName(scope);
    
    // Early return if log level is disabled for this module
    if (!log_config.shouldLog(scope_name, level))
        return;

    // Get output writer (stderr for warnings/errors, stdout for others)
    const writer = if (@intFromEnum(level) >= @intFromEnum(std.log.Level.warn))
        std.io.getStdErr().writer()
    else
        std.io.getStdOut().writer();

    // Format timestamp
    var time_buffer: [32]u8 = undefined;
    var now = std.time.timestamp();
    var seconds = @mod(now, 60); now = @divFloor(now, 60);
    var minutes = @mod(now, 60); now = @divFloor(now, 60);
    var hours = @mod(now, 24);

    const timestamp = std.fmt.bufPrint(
        &time_buffer,
        "{d:0>2}:{d:0>2}:{d:0>2}",
        .{ hours, minutes, seconds },
    ) catch "??:??:??";

    // Format: [time] [level] scope: message
    nosuspend {
        writer.print("[{s}] [{s}] {s}: ", .{
            timestamp,
            @tagName(level),
            scope_name,
        }) catch return;
        writer.print(format, args) catch return;
        writer.writeByte('\n') catch return;
    }
}

/// Set global log level
pub fn setLogLevel(level: LogLevel) void {
    log_config.global = level;
    log_config.apply();
}

/// Set module-specific log level
pub fn setModuleLogLevel(module: []const u8, level: LogLevel) void {
    if (std.mem.eql(u8, module, "evm")) {
        log_config.evm = level;
    } else if (std.mem.eql(u8, module, "frame")) {
        log_config.frame = level;
    } else if (std.mem.eql(u8, module, "tracer")) {
        log_config.tracer = level;
    } else if (std.mem.eql(u8, module, "perf")) {
        log_config.perf = level;
    } else if (std.mem.eql(u8, module, "bench")) {
        log_config.bench = level;
    }
}