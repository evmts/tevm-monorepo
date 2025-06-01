const std = @import("std");
const webui = @import("webui/webui.zig");
const assets = @import("assets.zig");

const Self = @This();

window: webui,

pub fn init() Self {
    const window = webui.new_window();
    webui.set_config(.multi_client, true);
    return Self{ .window = window };
}

pub fn deinit() void {
    webui.clean();
}

pub fn handler(filename: []const u8) ?[]const u8 {
    const asset = assets.get_asset(filename) orelse assets.not_found_asset;
    return asset.response;
}

pub fn run(self: *Self) !void {
    self.window.set_file_handler(handler);
    try self.window.show("index.html");
    webui.wait();
}
