const std = @import("std");
const zabi = @import("zabi");
const zabi_abitypes = zabi.abi.abitypes;
const c = @cImport({
    @cInclude("foundry_wrapper.h");
});

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

/// Compiled contract information
pub const CompiledContract = struct {
    name: []const u8,
    abi: []const zabi_abitypes.AbiItem,
    bytecode: []const u8,
    deployed_bytecode: []const u8,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *CompiledContract, allocator: std.mem.Allocator) void {
        allocator.free(self.name);
        // The ABI was parsed with parseFromValueLeaky, so we need to free each item and the array
        for (self.abi) |*item| {
            switch (item.*) {
                .abiFunction => |*f| {
                    allocator.free(f.name);
                    for (f.inputs) |*input| {
                        allocator.free(input.name);
                        if (input.internalType) |it| allocator.free(it);
                    }
                    allocator.free(f.inputs);
                    for (f.outputs) |*output| {
                        allocator.free(output.name);
                        if (output.internalType) |it| allocator.free(it);
                    }
                    allocator.free(f.outputs);
                },
                .abiEvent => |*e| {
                    allocator.free(e.name);
                    for (e.inputs) |*input| {
                        allocator.free(input.name);
                        if (input.internalType) |it| allocator.free(it);
                    }
                    allocator.free(e.inputs);
                },
                .abiError => |*e| {
                    allocator.free(e.name);
                    for (e.inputs) |*input| {
                        allocator.free(input.name);
                        if (input.internalType) |it| allocator.free(it);
                    }
                    allocator.free(e.inputs);
                },
                .abiConstructor => |*ctor| {
                    for (ctor.inputs) |*input| {
                        allocator.free(input.name);
                        if (input.internalType) |it| allocator.free(it);
                    }
                    allocator.free(ctor.inputs);
                },
                .abiFallback, .abiReceive => {},
            }
        }
        allocator.free(self.abi);
        allocator.free(self.bytecode);
        allocator.free(self.deployed_bytecode);
    }
};

/// Compilation result
pub const CompilationResult = struct {
    contracts: []CompiledContract,
    errors: []CompilerError,
    warnings: []CompilerError,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *CompilationResult) void {
        for (self.contracts) |*contract| {
            contract.deinit(self.allocator);
        }
        self.allocator.free(self.contracts);

        for (self.errors) |*err| {
            err.deinit(self.allocator);
        }
        self.allocator.free(self.errors);

        for (self.warnings) |*warning| {
            warning.deinit(self.allocator);
        }
        self.allocator.free(self.warnings);
    }
};

/// Main compiler struct
pub const Compiler = struct {
    /// Compile a Solidity file from the filesystem
    pub fn compile_file(
        allocator: std.mem.Allocator,
        file_path: []const u8,
        settings: CompilerSettings,
    ) !CompilationResult {
        const c_file_path = try allocator.dupeZ(u8, file_path);
        defer allocator.free(c_file_path);

        var c_settings = createCSettings(&settings, allocator) catch |err| {
            return err;
        };
        defer freeCSettings(&c_settings, allocator);

        var result_ptr: ?*c.foundry_CompilationResult = null;
        var error_ptr: ?*c.foundry_FoundryError = null;

        const success = c.foundry_compile_file(
            c_file_path.ptr,
            &c_settings,
            &result_ptr,
            &error_ptr,
        );

        if (success == 0) {
            defer c.foundry_free_error(error_ptr);
            if (error_ptr) |err| {
                _ = c.foundry_get_error_code(err);
                _ = c.foundry_get_error_message(err);
                return error.CompilationFailed;
            }
            return error.UnknownError;
        }

        defer c.foundry_free_compilation_result(result_ptr);
        return try convertCResult(allocator, result_ptr.?);
    }

    /// Compile Solidity source code from memory
    pub fn compile_source(
        allocator: std.mem.Allocator,
        source_name: []const u8,
        source_content: []const u8,
        settings: CompilerSettings,
    ) !CompilationResult {
        const c_source_name = try allocator.dupeZ(u8, source_name);
        defer allocator.free(c_source_name);

        const c_source_content = try allocator.dupeZ(u8, source_content);
        defer allocator.free(c_source_content);

        var c_settings = try createCSettings(&settings, allocator);
        defer freeCSettings(&c_settings, allocator);

        var result_ptr: ?*c.foundry_CompilationResult = null;
        var error_ptr: ?*c.foundry_FoundryError = null;

        const success = c.foundry_compile_source(
            c_source_name.ptr,
            c_source_content.ptr,
            &c_settings,
            &result_ptr,
            &error_ptr,
        );

        if (success == 0) {
            defer c.foundry_free_error(error_ptr);
            if (error_ptr) |err| {
                _ = c.foundry_get_error_code(err);
                _ = c.foundry_get_error_message(err);
                return error.CompilationFailed;
            }
            return error.UnknownError;
        }

        defer c.foundry_free_compilation_result(result_ptr);
        return try convertCResult(allocator, result_ptr.?);
    }

    /// Install a specific Solidity compiler version
    pub fn install_solc_version(allocator: std.mem.Allocator, version: []const u8) !void {
        const c_version = try allocator.dupeZ(u8, version);
        defer allocator.free(c_version);
        var error_ptr: ?*c.foundry_FoundryError = null;

        const success = c.foundry_install_solc_version(c_version.ptr, &error_ptr);

        if (success == 0) {
            defer c.foundry_free_error(error_ptr);
            if (error_ptr) |err| {
                _ = c.foundry_get_error_code(err);
                _ = c.foundry_get_error_message(err);
                return error.VersionInstallFailed;
            }
            return error.UnknownError;
        }
    }

    /// Clear the compilation cache
    pub fn clear_cache(cache_path: ?[]const u8) !void {
        var c_cache_path: [*c]const u8 = null;
        var path_buf: [std.fs.max_path_bytes]u8 = undefined;

        if (cache_path) |path| {
            const c_path = try std.fmt.bufPrintZ(&path_buf, "{s}", .{path});
            c_cache_path = c_path.ptr;
        }

        var error_ptr: ?*c.foundry_FoundryError = null;
        const success = c.foundry_clear_cache(c_cache_path, &error_ptr);

        if (success == 0) {
            defer c.foundry_free_error(error_ptr);
            if (error_ptr) |err| {
                _ = c.foundry_get_error_code(err);
                _ = c.foundry_get_error_message(err);
                return error.CacheClearFailed;
            }
            return error.UnknownError;
        }
    }

    // Helper functions

    fn createCSettings(settings: *const CompilerSettings, allocator: std.mem.Allocator) !c.foundry_CompilerSettings {
        var c_settings = c.foundry_CompilerSettings{
            .optimizer_enabled = settings.optimizer_enabled,
            .optimizer_runs = settings.optimizer_runs,
            .evm_version = null,
            .remappings = null,
            .cache_enabled = settings.cache_enabled,
            .cache_path = null,
            .output_abi = settings.output_abi,
            .output_bytecode = settings.output_bytecode,
            .output_deployed_bytecode = settings.output_deployed_bytecode,
            .output_ast = settings.output_ast,
        };

        // Set EVM version
        if (settings.evm_version) |version| {
            const c_version = try allocator.dupeZ(u8, version);
            c_settings.evm_version = c_version.ptr;
        }

        // Set cache path
        if (settings.cache_path) |path| {
            const c_path = try allocator.dupeZ(u8, path);
            c_settings.cache_path = c_path.ptr;
        }

        // Set remappings
        if (settings.remappings.len > 0) {
            const remapping_ptrs = try allocator.alloc([*c]const u8, settings.remappings.len + 1);
            for (settings.remappings, 0..) |remapping, i| {
                const c_remapping = try allocator.dupeZ(u8, remapping);
                remapping_ptrs[i] = c_remapping.ptr;
            }
            remapping_ptrs[settings.remappings.len] = null; // NULL terminator
            c_settings.remappings = remapping_ptrs.ptr;
        }

        return c_settings;
    }

    fn freeCSettings(settings: *c.foundry_CompilerSettings, allocator: std.mem.Allocator) void {
        if (settings.evm_version) |version| {
            allocator.free(std.mem.span(version));
        }

        if (settings.cache_path) |path| {
            allocator.free(std.mem.span(path));
        }

        if (settings.remappings) |remappings| {
            var i: usize = 0;
            while (remappings[i] != null) : (i += 1) {
                allocator.free(std.mem.span(remappings[i]));
            }
            // Cast to get the slice and free it
            const slice = @as([*][*c]const u8, @constCast(@ptrCast(remappings)))[0 .. i + 1];
            allocator.free(slice);
        }
    }

    fn convertCResult(allocator: std.mem.Allocator, c_result: *c.foundry_CompilationResult) !CompilationResult {
        const contracts = try allocator.alloc(CompiledContract, c_result.contracts_count);
        errdefer allocator.free(contracts);

        for (contracts, 0..) |*contract, i| {
            const c_contract = c_result.contracts[i];

            // Parse the ABI JSON string into zabi types
            const abi_json_str = std.mem.span(c_contract.abi);
            const parsed_json = try std.json.parseFromSlice(std.json.Value, allocator, abi_json_str, .{});
            defer parsed_json.deinit();

            // Convert JSON to zabi Abi type
            const abi_items = try std.json.parseFromValueLeaky(zabi_abitypes.Abi, allocator, parsed_json.value, .{});

            contract.* = CompiledContract{
                .name = try allocator.dupe(u8, std.mem.span(c_contract.name)),
                .abi = abi_items,
                .bytecode = try allocator.dupe(u8, std.mem.span(c_contract.bytecode)),
                .deployed_bytecode = try allocator.dupe(u8, std.mem.span(c_contract.deployed_bytecode)),
                .allocator = allocator,
            };
        }

        const errors = try allocator.alloc(CompilerError, c_result.errors_count);
        errdefer allocator.free(errors);

        for (errors, 0..) |*err, i| {
            const c_error = c_result.errors[i];
            err.* = CompilerError{
                .code = @as(ErrorCode, @enumFromInt(@as(i32, @intCast(c_error.severity)))),
                .message = try allocator.dupe(u8, std.mem.span(c_error.message)),
            };
        }

        const warnings = try allocator.alloc(CompilerError, c_result.warnings_count);
        errdefer allocator.free(warnings);

        for (warnings, 0..) |*warning, i| {
            const c_warning = c_result.warnings[i];
            warning.* = CompilerError{
                .code = @as(ErrorCode, @enumFromInt(@as(i32, @intCast(c_warning.severity)))),
                .message = try allocator.dupe(u8, std.mem.span(c_warning.message)),
            };
        }

        return CompilationResult{
            .contracts = contracts,
            .errors = errors,
            .warnings = warnings,
            .allocator = allocator,
        };
    }
};

// Comptime compilation API for use in build scripts
pub const ComptimeCompiler = struct {
    /// Compile a Solidity contract at compile time and return the ABI and bytecode
    pub fn compile(comptime _: []const u8) struct {
        abi: []const u8,
        bytecode: []const u8,
        deployed_bytecode: []const u8,
    } {
        @setEvalBranchQuota(1_000_000);

        // This is a simplified version for comptime usage
        // In reality, we'd need to invoke the Rust compiler at build time
        // For now, this is a placeholder that shows the intended API

        return .{
            .abi = "[]",
            .bytecode = "0x",
            .deployed_bytecode = "0x",
        };
    }
};

// Tests
test "compiler settings creation" {
    const allocator = std.testing.allocator;

    const settings = CompilerSettings{
        .optimizer_enabled = false,
        .optimizer_runs = 100,
        .evm_version = "paris",
        .remappings = &[_][]const u8{"@openzeppelin/=lib/openzeppelin-contracts/"},
        .cache_enabled = false,
        .output_ast = true,
    };

    var c_settings = try Compiler.createCSettings(&settings, allocator);
    defer Compiler.freeCSettings(&c_settings, allocator);

    try std.testing.expect(c_settings.optimizer_enabled == false);
    try std.testing.expect(c_settings.optimizer_runs == 100);
    try std.testing.expect(c_settings.output_ast == true);
}

fn findAbiFunction(abi: []const zabi_abitypes.AbiItem, name: []const u8) !zabi_abitypes.Function {
    for (abi) |item| {
        switch (item) {
            .abiFunction => |func| {
                if (std.mem.eql(u8, func.name, name)) return func;
            },
            else => {},
        }
    }
    std.debug.print("ABI function not found: {s}\n", .{name});
    return error.AbiFunctionNotFound;
}

test "compile simple contract" {
    const allocator = std.testing.allocator;

    const source =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.0;
        \\
        \\contract SimpleStorage {
        \\    uint256 public value;
        \\
        \\    function setValue(uint256 _value) public {
        \\        value = _value;
        \\    }
        \\}
    ;

    const settings = CompilerSettings{};

    var result = try Compiler.compile_source(
        allocator,
        "SimpleStorage.sol",
        source,
        settings,
    );
    defer result.deinit();

    try std.testing.expect(result.contracts.len > 0);
    try std.testing.expect(result.errors.len == 0);

    const contract = result.contracts[0];
    try std.testing.expectEqualStrings("SimpleStorage", contract.name);
    try std.testing.expect(contract.abi.len == 2); // We expect 2 functions (setValue, value)
    try std.testing.expect(contract.bytecode.len > 0);
    try std.testing.expect(contract.deployed_bytecode.len > 0);

    // Test that bytecode was generated and has expected structure
    // Note: The exact bytecode can vary between Solidity versions (e.g., 0.8.24 vs 0.8.30)
    // so we check for structure rather than exact values
    try std.testing.expect(contract.bytecode.len > 100);
    try std.testing.expect(contract.deployed_bytecode.len > 100);

    // Check that bytecode starts with expected pattern
    try std.testing.expect(std.mem.startsWith(u8, contract.bytecode, "0x608060405234"));
    try std.testing.expect(std.mem.startsWith(u8, contract.deployed_bytecode, "0x6080604052348015"));

    // Check that bytecode ends with metadata (contains "ipfs" hash and solc version)
    try std.testing.expect(std.mem.indexOf(u8, contract.bytecode, "6970667358") != null); // "ipfs" in hex
    try std.testing.expect(std.mem.indexOf(u8, contract.deployed_bytecode, "6970667358") != null);

    // Check for Solidity version marker in metadata (0.8.24 through 0.8.100)
    var found_version = false;
    var version: u8 = 24;
    while (version <= 100) : (version += 1) {
        var version_bytes: [16]u8 = undefined;
        const version_hex: u32 = 0x000800 + @as(u32, version);
        const version_str = try std.fmt.bufPrint(&version_bytes, "736f6c6343{x:0>6}", .{version_hex});
        if (std.mem.indexOf(u8, contract.bytecode, version_str) != null) {
            found_version = true;
            break;
        }
    }
    try std.testing.expect(found_version);

    // Validate the parsed ABI structure using zabi types
    // Find functions by name
    const set_value = try findAbiFunction(contract.abi, "setValue");
    const value = try findAbiFunction(contract.abi, "value");

    // Check the function (setValue)
    try std.testing.expectEqualStrings("setValue", set_value.name);
    try std.testing.expect(set_value.stateMutability == .nonpayable);
    try std.testing.expect(set_value.type == .function);

    // Check setValue inputs
    try std.testing.expect(set_value.inputs.len == 1);
    const set_value_input = set_value.inputs[0];
    try std.testing.expectEqualStrings("_value", set_value_input.name);
    try std.testing.expect(set_value_input.type == .uint);
    try std.testing.expect(set_value_input.type.uint == 256);
    try std.testing.expect(set_value_input.internalType != null);
    try std.testing.expectEqualStrings("uint256", set_value_input.internalType.?);

    // Check setValue outputs (should be empty)
    try std.testing.expect(set_value.outputs.len == 0);

    // Check setValue optional fields
    try std.testing.expect(set_value.constant == null);
    try std.testing.expect(set_value.payable == null);
    try std.testing.expect(set_value.gas == null);

    // Check the function (value)
    try std.testing.expectEqualStrings("value", value.name);
    try std.testing.expect(value.stateMutability == .view);
    try std.testing.expect(value.type == .function);

    // Check value inputs (should be empty)
    try std.testing.expect(value.inputs.len == 0);

    // Check value outputs
    try std.testing.expect(value.outputs.len == 1);
    const value_output = value.outputs[0];
    try std.testing.expectEqualStrings("", value_output.name); // unnamed return value
    try std.testing.expect(value_output.type == .uint);
    try std.testing.expect(value_output.type.uint == 256);
    try std.testing.expect(value_output.internalType != null);
    try std.testing.expectEqualStrings("uint256", value_output.internalType.?);

    // Check value optional fields
    try std.testing.expect(value.constant == null);
    try std.testing.expect(value.payable == null);
    try std.testing.expect(value.gas == null);
}
