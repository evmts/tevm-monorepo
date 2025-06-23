const std = @import("std");
const builtin = @import("builtin");

/// The presence of this declaration allows the program to override certain behaviors of the standard library.
/// For a full list of available options, see the documentation for `std.Options`.
pub const std_options: std.Options = .{
    // Enable segfault handler for better debugging
    .enable_segfault_handler = true,
    
    // Use our isomorphic logging function that works across all architectures
    .logFn = isomorphicLogFn,
};

/// Isomorphic logging function that adapts to different target architectures
/// including native platforms, WASI, and freestanding WASM environments.
fn isomorphicLogFn(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    switch (builtin.target.os.tag) {
        // Native platforms - use default logging to stderr/stdout
        .linux, .macos, .windows, .freebsd, .openbsd, .netbsd => {
            std.log.defaultLog(level, scope, format, args);
        },
        
        // WASM with WASI support - has proper I/O
        .wasi => {
            wasiLog(level, scope, format, args);
        },
        
        // WASM without WASI (browser/node) or other freestanding targets
        .freestanding => {
            if (builtin.target.cpu.arch == .wasm32 or builtin.target.cpu.arch == .wasm64) {
                wasmLog(level, scope, format, args);
            } else {
                // Other freestanding targets - minimal logging
                noOpLog(level, scope, format, args);
            }
        },
        
        // Fallback for other targets
        else => {
            std.log.defaultLog(level, scope, format, args);
        },
    }
}

/// WASI logging implementation using stderr
fn wasiLog(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    const stderr = std.io.getStdErr().writer();
    stderr.print("[{s}] ({s}): " ++ format ++ "\n", .{ 
        @tagName(level), @tagName(scope) 
    } ++ args) catch {};
}

/// WASM logging via buffer and optional JavaScript interop
fn wasmLog(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    // Always write to buffer for JS to read
    writeToLogBuffer(level, scope, format, args);
    
    // Optionally call JavaScript console if available
    if (comptime @hasDecl(@import("root"), "js_console_log")) {
        callJsConsoleLog(level, scope, format, args);
    }
}

/// Global log buffer for WASM environments
var log_buffer: [8192]u8 = undefined;
var log_buffer_pos: usize = 0;
var log_buffer_mutex: std.Thread.Mutex = .{};

/// Write log message to buffer that JavaScript can read
fn writeToLogBuffer(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    log_buffer_mutex.lock();
    defer log_buffer_mutex.unlock();
    
    // Reserve space for potential wraparound
    const available_space = log_buffer.len - log_buffer_pos;
    if (available_space < 512) {
        log_buffer_pos = 0; // Wrap around if near end
    }
    
    var fbs = std.io.fixedBufferStream(log_buffer[log_buffer_pos..]);
    const writer = fbs.writer();
    
    writer.print("[{s}] ({s}): " ++ format ++ "\n", .{ 
        @tagName(level), @tagName(scope) 
    } ++ args) catch return;
    
    log_buffer_pos += fbs.pos;
}

/// Export function to get log buffer pointer for JavaScript
export fn getLogBuffer() [*]const u8 {
    return &log_buffer;
}

/// Export function to get current log buffer length
export fn getLogBufferLen() usize {
    return log_buffer_pos;
}

/// Export function to clear the log buffer
export fn clearLogBuffer() void {
    log_buffer_mutex.lock();
    defer log_buffer_mutex.unlock();
    log_buffer_pos = 0;
}

/// JavaScript interop logging (when js_console_log is available)
fn callJsConsoleLog(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    const js_console_log = @import("root").js_console_log;
    
    var buf: [2048]u8 = undefined;
    const message = std.fmt.bufPrint(&buf, "[{s}] ({s}): " ++ format, .{ 
        @tagName(level), @tagName(scope) 
    } ++ args) catch "Log formatting error";
    
    js_console_log(message.ptr, message.len);
}

/// No-op logging for minimal/resource-constrained targets
fn noOpLog(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = level;
    _ = scope;
    _ = format;
    _ = args;
}