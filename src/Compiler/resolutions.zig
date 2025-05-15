const std = @import("std");

const Remapping = struct {
    prefix: []const u8,
    target: []const u8,
};

const Lib = []const u8;

pub const Config = struct {
    libs: []Lib,
    remappings: []const Remapping,
};

const ResolveImportsError = error{
    ParseError,
    PathResolutionError,
    OutOfMemory,
};

pub fn resolveImports(
    unprocessed_module: UnprocessedModule,
    cfg: *const Config,
) ResolveImportsError![][]const u8 {
    const allocator = std.heap.page_allocator;

    var results = std.ArrayList([]const u8).init(allocator);
    defer if (std.debug.runtime_safety) results.deinit(); // allow leak if returned

    var lines = std.mem.splitScalar(u8, unprocessed_module.code, '\n');
    var in_block_comment = false;
    var in_multiline_import = false;
    var multiline_import_accum = std.ArrayList(u8).init(allocator);
    defer multiline_import_accum.deinit();

    while (lines.next()) |line| {
        var trimmed = std.mem.trim(u8, line, " \t\r\n");

        if (std.mem.startsWith(u8, trimmed, "//")) continue;

        if (in_block_comment) {
            if (std.mem.indexOf(u8, trimmed, "*/")) |_| {
                in_block_comment = false;
            }
            continue;
        }
        if (std.mem.startsWith(u8, trimmed, "/*")) {
            in_block_comment = true;
            continue;
        }

        if (in_multiline_import) {
            try multiline_import_accum.appendSlice(trimmed);
            if (std.mem.indexOf(u8, trimmed, "from")) |from_idx| {
                if (std.mem.indexOfAny(u8, trimmed[from_idx..], "\"'")) |q_rel| {
                    const q = from_idx + q_rel;
                    const quote_char = trimmed[q];
                    const after = trimmed[q + 1 ..];
                    if (std.mem.indexOfScalar(u8, after, quote_char)) |end_rel| {
                        const import_path = after[0..end_rel];
                        const resolved = try resolveImportPath(import_path, unprocessed_module, cfg);
                        try results.append(resolved);
                        in_multiline_import = false;
                        multiline_import_accum.clearRetainingCapacity();
                        continue;
                    }
                }
            }
            continue;
        }

        if (std.mem.indexOf(u8, trimmed, "import")) |import_idx| {
            _ = import_idx; // autofix
            if (std.mem.indexOf(u8, trimmed, "{") != null and std.mem.indexOf(u8, trimmed, "from") == null) {
                in_multiline_import = true;
                try multiline_import_accum.appendSlice(trimmed);
                continue;
            }
            if (std.mem.indexOf(u8, trimmed, "//")) |i| {
                trimmed = trimmed[0..i];
            }

            const quote_start = blk: {
                if (std.mem.indexOf(u8, trimmed, "from")) |from_idx| {
                    if (std.mem.indexOfAny(u8, trimmed[from_idx..], "\"'")) |q_rel| {
                        break :blk from_idx + q_rel;
                    } else break :blk null;
                } else if (std.mem.indexOfAny(u8, trimmed, "\"'")) |q| {
                    break :blk q;
                } else break :blk null;
            };

            if (quote_start) |q| {
                const quote_char = trimmed[q];
                const after = trimmed[q + 1 ..];
                if (std.mem.indexOfScalar(u8, after, quote_char)) |end_rel| {
                    const import_path = after[0..end_rel];
                    const resolved = try resolveImportPath(import_path, unprocessed_module, cfg);
                    try results.append(resolved);
                } else {
                    return ResolveImportsError.ParseError;
                }
            }
        }
    }

    return results.toOwnedSlice();
}

const ResolveImportPathError = error{
    ParseError,
    PathResolutionError,
    OutOfMemory,
};

pub fn resolveImportPath(
    import_path: []const u8,
    unprocessed_module: UnprocessedModule,
    cfg: *const Config,
) ResolveImportPathError![]const u8 {
    _ = cfg;
    _ = unprocessed_module;

    // For now, just echo back the import path
    return import_path;
}

pub const ModuleInfo = struct {
    code: []const u8,
    imported_ids: [][]const u8,
};

const UnprocessedModule = struct {
    path: []const u8,
    code: []const u8,
};

const State = struct {
    seen: std.StringHashMap(void),
    graph: std.StringHashMap(ModuleInfo),
    unprocessed: std.ArrayList,

    pub fn init(allocator: std.mem.Allocator) State {
        return State{
            .seen = std.StringHashMap(void).init(allocator),
            .graph = std.StringHashMap(ModuleInfo).init(allocator),
            .unprocessed = std.ArrayList(UnprocessedModule).init(allocator),
        };
    }

    pub fn deinit(self: *State) void {
        self.seen.deinit();
        self.graph.deinit();
        self.unprocessed.deinit();
    }
};

pub fn moduleFactory(
    allocator: std.mem.Allocator,
    entrypoint_path: []const u8,
    raw_code: []const u8,
    cfg: Config,
) ResolveImportsError!std.StringHashMap {
    const state = State.init(allocator);
    defer state.deinit();

    state.unprocessed.append(UnprocessedModule{
        .path = entrypoint_path,
        .code = raw_code,
    });

    while (state.unprocessed.len > 0) {
        const next_module = state.unprocessed.pop();
        const imported_ids = try resolveImports(next_module, &cfg);
        state.graph.put(next_module.path, ModuleInfo{
            .code = next_module.code,
            .imported_ids = imported_ids,
        });
        for (imported_ids) |id| {
            if (state.seen.contains(id)) {
                continue;
            }
            state.seen.put(id);
            state.unprocessed.push(UnprocessedModule{
                .path = id,
                .code = try std.fs.openFileAbsolute(id, .{}),
            });
        }
    }

    return state.graph;
}

test "resolveImportPath parses Solidity imports correctly" {
    const allocator = std.testing.allocator;
    _ = allocator; // autofix

    const TestCase = struct {
        name: []const u8,
        code: []const u8,
        expected: []const []const u8,
    };

    const cases = [_]TestCase{
        .{
            .name = "happy path with multiple imports",
            .code =
            \\import "./A.sol";
            \\import "./B.sol";
            \\contract Foo {}
            ,
            .expected = &[_][]const u8{ "./A.sol", "./B.sol" },
        },
        .{
            .name = "file with no imports",
            .code =
            \\contract Foo {
            \\  function bar() public {}
            \\}
            ,
            .expected = &[_][]const u8{},
        },
        .{
            .name = "commented out imports",
            .code =
            \\/* import "./Fake.sol"; */
            \\// import "./Ignore.sol"
            \\contract Foo {}
            ,
            .expected = &[_][]const u8{},
        },
        .{
            .name = "import with whitespace",
            .code = "   import   \"./Indented.sol\"   ;",
            .expected = &[_][]const u8{"./Indented.sol"},
        },
        .{
            .name = "import with inline block comment",
            .code = "import /* comment */ \"./Commented.sol\";",
            .expected = &[_][]const u8{"./Commented.sol"},
        },
        .{
            .name = "multi-line import",
            .code =
            \\import {
            \\  A,
            \\  B
            \\} from "./MultiLine.sol";
            ,
            .expected = &[_][]const u8{"./MultiLine.sol"},
        },
        .{
            .name = "simple and named import",
            .code =
            \\import "./Direct.sol";
            \\import { Token } from "./Named.sol";
            ,
            .expected = &[_][]const u8{ "./Direct.sol", "./Named.sol" },
        },
        .{
            .name = "wildcard import syntax",
            .code = "import * as Math from \"./Math.sol\";",
            .expected = &[_][]const u8{"./Math.sol"},
        },
        .{
            .name = "alias import",
            .code = "import { A as B } from \"./Alias.sol\";",
            .expected = &[_][]const u8{"./Alias.sol"},
        },
    };

    inline for (cases) |case| {
        const module = UnprocessedModule{
            .path = "Test.sol",
            .code = case.code,
        };
        const cfg = Config{
            .libs = &[_][]const u8{},
            .remappings = &[_]Remapping{},
        };
        const result = try resolveImports(module, &cfg);
        // defer allocator.free(result);

        std.debug.print("Test: {s} | expected.len = {d}, result.len = {d}\n", .{ case.name, case.expected.len, result.len });

        if (case.expected.len != result.len) {
            std.debug.print("FAILED: {s}\nExpected len: {d}, got: {d}\n", .{ case.name, case.expected.len, result.len });
            std.debug.print("Expected: ", .{});
            for (case.expected) |e| std.debug.print("{s}, ", .{e});
            std.debug.print("\nResult: ", .{});
            for (result) |r| std.debug.print("{s}, ", .{r});
            std.debug.print("\n", .{});
            try std.testing.expectEqual(case.expected.len, result.len);
            return;
        }

        if (result.len > 0 and case.expected.len > 0) {
            var i: usize = 0;
            while (i < result.len) : (i += 1) {
                try std.testing.expectEqualStrings(case.expected[i], result[i]);
            }
        }
    }
}
