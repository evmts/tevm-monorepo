const std = @import("std");
const App = @import("app.zig").App;

pub fn main() !void {
    var app = App.init();
    defer App.deinit();

    try app.run();
}
