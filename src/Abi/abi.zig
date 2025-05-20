const std = @import("std");

/// State mutability of functions and constructors
pub const StateMutability = enum {
    Pure,
    View,
    NonPayable,
    Payable,
};

/// Represents Solidity internal types
pub const InternalType = union(enum) {
    AddressPayable: []const u8,
    Contract:       []const u8,
    Enum: struct {
        contract: ?[]const u8,
        ty:       []const u8,
    },
    Struct: struct {
        contract: ?[]const u8,
        ty:       []const u8,
    },
    Other: struct {
        contract: ?[]const u8,
        ty:       []const u8,
    },
};

/// ABI parameter for inputs and outputs
pub const Param = struct {
    ty:            []const u8,
    name:          []const u8,
    components:    []Param,
    internal_type: ?InternalType,
};

/// ABI event parameter (with indexing)
pub const EventParam = struct {
    ty:            []const u8,
    name:          []const u8,
    indexed:       bool,
    components:    []Param,
    internal_type: ?InternalType,
};

/// Constructor ABI item
pub const Constructor = struct {
    inputs:           []Param,
    state_mutability: StateMutability,
};

/// Function ABI item
pub const Function = struct {
    name:             []const u8,
    inputs:           []Param,
    outputs:          []Param,
    state_mutability: StateMutability,
};

/// Event ABI item
pub const Event = struct {
    name:      []const u8,
    inputs:    []EventParam,
    anonymous: bool,
};

/// Error ABI item
pub const Error = struct {
    name:   []const u8,
    inputs: []Param,
};

/// Fallback ABI item
pub const Fallback = struct {
    state_mutability: StateMutability,
};

/// Receive ABI item
pub const Receive = struct {
    state_mutability: StateMutability,
};

/// Union of all ABI items
pub const AbiItem = union(enum) {
    Constructor: Constructor,
    Fallback:    Fallback,
    Receive:     Receive,
    Function:    Function,
    Event:       Event,
    Error:       Error,
};

/// JSON ABI representation
pub const JsonAbi = struct {
    constructor: ?Constructor = null,
    fallback:    ?Fallback    = null,
    receive:     ?Receive     = null,
    functions:   std.StringHashMap([]Function),
    events:      std.StringHashMap([]Event),
    errors:      std.StringHashMap([]Error),
};

/// Iterator type over JsonAbi items
pub const Items = struct {};

/// Consuming iterator type over JsonAbi items
pub const IntoItems = struct {};

/// Contract artifact (ABI + bytecodes)
pub const ContractObject = struct {
    abi:                ?JsonAbi,
    bytecode:           ?[]u8,
    deployed_bytecode:  ?[]u8,
};

/// Configuration for solidity rendering
pub const ToSolConfig = struct {
    print_constructors: bool = false,
    enums_as_udvt:       bool = true,
    for_sol_macro:       bool = false,
    one_contract:        bool = false,
};

/// Compute Keccak-256 hash (imported from external implementation)
pub const keccak256 = @import("./compute_function_selector.zig").keccak256;

/// Compute 4-byte selector (imported from external implementation)
pub const computeSelector = @import("./compute_function_selector.zig").computeFunctionSelector;



