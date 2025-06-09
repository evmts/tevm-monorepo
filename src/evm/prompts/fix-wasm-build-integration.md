# Fix WASM Build and Integration into Tevm TypeScript

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_fix_wasm_build_integration` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_fix_wasm_build_integration feat_fix_wasm_build_integration`
3. **Work in isolation**: `cd g/feat_fix_wasm_build_integration`
4. **Commit message**: `✨ feat: fix WASM build and integration into Tevm TypeScript`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Test WASM build and integration
5. Commit with emoji conventional commit format
6. DO NOT merge - leave ready for review

## Context

The WASM build is currently broken and needs to be fixed to integrate the high-performance Zig EVM into the Tevm TypeScript library. This is a critical system feature that will enable Tevm to achieve 100x performance improvements and smaller bundle sizes compared to the current Ethereumjs implementation.

## Current Status

Based on the README.md, the WASM build is listed as:
- [ ] **WASM Build** - Currently broken, needs fixing as well as integration into the overall Tevm typescript code

## Ethereum Specification

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

## Integration Points

### Files to Modify
- `/build.zig` - Add WASM build target configuration
- `/src/root_wasm.zig` - WASM-specific entry point and exports
- `/src/wasm-loader.js` - JavaScript WASM loader
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

### Task 2: Create WASM Entry Point
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
```

### Task 3: JavaScript WASM Loader
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

### Task 4: TypeScript Package Integration
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

### Task 5: Memory Management
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

### Task 6: Error Handling
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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test WASM build specifically** - Use `zig build wasm` or equivalent
3. **Verify browser compatibility** - Test in Chrome, Firefox, Safari
4. **Performance regression testing** - Ensure 100x improvement claim
5. **Bundle size monitoring** - Track impact on overall bundle size
6. **Memory leak testing** - Ensure proper cleanup of WASM instances
7. **Error handling coverage** - All EVM errors must propagate correctly

## Success Criteria

1. **WASM Build Success**: `zig build wasm` completes without errors
2. **Integration Tests Pass**: JavaScript can successfully call WASM EVM
3. **Performance Target**: 100x faster than Ethereumjs baseline
4. **Bundle Size**: WASM bundle under 500KB compressed
5. **Browser Compatibility**: Works in all major browsers
6. **API Compatibility**: Maintains existing Tevm API contracts
7. **Error Handling**: Proper error propagation and handling

## References

- [WebAssembly Specification](https://webassembly.github.io/spec/)
- [Zig WASM Documentation](https://ziglang.org/documentation/master/#WebAssembly)
- [Tevm Architecture Overview](../../docs/node/pages/introduction/architecture-overview.mdx)
- [EVM Implementations Benchmark](https://github.com/ziyadedher/evm-bench)