const std = @import("std");
const abi = @import("abi.zig");

/// Error type for ABI parsing operations
pub const ParseAbiError = error{
    InvalidSignature,
    InvalidParameterType,
    InvalidStateMutability,
    InvalidFormat,
    MissingBracket,
    UnclosedBracket,
    UnexpectedToken,
    OutOfMemory,
    BufferTooSmall,
};

/// Token types for the parser
const TokenType = enum {
    Identifier,
    LeftParen,
    RightParen,
    Comma,
    LeftBracket,
    RightBracket,
    Number,
    Whitespace,
    EndOfInput,
};

/// Token structure for the parser
const Token = struct {
    type: TokenType,
    value: []const u8,
    start: usize,
    end: usize,
};

/// Tokenizer for human-readable ABI
const Tokenizer = struct {
    source: []const u8,
    pos: usize = 0,
    
    fn peek(self: *Tokenizer) ?u8 {
        if (self.pos >= self.source.len) {
            return null;
        }
        return self.source[self.pos];
    }
    
    fn next(self: *Tokenizer) ?u8 {
        if (self.pos >= self.source.len) {
            return null;
        }
        const c = self.source[self.pos];
        self.pos += 1;
        return c;
    }
    
    fn skipWhitespace(self: *Tokenizer) void {
        while (self.peek()) |c| {
            if (c == ' ' or c == '\t' or c == '\n' or c == '\r') {
                _ = self.next();
            } else {
                break;
            }
        }
    }
    
    fn getToken(self: *Tokenizer) !Token {
        self.skipWhitespace();
        
        const start = self.pos;
        
        if (start >= self.source.len) {
            return Token{
                .type = .EndOfInput,
                .value = "",
                .start = start,
                .end = start,
            };
        }
        
        const c = self.next().?;
        
        switch (c) {
            '(' => return Token{
                .type = .LeftParen,
                .value = "(",
                .start = start,
                .end = self.pos,
            },
            ')' => return Token{
                .type = .RightParen,
                .value = ")",
                .start = start,
                .end = self.pos,
            },
            ',' => return Token{
                .type = .Comma,
                .value = ",",
                .start = start,
                .end = self.pos,
            },
            '[' => return Token{
                .type = .LeftBracket,
                .value = "[",
                .start = start,
                .end = self.pos,
            },
            ']' => return Token{
                .type = .RightBracket,
                .value = "]",
                .start = start,
                .end = self.pos,
            },
            '0'...'9' => {
                while (self.peek()) |next_c| {
                    if (next_c >= '0' and next_c <= '9') {
                        _ = self.next();
                    } else {
                        break;
                    }
                }
                
                return Token{
                    .type = .Number,
                    .value = self.source[start..self.pos],
                    .start = start,
                    .end = self.pos,
                };
            },
            'a'...'z', 'A'...'Z', '_', '$' => {
                while (self.peek()) |next_c| {
                    if ((next_c >= 'a' and next_c <= 'z') or
                        (next_c >= 'A' and next_c <= 'Z') or
                        (next_c >= '0' and next_c <= '9') or
                        next_c == '_' or next_c == '$') {
                        _ = self.next();
                    } else {
                        break;
                    }
                }
                
                return Token{
                    .type = .Identifier,
                    .value = self.source[start..self.pos],
                    .start = start,
                    .end = self.pos,
                };
            },
            else => {
                return ParseAbiError.UnexpectedToken;
            },
        }
    }
    
    fn expect(self: *Tokenizer, expected_type: TokenType) !Token {
        const token = try self.getToken();
        
        if (token.type != expected_type) {
            return ParseAbiError.UnexpectedToken;
        }
        
        return token;
    }
    
    fn parseParamList(self: *Tokenizer, param_buffer: []abi.Param) !usize {
        // Expect opening parenthesis
        _ = try self.expect(.LeftParen);
        
        var param_count: usize = 0;
        
        // Check for empty parameter list
        var token = try self.getToken();
        if (token.type == .RightParen) {
            return 0;
        }
        
        // Put the token back
        self.pos = token.start;
        
        // Parse parameters
        while (true) {
            if (param_count >= param_buffer.len) {
                return ParseAbiError.BufferTooSmall;
            }
            
            // Parse parameter type
            const type_token = try self.getToken();
            if (type_token.type != .Identifier) {
                return ParseAbiError.InvalidParameterType;
            }
            
            // Check for array dimensions
            var type_str = type_token.value;
            var array_dims = std.ArrayList(u8).init(std.heap.page_allocator);
            defer array_dims.deinit();
            
            while (true) {
                token = try self.getToken();
                
                if (token.type == .LeftBracket) {
                    try array_dims.append('[');
                    
                    // Check for fixed size or dynamic array
                    token = try self.getToken();
                    if (token.type == .Number) {
                        try array_dims.appendSlice(token.value);
                        _ = try self.expect(.RightBracket);
                    } else if (token.type == .RightBracket) {
                        // Dynamic array
                    } else {
                        return ParseAbiError.UnexpectedToken;
                    }
                    
                    try array_dims.append(']');
                } else {
                    // Not an array dimension, put the token back
                    self.pos = token.start;
                    break;
                }
            }
            
            // Combine type and array dimensions
            var full_type: []const u8 = undefined;
            if (array_dims.items.len > 0) {
                var full_type_buf = std.ArrayList(u8).init(std.heap.page_allocator);
                defer full_type_buf.deinit();
                
                try full_type_buf.appendSlice(type_str);
                try full_type_buf.appendSlice(array_dims.items);
                
                full_type = full_type_buf.items;
            } else {
                full_type = type_str;
            }
            
            // Parse optional parameter name
            token = try self.getToken();
            var param_name: []const u8 = "";
            
            if (token.type == .Identifier) {
                param_name = token.value;
                token = try self.getToken();
            }
            
            // Set up the parameter in the buffer
            param_buffer[param_count] = .{
                .ty = full_type,
                .name = param_name,
                .components = &[_]abi.Param{},
                .internal_type = null,
            };
            
            param_count += 1;
            
            // Check for end of list or comma
            if (token.type == .RightParen) {
                break;
            } else if (token.type == .Comma) {
                continue;
            } else {
                return ParseAbiError.UnexpectedToken;
            }
        }
        
        return param_count;
    }
    
    fn parseEventParamList(self: *Tokenizer, param_buffer: []abi.EventParam) !usize {
        // Expect opening parenthesis
        _ = try self.expect(.LeftParen);
        
        var param_count: usize = 0;
        
        // Check for empty parameter list
        var token = try self.getToken();
        if (token.type == .RightParen) {
            return 0;
        }
        
        // Put the token back
        self.pos = token.start;
        
        // Parse parameters
        while (true) {
            if (param_count >= param_buffer.len) {
                return ParseAbiError.BufferTooSmall;
            }
            
            // Check for indexed flag
            var indexed = false;
            token = try self.getToken();
            
            if (token.type == .Identifier and std.mem.eql(u8, token.value, "indexed")) {
                indexed = true;
                token = try self.getToken();
            } else {
                // Put the token back
                self.pos = token.start;
                token = try self.getToken();
            }
            
            // Parse parameter type
            if (token.type != .Identifier) {
                return ParseAbiError.InvalidParameterType;
            }
            
            // Check for array dimensions
            var type_str = token.value;
            var array_dims = std.ArrayList(u8).init(std.heap.page_allocator);
            defer array_dims.deinit();
            
            while (true) {
                token = try self.getToken();
                
                if (token.type == .LeftBracket) {
                    try array_dims.append('[');
                    
                    // Check for fixed size or dynamic array
                    token = try self.getToken();
                    if (token.type == .Number) {
                        try array_dims.appendSlice(token.value);
                        _ = try self.expect(.RightBracket);
                    } else if (token.type == .RightBracket) {
                        // Dynamic array
                    } else {
                        return ParseAbiError.UnexpectedToken;
                    }
                    
                    try array_dims.append(']');
                } else {
                    // Not an array dimension, put the token back
                    self.pos = token.start;
                    break;
                }
            }
            
            // Combine type and array dimensions
            var full_type: []const u8 = undefined;
            if (array_dims.items.len > 0) {
                var full_type_buf = std.ArrayList(u8).init(std.heap.page_allocator);
                defer full_type_buf.deinit();
                
                try full_type_buf.appendSlice(type_str);
                try full_type_buf.appendSlice(array_dims.items);
                
                full_type = full_type_buf.items;
            } else {
                full_type = type_str;
            }
            
            // Parse optional parameter name
            token = try self.getToken();
            var param_name: []const u8 = "";
            
            if (token.type == .Identifier) {
                param_name = token.value;
                token = try self.getToken();
            }
            
            // Set up the parameter in the buffer
            param_buffer[param_count] = .{
                .ty = full_type,
                .name = param_name,
                .indexed = indexed,
                .components = &[_]abi.Param{},
                .internal_type = null,
            };
            
            param_count += 1;
            
            // Check for end of list or comma
            if (token.type == .RightParen) {
                break;
            } else if (token.type == .Comma) {
                continue;
            } else {
                return ParseAbiError.UnexpectedToken;
            }
        }
        
        return param_count;
    }
    
    fn parseStateMutability(self: *Tokenizer) !abi.StateMutability {
        self.skipWhitespace();
        
        // Check for state mutability keywords
        const token = try self.getToken();
        
        if (token.type == .Identifier) {
            if (std.mem.eql(u8, token.value, "pure")) {
                return abi.StateMutability.Pure;
            } else if (std.mem.eql(u8, token.value, "view")) {
                return abi.StateMutability.View;
            } else if (std.mem.eql(u8, token.value, "payable")) {
                return abi.StateMutability.Payable;
            } else {
                // Put the token back
                self.pos = token.start;
            }
        } else {
            // Put the token back
            self.pos = token.start;
        }
        
        // Default to nonpayable
        return abi.StateMutability.NonPayable;
    }
};

/// Parse human-readable ABI string (Solidity-like) into an ABI item
///
/// signature: Human-readable ABI signature (e.g., "function foo(uint256 bar) returns (bool)")
/// out_item: Pre-allocated ABI item to store the result
///
/// Populates the out_item with the parsed ABI item
pub fn parseAbiItem(signature: []const u8, out_item: *abi.AbiItem) !void {
    var tokenizer = Tokenizer{ .source = signature };
    
    // Read the item type (function, event, etc.)
    const item_type = try tokenizer.expect(.Identifier);
    
    if (std.mem.eql(u8, item_type.value, "function")) {
        try parseFunctionSignature(&tokenizer, out_item);
    } else if (std.mem.eql(u8, item_type.value, "event")) {
        try parseEventSignature(&tokenizer, out_item);
    } else if (std.mem.eql(u8, item_type.value, "error")) {
        try parseErrorSignature(&tokenizer, out_item);
    } else if (std.mem.eql(u8, item_type.value, "constructor")) {
        try parseConstructorSignature(&tokenizer, out_item);
    } else if (std.mem.eql(u8, item_type.value, "fallback")) {
        try parseFallbackSignature(&tokenizer, out_item);
    } else if (std.mem.eql(u8, item_type.value, "receive")) {
        try parseReceiveSignature(&tokenizer, out_item);
    } else {
        return ParseAbiError.InvalidFormat;
    }
}

/// Parse a function signature
fn parseFunctionSignature(tokenizer: *Tokenizer, out_item: *abi.AbiItem) !void {
    // Read function name
    const name_token = try tokenizer.expect(.Identifier);
    
    // Read input parameters
    var input_params: [16]abi.Param = undefined;
    const input_count = try tokenizer.parseParamList(&input_params);
    
    // Set up function outputs and state mutability
    var output_params: [16]abi.Param = undefined;
    var output_count: usize = 0;
    var state_mutability = abi.StateMutability.NonPayable;
    
    // Check for state mutability and/or returns
    tokenizer.skipWhitespace();
    
    // Check for state mutability
    state_mutability = try tokenizer.parseStateMutability();
    
    // Check for returns
    tokenizer.skipWhitespace();
    var token = try tokenizer.getToken();
    
    if (token.type == .Identifier and std.mem.eql(u8, token.value, "returns")) {
        output_count = try tokenizer.parseParamList(&output_params);
    } else {
        // Put the token back
        tokenizer.pos = token.start;
    }
    
    // Set up the function item
    out_item.* = .{
        .Function = .{
            .name = name_token.value,
            .inputs = input_params[0..input_count],
            .outputs = output_params[0..output_count],
            .state_mutability = state_mutability,
        },
    };
}

/// Parse an event signature
fn parseEventSignature(tokenizer: *Tokenizer, out_item: *abi.AbiItem) !void {
    // Read event name
    const name_token = try tokenizer.expect(.Identifier);
    
    // Read event parameters
    var params: [16]abi.EventParam = undefined;
    const param_count = try tokenizer.parseEventParamList(&params);
    
    // Check for anonymous modifier
    tokenizer.skipWhitespace();
    var anonymous = false;
    var token = try tokenizer.getToken();
    
    if (token.type == .Identifier and std.mem.eql(u8, token.value, "anonymous")) {
        anonymous = true;
    } else {
        // Put the token back
        tokenizer.pos = token.start;
    }
    
    // Set up the event item
    out_item.* = .{
        .Event = .{
            .name = name_token.value,
            .inputs = params[0..param_count],
            .anonymous = anonymous,
        },
    };
}

/// Parse an error signature
fn parseErrorSignature(tokenizer: *Tokenizer, out_item: *abi.AbiItem) !void {
    // Read error name
    const name_token = try tokenizer.expect(.Identifier);
    
    // Read error parameters
    var params: [16]abi.Param = undefined;
    const param_count = try tokenizer.parseParamList(&params);
    
    // Set up the error item
    out_item.* = .{
        .Error = .{
            .name = name_token.value,
            .inputs = params[0..param_count],
        },
    };
}

/// Parse a constructor signature
fn parseConstructorSignature(tokenizer: *Tokenizer, out_item: *abi.AbiItem) !void {
    // Read constructor parameters
    var params: [16]abi.Param = undefined;
    const param_count = try tokenizer.parseParamList(&params);
    
    // Read state mutability
    const state_mutability = try tokenizer.parseStateMutability();
    
    // Set up the constructor item
    out_item.* = .{
        .Constructor = .{
            .inputs = params[0..param_count],
            .state_mutability = state_mutability,
        },
    };
}

/// Parse a fallback signature
fn parseFallbackSignature(tokenizer: *Tokenizer, out_item: *abi.AbiItem) !void {
    // Read empty parameter list
    var params: [1]abi.Param = undefined;
    const param_count = try tokenizer.parseParamList(&params);
    
    if (param_count != 0) {
        return ParseAbiError.InvalidFormat;
    }
    
    // Read state mutability
    const state_mutability = try tokenizer.parseStateMutability();
    
    // Set up the fallback item
    out_item.* = .{
        .Fallback = .{
            .state_mutability = state_mutability,
        },
    };
}

/// Parse a receive signature
fn parseReceiveSignature(tokenizer: *Tokenizer, out_item: *abi.AbiItem) !void {
    // Read empty parameter list
    var params: [1]abi.Param = undefined;
    const param_count = try tokenizer.parseParamList(&params);
    
    if (param_count != 0) {
        return ParseAbiError.InvalidFormat;
    }
    
    // Read state mutability (should be payable)
    const state_mutability = try tokenizer.parseStateMutability();
    
    if (state_mutability != abi.StateMutability.Payable) {
        return ParseAbiError.InvalidStateMutability;
    }
    
    // Set up the receive item
    out_item.* = .{
        .Receive = .{
            .state_mutability = state_mutability,
        },
    };
}

/// Parse an array of human-readable ABI strings
///
/// signatures: Array of human-readable ABI signatures
/// out_items: Pre-allocated array to store the parsed ABI items
///
/// Returns the number of items parsed
pub fn parseAbi(signatures: []const []const u8, out_items: []abi.AbiItem) !usize {
    var item_count: usize = 0;
    
    for (signatures) |signature| {
        if (item_count >= out_items.len) {
            return ParseAbiError.BufferTooSmall;
        }
        
        try parseAbiItem(signature, &out_items[item_count]);
        item_count += 1;
    }
    
    return item_count;
}

/// Tests for ABI parsing
test "parseAbiItem function" {
    const testing = std.testing;
    
    // Test parsing a function
    const func_sig = "function transfer(address to, uint256 amount) returns (bool)";
    var item: abi.AbiItem = undefined;
    try parseAbiItem(func_sig, &item);
    
    switch (item) {
        .Function => |func| {
            try testing.expectEqualStrings("transfer", func.name);
            try testing.expectEqual(@as(usize, 2), func.inputs.len);
            try testing.expectEqualStrings("address", func.inputs[0].ty);
            try testing.expectEqualStrings("to", func.inputs[0].name);
            try testing.expectEqualStrings("uint256", func.inputs[1].ty);
            try testing.expectEqualStrings("amount", func.inputs[1].name);
            try testing.expectEqual(@as(usize, 1), func.outputs.len);
            try testing.expectEqualStrings("bool", func.outputs[0].ty);
            try testing.expectEqual(abi.StateMutability.NonPayable, func.state_mutability);
        },
        else => {
            try testing.expect(false);
        },
    }
}

test "parseAbiItem event" {
    const testing = std.testing;
    
    // Test parsing an event
    const event_sig = "event Transfer(address indexed from, address indexed to, uint256 value)";
    var item: abi.AbiItem = undefined;
    try parseAbiItem(event_sig, &item);
    
    switch (item) {
        .Event => |event| {
            try testing.expectEqualStrings("Transfer", event.name);
            try testing.expectEqual(@as(usize, 3), event.inputs.len);
            try testing.expectEqualStrings("address", event.inputs[0].ty);
            try testing.expectEqualStrings("from", event.inputs[0].name);
            try testing.expect(event.inputs[0].indexed);
            try testing.expectEqualStrings("address", event.inputs[1].ty);
            try testing.expectEqualStrings("to", event.inputs[1].name);
            try testing.expect(event.inputs[1].indexed);
            try testing.expectEqualStrings("uint256", event.inputs[2].ty);
            try testing.expectEqualStrings("value", event.inputs[2].name);
            try testing.expect(!event.inputs[2].indexed);
            try testing.expect(!event.anonymous);
        },
        else => {
            try testing.expect(false);
        },
    }
}

test "parseAbiItem constructor" {
    const testing = std.testing;
    
    // Test parsing a constructor
    const constructor_sig = "constructor(string name, string symbol) payable";
    var item: abi.AbiItem = undefined;
    try parseAbiItem(constructor_sig, &item);
    
    switch (item) {
        .Constructor => |constructor| {
            try testing.expectEqual(@as(usize, 2), constructor.inputs.len);
            try testing.expectEqualStrings("string", constructor.inputs[0].ty);
            try testing.expectEqualStrings("name", constructor.inputs[0].name);
            try testing.expectEqualStrings("string", constructor.inputs[1].ty);
            try testing.expectEqualStrings("symbol", constructor.inputs[1].name);
            try testing.expectEqual(abi.StateMutability.Payable, constructor.state_mutability);
        },
        else => {
            try testing.expect(false);
        },
    }
}

test "parseAbi multiple items" {
    const testing = std.testing;
    
    const signatures = [_][]const u8{
        "function transfer(address to, uint256 amount) returns (bool)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
        "constructor(string name, string symbol) payable",
    };
    
    var items: [3]abi.AbiItem = undefined;
    const count = try parseAbi(&signatures, &items);
    
    try testing.expectEqual(@as(usize, 3), count);
    
    // Check first item is a function
    switch (items[0]) {
        .Function => |func| {
            try testing.expectEqualStrings("transfer", func.name);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Check second item is an event
    switch (items[1]) {
        .Event => |event| {
            try testing.expectEqualStrings("Transfer", event.name);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Check third item is a constructor
    switch (items[2]) {
        .Constructor => {},
        else => {
            try testing.expect(false);
        },
    }
}