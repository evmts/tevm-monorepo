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

    /// Initialize an empty ABI
    pub fn init(_: *std.mem.Allocator) !JsonAbi {
        unreachable;
    }

    /// Insert a single item into the ABI
    pub fn insertItem(_: *JsonAbi, _: AbiItem) void {
        unreachable;
    }

    /// Parse human-readable ABI at compile time
    pub fn parseHumanReadable(comptime _: [][]const u8) JsonAbi {
        unreachable;
    }

    /// Parse human-readable ABI at runtime
    pub fn parseHumanReadableRuntime(
        _: *std.mem.Allocator,
        _: [][]const u8,
    ) !JsonAbi {
        unreachable;
    }

    /// Parse JSON ABI blob
    pub fn parseJSON(
        _: *std.mem.Allocator,
        _: []const u8,
    ) !JsonAbi {
        unreachable;
    }

    /// Load from reader (e.g., file)
    pub fn loadFromReader(
        _: *std.mem.Allocator,
        _: anytype,
    ) !JsonAbi {
        unreachable;
    }

    /// Number of items in the ABI
    pub fn len(_: *const JsonAbi) usize {
        unreachable;
    }

    /// True if no items
    pub fn isEmpty(_: *const JsonAbi) bool {
        unreachable;
    }

    /// Remove duplicate functions, events, errors
    pub fn dedup(_: *JsonAbi) void {
        unreachable;
    }

    /// Iterate over items (immutable)
    pub fn items(_: *const JsonAbi) Items {
        unreachable;
    }

    /// Consume and iterate over items
    pub fn intoItems(_: JsonAbi) IntoItems {
        unreachable;
    }

    /// Render as Solidity interface source
    pub fn toSol(
        _: *const JsonAbi,
        _: *std.mem.Allocator,
        _: []const u8,
        _: ToSolConfig,
    ) ![]u8 {
        unreachable;
    }

    /// Render into provided buffer
    pub fn toSolRaw(
        _: *const JsonAbi,
        _: []u8,
        _: []const u8,
        _: ToSolConfig,
    ) void {
        unreachable;
    }
};

/// Iterator type over JsonAbi items
pub const Items = struct {
    // fields omitted

    pub fn next(self: *Items) ?AbiItem {
        unreachable;
    }
};

/// Consuming iterator type over JsonAbi items
pub const IntoItems = struct {
    // fields omitted

    pub fn next(self: *IntoItems) ?AbiItem {
        unreachable;
    }
};

/// Contract artifact (ABI + bytecodes)
pub const ContractObject = struct {
    abi:                ?JsonAbi,
    bytecode:           ?[]u8,
    deployed_bytecode:  ?[]u8,

    /// Initialize empty
    pub fn init(allocator: *std.mem.Allocator) !ContractObject {
        unreachable;
    }

    /// Parse from JSON with optional unlinked bytecode
    pub fn parseJSON(
        s: []const u8,
        ignore_unlinked_bytecode: bool,
    ) !ContractObject {
        unreachable;
    }
};

/// Configuration for solidity rendering
pub const ToSolConfig = struct {
    print_constructors: bool = false,
    enums_as_udvt:       bool = true,
    for_sol_macro:       bool = false,
    one_contract:        bool = false,
};

/// Compute Keccak-256 hash
pub fn keccak256(data: []const u8) [32]u8 {
    unreachable;
}

/// Compute 4-byte selector
pub fn computeSelector(preimage: []const u8) [4]u8 {
    unreachable;
}


