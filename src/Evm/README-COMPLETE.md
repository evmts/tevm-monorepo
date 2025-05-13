# TEVM Zig EVM Implementation

This directory contains a Zig implementation of the Ethereum Virtual Machine (EVM) based on the [evmone](https://github.com/ethereum/evmone) C++ EVM implementation. This implementation aims to provide a high-performance, memory-safe EVM implementation that leverages Zig's unique capabilities.

## Overview

The implementation consists of several key components:

1. **Core Data Structures**
   - `ExecutionState`: Manages the EVM execution context, including memory, stack, and state
   - `StackSpace`: Implements the EVM stack with fixed-size allocation
   - `Memory`: Implements EVM memory with dynamic growth capability
   - `Uint256`: 256-bit unsigned integer implementation

2. **Instruction Set**
   - Complete mapping of all EVM opcodes
   - Implementation of arithmetic operations (ADD, SUB, MUL, DIV, etc.)
   - Implementation of bitwise operations (AND, OR, XOR, NOT, etc.)
   - Implementation of control flow operations (JUMP, JUMPI)
   - Implementation of memory operations (MLOAD, MSTORE, MSTORE8)
   - Implementation of stack manipulation operations (PUSH, POP, DUP, SWAP)

3. **Interpreter**
   - Baseline execution mode implementation
   - Instruction dispatch and execution loop
   - Gas accounting and stack validation
   - Memory management and growth

4. **Tests**
   - Unit tests for individual components
   - Integration tests for the interpreter
   - Example programs demonstrating usage

## Directory Structure

- `evm.zig`: Main EVM implementation
- `execution_state.zig`: EVM execution state and related structures
- `opcodes.zig`: Definition of all EVM opcodes
- `instructions.zig`: Implementation of instruction handlers
- `interpreter.zig`: Baseline execution mode implementation
- `constants.zig`: EVM constants and gas costs
- `evm_test.zig`: Tests for the core EVM components
- `interpreter_test.zig`: Tests for the interpreter
- `main_example.zig`: Example program demonstrating usage

## Current Status

This implementation is a work in progress but already provides the following capabilities:

- ✅ Core EVM data structures (memory, stack, execution state)
- ✅ Complete opcode mapping
- ✅ Basic arithmetic and bitwise operations
- ✅ Stack manipulation operations
- ✅ Memory operations
- ✅ Control flow operations
- ✅ Baseline interpreter execution loop
- ✅ Gas accounting
- ❌ Storage operations (SLOAD, SSTORE)
- ❌ Environmental operations (BALANCE, ADDRESS, etc.)
- ❌ External calls (CALL, DELEGATECALL, etc.)
- ❌ Precompiled contracts
- ❌ EOF support
- ❌ Advanced optimization modes

## Usage

Here's a simple example of using the EVM implementation:

```zig
const std = @import("std");
const evm = @import("evm.zig");
const execution_state = @import("execution_state.zig");
const interpreter = @import("interpreter.zig");

pub fn main() !void {
    // Initialize allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
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
    
    // Set up bytecode (PUSH1 0x01, PUSH1 0x02, ADD, RETURN result)
    const bytecode = [_]u8{
        0x60, 0x01,       // PUSH1 0x01
        0x60, 0x02,       // PUSH1 0x02
        0x01,             // ADD
        0x60, 0x00,       // PUSH1 0x00 (memory position)
        0x52,             // MSTORE
        0x60, 0x20,       // PUSH1 0x20 (32 bytes)
        0x60, 0x00,       // PUSH1 0x00 (from memory position 0)
        0xf3              // RETURN
    };
    
    // Create execution state and interpreter
    var state = try execution_state.ExecutionState.init(allocator, &msg, 0, host_ctx, &bytecode);
    defer state.deinit();
    var interp = interpreter.Interpreter.init(allocator);
    
    // Execute bytecode
    const result = try interp.execute(&state);
    
    // Check result
    if (result.status_code == .SUCCESS) {
        // Output data contains the result (0x03)
        std.debug.print("Result: {}\n", .{result.output_data[31]});
    }
}
```

## Memory Management

All structures in this implementation follow Zig's ownership model:

1. Structures that own memory take an allocator in their `init` function
2. All such structures have a corresponding `deinit` function to free resources
3. Memory is explicitly managed, with no hidden allocations or deallocations
4. Arena allocators are used in tests for simple cleanup

## Design Decisions

Several key design decisions were made in this implementation:

1. **Explicit Memory Management**: Unlike evmone which uses C++ smart pointers, this implementation explicitly manages memory using Zig's allocator pattern.

2. **Strong Typing**: Using Zig's strong type system to enforce correctness and catch errors at compile time.

3. **Modularity**: Breaking the implementation into small, focused modules that each do one thing well.

4. **Testing**: Comprehensive tests for each component to ensure correctness.

5. **Performance**: Careful attention to memory layout and allocation patterns to minimize overhead.

## Next Steps

Future work on this implementation includes:

1. Implementing storage operations (SLOAD, SSTORE)
2. Adding environmental operations
3. Implementing external calls
4. Adding precompiled contracts
5. Implementing EOF support
6. Adding more advanced optimization modes
7. Improving the big integer implementation
8. Adding benchmarking and performance tuning
9. Integrating with the broader TEVM infrastructure

## Building and Testing

To build and run tests:

```bash
# Build in debug mode
zig build

# Run all tests
zig test src/Evm/evm_test.zig
zig test src/Evm/interpreter_test.zig

# Run the example
zig run src/Evm/main_example.zig
```