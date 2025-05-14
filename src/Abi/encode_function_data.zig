const std = @import("std");
const abi = @import("abi.zig");
const encode_abi_parameters = @import("encode_abi_parameters.zig");
const compute_function_selector = @import("compute_function_selector.zig");

/// Error type for function data encoding operations
pub const EncodeFunctionDataError = error{
    FunctionNotFound,
    InvalidArguments,
    InvalidAbi,
    BufferTooSmall,
} || encode_abi_parameters.EncodeError;

/// Encodes a function call with its arguments according to the ABI specification
///
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// abi_items: Array of ABI items representing contract interface
/// function_name: Name of the function to call
/// args: Arguments to pass to the function
///
/// Returns the number of bytes written to out_buffer
pub fn encodeFunctionData(
    out_buffer: []u8,
    abi_items: []const abi.AbiItem,
    function_name: []const u8,
    args: std.StringHashMap([]const u8),
) !usize {
    // Find the function in the ABI
    var func_opt: ?abi.Function = null;
    
    for (abi_items) |item| {
        switch (item) {
            .Function => |func| {
                if (std.mem.eql(u8, func.name, function_name)) {
                    func_opt = func;
                    break;
                }
            },
            else => continue,
        }
    }
    
    if (func_opt == null) {
        return EncodeFunctionDataError.FunctionNotFound;
    }
    
    return encodeFunctionDataWithFunction(out_buffer, func_opt.?, args);
}

/// Encodes a function call with its arguments using a specific function ABI definition
///
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// func: ABI function definition
/// args: Arguments to pass to the function
///
/// Returns the number of bytes written to out_buffer
pub fn encodeFunctionDataWithFunction(
    out_buffer: []u8,
    func: abi.Function,
    args: std.StringHashMap([]const u8),
) !usize {
    // Check if the buffer is large enough for at least the selector
    if (out_buffer.len < 4) {
        return EncodeFunctionDataError.BufferTooSmall;
    }
    
    // Validate that all required arguments are provided
    for (func.inputs) |input| {
        if (!args.contains(input.name)) {
            return EncodeFunctionDataError.InvalidArguments;
        }
    }
    
    // Compute function selector
    var selector: [4]u8 = undefined;
    try compute_function_selector.getFunctionSelector(func, &selector);
    
    // Copy selector to the output buffer
    std.mem.copy(u8, out_buffer[0..4], &selector);
    
    // Encode arguments to the rest of the buffer
    const encoded_len = try encode_abi_parameters.encodeAbiParameters(
        out_buffer[4..],
        func.inputs,
        args
    );
    
    // Return total bytes written
    return 4 + encoded_len;
}

/// Encodes a function call with its arguments as a direct byte array
///
/// This version accepts raw values as bytes and doesn't require an ABI structure
///
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// function_signature: Function signature string (e.g., "transfer(address,uint256)")
/// values: Values to encode in order
///
/// Returns the number of bytes written to out_buffer
pub fn encodeFunctionDataRaw(
    out_buffer: []u8,
    function_signature: []const u8,
    values: []const []const u8,
) !usize {
    // Check if the buffer is large enough for at least the selector
    if (out_buffer.len < 4) {
        return EncodeFunctionDataError.BufferTooSmall;
    }
    
    // Compute function selector from signature
    var selector: [4]u8 = undefined;
    compute_function_selector.computeFunctionSelector(function_signature, &selector);
    
    // Copy selector to the output buffer
    std.mem.copy(u8, out_buffer[0..4], &selector);
    
    // If there are no parameters, just return the selector
    if (values.len == 0) {
        return 4;
    }
    
    // Extract parameter types from function signature by parsing
    // e.g., "transfer(address,uint256)" -> ["address", "uint256"]
    const param_start = std.mem.indexOf(u8, function_signature, "(") orelse return EncodeFunctionDataError.InvalidArguments;
    const param_end = std.mem.lastIndexOf(u8, function_signature, ")") orelse return EncodeFunctionDataError.InvalidArguments;
    
    if (param_end <= param_start + 1) {
        // Empty parameter list, nothing to encode beyond selector
        return 4;
    }
    
    const param_types_str = function_signature[param_start + 1 .. param_end];
    
    // Parse parameter types
    var param_types = std.ArrayList([]const u8).init(std.heap.page_allocator);
    defer param_types.deinit();
    
    var start: usize = 0;
    var nested_level: usize = 0;
    
    for (param_types_str, 0..) |c, i| {
        if (c == '(' or c == '[') {
            nested_level += 1;
        } else if (c == ')' or c == ']') {
            nested_level -= 1;
        } else if (c == ',' and nested_level == 0) {
            try param_types.append(param_types_str[start..i]);
            start = i + 1;
        }
    }
    
    // Add the last type
    try param_types.append(param_types_str[start..]);
    
    // Validate that parameters and values length match
    if (param_types.items.len != values.len) {
        return EncodeFunctionDataError.InvalidArguments;
    }
    
    // Create parameters and a map for encoding
    var params = std.ArrayList(abi.Param).init(std.heap.page_allocator);
    defer params.deinit();
    
    var args = std.StringHashMap([]const u8).init(std.heap.page_allocator);
    defer args.deinit();
    
    // Create param objects with generated names
    for (param_types.items, 0..) |type_str, i| {
        var name_buf: [16]u8 = undefined; // Buffer for parameter name (param0, param1, etc.)
        const param_name = std.fmt.bufPrint(&name_buf, "param{d}", .{i}) catch return EncodeFunctionDataError.InvalidArguments;
        
        try params.append(.{
            .ty = type_str,
            .name = param_name,
            .components = &[_]abi.Param{},
            .internal_type = null,
        });
        
        try args.put(param_name, values[i]);
    }
    
    // Encode the arguments
    const encoded_len = try encode_abi_parameters.encodeAbiParameters(
        out_buffer[4..],
        params.items,
        args,
    );
    
    // Return total bytes written
    return 4 + encoded_len;
}

/// Tests for function data encoding
test "encodeFunctionData basic" {
    const testing = std.testing;
    
    // Define ABI items for a sample contract
    const abi_items = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &[_]abi.Param{
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
                },
                .outputs = &[_]abi.Param{
                    .{
                        .ty = "bool",
                        .name = "success",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
    };
    
    // Test encoding transfer function call
    var args = std.StringHashMap([]const u8).init(testing.allocator);
    defer args.deinit();
    
    // Address: 0x1234567890123456789012345678901234567890
    const to_address = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    try args.put("to", &to_address);
    
    // Amount: 1000000000000000000 (1 ETH)
    const amount = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00};
    try args.put("amount", &amount);
    
    // Buffer to hold the result
    var result: [100]u8 = undefined;
    
    const written = try encodeFunctionData(&result, &abi_items, "transfer", args);
    
    // Verify the result starts with the correct selector for transfer(address,uint256)
    // Expected: 0xa9059cbb
    try testing.expectEqual(@as(usize, 68), written); // 4 bytes selector + 64 bytes params
    try testing.expectEqual(@as(u8, 0xa9), result[0]);
    try testing.expectEqual(@as(u8, 0x05), result[1]);
    try testing.expectEqual(@as(u8, 0x9c), result[2]);
    try testing.expectEqual(@as(u8, 0xbb), result[3]);
}

test "encodeFunctionDataRaw" {
    const testing = std.testing;
    
    // Test a simple call to balanceOf(address)
    const signature = "balanceOf(address)";
    
    // Address: 0x1234567890123456789012345678901234567890
    const address = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    const values = [_][]const u8{&address};
    
    // Buffer to hold the result
    var result: [36]u8 = undefined;
    
    const written = try encodeFunctionDataRaw(&result, signature, &values);
    
    // Verify the result starts with the correct selector for balanceOf(address)
    // Expected: 0x70a08231
    try testing.expectEqual(@as(usize, 36), written); // 4 bytes selector + 32 bytes param
    try testing.expectEqual(@as(u8, 0x70), result[0]);
    try testing.expectEqual(@as(u8, 0xa0), result[1]);
    try testing.expectEqual(@as(u8, 0x82), result[2]);
    try testing.expectEqual(@as(u8, 0x31), result[3]);
}