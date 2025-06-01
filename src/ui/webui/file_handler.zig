const std = @import("std");
const types = @import("types.zig");
const WebUIError = types.WebUIError;

// Import the main webui type
const Webui = @import("webui.zig");

// C function declarations for file handling
pub extern fn webui_set_root_folder(window: usize, path: [*:0]const u8) callconv(.C) bool;
pub extern fn webui_set_browser_folder(path: [*:0]const u8) callconv(.C) void;
pub extern fn webui_set_default_root_folder(path: [*:0]const u8) callconv(.C) bool;

pub extern fn webui_set_file_handler(
    window: usize,
    handler: *const fn (filename: [*:0]const u8, length: *c_int) callconv(.C) ?*const anyopaque,
) callconv(.C) void;

pub extern fn webui_set_file_handler_window(
    window: usize,
    handler: *const fn (
        window: usize,
        filename: [*:0]const u8,
        length: *c_int,
    ) callconv(.C) ?*const anyopaque,
) callconv(.C) void;

pub extern fn webui_interface_set_response_file_handler(
    window: usize,
    response: *const anyopaque,
    length: usize,
) callconv(.C) void;

/// Set the web-server root folder path for a specific window.
pub fn set_root_folder(self: Webui, path: [:0]const u8) !void {
    const success = webui_set_root_folder(self.window_handle, path.ptr);
    if (!success) return WebUIError.GenericError;
}

/// Set custom browser folder path.
pub fn set_browser_folder(self: Webui, path: [:0]const u8) void {
    _ = self; // autofix
    webui_set_browser_folder(path.ptr);
}

/// Set a custom handler to serve files. This custom handler should
/// return full HTTP header and body.
/// This deactivates any previous handler set with `setFileHandlerWindow`.
pub fn set_file_handler(self: Webui, comptime handler: fn (filename: []const u8) ?[]const u8) void {
    const tmp_struct = struct {
        fn handle(tmp_filename: [*:0]const u8, length: *c_int) callconv(.C) ?*const anyopaque {
            const len = std.mem.len(tmp_filename);
            const content = handler(tmp_filename[0..len]);
            if (content) |val| {
                length.* = @intCast(val.len);
                return @ptrCast(val.ptr);
            }

            return null;
        }
    };
    webui_set_file_handler(self.window_handle, tmp_struct.handle);
}

/// Set a custom handler to serve files. This custom handler should
/// return full HTTP header and body.
/// This deactivates any previous handler set with `setFileHandler`.
pub fn set_file_handler_window(self: Webui, comptime handler: fn (window_handle: usize, filename: []const u8) ?[]const u8) void {
    const tmp_struct = struct {
        fn handle(window: usize, tmp_filename: [*:0]const u8, length: *c_int) callconv(.C) ?*const anyopaque {
            const len = std.mem.len(tmp_filename);
            const content = handler(window, tmp_filename[0..len]);
            if (content) |val| {
                length.* = @intCast(val.len);
                return @ptrCast(val.ptr);
            }

            return null;
        }
    };
    webui_set_file_handler_window(self.window_handle, tmp_struct.handle);
}

/// Use this API to set a file handler response if your backend need async
/// response for `setFileHandler()`.
pub fn interface_set_response_file_handler(self: Webui, response: []u8) void {
    webui_interface_set_response_file_handler(
        self.window_handle,
        @ptrCast(response.ptr),
        response.len,
    );
}

// Global functions

/// Set the web-server root folder path for all windows.
/// Should be used before `show()`.
pub fn set_default_root_folder(path: [:0]const u8) !void {
    const success = webui_set_default_root_folder(path.ptr);
    if (!success) return WebUIError.GenericError;
}
