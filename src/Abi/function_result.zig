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
    OutOfMemory,
} || encode_abi_parameters.EncodeError || decode_abi_parameters.DecodeError;

/// Encodes function return values according to the ABI specification
///
/// abi_items: Array of ABI items representing contract interface
/// function_name: Name of the function
/// values: HashMap of values to encode by parameter name
///
/// Returns the ABI-encoded return values
pub fn encodeFunctionResult(
    allocator: std.mem.Allocator,
    abi_items: []const abi.AbiItem,
    function_name: []const u8,
    values: std.StringHashMap([]const u8),
) ![]u8 {
    // Find the function in the ABI
    const func = get_abi_item.getFunction(abi_items, function_name) catch {
        return FunctionResultError.FunctionNotFound;
    };
    
    return encodeFunctionResultWithFunction(allocator, func, values);
}

/// Encodes function return values using a specific function ABI definition
///
/// func: ABI function definition
/// values: HashMap of values to encode by parameter name
///
/// Returns the ABI-encoded return values
pub fn encodeFunctionResultWithFunction(
    allocator: std.mem.Allocator,
    func: abi.Function,
    values: std.StringHashMap([]const u8),
) ![]u8 {
    // Validate that all required outputs are provided
    for (func.outputs) |output| {
        if (!values.contains(output.name)) {
            return FunctionResultError.InvalidData;
        }
    }
    
    // Encode the return values directly using encodeAbiParameters
    return encode_abi_parameters.encodeAbiParameters(
        allocator,
        func.outputs,
        values,
    );
}

/// Encodes a single value as a function result
///
/// allocator: Memory allocator for results
/// func: ABI function definition
/// value: Value to encode
///
/// Returns the ABI-encoded return value
pub fn encodeFunctionResultWithValue(
    allocator: std.mem.Allocator,
    func: abi.Function,
    value: []const u8,
) ![]u8 {
    // For single return values, we need to map it to the parameter name
    if (func.outputs.len != 1) {
        return FunctionResultError.InvalidData;
    }
    
    var values = std.StringHashMap([]const u8).init(allocator);
    defer values.deinit();
    
    try values.put(func.outputs[0].name, value);
    
    return encodeFunctionResultWithFunction(allocator, func, values);
}

/// Decodes ABI-encoded function return values
///
/// allocator: Memory allocator for results
/// abi_items: Array of ABI items representing contract interface
/// function_name: Name of the function
/// data: ABI-encoded return values
///
/// Returns a map of decoded return values by parameter name
pub fn decodeFunctionResult(
    allocator: std.mem.Allocator,
    abi_items: []const abi.AbiItem,
    function_name: []const u8,
    data: []const u8,
) !std.StringHashMap([]const u8) {
    // Find the function in the ABI
    const func = get_abi_item.getFunction(abi_items, function_name) catch {
        return FunctionResultError.FunctionNotFound;
    };
    
    return decodeFunctionResultWithFunction(allocator, func, data);
}

/// Decodes ABI-encoded function return values using a specific function ABI definition
///
/// allocator: Memory allocator for results
/// func: ABI function definition
/// data: ABI-encoded return values
///
/// Returns a map of decoded return values by parameter name
pub fn decodeFunctionResultWithFunction(
    allocator: std.mem.Allocator,
    func: abi.Function,
    data: []const u8,
) !std.StringHashMap([]const u8) {
    // Decode the return values directly using decodeAbiParameters
    return decode_abi_parameters.decodeAbiParameters(
        allocator,
        func.outputs,
        data,
    );
}

/// Decodes ABI-encoded function return values as a single value
///
/// This is a convenience function for functions with a single return value
///
/// allocator: Memory allocator for results
/// func: ABI function definition
/// data: ABI-encoded return values
///
/// Returns the decoded return value
pub fn decodeFunctionResultToValue(
    allocator: std.mem.Allocator,
    func: abi.Function,
    data: []const u8,
) ![]u8 {
    // For single return values, we extract it directly from the map
    if (func.outputs.len != 1) {
        return FunctionResultError.InvalidData;
    }
    
    var result = try decodeFunctionResultWithFunction(allocator, func, data);
    defer result.deinit();
    
    const output_name = func.outputs[0].name;
    const value = result.get(output_name) orelse return FunctionResultError.InvalidData;
    
    // Make a copy of the value since we're about to deinit the result map
    return allocator.dupe(u8, value);
}

/// Tests for function result encoding/decoding
test "encodeFunctionResult and decodeFunctionResult basic" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Define ABI items for a sample contract
    const abi_items = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "balanceOf",
                .inputs = &[_]abi.Param{
                    .{
                        .ty = "address",
                        .name = "account",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .outputs = &[_]abi.Param{
                    .{
                        .ty = "uint256",
                        .name = "balance",
                        .components = &[_]abi.Param{},
                        .internal_type = null,
                    },
                },
                .state_mutability = abi.StateMutability.View,
            },
        },
    };
    
    // Test encoding function result
    var values = std.StringHashMap([]const u8).init(alloc);
    defer values.deinit();
    
    // Value: 1000000000000000000 (1 ETH)
    const balance = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00};
    try values.put("balance", &balance);
    
    const encoded = try encodeFunctionResult(alloc, &abi_items, "balanceOf", values);
    defer alloc.free(encoded);
    
    // Verify length is 32 bytes for a single uint256
    try testing.expectEqual(@as(usize, 32), encoded.len);
    
    // Test decoding function result
    const decoded = try decodeFunctionResult(alloc, &abi_items, "balanceOf", encoded);
    defer decoded.deinit();
    
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
    
    const encoded_single = try encodeFunctionResultWithValue(alloc, func, &balance);
    defer alloc.free(encoded_single);
    
    try testing.expectEqualSlices(u8, encoded, encoded_single);
    
    const decoded_single = try decodeFunctionResultToValue(alloc, func, encoded_single);
    defer alloc.free(decoded_single);
    
    // Check that we got a proper uint256 back (32 bytes)
    try testing.expectEqual(@as(usize, 32), decoded_single.len);
    
    // Check that the value part matches our input
    try testing.expectEqualSlices(
        u8,
        &balance,
        decoded_single[decoded_single.len - balance.len..]
    );
}