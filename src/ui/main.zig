const std = @import("std");
const App = @import("app.zig");

pub fn main() !void {
    var app = App.init();
    try app.run();
}
