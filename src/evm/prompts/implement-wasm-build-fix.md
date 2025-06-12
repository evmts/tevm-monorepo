# Fix WASM Build and TypeScript Integration

## Git Workflow Instructions

#
<<<<<<< HEAD
=======
<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Duplicate of fix-wasm-build-integration.md:**
- 📝 **NOTE**: This prompt covers the same scope as fix-wasm-build-integration.md
- 📝 **Recommendation**: Consolidate or choose one prompt to avoid duplication

**Current Status:**
- ❌ WASM build system is broken and non-functional
- ❌ No TypeScript integration for Zig EVM
- ❌ Missing WASM-specific implementations in wasm_stubs.zig
- ❌ Build.zig lacks proper WASM target configuration

**Key Files Identified:**
- ✅ `/src/evm/wasm_stubs.zig` exists but needs implementation
- ✅ `/src/root_wasm.zig` and `/src/root_wasm_minimal.zig` exist
- ✅ `/build.zig` exists but WASM configuration is broken
- ❌ No TypeScript bindings or WASM loader

**Impact:**
- 🔥 **CRITICAL BLOCKER**: Prevents using high-performance Zig EVM in JavaScript
- 🔥 **Performance Impact**: Forces fallback to slower implementations

**Priority**: Should be consolidated with the more detailed fix-wasm-build-integration.md prompt
</review>

>>>>>>> origin/main
## Context

The WASM build is currently broken and needs to be fixed as well as integrated into the overall Tevm TypeScript codebase. This is a critical blocker for using the Zig EVM implementation in JavaScript environments.

## File Structure

**Primary Files to Modify:**
- `/src/evm/wasm_stubs.zig` - WASM-specific implementations
- `/src/root_wasm.zig` - WASM root module
- `/src/root_wasm_minimal.zig` - Minimal WASM build

**Supporting Files:**
- `/build.zig` - Build configuration for WASM target
- `/src/evm/vm.zig` - VM implementation that needs WASM compatibility

**Test Files:**
- WASM-specific tests would be added
- Integration tests for TypeScript/WASM interface

**Why These Files:**
- WASM stubs provide platform-specific implementations for WASM environment
- Root WASM modules define the entry points and exports for JavaScript
- Build system needs proper WASM target configuration
- VM implementation must be compatible with WASM constraints

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


## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions
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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/build/wasm_build_fix_test.zig`)
```zig
// Test basic wasm_build_fix functionality
test "wasm_build_fix basic functionality works correctly"
test "wasm_build_fix handles edge cases properly"
test "wasm_build_fix validates inputs appropriately"
test "wasm_build_fix produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "wasm_build_fix integrates with EVM properly"
test "wasm_build_fix maintains system compatibility"
test "wasm_build_fix works with existing components"
test "wasm_build_fix handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "wasm_build_fix meets performance requirements"
test "wasm_build_fix optimizes resource usage"
test "wasm_build_fix scales appropriately with load"
test "wasm_build_fix benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "wasm_build_fix meets specification requirements"
test "wasm_build_fix maintains EVM compatibility"
test "wasm_build_fix handles hardfork transitions"
test "wasm_build_fix cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "wasm_build_fix handles errors gracefully"
test "wasm_build_fix proper error propagation"
test "wasm_build_fix recovery from failure states"
test "wasm_build_fix validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "wasm_build_fix prevents security vulnerabilities"
test "wasm_build_fix handles malicious inputs safely"
test "wasm_build_fix maintains isolation boundaries"
test "wasm_build_fix validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "wasm_build_fix basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = wasm_build_fix.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const wasm_build_fix = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## References

- [WebAssembly Specification](https://webassembly.github.io/spec/)
- [Zig WASM Documentation](https://ziglang.org/learn/overview/#web-assembly-support)
- [WASI Interface](https://wasi.dev/)
- [WebAssembly JavaScript API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly)