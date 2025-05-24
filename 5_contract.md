# Contract - EVM Execution Context Module

## Overview
Create a Contract structure that represents an Ethereum contract's execution context. This module manages contract code, gas accounting, storage access tracking, and JUMPDEST validation. The implementation should incorporate performance optimizations from modern EVM implementations like evmone and reth.

## Motivation
The Contract structure is central to EVM execution, holding:
- Contract bytecode and metadata
- Gas tracking and refund accounting
- Storage access patterns for EIP-2929
- JUMPDEST analysis for jump validation
- Execution context (caller, value, etc.)

Performance is critical as Contract operations are on the hot path of EVM execution. This module should incorporate optimizations from production EVMs.

## Requirements

### 1. Core Contract Structure
```zig
pub const Contract = struct {
    // Identity and context
    address: Address,
    caller: Address,
    value: u256,
    
    // Code and analysis
    code: []const u8,
    code_hash: [32]u8,
    code_size: u64, // Pre-computed for efficiency
    analysis: ?*const CodeAnalysis, // Enhanced analysis structure
    
    // Gas tracking
    gas: u64,
    gas_refund: u64,
    
    // Input/output
    input: []const u8,
    
    // Execution flags
    is_deployment: bool,
    is_system_call: bool,
    is_static: bool, // For STATICCALL context
    
    // Storage access tracking (EIP-2929)
    storage_access: ?*std.AutoHashMap(u256, bool),
    original_storage: ?*std.AutoHashMap(u256, u256),
    is_cold: bool,
    
    // Optimization fields
    has_jumpdests: bool, // Quick check to skip analysis
    is_empty: bool, // For empty contracts
};
```

### 2. Enhanced Code Analysis
```zig
/// Advanced code analysis for optimization
pub const CodeAnalysis = struct {
    /// Bit vector marking code vs data bytes
    code_segments: bitvec.BitVec,
    
    /// Sorted array of JUMPDEST positions for binary search
    jumpdest_positions: []const u32,
    
    /// Pre-computed gas costs per basic block
    block_gas_costs: ?[]const u32,
    
    /// Maximum stack depth required
    max_stack_depth: u16,
    
    /// Whether code contains certain opcodes
    has_dynamic_jumps: bool,
    has_static_jumps: bool,
    has_selfdestruct: bool,
    has_create: bool,
};
```

### 3. Contract Initialization
```zig
/// Initialize a new Contract with optimizations
pub fn init(
    caller: Address,
    address: Address, 
    value: u256,
    gas: u64,
    code: []const u8,
    code_hash: [32]u8,
    input: []const u8,
    is_static: bool,
) Contract {
    return Contract{
        .address = address,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = code_hash,
        .code_size = code.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = containsJumpdest(code),
        .is_empty = code.len == 0,
    };
}

/// Quick scan for JUMPDEST presence
fn containsJumpdest(code: []const u8) bool {
    for (code) |op| {
        if (op == JUMPDEST) return true;
    }
    return false;
}
```

### 4. Optimized JUMPDEST Validation
```zig
/// Validate jump destination with optimizations
pub fn validJumpdest(self: *Contract, dest: u256) bool {
    // Fast path: empty code or out of bounds
    if (self.is_empty or dest >= self.code_size) {
        return false;
    }
    
    // Fast path: no JUMPDESTs in code
    if (\!self.has_jumpdests) {
        return false;
    }
    
    const pos = @intCast(u32, dest);
    
    // Fast path: not a JUMPDEST opcode
    if (self.code[pos] \!= JUMPDEST) {
        return false;
    }
    
    // Ensure analysis is performed
    self.ensureAnalysis();
    
    // Binary search in sorted JUMPDEST positions
    if (self.analysis) |analysis| {
        if (analysis.jumpdest_positions.len > 0) {
            const found = std.sort.binarySearch(
                u32, 
                analysis.jumpdest_positions, 
                pos, 
                {}, 
                std.sort.asc(u32)
            );
            return found \!= null;
        }
    }
    
    // Fallback to bitvec check
    return self.isCode(pos);
}

/// Ensure code analysis is performed
fn ensureAnalysis(self: *Contract) void {
    if (self.analysis == null and \!self.is_empty) {
        self.analysis = analyzeCode(self.code, self.code_hash);
    }
}

/// Check if position is code (not data)
pub inline fn isCode(self: *const Contract, pos: u64) bool {
    if (self.analysis) |analysis| {
        return analysis.code_segments.codeSegment(pos);
    }
    return true; // Assume code if not analyzed
}
```

### 5. Optimized Gas Operations
```zig
/// Use gas with inline optimization
pub inline fn useGas(self: *Contract, amount: u64) bool {
    if (self.gas < amount) {
        return false;
    }
    self.gas -= amount;
    return true;
}

/// Use gas without checking (when known safe)
pub inline fn useGasUnchecked(self: *Contract, amount: u64) void {
    self.gas -= amount;
}

/// Refund gas to contract
pub inline fn refundGas(self: *Contract, amount: u64) void {
    self.gas += amount;
}

/// Add to gas refund counter with clamping
pub inline fn addGasRefund(self: *Contract, amount: u64) void {
    self.gas_refund = @min(self.gas_refund + amount, MAX_REFUND);
}

/// Subtract from gas refund counter with clamping
pub inline fn subGasRefund(self: *Contract, amount: u64) void {
    self.gas_refund = self.gas_refund.saturatingSub(amount);
}
```

### 6. Storage Access Tracking (EIP-2929)
```zig
/// Storage pool for reducing allocations
pub const StoragePool = struct {
    access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
    storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
    allocator: std.mem.Allocator,
    
    pub fn borrowAccessMap(self: *StoragePool) \!*std.AutoHashMap(u256, bool) {
        if (self.access_maps.items.len > 0) {
            return self.access_maps.pop();
        }
        const map = try self.allocator.create(std.AutoHashMap(u256, bool));
        map.* = std.AutoHashMap(u256, bool).init(self.allocator);
        return map;
    }
    
    pub fn returnAccessMap(self: *StoragePool, map: *std.AutoHashMap(u256, bool)) void {
        map.clearRetainingCapacity();
        self.access_maps.append(map) catch {};
    }
};

/// Mark storage slot as warm with pool support
pub fn markStorageSlotWarm(self: *Contract, slot: u256, pool: ?*StoragePool) \!bool {
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = try p.borrowAccessMap();
        } else {
            self.storage_access = try std.heap.page_allocator.create(std.AutoHashMap(u256, bool));
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(std.heap.page_allocator);
        }
    }
    
    const map = self.storage_access.?;
    const was_cold = \!map.contains(slot);
    if (was_cold) {
        try map.put(slot, true);
    }
    return was_cold;
}

/// Batch mark storage slots as warm
pub fn markStorageSlotsWarm(self: *Contract, slots: []const u256, pool: ?*StoragePool) \!void {
    if (slots.len == 0) return;
    
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = try p.borrowAccessMap();
        } else {
            self.storage_access = try std.heap.page_allocator.create(std.AutoHashMap(u256, bool));
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(std.heap.page_allocator);
        }
    }
    
    const map = self.storage_access.?;
    try map.ensureTotalCapacity(map.count() + slots.len);
    
    for (slots) |slot| {
        map.putAssumeCapacity(slot, true);
    }
}
```

### 7. Code Analysis Implementation
```zig
/// Analyze code and cache results
fn analyzeCode(code: []const u8, code_hash: [32]u8) ?*const CodeAnalysis {
    // This would typically check a global cache first
    // For now, perform analysis
    
    var allocator = std.heap.page_allocator;
    var analysis = allocator.create(CodeAnalysis) catch return null;
    
    // Analyze code segments
    analysis.code_segments = bitvec.codeBitmap(code);
    
    // Find and sort JUMPDEST positions
    var jumpdests = std.ArrayList(u32).init(allocator);
    defer jumpdests.deinit();
    
    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];
        
        if (op == JUMPDEST and analysis.code_segments.codeSegment(i)) {
            jumpdests.append(@intCast(u32, i)) catch {};
        }
        
        // Skip PUSH data
        if (isPush(op)) {
            i += getPushSize(op) + 1;
        } else {
            i += 1;
        }
    }
    
    // Sort for binary search
    std.sort.sort(u32, jumpdests.items, {}, std.sort.asc(u32));
    analysis.jumpdest_positions = jumpdests.toOwnedSlice() catch &.{};
    
    // Analyze other properties
    analysis.max_stack_depth = 0; // TODO: Implement
    analysis.block_gas_costs = null; // TODO: Implement
    analysis.has_dynamic_jumps = containsOp(code, &.{JUMP, JUMPI});
    analysis.has_static_jumps = false; // TODO: Detect PC pushes
    analysis.has_selfdestruct = containsOp(code, &.{SELFDESTRUCT});
    analysis.has_create = containsOp(code, &.{CREATE, CREATE2});
    
    return analysis;
}

/// Check if code contains any of the given opcodes
fn containsOp(code: []const u8, opcodes: []const u8) bool {
    for (code) |op| {
        for (opcodes) |target| {
            if (op == target) return true;
        }
    }
    return false;
}
```

### 8. Inline Accessor Methods
```zig
/// Get opcode at position (inline for performance)
pub inline fn getOp(self: *const Contract, n: u64) u8 {
    return if (n < self.code_size) self.code[n] else STOP;
}

/// Get caller address
pub inline fn getCaller(self: *const Contract) Address {
    return self.caller;
}

/// Get contract address
pub inline fn getAddress(self: *const Contract) Address {
    return self.address;
}

/// Get call value
pub inline fn getValue(self: *const Contract) u256 {
    return self.value;
}

/// Check if in static context
pub inline fn isStatic(self: *const Contract) bool {
    return self.is_static;
}

/// Get remaining gas
pub inline fn getGas(self: *const Contract) u64 {
    return self.gas;
}

/// Get gas refund
pub inline fn getGasRefund(self: *const Contract) u64 {
    return self.gas_refund;
}
```

### 9. Memory Management
```zig
/// Clean up contract resources
pub fn deinit(self: *Contract, pool: ?*StoragePool) void {
    // Return maps to pool if available
    if (pool) |p| {
        if (self.storage_access) |map| {
            p.returnAccessMap(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            p.returnStorageMap(map);
            self.original_storage = null;
        }
    } else {
        // Direct cleanup
        if (self.storage_access) |map| {
            map.deinit();
            std.heap.page_allocator.destroy(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            map.deinit();
            std.heap.page_allocator.destroy(map);
            self.original_storage = null;
        }
    }
    
    // Analysis is typically cached globally, so don't free
}
```

## Performance Optimizations

1. **Pre-computed Values**: Store code_size, has_jumpdests, is_empty for fast checks
2. **Binary Search**: Use sorted JUMPDEST array for O(log n) validation
3. **Inline Functions**: Mark hot-path functions as inline
4. **Storage Pooling**: Reuse hash maps to reduce allocations
5. **Lazy Analysis**: Only analyze code when needed
6. **Fast Paths**: Early returns for common cases (empty code, no jumpdests)
7. **Batch Operations**: Support bulk storage slot warming

## Testing Requirements

1. **Basic Operations**:
   - Contract initialization with various parameters
   - Gas usage and refund operations
   - Opcode access and bounds checking

2. **JUMPDEST Validation**:
   - Valid and invalid jump destinations
   - JUMPDEST in PUSH data
   - Binary search correctness
   - Edge cases (empty code, no jumpdests)

3. **Storage Tracking**:
   - Cold/warm slot transitions
   - Original value tracking
   - Batch operations
   - Memory pool usage

4. **Performance Tests**:
   - Benchmark JUMPDEST validation
   - Measure storage access overhead
   - Profile memory allocations

## Integration Notes

1. **Global Analysis Cache**: Consider implementing a global cache for code analysis keyed by code hash
2. **Storage Pool**: Create a per-VM storage pool to share across contracts
3. **Static Context**: Propagate static context to child calls
4. **Gas Metering**: Integrate with opcode gas calculations

## References

- [Go-Ethereum contract.go](https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go)
- [Reth/revm interpreter](https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/contract.rs)
- [Evmone execution_state.hpp](https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp)
- [EIP-2929 Gas cost increases](https://eips.ethereum.org/EIPS/eip-2929)
EOF < /dev/null