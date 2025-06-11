# Implement Prague Hardfork Support

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_prague_hardfork_support` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_prague_hardfork_support feat_implement_prague_hardfork_support`
3. **Work in isolation**: `cd g/feat_implement_prague_hardfork_support`
4. **Commit message**: `✨ feat: implement Prague hardfork support for upcoming Ethereum upgrade`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement support for the upcoming Prague hardfork, which is planned to include EOF (EVM Object Format), Verkle Trees, and other significant improvements to the Ethereum protocol. This implementation should prepare the EVM for these future changes while maintaining backward compatibility.

<eli5>
Think of hardforks like major software updates for Ethereum. The Prague hardfork is like upgrading from Windows 10 to Windows 11 - it brings new features and improvements, but everything has to work together seamlessly. This hardfork includes new ways to store and verify data (Verkle Trees) and a better format for smart contracts (EOF), making Ethereum faster and more efficient while keeping all existing features working.
</eli5>

## Prague Hardfork Features

### Core Features (Planned)

#### 1. EOF (EVM Object Format) - Complete Implementation
- Already covered in separate EOF implementation issue
- Container format with structured bytecode
- Static analysis and validation
- New function call mechanisms

#### 2. Verkle Trees Integration
```zig
pub const VerkleTree = struct {
    root: VerkleNode,
    depth: u8,
    
    pub fn init(allocator: std.mem.Allocator) VerkleTree {
        return VerkleTree{
            .root = VerkleNode.init(allocator),
            .depth = 0,
        };
    }
    
    pub fn get_witness(self: *const VerkleTree, key: []const u8) !VerkleWitness {
        // Generate Verkle witness for state access
        return self.root.generate_witness(key);
    }
    
    pub fn verify_witness(witness: *const VerkleWitness, key: []const u8, value: []const u8) bool {
        // Verify Verkle witness
        return witness.verify(key, value);
    }
};
```

#### 3. Account Abstraction Preparation
```zig
pub const AccountAbstractionSupport = struct {
    pub fn validate_user_operation(op: *const UserOperation) bool {
        // Validate user operation structure
        // Check gas limits, signatures, etc.
        return true; // Placeholder
    }
    
    pub fn execute_user_operation(vm: *Vm, op: *const UserOperation) !ExecutionResult {
        // Execute user operation with AA semantics
        return ExecutionResult.halt; // Placeholder
    }
};
```

#### 4. Improved Gas Model
```zig
pub const PragueGasModel = struct {
    pub fn calculate_verkle_access_cost(witness_size: usize) u64 {
        // New gas costs for Verkle tree access
        return @as(u64, witness_size) * 2; // Placeholder formula
    }
    
    pub fn calculate_code_chunk_access_cost(chunk_count: u32) u64 {
        // Gas cost for accessing code chunks in Verkle trees
        return chunk_count * 22; // Placeholder
    }
};
```

### Transaction Types

#### 1. Set Code Transaction (EIP-7702)
Already covered in separate EIP-7702 implementation, but integrated here:
```zig
pub const PragueTransactionType = enum(u8) {
    Legacy = 0x00,
    AccessList = 0x01,
    DynamicFee = 0x02,
    BlobTransaction = 0x03,
    SetCodeTransaction = 0x04,
    // Future transaction types for Prague
    UserOperation = 0x05,  // Account abstraction
    _,
};
```

#### 2. Verkle Witness Transactions
```zig
pub const VerkleWitnessTransaction = struct {
    // Standard transaction fields
    chain_id: u64,
    nonce: u64,
    max_priority_fee_per_gas: U256,
    max_fee_per_gas: U256,
    gas_limit: u64,
    to: ?Address,
    value: U256,
    data: []const u8,
    access_list: AccessList,
    
    // Verkle-specific fields
    state_access_list: StateAccessList,
    verkle_witnesses: []const VerkleWitness,
    
    pub fn validate_witnesses(self: *const VerkleWitnessTransaction) bool {
        // Validate that provided witnesses cover all state accesses
        for (self.state_access_list.items) |access| {
            if (!self.has_witness_for_access(access)) {
                return false;
            }
        }
        return true;
    }
};
```

### Opcodes and Precompiles

#### 1. New Opcodes for Prague
```zig
// Prague-specific opcodes (tentative)
pub const VERKLE_VERIFY = 0x49;     // Verify Verkle witness
pub const CODE_COPY_VERKLE = 0x4A;  // Copy code using Verkle witnesses
pub const ACCOUNT_CODE = 0x4B;      // Get account code hash
pub const ACCOUNT_SIZE = 0x4C;      // Get account code size

pub fn execute_verkle_verify(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Get witness from stack
    const witness_offset = frame.stack.pop_unsafe();
    const witness_size = frame.stack.pop_unsafe();
    const key_offset = frame.stack.pop_unsafe();
    const key_size = frame.stack.pop_unsafe();
    
    // Extract witness and key from memory
    const witness_data = try frame.memory.get_slice(witness_offset, witness_size);
    const key_data = try frame.memory.get_slice(key_offset, key_size);
    
    // Parse and verify witness
    const witness = VerkleWitness.parse(witness_data) catch {
        frame.stack.push_unsafe(0); // Invalid witness
        return ExecutionResult.continue_execution;
    };
    
    const is_valid = witness.verify(key_data, &[_]u8{}); // Value verification depends on context
    frame.stack.push_unsafe(if (is_valid) 1 else 0);
    
    return ExecutionResult.continue_execution;
}
```

#### 2. Enhanced Precompiles
```zig
// Enhanced precompiles for Prague
pub const VERKLE_BATCH_VERIFY_ADDRESS = 0x12; // Batch Verkle verification
pub const ACCOUNT_ABSTRACTION_ADDRESS = 0x13; // Account abstraction helpers

pub fn execute_verkle_batch_verify(
    input: []const u8,
    output: []u8,
    gas_limit: u64
) PrecompileError!PrecompileResult {
    // Parse batch verification input
    const batch = VerkleWitnessBatch.parse(input) catch {
        return PrecompileError.InvalidInput;
    };
    
    // Calculate gas cost based on batch size
    const gas_cost = batch.witnesses.len * 100;
    if (gas_cost > gas_limit) {
        return PrecompileError.OutOfGas;
    }
    
    // Verify all witnesses in batch
    const all_valid = batch.verify_all();
    
    if (output.len >= 32) {
        // Return verification result
        const result = if (all_valid) U256.from_u64(1) else U256.from_u64(0);
        const result_bytes = result.to_be_bytes();
        @memcpy(output[0..32], &result_bytes);
        
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
    }
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
}
```

## Implementation Requirements

### Core Functionality
1. **Hardfork Detection**: Detect Prague hardfork activation
2. **Verkle Tree Support**: Basic Verkle tree operations and witness verification
3. **Enhanced Gas Model**: New gas calculations for Prague features
4. **Transaction Support**: Support for new transaction types
5. **Opcode Implementation**: New opcodes and modified behavior
6. **Backward Compatibility**: Maintain compatibility with previous hardforks

### Prague Hardfork Configuration
```zig
pub const PragueConfig = struct {
    verkle_tree_enabled: bool,
    eof_enabled: bool,
    account_abstraction_enabled: bool,
    enhanced_gas_model_enabled: bool,
    
    pub fn from_hardfork(hardfork: Hardfork) PragueConfig {
        return switch (hardfork) {
            .Prague => PragueConfig{
                .verkle_tree_enabled = true,
                .eof_enabled = true,
                .account_abstraction_enabled = true,
                .enhanced_gas_model_enabled = true,
            },
            else => PragueConfig{
                .verkle_tree_enabled = false,
                .eof_enabled = false,
                .account_abstraction_enabled = false,
                .enhanced_gas_model_enabled = false,
            },
        };
    }
    
    pub fn get_gas_model(self: *const PragueConfig) GasModel {
        if (self.enhanced_gas_model_enabled) {
            return GasModel.Prague;
        }
        return GasModel.Legacy;
    }
};
```

## Implementation Tasks

### Task 1: Add Prague Hardfork Configuration
File: `/src/evm/hardforks/hardfork.zig` (modify existing)
```zig
pub const Hardfork = enum {
    // Existing hardforks...
    Cancun,
    Prague,      // Add Prague hardfork
    
    pub fn from_block_number(block_number: u64) Hardfork {
        // Prague activation block (to be determined)
        if (block_number >= PRAGUE_BLOCK) return .Prague;
        if (block_number >= CANCUN_BLOCK) return .Cancun;
        // ... existing logic
    }
    
    pub fn supports_verkle_trees(self: Hardfork) bool {
        return switch (self) {
            .Prague => true,
            else => false,
        };
    }
    
    pub fn supports_eof(self: Hardfork) bool {
        return switch (self) {
            .Prague => true,
            else => false,
        };
    }
    
    pub fn supports_account_abstraction(self: Hardfork) bool {
        return switch (self) {
            .Prague => true,
            else => false,
        };
    }
};

// Prague hardfork activation block (placeholder)
const PRAGUE_BLOCK: u64 = 20000000; // To be updated with actual activation block
```

### Task 2: Implement Verkle Tree Support
File: `/src/evm/prague/verkle.zig`
```zig
const std = @import("std");
const U256 = @import("../Types/U256.ts").U256;

pub const VERKLE_WIDTH = 256; // Verkle tree width
pub const VERKLE_DEPTH = 32;  // Maximum depth

pub const VerkleNode = struct {
    commitment: VerkleCommitment,
    children: ?[]VerkleNode,
    values: ?[]VerkleValue,
    is_leaf: bool,
    
    pub fn init(allocator: std.mem.Allocator, is_leaf: bool) !VerkleNode {
        return VerkleNode{
            .commitment = VerkleCommitment.empty(),
            .children = if (is_leaf) null else try allocator.alloc(VerkleNode, VERKLE_WIDTH),
            .values = if (is_leaf) try allocator.alloc(VerkleValue, VERKLE_WIDTH) else null,
            .is_leaf = is_leaf,
        };
    }
    
    pub fn deinit(self: *VerkleNode, allocator: std.mem.Allocator) void {
        if (self.children) |children| {
            for (children) |*child| {
                child.deinit(allocator);
            }
            allocator.free(children);
        }
        
        if (self.values) |values| {
            allocator.free(values);
        }
    }
    
    pub fn get(self: *const VerkleNode, key: []const u8) ?VerkleValue {
        if (key.len == 0) return null;
        
        if (self.is_leaf) {
            // Leaf node - return value if present
            const index = key[key.len - 1];
            if (self.values) |values| {
                if (index < values.len) {
                    return values[index];
                }
            }
            return null;
        } else {
            // Internal node - recurse to child
            const index = key[0];
            if (self.children) |children| {
                if (index < children.len) {
                    return children[index].get(key[1..]);
                }
            }
            return null;
        }
    }
    
    pub fn set(self: *VerkleNode, key: []const u8, value: VerkleValue, allocator: std.mem.Allocator) !void {
        if (key.len == 0) return;
        
        if (self.is_leaf) {
            // Leaf node - set value
            const index = key[key.len - 1];
            if (self.values) |values| {
                if (index < values.len) {
                    values[index] = value;
                    try self.update_commitment();
                }
            }
        } else {
            // Internal node - recurse to child
            const index = key[0];
            if (self.children) |children| {
                if (index < children.len) {
                    try children[index].set(key[1..], value, allocator);
                    try self.update_commitment();
                }
            }
        }
    }
    
    pub fn generate_witness(self: *const VerkleNode, key: []const u8) !VerkleWitness {
        // Generate a witness for accessing the given key
        var path = std.ArrayList(VerkleCommitment).init(allocator);
        defer path.deinit();
        
        var current = self;
        var remaining_key = key;
        
        while (!current.is_leaf and remaining_key.len > 0) {
            try path.append(current.commitment);
            
            const index = remaining_key[0];
            if (current.children) |children| {
                if (index < children.len) {
                    current = &children[index];
                    remaining_key = remaining_key[1..];
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        
        // Add leaf commitment
        try path.append(current.commitment);
        
        return VerkleWitness{
            .path = try path.toOwnedSlice(),
            .key = key,
            .value = current.get(remaining_key) orelse VerkleValue.empty(),
        };
    }
    
    fn update_commitment(self: *VerkleNode) !void {
        // Update node commitment based on children/values
        // This is a placeholder - real implementation would use polynomial commitments
        var hasher = std.crypto.hash.sha2.Sha256.init(.{});
        
        if (self.is_leaf) {
            if (self.values) |values| {
                for (values) |value| {
                    hasher.update(&value.data);
                }
            }
        } else {
            if (self.children) |children| {
                for (children) |child| {
                    hasher.update(&child.commitment.data);
                }
            }
        }
        
        self.commitment.data = hasher.finalResult();
    }
};

pub const VerkleCommitment = struct {
    data: [32]u8,
    
    pub fn empty() VerkleCommitment {
        return VerkleCommitment{ .data = [_]u8{0} ** 32 };
    }
    
    pub fn from_bytes(bytes: []const u8) VerkleCommitment {
        var commitment = VerkleCommitment.empty();
        @memcpy(&commitment.data, bytes[0..@min(32, bytes.len)]);
        return commitment;
    }
};

pub const VerkleValue = struct {
    data: [32]u8,
    
    pub fn empty() VerkleValue {
        return VerkleValue{ .data = [_]u8{0} ** 32 };
    }
    
    pub fn from_bytes(bytes: []const u8) VerkleValue {
        var value = VerkleValue.empty();
        @memcpy(&value.data, bytes[0..@min(32, bytes.len)]);
        return value;
    }
    
    pub fn from_u256(val: U256) VerkleValue {
        return VerkleValue{ .data = val.to_be_bytes() };
    }
};

pub const VerkleWitness = struct {
    path: []VerkleCommitment,
    key: []const u8,
    value: VerkleValue,
    allocator: std.mem.Allocator,
    
    pub fn deinit(self: *VerkleWitness) void {
        self.allocator.free(self.path);
    }
    
    pub fn verify(self: *const VerkleWitness, expected_key: []const u8, expected_value: VerkleValue) bool {
        // Verify that the witness is valid for the given key/value
        // This is a placeholder implementation
        
        // Check key matches
        if (!std.mem.eql(u8, self.key, expected_key)) {
            return false;
        }
        
        // Check value matches
        if (!std.mem.eql(u8, &self.value.data, &expected_value.data)) {
            return false;
        }
        
        // Verify commitment path (simplified)
        return self.path.len > 0; // Placeholder
    }
    
    pub fn parse(data: []const u8) !VerkleWitness {
        // Parse witness from binary data
        if (data.len < 64) { // Minimum size check
            return error.InvalidWitnessData;
        }
        
        // This is a placeholder implementation
        return VerkleWitness{
            .path = &[_]VerkleCommitment{},
            .key = &[_]u8{},
            .value = VerkleValue.empty(),
            .allocator = std.heap.page_allocator, // Placeholder
        };
    }
};

pub const VerkleWitnessBatch = struct {
    witnesses: []VerkleWitness,
    
    pub fn verify_all(self: *const VerkleWitnessBatch) bool {
        for (self.witnesses) |*witness| {
            if (!witness.verify(witness.key, witness.value)) {
                return false;
            }
        }
        return true;
    }
    
    pub fn parse(data: []const u8) !VerkleWitnessBatch {
        // Parse batch of witnesses from binary data
        _ = data;
        return VerkleWitnessBatch{
            .witnesses = &[_]VerkleWitness{},
        };
    }
};
```

### Task 3: Implement Prague Gas Model
File: `/src/evm/prague/gas_model.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");

pub const PragueGasConstants = struct {
    // Verkle tree access costs
    pub const VERKLE_WITNESS_VERIFY_COST: u64 = 100;
    pub const VERKLE_BATCH_VERIFY_BASE_COST: u64 = 200;
    pub const VERKLE_BATCH_VERIFY_PER_WITNESS: u64 = 50;
    
    // Code access in Verkle trees
    pub const CODE_CHUNK_ACCESS_COST: u64 = 22;
    pub const CODE_CHUNK_SIZE: u32 = 32;
    
    // Account abstraction costs
    pub const USER_OPERATION_VALIDATION_COST: u64 = 21000;
    pub const PAYMASTER_VALIDATION_COST: u64 = 10000;
};

pub const PragueGasCalculator = struct {
    pub fn calculate_verkle_access_cost(witness_count: u32, witness_size: u32) u64 {
        const base_cost = PragueGasConstants.VERKLE_WITNESS_VERIFY_COST;
        const size_cost = witness_size / 32; // Per word
        return base_cost + size_cost * witness_count;
    }
    
    pub fn calculate_code_access_cost(code_size: u32) u64 {
        const chunks = (code_size + PragueGasConstants.CODE_CHUNK_SIZE - 1) / PragueGasConstants.CODE_CHUNK_SIZE;
        return chunks * PragueGasConstants.CODE_CHUNK_ACCESS_COST;
    }
    
    pub fn calculate_batch_verification_cost(witness_count: u32) u64 {
        return PragueGasConstants.VERKLE_BATCH_VERIFY_BASE_COST + 
               witness_count * PragueGasConstants.VERKLE_BATCH_VERIFY_PER_WITNESS;
    }
    
    pub fn calculate_user_operation_cost(op: *const UserOperation) u64 {
        var total_cost = PragueGasConstants.USER_OPERATION_VALIDATION_COST;
        
        // Add paymaster validation cost if present
        if (op.paymaster_and_data.len > 0) {
            total_cost += PragueGasConstants.PAYMASTER_VALIDATION_COST;
        }
        
        // Add data cost
        total_cost += calculate_calldata_cost(op.call_data);
        
        return total_cost;
    }
    
    fn calculate_calldata_cost(data: []const u8) u64 {
        var cost: u64 = 0;
        for (data) |byte| {
            if (byte == 0) {
                cost += 4;
            } else {
                cost += 16;
            }
        }
        return cost;
    }
};

// Account abstraction user operation structure
pub const UserOperation = struct {
    sender: Address,
    nonce: U256,
    init_code: []const u8,
    call_data: []const u8,
    call_gas_limit: U256,
    verification_gas_limit: U256,
    pre_verification_gas: U256,
    max_fee_per_gas: U256,
    max_priority_fee_per_gas: U256,
    paymaster_and_data: []const u8,
    signature: []const u8,
    
    pub fn hash(self: *const UserOperation) [32]u8 {
        // Calculate user operation hash for signature verification
        const Keccak256 = std.crypto.hash.sha3.Keccak256;
        var hasher = Keccak256.init(.{});
        
        // Hash all fields (simplified)
        hasher.update(&self.sender.bytes);
        hasher.update(&self.nonce.to_be_bytes());
        hasher.update(self.init_code);
        hasher.update(self.call_data);
        // ... hash other fields
        
        return hasher.finalResult();
    }
};
```

### Task 4: Implement Prague Opcodes
File: `/src/evm/prague/opcodes.zig`
```zig
const std = @import("std");
const Vm = @import("../vm.zig").Vm;
const Frame = @import("../frame.zig").Frame;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const ExecutionError = @import("../execution/execution_error.zig").ExecutionError;
const VerkleWitness = @import("verkle.zig").VerkleWitness;

// Prague-specific opcodes (tentative - actual opcodes TBD)
pub const VERKLE_VERIFY = 0x49;
pub const CODE_COPY_VERKLE = 0x4A;
pub const ACCOUNT_CODE = 0x4B;
pub const ACCOUNT_SIZE = 0x4C;

pub fn execute_verkle_verify(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    // Pop witness parameters from stack
    const witness_offset = frame.stack.pop_unsafe();
    const witness_size = frame.stack.pop_unsafe();
    const key_offset = frame.stack.pop_unsafe();
    const key_size = frame.stack.pop_unsafe();
    const value_offset = frame.stack.pop_unsafe();
    const value_size = frame.stack.pop_unsafe();
    
    // Calculate gas cost
    const gas_cost = PragueGasCalculator.calculate_verkle_access_cost(1, @as(u32, @intCast(witness_size)));
    if (frame.gas_remaining < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    
    frame.gas_remaining -= gas_cost;
    
    // Extract data from memory
    const witness_data = try frame.memory.get_slice(witness_offset, witness_size);
    const key_data = try frame.memory.get_slice(key_offset, key_size);
    const value_data = try frame.memory.get_slice(value_offset, value_size);
    
    // Parse and verify witness
    const witness = VerkleWitness.parse(witness_data) catch {
        frame.stack.push_unsafe(0); // Invalid witness
        return ExecutionResult.continue_execution;
    };
    defer witness.deinit();
    
    const expected_value = VerkleValue.from_bytes(value_data);
    const is_valid = witness.verify(key_data, expected_value);
    
    frame.stack.push_unsafe(if (is_valid) 1 else 0);
    return ExecutionResult.continue_execution;
}

pub fn execute_code_copy_verkle(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    // Enhanced CODECOPY that works with Verkle-backed code storage
    const dest_offset = frame.stack.pop_unsafe();
    const code_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();
    
    // Calculate gas cost including Verkle access
    const code_access_cost = PragueGasCalculator.calculate_code_access_cost(@as(u32, @intCast(size)));
    const memory_cost = try frame.calculate_memory_expansion_gas(dest_offset, size);
    const total_cost = code_access_cost + memory_cost;
    
    if (frame.gas_remaining < total_cost) {
        return ExecutionError.OutOfGas;
    }
    
    frame.gas_remaining -= total_cost;
    
    // Expand memory
    try frame.memory.expand(@as(u32, @intCast(dest_offset + size)));
    
    // Copy code (in Prague, this would involve Verkle tree access)
    const code = frame.context.code;
    const copy_size = @min(size, code.len - @min(code_offset, code.len));
    
    if (copy_size > 0) {
        const src_start = @min(code_offset, code.len);
        const src_end = @min(src_start + copy_size, code.len);
        
        for (0..copy_size) |i| {
            const src_index = src_start + i;
            const byte_value = if (src_index < src_end) code[src_index] else 0;
            frame.memory.store_byte(dest_offset + i, byte_value);
        }
    }
    
    return ExecutionResult.continue_execution;
}

pub fn execute_account_code(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    const address_u256 = frame.stack.pop_unsafe();
    const address = Address.from_u256(address_u256);
    
    // Get account code hash
    const code_hash = vm.state.get_code_hash(address);
    frame.stack.push_unsafe(U256.from_be_bytes(&code_hash.bytes));
    
    return ExecutionResult.continue_execution;
}

pub fn execute_account_size(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    const address_u256 = frame.stack.pop_unsafe();
    const address = Address.from_u256(address_u256);
    
    // Get account code size
    const code = vm.state.get_code(address);
    frame.stack.push_unsafe(code.len);
    
    return ExecutionResult.continue_execution;
}
```

### Task 5: Update VM with Prague Support
File: `/src/evm/vm.zig` (modify existing)
```zig
const PragueConfig = @import("prague/config.zig").PragueConfig;
const PragueGasCalculator = @import("prague/gas_model.zig").PragueGasCalculator;

pub const Vm = struct {
    // Existing fields...
    prague_config: ?PragueConfig,
    
    pub fn init(allocator: std.mem.Allocator, hardfork: Hardfork) !Vm {
        var vm = Vm{
            // Existing initialization...
            .prague_config = null,
        };
        
        // Initialize Prague configuration if needed
        if (hardfork == .Prague) {
            vm.prague_config = PragueConfig.init();
        }
        
        return vm;
    }
    
    pub fn execute_instruction_with_prague_support(
        self: *Vm,
        frame: *Frame,
        opcode: u8
    ) !ExecutionResult {
        // Check for Prague-specific opcodes
        if (self.prague_config != null) {
            const result = switch (opcode) {
                prague_opcodes.VERKLE_VERIFY => prague_opcodes.execute_verkle_verify(self, frame),
                prague_opcodes.CODE_COPY_VERKLE => prague_opcodes.execute_code_copy_verkle(self, frame),
                prague_opcodes.ACCOUNT_CODE => prague_opcodes.execute_account_code(self, frame),
                prague_opcodes.ACCOUNT_SIZE => prague_opcodes.execute_account_size(self, frame),
                else => null,
            };
            
            if (result) |r| return r;
        }
        
        // Fall back to standard execution
        return self.execute_instruction_standard(frame, opcode);
    }
    
    pub fn calculate_prague_gas_overhead(self: *Vm, tx: *const Transaction) u64 {
        if (self.prague_config) |*config| {
            if (config.verkle_tree_enabled) {
                // Additional gas for Verkle tree operations
                return 1000; // Placeholder
            }
        }
        return 0;
    }
    
    pub fn supports_user_operations(self: *const Vm) bool {
        if (self.prague_config) |*config| {
            return config.account_abstraction_enabled;
        }
        return false;
    }
};
```

### Task 6: Update Hardfork Rules
File: `/src/evm/hardforks/chain_rules.zig` (modify existing)
```zig
pub fn get_prague_rules(hardfork: Hardfork) PragueRules {
    return switch (hardfork) {
        .Prague => PragueRules{
            .verkle_trees_enabled = true,
            .eof_enabled = true,
            .account_abstraction_enabled = true,
            .enhanced_gas_model = true,
            .new_opcodes_enabled = true,
        },
        else => PragueRules{
            .verkle_trees_enabled = false,
            .eof_enabled = false,
            .account_abstraction_enabled = false,
            .enhanced_gas_model = false,
            .new_opcodes_enabled = false,
        },
    };
}

pub const PragueRules = struct {
    verkle_trees_enabled: bool,
    eof_enabled: bool,
    account_abstraction_enabled: bool,
    enhanced_gas_model: bool,
    new_opcodes_enabled: bool,
    
    pub fn validate_transaction(self: *const PragueRules, tx: *const Transaction) bool {
        // Prague-specific transaction validation
        if (self.account_abstraction_enabled) {
            // Allow user operations
            if (tx.tx_type == @intFromEnum(PragueTransactionType.UserOperation)) {
                return true;
            }
        }
        
        // Standard validation for other transaction types
        return true;
    }
    
    pub fn get_opcode_availability(self: *const PragueRules, opcode: u8) bool {
        if (!self.new_opcodes_enabled) {
            // Disable Prague-specific opcodes
            return switch (opcode) {
                0x49...0x4C => false, // Prague opcodes
                else => true,
            };
        }
        return true;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/prague/prague_test.zig`

### Test Cases
```zig
test "prague hardfork detection" {
    // Test Prague hardfork activation
    // Test configuration initialization
}

test "verkle tree operations" {
    // Test Verkle tree basic operations
    // Test witness generation and verification
    // Test batch verification
}

test "prague opcodes" {
    // Test VERKLE_VERIFY opcode
    // Test CODE_COPY_VERKLE opcode
    // Test ACCOUNT_CODE and ACCOUNT_SIZE opcodes
}

test "prague gas model" {
    // Test enhanced gas calculations
    // Test Verkle access costs
    // Test user operation costs
}

test "account abstraction support" {
    // Test user operation validation
    // Test paymaster functionality
    // Test signature verification
}

test "backward compatibility" {
    // Test that Prague features don't break existing functionality
    // Test hardfork transition behavior
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/hardforks/hardfork.zig` - Add Prague hardfork
- `/src/evm/prague/verkle.zig` - Verkle tree implementation
- `/src/evm/prague/gas_model.zig` - Prague gas model
- `/src/evm/prague/opcodes.zig` - Prague-specific opcodes
- `/src/evm/prague/config.zig` - Prague configuration
- `/src/evm/vm.zig` - Update VM with Prague support
- `/src/evm/hardforks/chain_rules.zig` - Prague validation rules
- `/test/evm/prague/prague_test.zig` - Comprehensive tests

## Success Criteria

1. **Hardfork Support**: Proper Prague hardfork detection and configuration
2. **Verkle Integration**: Basic Verkle tree operations and witness verification
3. **New Opcodes**: Working implementation of Prague-specific opcodes
4. **Gas Model**: Enhanced gas calculations for Prague features
5. **Account Abstraction**: Basic support for user operations
6. **Backward Compatibility**: Maintains compatibility with previous hardforks

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Future-proof design** - Prague features are still in development
3. **Maintain compatibility** - Don't break existing functionality
4. **Placeholder implementations** - Some features may need placeholders
5. **Test thoroughly** - Verify hardfork transition behavior
6. **Monitor specifications** - Prague features may change before activation

## References

- [Prague Hardfork Meta EIP](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7600.md)
- [Verkle Trees Documentation](https://verkle.info/)
- [Account Abstraction ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)
- [EOF Specification](https://github.com/ethereum/EIPs/tree/master/EIPS) - Various EOF EIPs
- [Ethereum Research Forums](https://ethresear.ch/) - Latest Prague discussions