//! ZigEVM CLI - Command line interface for the ZigEVM Ethereum Virtual Machine
//! This file provides a CLI for interacting with the ZigEVM library.

const std = @import("std");
// Temporarily comment out clap until we have it properly included
// const clap = @import("clap");
const zigevm = @import("zigevm");

const stdout = std.io.getStdOut().writer();
const stderr = std.io.getStdErr().writer();

// Define CLI commands and options
const Command = enum {
    execute,
    compile,
    disassemble,
    benchmark,
    test_cmd, // renamed from 'test' which conflicts with a keyword
};

pub fn main() !void {
    // Initialize allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Print banner
    try stdout.print("ZigEVM v0.1.0 - High Performance WebAssembly-Compatible EVM\n\n", .{});

    // For now, we'll just use a simple command line interface
    try stdout.print("Usage: zigevm <command>\n\n", .{});
    try stdout.print("Commands:\n", .{});
    try stdout.print("  execute      Execute EVM bytecode\n", .{});
    try stdout.print("  compile      Compile Solidity to EVM bytecode\n", .{});
    try stdout.print("  disassemble  Disassemble EVM bytecode\n", .{});
    try stdout.print("  benchmark    Run performance benchmarks\n", .{});
    try stdout.print("  test         Run test suite\n", .{});
    
    // Get command from args
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);
    
    const cmd_str = if (args.len > 1) args[1] else null;
    const cmd = if (cmd_str) |c| parseCommand(c) else null;

    // Execute the command
    if (cmd) |command| {
        switch (command) {
            .execute => {
                try stdout.print("Executing EVM bytecode...\n", .{});
                // Implementation will go here
            },
            .compile => {
                try stdout.print("Compiling Solidity to EVM bytecode...\n", .{});
                // Implementation will go here
            },
            .disassemble => {
                try stdout.print("Disassembling EVM bytecode...\n", .{});
                // Implementation will go here
            },
            .benchmark => {
                try stdout.print("Running benchmarks...\n", .{});
                // Implementation will go here
            },
            .test_cmd => {
                try stdout.print("Running tests...\n", .{});
                // Implementation will go here
            },
        }
    } else {
        try stderr.print("Error: Missing or invalid command\n", .{});
        try stdout.print("Run 'zigevm --help' for usage information\n", .{});
        std.process.exit(1);
    }
}

// Helper function to parse command string to enum
fn parseCommand(cmd_str: []const u8) ?Command {
    const cmd_map = .{
        .{ "execute", Command.execute },
        .{ "compile", Command.compile },
        .{ "disassemble", Command.disassemble },
        .{ "benchmark", Command.benchmark },
        .{ "test", Command.test_cmd },
    };

    inline for (cmd_map) |pair| {
        if (std.mem.eql(u8, cmd_str, pair[0])) {
            return pair[1];
        }
    }

    return null;
}

test "CLI basic test" {
    try std.testing.expect(parseCommand("execute") == Command.execute);
    try std.testing.expect(parseCommand("invalid") == null);
}

test "Import zigevm" {
    // Just a simple test to verify we can import our library
    try std.testing.expectEqual(@as(i32, 150), zigevm.add(100, 50));
}
