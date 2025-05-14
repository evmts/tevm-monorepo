const std = @import("std");
const abi = @import("abi.zig");
const encode_abi_parameters = @import("encode_abi_parameters.zig");
const decode_abi_parameters = @import("decode_abi_parameters.zig");
const compute_function_selector = @import("compute_function_selector.zig");
const get_abi_item = @import("get_abi_item.zig");

/// Error type for event handling operations
pub const EventHandlingError = error{
    EventNotFound,
    InvalidTopicData,
    InvalidEventData,
    OutOfMemory,
    MissingTopics,
    InvalidAbi,
} || encode_abi_parameters.EncodeError || decode_abi_parameters.DecodeError;

/// Log data structure
pub const Log = struct {
    /// 32-byte block hash
    block_hash: [32]u8,
    /// Block number
    block_number: u64,
    /// 20-byte address of the logging contract
    address: [20]u8,
    /// Transaction hash
    transaction_hash: [32]u8,
    /// Transaction index within the block
    transaction_index: u32,
    /// Log index within the block
    log_index: u32,
    /// Array of 32-byte topics (including the event signature)
    topics: std.ArrayList([32]u8),
    /// Log data (non-indexed parameters)
    data: []const u8,
    /// True if removed due to chain reorganization
    removed: bool,
};

/// Structure for decoded event data
pub const DecodedEvent = struct {
    /// Event name
    name: []const u8,
    /// Map of indexed parameters by name
    indexed_args: std.StringHashMap([]const u8),
    /// Map of non-indexed parameters by name
    non_indexed_args: std.StringHashMap([]const u8),
    /// Full map of all parameters by name
    args: std.StringHashMap([]const u8),
};

/// Encodes event topics for use in logs filtering
///
/// abi_items: Array of ABI items representing contract interface
/// event_name: Name of the event
/// indexed_values: HashMap of indexed parameter values by name (can be null for wildcards)
///
/// Returns an array of topics where the first item is the event signature hash 
/// and subsequent topics are the indexed parameters
pub fn encodeEventTopics(
    allocator: std.mem.Allocator,
    abi_items: []const abi.AbiItem,
    event_name: []const u8,
    indexed_values: ?std.StringHashMap(?[]const u8),
) !std.ArrayList([32]u8) {
    // Find the event in the ABI
    const event = get_abi_item.getEvent(abi_items, event_name) catch {
        return EventHandlingError.EventNotFound;
    };
    
    return encodeEventTopicsWithEvent(
        allocator,
        event,
        indexed_values,
    );
}

/// Encodes event topics for a specific event ABI definition
///
/// event: ABI event definition
/// indexed_values: HashMap of indexed parameter values by name (can be null for wildcards)
///
/// Returns an array of topics where the first item is the event signature hash 
/// and subsequent topics are the indexed parameters
pub fn encodeEventTopicsWithEvent(
    allocator: std.mem.Allocator,
    event: abi.Event,
    indexed_values: ?std.StringHashMap(?[]const u8),
) !std.ArrayList([32]u8) {
    var topics = std.ArrayList([32]u8).init(allocator);
    errdefer topics.deinit();
    
    // First topic is the event signature hash (unless anonymous)
    if (!event.anonymous) {
        const event_topic = compute_function_selector.getEventTopic(event);
        try topics.append(event_topic);
    }
    
    // Add topics for indexed parameters
    for (event.inputs) |param| {
        if (param.indexed) {
            var topic_value: ?[32]u8 = null;
            
            // Check if a value is provided for this parameter
            if (indexed_values != null) {
                const value_opt = indexed_values.?.get(param.name);
                
                if (value_opt != null) {
                    // Non-null value provided, encode it
                    if (value_opt.? != null) {
                        // Encode the parameter value as a topic
                        topic_value = try encodeParameterAsTopic(param, value_opt.?.?);
                    }
                    // else: value is explicitly null (wildcard)
                }
                // else: parameter not provided (wildcard)
            }
            
            // Add the topic (or null for a wildcard)
            if (topic_value != null) {
                try topics.append(topic_value.?);
            } else {
                // For wildcard topics, add a null entry
                // In the actual filter implementation, null topics are skipped
                var null_topic: [32]u8 = [_]u8{0} ** 32;
                try topics.append(null_topic);
            }
        }
    }
    
    return topics;
}

/// Encode a parameter value as a 32-byte topic
///
/// param: Parameter definition
/// value: Value to encode
///
/// Returns a 32-byte topic value
fn encodeParameterAsTopic(param: abi.EventParam, value: []const u8) ![32]u8 {
    var topic: [32]u8 = [_]u8{0} ** 32;
    
    // Special handling for dynamic types when indexed
    if (std.mem.eql(u8, param.ty, "string") or 
        std.mem.eql(u8, param.ty, "bytes") or
        param.components.len > 0) {
        // For dynamic types, indexed parameters are hashed
        topic = abi.keccak256(value);
    } else {
        // For static types, just pad to 32 bytes
        // If value is longer than 32 bytes, truncate
        const copy_len = @minimum(value.len, 32);
        
        if (std.mem.startsWith(u8, param.ty, "uint") or
            std.mem.startsWith(u8, param.ty, "int")) {
            // Numbers are right-aligned
            std.mem.copy(u8, topic[32 - copy_len..], value[0..copy_len]);
        } else if (std.mem.eql(u8, param.ty, "address")) {
            // Addresses are right-aligned, but padded to 20 bytes
            const addr_len = @minimum(value.len, 20);
            std.mem.copy(u8, topic[32 - addr_len..], value[0..addr_len]);
        } else {
            // Other types are left-aligned
            std.mem.copy(u8, topic[0..copy_len], value[0..copy_len]);
        }
    }
    
    return topic;
}

/// Decodes an event log into event name and parameter values
///
/// allocator: Memory allocator for results
/// abi_items: Array of ABI items representing contract interface
/// log: Event log data
///
/// Returns the decoded event data including name and arguments
pub fn decodeEventLog(
    allocator: std.mem.Allocator,
    abi_items: []const abi.AbiItem,
    log: Log,
) !DecodedEvent {
    if (log.topics.items.len == 0) {
        return EventHandlingError.MissingTopics;
    }
    
    // First topic is the event signature hash (unless anonymous)
    const topic_hash = log.topics.items[0];
    
    // Find matching event in the ABI
    var event_opt: ?abi.Event = null;
    var event_name: []const u8 = "";
    
    // Try to find by topic hash
    for (abi_items) |item| {
        switch (item) {
            .Event => |event| {
                if (event.anonymous) {
                    // For anonymous events, we need to check arguments
                    // This is complex and would require matching indexed parameters
                    continue;
                }
                
                const event_topic = compute_function_selector.getEventTopic(event);
                if (std.mem.eql(u8, &topic_hash, &event_topic)) {
                    event_opt = event;
                    event_name = event.name;
                    break;
                }
            },
            else => continue,
        }
    }
    
    if (event_opt == null) {
        return EventHandlingError.EventNotFound;
    }
    
    return decodeEventLogWithEvent(
        allocator,
        event_opt.?,
        log,
    );
}

/// Decodes an event log using a specific event ABI definition
///
/// allocator: Memory allocator for results
/// event: ABI event definition
/// log: Event log data
///
/// Returns the decoded event data including arguments
pub fn decodeEventLogWithEvent(
    allocator: std.mem.Allocator,
    event: abi.Event,
    log: Log,
) !DecodedEvent {
    var result = DecodedEvent{
        .name = event.name,
        .indexed_args = std.StringHashMap([]const u8).init(allocator),
        .non_indexed_args = std.StringHashMap([]const u8).init(allocator),
        .args = std.StringHashMap([]const u8).init(allocator),
    };
    errdefer {
        result.indexed_args.deinit();
        result.non_indexed_args.deinit();
        result.args.deinit();
    }
    
    // Check if we have enough topics
    const expected_topics = if (event.anonymous) 0 else 1;
    var indexed_count: usize = 0;
    
    for (event.inputs) |param| {
        if (param.indexed) {
            indexed_count += 1;
        }
    }
    
    if (log.topics.items.len < expected_topics + indexed_count) {
        return EventHandlingError.InvalidTopicData;
    }
    
    // Process indexed parameters
    var topic_index = if (event.anonymous) 0 else 1;
    var non_indexed_params = std.ArrayList(abi.Param).init(allocator);
    defer non_indexed_params.deinit();
    
    for (event.inputs) |param| {
        if (param.indexed) {
            // Get the topic value
            const topic = log.topics.items[topic_index];
            topic_index += 1;
            
            // For indexed parameters, just store the topic value
            const value = try allocator.dupe(u8, &topic);
            try result.indexed_args.put(param.name, value);
            try result.args.put(param.name, value);
        } else {
            // Collect non-indexed parameters for later decoding
            const param_copy = abi.Param{
                .ty = param.ty,
                .name = param.name,
                .components = param.components,
                .internal_type = param.internal_type,
            };
            try non_indexed_params.append(param_copy);
        }
    }
    
    // Decode non-indexed parameters from log data
    if (non_indexed_params.items.len > 0) {
        const decoded = try decode_abi_parameters.decodeAbiParameters(
            allocator,
            non_indexed_params.items,
            log.data,
        );
        defer decoded.deinit();
        
        // Copy values to our result maps
        var it = decoded.iterator();
        while (it.next()) |entry| {
            const value = try allocator.dupe(u8, entry.value_ptr.*);
            try result.non_indexed_args.put(entry.key_ptr.*, value);
            try result.args.put(entry.key_ptr.*, value);
        }
    }
    
    return result;
}

/// Tests for event topic encoding
test "encodeEventTopics basic" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Define ABI items for a sample contract
    const abi_items = [_]abi.AbiItem{
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
    
    // Test encoding event topics with values
    var indexed_values = std.StringHashMap(?[]const u8).init(alloc);
    defer indexed_values.deinit();
    
    // From address: 0x1234567890123456789012345678901234567890
    const from_addr = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    try indexed_values.put("from", &from_addr);
    
    // To address: null (wildcard)
    try indexed_values.put("to", null);
    
    const topics = try encodeEventTopics(alloc, &abi_items, "Transfer", indexed_values);
    defer topics.deinit();
    
    // Verify that we have 3 topics: event signature, from address, wildcard
    try testing.expectEqual(@as(usize, 3), topics.items.len);
    
    // First topic should be the Transfer event signature hash
    // Expected: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
    const expected_topic0 = [_]u8{
        0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
        0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
        0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
        0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
    };
    try testing.expectEqualSlices(u8, &expected_topic0, &topics.items[0]);
    
    // Second topic should be the from address (right-aligned)
    // The address should be in the last 20 bytes
    var expected_topic1: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, expected_topic1[32 - from_addr.len..], &from_addr);
    try testing.expectEqualSlices(u8, &expected_topic1, &topics.items[1]);
    
    // Third topic should be zeroes (wildcard)
    const expected_topic2 = [_]u8{0} ** 32;
    try testing.expectEqualSlices(u8, &expected_topic2, &topics.items[2]);
}

test "decodeEventLog basic" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Define ABI items for a sample contract
    const abi_items = [_]abi.AbiItem{
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
    
    // Create a sample log
    var log = Log{
        .block_hash = [_]u8{1} ** 32,
        .block_number = 12345,
        .address = [_]u8{2} ** 20,
        .transaction_hash = [_]u8{3} ** 32,
        .transaction_index = 0,
        .log_index = 0,
        .topics = std.ArrayList([32]u8).init(alloc),
        .data = &[_]u8{},
        .removed = false,
    };
    defer log.topics.deinit();
    
    // Add topics
    // Topic 0: Transfer event signature
    // Expected: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
    const topic0 = [_]u8{
        0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
        0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
        0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
        0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
    };
    try log.topics.append(topic0);
    
    // Topic 1: From address (right-aligned)
    const from_addr = [_]u8{0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11};
    var topic1: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, topic1[32 - from_addr.len..], &from_addr);
    try log.topics.append(topic1);
    
    // Topic 2: To address (right-aligned)
    const to_addr = [_]u8{0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22};
    var topic2: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, topic2[32 - to_addr.len..], &to_addr);
    try log.topics.append(topic2);
    
    // Data: Encoded value parameter (1000000000000000000)
    // Encode a uint256 value
    const value = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00}; // 1 ETH
    var value_data = [_]u8{0} ** 32;
    std.mem.copy(u8, value_data[32 - value.len..], &value);
    log.data = &value_data;
    
    // Decode the log
    const decoded = try decodeEventLog(alloc, &abi_items, log);
    defer {
        decoded.indexed_args.deinit();
        decoded.non_indexed_args.deinit();
        decoded.args.deinit();
    }
    
    // Check event name
    try testing.expectEqualStrings("Transfer", decoded.name);
    
    // Check indexed arguments
    try testing.expect(decoded.indexed_args.contains("from"));
    try testing.expect(decoded.indexed_args.contains("to"));
    
    // Check non-indexed arguments
    try testing.expect(decoded.non_indexed_args.contains("value"));
    
    // Check all arguments
    try testing.expect(decoded.args.contains("from"));
    try testing.expect(decoded.args.contains("to"));
    try testing.expect(decoded.args.contains("value"));
    
    // Check values (just verifying they exist - proper decoding would need more work)
    const from_value = decoded.args.get("from").?;
    const to_value = decoded.args.get("to").?;
    const value_value = decoded.args.get("value").?;
    
    try testing.expectEqual(@as(usize, 32), from_value.len);
    try testing.expectEqual(@as(usize, 32), to_value.len);
    try testing.expectEqual(@as(usize, 32), value_value.len);
}