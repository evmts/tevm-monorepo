const std = @import("std");
const abi = @import("abi.zig");
const decode_abi_parameters = @import("decode_abi_parameters.zig");
const encode_abi_parameters = @import("encode_abi_parameters.zig");
const encode_function_data = @import("encode_function_data.zig");
const decode_function_data = @import("decode_function_data.zig");
const compute_function_selector = @import("compute_function_selector.zig");
const get_abi_item = @import("get_abi_item.zig");
const function_result = @import("function_result.zig");
const event_handling = @import("event_handling.zig");
const parse_abi_item = @import("parse_abi_item.zig");

test "ABI basic round trip encoding/decoding" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Create a sample ABI with multiple functions and events
    const sample_abi = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = @constCast(&[_]abi.Param{
                    .{
                        .ty = "address",
                        .name = "to",
                        .components = &.{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "uint256",
                        .name = "amount",
                        .components = &.{},
                        .internal_type = null,
                    },
                }),
                .outputs = @as([]abi.Param, @constCast(&[_]abi.Param{
                    .{
                        .ty = "bool",
                        .name = "success",
                        .components = &.{},
                        .internal_type = null,
                    },
                })),
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
        .{
            .Event = .{
                .name = "Transfer",
                .inputs = @as([]abi.EventParam, @constCast(&[_]abi.EventParam{
                    .{
                        .ty = "address",
                        .name = "from",
                        .indexed = true,
                        .components = &.{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "address",
                        .name = "to",
                        .indexed = true,
                        .components = &.{},
                        .internal_type = null,
                    },
                    .{
                        .ty = "uint256",
                        .name = "value",
                        .indexed = false,
                        .components = &.{},
                        .internal_type = null,
                    },
                })),
                .anonymous = false,
            },
        },
    };
    
    // 1. Test function encoding and decoding
    {
        // Set up arguments
        var args = std.StringHashMap([]const u8).init(alloc);
        defer args.deinit();
        
        // Address: 0x1234567890123456789012345678901234567890
        const to_address = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
        try args.put("to", &to_address);
        
        // Amount: 1000000000000000000 (1 ETH)
        const amount = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00};
        try args.put("amount", &amount);
        
        // Encode function call data
        var buffer: [1024]u8 = undefined;
        const encoded_len = try encode_function_data.encodeFunctionData(&buffer, &sample_abi, "transfer", args);
        const encoded = buffer[0..encoded_len];
        
        // Verify the encoded data starts with the right selector
        try testing.expectEqual(@as(usize, 68), encoded.len); // 4 bytes selector + 2*32 byte arguments
        
        // Expected selector for transfer(address,uint256): 0xa9059cbb
        try testing.expectEqual(@as(u8, 0xa9), encoded[0]);
        try testing.expectEqual(@as(u8, 0x05), encoded[1]);
        try testing.expectEqual(@as(u8, 0x9c), encoded[2]);
        try testing.expectEqual(@as(u8, 0xbb), encoded[3]);
        
        // Now decode the function call data
        var decoded = decode_function_data.DecodeFunctionDataResult{
            .function_name = undefined,
            .args = std.StringHashMap([]const u8).init(alloc),
        };
        defer decoded.args.deinit();
        try decode_function_data.decodeFunctionData(&sample_abi, encoded, &decoded);
        
        // Check that we got the right function name and arguments
        try testing.expectEqualStrings("transfer", decoded.function_name);
        try testing.expect(decoded.args.contains("to"));
        try testing.expect(decoded.args.contains("amount"));
        
        // Check the decoded values
        const decoded_to = decoded.args.get("to").?;
        try testing.expectEqual(@as(usize, 32), decoded_to.len);
        try testing.expectEqualSlices(u8, &to_address, decoded_to[32 - to_address.len..]);
        
        const decoded_amount = decoded.args.get("amount").?;
        try testing.expectEqual(@as(usize, 32), decoded_amount.len);
        try testing.expectEqualSlices(u8, &amount, decoded_amount[32 - amount.len..]);
    }
    
    // 2. Test function result encoding and decoding
    {
        // Set up result values
        var result_values = std.StringHashMap([]const u8).init(alloc);
        defer result_values.deinit();
        
        // Boolean: true
        const success = [_]u8{1};
        try result_values.put("success", &success);
        
        // Encode function result
        var result_buffer: [1024]u8 = undefined;
        const result_len = try function_result.encodeFunctionResult(&result_buffer, &sample_abi, "transfer", result_values);
        const encoded_result = result_buffer[0..result_len];
        
        // Verify the encoded result
        try testing.expectEqual(@as(usize, 32), encoded_result.len); // 1 boolean padded to 32 bytes
        
        // Decode function result
        var decoded_result = std.StringHashMap([]const u8).init(alloc);
        defer decoded_result.deinit();
        try function_result.decodeFunctionResult(&sample_abi, "transfer", encoded_result, &decoded_result);
        
        // Verify decoded result
        try testing.expect(decoded_result.contains("success"));
        const decoded_success = decoded_result.get("success").?;
        try testing.expectEqual(@as(usize, 32), decoded_success.len);
        try testing.expectEqual(@as(u8, 1), decoded_success[31]); // Boolean is right-aligned
    }
    
    // 3. Test event topic encoding
    {
        // Set up indexed values for filtering
        var indexed_values = std.StringHashMap(?[]const u8).init(alloc);
        defer indexed_values.deinit();
        
        // From address: 0x1234567890123456789012345678901234567890
        const from_addr = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
        try indexed_values.put("from", &from_addr);
        
        // To address: wildcard (null)
        try indexed_values.put("to", null);
        
        // Encode event topics
        var topics: [4][32]u8 = undefined;
        const num_topics = try event_handling.encodeEventTopics(&topics, &sample_abi, "Transfer", indexed_values);
        
        // Check that we have 3 topics: event signature hash, from address, wildcard
        try testing.expectEqual(@as(usize, 3), num_topics);
        
        // Expected topic0 for Transfer(address,address,uint256): 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
        const expected_topic0 = [_]u8{
            0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
            0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
            0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
            0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
        };
        try testing.expectEqualSlices(u8, &expected_topic0, &topics.items[0]);
        
        // Test topic with the from address
        var expected_topic1: [32]u8 = [_]u8{0} ** 32;
        std.mem.copy(u8, expected_topic1[32 - from_addr.len..], &from_addr);
        try testing.expectEqualSlices(u8, &expected_topic1, &topics.items[1]);
        
        // Test wildcard topic
        const expected_topic2 = [_]u8{0} ** 32;
        try testing.expectEqualSlices(u8, &expected_topic2, &topics.items[2]);
    }
    
    // 4. Test event log decoding
    {
        // Create a sample log
        var log = event_handling.Log{
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
        const topic0 = [_]u8{
            0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
            0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
            0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
            0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
        };
        try log.topics.append(topic0);
        
        // From address
        const from_addr = [_]u8{0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11};
        var topic1: [32]u8 = [_]u8{0} ** 32;
        std.mem.copy(u8, topic1[32 - from_addr.len..], &from_addr);
        try log.topics.append(topic1);
        
        // To address
        const to_addr = [_]u8{0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22};
        var topic2: [32]u8 = [_]u8{0} ** 32;
        std.mem.copy(u8, topic2[32 - to_addr.len..], &to_addr);
        try log.topics.append(topic2);
        
        // Add value data for the non-indexed parameter
        const value = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00}; // 1 ETH
        var value_data = [_]u8{0} ** 32;
        std.mem.copy(u8, value_data[32 - value.len..], &value);
        log.data = &value_data;
        
        // Decode the log
        const decoded = try event_handling.decodeEventLog(alloc, &sample_abi, log);
        defer {
            decoded.indexed_args.deinit();
            decoded.non_indexed_args.deinit();
            decoded.args.deinit();
        }
        
        // Verify the decoded data
        try testing.expectEqualStrings("Transfer", decoded.name);
        try testing.expect(decoded.indexed_args.contains("from"));
        try testing.expect(decoded.indexed_args.contains("to"));
        try testing.expect(decoded.non_indexed_args.contains("value"));
        try testing.expect(decoded.args.contains("from"));
        try testing.expect(decoded.args.contains("to"));
        try testing.expect(decoded.args.contains("value"));
    }
    
    // 5. Test ABI item parsing
    {
        const sig = "function transfer(address to, uint256 amount) returns (bool)";
        const item = try parse_abi_item.parseAbiItem(alloc, sig);
        
        switch (item) {
            .Function => |func| {
                try testing.expectEqualStrings("transfer", func.name);
                try testing.expectEqual(@as(usize, 2), func.inputs.len);
                try testing.expectEqualStrings("address", func.inputs[0].ty);
                try testing.expectEqualStrings("to", func.inputs[0].name);
                try testing.expectEqualStrings("uint256", func.inputs[1].ty);
                try testing.expectEqualStrings("amount", func.inputs[1].name);
                try testing.expectEqual(@as(usize, 1), func.outputs.len);
                try testing.expectEqualStrings("bool", func.outputs[0].ty);
            },
            else => {
                try testing.expect(false); // Shouldn't happen
            },
        }
    }
}

test "ABI complex types and edge cases" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // 1. Test function and event selectors
    {
        // Function selector for transfer(address,uint256)
        const transfer_sig = "transfer(address,uint256)";
        var transfer_selector: [4]u8 = undefined;
        compute_function_selector.computeFunctionSelector(transfer_sig, &transfer_selector);
        
        // Expected: 0xa9059cbb
        const expected_transfer = [_]u8{0xa9, 0x05, 0x9c, 0xbb};
        try testing.expectEqualSlices(u8, &expected_transfer, &transfer_selector);
        
        // Event topic for Transfer(address,address,uint256)
        const transfer_event_sig = "Transfer(address,address,uint256)";
        var transfer_topic: [32]u8 = undefined;
        compute_function_selector.computeEventTopic(transfer_event_sig, &transfer_topic);
        
        // Expected: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
        const expected_topic = [_]u8{
            0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
            0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
            0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
            0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
        };
        try testing.expectEqualSlices(u8, &expected_topic, &transfer_topic);
    }
    
    // 2. Test getAbiItem
    {
        // Define a sample ABI with multiple items
        const sample_abi = [_]abi.AbiItem{
            .{
                .Function = .{
                    .name = "transfer",
                    .inputs = @constCast(&[_]abi.Param{
                        .{
                            .ty = "address",
                            .name = "to",
                            .components = &.{},
                            .internal_type = null,
                        },
                        .{
                            .ty = "uint256",
                            .name = "amount",
                            .components = &.{},
                            .internal_type = null,
                        },
                    }),
                    .outputs = @as([]abi.Param, @constCast(&[_]abi.Param{
                        .{
                            .ty = "bool",
                            .name = "success",
                            .components = &.{},
                            .internal_type = null,
                        },
                    })),
                    .state_mutability = abi.StateMutability.NonPayable,
                },
            },
            .{
                .Function = .{
                    .name = "approve",
                    .inputs = @as([]abi.Param, @constCast(&[_]abi.Param{
                        .{
                            .ty = "address",
                            .name = "spender",
                            .components = &.{},
                            .internal_type = null,
                        },
                        .{
                            .ty = "uint256",
                            .name = "amount",
                            .components = &.{},
                            .internal_type = null,
                        },
                    })),
                    .outputs = @as([]abi.Param, @constCast(&[_]abi.Param{
                        .{
                            .ty = "bool",
                            .name = "success",
                            .components = &.{},
                            .internal_type = null,
                        },
                    })),
                    .state_mutability = abi.StateMutability.NonPayable,
                },
            },
            .{
                .Event = .{
                    .name = "Transfer",
                    .inputs = @as([]abi.EventParam, @constCast(&[_]abi.EventParam{
                        .{
                            .ty = "address",
                            .name = "from",
                            .indexed = true,
                            .components = &.{},
                            .internal_type = null,
                        },
                        .{
                            .ty = "address",
                            .name = "to",
                            .indexed = true,
                            .components = &.{},
                            .internal_type = null,
                        },
                        .{
                            .ty = "uint256",
                            .name = "value",
                            .indexed = false,
                            .components = &.{},
                            .internal_type = null,
                        },
                    })),
                    .anonymous = false,
                },
            },
        };
        
        // Get by name
        const transfer_item = try get_abi_item.getAbiItem(&sample_abi, .{
            .name = "transfer",
        });
        
        switch (transfer_item) {
            .Function => |func| {
                try testing.expectEqualStrings("transfer", func.name);
            },
            else => unreachable,
        }
        
        // Get by event name
        const transfer_event = try get_abi_item.getAbiItem(&sample_abi, .{
            .name = "Transfer",
            .item_type = .Event,
        });
        
        switch (transfer_event) {
            .Event => |event| {
                try testing.expectEqualStrings("Transfer", event.name);
            },
            else => unreachable,
        }
        
        // Get by selector
        const transfer_selector = [_]u8{0xa9, 0x05, 0x9c, 0xbb};
        const transfer_by_selector = try get_abi_item.getAbiItem(&sample_abi, .{
            .selector = &transfer_selector,
        });
        
        switch (transfer_by_selector) {
            .Function => |func| {
                try testing.expectEqualStrings("transfer", func.name);
            },
            else => unreachable,
        }
    }
    
    // 3. Test parseAbi with complex input
    {
        const signatures = [_][]const u8{
            "function transfer(address to, uint256 amount) returns (bool)",
            "function balanceOf(address account) view returns (uint256)",
            "event Transfer(address indexed from, address indexed to, uint256 value)",
            "error InsufficientBalance(address account, uint256 balance, uint256 required)",
        };
        
        const parsed_abi = try parse_abi_item.parseAbi(alloc, &signatures);
        defer alloc.free(parsed_abi);
        
        try testing.expectEqual(@as(usize, 4), parsed_abi.len);
        
        // Check types
        var function_count: usize = 0;
        var event_count: usize = 0;
        var error_count: usize = 0;
        
        for (parsed_abi) |item| {
            switch (item) {
                .Function => function_count += 1,
                .Event => event_count += 1,
                .Error => error_count += 1,
                else => {},
            }
        }
        
        try testing.expectEqual(@as(usize, 2), function_count);
        try testing.expectEqual(@as(usize, 1), event_count);
        try testing.expectEqual(@as(usize, 1), error_count);
    }
}

test "ABI bytecode and value conversions" {
    const testing = std.testing;
    
    // Test keccak256
    {
        const input = "Hello, world!";
        const hash = abi.keccak256(input);
        
        // Expected: 0xacaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f
        const expected = [_]u8{
            0xac, 0xaf, 0x32, 0x89, 0xd7, 0xb6, 0x01, 0xcb,
            0xd1, 0x14, 0xfb, 0x36, 0xc4, 0xd2, 0x9c, 0x85,
            0xbb, 0xfd, 0x5e, 0x13, 0x3f, 0x14, 0xcb, 0x35,
            0x5c, 0x3f, 0xd8, 0xd9, 0x93, 0x67, 0x96, 0x4f,
        };
        try testing.expectEqualSlices(u8, &expected, &hash);
    }
    
    // Test computeSelector
    {
        const input = "transfer(address,uint256)";
        const selector = abi.computeSelector(input);
        
        // Expected: 0xa9059cbb
        const expected = [_]u8{0xa9, 0x05, 0x9c, 0xbb};
        try testing.expectEqualSlices(u8, &expected, &selector);
    }
    
    // Test value conversions in decode_abi_parameters.bytesToValue
    {
        // Test boolean conversion
        const bool_bytes = [_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1};
        var bool_value: bool = undefined;
        try decode_abi_parameters.bytesToValueInPlace(bool, &bool_bytes, &bool_value);
        try testing.expect(bool_value);
        
        // Test uint conversion (simplified)
        const uint_bytes = [_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42};
        var uint_value: u8 = undefined;
        try decode_abi_parameters.bytesToValueInPlace(u8, uint_bytes[31..], &uint_value);
        try testing.expectEqual(@as(u8, 42), uint_value);
    }
}