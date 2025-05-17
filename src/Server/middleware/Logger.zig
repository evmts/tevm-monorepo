const std = @import("std");
const httpz = @import("httpz");

const Logger = @This();

/// Initialize the logger middleware
pub fn init(_: Config) !Logger {
    return .{};
}

/// Execute the middleware
pub fn execute(_: *const Logger, req: *httpz.Request, res: *httpz.Response, executor: anytype) !void {
    // Record the start time
    const start = std.time.microTimestamp();

    // Process the request first
    try executor.next();

    // Log after the request is processed
    const elapsed = std.time.microTimestamp() - start;
    std.debug.print("Request: {s} {s} -> Status: {d} (took {d}us)\n", .{ @tagName(req.method), req.url.path, res.status, elapsed });
}

/// Configuration options for the Logger
pub const Config = struct {};
