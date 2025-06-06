# EVM Integration Tests

This directory contains integration tests for the EVM implementation. These tests verify that opcodes work correctly together in realistic scenarios.

## Test Files

### arithmetic_sequences_test.zig
Tests complex arithmetic calculations and sequences:
- Multi-step arithmetic operations (e.g., `(10 + 20) * 3 - 15`)
- Modular arithmetic with overflow handling
- Fibonacci sequence calculation using stack manipulation
- Conditional arithmetic based on comparisons
- Average calculations
- ADDMOD and MULMOD with large values
- Exponentiation chains

### memory_storage_test.zig
Tests memory and storage interactions:
- Memory to storage pipeline
- Hash-based storage key generation
- Memory copy operations (MCOPY)
- Transient storage operations (TLOAD/TSTORE)
- Memory size tracking and expansion
- Array storage slot calculations
- Gas cost tracking for memory and storage operations
- Cold/warm storage access patterns

### control_flow_test.zig
Tests control flow and system operations:
- Conditional jump patterns (JUMP/JUMPI)
- Loop implementations
- Return data handling
- Revert with error messages
- Program counter tracking
- Invalid opcode handling
- Nested conditions with jumps
- Self-destruct operations

### environment_system_test.zig
Tests environment and system interactions:
- Contract deployment simulation (CREATE)
- Inter-contract calls with value transfer
- Environment data access (ADDRESS, ORIGIN, CALLER, etc.)
- Block information access
- Log emission with topics
- External code operations (EXTCODESIZE, EXTCODECOPY, EXTCODEHASH)
- Calldata operations
- Self balance and code operations

### complex_interactions_test.zig
Tests complex real-world patterns:
- ERC20 token balance checks
- Packed struct storage
- Dynamic array length updates
- Reentrancy guard patterns
- Bitfield manipulation
- Safe math operations (overflow checking)
- Signature verification simulation
- Multi-sig wallet threshold checks

## Running Tests

To run all integration tests:
```bash
zig build test-integration
```

To run a specific test file:
```bash
zig test test/evm/integration/basic_sequences_test.zig
```

## Test Structure

Each test follows this pattern:
1. Initialize a test VM and frame
2. Set up necessary state (memory, storage, code)
3. Execute a sequence of opcodes
4. Verify the final state and any side effects
5. Check gas consumption where relevant

## Key Testing Patterns

### Testing Opcode Sequences
```zig
// Push values
try frame.pushValue(5);
try frame.pushValue(3);

// Execute opcodes
try test_helpers.executeOpcode(opcodes.arithmetic.op_add, &frame);
try test_helpers.executeOpcode(opcodes.arithmetic.op_mul, &frame);

// Verify result
try testing.expectEqual(@as(u256, expected), try frame.popValue());
```

### Testing Contract Interactions
```zig
// Set up mock call result
vm.vm.call_result = .{
    .success = true,
    .gas_left = 90000,
    .output = &return_data,
};

// Execute call
try test_helpers.executeOpcode(opcodes.system.op_call, &frame);

// Check result
try testing.expectEqual(@as(u256, 1), try frame.popValue());
```

### Testing Gas Consumption
```zig
const gas_before = frame.frame.gas_remaining;
try test_helpers.executeOpcode(opcode, &frame);
const gas_used = gas_before - frame.frame.gas_remaining;
try testing.expectEqual(expected_gas, gas_used);
```

## Common Test Scenarios

1. **Arithmetic Workflows**: Testing complex mathematical expressions
2. **Memory Management**: Testing memory expansion and data copying
3. **Storage Operations**: Testing persistent and transient storage
4. **Contract Calls**: Testing different call types and their behaviors
5. **Event Emission**: Testing log operations and event patterns
6. **Error Handling**: Testing error propagation and recovery
7. **Gas Accounting**: Testing gas consumption patterns
8. **Edge Cases**: Testing boundary conditions and special cases

## Adding New Tests

When adding new integration tests:
1. Create a new test file or add to an existing one
2. Use descriptive test names that explain the scenario
3. Include comments explaining complex test logic
4. Test both success and failure cases
5. Verify gas consumption where relevant
6. Check for side effects (storage changes, logs, etc.)
7. Consider edge cases and boundary conditions