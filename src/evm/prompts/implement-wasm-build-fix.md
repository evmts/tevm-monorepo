# Fix WASM Build and TypeScript Integration

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_fix_wasm_build` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_fix_wasm_build feat_fix_wasm_build`
3. **Work in isolation**: `cd g/feat_fix_wasm_build`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Test WASM build with `zig build -Dtarget=wasm32-wasi`
5. Commit with emoji conventional commit format
6. DO NOT merge - leave ready for review

## Context

The WASM build is currently broken and needs to be fixed as well as integrated into the overall Tevm TypeScript codebase. This is a critical blocker for using the Zig EVM implementation in JavaScript environments.

## ELI5

Think of WASM like a universal translator that lets super-fast compiled code run in web browsers. Right now our high-performance EVM engine is written in Zig but the build system that packages it for browsers is broken - like having a Ferrari with a broken transmission. We need to fix the build pipeline so JavaScript can actually use our lightning-fast EVM, turning a 100x performance improvement from impossible to reality.

## Current Issues

### WASM Build Problems
- Build target configuration may be incorrect
- Missing WASM-specific exports
- Potential memory allocation issues in WASM context
- Build system not configured for WASM output

### TypeScript Integration Missing
- No TypeScript bindings for Zig EVM
- No WASM loader in TypeScript codebase
- Missing bridge between Zig and JavaScript APIs
- No build pipeline for WASM integration

## Implementation Requirements

### Core Functionality
1. **Fix WASM Build**: Ensure `zig build -Dtarget=wasm32-wasi` works
2. **WASM Exports**: Define proper C ABI exports for JavaScript
3. **Memory Management**: Handle WASM memory allocation correctly
4. **TypeScript Bindings**: Create TypeScript interface to WASM module
5. **Build Integration**: Add WASM build to overall Tevm build process

### WASM Export Interface
```zig
// Example WASM exports needed
export fn evm_create() u32;
export fn evm_execute(vm_ptr: u32, bytecode_ptr: u32, bytecode_len: u32) u32;
export fn evm_get_result(vm_ptr: u32, result_ptr: u32) u32;
export fn evm_destroy(vm_ptr: u32) void;
export fn malloc(size: u32) u32;
export fn free(ptr: u32) void;
```

## Implementation Tasks

### Task 1: Fix WASM Build Configuration
Files to check/modify:
- `/build.zig` - WASM build configuration
- `/src/root_wasm.zig` - WASM-specific entry point
- `/src/root_wasm_minimal.zig` - Minimal WASM build

### Task 2: Define WASM C API
File: `/src/evm/wasm_api.zig`
```zig
const std = @import("std");
const evm = @import("evm.zig");

// C-compatible error codes
pub const EVM_SUCCESS: i32 = 0;
pub const EVM_ERROR_OUT_OF_GAS: i32 = -1;
pub const EVM_ERROR_STACK_OVERFLOW: i32 = -2;
pub const EVM_ERROR_INVALID_OPCODE: i32 = -3;

// C-compatible VM handle
pub const EVMHandle = extern struct {
    vm_ptr: ?*anyopaque,
    error_code: i32,
};

export fn evm_create(gas_limit: u64) EVMHandle {
    // Implementation
}

export fn evm_execute(handle: *EVMHandle, bytecode_ptr: [*]const u8, bytecode_len: u32, input_ptr: [*]const u8, input_len: u32) i32 {
    // Implementation
}
```

### Task 3: TypeScript WASM Loader
File: `/src/wasm-loader.js` (update existing)
```typescript
export interface EVMInstance {
  evm_create(gasLimit: bigint): number;
  evm_execute(vmHandle: number, bytecode: Uint8Array, input: Uint8Array): number;
  evm_get_result(vmHandle: number): Uint8Array;
  evm_destroy(vmHandle: number): void;
  memory: WebAssembly.Memory;
}

export async function loadEVM(): Promise<EVMInstance> {
  // Load and instantiate WASM module
}
```

### Task 4: Memory Management
```zig
// WASM-compatible allocator
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

export fn malloc(size: u32) u32 {
    const ptr = allocator.alloc(u8, size) catch return 0;
    return @intFromPtr(ptr.ptr);
}

export fn free(ptr: u32) void {
    // Proper deallocation
}
```

### Task 5: Build Pipeline Integration
Update existing build files:
- `package.json` - Add WASM build scripts
- Build system integration with TypeScript compilation

### Task 6: Testing WASM Build
File: `/test/wasm/wasm_integration_test.zig`
Test cases:
1. **WASM Module Loading**: Can load and instantiate WASM module
2. **Basic Execution**: Can execute simple bytecode
3. **Memory Management**: No memory leaks in WASM context
4. **Error Handling**: Proper error propagation to JavaScript
5. **Performance**: WASM execution speed benchmarks

## Integration Points

### Files to Create/Modify
- `/src/evm/wasm_api.zig` - New WASM C API
- `/src/root_wasm.zig` - Update WASM entry point
- `/build.zig` - Fix WASM build configuration
- `/src/wasm-loader.js` - Update WASM loader
- `/test/wasm/` - New WASM integration tests

### TypeScript Integration
- Update `/tevm/evm/index.ts` to use WASM when available
- Add WASM fallback mechanisms
- Ensure API compatibility between JS and WASM implementations

## Build System Changes

### WASM Build Target
```zig
// In build.zig
const wasm_target = b.resolveTargetQuery(.{
    .cpu_arch = .wasm32,
    .os_tag = .wasi,
});

const wasm_lib = b.addSharedLibrary(.{
    .name = "tevm_evm",
    .root_source_file = .{ .path = "src/root_wasm.zig" },
    .target = wasm_target,
    .optimize = optimize,
});
```

### Bundle Size Optimization
- Use `-Drelease-small` for browser builds
- Strip unnecessary symbols
- Optimize for size over speed in WASM context

## Testing Strategy

### WASM Build Tests
```bash
# Test WASM build
zig build -Dtarget=wasm32-wasi -Doptimize=ReleaseSmall

# Test WASM module loading
node test_wasm_loading.js

# Test TypeScript integration
npm run test:wasm
```

### Browser Compatibility
- Test in Chrome, Firefox, Safari
- Test WASM module instantiation
- Test memory usage patterns
- Verify performance characteristics

## Performance Considerations

### WASM Optimizations
- **Memory Layout**: Optimize for WASM linear memory
- **Function Calls**: Minimize WASM/JS boundary crossings
- **Data Transfer**: Efficient copying between WASM and JS memory
- **Bundle Size**: Keep WASM module as small as possible

### Size vs Speed Tradeoffs
```zig
// Conditional compilation for WASM
const WASM_BUILD = @import("builtin").target.cpu.arch == .wasm32;

pub fn optimize_for_wasm() void {
    if (WASM_BUILD) {
        // Size-optimized implementations
    } else {
        // Speed-optimized implementations
    }
}
```

## Success Criteria

1. **WASM Build Works**: `zig build -Dtarget=wasm32-wasi` succeeds
2. **TypeScript Integration**: Can call WASM EVM from TypeScript
3. **Test Suite Passes**: All tests work in WASM context
4. **Bundle Size**: WASM module under reasonable size limit
5. **Performance**: Acceptable execution speed compared to native
6. **Browser Compatibility**: Works in all major browsers

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test WASM build specifically** - Must verify WASM target builds
3. **Memory safety in WASM** - No undefined behavior in WASM context
4. **Proper C ABI exports** - Ensure JavaScript can call WASM functions
5. **Bundle size monitoring** - Track WASM module size impact
6. **Cross-platform testing** - Test on different architectures

## Complex Scenarios

### Memory Management Challenges
1. **Cross-boundary pointers**: Handling pointers between WASM and JS
2. **Garbage collection**: Managing memory lifecycles
3. **Large execution contexts**: Handling memory pressure
4. **Error recovery**: Cleaning up after execution failures

### Integration Challenges
1. **Build system complexity**: Multiple targets and optimizations
2. **API surface compatibility**: Maintaining consistent APIs
3. **Debug information**: Debugging WASM modules
4. **Development workflow**: Hot reloading and development tools

## References

- [WebAssembly Specification](https://webassembly.github.io/spec/)
- [Zig WASM Documentation](https://ziglang.org/learn/overview/#web-assembly-support)
- [WASI Interface](https://wasi.dev/)
- [WebAssembly JavaScript API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly)