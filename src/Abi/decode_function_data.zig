const std = @import("std");
const abi = @import("abi.zig");
const decode_abi_parameters = @import("decode_abi_parameters.zig");
const compute_function_selector = @import("compute_function_selector.zig");

/// Error type for function data decoding operations
pub const DecodeFunctionDataError = error{
    InvalidData,
    FunctionNotFound,
    InvalidSelector,
    BufferTooShort,
    BufferFull,
} || decode_abi_parameters.DecodeError;

/// Result of decoding function data, containing function name and decoded arguments
pub const DecodeFunctionDataResult = struct {
    /// Name of the called function
    function_name: []const u8,
    /// Decoded arguments
    args: std.StringHashMap([]const u8),
};

/// Decodes function call data to function name and arguments
///
/// abi_items: Array of ABI items representing contract interface
/// data: Function call data (selector + encoded args)
/// result: Pre-initialized DecodeFunctionDataResult to store the result
///
/// Populates the result with function name and decoded arguments
pub fn decodeFunctionData(
    allocator: std.mem.Allocator,
    abi_items: []const abi.AbiItem,
    data: []const u8,
) !DecodeFunctionDataResult {
    var result = DecodeFunctionDataResult{
        .function_name = "",
        .args = std.StringHashMap([]const u8).init(allocator),
    };
    if (data.len < 4) {
        return DecodeFunctionDataError.BufferTooShort;
    }
    
    // Extract the function selector (first 4 bytes)
    const selector = [4]u8{data[0], data[1], data[2], data[3]};
    
    // Find the matching function in the ABI
    var func_opt: ?abi.Function = null;
    
    for (abi_items) |item| {
        switch (item) {
            .Function => |func| {
                var func_selector: [4]u8 = undefined;
                compute_function_selector.getFunctionSelector(func, &func_selector) catch continue;
                
                if (std.mem.eql(u8, &selector, &func_selector)) {
                    func_opt = func;
                    result.function_name = func.name;
                    break;
                }
            },
            else => continue,
        }
    }
    
    if (func_opt == null) {
        return DecodeFunctionDataError.FunctionNotFound;
    }
    
    // Decode arguments
    try decodeFunctionDataWithFunction(func_opt.?, data, &result.args);
    
    return result;
}

/// Decodes function call data using a specific function ABI definition
///
/// func: ABI function definition
/// data: Function call data (selector + encoded args)
/// args: Pre-initialized map to store decoded arguments by parameter name
///
/// Populates the args map with decoded argument values
pub fn decodeFunctionDataWithFunction(
    func: abi.Function,
    data: []const u8,
    args: *std.StringHashMap([]const u8),
) !void {
    if (data.len < 4) {
        return DecodeFunctionDataError.BufferTooShort;
    }
    
    // Extract the selector (first 4 bytes) and args (remaining data)
    const selector = [4]u8{data[0], data[1], data[2], data[3]};
    
    // Validate the selector
    var expected_selector: [4]u8 = undefined;
    try compute_function_selector.getFunctionSelector(func, &expected_selector);
    
    if (!std.mem.eql(u8, &selector, &expected_selector)) {
        return DecodeFunctionDataError.InvalidSelector;
    }
    
    // Skip the selector (4 bytes) and decode the rest as arguments
    // Ensure inputs are treated as a slice by accessing the slice directly
    const inputs_slice = func.inputs;
    try decode_abi_parameters.decodeAbiParameters(
        args,
        inputs_slice,
        data[4..],
    );
}

/// A simpler version that only returns the decoded arguments without requiring full ABI
///
/// param_types: Array of parameter type strings
/// data: Function call data (selector + encoded args)
/// args: Pre-initialized map to store decoded arguments by auto-generated parameter names
///
/// Populates the args map with decoded argument values
pub fn decodeFunctionDataRaw(
    param_types: []const []const u8,
    data: []const u8,
    args: *std.StringHashMap([]const u8),
) !void {
    if (data.len < 4) {
        return DecodeFunctionDataError.BufferTooShort;
    }
    
    // Skip the selector (4 bytes)
    const args_data = data[4..];
    
    // Create param objects with generated names
    var params = std.ArrayList(abi.Param).init(std.heap.page_allocator);
    defer params.deinit();
    
    for (param_types, 0..) |ty, i| {
        var name_buf: [16]u8 = undefined; // Buffer for parameter name (param0, param1, etc.)
        const name = std.fmt.bufPrint(&name_buf, "param{d}", .{i}) catch return DecodeFunctionDataError.BufferFull;
        
        try params.append(.{
            .ty = ty,
            .name = name,
            .components = &[_]abi.Param{},
            .internal_type = null,
        });
    }
    
    // Decode the arguments
    try decode_abi_parameters.decodeAbiParameters(
        args,
        params.items,
        args_data,
    );
}

/// Get the function selector from the call data
///
/// data: Function call data
/// out_selector: Pre-allocated 4-byte array to store the result
pub fn getFunctionSelector(data: []const u8, out_selector: *[4]u8) !void {
    if (data.len < 4) {
        return DecodeFunctionDataError.BufferTooShort;
    }
    
    @memcpy(out_selector[0..4], data[0..4]);
}

/// Check if the call data matches a function signature
///
/// data: Function call data
/// signature: Function signature string (e.g., "transfer(address,uint256)")
///
/// Returns true if the call data is for the given function
pub fn isFunction(data: []const u8, signature: []const u8) !bool {
    if (data.len < 4) {
        return DecodeFunctionDataError.BufferTooShort;
    }
    
    var data_selector: [4]u8 = undefined;
    @memcpy(&data_selector, data[0..4]);
    
    var expected_selector: [4]u8 = undefined;
    compute_function_selector.computeFunctionSelector(signature, &expected_selector);
    
    return std.mem.eql(u8, &data_selector, &expected_selector);
}

test "decodeFunctionData basic" {
    const testing = std.testing;
    
    // Define inputs for our test function
    var inputs = [_]abi.Param{
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
    
    // Define outputs for our test function
    const outputs = [_]abi.Param{
        .{
            .ty = "bool",
            .name = "success",
            .components = &[_]abi.Param{},
            .internal_type = null,
        },
    };
    
    // Define ABI items for a sample contract
    const abi_items = [_]abi.AbiItem{
        .{
            .Function = .{
                .name = "transfer",
                .inputs = &inputs,
                .outputs = @constCast(&outputs),
                .state_mutability = abi.StateMutability.NonPayable,
            },
        },
    };
    
    // Create encoded function data for transfer
    // Selector for transfer(address,uint256): 0xa9059cbb
    // Address: 0x1234567890123456789012345678901234567890
    // Amount: 1000000000000000000 (1 ETH)
    
    var data = [_]u8{0xa9, 0x05, 0x9c, 0xbb};
    
    // Address parameter (padded to 32 bytes)
    var address_param = [_]u8{0} ** 32;
    const address = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90};
    @memcpy(address_param[32 - address.len..][0..address.len], &address);
    
    // Amount parameter (padded to 32 bytes)
    var amount_param = [_]u8{0} ** 32;
    const amount = [_]u8{0x0d, 0xe0, 0xb6, 0xb3, 0xa7, 0x64, 0x00, 0x00}; // 1 ETH
    @memcpy(amount_param[32 - amount.len..][0..amount.len], &amount);
    
    // Concatenate all parts
    var full_data = std.ArrayList(u8).init(testing.allocator);
    defer full_data.deinit();
    
    try full_data.appendSlice(&data);
    try full_data.appendSlice(&address_param);
    try full_data.appendSlice(&amount_param);
    
    // Initialize result structures
    var args = std.StringHashMap([]const u8).init(testing.allocator);
    defer args.deinit();
    
    var result = DecodeFunctionDataResult{
        .function_name = "",
        .args = args,
    };
    
    // Now decode the function data
    result = try decodeFunctionData(testing.allocator, &abi_items, full_data.items);
    
    // Check function name
    try testing.expectEqualStrings("transfer", result.function_name);
    
    // Check arguments
    try testing.expect(result.args.contains("to"));
    try testing.expect(result.args.contains("amount"));
    
    // The address should be properly decoded
    const decoded_to = result.args.get("to").?;
    try testing.expectEqual(@as(usize, 32), decoded_to.len);
    
    // The last 20 bytes should match our address
    try testing.expectEqualSlices(u8, &address, decoded_to[32 - address.len..]);
    
    // The amount should be properly decoded
    const decoded_amount = result.args.get("amount").?;
    try testing.expectEqual(@as(usize, 32), decoded_amount.len);
    
    // The last bytes should match our amount
    try testing.expectEqualSlices(u8, &amount, decoded_amount[32 - amount.len..]);
}

test "isFunction" {
    const testing = std.testing;
    
    // Data for transfer(address,uint256)
    const transfer_data = [_]u8{0xa9, 0x05, 0x9c, 0xbb, 0x00, 0x00};
    
    // Check if it matches
    const is_transfer = try isFunction(&transfer_data, "transfer(address,uint256)");
    try testing.expect(is_transfer);
    
    // Check if it doesn't match a different function
    const is_approve = try isFunction(&transfer_data, "approve(address,uint256)");
    try testing.expect(!is_approve);
}