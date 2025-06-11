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

