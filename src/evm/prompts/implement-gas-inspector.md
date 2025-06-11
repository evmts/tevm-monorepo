# Implement Gas Inspector

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_gas_inspector` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_gas_inspector feat_implement_gas_inspector`
3. **Work in isolation**: `cd g/feat_implement_gas_inspector`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive gas inspector that provides detailed analysis of gas consumption patterns, identifies optimization opportunities, and tracks gas usage across different operations and execution contexts. This tool is essential for gas optimization, cost analysis, and performance profiling of smart contracts.

## Relevant Implementation Files

**Primary Files to Modify:**
- `/src/evm/vm.zig` - Main VM execution loop for gas tracking
- `/src/evm/frame.zig` - Frame-level gas management

**Supporting Files:**
- `/src/evm/execution/` (directory) - All execution modules for gas profiling
- `/src/evm/constants/gas_constants.zig` - Gas cost references

**New Files to Create:**
- `/src/evm/gas_inspector.zig` - Gas inspection and profiling implementation

**Test Files:**
- `/test/evm/gas/gas_accounting_test.zig` - Gas accounting tests
- `/test/evm/gas_inspector_test.zig` - Gas inspector specific tests

**Why These Files:**
- VM execution loop is where gas tracking hooks need to be integrated
- Frame management handles gas allocation and tracking across call boundaries
- Execution modules provide the detailed gas consumption points
- New inspector module provides analysis and profiling capabilities
- Tests ensure accurate gas measurement and reporting

## ELI5

Think of gas as the "fuel" that powers smart contract execution - every operation costs some amount of gas. A gas inspector is like a detailed fuel efficiency monitor for your car, but for smart contracts. It watches everything the contract does and tracks exactly how much gas each operation uses. This helps developers find "gas guzzling" parts of their code and optimize them to be cheaper to run. Just like how you might track your car's fuel consumption to find more efficient routes, a gas inspector helps smart contract developers make their code more cost-effective for users.

## Gas Inspector Specifications

### Core Functionality

#### 1. Gas Consumption Tracking
```zig
pub const GasInspector = struct {
    allocator: std.mem.Allocator,
    
    // Global gas tracking
    total_gas_used: u64,
    gas_limit: u64,
    gas_refunded: u64,
    
    // Per-operation tracking
    gas_by_opcode: std.HashMap(u8, GasStats, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
    gas_by_call_type: std.HashMap(CallType, GasStats, CallTypeContext, std.hash_map.default_max_load_percentage),
    gas_by_contract: std.HashMap(Address, GasStats, AddressContext, std.hash_map.default_max_load_percentage),
    
    // Memory and storage gas tracking
    memory_expansion_gas: u64,
    storage_gas: u64,
    transient_storage_gas: u64,
    
    // Call stack tracking
    call_stack: std.ArrayList(CallGasFrame),
    current_frame: ?*CallGasFrame,
    
    // Gas optimization analysis
    optimization_suggestions: std.ArrayList(OptimizationSuggestion),
    gas_inefficiencies: std.ArrayList(GasInefficiency),
    
    // Configuration
    config: GasInspectorConfig,
    
    pub const GasStats = struct {
        total_gas: u64,
        min_gas: u64,
        max_gas: u64,
        call_count: u64,
        avg_gas: u64,
        
        pub fn init() GasStats {
            return GasStats{
                .total_gas = 0,
                .min_gas = std.math.maxInt(u64),
                .max_gas = 0,
                .call_count = 0,
                .avg_gas = 0,
            };
        }
        
        pub fn update(self: *GasStats, gas: u64) void {
            self.total_gas += gas;
            self.min_gas = @min(self.min_gas, gas);
            self.max_gas = @max(self.max_gas, gas);
            self.call_count += 1;
            self.avg_gas = self.total_gas / self.call_count;
        }
    };
};
```

#### 2. Call Frame Gas Tracking
```zig
pub const CallGasFrame = struct {
    address: Address,
    call_type: CallType,
    gas_limit: u64,
    gas_used: u64,
    gas_at_start: u64,
    depth: u32,
    
    // Detailed breakdowns
    opcode_gas: std.HashMap(u8, u64, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
    memory_gas: u64,
    storage_gas: u64,
    call_gas: u64,
    
    // Child calls
    child_calls: std.ArrayList(CallGasFrame),
    
    pub fn init(allocator: std.mem.Allocator, address: Address, call_type: CallType, gas_limit: u64, depth: u32) CallGasFrame {
        return CallGasFrame{
            .address = address,
            .call_type = call_type,
            .gas_limit = gas_limit,
            .gas_used = 0,
            .gas_at_start = gas_limit,
            .depth = depth,
            .opcode_gas = std.HashMap(u8, u64, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage).init(allocator),
            .memory_gas = 0,
            .storage_gas = 0,
            .call_gas = 0,
            .child_calls = std.ArrayList(CallGasFrame).init(allocator),
        };
    }
    
    pub fn deinit(self: *CallGasFrame) void {
        self.opcode_gas.deinit();
        
        for (self.child_calls.items) |*child| {
            child.deinit();
        }
        self.child_calls.deinit();
    }
    
    pub fn add_opcode_gas(self: *CallGasFrame, opcode: u8, gas: u64) !void {
        const existing = self.opcode_gas.get(opcode) orelse 0;
        try self.opcode_gas.put(opcode, existing + gas);
        self.gas_used += gas;
    }
    
    pub fn add_child_call(self: *CallGasFrame, child: CallGasFrame) !void {
        self.call_gas += child.gas_used;
        try self.child_calls.append(child);
    }
};
```

#### 3. Gas Optimization Analysis
```zig
pub const OptimizationSuggestion = struct {
    type: OptimizationType,
    description: []const u8,
    location: Location,
    potential_savings: u64,
    confidence: Confidence,
    
    pub const OptimizationType = enum {
        PackStructFields,
        UseImmutable,
        CacheStorageReads,
        OptimizeLoops,
        UseEvents,
        ReduceContractSize,
        OptimizeMemoryUsage,
        UseBitwiseOperations,
        OptimizeStringConcatenation,
        ReduceExternalCalls,
    };
    
    pub const Confidence = enum {
        Low,
        Medium,
        High,
    };
    
    pub const Location = struct {
        address: Address,
        pc: u32,
        opcode: u8,
        gas_cost: u64,
    };
};

pub const GasInefficiency = struct {
    type: InefficiencyType,
    description: []const u8,
    location: Location,
    waste_amount: u64,
    frequency: u32,
    
    pub const InefficiencyType = enum {
        RedundantStorageRead,
        UnneededMemoryExpansion,
        ExpensiveOperation,
        DeadCode,
        InefficinetLoop,
        RedundantComputation,
        UnoptimizedDataStructure,
    };
    
    pub const Location = struct {
        address: Address,
        pc_start: u32,
        pc_end: u32,
        opcodes: []const u8,
    };
};
```

## Implementation Requirements

### Core Functionality
1. **Granular Tracking**: Track gas usage at opcode, function, and contract levels
2. **Call Tree Analysis**: Understand gas flow through call hierarchies
3. **Pattern Recognition**: Identify common gas inefficiencies
4. **Optimization Suggestions**: Provide actionable optimization recommendations
5. **Real-time Analysis**: Analyze gas usage during execution
6. **Report Generation**: Comprehensive gas analysis reports

## Implementation Tasks

### Task 1: Implement Core Gas Inspector
File: `/src/evm/inspector/gas_inspector.zig`
```zig
const std = @import("std");
const Inspector = @import("inspector.zig").Inspector;
const InspectorAction = @import("inspector.zig").InspectorAction;
const StepContext = @import("inspector.zig").StepContext;
const CallContext = @import("inspector.zig").CallContext;
const CallResult = @import("inspector.zig").CallResult;
const ErrorInfo = @import("inspector.zig").ErrorInfo;
const Vm = @import("../vm.zig").Vm;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;

pub const GasInspectorConfig = struct {
    track_opcodes: bool,
    track_memory: bool,
    track_storage: bool,
    track_calls: bool,
    analyze_optimizations: bool,
    detect_inefficiencies: bool,
    max_suggestions: u32,
    min_waste_threshold: u64,
    
    pub fn default() GasInspectorConfig {
        return GasInspectorConfig{
            .track_opcodes = true,
            .track_memory = true,
            .track_storage = true,
            .track_calls = true,
            .analyze_optimizations = true,
            .detect_inefficiencies = true,
            .max_suggestions = 100,
            .min_waste_threshold = 100, // Minimum gas waste to report
        };
    }
    
    pub fn performance_focused() GasInspectorConfig {
        return GasInspectorConfig{
            .track_opcodes = true,
            .track_memory = false,
            .track_storage = false,
            .track_calls = true,
            .analyze_optimizations = false,
            .detect_inefficiencies = false,
            .max_suggestions = 10,
            .min_waste_threshold = 1000,
        };
    }
};

pub const GasInspector = struct {
    allocator: std.mem.Allocator,
    config: GasInspectorConfig,
    
    // Global tracking
    total_gas_used: u64,
    gas_limit: u64,
    gas_refunded: u64,
    execution_start_gas: u64,
    
    // Per-operation tracking
    gas_by_opcode: std.HashMap(u8, GasStats, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
    gas_by_call_type: std.HashMap(CallType, GasStats, CallTypeContext, std.hash_map.default_max_load_percentage),
    gas_by_contract: std.HashMap(Address, GasStats, AddressContext, std.hash_map.default_max_load_percentage),
    
    // Specialized gas tracking
    memory_expansion_gas: u64,
    storage_gas: u64,
    transient_storage_gas: u64,
    call_gas: u64,
    
    // Call stack
    call_stack: std.ArrayList(CallGasFrame),
    
    // Analysis results
    optimization_suggestions: std.ArrayList(OptimizationSuggestion),
    gas_inefficiencies: std.ArrayList(GasInefficiency),
    
    // Temporary analysis state
    last_gas_remaining: u64,
    consecutive_storage_reads: std.HashMap(StorageKey, u32, StorageKeyContext, std.hash_map.default_max_load_percentage),
    memory_expansion_history: std.ArrayList(MemoryExpansion),
    
    pub fn init(allocator: std.mem.Allocator, config: GasInspectorConfig) GasInspector {
        return GasInspector{
            .allocator = allocator,
            .config = config,
            .total_gas_used = 0,
            .gas_limit = 0,
            .gas_refunded = 0,
            .execution_start_gas = 0,
            .gas_by_opcode = std.HashMap(u8, GasStats, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage).init(allocator),
            .gas_by_call_type = std.HashMap(CallType, GasStats, CallTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .gas_by_contract = std.HashMap(Address, GasStats, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .memory_expansion_gas = 0,
            .storage_gas = 0,
            .transient_storage_gas = 0,
            .call_gas = 0,
            .call_stack = std.ArrayList(CallGasFrame).init(allocator),
            .optimization_suggestions = std.ArrayList(OptimizationSuggestion).init(allocator),
            .gas_inefficiencies = std.ArrayList(GasInefficiency).init(allocator),
            .last_gas_remaining = 0,
            .consecutive_storage_reads = std.HashMap(StorageKey, u32, StorageKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .memory_expansion_history = std.ArrayList(MemoryExpansion).init(allocator),
        };
    }
    
    pub fn deinit(self: *GasInspector) void {
        self.gas_by_opcode.deinit();
        self.gas_by_call_type.deinit();
        self.gas_by_contract.deinit();
        
        for (self.call_stack.items) |*frame| {
            frame.deinit();
        }
        self.call_stack.deinit();
        
        for (self.optimization_suggestions.items) |*suggestion| {
            self.allocator.free(suggestion.description);
        }
        self.optimization_suggestions.deinit();
        
        for (self.gas_inefficiencies.items) |*inefficiency| {
            self.allocator.free(inefficiency.description);
        }
        self.gas_inefficiencies.deinit();
        
        self.consecutive_storage_reads.deinit();
        self.memory_expansion_history.deinit();
    }
    
    // Inspector interface implementation
    pub fn initialize(self: *GasInspector, vm: *Vm) !void {
        self.total_gas_used = 0;
        self.gas_limit = vm.gas_limit;
        self.execution_start_gas = vm.gas_limit;
        self.last_gas_remaining = vm.gas_limit;
        
        // Clear previous tracking data
        self.gas_by_opcode.clearRetainingCapacity();
        self.gas_by_call_type.clearRetainingCapacity();
        self.gas_by_contract.clearRetainingCapacity();
        
        for (self.call_stack.items) |*frame| {
            frame.deinit();
        }
        self.call_stack.clearRetainingCapacity();
        
        self.optimization_suggestions.clearRetainingCapacity();
        self.gas_inefficiencies.clearRetainingCapacity();
        self.consecutive_storage_reads.clearRetainingCapacity();
        self.memory_expansion_history.clearRetainingCapacity();
        
        std.log.info("GasInspector: Starting gas analysis with limit {}", .{self.gas_limit});
    }
    
    pub fn finalize(self: *GasInspector, vm: *Vm) !void {
        const final_gas_used = self.execution_start_gas - vm.gas_remaining;
        self.total_gas_used = final_gas_used;
        
        // Perform final analysis
        if (self.config.analyze_optimizations) {
            try self.analyze_optimizations();
        }
        
        if (self.config.detect_inefficiencies) {
            try self.detect_inefficiencies();
        }
        
        std.log.info("GasInspector: Execution completed. Total gas used: {}", .{self.total_gas_used});
    }
    
    pub fn step_start(self: *GasInspector, context: *const StepContext) !InspectorAction {
        const gas_used = self.last_gas_remaining - context.gas_remaining;
        
        if (self.config.track_opcodes) {
            try self.track_opcode_gas(context.opcode, context.gas_cost);
        }
        
        // Track by contract
        if (self.config.track_calls and self.call_stack.items.len > 0) {
            const current_frame = &self.call_stack.items[self.call_stack.items.len - 1];
            try current_frame.add_opcode_gas(context.opcode, context.gas_cost);
            
            try self.track_contract_gas(current_frame.address, context.gas_cost);
        }
        
        // Analyze specific operations
        try self.analyze_step(context);
        
        self.last_gas_remaining = context.gas_remaining;
        
        return InspectorAction.Continue;
    }
    
    pub fn call_start(self: *GasInspector, context: *const CallContext) !InspectorAction {
        if (!self.config.track_calls) return InspectorAction.Continue;
        
        const frame = CallGasFrame.init(
            self.allocator,
            context.callee,
            context.call_type,
            context.gas,
            context.depth
        );
        
        try self.call_stack.append(frame);
        
        // Track call type statistics
        try self.track_call_type_gas(context.call_type, 0); // Will be updated on call_end
        
        std.log.debug("GasInspector: Call started - {} with {} gas", .{ context.callee, context.gas });
        
        return InspectorAction.Continue;
    }
    
    pub fn call_end(self: *GasInspector, context: *const CallContext, result: CallResult) !void {
        if (!self.config.track_calls or self.call_stack.items.len == 0) return;
        
        var frame = self.call_stack.pop();
        frame.gas_used = frame.gas_at_start - result.gas_used;
        
        // Update call type statistics
        try self.track_call_type_gas(context.call_type, frame.gas_used);
        
        // If there's a parent frame, add this as a child call
        if (self.call_stack.items.len > 0) {
            var parent = &self.call_stack.items[self.call_stack.items.len - 1];
            try parent.add_child_call(frame);
        } else {
            // This was the root call, clean up the frame
            frame.deinit();
        }
        
        std.log.debug("GasInspector: Call ended - used {} gas", .{frame.gas_used});
    }
    
    pub fn storage_read(self: *GasInspector, address: Address, key: U256, value: U256) !void {
        if (!self.config.track_storage) return;
        
        // Track consecutive storage reads for optimization analysis
        const storage_key = StorageKey{ .address = address, .key = key };
        const count = self.consecutive_storage_reads.get(storage_key) orelse 0;
        try self.consecutive_storage_reads.put(storage_key, count + 1);
        
        // If we see the same storage slot read multiple times, suggest caching
        if (count > 2) {
            try self.suggest_storage_caching(address, key, count + 1);
        }
    }
    
    pub fn storage_write(self: *GasInspector, address: Address, key: U256, old_value: U256, new_value: U256) !void {
        if (!self.config.track_storage) return;
        
        // Estimate storage gas based on operation type
        var gas_cost: u64 = 0;
        if (old_value == 0 and new_value != 0) {
            gas_cost = 20000; // SSTORE new slot
        } else if (old_value != 0 and new_value == 0) {
            gas_cost = 5000; // SSTORE delete (with refund)
            self.gas_refunded += 15000; // Refund for storage deletion
        } else if (old_value != new_value) {
            gas_cost = 5000; // SSTORE modify
        } else {
            gas_cost = 800; // SSTORE no-op
        }
        
        self.storage_gas += gas_cost;
        
        // Reset consecutive read counter for this slot
        const storage_key = StorageKey{ .address = address, .key = key };
        _ = self.consecutive_storage_reads.remove(storage_key);
    }
    
    pub fn memory_read(self: *GasInspector, offset: u32, size: u32, data: []const u8) !void {
        if (!self.config.track_memory) return;
        
        _ = data;
        try self.track_memory_expansion(offset, size);
    }
    
    pub fn memory_write(self: *GasInspector, offset: u32, data: []const u8) !void {
        if (!self.config.track_memory) return;
        
        try self.track_memory_expansion(offset, @as(u32, @intCast(data.len)));
    }
    
    // Analysis methods
    fn track_opcode_gas(self: *GasInspector, opcode: u8, gas: u64) !void {
        var stats = self.gas_by_opcode.get(opcode) orelse GasStats.init();
        stats.update(gas);
        try self.gas_by_opcode.put(opcode, stats);
    }
    
    fn track_call_type_gas(self: *GasInspector, call_type: CallType, gas: u64) !void {
        var stats = self.gas_by_call_type.get(call_type) orelse GasStats.init();
        stats.update(gas);
        try self.gas_by_call_type.put(call_type, stats);
    }
    
    fn track_contract_gas(self: *GasInspector, address: Address, gas: u64) !void {
        var stats = self.gas_by_contract.get(address) orelse GasStats.init();
        stats.update(gas);
        try self.gas_by_contract.put(address, stats);
    }
    
    fn track_memory_expansion(self: *GasInspector, offset: u32, size: u32) !void {
        const end_offset = offset + size;
        const expansion = MemoryExpansion{
            .offset = offset,
            .size = size,
            .end_offset = end_offset,
        };
        
        try self.memory_expansion_history.append(expansion);
        
        // Calculate approximate memory expansion gas
        const words = (end_offset + 31) / 32;
        const memory_gas = words * 3 + (words * words) / 512;
        
        self.memory_expansion_gas += memory_gas;
    }
    
    fn analyze_step(self: *GasInspector, context: *const StepContext) !void {
        if (!self.config.analyze_optimizations and !self.config.detect_inefficiencies) return;
        
        // Analyze specific opcodes for optimization opportunities
        switch (context.opcode) {
            0x54 => { // SLOAD
                try self.analyze_sload(context);
            },
            0x55 => { // SSTORE
                try self.analyze_sstore(context);
            },
            0x51, 0x52, 0x53 => { // MLOAD, MSTORE, MSTORE8
                try self.analyze_memory_operation(context);
            },
            0x60...0x7F => { // PUSH operations
                try self.analyze_push_operation(context);
            },
            else => {},
        }
    }
    
    fn analyze_sload(self: *GasInspector, context: *const StepContext) !void {
        // Check for repeated SLOAD operations
        // This is a simplified analysis - real implementation would track stack values
        if (self.optimization_suggestions.items.len < self.config.max_suggestions) {
            const suggestion = OptimizationSuggestion{
                .type = .CacheStorageReads,
                .description = try std.fmt.allocPrint(self.allocator, "Consider caching storage reads to reduce gas costs", .{}),
                .location = OptimizationSuggestion.Location{
                    .address = context.frame.context.address,
                    .pc = context.pc,
                    .opcode = context.opcode,
                    .gas_cost = context.gas_cost,
                },
                .potential_savings = 2100 - 100, // SLOAD vs cached value
                .confidence = .Medium,
            };
            
            try self.optimization_suggestions.append(suggestion);
        }
    }
    
    fn analyze_sstore(self: *GasInspector, context: *const StepContext) !void {
        // Analyze storage patterns
        _ = context;
        // Implementation would analyze storage access patterns
    }
    
    fn analyze_memory_operation(self: *GasInspector, context: *const StepContext) !void {
        // Analyze memory usage patterns
        _ = context;
        // Implementation would detect unnecessary memory expansions
    }
    
    fn analyze_push_operation(self: *GasInspector, context: *const StepContext) !void {
        // Analyze PUSH operations for optimization opportunities
        _ = context;
        // Implementation would detect repeated constants
    }
    
    fn suggest_storage_caching(self: *GasInspector, address: Address, key: U256, read_count: u32) !void {
        if (self.optimization_suggestions.items.len >= self.config.max_suggestions) return;
        
        const potential_savings = (read_count - 1) * (2100 - 100); // SLOAD cost vs memory access
        
        if (potential_savings >= self.config.min_waste_threshold) {
            const suggestion = OptimizationSuggestion{
                .type = .CacheStorageReads,
                .description = try std.fmt.allocPrint(
                    self.allocator,
                    "Storage slot 0x{x} read {} times. Consider caching in memory.",
                    .{ key, read_count }
                ),
                .location = OptimizationSuggestion.Location{
                    .address = address,
                    .pc = 0, // Would need to track actual PC
                    .opcode = 0x54, // SLOAD
                    .gas_cost = 2100,
                },
                .potential_savings = potential_savings,
                .confidence = .High,
            };
            
            try self.optimization_suggestions.append(suggestion);
        }
    }
    
    fn analyze_optimizations(self: *GasInspector) !void {
        // Analyze collected data for optimization opportunities
        
        // Check for expensive operations that could be optimized
        var opcode_iterator = self.gas_by_opcode.iterator();
        while (opcode_iterator.next()) |entry| {
            const opcode = entry.key_ptr.*;
            const stats = entry.value_ptr.*;
            
            if (stats.avg_gas > 1000 and stats.call_count > 10) {
                try self.suggest_opcode_optimization(opcode, stats);
            }
        }
        
        // Check for memory expansion inefficiencies
        try self.analyze_memory_inefficiencies();
    }
    
    fn suggest_opcode_optimization(self: *GasInspector, opcode: u8, stats: GasStats) !void {
        if (self.optimization_suggestions.items.len >= self.config.max_suggestions) return;
        
        const optimization_type: OptimizationSuggestion.OptimizationType = switch (opcode) {
            0x20 => .OptimizeStringConcatenation, // KECCAK256
            0xF1, 0xF4, 0xFA => .ReduceExternalCalls, // CALL variants
            0x51, 0x52 => .OptimizeMemoryUsage, // Memory operations
            else => .ReduceContractSize,
        };
        
        const suggestion = OptimizationSuggestion{
            .type = optimization_type,
            .description = try std.fmt.allocPrint(
                self.allocator,
                "Opcode {s} used {} times with avg {} gas. Consider optimization.",
                .{ get_opcode_name(opcode), stats.call_count, stats.avg_gas }
            ),
            .location = OptimizationSuggestion.Location{
                .address = Address.zero(), // Would need context
                .pc = 0,
                .opcode = opcode,
                .gas_cost = stats.avg_gas,
            },
            .potential_savings = stats.total_gas / 10, // Estimate 10% savings
            .confidence = .Medium,
        };
        
        try self.optimization_suggestions.append(suggestion);
    }
    
    fn analyze_memory_inefficiencies(self: *GasInspector) !void {
        // Analyze memory expansion patterns for inefficiencies
        var max_memory: u32 = 0;
        var total_expansions: u32 = 0;
        
        for (self.memory_expansion_history.items) |expansion| {
            max_memory = @max(max_memory, expansion.end_offset);
            total_expansions += 1;
        }
        
        if (total_expansions > 100 and max_memory > 10000) {
            const inefficiency = GasInefficiency{
                .type = .UnneededMemoryExpansion,
                .description = try std.fmt.allocPrint(
                    self.allocator,
                    "High memory usage detected: {} expansions, max {} bytes",
                    .{ total_expansions, max_memory }
                ),
                .location = GasInefficiency.Location{
                    .address = Address.zero(),
                    .pc_start = 0,
                    .pc_end = 0,
                    .opcodes = &[_]u8{},
                },
                .waste_amount = self.memory_expansion_gas / 10, // Estimate
                .frequency = total_expansions,
            };
            
            try self.gas_inefficiencies.append(inefficiency);
        }
    }
    
    fn detect_inefficiencies(self: *GasInspector) !void {
        // Detect patterns that indicate gas inefficiencies
        
        // Check for redundant storage operations
        var storage_iterator = self.consecutive_storage_reads.iterator();
        while (storage_iterator.next()) |entry| {
            const read_count = entry.value_ptr.*;
            if (read_count >= 3) {
                try self.report_storage_inefficiency(entry.key_ptr.*, read_count);
            }
        }
    }
    
    fn report_storage_inefficiency(self: *GasInspector, storage_key: StorageKey, read_count: u32) !void {
        const waste_amount = (read_count - 1) * 2100; // Cost of extra SLOAD operations
        
        if (waste_amount >= self.config.min_waste_threshold) {
            const inefficiency = GasInefficiency{
                .type = .RedundantStorageRead,
                .description = try std.fmt.allocPrint(
                    self.allocator,
                    "Storage slot 0x{x} read {} times redundantly",
                    .{ storage_key.key, read_count }
                ),
                .location = GasInefficiency.Location{
                    .address = storage_key.address,
                    .pc_start = 0,
                    .pc_end = 0,
                    .opcodes = &[_]u8{0x54}, // SLOAD
                },
                .waste_amount = waste_amount,
                .frequency = read_count,
            };
            
            try self.gas_inefficiencies.append(inefficiency);
        }
    }
    
    // Reporting methods
    pub fn generate_report(self: *const GasInspector, allocator: std.mem.Allocator) !GasReport {
        return GasReport{
            .total_gas_used = self.total_gas_used,
            .gas_limit = self.gas_limit,
            .gas_efficiency = @as(f64, @floatFromInt(self.total_gas_used)) / @as(f64, @floatFromInt(self.gas_limit)),
            .opcode_stats = try self.copy_opcode_stats(allocator),
            .call_type_stats = try self.copy_call_type_stats(allocator),
            .contract_stats = try self.copy_contract_stats(allocator),
            .optimization_suggestions = try allocator.dupe(OptimizationSuggestion, self.optimization_suggestions.items),
            .gas_inefficiencies = try allocator.dupe(GasInefficiency, self.gas_inefficiencies.items),
            .memory_expansion_gas = self.memory_expansion_gas,
            .storage_gas = self.storage_gas,
            .call_gas = self.call_gas,
        };
    }
    
    fn copy_opcode_stats(self: *const GasInspector, allocator: std.mem.Allocator) ![]OpcodeGasStats {
        var stats_list = std.ArrayList(OpcodeGasStats).init(allocator);
        
        var iterator = self.gas_by_opcode.iterator();
        while (iterator.next()) |entry| {
            try stats_list.append(OpcodeGasStats{
                .opcode = entry.key_ptr.*,
                .opcode_name = get_opcode_name(entry.key_ptr.*),
                .stats = entry.value_ptr.*,
            });
        }
        
        return stats_list.toOwnedSlice();
    }
    
    fn copy_call_type_stats(self: *const GasInspector, allocator: std.mem.Allocator) ![]CallTypeGasStats {
        var stats_list = std.ArrayList(CallTypeGasStats).init(allocator);
        
        var iterator = self.gas_by_call_type.iterator();
        while (iterator.next()) |entry| {
            try stats_list.append(CallTypeGasStats{
                .call_type = entry.key_ptr.*,
                .stats = entry.value_ptr.*,
            });
        }
        
        return stats_list.toOwnedSlice();
    }
    
    fn copy_contract_stats(self: *const GasInspector, allocator: std.mem.Allocator) ![]ContractGasStats {
        var stats_list = std.ArrayList(ContractGasStats).init(allocator);
        
        var iterator = self.gas_by_contract.iterator();
        while (iterator.next()) |entry| {
            try stats_list.append(ContractGasStats{
                .address = entry.key_ptr.*,
                .stats = entry.value_ptr.*,
            });
        }
        
        return stats_list.toOwnedSlice();
    }
};

// Supporting types and contexts
pub const GasStats = struct {
    total_gas: u64,
    min_gas: u64,
    max_gas: u64,
    call_count: u64,
    avg_gas: u64,
    
    pub fn init() GasStats {
        return GasStats{
            .total_gas = 0,
            .min_gas = std.math.maxInt(u64),
            .max_gas = 0,
            .call_count = 0,
            .avg_gas = 0,
        };
    }
    
    pub fn update(self: *GasStats, gas: u64) void {
        self.total_gas += gas;
        self.min_gas = @min(self.min_gas, gas);
        self.max_gas = @max(self.max_gas, gas);
        self.call_count += 1;
        self.avg_gas = if (self.call_count > 0) self.total_gas / self.call_count else 0;
    }
};

pub const StorageKey = struct {
    address: Address,
    key: U256,
};

pub const MemoryExpansion = struct {
    offset: u32,
    size: u32,
    end_offset: u32,
};

pub const CallType = enum {
    Call,
    DelegateCall,
    StaticCall,
    CallCode,
    Create,
    Create2,
};

// Context implementations for HashMaps
const CallTypeContext = struct {
    pub fn hash(self: @This(), call_type: CallType) u64 {
        _ = self;
        return std.hash_map.hashString(@tagName(call_type));
    }
    
    pub fn eql(self: @This(), a: CallType, b: CallType) bool {
        _ = self;
        return a == b;
    }
};

const AddressContext = struct {
    pub fn hash(self: @This(), addr: Address) u64 {
        _ = self;
        return std.hash_map.hashString(addr.bytes[0..]);
    }
    
    pub fn eql(self: @This(), a: Address, b: Address) bool {
        _ = self;
        return std.mem.eql(u8, &a.bytes, &b.bytes);
    }
};

const StorageKeyContext = struct {
    pub fn hash(self: @This(), key: StorageKey) u64 {
        _ = self;
        var hasher = std.hash.Wyhash.init(0);
        hasher.update(&key.address.bytes);
        const key_bytes = key.key.to_be_bytes();
        hasher.update(&key_bytes);
        return hasher.final();
    }
    
    pub fn eql(self: @This(), a: StorageKey, b: StorageKey) bool {
        _ = self;
        return std.mem.eql(u8, &a.address.bytes, &b.address.bytes) and a.key == b.key;
    }
};

// Report types
pub const GasReport = struct {
    total_gas_used: u64,
    gas_limit: u64,
    gas_efficiency: f64,
    opcode_stats: []OpcodeGasStats,
    call_type_stats: []CallTypeGasStats,
    contract_stats: []ContractGasStats,
    optimization_suggestions: []OptimizationSuggestion,
    gas_inefficiencies: []GasInefficiency,
    memory_expansion_gas: u64,
    storage_gas: u64,
    call_gas: u64,
    
    pub fn deinit(self: *GasReport, allocator: std.mem.Allocator) void {
        allocator.free(self.opcode_stats);
        allocator.free(self.call_type_stats);
        allocator.free(self.contract_stats);
        allocator.free(self.optimization_suggestions);
        allocator.free(self.gas_inefficiencies);
    }
};

pub const OpcodeGasStats = struct {
    opcode: u8,
    opcode_name: []const u8,
    stats: GasStats,
};

pub const CallTypeGasStats = struct {
    call_type: CallType,
    stats: GasStats,
};

pub const ContractGasStats = struct {
    address: Address,
    stats: GasStats,
};

// Utility function
fn get_opcode_name(opcode: u8) []const u8 {
    return switch (opcode) {
        0x00 => "STOP",
        0x01 => "ADD",
        0x02 => "MUL",
        0x03 => "SUB",
        0x04 => "DIV",
        0x05 => "SDIV",
        0x06 => "MOD",
        0x07 => "SMOD",
        0x08 => "ADDMOD",
        0x09 => "MULMOD",
        0x0A => "EXP",
        0x0B => "SIGNEXTEND",
        0x10 => "LT",
        0x11 => "GT",
        0x12 => "SLT",
        0x13 => "SGT",
        0x14 => "EQ",
        0x15 => "ISZERO",
        0x16 => "AND",
        0x17 => "OR",
        0x18 => "XOR",
        0x19 => "NOT",
        0x1A => "BYTE",
        0x1B => "SHL",
        0x1C => "SHR",
        0x1D => "SAR",
        0x20 => "KECCAK256",
        0x30 => "ADDRESS",
        0x31 => "BALANCE",
        0x32 => "ORIGIN",
        0x33 => "CALLER",
        0x34 => "CALLVALUE",
        0x35 => "CALLDATALOAD",
        0x36 => "CALLDATASIZE",
        0x37 => "CALLDATACOPY",
        0x38 => "CODESIZE",
        0x39 => "CODECOPY",
        0x3A => "GASPRICE",
        0x3B => "EXTCODESIZE",
        0x3C => "EXTCODECOPY",
        0x3D => "RETURNDATASIZE",
        0x3E => "RETURNDATACOPY",
        0x3F => "EXTCODEHASH",
        0x40 => "BLOCKHASH",
        0x41 => "COINBASE",
        0x42 => "TIMESTAMP",
        0x43 => "NUMBER",
        0x44 => "PREVRANDAO",
        0x45 => "GASLIMIT",
        0x46 => "CHAINID",
        0x47 => "SELFBALANCE",
        0x48 => "BASEFEE",
        0x49 => "BLOBHASH",
        0x4A => "BLOBBASEFEE",
        0x50 => "POP",
        0x51 => "MLOAD",
        0x52 => "MSTORE",
        0x53 => "MSTORE8",
        0x54 => "SLOAD",
        0x55 => "SSTORE",
        0x56 => "JUMP",
        0x57 => "JUMPI",
        0x58 => "PC",
        0x59 => "MSIZE",
        0x5A => "GAS",
        0x5B => "JUMPDEST",
        0x5C => "TLOAD",
        0x5D => "TSTORE",
        0x5E => "MCOPY",
        0x5F => "PUSH0",
        0x60...0x7F => "PUSH",
        0x80...0x8F => "DUP",
        0x90...0x9F => "SWAP",
        0xA0 => "LOG0",
        0xA1 => "LOG1",
        0xA2 => "LOG2",
        0xA3 => "LOG3",
        0xA4 => "LOG4",
        0xF0 => "CREATE",
        0xF1 => "CALL",
        0xF2 => "CALLCODE",
        0xF3 => "RETURN",
        0xF4 => "DELEGATECALL",
        0xF5 => "CREATE2",
        0xFA => "STATICCALL",
        0xFD => "REVERT",
        0xFE => "INVALID",
        0xFF => "SELFDESTRUCT",
        else => "UNKNOWN",
    };
}
```

### Task 2: Implement Gas Report Generator
File: `/src/evm/inspector/gas_report.zig`
```zig
const std = @import("std");
const GasReport = @import("gas_inspector.zig").GasReport;
const OptimizationSuggestion = @import("gas_inspector.zig").OptimizationSuggestion;
const GasInefficiency = @import("gas_inspector.zig").GasInefficiency;

pub const GasReportFormatter = struct {
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) GasReportFormatter {
        return GasReportFormatter{ .allocator = allocator };
    }
    
    pub fn format_console_report(self: *GasReportFormatter, report: *const GasReport) ![]u8 {
        var buffer = std.ArrayList(u8).init(self.allocator);
        defer buffer.deinit();
        
        var writer = buffer.writer();
        
        try writer.writeAll("=== GAS ANALYSIS REPORT ===\n\n");
        
        // Summary
        try writer.print("Total Gas Used: {}\n", .{report.total_gas_used});
        try writer.print("Gas Limit: {}\n", .{report.gas_limit});
        try writer.print("Gas Efficiency: {d:.2}%\n", .{report.gas_efficiency * 100});
        try writer.print("Gas Remaining: {}\n", .{report.gas_limit - report.total_gas_used});
        try writer.writeAll("\n");
        
        // Gas breakdown
        try writer.writeAll("=== GAS BREAKDOWN ===\n");
        try writer.print("Memory Expansion: {} ({d:.1}%)\n", .{ 
            report.memory_expansion_gas, 
            @as(f64, @floatFromInt(report.memory_expansion_gas)) / @as(f64, @floatFromInt(report.total_gas_used)) * 100 
        });
        try writer.print("Storage Operations: {} ({d:.1}%)\n", .{ 
            report.storage_gas, 
            @as(f64, @floatFromInt(report.storage_gas)) / @as(f64, @floatFromInt(report.total_gas_used)) * 100 
        });
        try writer.print("Call Operations: {} ({d:.1}%)\n", .{ 
            report.call_gas, 
            @as(f64, @floatFromInt(report.call_gas)) / @as(f64, @floatFromInt(report.total_gas_used)) * 100 
        });
        try writer.writeAll("\n");
        
        // Top opcodes by gas consumption
        try writer.writeAll("=== TOP OPCODES BY GAS CONSUMPTION ===\n");
        
        // Sort opcodes by total gas
        var sorted_opcodes = try self.allocator.dupe(@TypeOf(report.opcode_stats[0]), report.opcode_stats);
        defer self.allocator.free(sorted_opcodes);
        
        std.mem.sort(@TypeOf(sorted_opcodes[0]), sorted_opcodes, {}, struct {
            fn lessThan(context: void, lhs: @TypeOf(sorted_opcodes[0]), rhs: @TypeOf(sorted_opcodes[0])) bool {
                _ = context;
                return lhs.stats.total_gas > rhs.stats.total_gas;
            }
        }.lessThan);
        
        for (sorted_opcodes[0..@min(10, sorted_opcodes.len)]) |opcode_stat| {
            try writer.print("{s:>12}: {:>8} gas ({:>4} calls, avg {:>6})\n", .{
                opcode_stat.opcode_name,
                opcode_stat.stats.total_gas,
                opcode_stat.stats.call_count,
                opcode_stat.stats.avg_gas,
            });
        }
        try writer.writeAll("\n");
        
        // Optimization suggestions
        if (report.optimization_suggestions.len > 0) {
            try writer.writeAll("=== OPTIMIZATION SUGGESTIONS ===\n");
            
            for (report.optimization_suggestions[0..@min(5, report.optimization_suggestions.len)]) |suggestion| {
                try writer.print("• {s} (Potential savings: {} gas, Confidence: {s})\n", .{
                    suggestion.description,
                    suggestion.potential_savings,
                    @tagName(suggestion.confidence),
                });
                try writer.print("  Location: {} at PC {}\n", .{
                    suggestion.location.address,
                    suggestion.location.pc,
                });
                try writer.writeAll("\n");
            }
        }
        
        // Gas inefficiencies
        if (report.gas_inefficiencies.len > 0) {
            try writer.writeAll("=== GAS INEFFICIENCIES DETECTED ===\n");
            
            for (report.gas_inefficiencies[0..@min(5, report.gas_inefficiencies.len)]) |inefficiency| {
                try writer.print("• {s} (Wasted: {} gas, Frequency: {})\n", .{
                    inefficiency.description,
                    inefficiency.waste_amount,
                    inefficiency.frequency,
                });
                try writer.print("  Type: {s}\n", .{@tagName(inefficiency.type)});
                try writer.writeAll("\n");
            }
        }
        
        try writer.writeAll("=== END OF REPORT ===\n");
        
        return buffer.toOwnedSlice();
    }
    
    pub fn format_json_report(self: *GasReportFormatter, report: *const GasReport) ![]u8 {
        var buffer = std.ArrayList(u8).init(self.allocator);
        defer buffer.deinit();
        
        var writer = buffer.writer();
        
        try writer.writeAll("{\n");
        try writer.print("  \"totalGasUsed\": {},\n", .{report.total_gas_used});
        try writer.print("  \"gasLimit\": {},\n", .{report.gas_limit});
        try writer.print("  \"gasEfficiency\": {d:.4},\n", .{report.gas_efficiency});
        
        // Gas breakdown
        try writer.writeAll("  \"gasBreakdown\": {\n");
        try writer.print("    \"memoryExpansion\": {},\n", .{report.memory_expansion_gas});
        try writer.print("    \"storage\": {},\n", .{report.storage_gas});
        try writer.print("    \"calls\": {}\n", .{report.call_gas});
        try writer.writeAll("  },\n");
        
        // Opcode stats
        try writer.writeAll("  \"opcodeStats\": [\n");
        for (report.opcode_stats, 0..) |opcode_stat, i| {
            if (i > 0) try writer.writeAll(",\n");
            try writer.writeAll("    {\n");
            try writer.print("      \"opcode\": {},\n", .{opcode_stat.opcode});
            try writer.print("      \"name\": \"{s}\",\n", .{opcode_stat.opcode_name});
            try writer.print("      \"totalGas\": {},\n", .{opcode_stat.stats.total_gas});
            try writer.print("      \"callCount\": {},\n", .{opcode_stat.stats.call_count});
            try writer.print("      \"avgGas\": {},\n", .{opcode_stat.stats.avg_gas});
            try writer.print("      \"minGas\": {},\n", .{opcode_stat.stats.min_gas});
            try writer.print("      \"maxGas\": {}\n", .{opcode_stat.stats.max_gas});
            try writer.writeAll("    }");
        }
        try writer.writeAll("\n  ],\n");
        
        // Optimization suggestions
        try writer.writeAll("  \"optimizationSuggestions\": [\n");
        for (report.optimization_suggestions, 0..) |suggestion, i| {
            if (i > 0) try writer.writeAll(",\n");
            try writer.writeAll("    {\n");
            try writer.print("      \"type\": \"{s}\",\n", .{@tagName(suggestion.type)});
            try writer.print("      \"description\": \"{s}\",\n", .{suggestion.description});
            try writer.print("      \"potentialSavings\": {},\n", .{suggestion.potential_savings});
            try writer.print("      \"confidence\": \"{s}\",\n", .{@tagName(suggestion.confidence)});
            try writer.writeAll("      \"location\": {\n");
            try writer.print("        \"address\": \"{}\",\n", .{suggestion.location.address});
            try writer.print("        \"pc\": {},\n", .{suggestion.location.pc});
            try writer.print("        \"opcode\": {},\n", .{suggestion.location.opcode});
            try writer.print("        \"gasCost\": {}\n", .{suggestion.location.gas_cost});
            try writer.writeAll("      }\n");
            try writer.writeAll("    }");
        }
        try writer.writeAll("\n  ],\n");
        
        // Gas inefficiencies
        try writer.writeAll("  \"gasInefficiencies\": [\n");
        for (report.gas_inefficiencies, 0..) |inefficiency, i| {
            if (i > 0) try writer.writeAll(",\n");
            try writer.writeAll("    {\n");
            try writer.print("      \"type\": \"{s}\",\n", .{@tagName(inefficiency.type)});
            try writer.print("      \"description\": \"{s}\",\n", .{inefficiency.description});
            try writer.print("      \"wasteAmount\": {},\n", .{inefficiency.waste_amount});
            try writer.print("      \"frequency\": {},\n", .{inefficiency.frequency});
            try writer.writeAll("      \"location\": {\n");
            try writer.print("        \"address\": \"{}\",\n", .{inefficiency.location.address});
            try writer.print("        \"pcStart\": {},\n", .{inefficiency.location.pc_start});
            try writer.print("        \"pcEnd\": {}\n", .{inefficiency.location.pc_end});
            try writer.writeAll("      }\n");
            try writer.writeAll("    }");
        }
        try writer.writeAll("\n  ]\n");
        
        try writer.writeAll("}\n");
        
        return buffer.toOwnedSlice();
    }
    
    pub fn format_csv_report(self: *GasReportFormatter, report: *const GasReport) ![]u8 {
        var buffer = std.ArrayList(u8).init(self.allocator);
        defer buffer.deinit();
        
        var writer = buffer.writer();
        
        // Header
        try writer.writeAll("Opcode,OpcodeName,TotalGas,CallCount,AvgGas,MinGas,MaxGas\n");
        
        // Data
        for (report.opcode_stats) |opcode_stat| {
            try writer.print("{},{s},{},{},{},{},{}\n", .{
                opcode_stat.opcode,
                opcode_stat.opcode_name,
                opcode_stat.stats.total_gas,
                opcode_stat.stats.call_count,
                opcode_stat.stats.avg_gas,
                opcode_stat.stats.min_gas,
                opcode_stat.stats.max_gas,
            });
        }
        
        return buffer.toOwnedSlice();
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/inspector/gas_inspector_test.zig`

### Test Cases
```zig
test "gas inspector basic tracking" {
    // Test basic gas consumption tracking
    // Test opcode gas tracking
    // Test call gas tracking
}

test "gas optimization analysis" {
    // Test optimization suggestion generation
    // Test storage caching detection
    // Test memory optimization detection
}

test "gas inefficiency detection" {
    // Test redundant storage reads
    // Test unnecessary memory expansion
    // Test expensive operation patterns
}

test "gas report generation" {
    // Test console report formatting
    // Test JSON report formatting
    // Test CSV report formatting
}

test "gas inspector configuration" {
    // Test different configuration options
    // Test performance vs detailed modes
    // Test selective tracking
}

test "call stack gas tracking" {
    // Test nested call gas tracking
    // Test call frame management
    // Test gas inheritance patterns
}

test "real world scenarios" {
    // Test with complex smart contracts
    // Test with different gas patterns
    // Test with various optimization opportunities
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/inspector/gas_inspector.zig` - Core gas inspector implementation
- `/src/evm/inspector/gas_report.zig` - Gas report generation and formatting
- `/src/evm/inspector/inspector_manager.zig` - Integration with inspector manager
- `/src/evm/vm.zig` - VM integration
- `/test/evm/inspector/gas_inspector_test.zig` - Comprehensive tests

## Success Criteria

1. **Comprehensive Tracking**: Track gas usage at all granularity levels
2. **Optimization Detection**: Identify actionable optimization opportunities
3. **Inefficiency Analysis**: Detect and quantify gas waste patterns
4. **Reporting Quality**: Clear, actionable reports in multiple formats
5. **Performance Impact**: Minimal overhead when analysis is disabled
6. **Real-world Utility**: Provide valuable insights for contract optimization

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Accuracy first** - Gas tracking must be precise and reliable
3. **Performance conscious** - Minimize impact on execution speed
4. **Actionable insights** - Suggestions must be implementable
5. **Comprehensive coverage** - Track all gas-consuming operations
6. **Test with real contracts** - Validate with production smart contracts

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) - Gas cost specifications
- [Gas optimization techniques](https://gist.github.com/hrkrshnn/ee8fabd532058307229d65dcd5836ddc)
- [Foundry gas reporting](https://book.getfoundry.sh/forge/gas-reports) - Reference implementation
- [Hardhat gas reporter](https://github.com/cgewecke/hardhat-gas-reporter) - Inspiration