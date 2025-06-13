const std = @import("std");
const testing = std.testing;

// Test the Solidity compiler integration in isolation
test "debug solidity compiler availability and basic compilation" {
    _ = testing.allocator;
    
    // First, let's check if we can import the compiler module
    const evm_root = @import("evm");
    
    // Try to access the compiler through the root module
    std.debug.print("Testing compiler module import...\n", .{});
    
    // Test simple contract compilation
    const simple_contract =
        \\// SPDX-License-Identifier: MIT
        \\pragma solidity ^0.8.0;
        \\
        \\contract SimpleTest {
        \\    function test() external pure returns (uint256) {
        \\        return 42;
        \\    }
        \\}
    ;
    
    std.debug.print("Simple contract source prepared\n", .{});
    std.debug.print("Contract source:\n{s}\n", .{simple_contract});
    
    // Let's see what's available in the evm module
    const type_info = @typeInfo(@TypeOf(evm_root));
    std.debug.print("EVM root type info: {any}\n", .{type_info});
    
    // Check if there's a direct compiler reference
    if (@hasDecl(evm_root, "Compiler")) {
        std.debug.print("Found Compiler in evm_root\n", .{});
    } else {
        std.debug.print("No Compiler found in evm_root\n", .{});
    }
    
    // Check what's available in the evm module
    if (@hasDecl(evm_root, "evm")) {
        const evm = evm_root.evm;
        std.debug.print("Found evm sub-module\n", .{});
        
        if (@hasDecl(evm, "Compiler")) {
            std.debug.print("Found Compiler in evm sub-module\n", .{});
        } else {
            std.debug.print("No Compiler found in evm sub-module\n", .{});
        }
    }
    
    // Let's also check what we can access directly from compilers
    std.debug.print("Attempting to import compilers module directly...\n", .{});
    
    // This should fail, but let's see the exact error
    //const Compiler = @import("compilers").Compiler;
}

test "check foundry wrapper header availability" {
    std.debug.print("Checking if foundry_wrapper.h is available...\n", .{});
    
    // Try to check if the header file exists
    const header_path = "/Users/williamcory/tevm/main/include/foundry_wrapper.h";
    const file = std.fs.openFileAbsolute(header_path, .{}) catch |err| {
        std.debug.print("Failed to open foundry_wrapper.h: {}\n", .{err});
        return;
    };
    defer file.close();
    
    std.debug.print("foundry_wrapper.h exists and is accessible\n", .{});
    
    // Read the first few lines to see what's in it
    var buffer: [1024]u8 = undefined;
    const bytes_read = file.readAll(&buffer) catch |err| {
        std.debug.print("Failed to read foundry_wrapper.h: {}\n", .{err});
        return;
    };
    
    std.debug.print("foundry_wrapper.h contents (first 1024 bytes):\n{s}\n", .{buffer[0..bytes_read]});
}

test "check rust foundry wrapper build status" {
    std.debug.print("Checking Rust foundry wrapper build...\n", .{});
    
    // Check if the Rust library was built (correct path)
    const lib_path = "/Users/williamcory/tevm/main/dist/target/release/libfoundry_wrapper.a";
    const file = std.fs.openFileAbsolute(lib_path, .{}) catch |err| {
        std.debug.print("Rust library not found at {s}: {}\n", .{ lib_path, err });
        
        // Try debug build
        const debug_lib_path = "/Users/williamcory/tevm/main/dist/target/debug/libfoundry_wrapper.a";
        const debug_file = std.fs.openFileAbsolute(debug_lib_path, .{}) catch |debug_err| {
            std.debug.print("Debug Rust library not found at {s}: {}\n", .{ debug_lib_path, debug_err });
            return;
        };
        debug_file.close();
        std.debug.print("Found debug Rust library at {s}\n", .{debug_lib_path});
        return;
    };
    defer file.close();
    
    std.debug.print("Found release Rust library at {s}\n", .{lib_path});
}

test "test actual solidity compilation" {
    const allocator = testing.allocator;
    
    std.debug.print("Testing actual Solidity compilation...\n", .{});
    
    // Import the compiler module directly
    const Compiler = @import("Compiler");
    
    std.debug.print("Successfully imported Compiler module\n", .{});
    
    // Check if we can access Compiler and CompilerSettings
    if (@hasDecl(Compiler, "Compiler") and @hasDecl(Compiler, "CompilerSettings")) {
        const CompilerType = Compiler.Compiler;
        const CompilerSettings = Compiler.CompilerSettings;
        
        std.debug.print("Found Compiler and CompilerSettings\n", .{});
        
        // Test simple contract compilation
        const simple_contract =
            \\// SPDX-License-Identifier: MIT
            \\pragma solidity ^0.8.0;
            \\
            \\contract SimpleTest {
            \\    function test() external pure returns (uint256) {
            \\        return 42;
            \\    }
            \\}
        ;
        
        const settings = CompilerSettings{};
        
        var result = CompilerType.compile_source(
            allocator,
            "SimpleTest.sol",
            simple_contract,
            settings,
        ) catch |err| {
            std.debug.print("Compilation failed: {}\n", .{err});
            return;
        };
        defer result.deinit();
        
        std.debug.print("Compilation successful!\n", .{});
        std.debug.print("Compiled contracts: {}\n", .{result.contracts.len});
        std.debug.print("Compilation errors: {}\n", .{result.errors.len});
        
        if (result.contracts.len > 0) {
            const contract = result.contracts[0];
            std.debug.print("Contract name: {s}\n", .{contract.name});
            std.debug.print("Bytecode length: {}\n", .{contract.bytecode.len});
            std.debug.print("ABI items: {}\n", .{contract.abi.len});
        }
        
    } else {
        std.debug.print("Compiler or CompilerSettings not found in Compiler module\n", .{});
        
        // Let's see what is available in the Compiler module
        const type_info = @typeInfo(@TypeOf(Compiler));
        std.debug.print("Available declarations in Compiler: {}\n", .{type_info});
    }
}