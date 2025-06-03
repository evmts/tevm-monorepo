const std = @import("std");
const httpz = @import("httpz");

const Logger = @This();

pub fn init(_: Config) !Logger {
    return .{};
}

pub fn execute(_: *const Logger, req: *httpz.Request, res: *httpz.Response, executor: anytype) !void {
    const start = std.time.microTimestamp();
    defer {
        const elapsed = std.time.microTimestamp() - start;
        std.debug.print("Request: {s} {s} -> Status: {d} (took {d}us)\n", .{ @tagName(req.method), req.url.path, res.status, elapsed });
    }
    try executor.next();
}

pub const Config = struct {};
