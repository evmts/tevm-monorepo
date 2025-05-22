const std = @import("std");

// Foundry wrapper struct
pub const foundry_FoundryError = extern struct {
    message: [*c]u8,
    code: i32,
};

// Declare the C functions from the foundry_wrapper library
extern fn foundry_free_error(err: ?*foundry_FoundryError) void;
extern fn foundry_get_error_message(err: ?*const foundry_FoundryError) [*c]const u8;
extern fn foundry_get_error_code(err: ?*const foundry_FoundryError) i32;
extern fn foundry_compile_project(project_path: [*c]const u8, out_error: [*c]?*foundry_FoundryError) i32;
extern fn foundry_install_solc_version(version_str: [*c]const u8, out_error: [*c]?*foundry_FoundryError) i32;
extern fn foundry_compile_file(file_path: [*c]const u8, solc_version: [*c]const u8, out_error: [*c]?*foundry_FoundryError) i32;

/// Errors that can occur during Solidity compilation
pub const CompilerError = error{
    InvalidPath,
    CompilationFailed,
    InvalidVersion,
    SolcInstallFailed,
    UnknownError,
    OutOfMemory,
};

/// Helper to convert from C error codes to Zig errors
fn handleFoundryError(err: ?*foundry_FoundryError) CompilerError!void {
    if (err != null) {
        const code = foundry_get_error_code(err);
        defer foundry_free_error(err);
        
        return switch (code) {
            1 => CompilerError.InvalidPath,
            2 => CompilerError.CompilationFailed,
            3 => CompilerError.InvalidVersion,
            4 => CompilerError.SolcInstallFailed,
            99 => CompilerError.UnknownError,
            else => CompilerError.UnknownError,
        };
    }
}

/// Represents a compiled contract artifact
pub const Contract = struct {
    // fields matching the Rust `foundry_compilers::artifacts::Contract`
    name: []const u8,
    abi: []const u8,
    bytecode: []const u8,
    
    pub fn deinit(self: *Contract, allocator: std.mem.Allocator) void {
        allocator.free(self.name);
        allocator.free(self.abi);
        allocator.free(self.bytecode);
    }
};

/// Module types for runtime generation
pub const ModuleType = enum {
    Bytecode,
    Abi,
    Combined,
};

/// Bundler for Solidity modules
pub const Bundler = struct {
    solc_version: ?[]const u8,
    allocator: std.mem.Allocator,
    
    /// Initialize a Bundler with an optional solc version string
    pub fn init(allocator: std.mem.Allocator, solc_version: ?[]const u8) Bundler {
        return Bundler{
            .allocator = allocator,
            .solc_version = solc_version,
        };
    }
    
    /// Install a Solidity compiler version
    pub fn installSolc(self: *Bundler, version: []const u8) !void {
        // Add null terminator to the version string
        const version_cstr = try self.allocator.dupeZ(u8, version);
        defer self.allocator.free(version_cstr);
        
        var err: ?*foundry_FoundryError = null;
        const result = foundry_install_solc_version(version_cstr.ptr, &err);
        
        if (result == 0) {
            try handleFoundryError(err);
        }
    }
    
    /// Compile a Solidity project
    pub fn compileProject(self: *Bundler, project_path: []const u8) !void {
        // Add null terminator to the path string
        const path_cstr = try self.allocator.dupeZ(u8, project_path);
        defer self.allocator.free(path_cstr);
        
        var err: ?*foundry_FoundryError = null;
        const result = foundry_compile_project(path_cstr.ptr, &err);
        
        if (result == 0) {
            try handleFoundryError(err);
        }
    }
    
    /// Compile a single Solidity file
    pub fn compileFile(self: *Bundler, file_path: []const u8) !void {
        // Add null terminator to the path string
        const path_cstr = try self.allocator.dupeZ(u8, file_path);
        defer self.allocator.free(path_cstr);
        
        // Just use null for now to avoid the string conversion issues
        const version_ptr: [*c]const u8 = null;
        
        var err: ?*foundry_FoundryError = null;
        const result = foundry_compile_file(path_cstr.ptr, version_ptr, &err);
        
        if (result == 0) {
            try handleFoundryError(err);
        }
    }
};

test "Bundler initialization" {
    const allocator = std.testing.allocator;
    const bundler = Bundler.init(allocator, null);
    
    try std.testing.expect(bundler.solc_version == null);
    try std.testing.expect(bundler.allocator.ptr == allocator.ptr);
}