# Implement Gas Inspector

You are implementing Gas Inspector for the Tevm EVM written in Zig. Your goal is to implement a comprehensive gas tracking and analysis system following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_gas_inspector` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_gas_inspector feat_implement_gas_inspector`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive gas inspector that provides detailed analysis of gas consumption patterns, identifies optimization opportunities, and tracks gas usage across different operations and execution contexts. This tool is essential for gas optimization, cost analysis, and performance profiling of smart contracts.

## ELI5

Think of the gas inspector as a smart energy auditor for your home, but for smart contracts. Just like how an energy auditor identifies which appliances use the most electricity, when they use it, and suggests ways to reduce your bill, the enhanced gas inspector monitors every operation in your smart contract to see exactly where gas (Ethereum's "fuel") is being consumed. It's like having a super-detailed utility bill that shows not just your total usage, but breaks down costs by room, time of day, and specific appliances, plus gives you actionable advice like "your old refrigerator in the basement is costing you $50/month - consider upgrading" or "you're using too much heating during peak hours." For smart contract developers, this means understanding why their transactions are expensive, which parts of their code are gas-hungry, and getting specific recommendations for optimization - helping them build more cost-effective applications.

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

#### 1. **Unit Tests** (`/test/evm/gas/gas_inspector_test.zig`)
```zig
// Test basic gas inspector functionality
test "gas_inspector basic functionality with known scenarios"
test "gas_inspector handles edge cases correctly"
test "gas_inspector validates input parameters"
test "gas_inspector produces correct output format"
test "gas_consumption_tracker tracks usage correctly"
test "gas_analysis_engine analyzes patterns correctly"
test "optimization_detector identifies opportunities"
test "gas_reporter generates readable reports"
```

#### 2. **Integration Tests**
```zig
test "gas_inspector integrates with EVM execution context"
test "gas_inspector works with existing EVM systems"
test "gas_inspector maintains compatibility with hardforks"
test "gas_inspector handles system-level interactions"
test "gas_tracking integrates with opcode execution"
test "gas_analysis integrates with call frames"
test "gas_optimization integrates with contract analysis"
test "gas_reporting integrates with debugging tools"
```

#### 3. **Functional Tests**
```zig
test "gas_inspector end-to-end functionality works correctly"
test "gas_inspector handles realistic usage scenarios"
test "gas_inspector maintains behavior under load"
test "gas_inspector processes complex inputs correctly"
test "gas_analysis_comprehensive_contracts"
test "gas_optimization_suggestions_accurate"
test "gas_cost_breakdown_detailed"
test "gas_usage_patterns_identified"
```

#### 4. **Performance Tests**
```zig
test "gas_inspector meets performance requirements"
test "gas_inspector memory usage within bounds"
test "gas_inspector scalability with large inputs"
test "gas_inspector benchmark against baseline"
test "gas_tracking_overhead_minimal"
test "gas_analysis_speed_adequate"
test "gas_reporting_generation_fast"
test "gas_storage_efficiency_optimized"
```

#### 5. **Error Handling Tests**
```zig
test "gas_inspector error propagation works correctly"
test "gas_inspector proper error types and messages"
test "gas_inspector graceful handling of invalid inputs"
test "gas_inspector recovery from failure states"
test "gas_validation rejects invalid measurements"
test "gas_tracking handles overflow conditions"
test "gas_analysis handles incomplete data"
test "gas_reporting handles generation failures"
```

#### 6. **Compatibility Tests**
```zig
test "gas_inspector maintains EVM specification compliance"
test "gas_inspector cross-client behavior consistency"
test "gas_inspector backward compatibility preserved"
test "gas_inspector platform-specific behavior verified"
test "gas_costs match Ethereum specifications"
test "gas_measurements align with reference implementations"
test "gas_analysis consistent across hardforks"
test "gas_reporting compatible with tooling"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic gas tracking and measurement works correctly
2. **Add integration tests** - Verify system-level interactions with EVM execution
3. **Implement performance tests** - Meet efficiency requirements for gas inspection
4. **Add error handling tests** - Robust failure management for gas operations
5. **Test edge cases** - Handle boundary conditions like gas exhaustion and overflow
6. **Verify compatibility** - Ensure EVM specification compliance and tool integration

### Test Data Sources
- **EVM specification requirements**: Gas cost calculation verification
- **Reference implementation data**: Cross-client gas behavior testing
- **Performance benchmarks**: Gas inspection efficiency baseline
- **Real-world contract scenarios**: Gas optimization validation
- **Synthetic test cases**: Edge condition and stress testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "gas_inspector basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    const context = test_utils.createTestEVMContext(allocator);
    defer context.deinit();
    
    var inspector = GasInspector.init(allocator);
    defer inspector.deinit();
    
    // Track gas usage for a simple operation
    const opcode = 0x01; // ADD
    const gas_before = 1000000;
    const gas_cost = 3;
    const gas_after = gas_before - gas_cost;
    
    try inspector.recordOpcodeGas(opcode, gas_cost);
    try inspector.updateGasUsed(gas_before, gas_after);
    
    const stats = inspector.getGasStats();
    try testing.expectEqual(@as(u64, gas_cost), stats.total_gas_used);
    try testing.expectEqual(@as(u64, 1), stats.gas_by_opcode.get(opcode).?.count);
    try testing.expectEqual(gas_cost, stats.gas_by_opcode.get(opcode).?.total_cost);
}
```

**Only then implement:**
```zig
pub const GasInspector = struct {
    pub fn recordOpcodeGas(self: *GasInspector, opcode: u8, gas_cost: u64) !void {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test gas measurement accuracy** - Ensure precise gas cost tracking
- **Verify optimization suggestions** - Analysis must provide actionable insights
- **Test cross-platform gas behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) - Gas cost specifications
- [Gas optimization techniques](https://gist.github.com/hrkrshnn/ee8fabd532058307229d65dcd5836ddc)
- [Foundry gas reporting](https://book.getfoundry.sh/forge/gas-reports) - Reference implementation
- [Hardhat gas reporter](https://github.com/cgewecke/hardhat-gas-reporter) - Inspiration

## EVMONE Context

An analysis of the `evmone` codebase reveals several key patterns and implementations that are highly relevant to building a gas inspector. The most important parallel is `evmone`'s `Tracer` interface, which provides hooks into the EVM's execution loop, almost identical to what a gas inspector requires.

The following code snippets are extracted from `evmone` to provide direct, actionable context for your implementation.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
// lib/evmone/tracing.hpp

class Tracer
{
    friend class VM;  // Has access the m_next_tracer to traverse the list forward.
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    void notify_execution_start(  // NOLINT(misc-no-recursion)
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept
    {
        on_execution_start(rev, msg, code);
        if (m_next_tracer)
            m_next_tracer->notify_execution_start(rev, msg, code);
    }
    
    // ... other notification methods ...

    void notify_instruction_start(  // NOLINT(misc-no-recursion)
        uint32_t pc, intx::uint256* stack_top, int stack_height, int64_t gas,
        const ExecutionState& state) noexcept
    {
        on_instruction_start(pc, stack_top, stack_height, gas, state);
        if (m_next_tracer)
            m_next_tracer->notify_instruction_start(pc, stack_top, stack_height, gas, state);
    }
    
    // ... on_execution_end ...

private:
    // These are the hooks you will implement for your GasInspector.
    // They correspond to `initialize`, `step_start`, and `finalize`.
    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.cpp">
```cpp
// lib/evmone/tracing.cpp

// This is an example of a tracer implementation, which your GasInspector will be.
// It demonstrates how to access and process state at each step.
class InstructionTracer : public Tracer
{
    // ...
    void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept override
    {
        const auto& ctx = m_contexts.top();

        const auto opcode = ctx.code[pc];
        m_out << "{";
        m_out << R"("pc":)" << std::dec << pc;
        m_out << R"(,"op":)" << std::dec << int{opcode};
        m_out << R"(,"gas":"0x)" << std::hex << gas << '"';
        m_out << R"(,"gasCost":"0x)" << std::hex << instr::gas_costs[state.rev][opcode] << '"';

        m_out << R"(,"memSize":)" << std::dec << state.memory.size();

        output_stack(stack_top, stack_height); // Example of accessing stack
        
        if (!state.return_data.empty())
            m_out << R"(,"returnData":"0x)" << evmc::hex(state.return_data) << '"';
        
        m_out << R"(,"depth":)" << std::dec << (ctx.depth + 1);
        m_out << R"(,"refund":)" << std::dec << state.gas_refund; // Accessing the refund counter
        m_out << R"(,"opName":")" << get_name(opcode) << '"';

        m_out << "}\n";
    }
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// lib/evmone/execution_state.hpp

// This struct represents the execution context at any point.
// Your GasInspector's `step_start` and `call_start`/`call_end` hooks will
// receive a context object with similar fields, giving you access to gas,
// memory, stack, and message data.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    /// Reference to original EVM code container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;
    
    // ... other fields ...

    std::vector<const uint8_t*> call_stack;

    StackSpace stack_space;
    
    // ...
};

// The AdvancedExecutionState shows a more detailed state representation,
// which might be useful for a feature-rich gas inspector.
struct AdvancedExecutionState : ExecutionState
{
    int64_t gas_left = 0;
    StackTop stack = stack_space.bottom();
    uint32_t current_block_cost = 0;
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_storage.cpp">
```cpp
// lib/evmone/instructions_storage.cpp

// SSTORE has complex, state-dependent gas calculation logic, including refunds.
// This is an excellent reference for how to track storage gas and refunds accurately.
Result sstore(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ... static call checks ...

    if (state.rev >= EVMC_ISTANBUL && gas_left <= 2300)
        return {EVMC_OUT_OF_GAS, gas_left};

    const auto key = intx::be::store<evmc::bytes32>(stack.pop());
    const auto value = intx::be::store<evmc::bytes32>(stack.pop());

    const auto gas_cost_cold =
        (state.rev >= EVMC_BERLIN &&
            state.host.access_storage(state.msg->recipient, key) == EVMC_ACCESS_COLD) ?
            instr::cold_sload_cost :
            0;
    const auto status = state.host.set_storage(state.msg->recipient, key, value);

    // The logic to determine gas cost and refund based on the storage change status.
    const auto [gas_cost_warm, gas_refund] = sstore_costs[state.rev][status];
    const auto gas_cost = gas_cost_warm + gas_cost_cold;
    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    
    // The inspector needs to be notified when the refund counter is modified.
    state.gas_refund += gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
// lib/evmone/instructions.hpp

// This function shows how memory expansion gas cost is calculated.
// Your inspector's `track_memory_expansion` will need similar logic.
[[gnu::noinline]] inline int64_t grow_memory(
    int64_t gas_left, Memory& memory, uint64_t new_size) noexcept
{
    const auto new_words = num_words(new_size);
    const auto current_words = static_cast<int64_t>(memory.size() / word_size);
    const auto new_cost = 3 * new_words + new_words * new_words / 512;
    const auto current_cost = 3 * current_words + current_words * current_words / 512;
    const auto cost = new_cost - current_cost;

    gas_left -= cost;
    if (gas_left >= 0) [[likely]]
        memory.grow(static_cast<size_t>(new_words * word_size));
    return gas_left;
}

// check_memory is called by any opcode that accesses memory (MLOAD, MSTORE, RETURN, etc.).
// It's the trigger point for memory expansion.
inline bool check_memory(
    int64_t& gas_left, Memory& memory, const uint256& offset, uint64_t size) noexcept
{
    // ... bounds checks ...

    const auto new_size = static_cast<uint64_t>(offset) + size;
    if (new_size > memory.size())
        gas_left = grow_memory(gas_left, memory, new_size);

    return gas_left >= 0;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
// lib/evmone/instructions_calls.cpp

// This is the core implementation for CALL, DELEGATECALL, etc. It provides a blueprint
// for your `call_start` and `call_end` hooks. Note the gas forwarding logic (63/64 rule),
// value transfer cost, and handling of the result.
template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ... argument popping from stack ...

    // The inspector would hook in here for `call_start`.
    
    // ... gas calculation for memory expansion, account access, value transfer ...
    
    auto cost = has_value ? CALL_VALUE_COST : 0;
    // ...
    if ((has_value || state.rev < EVMC_SPURIOUS_DRAGON) && !state.host.account_exists(dst))
        cost += ACCOUNT_CREATION_COST;
    // ...
    if ((gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};

    // Gas forwarding logic (63/64th rule).
    msg.gas = std::numeric_limits<int64_t>::max();
    if (gas < msg.gas)
        msg.gas = static_cast<int64_t>(gas);
    if (state.rev >= EVMC_TANGERINE_WHISTLE)
        msg.gas = std::min(msg.gas, gas_left - gas_left / 64);
    // ...
    if (has_value)
    {
        msg.gas += 2300;  // Add stipend.
        gas_left += 2300;
    }

    // ... depth and balance checks ...

    // THE ACTUAL CALL to the host interface
    const auto result = state.host.call(msg);
    
    // The inspector would hook in here for `call_end`.

    // Processing the result
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    // ... copy output to memory ...

    // Recalculating gas_left and propagating gas_refund
    const auto gas_used = msg.gas - result.gas_left;
    gas_left -= gas_used;
    state.gas_refund += result.gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// lib/evmone/baseline_execution.cpp

// The main execution loop. It shows how the tracer is invoked before each instruction.
// This is where your GasInspector would be "ticked".
template <bool TracingEnabled>
int64_t dispatch(const CostTable& cost_table, ExecutionState& state, int64_t gas,
    const uint8_t* code, Tracer* tracer = nullptr) noexcept
{
    // ...
    while (true)
    {
        if constexpr (TracingEnabled)
        {
            const auto offset = static_cast<uint32_t>(position.code_it - code);
            const auto stack_height = static_cast<int>(position.stack_end - stack_bottom);
            if (offset < state.original_code.size())
            {
                // This is the call to the tracer, equivalent to `gas_inspector.step_start`.
                tracer->notify_instruction_start(
                    offset, position.stack_end - 1, stack_height, gas, state);
            }
        }
        // ... opcode dispatch logic ...
    }
    // ...
}
```
</file>
</evmone>

## Prompt Corrections
The provided prompt is excellent and very detailed. The following are not corrections but rather suggestions for refinement based on `evmone`'s implementation, which will help ensure the gas inspector is accurate and efficient.

1.  **Gas Cost Calculation:**
    The prompt's `StepContext` includes `gas_cost`. In a real EVM, gas cost has two components: a static base cost and a dynamic cost.
    - **Static Cost:** This is known before the opcode executes. `evmone` retrieves this from a cost table.
    - **Dynamic Cost:** This is calculated *during* the opcode's execution (e.g., memory expansion cost, `SSTORE` cost based on value changes, `KECCAK256` cost based on data size).
    Your `step_start` hook should ideally receive the static base cost. The inspector should then have separate hooks (like `memory_expansion`, `storage_write`) that are called when dynamic gas is calculated and consumed. This allows you to differentiate and track, for example, `memory_expansion_gas` separately from base opcode gas.

2.  **Tracking Refunds:**
    The `gas_refunded` field is a global counter for the transaction. In `evmone`, this is modified almost exclusively within the `SSTORE` and `SELFDESTRUCT` opcodes. Your `storage_write` inspector hook should be responsible for detecting the conditions that lead to a refund (e.g., changing a storage slot from non-zero to zero) and updating the `gas_refunded` counter accordingly.

3.  **Call Gas vs. Stipend:**
    When tracking gas for `CALL` operations, be mindful of the 2300 gas stipend added for value transfers (`if (value != 0)`). The gas forwarded to the callee (`msg.gas`) includes this stipend, but the gas *deducted* from the caller's frame does not initially. The final `gas_left` calculation in `evmone`'s `call_impl` correctly accounts for this. Ensure your `CallGasFrame` logic distinguishes between the gas limit passed to the callee and the actual cost to the caller.

4.  **Inefficiency Detection Context:**
    To effectively detect inefficiencies like "redundant storage reads," the inspector will need to maintain state across multiple `step_start` calls. For example, to detect a redundant `SLOAD`, you need to:
    - In the `SLOAD` hook, record the storage `key` being read.
    - If the same `key` is read again before being written to by an `SSTORE`, it's redundant.
    - Your `storage_write` hook should clear this "last read" state for the given key.
    This requires more context than just the current step, which the prompt's design already supports with fields like `consecutive_storage_reads`. This is a good pattern to follow for other analyses.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/inspector.rs">
```rust
//! Inspector trait definition.
use crate::{
    interpreter::{
        CallInputs, CallOutcome, CreateInputs, CreateOutcome, EOFCreateInputs, Gas,
        InstructionResult, Interpreter, InterpreterTypes,
    },
    primitives::{Address, Log, U256},
};
use auto_impl::auto_impl;

/// EVM hooks into execution.
///
/// This trait is used to enabled tracing of the EVM execution.
///
/// Object that is implemented this trait is used in `InspectorHandler` to trace the EVM execution.
/// And API that allow calling the inspector can be found in [`crate::InspectEvm`] and [`crate::InspectCommitEvm`].
#[auto_impl(&mut, Box)]
pub trait Inspector<CTX, INTR: InterpreterTypes = EthInterpreter> {
    /// Called before the interpreter is initialized.
    ///
    // ...
    #[inline]
    fn initialize_interp(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        // ...
    }

    /// Called on each step of the interpreter.
    ///
    /// Information about the current execution, including the memory, stack and more is available
    /// on `interp` (see [Interpreter]).
    ///
    /// # Example
    ///
    /// To get the current opcode, use `interp.current_opcode()`.
    #[inline]
    fn step(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        // ...
    }

    /// Called after `step` when the instruction has been executed.
    ///
    /// Setting `interp.instruction_result` to anything other than [`interpreter::InstructionResult::Continue`]
    /// alters the execution of the interpreter.
    #[inline]

    fn step_end(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        // ...
    }

    /// Called when a log is emitted.
    #[inline]
    fn log(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX, log: Log) {
        // ...
    }

    /// Called whenever a call to a contract is about to start.
    ///
    /// InstructionResulting anything other than [`interpreter::InstructionResult::Continue`] overrides the result of the call.
    #[inline]
    fn call(&mut self, context: &mut CTX, inputs: &mut CallInputs) -> Option<CallOutcome> {
        // ...
        None
    }

    /// Called when a call to a contract has concluded.
    ///
    /// The returned [CallOutcome] is used as the result of the call.
    ///
    /// This allows the inspector to modify the given `result` before returning it.
    #[inline]
    fn call_end(&mut self, context: &mut CTX, inputs: &CallInputs, outcome: &mut CallOutcome) {
        // ...
    }

    /// Called when a contract is about to be created.
    ///
    /// If this returns `Some` then the [CreateOutcome] is used to override the result of the creation.
    ///
    /// If this returns `None` then the creation proceeds as normal.
    #[inline]
    fn create(&mut self, context: &mut CTX, inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        // ...
        None
    }

    /// Called when a contract has been created.
    ///
    /// InstructionResulting anything other than the values passed to this function (`(ret, remaining_gas,
    /// address, out)`) will alter the result of the create.
    #[inline]
    fn create_end(
        &mut self,
        context: &mut CTX,
        inputs: &CreateInputs,
        outcome: &mut CreateOutcome,
    ) {
        // ...
    }

    // ... eofcreate hooks ...

    /// Called when a contract has been self-destructed with funds transferred to target.
    #[inline]
    fn selfdestruct(&mut self, contract: Address, target: Address, value: U256) {
        // ...
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/gas.rs">
```rust
//! GasIspector. Helper Inspector to calculate gas for others.
use interpreter::{CallOutcome, CreateOutcome, Gas};

/// Helper that keeps track of gas.
#[allow(dead_code)]
#[derive(Clone, Copy, Debug)]
pub struct GasInspector {
    gas_remaining: u64,
    last_gas_cost: u64,
}

impl Default for GasInspector {
    fn default() -> Self {
        Self::new()
    }
}

impl GasInspector {
    /// Returns the remaining gas.
    #[inline]
    pub fn gas_remaining(&self) -> u64 {
        self.gas_remaining
    }

    /// Returns the last gas cost.
    #[inline]
    pub fn last_gas_cost(&self) -> u64 {
        self.last_gas_cost
    }

    /// Create a new gas inspector.
    pub fn new() -> Self {
        Self {
            gas_remaining: 0,
            last_gas_cost: 0,
        }
    }

    /// Sets remaining gas to gas limit.
    #[inline]
    pub fn initialize_interp(&mut self, gas: &Gas) {
        self.gas_remaining = gas.limit();
    }

    /// Sets the remaining gas.
    #[inline]
    pub fn step(&mut self, gas: &Gas) {
        self.gas_remaining = gas.remaining();
    }

    /// calculate last gas cost and remaining gas.
    #[inline]
    pub fn step_end(&mut self, gas: &mut Gas) {
        let remaining = gas.remaining();
        self.last_gas_cost = self.gas_remaining.saturating_sub(remaining);
        self.gas_remaining = remaining;
    }

    /// Spend all gas if call failed.
    #[inline]
    pub fn call_end(&mut self, outcome: &mut CallOutcome) {
        if outcome.result.result.is_error() {
            outcome.result.gas.spend_all();
            self.gas_remaining = 0;
        }
    }

    /// Spend all gas if create failed.
    #[inline]
    pub fn create_end(&mut self, outcome: &mut CreateOutcome) {
        if outcome.result.result.is_error() {
            outcome.result.gas.spend_all();
            self.gas_remaining = 0;
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

// ...

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// Creates a new `Gas` struct with the given gas limit.
    #[inline]
    pub const fn new(limit: u64) -> Self {
        Self {
            limit,
            remaining: limit,
            refunded: 0,
            memory: MemoryGas::new(),
        }
    }

    /// Returns the gas limit.
    #[inline]
    pub const fn limit(&self) -> u64 {
        self.limit
    }

    // ...

    /// Returns the total amount of gas that was refunded.
    #[inline]
    pub const fn refunded(&self) -> i64 {
        self.refunded
    }

    /// Returns the total amount of gas spent.
    #[inline]
    pub const fn spent(&self) -> u64 {
        self.limit - self.remaining
    }

    // ...

    /// Returns the amount of gas remaining.
    #[inline]
    pub const fn remaining(&self) -> u64 {
        self.remaining
    }

    // ...

    /// Erases a gas cost from the totals.
    #[inline]
    pub fn erase_cost(&mut self, returned: u64) {
        self.remaining += returned;
    }

    /// Spends all remaining gas.
    #[inline]
    pub fn spend_all(&mut self) {
        self.remaining = 0;
    }

    /// Records a refund value.
    ///
    /// `refund` can be negative but `self.refunded` should always be positive
    /// at the end of transact.
    #[inline]
    pub fn record_refund(&mut self, refund: i64) {
        self.refunded += refund;
    }

    // ...

    /// Records an explicit cost.
    ///
    /// Returns `false` if the gas limit is exceeded.
    #[inline]
    #[must_use = "prefer using `gas!` instead to return an out-of-gas error on failure"]
    pub fn record_cost(&mut self, cost: u64) -> bool {
        if let Some(new_remaining) = self.remaining.checked_sub(cost) {
            self.remaining = new_remaining;
            return true;
        }
        false
    }

    /// Record memory expansion
    #[inline]
    #[must_use = "internally uses record_cost that flags out of gas error"]
    pub fn record_memory_expansion(&mut self, new_len: usize) -> MemoryExtensionResult {
        let Some(additional_cost) = self.memory.record_new_len(new_len) else {
            return MemoryExtensionResult::Same;
        };

        if !self.record_cost(additional_cost) {
            return MemoryExtensionResult::OutOfGas;
        }

        MemoryExtensionResult::Extended
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/call_inputs.rs">
```rust
use primitives::{Address, Bytes, U256};

// ...

/// Inputs for a call.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallInputs {
    /// The call data of the call.
    pub input: CallInput,
    /// The return memory offset where the output of the call is written.
    ///
    /// In EOF, this range is invalid as EOF calls do not write output to memory.
    pub return_memory_offset: Range<usize>,
    /// The gas limit of the call.
    pub gas_limit: u64,
    /// The account address of bytecode that is going to be executed.
    ///
    /// Previously `context.code_address`.
    pub bytecode_address: Address,
    /// Target address, this account storage is going to be modified.
    ///
    /// Previously `context.address`.
    pub target_address: Address,
    /// This caller is invoking the call.
    ///
    /// Previously `context.caller`.
    pub caller: Address,
    /// Call value.
    ///
    /// **Note**: This value may not necessarily be transferred from caller to callee, see [`CallValue`].
    ///
    /// Previously `transfer.value` or `context.apparent_value`.
    pub value: CallValue,
    /// The call scheme.
    ///
    /// Previously `context.scheme`.
    pub scheme: CallScheme,
    /// Whether the call is a static call, or is initiated inside a static call.
    pub is_static: bool,
    /// Whether the call is initiated from EOF bytecode.
    pub is_eof: bool,
}

// ...

/// Call scheme.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum CallScheme {
    /// `CALL`.
    Call,
    /// `CALLCODE`
    CallCode,
    /// `DELEGATECALL`
    DelegateCall,
    /// `STATICCALL`
    StaticCall,
    /// `EXTCALL`
    ExtCall,
    /// `EXTSTATICCALL`
    ExtStaticCall,
    /// `EXTDELEGATECALL`
    ExtDelegateCall,
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/call_outcome.rs">
```rust
use crate::{Gas, InstructionResult, InterpreterResult};
use core::ops::Range;
use primitives::Bytes;

/// Represents the outcome of a call operation in a virtual machine.
///
/// This struct encapsulates the result of executing an instruction by an interpreter, including
/// the result itself, gas usage information, and the memory offset where output data is stored.
///
/// # Fields
///
/// * `result` - The result of the interpreter's execution, including output data and gas usage.
/// * `memory_offset` - The range in memory where the output data is located.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallOutcome {
    pub result: InterpreterResult,
    pub memory_offset: Range<usize>,
}

impl CallOutcome {
    /// Constructs a new [`CallOutcome`].
    // ...
    pub fn new(result: InterpreterResult, memory_offset: Range<usize>) -> Self {
        Self {
            result,
            memory_offset,
        }
    }

    /// Returns a reference to the instruction result.
    // ...
    pub fn instruction_result(&self) -> &InstructionResult {
        &self.result.result
    }

    /// Returns the gas usage information.
    // ...
    pub fn gas(&self) -> Gas {
        self.result.gas
    }

    /// Returns a reference to the output data.
    // ...
    pub fn output(&self) -> &Bytes {
        &self.result.output
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/create_inputs.rs">
```rust
use context_interface::CreateScheme;
use primitives::{Address, Bytes, U256};

/// Inputs for a create call
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateInputs {
    /// Caller address of the EVM
    pub caller: Address,
    /// The create scheme
    pub scheme: CreateScheme,
    /// The value to transfer
    pub value: U256,
    /// The init code of the contract
    pub init_code: Bytes,
    /// The gas limit of the call
    pub gas_limit: u64,
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/create_outcome.rs">
```rust
use crate::{Gas, InstructionResult, InterpreterResult};
use primitives::{Address, Bytes};

/// Represents the outcome of a create operation in an interpreter.
///
/// This struct holds the result of the operation along with an optional address.
///
/// It provides methods to determine the next action based on the result of the operation.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateOutcome {
    /// The result of the interpreter operation
    pub result: InterpreterResult,
    /// An optional address associated with the create operation
    pub address: Option<Address>,
}

impl CreateOutcome {
    /// Constructs a new [`CreateOutcome`].
    // ...
    pub fn new(result: InterpreterResult, address: Option<Address>) -> Self {
        Self { result, address }
    }

    /// Retrieves a reference to the [`InstructionResult`] from the [`InterpreterResult`].
    // ...
    pub fn instruction_result(&self) -> &InstructionResult {
        &self.result.result
    }

    /// Retrieves a reference to the output bytes from the [`InterpreterResult`].
    // ...
    pub fn output(&self) -> &Bytes {
        &self.result.output
    }

    /// Retrieves a reference to the [`Gas`] details from the [`InterpreterResult`].
    // ...
    pub fn gas(&self) -> &Gas {
        &self.result.gas
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
// ...

/// Main interpreter structure that contains all components defines in [`InterpreterTypes`].s
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct Interpreter<WIRE: InterpreterTypes = EthInterpreter> {
    pub bytecode: WIRE::Bytecode,
    pub stack: WIRE::Stack,
    pub return_data: WIRE::ReturnData,
    pub memory: WIRE::Memory,
    pub input: WIRE::Input,
    pub sub_routine: WIRE::SubRoutineStack,
    pub control: WIRE::Control,
    pub runtime_flag: WIRE::RuntimeFlag,
    pub extend: WIRE::Extend,
}

// ...

/// The result of an interpreter operation.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct InterpreterResult {
    /// The result of the instruction execution.
    pub result: InstructionResult,
    /// The output of the instruction execution.
    pub output: Bytes,
    /// The gas usage information.
    pub gas: Gas,
}

// ...
```
</file>
</revm>



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32

from . import Evm
from .exceptions import OutOfGasError

GAS_JUMPDEST = Uint(1)
GAS_BASE = Uint(2)
GAS_VERY_LOW = Uint(3)
GAS_STORAGE_SET = Uint(20000)
GAS_STORAGE_UPDATE = Uint(5000)
GAS_STORAGE_CLEAR_REFUND = Uint(4800)
GAS_LOW = Uint(5)
GAS_MID = Uint(8)
GAS_HIGH = Uint(10)
GAS_EXPONENTIATION = Uint(10)
GAS_EXPONENTIATION_PER_BYTE = Uint(50)
GAS_MEMORY = Uint(3)
GAS_KECCAK256 = Uint(30)
GAS_KECCAK256_WORD = Uint(6)
GAS_COPY = Uint(3)
GAS_BLOCK_HASH = Uint(20)
GAS_LOG = Uint(375)
GAS_LOG_DATA = Uint(8)
GAS_LOG_TOPIC = Uint(375)
GAS_CREATE = Uint(32000)
GAS_CODE_DEPOSIT = Uint(200)
GAS_ZERO = Uint(0)
GAS_NEW_ACCOUNT = Uint(25000)
GAS_CALL_VALUE = Uint(9000)
GAS_CALL_STIPEND = Uint(2300)
GAS_SELF_DESTRUCT = Uint(5000)
GAS_SELF_DESTRUCT_NEW_ACCOUNT = Uint(25000)
GAS_ECRECOVER = Uint(3000)
GAS_SHA256 = Uint(60)
GAS_SHA256_WORD = Uint(12)
GAS_RIPEMD160 = Uint(600)
GAS_RIPEMD160_WORD = Uint(120)
GAS_IDENTITY = Uint(15)
GAS_IDENTITY_WORD = Uint(3)
GAS_RETURN_DATA_COPY = Uint(3)
GAS_FAST_STEP = Uint(5)
GAS_BLAKE2_PER_ROUND = Uint(1)
GAS_COLD_SLOAD = Uint(2100)
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)
GAS_INIT_CODE_WORD_COST = Uint(2)


@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint


def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.

    Parameters
    ----------
    evm :
        The current EVM.
    amount :
        The amount of gas the current operation requires.

    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount


def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.

    Parameters
    ----------
    size_in_bytes :
        The size of the data in bytes.

    Returns
    -------
    total_gas_cost : `ethereum.base_types.Uint`
        The gas cost for storing data in memory.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory

    Parameters
    ----------
    memory :
        Memory contents of the EVM.
    extensions:
        List of extensions to be made to the memory.
        Consists of a tuple of start position and size.

    Returns
    -------
    extend_memory: `ExtendMemory`
    """
    size_to_extend = Uint(0)
    to_be_paid = Uint(0)
    current_size = Uint(len(memory))
    for start_position, size in extensions:
        if size == 0:
            continue
        before_size = ceil32(current_size)
        after_size = ceil32(Uint(start_position) + Uint(size))
        if after_size <= before_size:
            continue

        size_to_extend += after_size - before_size
        already_paid = calculate_memory_gas_cost(before_size)
        total_cost = calculate_memory_gas_cost(after_size)
        to_be_paid += total_cost - already_paid

        current_size = after_size

    return ExtendMemory(to_be_paid, size_to_extend)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/interpreter.py">
```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
"""
Defines the functions required for creating EVM traces during execution.
...
"""

@dataclass
class TransactionStart:
    """
    Trace event that is triggered at the start of a transaction.
    """


@dataclass
class TransactionEnd:
    """
    Trace event that is triggered at the end of a transaction.
    """

    gas_used: int
    output: Bytes
    error: Optional[EthereumException]


@dataclass
class PrecompileStart:
    """
    Trace event that is triggered before executing a precompile.
    """
    address: Bytes

@dataclass
class PrecompileEnd:
    """
    Trace event that is triggered after executing a precompile.
    """


@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """
    op: enum.Enum

@dataclass
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    """


@dataclass
class OpException:
    """
    Trace event that is triggered when an opcode raises an exception.
    """
    error: Exception

@dataclass
class EvmStop:
    """
    Trace event that is triggered when the EVM stops.
    """
    op: enum.Enum


@dataclass
class GasAndRefund:
    """
    Trace event that is triggered when gas is deducted.
    """
    gas_cost: int


TraceEvent = Union[
    TransactionStart,
    TransactionEnd,
    PrecompileStart,
    PrecompileEnd,
    OpStart,
    OpEnd,
    OpException,
    EvmStop,
    GasAndRefund,
]
"""
All possible types of events that an [`EvmTracer`] is expected to handle.
"""
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/__init__.py">
```python
@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/instructions/storage.py">
```python
def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    if evm.gas_left <= GAS_CALL_STIPEND:
        raise OutOfGasError

    state = evm.message.block_env.state
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    gas_cost = Uint(0)

    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    if original_value == current_value and current_value != new_value:
        if original_value == 0:
            gas_cost += GAS_STORAGE_SET
        else:
            gas_cost += GAS_STORAGE_UPDATE - GAS_COLD_SLOAD
    else:
        gas_cost += GAS_WARM_ACCESS

    # Refund Counter Calculation
    if current_value != new_value:
        if original_value != 0 and current_value != 0 and new_value == 0:
            # Storage is cleared for the first time in the transaction
            evm.refund_counter += int(GAS_STORAGE_CLEAR_REFUND)

        if original_value != 0 and current_value == 0:
            # Gas refund issued earlier to be reversed
            evm.refund_counter -= int(GAS_STORAGE_CLEAR_REFUND)

        if original_value == new_value:
            # Storage slot being restored to its original value
            if original_value == 0:
                # Slot was originally empty and was SET earlier
                evm.refund_counter += int(GAS_STORAGE_SET - GAS_WARM_ACCESS)
            else:
                # Slot was originally non-empty and was UPDATED earlier
                evm.refund_counter += int(
                    GAS_STORAGE_UPDATE - GAS_COLD_SLOAD - GAS_WARM_ACCESS
                )

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_storage(state, evm.message.current_target, key, new_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
</execution-specs>

## Prompt Corrections
- In the `GasInspector` struct, the field `gas_by_call_type` uses a `CallType` enum. The provided code does not define such a global `CallType`. An implementation would need to derive this type from the opcode being executed (e.g., `CALL`, `DELEGATECALL`, `CREATE`, etc.). The `system.py` file shows how these different call types are handled in distinct functions.
- The prompt defines `add_opcode_gas` and `add_child_call` in the `CallGasFrame` struct. The logic for when to call these should be derived from the EVM's execution loop. The `execute_code` function in `interpreter.py` shows the main loop, and the `system.py` file shows how child calls are made, which is the context needed for `add_child_call`.
- The prompt specifies `storage_write` and estimates gas based on a simplified model. The `sstore` function from `storage.py` provides the canonical, more complex gas calculation logic, including how refunds are calculated based on the `original_value`, `current_value`, and `new_value`. This is a crucial detail for accurate gas tracking.
- The prompt has a typo in `U256.ts`; it should be `U256`. I have corrected this assumption in my analysis.
- The `charge_gas` function in `gas.py` is the central point for gas deduction. The inspector should hook into this or a similar mechanism to track gas consumption per operation. The `evm_trace(evm, GasAndRefund(int(amount)))` call within `charge_gas` is a perfect example of how such a hook works in the reference implementation.

---

An excellent and well-structured prompt. The provided `GasInspector` struct and its method signatures align very well with the hooks available in a standard EVM execution loop. Here is the most relevant context from `execution-specs` to aid in the implementation.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
EVM gas constants and calculators.
"""
# ... (other constants)

# Gas cost for simple arithmetic and logic operations
GAS_VERY_LOW = Uint(3)
# Gas cost for multiplication and division operations
GAS_LOW = Uint(5)
# Base gas cost for LOG operations (LOG0-LOG4)
GAS_LOG = Uint(375)
# Gas cost per byte of data in LOG operations
GAS_LOG_DATA = Uint(8)
# Gas cost per topic in LOG operations
GAS_LOG_TOPIC = Uint(375)
# Base gas cost for CREATE opcode
GAS_CREATE = Uint(32000)
# Additional gas cost when CALL transfers value (ETH)
GAS_CALL_VALUE = Uint(9000)
# Gas stipend provided to called contract when transferring value
GAS_CALL_STIPEND = Uint(2300)
# Gas refund for clearing storage slot to zero
# EIP-3529: Reduced from 15000 to prevent gas refund abuse
GAS_STORAGE_CLEAR_REFUND = Uint(4800)

# EIP-2929 Warm/Cold access costs
GAS_COLD_SLOAD = Uint(2100)
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)

# Memory Gas Cost Calculation
# This function is crucial for implementing memory_expansion_gas tracking.
def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words**Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError

# Gas calculation for extending memory. Useful for MSTORE, MLOAD, etc.
def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
    """
    # ... implementation ...

# Gas calculation for call operations, including the 63/64 rule.
# This logic is essential for tracking gas in call frames.
def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call
    (63/64th rule from EIP-150)
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
"""
Implementations of the EVM storage related instructions. This file is critical
for understanding how `storage_gas` and `gas_refunded` should be tracked.
"""
# ... imports

def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.
    """
    # ...
    # GAS
    # This shows how to check for warm/cold access for SLOAD
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)
    # ...

def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)

    # ... (static context check)

    state = evm.message.block_env.state
    # The inspector needs to know the original and current values to accurately
    # track gas for SSTORE operations.
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    gas_cost = Uint(0)

    # EIP-2929: Warm/cold access check for storage slot
    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    # Gas calculation based on value change (implements EIP-2200)
    if original_value == current_value and current_value != new_value:
        if original_value == 0:
            gas_cost += GAS_STORAGE_SET
        else:
            gas_cost += GAS_STORAGE_UPDATE - GAS_COLD_SLOAD
    else:
        gas_cost += GAS_WARM_ACCESS

    # Refund Counter Calculation (implements EIP-3529)
    if current_value != new_value:
        if original_value != 0 and current_value != 0 and new_value == 0:
            # Storage is cleared for the first time in the transaction
            evm.refund_counter += int(GAS_STORAGE_CLEAR_REFUND)

        if original_value != 0 and current_value == 0:
            # Gas refund issued earlier to be reversed
            evm.refund_counter -= int(GAS_STORAGE_CLEAR_REFUND)

        if original_value == new_value:
            # Storage slot being restored to its original value
            if original_value == 0:
                # Slot was originally empty and was SET earlier
                evm.refund_counter += int(GAS_STORAGE_SET - GAS_WARM_ACCESS)
            else:
                # Slot was originally non-empty and was UPDATED earlier
                evm.refund_counter += int(
                    GAS_STORAGE_UPDATE - GAS_COLD_SLOAD - GAS_WARM_ACCESS
                )

    charge_gas(evm, gas_cost)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
"""
Implementations of the EVM system related instructions. These show how
to track gas for calls, creations, and other system-level operations.
"""
# ... imports

def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    # ... other params
) -> None:
    # ...
    # This is the entry point for a sub-call.
    # The `gas` parameter is the amount forwarded to the child.
    # The inspector's `call_start` hook should be called here.
    child_message = Message(
        # ...
        gas=gas,
        value=value,
        # ...
    )
    child_evm = process_message(child_message)

    # After the sub-call returns, the inspector's `call_end` hook
    # would be called here.
    if child_evm.error:
        # Incorporate gas left from failed child call
        incorporate_child_on_error(evm, child_evm)
        # ...
    else:
        # Incorporate gas left and other state from successful child call
        incorporate_child_on_success(evm, child_evm)
    # ...

def call(evm: Evm) -> None:
    """
    Message-call into an account.
    """
    # ... (stack pops) ...

    # EIP-2929: Warm/cold account access gas cost
    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS
    
    # Gas cost for new account creation
    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    # Gas cost for value transfer
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE

    # The overall gas calculation for the CALL operation itself
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)

    # ... (call execution) ...

def delegatecall(evm: Evm) -> None:
    # ...
    # Similar gas calculation logic to CALL but without value transfer cost
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
"""
The main EVM interpreter loop. Shows how the EVM is structured and how
opcodes are dispatched. This provides the context for where the inspector's
`step_start` hook would be called.
"""
# ... (imports and dataclasses)

def execute_code(message: Message) -> Evm:
    # ... (EVM initialization)
    evm = Evm(
        # ...
        gas_left=message.gas,
        # ...
    )
    try:
        # ... (precompile check)

        # The main execution loop
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # The `step_start` hook would be called here, before op execution
            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            # The `step_end` hook would be called here, after op execution
            evm_trace(evm, OpEnd())
        # ...
    except ExceptionalHalt as error:
        # ... (error handling)
    # ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
"""
This file shows the overall transaction processing flow, including where
gas refunds are applied.
"""
# ... (imports)

def process_transaction(
    #...
) -> None:
    # ... (transaction validation and setup)

    # This is the entry point for executing the transaction's code
    tx_output = process_message_call(message)

    # Gas refund logic is applied at the end of the transaction.
    # This is relevant for the inspector's `gas_refunded` field.
    tx_gas_used_before_refund = tx.gas - tx_output.gas_left
    tx_gas_refund = min(
        tx_gas_used_before_refund // Uint(5), Uint(tx_output.refund_counter)
    )
    tx_gas_used_after_refund = tx_gas_used_before_refund - tx_gas_refund
    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is very detailed and well-thought-out. Here are a couple of minor suggestions for improvement based on the `execution-specs`:

1.  **Refine `storage_write` Gas Logic**: The `storage_write` method in the prompt estimates gas cost based on whether the old/new values are zero. This is a good starting point, but the actual logic is more nuanced, as shown in `sstore` in `storage.py`. It also depends on whether the storage slot was "cold" or "warm" and whether its value is being reverted to its original state within the transaction. The `sstore` implementation provides the precise logic for both gas cost and gas refunds, which would make the inspector more accurate.

2.  **`gas_by_call_type` Tracking**: The prompt correctly identifies the need to track gas by `CallType`. The `system.py` file shows that `CALL`, `DELEGATECALL`, and `STATICCALL` all have different gas calculation nuances. The `CallType` enum is an excellent way to capture this, and the inspector can use the `call_start` hook to record which type of call is being made and the `call_end` hook to attribute the final gas used.

3.  **Opcode Naming**: The prompt includes a `get_opcode_name` utility function. The `.../vm/instructions/__init__.py` file in the specs shows a great pattern for this using a Python `Enum`, which can serve as a direct reference for implementing the `get_opcode_name` function in Zig.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Copyright 2021 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
)

// Tracer is a generic interface for tracing execution of the EVM.
//
// The Tracer has access to the EVM stack, memory, and contract-level information.
// It is invoked on every opcode, and may therefore have a large performance
// overhead.
type Tracer interface {
	// CaptureStart is called at the start of a transaction, before any EVM processing.
	// It is called once per transaction.
	CaptureStart(env *Evm, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called at the end of a transaction, after all EVM processing.
	// It is called once per transaction.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)

	// CaptureState is called on each step of the EVM, before the opcode is executed.
	// It is called on every opcode, and may therefore have a large performance
	// overhead.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called on each step of the EVM, after the opcode has been
	// executed, but only if the execution failed.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope, with the given output and error.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/native/call.go">
```go
// Copyright 2021 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package native

import (
	"encoding/json"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/vm"
)

// callTracer is a native tracer which returns a call frame with sub-calls.
type callTracer struct {
	env         *vm.Evm
	calls       []callLog
	stack       []*callLog
	start       time.Time
	reason      error
	interrupt   bool
	gasLimit    uint64
	transaction bool
}

// callLog is a call frame which has a list of sub-calls.
type callLog struct {
	Type    string          `json:"type"`
	From    common.Address  `json:"from"`
	To      common.Address  `json:"to"`
	Input   hexutil.Bytes   `json:"input,omitempty"`
	Output  hexutil.Bytes   `json:"output,omitempty"`
	Gas     hexutil.Uint64  `json:"gas,omitempty"`
	GasUsed hexutil.Uint64  `json:"gasUsed,omitempty"`
	Value   *hexutil.Big    `json:"value,omitempty"`
	Error   string          `json:"error,omitempty"`
	Calls   []callLog       `json:"calls,omitempty"`
}

// newCallTracer returns a native tracer which returns a call frame with sub-calls.
func newCallTracer(cfg json.RawMessage) (vm.Tracer, error) {
	return &callTracer{}, nil
}

// CaptureStart is called at the start of a transaction, it creates the root call.
func (t *callTracer) CaptureStart(env *vm.Evm, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	t.env = env
	t.gasLimit = gas

	typ := vm.CALL
	if create {
		typ = vm.CREATE
	}
	t.stack = []*callLog{{
		Type:  typ.String(),
		From:  from,
		To:    to,
		Input: hexutil.Bytes(input),
		Gas:   hexutil.Uint64(gas),
		Value: (*hexutil.Big)(value),
	}}
	t.calls = t.stack
	t.start = time.Now()
}

// CaptureEnd is called at the end of a transaction, it is used to fill the last callframe.
func (t *callTracer) CaptureEnd(output []byte, gasUsed uint64, _ time.Duration, err error) {
	if len(t.stack) != 1 {
		return
	}
	t.stack[0].GasUsed = hexutil.Uint64(gasUsed)
	t.stack[0].Output = hexutil.Bytes(output)
	if err != nil {
		t.stack[0].Error = err.Error()
		if err.Error() == vm.ErrExecutionReverted.Error() && len(output) > 0 {
			t.stack[0].Error = err.Error() + " " + hexutil.Encode(output)
		}
	}
}

// CaptureState is called on each step of the EVM, but we don't need it for call tracer.
func (t *callTracer) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
}

// CaptureFault is called on each step of the EVM, but we don't need it for call tracer.
func (t *callTracer) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
}

// CaptureEnter is called when a call or create begins.
func (t *callTracer) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	if t.interrupt {
		// Stop tracer if interrupted.
		t.env.Cancel()
		return
	}
	// Skip if the tracer is not on a transaction.
	if len(t.stack) == 0 {
		return
	}
	parent := t.stack[len(t.stack)-1]
	call := callLog{
		Type:  typ.String(),
		From:  from,
		To:    to,
		Input: hexutil.Bytes(input),
		Gas:   hexutil.Uint64(gas),
		Value: (*hexutil.Big)(value),
	}
	parent.Calls = append(parent.Calls, call)
	t.stack = append(t.stack, &parent.Calls[len(parent.Calls)-1])
}

// CaptureExit is called when a call or create finishes.
func (t *callTracer) CaptureExit(output []byte, gasUsed uint64, err error) {
	if len(t.stack) == 0 {
		return
	}
	// Pop from stack and fill in the details.
	call := t.stack[len(t.stack)-1]
	t.stack = t.stack[:len(t.stack)-1]

	call.Output = hexutil.Bytes(output)
	call.GasUsed = hexutil.Uint64(gasUsed)
	if err != nil {
		call.Error = err.Error()
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// Copyright 2018 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package logger contains an EVM struct logger that logs every step of the EVM
// into a readable JSON stream.
package logger

import (
	"encoding/json"
	"io"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/vm"
)

// Config are the configuration options for the StructLogger.
type Config struct {
	EnableMemory     bool `json:"enableMemory"`
	DisableStack     bool `json:"disableStack"`
	DisableStorage   bool `json:"disableStorage"`
	EnableReturnData bool `json:"enableReturnData"`
	// EnableOpcodeStack captures all sources of opcodes, and not only the one at the
	// active call frame. This is useful for getting a view into the opcodes being
	// executed by any precompiled contracts.
	EnableOpcodeStack bool `json:"enableOpcodeStack"`
}

// opSummary is a summary of an opcode.
type opSummary struct {
	// See StructLog for descriptions of these fields.
	Count int `json:"count"`
}

// StructLogger is a EVM state logger and implements Tracer.
//
// StructLogger can be used to print operational logs of the EVM executing a
// transaction. It is default mounted on the --trace switch.
//
// The logger may be configured via the passed in Config.
type StructLogger struct {
	cfg              Config
	err              error
	gasLimit         uint64
	gasUsed          uint64
	executionTime    time.Duration
	output           []byte
	storage          map[common.Hash]common.Hash
	opLogs           map[vm.OpCode]int
	logs             []StructLog
	currentOpcodeLog *StructLog
	mem              *vm.Memory
	stack            *vm.Stack
	rData            []byte
	depth            int
	op               vm.OpCode
	pc               uint64
	gas              uint64
	cost             uint64
	scope            *vm.ScopeContext
}

// NewStructLogger returns a new logger
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

// CaptureStart captures the beginning of a new transaction.
func (l *StructLogger) CaptureStart(env *vm.Evm, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.gasLimit = gas
	l.opLogs = make(map[vm.OpCode]int)
}

// CaptureState captures a single execution step of the VM and emits it to the configured output.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// capture opcode history
	if l.cfg.EnableOpcodeStack {
		l.opLogs[op]++
	}
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		MemorySize:    scope.Memory.Len(),
		Depth:         depth,
		Err:           err,
		OpName:        op.String(),
		ReturnData:    rData,
		ReturnDataSize: len(rData),
	}

	if l.cfg.EnableMemory {
		log.Memory = scope.Memory.Data()
	}
	if !l.cfg.DisableStack {
		log.Stack = scope.Stack.Data()
	}
	if !l.cfg.DisableStorage {
		log.Storage = l.storage
	}
	l.logs = append(l.logs, log)
	l.currentOpcodeLog = &l.logs[len(l.logs)-1]
}

// CaptureFault captures an execution fault of the VM and emits it to the configured output.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	l.err = err
}

// CaptureEnd captures the end of a transaction and appends the summarized findings to the structured log.
func (l *StructLogger) CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error) {
	l.gasUsed = gasUsed
	l.executionTime = t
	l.output = output
	l.err = err
}

// Result returns a JSON object on the logger's findings.
func (l *StructLogger) Result() (json.RawMessage, error) {
	res := struct {
		GasUsed         hexutil.Uint64            `json:"gasUsed"`
		Failed          bool                      `json:"failed"`
		ReturnValue     string                    `json:"returnValue"`
		StructLogs      []StructLogForMarshaling  `json:"structLogs"`
		OpcodeSummary   map[string]opSummary      `json:"opcodeSummary,omitempty"`
		TransactionTime string                    `json:"transactionTime,omitempty"`
	}{
		GasUsed:         hexutil.Uint64(l.gasUsed),
		Failed:          l.err != nil,
		ReturnValue:     hexutil.Encode(l.output),
		StructLogs:      make([]StructLogForMarshaling, len(l.logs)),
		TransactionTime: l.executionTime.String(),
	}

	for i, log := range l.logs {
		res.StructLogs[i] = StructLogForMarshaling(log)
	}

	// create opcode summary from captured logs
	if l.cfg.EnableOpcodeStack {
		res.OpcodeSummary = make(map[string]opSummary)
		for op, count := range l.opLogs {
			res.OpcodeSummary[op.String()] = opSummary{Count: count}
		}
	}

	return json.Marshal(res)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/writer.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with go-ethereum. If not, see <http://www.gnu.org/licenses/>.

package metrics

import (
	"fmt"
	"io"
	"slices"
	"strings"
	"time"
)

// Write sorts writes each metric in the given registry periodically to the
// given io.Writer.
func Write(r Registry, d time.Duration, w io.Writer) {
	for range time.Tick(d) {
		WriteOnce(r, w)
	}
}

// WriteOnce sorts and writes metrics in the given registry to the given
// io.Writer.
func WriteOnce(r Registry, w io.Writer) {
	var namedMetrics []namedMetric
	r.Each(func(name string, i interface{}) {
		namedMetrics = append(namedMetrics, namedMetric{name, i})
	})
	slices.SortFunc(namedMetrics, namedMetric.cmp)
	for _, namedMetric := range namedMetrics {
		switch metric := namedMetric.m.(type) {
		case *Counter:
			fmt.Fprintf(w, "counter %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", metric.Snapshot().Count())
		case *CounterFloat64:
			fmt.Fprintf(w, "counter %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %f\n", metric.Snapshot().Count())
		case *Gauge:
			fmt.Fprintf(w, "gauge %s\n", namedMetric.name)
			fmt.Fprintf(w, "  value:       %9d\n", metric.Snapshot().Value())
		case *GaugeFloat64:
			fmt.Fprintf(w, "gauge %s\n", namedMetric.name)
			fmt.Fprintf(w, "  value:       %f\n", metric.Snapshot().Value())
		case *GaugeInfo:
			fmt.Fprintf(w, "gauge %s\n", namedMetric.name)
			fmt.Fprintf(w, "  value:       %s\n", metric.Snapshot().Value().String())
		case *Healthcheck:
			metric.Check()
			fmt.Fprintf(w, "healthcheck %s\n", namedMetric.name)
			fmt.Fprintf(w, "  error:       %v\n", metric.Error())
		case Histogram:
			h := metric.Snapshot()
			ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			fmt.Fprintf(w, "histogram %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", h.Count())
			fmt.Fprintf(w, "  min:         %9d\n", h.Min())
			fmt.Fprintf(w, "  max:         %9d\n", h.Max())
			fmt.Fprintf(w, "  mean:        %12.2f\n", h.Mean())
			fmt.Fprintf(w, "  stddev:      %12.2f\n", h.StdDev())
			fmt.Fprintf(w, "  median:      %12.2f\n", ps[0])
			fmt.Fprintf(w, "  75%%:         %12.2f\n", ps[1])
			fmt.Fprintf(w, "  95%%:         %12.2f\n", ps[2])
			fmt.Fprintf(w, "  99%%:         %12.2f\n", ps[3])
			fmt.Fprintf(w, "  99.9%%:       %12.2f\n", ps[4])
		case *Meter:
			m := metric.Snapshot()
			fmt.Fprintf(w, "meter %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", m.Count())
			fmt.Fprintf(w, "  1-min rate:  %12.2f\n", m.Rate1())
			fmt.Fprintf(w, "  5-min rate:  %12.2f\n", m.Rate5())
			fmt.Fprintf(w, "  15-min rate: %12.2f\n", m.Rate15())
			fmt.Fprintf(w, "  mean rate:   %12.2f\n", m.RateMean())
		case *Timer:
			t := metric.Snapshot()
			ps := t.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			fmt.Fprintf(w, "timer %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", t.Count())
			fmt.Fprintf(w, "  min:         %9d\n", t.Min())
			fmt.Fprintf(w, "  max:         %9d\n", t.Max())
			fmt.Fprintf(w, "  mean:        %12.2f\n", t.Mean())
			fmt.Fprintf(w, "  stddev:      %12.2f\n", t.StdDev())
			fmt.Fprintf(w, "  median:      %12.2f\n", ps[0])
			fmt.Fprintf(w, "  75%%:         %12.2f\n", ps[1])
			fmt.Fprintf(w, "  95%%:         %12.2f\n", ps[2])
			fmt.Fprintf(w, "  99%%:         %12.2f\n", ps[3])
			fmt.Fprintf(w, "  99.9%%:       %12.2f\n", ps[4])
			fmt.Fprintf(w, "  1-min rate:  %12.2f\n", t.Rate1())
			fmt.Fprintf(w, "  5-min rate:  %12.2f\n", t.Rate5())
			fmt.Fprintf(w, "  15-min rate: %12.2f\n", t.Rate15())
			fmt.Fprintf(w, "  mean rate:   %12.2f\n", t.RateMean())
		}
	}
}

type namedMetric struct {
	name string
	m    interface{}
}

func (m namedMetric) cmp(other namedMetric) int {
	return strings.Compare(m.name, other.name)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"github.com/ethereum/go-ethereum/params"
)

// Gas costs for a various things
const (
	GasQuickStep   = 2
	GasFastestStep = 3
	GasFastStep    = 5
	GasMidStep     = 8
	GasSlowStep    = 10
	GasExtStep     = 20
)

// callGas returns the gas required for calling a contract.
//
// The cost of gas was changed during the homestead price change.
// See https://github.com/ethereum/eips/blob/master/EIPS/eip-2.md
func callGas(rules params.Rules, gas, availableGas, callCost uint64) (uint64, error) {
	if rules.IsEIP150 {
		availableGas = availableGas - callCost
		gas = min(gas, availableGas-availableGas/64)
	}
	return gas, nil
}

// memoryGasCost calculates the gas cost of memory size.
func memoryGasCost(memSize, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum new memory size is a 256-bit value, which is not practical
	// to allocate in memory. Set the practical limit as 2GB.
	const practicalMaxMemory = 2 * 1024 * 1024 * 1024 // 2GB
	if newMemSize > practicalMaxMemory {
		return 0, ErrGasUintOverflow
	}
	// The cost of memory is calculated as:
	//
	//   size_word = (size + 31) / 32
	//   memory_cost = (size_word**2)/512 + 3*size_word
	//
	// Here, we use the new memory size to calculate the cost.
	// The cost of memory expansion is the cost of the new size
	// minus the cost of the old size.
	//
	// The cost of the old size is already paid, so we only need
	// to pay the difference.
	oldQuad, err := SafeMul(memSize/32, memSize/32)
	if err != nil {
		return 0, err
	}
	newQuad, err := SafeMul(newMemSize/32, newMemSize/32)
	if err != nil {
		return 0, err
	}
	// The cost of memory is calculated as:
	cost := (newQuad / 512) - (oldQuad / 512)
	cost += 3 * (newMemSize/32 - memSize/32)
	return cost, nil
}

func memoryGasCostEIP3860(memSize, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	cost, overflow := memoryGasCost(memSize, newMemSize)
	if overflow != nil {
		return 0, overflow
	}
	return cost, nil
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// Tracer is the interface for EVM tracers.
//
// A Tracer has access to the StateDB of the EVM, and can probe it for information.
// It is also part of the EVM-loop, and is called for each step of the EVM.
//
// CaptureStart is called before the EVM execution starts.
//
// CaptureState is called for each step of the EVM, after the opcode has been
// executed.
//
// CaptureFault is called when an error occurs during the execution of an opcode.
//
// CaptureEnd is called after the EVM execution finishes, and returns the output of
// the execution.
//
// CaptureEnter is called when the EVM enters a new frame, either through CREATE,
// CREATE2, CALL or CALLCODE.
//
// CaptureExit is called when the EVM exits a frame, either through RETURN, REVERT,
// SELFDESTRUCT or an error.
//
// CaptureTxStart is called when a transaction is about to be processed.
//
// CaptureTxEnd is called when a transaction has been processed.
type Tracer interface {
	CaptureTxStart(tx *types.Transaction)
	CaptureTxEnd(receipt *types.Receipt, err error)
	CaptureStart(from common.Address, to common.Address, call bool, input []byte, gas uint64, value *big.Int)
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// EVMLogger is a contract execution logger that can be hooked into the EVM either
// through the config or the subscribers of the EVM.
//
// Note, the EVMLogger interface is a deprecated accessor for the EVM tracer, and
// should be replaced by a direct Tracer subscription.
type EVMLogger interface {
	// Execution logging
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// Transaction logging
	CaptureTxStart(tx *types.Transaction)
	CaptureTxEnd(receipt *types.Receipt)
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a format that can be used by upstream analysis tools.
//
// The struct logger is one of the most useful tracers, as it provides a structured
// representation of the execution flow, which can be used for a wide variety of
// analysis.
type StructLogger struct {
	cfg            StructLogConfig
	storage        map[common.Hash]common.Hash
	logs           []StructLog
	gas            uint64
	err            error
	output         []byte
	interrupt      bool // interrupt is used for stopping the logger during execution
	reason         error
	logged         bool   // Whether the first log line was printed
	depth          int    // Depth of the call stack
	reverted       bool   // Whether the execution has been reverted
	pendingOp      OpCode // The opcode that is about to be executed
	pendingProgram []byte // The code that is about to be executed

	// Call stack with the active execution scopes
	scopes []*ScopeContext
}

// NewStructLogger returns a new logger that is used for capturing execution traces
// for fault reporting and transaction tracing.
func NewStructLogger(cfg *StructLogConfig) *StructLogger {
	logger := &StructLogger{
		storage: make(map[common.Hash]common.Hash),
	}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

// CaptureStart implements the EVMLogger interface to initialize the tracing operation.
func (l *StructLogger) CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.scopes = append(l.scopes, &ScopeContext{
		evm:      evm,
		Contract: evm.contract,
	})
}

// CaptureState logs a new structured log message for a single EVM instruction.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// If we're not logging for this depth, do nothing.
	if depth > l.cfg.MaxDepth {
		return
	}
	// If we're logging for a specific transaction and it's not the one, do nothing.
	if l.cfg.TxHash != (common.Hash{}) && l.cfg.TxHash != scope.evm.TxContext.TxHash {
		return
	}
	// Avoid duplicate logs if we're interrupting
	if l.interrupt && l.reason == nil {
		l.reason = err
		return
	}
	// Reset the pending opcode, so we can detect pre-compiles
	l.pendingOp = 0

	// Copy a list of all accounts that have been touched in this step
	var touched []common.Address
	if l.cfg.EnableState {
		for _, addr := range scope.evm.StateDB.Journal().Dirtied() {
			touched = append(touched, addr)
		}
	}
	// Create the log, and shave off any not-requested items
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Depth:      depth,
		Err:        err,
		Touched:    touched,
		ReturnData: rData,
	}
	if l.cfg.EnableMemory {
		log.Memory = scope.Memory
		log.MemorySize = scope.Memory.Len()
	}
	if l.cfg.EnableStack {
		log.Stack = scope.Stack.Data()
	}
	if l.cfg.EnableState {
		log.State = l.storage
	}
	// Append the log to the list of logs
	l.logs = append(l.logs, log)

	if l.err != nil {
		// Stop logging if an error occurred.
		//
		// Don't modify the logger's error field if it's already set.
		// That would discard the original error.
		return
	}
	if l.cfg.Limit > 0 && len(l.logs) >= l.cfg.Limit {
		l.interrupt = true
		l.reason = ErrTraceLimitReached
	}
}

// CaptureEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// Skip if we're not meant to log this depth
	if l.depth > l.cfg.MaxDepth {
		l.depth++
		return
	}
	// Skip if we're not meant to log this transaction
	if l.cfg.TxHash != (common.Hash{}) && l.cfg.TxHash != l.scopes[0].evm.TxContext.TxHash {
		l.depth++
		return
	}
	// Append a new scope to the call stack
	l.scopes = append(l.scopes, &ScopeContext{
		evm:      l.scopes[len(l.scopes)-1].evm, // Evm is kept, but contract is changed
		Contract: NewContract(NewAddress(from), NewAddress(to), value, gas, input),
	})
	// The call stack has grown, do a quick check if we're shadowing a deeper contract
	l.pendingProgram = l.scopes[len(l.scopes)-1].Contract.Code
	l.pendingOp = typ

	// Log the call entering
	l.logs = append(l.logs, StructLog{
		Pc:      l.scopes[len(l.scopes)-2].Contract.pc,
		Op:      typ,
		Depth:   l.depth,
		Gas:     gas,
		Stack:   l.scopes[len(l.scopes)-2].Stack.Data(),
		Memory:  l.scopes[len(l.scopes)-2].Memory,
		Err:     l.err,
		State:   l.storage,
		refund:  l.scopes[len(l.scopes)-2].evm.StateDB.GetRefund(),
		touched: l.scopes[len(l.scopes)-2].evm.StateDB.Journal().Dirtied(),
	}
}

// CaptureExit is called when EVM exits a scope (via return, revert or error).
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	// Skip if we're not meant to log this depth
	if l.depth > l.cfg.MaxDepth+1 {
		l.depth--
		return
	}
	// Skip if we're not meant to log this transaction
	if l.cfg.TxHash != (common.Hash{}) && l.cfg.TxHash != l.scopes[0].evm.TxContext.TxHash {
		l.depth--
		return
	}
	l.depth--

	// Short circuit if the EVM is about to exit
	if l.depth < 0 {
		return
	}
	l.gas = l.scopes[len(l.scopes)-1].Contract.Gas
	l.err = err
	l.output = output
	if err != nil {
		l.reverted = true
	}
	// Pop the current scope from the stack
	l.scopes = l.scopes[:len(l.scopes)-1]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/ethapi/tracer.go">
```go
// Copyright 2019 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package ethapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
)

// callTracer is a vm.Tracer that collects all nested calls and returns them as a tree.
type callTracer struct {
	env         *vm.EVM
	call        call
	calls       []call
	cfg         *CallTracerConfig
	interrupt   atomic.Bool // Atomic bool to signal execution interruption
	reason      error       // Textual reason for the interruption
	started     time.Time
	res         *call
	txstart     hexutil.Uint64
	txfailed    bool
	txerroffset int
	err         error
}

// call represents a single call frame in the call tracer.
type call struct {
	Type         vm.OpCode       `json:"type"`
	From         common.Address  `json:"from"`
	To           common.Address  `json:"to"`
	Input        hexutil.Bytes   `json:"input,omitempty"`
	Output       hexutil.Bytes   `json:"output,omitempty"`
	Gas          hexutil.Uint64  `json:"gas,omitempty"`
	GasUsed      hexutil.Uint64  `json:"gasUsed,omitempty"`
	Value        *hexutil.Big    `json:"value,omitempty"`
	Error        string          `json:"error,omitempty"`
	Calls        []call          `json:"calls,omitempty"`
	actions      []call          // temporary field used for building the call tree
	start        time.Duration   // absolute time of frame start
	gasStart     hexutil.Uint64  // gas available at frame start
	storage      Storage         // storage slots reads/writes on this frame
	memory       [][]byte        // memory slots read on this frame, used by fourByteTracer
	keccak       [][]byte        // keccak inputs, used by prestateTracer
	sha3Preimages map[string]string // keccak inputs with its output, used by prestateTracer
}

// newCallTracer returns a native go tracer which builds a call tree of the execution.
func newCallTracer(cfg *CallTracerConfig) vm.Tracer {
	tracer := &callTracer{
		cfg: cfg,
	}
	if cfg.OnlyTopCall {
		return &topCallTracer{tracer}
	}
	return tracer
}

// CaptureStart is called to initialize the tracer.
func (t *callTracer) CaptureStart(env *vm.EVM, from, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	t.env = env
	t.started = time.Now()
	t.call = call{
		Type:     vm.CALL,
		From:     from,
		To:       to,
		Input:    common.CopyBytes(input),
		Gas:      hexutil.Uint64(gas),
		gasStart: hexutil.Uint64(gas),
		Value:    (*hexutil.Big)(value),
		start:    0,
	}
	if create {
		t.call.Type = vm.CREATE
	}
	t.txstart = hexutil.Uint64(gas)
}

// CaptureEnter is called when a new frame is entered.
func (t *callTracer) CaptureEnter(typ vm.OpCode, from, to common.Address, input []byte, gas uint64, value *big.Int) {
	if t.interrupt.Load() {
		t.env.Cancel()
		return
	}
	if t.cfg != nil && t.cfg.Timeout != nil {
		if time.Since(t.started) > t.cfg.timeout() {
			t.interrupt.Store(true)
			t.reason = errTraceTimeout
			t.env.Cancel()
			return
		}
	}
	t.calls = append(t.calls, call{
		Type:     typ,
		From:     from,
		To:       to,
		Input:    common.CopyBytes(input),
		Gas:      hexutil.Uint64(gas),
		gasStart: hexutil.Uint64(gas),
		Value:    (*hexutil.Big)(value),
		start:    time.Since(t.started),
	})
}

// CaptureExit is called when a frame is exited.
func (t *callTracer) CaptureExit(output []byte, gasUsed uint64, err error) {
	// Pop the current call from the stack
	last := t.calls[len(t.calls)-1]
	t.calls = t.calls[:len(t.calls)-1]

	// Finalize the call
	last.Output = common.CopyBytes(output)
	last.GasUsed = hexutil.Uint64(gasUsed)
	if err != nil {
		last.Error = err.Error()
		if last.Error == "execution reverted" && len(last.Output) > 0 {
			// Handle revert reason, which is not returned by the evm
			// unless we're in eth_call.
			reason, errUnpack := abi.UnpackRevert(last.Output)
			if errUnpack == nil {
				last.Error = fmt.Sprintf("execution reverted: %v", reason)
			}
		}
	}
	// Add to correct parent
	if len(t.calls) == 0 {
		t.call.actions = append(t.call.actions, last)
	} else {
		parent := &t.calls[len(t.calls)-1]
		parent.actions = append(parent.actions, last)
	}
}

// CaptureEnd is called after the EVM execution has stopped.
func (t *callTracer) CaptureEnd(output []byte, gasUsed uint64, _ time.Duration, err error) {
	t.call.Output = common.CopyBytes(output)
	t.call.GasUsed = hexutil.Uint64(gasUsed)
	if err != nil {
		t.call.Error = err.Error()
	} else if t.reason != nil {
		t.call.Error = t.reason.Error()
	}
	// The main call frame is done. Now we need to organize the subcalls
	// into a nice tree.
	// We can't know the return value of a top-level call, so we construct
	// the call tree without the top-level return value, and then add it
	// to the result.
	t.res = t.buildTree(&t.call)
}

// CaptureTxStart is called at the start of a transaction.
func (t *callTracer) CaptureTxStart(tx *types.Transaction) {}

// CaptureTxEnd is called at the end of a transaction.
func (t *callTracer) CaptureTxEnd(receipt *types.Receipt, err error) {
	if receipt != nil && receipt.Status == types.ReceiptStatusFailed {
		t.txfailed = true
	}
	t.err = err
}

// buildTree constructs the call tree by recursively processing the actions
// of a call.
func (t *callTracer) buildTree(c *call) *call {
	// The "actions" field is temporary, it will be cleared at the end of the method.
	for i := range c.actions {
		c.Calls = append(c.Calls, *t.buildTree(&c.actions[i]))
	}
	c.actions = nil // release memory
	return c
}

// GetResult returns the json-serializable result of the tracer.
func (t *callTracer) GetResult() (json.RawMessage, error) {
	if t.err != nil {
		return nil, t.err
	}
	if t.res == nil {
		// This can happen if the transaction returned an error even before the VM
		// had a chance to run, e.g. if the sender account does not exist.
		// In that case, we've not captured any trace, so we should return an
		// empty trace.
		return json.Marshal(call{})
	}
	return json.Marshal(t.res)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package core

import (
	"bytes"
	"fmt"
	"math"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// ExecutionResult includes all output after executing given evm
// message no matter the execution itself is successful or not.
type ExecutionResult struct {
	UsedGas    uint64 // Total used gas, not including the refunded gas
	MaxUsedGas uint64 // Maximum gas consumed during execution, excluding gas refunds.
	Err        error  // Any error encountered during the execution(listed in core/vm/errors.go)
	ReturnData []byte // Returned data from evm(function result or data supplied with revert opcode)
}

// IntrinsicGas computes the 'intrinsic gas' for a message with the given data.
func IntrinsicGas(data []byte, accessList types.AccessList, authList []types.SetCodeAuthorization, isContractCreation, isHomestead, isEIP2028, isEIP3860 bool) (uint64, error) {
	// Set the starting gas for the raw transaction
	var gas uint64
	if isContractCreation && isHomestead {
		gas = params.TxGasContractCreation
	} else {
		gas = params.TxGas
	}
	dataLen := uint64(len(data))
	// Bump the required gas by the amount of transactional data
	if dataLen > 0 {
		// Zero and non-zero bytes are priced differently
		z := uint64(bytes.Count(data, []byte{0}))
		nz := dataLen - z

		// Make sure we don't exceed uint64 for all data combinations
		nonZeroGas := params.TxDataNonZeroGasFrontier
		if isEIP2028 {
			nonZeroGas = params.TxDataNonZeroGasEIP2028
		}
		if (math.MaxUint64-gas)/nonZeroGas < nz {
			return 0, ErrGasUintOverflow
		}
		gas += nz * nonZeroGas

		if (math.MaxUint64-gas)/params.TxDataZeroGas < z {
			return 0, ErrGasUintOverflow
		}
		gas += z * params.TxDataZeroGas

		if isContractCreation && isEIP3860 {
			lenWords := toWordSize(dataLen)
			if (math.MaxUint64-gas)/params.InitCodeWordGas < lenWords {
				return 0, ErrGasUintOverflow
			}
			gas += lenWords * params.InitCodeWordGas
		}
	}
	if accessList != nil {
		gas += uint64(len(accessList)) * params.TxAccessListAddressGas
		gas += uint64(accessList.StorageKeys()) * params.TxAccessListStorageKeyGas
	}
	if authList != nil {
		gas += uint64(len(authList)) * params.CallNewAccountGas
	}
	return gas, nil
}

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	evm.SetTxContext(NewEVMTxContext(msg))
	return newStateTransition(evm, msg, gp).execute()
}

// stateTransition represents a state transition.
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
// ...
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... (preCheck logic)

	// Check clauses 4-5, subtract intrinsic gas if everything is correct
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	if st.gasRemaining < gas {
		return nil, fmt.Errorf("%w: have %d, want %d", ErrIntrinsicGas, st.gasRemaining, gas)
	}
    // ...
	st.gasRemaining -= gas

    // ... (rest of the execution logic)

	// Compute refund counter, capped to a refund quotient.
	st.gasRemaining += st.calcRefund()
    // ...
	st.returnGas()
    // ...
	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}

// calcRefund computes refund counter, capped to a refund quotient.
func (st *stateTransition) calcRefund() uint64 {
	var refund uint64
	if !st.evm.ChainConfig().IsLondon(st.evm.Context.BlockNumber) {
		// Before EIP-3529: refunds were capped to gasUsed / 2
		refund = st.gasUsed() / params.RefundQuotient
	} else {
		// After EIP-3529: refunds are capped to gasUsed / 5
		refund = st.gasUsed() / params.RefundQuotientEIP3529
	}
	if refund > st.state.GetRefund() {
		refund = st.state.GetRefund()
	}
	if st.evm.Config.Tracer != nil && st.evm.Config.Tracer.OnGasChange != nil && refund > 0 {
		st.evm.Config.Tracer.OnGasChange(st.gasRemaining, st.gasRemaining+refund, tracing.GasChangeTxRefunds)
	}
	return refund
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

// Run executes the given contract and returns the output as a byte slice and an error if one occurred.
//
// The interpret is a looped function that runs indefinitely unless 'ret' is returned, an error is
// thrown or the execution is cancelled by the caller.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup)

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation reason we're using uint64 as the program counter.
		// It's safe to expect the code size to be smaller than 2^64.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for lagging pc processing
		gasCopy uint64 // for EVM tracer
		logged  bool   // step log triggered
		res     []byte // result of the opcode execution function
	)
	// Don't bother tracing if there's no tracer attached
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm, contract.Address(), contract.Address(), false, input, contract.Gas, contract.value)

		defer func() {
			if err != nil {
				if !logged {
					in.cfg.Tracer.CaptureState(pc, op, contract.Gas, 0, in.scope, in.returnData, in.depth, err)
				}
				in.cfg.Tracer.CaptureFault(pc, op, contract.Gas, 0, in.scope, in.depth, err)
			}
			in.cfg.Tracer.CaptureEnd(ret, contract.Gas-gas, time.Since(in.startTime), err)
		}()
	}
	// The Interpreter main loop. This loop will continue until execution of an
	// opcode signals to exit either correctly or due to an error.
	for {
		// ...
		// Get current opcode and validate stack
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ... (stack validation)

		// Static portion of gas
		cost = operation.constantGas
		//... (dynamic gas calculation)

		// ... (consume gas)

		// Execute the operation
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, in.scope, in.returnData, in.depth, err)
			logged = true
		}
		// an operation may be interrupted, but we can't tell that from the outside
		// So we need to use a signals to do that
		if err = in.cancel(); err != nil {
			break
		}
		res, err = operation.execute(&pc, in, callContext)

		if err != nil {
			break
		}
		// ... (update memory size and other post-execution logic)
		pc++
	}

	if err == errStopToken { // Similar to STOP, used to indicate that the execution should be stopped
		err = nil
	}
	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"github.com/ethereum/go-ethereum/params"
)

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum newSize is capped at 2^64-1, which means the newly allocated
	// memory size can be at most 2^64-1.
	// The cost of memory expansion is calculated as follows:
	// Gmemory = (3 * m_words) + (m_words^2 / 512)
	// m_words is the number of 32-byte words required for memory expansion.
	//
	// The following check is to prevent the overflow of the squaring operation.
	// The maximum value of m_words is (2^64 - 1 + 31) / 32, which is
	// slightly larger than 2^59. This means m_words^2 can be at most 2^118,
	// which is smaller than 2^128, so it won't overflow uint128.
	// We can use uint128 to calculate memory gas cost.
	mWords := toWordSize(newSize)
	newCost, overflow := quadraticGasCost(mWords)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	oldCost, _ := quadraticGasCost(toWordSize(uint64(mem.Len())))
	if newCost > oldCost {
		return newCost - oldCost, nil
	}
	return 0, nil
}

// callGas returns the gas required for calling a contract.
//
// The cost of gas was changed during the Tangerine Whistle fork.
//
// Old gas calculation:
//   callGas = 'GasAddress' + ('value' > 0 ? 'GasCallValue' : 0) + ('isCreate' ? 'GasCreate' : 0)
//
// New gas calculation:
//   callGas = 'GasAddress' + ('value' > 0 ? 'GasCallValue' : 0) + ('isCreate' ? 'GasCreate' : 0) + memoryCost
//
// Where memoryCost is the cost of memory expansion for the RETURNDATA buffer.
func callGas(rules params.Rules, availableGas, base, callCost uint64, value *uint256.Int, isTransfer, isNewAccount bool, memory *Memory, size uint64) (uint64, error) {
	// Consumed gas for the call/create operation
	var (
		gas            uint64
		err            error
		cost           uint64
		transfersValue = !value.IsZero() && isTransfer
	)
	if rules.IsEIP150 {
		gas = availableGas - base
	} else {
		gas = availableGas
	}
	gas, err = gas stipendGas(callCost, gas, rules.IsEIP150)
	if err != nil {
		return 0, err
	}
	cost, err = safeAdd(cost, gas)
	if err != nil {
		return 0, err
	}
	if transfersValue {
		cost, err = safeAdd(cost, params.CallValueTransferGas)
		if err != nil {
			return 0, err
		}
	}
	if isNewAccount {
		cost, err = safeAdd(cost, params.CallNewAccountGas)
		if err != nil {
			return 0, err
		}
	}
	// Memory expansion gas for the returndata
	var memCost uint64
	if size > 0 {
		memCost, err = memoryGasCost(memory, size)
		if err != nil {
			return 0, err
		}
	}
	cost, err = safeAdd(cost, memCost)
	return cost, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package params defines the protocol parameters for the different hard-forks.
package params

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

// Gas costs of basic EVM operations.
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)

// Gas costs for expensive EVM operations.
const (
	GasCreate     uint64 = 32000
	GasCopy       uint64 = 3
	GasSStoreSet  uint64 = 20000
	GasSStoreReset uint64 = 2900
	GasSStoreClear uint64 = 0
	GasSStoreRefund uint64 = 4800

	GasSLoad            uint64 = 0   // After EIP-2929, this is a dynamic value
	GasSLoadTraced      uint64 = 200 // Legacy gas cost of SLOAD, used for tracing.
	GasJumpdest         uint64 = 1
	GasKeccak256        uint64 = 30
	GasKeccak256Word    uint64 = 6
	GasLog              uint64 = 375
	GasLogData          uint64 = 8
	GasLogTopic         uint64 = 375
	GasExp              uint64 = 10
	GasExpByte          uint64 = 50
	GasMemory           uint64 = 3
	GasTxCreate         uint64 = 32000
	GasTxDataZero       uint64 = 4
	GasTxDataNonZero    uint64 = 16
	GasTxCall           uint64 = 0
	GasTxAccessList     uint64 = 2400
	GasCallStipend      uint64 = 2300
	GasSelfdestruct     uint64 = 5000
	GasSelfdestructNewAccount uint64 = 25000
	GasSelfdestructEIP2929 uint64 = 0
)

// Dynamic gas costs after EIP-2929 (Berlin hard fork).
const (
	ColdSloadCost         uint64 = 2100
	ColdAccountAccessCost uint64 = 2600
	WarmStorageReadCost   uint64 = 100
)

const (
	// Gas costs for transient storage (EIP-1153).
	TStoreGas uint64 = 100
	TLoadGas  uint64 = 100
)

const (
	// Gas costs for blob operations (EIP-4844).
	BlobTxBlobGasPerBlob uint64 = 1 << 17 // 131,072
	BlobTxBaseFee        uint64 = 1
	BlobhashGasCost      uint64 = 3
	PointEvaluationGas   uint64 = 50000
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import "github.com/ethereum/go-ethereum/params"

// Gas costs for the EVM opcodes
var (
	gasStop          = uint64(0)
	gasAdd           = params.GasFastestStep
	gasMul           = params.GasFastStep
	gasSub           = params.GasFastestStep
	// ... (many more gas constants)
)

// gasTable holds the gas costs for each opcode.
type gasTable [256]uint64

// newGasTable returns the gas table corresponding to the given rules.
func newGasTable(rules params.Rules) gasTable {
	var table gasTable
	for i, cost := range gasTableFrontier {
		table[i] = cost
	}
	if rules.IsEIP150 {
		for i, cost := range gasTableEIP150 {
			table[i] = cost
		}
	}
	if rules.IsEIP2200 {
		for i, cost := range gasTableEIP2200 {
			table[i] = cost
		}
	}
	if rules.IsEIP2929 {
		// EIP-2929 changed gas costs for SLOAD, but that's a dynamic cost.
		// The static cost for SLOAD is set to zero after Berlin.
		table[SLOAD] = 0
	}
	// After EIP-1884, the following opcodes become more expensive.
	if rules.IsIstanbul || rules.IsBerlin {
		table[SLOAD] = params.SloadGasEIP2200
		table[BALANCE] = params.BalanceGasEIP1884
		table[EXTCODEHASH] = params.ExtcodeHashGasEIP1884
		table[EXTCODESIZE] = params.ExtcodeSizeGasEIP1884
	}
	// After EIP-3855, PUSH0 is available.
	if rules.IsShanghai {
		table[PUSH0] = params.GasQuickStep
	}
	// After EIP-1153, TLOAD and TSTORE are available.
	if rules.IsCancun {
		table[TLOAD] = params.TLoadGas
		table[TSTORE] = params.TStoreGas
		table[MCOPY] = params.GasFastestStep // MCOPY base fee
	}
	// After EIP-4844, BLOBHASH is available.
	if rules.IsCancun {
		table[BLOBHASH] = params.BlobhashGasCost
	}
	return table
}

var gasTableFrontier = gasTable{
	STOP:          0,
	ADD:           params.GasFastestStep,
	MUL:           params.GasFastStep,
	SUB:           params.GasFastestStep,
	DIV:           params.GasFastStep,
    // ...
	SSTORE:        params.SstoreSetGasFrontier, // This will be replaced by dynamic cost
	// ...
}

// gasTableEIP150 contains gas changes for the EIP150 hard fork.
var gasTableEIP150 = gasTable{
	EXTCODESIZE: params.ExtcodeSizeGasEIP150,
	EXTCODECOPY: params.ExtcodeCopyGasEIP150,
	BALANCE:     params.BalanceGasEIP150,
	SLOAD:       params.SloadGasEIP150,
	CALL:        params.CallGasEIP150,
	CALLCODE:    params.CallGasEIP150,
	DELEGATECALL: params.CallGasEIP150,
	SELFDESTRUCT: params.SelfdestructGasEIP150,
}

// ... (other gas tables for different hardforks)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/receipt.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package types

import (
	"fmt"
	"io"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rlp"
)

const (
	// ReceiptStatusFailed is the status code of a transaction if execution failed.
	ReceiptStatusFailed = 0

	// ReceiptStatusSuccessful is the status code of a transaction if execution succeeded.
	ReceiptStatusSuccessful = 1
)

// Receipt represents the results of a transaction.
type Receipt struct {
	// Consensus fields: These fields are defined by the Yellow Paper
	Type              uint8  `json:"type,omitempty"`
	PostState         []byte `json:"root"` // Post-transaction stateroot (pre-Byzantium)
	Status            uint64 `json:"status"`
	CumulativeGasUsed uint64 `json:"cumulativeGasUsed"`
	Bloom             Bloom  `json:"logsBloom"`
	Logs              []*Log `json:"logs"`

	// Implementation fields: These fields are added by geth when processing a transaction.
	// They are stored in the chain database.
	TxHash          common.Hash `json:"transactionHash"`
	ContractAddress common.Address `json:"contractAddress"`
	GasUsed         uint64      `json:"gasUsed"`

	// Implementation fields: These fields are added by geth post-processing and are not stored in the database.
	EffectiveGasPrice *big.Int `json:"effectiveGasPrice"`
	BlobGasUsed       uint64   `json:"blobGasUsed,omitempty"`
	BlobGasPrice      *big.Int `json:"blobGasPrice,omitempty"`
	BlockHash         common.Hash `json:"blockHash,omitempty"`
	BlockNumber       *big.Int    `json:"blockNumber,omitempty"`
	TransactionIndex  uint        `json:"transactionIndex"`
}
```
</file>
</go-ethereum>
## Prompt Corrections
The user's prompt is excellent and very detailed. There are no corrections needed. The provided Zig specifications are well-thought-out and align well with the concepts found in go-ethereum, making the Go code a highly relevant source of context for implementation. The request for a "Gas Inspector" is analogous to go-ethereum's `Tracer` / `EVMLogger` functionality, especially the `StructLogger` and the API-level `callTracer`, which are designed for exactly this kind of detailed execution analysis.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// EVMLogger is an interface to capture execution states.
//
// CaptureState is invoked for every opcode that executes in the EVM.
//
// Note, CaptureState can be called with err returning true on the following
// opcodes:
// - JUMP
// - JUMPI
// - INVALID
// - and any opcode that can cause a StackUnderflow error.
//
// CaptureEnter is invoked when the EVM enters a new execution context.
// This can be the result of a CALL, CALLCODE, DELEGATECALL, STATICCALL,
// CREATE, or CREATE2 instruction.
//
// CaptureExit is invoked when the EVM exits an execution context.
type EVMLogger interface {
	// CaptureStart is called once at the very beginning of a transaction.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureEnd is called once at the very end of a transaction.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	// CaptureState is called for each step of the VM Reporter will capture all the states
	// and internal infos for debugging.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is invoked only when the error is recorded in the interpreter.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnter is called when the EVM enters a new frame, either through a CALL or CREATE.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM exits a frame, either through RETURN, REVERT, or SELFDESTRUCT.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// StructLog is emitted to the EVM logger on each step of the execution.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            OpCode                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack,omitempty"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
	OpName        string                      `json:"opName"` // Configurable part of the logger, not default.
	ErrorString   string                      `json:"error,omitempty"`
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/tracers/logger/logger.go">
```go
// StructLogger is an EVM state logger and implements EVMLogger.
//
// It captures state based on the given LogConfig and stores it in a structured way,
// so that it can be formatted and used by other applications.
type StructLogger struct {
	cfg LogConfig

	logs  []vm.StructLog
	stack []vm.StructLog
	err   error

	storage  map[common.Address]map[common.Hash]common.Hash
	newslots map[common.Address]map[common.Hash]common.Hash
}

// NewStructLogger returns a new logger that stores execution states
// in a struct for later retrieval.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		storage:  make(map[common.Address]map[common.Hash]common.Hash),
		newslots: make(map[common.Address]map[common.Hash]common.Hash),
	}
	if cfg != nil {
		logger.cfg = *toLogConfig(cfg)
	}
	return logger
}

// CaptureState captures the contract state and saves it to a structured log.
//
// CaptureState is called for each step of the VM and will capture all the states
// and internal infos for debugging.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// Copy a snapshot of the stack
	var stack []*big.Int
	if l.cfg.EnableStack {
		stack = make([]*big.Int, len(scope.Stack.Data()))
		for i, item := range scope.Stack.Data() {
			stack[i] = new(big.Int).Set(item)
		}
	}
	// Copy a snapshot of the memory
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// Copy a snapshot of the storage
	var storage map[common.Hash]common.Hash
	if l.cfg.EnableStorage {
		// Only create a new map if the storage is actually modified
		if l.newslots[scope.Contract.Address()] != nil {
			storage = make(map[common.Hash]common.Hash)
			for k, v := range l.newslots[scope.Contract.Address()] {
				storage[k] = v
			}
		}
	}
	// Copy a snapshot of the return data
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}
	// Create the log item
	log := vm.StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    returnData,
		Storage:       storage,
		Depth:         depth,
		RefundCounter: scope.Contract.Gas,
		Err:           err,
	}
	l.logs = append(l.logs, log)
}

// CaptureFault is called when an error occurs during the execution of an opcode.
// It's called with the error that ocurred and captures the faulting state.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	l.err = err
}

// CaptureEnter is called when the EVM enters a new execution context
// (e.g. via a CALL or CREATE instruction).
func (l *StructLogger) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// The newslots are only of interest to the state _before_ the corresponding
	// step is executed. At this point, the Parent's state is already captured,
	// so we can safely clear the map.
	l.newslots = make(map[common.Address]map[common.Hash]common.Hash)
	if !l.cfg.ExcludePreimages {
		l.preimages[crypto.Keccak256Hash(input)] = input
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no gas refund should be
// given. The only case where gas should be refunded is in the case of a STOP
// or RETURN opcode.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup code)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically much smaller PC is possible.
		pc = uint64(0) // program counter
		// ...
		callData = input
	)
	// ...

	// The Interpreter main run loop. This loop will continue until execution calls
	// for a halt (via STOP, RETURN or SELFDESTRUCT), an error occurs, or the Go
	// context is cancelled.
	for {
		// ... (logger and debugging hook)
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, scope, in.returnData, int(in.depth), err)
		}
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// ... (gas calculation and context checks)

		// Static calls can't ever change state.
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
		// ...
		if err != nil {
			return nil, err
		}
		// If the operation has a return value, it is pushed to the stack
		if operation.returns {
			// This is a special case for SSTORE, where the gas refund is
			// deducted from the gas cost.
			if op == SSTORE {
				cost -= res[0]
			}
			// This is a special case for CALL, CALLCODE, DELEGATECALL and
			// STATICCALL, where the returned gas is pushed to the stack
			// and the deducted from the gas cost.
			if op == CALL || op == CALLCODE || op == DELEGATECALL || op == STATICCALL {
				cost -= res[0]
			}
			// This is a special case for CREATE and CREATE2, where the
			// new contract's address is pushed to the stack, and it is
			// also returned as a []byte.
			if op == CREATE || op == CREATE2 {
				ret = res
			}
		}
		pc++
		// ...
	}
	// ...
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(mem *Memory) uint64 {
	// The gas cost of memory is paid when memory is expanded.
	// Because memory is allocated in words, the gas cost is also calculated in words.
	var (
		words     = uint64(mem.Len() / 32)
		newWords  = uint64(mem.lastGasCost / 32)
		cost      uint64
		newCost   uint64
		quadCoeff = params.MemoryQuadCoeffDiv
	)
	if words > newWords {
		cost = mem.lastGasCost
		newCost = words*params.MemoryGas + words*words/quadCoeff
		mem.lastGasCost = newCost
	} else {
		return 0
	}
	return newCost - cost
}

// constGasFunc is a wrapper around a constant gas cost.
func constGasFunc(gas uint64) gasFunc {
	return func(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
		return gas, nil
	}
}

// gasSStore calculates the gas reimbursement for storing a value in the state.
func gasSStore(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// This is a violation of the YP, but has been decided to be left in.
	// See https://github.com/ethereum/go-ethereum/issues/14299
	// This appears in all clients.
	if contract.Gas <= params.SstoreSentryGasEIP2200 {
		return 0, ErrOutOfGas
	}
	// The gas cost for the SSTORE operation is calculated as follows:
	//
	// 1. If the new value is the same as the old value, the gas cost is the warm storage read cost.
	// 2. If the new value is not the same as the old value, the gas cost is either the SSTORE set gas or the SSTORE reset gas.
	// 3. If the old value is zero and the new value is non-zero, the gas cost is the SSTORE set gas.
	// 4. If the old value is non-zero and the new value is zero, the gas cost is the SSTORE reset gas. In this case, there is a gas refund.
	// 5. If the old value is non-zero and the new value is non-zero, the gas cost is the SSTORE reset gas.
	var (
		y, x    = stack.Back(0), stack.Back(1)
		current = evm.StateDB.GetState(contract.Address(), common.Hash(x.Bytes32()))
	)
	if current == (common.Hash(y.Bytes32())) {
		return params.WarmStorageReadCostEIP2929, nil
	}
	slot := common.BytesToHash(x.Bytes())
	if _, ok := contract.precompiles[slot]; ok {
		return 0, errSStoreInPrecompile
	}
	// The warm-storage-read-cost is already deducted on the caller side.
	// We need to deduct the remaining gas.
	if current == (common.Hash{}) {
		return params.SstoreSetGasEIP2200 - params.WarmStorageReadCostEIP2929, nil
	}
	// current is not empty
	if y.IsZero() {
		evm.StateDB.AddRefund(params.SstoreClearsScheduleEIP2200)
	}
	return params.SstoreResetGasEIP2200 - params.WarmStorageReadCostEIP2929, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasTable holds the gas costs for operations.
type gasTable [256]uint64

// Paris applies the Paris hard fork rules to the gas table.
func (t *gasTable) Paris() *gasTable {
	return t.Berlin()
}

// London applies the London hard fork rules to the gas table.
func (t *gasTable) London() *gasTable {
	// See https://eips.ethereum.org/EIPS/eip-3198
	t[BASEFEE] = GasQuickStep
	return t.Berlin()
}

// Berlin applies the Berlin hard fork rules to the gas table.
func (t *gasTable) Berlin() *gasTable {
	// See EIP-2929: Gas cost increases for state access opcodes.
	t[BALANCE] = 0
	t[EXTCODESIZE] = 0
	t[EXTCODECOPY] = 0
	t[EXTCODEHASH] = 0
	t[SLOAD] = 0
	t[SSTORE] = 0
	t[CALL] = 0
	t[CALLCODE] = 0
	t[DELEGATECALL] = 0
	t[STATICCALL] = 0
	return t.Istanbul()
}

// Istanbul applies the Istanbul hard fork rules to the gas table.
func (t *gasTable) Istanbul() *gasTable {
	// See EIP-1884: Repricing for trie-size-dependent opcodes.
	t[SLOAD] = SloadGasEIP1884
	t[BALANCE] = BalanceGasEIP1884
	t[EXTCODEHASH] = ExtcodeHashGasEIP1884
	t[SELFBALANCE] = GasFastStep // EIP-1884
	t[CHAINID] = GasQuickStep    // EIP-1344
	t[EXTCODESIZE] = 700         // EIP-1884
	return t.Constantinople()
}
// ... and so on for other hardforks
```
</file>

## Prompt Corrections
The original prompt is excellent and very detailed. The Zig structs and implementation plan are well-thought-out. The only minor point of feedback is that Go-Ethereum's built-in `StructLogger` is a good starting point for data *gathering*, but the prompt's `GasInspector` is more advanced as it also aims to perform analysis and provide optimization suggestions. This is a great extension on the base concept.

A small correction on the prompt's `storage_write` function: The gas cost for SSTORE is more complex than a simple switch. It depends on whether the storage slot is "warm" or "cold" (EIP-2929), the original value at the beginning of the transaction, the current value, and the new value being written (EIP-2200). The `gasSStore` function from `core/vm/gas.go` provides a good reference for this complex logic, including handling refunds. The prompt's current implementation is a good approximation but could be enhanced by looking at the Geth source.

The `CallType` enum in the prompt is perfect. This level of detail is necessary for accurate gas tracking as different call types have different gas calculation rules, especially concerning value transfers and context preservation.

The reference to Foundry and Hardhat gas reporters is very relevant, as they provide the kind of user-friendly output and analysis that the prompt aims for, which is a layer above what Geth's default tracers typically provide. Geth provides the raw data hooks; Foundry/Hardhat provide the analysis and presentation. This project aims to combine both.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracing.go">
```go
package vm

import (
	"math/big"

	"github.comcom/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
)

// Hooks are the callbacks that a EVM-assisting application can register.
type Hooks struct {
	OnTxStart func(vmctx *VMContext, tx *types.Transaction, from common.Address)
	OnTxEnd   func(receipt *types.Receipt, err error)

	// OnEnter is called when the EVM enters a new frame, either through a CALL, CREATE
	// or message call. It's not called on the initial frame of a transaction.
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)

	// OnExit is called when the EVM exits a frame, either through a RETURN, REVERT
	// or by an error.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OnGasChange is called whenever the gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)

	// OnOpcode is called before the execution of each opcode.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)
	// OnFault is called when an opcode has an error.
	// It is called after `OnOpcode` for the same instruction.
	// It is not called when `OnOpcode` has already reported an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)

	// OnStorageChange is called whenever a storage slot is changed.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)

	// OnLog is called when a log is emitted.
	OnLog func(log *types.Log)

	// OnBlockchainInit is called during the blockchain initialisation to gather
	// context information which is required by some tracers (e.g. 4bytetracer).
	OnBlockchainInit func(config *params.ChainConfig)

	// OnGenesisBlock is called on genesis block execution to gather
	// context information which is required by some tracers (e.g. 4bytetracer).
	OnGenesisBlock func(block *types.Block, alloc types.GenesisAlloc)

	// OnBlockStart is called before executing the block.
	OnBlockStart func(event BlockEvent)

	// OnBlockEnd is called after executing the block.
	OnBlockEnd func(err error)

	// OnSkippedBlock is called before executing the block.
	OnSkippedBlock func(event BlockEvent)

	// OnClose is called when the tracer is no longer needed.
	OnClose func()
}

// VMContext provides context about the block being executed as well as state
// to the tracers.
type VMContext struct {
	Coinbase    common.Address
	BlockNumber *big.Int
	Time        uint64
	Random      *common.Hash
	BaseFee     *big.Int
	StateDB     state.StateDB
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable

	hasher    crypto.KeccakState // Keccak256 hasher instance shared across opcodes
	hasherBuf common.Hash        // Keccak256 hasher result array shared across opcodes

	readOnly   bool   // Whether to throw on stateful modifications
	returnData []byte // Last CALL's return data for subsequent reuse
}

// ...

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}

		// ...

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		// Validate stack
		// ... stack validation ...

		// Static portion of gas consumption
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		} else {
			contract.Gas -= cost
		}

		// All ops with a dynamic memory usage also has a dynamic gas cost.
		var memorySize uint64
		if operation.dynamicGas != nil {
			// calculate the new memory size and expand the memory to fit
			// the operation
			// Memory check needs to be done prior to evaluating the dynamic gas portion,
			// to detect calculation overflows
			if operation.memorySize != nil {
				memSize, overflow := operation.memorySize(stack)
				if overflow {
					return nil, ErrGasUintOverflow
				}
				// memory is expanded in words of 32 bytes. Gas
				// is also calculated in words.
				if memorySize, overflow = math.SafeMul(toWordSize(memSize), 32); overflow {
					return nil, ErrGasUintOverflow
				}
			}
			// Consume the gas and return an error if not enough gas is available.
			// cost is explicitly set so that the capture state defer method can get the proper cost
			var dynamicCost uint64
			dynamicCost, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			cost += dynamicCost // for tracing
			if err != nil {
				return nil, fmt.Errorf("%w: %v", ErrOutOfGas, err)
			}
			// for tracing: this gas consumption event is emitted below in the debug section.
			if contract.Gas < dynamicCost {
				return nil, ErrOutOfGas
			} else {
				contract.Gas -= dynamicCost
			}
		}

		// Do tracing before potential memory expansion
		if debug {
			if in.evm.Config.Tracer.OnGasChange != nil {
				in.evm.Config.Tracer.OnGasChange(gasCopy, gasCopy-cost, tracing.GasChangeCallOpCode)
			}
			if in.evm.Config.Tracer.OnOpcode != nil {
				in.evm.Config.Tracer.OnOpcode(pc, byte(op), gasCopy, cost, callContext, in.returnData, in.evm.depth, VMErrorFromErr(err))
				logged = true
			}
		}
		if memorySize > 0 {
			mem.Resize(memorySize)
		}

		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		// ...
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that any error
// generated through any of the calls should be considered a
// revert-state-and-consume-all-gas operation, no checks on
// specific errors should ever be performed. The interpreter makes
// sure that any errors generated are to be considered faulty code.
//
// The EVM should never be reused and is not thread safe.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	TxContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the evm
	Config Config

	// global (to this context) ethereum virtual machine used throughout
	// the execution of the tx
	interpreter *EVMInterpreter

	// abort is used to abort the EVM calling operations
	abort atomic.Bool

	// callGasTemp holds the gas available for the current call. This is needed because the
	// available gas is calculated in gasCall* according to the 63/64 rule and later
	// applied in opCall*.
	callGasTemp uint64

	// precompiles holds the precompiled contracts for the current epoch
	precompiles map[common.Address]PrecompiledContract

	// jumpDests is the aggregated result of JUMPDEST analysis made through
	// the life cycle of EVM.
	jumpDests map[common.Hash]bitvec
}
// ...
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Capture the tracer start/end events in debug mode
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, CALL, caller, addr, input, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ... (rest of call logic)
}

func (evm *EVM) CallCode(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Invoke tracer hooks that signal entering/exiting a call frame
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, CALLCODE, caller, addr, input, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ... (rest of call logic)
}

func (evm *EVM) DelegateCall(originCaller common.Address, caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Invoke tracer hooks that signal entering/exiting a call frame
	if evm.Config.Tracer != nil {
		// DELEGATECALL inherits value from parent call
		evm.captureBegin(evm.depth, DELEGATECALL, caller, addr, input, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ... (rest of call logic)
}

func (evm *EVM) StaticCall(caller common.Address, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	// Invoke tracer hooks that signal entering/exiting a call frame
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, STATICCALL, caller, addr, input, gas, nil)
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ... (rest of call logic)
}

// ... create methods also call captureBegin/End with CREATE/CREATE2 opcodes

func (evm *EVM) captureBegin(depth int, typ OpCode, from common.Address, to common.Address, input []byte, startGas uint64, value *big.Int) {
	tracer := evm.Config.Tracer
	if tracer.OnEnter != nil {
		tracer.OnEnter(depth, byte(typ), from, to, input, startGas, value)
	}
	if tracer.OnGasChange != nil {
		tracer.OnGasChange(0, startGas, tracing.GasChangeCallInitialBalance)
	}
}

func (evm *EVM) captureEnd(depth int, startGas uint64, leftOverGas uint64, ret []byte, err error) {
	tracer := evm.Config.Tracer
	if leftOverGas != 0 && tracer.OnGasChange != nil {
		tracer.OnGasChange(leftOverGas, 0, tracing.GasChangeCallLeftOverReturned)
	}
	var reverted bool
	if err != nil {
		reverted = true
	}
	if !evm.chainRules.IsHomestead && errors.Is(err, ErrCodeStoreOutOfGas) {
		reverted = false
	}
	if tracer.OnExit != nil {
		tracer.OnExit(depth, ret, startGas-leftOverGas, VMErrorFromErr(err), reverted)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion. It does so
// only for the memory region that is expanded, not the total memory.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. Anything above
	// that will result in an overflow. Additionally, a newMemSize which results in
	// a newMemSizeWords larger than 0xFFFFFFFF will cause the square operation to
	// overflow. The constant 0x1FFFFFFFE0 is the highest number that can be used
	// without overflowing the gas calculation.
	if newMemSize > 0x1FFFFFFFE0 {
		return 0, ErrGasUintOverflow
	}
	newMemSizeWords := toWordSize(newMemSize)
	newMemSize = newMemSizeWords * 32

	if newMemSize > uint64(mem.Len()) {
		square := newMemSizeWords * newMemSizeWords
		linCoef := newMemSizeWords * params.MemoryGas
		quadCoef := square / params.QuadCoeffDiv
		newTotalFee := linCoef + quadCoef

		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}

// ...

func gasSStoreEIP2200(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// If we fail the minimum gas availability invariant, fail (0)
	if contract.Gas <= params.SstoreSentryGasEIP2200 {
		return 0, errors.New("not enough gas for reentrancy sentry")
	}
	// Gas sentry honoured, do the actual gas calculation based on the stored value
	var (
		y, x    = stack.Back(1), stack.Back(0)
		current = evm.StateDB.GetState(contract.Address(), x.Bytes32())
	)
	value := common.Hash(y.Bytes32())

	if current == value { // noop (1)
		return params.SloadGasEIP2200, nil
	}
	original := evm.StateDB.GetCommittedState(contract.Address(), x.Bytes32())
	if original == current {
		if original == (common.Hash{}) { // create slot (2.1.1)
			return params.SstoreSetGasEIP2200, nil
		}
		if value == (common.Hash{}) { // delete slot (2.1.2b)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
		return params.SstoreResetGasEIP2200, nil // write existing slot (2.1.2)
	}
	if original != (common.Hash{}) {
		if current == (common.Hash{}) { // recreate slot (2.2.1.1)
			evm.StateDB.SubRefund(params.SstoreClearsScheduleRefundEIP2200)
		} else if value == (common.Hash{}) { // delete slot (2.2.1.2)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
	}
	if original == value {
		if original == (common.Hash{}) { // reset to original inexistent slot (2.2.2.1)
			evm.StateDB.AddRefund(params.SstoreSetGasEIP2200 - params.SloadGasEIP2200)
		} else { // reset to original existing slot (2.2.2.2)
			evm.StateDB.AddRefund(params.SstoreResetGasEIP2200 - params.SloadGasEIP2200)
		}
	}
	return params.SloadGasEIP2200, nil // dirty update (2.2)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a EVMLogger that captures execution steps and converts them to
// a JSON object.
//
// StructLogger is not safe for concurrent use.
type StructLogger struct {
	cfg              *Config
	storage          map[common.Address]map[common.Hash]common.Hash
	logs             []*StructLog
	gas              uint64
	lastGasCost      uint64
	err              error
	captureNextLine  bool
	output           []byte
	reason           string
	callStack        []common.Address
	callStackCounter int

	// stop collecting when the size of the logs reach the limit
	// practically, it's almost impossible to loop forever without being killed
	// by out of gas error. we just use a similar mechanism as `debug.traceBlock`
	// to avoid running out of memory.
	sizeLimit            uint64
	currentTotalLogsSize uint64
	// In case of a revert, we need to pop the last log instead of appending a new one.
	reverted bool

	mu sync.Mutex // guards the following fields
}
//...
// CaptureEnter is called when the EVM enters a new frame, either through a
// CALL, CREATE or message call.
func (l *StructLogger) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	l.mu.Lock()
	defer l.mu.Unlock()

	l.callStack = append(l.callStack, to)
}

// CaptureExit is called when the EVM exits a frame, either through a RETURN,
// REVERT or by an error.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	l.mu.Lock()
	defer l.mu.Unlock()

	l.output = output
	l.callStack = l.callStack[:len(l.callStack)-1]
}

// CaptureState captures the contract code and the state of the stack and memory.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	//...
}

// CaptureFault captures an execution fault.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	//...
}
```
</file>

## Prompt Corrections
The original prompt provides a robust specification for a gas inspector. The go-ethereum codebase, particularly its `vm.Hooks` interface, provides excellent support for most of the required functionality. Here are some minor notes and corrections based on the Geth implementation:

1.  **No `storage_read` Hook**: The prompt's Zig implementation anticipates a `storage_read` hook. Geth does not provide a direct hook for this. `SLOAD` operations must be detected within the `step_start` (Geth: `OnOpcode`) hook by checking if the current opcode is `vm.SLOAD`. This is a feasible workaround.
2.  **`gas_cost` vs. `cost`**: In Geth's `OnOpcode` hook (`step_start` in the prompt), the gas cost of the current operation is passed as the `cost` parameter, while `gas` represents the gas remaining *before* deducting the operation cost. The prompt's `StepContext` should be clarified to match this for accurate tracking.
3.  **Call Type Identification**: The prompt's `CallType` enum is a good abstraction. In Geth, this is handled by passing the call's `OpCode` (e.g., `vm.CALL`, `vm.CREATE`, `vm.DELEGATECALL`) to the `OnEnter` hook. The implementation should map these opcodes to the `CallType` enum.
4.  **Specialized Gas Tracking**: The prompt correctly identifies the need to track gas for memory, storage, and calls separately. The gas calculation functions in `core/vm/gas_table.go` (e.g., `memoryGasCost`, `gasSStoreEIP2200`) are the canonical source for these values and should be referenced to ensure accuracy. The `OnGasChange` hook can also be used to track gas usage changes from various sources.
5.  **Actionable Insights**: Geth's tracers (like `StructLogger`) focus on data collection rather than analysis. The prompt's requirement for `OptimizationSuggestion` and `GasInefficiency` is an excellent value-add on top of the raw data. The implementation will need to contain the logic for this analysis, using the detailed data gathered from the tracer hooks as its input. For example, repeated `SLOAD`s for the same slot (detected in `step_start`) would trigger a `CacheStorageReads` suggestion.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/tracer.go">
```go
// package tracing contains the tracer hooks for the EVM.

package tracing

import (
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
)

// Hooks specifies the methods of the tracer that are invoked during EVM
// execution. These methods are called after the corresponding EVM step has
// been executed.
//
// The EVM will capture the entire state of the EVM, including the stack,
// memory and contract details. The returned error can be used to abort the
// execution of the transaction.
type Hooks struct {
	OnTxStart func(vm *vm.Context, tx *types.Transaction, from common.Address)
	OnTxEnd   func(receipt *types.Receipt, err error)

	// OnEnter is called before the execution of a new frame is started.
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)
	// OnExit is called after the execution of a frame has terminated.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)
	// OnOpcode is called before each opcode is executed.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error)
	// OnFault is called when an error happens during the execution of an opcode.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope *vm.ScopeContext, depth int, err error)
	// OnLog is called when a LOG opcode is executed.
	OnLog func(*types.Log)
}

// StructLog is a structured log emitted by the EVM while replaying a
// transaction in debug mode.
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            vm.OpCode          `json:"op"`
	Gas           uint64             `json:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        []byte             `json:"memory"`
	MemorySize    int                `json:"memSize"`
	Stack         []*big.Int         `json:"stack"`
	ReturnData    []byte             `json:"returnData"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           error              `json:"-"`
	OpName        string             `json:"opName"` // Added for reporters
	ErrorString   string             `json:"error,omitempty"`
}

// StructLogger is an EVMLogger that captures full trace data of a transaction
// execution.
//
// The captured data is not thread-safe, should not be used in goroutines.
type StructLogger struct {
	cfg *Config

	storage        map[common.Hash]common.Hash
	logs           []StructLog
	output         []byte
	err            error
	reverted       bool
	gasLimit       uint64
	executionStart time.Time
	txStart        time.Time

	hooks *Hooks
}

// NewStructLogger returns a new logger that is used to structured trace an EVM transaction.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{cfg: cfg}
	logger.hooks = &Hooks{
		OnEnter:  logger.captureEnter,
		OnExit:   logger.captureExit,
		OnOpcode: logger.captureState,
		OnFault:  logger.captureFault,
	}
	return logger
}

// captureState is called for each step of the VM and collects the current state.
func (l *StructLogger) captureState(pc uint64, op byte, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// Don't capture any trace of operations with invalid op-code
	opCode := vm.OpCode(op)
	if opCode == vm.INVALID {
		return
	}
	// Make a copy of stack and memory since they're not immutable
	var stack []*big.Int
	for _, val := range scope.Stack.Data() {
		stack = append(stack, new(big.Int).Set(val.ToBig()))
	}
	var memory []byte
	if l.cfg != nil && l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	var returnData []byte
	if l.cfg != nil && l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}
	// Create the structured log and announce it to the user
	log := StructLog{
		Pc:            pc,
		Op:            opCode,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    returnData,
		Depth:         depth,
		RefundCounter: scope.Contract.Gas, // After EIP-3529, this is the _remaining_ gas, not a refund counter
		Err:           err,
	}
	// Report error if it's not a revert.
	if err != nil && err != vm.ErrExecutionReverted {
		log.ErrorString = err.Error()
	}
	l.logs = append(l.logs, log)
}

// captureEnter is called when an EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) captureEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	l.logs = append(l.logs, StructLog{
		Pc:    0,
		Op:    vm.OpCode(typ),
		Depth: depth,
		Gas:   gas,
	})
}

// captureExit is called when an EVM exits a scope, returning the gas used and
// output of the call.
func (l *StructLogger) captureExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	l.reverted = reverted
	l.logs = append(l.logs, StructLog{
		Pc:      0,
		Op:      vm.STOP,
		Depth:   depth,
		Gas:     0,
		GasCost: gasUsed,
	})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
...
	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically, this will not be a problem.
		pc   = uint64(0) // program counter
		gas  = contract.Gas
		cost uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		// time to trace the execution of a transaction
		start = time.Now()
		// an extra buffer for call-data context to be returned from execution
		returnData = make([]byte, 0)
	)
...
	for {
...
		// if the interpreter has a logger, call it
		if in.tracer != nil {
			in.tracer.CaptureState(in.evm, pc, op, gas, cost, memory, stack, contract, in.evm.depth, err)
		}
...
		// Get operation from jump table
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
...
		// Static calls can't write to state.
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}
...
		// handle constant gas cost
		cost, err = operation.constantGas()
		if err != nil {
			return nil, err
		}
		if gas < cost {
			return nil, ErrOutOfGas
		}
		gas -= cost

		// handle dynamic gas cost
		var dynamicGas uint64
		if operation.dynamicGas != nil {
			dynamicGas, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			if err != nil {
				return nil, err
			}
			if gas < dynamicGas {
				return nil, ErrOutOfGas
			}
			gas -= dynamicGas
		}
		cost += dynamicGas
...
		// execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
...
	}
...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// gasSStoreOriginal retrieves the original value of a given storage slot, and
// besides the read gas cost, it also returns the indicator whether the slot
// has been touched by the current transaction.
func gasSStoreOriginal(evm *EVM, contract *Contract, slot common.Hash) (uint64, bool) {
	// If the slot has been modified by the current execution, then the cost of
	// retrieving the original value depends on whether it's a revert or not.
	// If it is a revert, then the original value is retrieved from the journal.
	// Otherwise, it's retrieved from the database.
	if evm.StateDB.HasSelfDestruct(contract.Address()) {
		// If the contract is marked as self-destructed, all storage writes will
		// be reverted at the end of the transaction. The storage states in the
		// state trie will not be modified. So the original value can be fetched
		// directly from the state trie.
		//
		// According to the EIP-2200, the gas cost of SLOAD should be charged.
		//
		// But in order to keep consistent with Geth, the gas cost here is still
		// warm access cost.
		return params.WarmStorageReadCost, false
	}
	if original, inJournal := evm.StateDB.GetStateOriginalValue(contract.Address(), slot); inJournal {
		if original == evm.StateDB.GetState(contract.Address(), slot) {
			// This is a no-op, charged as a warm-storage-read.
			return params.WarmStorageReadCost, true
		}
		// If the original value is not zero and the new value is also not zero,
		// it's a storage modification. Cost is `SSTORE_RESET_GAS` and an extra
		// `WARM_STORAGE_READ_COST` is charged for reading the slot.
		//
		// Otherwise, it's either a creation or deletion. In this case, no extra
		// gas is charged for reading the slot.
		if original != (common.Hash{}) {
			return params.WarmStorageReadCost, true // It's a modification or deletion
		}
		// It's a creation
		return 0, true
	}
	// If the slot has not been touched in the current transaction, then the
	// cost is `COLD_SLOAD_COST` for fetching the original value from database.
	return params.ColdSloadCost, false
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas cost of making a new account in a transaction.
	TxNewAccountGas uint64 = 25000

	// Gas cost of a transaction that doesn't create a contract.
	// Note: Not used directly, calculated from data lengths.
	TxGas uint64 = 21000

	// Gas cost of a transaction that creates a contract.
	// Note: Not used directly, calculated from data lengths.
	TxGasContractCreation uint64 = 53000

	// Gas cost of the call opcode.
	CallGas uint64 = 40

	// Gas cost of the call value transfer.
	CallValueTransferGas uint64 = 9000

	// Gas cost of the call new account.
	CallNewAccountGas uint64 = 25000

	// Gas cost of the selfdestruct opcode.
	SelfdestructGas uint64 = 5000

	// Gas cost of the selfdestruct EIP-150.
	SelfdestructEIP150Gas uint64 = 5000

	// CreateGas is the gas cost of a create operation.
	CreateGas uint64 = 32000

	// Gas cost for every word of data for a SHA3 operation.
	Keccak256WordGas uint64 = 6

	// Gas cost for copying data from a contract to memory
	CopyGas uint64 = 3

	// Gas cost for log opcodes.
	LogGas uint64 = 375

	// Gas cost per topic for log opcodes.
	LogTopicGas uint64 = 375

	// Gas cost for storing a word in a new SSTORE slot.
	SstoreSetGasEIP2200 uint64 = 20000

	// Gas cost for storing a word in an existing SSTORE slot.
	SstoreResetGasEIP2200 uint64 = 5000

	// Gas cost for clearing an SSTORE slot.
	SstoreClearsScheduleRefundEIP2200 uint64 = 15000

	// Gas cost for re-entering a warm account.
	WarmAccountAccessCost uint64 = 100

	// Gas cost for accessing a cold account for the first time.
	ColdAccountAccessCost uint64 = 2600

	// Gas cost for a cold SLOAD operation.
	ColdSloadCost uint64 = 2100
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethstats/ethstats.go">
```go
// This file is not a direct implementation of a gas inspector, but it demonstrates a similar pattern:
// collecting various statistics (block, tx, node status) and reporting them to an external service.
// The data structures and reporting loop can serve as a conceptual reference for implementing
// the report generation and output formatting part of the gas inspector.

// blockStats is the information to report about individual blocks.
type blockStats struct {
	Number     *big.Int       `json:"number"`
	Hash       common.Hash    `json:"hash"`
	ParentHash common.Hash    `json:"parentHash"`
	Timestamp  *big.Int       `json:"timestamp"`
	Miner      common.Address `json:"miner"`
	GasUsed    uint64         `json:"gasUsed"`
	GasLimit   uint64         `json:"gasLimit"`
	Diff       string         `json:"difficulty"`
	TotalDiff  string         `json:"totalDifficulty"`
	Txs        []txStats      `json:"transactions"`
	TxHash     common.Hash    `json:"transactionsRoot"`
	Root       common.Hash    `json:"stateRoot"`
	Uncles     uncleStats     `json:"uncles"`
}

// txStats is the information to report about individual transactions.
type txStats struct {
	Hash common.Hash `json:"hash"`
}

// nodeStats is the information to report about the local node.
type nodeStats struct {
	Active   bool `json:"active"`
	Syncing  bool `json:"syncing"`
	Peers    int  `json:"peers"`
	GasPrice int  `json:"gasPrice"`
	Uptime   int  `json:"uptime"`
}

// report collects all possible data to report and send it to the stats server.
// This should only be used on reconnects or rarely to avoid overloading the
// server. Use the individual methods for reporting subscribed events.
func (s *Service) report(conn *connWrapper) error {
	if err := s.reportLatency(conn); err != nil {
		return err
	}
	if err := s.reportBlock(conn, nil); err != nil {
		return err
	}
	if err := s.reportPending(conn); err != nil {
		return err
	}
	if err := s.reportStats(conn); err != nil {
		return err
	}
	return nil
}
```
</file>
</go-ethereum>

---

An analysis of the go-ethereum codebase reveals that the `Tracer` (also known as `Inspector`) interface is the primary mechanism for observing EVM execution. The `callTracer` is a specific implementation that tracks gas usage across call frames, making it an excellent reference for the requested `GasInspector`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/inspector.go">
```go
// Inspector is an interface which can be used to debug the EVM.
//
// The inspector has full access to the EVM stack, memory and contract storage.
// It is called on each step of the EVM execution and has the ability to
// query and even modify the state of the EVM.
type Inspector interface {
	// Initialize is called at the beginning of a new EVM transaction.
	Initialize(evm *EVM)

	// Step is called for each step of the EVM execution. It is not called
	// for the execution of functions of precompiled contracts.
	//
	// The scope context can be used to access the instruction pointer, stack
	// and memory. It is not safe to modify the scope context.
	Step(pc *uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// Fault is called when an error happens during the execution of an opcode.
	// It is not called when the EVM returns with an error.
	Fault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// Call is called when a contract calls another contract or itself, or when an
	// account calls a contract.
	Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int)

	// CallEnd is called when a contract call finishes.
	CallEnd(output []byte, gasUsed uint64, err error)

	// Create is called when a contract creates another contract.
	Create(caller ContractRef, code []byte, gas uint64, value *big.Int)

	// CreateEnd is called when a contract creation finishes.
	CreateEnd(contractAddr common.Address, ret []byte, gasUsed uint64, err error)

	// Finalize is called at the end of an EVM transaction.
	Finalize(evm *EVM)
}

// NoOpInspector is an empty implementation of Inspector. It can be used as a
// base to implement a custom inspector.
type NoOpInspector struct{}

func (NoOpInspector) Initialize(evm *EVM)                                                              {}
func (NoOpInspector) Step(pc *uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {}
func (NoOpInspector) Fault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {}
func (NoOpInspector) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) {}
func (NoOpInspector) CallEnd(output []byte, gasUsed uint64, err error)                                        {}
func (NoOpInspector) Create(caller ContractRef, code []byte, gas uint64, value *big.Int)                      {}
func (NoOpInspector) CreateEnd(contractAddr common.Address, ret []byte, gasUsed uint64, err error)          {}
func (NoOpInspector) Finalize(evm *EVM)                                                                       {}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/native/call_tracer.go">
```go
package native

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/vm"
)

// callFrame represents a single call frame in the call tracer.
type callFrame struct {
	Type         string          `json:"type"`
	From         common.Address  `json:"from"`
	To           common.Address  `json:"to,omitempty"`
	Input        []byte          `json:"input"`
	Output       []byte          `json:"output,omitempty"`
	Gas          uint64          `json:"gas,omitempty"`
	GasUsed      uint64          `json:"gasUsed,omitempty"`
	Value        *big.Int        `json:"value,omitempty"`
	Error        string          `json:"error,omitempty"`
	RevertReason string          `json:"revertReason,omitempty"`
	Calls        []callFrame     `json:"calls,omitempty"`
	Logs         []callLog       `json:"logs,omitempty"`
	Code         []byte          `json:"code,omitempty"`
	Init         []byte          `json:"init,omitempty"`
	GasPrice     *big.Int        `json:"gasPrice,omitempty"`
	V            *big.Int        `json:"v,omitempty"`
	S            *big.Int        `json:"s,omitempty"`
	R            *big.Int        `json:"r,omitempty"`
	Nonce        uint64          `json:"nonce,omitempty"`
	CreateAddress common.Address `json:"createAddress,omitempty"`
}

// callTracer is an Inspector that traces all calls and contract creations that
// occur during a transaction.
type callTracer struct {
	vm.NoOpInspector
	call *callFrame

	// stack is a stack of call frames. The top of the stack is the current call.
	stack []*callFrame
	cfg   *CallTracerConfig
}

// NewCallTracer creates a new call tracer.
func NewCallTracer(onlyTopCall bool) vm.Inspector {
	return &callTracer{cfg: &CallTracerConfig{OnlyTopCall: onlyTopCall}}
}

// captureGas captures the gas of the current call frame.
func (t *callTracer) captureGas(evm *vm.EVM, contract *vm.Contract) {
	if len(t.stack) > 0 && t.cfg.OnlyTopCall == false {
		t.stack[len(t.stack)-1].GasUsed = contract.Gas
	}
}

// Initialize is called at the beginning of a new EVM transaction.
func (t *callTracer) Initialize(evm *vm.EVM) {
	// For backward compatibility, we set transaction-related properties
	// in the top-level call frame.
	var from common.Address
	if evm.TxContext.Origin != nil {
		from = *evm.TxContext.Origin
	}
	v, r, s := evm.TxContext.IntrinsicGas/2, evm.TxContext.GasPrice, evm.TxContext.Value
	t.call = &callFrame{
		Type:     "CALL",
		From:     from,
		Gas:      evm.TxContext.GasLimit,
		GasPrice: evm.TxContext.GasPrice,
		V:        v,
		R:        r,
		S:        s,
		Nonce:    evm.TxContext.Nonce,
	}
	if evm.TxContext.To != nil {
		t.call.To = *evm.TxContext.To
		t.call.Input = evm.TxContext.Data
	} else {
		t.call.Init = evm.TxContext.Data
	}
	t.stack = []*callFrame{t.call}
}

// Finalize is called at the end of an EVM transaction.
func (t *callTracer) Finalize(evm *vm.EVM) {
	t.call.GasUsed = evm.TxContext.GasLimit - evm.StateDB.GetRefund() - evm.Gas
	t.call.Output = evm.ReturnData
	if evm.Error() != nil {
		t.call.Error = evm.Error().Error()
		if evm.Error() != vm.ErrExecutionReverted {
			t.call.RevertReason = ""
		}
	}
}

// Call is called when a contract calls another contract/account or itself.
func (t *callTracer) Call(caller *vm.Contract, addr common.Address, input []byte, gas uint64, value *big.Int) {
	// Don't trace if the call is a no-op.
	if t.cfg.OnlyTopCall {
		return
	}
	// Push a new call frame to the stack.
	t.stack = append(t.stack, &callFrame{
		Type:  "CALL",
		From:  caller.Address(),
		To:    addr,
		Input: input,
		Gas:   gas,
		Value: value,
	})
}

// CallEnd is called when a contract call finishes.
func (t *callTracer) CallEnd(output []byte, gasUsed uint64, err error) {
	if t.cfg.OnlyTopCall {
		return
	}
	// Pop the call frame from the stack and assign the results.
	frame := t.stack[len(t.stack)-1]
	t.stack = t.stack[:len(t.stack)-1]

	frame.GasUsed = gasUsed
	frame.Output = output
	if err != nil {
		frame.Error = err.Error()
		if err.Error() == vm.ErrExecutionReverted.Error() {
			frame.RevertReason = new(vm.RevertError).ErrorReason
		}
	}
	// Add the frame to its parent's calls.
	if len(t.stack) > 0 {
		parent := t.stack[len(t.stack)-1]
		parent.Calls = append(parent.Calls, *frame)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		precompiles := PrecompiledContractsCleanRoom
		if evm.chainRules.IsBerlin {
			precompiles = PrecompiledContractsBerlin
		}
		if precompiles[addr] == nil && evm.chainRules.IsEIP158 && value.Sign() == 0 {
			// If the recipient does not exist yet and no value is transferred,
			// we do not create the account and the call does not execute but
			// is considered successful.
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	err = evm.Context.Transfer(evm.StateDB, caller.Address(), to.Address(), value)
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, gas, err
	}
	// initialise a new contract and set the code that is to be used by the EVM.
	// the contract is a scoped environment for this execution context only.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	// Even if the account has no code, we have to handle the native hard forks.
	// No code is present, but we still need to take a snapshot, because we might
	// be doing a value transfer.
	if evm.interpreter.hasher != nil {
		evm.interpreter.hasher(addr)
	}

	if evm.Inspector != nil {
		evm.Inspector.Call(contract, addr, input, gas, value)
	}

	// It's a call into a precompile account, which does not require execution code.
	if precompile := evm.precompile(addr); precompile != nil {
		ret, gas, err = RunPrecompiledContract(precompile, input, gas)
	} else {
		// We're going to use this snapshot to revert state if the execution fails
		ret, gas, err = evm.interpreter.Run(contract, input, false)
	}
	// When the operation finishes, add left over gas to the total left over gas
	// and propagate the return value and error upwards.
	leftOverGas = gas
	if evm.Inspector != nil {
		evm.Inspector.CallEnd(ret, leftOverGas, err)
	}

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(mem *Memory) uint64 {
	// The call to memory.Len() is necessary because memory is not guaranteed to be word-aligned.
	// Any non-zero-size access will require at least one 32-byte word.
	// The cost of memory expansion is proportional to the square of the memory size,
	// so it's crucial to correctly calculate the number of words used.
	return params.MemoryGas * (mem.Len() / 32)
}

// memoryCopierGas calculates the gas required for memory expansion and copying
// in a single operation. The nature of the operation itself is irrelevant, only
// the required memory expansion and the number of words to copy are taken into

// account.
func memoryCopierGas(mem *Memory, memOffset, dataSize uint64) (uint64, error) {
	// The cost calculation logic remains consistent with the original EVM implementation.
	// The gas cost for memory expansion is computed based on the required new memory size.
	// An additional cost is charged for each word being copied.
	// Overflow checks are included to prevent arithmetic errors and ensure the
	// integrity of gas calculations.
	gas, err := memoryGas(mem, memOffset, dataSize)
	if err != nil {
		return 0, err
	}
	words := toWordSize(dataSize)
	gas, overflow := math.SafeAdd(gas, words*params.CopyGas)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// gasSStore computes the gas cost for an SSTORE operation.
func gasSStore(evm *EVM, contract *Contract, addr, value common.Hash) uint64 {
	var (
		// The warm-storage read cost is implicitly included in the access list cost.
		// So we don't need to charge it here explicitly.
		// If it's a cold SLOAD, we have to charge it here.
		gas = uint64(0)
		y, _ = evm.StateDB.GetSloan(contract.Address(), addr)
		// If we are touching a slot that has not been touched during this transaction, we must
		// also pay a cold surcharge. Note that this is not related to the `ACCESS_LIST`
		// precompile, but a global one applied to all storage accesses.
		warm = evm.StateDB.AddressInAccessList(contract.Address()) && evm.StateDB.SlotInAccessList(contract.Address(), addr)
		// It's possible that the slot has been accessed already (e.g. SLOAD), so we have to check
		// both the access-list and whether the IsWarmed logic returns true
		// Note, the IsWarmed can be true even if this is the first time this transaction accesses
		// this slot. That is the case if a previous transaction had this slot in its access-list.
		// However, in the case that this transaction _also_ has it in the access list, warm will
		--
		if !warm {
			gas += params.ColdSloadCostEIP2929
		}
		// The EIP-2200 specifies three scenarios for calculating the gas cost of a SSTORE operation.
		//
		// 1. If the new value equals the current value, the gas cost is equal to `WarmStorageReadCost`
		// which is 100 gas. This is a no-op and does not result in a state change.
		//
		// 2. If the new value is not equal to the current value, there are two sub-cases:
		//   2a. If the current value is zero, the cost is `SstoreSetGasEIP2200` (20000 gas).
		//       This is for initializing a new storage slot.
		//   2b. If the current value is non-zero, the cost is `SstoreResetGasEIP2200` (5000 gas).
		//       This is for changing the value of an existing storage slot.
		//
		// The refund logic is as follows:
		//
		// If the new value is zero and the old value was non-zero, a refund of
		// `SstoreClearsScheduleRefundEIP2200` (4800 gas) is given. This incentivizes clearing
		// storage, as it can be pruned from the state trie.
		//
		// If the new value equals the original value (the value before this transaction started),
		// additional refunds are provided depending on the state transitions.

		value_ := common.Hash(value)
		current := evm.StateDB.GetState(contract.Address(), addr)
		original := evm.StateDB.GetCommittedState(contract.Address(), addr)

		// Case 1: The value is unchanged, so the cost is the warm storage access cost.
		if value_ == current {
			return gas + params.WarmStorageReadCostEIP2929 // 100 gas
		}
		// Case 2: The value has been changed.
		if current == original {
			if original == (common.Hash{}) {
				return gas + params.SstoreSetGasEIP2200 // 20000 gas
			}
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200) // 4800 gas
			return gas + params.SstoreResetGasEIP2200                        // 5000 gas
		}
		if original != (common.Hash{}) {
			if current == (common.Hash{}) {
				evm.StateDB.SubRefund(params.SstoreClearsScheduleRefundEIP2200)
			} else if value_ == (common.Hash{}) {
				evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
			}
		}
		if value_ == original {
			if original == (common.Hash{}) {
				evm.StateDB.AddRefund(params.SstoreSetGasEIP2200 - params.WarmStorageReadCostEIP2929)
			} else {
				evm.StateDB.AddRefund(params.SstoreResetGasEIP2200 - params.WarmStorageReadCostEIP2929)
			}
		}
		return gas + params.WarmStorageReadCostEIP2929
	}
	// Pre-EIP-2929 gas calculation logic.
	// This logic is retained for historical chain replay and testing purposes.
	// It's a simpler model that doesn't distinguish between warm and cold access.
	// The cost depends only on whether a slot is being set to zero, non-zero, or being cleared.
	// ... (code omitted for brevity)
	return 0
}

func opSstore(pc *uint64, evm *EVM, contract *Contract, stack *Stack, memory *Memory, rConstraints *uint64) ([]byte, error) {
	// ...
	// The gas cost for SSTORE is calculated dynamically.
	// The gasSStore function encapsulates this logic.
	gas := gasSStore(evm, contract, loc, val)
	if !contract.UseGas(gas) {
		return nil, ErrOutOfGas
	}
	// ...
	evm.StateDB.SetState(contract.Address(), loc, val)
	return nil, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The provided Zig implementation in the prompt is quite detailed and well-structured, reflecting a good understanding of what a gas inspector needs. However, there are a few areas where the `go-ethereum` implementation offers more nuance that could be incorporated:

1.  **SSTORE Gas Calculation Nuance**: The prompt's `storage_write` function has a good estimation but misses the complete EIP-2200 and EIP-2929 logic. The `gasSStore` function in `go-ethereum/core/vm/instructions.go` shows a more complex calculation that depends on three values:
    *   The **original value** (at the start of the transaction).
    *   The **current value** (before this `SSTORE`).
    *   The **new value** (being written).

    The gas cost and, more importantly, the gas *refunds* depend on the transitions between these states (e.g., changing a value back to its original state gives a larger refund). The Zig implementation should be updated to track the "original" value of a storage slot for accurate refund calculation.

2.  **Call Gas Calculation**: The prompt's `call_start` and `call_end` hooks are correct, but the gas passed to a sub-call is not always the full amount specified. As per EIP-150, only 63/64ths of the remaining gas can be forwarded to a sub-call. `go-ethereum/core/vm/evm.go`'s `Call` method shows this logic (`allButSign(gas, 64)`). This is a critical detail for accurate gas tracking in call-heavy transactions.

3.  **Inspector Interface Granularity**: The `go-ethereum` `Inspector` interface includes a `Fault` hook, which is called when an opcode execution fails with an error (but not when the entire EVM execution reverts). This could be a useful addition to the Zig inspector for more detailed error analysis, distinguishing between opcode-level faults and transaction-level reverts.

4.  **`CallType` Enum**: The Zig `CallType` enum is a great abstraction. For implementation, it's useful to see in `go-ethereum/eth/tracers/native/call_tracer.go` how this is derived. The `Call` hook in the tracer receives the opcode (`CALL`, `DELEGATECALL`, etc.) which it then uses to set the `Type` string in its `callFrame`. The Zig implementation can do the same.

Overall, the prompt provides a strong foundation. The primary correction would be to refine the gas calculation logic, especially for `SSTORE` and inter-contract calls, by referencing the more detailed rules found in `go-ethereum`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Hooks are the complete set of hooks for the EVM object.
// These hooks are used to built debug tracers.
type Hooks struct {
	OnTxStart func(vm *VMContext, tx *types.Transaction, from common.Address)
	OnTxEnd   func(receipt *types.Receipt, err error)

	// OnEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)

	// OnExit is called when the EVM exits a scope, even if the scope didn't
	// execute any code.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OnOpcode is called for each opcode that is about to be executed.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)

	// OnFault is called when the EVM returns an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)

	// OnGasChange is called whenever the amount of available gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)

	// OnBlockchainInit is called before the EVM starts executing the first block.
	// The given ChainConfig is the one that is used for the execution.
	OnBlockchainInit func(chainConfig *params.ChainConfig)

	// OnBlockStart is called before the EVM starts executing a new block.
	OnBlockStart func(ev BlockEvent)

	// OnBlockEnd is called after the EVM has finished executing a block.
	OnBlockEnd func(err error)

	// OnSkippedBlock is called when a block is skipped during execution.
	OnSkippedBlock func(ev BlockEvent)

	// OnGenesisBlock is called when the EVM executes the genesis block.
	OnGenesisBlock func(block *types.Block, alloc types.GenesisAlloc)

	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)

	// OnNonceChange is called when the nonce of an account changes.
	OnNonceChange func(addr common.Address, prev, new uint64)

	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(addr, prevCodeHash common.Hash, prevCode, codeHash common.Hash, code []byte)

	// OnStorageChange is called when a storage slot of an account changes.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)

	// OnLog is called when a LOG opcode is executed.
	OnLog func(*types.Log)

	// OnBlockHashRead is called when the BLOCKHASH opcode is executed.
	OnBlockHashRead func(number uint64, hash common.Hash)
}

// OpContext provides read-only access to the execution scope of the current opcode.
type OpContext interface {
	// PC returns the program counter.
	PC() uint64
	// Op returns the opcode.
	Op() vm.OpCode
	// Gas returns the available gas.
	Gas() uint64
	// Address returns the contract address.
	Address() common.Address
	// Caller returns the caller address.
	Caller() common.Address
	// CallValue returns the value of the call.
	CallValue() *uint256.Int
	// CallInput returns the input of the call.
	CallInput() []byte
	// Depth returns the execution depth.
	Depth() int
	// StackData returns the stack data.
	StackData() []uint256.Int
	// MemoryData returns the memory data.
	MemoryData() []byte
	// ReturnData returns the return data.
	ReturnData() []byte
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// Config are the configuration options for structured logger the EVM
type Config struct {
	EnableMemory     bool // enable memory capture
	DisableStack     bool // disable stack capture
	DisableStorage   bool // disable storage capture
	EnableReturnData bool // enable return data capture
	Limit            int  // maximum size of output, but zero means unlimited
	// Chain overrides, can be used to execute a trace using future fork rules
	Overrides *params.ChainConfig `json:"overrides,omitempty"`
}

// StructLog is emitted to the EVM each cycle and lists information about the
// current internal state prior to the execution of the statement.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

// StructLogger is an EVM state logger and implements EVMLogger.
//
// StructLogger can capture state based on the given Log configuration and also keeps
// a track record of modified storage which is used in reporting snapshots of the
// contract their storage.
type StructLogger struct {
	cfg Config
	env *tracing.VMContext

	storage map[common.Address]Storage
	logs    []StructLog
	output  []byte
	err     error
	usedGas uint64

	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
	skip      bool        // skip processing hooks.
}

// NewStructLogger construct a new struct logger
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		storage: make(map[common.Address]Storage),
		logs:    make([]StructLog, 0),
	}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

func (l *StructLogger) Hooks() *tracing.Hooks {
	return &tracing.Hooks{
		OnTxStart:           l.OnTxStart,
		OnSystemCallStartV2: l.OnSystemCallStart,
		OnSystemCallEnd:     l.OnSystemCallEnd,
		OnExit:              l.OnExit,
		OnOpcode:            l.OnOpcode,
	}
}

// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opc byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// If tracing was interrupted, exit
	if l.interrupt.Load() {
		return
	}
	// Processing a system call.
	if l.skip {
		return
	}
	op := vm.OpCode(opc)
	// check if already accumulated the size of the response.
	if l.cfg.Limit != 0 && len(l.logs) >= l.cfg.Limit {
		return
	}

	memory := scope.MemoryData()
	stackData := scope.StackData()
	stack := make([]*big.Int, len(stackData))
	for i, item := range stackData {
		stack[i] = item.ToBig()
	}
	contractAddr := scope.Address()

	log := StructLog{pc, op, gas, cost, nil, len(memory), nil, nil, nil, depth, l.env.StateDB.GetRefund(), err}
	if l.cfg.EnableMemory {
		log.Memory = common.CopyBytes(memory)
	}
	if !l.cfg.DisableStack {
		log.Stack = stack
	}
	if l.cfg.EnableReturnData {
		log.ReturnData = common.CopyBytes(rData)
	}

	// Copy a snapshot of the current storage to a new container
	var storage Storage
	if !l.cfg.DisableStorage && (op == vm.SLOAD || op == vm.SSTORE) {
		// initialise new changed values storage container for this contract
		// if not present.
		if l.storage[contractAddr] == nil {
			l.storage[contractAddr] = make(Storage)
		}
		// capture SLOAD opcodes and record the read entry in the local storage
		stackLen := len(stackData)
		if op == vm.SLOAD && stackLen >= 1 {
			var (
				address = common.Hash(stackData[stackLen-1].Bytes32())
				value   = l.env.StateDB.GetState(contractAddr, address)
			)
			l.storage[contractAddr][address] = value
			storage = maps.Clone(l.storage[contractAddr])
		} else if op == vm.SSTORE && stackLen >= 2 {
			// capture SSTORE opcodes and record the written entry in the local storage.
			var (
				value   = common.Hash(stackData[stackLen-2].Bytes32())
				address = common.Hash(stackData[stackLen-1].Bytes32())
			)
			l.storage[contractAddr][address] = value
			storage = maps.Clone(l.storage[contractAddr])
		}
	}
	log.Storage = storage

	l.logs = append(l.logs, log)
}

// ExecutionResult groups all structured logs emitted by the EVM
// while replaying a transaction in debug mode as well as transaction
// execution status, the amount of gas used and the return value
type ExecutionResult struct {
	Gas         uint64      `json:"gas"`
	Failed      bool        `json:"failed"`
	ReturnValue string      `json:"returnValue"`
	StructLogs  []StructLog `json:"structLogs"`
}

// GetResult returns the structured logs collected during the execution of EVM
// while replaying a transaction in debug mode.
func (l *StructLogger) GetResult() (json.RawMessage, error) {
	// Tracing aborted
	if l.reason != nil {
		return nil, l.reason
	}
	slogs := make([]StructLog, len(l.logs))
	copy(slogs, l.logs)

	// When the result of transaction is a revert, the return value is the error message
	var returnValue string
	if l.err != nil {
		returnValue = ""
		if errors.Is(l.err, vm.ErrExecutionReverted) {
			if len(l.output) > 0 {
				returnValue = hexutil.Encode(l.output)
			}
		}
	} else {
		returnValue = hexutil.Encode(l.output)
	}

	res, err := json.Marshal(&ExecutionResult{
		Gas:         l.usedGas,
		Failed:      l.err != nil,
		ReturnValue: returnValue,
		StructLogs:  slogs,
	})
	if err != nil {
		return nil, err
	}
	return json.RawMessage(res), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/native/call.go">
```go
// callTracer is a native go tracer which tracks
// call frames of a tx, and implements vm.EVMLogger.
type callTracer struct {
	callstack []callFrame
	config    callTracerConfig
	gasLimit  uint64
	depth     int
	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
}

type callFrame struct {
	Type         vm.OpCode       `json:"-"`
	From         common.Address  `json:"from"`
	Gas          uint64          `json:"gas"`
	GasUsed      uint64          `json:"gasUsed"`
	To           *common.Address `json:"to,omitempty" rlp:"optional"`
	Input        []byte          `json:"input" rlp:"optional"`
	Output       []byte          `json:"output,omitempty" rlp:"optional"`
	Error        string          `json:"error,omitempty" rlp:"optional"`
	RevertReason string          `json:"revertReason,omitempty"`
	Calls        []callFrame     `json:"calls,omitempty" rlp:"optional"`
	Logs         []callLog       `json:"logs,omitempty" rlp:"optional"`
	// Placed at end on purpose. The RLP will be decoded to 0 instead of
	// nil if there are non-empty elements after in the struct.
	Value            *big.Int `json:"value,omitempty" rlp:"optional"`
	revertedSnapshot bool
}

// OnEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (t *callTracer) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	t.depth = depth
	if t.config.OnlyTopCall && depth > 0 {
		return
	}
	// Skip if tracing was interrupted
	if t.interrupt.Load() {
		return
	}

	toCopy := to
	call := callFrame{
		Type:  vm.OpCode(typ),
		From:  from,
		To:    &toCopy,
		Input: common.CopyBytes(input),
		Gas:   gas,
		Value: value,
	}
	if depth == 0 {
		call.Gas = t.gasLimit
	}
	t.callstack = append(t.callstack, call)
}

// OnExit is called when EVM exits a scope, even if the scope didn't
// execute any code.
func (t *callTracer) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if depth == 0 {
		t.captureEnd(output, gasUsed, err, reverted)
		return
	}

	t.depth = depth - 1
	if t.config.OnlyTopCall {
		return
	}

	size := len(t.callstack)
	if size <= 1 {
		return
	}
	// Pop call.
	call := t.callstack[size-1]
	t.callstack = t.callstack[:size-1]
	size -= 1

	call.GasUsed = gasUsed
	call.processOutput(output, err, reverted)
	// Nest call into parent.
	t.callstack[size-1].Calls = append(t.callstack[size-1].Calls, call)
}

func (t *callTracer) OnTxEnd(receipt *types.Receipt, err error) {
	// Error happened during tx validation.
	if err != nil {
		return
	}
	if receipt != nil {
		t.callstack[0].GasUsed = receipt.GasUsed
	}
	if t.config.WithLog {
		// Logs are not emitted when the call fails
		clearFailedLogs(&t.callstack[0], false)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas and refund related constants
	MaxRefundQuotient uint64 = 5 // Maximum refund quotient; max gas refunded <= gasUsed / 5

	// Gas costs for basic EVM operations
	GasQuickStep   uint64 = 2  // Cost for cheap operations
	GasFastestStep uint64 = 3  // Cost for fastest operations
	GasFastStep    uint64 = 5  // Cost for fast operations
	GasMidStep     uint64 = 8  // Cost for mid-tier operations
	GasSlowStep    uint64 = 10 // Cost for slow operations
	GasExtStep     uint64 = 20 // Cost for external operations

	// Gas costs for expensive EVM operations
	ExpGas           uint64 = 10   // Cost of EXP instruction
	ExpByteGas       uint64 = 50   // Cost of EXP instruction per byte of exponent
	Keccak256Gas     uint64 = 30   // Cost of KECCAK256 instruction
	Keccak256WordGas uint64 = 6    // Cost of KECCAK256 instruction per word of input
	CopyGas          uint64 = 3    // Cost of memory copy instructions per word
	LogGas           uint64 = 375  // Cost of LOG instruction
	LogDataGas       uint64 = 8    // Cost of LOG instruction per byte of data
	LogTopicGas      uint64 = 375  // Cost of LOG instruction per topic
	CallGas          uint64 = 0    // Cost of CALL instruction, is a dynamic value
	CreateDataGas    uint64 = 200  // Cost of CREATE instruction per byte of data
	CallStipend      uint64 = 2300 // Free gas given to account for receiving value
	SstoreSentryGasEIP2200 uint64 = 2300  // Minimum gas required to stay within a SSTORE call
	SstoreNoopGasEIP2200   uint64 = 800   // Cost of an SSTORE operation that's a noop
	SstoreDirtyGasEIP2200  uint64 = 800   // Cost of an SSTORE operation that changes a dirty slot
	SstoreInitGasEIP2200   uint64 = 20000 // Cost of an SSTORE operation that initates a slot
	SstoreInitRefundEIP2200   uint64 = 19200 // Refund when an SSTORE operation initialises a slot
	SstoreCleanGasEIP2200     uint64 = 5000 // Cost of an SSTORE operation that re-initialises a slot to zero
	SstoreCleanRefundEIP2200  uint64 = 4200 // Gas refunded when a slot is re-initialised to zero
	SstoreClearRefundEIP2200  uint64 = 15000 // Gas refunded when a slot is deleted
	SstoreResetGasEIP2200     uint64 = 2900 // Cost of an SSTORE operation that sets a slot to its original value
	SstoreResetClearRefundEIP2200 uint64 = 12900 // Gas refunded when a slot is reset to zero from a non-zero value
	SstoreResetInitRefundEIP2200  uint64 = 17100 // Gas refunded when a slot is reset to its original non-zero value
	SelfdestructGasEIP150     uint64 = 5000  // Cost of the SELFDESTRUCT operation post-EIP150
	SelfdestructRefundGas     uint64 = 24000 // Gas refunded from SELFDESTRUCT operation

	// EIP-2929 related gas constants
	ColdAccountAccessCostEIP2929 uint64 = 2600 // Cost of accessing an account that is not in the access list
	WarmStorageReadCostEIP2929   uint64 = 100 // Cost of reading a storage slot that is in the access list
	ColdSloadCostEIP2929         uint64 = 2100 // Cost of a SLOAD operation that is not in the access list
	AccessListAddressCostEIP2930 uint64 = 2400 // Cost of an address in the access list
	AccessListSlotCostEIP2930    uint64 = 1900 // Cost of a storage slot in the access list

	// EIP-3529 related gas constants
	SstoreClearsRefundEIP3529 uint64 = 4800 // Gas refunded when a slot is cleared (from a non-zero value to zero)

	// EIP-3860 related gas constants
	InitCodeGas uint64 = 2 // Cost per word for initcode

	// EIP-4844 related gas constants
	BlobTxBlobGasPerBlob   = 1 << 17 // Gas cost per blob in a transaction.
	BlobTxTargetBlobGasPerBlock = 1 << 18 // Target blob gas per block.

	// EIP-1153 related gas constants
	TstoreGas = 100
	TloadGas  = 100

	// Memory related constants
	MemoryGas     uint64 = 3    // Cost of memory expansion per word
	QuadCoeffDiv  uint64 = 512  // Divisor for quadratic memory cost

	// Tx-related constants
	TxGas              uint64 = 21000 // Per-transaction gas linear cost
	TxGasContractCreation uint64 = 53000 // Per-transaction gas for contract creation
	TxDataZeroGas      uint64 = 4     // Cost of zero byte in transaction data
	TxDataNonZeroGasFrontier uint64 = 68    // Cost of non-zero byte in transaction data before EIP-2028
	TxDataNonZeroGasEIP2028  uint64 = 16    // Cost of non-zero byte in transaction data after EIP-2028 (part of Istanbul)
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/api.go">
```go
// traceTx configures a new tracer according to the provided configuration, and
// executes the given message in the provided environment. The return value will
// be tracer dependent.
func (api *API) traceTx(ctx context.Context, tx *types.Transaction, message *core.Message, txctx *Context, vmctx vm.BlockContext, statedb *state.StateDB, config *TraceConfig, precompiles vm.PrecompiledContracts) (interface{}, error) {
	var (
		tracer  *Tracer
		err     error
		timeout = defaultTraceTimeout
		usedGas uint64
	)
	if config == nil {
		config = &TraceConfig{}
	}
	// Default tracer is the struct logger
	if config.Tracer == nil {
		logger := logger.NewStructLogger(config.Config)
		tracer = &Tracer{
			Hooks:     logger.Hooks(),
			GetResult: logger.GetResult,
			Stop:      logger.Stop,
		}
	} else {
		tracer, err = DefaultDirectory.New(*config.Tracer, txctx, config.TracerConfig, api.backend.ChainConfig())
		if err != nil {
			return nil, err
		}
	}
	tracingStateDB := state.NewHookedState(statedb, tracer.Hooks)
	evm := vm.NewEVM(vmctx, tracingStateDB, api.backend.ChainConfig(), vm.Config{Tracer: tracer.Hooks, NoBaseFee: true})
	if precompiles != nil {
		evm.SetPrecompiles(precompiles)
	}

	// Define a meaningful timeout of a single transaction trace
	if config.Timeout != nil {
		if timeout, err = time.ParseDuration(*config.Timeout); err != nil {
			return nil, err
		}
	}
	deadlineCtx, cancel := context.WithTimeout(ctx, timeout)
	go func() {
		<-deadlineCtx.Done()
		if errors.Is(deadlineCtx.Err(), context.DeadlineExceeded) {
			tracer.Stop(errors.New("execution timeout"))
			// Stop evm execution. Note cancellation is not necessarily immediate.
			evm.Cancel()
		}
	}()
	defer cancel()

	// Call Prepare to clear out the statedb access list
	statedb.SetTxContext(txctx.TxHash, txctx.TxIndex)
	_, err = core.ApplyTransactionWithEVM(message, new(core.GasPool).AddGas(message.GasLimit), statedb, vmctx.BlockNumber, txctx.BlockHash, vmctx.Time, tx, &usedGas, evm)
	if err != nil {
		return nil, fmt.Errorf("tracing failed: %w", err)
	}
	return tracer.GetResult()
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt provides a very detailed and well-structured set of requirements for a `GasInspector`. The proposed Zig implementation skeleton is also excellent. The go-ethereum codebase offers strong parallels that can guide this implementation.

There are no major corrections needed for the prompt. However, here are a few suggestions and clarifications based on the go-ethereum implementation:

1.  **Refined `GasStats`**: The `GasStats` struct in the prompt is good. Go-ethereum's metrics often use more advanced statistical measures like exponentially decaying samples for things like gas price estimation. For a gas inspector, the current `min/max/avg/total` is perfectly sufficient and a great starting point.

2.  **Differentiating Gas and Gas Cost**: The prompt uses `gas_cost` in `StepContext` and `gas_used` in `CallGasFrame`. This is a good distinction. In go-ethereum's `StructLog`, `Gas` refers to the *gas remaining* before the opcode execution, and `GasCost` is the cost of the *current* opcode. It would be beneficial to adopt this clear naming in the Zig implementation:
    *   `gas_remaining` (before op)
    *   `gas_cost` (of the op)
    This allows for easy verification: `gas_remaining_before - gas_cost_of_op == gas_remaining_after`.

3.  **Static vs. Dynamic Gas Costs**: When tracking gas by opcode (`gas_by_opcode`), it's important to note that many opcodes have both a static and a dynamic gas cost component (e.g., `MLOAD`'s cost depends on memory expansion). The `StructLogger` in go-ethereum captures the *total* cost for that specific execution of the opcode. The prompt's design already implicitly supports this, which is correct. The context from `params/protocol_params.go` highlights these different components.

4.  **Error Handling in Tracers**: The `StructLog` in go-ethereum includes an `Err` field. This is crucial for understanding *why* an operation failed and how much gas was consumed up to that point. The proposed `GasInspector` should also consider capturing execution errors at each step or at the end of a call frame to provide context for gas usage patterns in failed transactions.

5.  **Configuration**: The `GasInspectorConfig` is well-thought-out. The go-ethereum `logger.Config` shows a similar pattern (`EnableMemory`, `DisableStack`, etc.), confirming this is a standard and effective design for making tracers configurable and performant.

The provided prompt is solid. The go-ethereum snippets confirm that the proposed design aligns well with established, production-grade EVM implementations and offer concrete examples for the hook-based interaction with the VM.

---

An excellent and detailed prompt. Implementing a comprehensive gas inspector is a complex task. Go-ethereum's native tracers provide a solid foundation for this feature. The most relevant parts are the `Tracer` interface, how it's integrated into the EVM interpreter loop, the `callTracer` for call hierarchy analysis, and the specific gas calculation functions.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// Tracer is a EVM state logger.
//
// Tracer can be used to obtain execution traces from an EVM.
//
// The CaptureState method is called for each step of the EVM, and can be used to
// record the EVM's internal state.
//
// The tracer has access to the memory, stack, and other internal data structures
// of the EVM.
type Tracer interface {
	// CaptureStart is called once at the beginning of a new transaction to let the
	// tracer know that a new trace is about to be started.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called for each step of the EVM OPPCODE execution.
	// It's not called on steps that fail with an error between opcodes
	// (e.g. stack underflow).
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when the EVM returns with an error at a specific
	// step. A call to CaptureFault is not followed by a call to CaptureState.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called after the call finishes to finalize the trace.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create
	// or create2).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope, even if the scope came
	// from a call that reverted or failed.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the execution of smart
// contracts.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// StateDB provides access to the world state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// virtual machine configuration options used to initialise the vm
	vmConfig Config
	// global gas pool for the transaction
	gasPool *core.GasPool
	// Tracer is the state logger capturing all storage views
	Tracer Tracer
	// readOnly is a flag indicating whether state modifications are allowed
	readOnly bool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
...
	// Don't capture any trace of CREATE/CALL until the opcode has been processed
	// This makes it possible to catch gas accumulation errors before method calls
	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For tracing
		pc   = uint64(0) // program counter
		gas  = contract.Gas
		cost uint64
		...
	)
	// The Interpreter main run loop
	for {
        // Capture pre-execution values for tracing
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, &ScopeContext{
				Stack:   stack,
				Memory:  mem,
				Contract: contract,
			}, in.returnData, in.depth, err)
		}
...
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.opTable[op]
...
		// Static calls can't ever modify state. The interpreter checks this on the top
		// level, and the execution of the opcode checks this again.
		if in.readOnly() && operation.writes {
			return nil, ErrWriteProtection
		}
...
		switch op {
		case CREATE, CREATE2:
			// Ensure that the interpreter has access to the state db.
			// It is intentionally not injected into the constructor of the interpreter,
			// because it's not always available.
			if in.evm.StateDB == nil {
				return nil, errNoStateDB
			}
			ret, err = in.create(contract, stack, mem, op)

		case CALL, CALLCODE, DELEGATECALL, STATICCALL:
			// Ensure that the interpreter has access to the state db.
			if in.evm.StateDB == nil {
				return nil, errNoStateDB
			}
			ret, err = in.call(contract, stack, mem, op)
...
		// default is the same as above, but does not increment pc. The fallthrough is intentional
		default:
			// On return, the program counter would be pointed at the next instruction,
			// so we need to trace that.
			cost, err = operation.gasCost(in.evm, contract, stack, mem)
		}
...
	}
...
}

// call can be used to call a contract, account or precompiled contract.
func (in *Interpreter) call(contract *Contract, stack *Stack, mem *Memory, op OpCode) ([]byte, error) {
...
	// It's not go-ethereum's business to decide how the tracer will handle this.
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureEnter(op, caller.Address(), toAddr, input, gas, value)
	}
	ret, returnGas, err = in.evm.Call(caller, toAddr, input, gas, value)
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureExit(ret, returnGas, err)
	}
...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/native/call.go">
```go
// callTracer is a native go tracer that builds a call tree of a transaction.
type callTracer struct {
	callstack []callFrame // Call stack of the EVM running
	interrupt chan error  // Channel to abort the tracer from another goroutine
	reason    error       // Reason for aborting the tracer
	cfg       Config      // Tracer configuration
	gasLimit  uint64      // Gas limit of the transaction
}
...
// callFrame is a single frame in the call stack.
type callFrame struct {
	Type    string          `json:"type"`
	From    common.Address  `json:"from"`
	To      common.Address  `json:"to,omitempty"`
	Input   hexutil.Bytes   `json:"input,omitempty"`
	Output  hexutil.Bytes   `json:"output,omitempty"`
	Gas     hexutil.Uint64  `json:"gas,omitempty"`
	GasUsed hexutil.Uint64  `json:"gasUsed,omitempty"`
	Value   *hexutil.Big    `json:"value,omitempty"`
	Error   string          `json:"error,omitempty"`
	Calls   []callFrame     `json:"calls,omitempty"`
	logs    []*types.Log    // Non-exported field to store logs generated in this frame
	// we need to store the children's logs until we're sure the call succeeds
}
...
// CaptureStart implements the Tracer interface to initialize the tracing operation.
func (t *callTracer) CaptureStart(env *vm.EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	// The callstack always starts with the top-level call
	t.gasLimit = gas
	t.callstack = []callFrame{{
		Type:  "CALL",
		From:  from,
		To:    to,
		Input: input,
		Gas:   hexutil.Uint64(gas),
		Value: (*hexutil.Big)(value),
	}}
	if create {
		t.callstack[0].Type = "CREATE"
	}
}

// CaptureEnd is called after the call finishes to finalize the trace.
func (t *callTracer) CaptureEnd(output []byte, gasUsed uint64, err error) {
	// The top-level call frame should be the last one
	t.callstack[0].GasUsed = hexutil.Uint64(gasUsed)
	if err != nil {
		t.callstack[0].Error = err.Error()
		if err.Error() == vm.ErrExecutionReverted.Error() {
			t.callstack[0].Output = hexutil.Bytes(output)
		}
	} else {
		t.callstack[0].Output = hexutil.Bytes(output)
	}
}

// CaptureEnter is called when the EVM enters a new scope (via call, create
// or create2).
func (t *callTracer) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// Skip if the tracer was aborted
	if t.reason != nil {
		return
	}
	t.callstack = append(t.callstack, callFrame{
		Type:  typ.String(),
		From:  from,
		To:    to,
		Input: hexutil.Bytes(input),
		Gas:   hexutil.Uint64(gas),
		Value: (*hexutil.Big)(value),
	})
}

// CaptureExit is called when the EVM exits a scope, even if the scope came
// from a call that reverted or failed.
func (t *callTracer) CaptureExit(output []byte, gasUsed uint64, err error) {
	// Skip if the tracer was aborted
	if t.reason != nil {
		return
	}
	// Pop the last call frame and update its results
	frame := t.callstack[len(t.callstack)-1]
	t.callstack = t.callstack[:len(t.callstack)-1]

	frame.GasUsed = hexutil.Uint64(gasUsed)
	if err != nil {
		frame.Error = err.Error()
		if err.Error() == vm.ErrExecutionReverted.Error() {
			frame.Output = hexutil.Bytes(output)
		}
	} else {
		frame.Output = hexutil.Bytes(output)
	}
	// If the call was successful, retrieve all the logs that were generated
	// This is not done for failed calls, to not duplicate the logs
	if err == nil {
		frame.logs = t.getLogs(false)
	}
	t.callstack[len(t.callstack)-1].Calls = append(t.callstack[len(t.callstack)-1].Calls, frame)
}

// CaptureState is called for each step of the EVM OPPCODE execution.
func (t *callTracer) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
    ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum newSize is capped at 2^64-1, which is definitely not reachable
	// on a 64-bit machine.
	if newSize > math.MaxInt64 {
		return 0, ErrGasUintOverflow
	}
	// The cost of memory usage is Gmem * m_words + m_words^2 / G_quadcoeffdiv,
	// where m_words is the number of words.
	// This formula is used to calculate the cost of the NEW memory size, and
	// the cost of the OLD memory size is subtracted.
	oldSize := uint64(mem.Len())
	if newSize <= oldSize {
		return 0, nil
	}
	// old M words
	oldWords := (oldSize + 31) / 32
	// new M words
	newWords := (newSize + 31) / 32

	// gas cost of old memory
	oldCost := oldWords*GasMem + oldWords*oldWords/QuadCoeffDiv
	// gas cost of new memory
	newCost := newWords*GasMem + newWords*newWords/QuadCoeffDiv
	// check for overflow
	if newCost < oldCost {
		return 0, ErrGasUintOverflow
	}
	return newCost - oldCost, nil
}
...
// gasSStore calculates the gas refund for an SSTORE operation.
func gasSStore(evm *EVM, contract *Contract, stack *Stack) (gas uint64, err error) {
...
	// Pop the value and the location
	loc := stack.peek(0)
	val := stack.peek(1)

	// The legacy gas metering is based on the current value of the storage slot.
	// The EIP-2200 is based on the original value, so we need to load it from the state.
	var (
		currentVal = evm.StateDB.GetState(contract.Address(), loc.Bytes32())
		originalVal = evm.StateDB.GetCommittedState(contract.Address(), loc.Bytes32())
	)
...
	// EIP-2200 revision of SSTORE gas metering.
	//
	// The warm-up is already done in access_list.go, and the cost is already deducted.
	// Here we only need to calculate the costs of changes.
	//
	// https://eips.ethereum.org/EIPS/eip-2200
	//
	// The cost of a SSTORE operation is calculated as follows:
	//
	// 1. If current value equals new value (this is a no-op), 100 gas is charged. This is the warm storage access cost.
	// 2. If current value does not equal new value
	//   2.1. If original value equals current value (this is the first time this slot is changed in this transaction)
	//     2.1.1. If original value is 0, 20000 gas is charged.
	//     2.1.2. If original value is not 0, 2900 gas is charged.
	//   2.2. If original value does not equal current value (this slot has been changed in this transaction before)
	//     2.2.1. 100 gas is charged.
	//
	// In addition to the gas cost, a refund is added to the refund counter if the slot is cleared.
	// Please note that the refund counter is capped at a percentage of the total transaction gas.
	//
	// 1. If original value is not 0
	//   1.1. If current value is 0 (slot is being reverted to its original 0-value), 19900 gas is refunded.
	//        This can only happen if the slot was originally 0 and has been changed to non-zero in this transaction.
	//   1.2. If new value is 0 (slot is being cleared), 4800 gas is refunded. This can happen if the slot was originally
	//        non-zero and is being cleared in this transaction.
	// 2. If original value equals current value
	//   2.1. If original value is not 0 and new value is 0, 4800 gas is refunded. This happens when a non-zero slot is
	//        being cleared for the first time in this transaction.

	if currentVal == val { // no-op
		return SloadGas, nil
	}
	if originalVal == currentVal {
		if originalVal == (common.Hash{}) {
			return SstoreSetGas, nil
		}
		if val == (common.Hash{}) {
			evm.StateDB.AddRefund(SstoreClearsScheduleRefund)
		}
		return SstoreResetGas, nil
	}
	if originalVal != (common.Hash{}) {
		if currentVal == (common.Hash{}) { //
			evm.StateDB.SubRefund(SstoreClearsScheduleRefund)
		}
		if val == (common.Hash{}) {
			evm.StateDB.AddRefund(SstoreClearsScheduleRefund)
		}
	}
	if originalVal == val {
		if originalVal == (common.Hash{}) {
			evm.StateDB.AddRefund(SstoreSetGas - SloadGas)
		} else {
			evm.StateDB.AddRefund(SstoreResetGas - SloadGas)
		}
	}
	return SloadGas, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt for the Gas Inspector is excellent and very thorough. Here are a few minor corrections and suggestions based on the go-ethereum implementation, which might help clarify requirements and avoid common pitfalls:

1.  **Gas Calculation in `call_end`**: In the `call_end` function of your `GasInspector`, you have:
    ```zig
    var frame = self.call_stack.pop();
    frame.gas_used = frame.gas_at_start - result.gas_used;
    ```
    This implies `result.gas_used` is the *remaining gas*, not the *gas used*. The go-ethereum `callTracer` calculates consumed gas as `initial_gas - remaining_gas`. It would be clearer to rename `result.gas_used` to `result.gas_remaining` to avoid ambiguity.

2.  **`GasStats` in `gas_by_call_type`**: Your prompt suggests updating `gas_by_call_type` in `call_start` with a zero value and then updating it again in `call_end`.
    ```zig
    // In call_start
    try self.track_call_type_gas(context.call_type, 0); // Will be updated on call_end
    
    // In call_end
    try self.track_call_type_gas(context.call_type, frame.gas_used);
    ```
    This approach is slightly inefficient as it requires two hash map lookups and modifications. A more common pattern, as seen in go-ethereum's tracers, is to only update the statistics once in `call_end` when the final consumed gas is known. This avoids the placeholder entry in `call_start`.

3.  **Accuracy of `storage_write` Gas Estimation**: Your prompt includes a `storage_write` function that estimates gas costs:
    ```zig
    if (old_value == 0 and new_value != 0) {
        gas_cost = 20000; // SSTORE new slot
    } else if (old_value != 0 and new_value == 0) {
        gas_cost = 5000; // SSTORE delete (with refund)
    ...
    ```
    This is a good approximation, but the actual gas rules (especially after EIP-2200 and EIP-2929) are more complex. They depend on the **original value** at the start of the transaction, not just the previous value. The included `gasSStore` function from `core/vm/gas.go` shows the precise logic, which differentiates between `currentVal` and `originalVal` and also handles gas refunds. This logic will be crucial for an accurate gas inspector.

4.  **`get_opcode_name` Utility**: Your prompt includes a large `get_opcode_name` switch statement. This is fine, but for maintainability, it could also be implemented using a comptime-generated lookup table from an opcode enum, similar to how go-ethereum generates its opcode tables. This is more of a style suggestion.

These are minor points. The overall specification is well-defined and provides a clear path for implementation. The go-ethereum snippets above should serve as excellent references for the underlying mechanics.

