const std = @import("std");
const crypto = std.crypto;

const startsWith = std.mem.startsWith;
const hexToBytes = std.fmt.hexToBytes;
const bytesToHex = std.fmt.bytesToHex;
const Case = std.fmt.Case;
const Keccak256 = crypto.hash.sha3.Keccak256;

pub const Address = [20]u8;

pub const ZERO_ADDRESS: Address = [_]u8{0} ** 20;

pub fn addressFromHex(comptime hex: [42]u8) Address {
    if (!startsWith(u8, hex, "0x"))
        @compileError("hex must start with '0x'");

    var out: Address = undefined;
    hexToBytes(&out, hex[2..]) catch unreachable;
    return out;
}

pub fn addressFromPublicKey(publicKey: PublicKey) Address {
    return publicKey.toAddress();
}

pub fn addressToHex(address: Address) [42]u8 {
    return bytesToHex(address);
}

pub fn addressToChecksumHex(address: Address) [42]u8 {
    var result: [42]u8 = undefined;
    var hex_without_prefix: [40]u8 = undefined;

    result[0] = '0';
    result[1] = 'x';

    const lowercase = "0123456789abcdef";
    const uppercase = "0123456789ABCDEF";

    for (address, 0..) |b, i| {
        hex_without_prefix[i * 2] = lowercase[b >> 4];
        hex_without_prefix[i * 2 + 1] = lowercase[b & 15];
    }

    var hash: [32]u8 = undefined;
    Keccak256.hash(&hex_without_prefix, &hash, .{});

    for (address, 0..) |b, i| {
        const high_nibble = b >> 4;
        const low_nibble = b & 15;
        const high_hash = (hash[i] >> 4) & 0x0F;
        const low_hash = hash[i] & 0x0F;

        result[i * 2 + 2] = if (high_nibble > 9 and high_hash >= 8)
            uppercase[high_nibble]
        else
            lowercase[high_nibble];

        result[i * 2 + 3] = if (low_nibble > 9 and low_hash >= 8)
            uppercase[low_nibble]
        else
            lowercase[low_nibble];
    }

    return result;
}

pub const CompressedPublicKey = struct {
    prefix: u8,
    x: [32]u8,
};

pub const PublicKey = struct {
    prefix: u8,
    x: [32]u8,
    y: [32]u8,

    pub fn fromHex(hex: []const u8) !PublicKey {
        if (hex.len < 2 or !std.mem.eql(u8, hex[0..2], "0x"))
            return error.InvalidPublicKeyFormat;

        if (hex.len == 2 + 130) {
            if (hex[2] != '0' or hex[3] != '4')
                return error.InvalidPublicKeyPrefix;

            var key = PublicKey{
                .prefix = 0x04,
                .x = undefined,
                .y = undefined,
            };

            _ = hexToBytes(&key.x, hex[4..68]) catch return error.InvalidHexString;
            _ = hexToBytes(&key.y, hex[68..132]) catch return error.InvalidHexString;

            return key;
        } else if (hex.len == 2 + 128) {
            var key = PublicKey{
                .prefix = 0x04,
                .x = undefined,
                .y = undefined,
            };

            _ = hexToBytes(&key.x, hex[2..66]) catch return error.InvalidHexString;
            _ = hexToBytes(&key.y, hex[66..130]) catch return error.InvalidHexString;

            return key;
        }

        return error.InvalidPublicKeyLength;
    }

    fn toAddress(self: PublicKey) Address {
        var hash: [32]u8 = undefined;
        var pubkey_bytes: [64]u8 = undefined;

        @memcpy(pubkey_bytes[0..32], &self.x);

        if (self.prefix == 0x04) {
            @memcpy(pubkey_bytes[32..64], &self.y);
        }

        Keccak256.hash(&pubkey_bytes, &hash, .{});

        var address: Address = undefined;
        @memcpy(&address, hash[12..32]);

        return address;
    }
};

pub fn isValidAddress(addr_str: []const u8) bool {
    if (addr_str.len != 42 or !startsWith(u8, addr_str, "0x"))
        return false;

    for (addr_str[2..]) |c| {
        const valid = switch (c) {
            '0'...'9', 'a'...'f', 'A'...'F' => true,
            else => false,
        };
        if (!valid) return false;
    }

    return true;
}

pub fn isValidChecksumAddress(addr_str: []const u8) bool {
    if (!isValidAddress(addr_str))
        return false;

    var addr: Address = undefined;
    _ = hexToBytes(&addr, addr_str[2..]) catch return false;

    const checksummed = addressToChecksumHex(addr);
    return std.mem.eql(u8, &checksummed, addr_str);
}

pub fn areAddressesEqual(a: []const u8, b: []const u8) !bool {
    if (!isValidAddress(a) or !isValidAddress(b))
        return error.InvalidAddress;

    var addr_a: Address = undefined;
    var addr_b: Address = undefined;

    _ = try hexToBytes(&addr_a, a[2..]);
    _ = try hexToBytes(&addr_b, b[2..]);

    return std.mem.eql(u8, &addr_a, &addr_b);
}

test "PublicKey.fromHex" {
    const serialized = "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5";
    const publicKey = try PublicKey.fromHex(serialized);

    try std.testing.expectEqual(@as(u8, 0x04), publicKey.prefix);

    const expected_x = [_]u8{ 0x83, 0x18, 0x53, 0x5b, 0x54, 0x10, 0x5d, 0x4a, 0x7a, 0xae, 0x60, 0xc0, 0x8f, 0xc4, 0x5f, 0x96, 0x87, 0x18, 0x1b, 0x4f, 0xdf, 0xc6, 0x25, 0xbd, 0x1a, 0x75, 0x3f, 0xa7, 0x39, 0x7f, 0xed, 0x75 };
    try std.testing.expectEqualSlices(u8, &expected_x, &publicKey.x);

    const expected_y = [_]u8{ 0x35, 0x47, 0xf1, 0x1c, 0xa8, 0x69, 0x66, 0x46, 0xf2, 0xf3, 0xac, 0xb0, 0x8e, 0x31, 0x01, 0x6a, 0xfa, 0xc2, 0x3e, 0x63, 0x0c, 0x5d, 0x11, 0xf5, 0x9f, 0x61, 0xfe, 0xf5, 0x7b, 0x0d, 0x2a, 0xa5 };
    try std.testing.expectEqualSlices(u8, &expected_y, &publicKey.y);
}

test "Address - checksumAddress" {
    const test_cases = [_]struct {
        input: []const u8,
        expected: []const u8,
    }{
        .{
            .input = "0xa0cf798816d4b9b9866b5330eea46a18382f251e",
            .expected = "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
        },
        .{
            .input = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            .expected = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
        .{
            .input = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
            .expected = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        },
    };

    for (test_cases) |tc| {
        var addr: Address = undefined;
        _ = hexToBytes(&addr, tc.input[2..]) catch unreachable;

        const checksummed = addressToChecksumHex(addr);

        try std.testing.expectEqualStrings(tc.expected, &checksummed);
    }
}

test "Address - fromPublicKey" {
    const serialized = "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5";
    const publicKey = try PublicKey.fromHex(serialized);

    const addr = addressFromPublicKey(publicKey);

    var expected_addr: Address = undefined;
    _ = hexToBytes(&expected_addr, "f39fd6e51aad88f6f4ce6ab8827279cfffb92266") catch unreachable;

    try std.testing.expectEqualSlices(u8, &expected_addr, &addr);

    const addr_checksum = addressToChecksumHex(addr);
    const expected_checksum = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    try std.testing.expectEqualStrings(expected_checksum, &addr_checksum);
}

test "Address - validation" {
    try std.testing.expect(isValidAddress("0xa0cf798816d4b9b9866b5330eea46a18382f251e"));
    try std.testing.expect(isValidAddress("0xA0Cf798816D4b9b9866b5330EEa46a18382f251e"));

    try std.testing.expect(!isValidAddress("x"));
    try std.testing.expect(!isValidAddress("0xa"));
    try std.testing.expect(!isValidAddress("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678az"));
    try std.testing.expect(!isValidAddress("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678aff"));
    try std.testing.expect(!isValidAddress("a5cc3c03994db5b0d9a5eEdD10Cabab0813678ac"));

    try std.testing.expect(isValidChecksumAddress("0xA0Cf798816D4b9b9866b5330EEa46a18382f251e"));
    try std.testing.expect(!isValidChecksumAddress("0xa0cf798816d4b9b9866b5330eea46a18382f251e"));
    try std.testing.expect(!isValidChecksumAddress("0xA0CF798816D4B9B9866B5330EEA46A18382F251E"));
}

test "Address - equality" {
    try std.testing.expect(try areAddressesEqual("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac", "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC"));

    try std.testing.expect(try areAddressesEqual("0xa0cf798816d4b9b9866b5330eea46a18382f251e", "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e"));

    try std.testing.expect(try areAddressesEqual("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac", "0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac"));

    try std.testing.expect(!try areAddressesEqual("0xa0cf798816d4b9b9866b5330eea46a18382f251e", "0xA0Cf798816D4b9b9866b5330EEa46a18382f251f"));

    try std.testing.expectError(error.InvalidAddress, areAddressesEqual("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678az", "0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac"));

    try std.testing.expectError(error.InvalidAddress, areAddressesEqual("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac", "0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678aff"));
}
