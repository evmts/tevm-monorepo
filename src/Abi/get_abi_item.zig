const std = @import("std");
const abi = @import("abi.zig");
const compute_function_selector = @import("compute_function_selector.zig");

/// Error type for ABI item lookup operations
pub const GetAbiItemError = error{
    ItemNotFound,
    AmbiguousName,
};

/// Type of ABI item for filtering
pub const AbiItemType = enum {
    Function,
    Event,
    Error,
    Constructor,
    Fallback,
    Receive,
};

/// Get a specific ABI item by name or selector
///
/// abi_items: Array of ABI items
/// opts: Options for retrieval
///
/// Returns the matching ABI item or an error if not found
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
    item_type: ?AbiItemType,
) !abi.AbiItem {
    // Special handling for constructor (no name)
    if (std.mem.eql(u8, name, "constructor")) {
        if (item_type != null and item_type.? != .Constructor) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Constructor => return item,
                else => continue,
            }
        }
        return GetAbiItemError.ItemNotFound;
    }
    
    // Special handling for fallback
    if (std.mem.eql(u8, name, "fallback")) {
        if (item_type != null and item_type.? != .Fallback) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Fallback => return item,
                else => continue,
            }
        }
        return GetAbiItemError.ItemNotFound;
    }
    
    // Special handling for receive
    if (std.mem.eql(u8, name, "receive")) {
        if (item_type != null and item_type.? != .Receive) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Receive => return item,
                else => continue,
            }
        }
        return GetAbiItemError.ItemNotFound;
    }
    
    // Look for regular named items (function, event, error)
    var matches = std.ArrayList(abi.AbiItem).init(std.heap.c_allocator);
    defer matches.deinit();
    
    for (abi_items) |item| {
        var item_matches = false;
        var item_has_name = false;
        var item_name: []const u8 = "";
        
        switch (item) {
            .Function => |func| {
                item_has_name = true;
                item_name = func.name;
                if (item_type == null or item_type.? == .Function) {
                    item_matches = true;
                }
            },
            .Event => |event| {
                item_has_name = true;
                item_name = event.name;
                if (item_type == null or item_type.? == .Event) {
                    item_matches = true;
                }
            },
            .Error => |err| {
                item_has_name = true;
                item_name = err.name;
                if (item_type == null or item_type.? == .Error) {
                    item_matches = true;
                }
            },
            else => continue,
        }
        
        if (item_has_name and item_matches and std.mem.eql(u8, item_name, name)) {
            try matches.append(item);
        }
    }
    
    if (matches.items.len == 0) {
        return GetAbiItemError.ItemNotFound;
    }
    
    // If we have multiple matches and no item_type filter, it's ambiguous
    if (matches.items.len > 1 and item_type == null) {
        return GetAbiItemError.AmbiguousName;
    }
    
    return matches.items[0];
}

/// Get an ABI item by selector
///
/// abi_items: Array of ABI items
/// selector: The 4-byte selector (for functions) or 32-byte topic hash (for events)
/// item_type: Optional filter by item type
///
/// Returns the first matching ABI item or an error if not found
fn getAbiItemBySelector(
    abi_items: []const abi.AbiItem,
    selector: []const u8,
    item_type: ?AbiItemType,
) !abi.AbiItem {
    // For functions, we expect a 4-byte selector
    if (selector.len == 4) {
        // This is likely a function selector
        if (item_type != null and 
            item_type.? != .Function and
            item_type.? != .Error) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Function => |func| {
                    var computed_selector: [4]u8 = undefined;
                    compute_function_selector.getFunctionSelector(func, &computed_selector) catch continue;
                    
                    if (std.mem.eql(u8, &computed_selector, selector)) {
                        return item;
                    }
                },
                .Error => |err| {
                    if (item_type != null and item_type.? == .Function) {
                        continue; // Skip if explicitly looking for a function
                    }
                    
                    var signature_buf: [256]u8 = undefined;
                    var signature_len: usize = 0;
                    
                    // Error name
                    if (signature_len + err.name.len > signature_buf.len) {
                        continue;
                    }
                    @memcpy(signature_buf[signature_len..][0..err.name.len], err.name);
                    signature_len += err.name.len;
                    
                    // Opening parenthesis
                    if (signature_len + 1 > signature_buf.len) {
                        continue;
                    }
                    signature_buf[signature_len] = '(';
                    signature_len += 1;
                    
                    // Parameter types
                    for (err.inputs, 0..) |param, i| {
                        if (i > 0) {
                            // Add comma between parameters
                            if (signature_len + 1 > signature_buf.len) {
                                continue;
                            }
                            signature_buf[signature_len] = ',';
                            signature_len += 1;
                        }
                        
                        // Add parameter type
                        if (signature_len + param.ty.len > signature_buf.len) {
                            continue;
                        }
                        @memcpy(signature_buf[signature_len..][0..param.ty.len], param.ty);
                        signature_len += param.ty.len;
                    }
                    
                    // Closing parenthesis
                    if (signature_len + 1 > signature_buf.len) {
                        continue;
                    }
                    signature_buf[signature_len] = ')';
                    signature_len += 1;
                    
                    var computed_selector: [4]u8 = undefined;
                    compute_function_selector.computeFunctionSelector(signature_buf[0..signature_len], &computed_selector);
                    
                    if (std.mem.eql(u8, &computed_selector, selector)) {
                        return item;
                    }
                },
                else => continue,
            }
        }
    }
    
    // For events, we expect a 32-byte topic hash
    if (selector.len == 32) {
        // This is likely an event topic
        if (item_type != null and item_type.? != .Event) {
            return GetAbiItemError.ItemNotFound;
        }
        
        for (abi_items) |item| {
            switch (item) {
                .Event => |event| {
                    if (event.anonymous) {
                        continue; // Anonymous events don't have a topic
                    }
                    
                    const computed_topic = compute_function_selector.getEventTopic(event) catch continue;
                    
                    if (std.mem.eql(u8, &computed_topic, selector)) {
                        return item;
                    }
                },
                else => continue,
            }
        }
    }
    
    return GetAbiItemError.ItemNotFound;
}

/// Options for getAbiItem
pub const GetAbiItemOpts = struct {
    /// Name of the function, event, error, etc. to find
    name: ?[]const u8 = null,
    
    /// Selector (4-byte function selector or 32-byte event topic)
    selector: ?[]const u8 = null,
    
    /// Type filter (optional)
    item_type: ?AbiItemType = null,
};

/// Get a function by name
///
/// abi_items: Array of ABI items
/// name: Name of the function to find
///
/// Returns the function or an error if not found
pub fn getFunction(abi_items: []const abi.AbiItem, name: []const u8) !abi.Function {
    const item = try getAbiItem(abi_items, .{
        .name = name,
        .item_type = .Function,
    });
    
    return switch (item) {
        .Function => |func| func,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get a function by selector
///
/// abi_items: Array of ABI items
/// selector: 4-byte function selector
///
/// Returns the function or an error if not found
pub fn getFunctionBySelector(abi_items: []const abi.AbiItem, selector: []const u8) !abi.Function {
    const item = try getAbiItem(abi_items, .{
        .selector = selector,
        .item_type = .Function,
    });
    
    return switch (item) {
        .Function => |func| func,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get an event by name
///
/// abi_items: Array of ABI items
/// name: Name of the event to find
///
/// Returns the event or an error if not found
pub fn getEvent(abi_items: []const abi.AbiItem, name: []const u8) !abi.Event {
    const item = try getAbiItem(abi_items, .{
        .name = name,
        .item_type = .Event,
    });
    
    return switch (item) {
        .Event => |event| event,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get an event by topic hash
///
/// abi_items: Array of ABI items
/// topic: 32-byte event topic hash
///
/// Returns the event or an error if not found
pub fn getEventByTopic(abi_items: []const abi.AbiItem, topic: []const u8) !abi.Event {
    const item = try getAbiItem(abi_items, .{
        .selector = topic,
        .item_type = .Event,
    });
    
    return switch (item) {
        .Event => |event| event,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get an error by name
///
/// abi_items: Array of ABI items
/// name: Name of the error to find
///
/// Returns the error or an error if not found
pub fn getError(abi_items: []const abi.AbiItem, name: []const u8) !abi.Error {
    const item = try getAbiItem(abi_items, .{
        .name = name,
        .item_type = .Error,
    });
    
    return switch (item) {
        .Error => |err| err,
        else => unreachable, // This shouldn't happen due to item_type filter
    };
}

/// Get the constructor
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

test "getAbiItem by name" {
    const testing = std.testing;

    // Prepare parameter arrays
    var transfer_inputs = [_]abi.Param{
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
    };
    
    var transfer_outputs = [_]abi.Param{
        .{
            .ty = "bool",
            .name = "success",
            .components = &[_]abi.Param{},
            .internal_type = null,
        },
    };
    
    var transfer_event_inputs = [_]abi.EventParam{
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
    };
    
    // Create a sample ABI
    var sample_abi = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &transfer_inputs,
                .outputs = &transfer_outputs,
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
        .{
            .Event = .{
                .name = "Transfer",
                .inputs = &transfer_event_inputs,
                .anonymous = false,
            },
        },
    };
    
    // Test getting items by name
    {
        const item = try getAbiItem(&sample_abi, .{
            .name = "transfer",
        });
        
        switch (item) {
            .Function => |func| {
                try testing.expectEqualStrings("transfer", func.name);
            },
            else => try testing.expect(false), // Should not happen
        }
    }
    
    // Test getting items by name and type
    {
        const item = try getAbiItem(&sample_abi, .{
            .name = "Transfer",
            .item_type = .Event,
        });
        
        switch (item) {
            .Event => |event| {
                try testing.expectEqualStrings("Transfer", event.name);
                try testing.expectEqual(@as(usize, 3), event.inputs.len);
            },
            else => try testing.expect(false), // Should not happen
        }
    }
}

test "getAbiItem by selector" {
    const testing = std.testing;
    
    // Prepare parameter arrays
    var transfer_inputs = [_]abi.Param{
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
    };
    
    var transfer_outputs = [_]abi.Param{
        .{
            .ty = "bool",
            .name = "success",
            .components = &[_]abi.Param{},
            .internal_type = null,
        },
    };
    
    // Create a sample ABI
    var sample_abi = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &transfer_inputs,
                .outputs = &transfer_outputs,
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
    };
    
    // Test getting function by selector
    {
        // transfer(address,uint256) => 0xa9059cbb
        const selector = [_]u8{ 0xa9, 0x05, 0x9c, 0xbb };
        
        const item = try getAbiItem(&sample_abi, .{
            .selector = &selector,
        });
        
        switch (item) {
            .Function => |func| {
                try testing.expectEqualStrings("transfer", func.name);
            },
            else => try testing.expect(false), // Should not happen
        }
    }
    
    // Test with filtering by type
    {
        // transfer(address,uint256) => 0xa9059cbb
        const selector = [_]u8{ 0xa9, 0x05, 0x9c, 0xbb };
        
        const item = try getAbiItem(&sample_abi, .{
            .selector = &selector,
            .item_type = .Function,
        });
        
        switch (item) {
            .Function => |func| {
                try testing.expectEqualStrings("transfer", func.name);
            },
            else => try testing.expect(false), // Should not happen
        }
    }
}

test "helper functions" {
    const testing = std.testing;
    
    // Prepare parameter arrays
    var transfer_inputs = [_]abi.Param{
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
    };
    
    var transfer_outputs = [_]abi.Param{
        .{
            .ty = "bool",
            .name = "success",
            .components = &[_]abi.Param{},
            .internal_type = null,
        },
    };
    
    var transfer_event_inputs = [_]abi.EventParam{
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
    };
    
    // Create a sample ABI
    var sample_abi = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &transfer_inputs,
                .outputs = &transfer_outputs,
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
        .{
            .Event = .{
                .name = "Transfer",
                .inputs = &transfer_event_inputs,
                .anonymous = false,
            },
        },
    };
    
    // Test getFunction
    {
        const func = try getFunction(&sample_abi, "transfer");
        try testing.expectEqualStrings("transfer", func.name);
    }
    
    // Test getEvent
    {
        const event = try getEvent(&sample_abi, "Transfer");
        try testing.expectEqualStrings("Transfer", event.name);
    }
}