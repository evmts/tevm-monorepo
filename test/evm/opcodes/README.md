# EVM Opcodes Unit Test Framework

This directory contains the unit test framework and tests for all EVM opcodes.

## Structure

- `test_helpers.zig` - Common test utilities and helper functions
- `*_test.zig` - Test files for each opcode category

## Running Tests

To run all opcode tests:
```bash
zig build test-evm-opcodes
```

To run tests for a specific category:
```bash
zig test arithmetic_test.zig
```

## Test Framework Features

### TestVm
A simplified VM instance for testing:
- Pre-configured with test allocator
- Methods for setting up accounts, balances, code, and storage
- EIP-2929 access list support

### TestFrame
A test wrapper around Frame:
- Easy stack manipulation (push/pop)
- Memory helpers
- Gas tracking
- Input/return data management

### Helper Functions
- `createTestContract` - Create contracts with test addresses
- `executeOpcode` - Execute an opcode with proper casting
- `expectStackValue` - Assert stack values
- `expectMemoryValue` - Assert memory contents
- `expectGasUsed` - Assert gas consumption

### Test Addresses
Pre-defined addresses for testing:
- ALICE: 0x1111111111111111111111111111111111111111
- BOB: 0x2222222222222222222222222222222222222222
- CONTRACT: 0x3333333333333333333333333333333333333333
- CHARLIE: 0x4444444444444444444444444444444444444444

## Writing Tests

Example test structure:

```zig
test "Category: Opcode behavior description" {
    const allocator = testing.allocator;
    
    // Set up VM and frame
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0, // value
        &[_]u8{}, // code
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000); // gas
    defer test_frame.deinit();
    
    // Set up test state
    try test_frame.pushStack(&[_]u256{10, 20}); // Push values to stack
    
    // Execute opcode
    _ = try helpers.executeOpcode(opcodes.op_add, &test_vm.vm, &test_frame.frame);
    
    // Assert results
    try helpers.expectStackValue(&test_frame.frame, 0, 30);
    try helpers.expectGasUsed(&test_frame.frame, 1000, 3);
}
```

## Test Categories

Each opcode category should have comprehensive tests covering:

1. **Basic Operations** - Normal expected behavior
2. **Edge Cases** - Boundary conditions, zero values, max values
3. **Error Conditions** - Stack underflow, out of gas, memory errors
4. **Gas Consumption** - Verify correct gas usage
5. **State Changes** - For opcodes that modify state
6. **Hardfork Differences** - If behavior changes between forks

## Test Coverage Goals

- 100% opcode coverage
- All error paths tested
- Gas accounting verified
- Edge cases documented
- Integration with other opcodes tested