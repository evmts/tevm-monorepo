const std = @import("std");
const types = @import("types.zig");

const WebUIError = types.WebUIError;
const Runtime = types.Runtime;

// Import the main webui type
const Webui = @import("webui.zig");

// C function declarations for JavaScript operations
pub extern fn webui_run(window: usize, script: [*:0]const u8) callconv(.C) void;
pub extern fn webui_script(
    window: usize,
    script: [*:0]const u8,
    timeout: usize,
    buffer: [*]u8,
    buffer_length: usize,
) callconv(.C) bool;
pub extern fn webui_set_runtime(window: usize, runtime: Runtime) callconv(.C) void;
pub extern fn webui_send_raw(window: usize, function: [*:0]const u8, raw: [*]const anyopaque, size: usize) callconv(.C) void;

// Interface functions for JavaScript operations
pub extern fn webui_interface_get_string_at(
    window: usize,
    event_number: usize,
    index: usize,
) callconv(.C) [*:0]const u8;

pub extern fn webui_interface_get_int_at(
    window: usize,
    event_number: usize,
    index: usize,
) callconv(.C) i64;

pub extern fn webui_interface_get_float_at(
    window: usize,
    event_number: usize,
    index: usize,
) callconv(.C) f64;

pub extern fn webui_interface_get_bool_at(
    window: usize,
    event_number: usize,
    index: usize,
) callconv(.C) bool;

pub extern fn webui_interface_get_size_at(
    window: usize,
    event_number: usize,
    index: usize,
) callconv(.C) usize;

pub extern fn webui_interface_send_raw_client(
    window: usize,
    event_number: usize,
    function: [*:0]const u8,
    raw: [*c]const u8,
    size: usize,
) callconv(.C) void;

pub extern fn webui_interface_navigate_client(
    window: usize,
    event_number: usize,
    url: [*:0]const u8,
) callconv(.C) void;

pub extern fn webui_interface_run_client(
    window: usize,
    event_number: usize,
    script: [*:0]const u8,
) callconv(.C) void;

pub extern fn webui_interface_script_client(
    window: usize,
    event_number: usize,
    script: [*:0]const u8,
    timeout: usize,
    buffer: [*c]u8,
    buffer_length: usize,
) callconv(.C) bool;

pub extern fn webui_interface_show_client(
    window: usize,
    event_number: usize,
    content: [*:0]const u8,
) callconv(.C) bool;

pub extern fn webui_interface_close_client(
    window: usize,
    event_number: usize,
) callconv(.C) void;

// Instance methods

/// Run JavaScript without waiting for the response. All clients.
pub fn run(self: Webui, script_content: [:0]const u8) void {
    webui_run(self.window_handle, script_content.ptr);
}

/// Run JavaScript and get the response back. Work only in single client mode.
/// Make sure your local buffer can hold the response.
pub fn script(self: Webui, script_content: [:0]const u8, timeout: usize, buffer: []u8) !void {
    const success = webui_script(
        self.window_handle,
        script_content.ptr,
        timeout,
        buffer.ptr,
        buffer.len,
    );
    if (!success) return WebUIError.ScriptError;
}

/// Chose between Deno and Nodejs as runtime for .js and .ts files.
pub fn set_runtime(self: Webui, runtime: Runtime) void {
    webui_set_runtime(self.window_handle, runtime);
}

/// Safely send raw data to the UI. All clients.
pub fn send_raw(self: Webui, js_func: [:0]const u8, raw: []u8) void {
    webui_send_raw(self.window_handle, js_func.ptr, @ptrCast(raw.ptr), raw.len);
}

// Interface functions for working with events and clients

/// Get an argument as string at a specific index
pub fn interface_get_string_at(self: Webui, event_number: usize, index: usize) [:0]const u8 {
    const ptr = webui_interface_get_string_at(self.window_handle, event_number, index);
    const len = std.mem.len(ptr);
    return ptr[0..len :0];
}

/// Get an argument as integer at a specific index
pub fn interface_get_int_at(self: Webui, event_number: usize, index: usize) i64 {
    return webui_interface_get_int_at(self.window_handle, event_number, index);
}

/// Get an argument as float at a specific index
pub fn interface_get_float_at(self: Webui, event_number: usize, index: usize) f64 {
    return webui_interface_get_float_at(self.window_handle, event_number, index);
}

/// Get an argument as boolean at a specific index
pub fn interface_get_bool_at(self: Webui, event_number: usize, index: usize) bool {
    return webui_interface_get_bool_at(self.window_handle, event_number, index);
}

/// Get the size in bytes of an argument at a specific index
pub fn interface_get_size_at(self: Webui, event_number: usize, index: usize) usize {
    return webui_interface_get_size_at(self.window_handle, event_number, index);
}

/// Show a window using embedded HTML, or a file. Single client.
pub fn interface_show_client(self: Webui, event_number: usize, content: [:0]const u8) !void {
    const success = webui_interface_show_client(self.window_handle, event_number, content.ptr);
    if (!success) return WebUIError.ShowError;
}

/// Close a specific client.
pub fn interface_close_client(self: Webui, event_number: usize) void {
    webui_interface_close_client(self.window_handle, event_number);
}

/// Safely send raw data to the UI. Single client.
pub fn interface_send_raw_client(
    self: Webui,
    event_number: usize,
    function: [:0]const u8,
    raw: []const u8,
) void {
    webui_interface_send_raw_client(self.window_handle, event_number, function.ptr, raw.ptr, raw.len);
}

/// Navigate to a specific URL. Single client.
pub fn interface_navigate_client(self: Webui, event_number: usize, url: [:0]const u8) void {
    webui_interface_navigate_client(self.window_handle, event_number, url.ptr);
}

/// Run JavaScript without waiting for the response. Single client.
pub fn interface_run_client(self: Webui, event_number: usize, script_content: [:0]const u8) void {
    webui_interface_run_client(self.window_handle, event_number, script_content.ptr);
}

/// Run JavaScript and get the response back. Single client.
pub fn interface_script_client(self: Webui, event_number: usize, script_content: [:0]const u8, timeout: usize, buffer: []u8) !void {
    const success = webui_interface_script_client(self.window_handle, event_number, script_content.ptr, timeout, buffer.ptr, buffer.len);
    if (!success) return WebUIError.ScriptError;
}
