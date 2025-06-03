const std = @import("std");
const types = @import("types.zig");

const Config = types.Config;
const Browser = types.Browser;

// Import the main webui type
const Webui = @import("webui.zig");

// C function declarations for configuration
pub extern fn webui_set_config(option: Config, status: bool) callconv(.C) void;
pub extern fn webui_set_event_blocking(window: usize, status: bool) callconv(.C) void;
pub extern fn webui_set_timeout(second: usize) callconv(.C) void;
pub extern fn webui_browser_exist(browser: Browser) callconv(.C) bool;
pub extern fn webui_set_proxy(window: usize, proxy_server: [*:0]const u8) callconv(.C) void;
pub extern fn webui_interface_is_app_running() callconv(.C) bool;
pub extern fn webui_interface_get_window_id(window: usize) callconv(.C) usize;

// Instance methods

/// Control if UI events coming from this window should be processed
/// one at a time in a single blocking thread `True`, or process every event in
/// a new non-blocking thread `False`.
pub fn set_event_blocking(self: Webui, status: bool) void {
    webui_set_event_blocking(self.window_handle, status);
}

/// Set the web browser proxy_server to use. Need to be called before `show()`
pub fn set_proxy(self: Webui, proxy_server: [:0]const u8) void {
    webui_set_proxy(self.window_handle, proxy_server.ptr);
}

/// Get a unique window ID.
pub fn interface_get_window_id(self: Webui) usize {
    return webui_interface_get_window_id(self.window_handle);
}

// Global configuration functions

/// Control the WebUI behaviour. It's recommended to be called at the beginning.
pub fn set_config(option: Config, status: bool) void {
    webui_set_config(option, status);
}

/// Set the maximum time in seconds to wait for the window to connect
/// This effect `show()` and `wait()`. Value of `0` means wait forever.
pub fn set_timeout(time: usize) void {
    webui_set_timeout(time);
}

/// Check if a web browser is installed.
pub fn browser_exist(browser: Browser) bool {
    return webui_browser_exist(browser);
}

/// Check if the app still running.
pub fn interface_is_app_running() bool {
    return webui_interface_is_app_running();
}
