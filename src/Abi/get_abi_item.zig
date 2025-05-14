const std = @import("std");
const abi = @import("abi.zig");
const compute_function_selector = @import("compute_function_selector.zig");

/// Error type for finding ABI items
pub const GetAbiItemError = error{
    ItemNotFound,
    InvalidSelector,
    BufferTooShort,
    InvalidSignature,
};

/// Options for getAbiItem
pub const GetAbiItemOpts = struct {
    /// The name of the item to find (function, event, error name)
    name: ?[]const u8 = null,
    
    /// The 4-byte selector (for functions) or 32-byte topic hash (for events)
    selector: ?[]const u8 = null,
    
    /// Filter by ABI item type
    item_type: ?enum { 
        Function,
        Event, 
        Error,
        Constructor,
        Fallback,
        Receive,
    } = null,
};

/// Get a specific item from an ABI array
///
/// abi_items: Array of ABI items
/// opts: Options to filter the items
///
/// Returns the first matching ABI item or an error if not found
pub fn getAbiItem(
    abi_items: []const abi.AbiItem,
    opts: GetAbiItemOpts,
) !abi.AbiItem {
    // If neither name nor selector provided, error
    if (opts.name == null and opts.selector == null) {
        return GetAbiItemError.ItemNotFound;
    }
    
    // Check by selector if provided
    if (opts.selector != null) {
        return getAbiItemBySelector(abi_items, opts.selector.?, opts.item_type);
    }
    
    // Otherwise check by name
    return getAbiItemByName(abi_items, opts.name.?, opts.item_type);
}

/// Get a specific ABI item by name
///
/// abi_items: Array of ABI items
/// name: The name of the item to find
/// item_type: Optional filter by item type
///
/// Returns the first matching ABI item or an error if not found
fn getAbiItemByName(
    abi_items: []const abi.AbiItem,
    name: []const u8,
    item_type: ?enum { 
        Function,
        Event, 
        Error,
        Constructor,
        Fallback,
        Receive,
    },
) !abi.AbiItem {
    for (abi_items) |item| {
        switch (item) {
            .Function => |func| {
                if (item_type != null and item_type.? != .Function) {
                    continue;
                }
                if (std.mem.eql(u8, func.name, name)) {
                    return item;
                }
            },
            .Event => |event| {
                if (item_type != null and item_type.? != .Event) {
                    continue;
                }
                if (std.mem.eql(u8, event.name, name)) {
                    return item;
                }
            },
            .Error => |err| {
                if (item_type != null and item_type.? != .Error) {
                    continue;
                }
                if (std.mem.eql(u8, err.name, name)) {
                    return item;
                }
            },
            .Constructor => {
                if (item_type != null and item_type.? != .Constructor) {
                    continue;
                }
                // Constructor doesn't have a name, but if we're specifically
                // searching for it by name "constructor", we can match it
                if (std.mem.eql(u8, name, "constructor")) {
                    return item;
                }
            },
            .Fallback => {
                if (item_type != null and item_type.? != .Fallback) {
                    continue;
                }
                // Fallback doesn't have a name, but if we're specifically
                // searching for it by name "fallback", we can match it
                if (std.mem.eql(u8, name, "fallback")) {
                    return item;
                }
            },
            .Receive => {
                if (item_type != null and item_type.? != .Receive) {
                    continue;
                }
                // Receive doesn't have a name, but if we're specifically
                // searching for it by name "receive", we can match it
                if (std.mem.eql(u8, name, "receive")) {
                    return item;
                }
            },
        }
    }
    
    return GetAbiItemError.ItemNotFound;
}

/// Get a specific ABI item by selector or topic hash
///
/// abi_items: Array of ABI items
/// selector: The 4-byte selector (for functions) or 32-byte topic hash (for events)
/// item_type: Optional filter by item type
///
/// Returns the first matching ABI item or an error if not found
fn getAbiItemBySelector(
    abi_items: []const abi.AbiItem,
    selector: []const u8,
    item_type: ?enum { 
        Function,
        Event, 
        Error,
        Constructor,
        Fallback,
        Receive,
    },
) !abi.AbiItem {
    // For functions, we expect a 4-byte selector
    if (selector.len == 4) {
        // This is likely a function selector
        if (item_type != null and 
            item_type.? != .Function and 
            item_type.? != .Constructor and
            item_type.? != .Fallback and
            item_type.? != .Receive) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Function => |func| {
                    if (item_type != null and item_type.? != .Function) {
                        continue;
                    }
                    
                    const func_selector = compute_function_selector.getFunctionSelector(func);
                    if (std.mem.eql(u8, selector, &func_selector)) {
                        return item;
                    }
                },
                else => continue,
            }
        }
    }
    
    // For events, we expect a 32-byte topic hash
    if (selector.len == 32) {
        // This is likely an event topic hash
        if (item_type != null and item_type.? != .Event) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Event => |event| {
                    if (item_type != null and item_type.? != .Event) {
                        continue;
                    }
                    
                    const event_topic = compute_function_selector.getEventTopic(event);
                    if (std.mem.eql(u8, selector, &event_topic)) {
                        return item;
                    }
                },
                else => continue,
            }
        }
    }
    
    return GetAbiItemError.ItemNotFound;
}

/// Get a specific function from an ABI by name
///
/// abi_items: Array of ABI items
/// name: The name of the function to find
///
/// Returns the matching function or an error if not found
pub fn getFunction(
    abi_items: []const abi.AbiItem,
    name: []const u8,
) !abi.Function {
    const item = try getAbiItem(abi_items, .{
        .name = name,
        .item_type = .Function,
    });
    
    return switch (item) {
        .Function => |func| func,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get a specific function from an ABI by selector
///
/// abi_items: Array of ABI items
/// selector: The 4-byte function selector
///
/// Returns the matching function or an error if not found
pub fn getFunctionBySelector(
    abi_items: []const abi.AbiItem,
    selector: [4]u8,
) !abi.Function {
    const item = try getAbiItem(abi_items, .{
        .selector = &selector,
        .item_type = .Function,
    });
    
    return switch (item) {
        .Function => |func| func,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get a specific event from an ABI by name
///
/// abi_items: Array of ABI items
/// name: The name of the event to find
///
/// Returns the matching event or an error if not found
pub fn getEvent(
    abi_items: []const abi.AbiItem,
    name: []const u8,
) !abi.Event {
    const item = try getAbiItem(abi_items, .{
        .name = name,
        .item_type = .Event,
    });
    
    return switch (item) {
        .Event => |event| event,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get a specific event from an ABI by topic hash
///
/// abi_items: Array of ABI items
/// topic: The 32-byte event topic hash
///
/// Returns the matching event or an error if not found
pub fn getEventByTopic(
    abi_items: []const abi.AbiItem,
    topic: [32]u8,
) !abi.Event {
    const item = try getAbiItem(abi_items, .{
        .selector = &topic,
        .item_type = .Event,
    });
    
    return switch (item) {
        .Event => |event| event,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get the constructor from an ABI
///
/// abi_items: Array of ABI items
///
/// Returns the constructor or an error if not found
pub fn getConstructor(abi_items: []const abi.AbiItem) !abi.Constructor {
    const item = try getAbiItem(abi_items, .{
        .name = "constructor",
        .item_type = .Constructor,
    });
    
    return switch (item) {
        .Constructor => |constructor| constructor,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Tests for getAbiItem
test "getAbiItem by name" {
    const testing = std.testing;
    
    // Create a sample ABI
    const sample_abi = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &[_]abi.Param{
                    .{
                        .ty = "address",
                        .name = "to",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "uint256",
                        .name = "amount",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .outputs = &[_]abi.Param{
                    .{
                        .ty = "bool",
                        .name = "success",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
        .{
            .Event = .{
                .name = "Transfer",
                .inputs = &[_]abi.EventParam{
                    .{
                        .ty = "address",
                        .name = "from",
                        .indexed = true,
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "address",
                        .name = "to",
                        .indexed = true,
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "uint256",
                        .name = "value",
                        .indexed = false,
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .anonymous = false,
            },
        },
        .{
            .Constructor = .{
                .inputs = &[_]abi.Param{
                    .{
                        .ty = "string",
                        .name = "name",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "string",
                        .name = "symbol",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .state_mutability = abi.StateMutability.Payable,
            },
        },
    };
    
    // Test getting a function by name
    {
        const item = try getAbiItem(&sample_abi, .{
            .name = "transfer",
        });
        
        const func = switch (item) {
            .Function => |f| f,
            else => {
                try testing.expect(false);
                unreachable;
            },
        };
        
        try testing.expectEqualStrings("transfer", func.name);
        try testing.expectEqual(@as(usize, 2), func.inputs.len);
        try testing.expectEqualStrings("address", func.inputs[0].ty);
    }
    
    // Test getting an event by name
    {
        const item = try getAbiItem(&sample_abi, .{
            .name = "Transfer",
            .item_type = .Event,
        });
        
        const event = switch (item) {
            .Event => |e| e,
            else => {
                try testing.expect(false);
                unreachable;
            },
        };
        
        try testing.expectEqualStrings("Transfer", event.name);
        try testing.expectEqual(@as(usize, 3), event.inputs.len);
        try testing.expectEqualStrings("address", event.inputs[0].ty);
        try testing.expect(event.inputs[0].indexed);
    }
    
    // Test getting the constructor
    {
        const item = try getAbiItem(&sample_abi, .{
            .name = "constructor",
            .item_type = .Constructor,
        });
        
        const constructor = switch (item) {
            .Constructor => |c| c,
            else => {
                try testing.expect(false);
                unreachable;
            },
        };
        
        try testing.expectEqual(@as(usize, 2), constructor.inputs.len);
        try testing.expectEqual(abi.StateMutability.Payable, constructor.state_mutability);
    }
    
    // Test item not found
    {
        const result = getAbiItem(&sample_abi, .{
            .name = "nonExistentFunction",
        });
        
        try testing.expectError(GetAbiItemError.ItemNotFound, result);
    }
}

test "getFunction" {
    const testing = std.testing;
    
    // Create a sample ABI
    const sample_abi = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &[_]abi.Param{
                    .{
                        .ty = "address",
                        .name = "to",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "uint256",
                        .name = "amount",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .outputs = &[_]abi.Param{
                    .{
                        .ty = "bool",
                        .name = "success",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
        .{
            .Event = .{
                .name = "Transfer",
                .inputs = &[_]abi.EventParam{
                    .{
                        .ty = "address",
                        .name = "from",
                        .indexed = true,
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "address",
                        .name = "to",
                        .indexed = true,
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "uint256",
                        .name = "value",
                        .indexed = false,
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .anonymous = false,
            },
        },
    };
    
    // Test getting a function
    const func = try getFunction(&sample_abi, "transfer");
    try testing.expectEqualStrings("transfer", func.name);
    try testing.expectEqual(@as(usize, 2), func.inputs.len);
    try testing.expectEqualStrings("address", func.inputs[0].ty);
}