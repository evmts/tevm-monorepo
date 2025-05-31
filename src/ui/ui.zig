const std = @import("std");
const webui = @import("webui.zig");

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

pub const Asset = struct {
    const Self = @This();

    path: []const u8,
    content: []const u8,
    mime_type: []const u8,
    response: []u8,

    pub fn init(
        path: []const u8,
        content: []const u8,
        mime_type: []const u8,
    ) Self {
        return Self{
            .path = path,
            .content = content,
            .mime_type = mime_type,
            .response = try std.fmt.allocPrint(allocator, "HTTP/1.1 200 OK\r\n" ++
                "Content-Type: {s}\r\n" ++
                "Content-Length: {d}\r\n" ++
                "\r\n" ++
                "{s}", .{ mime_type, content.len, content }),
        };
    }

    pub fn deinit(self: *Self) void {
        allocator.free(self.response);
    }

    pub const assets = [_]Asset{
        Asset.init(
            "/index.html",
            "dist/index.html",
            "text/html",
        ),
        Asset.init(
            "/vite.svg",
            "dist/vite.svg",
            "image/svg+xml",
        ),
        Asset.init(
            "/assets/index-g0-s2jNV.js",
            "dist/assets/index-g0-s2jNV.js",
            "application/javascript",
        ),
        Asset.init(
            "/assets/index-BG_JvFUn.css",
            "dist/assets/index-BG_JvFUn.css",
            "text/css",
        ),
        Asset.init(
            "/assets/logo-BKhbptE1.svg",
            "dist/assets/logo-BKhbptE1.svg",
            "image/svg+xml",
        ),
        Asset.init(
            "/tauri.svg",
            "dist/tauri.svg",
            "image/svg+xml",
        ),
    };

    pub fn getAsset(filename: []const u8) ?Asset {
        for (assets) |asset| {
            if (std.mem.eql(u8, asset.path, filename)) {
                return asset;
            }
        }
        return null;
    }
};

const HandlerError = error{
    FILE_NOT_FOUND,
};

pub fn main() !void {
    defer _ = gpa.deinit();
    var app = App.init();
    defer App.deinit();

    try app.run();
}

const App = struct {
    const Self = @This();

    window: webui,

    pub fn init() Self {
        const window = webui.newWindow();
        window.setRuntime(.Bun);
        return Self{ .window = window };
    }

    pub fn deinit() void {
        webui.clean();
    }

    pub fn handler(filename: []const u8) ?[]const u8 {
        const asset = Asset.getAsset(filename) orelse unreachable;
        return asset.response;
    }

    pub fn run(self: *Self) !void {
        self.window.setFileHandler(App.handler);
        try self.window.show("index.html");
        webui.wait();
    }
};
