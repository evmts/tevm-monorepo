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
    BufferTooSmall,
    BufferFull,
    TooManyParameters,
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
    topics: []const [32]u8,
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
/// out_topics: Pre-allocated array to store the topics
/// abi_items: Array of ABI items representing contract interface
/// event_name: Name of the event
/// indexed_values: HashMap of indexed parameter values by name (can be null for wildcards)
///
/// Returns the number of topics written to out_topics
pub fn encodeEventTopics(
    out_topics: [][32]u8,
    abi_items: []const abi.AbiItem,
    event_name: []const u8,
    indexed_values: ?std.StringHashMap(?[]const u8),
) !usize {
    // Find the event in the ABI
    const event = get_abi_item.getEvent(abi_items, event_name) catch {
        return EventHandlingError.EventNotFound;
    };
    
    return encodeEventTopicsWithEvent(out_topics, event, indexed_values);
}

/// Encodes event topics for a specific event ABI definition
///
/// out_topics: Pre-allocated array to store the topics
/// event: ABI event definition
/// indexed_values: HashMap of indexed parameter values by name (can be null for wildcards)
///
/// Returns the number of topics written to out_topics
pub fn encodeEventTopicsWithEvent(
    out_topics: [][32]u8,
    event: abi.Event,
    indexed_values: ?std.StringHashMap(?[]const u8),
) !usize {
    // Count number of topics needed
    const topic_count = if (event.anonymous) 0 else 1;
    var indexed_count: usize = 0;
    
    for (event.inputs) |param| {
        if (param.indexed) {
            indexed_count += 1;
        }
    }
    
    const total_topics = topic_count + indexed_count;
    
    // Check if we have enough space in the output array
    if (out_topics.len < total_topics) {
        return EventHandlingError.BufferTooSmall;
    }
    
    var topic_index: usize = 0;
    
    // First topic is the event signature hash (unless anonymous)
    if (!event.anonymous) {
        try compute_function_selector.getEventTopic(event, &out_topics[topic_index]);
        topic_index += 1;
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
                        try encodeParameterAsTopic(param, value_opt.?.?, &out_topics[topic_index]);
                        topic_value = out_topics[topic_index];
                    }
                    // else: value is explicitly null (wildcard)
                }
                // else: parameter not provided (wildcard)
            }
            
            // If no value was provided or it was null, use a zero topic as wildcard
            if (topic_value == null) {
                std.mem.set(u8, &out_topics[topic_index], 0);
            }
            
            topic_index += 1;
        }
    }
    
    return topic_index;
}

/// Encode a parameter value as a 32-byte topic
///
/// param: Parameter definition
/// value: Value to encode
/// out_topic: Pre-allocated 32-byte array to store the result
pub fn encodeParameterAsTopic(
    param: abi.EventParam,
    value: []const u8,
    out_topic: *[32]u8,
) !void {
    // Special handling for dynamic types when indexed
    if (std.mem.eql(u8, param.ty, "string") or 
        std.mem.eql(u8, param.ty, "bytes") or
        param.components.len > 0) {
        // For dynamic types, indexed parameters are hashed
        const hash = abi.keccak256(value);
        std.mem.copy(u8, out_topic, &hash);
    } else {
        // For static types, just pad to 32 bytes
        std.mem.set(u8, out_topic, 0); // Zero out the buffer
        
        // If value is longer than 32 bytes, truncate
        const copy_len = @minimum(value.len, 32);
        
        if (std.mem.startsWith(u8, param.ty, "uint") or
            std.mem.startsWith(u8, param.ty, "int")) {
            // Numbers are right-aligned
            std.mem.copy(u8, out_topic[32 - copy_len..], value[0..copy_len]);
        } else if (std.mem.eql(u8, param.ty, "address")) {
            // Addresses are right-aligned, but padded to 20 bytes
            const addr_len = @minimum(value.len, 20);
            std.mem.copy(u8, out_topic[32 - addr_len..], value[0..addr_len]);
        } else {
            // Other types are left-aligned
            std.mem.copy(u8, out_topic[0..copy_len], value[0..copy_len]);
        }
    }
}

/// Decodes an event log into event name and parameter values
///
/// abi_items: Array of ABI items representing contract interface
/// log: Event log data
/// result: Pre-initialized DecodedEvent to store the result
///
/// Populates the result with event name and decoded arguments
pub fn decodeEventLog(
    abi_items: []const abi.AbiItem,
    log: Log,
    result: *DecodedEvent,
) !void {
    if (log.topics.len == 0) {
        return EventHandlingError.MissingTopics;
    }
    
    // First topic is the event signature hash (unless anonymous)
    const topic_hash = log.topics[0];
    
    // Find matching event in the ABI
    var event_opt: ?abi.Event = null;
    
    // Try to find by topic hash
    for (abi_items) |item| {
        switch (item) {
            .Event => |event| {
                if (event.anonymous) {
                    // For anonymous events, we need to check arguments
                    // This is complex and would require matching indexed parameters
                    continue;
                }
                
                var event_topic: [32]u8 = undefined;
                compute_function_selector.getEventTopic(event, &event_topic) catch continue;
                
                if (std.mem.eql(u8, &topic_hash, &event_topic)) {
                    event_opt = event;
                    result.name = event.name;
                    break;
                }
            },
            else => continue,
        }
    }
    
    if (event_opt == null) {
        return EventHandlingError.EventNotFound;
    }
    
    try decodeEventLogWithEvent(event_opt.?, log, result);
}

/// Decodes an event log using a specific event ABI definition
///
/// event: ABI event definition
/// log: Event log data
/// result: Pre-initialized DecodedEvent to store the result
///
/// Populates the result with decoded arguments
pub fn decodeEventLogWithEvent(
    event: abi.Event,
    log: Log,
    result: *DecodedEvent,
) !void {
    // Set the name in the result
    result.name = event.name;
    
    // Check if we have enough topics
    const expected_topics = if (event.anonymous) 0 else 1;
    var indexed_count: usize = 0;
    
    for (event.inputs) |param| {
        if (param.indexed) {
            indexed_count += 1;
        }
    }
    
    if (log.topics.len < expected_topics + indexed_count) {
        return EventHandlingError.InvalidTopicData;
    }
    
    // Process indexed parameters
    var topic_index = if (event.anonymous) 0 else 1;
    var non_indexed_params = std.ArrayList(abi.Param).init(std.heap.page_allocator);
    defer non_indexed_params.deinit();
    
    for (event.inputs) |param| {
        if (param.indexed) {
            // Get the topic value
            const topic = log.topics[topic_index];
            topic_index += 1;
            
            // For indexed parameters, just store the topic value
            try result.indexed_args.put(param.name, &topic);
            try result.args.put(param.name, &topic);
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
        try decode_abi_parameters.decodeAbiParameters(
            &result.non_indexed_args,
            non_indexed_params.items,
            log.data,
        );
        
        // Copy non-indexed values to the main args map
        var it = result.non_indexed_args.iterator();
        while (it.next()) |entry| {
            try result.args.put(entry.key_ptr.*, entry.value_ptr.*);
        }
    }
}

/// Tests for event topic encoding
test "encodeEventTopics basic" {
    const testing = std.testing;
    
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
    var indexed_values = std.StringHashMap(?[]const u8).init(testing.allocator);
    defer indexed_values.deinit();
    
    // From address: 0x1234567890123456789012345678901234567890
    const from_addr = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    try indexed_values.put("from", &from_addr);
    
    // To address: null (wildcard)
    try indexed_values.put("to", null);
    
    // Allocate space for topics
    var topics: [3][32]u8 = undefined;
    
    const topic_count = try encodeEventTopics(&topics, &abi_items, "Transfer", indexed_values);
    
    // Verify that we have 3 topics: event signature, from address, wildcard
    try testing.expectEqual(@as(usize, 3), topic_count);
    
    // First topic should be the Transfer event signature hash
    // Expected: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
    const expected_topic0 = [_]u8{
        0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
        0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
        0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
        0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
    };
    try testing.expectEqualSlices(u8, &expected_topic0, &topics[0]);
    
    // Second topic should be the from address (right-aligned)
    // The address should be in the last 20 bytes
    var expected_topic1: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, expected_topic1[32 - from_addr.len..], &from_addr);
    try testing.expectEqualSlices(u8, &expected_topic1, &topics[1]);
    
    // Third topic should be zeroes (wildcard)
    const expected_topic2 = [_]u8{0} ** 32;
    try testing.expectEqualSlices(u8, &expected_topic2, &topics[2]);
}

test "decodeEventLog basic" {
    const testing = std.testing;
    
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
    
    // Add topics
    const topic0 = [_]u8{
        0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
        0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
        0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
        0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
    };
    
    // From address
    const from_addr = [_]u8{0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11};
    var topic1: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, topic1[32 - from_addr.len..], &from_addr);
    
    // To address
    const to_addr = [_]u8{0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22};
    var topic2: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, topic2[32 - to_addr.len..], &to_addr);
    
    // Create a sample log
    const topics = [_][32]u8{topic0, topic1, topic2};
    
    // Add value data for the non-indexed parameter
    const value = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00}; // 1 ETH
    var value_data: [32]u8 = [_]u8{0} ** 32;
    std.mem.copy(u8, value_data[32 - value.len..], &value);
    
    const log = Log{
        .block_hash = [_]u8{1} ** 32,
        .block_number = 12345,
        .address = [_]u8{2} ** 20,
        .transaction_hash = [_]u8{3} ** 32,
        .transaction_index = 0,
        .log_index = 0,
        .topics = &topics,
        .data = &value_data,
        .removed = false,
    };
    
    // Initialize the result structures
    var indexed_args = std.StringHashMap([]const u8).init(testing.allocator);
    defer indexed_args.deinit();
    
    var non_indexed_args = std.StringHashMap([]const u8).init(testing.allocator);
    defer non_indexed_args.deinit();
    
    var args = std.StringHashMap([]const u8).init(testing.allocator);
    defer args.deinit();
    
    var decoded = DecodedEvent{
        .name = "",
        .indexed_args = indexed_args,
        .non_indexed_args = non_indexed_args,
        .args = args,
    };
    
    // Decode the log
    try decodeEventLog(&abi_items, log, &decoded);
    
    // Verify the decoded data
    try testing.expectEqualStrings("Transfer", decoded.name);
    try testing.expect(decoded.indexed_args.contains("from"));
    try testing.expect(decoded.indexed_args.contains("to"));
    try testing.expect(decoded.non_indexed_args.contains("value"));
    try testing.expect(decoded.args.contains("from"));
    try testing.expect(decoded.args.contains("to"));
    try testing.expect(decoded.args.contains("value"));
}