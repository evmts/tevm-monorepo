const std = @import("std");
const httpz = @import("httpz");
const Logger = @import("middleware/logger.zig");

pub const JsonRpcRequest = struct { id: ?u32, method: []const u8, jsonrpc: []const u8, params: ?std.json.Value };

pub fn create_server(allocator: std.mem.Allocator, port: u16) !httpz.Server(void) {
    var server = try httpz.Server(void).init(allocator, .{
        .port = port,
    }, {});

    const logger = try server.middleware(Logger, .{});

    var router = try server.router(.{
        .middlewares = &.{logger},
    });

    router.post("/", requestHandler, .{});

    return server;
}

fn requestHandler(req: *httpz.Request, res: *httpz.Response) !void {
    const json = (try req.json(JsonRpcRequest)).?;
    res.status = 200;
    try res.json(.{
        .id = json.id,
        .method = json.method,
        .jsonrpc = "2.0",
        .result = .{},
    }, .{});
}

test "server handles JSON-RPC requests" {
    std.debug.print("\n--- Starting server test ---\n", .{});

    const allocator = std.testing.allocator;

    const test_port = 18545;
    std.debug.print("Creating server on port {d}\n", .{test_port});

    var server = try create_server(allocator, test_port);
    defer server.deinit();

    std.debug.print("Starting server thread\n", .{});

    const server_ptr = &server;
    const thread = try std.Thread.spawn(.{}, struct {
        fn run(svr_ptr: *httpz.Server(void)) !void {
            std.debug.print("Server thread started\n", .{});
            try svr_ptr.listen();
        }
    }.run, .{server_ptr});

    defer {
        std.debug.print("Stopping server\n", .{});
        server.stop();
        thread.join();
    }

    std.debug.print("Waiting for server to start\n", .{});
    std.time.sleep(std.time.ns_per_ms * 100);

    std.debug.print("Connecting to server\n", .{});
    const address = try std.net.Address.parseIp4("127.0.0.1", test_port);
    var client = try std.net.tcpConnectToAddress(address);
    defer client.close();

    std.debug.print("Creating request\n", .{});
    const body = "{\"id\":1,\"method\":\"eth_blockNumber\",\"jsonrpc\":\"2.0\",\"params\":null}";

    const request = try std.fmt.allocPrint(allocator, "POST / HTTP/1.1\r\nHost: localhost:{d}\r\nContent-Type: application/json\r\nContent-Length: {d}\r\n\r\n{s}", .{ test_port, body.len, body });
    defer allocator.free(request);

    std.debug.print("Sending request: {s}\n", .{request});
    _ = try client.writeAll(request);

    std.debug.print("Reading response\n", .{});
    var response_buffer: [1024]u8 = undefined;
    const bytes_read = try client.read(&response_buffer);
    const response = response_buffer[0..bytes_read];

    std.debug.print("Received response: {s}\n", .{response});

    try std.testing.expect(std.mem.indexOf(u8, response, "HTTP/1.1 200") != null);
    try std.testing.expect(std.mem.indexOf(u8, response, "Content-Type: application/json") != null);
    try std.testing.expect(std.mem.indexOf(u8, response, "\"id\":1") != null);
    try std.testing.expect(std.mem.indexOf(u8, response, "\"jsonrpc\":\"2.0\"") != null);
    try std.testing.expect(std.mem.indexOf(u8, response, "\"method\":\"eth_blockNumber\"") != null);

    std.debug.print("--- Test completed successfully ---\n", .{});
}
