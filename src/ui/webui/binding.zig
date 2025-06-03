const std = @import("std");
const types = @import("types.zig");
const event_mod = @import("event.zig");

const WebUIError = types.WebUIError;
const EventKind = types.EventKind;
const Event = event_mod.Event;

// Import the main webui type
const Webui = @import("webui.zig");

// C function declarations for binding
pub extern fn webui_bind(
    window: usize,
    element: [*:0]const u8,
    func: *const fn (e: *Event) callconv(.C) void,
) callconv(.C) usize;

pub extern fn webui_set_context(
    window: usize,
    element: [*:0]const u8,
    context: *anyopaque,
) callconv(.C) void;

pub extern fn webui_interface_bind(
    window: usize,
    element: [*:0]const u8,
    func: *const fn (
        window_: usize,
        event: EventKind,
        element: [*:0]u8,
        event_number: usize,
        bind_id: usize,
    ) void,
) callconv(.C) usize;

pub extern fn webui_interface_set_response(
    window: usize,
    event_number: usize,
    response: [*:0]const u8,
) callconv(.C) void;

/// Bind an HTML element and a JavaScript object with a backend function.
/// Empty element name means all events.
pub fn bind(
    self: Webui,
    element: [:0]const u8,
    comptime func: fn (e: *Event) void,
) !usize {
    const tmp_struct = struct {
        fn handle(tmp_e: *Event) callconv(.C) void {
            func(tmp_e);
        }
    };
    const index = webui_bind(self.window_handle, element.ptr, tmp_struct.handle);
    if (index == 0) return WebUIError.BindError;

    return index;
}

/// Use this API after using `bind()` to add any user data to it that can be
/// read later using `getContext()`
pub fn set_context(self: Webui, element: [:0]const u8, context: *anyopaque) void {
    webui_set_context(self.window_handle, element.ptr, context);
}

/// Bind a specific HTML element click event with a function.
/// Empty element means all events.
pub fn interface_bind(
    self: Webui,
    element: [:0]const u8,
    comptime callback: fn (
        window_handle: usize,
        event_type: EventKind,
        element: []u8,
        event_number: usize,
        bind_id: usize,
    ) void,
) void {
    const tmp_struct = struct {
        fn handle(
            tmp_window: usize,
            tmp_event_type: EventKind,
            tmp_element: [*:0]u8,
            tmp_event_number: usize,
            tmp_bind_id: usize,
        ) callconv(.C) void {
            const len = std.mem.len(tmp_element);
            callback(tmp_window, tmp_event_type, tmp_element[0..len], tmp_event_number, tmp_bind_id);
        }
    };
    _ = webui_interface_bind(self.window_handle, element.ptr, tmp_struct.handle);
}

/// When using `interfaceBind()`, you may need this function to easily set a response.
pub fn interface_set_response(self: Webui, event_number: usize, response: [:0]const u8) void {
    webui_interface_set_response(self.window_handle, event_number, response.ptr);
}

/// Advanced binding function with automatic type conversion
pub fn binding(self: Webui, element: [:0]const u8, comptime callback: anytype) !usize {
    const T = @TypeOf(callback);
    const TInfo = @typeInfo(T);

    // Verify the callback is a function
    if (TInfo != .@"fn") {
        const err_msg = std.fmt.comptimePrint(
            "callback's type ({}), it must be a function!",
            .{T},
        );
        @compileError(err_msg);
    }

    const fnInfo = TInfo.@"fn";
    // Verify return type is void
    if (fnInfo.return_type != void) {
        const err_msg = std.fmt.comptimePrint(
            "callback's return type ({}), it must be void!",
            .{fnInfo.return_type},
        );
        @compileError(err_msg);
    }

    // Verify function is not generic
    if (fnInfo.is_generic) {
        const err_msg = std.fmt.comptimePrint(
            "callback's type ({}), it can not be a generic function!",
            .{T},
        );
        @compileError(err_msg);
    }

    // Verify function does not use varargs
    if (fnInfo.is_var_args) {
        const err_msg = std.fmt.comptimePrint(
            "callback's type ({}), it can not have variable args!",
            .{T},
        );
        @compileError(err_msg);
    }

    const tmp_struct = struct {
        const tup_t = fn_params_to_tuple(fnInfo.params);

        // Event handler that will convert parameters and call the user's callback
        fn handle(e: *Event) void {
            var param_tup: tup_t = undefined;

            var index: usize = 0;
            // Process each parameter of the callback function
            inline for (fnInfo.params, 0..fnInfo.params.len) |param, i| {
                if (param.type) |tt| {
                    const paramTInfo = @typeInfo(tt);
                    switch (paramTInfo) {
                        // Handle struct type parameters (only Event is allowed)
                        .@"struct" => {
                            if (tt == Event) {
                                param_tup[i] = e.*;
                                index += 1;
                            } else {
                                const err_msg = std.fmt.comptimePrint(
                                    "the struct type is ({}), the struct type you can use only is Event in params!",
                                    .{tt},
                                );
                                @compileError(err_msg);
                            }
                        },
                        // Convert boolean values
                        .bool => {
                            const res = e.get_bool_at(i - index);
                            param_tup[i] = res;
                        },
                        // Convert integer values with appropriate casting
                        .int => {
                            const res = e.get_int_at(i - index);
                            param_tup[i] = @intCast(res);
                        },
                        // Convert floating point values
                        .float => {
                            const res = e.get_float_at(i - index);
                            param_tup[i] = @floatCast(res);
                        },
                        // Handle pointer types with special cases
                        .pointer => |pointer| {
                            // Handle null-terminated string slices
                            if (pointer.size == .slice and pointer.child == u8 and pointer.is_const == true) {
                                if (pointer.sentinel()) |sentinel| {
                                    if (sentinel == 0) {
                                        const str_ptr = e.get_string_at(i - index);
                                        param_tup[i] = str_ptr;
                                    }
                                }
                                // Handle Event pointers
                            } else if (pointer.size == .one and pointer.child == Event) {
                                param_tup[i] = e;
                                index += 1;
                                // Handle raw byte pointers
                            } else if (pointer.size == .many and pointer.child == u8 and pointer.is_const == true and pointer.sentinel() == null) {
                                const raw_ptr = e.get_raw_at(i - index);
                                param_tup[i] = raw_ptr;
                            } else {
                                const err_msg = std.fmt.comptimePrint(
                                    "the pointer type is ({}), now we only support [:0]const u8 or [*]const u8 or *webui.Event !",
                                    .{tt},
                                );
                                @compileError(err_msg);
                            }
                        },
                        // Reject unsupported types
                        else => {
                            const err_msg = std.fmt.comptimePrint(
                                "type is ({}), only support these types: Event, Bool, Int, Float, []u8!",
                                .{tt},
                            );
                            @compileError(err_msg);
                        },
                    }
                } else {
                    @compileError("param must have type");
                }
            }

            // Call the user's callback with the properly converted parameters
            @call(.auto, callback, param_tup);
        }
    };

    // Create the actual binding with the webui backend
    return self.bind(element, tmp_struct.handle);
}

/// this funciton will return a fn's params tuple
fn fn_params_to_tuple(comptime params: []const std.builtin.Type.Fn.Param) type {
    const Type = std.builtin.Type;
    const fields: [params.len]Type.StructField = blk: {
        var res: [params.len]Type.StructField = undefined;

        for (params, 0..params.len) |param, i| {
            res[i] = Type.StructField{
                .type = param.type.?,
                .alignment = @alignOf(param.type.?),
                .default_value_ptr = null,
                .is_comptime = false,
                .name = std.fmt.comptimePrint("{}", .{i}),
            };
        }
        break :blk res;
    };
    return @Type(.{
        .@"struct" = std.builtin.Type.Struct{
            .layout = .auto,
            .is_tuple = true,
            .decls = &.{},
            .fields = &fields,
        },
    });
}
