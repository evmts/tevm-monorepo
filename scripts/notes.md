# Notes on Idiomatic Zig Refactoring Task

## Task Overview (from prompt.md lines 1-12)
- Goal: Large scale refactor focusing on idiomatic language usage and optimal performance
- Target: Only files in `src/evm/**/*.zig`
- Approach: Systematic file-by-file audit
- Working in git worktree: `g/idiomatic-refactors` ✓

## Key Requirements
1. Read `src/evm/README.md` to understand project
2. Create markdown todo list of every file in evm package
3. For each file: audit and fix idiomatic zig issues, better stdlib usage, performance improvements
4. Run `zig build test-all` after each change to prevent regressions
5. Work in isolation in git branch
6. Commit as we work, squash at end

## Language Reference Available
- Full Zig language spec provided (11852+ lines)
- Standard library: https://ziglang.org/documentation/master/std/
- Language docs: https://ziglang.org/documentation/master/

## Key Zig Features Noted (lines 100-299)
- Control flow: while, for, if with optionals/error unions
- Functions: inline fn, parameter type inference, reflection
- Error handling: error sets, try/catch, errdefer, error unions
- Types: optionals, casting, type coercion, zero bit types
- Compile-time: comptime parameters, expressions, generic data structures
- Builtins: @branchHint, @alignOf, @sizeOf, @bitCast, etc.
- Build modes: Debug, ReleaseFast, ReleaseSafe, ReleaseSmall
- Safety: bounds checking, overflow detection, undefined behavior prevention

## Expert Response Summary (from response.md)
The expert provided comprehensive guidance with specific principles:

### General Principles Applied:
1. **Error Handling**: Use `try` for error propagation (don't manually map errors). Use `std.debug.assert` for invariants. Zig automatically coerces errors with same names.
2. **Memory Management**: Explicitly pass allocators where necessary. Ensure consistent memory ownership and use `defer` for deallocation.
3. **Standard Library**: Utilize `std.mem`, `std.math`, `std.debug`, and other standard library modules extensively.
4. **Data Structures**: Prefer standard library data structures like `ArrayList` and `AutoHashMap`.
5. **Code Clarity**: Simplify expressions, use descriptive variable names, and add comments where necessary.
6. **Immutability**: Use `const` wherever possible to promote data integrity and optimization opportunities.
7. **Remove `Self` Alias**: Remove `const Self = @This();` when it does not provide any value.
8. **Prefer Empty Slice Literals**: Use `.{}` over `&[_]u8{}` for brevity.
9. **Use convenience functions**: Avoid unnecessary init functions that don't add value.
10. **Replace raw pointers with slices**: Using slices adds implicit bounds checking, improving safety.

### Key Patterns to Apply:
- Move enum definitions outside structs for better readability
- Remove unnecessary `const Self = @This();` aliases
- Simplify initialization patterns
- Use standard library utilities extensively
- Improve documentation with detailed examples

## Next Steps
- Read src/evm/README.md to understand project structure
- Create comprehensive file list for all src/evm/**/*.zig files
- Begin systematic refactoring using expert principles
- Test each change with `zig build test-all`