//! WebUI - A modern web UI library for Zig
//! This module combines all WebUI functionality into a single interface

const std = @import("std");
const builtin = @import("builtin");

const Self = @This();

// The window handle is the only field of this struct
window_handle: usize,

// Import and re-export all types
pub const types = @import("types.zig");
pub const WebUIError = types.WebUIError;
pub const WebUIErrorInfo = types.WebUIErrorInfo;
pub const Browser = types.Browser;
pub const Runtime = types.Runtime;
pub const EventKind = types.EventKind;
pub const Config = types.Config;
pub const WEBUI_VERSION = types.WEBUI_VERSION;
pub const WEBUI_MAX_IDS = types.WEBUI_MAX_IDS;
pub const WEBUI_MAX_ARG = types.WEBUI_MAX_ARG;

// Import event module and re-export Event
pub const event_mod = @import("event.zig");
pub const Event = event_mod.Event;

// Import other modules
const window_mod = @import("window.zig");
const binding_mod = @import("binding.zig");
const file_handler_mod = @import("file_handler.zig");
const javascript_mod = @import("javascript.zig");
const config_mod = @import("config.zig");
const utils_mod = @import("utils.zig");

// Use usingnamespace to include all methods from each module
pub usingnamespace window_mod;
pub usingnamespace binding_mod;
pub usingnamespace file_handler_mod;
pub usingnamespace javascript_mod;
pub usingnamespace config_mod;
pub usingnamespace utils_mod;

// Note: Global functions are already included via usingnamespace,
// so we don't need to re-export them explicitly

// Deprecated function placeholders for compatibility
pub fn get_count(_: *Event) usize {
    @compileError("please use Event.getCount, this will be removed when zig-webui release");
}

pub fn get_int_at(_: *Event, _: usize) i64 {
    @compileError("please use Event.getIntAt, this will be removed when zig-webui release");
}

pub fn get_int(_: *Event) i64 {
    @compileError("please use Event.getInt, this will be removed when zig-webui release");
}

pub fn get_float_at(_: *Event, _: usize) f64 {
    @compileError("please use Event.getFloatAt, this will be removed when zig-webui release");
}

pub fn get_float(_: *Event) f64 {
    @compileError("please use Event.getFloat, this will be removed when zig-webui release");
}

pub fn get_string_at(_: *Event, _: usize) [:0]const u8 {
    @compileError("please use Event.getStringAt, this will be removed when zig-webui release");
}

pub fn get_string(_: *Event) [:0]const u8 {
    @compileError("please use Event.getString, this will be removed when zig-webui release");
}

pub fn get_bool_at(_: *Event, _: usize) bool {
    @compileError("please use Event.getBoolAt, this will be removed when zig-webui release");
}

pub fn get_bool(_: *Event) bool {
    @compileError("please use Event.getBool, this will be removed when zig-webui release");
}

pub fn get_size_at(_: *Event, _: usize) usize {
    @compileError("please use Event.getSizeAt, this will be removed when zig-webui release");
}

pub fn get_size(_: *Event) usize {
    @compileError("please use Event.getSize, this will be removed when zig-webui release");
}

pub fn return_int(_: *Event, _: i64) void {
    @compileError("please use Event.returnInt, this will be removed when zig-webui release");
}

pub fn return_string(_: *Event, _: [:0]const u8) void {
    @compileError("please use Event.returnString, this will be removed when zig-webui release");
}

pub fn return_bool(_: *Event, _: bool) void {
    @compileError("please use Event.returnBool, this will be removed when zig-webui release");
}
