const std = @import("std");
const rlp = @import("rlp.zig");
const testing = std.testing;

test "RLP encode/decode single byte" {
    const allocator = testing.allocator;
    
    const single_byte = "a";
    const encoded = try rlp.encode(allocator, single_byte);
    defer allocator.free(encoded);
    
    try testing.expectEqualSlices(u8, &[_]u8{'a'}, encoded);
    
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, single_byte, str),
        .List => unreachable,
    }
}

test "RLP encode/decode string" {
    const allocator = testing.allocator;
    
    const test_str = "dog";
    const encoded = try rlp.encode(allocator, test_str);
    defer allocator.free(encoded);
    
    try testing.expectEqual(@as(usize, 4), encoded.len);
    try testing.expectEqual(@as(u8, 131), encoded[0]);
    try testing.expectEqual(@as(u8, 'd'), encoded[1]);
    try testing.expectEqual(@as(u8, 'o'), encoded[2]);
    try testing.expectEqual(@as(u8, 'g'), encoded[3]);
    
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, test_str, str),
        .List => unreachable,
    }
}

test "RLP encode/decode long string" {
    const allocator = testing.allocator;
    
    const long_str = "zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss";
    const encoded = try rlp.encode(allocator, long_str);
    defer allocator.free(encoded);
    
    try testing.expectEqual(@as(usize, 72), encoded.len);
    try testing.expectEqual(@as(u8, 184), encoded[0]);
    try testing.expectEqual(@as(u8, 70), encoded[1]);
    
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, long_str, str),
        .List => unreachable,
    }
}

test "RLP encode/decode list" {
    const allocator = testing.allocator;
    
    // Create a simple list of strings
    var encoded_items = std.ArrayList([]u8).init(allocator);
    defer {
        for (encoded_items.items) |item| {
            allocator.free(item);
        }
        encoded_items.deinit();
    }
    
    const items = [_][]const u8{ "dog", "god", "cat" };
    for (items) |item| {
        const encoded_item = try rlp.encode(allocator, item);
        try encoded_items.append(encoded_item);
    }
    
    const encoded = try rlp.encode(allocator, encoded_items.items);
    defer allocator.free(encoded);
    
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .List => |list| {
            try testing.expectEqual(@as(usize, 3), list.len);
            for (list, 0..) |item, i| {
                switch (item) {
                    .String => |str| try testing.expectEqualSlices(u8, items[i], str),
                    .List => unreachable,
                }
            }
        },
        .String => unreachable,
    }
}

test "RLP encode/decode nested lists" {
    const allocator = testing.allocator;
    
    // Create a nested list structure like [[[]]]
    var level1 = std.ArrayList([]u8).init(allocator);
    defer {
        for (level1.items) |item| {
            allocator.free(item);
        }
        level1.deinit();
    }
    
    // Empty list []
    const empty_list = try rlp.encode(allocator, &[_][]const u8{});
    try level1.append(empty_list);
    
    // List containing empty list [[]]
    var level2 = std.ArrayList([]u8).init(allocator);
    defer {
        for (level2.items) |item| {
            allocator.free(item);
        }
        level2.deinit();
    }
    
    const list_with_empty = try rlp.encode(allocator, level1.items);
    try level2.append(list_with_empty);
    
    // Final list [[[]]]
    const final_list = try rlp.encode(allocator, level2.items);
    defer allocator.free(final_list);
    
    try testing.expectEqualSlices(u8, &[_]u8{ 0xc1, 0xc1, 0xc0 }, final_list);
    
    // Now decode and verify the structure
    const decoded = try rlp.decode(allocator, final_list, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .List => |outer| {
            try testing.expectEqual(@as(usize, 1), outer.len);
            switch (outer[0]) {
                .List => |middle| {
                    try testing.expectEqual(@as(usize, 1), middle.len);
                    switch (middle[0]) {
                        .List => |inner| {
                            try testing.expectEqual(@as(usize, 0), inner.len);
                        },
                        .String => unreachable,
                    }
                },
                .String => unreachable,
            }
        },
        .String => unreachable,
    }
}

test "RLP encode/decode integers" {
    const allocator = testing.allocator;
    
    // Test small integer (fits in single byte)
    {
        const value: u8 = 15;
        const encoded = try rlp.encode(allocator, value);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 1), encoded.len);
        try testing.expectEqual(value, encoded[0]);
        
        const decoded = try rlp.decode(allocator, encoded, false);
        defer decoded.data.deinit(allocator);
        
        switch (decoded.data) {
            .String => |str| {
                try testing.expectEqual(@as(usize, 1), str.len);
                try testing.expectEqual(value, str[0]);
            },
            .List => unreachable,
        }
    }
    
    // Test larger integer
    {
        const value: u16 = 1024;
        const encoded = try rlp.encode(allocator, value);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 3), encoded.len);
        try testing.expectEqual(@as(u8, 130), encoded[0]);
        try testing.expectEqual(@as(u8, 4), encoded[1]);
        try testing.expectEqual(@as(u8, 0), encoded[2]);
        
        const decoded = try rlp.decode(allocator, encoded, false);
        defer decoded.data.deinit(allocator);
        
        switch (decoded.data) {
            .String => |str| {
                try testing.expectEqual(@as(usize, 2), str.len);
                try testing.expectEqual(@as(u8, 4), str[0]);
                try testing.expectEqual(@as(u8, 0), str[1]);
            },
            .List => unreachable,
        }
    }
    
    // Test zero
    {
        const value: u8 = 0;
        const encoded = try rlp.encode(allocator, value);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 1), encoded.len);
        try testing.expectEqual(@as(u8, 0x80), encoded[0]);
        
        const decoded = try rlp.decode(allocator, encoded, false);
        defer decoded.data.deinit(allocator);
        
        switch (decoded.data) {
            .String => |str| try testing.expectEqual(@as(usize, 0), str.len),
            .List => unreachable,
        }
    }
}

test "RLP stream decoding" {
    const allocator = testing.allocator;
    
    // Create a sequence of different encoded values
    const encoded_byte = try rlp.encode(allocator, "a");
    defer allocator.free(encoded_byte);
    
    const encoded_string = try rlp.encode(allocator, "dog");
    defer allocator.free(encoded_string);
    
    const long_string = "This is a long string that will trigger long string encoding";
    const encoded_long_string = try rlp.encode(allocator, long_string);
    defer allocator.free(encoded_long_string);
    
    // Integer array
    const encoded_list = try rlp.encode(allocator, [_]u8{ 1, 2, 3 });
    defer allocator.free(encoded_list);
    
    // Concatenate all encoded items to create a stream
    const arrays = [_][]const u8{ encoded_byte, encoded_string, encoded_long_string, encoded_list };
    const stream = try rlp.concatBytes(allocator, &arrays);
    defer allocator.free(stream);
    
    // Decode the stream one item at a time
    var remaining = stream;
    
    // First item - "a"
    var decoded = try rlp.decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, "a", str),
        .List => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Second item - "dog"
    decoded = try rlp.decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, "dog", str),
        .List => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Third item - long string
    decoded = try rlp.decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, long_string, str),
        .List => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Fourth item - list [1, 2, 3]
    decoded = try rlp.decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .List => |list| {
            try testing.expectEqual(@as(usize, 3), list.len);
            for (0..3) |i| {
                switch (list[i]) {
                    .String => |str| {
                        try testing.expectEqual(@as(usize, 1), str.len);
                        try testing.expectEqual(@as(u8, @intCast(i + 1)), str[0]);
                    },
                    .List => unreachable,
                }
            }
        },
        .String => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Verify all data was consumed
    try testing.expectEqual(@as(usize, 0), remaining.len);
}

test "RLP error handling - non-canonical encoding" {
    const allocator = testing.allocator;
    
    // Test case: single byte < 0x80 encoded with string prefix
    const invalid_encoding = [_]u8{ 0x81, 0x05 };
    
    // This should fail because 5 should be encoded as just 0x05, not 0x8105
    try testing.expectError(
        rlp.RlpError.NonCanonicalSize,
        rlp.decode(allocator, &invalid_encoding, false)
    );
}

test "RLP error handling - remainder in non-stream mode" {
    const allocator = testing.allocator;
    
    // Encode "a", but append an extra byte
    const encoded = try rlp.encode(allocator, "a");
    defer allocator.free(encoded);
    
    var with_remainder = try allocator.alloc(u8, encoded.len + 1);
    defer allocator.free(with_remainder);
    
    @memcpy(with_remainder[0..encoded.len], encoded);
    with_remainder[encoded.len] = 0x01;
    
    // This should fail in non-stream mode because there is a remainder
    try testing.expectError(
        rlp.RlpError.InvalidRemainder,
        rlp.decode(allocator, with_remainder, false)
    );
    
    // But it should succeed in stream mode
    const decoded = try rlp.decode(allocator, with_remainder, true);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, "a", str),
        .List => unreachable,
    }
    
    try testing.expectEqual(@as(usize, 1), decoded.remainder.len);
    try testing.expectEqual(@as(u8, 0x01), decoded.remainder[0]);
}

test "RLP error handling - input too short" {
    const allocator = testing.allocator;
    
    // Create an invalid RLP string where the length prefix indicates more data than available
    const invalid_data = [_]u8{ 0x83, 'd', 'o' }; // Prefix says 3 bytes, but only 2 follow
    
    try testing.expectError(
        rlp.RlpError.InputTooShort,
        rlp.decode(allocator, &invalid_data, false)
    );
}

test "Official Ethereum test cases" {
    const allocator = testing.allocator;
    
    // Test case: empty string
    {
        const empty_string = "";
        const encoded = try rlp.encode(allocator, empty_string);
        defer allocator.free(encoded);
        
        try testing.expectEqualSlices(u8, &[_]u8{0x80}, encoded);
    }
    
    // Test case: single character below 0x80
    {
        const dog_string = "d";
        const encoded = try rlp.encode(allocator, dog_string);
        defer allocator.free(encoded);
        
        try testing.expectEqualSlices(u8, &[_]u8{'d'}, encoded);
    }
    
    // Test case: simple string
    {
        const dog_string = "dog";
        const encoded = try rlp.encode(allocator, dog_string);
        defer allocator.free(encoded);
        
        const expected = [_]u8{ 0x83, 'd', 'o', 'g' };
        try testing.expectEqualSlices(u8, &expected, encoded);
    }
    
    // Test case: empty list
    {
        const empty_list = [_][]const u8{};
        const encoded = try rlp.encode(allocator, empty_list);
        defer allocator.free(encoded);
        
        try testing.expectEqualSlices(u8, &[_]u8{0xc0}, encoded);
    }
    
    // Test case: list with empty string
    {
        var list = std.ArrayList([]u8).init(allocator);
        defer {
            for (list.items) |item| {
                allocator.free(item);
            }
            list.deinit();
        }
        
        const empty_string_encoded = try rlp.encode(allocator, "");
        try list.append(empty_string_encoded);
        
        const encoded = try rlp.encode(allocator, list.items);
        defer allocator.free(encoded);
        
        try testing.expectEqualSlices(u8, &[_]u8{ 0xc1, 0x80 }, encoded);
    }
    
    // Test case: list with multiple strings
    {
        const string1 = "cat";
        const string2 = "dog";
        
        var list = std.ArrayList([]u8).init(allocator);
        defer {
            for (list.items) |item| {
                allocator.free(item);
            }
            list.deinit();
        }
        
        const string1_encoded = try rlp.encode(allocator, string1);
        try list.append(string1_encoded);
        
        const string2_encoded = try rlp.encode(allocator, string2);
        try list.append(string2_encoded);
        
        const encoded = try rlp.encode(allocator, list.items);
        defer allocator.free(encoded);
        
        const expected = [_]u8{ 0xc8, 0x83, 'c', 'a', 't', 0x83, 'd', 'o', 'g' };
        try testing.expectEqualSlices(u8, &expected, encoded);
    }
}

// Example test for handling invalid inputs - testing error cases
test "RLP handling of invalid inputs" {
    const allocator = testing.allocator;
    
    // Short length prefix but not enough data
    const short_data = [_]u8{ 0x83, 'a', 'b' };
    try testing.expectError(
        rlp.RlpError.InputTooShort,
        rlp.decode(allocator, &short_data, false)
    );
    
    // Long length prefix with leading zero (invalid)
    const leading_zeros = [_]u8{ 0xb9, 0x00, 0x01 };
    try testing.expectError(
        rlp.RlpError.LeadingZeros,
        rlp.decode(allocator, &leading_zeros, false)
    );
    
    // Non-canonical representation for string length
    const non_canonical = [_]u8{ 0xb8, 0x02, 'a', 'b' };
    try testing.expectError(
        rlp.RlpError.NonCanonicalSize,
        rlp.decode(allocator, &non_canonical, false)
    );
}