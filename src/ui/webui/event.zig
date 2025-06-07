const std = @import("std");
const types = @import("types.zig");

const WebUIError = types.WebUIError;
const EventKind = types.EventKind;

// Forward declaration of Webui type
const Webui = @import("webui.zig");

// C function declarations for events
pub extern fn webui_get_context(e: *Event) callconv(.C) *anyopaque;
pub extern fn webui_show_client(e: *Event, content: [*:0]const u8) callconv(.C) bool;
pub extern fn webui_close_client(e: *Event) callconv(.C) void;
pub extern fn webui_send_raw_client(e: *Event, function: [*:0]const u8, raw: [*]const anyopaque, size: usize) callconv(.C) void;
pub extern fn webui_navigate_client(e: *Event, url: [*:0]const u8) callconv(.C) void;
pub extern fn webui_run_client(e: *Event, script: [*:0]const u8) callconv(.C) void;
pub extern fn webui_script_client(e: *Event, script: [*:0]const u8, timeout: usize, buffer: [*]u8, buffer_length: usize) callconv(.C) bool;
pub extern fn webui_get_count(e: *Event) callconv(.C) usize;
pub extern fn webui_get_int_at(e: *Event, index: usize) callconv(.C) i64;
pub extern fn webui_get_int(e: *Event) callconv(.C) i64;
pub extern fn webui_get_float_at(e: *Event, index: usize) callconv(.C) f64;
pub extern fn webui_get_float(e: *Event) callconv(.C) f64;
pub extern fn webui_get_string_at(e: *Event, index: usize) callconv(.C) [*:0]const u8;
pub extern fn webui_get_string(e: *Event) callconv(.C) [*:0]const u8;
pub extern fn webui_get_bool_at(e: *Event, index: usize) callconv(.C) bool;
pub extern fn webui_get_bool(e: *Event) callconv(.C) bool;
pub extern fn webui_get_size_at(e: *Event, index: usize) callconv(.C) usize;
pub extern fn webui_get_size(e: *Event) callconv(.C) usize;
pub extern fn webui_return_int(e: *Event, n: i64) callconv(.C) void;
pub extern fn webui_return_float(e: *Event, f: f64) callconv(.C) void;
pub extern fn webui_return_string(e: *Event, s: [*:0]const u8) callconv(.C) void;
pub extern fn webui_return_bool(e: *Event, b: bool) callconv(.C) void;

pub const Event = extern struct {
    /// The window object number
    window: usize,
    /// Event type
    event_type: EventKind,
    /// HTML element ID
    element: [*:0]u8,
    /// Internal WebUI
    event_number: usize,
    /// Bind ID
    bind_id: usize,
    /// Client's unique ID
    client_id: usize,
    /// Client's connection ID
    connection_id: usize,
    /// Client's full cookies
    cookies: [*:0]u8,

    /// get window through Event
    pub fn get_window(self: Event) Webui {
        return .{
            .window_handle = self.window,
        };
    }

    /// Show a window using embedded HTML, or a file.
    /// If the window is already open, it will be refreshed. Single client.
    pub fn show_client(self: *Event, content: [:0]const u8) bool {
        return webui_show_client(self, content.ptr);
    }

    /// Close a specific client.
    pub fn close_client(self: *Event) void {
        webui_close_client(self);
    }

    /// Safely send raw data to the UI. Single client.
    pub fn send_raw_client(self: *Event, function: [:0]const u8, buffer: []const u8) void {
        webui_send_raw_client(
            self,
            function.ptr,
            @ptrCast(buffer.ptr),
            buffer.len,
        );
    }

    /// Navigate to a specific URL. Single client.
    pub fn navigate_client(self: *Event, url: [:0]const u8) void {
        webui_navigate_client(self, url.ptr);
    }

    /// Run JavaScript without waiting for the response. Single client.
    pub fn run_client(self: *Event, script_content: [:0]const u8) void {
        webui_run_client(self, script_content.ptr);
    }

    /// Run JavaScript and get the response back. Single client.
    /// Make sure your local buffer can hold the response.
    pub fn script_client(
        self: *Event,
        script_content: [:0]const u8,
        timeout: usize,
        buffer: []u8,
    ) !void {
        const success = webui_script_client(
            self,
            script_content.ptr,
            timeout,
            buffer.ptr,
            buffer.len,
        );
        if (!success) return WebUIError.ScriptError;
    }

    /// Return the response to JavaScript as integer.
    pub fn return_int(e: *Event, n: i64) void {
        webui_return_int(e, n);
    }

    /// Return the response to JavaScript as float.
    pub fn return_float(e: *Event, f: f64) void {
        webui_return_float(e, f);
    }

    /// Return the response to JavaScript as string.
    pub fn return_string(e: *Event, str: [:0]const u8) void {
        webui_return_string(e, str.ptr);
    }

    /// Return the response to JavaScript as boolean.
    pub fn return_bool(e: *Event, b: bool) void {
        webui_return_bool(e, b);
    }

    /// a convenient function to return value
    /// no need to care about the function name, you just need to call returnValue
    pub fn return_value(e: *Event, val: anytype) void {
        const T = @TypeOf(val);
        const type_info = @typeInfo(T);

        switch (type_info) {
            .pointer => |pointer| {
                // pointer must be u8 slice
                if (pointer.child == u8 or pointer.size == .slice) {
                    // sentinel element must be 0
                    const sentinel = pointer.sentinel();
                    if (sentinel != null and sentinel.? == 0) return e.return_string(val);
                }
                const err_msg = std.fmt.comptimePrint("val's type ({}), only support [:0]const u8 for Pointer!", .{T});
                @compileError(err_msg);
            },
            .int => |int| {
                const bits = int.bits;
                const is_signed = int.signedness == .signed;
                if (is_signed and bits <= 64) {
                    e.return_int(@intCast(val));
                } else if (!is_signed and bits <= 63) {
                    e.return_int(@intCast(val));
                } else {
                    const err_msg = std.fmt.comptimePrint("val's type ({}), out of i64", .{T});
                    @compileError(err_msg);
                }
            },
            .bool => e.return_bool(val),
            .float => e.return_float(val),
            else => {
                const err_msg = std.fmt.comptimePrint("val's type ({}), only support int, float, bool, string([]const u8)!", .{T});
                @compileError(err_msg);
            },
        }
    }

    /// Get how many arguments there are in an event
    pub fn get_count(e: *Event) usize {
        return webui_get_count(e);
    }

    /// Get an argument as integer at a specific index
    pub fn get_int_at(e: *Event, index: usize) i64 {
        return webui_get_int_at(e, index);
    }

    /// Get the first argument as integer
    pub fn get_int(e: *Event) i64 {
        return webui_get_int(e);
    }

    /// Get an argument as float at a specific index
    pub fn get_float_at(e: *Event, index: usize) f64 {
        return webui_get_float_at(e, index);
    }

    /// Get the first argument as float
    pub fn get_float(e: *Event) f64 {
        return webui_get_float(e);
    }

    /// Get an argument as string at a specific index
    pub fn get_string_at(e: *Event, index: usize) [:0]const u8 {
        const ptr = webui_get_string_at(e, index);
        const len = std.mem.len(ptr);
        return ptr[0..len :0];
    }

    /// Get the first argument as string
    pub fn get_string(e: *Event) [:0]const u8 {
        const ptr = webui_get_string(e);
        const len = std.mem.len(ptr);
        return ptr[0..len :0];
    }
    // Get the first argument raw buffer
    pub fn get_raw_at(e: *Event, index: usize) [*]const u8 {
        const ptr = webui_get_string_at(e, index);
        return @ptrCast(ptr);
    }

    // Get the first argument raw buffer
    pub fn get_raw(e: *Event) [*]const u8 {
        const ptr = webui_get_string(e);
        return @ptrCast(ptr);
    }

    /// Get an argument as boolean at a specific index
    pub fn get_bool_at(e: *Event, index: usize) bool {
        return webui_get_bool_at(e, index);
    }

    /// Get the first argument as boolean
    pub fn get_bool(e: *Event) bool {
        return webui_get_bool(e);
    }

    /// Get the size in bytes of an argument at a specific index
    pub fn get_size_at(e: *Event, index: usize) !usize {
        const size = webui_get_size_at(e, index);
        if (size == 0) return WebUIError.GenericError;
        return size;
    }

    /// Get size in bytes of the first argument
    pub fn get_size(e: *Event) !usize {
        const size = webui_get_size(e);
        if (size == 0) return WebUIError.GenericError;
        return size;
    }

    /// Get user data that is set using `SetContext()`.
    pub fn get_context(e: *Event) !*anyopaque {
        const context = webui_get_context(e);
        if (context == null) return WebUIError.GenericError;
        return context;
    }
};
