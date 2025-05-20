const std = @import("std");

pub fn Server(comptime UserContext: type) type {
    return struct {
        middleware_logger: ?Logger = null,
        allocator: std.mem.Allocator,
        port: u16,
        context: UserContext,
        is_listening: bool = false,

        pub fn init(allocator: std.mem.Allocator, options: struct { port: u16 }, context: UserContext) !@This() {
            return @This(){
                .allocator = allocator,
                .port = options.port,
                .context = context,
            };
        }

        pub fn deinit(self: *@This()) void {
            _ = self;
        }

        pub fn middleware(self: *@This(), comptime T: type, options: anytype) !*Logger {
            _ = options;
            if (T == Logger) {
                if (self.middleware_logger == null) {
                    self.middleware_logger = Logger{};
                }
                return &self.middleware_logger.?;
            }
            return error.UnknownMiddleware;
        }

        pub fn router(self: *@This(), options: struct { middlewares: []const *Logger }) !Router {
            _ = options;
            return Router{ .server = self };
        }

        pub fn listen(self: *@This()) !void {
            self.is_listening = true;
            // Simulate listening until stop is called
            while (self.is_listening) {
                std.time.sleep(std.time.ns_per_ms * 10);
            }
        }

        pub fn stop(self: *@This()) void {
            self.is_listening = false;
        }
    };
}

pub const Logger = struct {
    // Simple logger mock
    pub fn log(self: *Logger, message: []const u8) void {
        _ = self;
        std.debug.print("[Logger] {s}\n", .{message});
    }
};

pub const Router = struct {
    server: anytype,

    pub fn post(self: *Router, path: []const u8, handler: anytype, options: anytype) void {
        _ = self;
        _ = path;
        _ = handler;
        _ = options;
    }
};

pub const Request = struct {
    allocator: std.mem.Allocator,
    raw_body: ?[]const u8 = null,

    pub fn json(self: *Request, comptime T: type) !?T {
        _ = T;
        if (self.raw_body == null) {
            return null;
        }
        
        // For testing purposes, always return a mock JSON object
        return .{
            .id = 1,
            .method = "eth_blockNumber",
            .jsonrpc = "2.0",
            .params = null,
        };
    }
};

pub const Response = struct {
    allocator: std.mem.Allocator,
    status: u16 = 200,

    pub fn json(self: *Response, data: anytype, options: anytype) !void {
        _ = self;
        _ = data;
        _ = options;
    }
};