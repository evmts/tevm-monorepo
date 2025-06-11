# Implement Instruction Block Optimization

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_instruction_block_optimization` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_instruction_block_optimization feat_implement_instruction_block_optimization`
3. **Work in isolation**: `cd g/feat_implement_instruction_block_optimization`
4. **Commit message**: `⚡ perf: implement instruction block optimization for gas calculation`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement instruction block optimization for efficient gas calculation, similar to evmone's approach. This optimization analyzes bytecode to identify basic blocks and pre-calculates gas costs, reducing per-instruction overhead during execution.

## ELI5

Imagine reading a recipe and instead of calculating the cooking time for each ingredient individually while cooking, you pre-read the entire recipe and calculate the total cooking time for each section beforehand. This optimization does the same thing for EVM bytecode - it groups instructions into "blocks" that always execute together, pre-calculates their gas costs, and validates their requirements ahead of time. This makes execution much faster since the EVM doesn't have to stop and calculate costs for every single instruction during the actual execution.

## Optimization Goals

### Performance Improvements
1. **Pre-calculated Gas**: Calculate gas costs for instruction blocks ahead of time
2. **Reduced Branching**: Minimize conditional logic during execution
3. **Cache Efficiency**: Better instruction cache utilization
4. **Jump Optimization**: Optimize JUMP/JUMPI destinations
5. **Stack Validation**: Pre-validate stack requirements per block

### evmone-Style Optimizations
- **Basic Block Analysis**: Identify sequences of instructions without jumps
- **Gas Pre-calculation**: Sum gas costs for entire blocks
- **Stack Height Tracking**: Track stack changes per block
- **Memory Expansion**: Pre-calculate memory expansion costs
- **Termination Analysis**: Identify blocks that end execution

## Architecture Design

### Instruction Block Structure
```zig
pub const InstructionBlock = struct {
    start_pc: u32,
    end_pc: u32,
    gas_cost: u64,
    stack_input: u8,    // Stack items consumed
    stack_output: u8,   // Stack items produced
    memory_expansion: ?MemoryExpansion,
    terminates: bool,   // Block ends execution (STOP, RETURN, etc.)
    next_blocks: []u32, // Possible next block start addresses
    
    pub const MemoryExpansion = struct {
        offset_expression: MemoryOffsetExpr,
        size_expression: MemorySizeExpr,
    };
};

pub const MemoryOffsetExpr = union(enum) {
    constant: u64,
    stack_top: void,
    stack_offset: u8,
    complex: void, // Requires runtime calculation
};

pub const MemorySizeExpr = union(enum) {
    constant: u64,
    stack_offset: u8,
    complex: void,
};
```

### Block Analyzer
```zig
pub const BlockAnalyzer = struct {
    blocks: std.ArrayList(InstructionBlock),
    jump_destinations: std.HashMap(u32, u32, std.hash_map.DefaultContext(u32), std.hash_map.default_max_load_percentage),
    allocator: std.mem.Allocator,
    
    pub fn analyze_bytecode(allocator: std.mem.Allocator, bytecode: []const u8) !BlockAnalyzer {
        var analyzer = BlockAnalyzer{
            .blocks = std.ArrayList(InstructionBlock).init(allocator),
            .jump_destinations = std.HashMap(u32, u32, std.hash_map.DefaultContext(u32), std.hash_map.default_max_load_percentage).init(allocator),
            .allocator = allocator,
        };
        
        // First pass: identify JUMPDEST instructions
        try analyzer.find_jump_destinations(bytecode);
        
        // Second pass: build basic blocks
        try analyzer.build_basic_blocks(bytecode);
        
        // Third pass: analyze gas costs and stack effects
        try analyzer.analyze_blocks(bytecode);
        
        return analyzer;
    }
    
    fn find_jump_destinations(self: *BlockAnalyzer, bytecode: []const u8) !void {
        var pc: u32 = 0;
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            
            if (opcode == 0x5B) { // JUMPDEST
                try self.jump_destinations.put(pc, @as(u32, @intCast(self.blocks.items.len)));
            }
            
            pc += 1;
            
            // Skip PUSH data
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
        }
    }
    
    fn build_basic_blocks(self: *BlockAnalyzer, bytecode: []const u8) !void {
        var pc: u32 = 0;
        var block_start: u32 = 0;
        
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            
            // Check if this instruction ends a basic block
            const ends_block = switch (opcode) {
                0x56, 0x57 => true, // JUMP, JUMPI
                0x00, 0xF3, 0xFD, 0xFF => true, // STOP, RETURN, REVERT, SELFDESTRUCT
                0xFE => true, // INVALID
                else => false,
            };
            
            // Check if next instruction is a JUMPDEST (starts new block)
            const next_is_jumpdest = (pc + 1 < bytecode.len) and bytecode[pc + 1] == 0x5B;
            
            if (ends_block or next_is_jumpdest or pc + 1 == bytecode.len) {
                // End current block
                const block = InstructionBlock{
                    .start_pc = block_start,
                    .end_pc = pc,
                    .gas_cost = 0, // Will be calculated later
                    .stack_input = 0,
                    .stack_output = 0,
                    .memory_expansion = null,
                    .terminates = ends_block and opcode != 0x56 and opcode != 0x57, // Not JUMP/JUMPI
                    .next_blocks = &[_]u32{}, // Will be populated later
                };
                try self.blocks.append(block);
                
                block_start = pc + 1;
            }
            
            pc += 1;
            
            // Skip PUSH data
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
        }
    }
    
    fn analyze_blocks(self: *BlockAnalyzer, bytecode: []const u8) !void {
        for (self.blocks.items) |*block| {
            try self.analyze_single_block(block, bytecode);
        }
    }
    
    fn analyze_single_block(self: *BlockAnalyzer, block: *InstructionBlock, bytecode: []const u8) !void {
        var pc = block.start_pc;
        var gas_cost: u64 = 0;
        var stack_height: i32 = 0;
        var min_stack_height: i32 = 0;
        
        while (pc <= block.end_pc and pc < bytecode.len) {
            const opcode = bytecode[pc];
            const operation = get_operation_info(opcode);
            
            // Add base gas cost
            gas_cost += operation.gas_cost;
            
            // Track stack changes
            stack_height -= @as(i32, @intCast(operation.stack_input));
            min_stack_height = @min(min_stack_height, stack_height);
            stack_height += @as(i32, @intCast(operation.stack_output));
            
            // Handle dynamic gas costs
            if (operation.has_dynamic_gas) {
                // Mark for runtime gas calculation
                block.memory_expansion = analyze_memory_operation(opcode, pc, bytecode);
            }
            
            pc += 1;
            
            // Skip PUSH data
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
        }
        
        block.gas_cost = gas_cost;
        block.stack_input = @as(u8, @intCast(-min_stack_height));
        block.stack_output = @as(u8, @intCast(@max(0, stack_height)));
    }
};
```

## Implementation Tasks

### Task 1: Implement Basic Block Analysis
File: `/src/evm/optimization/block_analyzer.zig`
- Analyze bytecode to identify basic blocks
- Find JUMPDEST instructions and build jump destination map
- Calculate gas costs and stack effects per block
- Handle PUSH instruction data properly

### Task 2: Gas Pre-calculation
File: `/src/evm/optimization/gas_calculator.zig`
```zig
pub const BlockGasCalculator = struct {
    pub fn calculate_block_gas(block: *const InstructionBlock, bytecode: []const u8) u64 {
        var total_gas: u64 = block.gas_cost;
        
        // Add dynamic gas costs if needed
        if (block.memory_expansion) |expansion| {
            // Memory expansion gas will be calculated at runtime
            // This is a placeholder for the base cost
            total_gas += estimate_memory_expansion_gas(expansion);
        }
        
        return total_gas;
    }
    
    fn estimate_memory_expansion_gas(expansion: InstructionBlock.MemoryExpansion) u64 {
        // Conservative estimate for memory expansion
        // Actual cost calculated at runtime
        return 100; // Base estimate
    }
};
```

### Task 3: Optimized Execution Engine
File: `/src/evm/execution/block_executor.zig`
```zig
pub const BlockExecutor = struct {
    analyzer: BlockAnalyzer,
    current_block: u32,
    
    pub fn init(analyzer: BlockAnalyzer) BlockExecutor {
        return BlockExecutor{
            .analyzer = analyzer,
            .current_block = 0,
        };
    }
    
    pub fn execute_block(
        self: *BlockExecutor,
        vm: *Vm,
        frame: *Frame
    ) !ExecutionResult {
        const block = &self.analyzer.blocks.items[self.current_block];
        
        // Pre-validate stack requirements
        if (frame.stack.size() < block.stack_input) {
            return ExecutionError.StackUnderflow;
        }
        
        // Check gas availability
        if (frame.gas_remaining < block.gas_cost) {
            return ExecutionError.OutOfGas;
        }
        
        // Execute block instructions
        var pc = block.start_pc;
        while (pc <= block.end_pc) {
            const result = try execute_instruction(vm, frame, pc);
            
            switch (result) {
                .continue_execution => |new_pc| {
                    pc = new_pc;
                },
                .jump => |target_pc| {
                    // Find target block
                    self.current_block = self.find_block_for_pc(target_pc) orelse {
                        return ExecutionError.InvalidJump;
                    };
                    return ExecutionResult.continue_execution;
                },
                .halt => return ExecutionResult.halt,
                .revert => return ExecutionResult.revert,
            }
        }
        
        // Move to next block
        self.current_block += 1;
        return ExecutionResult.continue_execution;
    }
    
    fn find_block_for_pc(self: *BlockExecutor, pc: u32) ?u32 {
        for (self.analyzer.blocks.items, 0..) |block, i| {
            if (block.start_pc <= pc and pc <= block.end_pc) {
                return @as(u32, @intCast(i));
            }
        }
        return null;
    }
};
```

### Task 4: Stack Height Validation
File: `/src/evm/optimization/stack_analyzer.zig`
```zig
pub const StackAnalyzer = struct {
    pub fn validate_stack_flow(blocks: []const InstructionBlock) bool {
        // Verify that stack requirements are met across block boundaries
        for (blocks, 0..) |block, i| {
            if (!validate_block_stack_requirements(block, blocks, i)) {
                return false;
            }
        }
        return true;
    }
    
    fn validate_block_stack_requirements(
        block: InstructionBlock,
        all_blocks: []const InstructionBlock,
        block_index: usize
    ) bool {
        // Check that preceding blocks provide enough stack items
        // This is a simplified analysis - full dataflow analysis would be more complex
        _ = block;
        _ = all_blocks;
        _ = block_index;
        return true;
    }
};
```

### Task 5: Integration with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
pub const OptimizedVm = struct {
    base_vm: Vm,
    block_executor: ?BlockExecutor,
    
    pub fn init_with_optimization(allocator: std.mem.Allocator, bytecode: []const u8) !OptimizedVm {
        const base_vm = try Vm.init(allocator);
        
        // Analyze bytecode for optimization
        const analyzer = BlockAnalyzer.analyze_bytecode(allocator, bytecode) catch {
            // Fall back to non-optimized execution
            return OptimizedVm{
                .base_vm = base_vm,
                .block_executor = null,
            };
        };
        
        return OptimizedVm{
            .base_vm = base_vm,
            .block_executor = BlockExecutor.init(analyzer),
        };
    }
    
    pub fn execute(self: *OptimizedVm, frame: *Frame) !ExecutionResult {
        if (self.block_executor) |*executor| {
            return executor.execute_block(&self.base_vm, frame);
        } else {
            // Fall back to instruction-by-instruction execution
            return self.base_vm.execute_instruction(frame);
        }
    }
};
```

### Task 6: Memory Expansion Optimization
File: `/src/evm/optimization/memory_analyzer.zig`
```zig
pub fn analyze_memory_operation(
    opcode: u8,
    pc: u32,
    bytecode: []const u8
) ?InstructionBlock.MemoryExpansion {
    return switch (opcode) {
        0x51, 0x52, 0x53 => analyze_memory_load_store(pc, bytecode), // MLOAD, MSTORE, MSTORE8
        0x37, 0x39, 0x3C => analyze_memory_copy(opcode, pc, bytecode), // CALLDATACOPY, CODECOPY, EXTCODECOPY
        0xF3, 0xFD => analyze_return_revert(pc, bytecode), // RETURN, REVERT
        else => null,
    };
}

fn analyze_memory_load_store(pc: u32, bytecode: []const u8) ?InstructionBlock.MemoryExpansion {
    // Try to determine if memory offset is constant or stack-based
    // Look for preceding PUSH instructions
    if (pc >= 33) { // Enough space for PUSH32 + current instruction
        const prev_opcode = bytecode[pc - 33];
        if (prev_opcode >= 0x60 and prev_opcode <= 0x7F) {
            // Preceding PUSH instruction - might be constant offset
            const push_size = prev_opcode - 0x5F;
            if (pc >= push_size + 1) {
                const push_start = pc - push_size;
                const constant_value = parse_push_value(bytecode[push_start..push_start + push_size]);
                
                return InstructionBlock.MemoryExpansion{
                    .offset_expression = .{ .constant = constant_value },
                    .size_expression = .{ .constant = 32 }, // MLOAD/MSTORE always 32 bytes
                };
            }
        }
    }
    
    // Default to stack-based offset
    return InstructionBlock.MemoryExpansion{
        .offset_expression = .stack_top,
        .size_expression = .{ .constant = 32 },
    };
}

fn parse_push_value(push_data: []const u8) u64 {
    var value: u64 = 0;
    for (push_data[0..@min(8, push_data.len)]) |byte| {
        value = (value << 8) | byte;
    }
    return value;
}
```

## Testing Requirements

### Test File
Create `/test/evm/optimization/block_optimization_test.zig`

### Test Cases
1. **Basic Block Identification**: Verify correct block boundaries
2. **Gas Pre-calculation**: Compare optimized vs standard gas costs
3. **Stack Analysis**: Verify stack height tracking
4. **Jump Destination Analysis**: Test JUMPDEST identification
5. **Memory Expansion**: Test memory operation analysis
6. **Performance**: Benchmark optimized vs unoptimized execution
7. **Correctness**: Ensure optimization doesn't change execution results

### Performance Tests
```zig
test "block optimization performance" {
    const bytecode = compile_test_contract();
    
    // Benchmark standard execution
    var timer = std.time.Timer.start();
    const standard_result = try execute_standard(bytecode);
    const standard_time = timer.read();
    
    // Benchmark optimized execution
    timer.reset();
    const optimized_result = try execute_optimized(bytecode);
    const optimized_time = timer.read();
    
    // Results should be identical
    try testing.expectEqual(standard_result, optimized_result);
    
    // Optimized should be faster (at least for complex contracts)
    if (bytecode.len > 1000) {
        try testing.expect(optimized_time < standard_time);
    }
}

test "gas calculation accuracy" {
    const bytecode = [_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x01,       // ADD
        0x00,       // STOP
    };
    
    // Analyze blocks
    const analyzer = try BlockAnalyzer.analyze_bytecode(testing.allocator, &bytecode);
    defer analyzer.deinit();
    
    // Should identify one block with correct gas cost
    try testing.expectEqual(@as(usize, 1), analyzer.blocks.items.len);
    
    const block = analyzer.blocks.items[0];
    try testing.expectEqual(@as(u64, 3 + 3 + 3 + 0), block.gas_cost); // PUSH1(3) + PUSH1(3) + ADD(3) + STOP(0)
}
```

## Performance Considerations

### Optimization Effectiveness
- **Complex Contracts**: Most beneficial for large, complex contracts
- **Simple Contracts**: May have overhead for very simple contracts
- **Memory Usage**: Additional memory for block analysis
- **Compilation Time**: One-time cost for bytecode analysis

### Cache Optimization
```zig
pub const BlockCache = struct {
    analyzed_contracts: std.HashMap(Hash, BlockAnalyzer, HashContext, std.hash_map.default_max_load_percentage),
    
    pub fn get_or_analyze(self: *BlockCache, bytecode: []const u8) !*BlockAnalyzer {
        const hash = calculate_bytecode_hash(bytecode);
        
        if (self.analyzed_contracts.getPtr(hash)) |analyzer| {
            return analyzer;
        }
        
        // Analyze and cache
        const analyzer = try BlockAnalyzer.analyze_bytecode(self.allocator, bytecode);
        try self.analyzed_contracts.put(hash, analyzer);
        return self.analyzed_contracts.getPtr(hash).?;
    }
};
```

## Success Criteria

1. **Performance Improvement**: Measurable speedup for complex contracts
2. **Correctness**: Identical execution results to unoptimized version
3. **Gas Accuracy**: Exact gas costs match specification
4. **Memory Efficiency**: Reasonable memory overhead for optimization
5. **Compatibility**: Works with all opcodes and hardforks
6. **Maintainability**: Clear separation of optimization and execution logic

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Maintain execution correctness** - Optimization must not change results
3. **Verify gas accuracy** - Gas costs must remain exact
4. **Test performance gains** - Measure actual improvement
5. **Handle all opcodes** - Support complete instruction set
6. **Graceful fallback** - Fall back to unoptimized execution on analysis failure

## References

- [evmone Instruction Analysis](https://github.com/ethereum/evmone)
- [Basic Block Optimization](https://en.wikipedia.org/wiki/Basic_block)
- [Control Flow Analysis](https://en.wikipedia.org/wiki/Control-flow_analysis)
- [EVM Opcode Reference](https://www.evm.codes/)