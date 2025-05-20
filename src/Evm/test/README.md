# EVM Test Framework

This directory contains the EVM testing framework and test suites for the Tevm Ethereum Virtual Machine implementation in Zig. The test framework provides utilities for creating and executing EVM bytecode tests in a controlled environment, validating execution results, and verifying gas calculations.

## Test Framework Architecture

The testing framework is built around the following key components:

### `EvmTestHelpers.zig`

This file provides the core testing infrastructure:

- `EvmTest`: A test fixture that encapsulates an EVM instance, execution context, and result tracking.
- `EvmResult`: A struct that captures the output of EVM execution, including gas usage and return data.
- `EvmTestConfig`: Configuration options for test execution, including hardfork selection, gas limits, and logging verbosity.
- Utility functions for bytecode creation: A comprehensive set of helper functions that make it easier to construct EVM bytecode for testing specific operations.

### Test Categories

The test directory contains several categories of tests:

- **ArithmeticTests**: Tests for basic arithmetic operations (ADD, SUB, MUL, DIV, etc.).
- **ControlFlowTests**: Tests for control flow operations (JUMP, JUMPI, etc.).
- **GasTests**: Tests focused on gas calculation and consumption.
- **MemoryTests**: Tests for memory operations and edge cases.

## Key Testing Patterns

### Bytecode Builder Pattern

The test helpers provide a "builder pattern" API for constructing EVM bytecode. This makes tests more readable and easier to maintain. For example:

```zig
// Test: 1 + 2 = 3
const code = helpers.add(1, 2) ++ helpers.ret_top();
try evm_test.execute(100, code, &[_]u8{});
// ... validate results
```

### Test Assertions

The framework provides specific assertion functions:

- `expectSuccess()`: Assert that execution completed successfully without errors.
- `expectError()`: Assert that execution failed with a specific error type.
- `expectResult()`: Assert that the numeric result matches the expected value.
- `expectGasUsed()`: Assert that the execution used the expected amount of gas.
- `expectMaxGasUsed()`: Assert that the execution used no more than the specified gas.

### Gas Cost Validation

Many tests include gas consumption validation to ensure that operations have correct gas costs. This is particularly important for verifying compliance with Ethereum specifications and EIPs.

### Hardfork Testing

The framework supports testing with different Ethereum hardfork rules, ensuring that opcodes behave correctly across protocol versions.

## Usage Examples

### Basic Test Structure

```zig
test "example test" {
    // Initialize the test fixture
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Construct bytecode for the test
    const code = helpers.push(1) ++ helpers.push(2) ++ 
                 &[_]u8{@intFromEnum(Opcode.ADD)} ++ 
                 helpers.ret_top();
    
    // Execute the bytecode
    try evm_test.execute(1000, code, &[_]u8{});
    
    // Check the results
    try evm_test.expectResult(3);
    
    // Optionally check gas usage
    try evm_test.expectMaxGasUsed(100);
}
```

### Testing Error Conditions

```zig
test "stack overflow" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Create code that will cause stack overflow
    var code = std.ArrayList(u8).init(testing.allocator);
    defer code.deinit();
    
    // Push 1025 values (more than max stack size)
    var i: usize = 0;
    while (i < 1025) : (i += 1) {
        try code.append(@intFromEnum(Opcode.PUSH1));
        try code.append(0);
    }
    
    // Execute and expect StackOverflow error
    try evm_test.execute(10000, code.items, &[_]u8{});
    try evm_test.expectError(interpreter.InterpreterError.StackOverflow);
}
```

## Debugging Tools

The framework includes debugging and diagnostic tools:

- Configurable log levels (`silent`, `minimal`, `verbose`, `trace`)
- Execution tracing capability
- Result formatting for detailed error analysis
- Diagnostic output functions for troubleshooting failed tests

## Testing Philosophy

The EVM tests in this directory focus on unit testing individual opcodes and small code sequences, with an emphasis on:

1. Correctness of operation semantics
2. Gas cost calculations
3. Error handling
4. Edge cases (overflows, underflows, etc.)
5. Hardfork-specific behavior

For integration tests and EIP implementation tests, see the `../tests` directory which contains higher-level tests that verify proper implementation of Ethereum Improvement Proposals (EIPs).