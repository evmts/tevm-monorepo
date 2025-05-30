const webui = @import("webui.zig");

pub fn main() !void {
    var window = webui.newWindow();

    try window.show("<html><head><script src=\"/webui.js\"></script></head> Hello World ! </html>");

    webui.wait();

    // intentionally don't cleanup memory to close faster
}
