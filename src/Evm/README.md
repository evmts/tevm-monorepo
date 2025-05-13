# TEVM Zig EVM Implementation

This directory contains the Zig implementation of the Ethereum Virtual Machine (EVM) for the TEVM project. The implementation is based on the [evmone](https://github.com/ethereum/evmone) C++ EVM implementation but rewritten in Zig to leverage Zig's memory safety, performance, and cross-compilation capabilities.

## Current Status

This is a work in progress. Currently implemented:

- Core EVM data structures:
  - `ExecutionState`: The execution context for EVM operations
  - `Memory`: The EVM memory model with dynamic growth
  - `StackSpace`: The EVM stack implementation
  - `Uint256`: Basic 256-bit unsigned integer implementation (placeholder)
- Base EVM structure:
  - VM configuration
  - Execution state management
  - Option handling
  - Tracer interface
- Constants and gas costs
- Basic testing infrastructure

## File Structure

- `evm.zig`: Main EVM implementation
- `execution_state.zig`: EVM execution state and related structures
- `constants.zig`: EVM constants and gas costs
- `evm_test.zig`: Tests for the EVM implementation
- `main.zig`: Simple demo program

## Planned Additions

The following components still need to be implemented:

1. **Instruction Set**: Implementation of all EVM opcodes
2. **Execution Engine**: Baseline and optimized execution engines
3. **Analysis**: Code analysis for optimization
4. **Precompiles**: Cryptographic precompiled contracts
5. **EOF Support**: EVM Object Format parsing and execution
6. **Testing**: Comprehensive test suite
7. **Integration**: Integration with the broader TEVM ecosystem

## Usage

Basic example of using the EVM:

```zig
const std = @import("std");
const evm = @import("evm.zig");
const execution_state = @import("execution_state.zig");

pub fn main() !void {
    // Initialize allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer {
        const leak = gpa.deinit();
        if (leak) std.debug.print("Memory leak detected!\n", .{});
    }
    const allocator = gpa.allocator();
    
    // Create EVM instance
    var vm = try evm.EVM.init(allocator);
    defer vm.deinit();
    
    // Set up message and host context
    const msg = execution_state.EvmcMessage{
        .gas = 100000,
        // ... other fields
    };
    const host_ctx = execution_state.HostContext{};
    
    // Simple bytecode: PUSH1 0x01, PUSH1 0x02, ADD, STOP
    const bytecode = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01, 0x00 };
    
    // Execute
    const result = try vm.execute(0, &msg, &bytecode, host_ctx);
    
    // Check result
    std.debug.print("Status: {}\n", .{result.status_code});
}
```

## Memory Management

This implementation uses Zig's allocator pattern for memory management. Each structure that owns memory takes an allocator in its `init` function and has a corresponding `deinit` function to free resources.

When using these structures, you must call `deinit` when you're done with them to avoid memory leaks.

## Implementation Notes

### Differences from evmone

The key differences between this implementation and evmone:

1. **Memory Management**: Uses Zig's allocator pattern rather than C++ smart pointers
2. **Error Handling**: Uses Zig's error union type for error propagation
3. **Big Integers**: Uses a custom Uint256 implementation (needs to be expanded)
4. **Generics**: Uses Zig's comptime features rather than C++ templates
5. **No Dependencies**: Self-contained implementation without external dependencies

### Performance Considerations

The Zig implementation aims to match or exceed the performance of evmone by:

1. Using Zig's comptime features for optimizations
2. Avoiding dynamic memory allocations during execution
3. Using tight memory layouts for key data structures
4. Leveraging Zig's inline assembly capabilities for critical operations