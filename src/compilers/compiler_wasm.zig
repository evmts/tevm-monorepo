const std = @import("std");

/// Compiler error codes matching the Rust enum
pub const ErrorCode = enum(i32) {
    Success = 0,
    SyntaxError = 1,
    VersionError = 2,
    ImportError = 3,
    IoError = 4,
    CompilationError = 5,
    InvalidInput = 6,
    Unknown = 99,
};

/// Compiler error
pub const CompilerError = struct {
    code: ErrorCode,
    message: []const u8,

    pub fn deinit(self: *CompilerError, allocator: std.mem.Allocator) void {
        allocator.free(self.message);
    }
};

/// Compiler settings for configuration
pub const CompilerSettings = struct {
    optimizer_enabled: bool = true,
    optimizer_runs: u32 = 200,
    evm_version: ?[]const u8 = null,
    remappings: []const []const u8 = &.{},
    cache_enabled: bool = true,
    cache_path: ?[]const u8 = null,
    output_abi: bool = true,
    output_bytecode: bool = true,
    output_deployed_bytecode: bool = true,
    output_ast: bool = false,
};

/// Simplified compiled contract for WASM (without zabi dependency)
pub const CompiledContract = struct {
    name: []const u8,
    abi: []const u8, // JSON string instead of zabi type
    bytecode: []const u8,
    deployed_bytecode: []const u8,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *CompiledContract) void {
        self.allocator.free(self.name);
        self.allocator.free(self.abi);
        self.allocator.free(self.bytecode);
        self.allocator.free(self.deployed_bytecode);
    }
};

/// Compilation result
pub const CompilationResult = struct {
    contracts: []CompiledContract,
    errors: []CompilerError,
    warnings: [][]const u8,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *CompilationResult) void {
        for (self.contracts) |*contract| {
            contract.deinit();
        }
        self.allocator.free(self.contracts);

        for (self.errors) |*err| {
            err.deinit(self.allocator);
        }
        self.allocator.free(self.errors);

        for (self.warnings) |warning| {
            self.allocator.free(warning);
        }
        self.allocator.free(self.warnings);
    }
};

/// WASM-compatible compiler interface (stub implementation)
pub const Compiler = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) Compiler {
        return .{ .allocator = allocator };
    }

    pub fn deinit(self: *Compiler) void {
        _ = self;
    }

    /// Stub compile function for WASM
    pub fn compile(
        self: *Compiler,
        source_code: []const u8,
        settings: CompilerSettings,
    ) !CompilationResult {
        _ = source_code;
        _ = settings;

        // For WASM builds, return an error indicating compilation is not supported
        var errors = try self.allocator.alloc(CompilerError, 1);
        errors[0] = .{
            .code = .CompilationError,
            .message = try self.allocator.dupe(u8, "Solidity compilation is not supported in WASM builds"),
        };

        return CompilationResult{
            .contracts = &.{},
            .errors = errors,
            .warnings = &.{},
            .allocator = self.allocator,
        };
    }

    /// Stub version check for WASM
    pub fn get_version(self: *Compiler) ![]const u8 {
        return try self.allocator.dupe(u8, "WASM-stub");
    }
};
