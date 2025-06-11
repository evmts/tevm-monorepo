# Implement EIP-3155 Tracing

You are implementing EIP-3155 Tracing for the Tevm EVM written in Zig. Your goal is to implement EIP-3155 execution tracing for debugging support following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_eip` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_eip feat_implement_eip`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement EIP-3155 standard execution trace format for the EVM. This provides a standardized way to trace EVM execution, enabling debugging, analysis, and compatibility with Ethereum ecosystem tools that expect this trace format.

## ELI5

Think of this as installing a "black box" flight recorder in an airplane that captures every detail of what happens during flight. EIP-3155 tracing records every single step our EVM takes when executing smart contract code - what instruction it ran, how much gas it used, what was in memory and on the stack, and what went wrong if something failed. This detailed "flight log" is invaluable for debugging problems, understanding performance issues, and ensuring our EVM works correctly with existing Ethereum development tools that expect this standardized trace format.

## EIP-3155 Specification

### Trace Output Format
```json
{
  "pc": 0,
  "op": "PUSH1",
  "gas": "0x2540be3ff",
  "gasCost": "0x3",
  "memory": "0x",
  "memSize": 0,
  "stack": ["0x40"],
  "returnData": "0x",
  "depth": 1,
  "refund": 0,
  "opName": "PUSH1",
  "error": ""
}
```

### Required Fields
- **pc**: Program counter (integer)
- **op**: Opcode name (string)
- **gas**: Gas remaining before execution (hex string)
- **gasCost**: Gas consumed by operation (hex string)
- **memory**: Current memory contents (hex string)
- **memSize**: Memory size in bytes (integer)
- **stack**: Stack contents, top element last (array of hex strings)
- **returnData**: Return data from last call (hex string)
- **depth**: Call depth (integer)
- **refund**: Gas refund amount (integer)
- **opName**: Human readable opcode name (string)
- **error**: Error message if operation failed (string)

## Implementation Requirements

### Core Functionality
1. **Trace Collection**: Capture execution state at each opcode
2. **JSON Serialization**: Output traces in standard JSON format
3. **Memory Tracking**: Track memory changes and expansion
4. **Stack Monitoring**: Monitor stack operations and contents
5. **Gas Accounting**: Track gas consumption and refunds
6. **Error Reporting**: Capture and report execution errors

### Files to Create/Modify
- `/src/evm/tracing/eip3155_tracer.zig` - New EIP-3155 tracer implementation
- `/src/evm/tracing/trace_output.zig` - Trace output formatting
- `/src/evm/vm.zig` - Add tracing hooks to VM execution
- `/src/evm/frame.zig` - Add trace data collection
- `/test/evm/tracing/eip3155_test.zig` - Comprehensive tests

### Trace Integration Points
```zig
// Add to VM execution loop
pub fn execute_with_tracing(vm: *VM, tracer: *EIP3155Tracer) !ExecutionResult {
    while (vm.frame.pc < vm.frame.code.len) {
        // Capture pre-execution state
        tracer.capture_pre_execution(vm);
        
        // Execute opcode
        const result = vm.execute_next_opcode();
        
        // Capture post-execution state
        tracer.capture_post_execution(vm, result);
        
        if (result.should_stop) break;
    }
}
```

## Success Criteria

1. **EIP-3155 Compliance**: Fully implements EIP-3155 trace format specification
2. **Complete Coverage**: Traces all opcodes and execution states
3. **Accurate Data**: Correctly captures gas, memory, stack, and execution state
4. **JSON Compatibility**: Outputs valid JSON compatible with ecosystem tools
5. **Performance**: Minimal impact on execution performance when disabled
6. **Integration**: Works with existing VM and frame architecture

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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/tracing/eip3155_tracing_test.zig`)
```zig
// Test basic EIP3155 tracing functionality
test "eip3155_tracing basic functionality works correctly"
test "eip3155_tracing handles edge cases properly"
test "eip3155_tracing validates inputs appropriately"
test "eip3155_tracing produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "eip3155_tracing integrates with EVM properly"
test "eip3155_tracing maintains system compatibility"
test "eip3155_tracing works with existing components"
test "eip3155_tracing handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "eip3155_tracing meets performance requirements"
test "eip3155_tracing optimizes resource usage"
test "eip3155_tracing scales appropriately with load"
test "eip3155_tracing benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "eip3155_tracing meets specification requirements"
test "eip3155_tracing maintains EVM compatibility"
test "eip3155_tracing handles hardfork transitions"
test "eip3155_tracing cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "eip3155_tracing handles errors gracefully"
test "eip3155_tracing proper error propagation"
test "eip3155_tracing recovery from failure states"
test "eip3155_tracing validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "eip3155_tracing prevents security vulnerabilities"
test "eip3155_tracing handles malicious inputs safely"
test "eip3155_tracing maintains isolation boundaries"
test "eip3155_tracing validates security properties"
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
test "eip3155_tracing basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = eip3155_tracing.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const eip3155_tracing = struct {
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

