# Opcodes Tests Directory

This directory contains specialized tests for EVM opcodes that go beyond the standard test files in the parent directory. While most opcode implementations are tested directly in their corresponding test files (e.g., `math.test.zig` for `math.zig`), this directory contains additional or specialized tests that require more complex setups or focus on specific edge cases.

## Purpose

The tests in this directory serve several purposes:

1. **Complex Test Cases**: Tests that are too complex or specialized to include in the main test files
2. **Edge Case Testing**: Focused testing of edge cases and corner conditions for opcode implementations
3. **Performance Testing**: Tests that evaluate performance characteristics of opcodes
4. **Regression Testing**: Tests for specific bugs or issues that have been encountered

## Current Tests

### math2_test.zig

This test file focuses on specialized testing for the exponential operations defined in `math2.zig`, particularly:

- Testing of gas cost calculation for the EXP opcode with various exponent sizes
- Validation of the mathematical formulas used for calculating gas costs
- Edge case handling for exponential operations

## Test Approach

The tests in this directory typically use a more focused approach than the general opcode tests:

1. They often test specific internal functions rather than the complete opcode execution
2. They may mock parts of the EVM to isolate the specific functionality being tested
3. They focus on validation of specific behaviors or mathematical properties

## Running Tests

These tests can be run using the standard Zig test command:

```bash
zig test src/Evm/opcodes/tests/math2_test.zig
```

Or as part of the complete test suite:

```bash
zig test src/Evm/opcodes
```

## Adding New Tests

When adding new tests to this directory, consider the following guidelines:

1. Use this directory for tests that don't fit well in the main test files
2. Focus on testing specific behaviors or edge cases
3. Document the purpose of each test file in this README
4. Follow the existing naming convention: `<module>_test.zig`