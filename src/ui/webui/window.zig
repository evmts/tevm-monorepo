const std = @import("std");
const builtin = @import("builtin");
const windows = std.os.windows;

const types = @import("types.zig");
const Browser = types.Browser;
const WebUIError = types.WebUIError;
const WEBUI_MAX_IDS = types.WEBUI_MAX_IDS;

// Import the main webui type
const Webui = @import("webui.zig");

// C function declarations for window operations
pub extern fn webui_new_window() callconv(.C) usize;
pub extern fn webui_new_window_id(window_number: usize) callconv(.C) usize;
pub extern fn webui_get_new_window_id() callconv(.C) usize;
pub extern fn webui_get_best_browser(window: usize) callconv(.C) Browser;
pub extern fn webui_show(window: usize, content: [*:0]const u8) callconv(.C) bool;
pub extern fn webui_show_browser(window: usize, content: [*:0]const u8, browser: Browser) callconv(.C) bool;
pub extern fn webui_start_server(window: usize, content: [*:0]const u8) callconv(.C) [*:0]const u8;
pub extern fn webui_show_wv(window: usize, content: [*:0]const u8) callconv(.C) bool;
pub extern fn webui_set_kiosk(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_wait() callconv(.C) void;
pub extern fn webui_close(window: usize) callconv(.C) void;
pub extern fn webui_minimize(window: usize) callconv(.C) void;
pub extern fn webui_maximize(window: usize) callconv(.C) void;
pub extern fn webui_destroy(window: usize) callconv(.C) void;
pub extern fn webui_exit() callconv(.C) void;
pub extern fn webui_is_shown(window: usize) callconv(.C) bool;
pub extern fn webui_set_hide(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_set_size(window: usize, width: u32, height: u32) callconv(.C) void;
pub extern fn webui_set_minimum_size(window: usize, width: u32, height: u32) callconv(.C) void;
pub extern fn webui_set_position(window: usize, x: u32, y: u32) callconv(.C) void;
pub extern fn webui_set_center(window: usize) callconv(.C) void;
pub extern fn webui_set_profile(window: usize, name: [*:0]const u8, path: [*:0]const u8) callconv(.C) void;
pub extern fn webui_delete_profile(window: usize) callconv(.C) void;
pub extern fn webui_get_parent_process_id(window: usize) callconv(.C) usize;
pub extern fn webui_get_child_process_id(window: usize) callconv(.C) usize;
pub extern fn webui_win32_get_hwnd(window: usize) callconv(.C) ?*anyopaque;
pub extern fn webui_set_icon(window: usize, icon: [*:0]const u8, icon_type: [*:0]const u8) callconv(.C) void;
pub extern fn webui_set_public(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_set_port(window: usize, port: usize) callconv(.C) bool;
pub extern fn webui_get_port(window: usize) callconv(.C) usize;
pub extern fn webui_get_url(window: usize) callconv(.C) [*:0]const u8;
pub extern fn webui_navigate(window: usize, url: [*:0]const u8) callconv(.C) void;
pub extern fn webui_clean() callconv(.C) void;
pub extern fn webui_delete_all_profiles() callconv(.C) void;
pub extern fn webui_get_free_port() callconv(.C) usize;
pub extern fn webui_open_url(url: [*:0]const u8) callconv(.C) void;
pub extern fn webui_set_frameless(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_set_transparent(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_set_resizable(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_set_high_contrast(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_is_high_contrast() callconv(.C) bool;
pub extern fn webui_set_custom_parameters(window: usize, params: [*:0]const u8) callconv(.C) void;

// Window creation functions

/// Creating a new WebUI window object.
pub fn new_window() Webui {
    const handle = webui_new_window();
    return .{
        .window_handle = handle,
    };
}

/// Create a new webui window object using a specified window number.
pub fn new_window_with_id(id: usize) !Webui {
    if (id == 0 or id >= WEBUI_MAX_IDS) return WebUIError.CreateWindowError;
    const handle = webui_new_window_id(id);
    return .{
        .window_handle = handle,
    };
}

/// Get a free window number that can be used with `newWindowWithId`
pub fn get_new_window_id() usize {
    return webui_get_new_window_id();
}

// Instance methods for window operations

/// Get the recommended web browser ID to use.
pub fn get_best_browser(self: Webui) Browser {
    return webui_get_best_browser(self.window_handle);
}

/// Show a window using embedded HTML, or a file.
pub fn show(self: Webui, content: [:0]const u8) !void {
    const success = webui_show(self.window_handle, content.ptr);
    if (!success) return WebUIError.ShowError;
}

/// Same as `show()`. But using a specific web browser
pub fn show_browser(self: Webui, content: [:0]const u8, browser: Browser) !void {
    const success = webui_show_browser(self.window_handle, content.ptr, browser);
    if (!success) return WebUIError.ShowError;
}

/// Same as `show()`. But start only the web server and return the URL.
pub fn start_server(self: Webui, path: [:0]const u8) ![:0]const u8 {
    const url = webui_start_server(self.window_handle, path.ptr);
    const url_len = std.mem.len(url);
    if (url_len == 0) return WebUIError.ServerError;
    return url[0..url_len :0];
}

/// Show a WebView window using embedded HTML, or a file.
pub fn show_wv(self: Webui, content: [:0]const u8) !void {
    const success = webui_show_wv(self.window_handle, content.ptr);
    if (!success) return WebUIError.ShowError;
}

/// Set the window in Kiosk mode (Full screen)
pub fn set_kiosk(self: Webui, status: bool) void {
    webui_set_kiosk(self.window_handle, status);
}

/// Close a specific window only. The window object will still exist.
pub fn close(self: Webui) void {
    webui_close(self.window_handle);
}

/// Minimize a WebView window.
pub fn minimize(self: Webui) void {
    webui_minimize(self.window_handle);
}

/// Maximize a WebView window.
pub fn maximize(self: Webui) void {
    webui_maximize(self.window_handle);
}

/// Close a specific window and free all memory resources.
pub fn destroy(self: Webui) void {
    webui_destroy(self.window_handle);
}

/// Check if the specified window is still running.
pub fn is_shown(self: Webui) bool {
    return webui_is_shown(self.window_handle);
}

/// Set a window in hidden mode. Should be called before `show()`
pub fn set_hide(self: Webui, status: bool) void {
    webui_set_hide(self.window_handle, status);
}

/// Set the window size.
pub fn set_size(self: Webui, width: u32, height: u32) void {
    webui_set_size(self.window_handle, width, height);
}

/// Set the window minimum size.
pub fn set_minimum_size(self: Webui, width: u32, height: u32) void {
    webui_set_minimum_size(self.window_handle, width, height);
}

/// Set the window position.
pub fn set_position(self: Webui, x: u32, y: u32) void {
    webui_set_position(self.window_handle, x, y);
}

/// Centers the window on the screen.
pub fn set_center(self: Webui) void {
    webui_set_center(self.window_handle);
}

/// Set the web browser profile to use.
pub fn set_profile(self: Webui, name: [:0]const u8, path: [:0]const u8) void {
    webui_set_profile(self.window_handle, name.ptr, path.ptr);
}

/// Delete a specific window web-browser local folder profile.
pub fn delete_profile(self: Webui) void {
    webui_delete_profile(self.window_handle);
}

/// Get the ID of the parent process
pub fn get_parent_process_id(self: Webui) !usize {
    const process_id = webui_get_parent_process_id(self.window_handle);
    if (process_id == 0) return WebUIError.ProcessError;
    return process_id;
}

/// Get the ID of the last child process.
pub fn get_child_process_id(self: Webui) !usize {
    const process_id = webui_get_child_process_id(self.window_handle);
    if (process_id == 0) return WebUIError.ProcessError;
    return process_id;
}

/// Gets Win32 window `HWND`.
pub fn win32_get_hwnd(self: Webui) !windows.HWND {
    if (builtin.os.tag != .windows) {
        @compileError("Note: method win32GetHwnd only can call on MS windows!");
    }
    const tmp_hwnd = webui_win32_get_hwnd(self.window_handle);
    if (tmp_hwnd) return @ptrCast(tmp_hwnd);
    return WebUIError.HWNDError;
}

/// Set the default embedded HTML favicon.
pub fn set_icon(self: Webui, icon: [:0]const u8, icon_type: [:0]const u8) void {
    webui_set_icon(self.window_handle, icon.ptr, icon_type.ptr);
}

/// Allow a specific window address to be accessible from a public network
pub fn set_public(self: Webui, status: bool) void {
    webui_set_public(self.window_handle, status);
}

/// Get the network port of a running window.
pub fn get_port(self: Webui) !usize {
    const port = webui_get_port(self.window_handle);
    if (port == 0) return WebUIError.PortError;
    return port;
}

/// Set a custom web-server network port to be used by WebUI.
pub fn set_port(self: Webui, port: usize) !void {
    const success = webui_set_port(self.window_handle, port);
    if (!success) return WebUIError.PortError;
}

/// Get the full current URL.
pub fn get_url(self: Webui) ![:0]const u8 {
    const ptr = webui_get_url(self.window_handle);
    const len = std.mem.len(ptr);
    if (len == 0) return WebUIError.UrlError;
    return ptr[0..len :0];
}

/// Navigate to a specific URL. All clients.
pub fn navigate(self: Webui, url: [:0]const u8) void {
    webui_navigate(self.window_handle, url.ptr);
}

/// Make a WebView window frameless.
pub fn set_frameless(self: Webui, status: bool) void {
    webui_set_frameless(self.window_handle, status);
}

/// Make a WebView window transparent.
pub fn set_transparent(self: Webui, status: bool) void {
    webui_set_transparent(self.window_handle, status);
}

/// Sets whether the window frame is resizable or fixed.
pub fn set_resizable(self: Webui, status: bool) void {
    webui_set_resizable(self.window_handle, status);
}

/// Set the window with high-contrast support.
pub fn set_high_contrast(self: Webui, status: bool) void {
    webui_set_high_contrast(self.window_handle, status);
}

/// Add a user-defined web browser's CLI parameters.
pub fn set_custom_parameters(self: Webui, params: [:0]const u8) void {
    webui_set_custom_parameters(self.window_handle, params.ptr);
}

// Global window functions

/// Wait until all opened windows get closed.
pub fn wait() void {
    webui_wait();
}

/// Close all open windows. `wait()` will return (Break)
pub fn exit() void {
    webui_exit();
}

/// Free all memory resources. Should be called only at the end.
pub fn clean() void {
    webui_clean();
}

/// Delete all local web-browser profiles folder.
pub fn delete_all_profiles() void {
    webui_delete_all_profiles();
}

/// Get an available usable free network port.
pub fn get_free_port() usize {
    return webui_get_free_port();
}

/// Open an URL in the native default web browser.
pub fn open_url(url: [:0]const u8) void {
    webui_open_url(url.ptr);
}

/// Check if OS is using high contrast theme
pub fn is_high_contrast() bool {
    return webui_is_high_contrast();
}
