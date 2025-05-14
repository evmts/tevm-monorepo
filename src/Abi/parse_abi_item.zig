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
    
    fn expect(self: *Tokenizer, expected: u8) !void {
        const c = self.next() orelse return ParseAbiError.UnexpectedToken;
        if (c != expected) {
            return ParseAbiError.UnexpectedToken;
        }
    }
    
    fn readIdent(self: *Tokenizer) ![]const u8 {
        self.skipWhitespace();
        const start = self.pos;
        
        while (self.peek()) |c| {
            if (std.ascii.isAlphanumeric(c) or c == '_' or c == '$') {
                _ = self.next();
            } else {
                break;
            }
        }
        
        if (start == self.pos) {
            return ParseAbiError.UnexpectedToken;
        }
        
        return self.source[start..self.pos];
    }
    
    fn readType(self: *Tokenizer) ![]const u8 {
        self.skipWhitespace();
        const start = self.pos;
        var bracket_depth: usize = 0;
        
        while (self.peek()) |c| {
            if (bracket_depth == 0 and (c == ',' or c == ')')) {
                break;
            }
            
            _ = self.next();
            
            if (c == '[') {
                bracket_depth += 1;
            } else if (c == ']') {
                if (bracket_depth == 0) {
                    return ParseAbiError.UnexpectedToken;
                }
                bracket_depth -= 1;
            }
        }
        
        if (bracket_depth != 0) {
            return ParseAbiError.UnclosedBracket;
        }
        
        if (start == self.pos) {
            return ParseAbiError.UnexpectedToken;
        }
        
        return self.source[start..self.pos];
    }
    
    fn readParamList(self: *Tokenizer, allocator: std.mem.Allocator) ![]abi.Param {
        self.skipWhitespace();
        try self.expect('(');
        
        var params = std.ArrayList(abi.Param).init(allocator);
        defer params.deinit();
        
        self.skipWhitespace();
        if (self.peek() == ')') {
            _ = self.next();
            return params.toOwnedSlice();
        }
        
        while (true) {
            self.skipWhitespace();
            
            // Read parameter type
            const param_type = try self.readType();
            
            // Read parameter name (optional)
            self.skipWhitespace();
            var param_name: []const u8 = "";
            
            // Check if there's a parameter name
            if (self.peek()) |c| {
                if (c != ',' and c != ')') {
                    param_name = try self.readIdent();
                }
            }
            
            // Create parameter
            const param = abi.Param{
                .ty = param_type,
                .name = param_name,
                .components = &[_]abi.Param{},
                .internal_type = null,
            };
            
            try params.append(param);
            
            // Check for end of list or comma
            self.skipWhitespace();
            const next_char = self.next() orelse return ParseAbiError.UnexpectedToken;
            
            if (next_char == ')') {
                break;
            } else if (next_char != ',') {
                return ParseAbiError.UnexpectedToken;
            }
        }
        
        return params.toOwnedSlice();
    }
    
    fn readEventParamList(self: *Tokenizer, allocator: std.mem.Allocator) ![]abi.EventParam {
        self.skipWhitespace();
        try self.expect('(');
        
        var params = std.ArrayList(abi.EventParam).init(allocator);
        defer params.deinit();
        
        self.skipWhitespace();
        if (self.peek() == ')') {
            _ = self.next();
            return params.toOwnedSlice();
        }
        
        while (true) {
            self.skipWhitespace();
            
            // Check for indexed modifier
            var indexed = false;
            if (self.pos + 7 <= self.source.len and 
                std.mem.eql(u8, self.source[self.pos..self.pos+7], "indexed ")) {
                indexed = true;
                self.pos += 7;
                self.skipWhitespace();
            }
            
            // Read parameter type
            const param_type = try self.readType();
            
            // Read parameter name (optional)
            self.skipWhitespace();
            var param_name: []const u8 = "";
            
            // Check if there's a parameter name
            if (self.peek()) |c| {
                if (c != ',' and c != ')') {
                    param_name = try self.readIdent();
                }
            }
            
            // Create parameter
            const param = abi.EventParam{
                .ty = param_type,
                .name = param_name,
                .indexed = indexed,
                .components = &[_]abi.Param{},
                .internal_type = null,
            };
            
            try params.append(param);
            
            // Check for end of list or comma
            self.skipWhitespace();
            const next_char = self.next() orelse return ParseAbiError.UnexpectedToken;
            
            if (next_char == ')') {
                break;
            } else if (next_char != ',') {
                return ParseAbiError.UnexpectedToken;
            }
        }
        
        return params.toOwnedSlice();
    }
    
    fn readStateMutability(self: *Tokenizer) !abi.StateMutability {
        self.skipWhitespace();
        
        // Check for state mutability keywords
        if (self.pos + 4 <= self.source.len and std.mem.eql(u8, self.source[self.pos..self.pos+4], "pure")) {
            self.pos += 4;
            return abi.StateMutability.Pure;
        } else if (self.pos + 4 <= self.source.len and std.mem.eql(u8, self.source[self.pos..self.pos+4], "view")) {
            self.pos += 4;
            return abi.StateMutability.View;
        } else if (self.pos + 7 <= self.source.len and std.mem.eql(u8, self.source[self.pos..self.pos+7], "payable")) {
            self.pos += 7;
            return abi.StateMutability.Payable;
        }
        
        // Default to nonpayable
        return abi.StateMutability.NonPayable;
    }
};

/// Parse human-readable ABI string (Solidity-like) into an ABI item
///
/// allocator: Memory allocator for results
/// signature: Human-readable ABI signature (e.g., "function foo(uint256 bar) returns (bool)")
///
/// Returns the parsed ABI item
pub fn parseAbiItem(allocator: std.mem.Allocator, signature: []const u8) !abi.AbiItem {
    var tokenizer = Tokenizer{ .source = signature };
    
    // Read the item type (function, event, etc.)
    tokenizer.skipWhitespace();
    const item_type = try tokenizer.readIdent();
    
    if (std.mem.eql(u8, item_type, "function")) {
        return parseFunctionSignature(allocator, &tokenizer);
    } else if (std.mem.eql(u8, item_type, "event")) {
        return parseEventSignature(allocator, &tokenizer);
    } else if (std.mem.eql(u8, item_type, "error")) {
        return parseErrorSignature(allocator, &tokenizer);
    } else if (std.mem.eql(u8, item_type, "constructor")) {
        return parseConstructorSignature(allocator, &tokenizer);
    } else if (std.mem.eql(u8, item_type, "fallback")) {
        return parseFallbackSignature(allocator, &tokenizer);
    } else if (std.mem.eql(u8, item_type, "receive")) {
        return parseReceiveSignature(allocator, &tokenizer);
    }
    
    return ParseAbiError.InvalidFormat;
}

/// Parse a function signature
fn parseFunctionSignature(allocator: std.mem.Allocator, tokenizer: *Tokenizer) !abi.AbiItem {
    // Read function name
    tokenizer.skipWhitespace();
    const name = try tokenizer.readIdent();
    
    // Read input parameters
    const inputs = try tokenizer.readParamList(allocator);
    
    // Read state mutability and/or returns
    tokenizer.skipWhitespace();
    
    var state_mutability = abi.StateMutability.NonPayable;
    var outputs = &[_]abi.Param{};
    
    // Check for state mutability
    if (tokenizer.pos + 4 <= tokenizer.source.len and 
        (std.mem.eql(u8, tokenizer.source[tokenizer.pos..tokenizer.pos+4], "pure") or
         std.mem.eql(u8, tokenizer.source[tokenizer.pos..tokenizer.pos+4], "view"))) {
        state_mutability = try tokenizer.readStateMutability();
        tokenizer.skipWhitespace();
    } else if (tokenizer.pos + 7 <= tokenizer.source.len and 
              std.mem.eql(u8, tokenizer.source[tokenizer.pos..tokenizer.pos+7], "payable")) {
        state_mutability = try tokenizer.readStateMutability();
        tokenizer.skipWhitespace();
    }
    
    // Check for returns
    if (tokenizer.pos + 7 <= tokenizer.source.len and 
        std.mem.eql(u8, tokenizer.source[tokenizer.pos..tokenizer.pos+7], "returns")) {
        tokenizer.pos += 7;
        tokenizer.skipWhitespace();
        outputs = try tokenizer.readParamList(allocator);
    }
    
    return abi.AbiItem{
        .Function = .{
            .name = name,
            .inputs = inputs,
            .outputs = outputs,
            .state_mutability = state_mutability,
        },
    };
}

/// Parse an event signature
fn parseEventSignature(allocator: std.mem.Allocator, tokenizer: *Tokenizer) !abi.AbiItem {
    // Read event name
    tokenizer.skipWhitespace();
    const name = try tokenizer.readIdent();
    
    // Read event parameters
    const inputs = try tokenizer.readEventParamList(allocator);
    
    // Check for anonymous modifier
    tokenizer.skipWhitespace();
    var anonymous = false;
    
    if (tokenizer.pos + 9 <= tokenizer.source.len and 
        std.mem.eql(u8, tokenizer.source[tokenizer.pos..tokenizer.pos+9], "anonymous")) {
        anonymous = true;
        tokenizer.pos += 9;
    }
    
    return abi.AbiItem{
        .Event = .{
            .name = name,
            .inputs = inputs,
            .anonymous = anonymous,
        },
    };
}

/// Parse an error signature
fn parseErrorSignature(allocator: std.mem.Allocator, tokenizer: *Tokenizer) !abi.AbiItem {
    // Read error name
    tokenizer.skipWhitespace();
    const name = try tokenizer.readIdent();
    
    // Read error parameters
    const inputs = try tokenizer.readParamList(allocator);
    
    return abi.AbiItem{
        .Error = .{
            .name = name,
            .inputs = inputs,
        },
    };
}

/// Parse a constructor signature
fn parseConstructorSignature(allocator: std.mem.Allocator, tokenizer: *Tokenizer) !abi.AbiItem {
    // Read constructor parameters
    const inputs = try tokenizer.readParamList(allocator);
    
    // Read state mutability
    tokenizer.skipWhitespace();
    const state_mutability = try tokenizer.readStateMutability();
    
    return abi.AbiItem{
        .Constructor = .{
            .inputs = inputs,
            .state_mutability = state_mutability,
        },
    };
}

/// Parse a fallback signature
fn parseFallbackSignature(allocator: std.mem.Allocator, tokenizer: *Tokenizer) !abi.AbiItem {
    // Read empty parameter list
    _ = try tokenizer.readParamList(allocator);
    
    // Read state mutability
    tokenizer.skipWhitespace();
    const state_mutability = try tokenizer.readStateMutability();
    
    return abi.AbiItem{
        .Fallback = .{
            .state_mutability = state_mutability,
        },
    };
}

/// Parse a receive signature
fn parseReceiveSignature(allocator: std.mem.Allocator, tokenizer: *Tokenizer) !abi.AbiItem {
    // Read empty parameter list
    _ = try tokenizer.readParamList(allocator);
    
    // Read state mutability (should be payable)
    tokenizer.skipWhitespace();
    const state_mutability = try tokenizer.readStateMutability();
    
    if (state_mutability != abi.StateMutability.Payable) {
        return ParseAbiError.InvalidStateMutability;
    }
    
    return abi.AbiItem{
        .Receive = .{
            .state_mutability = state_mutability,
        },
    };
}

/// Parse an array of human-readable ABI strings
pub fn parseAbi(allocator: std.mem.Allocator, signatures: []const []const u8) ![]abi.AbiItem {
    var items = std.ArrayList(abi.AbiItem).init(allocator);
    defer items.deinit();
    
    for (signatures) |signature| {
        const item = try parseAbiItem(allocator, signature);
        try items.append(item);
    }
    
    return items.toOwnedSlice();
}

/// Tests for ABI parsing
test "parseAbiItem function" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Test parsing a function
    const func_sig = "function transfer(address to, uint256 amount) returns (bool)";
    const item = try parseAbiItem(alloc, func_sig);
    
    const func = switch (item) {
        .Function => |f| f,
        else => unreachable,
    };
    
    try testing.expectEqualStrings("transfer", func.name);
    try testing.expectEqual(@as(usize, 2), func.inputs.len);
    try testing.expectEqualStrings("address", func.inputs[0].ty);
    try testing.expectEqualStrings("to", func.inputs[0].name);
    try testing.expectEqualStrings("uint256", func.inputs[1].ty);
    try testing.expectEqualStrings("amount", func.inputs[1].name);
    try testing.expectEqual(@as(usize, 1), func.outputs.len);
    try testing.expectEqualStrings("bool", func.outputs[0].ty);
    try testing.expectEqual(abi.StateMutability.NonPayable, func.state_mutability);
}

test "parseAbiItem event" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Test parsing an event
    const event_sig = "event Transfer(address indexed from, address indexed to, uint256 value)";
    const item = try parseAbiItem(alloc, event_sig);
    
    const event = switch (item) {
        .Event => |e| e,
        else => unreachable,
    };
    
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
}

test "parseAbiItem constructor" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    // Test parsing a constructor
    const constructor_sig = "constructor(string name, string symbol) payable";
    const item = try parseAbiItem(alloc, constructor_sig);
    
    const constructor = switch (item) {
        .Constructor => |c| c,
        else => unreachable,
    };
    
    try testing.expectEqual(@as(usize, 2), constructor.inputs.len);
    try testing.expectEqualStrings("string", constructor.inputs[0].ty);
    try testing.expectEqualStrings("name", constructor.inputs[0].name);
    try testing.expectEqualStrings("string", constructor.inputs[1].ty);
    try testing.expectEqualStrings("symbol", constructor.inputs[1].name);
    try testing.expectEqual(abi.StateMutability.Payable, constructor.state_mutability);
}

test "parseAbi multiple items" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();
    
    const signatures = [_][]const u8{
        "function transfer(address to, uint256 amount) returns (bool)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
        "constructor(string name, string symbol) payable",
    };
    
    const items = try parseAbi(alloc, &signatures);
    
    try testing.expectEqual(@as(usize, 3), items.len);
    
    // Check first item is a function
    switch (items[0]) {
        .Function => |func| {
            try testing.expectEqualStrings("transfer", func.name);
        },
        else => unreachable,
    }
    
    // Check second item is an event
    switch (items[1]) {
        .Event => |event| {
            try testing.expectEqualStrings("Transfer", event.name);
        },
        else => unreachable,
    }
    
    // Check third item is a constructor
    switch (items[2]) {
        .Constructor => {},
        else => unreachable,
    }
}