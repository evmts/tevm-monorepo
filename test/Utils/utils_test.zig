const std = @import("std");
const utils = @import("utils");
const hex = utils.hex;
const keccak256 = utils.keccak256;

test "hexToBytes" {
    const hex_str = "0x1234567890abcdef";
    var buffer: [8]u8 = undefined;
    
    const bytes_len = hex.hexToBytes(hex_str.ptr, hex_str.len, &buffer);
    try std.testing.expectEqual(@as(usize, 8), bytes_len);
    
    const expected = [_]u8{ 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef };
    try std.testing.expectEqualSlices(u8, &expected, buffer[0..bytes_len]);
}

test "bytesToHex" {
    const bytes = [_]u8{ 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef };
    var buffer: [32]u8 = undefined;
    
    const hex_len = hex.bytesToHex(&bytes, bytes.len, &buffer);
    try std.testing.expectEqual(@as(usize, 18), hex_len); // 0x + 8*2 = 18
    
    const hex_str = buffer[0..hex_len];
    const expected = "0x1234567890abcdef";
    try std.testing.expectEqualSlices(u8, expected, hex_str);
}

test "keccak256" {
    const input = "hello world";
    var output: [32]u8 = undefined;
    
    keccak256.keccak256(input.ptr, input.len, &output);
    
    // Expected hash for "hello world"
    const expected = [_]u8{
        0x47, 0x17, 0x32, 0x85, 0xa8, 0xd7, 0x34, 0x1e, 
        0x5e, 0x97, 0x2f, 0xc6, 0x77, 0x28, 0x63, 0x84,
        0xf8, 0x02, 0xf8, 0xef, 0x42, 0xa5, 0xec, 0x5f,
        0x03, 0xbb, 0xfa, 0x25, 0x4c, 0xb0, 0x1f, 0xad
    };
    
    try std.testing.expectEqualSlices(u8, &expected, &output);
}