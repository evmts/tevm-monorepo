const std = @import("std");
const fs = std.fs;
const File = std.fs.File;
const process = std.process;
const heap = std.heap;

pub fn main() !void {
    // Create an allocator
    var gpa = heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Read the existing build.zig file
    const build_file_path = "build.zig";
    const file_content = try fs.cwd().readFileAlloc(allocator, build_file_path, 10 * 1024 * 1024);
    defer allocator.free(file_content);

    // Create a string builder for the updated content
    var new_content = std.ArrayList(u8).init(allocator);
    defer new_content.deinit();

    // Function to check if a line contains old module import patterns
    fn isModuleImportLine(line: []const u8) bool {
        const patterns = [_][]const u8{
            "module.addImport(\"Address\",",
            "module.addImport(\"Abi\",",
            "module.addImport(\"Block\",",
            "module.addImport(\"Bytecode\",",
            "module.addImport(\"Compiler\",",
            "module.addImport(\"Evm\",",
            "module.addImport(\"Rlp\",",
            "module.addImport(\"Token\",",
            "module.addImport(\"Trie\",",
            "module.addImport(\"Utils\",",
            "module.addImport(\"StateManager\",",
        };

        for (patterns) |pattern| {
            if (std.mem.indexOf(u8, line, pattern) != null) {
                return true;
            }
        }
        return false;
    }

    // Process each line
    var lines = std.mem.split(u8, file_content, "\n");
    var current_test_def: ?[]const u8 = null;
    var skip_lines_count: usize = 0;
    var has_processed_zigevm_import = false;

    while (lines.next()) |line| {
        // Skip lines if needed
        if (skip_lines_count > 0) {
            skip_lines_count -= 1;
            continue;
        }

        // Check if this is a test definition line
        if (std.mem.indexOf(u8, line, "const ") != null and 
            std.mem.indexOf(u8, line, "_test") != null and 
            std.mem.indexOf(u8, line, "b.addTest") != null) {
            const name_start = std.mem.indexOf(u8, line, "const ") orelse 0;
            const name_end = std.mem.indexOf(u8, line, "=") orelse line.len;
            if (name_start < name_end) {
                current_test_def = line[name_start + 6 .. name_end - 1];
            }
            try new_content.appendSlice(line);
            try new_content.appendSlice("\n");
            continue;
        }

        // If we have a test definition and encounter a line for adding modules
        if (current_test_def != null and isModuleImportLine(line)) {
            // Replace multiple module imports with single zigevm import
            has_processed_zigevm_import = false;
            while (lines.next()) |import_line| {
                if (!isModuleImportLine(import_line)) {
                    // We've reached the end of module imports
                    if (!has_processed_zigevm_import) {
                        try new_content.appendSlice("    // Add zigevm module to ");
                        try new_content.appendSlice(current_test_def.?);
                        try new_content.appendSlice("\n");
                        try new_content.appendSlice("    ");
                        try new_content.appendSlice(current_test_def.?);
                        try new_content.appendSlice(".root_module.addImport(\"zigevm\", zigevm_mod);\n");
                        has_processed_zigevm_import = true;
                    }
                    // Process the next line which is not a module import
                    try new_content.appendSlice(import_line);
                    try new_content.appendSlice("\n");
                    break;
                }
                // Skip this line, it's a module import
            }
            current_test_def = null;
            continue;
        }

        // Replace target_architecture_mod with zigevm_mod
        if (std.mem.indexOf(u8, line, "target_architecture_mod") != null) {
            const replaced_line = std.mem.replace(u8, line, "target_architecture_mod", "zigevm_mod", allocator);
            try new_content.appendSlice(replaced_line);
            allocator.free(replaced_line);
        } else {
            // Pass through unmodified line
            try new_content.appendSlice(line);
        }
        try new_content.appendSlice("\n");
    }

    // Write the updated content back to the file
    const updated_content = try new_content.toOwnedSlice();
    defer allocator.free(updated_content);

    var file = try fs.cwd().createFile(build_file_path, .{});
    defer file.close();
    try file.writeAll(updated_content);

    std.debug.print("Successfully updated build.zig\n", .{});
}