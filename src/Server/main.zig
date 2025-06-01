const std = @import("std");
const server_mod = @import("server.zig");
const httpz = @import("httpz");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var server = try server_mod.create_server(allocator, 8546);
    defer {
        server.stop();
        server.deinit();
        std.debug.print("Server shutdown complete\n", .{});
    }

    std.debug.print("JSON-RPC server listening on port 8546 with request logging enabled\n", .{});

    // This is blocking - the server will run until manually stopped or an error occurs
    server.listen() catch |err| {
        std.debug.print("Server error: {s}\n", .{@errorName(err)});
        return err;
    };
}
