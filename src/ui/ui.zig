const std = @import("std");
const webui = @import("webui.zig");

// creates the response of our assets at compile time
fn createResponse(comptime content: []const u8, comptime mime_type: []const u8) [:0]const u8 {
    var buf: [20]u8 = undefined;
    const n = std.fmt.bufPrint(&buf, "{d}", .{content.len}) catch unreachable;
    const content_length = buf[0..n.len];
    return "HTTP/1.1 200 OK\n" ++
        "Content-Type: " ++ mime_type ++ "\n" ++
        "Content-Length: " ++ content_length ++ "\n" ++
        "\n" ++
        content;
}

pub const Asset = struct {
    const Self = @This();

    path: []const u8,
    content: []const u8,
    mime_type: []const u8,
    response: [:0]const u8,

    pub fn init(
        comptime path: []const u8,
        comptime content: []const u8,
        comptime mime_type: []const u8,
    ) Self {
        return Self{
            .path = path,
            .content = content,
            .mime_type = mime_type,
            .response = createResponse(content, mime_type),
        };
    }

    pub const not_found_asset = Asset.init(
        "/notfound.html",
        "<div>Page not found</div>",
        "text/html",
    );

    pub const assets = [_]Asset{
        Asset.init(
            "/index.html",
            @embedFile("dist/index.html"),
            "text/html",
        ),
        not_found_asset,
        Asset.init(
            "/vite.svg",
            @embedFile("dist/vite.svg"),
            "image/svg+xml",
        ),
        Asset.init(
            "/assets/index-g0-s2jNV.js",
            @embedFile("dist/assets/index-g0-s2jNV.js"),
            "application/javascript",
        ),
        Asset.init(
            "/assets/index-BG_JvFUn.css",
            @embedFile("dist/assets/index-BG_JvFUn.css"),
            "text/css",
        ),
        Asset.init(
            "/assets/logo-BKhbptE1.svg",
            @embedFile("dist/assets/logo-BKhbptE1.svg"),
            "image/svg+xml",
        ),
        Asset.init(
            "/tauri.svg",
            @embedFile("dist/tauri.svg"),
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

pub fn main() !void {
    var app = App.init();
    defer App.deinit();

    try app.run();
}

const App = struct {
    const Self = @This();

    window: webui,

    pub fn init() Self {
        const window = webui.newWindow();
        webui.setConfig(.multi_client, true);
        return Self{ .window = window };
    }

    pub fn deinit() void {
        webui.clean();
    }

    pub fn handler(filename: []const u8) ?[]const u8 {
        const asset = Asset.getAsset(filename) orelse Asset.not_found_asset;
        return asset.response;
    }

    pub fn run(self: *Self) !void {
        self.window.setFileHandler(App.handler);
        try self.window.show("index.html");
        webui.wait();
    }
};
