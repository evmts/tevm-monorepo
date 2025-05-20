# EVM Opcodes Implementation

This directory contains the implementation of the Ethereum Virtual Machine (EVM) opcodes in Zig. Each opcode is implemented according to the Ethereum Yellow Paper specifications and organized into logical groups.

## Overview

The EVM opcodes are the instruction set for the Ethereum Virtual Machine. Each opcode is a single byte (0x00-0xFF) that represents a specific operation, such as adding two numbers, accessing storage, or calling another contract.

## Directory Structure

The opcodes are organized into logical categories:

- **[math.zig](./math.zig)** and **[math2.zig](./math2.zig)**: Arithmetic operations (ADD, SUB, MUL, DIV, etc.)
- **[bitwise.zig](./bitwise.zig)**: Bitwise operations (AND, OR, XOR, NOT, etc.)
- **[comparison.zig](./comparison.zig)**: Comparison operations (LT, GT, SLT, SGT, EQ, etc.)
- **[memory.zig](./memory.zig)**: Memory operations (MLOAD, MSTORE, MSTORE8, etc.)
- **[storage.zig](./storage.zig)**: Storage operations (SLOAD, SSTORE)
- **[controlflow.zig](./controlflow.zig)**: Control flow operations (JUMP, JUMPI, JUMPDEST, etc.)
- **[environment.zig](./environment.zig)**: Environment information (ADDRESS, BALANCE, CALLER, etc.)
- **[crypto.zig](./crypto.zig)**: Cryptographic operations (KECCAK256, etc.)
- **[calls.zig](./calls.zig)**: Contract calls (CALL, STATICCALL, DELEGATECALL, etc.)
- **[log.zig](./log.zig)**: Event logging operations (LOG0-LOG4)
- **[block.zig](./block.zig)**: Block information (BLOCKHASH, COINBASE, TIMESTAMP, etc.)
- **[transient.zig](./transient.zig)**: Transient storage operations (TLOAD, TSTORE) - EIP-1153
- **[blob.zig](./blob.zig)**: Blob operations (BLOBHASH, BLOBBASEFEE) - EIP-4844

Each opcode implementation follows a common pattern:

1. The implementation function takes three parameters:
   - `pc`: The current program counter
   - `interpreter`: Pointer to the interpreter
   - `frame`: Pointer to the current execution frame

2. The function handles stack operations, performs the required computation, and updates the stack accordingly.

3. Each opcode has associated gas costs and stack requirements.

## EIP Implementations

Several Ethereum Improvement Proposals (EIPs) are implemented in dedicated files:

- **[eip1153.test.zig](./eip1153.test.zig)**: Tests for EIP-1153 (Transient Storage)
- **[eip4844.test.zig](./eip4844.test.zig)**: Tests for EIP-4844 (Blob Transactions)

## Registration System

Opcodes are registered in a jump table to map bytecodes to their implementation. Each category has a `registerXxxOpcodes` function that adds its opcodes to the jump table during initialization.

Example from `math.zig`:

```zig
pub fn registerMathOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // ADD (0x01)
    const add_op = try allocator.create(JumpTable.Operation);
    add_op.* = JumpTable.Operation{
        .execute = opAdd,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x01] = add_op;
    
    // ... other opcodes
}
```

## Testing

Each opcode category includes a corresponding test file (e.g., `math.test.zig`) that verifies the correct behavior of the opcodes. These tests ensure that the implementation follows the Ethereum specification correctly.

## Gas Costs

Gas costs for opcodes are defined in the jump table and follow the Ethereum gas schedule. There are several types of gas costs:

1. **Constant Gas**: Fixed cost for the operation
2. **Dynamic Gas**: Variable cost based on operation parameters
3. **Memory Expansion Gas**: Cost for expanding memory

## Stack Requirements

Each opcode has stack requirements defined in the jump table:

- `min_stack`: Minimum number of items required on the stack
- `max_stack`: Maximum number of items allowed on the stack after execution

## Execution Flow

When an opcode is executed:

1. The interpreter fetches the opcode at the current program counter.
2. It looks up the implementation in the jump table.
3. It checks that there are enough items on the stack.
4. It calculates and charges gas for the operation.
5. It executes the operation by calling the opcode's execution function.
6. It advances the program counter to the next instruction.

## Implemented Instructions

All Ethereum opcodes up to the Cancun hardfork are implemented:

- **0x00-0x0B**: Stop and arithmetic operations
- **0x10-0x1F**: Comparison and bitwise operations
- **0x20**: KECCAK256
- **0x30-0x4A**: Environmental information and block information
- **0x50-0x5F**: Stack, memory, storage, and flow operations
- **0x60-0x7F**: Push operations (PUSH0-PUSH32)
- **0x80-0x8F**: Duplication operations (DUP1-DUP16)
- **0x90-0x9F**: Exchange operations (SWAP1-SWAP16)
- **0xA0-0xA4**: Logging operations (LOG0-LOG4)
- **0xF0-0xFF**: System operations (CREATE, CALL, RETURN, etc.)