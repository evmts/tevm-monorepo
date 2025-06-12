# Fix WASM Build and Integration into Tevm TypeScript

## What
Fix the broken WASM build system and integrate the high-performance Zig EVM into Tevm's TypeScript codebase. The WASM build currently fails and needs complete integration with JavaScript bindings, memory management, and error handling to enable 100x performance improvements over the current Ethereumjs implementation.

## Why
The WASM build is critical for achieving the performance goals of Tevm - delivering 100x faster EVM execution with smaller bundle sizes. Without this integration, Tevm cannot leverage the high-performance Zig implementation and remains limited to slower JavaScript-based EVM execution.
<<<<<<< HEAD

## How
1. Fix the WASM build configuration in `build.zig` with proper targeting and optimization
2. Create JavaScript bindings and TypeScript interfaces for WASM exports
3. Implement memory management for JS/WASM boundary communication
4. Add comprehensive error handling and result propagation
5. Optimize for minimal bundle size and maximum performance
6. Create integration points with existing Tevm TypeScript packages

## Development Workflow
- **Branch**: `feat_implement_fix_wasm_build_and_integration_into_tevm_typescript` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_fix_wasm_build_and_integration_into_tevm_typescript feat_implement_fix_wasm_build_and_integration_into_tevm_typescript`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

=======

## How
1. Fix the WASM build configuration in `build.zig` with proper targeting and optimization
2. Create JavaScript bindings and TypeScript interfaces for WASM exports
3. Implement memory management for JS/WASM boundary communication
4. Add comprehensive error handling and result propagation
5. Optimize for minimal bundle size and maximum performance
6. Create integration points with existing Tevm TypeScript packages

## Development Workflow
- **Branch**: `feat_implement_fix_wasm_build_and_integration_into_tevm_typescript` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_fix_wasm_build_and_integration_into_tevm_typescript feat_implement_fix_wasm_build_and_integration_into_tevm_typescript`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Critical System Issue:**
- 🔴 **WASM Build Broken**: Build system fails to generate working WASM output
- 🔴 **No TypeScript Integration**: No bridge between Zig EVM and TypeScript codebase
- 🔴 **Performance Blocker**: Prevents 100x performance improvements from being realized

**Current Status:**
- ❌ WASM build system is non-functional
- ❌ No JavaScript/TypeScript bindings for Zig EVM
- ❌ No memory management for JS/WASM boundary
- ❌ Missing error handling and result propagation
- ❌ No integration with existing Tevm packages

**Evidence Found:**
- ✅ WASM-related files exist (root_wasm.zig, wasm_stubs.zig, compiler_wasm.zig)
- ❌ But no working build configuration or TypeScript integration
- ❌ No WASM loader in TypeScript codebase
- ❌ No tests for WASM functionality

**Impact:**
- 🔥 **CRITICAL**: Tevm cannot leverage high-performance Zig implementation
- 🔥 **BLOCKING**: Stuck with slower JavaScript-based EVM execution
- 🔥 **HIGH PRIORITY**: Required for competitive performance

**Next Steps:**
1. Fix WASM build configuration in build.zig
2. Create JavaScript bindings for WASM exports
3. Implement memory management for JS/WASM communication
4. Add comprehensive error handling
5. Create integration points with existing TypeScript packages
</review>
>>>>>>> origin/main

## Context

The WASM build is currently broken and needs to be fixed to integrate the high-performance Zig EVM into the Tevm TypeScript library. This is a critical system feature that will enable Tevm to achieve 100x performance improvements and smaller bundle sizes compared to the current Ethereumjs implementation.

## ELI5

Imagine we built a rocket engine (our Zig EVM) but can't attach it to our spaceship (TypeScript codebase) because the connection system is broken. WASM is like the mounting system that lets our super-fast compiled code work seamlessly with JavaScript. Without fixing this integration, we're stuck using a bicycle engine when we could have rocket propulsion - we need to repair the build system so our TypeScript code can actually harness the 100x performance boost.

## Current Status

Based on the README.md, the WASM build is listed as:
- [ ] **WASM Build** - Currently broken, needs fixing as well as integration into the overall Tevm typescript code

## Specification

The WASM build should expose all core EVM functionality through a WebAssembly interface that can be called from JavaScript/TypeScript:

- Execute bytecode with proper gas accounting
- Handle all opcodes from Frontier through Cancun hardforks  
- Support state management and storage operations
- Provide access list and transient storage functionality
- Maintain compatibility with existing Tevm APIs

## Implementation Requirements

### Core Components
1. **Fix WASM Build System** - Resolve current build failures
2. **JavaScript Bindings** - Create TypeScript interfaces for WASM exports
3. **Memory Management** - Handle memory allocation between JS and WASM
4. **Error Handling** - Proper error propagation from WASM to JS
5. **Performance Optimization** - Minimize JS/WASM boundary overhead
6. **Bundle Size** - Ensure optimal WASM bundle size for browser deployment

### Build Configuration
```zig
// In build.zig - WASM target configuration
const wasm_target = b.resolveTargetQuery(.{
    .cpu_arch = .wasm32,
    .os_tag = .freestanding,
    .abi = .musl,
});

const wasm_lib = b.addSharedLibrary(.{
    .name = "tevm_evm",
    .root_source_file = .{ .path = "src/root_wasm.zig" },
    .target = wasm_target,
    .optimize = .ReleaseSmall, // Optimize for bundle size
});
```

### WASM Interface Design
```zig
// Export core EVM functions for JavaScript binding
export fn evm_create(hardfork: u8) u32;
export fn evm_execute(vm_handle: u32, bytecode_ptr: [*]const u8, bytecode_len: u32, gas_limit: u64) u32;
export fn evm_get_result(result_handle: u32, output_ptr: [*]u8, output_len: u32) u32;
export fn evm_destroy(vm_handle: u32) void;
export fn evm_set_storage(vm_handle: u32, addr_ptr: [*]const u8, key_ptr: [*]const u8, value_ptr: [*]const u8) void;
export fn evm_get_storage(vm_handle: u32, addr_ptr: [*]const u8, key_ptr: [*]const u8, value_ptr: [*]u8) void;
```

## File Structure

**Primary Files to Modify:**
- `/src/evm/wasm_stubs.zig` - WASM-specific implementations
- `/src/root_wasm.zig` - WASM root module
- `/src/root_wasm_minimal.zig` - Minimal WASM build
- `/build.zig` - Build configuration for WASM target

**Supporting Files:**
- `/src/evm/vm.zig` - VM implementation that needs WASM compatibility
- `/src/wasm-loader.js` - JavaScript WASM loader
- `/packages/*/` - Integrate WASM into TypeScript packages

**Test Files:**
- `/test/wasm/wasm_integration_test.zig` - WASM-specific tests
- `/test/wasm/` - Integration tests for TypeScript/WASM interface

**Why These Files:**
- WASM stubs provide platform-specific implementations for WASM environment
- Root WASM modules define the entry points and exports for JavaScript
- Build system needs proper WASM target configuration
- VM implementation must be compatible with WASM constraints

## Integration Points

### Files to Create/Modify
- `/src/evm/wasm_api.zig` - New WASM C API
- `/src/root_wasm.zig` - Update WASM entry point
- `/build.zig` - Fix WASM build configuration
- `/src/wasm-loader.js` - Update WASM loader
- `/test/wasm/` - New WASM integration tests
- `/packages/*/` - Integrate WASM into TypeScript packages
- `/src/evm/wasm_stubs.zig` - WASM-specific functionality stubs

### JavaScript Integration
```typescript
// TypeScript interface for WASM EVM
interface WasmEvm {
  create(hardfork: Hardfork): Promise<EvmInstance>;
  execute(bytecode: Uint8Array, gasLimit: bigint): Promise<ExecutionResult>;
  setStorage(address: Address, key: Hex, value: Hex): Promise<void>;
  getStorage(address: Address, key: Hex): Promise<Hex>;
}

// Usage in Tevm packages
import { createWasmEvm } from '@tevm/evm-wasm';

const evm = await createWasmEvm({ hardfork: 'cancun' });
const result = await evm.execute(bytecode, 1000000n);
```

## Implementation Tasks

### Task 1: Fix Build System
File: `/build.zig`
- Add WASM target configuration
- Configure memory layout for WASM
- Set optimization flags for bundle size
- Add WASM-specific compilation flags

### Task 2: Create WASM C API
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

### Task 3: Create WASM Entry Point
File: `/src/root_wasm.zig`
```zig
const std = @import("std");
const evm = @import("evm");

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

// Handle registry for JS/WASM communication
var vm_handles = std.HashMap(u32, *evm.Vm, std.hash_map.DefaultContext(u32), std.hash_map.default_max_load_percentage).init(allocator);
var next_handle: u32 = 1;

export fn evm_create(hardfork: u8) u32 {
    const vm = allocator.create(evm.Vm) catch return 0;
    vm.* = evm.Vm.init(allocator, @enumFromInt(hardfork)) catch {
        allocator.destroy(vm);
        return 0;
    };
    
    const handle = next_handle;
    next_handle += 1;
    vm_handles.put(handle, vm) catch {
        vm.deinit();
        allocator.destroy(vm);
        return 0;
    };
    
    return handle;
}

export fn evm_execute(vm_handle: u32, bytecode_ptr: [*]const u8, bytecode_len: u32, gas_limit: u64) u32 {
    const vm = vm_handles.get(vm_handle) orelse return 0;
    const bytecode = bytecode_ptr[0..bytecode_len];
    
    const result = vm.execute(bytecode, gas_limit) catch return 0;
    
    // Store result and return handle
    return store_execution_result(result);
}

// WASM-compatible allocator
export fn malloc(size: u32) u32 {
    const ptr = allocator.alloc(u8, size) catch return 0;
    return @intFromPtr(ptr.ptr);
}

export fn free(ptr: u32) void {
    // Proper deallocation
}
```

### Task 4: TypeScript WASM Loader
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

### Task 5: JavaScript WASM Loader Implementation
File: `/src/wasm-loader.js`
```javascript
let wasmModule = null;

export async function loadWasm() {
  if (wasmModule) return wasmModule;
  
  const wasmBytes = await fetch('/tevm_evm.wasm').then(r => r.arrayBuffer());
  const wasmModule = await WebAssembly.instantiate(wasmBytes, {
    env: {
      // Environment imports if needed
    }
  });
  
  return wasmModule.instance.exports;
}

export class WasmEvm {
  constructor(wasmExports) {
    this.wasm = wasmExports;
  }
  
  async create(hardfork) {
    const hardforkId = hardforkToId(hardfork);
    const handle = this.wasm.evm_create(hardforkId);
    if (handle === 0) throw new Error('Failed to create EVM instance');
    return new EvmInstance(this.wasm, handle);
  }
}
```

### Task 6: TypeScript Package Integration
File: `/packages/evm-wasm/package.json`
```json
{
  "name": "@tevm/evm-wasm",
  "version": "1.0.0-next.0",
  "description": "High-performance WASM EVM for Tevm",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist/", "tevm_evm.wasm"]
}
```

File: `/packages/evm-wasm/src/index.ts`
```typescript
export { WasmEvm, type EvmInstance, type ExecutionResult } from './WasmEvm.js';
export { loadWasm } from './loader.js';
```

### Task 7: Memory Management
```zig
// WASM-specific memory management
export fn wasm_allocate(size: u32) [*]u8 {
    const memory = allocator.alloc(u8, size) catch return null;
    return memory.ptr;
}

export fn wasm_deallocate(ptr: [*]u8, size: u32) void {
    const memory = ptr[0..size];
    allocator.free(memory);
}
```

### Task 8: Error Handling
```zig
// Error codes for WASM interface
pub const WasmError = enum(u32) {
    Success = 0,
    OutOfGas = 1,
    InvalidOpcode = 2,
    StackUnderflow = 3,
    StackOverflow = 4,
    InvalidJump = 5,
    Revert = 6,
};

export fn evm_get_last_error() u32 {
    return @intFromEnum(last_error);
}
```

### Task 7: Bundle Size Optimization
- Use `ReleaseSmal` optimization mode
- Strip debug information
- Minimize exports to only necessary functions
- Use efficient data serialization
- Profile bundle size impact

## Testing Requirements

### Test File
Create `/test/evm/wasm/wasm_integration_test.zig`

### Test Cases
1. **Build Verification**: WASM module builds successfully
2. **Basic Execution**: Simple bytecode execution through WASM
3. **Memory Management**: Proper allocation/deallocation
4. **Error Handling**: Error propagation from WASM to JS
5. **Performance**: Benchmark vs JavaScript implementation
6. **Bundle Size**: Verify optimal bundle size
7. **Browser Compatibility**: Test in major browsers
8. **Node.js Compatibility**: Test in Node.js environment

### JavaScript Tests
```javascript
import { test } from 'vitest';
import { WasmEvm } from '@tevm/evm-wasm';

test('WASM EVM basic execution', async () => {
  const evm = await WasmEvm.create('cancun');
  const bytecode = new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x01]); // PUSH1 1 PUSH1 2 ADD
  const result = await evm.execute(bytecode, 1000000n);
  
  expect(result.success).toBe(true);
  expect(result.gasUsed).toBeLessThan(1000000n);
});

test('WASM EVM performance benchmark', async () => {
  const start = performance.now();
  // Run complex bytecode execution
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // Should be fast
});
```

## Performance Targets

### Execution Speed
- 100x faster than current Ethereumjs implementation
- Sub-millisecond execution for simple operations
- Efficient memory usage with minimal allocations

### Bundle Size
- WASM file under 500KB compressed
- Minimal impact on overall Tevm bundle size
- Efficient tree-shaking for unused features

### Memory Usage
- Minimal JS/WASM memory copying
- Efficient garbage collection integration
- Low memory overhead for VM instances

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

## References

- [WebAssembly Specification](https://webassembly.github.io/spec/)
- [Zig WASM Documentation](https://ziglang.org/documentation/master/#WebAssembly)
- [Tevm Architecture Overview](../../docs/node/pages/introduction/architecture-overview.mdx)
- [EVM Implementations Benchmark](https://github.com/ziyadedher/evm-bench)
## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/build/wasm_build_integration_test.zig`)
```zig
// Test basic wasm_build_integration functionality
test "wasm_build_integration basic functionality works correctly"
test "wasm_build_integration handles edge cases properly"
test "wasm_build_integration validates inputs appropriately"
test "wasm_build_integration produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "wasm_build_integration integrates with EVM properly"
test "wasm_build_integration maintains system compatibility"
test "wasm_build_integration works with existing components"
test "wasm_build_integration handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "wasm_build_integration meets performance requirements"
test "wasm_build_integration optimizes resource usage"
test "wasm_build_integration scales appropriately with load"
test "wasm_build_integration benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "wasm_build_integration meets specification requirements"
test "wasm_build_integration maintains EVM compatibility"
test "wasm_build_integration handles hardfork transitions"
test "wasm_build_integration cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "wasm_build_integration handles errors gracefully"
test "wasm_build_integration proper error propagation"
test "wasm_build_integration recovery from failure states"
test "wasm_build_integration validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "wasm_build_integration prevents security vulnerabilities"
test "wasm_build_integration handles malicious inputs safely"
test "wasm_build_integration maintains isolation boundaries"
test "wasm_build_integration validates security properties"
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
test "wasm_build_integration basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = wasm_build_integration.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const wasm_build_integration = struct {
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
