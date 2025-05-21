const std = @import("std");
const abi = @import("abi.zig");

/// Error type for JSON ABI parsing
pub const JsonAbiError = error{
    InvalidJson,
    InvalidAbi,
    MissingField,
    InvalidValue,
    UnsupportedType,
    OutOfMemory,
};

/// Represents the complete ABI of a contract
pub const JsonAbi = struct {
    /// All ABI items in the contract
    items: std.ArrayList(JsonAbiItem),
    /// Constructor function if present
    constructor: ?*JsonAbiItem,
    /// Fallback function if present
    fallback: ?*JsonAbiItem,
    /// Receive function if present
    receive: ?*JsonAbiItem,
    
    /// Allocator used for all internal allocations
    allocator: std.mem.Allocator,
    
    /// Parse a JSON ABI string into a JsonAbi struct
    pub fn fromJson(json_str: []const u8, allocator: std.mem.Allocator) !JsonAbi {
        // Pseudocode:
        // 1. Parse the JSON string into a JSON value
        // 2. Verify it's an array
        // 3. Create a new JsonAbi with empty items
        // 4. For each item in the array:
        //    - Parse it as a JsonAbiItem
        //    - Add it to the items list
        //    - If it's a constructor/fallback/receive, set the corresponding field
        // 5. Return the populated JsonAbi
        @compileError("Not implemented");
    }
    
    /// Free all memory associated with the JsonAbi
    pub fn deinit(self: *JsonAbi) void {
        // Clean up all allocated memory
        for (self.items.items) |*item| {
            item.deinit();
        }
        self.items.deinit();
    }
    
    /// Return all function items in the ABI
    pub fn functions(self: JsonAbi) []const JsonAbiItem {
        // Filter items to only include functions
        @compileError("Not implemented");
    }
    
    /// Return all event items in the ABI
    pub fn events(self: JsonAbi) []const JsonAbiItem {
        // Filter items to only include events
        @compileError("Not implemented");
    }
    
    /// Return all error items in the ABI
    pub fn errors(self: JsonAbi) []const JsonAbiItem {
        // Filter items to only include errors
        @compileError("Not implemented");
    }
    
    /// Generate a Solidity interface definition from this ABI
    pub fn toSolInterface(self: JsonAbi, name: []const u8, allocator: std.mem.Allocator) ![]u8 {
        // Pseudocode:
        // 1. Create a string builder
        // 2. Add the interface header with name
        // 3. For each function:
        //    - Format the function signature
        //    - Add it to the interface
        // 4. For each event:
        //    - Format the event signature
        //    - Add it to the interface
        // 5. For each error:
        //    - Format the error signature
        //    - Add it to the interface
        // 6. Close the interface definition
        // 7. Return the formatted string
        @compileError("Not implemented");
    }
};

/// Type of ABI item
pub const JsonAbiItemType = enum {
    function,
    constructor,
    fallback,
    receive,
    event,
    error,
};

/// State mutability for functions
pub const StateMutability = enum {
    pure,
    view,
    nonpayable,
    payable,
};

/// A single item in a contract ABI (function, event, error, etc.)
pub const JsonAbiItem = struct {
    /// Type of this ABI item
    type: JsonAbiItemType,
    /// Name of the item (empty for constructor, fallback, receive)
    name: []const u8,
    /// Input parameters
    inputs: std.ArrayList(JsonAbiParam),
    /// Output parameters (empty for events and errors)
    outputs: std.ArrayList(JsonAbiParam),
    /// State mutability (only for functions)
    state_mutability: ?StateMutability, 
    /// Whether the function is payable (legacy field)
    payable: ?bool,
    /// Whether the function is constant (legacy field)
    constant: ?bool,
    /// Whether the event is anonymous (only for events)
    anonymous: ?bool,
    
    /// Allocator used for all internal allocations
    allocator: std.mem.Allocator,
    
    /// Parse a JSON object into a JsonAbiItem
    pub fn fromJson(json_obj: std.json.Value, allocator: std.mem.Allocator) !JsonAbiItem {
        // Pseudocode:
        // 1. Extract type field and parse as JsonAbiItemType
        // 2. Extract name field if present
        // 3. Extract inputs array and parse each as JsonAbiParam
        // 4. Extract outputs array and parse each as JsonAbiParam (if present)
        // 5. Extract state_mutability if present
        // 6. Extract payable and constant fields if present (legacy)
        // 7. Extract anonymous field if present (for events)
        // 8. Return the parsed JsonAbiItem
        @compileError("Not implemented");
    }
    
    /// Free all memory associated with the JsonAbiItem
    pub fn deinit(self: *JsonAbiItem) void {
        allocator.free(self.name);
        for (self.inputs.items) |*input| {
            input.deinit();
        }
        self.inputs.deinit();
        for (self.outputs.items) |*output| {
            output.deinit();
        }
        self.outputs.deinit();
    }
    
    /// Convert this ABI item to a Solidity signature
    pub fn toSolSignature(self: JsonAbiItem, allocator: std.mem.Allocator) ![]u8 {
        // Pseudocode:
        // 1. Create a string builder
        // 2. Add the item type (function, event, error)
        // 3. Add the name if any
        // 4. Format the parameters
        // 5. Add any modifiers (view, payable, etc.)
        // 6. Add return types for functions
        // 7. Return the formatted string
        @compileError("Not implemented");
    }
    
    /// Get the function selector (4-byte signature) for this item
    pub fn selector(self: JsonAbiItem) ![4]u8 {
        // Pseudocode:
        // 1. Generate the canonical signature string
        // 2. Hash it with keccak256
        // 3. Return the first 4 bytes of the hash
        @compileError("Not implemented");
    }
};

/// A parameter in an ABI function or event
pub const JsonAbiParam = struct {
    /// Name of the parameter (may be empty)
    name: []const u8,
    /// Type of the parameter as a string (uint256, address[], etc.)
    type_str: []const u8,
    /// Whether the parameter is indexed (only for events)
    indexed: ?bool,
    /// Components for tuple types
    components: ?std.ArrayList(JsonAbiParam),
    /// Internal type information from Solidity (optional)
    internal_type: ?[]const u8,
    
    /// Allocator used for all internal allocations
    allocator: std.mem.Allocator,
    
    /// Parse a JSON object into a JsonAbiParam
    pub fn fromJson(json_obj: std.json.Value, allocator: std.mem.Allocator) !JsonAbiParam {
        // Pseudocode:
        // 1. Extract name field if present
        // 2. Extract type field
        // 3. Extract indexed field if present
        // 4. Extract components array if present and parse each as JsonAbiParam
        // 5. Extract internalType field if present
        // 6. Return the parsed JsonAbiParam
        @compileError("Not implemented");
    }
    
    /// Free all memory associated with the JsonAbiParam
    pub fn deinit(self: *JsonAbiParam) void {
        self.allocator.free(self.name);
        self.allocator.free(self.type_str);
        if (self.components) |*components| {
            for (components.items) |*component| {
                component.deinit();
            }
            components.deinit();
        }
        if (self.internal_type) |internal_type| {
            self.allocator.free(internal_type);
        }
    }
    
    /// Convert this parameter to a Solidity parameter string
    pub fn toSolParam(self: JsonAbiParam, allocator: std.mem.Allocator) ![]u8 {
        // Pseudocode:
        // 1. Create a string builder
        // 2. Add the parameter type
        // 3. If it's indexed, add the indexed keyword
        // 4. If it has a name, add the name
        // 5. Return the formatted string
        @compileError("Not implemented");
    }
    
    /// Convert this parameter type to an abi.Param
    pub fn toAbiParam(self: JsonAbiParam, allocator: std.mem.Allocator) !abi.Param {
        // Pseudocode:
        // 1. Parse the type_str into a proper abi.Type
        // 2. Create an abi.Param with the name and type
        // 3. Return the abi.Param
        @compileError("Not implemented");
    }
};