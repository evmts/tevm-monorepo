# Implement EIP-3155 Tracing

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_eip3155_tracing` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_eip3155_tracing feat_implement_eip3155_tracing`
3. **Work in isolation**: `cd g/feat_implement_eip3155_tracing`
4. **Commit message**: `✨ feat: implement EIP-3155 standard execution trace format`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement EIP-3155 standard execution trace format for the EVM. This provides a standardized way to trace EVM execution, enabling debugging, analysis, and compatibility with Ethereum ecosystem tools that expect this trace format.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against known traces** - Use existing EIP-3155 trace examples
3. **Validate JSON output** - Ensure compatibility with trace analyzers
4. **Handle all opcodes** - Every opcode must produce valid trace
5. **Optimize for performance** - Tracing should be optional and fast