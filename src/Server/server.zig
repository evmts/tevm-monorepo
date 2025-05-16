const std = @import("std");
const httpz = @import("httpz");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var server = try httpz.Server(void).init(allocator, .{ .port = 8545 }, {});
    defer {
        server.stop();
        server.deinit();
    }

    var router = try server.router(.{});
    router.post("/", requestHandler, .{});

    try server.listen();
}

const JsonRpcRequest = struct { id: ?u32, method: []const u8, jsonrpc: []const u8, params: ?.{} };

fn requestHandler(req: *httpz.Request, res: *httpz.Response) !void {
    const json = try req.json(JsonRpcRequest);
    res.status = 200;
    try res.json(.{
        .id = json.id,
        .method = json.method,
        .jsonrpc = "2.0",
        .result = .{},
    }, .{});
}
