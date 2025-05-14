const std = @import("std");
const abi = @import("abi.zig");
const encode_abi_parameters = @import("encode_abi_parameters.zig");
const compute_function_selector = @import("compute_function_selector.zig");

/// Error type for function data encoding operations
pub const EncodeFunctionDataError = error{
    FunctionNotFound,
    InvalidArguments,
    InvalidAbi,
    OutOfMemory,
} || encode_abi_parameters.EncodeError;

/// Encodes a function call with its arguments according to the ABI specification
///
/// abi_items: Array of ABI items representing contract interface
/// function_name: Name of the function to call
/// args: Arguments to pass to the function
///
/// Returns a byte array that contains the function selector followed by encoded arguments
pub fn encodeFunctionData(
    allocator: std.mem.Allocator,
    abi_items: []const abi.AbiItem,
    function_name: []const u8,
    args: std.StringHashMap([]const u8),
) ![]u8 {
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
    
    return encodeFunctionDataWithFunction(allocator, func_opt.?, args);
}

/// Encodes a function call with its arguments using a specific function ABI definition
///
/// func: ABI function definition
/// args: Arguments to pass to the function
///
/// Returns a byte array that contains the function selector followed by encoded arguments
pub fn encodeFunctionDataWithFunction(
    allocator: std.mem.Allocator,
    func: abi.Function,
    args: std.StringHashMap([]const u8),
) ![]u8 {
    // Validate that all required arguments are provided
    for (func.inputs) |input| {
        if (!args.contains(input.name)) {
            return EncodeFunctionDataError.InvalidArguments;
        }
    }
    
    // Compute function selector
    const selector = compute_function_selector.getFunctionSelector(func);
    
    // Encode arguments
    const encoded_args = try encode_abi_parameters.encodeAbiParameters(
        allocator,
        func.inputs,
        args,
    );
    defer allocator.free(encoded_args);
    
    // Combine selector and encoded arguments
    var result = try allocator.alloc(u8, 4 + encoded_args.len);
    std.mem.copy(u8, result[0..4], &selector);
    std.mem.copy(u8, result[4..], encoded_args);
    
    return result;
}

/// Encodes a function call with its arguments as a direct byte array
///
/// This version accepts raw values as bytes and doesn't require an ABI structure
///
/// function_signature: Function signature string (e.g., "transfer(address,uint256)")
/// values: Values to encode in order
///
/// Returns a byte array that contains the function selector followed by encoded parameters
pub fn encodeFunctionDataRaw(
    allocator: std.mem.Allocator,
    function_signature: []const u8,
    values: []const []const u8,
) ![]u8 {
    // Compute function selector from signature
    const selector = compute_function_selector.computeFunctionSelector(function_signature);
    
    // Build parameters from the signature
    // (This is a simplification - a real implementation would need
    // to parse the signature and extract parameter types)
    
    // Parse out parameter types from signature
    var params = std.ArrayList(abi.Param).init(allocator);
    defer params.deinit();
    
    // Extract parameter types from function signature by parsing
    // e.g., "transfer(address,uint256)" -> ["address", "uint256"]
    const param_start = std.mem.indexOf(u8, function_signature, "(") orelse return EncodeFunctionDataError.InvalidArguments;
    const param_end = std.mem.lastIndexOf(u8, function_signature, ")") orelse return EncodeFunctionDataError.InvalidArguments;
    
    if (param_end <= param_start + 1) {
        // Empty parameter list, nothing to encode beyond selector
        var result = try allocator.alloc(u8, 4);
        std.mem.copy(u8, result[0..4], &selector);
        return result;
    }
    
    const param_types_str = function_signature[param_start + 1 .. param_end];
    
    // Split by commas
    var param_types = std.ArrayList([]const u8).init(allocator);
    defer param_types.deinit();
    
    var current_type_start: usize = 0;
    var nested_level: usize = 0;
    
    for (param_types_str, 0..) |c, i| {
        if (c == '(' or c == '[') {
            nested_level += 1;
        } else if (c == ')' or c == ']') {
            nested_level -= 1;
        } else if (c == ',' and nested_level == 0) {
            try param_types.append(param_types_str[current_type_start..i]);
            current_type_start = i + 1;
        }
    }
    
    // Add the last type
    try param_types.append(param_types_str[current_type_start..]);
    
    // Validate that parameters and values length match
    if (param_types.items.len != values.len) {
        return EncodeFunctionDataError.InvalidArguments;
    }
    
    // Create param objects with generated names
    for (param_types.items, 0..) |type_str, i| {
        const param_name = try std.fmt.allocPrint(allocator, "param{d}", .{i});
        defer allocator.free(param_name);
        
        try params.append(.{
            .ty = type_str,
            .name = param_name,
            .components = &[_]abi.Param{},
            .internal_type = null,
        });
    }
    
    // Create a map from param names to values
    var args = std.StringHashMap([]const u8).init(allocator);
    defer args.deinit();
    
    for (params.items, 0..) |param, i| {
        const param_name = try std.fmt.allocPrint(allocator, "param{d}", .{i});
        defer allocator.free(param_name);
        
        try args.put(param_name, values[i]);
    }
    
    // Encode the arguments
    const encoded_args = try encode_abi_parameters.encodeAbiParameters(
        allocator,
        params.items,
        args,
    );
    defer allocator.free(encoded_args);
    
    // Combine selector and encoded arguments
    var result = try allocator.alloc(u8, 4 + encoded_args.len);
    std.mem.copy(u8, result[0..4], &selector);
    std.mem.copy(u8, result[4..], encoded_args);
    
    return result;
}

/// Tests for function data encoding
test "encodeFunctionData basic" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
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
    var args = std.StringHashMap([]const u8).init(alloc);
    defer args.deinit();
    
    // Address: 0x1234567890123456789012345678901234567890
    const to_address = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    try args.put("to", &to_address);
    
    // Amount: 1000000000000000000 (1 ETH)
    const amount = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00};
    try args.put("amount", &amount);
    
    const result = try encodeFunctionData(alloc, &abi_items, "transfer", args);
    defer alloc.free(result);
    
    // Verify the result starts with the correct selector for transfer(address,uint256)
    // Expected: 0xa9059cbb
    try testing.expectEqual(@as(u8, 0xa9), result[0]);
    try testing.expectEqual(@as(u8, 0x05), result[1]);
    try testing.expectEqual(@as(u8, 0x9c), result[2]);
    try testing.expectEqual(@as(u8, 0xbb), result[3]);
    
    // Verify total length is correct: 4 bytes selector + 2*32 bytes parameters
    try testing.expectEqual(@as(usize, 68), result.len);
}

test "encodeFunctionDataRaw" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Test a simple call to balanceOf(address)
    const signature = "balanceOf(address)";
    
    // Address: 0x1234567890123456789012345678901234567890
    const address = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    const values = [_][]const u8{&address};
    
    const result = try encodeFunctionDataRaw(alloc, signature, &values);
    defer alloc.free(result);
    
    // Verify the result starts with the correct selector for balanceOf(address)
    // Expected: 0x70a08231
    try testing.expectEqual(@as(u8, 0x70), result[0]);
    try testing.expectEqual(@as(u8, 0xa0), result[1]);
    try testing.expectEqual(@as(u8, 0x82), result[2]);
    try testing.expectEqual(@as(u8, 0x31), result[3]);
    
    // Verify total length is correct: 4 bytes selector + 32 bytes parameter
    try testing.expectEqual(@as(usize, 36), result.len);
}