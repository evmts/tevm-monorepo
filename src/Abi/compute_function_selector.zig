const std = @import("std");
const abi = @import("abi.zig");

/// Generate a function selector (first 4 bytes of Keccak-256 hash of the signature)
/// 
/// signature: Function signature string in the format "functionName(type1,type2,...)"
/// selector: A 4-byte array where the result will be stored
pub fn computeFunctionSelector(signature: []const u8, selector: *[4]u8) void {
    const hash = keccak256(signature);
    selector[0] = hash[0];
    selector[1] = hash[1];
    selector[2] = hash[2];
    selector[3] = hash[3];
}

/// Compute the function selector from an ABI function definition
/// 
/// func: The ABI function definition
/// selector: A 4-byte array where the result will be stored
/// 
/// Returns error if unable to generate the selector
pub fn getFunctionSelector(func: abi.Function, selector: *[4]u8) !void {
    // Build the function signature string
    var signature_buf: [256]u8 = undefined; // Should be enough for typical signatures
    var signature_len: usize = 0;
    
    // Function name
    if (signature_len + func.name.len > signature_buf.len) {
        return error.SignatureTooLong;
    }
    @memcpy(signature_buf[signature_len..][0..func.name.len], func.name);
    signature_len += func.name.len;
    
    // Opening parenthesis
    if (signature_len + 1 > signature_buf.len) {
        return error.SignatureTooLong;
    }
    signature_buf[signature_len] = '(';
    signature_len += 1;
    
    // Parameter types
    for (func.inputs, 0..) |param, i| {
        if (i > 0) {
            // Add comma between parameters
            if (signature_len + 1 > signature_buf.len) {
                return error.SignatureTooLong;
            }
            signature_buf[signature_len] = ',';
            signature_len += 1;
        }
        
        // Add parameter type
        if (signature_len + param.ty.len > signature_buf.len) {
            return error.SignatureTooLong;
        }
        @memcpy(signature_buf[signature_len..][0..param.ty.len], param.ty);
        signature_len += param.ty.len;
    }
    
    // Closing parenthesis
    if (signature_len + 1 > signature_buf.len) {
        return error.SignatureTooLong;
    }
    signature_buf[signature_len] = ')';
    signature_len += 1;
    
    // Compute the selector from the signature
    computeFunctionSelector(signature_buf[0..signature_len], selector);
}

/// The event topic hash is the entire Keccak-256 hash of the event signature.
/// 
/// signature: Event signature string in the format "EventName(type1,type2,...)"
/// Returns a 32-byte array containing the event topic hash
pub fn computeEventTopic(signature: []const u8) [32]u8 {
    return keccak256(signature);
}

/// Compute event topic hash from an ABI event item
///
/// event: The ABI event definition
/// Returns a 32-byte array containing the event topic hash
pub fn getEventTopic(event: abi.Event) ![32]u8 {
    // Build the event signature string
    var signature_buf: [256]u8 = undefined; // Should be enough for typical signatures
    var signature_len: usize = 0;
    
    // Event name
    if (signature_len + event.name.len > signature_buf.len) {
        return error.SignatureTooLong;
    }
    @memcpy(signature_buf[signature_len..][0..event.name.len], event.name);
    signature_len += event.name.len;
    
    // Opening parenthesis
    if (signature_len + 1 > signature_buf.len) {
        return error.SignatureTooLong;
    }
    signature_buf[signature_len] = '(';
    signature_len += 1;
    
    // Parameter types
    for (event.inputs, 0..) |param, i| {
        if (i > 0) {
            // Add comma between parameters
            if (signature_len + 1 > signature_buf.len) {
                return error.SignatureTooLong;
            }
            signature_buf[signature_len] = ',';
            signature_len += 1;
        }
        
        // Add parameter type
        if (signature_len + param.ty.len > signature_buf.len) {
            return error.SignatureTooLong;
        }
        @memcpy(signature_buf[signature_len..][0..param.ty.len], param.ty);
        signature_len += param.ty.len;
    }
    
    // Closing parenthesis
    if (signature_len + 1 > signature_buf.len) {
        return error.SignatureTooLong;
    }
    signature_buf[signature_len] = ')';
    signature_len += 1;
    
    // Compute the topic hash from the signature
    return keccak256(signature_buf[0..signature_len]);
}

/// Calculate Keccak-256 hash of input data
///
/// data: Bytes to hash
/// Returns a 32-byte array containing the hash
pub fn keccak256(data: []const u8) [32]u8 {
    var out: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(data, &out, .{});
    return out;
}

test "computeFunctionSelector" {
    const testing = std.testing;
    
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
    
    const transfer_func = abi.Function{
        .name = "transfer",
        .inputs = &transfer_inputs,
        .outputs = &transfer_outputs,
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
        var topic = computeEventTopic(signature);
        
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