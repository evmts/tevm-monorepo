const std = @import("std");
const types = @import("types.zig");

const WebUIError = types.WebUIError;
const WebUIErrorInfo = types.WebUIErrorInfo;
const flags = @import("flags");

// C function declarations for utilities
pub extern fn webui_get_last_error_number() callconv(.C) c_int;
pub extern fn webui_get_last_error_message() callconv(.C) [*:0]const u8;
pub extern fn webui_encode(str: [*:0]const u8) callconv(.C) ?[*:0]u8;
pub extern fn webui_decode(str: [*:0]const u8) callconv(.C) ?[*:0]u8;
pub extern fn webui_free(ptr: *anyopaque) callconv(.C) void;
pub extern fn webui_malloc(size: usize) callconv(.C) ?*anyopaque;
pub extern fn webui_memcpy(dest: *anyopaque, src: *anyopaque, count: usize) callconv(.C) void;
pub extern fn webui_get_mime_type(file: [*:0]const u8) callconv(.C) [*:0]const u8;
pub extern fn webui_set_tls_certificate(certificate_pem: [*:0]const u8, private_key_pem: [*:0]const u8) callconv(.C) bool;

/// through this func, we can get webui's lastest error number and error message
pub fn get_last_error() WebUIErrorInfo {
    return .{
        .num = webui_get_last_error_number(),
        .msg = webui_get_last_error_message(),
    };
}

/// Base64 encoding. Use this to safely send text based data to the UI.
/// If it fails it will return NULL.
/// you need free the return memory with free function
pub fn encode(str: [:0]const u8) ![]u8 {
    const ptr = webui_encode(str.ptr);
    if (ptr == null) return WebUIError.EncodeError;
    const len = std.mem.len(ptr);
    return ptr[0..len];
}

/// Base64 decoding.
/// Use this to safely decode received Base64 text from the UI.
/// If it fails it will return NULL.
/// you need free the return memory with free function
pub fn decode(str: [:0]const u8) ![]u8 {
    const ptr = webui_decode(str.ptr);
    if (ptr == null) return WebUIError.DecodeError;
    const len = std.mem.len(ptr);
    return ptr[0..len];
}

/// Safely free a buffer allocated by WebUI using
pub fn free(buf: []const u8) void {
    webui_free(@ptrCast(@constCast(buf.ptr)));
}

/// Safely allocate memory using the WebUI memory management system
/// it can be safely freed using `free()` at any time.
/// In general, you should not use this function
pub fn malloc(size: usize) ![]u8 {
    const ptr = webui_malloc(size) orelse return WebUIError.AllocateFailed;
    return @as([*]u8, @ptrCast(ptr))[0..size];
}

/// Copy raw data
/// In general, you should not use this function
pub fn memcpy(dst: []u8, src: []const u8) void {
    webui_memcpy(@ptrCast(dst.ptr), @ptrCast(src.ptr), src.len);
}

/// Get the HTTP mime type of a file.
pub fn get_mime_type(file: [:0]const u8) [:0]const u8 {
    const res = webui_get_mime_type(file.ptr);
    return res[0..std.mem.len(res) :0];
}

/// Set the SSL/TLS certificate and the private key content,
/// both in PEM format.
/// This works only with `webui-2-secure` library.
/// If set empty WebUI will generate a self-signed certificate.
pub fn set_tls_certificate(certificate_pem: [:0]const u8, private_key_pem: [:0]const u8) !void {
    if (comptime !flags.enable_tls) {
        @compileError("not enable tls");
    }
    const success = webui_set_tls_certificate(certificate_pem.ptr, private_key_pem.ptr);
    if (!success) return WebUIError.GenericError;
}
