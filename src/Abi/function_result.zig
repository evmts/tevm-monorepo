const std = @import("std");
const abi = @import("abi.zig");
const encode_abi_parameters = @import("encode_abi_parameters.zig");
const decode_abi_parameters = @import("decode_abi_parameters.zig");
const get_abi_item = @import("get_abi_item.zig");

/// Error type for function result operations
pub const FunctionResultError = error{
    FunctionNotFound,
    InvalidAbi,
    InvalidData,
    BufferTooSmall,
    OutOfBounds,
} || encode_abi_parameters.EncodeError || decode_abi_parameters.DecodeError;

/// Encodes function return values according to the ABI specification
///
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// abi_items: Array of ABI items representing contract interface
/// function_name: Name of the function
/// values: HashMap of values to encode by parameter name
///
/// Returns the number of bytes written to out_buffer
pub fn encodeFunctionResult(
    out_buffer: []u8,
    abi_items: []const abi.AbiItem,
    function_name: []const u8,
    values: std.StringHashMap([]const u8),
) !usize {
    // Find the function in the ABI
    const func = get_abi_item.getFunction(abi_items, function_name) catch {
        return FunctionResultError.FunctionNotFound;
    };
    
    return encodeFunctionResultWithFunction(out_buffer, func, values);
}

/// Encodes function return values using a specific function ABI definition
///
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// func: ABI function definition
/// values: HashMap of values to encode by parameter name
///
/// Returns the number of bytes written to out_buffer
pub fn encodeFunctionResultWithFunction(
    out_buffer: []u8,
    func: abi.Function,
    values: std.StringHashMap([]const u8),
) !usize {
    // Validate that all required outputs are provided
    for (func.outputs) |output| {
        if (!values.contains(output.name)) {
            return FunctionResultError.InvalidData;
        }
    }
    
    // Encode the return values directly using encodeAbiParameters
    return encode_abi_parameters.encodeAbiParameters(
        out_buffer,
        func.outputs,
        values,
    );
}

/// Encodes a single value as a function result
///
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// func: ABI function definition
/// value: Value to encode
///
/// Returns the number of bytes written to out_buffer
pub fn encodeFunctionResultWithValue(
    out_buffer: []u8,
    func: abi.Function,
    value: []const u8,
) !usize {
    // For single return values, we need to map it to the parameter name
    if (func.outputs.len != 1) {
        return FunctionResultError.InvalidData;
    }
    
    // Create a hashmap with the single value
    var values = std.StringHashMap([]const u8).init(std.heap.page_allocator);
    defer values.deinit();
    
    try values.put(func.outputs[0].name, value);
    
    return encodeFunctionResultWithFunction(out_buffer, func, values);
}

/// Decodes ABI-encoded function return values
///
/// abi_items: Array of ABI items representing contract interface
/// function_name: Name of the function
/// data: ABI-encoded return values
/// result: Pre-initialized map to store decoded values by parameter name
///
/// Populates the result map with decoded values
pub fn decodeFunctionResult(
    abi_items: []const abi.AbiItem,
    function_name: []const u8,
    data: []const u8,
    result: *std.StringHashMap([]const u8),
) !void {
    // Find the function in the ABI
    const func = get_abi_item.getFunction(abi_items, function_name) catch {
        return FunctionResultError.FunctionNotFound;
    };
    
    return decodeFunctionResultWithFunction(func, data, result);
}

/// Decodes ABI-encoded function return values using a specific function ABI definition
///
/// func: ABI function definition
/// data: ABI-encoded return values
/// result: Pre-initialized map to store decoded values by parameter name
///
/// Populates the result map with decoded values
pub fn decodeFunctionResultWithFunction(
    func: abi.Function,
    data: []const u8,
    result: *std.StringHashMap([]const u8),
) !void {
    // Decode the return values directly using decodeAbiParameters
    try decode_abi_parameters.decodeAbiParameters(
        result,
        func.outputs,
        data,
    );
}

/// Decodes ABI-encoded function return values as a single value
///
/// This is a convenience function for functions with a single return value
///
/// func: ABI function definition
/// data: ABI-encoded return values
/// out_value: Pointer to a slice where the decoded value will be stored
///
/// Stores the decoded value in out_value
pub fn decodeFunctionResultToValue(
    func: abi.Function,
    data: []const u8,
    out_value: *[]const u8,
) !void {
    // For single return values, we extract it directly from the map
    if (func.outputs.len != 1) {
        return FunctionResultError.InvalidData;
    }
    
    var result = std.StringHashMap([]const u8).init(std.heap.page_allocator);
    defer result.deinit();
    
    try decodeFunctionResultWithFunction(func, data, &result);
    
    const output_name = func.outputs[0].name;
    const value = result.get(output_name) orelse return FunctionResultError.InvalidData;
    
    out_value.* = value;
}

test "encodeFunctionResult and decodeFunctionResult basic" {
    const testing = std.testing;
    
    // Define ABI items for a sample contract
    const abi_items = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "balanceOf",
                .inputs = @as([]abi.Param, @constCast(&[_]abi.Param{
                    .{
                        .ty = "address",
                        .name = "account",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                })),
                .outputs = @as([]abi.Param, @constCast(&[_]abi.Param{
                    .{
                        .ty = "uint256",
                        .name = "balance",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                })),
                .state_mutability = abi.StateMutability.View,
            },
        },
    };
    
    // Test encoding function result
    var values = std.StringHashMap([]const u8).init(testing.allocator);
    defer values.deinit();
    
    // Value: 1000000000000000000 (1 ETH)
    const balance = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00};
    try values.put("balance", &balance);
    
    // Buffer to hold the encoded result
    var encoded_buf: [32]u8 = undefined;
    
    const encoded_len = try encodeFunctionResult(&encoded_buf, &abi_items, "balanceOf", values);
    
    // Verify length is 32 bytes for a single uint256
    try testing.expectEqual(@as(usize, 32), encoded_len);
    
    // Test decoding function result
    var decoded = std.StringHashMap([]const u8).init(testing.allocator);
    defer decoded.deinit();
    
    try decodeFunctionResult(&abi_items, "balanceOf", encoded_buf[0..encoded_len], &decoded);
    
    // Check the decoded value
    try testing.expect(decoded.contains("balance"));
    const decoded_balance = decoded.get("balance").?;
    try testing.expectEqual(@as(usize, 32), decoded_balance.len);
    
    // Check that the relevant bytes match
    const expected_suffix = balance.len;
    try testing.expectEqualSlices(
        u8, 
        &balance, 
        decoded_balance[decoded_balance.len - expected_suffix..]
    );
    
    // Test the single-value convenience functions
    const func = get_abi_item.getFunction(&abi_items, "balanceOf") catch unreachable;
    
    // Buffer for encoding with a single value
    var encoded_single_buf: [32]u8 = undefined;
    
    const encoded_single_len = try encodeFunctionResultWithValue(&encoded_single_buf, func, &balance);
    
    try testing.expectEqual(@as(usize, 32), encoded_single_len);
    try testing.expectEqualSlices(u8, encoded_buf[0..encoded_len], encoded_single_buf[0..encoded_single_len]);
    
    // Test decoding to a single value
    var decoded_value: []const u8 = undefined;
    
    try decodeFunctionResultToValue(func, encoded_single_buf[0..encoded_single_len], &decoded_value);
    
    // Check that we got a proper uint256 back (32 bytes)
    try testing.expectEqual(@as(usize, 32), decoded_value.len);
    
    // Check that the value part matches our input
    try testing.expectEqualSlices(
        u8,
        &balance,
        decoded_value[decoded_value.len - balance.len..]
    );
}