const std = @import("std");
const hex = @import("Utils").hex;
const Allocator = std.mem.Allocator;

pub const RlpError = error{
    InputTooShort,
    InputTooLong,
    LeadingZeros,
    NonCanonicalSize,
    InvalidLength,
    UnexpectedInput,
    InvalidRemainder,
    ExtraZeros,
};

pub const Decoded = struct {
    data: Data,
    remainder: []const u8,
};

pub const Data = union(enum) {
    List: []Data,
    String: []const u8,

    pub fn deinit(self: Data, allocator: Allocator) void {
        switch (self) {
            .List => |items| {
                for (items) |item| {
                    item.deinit(allocator);
                }
                allocator.free(items);
            },
            .String => |value| {
                // Only free the string if it was allocated
                // For single-byte values, no allocation was done
                if (value.len > 1 or (value.len == 1 and value[0] >= 0x80)) {
                    allocator.free(value);
                }
            },
        }
    }
};

/// Encodes input into RLP format according to the Ethereum RLP specification.
/// The input can be a slice of bytes or a list of other RLP encodable items.
/// Allocates memory for the result, which must be freed by the caller.
pub fn encode(allocator: Allocator, input: anytype) ![]u8 {
    const T = @TypeOf(input);
    const info = @typeInfo(T);

    // Handle byte arrays and slices
    if (info == .Array) {
        const child_info = @typeInfo(info.Array.child);
        if (child_info == .Int and child_info.Int.bits == 8) {
            return try encodeBytes(allocator, input);
        }
    } else if (info == .Pointer) {
        const child_info = @typeInfo(info.Pointer.child);
        if (child_info == .Int and child_info.Int.bits == 8) {
            return try encodeBytes(allocator, input);
        }
    }
    
    // Handle lists
    if (info == .Array or info == .Slice) {
        var result = std.ArrayList(u8).init(allocator);
        defer result.deinit();
        
        // First encode each element
        var encoded_items = std.ArrayList([]u8).init(allocator);
        defer {
            for (encoded_items.items) |item| {
                allocator.free(item);
            }
            encoded_items.deinit();
        }
        
        var total_len: usize = 0;
        for (input) |item| {
            const encoded_item = try encode(allocator, item);
            try encoded_items.append(encoded_item);
            total_len += encoded_item.len;
        }
        
        // Calculate header
        if (total_len < 56) {
            try result.append(0xc0 + @as(u8, @intCast(total_len)));
        } else {
            const len_bytes = try encodeLength(allocator, total_len);
            defer allocator.free(len_bytes);
            try result.append(0xf7 + @as(u8, @intCast(len_bytes.len)));
            try result.appendSlice(len_bytes);
        }
        
        // Append encoded items
        for (encoded_items.items) |item| {
            try result.appendSlice(item);
        }
        
        return try result.toOwnedSlice();
    }
    
    // Handle integers
    if (info == .Int) {
        if (input == 0) {
            // Special case: 0 is encoded as empty string
            const result = try allocator.alloc(u8, 1);
            result[0] = 0x80;
            return result;
        }
        
        var bytes = std.ArrayList(u8).init(allocator);
        defer bytes.deinit();
        
        var value = input;
        while (value > 0) {
            try bytes.insert(0, @as(u8, @intCast(value & 0xff)));
            value >>= 8;
        }
        
        return try encodeBytes(allocator, bytes.items);
    }
    
    @compileError("Unsupported type for RLP encoding");
}

/// Encodes a byte array or slice according to RLP rules
fn encodeBytes(allocator: Allocator, bytes: []const u8) ![]u8 {
    // If a single byte less than 0x80, return as is
    if (bytes.len == 1 and bytes[0] < 0x80) {
        const result = try allocator.alloc(u8, 1);
        result[0] = bytes[0];
        return result;
    }
    
    // If string is 0-55 bytes long, return [0x80+len, data]
    if (bytes.len < 56) {
        const result = try allocator.alloc(u8, 1 + bytes.len);
        result[0] = 0x80 + @as(u8, @intCast(bytes.len));
        std.mem.copy(u8, result[1..], bytes);
        return result;
    }
    
    // If string is >55 bytes long, return [0xb7+len(len(data)), len(data), data]
    const len_bytes = try encodeLength(allocator, bytes.len);
    defer allocator.free(len_bytes);
    
    const result = try allocator.alloc(u8, 1 + len_bytes.len + bytes.len);
    result[0] = 0xb7 + @as(u8, @intCast(len_bytes.len));
    std.mem.copy(u8, result[1..], len_bytes);
    std.mem.copy(u8, result[1 + len_bytes.len..], bytes);
    
    return result;
}

/// Encodes an integer length as bytes
fn encodeLength(allocator: Allocator, length: usize) ![]u8 {
    var len_bytes = std.ArrayList(u8).init(allocator);
    defer len_bytes.deinit();
    
    var temp = length;
    while (temp > 0) {
        try len_bytes.insert(0, @as(u8, @intCast(temp & 0xff)));
        temp >>= 8;
    }
    
    return try len_bytes.toOwnedSlice();
}

/// Decodes RLP encoded data.
/// If stream is true, it returns both the decoded data and the remaining bytes.
/// If stream is false (default), it expects the entire input to be consumed.
/// Allocates memory that must be freed by calling .deinit() on the result.
pub fn decode(allocator: Allocator, input: []const u8, stream: bool) !Decoded {
    if (input.len == 0) {
        return Decoded{
            .data = Data{ .String = try allocator.dupe(u8, &.{}) },
            .remainder = &.{},
        };
    }
    
    const result = try _decode(allocator, input);
    
    if (!stream and result.remainder.len > 0) {
        return RlpError.InvalidRemainder;
    }
    
    return result;
}

fn _decode(allocator: Allocator, input: []const u8) !Decoded {
    if (input.len == 0) {
        return RlpError.InputTooShort;
    }
    
    const prefix = input[0];
    
    // Single byte (0x00 - 0x7f)
    if (prefix <= 0x7f) {
        const result = try allocator.alloc(u8, 1);
        result[0] = prefix;
        return Decoded{
            .data = Data{ .String = result },
            .remainder = input[1..],
        };
    }
    
    // String 0-55 bytes (0x80 - 0xb7)
    if (prefix <= 0xb7) {
        const length = prefix - 0x80;
        
        if (input.len - 1 < length) {
            return RlpError.InputTooShort;
        }
        
        // Empty string
        if (prefix == 0x80) {
            return Decoded{
                .data = Data{ .String = try allocator.dupe(u8, &.{}) },
                .remainder = input[1..],
            };
        }
        
        // Enforce canonical representation: single byte < 0x80 should be encoded as itself
        if (length == 1 and input[1] < 0x80) {
            return RlpError.NonCanonicalSize;
        }
        
        const data = try allocator.alloc(u8, length);
        std.mem.copy(u8, data, input[1 .. 1 + length]);
        
        return Decoded{
            .data = Data{ .String = data },
            .remainder = input[1 + length..],
        };
    }
    
    // String > 55 bytes (0xb8 - 0xbf)
    if (prefix <= 0xbf) {
        const length_of_length = prefix - 0xb7;
        
        if (input.len - 1 < length_of_length) {
            return RlpError.InputTooShort;
        }
        
        // Check for leading zeros in the length
        if (input[1] == 0) {
            return RlpError.LeadingZeros;
        }
        
        var total_length: usize = 0;
        for (input[1 .. 1 + length_of_length]) |byte| {
            total_length = (total_length << 8) + byte;
        }
        
        // Enforce canonical representation: if length < 56, should use the short form
        if (total_length < 56) {
            return RlpError.NonCanonicalSize;
        }
        
        if (input.len - 1 - length_of_length < total_length) {
            return RlpError.InputTooShort;
        }
        
        const data = try allocator.alloc(u8, total_length);
        std.mem.copy(u8, data, input[1 + length_of_length .. 1 + length_of_length + total_length]);
        
        return Decoded{
            .data = Data{ .String = data },
            .remainder = input[1 + length_of_length + total_length..],
        };
    }
    
    // List 0-55 bytes (0xc0 - 0xf7)
    if (prefix <= 0xf7) {
        const length = prefix - 0xc0;
        
        if (input.len - 1 < length) {
            return RlpError.InputTooShort;
        }
        
        if (length == 0) {
            return Decoded{
                .data = Data{ .List = try allocator.alloc(Data, 0) },
                .remainder = input[1..],
            };
        }
        
        var items = std.ArrayList(Data).init(allocator);
        defer {
            // If we return an error, clean up already allocated items
            if (@errorReturnTrace()) |_| {
                for (items.items) |item| {
                    item.deinit(allocator);
                }
                items.deinit();
            }
        }
        
        var remaining = input[1 .. 1 + length];
        while (remaining.len > 0) {
            const decoded = try _decode(allocator, remaining);
            try items.append(decoded.data);
            remaining = decoded.remainder;
        }
        
        return Decoded{
            .data = Data{ .List = try items.toOwnedSlice() },
            .remainder = input[1 + length..],
        };
    }
    
    // List > 55 bytes (0xf8 - 0xff)
    if (prefix <= 0xff) {
        const length_of_length = prefix - 0xf7;
        
        if (input.len - 1 < length_of_length) {
            return RlpError.InputTooShort;
        }
        
        // Check for leading zeros in the length
        if (input[1] == 0) {
            return RlpError.LeadingZeros;
        }
        
        var total_length: usize = 0;
        for (input[1 .. 1 + length_of_length]) |byte| {
            total_length = (total_length << 8) + byte;
        }
        
        // Enforce canonical representation: if length < 56, should use the short form
        if (total_length < 56) {
            return RlpError.NonCanonicalSize;
        }
        
        if (input.len - 1 - length_of_length < total_length) {
            return RlpError.InputTooShort;
        }
        
        var items = std.ArrayList(Data).init(allocator);
        defer {
            // If we return an error, clean up already allocated items
            if (@errorReturnTrace()) |_| {
                for (items.items) |item| {
                    item.deinit(allocator);
                }
                items.deinit();
            }
        }
        
        var remaining = input[1 + length_of_length .. 1 + length_of_length + total_length];
        while (remaining.len > 0) {
            const decoded = try _decode(allocator, remaining);
            try items.append(decoded.data);
            remaining = decoded.remainder;
        }
        
        return Decoded{
            .data = Data{ .List = try items.toOwnedSlice() },
            .remainder = input[1 + length_of_length + total_length..],
        };
    }
    
    return RlpError.UnexpectedInput;
}

// Utility functions

/// Converts a byte slice to a hex string
pub fn bytesToHex(allocator: Allocator, bytes: []const u8) ![]u8 {
    return try hex.bytesToHex(allocator, bytes);
}

/// Converts a hex string to bytes
pub fn hexToBytes(allocator: Allocator, hex_str: []const u8) ![]u8 {
    return try hex.hexToBytes(allocator, hex_str);
}

/// Concatenates multiple byte slices into one
pub fn concatBytes(allocator: Allocator, arrays: []const []const u8) ![]u8 {
    var total_len: usize = 0;
    for (arrays) |arr| {
        total_len += arr.len;
    }
    
    const result = try allocator.alloc(u8, total_len);
    var index: usize = 0;
    for (arrays) |arr| {
        std.mem.copy(u8, result[index..], arr);
        index += arr.len;
    }
    
    return result;
}

// Converts a UTF-8 string to bytes
pub fn utf8ToBytes(allocator: Allocator, str: []const u8) ![]u8 {
    return try allocator.dupe(u8, str);
}

// Test cases
test "RLP single byte" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const single_byte = "a";
    const encoded = try encode(allocator, single_byte);
    defer allocator.free(encoded);
    
    try testing.expectEqualSlices(u8, &[_]u8{'a'}, encoded);
    
    const decoded = try decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, &[_]u8{'a'}, str),
        .List => unreachable,
    }
}

test "RLP string 0-55 bytes" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const dog_str = "dog";
    const encoded = try encode(allocator, dog_str);
    defer allocator.free(encoded);
    
    try testing.expectEqual(@as(usize, 4), encoded.len);
    try testing.expectEqual(@as(u8, 131), encoded[0]);
    try testing.expectEqual(@as(u8, 'd'), encoded[1]);
    try testing.expectEqual(@as(u8, 'o'), encoded[2]);
    try testing.expectEqual(@as(u8, 'g'), encoded[3]);
    
    const decoded = try decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, dog_str, str),
        .List => unreachable,
    }
}

test "RLP string >55 bytes" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const long_str = "zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss";
    const encoded = try encode(allocator, long_str);
    defer allocator.free(encoded);
    
    try testing.expectEqual(@as(usize, 72), encoded.len);
    try testing.expectEqual(@as(u8, 184), encoded[0]);
    try testing.expectEqual(@as(u8, 70), encoded[1]);
    
    const decoded = try decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .String => |str| try testing.expectEqualSlices(u8, long_str, str),
        .List => unreachable,
    }
}

test "RLP list 0-55 bytes" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const list = [_][]const u8{ "dog", "god", "cat" };
    var encoded_items = std.ArrayList([]u8).init(allocator);
    defer {
        for (encoded_items.items) |item| {
            allocator.free(item);
        }
        encoded_items.deinit();
    }
    
    for (list) |item| {
        const encoded_item = try encode(allocator, item);
        try encoded_items.append(encoded_item);
    }
    
    const encoded_list = try encode(allocator, encoded_items.items);
    defer allocator.free(encoded_list);
    
    try testing.expectEqual(@as(usize, 13), encoded_list.len);
    try testing.expectEqual(@as(u8, 204), encoded_list[0]);
    
    const decoded = try decode(allocator, encoded_list, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .List => |items| {
            try testing.expectEqual(@as(usize, 3), items.len);
            for (items, 0..) |item, i| {
                switch (item) {
                    .String => |str| try testing.expectEqualSlices(u8, list[i], str),
                    .List => unreachable,
                }
            }
        },
        .String => unreachable,
    }
}

test "RLP integers" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Single byte integer
    {
        const encoded = try encode(allocator, 15);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 1), encoded.len);
        try testing.expectEqual(@as(u8, 15), encoded[0]);
        
        const decoded = try decode(allocator, encoded, false);
        defer decoded.data.deinit(allocator);
        
        switch (decoded.data) {
            .String => |str| {
                try testing.expectEqual(@as(usize, 1), str.len);
                try testing.expectEqual(@as(u8, 15), str[0]);
            },
            .List => unreachable,
        }
    }
    
    // Multi-byte integer
    {
        const encoded = try encode(allocator, 1024);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 3), encoded.len);
        try testing.expectEqual(@as(u8, 130), encoded[0]);
        try testing.expectEqual(@as(u8, 4), encoded[1]);
        try testing.expectEqual(@as(u8, 0), encoded[2]);
        
        const decoded = try decode(allocator, encoded, false);
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
    
    // Zero
    {
        const encoded = try encode(allocator, 0);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 1), encoded.len);
        try testing.expectEqual(@as(u8, 0x80), encoded[0]);
        
        const decoded = try decode(allocator, encoded, false);
        defer decoded.data.deinit(allocator);
        
        switch (decoded.data) {
            .String => |str| try testing.expectEqual(@as(usize, 0), str.len),
            .List => unreachable,
        }
    }
}

test "RLP nested lists" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const nested_list = [_][]const u8{};
    
    // Encode [[[]]]
    var encoded_nested = std.ArrayList([]u8).init(allocator);
    defer {
        for (encoded_nested.items) |item| {
            allocator.free(item);
        }
        encoded_nested.deinit();
    }
    
    // Encode []
    const encoded_empty = try encode(allocator, nested_list);
    try encoded_nested.append(encoded_empty);
    
    // Encode [[]]
    const encoded_empty_list = try encode(allocator, encoded_nested.items);
    var encoded_nested2 = std.ArrayList([]u8).init(allocator);
    defer {
        for (encoded_nested2.items) |item| {
            allocator.free(item);
        }
        encoded_nested2.deinit();
    }
    try encoded_nested2.append(encoded_empty_list);
    
    // Encode [[[]]]
    const encoded_final = try encode(allocator, encoded_nested2.items);
    defer allocator.free(encoded_final);
    
    try testing.expectEqualSlices(u8, &[_]u8{ 0xc1, 0xc1, 0xc0 }, encoded_final);
    
    // Decode [[[]]]
    const decoded = try decode(allocator, encoded_final, false);
    defer decoded.data.deinit(allocator);
    
    // Verify the structure
    switch (decoded.data) {
        .List => |outer_list| {
            try testing.expectEqual(@as(usize, 1), outer_list.len);
            switch (outer_list[0]) {
                .List => |middle_list| {
                    try testing.expectEqual(@as(usize, 1), middle_list.len);
                    switch (middle_list[0]) {
                        .List => |inner_list| {
                            try testing.expectEqual(@as(usize, 0), inner_list.len);
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

test "RLP stream decoding" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a stream of RLP encoded items
    const encoded_number = try encode(allocator, 1);
    defer allocator.free(encoded_number);
    
    const encoded_string = try encode(allocator, "test");
    defer allocator.free(encoded_string);
    
    const long_string = "This is a long string that should trigger the long string encoding in RLP";
    const encoded_long_string = try encode(allocator, long_string);
    defer allocator.free(encoded_long_string);
    
    const list_items = [_]i32{ 1, 2, 3 };
    const encoded_list = try encode(allocator, list_items);
    defer allocator.free(encoded_list);
    
    // Concatenate all encoded items
    const arrays = [_][]const u8{ encoded_number, encoded_string, encoded_long_string, encoded_list };
    const buffer_stream = try concatBytes(allocator, &arrays);
    defer allocator.free(buffer_stream);
    
    // Decode stream one by one
    var remaining = buffer_stream;
    
    // First item (number)
    var decoded = try decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .String => |str| {
            try testing.expectEqual(@as(usize, 1), str.len);
            try testing.expectEqual(@as(u8, 1), str[0]);
        },
        .List => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Second item (string)
    decoded = try decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .String => |str| {
            try testing.expectEqualSlices(u8, "test", str);
        },
        .List => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Third item (long string)
    decoded = try decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .String => |str| {
            try testing.expectEqualSlices(u8, long_string, str);
        },
        .List => unreachable,
    }
    decoded.data.deinit(allocator);
    
    // Fourth item (list)
    decoded = try decode(allocator, remaining, true);
    remaining = decoded.remainder;
    switch (decoded.data) {
        .List => |list| {
            try testing.expectEqual(@as(usize, 3), list.len);
            for (list, 0..) |item, i| {
                switch (item) {
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
