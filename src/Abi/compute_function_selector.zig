const std = @import("std");
const crypto = @import("std").crypto;
const abi = @import("abi.zig");

/// Compute Keccak-256 hash of data
/// 
/// Returns a 32-byte array containing the Keccak-256 hash
pub fn keccak256(data: []const u8) [32]u8 {
    var out: [32]u8 = undefined;
    crypto.hash.sha3.Keccak256.hash(data, &out, .{});
    return out;
}

/// Compute the 4-byte function selector for a function signature
/// 
/// The function selector is defined as the first 4 bytes of the Keccak-256 hash
/// of the canonical representation of the function signature.
/// 
/// signature: Function signature string in the format "functionName(type1,type2,...)"
/// out_selector: Pre-allocated 4-byte array to store the result
pub fn computeFunctionSelector(signature: []const u8, out_selector: *[4]u8) void {
    const hash = keccak256(signature);
    @memcpy(out_selector[0..4], hash[0..4]);
}

/// Alternative signature for computeFunctionSelector that returns the value directly
pub fn computeFunctionSelectorValue(signature: []const u8) [4]u8 {
    var selector: [4]u8 = undefined;
    computeFunctionSelector(signature, &selector);
    return selector;
}

/// Compute the 4-byte function selector from an ABI function item
/// 
/// func: ABI function definition
/// out_selector: Pre-allocated 4-byte array to store the result
pub fn getFunctionSelector(func: abi.Function, out_selector: *[4]u8) !void {
    // Build the canonical function signature using a fixed-size buffer
    var signature_buf: [256]u8 = undefined;
    var signature_len: usize = 0;
    
    // Add function name
    if (func.name.len > signature_buf.len - 2) { // Need room for at least '(' and ')'
        return error.BufferTooSmall;
    }
    
    @memcpy(signature_buf[0..func.name.len], func.name);
    signature_len += func.name.len;
    
    signature_buf[signature_len] = '(';
    signature_len += 1;
    
    // Add parameter types
    for (func.inputs, 0..) |param, i| {
        if (i > 0) {
            if (signature_len + 1 > signature_buf.len) return error.BufferTooSmall;
            signature_buf[signature_len] = ',';
            signature_len += 1;
        }
        
        const canonical_type = getCanonicalType(param.ty);
        if (signature_len + canonical_type.len > signature_buf.len) {
            return error.BufferTooSmall;
        }
        
        @memcpy(signature_buf[signature_len..signature_len+canonical_type.len], canonical_type);
        signature_len += canonical_type.len;
    }
    
    if (signature_len + 1 > signature_buf.len) return error.BufferTooSmall;
    signature_buf[signature_len] = ')';
    signature_len += 1;
    
    // Compute selector
    computeFunctionSelector(signature_buf[0..signature_len], out_selector);
}

/// Compute event topic hash (used for event filtering)
///
/// The event topic hash is the entire Keccak-256 hash of the event signature.
/// 
/// signature: Event signature string in the format "EventName(type1,type2,...)"
/// Returns a 32-byte array containing the event topic hash
pub fn computeEventTopic(signature: []const u8) [32]u8 {
    return keccak256(signature);
}

/// Compute event topic hash from an ABI event item
///
/// event: ABI event definition
/// Returns a 32-byte array containing the event topic hash
pub fn getEventTopic(event: abi.Event) ![32]u8 {
    // Build the canonical event signature using a fixed-size buffer
    var signature_buf: [256]u8 = undefined;
    var signature_len: usize = 0;
    
    // Add event name
    if (event.name.len > signature_buf.len - 2) { // Need room for at least '(' and ')'
        return error.BufferTooSmall;
    }
    
    @memcpy(signature_buf[0..event.name.len], event.name);
    signature_len += event.name.len;
    
    signature_buf[signature_len] = '(';
    signature_len += 1;
    
    // Add parameter types (only non-indexed for anonymous events, all params otherwise)
    var first = true;
    for (event.inputs) |param| {
        if (event.anonymous and param.indexed) {
            continue;
        }
        
        if (!first) {
            if (signature_len + 1 > signature_buf.len) return error.BufferTooSmall;
            signature_buf[signature_len] = ',';
            signature_len += 1;
        }
        first = false;
        
        const canonical_type = getCanonicalType(param.ty);
        if (signature_len + canonical_type.len > signature_buf.len) {
            return error.BufferTooSmall;
        }
        
        @memcpy(signature_buf[signature_len..signature_len+canonical_type.len], canonical_type);
        signature_len += canonical_type.len;
    }
    
    if (signature_len + 1 > signature_buf.len) return error.BufferTooSmall;
    signature_buf[signature_len] = ')';
    signature_len += 1;
    
    // Compute topic hash
    return keccak256(signature_buf[0..signature_len]);
}

/// Get the canonical type representation
///
/// This normalizes types according to the ABI spec for computing selectors.
/// For example, removing whitespace, using uint256 instead of uint, etc.
fn getCanonicalType(ty: []const u8) []const u8 {
    // Special case for basic types with implicit bit sizes
    if (std.mem.eql(u8, ty, "uint")) {
        return "uint256";
    }
    if (std.mem.eql(u8, ty, "int")) {
        return "int256";
    }
    if (std.mem.eql(u8, ty, "fixed")) {
        return "fixed128x18";
    }
    if (std.mem.eql(u8, ty, "ufixed")) {
        return "ufixed128x18";
    }
    
    // For array types, we need to normalize the base type
    if (std.mem.indexOfScalar(u8, ty, '[') != null) {
        // TODO: Implement array type normalization
        // This would involve parsing the base type and dimensions
        return ty;
    }
    
    // All other types are used as-is
    return ty;
}

test "computeFunctionSelector basic" {
    const testing = std.testing;
    
    // Test baz(uint32,bool)
    {
        const signature = "baz(uint32,bool)";
        var selector: [4]u8 = undefined;
        computeFunctionSelector(signature, &selector);
        
        // Expected: 0xcdcd77c0
        const expected = [_]u8{0xcd, 0xcd, 0x77, 0xc0};
        try testing.expectEqualSlices(u8, &expected, &selector);
    }
    
    // Test bar(bytes3[2])
    {
        const signature = "bar(bytes3[2])";
        var selector: [4]u8 = undefined;
        computeFunctionSelector(signature, &selector);
        
        // Expected: 0xfce353f6
        const expected = [_]u8{0xfc, 0xe3, 0x53, 0xf6};
        try testing.expectEqualSlices(u8, &expected, &selector);
    }
    
    // Test transfer(address,uint256)
    {
        const signature = "transfer(address,uint256)";
        var selector: [4]u8 = undefined;
        computeFunctionSelector(signature, &selector);
        
        // Expected: 0xa9059cbb
        const expected = [_]u8{0xa9, 0x05, 0x9c, 0xbb};
        try testing.expectEqualSlices(u8, &expected, &selector);
    }
}

test "getFunctionSelector from ABI" {
    const testing = std.testing;
    
    // Test transfer(address,uint256)
    const transfer_inputs = [_]abi.Param{
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
    
    const transfer_func = abi.Function{
        .name = "transfer",
        .inputs = &transfer_inputs,
        .outputs = &[_]abi.Param{
            .{
                .ty = "bool",
                .name = "success",
                .components = &[_]abi.Param{},
                .internal_type = null,
            },
        },
        .state_mutability = abi.StateMutability.NonPayable,
    };
    
    var selector: [4]u8 = undefined;
    try getFunctionSelector(transfer_func, &selector);
    
    // Expected: 0xa9059cbb
    const expected = [_]u8{0xa9, 0x05, 0x9c, 0xbb};
    try testing.expectEqualSlices(u8, &expected, &selector);
}

test "computeEventTopic" {
    const testing = std.testing;
    
    // Test Transfer(address,address,uint256)
    {
        const signature = "Transfer(address,address,uint256)";
        var topic: [32]u8 = undefined;
        computeEventTopic(signature, &topic);
        
        // Expected: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
        const expected = [_]u8{
            0xdd, 0xf2, 0x52, 0xad, 0x1b, 0xe2, 0xc8, 0x9b,
            0x69, 0xc2, 0xb0, 0x68, 0xfc, 0x37, 0x8d, 0xaa,
            0x95, 0x2b, 0xa7, 0xf1, 0x63, 0xc4, 0xa1, 0x16,
            0x28, 0xf5, 0x5a, 0x4d, 0xf5, 0x23, 0xb3, 0xef,
        };
        try testing.expectEqualSlices(u8, &expected, &topic);
    }
}