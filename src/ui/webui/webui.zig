//! WebUI - A modern web UI library for Zig
//! This module combines all WebUI functionality into a single interface

const std = @import("std");
const builtin = @import("builtin");

const Webui = @This();

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
