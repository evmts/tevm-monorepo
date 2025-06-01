const std = @import("std");
const webui = @import("webui.zig");
const Asset = @import("assets.zig").Asset;

pub const App = struct {
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
