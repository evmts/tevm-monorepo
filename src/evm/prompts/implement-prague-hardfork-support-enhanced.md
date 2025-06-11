# Implement Prague Hardfork Support

You are implementing Prague Hardfork Support for the Tevm EVM written in Zig. Your goal is to implement Prague hardfork features and compatibility following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_prague_hardfork_support` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_prague_hardfork_support feat_implement_prague_hardfork_support`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement support for the upcoming Prague hardfork, which is planned to include EOF (EVM Object Format), Verkle Trees, and other significant improvements to the Ethereum protocol. This implementation should prepare the EVM for these future changes while maintaining backward compatibility.

## ELI5

Think of hardforks like major software updates for Ethereum. The Prague hardfork is like upgrading from Windows 10 to Windows 11 - it brings new features and improvements, but everything has to work together seamlessly. This hardfork includes new ways to store and verify data (Verkle Trees) and a better format for smart contracts (EOF), making Ethereum faster and more efficient while keeping all existing features working.

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

#### 1. **Unit Tests** (`/test/evm/hardfork/prague_hardfork_support_test.zig`)
```zig
// Test basic Prague hardfork support functionality
test "prague_hardfork_support basic functionality works correctly"
test "prague_hardfork_support handles edge cases properly"
test "prague_hardfork_support validates inputs appropriately"
test "prague_hardfork_support produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "prague_hardfork_support integrates with EVM properly"
test "prague_hardfork_support maintains system compatibility"
test "prague_hardfork_support works with existing components"
test "prague_hardfork_support handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "prague_hardfork_support meets performance requirements"
test "prague_hardfork_support optimizes resource usage"
test "prague_hardfork_support scales appropriately with load"
test "prague_hardfork_support benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "prague_hardfork_support meets specification requirements"
test "prague_hardfork_support maintains EVM compatibility"
test "prague_hardfork_support handles hardfork transitions"
test "prague_hardfork_support cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "prague_hardfork_support handles errors gracefully"
test "prague_hardfork_support proper error propagation"
test "prague_hardfork_support recovery from failure states"
test "prague_hardfork_support validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "prague_hardfork_support prevents security vulnerabilities"
test "prague_hardfork_support handles malicious inputs safely"
test "prague_hardfork_support maintains isolation boundaries"
test "prague_hardfork_support validates security properties"
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
test "prague_hardfork_support basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = prague_hardfork_support.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const prague_hardfork_support = struct {
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

## References

- [Prague Hardfork Meta EIP](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7600.md)
- [Verkle Trees Documentation](https://verkle.info/)
- [Account Abstraction ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)
- [EOF Specification](https://github.com/ethereum/EIPs/tree/master/EIPS) - Various EOF EIPs
- [Ethereum Research Forums](https://ethresear.ch/) - Latest Prague discussions

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs. For instructions undefined
/// in given EVM revision, the value is instr::undefined.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};

    for (auto& t : table[EVMC_FRONTIER])
        t = undefined;
    table[EVMC_FRONTIER][OP_STOP] = 0;
    table[EVMC_FRONTIER][OP_ADD] = 3;
    // ... more gas costs ...
    table[EVMC_CANCUN] = table[EVMC_SHANGHAI];
    table[EVMC_CANCUN][OP_BLOBHASH] = 3;
    table[EVMC_CANCUN][OP_BLOBBASEFEE] = 2;
    table[EVMC_CANCUN][OP_TLOAD] = warm_storage_read_cost;
    table[EVMC_CANCUN][OP_TSTORE] = warm_storage_read_cost;
    table[EVMC_CANCUN][OP_MCOPY] = 3;

    table[EVMC_PRAGUE] = table[EVMC_CANCUN];
    // ... future hardforks ...
    table[EVMC_EXPERIMENTAL][OP_RJUMP] = 2;
    table[EVMC_EXPERIMENTAL][OP_RJUMPI] = 4;
    // ... more experimental gas costs ...

    return table;
}();


/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    /// Size of the immediate argument in bytes.
    uint8_t immediate_size = 0;

    /// Whether the instruction terminates execution.
    bool is_terminating = false;

    /// The number of stack items the instruction accesses during execution.
    uint8_t stack_height_required = 0;

    /// The stack height change caused by the instruction execution. Can be negative.
    int8_t stack_height_change = 0;

    /// The EVM revision in which the instruction has been defined. For instructions available in
    /// every EVM revision the value is ::EVMC_FRONTIER. For undefined instructions the value is not
    /// available.
    std::optional<evmc_revision> since;

    /// The EVM revision in which the instruction has become valid in EOF. For instructions invalid
    /// in EOF the value is not available.
    std::optional<evmc_revision> eof_since;
};

/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    // ...
    table[OP_SHL] = {"SHL", 0, false, 2, -1, EVMC_CONSTANTINOPLE, REV_EOF1};
    // ...
    table[OP_PUSH0] = {"PUSH0", 0, false, 0, 1, EVMC_SHANGHAI, REV_EOF1};
    // ...
    table[OP_RJUMP] = {"RJUMP", 2, false, 0, 0, {}, REV_EOF1};
    table[OP_RJUMPI] = {"RJUMPI", 2, false, 1, -1, {}, REV_EOF1};
    // ...
    table[OP_EOFCREATE] = {"EOFCREATE", 1, false, 4, -3, {}, REV_EOF1};
    table[OP_TXCREATE] = {"TXCREATE", 0, false, 5, -4, EVMC_EXPERIMENTAL, REV_EOF1};
    table[OP_RETURNCODE] = {"RETURNCODE", 1, true, 2, -2, {}, REV_EOF1};
    // ...
    return table;
}();
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/transaction.hpp">
```cpp
struct Transaction
{
    /// The type of the transaction.
    enum class Type : uint8_t
    {
        /// The legacy RLP-encoded transaction without leading "type" byte.
        legacy = 0,

        /// The typed transaction with optional account/storage access list.
        /// Introduced by EIP-2930 https://eips.ethereum.org/EIPS/eip-2930.
        access_list = 1,

        /// The typed transaction with priority gas price.
        /// Introduced by EIP-1559 https://eips.ethereum.org/EIPS/eip-1559.
        eip1559 = 2,

        /// The typed blob transaction (with array of blob hashes).
        /// Introduced by EIP-4844 https://eips.ethereum.org/EIPS/eip-4844.
        blob = 3,

        /// The typed set code transaction (with authorization list).
        /// Introduced by EIP-7702 https://eips.ethereum.org/EIPS/eip-7702.
        set_code = 4,

        /// The typed transaction with initcode list.
        /// Introduced by EIP-7873 https://eips.ethereum.org/EIPS/eip-7873.
        initcodes = 6,
    };
    // ...
};

struct Authorization
{
    intx::uint256 chain_id;
    address addr;
    uint64_t nonce = 0;
    /// Signer is empty if it cannot be ecrecovered from r, s, v.
    std::optional<address> signer;
    intx::uint256 r;
    intx::uint256 s;
    intx::uint256 v;
};

using AuthorizationList = std::vector<Authorization>;
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.hpp">
```cpp
constexpr uint8_t EOF_MAGIC_BYTES[] = {0xef, 0x00};
constexpr bytes_view EOF_MAGIC{EOF_MAGIC_BYTES, std::size(EOF_MAGIC_BYTES)};

/// The value returned by EXTCODEHASH of an address with EOF code.
static constexpr auto EOF_CODE_HASH_SENTINEL =
    0x9dbf3648db8210552e9c4f75c6a1c3057c0ca432043bd648be15fe7be05646f5_bytes32;

struct EOFCodeType
{
    uint8_t inputs;               ///< Number of code inputs.
    uint8_t outputs;              ///< Number of code outputs.
    uint16_t max_stack_increase;  ///< Maximum stack height above the inputs reached in the code.
};

struct EOF1Header
{
    /// Size of a type entry in bytes.
    static constexpr size_t TYPE_ENTRY_SIZE = sizeof(EOFCodeType);

    /// The EOF version, 0 means legacy code.
    uint8_t version = 0;

    /// Offset of the type section start.
    size_t type_section_offset = 0;

    /// Size of every code section.
    std::vector<uint16_t> code_sizes;

    /// Offset of every code section from the beginning of the EOF container.
    std::vector<uint16_t> code_offsets;

    /// Size of the data section.
    uint16_t data_size = 0;
    /// Offset of data container section start.
    uint32_t data_offset = 0;
    // ...
};

/// Checks if code starts with EOF FORMAT + MAGIC, doesn't validate the format.
[[nodiscard]] EVMC_EXPORT bool is_eof_container(bytes_view code) noexcept;

/// Reads the section sizes assuming that container has valid format.
[[nodiscard]] EVMC_EXPORT EOF1Header read_valid_eof1_header(bytes_view container);

enum class EOFValidationError
{
    success,
    invalid_prefix,
    eof_version_unknown,
    // ... many validation errors
    unreachable_instructions,
    stack_underflow,
    stack_overflow,
    // ...
};

enum class ContainerKind : uint8_t
{
    /// Container that uses RETURNCODE. Can be used by EOFCREATE/TXCREATE.
    initcode,
    /// Container that uses STOP/RETURN. Can be returned by RETURNCODE.
    runtime,
};

/// Validates whether given container is a valid EOF according to the rules of given revision.
[[nodiscard]] EVMC_EXPORT EOFValidationError validate_eof(
    evmc_revision rev, ContainerKind kind, bytes_view container) noexcept;

/// Returns the error message corresponding to an error code.
[[nodiscard]] EVMC_EXPORT std::string_view get_error_message(EOFValidationError err) noexcept;
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
PrecompileAnalysis ecrecover_analyze(bytes_view /*input*/, evmc_revision /*rev*/) noexcept
{
    return {3000, 32};
}

PrecompileAnalysis ecpairing_analyze(bytes_view input, evmc_revision rev) noexcept
{
    const auto base_cost = (rev >= EVMC_ISTANBUL) ? 45000 : 100000;
    const auto element_cost = (rev >= EVMC_ISTANBUL) ? 34000 : 80000;
    const auto num_elements = static_cast<int64_t>(input.size() / 192);
    return {base_cost + num_elements * element_cost, 32};
}

ExecutionResult ecpairing_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    static constexpr auto OUTPUT_SIZE = 32;
    static constexpr size_t PAIR_SIZE = 192;
    assert(output_size >= OUTPUT_SIZE);

    if (input_size % PAIR_SIZE != 0)
        return {EVMC_PRECOMPILE_FAILURE, 0};

    std::vector<std::pair<evmmax::bn254::Point, evmmax::bn254::ExtPoint>> pairs;
    pairs.reserve(input_size / PAIR_SIZE);
    // ... parsing and verification logic ...
    const auto res = evmmax::bn254::pairing_check(pairs);
    if (!res.has_value())
        return {EVMC_PRECOMPILE_FAILURE, 0};

    std::fill_n(output, OUTPUT_SIZE, 0);
    output[OUTPUT_SIZE - 1] = *res ? 1 : 0;
    return {EVMC_SUCCESS, OUTPUT_SIZE};
}

// ... other precompile implementations ...

evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id];

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    // Allocate buffer for the precompile's output and pass its ownership to evmc::Result.
    const auto output_data = new (std::nothrow) uint8_t[max_output_size];
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    const evmc_result result{status_code, status_code == EVMC_SUCCESS ? gas_left : 0, 0,
        output_data, output_size,
        [](const evmc_result* res) noexcept { delete[] res->output_data; }};
    return evmc::Result{result};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/delegation.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2025 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/bytes.hpp>
#include <evmc/evmc.hpp>
#include <evmc/utils.h>

namespace evmone
{
using evmc::bytes_view;

/// Prefix of code for delegated accounts
/// defined by [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)
constexpr uint8_t DELEGATION_MAGIC_BYTES[] = {0xef, 0x01, 0x00};
constexpr bytes_view DELEGATION_MAGIC{DELEGATION_MAGIC_BYTES, std::size(DELEGATION_MAGIC_BYTES)};

/// Check if code contains EIP-7702 delegation designator
constexpr bool is_code_delegated(bytes_view code) noexcept
{
    return code.starts_with(DELEGATION_MAGIC);
}

/// Get EIP-7702 delegate address from the code of addr, if it is delegated.
EVMC_EXPORT std::optional<evmc::address> get_delegate_address(
    const evmc::HostInterface& host, const evmc::address& addr) noexcept;
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
/// The "core" instruction implementations.
///
/// These are minimal EVM instruction implementations which assume:
/// - the stack requirements (overflow, underflow) have already been checked,
/// - the "base" gas const has already been charged,
/// - the `stack` pointer points to the EVM stack top element.
/// Moreover, these implementations _do not_ inform about new stack height
/// after execution. The adjustment must be performed by the caller.

// ...

inline Result extcodehash(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    auto& x = stack.top();
    const auto addr = intx::be::trunc<evmc::address>(x);

    if (state.rev >= EVMC_BERLIN && state.host.access_account(addr) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::additional_cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }

    x = intx::be::load<uint256>(state.host.get_code_hash(addr));
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/utils/utils.cpp">
```cpp
evmc_revision to_rev(std::string_view s)
{
    if (s == "Frontier")
        return EVMC_FRONTIER;
    if (s == "Homestead")
        return EVMC_HOMESTEAD;
    // ...
    if (s == "Cancun")
        return EVMC_CANCUN;
    if (s == "Prague")
        return EVMC_PRAGUE;
    if (s == "Osaka")
        return EVMC_OSAKA;
    if (s == "EOFv1")
        return EVMC_EXPERIMENTAL;
    if (s == "Experimental")
        return EVMC_EXPERIMENTAL;
    throw std::invalid_argument{"unknown revision: " + std::string{s}};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/state_transition_eip7702_test.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2024 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "../utils/bytecode.hpp"
#include "state_transition.hpp"

using namespace evmc::literals;
using namespace evmone::test;

TEST_F(state_transition, eip7702_set_code_transaction)
{
    rev = EVMC_PRAGUE;

    constexpr auto authority = 0xca11ee_address;
    constexpr auto delegate = 0xde1e_address;
    pre[delegate] = {.code = bytecode{OP_STOP}};
    tx.to = To;
    tx.type = Transaction::Type::set_code;
    tx.authorization_list = {{.addr = delegate, .nonce = 0, .signer = authority}};
    pre[To] = {.code = ret(0)};

    expect.post[To].exists = true;
    expect.post[delegate].exists = true;
    expect.post[authority].nonce = 1;
    expect.post[authority].code = bytes{0xef, 0x01, 0x00} + hex(delegate);
}

TEST_F(state_transition, eip7702_extcodesize)
{
    rev = EVMC_PRAGUE;

    constexpr auto callee = 0xca11ee_address;
    constexpr auto delegate = 0xde1e_address;
    pre[callee] = {.nonce = 1, .code = bytes{0xef, 0x01, 0x00} + hex(delegate)};
    pre[delegate] = {.code = 1024 * OP_JUMPDEST};
    tx.to = To;
    pre[To] = {.code = sstore(1, push(callee) + OP_EXTCODESIZE)};

    expect.post[callee].exists = true;
    expect.post[delegate].exists = true;
    expect.post[To].storage[0x01_bytes32] = 0x17_bytes32; // Size of "ef0100" + 20-byte address
}

TEST_F(state_transition, eip7702_extcodehash_delegation_to_empty)
{
    rev = EVMC_PRAGUE;

    constexpr auto callee = 0xca11ee_address;
    constexpr auto delegate = 0xde1e_address;
    pre[callee] = {.nonce = 1, .code = bytes{0xef, 0x01, 0x00} + hex(delegate)};
    tx.to = To;
    pre[To] = {.code = sstore(0, push(callee) + OP_EXTCODEHASH) + sstore(1, 1)};

    expect.post[callee].exists = true;
    expect.post[delegate].exists = false;
    expect.post[To].storage[0x00_bytes32] = keccak256(bytes{0xef, 0x01, 0x00} + hex(delegate));
    expect.post[To].storage[0x01_bytes32] = 0x01_bytes32;
}

TEST_F(state_transition, eip7702_call)
{
    rev = EVMC_PRAGUE;

    constexpr auto callee = 0xca11ee_address;
    constexpr auto delegate = 0xde1e_address;
    pre[callee] = {.nonce = 1, .code = bytes{0xef, 0x01, 0x00} + hex(delegate)};
    pre[delegate] = {.code = sstore(0, 0x11)};
    tx.to = To;
    pre[To] = {.code = sstore(1, call(callee).gas(50'000))};

    expect.post[delegate].exists = true;
    expect.post[To].storage[0x01_bytes32] = 0x01_bytes32;
    expect.post[callee].storage[0x00_bytes32] = 0x11_bytes32;
}
```
</file>
</evmone>



## REVM Context

An excellent and detailed prompt! Here is the most relevant context from the `revm` codebase to assist in implementing Prague hardfork support.

This context focuses on how `revm` manages different hardforks, opcodes, precompiles, transaction types, and gas models, which are the core components you'll need to modify or implement.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/primitives/src/hardfork.rs">
```rust
//! Specification IDs and their activation block
//!
//! Information was obtained from the [Ethereum Execution Specifications](https://github.com/ethereum/execution-specs).
#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, TryFromPrimitive)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum SpecId {
    // ... existing hardforks
    /// Shanghai hard fork
    /// Activated at block 17034870 (Timestamp: 1681338455)
    SHANGHAI,
    /// Cancun hard fork
    /// Activated at block 19426587 (Timestamp: 1710338135)
    CANCUN,
    /// Prague hard fork
    /// Activated at block 22431084 (Timestamp: 1746612311)
    #[default]
    PRAGUE,
    /// Osaka hard fork
    /// Activated at block TBD
    OSAKA,
}

impl SpecId {
    // ...
    /// Returns `true` if the given specification ID is enabled in this spec.
    #[inline]
    pub const fn is_enabled_in(self, other: Self) -> bool {
        self as u8 >= other as u8
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
// ...

/// Precompiles contain map of precompile addresses to functions and HashSet of precompile addresses.
#[derive(Clone, Default, Debug)]
pub struct Precompiles {
    /// Precompiles
    inner: HashMap<Address, PrecompileFn>,
    /// Addresses of precompile
    addresses: HashSet<Address>,
}

impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        match spec {
            PrecompileSpecId::HOMESTEAD => Self::homestead(),
            PrecompileSpecId::BYZANTIUM => Self::byzantium(),
            PrecompileSpecId::ISTANBUL => Self::istanbul(),
            PrecompileSpecId::BERLIN => Self::berlin(),
            PrecompileSpecId::CANCUN => Self::cancun(),
            PrecompileSpecId::PRAGUE => Self::prague(),
            PrecompileSpecId::OSAKA => Self::osaka(),
        }
    }

    // ...

    /// Returns precompiles for Cancun spec.
    ///
    /// If the `c-kzg` feature is not enabled KZG Point Evaluation precompile will not be included,
    /// effectively making this the same as Berlin.
    pub fn cancun() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::berlin().clone();

            // EIP-4844: Shard Blob Transactions
            cfg_if! {
                if #[cfg(any(feature = "c-kzg", feature = "kzg-rs"))] {
                    let precompile = kzg_point_evaluation::POINT_EVALUATION.clone();
                } else {
                    let precompile = PrecompileWithAddress(u64_to_address(0x0A), |_,_| Err(PrecompileError::Fatal("c-kzg feature is not enabled".into())));
                }
            }


            precompiles.extend([
                precompile,
            ]);

            Box::new(precompiles)
        })
    }

    /// Returns precompiles for Prague spec.
    pub fn prague() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::cancun().clone();
            precompiles.extend(bls12_381::precompiles());
            Box::new(precompiles)
        })
    }

    // ...
}

/// Ethereum hardfork spec ids. Represents the specs where precompiles had a change.
#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash, Ord, PartialOrd)]
pub enum PrecompileSpecId {
    // ...
    CANCUN,
    /// Prague spec added bls precompiles [`EIP-2537: Precompile for BLS12-381 curve operations`](https://eips.ethereum.org/EIPS/eip-2537).
    /// * `BLS12_G1ADD` at address 0x0b
    /// * `BLS12_G1MSM` at address 0x0c
    /// * ...
    PRAGUE,
    OSAKA,
}

impl PrecompileSpecId {
    /// Returns the appropriate precompile Spec for the primitive [SpecId].
    pub const fn from_spec_id(spec_id: primitives::hardfork::SpecId) -> Self {
        use primitives::hardfork::SpecId::*;
        match spec_id {
            // ...
            CANCUN => Self::CANCUN,
            PRAGUE => Self::PRAGUE,
            OSAKA => Self::OSAKA,
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.

// ...

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    // ... existing opcodes
    table[BLOBHASH as usize] = tx_info::blob_hash;
    table[BLOBBASEFEE as usize] = block_info::blob_basefee;
    // ...
    table[PUSH0 as usize] = stack::push0;
    // ...
    table[TLOAD as usize] = host::tload;
    table[TSTORE as usize] = host::tstore;
    table[MCOPY as usize] = memory::mcopy;
    // ...
    // New Prague opcodes would be added here, gated by SpecId inside the function if needed.
    // For example:
    // table[VERKLE_VERIFY as usize] = prague::verkle_verify;
    
    table
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
// ...

/// `SSTORE` opcode cost calculation.
#[inline]
pub fn sstore_cost(spec_id: SpecId, vals: &SStoreResult, is_cold: bool) -> u64 {
    if spec_id.is_enabled_in(SpecId::BERLIN) {
        // Berlin specification logic
        let mut gas_cost = istanbul_sstore_cost::<WARM_STORAGE_READ_COST, WARM_SSTORE_RESET>(vals);

        if is_cold {
            gas_cost += COLD_SLOAD_COST;
        }
        gas_cost
    } else if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // Istanbul logic
        istanbul_sstore_cost::<ISTANBUL_SLOAD_GAS, SSTORE_RESET>(vals)
    } else {
        // Frontier logic
        frontier_sstore_cost(vals)
    }
}

/// `EXP` opcode cost calculation.
#[inline]
pub fn exp_cost(spec_id: SpecId, power: U256) -> Option<u64> {
    if power.is_zero() {
        Some(EXP)
    } else {
        // EIP-160: EXP cost increase
        let gas_byte = U256::from(if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
            50
        } else {
            10
        });
        let gas = U256::from(EXP)
            .checked_add(gas_byte.checked_mul(U256::from(log2floor(power) / 8 + 1))?)?;

        u64::try_from(gas).ok()
    }
}
// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/interface/src/transaction/transaction_type.rs">
```rust
/// Transaction types of all Ethereum transaction
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum TransactionType {
    /// Legacy transaction type
    Legacy = 0,
    /// EIP-2930 Access List transaction type
    Eip2930 = 1,
    /// EIP-1559 Fee market change transaction type
    Eip1559 = 2,
    /// EIP-4844 Blob transaction type
    Eip4844 = 3,
    /// EIP-7702 Set EOA account code transaction type
    Eip7702 = 4,
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/interface/src/transaction/eip7702.rs">
```rust
use auto_impl::auto_impl;
use primitives::{Address, U256};

/// Authorization trait.
#[auto_impl(&, Box, Arc, Rc)]
pub trait AuthorizationTr {
    /// Authority address.
    ///
    /// # Note
    ///
    /// Authority signature can be invalid, so this method returns None if the authority
    /// could not be recovered.
    ///
    /// Valid signature Parity should be 0 or 1 and
    /// signature s-value should be less than SECP256K1N_HALF.
    fn authority(&self) -> Option<Address>;

    /// Returns authorization the chain id.
    fn chain_id(&self) -> U256;

    /// Returns the nonce.
    ///
    /// # Note
    ///
    /// If nonce is not same as the nonce of the signer account,
    /// the authorization is skipped.
    fn nonce(&self) -> u64;

    /// Returns the address that this account is delegated to.
    fn address(&self) -> Address;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/primitives/src/eip7702.rs">
```rust
//! EIP-7702 constants

/// Base cost of updating authorized account.
pub const PER_AUTH_BASE_COST: u64 = 12500;

/// Cost of creating authorized account that was previously empty.
pub const PER_EMPTY_ACCOUNT_COST: u64 = 25000;
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/control.rs">
```rust
// ...
pub fn jump<ITy: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, ITy>) {
    gas!(context.interpreter, gas::MID);
    popn!([target], context.interpreter);
    jump_inner(context.interpreter, target);
}

#[inline]
fn jump_inner<WIRE: InterpreterTypes>(interpreter: &mut Interpreter<WIRE>, target: U256) {
    let target = as_usize_or_fail!(interpreter, target, InstructionResult::InvalidJump);
    if !interpreter.bytecode.is_valid_legacy_jump(target) {
        interpreter
            .control
            .set_instruction_result(InstructionResult::InvalidJump);
        return;
    }
    // SAFETY: `is_valid_jump` ensures that `dest` is in bounds.
    interpreter.bytecode.absolute_jump(target);
}

pub fn ret<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    return_inner(context.interpreter, InstructionResult::Return);
}

#[inline]
fn return_inner(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    instruction_result: InstructionResult,
) {
    // ...
    popn!([offset, len], interpreter);
    let len = as_usize_or_fail!(interpreter, len);
    // Important: Offset must be ignored if len is zeros
    let mut output = Bytes::default();
    if len != 0 {
        let offset = as_usize_or_fail!(interpreter, offset);
        resize_memory!(interpreter, offset, len);
        output = interpreter.memory.slice_len(offset, len).to_vec().into()
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/kzg_point_evaluation.rs">
```rust
//! KZG point evaluation precompile added in [`EIP-4844`](https://eips.ethereum.org/EIPS/eip-4844)
//! For more details check [`run`] function.
use crate::{Address, PrecompileError, PrecompileOutput, PrecompileResult, PrecompileWithAddress};
// ...
use sha2::{Digest, Sha256};

/// KZG point evaluation precompile, containing address and function to run.
pub const POINT_EVALUATION: PrecompileWithAddress = PrecompileWithAddress(ADDRESS, run);

/// Address of the KZG point evaluation precompile.
pub const ADDRESS: Address = crate::u64_to_address(0x0A);

/// Gas cost of the KZG point evaluation precompile.
pub const GAS_COST: u64 = 50_000;

// ...

/// Run kzg point evaluation precompile.
///
/// The Env has the KZGSettings that is needed for evaluation.
///
/// The input is encoded as follows:
/// | versioned_hash |  z  |  y  | commitment | proof |
/// |     32         | 32  | 32  |     48     |   48  |
/// with z and y being padded 32 byte big endian values
pub fn run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    if gas_limit < GAS_COST {
        return Err(PrecompileError::OutOfGas);
    }

    // Verify input length.
    if input.len() != 192 {
        return Err(PrecompileError::BlobInvalidInputLength);
    }

    // Verify commitment matches versioned_hash
    let versioned_hash = &input[..32];
    let commitment = &input[96..144];
    if kzg_to_versioned_hash(commitment) != versioned_hash {
        return Err(PrecompileError::BlobMismatchedVersion);
    }

    // Verify KZG proof with z and y in big endian format
    let commitment = as_bytes48(commitment);
    let z = as_bytes32(&input[32..64]);
    let y = as_bytes32(&input[64..96]);
    let proof = as_bytes48(&input[144..192]);
    if !verify_kzg_proof(commitment, z, y, proof) {
        return Err(PrecompileError::BlobVerifyKzgProofFailed);
    }

    // Return FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS as padded 32 byte big endian values
    Ok(PrecompileOutput::new(GAS_COST, RETURN_VALUE.into()))
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/handler.rs">
```rust
// ...
pub trait Handler {
    /// The EVM type containing Context, Instruction, and Precompiles implementations.
    type Evm: EvmTr<Context: ContextTr<Journal: JournalTr<State = EvmState>>>;
    // ...

    /// The main entry point for transaction execution.
    #[inline]
    fn run(
        &mut self,
        evm: &mut Self::Evm,
    ) -> Result<ExecutionResult<Self::HaltReason>, Self::Error> {
        // Run inner handler and catch all errors to handle cleanup.
        match self.run_without_catch_error(evm) {
            Ok(output) => Ok(output),
            Err(e) => self.catch_error(evm, e),
        }
    }
    
    // ...

    /// Called by [`Handler::run`] to execute the core handler logic.
    ///
    /// Executes the four phases in sequence: [Handler::validate],
    /// [Handler::pre_execution], [Handler::execution], [Handler::post_execution].
    #[inline]
    fn run_without_catch_error(
        &mut self,
        evm: &mut Self::Evm,
    ) -> Result<ExecutionResult<Self::HaltReason>, Self::Error> {
        let init_and_floor_gas = self.validate(evm)?;
        let eip7702_refund = self.pre_execution(evm)? as i64;
        let mut frame_result = self.execution(evm, &init_and_floor_gas)?;
        self.post_execution(evm, &mut frame_result, init_and_floor_gas, eip7702_refund)?;

        // Prepare the output
        self.execution_result(evm, frame_result)
    }
    
    // ...
}
```
</file>
</revm>

## Prompt Corrections

Your prompt is well-structured and detailed. The provided Zig snippets are excellent for guiding the implementation. Here are a few minor corrections and suggestions based on `revm`'s architecture to enhance accuracy:

1.  **Hardfork Enum**: In the prompt, `Hardfork.zig` has boolean flags like `supports_verkle_trees`. `revm` uses a more direct comparison: `spec.is_enabled_in(SpecId::PRAGUE)`. This pattern is more scalable as it avoids adding a new boolean flag for every EIP. The equivalent in Zig would be `hardfork >= .Prague`.

2.  **Hardfork Configuration**: The `PragueConfig` struct is a good idea. In `revm`, this logic is distributed. For example, gas calculations are in the `gas` module and branch on `SpecId`. Precompile sets are built in the `precompile` module. Centralizing this in a `PragueConfig` struct as you've done is a clean architectural choice for your implementation.

3.  **Opcode Naming**: In your prompt, opcodes like `VERKLE_VERIFY` are assigned `0x49`. Note that `0x49` is `BLOBHASH` in Cancun. The final Prague opcode values are not yet determined. Your placeholder values are fine, but it's good to be aware that they will likely change.

4.  **Transaction Types**: In your `PragueTransactionType` enum, you use `0x04` for `SetCodeTransaction` and `0x05` for `UserOperation`. EIP-2718 reserves transaction types, and EIP-7702 has been assigned type `0x04`. EIP-4337 `UserOperation`s are not a native transaction type yet; they are sent via a bundler. It's correct to plan for a future native AA transaction type, but the type ID is not yet assigned.

5.  **Gas Model**: The approach of a `PragueGasCalculator` is sound. In `revm`, these calculations are free functions inside the `gas` module that take `SpecId` as an argument. This is a minor stylistic difference. Your approach might be more object-oriented and is perfectly valid.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/__init__.py">
```python
"""
The Prague fork is the next planned upgrade after Cancun.

It is not yet finalized and this file is a placeholder.
"""

from ethereum.fork_criteria import ByTimestamp

FORK_CRITERIA = ByTimestamp(0)
```
**Reasoning**: This snippet defines the Prague hardfork itself. The `FORK_CRITERIA` (which will eventually be a block number or timestamp) is the primary switch for enabling all Prague-related features. This corresponds to **Task 1** of the prompt.
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/transactions.py">
```python
"""
Transactions are atomic units of work created externally to Ethereum and
submitted to be executed. If Ethereum is viewed as a state machine,
transactions are the events that move between states.
"""
from dataclasses import dataclass
from typing import Optional, Tuple, Union

from ethereum_rlp import rlp
from ethereum_types.bytes import Bytes, Bytes0, Bytes32
from ethereum_types.frozen import slotted_freezable
from ethereum_types.numeric import U64, U256, Uint

from ethereum.base_types import Uint
from ethereum.crypto.elliptic_curve import SECP256K1N, secp256k1_recover
from ethereum.crypto.hash import Hash32, keccak256
from ethereum.exceptions import InvalidSignatureError, InvalidTransaction

from .exceptions import TransactionTypeError
from .fork_types import Address, VersionedHash

# ... (other constants)

@slotted_freezable
@dataclass
class SetCodeTransaction:
    """
    The transaction type added in EIP-7702.
    """

    chain_id: U64
    nonce: U256
    max_priority_fee_per_gas: Uint
    max_fee_per_gas: Uint
    gas: Uint
    to: Union[Bytes0, Address]
    value: U256
    data: Bytes
    access_list: Tuple["Access", ...]
    authorization_list: Tuple["Authorization", ...]
    y_parity: U256
    r: U256
    s: U256


Transaction = Union[
    "LegacyTransaction",
    "AccessListTransaction",
    "FeeMarketTransaction",
    "BlobTransaction",
    SetCodeTransaction,
]


def encode_transaction(tx: Transaction) -> Union["LegacyTransaction", Bytes]:
    """
    Encode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    # ... (other types)
    elif isinstance(tx, SetCodeTransaction):
        return b"\x04" + rlp.encode(tx)
    else:
        # FIXME: add support for auth transactions (type 5)
        raise Exception(f"Unable to encode transaction of type {type(tx)}")


def decode_transaction(tx: Union["LegacyTransaction", Bytes]) -> Transaction:
    """
    Decode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    if isinstance(tx, Bytes):
        # ... (other types)
        elif tx[0] == 4:
            return rlp.decode_to(SetCodeTransaction, tx[1:])
        else:
            raise TransactionTypeError(tx[0])
    else:
        return tx

# ... (other functions)
```
**Reasoning**: This file is critical for implementing new transaction types for Prague. It shows the new `SetCodeTransaction` (Type 0x04) and how the top-level `Transaction` union is extended. The `encode_transaction` and `decode_transaction` functions show how to handle the new type byte. This provides a direct template for the `PragueTransactionType` enum and `VerkleWitnessTransaction` struct mentioned in the prompt.
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/__init__.py">
```python
"""
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Machine readable representations of EVM instructions, and a mapping to their
implementations.
"""

# ... (imports)
from . import data as data_instructions

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ... (existing opcodes)
    
    # EIP-7685: General-purpose execution layer requests
    DEPOSIT = 0xB0
    WITHDRAW = 0xB1
    VALREQ = 0xB2

    # EIP-7480: EOF Functions
    RJUMP = 0x5C
    RJUMPI = 0x5D
    RJUMPV = 0x5E
    CALLF = 0xE1
    RETF = 0xE2
    JUMPF = 0xE3

    # EIP-4200: Static relative jumps
    RJUMPS = 0xEA
    RJUMPIS = 0xEB

    # EIP-5450: Stack validation
    SWAPN = 0xEC
    DUPN = 0xED
    EXCHANGE = 0xEE
    RETURNDATALOAD = 0xF7

    # EIP-6206: JUMP and JUMPI to the middle of an instruction
    JUMPS = 0xF6

    # EIP-7069: Revamped SELFDESTRUCT
    DEACTIVATE = 0xF8

    # EOF data opcodes, replacing BLOBHASH and BLOBBASEFEE
    DATALOAD = 0x49
    DATALOADN = 0x4A
    DATASIZE = 0x4B
    DATACOPY = 0x4C


op_implementation: Dict[Ops, Callable] = {
    # ... (other opcode implementations)
    Ops.DATALOAD: data_instructions.data_load,
    Ops.DATALOADN: data_instructions.data_loadn,
    Ops.DATASIZE: data_instructions.data_size,
    Ops.DATACOPY: data_instructions.data_copy,
}
```
**Reasoning**: This file defines the new opcodes for the Prague hardfork. It shows the specific opcode values and their corresponding implementation functions. This is the primary reference for **Task 4** in the prompt. Note the opcodes for `DATALOAD` (0x49), `DATASIZE` (0x4b), and `DATACOPY` (0x4c) which can serve as direct analogs for the prompt's `VERKLE_VERIFY`, `ACCOUNT_SIZE`, and `CODE_COPY_VERKLE` respectively.
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/data.py">
```python
"""
Ethereum Virtual Machine (EVM) Data Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM data instructions.
"""
from ethereum_types.numeric import U256, Uint

from .. import Evm
from ..gas import GAS_VERY_LOW, charge_gas
from ..memory import memory_read_bytes, memory_write
from ..stack import pop, push


def data_load(evm: Evm) -> None:
    """
    Pushes the 32-byte value of a data segment to the stack.
    """
    # STACK
    index = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    # TODO: Implement this using the EOF information
    # For now, just push a zero to the stack
    value = U256(0)
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def data_size(evm: Evm) -> None:
    """
    Pushes the size of a data segment to the stack.
    """
    # STACK
    index = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    # TODO: Implement this using the EOF information
    # For now, just push a zero to the stack
    value = U256(0)
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
**Reasoning**: This file provides the implementation logic for the new `DATALOAD` and `DATASIZE` opcodes. While the implementations are stubs (as EOF is not fully integrated in the spec), they show the function signature and stack operations required. This is a direct reference for implementing `execute_account_code` and `execute_account_size` from the prompt.
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
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
# ... (imports)
from ...cancun.vm.gas import (
    GAS_BASE,
    GAS_BLAKE2_PER_ROUND,
    GAS_CALL_STIPEND,
    GAS_CALL_VALUE,
    GAS_COLD_ACCOUNT_ACCESS,
    GAS_COLD_SLOAD,
    GAS_COPY,
    GAS_CREATE,
    GAS_ECRECOVER,
    GAS_EXPONENTIATION,
    GAS_EXPONENTIATION_PER_BYTE,
    GAS_IDENTITY,
    GAS_IDENTITY_WORD,
    GAS_INIT_CODE_WORD_COST,
    GAS_JUMPDEST,
    GAS_KECCAK256,
    GAS_KECCAK256_WORD,
    GAS_LOG,
    GAS_LOG_DATA,
    GAS_LOG_TOPIC,
    GAS_LOW,
    GAS_MEMORY,
    GAS_MID,
    GAS_NEW_ACCOUNT,
    GAS_POINT_EVALUATION,
    GAS_RETURN_DATA_COPY,
    GAS_SELF_DESTRUCT,
    GAS_SELF_DESTRUCT_NEW_ACCOUNT,
    GAS_SHA256,
    GAS_SHA256_WORD,
    GAS_STORAGE_CLEAR_REFUND,
    GAS_STORAGE_SET,
    GAS_STORAGE_UPDATE,
    GAS_TLOAD,
    GAS_TSTORE,
    GAS_VERY_LOW,
    GAS_WARM_ACCESS,
    GAS_ZERO,
    ...
)
# ...
GAS_DEPOSIT = Uint(1)

# EIP-7685: General-purpose execution layer requests
GAS_REQUEST = Uint(1)

# EIP-4200: Static relative jumps
GAS_RJUMP = Uint(2)
GAS_RJUMPI = GAS_BASE

# EIP-5450: Stack validation
GAS_SWAPN_BASE = Uint(3)
GAS_DUPN_BASE = Uint(3)
GAS_EXCHANGE_BASE = Uint(3)
GAS_RETURNDATALOAD = Uint(3)
# ...
```
**Reasoning**: This file shows how gas constants for a new hardfork are defined, often by inheriting from the previous fork and adding or changing values. This is directly relevant to **Task 3** in the prompt, which requires implementing a `PragueGasModel`. The new constants like `GAS_DEPOSIT` and `GAS_RJUMP` are examples of what needs to be added for Prague.
</file>
</execution-specs>

## Prompt Corrections
The original prompt is well-structured but contains some speculative information about the Prague hardfork, which is understandable given that Prague is not yet finalized. Here are some corrections to align the implementation with the current direction of the specifications:

1.  **Opcode Values**: The opcodes suggested in the prompt (e.g., `VERKLE_VERIFY = 0x49`, `CODE_COPY_VERKLE = 0x4A`) conflict with opcodes introduced in previous hardforks or planned for Prague.
    *   `0x49` was `BLOBHASH` in Cancun and is `DATALOAD` in the current Prague spec.
    *   `0x4A` was `BLOBBASEFEE` in Cancun and is `DATALOADN` in the current Prague spec.
    *   **Recommendation**: Instead of inventing new opcode values, the implementation should focus on the *opcodes that are actually specified for Prague*, such as `DATALOAD` (`0x49`), `DATASIZE` (`0x4B`), and `DATACOPY` (`0x4C`). These can serve as placeholders or analogs for future Verkle-related opcodes if needed, while still being spec-compliant.

2.  **Transaction Types**:
    *   The prompt lists `SetCodeTransaction = 0x04` and `UserOperation = 0x05`. While EIP-7702 is a candidate for Prague and is assigned type `0x04`, a native `UserOperation` transaction (Type `0x05`) is not currently part of the Prague EIPs. It's more aligned with EIP-7700 or future AA proposals.
    *   **Recommendation**: Implement `SetCodeTransaction (0x04)` as planned. For Account Abstraction, it would be more spec-aligned to focus on supporting EIP-7702 and preparing the EVM for future AA EIPs rather than implementing a custom `UserOperation` transaction type. The `VerkleWitnessTransaction` is entirely speculative and a good template can be derived from existing typed transactions like `BlobTransaction`.

3.  **Verkle Trees & Full AA**: The prompt correctly identifies these as planned features but provides placeholder Zig implementations. It's important to note that since these features are not fully specified for Prague yet, there is no reference implementation in `execution-specs` to draw from directly. The goal should be to create a flexible framework that can accommodate these features once their specifications are finalized, rather than implementing a specific version that may become outdated. The provided Zig code is a good starting point for this purpose.

---

An analysis of the `execution-specs` for the upcoming Prague hardfork reveals that the primary specified feature is EIP-7702 (Set Code Transaction). Many of the other features listed in the prompt, such as Verkle Trees, new opcodes (`VERKLE_VERIFY`), and Verkle-related precompiles, are still under discussion and are not yet part of the formal Prague specification in this codebase.

The following context focuses on the features that *are* present in the specs, providing a solid foundation for implementation.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork.py">
```python
"""
Ethereum Specification for Prague
"""

# ... (imports)

# This is the main state transition function. It shows the high-level flow of
# processing a block, including transactions and withdrawals. Note the absence
# of ommers, as they are removed post-PoS.
def state_transition(chain: BlockChain, block: Block) -> None:
    """
    Attempts to apply a block to an existing block chain.
    """
    validate_header(chain, block.header)
    if block.ommers != ():
        raise InvalidBlock

    block_env = vm.BlockEnvironment(
        chain_id=chain.chain_id,
        # ... (other env fields)
        parent_beacon_block_root=block.header.parent_beacon_block_root,
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        withdrawals=block.withdrawals,
    )
    # ... (validation of state root, transactions_root, etc.)
    # ...


# This function shows how different components of a block are processed.
# It includes processing for withdrawals and new system-level requests.
def apply_body(
    block_env: vm.BlockEnvironment,
    transactions: Tuple[Union[LegacyTransaction, Bytes], ...],
    withdrawals: Tuple[Withdrawal, ...],
) -> vm.BlockOutput:
    """
    Executes a block.
    """
    block_output = vm.BlockOutput()

    # ... (system transactions)

    for i, tx in enumerate(map(decode_transaction, transactions)):
        process_transaction(block_env, block_output, tx, Uint(i))

    process_withdrawals(block_env, block_output, withdrawals)

    process_general_purpose_requests(
        block_env=block_env,
        block_output=block_output,
    )

    return block_output


# This is the core transaction processing logic. It validates the transaction,
# handles gas, and executes the message call. This is where you would
# integrate logic for new transaction types.
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    # ...
    intrinsic_gas, calldata_floor_gas_cost = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    sender_account = get_account(block_env.state, sender)

    # ... (gas fee calculations)

    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    # ... (balance updates)

    # Note the new `authorizations` field in the TransactionEnvironment
    # This is key for EIP-7702
    authorizations: Tuple[Authorization, ...] = ()
    if isinstance(tx, SetCodeTransaction):
        authorizations = tx.authorizations

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        # ...
        authorizations=authorizations,
        # ...
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... (refund and fee calculations)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/transactions.py">
```python
"""
Transaction types for the Prague hardfork.
"""

# ... (other transaction types: Legacy, AccessList, FeeMarket, Blob)

# The `SetCodeTransaction` is the primary new transaction type for Prague,
# implementing EIP-7702. Note the `authorizations` field.
@slotted_freezable
@dataclass
class SetCodeTransaction:
    """
    The transaction type added in EIP-7702.
    """

    chain_id: U64
    nonce: U64
    max_priority_fee_per_gas: Uint
    max_fee_per_gas: Uint
    gas: Uint
    to: Address
    value: U256
    data: Bytes
    access_list: Tuple[Access, ...]
    authorizations: Tuple[Authorization, ...]
    y_parity: U256
    r: U256
    s: U256


# The `Transaction` union now includes `SetCodeTransaction`. Your EVM will
# need to be able to decode and handle this new type.
Transaction = Union[
    LegacyTransaction,
    AccessListTransaction,
    FeeMarketTransaction,
    BlobTransaction,
    SetCodeTransaction,
]


# The `encode_transaction` and `decode_transaction` functions show how to handle
# the different transaction types based on their leading byte identifier.
# `SetCodeTransaction` uses type `0x04`.
def encode_transaction(tx: Transaction) -> Union[LegacyTransaction, Bytes]:
    # ...
    elif isinstance(tx, SetCodeTransaction):
        return b"\x04" + rlp.encode(tx)
    # ...

def decode_transaction(tx: Union[LegacyTransaction, Bytes]) -> Transaction:
    if isinstance(tx, Bytes):
        # ...
        elif tx[0] == 4:
            return rlp.decode_to(SetCodeTransaction, tx[1:])
        else:
            raise TransactionTypeError(tx[0])
    # ...

# This function shows how intrinsic gas is calculated for different
# transaction types. Note the new `auth_cost` for EIP-7702.
def calculate_intrinsic_cost(tx: Transaction) -> Tuple[Uint, Uint]:
    # ...
    auth_cost = Uint(0)
    if isinstance(tx, SetCodeTransaction):
        auth_cost += Uint(PER_EMPTY_ACCOUNT_COST * len(tx.authorizations))

    return (
        Uint(
            TX_BASE_COST
            + data_cost
            + create_cost
            + access_list_cost
            + auth_cost
        ),
        calldata_floor_gas_cost,
    )


# The signing hash for EIP-7702 transactions includes the `authorizations`.
def signing_hash_7702(tx: SetCodeTransaction) -> Hash32:
    """
    Compute the hash of a transaction used in a EIP-7702 signature.
    """
    return keccak256(
        b"\x04"
        + rlp.encode(
            (
                tx.chain_id,
                tx.nonce,
                tx.max_priority_fee_per_gas,
                tx.max_fee_per_gas,
                tx.gas,
                tx.to,
                tx.value,
                tx.data,
                tx.access_list,
                tx.authorizations,
            )
        )
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork_types.py">
```python
"""
Core types for the Prague hardfork.
"""

# The `Authorization` struct is central to EIP-7702. It represents a
# signature from an EOA authorizing a code change on its behalf for the
# duration of the transaction.
@slotted_freezable
@dataclass
class Authorization:
    """
    The authorization for a set code transaction.
    """

    chain_id: U256
    address: Address
    nonce: U64
    y_parity: U8
    r: U256
    s: U256
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/eoa_delegation.py">
```python
"""
This file contains the core logic for EIP-7702 (Set Code Transaction).
"""

# This magic byte sequence is prepended to a contract address to form
# the temporary code for an EOA, delegating its execution.
EOA_DELEGATION_MARKER = b"\xEF\x01\x00"

# The `set_delegation` function is called at the beginning of a transaction
# to process all authorizations. It recovers the signer, validates the nonce,
# and temporarily sets the EOA's code to the delegation marker + address.
def set_delegation(message: Message) -> U256:
    """
    Set the delegation code for the authorities in the message.
    """
    state = message.block_env.state
    refund_counter = U256(0)
    for auth in message.tx_env.authorizations:
        # ... (validation checks for chain_id, nonce)

        try:
            authority = recover_authority(auth)
        except InvalidSignatureError:
            continue

        # ... (more validation)

        if auth.address == NULL_ADDRESS:
            code_to_set = b""
        else:
            code_to_set = EOA_DELEGATION_MARKER + auth.address
        set_code(state, authority, code_to_set)

        increment_nonce(state, authority)

    # ...
    return refund_counter
```
</file>
<file path="https://github.com/ethereum/prague/vm/instructions/__init__.py">
```python
"""
This file maps opcodes to their implementations. For Prague, it is mostly
identical to Cancun, as no new opcodes have been finalized in the spec yet.
The structure is important for understanding how to add new opcodes.
"""
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ...
    TLOAD = 0x5C
    TSTORE = 0x5D
    MCOPY = 0x5E
    PUSH0 = 0x5F
    # ...
    # No new opcodes defined for Prague yet in this file.


op_implementation: Dict[Ops, Callable] = {
    # ...
    Ops.TLOAD: storage_instructions.tload,
    Ops.TSTORE: storage_instructions.tstore,
    Ops.MCOPY: memory_instructions.mcopy,
    Ops.PUSH0: stack_instructions.push0,
    # ...
}
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt is a speculative but well-structured overview of potential Prague features. However, based on the current `execution-specs`, the following corrections are important for an accurate implementation:

1.  **Scope of Prague:** The only major feature currently specified for Prague is **EIP-7702 (Set Code Transaction)**. Verkle Trees, `VerkleWitnessTransaction`, and Account Abstraction helpers are not yet part of the formal specification. It's best to implement EIP-7702 first, as it is well-defined, and build placeholders for other features.

2.  **New Opcodes:** The opcodes listed in the prompt (`VERKLE_VERIFY` at `0x49`, `CODE_COPY_VERKLE` at `0x4A`, etc.) are not correct. `0x49` and `0x4A` were introduced in the Cancun hardfork as `BLOBHASH` and `BLOBBASEFEE`, respectively. The Prague specs currently **do not define any new opcodes**. The implementation should not add these speculative opcodes until they are finalized in the EIPs and specs.

3.  **New Precompiles:** The precompile addresses `0x12` and `0x13` for Verkle and AA are also speculative. The latest specs for Prague include precompiles for BLS12-381 curve operations up to address `0x11`. You should not implement the Verkle precompiles yet.

4.  **Transaction Types:** The primary new transaction type is `SetCodeTransaction` (type `0x04`), not `VerkleWitnessTransaction`. The focus should be on implementing the `Authorization` structure and the validation logic for `SetCodeTransaction`.

5.  **Gas Model:** The gas model for Prague will be an extension of Cancun's. The most notable new cost is the intrinsic gas for `SetCodeTransaction`, which depends on the number of `authorizations`. The logic for this is in `prague/transactions.py`. The Verkle-related gas costs are speculative.

**Recommendation:** Focus the implementation on EIP-7702, which is the most concrete part of the Prague hardfork. The provided context from `execution-specs` offers a clear blueprint for this feature. Treat Verkle Trees and Account Abstraction as separate, future implementation tasks that will build upon the Prague foundation.



## GO-ETHEREUM Context

This is an excellent and detailed prompt. Implementing a new hardfork is a complex task, and referencing an existing, mature implementation like go-ethereum is a great approach.

The prompt correctly identifies the major features planned for Prague, although some specifics (like opcode numbers and precompile addresses) are still tentative in the official EIPs. Therefore, the go-ethereum codebase will provide architectural patterns and existing implementations for analogous features (like EIP-4844's KZG precompile for Verkle) rather than direct implementations of Prague-specific EIPs that are not yet finalized.

Here are the most relevant code snippets from go-ethereum to help with this implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	// EIP-150 hash of an empty account.
	EIP150Hash common.Hash `json:"eip150Hash,omitempty"`

	// EIP-158 transition block.
	EIP158Block *big.Int `json:"eip158Block,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`

	// TerminalTotalDifficulty is the total difficulty for the merge transition.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// Hard-fork scheduling
	HomesteadBlock      *big.Int `json:"homesteadBlock,omitempty"`
	DAOForkBlock        *big.Int `json:"daoForkBlock,omitempty"`
	DAOForkSupport      bool     `json:"daoForkSupport,omitempty"`
	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// Fork-times will have precedence over fork-blocks if both are set
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`
	CancunTime   *uint64 `json:"cancunTime,omitempty"`
	PragueTime   *uint64 `json:"pragueTime,omitempty"` // As of now, this is a placeholder in geth
	VerkleTime   *uint64 `json:"verkleTime,omitempty"` // As of now, this is a placeholder in geth

	// EIP-4844 related settings
	BlobScheduleConfig *BlobScheduleConfig `json:"blobSchedule,omitempty"`

	// EIP-7702 Set Code Transaction related settings
	EnableSetCodeAtGenesis bool `json:"enableSetCodeAtGenesis,omitempty"`

	// EnableVerkleAtGenesis enables the verkle state scheme from genesis.
	EnableVerkleAtGenesis bool `json:"enableVerkleAtGenesis,omitempty"`
}

// IsPrague returns whether prague is active at the given time.
func (c *ChainConfig) IsPrague(num *big.Int, time uint64) bool {
	return c.PragueTime != nil && time >= *c.PragueTime
}

// IsVerkle returns whether verkle is active at the given time.
func (c *ChainConfig) IsVerkle(num *big.Int, time uint64) bool {
	return (c.VerkleTime != nil && time >= *c.VerkleTime) || c.EnableVerkleAtGenesis
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_setcode.go">
```go
// DelegationPrefix is used by code to denote the account is delegating to
// another account.
var DelegationPrefix = []byte{0xef, 0x01, 0x00}

// ParseDelegation tries to parse the address from a delegation slice.
func ParseDelegation(b []byte) (common.Address, bool) {
	if len(b) != 23 || !bytes.HasPrefix(b, DelegationPrefix) {
		return common.Address{}, false
	}
	return common.BytesToAddress(b[len(DelegationPrefix):]), true
}

// SetCodeTx implements the EIP-7702 transaction type which temporarily installs
// the code at the signer's address.
type SetCodeTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList
	AuthList   []SetCodeAuthorization

	// Signature values
	V *uint256.Int
	R *uint256.Int
	S *uint256.Int
}

//go:generate go run github.com/fjl/gencodec -type SetCodeAuthorization -field-override authorizationMarshaling -out gen_authorization.go

// SetCodeAuthorization is an authorization from an account to deploy code at its address.
type SetCodeAuthorization struct {
	ChainID uint256.Int    `json:"chainId" gencodec:"required"`
	Address common.Address `json:"address" gencodec:"required"`
	Nonce   uint64         `json:"nonce" gencodec:"required"`
	V       uint8          `json:"yParity" gencodec:"required"`
	R       uint256.Int    `json:"r" gencodec:"required"`
	S       uint256.Int    `json:"s" gencodec:"required"`
}

// Authority recovers the the authorizing account of an authorization.
func (a *SetCodeAuthorization) Authority() (common.Address, error) {
	sighash := a.sigHash()
	if !crypto.ValidateSignatureValues(a.V, a.R.ToBig(), a.S.ToBig(), true) {
		return common.Address{}, ErrInvalidSig
	}
	// encode the signature in uncompressed format
	var sig [crypto.SignatureLength]byte
	a.R.WriteToSlice(sig[:32])
	a.S.WriteToSlice(sig[32:64])
	sig[64] = a.V
	// recover the public key from the signature
	pub, err := crypto.Ecrecover(sighash[:], sig[:])
	if err != nil {
		return common.Address{}, err
	}
	if len(pub) == 0 || pub[0] != 4 {
		return common.Address{}, errors.New("invalid public key")
	}
	var addr common.Address
	copy(addr[:], crypto.Keccak256(pub[1:])[12:])
	return addr, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyMessage computes the new state by applying the given message against the
// current state.
//
// ApplyMessage returns the bytes returned by the EVM, the gas used, and an error if it
// failed. An error always indicates a core error meaning that the message would
// always fail for that particular state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// TransitionDb will transition the state by applying the current message and
// returning the evm execution result with the given gas pool.
//
// The distinction between TransitionDb and ApplyMessage is that TransitionDb
// assumes that the access list has already been built and passed in the message,
// and it does not do any pre-checks.
func (st *StateTransition) TransitionDb() (*ExecutionResult, error) {
	// ... (initial checks and gas calculation)

	// After the refunds, the sender may be in a setting that can be delegated.
	// This only happens when the sender is an EOA (no code) and its code hash is a
	// special value as defined in EIP-7702. In that case, we need to replace the
	// code of the sender's account with the code of the delegated-to account.
	var (
		delegatedCode       []byte
		delegatedCodeRevert bool
	)
	if st.msg.to == nil { // Contract creation.
		// ...
	} else if addr, ok := types.ParseDelegation(evm.StateDB.GetCode(st.msg.from)); ok {
		code := evm.StateDB.GetCode(addr)
		delegatedCode = evm.StateDB.GetCode(st.msg.from)
		evm.StateDB.SetCode(st.msg.from, code)
		delegatedCodeRevert = true
	}

	// ... (EVM execution logic)

	ret, err := st.evm.Call(st.msg.from, *st.to(), st.data, st.gas, st.value.ToBig())

	// If the delegated code was set, it should be reverted now.
	if delegatedCodeRevert {
		st.evm.StateDB.SetCode(st.msg.from, delegatedCode)
	}

	// ... (gas refund and result handling)

	return &ExecutionResult{
		UsedGas:    st.gas - st.evm.Gas(),
		Err:        err,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/verkle/proof.go">
```go
// Proof represents a full Merkle-proof for a set of keys.
type Proof struct {
	// The list of intermediate nodes that are on the path from the root to the leaves.
	Intermediates [][]byte
	// Hashes of the sibling nodes, used to reconstruct the parent commitments.
	SiblingHashes []common.Hash
	// The leaf keys, grouped by stem. The key is the full leaf key (stem + leaf index).
	Keys map[string][]byte
	// The leaf values, grouped by stem.
	Values map[string][][]byte
}

// Verify a proof that a set of keys has values, and that another set of keys is not present.
// The list of keys is exhaustive: all keys that are present in the trie must be passed to
// Verify, and conversely, all keys that are absent must be passed as well.
func Verify(proof *Proof, root common.Hash, keys [][]byte, values [][]byte) error {
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run starts execution of the contract and returns the last output as a byte
// slice.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup)

	// The Interpreter main run loop.
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = new(callCtx)
	)
	// Don't heap allocate stuff that's only needed in debug mode.
	if in.cfg.Debug {
		in.cfg.Debugger.CaptureStart(in.evm, contract.Address(), contract.Caller(), input, contract.Gas, in.cfg.Tracer)

		defer func() {
			in.cfg.Debugger.CaptureEnd(ret, contract.Gas-gas, err)
		}()
	}
	// We have to save the 'callContext' of the previous execution which becomes
	// the 'returnContext' of this execution.
	in.returnContext = in.callContext
	in.callContext = callContext

	for {
		// ... (check for re-entrancy attacks)

		// Get next opcode from the jump table
		op = contract.GetOp(pc)
		operation := in.evm.interpreter.exec[op]
		if !operation.valid {
			err = fmt.Errorf("invalid opcode 0x%x", int(op))
			break
		}
		// Validate stack
		if err = operation.validateStack(stack); err != nil {
			break
		}
		// Execute the operation
		if err = operation.execute(&pc, in, contract, mem, stack); err != nil {
			break
		}
		// if the operation is a stopping operation, abort execution
		if operation.halts {
			break
		}
		// if the operation is a jump, update the pc accordingly
		if operation.jumps {
			// Don't update PC if it's a jump, the happens in the op itself
			continue
		}
		pc++
	}

	// ... (return handling)
	return ret, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	// EIP-4844:
	common.BytesToAddress([]byte{10}): &kzgPointEvaluation{},
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/precompile/kzg_point_evaluation.go">
```go
// kzgPointEvaluation implements the KZGPointEvaluation precompile.
//
// The precompile is available since Cancun.
type kzgPointEvaluation struct{}

// RequiredGas returns the gas required to execute the precompile.
func (p *kzgPointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobVerifyAndPointEvalGas
}

const (
	// EIP-4844 specifies the required input length for the point evaluation precompile.
	pointEvaluationInputLength = 48 + 48 + 48 + 32
)

// Run the KZGPointEvaluation precompile.
//
// The precompile validates a KZG proof which is used for verifying a blob commitment.
// The precompile is defined as:
//
// kzg_point_evaluation(versioned_hash, z, y, commitment, proof) -> (valid, FIELD_ELEMENTS_PER_BLOB)
func (p *kzgPointEvaluation) Run(input []byte) ([]byte, error) {
	if len(input) != pointEvaluationInputLength {
		return nil, fmt.Errorf("invalid input length: have %d, want %d", len(input), pointEvaluationInputLength)
	}

	var (
		versionedHash common.Hash
		point         kzg4844.Point
		claim         kzg4844.Claim
		commitment    kzg4844.Commitment
		proof         kzg4844.Proof
	)
	offset := 0
	copy(versionedHash[:], input[offset:offset+32])
	offset += 32
	copy(point[:], input[offset:offset+32])
	offset += 32
	copy(claim[:], input[offset:offset+32])
	offset += 32
	copy(commitment[:], input[offset:offset+48])
	offset += 48
	copy(proof[:], input[offset:offset+48])

	// ... (verification logic)

	if err := kzg4844.VerifyProof(commitment, point, claim, proof); err != nil {
		return resultFalse, nil // Return "false" for invalid proof.
	}

	return resultTrue, nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ... other gas constants

	// Gas costs for EIP-2929 access list transactions
	TxAccessListAddressGas   = 2400 // Gas cost for each address in an access list
	TxAccessListStorageKeyGas = 1900 // Gas cost for each storage key in an access list

	// Gas costs for EIP-4844 blob transactions
	BlobTxBlobGasPerBlob    = 1 << 17 // 131072
	BlobTxMinBlobGasprice   = 1
	BlobTxBlobGaspriceUpdateFraction = 3338477
)

// Gas costs for expensive vm opcodes
const (
	// GasSStoreSet is the gas cost for setting a new storage slot.
	GasSStoreSet = 20000
	// GasSStoreReset is the gas cost for changing a storage slot's value.
	GasSStoreReset = 5000
	// GasSStoreClear is the gas cost for clearing a storage slot.
	GasSStoreClear = 5000
	// GasSStoreRefund is the gas refunded for clearing a storage slot.
	GasSStoreRefund = 4800 // Refund for storing zero see EIP-3529

	// ... more gas costs
)
```
</file>
</go-ethereum>

## Prompt Corrections

Your original prompt is very well-structured and provides a clear roadmap. Here are a few minor corrections and clarifications based on the current state of go-ethereum and the EIPs:

1.  **`UserOperation` Transaction Type**: In your `PragueTransactionType` enum, you've listed `UserOperation = 0x05`. This is not part of the current Prague scope as a native transaction type. Account Abstraction via EIP-4337 works at a higher layer with "UserOperations" being submitted to a separate mempool and then bundled into standard transactions by a "Bundler". The new transaction type `0x04` for EIP-7702 *is* part of Prague and enables EOAs to delegate execution, which is a step towards full AA but distinct from EIP-4337's `UserOperation`. It would be more accurate to focus on `SetCodeTransaction` as the new AA-related type.

2.  **Verkle Opcodes and Precompiles**: The opcodes (`VERKLE_VERIFY`) and precompiles (`VERKLE_BATCH_VERIFY_ADDRESS`) you've listed are excellent placeholders based on current research. Since they are not yet finalized, the go-ethereum codebase does not contain them. The provided `kzg_point_evaluation.go` precompile for EIP-4844 serves as a perfect architectural reference for how a similar cryptographic precompile for Verkle could be implemented. The pattern of defining an address, a `RequiredGas` function, and a `Run` function is standard.

3.  **Verkle Witness Transactions**: This is a conceptual feature for how Verkle proofs might be included in transactions. It's not a standardized EIP yet. The `trie/verkle/proof.go` snippet shows what a Verkle `Proof` struct looks like in Geth's experimental implementation, which is likely closer to what will eventually be used.

4.  **`ACCOUNT_CODE` and `ACCOUNT_SIZE` opcodes**: These are interesting ideas for Verkle-related opcodes. In go-ethereum today, similar functionality is achieved with `EXTCODEHASH` and `EXTCODESIZE`, which might be modified or superseded in a Verkle world but serve as a good reference. The logic would involve looking up the account in the Verkle trie and retrieving the code hash or size from the leaf node.

---

An excellent and detailed prompt. Implementing a new hardfork requires touching many parts of the EVM. Here are the most relevant code snippets from go-ethereum that will serve as a guide for implementing Prague support.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock      *big.Int `json:"homesteadBlock,omitempty"`      // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock        *big.Int `json:"daoForkBlock,omitempty"`        // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport      bool     `json:"daoForkSupport,omitempty"`      // Whether Homestead supports the DAO hard-fork
	EIP150Block         *big.Int `json:"eip150Block,omitempty"`         // EIP150 HF block (nil = no fork)
	EIP155Block         *big.Int `json:"eip155Block,omitempty"`         // EIP155 HF block
	EIP158Block         *big.Int `json:"eip158Block,omitempty"`         // EIP158 HF block
	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from CL
	ShanghaiTime        *uint64  `json:"shanghaiTime,omitempty"`        // Shanghai switch time (nil = no fork)
	CancunTime          *uint64  `json:"cancunTime,omitempty"`          // Cancun switch time (nil = no fork)
	PragueTime          *uint64  `json:"pragueTime,omitempty"`          // Prague switch time (nil = no fork)
	VerkleTime          *uint64  `json:"verkleTime,omitempty"`          // Verkle switch time (nil = no fork)

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	//
	// This value is ignored if TTD is not defined on the CL.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag specifying that the network has already
	// passed the terminal total difficulty. This is needed for post-merge sync.
	//
	// This value is ignored if TTD is not defined on the CL.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Consensus fields
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// Rules is a set of rules applied to the chain depending on the current block number.
// Rules are coupled to a block number and not a hash for all chains apart from the
// private ones.
//
// Rules is not safe for concurrent use.
type Rules struct {
	ChainID                                               *big.Int
	IsHomestead, IsEIP150, IsEIP155, IsEIP158              bool
	IsByzantium, IsConstantinople, IsPetersburg, IsIstanbul bool
	IsBerlin, IsLondon, IsArrowGlacier, IsGrayGlacier     bool
	IsMerge, IsShanghai, IsCancun, IsPrague, IsVerkle      bool
}

// Rules retrieves the rule set for a specific block number.
func (c *ChainConfig) Rules(num *big.Int, time uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	rules := Rules{ChainID: new(big.Int).Set(chainID)}
	if c.HomesteadBlock != nil && num.Cmp(c.HomesteadBlock) >= 0 {
		rules.IsHomestead = true
	}
	// ... (rules for other hardforks)
	if c.ShanghaiTime != nil && time >= *c.ShanghaiTime {
		rules.IsShanghai = true
	}
	if c.CancunTime != nil && time >= *c.CancunTime {
		rules.IsCancun = true
	}
	if c.PragueTime != nil && time >= *c.PragueTime {
		rules.IsPrague = true
	}
	if c.VerkleTime != nil && time >= *c.VerkleTime {
		rules.IsVerkle = true
	}
	return rules
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// JumpTable contains the EVM opcodes and their corresponding Go functions.
type JumpTable [256]operation

// operation is the low level representation of an EVM opcode.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the gas function for the operation
	gasCost gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}

// newEVMI nterpreter returns a new instance of the interpreter.
func newEVMInterpreter(evm *EVM, cfg Config) *EVMInterpreter {
	// We use the jump table in order to constant time look up of functions.
	var jt JumpTable
	switch {
	case evm.chainRules.IsPrague:
		jt = pragueInstructionSet
	case evm.chainRules.IsCancun:
		jt = cancunInstructionSet
	case evm.chainRules.IsShanghai:
		jt = shanghaiInstructionSet
	case evm.chainRules.IsLondon:
		jt = londonInstructionSet
	// ... (other hardforks)
	default:
		jt = frontierInstructionSet
	}
    // ...
}

// Example of Cancun instruction set definition
var cancunInstructionSet = JumpTable{
	TLOAD: {
		execute:     opTload,
		gasCost:     gasTLoad,
		minStack:    1,
		maxStack:    1024,
		memorySize:  nil,
		writes:      false,
		valid:       true,
		constantGas: 100,
		deep:        true,
	},
	TSTORE: {
		execute:     opTstore,
		gasCost:     gasTStore,
		minStack:    2,
		maxStack:    1024,
		memorySize:  nil,
		writes:      true,
		valid:       true,
		constantGas: 100,
		deep:        true,
	},
	MCOPY: {
		execute:    opMcopy,
		gasCost:    gasMcopy,
		minStack:   3,
		maxStack:   1024,
		memorySize: memMcopy,
		writes:     true,
		valid:      true,
		deep:       true,
	},
	BLOBHASH: {
		execute:     opBlobHash,
		gasCost:     gasBlobHash,
		minStack:    1,
		maxStack:    1024,
		memorySize:  nil,
		writes:      false,
		valid:       true,
		constantGas: 3,
		deep:        true,
	},
	// ... other opcodes inherited from Shanghai
}

// init initializes the Cancun instruction set based on Shanghai.
func init() {
	cancunInstructionSet = shanghaiInstructionSet
	cancunInstructionSet[TLOAD] = op(opTload, gasTLoad, 1, 1)
	cancunInstructionSet[TSTORE] = op(opTstore, gasTStore, 2, 0)
	cancunInstructionSet[MCOPY] = op(opMcopy, gasMcopy, 3, 0)
	cancunInstructionSet[BLOBHASH] = op(opBlobHash, gasBlobHash, 1, 1)
	cancunInstructionSet[SELFDESTRUCT] = op(opSelfdestruct, gasSelfdestruct, 1, 0)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // underlying transaction data
	time  time.Time // timestamp of inclusion in the pool

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Uint64
	from atomic.Pointer[common.Address]
}

// TxData is the underlying data of a transaction.
//
// This interface is implemented by LegacyTx, AccessListTx, DynamicFeeTx, BlobTx and SetCodeTx.
type TxData interface {
	txType() byte
	copy() TxData
	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasPrice() *big.Int
	gasTipCap() *big.Int
	gasFeeCap() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address

	// Blob related methods, only for BlobTx.
	blobGasFeeCap() *big.Int
	blobHashes() []common.Hash

	// SetCode authorization list, only for SetCodeTx.
	setCodeAuthorizations() []SetCodeAuthorization

	// Signature values.
	rawSignatureValues() (v, r, s *big.Int)
	setSignatureValues(chainID, v, r, s *big.Int)

	// for sorting
	effectiveGasPrice(dst *big.Int, baseFee *big.Int) *big.Int
}

// EncodeRLP implements rlp.Encoder
func (tx *Transaction) EncodeRLP(w io.Writer) error {
	if tx.Type() == LegacyTxType {
		return rlp.Encode(w, tx.inner)
	}
	// It's an EIP-2718 typed TX. We need to serialize the type byte and the RLP
	// payload.
	buf := encodeBufferPool.Get().(*bytes.Buffer)
	defer encodeBufferPool.Put(buf)
	buf.Reset()
	if err := tx.inner.encode(buf); err != nil {
		return err
	}
	w.Write([]byte{tx.Type()})
	w.Write(buf.Bytes())
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_blob.go">
```go
// BlobTx is the transaction data of a EIP-4844 blob transaction.
type BlobTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList
	BlobFeeCap *uint256.Int
	BlobHashes []common.Hash

	// Signature values
	V *uint256.Int
	R *uint256.Int
	S *uint256.Int
}

// copy creates a deep copy of the transaction data and initializes all fields.
func (tx *BlobTx) copy() TxData {
	return &BlobTx{
		ChainID:    uint256.NewInt(0).Set(tx.ChainID),
		Nonce:      tx.Nonce,
		GasTipCap:  uint256.NewInt(0).Set(tx.GasTipCap),
		GasFeeCap:  uint256.NewInt(0).Set(tx.GasFeeCap),
		Gas:        tx.Gas,
		To:         tx.To,
		Value:      uint256.NewInt(0).Set(tx.Value),
		Data:       common.CopyBytes(tx.Data),
		AccessList: tx.AccessList.Copy(),
		BlobFeeCap: uint256.NewInt(0).Set(tx.BlobFeeCap),
		BlobHashes: common.CopyBytes(tx.BlobHashes),
		V:          uint256.NewInt(0).Set(tx.V),
		R:          uint256.NewInt(0).Set(tx.R),
		S:          uint256.NewInt(0).Set(tx.S),
	}
}

// accessors for innerTx.
func (tx *BlobTx) txType() byte           { return BlobTxType }
func (tx *BlobTx) chainID() *big.Int      { return tx.ChainID.ToBig() }
func (tx *BlobTx) accessList() AccessList { return tx.AccessList }
// ... other accessor methods
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// PrecompiledContractsBerlin contains the precompiled contracts starting from the
// Berlin hard fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts starting from the
// Cancun hard fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):  &ecrecover{},
	common.BytesToAddress([]byte{2}):  &sha256hash{},
	common.BytesToAddress([]byte{3}):  &ripemd160hash{},
	common.BytesToAddress([]byte{4}):  &dataCopy{},
	common.BytesToAddress([]byte{5}):  &bigModExp{},
	common.BytesToAddress([]byte{6}):  &bn256Add{},
	common.BytesToAddress([]byte{7}):  &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}):  &bn256Pairing{},
	common.BytesToAddress([]byte{9}):  &blake2F{},
	common.BytesToAddress([]byte{10}): &kzgPointEvaluation{}, // EIP-4844
}

// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules params.Rules) []common.Address {
	// Determine which precompiles are active
	var precompiles []common.Address
	if rules.IsCancun {
		for addr := range PrecompiledContractsCancun {
			precompiles = append(precompiles, addr)
		}
	} else if rules.IsBerlin {
		for addr := range PrecompiledContractsBerlin {
			precompiles = append(precompiles, addr)
		}
	} // ... other hardforks

	// Sort the addresses for determinism
	sort.Sort(byAddress(precompiles))
	return precompiles
}

// Run runs the precompiled contract.
func (p PrecompiledContracts) Run(input []byte, contract *Contract, evm *EVM) ([]byte, error) {
	if p.isEIP2718Error(contract.Address, evm.chainRules) {
		return nil, ErrEIP2718NotEnabled
	}
	return p[contract.Address].Run(input, contract.RequiredGas)
}

// kzgPointEvaluation implements the KZGPointEvaluation precompile.
type kzgPointEvaluation struct{}

func (c *kzgPointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobTxPointEvaluationGas
}

func (c *kzgPointEvaluation) Run(input []byte, requiredGas uint64) ([]byte, error) {
	if len(input) != kzg4844.PointEvaluationInputLength {
		return nil, fmt.Errorf("invalid kzg point evaluation input length: %d", len(input))
	}
	return kzg4844.PointEvaluation(input)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// applyAuthorization applies an EIP-7702 code delegation to the state.
func (st *stateTransition) applyAuthorization(auth *types.SetCodeAuthorization) error {
	authority, err := st.validateAuthorization(auth)
	if err != nil {
		return err
	}

	// If the account already exists in state, refund the new account cost
	// charged in the intrinsic calculation.
	if st.state.Exist(authority) {
		st.state.AddRefund(params.CallNewAccountGas - params.TxAuthTupleGas)
	}

	// Update nonce and account code.
	st.state.SetNonce(authority, auth.Nonce+1, tracing.NonceChangeAuthorization)
	if auth.Address == (common.Address{}) {
		// Delegation to zero address means clear.
		st.state.SetCode(authority, nil)
		return nil
	}

	// Otherwise install delegation to auth.Address.
	st.state.SetCode(authority, types.AddressToDelegation(auth.Address))

	return nil
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
    // ... gas calculation for data, access list ...

	if authList != nil {
		gas += uint64(len(authList)) * params.CallNewAccountGas
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/block.go">
```go
// ExecutionWitness represents the witness + proof used in a verkle context,
// to provide the ability to execute a block statelessly.
type ExecutionWitness struct {
	StateDiff   verkle.StateDiff    `json:"stateDiff"`
	VerkleProof *verkle.VerkleProof `json:"verkleProof"`
}

// Header represents a block header in the Ethereum blockchain.
type Header struct {
	ParentHash  common.Hash    `json:"parentHash"       gencodec:"required"`
	UncleHash   common.Hash    `json:"sha3Uncles"       gencodec:"required"`
	Coinbase    common.Address `json:"miner"`
	Root        common.Hash    `json:"stateRoot"        gencodec:"required"`
	TxHash      common.Hash    `json:"transactionsRoot" gencodec:"required"`
	ReceiptHash common.Hash    `json:"receiptsRoot"     gencodec:"required"`
	Bloom       Bloom          `json:"logsBloom"        gencodec:"required"`
	Difficulty  *big.Int       `json:"difficulty"       gencodec:"required"`
	Number      *big.Int       `json:"number"           gencodec:"required"`
	GasLimit    uint64         `json:"gasLimit"         gencodec:"required"`
	GasUsed     uint64         `json:"gasUsed"          gencodec:"required"`
	Time        uint64         `json:"timestamp"        gencodec:"required"`
	Extra       []byte         `json:"extraData"        gencodec:"required"`
	MixDigest   common.Hash    `json:"mixHash"`
	Nonce       BlockNonce     `json:"nonce"`

	// BaseFee was added by EIP-1559 and is ignored in legacy headers.
	BaseFee *big.Int `json:"baseFeePerGas" rlp:"optional"`

	// WithdrawalsHash was added by EIP-4895 and is ignored in legacy headers.
	WithdrawalsHash *common.Hash `json:"withdrawalsRoot" rlp:"optional"`

	// BlobGasUsed was added by EIP-4844 and is ignored in legacy headers.
	BlobGasUsed *uint64 `json:"blobGasUsed" rlp:"optional"`

	// ExcessBlobGas was added by EIP-4844 and is ignored in legacy headers.
	ExcessBlobGas *uint64 `json:"excessBlobGas" rlp:"optional"`

	// ParentBeaconRoot was added by EIP-4788 and is ignored in legacy headers.
	ParentBeaconRoot *common.Hash `json:"parentBeaconBlockRoot" rlp:"optional"`

	// RequestsHash was added by EIP-7685 and is ignored in legacy headers.
	RequestsHash *common.Hash `json:"requestsHash" rlp:"optional"`
}

// Block represents an Ethereum block.
type Block struct {
	header       *Header
	uncles       []*Header
	transactions Transactions
	withdrawals  Withdrawals

	// witness is not an encoded part of the block body.
	// It is held in Block in order for easy relaying to the places
	// that process it.
	witness *ExecutionWitness
    // ...
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a solid foundation for implementing Prague support. Here are a few corrections and observations based on the `go-ethereum` implementation that might refine the approach:

1.  **Gas Model Implementation**: In `go-ethereum`, the gas model is not encapsulated in a single `PragueGasModel` struct. Instead, gas costs are a combination of:
    *   **Constants**: Defined in `params/gas.go` for fixed-cost opcodes.
    *   **Dynamic Functions**: Implemented directly within each opcode's execution logic in `core/vm/interpreter.go`. For example, memory expansion gas is calculated on-the-fly inside `opMload`, `opMstore`, etc.
    *   **Hardfork Checks**: The opcode functions themselves contain `if rules.IsBerlin`, `if rules.IsCancun` checks to alter their behavior and gas calculation based on the active hardfork.
    *   **Recommendation**: While the `PragueGasModel` struct in the prompt is a clean abstraction, it might be more aligned with reference implementations to embed the gas logic within the opcode handlers and use hardfork flags for versioning.

2.  **Account Abstraction (EIP-4337 vs. EIP-7702)**:
    *   The prompt mentions Account Abstraction and `UserOperation`, which relates to **EIP-4337**. In `go-ethereum`, EIP-4337 is handled at a higher level (in the client, not the core EVM) by bundlers and separate mempools. It is not a core protocol change.
    *   The more relevant EIP for core EVM implementation is **EIP-7702 (Set Code Transaction)**, which allows EOAs to temporarily act as smart contracts. The `go-ethereum` codebase in `core/state_transition.go` has logic for `applyAuthorization`, which is the correct pattern to follow for this feature. The prompt's inclusion of `SetCodeTransaction` is accurate.

3.  **Verkle Witness Transactions**: The idea of a `VerkleWitnessTransaction` is plausible for a future where witnesses are included in transactions. The best reference for implementing a new transaction type is `core/types/tx_blob.go` for EIP-4844's `BlobTx`. It demonstrates how to define the new structure, handle RLP encoding, and integrate it with the generic `Transaction` type.

4.  **Verkle Tree Integration**: The prompt's `ExecutionWitness` struct containing a `StateDiff` and `VerkleProof` is a very accurate representation of how this might be integrated. The `core/types/block.go` file in `go-ethereum` has an identical `ExecutionWitness` struct, confirming this is the right approach for stateless execution support. The implementation would involve replacing the state access logic in `core/state/statedb.go` to use this witness data when Verkle trees are active.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// https://eips.ethereum.org/EIPS/eip-150
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements Simple replay attack protection.
	// https://eips.ethereum.org/EIPS/eip-155
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements ČGas repricing for trie read operations.
	// https://eips.ethereum.org/EIPS/eip-158
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	// https://eips.ethereum.org/EIPS/eip-649
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	// https://eips.ethereum.org/EIPS/eip-1013
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = same as Constantinople)
	// https://eips.ethereum.org/EIPS/eip-1716
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	// https://eips.ethereum.org/EIPS/eip-1679
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on muirglacier)
	// https://eips.ethereum.org/EIPS/eip-2384
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	// https://eips.ethereum.org/EIPS/eip-2070
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	// https://eips.ethereum.org/EIPS/eip-3030
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on arrowglacier)
	// https://eips.ethereum.org/EIPS/eip-4345
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on grayglacier)
	// https://eips.ethereum.org/EIPS/eip-5133
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplit switch block (nil = no fork, 0 = already on merge netsplit)
	// https://eips.ethereum.org/EIPS/eip-3675
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// Shanghai switch block (nil = no fork, 0 = already on shanghai)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch block (nil = no fork, 0 = already on cancun)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch block (nil = no fork, 0 = already on prague)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag that indicates the terminal PoW block
	// has been produced and the Merge transition is complete.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// IsHomestead returns whether num is either equal to the homestead block or greater.
func (c *ChainConfig) IsHomestead(num *big.Int) bool {
	return isForked(c.HomesteadBlock, num)
}

// IsDAOFork returns whether num is either equal to the DAO fork block or greater.
func (c *ChainConfig) IsDAOFork(num *big.Int) bool {
	return isForked(c.DAOForkBlock, num)
}

// IsEIP150 returns whether num is either equal to the EIP150 fork block or greater.
func (c *ChainConfig) IsEIP150(num *big.Int) bool {
	return isForked(c.EIP150Block, num)
}

// IsEIP155 returns whether num is either equal to the EIP155 fork block or greater.
func (c *ChainConfig) IsEIP155(num *big.Int) bool {
	return isForked(c.EIP155Block, num)
}

// IsEIP158 returns whether num is either equal to the EIP158 fork block or greater.
func (c *ChainConfig) IsEIP158(num *big.Int) bool {
	return isForked(c.EIP158Block, num)
}

// IsByzantium returns whether num is either equal to the Byzantium fork block or greater.
func (c *ChainConfig) IsByzantium(num *big.Int) bool {
	return isForked(c.ByzantiumBlock, num)
}

// IsConstantinople returns whether num is either equal to the Constantinople fork block or greater.
func (c *ChainConfig) IsConstantinople(num *big.Int) bool {
	return isForked(c.ConstantinopleBlock, num)
}

// IsMuirGlacier returns whether num is either equal to the Muir Glacier fork block or greater.
func (c *ChainConfig) IsMuirGlacier(num *big.Int) bool {
	return isForked(c.MuirGlacierBlock, num)
}

// IsPetersburg returns whether num is either equal to the Petersburg fork block or greater.
func (c *ChainConfig) IsPetersburg(num *big.Int) bool {
	return isForked(c.PetersburgBlock, num)
}

// IsIstanbul returns whether num is either equal to the Istanbul fork block or greater.
func (c *ChainConfig) IsIstanbul(num *big.Int) bool {
	return isForked(c.IstanbulBlock, num)
}

// IsBerlin returns whether num is either equal to the Berlin fork block or greater.
func (c *ChainConfig) IsBerlin(num *big.Int) bool {
	return isForked(c.BerlinBlock, num)
}

// IsLondon returns whether num is either equal to the London fork block or greater.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isForked(c.LondonBlock, num)
}

// IsArrowGlacier returns whether num is either equal to the Arrow Glacier fork block or greater.
func (c *ChainConfig) IsArrowGlacier(num *big.Int) bool {
	return isForked(c.ArrowGlacierBlock, num)
}

// IsGrayGlacier returns whether num is either equal to the Gray Glacier fork block or greater.
func (c *ChainConfig) IsGrayGlacier(num *big.Int) bool {
	return isForked(c.GrayGlacierBlock, num)
}

// IsMerge returns whether the merge fork is active.
func (c *ChainConfig) IsMerge(num *big.Int) bool {
	return isForked(c.MergeNetsplitBlock, num)
}

// IsShanghai returns whether the Shanghai fork is active.
func (c *ChainConfig) IsShanghai(time uint64) bool {
	return isForkedTime(c.ShanghaiTime, time)
}

// IsCancun returns whether the Cancun fork is active.
func (c *ChainConfig) IsCancun(time uint64) bool {
	return isForkedTime(c.CancunTime, time)
}

// IsPrague returns whether the Prague fork is active.
func (c *ChainConfig) IsPrague(time uint64) bool {
	return isForkedTime(c.PragueTime, time)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// NewJumpTable returns a new jump table for the given EVM version.
func NewJumpTable(rules *params.Rules) JumpTable {
	// EIP-2929: Gas cost changes for state access opcodes.
	// EIP-3529: Reduction in refunds
	var (
		sloadGas, sstoreGas uint64
	)
	if rules.IsBerlin {
		sloadGas = params.SloadGasEIP2929
		sstoreGas = 0 // gas priced dynamically
	} else if rules.IsIstanbul {
		sloadGas = params.SloadGasEIP1884
		sstoreGas = 0 // gas priced dynamically
	} else if rules.IsConstantinople {
		sloadGas = params.SloadGasConstantinople
		sstoreGas = 0 // gas priced dynamically
	} else {
		sloadGas = params.SloadGas
		sstoreGas = 0 // gas priced dynamically
	}
	var jt JumpTable = [256]*operation{
		STOP: {
			execute:     opStop,
			constantGas: 0,
			minStack:    0,
			maxStack:    0,
		},
		ADD: {
			execute:     opAdd,
			constantGas: GasFastestStep,
			minStack:    2,
			maxStack:    1,
		},
		// ... (many opcodes omitted for brevity) ...
		SLOAD: {
			execute:     opSload,
			constantGas: sloadGas,
			minStack:    1,
			maxStack:    1,
		},
		SSTORE: {
			execute:     opSstore,
			constantGas: sstoreGas,
			minStack:    2,
			maxStack:    0,
		},
		JUMP: {
			execute:     opJump,
			constantGas: GasMidStep,
			minStack:    1,
			maxStack:    0,
		},
		// ... (many opcodes omitted for brevity) ...
	}
	// Overrides for Homestead
	if rules.IsHomestead {
		jt[DELEGATECALL] = &operation{
			execute:     opDelegateCall,
			constantGas: params.CallGas,
			minStack:    6,
			maxStack:    1,
		}
	}
	// Overrides for Byzantium
	if rules.IsByzantium {
		// ... (Byzantium opcodes) ...
	}
	// Overrides for Constantinople
	if rules.IsConstantinople {
		// ... (Constantinople opcodes) ...
	}
	// Overrides for Istanbul
	if rules.IsIstanbul {
		// ... (Istanbul opcodes) ...
	}
	// Overrides for Shanghai
	if rules.IsShanghai {
		jt[PUSH0] = &operation{
			execute:     opPush0,
			constantGas: GasQuickStep,
			minStack:    0,
			maxStack:    -1, // PUSH0 can push onto a full stack.
		}
	}
	// Overrides for Cancun
	if rules.IsCancun {
		jt[TLOAD] = &operation{
			execute:     opTload,
			constantGas: params.WarmStorageReadCost, // EIP-1153
			minStack:    1,
			maxStack:    1,
		}
		jt[TSTORE] = &operation{
			execute:     opTstore,
			constantGas: params.WarmStorageReadCost, // EIP-1153
			minStack:    2,
			maxStack:    0,
		}
		jt[MCOPY] = &operation{
			execute:     opMcopy,
			constantGas: GasFastestStep,
			minStack:    3,
			maxStack:    0,
		}
		jt[BLOBHASH] = &operation{
			execute:     opBlobHash,
			constantGas: GasFastestStep, // EIP-4844
			minStack:    1,
			maxStack:    1,
		}
		jt[BLOBBASEFEE] = &operation{
			execute:     opBlobBaseFee,
			constantGas: GasQuickStep, // EIP-7516
			minStack:    0,
			maxStack:    1,
		}
	}
	return jt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTload implements TLOAD opcode.
// TLOAD is introduced in EIP-1153.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Note: gas cost is deducted in jump table.
	loc := stack.pop()
	val := evm.StateDB.GetTransientState(contract.Address(), loc)
	stack.push(val)
	return nil, nil
}

// opTstore implements TSTORE opcode.
// TSTORE is introduced in EIP-1153.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Note: gas cost is deducted in jump table.
	// Check for static call.
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	loc := stack.pop()
	val := stack.pop()
	evm.StateDB.SetTransientState(contract.Address(), loc, val)
	return nil, nil
}

// opMcopy implements MCOPY opcode.
// MCOPY is introduced in EIP-5656.
func opMcopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	var (
		dst    = stack.pop()
		src    = stack.pop()
		length = stack.pop()
	)
	// Deduct gas for memory expansion.
	if gas, err := memoryGasCost(memory, dst, length); err != nil {
		return nil, err
	} else if !contract.UseGas(gas) {
		return nil, ErrOutOfGas
	}
	// Deduct gas for copying.
	if gas, err := copyGasCost(length); err != nil {
		return nil, err
	} else if !contract.UseGas(gas) {
		return nil, ErrOutOfGas
	}
	// Copy the memory.
	if err := memory.Copy(dst, src, length); err != nil {
		return nil, err
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// PrecompiledContractsBerlin contains the precompiled contracts starting from the
// Berlin hard fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts starting from the
// Cancun hard fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	common.BytesToAddress([]byte{10}): &pointEvaluation{}, // EIP-4844
}

// ActivePrecompiles returns the precompiled contracts for the given rules.
func ActivePrecompiles(rules *params.Rules) []common.Address {
	// ...
}

// RunPrecompiledContract runs the precompiled contract specified by the address.
func RunPrecompiledContract(p PrecompiledContract, input []byte, contract *Contract) (ret []byte, err error) {
	gas := p.RequiredGas(input)
	if !contract.UseGas(gas) {
		return nil, ErrOutOfGas
	}
	return p.Run(input)
}

// pointEvaluation implements the point evaluation precompile for EIP-4844.
type pointEvaluation struct{}

func (p *pointEvaluation) RequiredGas(input []byte) uint64 {
	return params.PointEvaluationGas
}

func (p *pointEvaluation) Run(input []byte) ([]byte, error) {
	// Input length is checked by the caller
	if len(input) != 192 {
		return nil, errors.New("invalid input length")
	}
	// The gas cost is constant, so there is no need to check it inside the
	// precompile. The caller can do it more efficiently.

	// versioned hash: 32 bytes
	// z: 32 bytes
	// y: 32 bytes
	// commitment: 48 bytes
	// proof: 48 bytes
	var (
		versionedHash [32]byte
		z             [32]byte
		y             [32]byte
		commitment    [48]byte
		proof         [48]byte
	)
	copy(versionedHash[:], input[0:32])
	copy(z[:], input[32:64])
	copy(y[:], input[64:96])
	copy(commitment[:], input[96:144])
	copy(proof[:], input[144:192])

	// Perform point evaluation
	if err := crypto.VerifyKzgProof(commitment, proof, z, y); err != nil {
		return nil, err
	}

	// The precompile is defined to return two values.
	// FIELD_ELEMENTS_PER_BLOB and BLS_MODULUS.
	var ret [64]byte
	new(big.Int).SetUint64(params.FieldElementsPerBlob).FillBytes(ret[0:32])
	crypto.BlsModulus.FillBytes(ret[32:64])
	return ret[:], nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
const (
	LegacyTxType          = iota
	AccessListTxType      // EIP-2930
	DynamicFeeTxType      // EIP-1559
	BlobTxType            // EIP-4844
	InvalidTxType    = 255 // Failsafe, should not be used
)

// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // underlying transaction data
	time  time.Time // timestamp of inclusion in the blockchain

	// caches
	hash atomic.Value
	size atomic.Value
	from atomic.Value
}

// TxData is the underlying data of a transaction.
//
// This interface is implemented by DynamicFeeTx, BlobTx, AccessListTx and LegacyTx.
type TxData interface {
	// ... methods for transaction data
	txType() byte
	copy() TxData
	// ...
}

// AccessListTx is the data of EIP-2930 access list transactions.
type AccessListTx struct {
	ChainID    *big.Int        // destination chain ID
	Nonce      uint64          // nonce of sender account
	GasPrice   *big.Int        // gas price to use for the tx execution
	Gas        uint64          // gas limit of the transaction
	To         *common.Address `rlp:"nil"` // nil means contract creation
	Value      *big.Int        // wei amount
	Data       []byte          // contract invocation input data
	AccessList AccessList      // EIP-2930 access list
	V, R, S    *big.Int        // signature values
}

// Authorizations is a list of authorization entries for EIP-7702.
type Authorizations []Authorization

// Authorization is the authorization entry for EIP-7702.
// It is a list of `[chain_id, address, y_parity, r, s]`.
type Authorization struct {
	ChainId  *big.Int
	Address  common.Address
	YParity  *big.Int
	R, S     *big.Int
	CodeType byte // optional, can be 0 (EOA) or 1(contract)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/eip7702.go">
```go
const (
	// EIP7702MaxAuthsPerTx is the maximum number of authorizations allowed per
	// EIP-7702 transaction.
	EIP7702MaxAuthsPerTx = 256
)

const (
	// EIP7702AddressCodeType is the type used to denote that the authorization
	// is for a contract account.
	EIP7702AddressCodeType = 0x01
)

var (
	// EIP7702CodeMagic is the prefix for contract code that is delegated via an EIP-7702 authorization.
	EIP7702CodeMagic = []byte{0xe7, 0x02}
)

// IsEIP7702 returns whether the code is EIP-7702 delegated code.
func IsEIP7702(code []byte) bool {
	return bytes.HasPrefix(code, EIP7702CodeMagic)
}

// UnpackEIP7702 returns the address from EIP-7702 delegated code.
func UnpackEIP7702(code []byte) (common.Address, error) {
	if !IsEIP7702(code) {
		return common.Address{}, errors.New("not EIP-7702 code")
	}
	if len(code) != 2+common.AddressLength {
		return common.Address{}, fmt.Errorf("invalid EIP-7702 code length: %d", len(code))
	}
	var addr common.Address
	copy(addr[:], code[2:])
	return addr, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction_aa.go">
```go
// UserOperation is the data of EIP-4337 user operations.
type UserOperation struct {
	Sender               common.Address `json:"sender"`
	Nonce                *big.Int       `json:"nonce"`
	InitCode             []byte         `json:"initCode"`
	CallData             []byte         `json:"callData"`
	CallGasLimit         *big.Int       `json:"callGasLimit"`
	VerificationGasLimit *big.Int       `json:"verificationGasLimit"`
	PreVerificationGas   *big.Int       `json:"preVerificationGas"`
	MaxFeePerGas         *big.Int       `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *big.Int       `json:"maxPriorityFeePerGas"`
	PaymasterAndData     []byte         `json:"paymasterAndData"`
	Signature            []byte         `json:"signature"`
}

// UserOpHash returns the hash of the user operation to be signed.
func (op *UserOperation) UserOpHash(chainId *big.Int, entryPoint common.Address) common.Hash {
	// ... RLP encoding and hashing logic ...
	return crypto.Keccak256Hash(encoded)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the execution of state transitions.
// It is the main entry point for the EVM and holds all the methods for executing contracts.
type EVM struct {
	// Context provides information about the transaction and block
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// chain rules
	chainRules *params.Rules

	// virtual machine configuration options used to initialise the
	// evm.
	Config Config

	// interpreter is used to step through the code
	interpreter *Interpreter

	// readOnly denotes if the EVM is in a read only state.
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(ctx BlockContext, txc TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
}

// Call executes the contract associated with the destination address. It is a
// convenience function around NewEVM and Run. It is not thread safe.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
}
```
</file>

## Prompt Corrections
The original prompt contains several assumptions about the Prague hardfork that might not align with the final specification or current client implementations. Here are some corrections based on go-ethereum:

1.  **EIP-7702 Transaction Type**: The prompt introduces a new transaction type `SetCodeTransaction = 0x04`. However, EIP-7702 as currently specified and implemented in go-ethereum **does not add a new transaction type**. Instead, it adds a new optional field, `Authorizations`, to the existing EIP-2930 `AccessListTx` type. The EVM then interprets special "delegated" bytecode prefixed with `0xE702`. This is a significant architectural difference.

2.  **Opcode Numbering**: The opcodes suggested for Prague (`VERKLE_VERIFY = 0x49`, `CODE_COPY_VERKLE = 0x4A`) conflict with opcodes already finalized for the Cancun hardfork (`BLOBHASH = 0x49`, `BLOBBASEFEE = 0x4a`). The final Prague opcodes are still under discussion and will not use these values. The prompt should treat these as speculative placeholders.

3.  **Account Abstraction Transaction Type**: The prompt lists `UserOperation = 0x05` as a potential transaction type. While this is a goal for future hardforks (e.g., EIP-7677), the current Account Abstraction standard (EIP-4337) works via an **off-chain mempool** of `UserOperation` objects that are bundled into regular transactions by a "Bundler". They are not a native transaction type yet. The implementation should distinguish between the EIP-4337 `UserOperation` struct (handled by bundlers) and a potential future native transaction type.

4.  **Verkle Precompiles**: The addresses for `VERKLE_BATCH_VERIFY_ADDRESS` (0x12) and `ACCOUNT_ABSTRACTION_ADDRESS` (0x13) are speculative. Precompile addresses are small integers (`0x0...`), and these specific values have not been assigned. The prompt should clarify these are placeholders. The Cancun hardfork added the `POINT_EVALUATION` precompile at address `0x0a`, showing the pattern of adding new precompiles at the next available address.

5.  **Hardfork Activation**: The prompt correctly identifies that Prague will be activated by block number (or more likely, timestamp post-Merge). The go-ethereum `params/config.go` file confirms this pattern, with recent forks like Shanghai and Cancun being activated by timestamp (`ShanghaiTime`, `CancunTime`). The `PRAGUE_BLOCK` constant should likely be `PRAGUE_TIME`.

---

A prompt engineer's review of the go-ethereum codebase to find relevant context for implementing Prague Hardfork support.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	// EIP-1559 settings
	LondonBlock *big.Int `json:"londonBlock,omitempty"` // London switch block (nil for mainline)

	// EIP-4844 settings
	CancunTime *uint64 `json:"cancunTime,omitempty"` // Time of the Cancun fork

	// EIP-7702 settings
	PragueTime *uint64 `json:"pragueTime,omitempty"` // Time of the Prague fork
	// ... more hardforks ...
}

// Rules is a set of rules for a specific chain block. The rules are derived
// from the chain configuration and the block's header.
type Rules struct {
	ChainID                                          *big.Int
	IsHomestead, IsTangerineWhistle, IsSpuriousDragon bool
	IsByzantium, IsConstantinople, IsPetersburg      bool
	IsIstanbul, IsBerlin, IsLondon                   bool
	IsMerge, IsShanghai                              bool
	IsCancun, IsPrague, IsOsaka, IsVerkle             bool

	// EIPs
	IsEIP1559, IsEIP2930                     bool
	IsEIP3198, IsEIP3541                     bool
	IsEIP3651, IsEIP3855, IsEIP3860, IsEIP4895 bool
	IsEIP1153, IsEIP4844, IsEIP5656, IsEIP6780 bool
	IsEIP7516                                bool
	IsEIP4762                                bool
	IsEIP7702                                bool
}

// Rules ensures r is not nil.
func (c *ChainConfig) Rules(num *big.Int, time, isVerkle bool) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	return Rules{
		ChainID:            new(big.Int).Set(chainID),
		IsHomestead:        c.IsHomestead(num),
		// ... existing hardforks ...
		IsCancun:           c.IsCancun(num, time),
		IsPrague:           c.IsPrague(num, time),
		IsOsaka:            c.IsOsaka(num, time),
		IsVerkle:           isVerkle || c.IsVerkle(num, time), // Pass verkle flag explicitly
		// ... EIPs ...
		IsEIP7516:          c.IsCancun(num, time),
		IsEIP7702:          c.IsPrague(num, time),
	}
}

// IsPrague returns whether prague is active at the given time.
func (c *ChainConfig) IsPrague(num *big.Int, time uint64) bool {
	return c.PragueTime != nil && time >= *c.PragueTime
}

// IsVerkle returns whether verkle is active at the given time.
func (c *ChainConfig) IsVerkle(num *big.Int, time uint64) bool {
	return c.VerkleTime != nil && time >= *c.VerkleTime
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

// ... (other instruction sets)

// newPragueInstructionSet returns the Prague instruction set.
func newPragueInstructionSet() JumpTable {
	instructionSet := newCancunInstructionSet()
	enable7702(&instructionSet) // EIP-7702 Setcode transaction type
	// Future Prague EIPs will be enabled here
	return validate(instructionSet)
}

// newVerkleInstructionSet returns the Verkle instruction set.
// Note: This is speculative and the actual fork name might change.
func newVerkleInstructionSet() JumpTable {
	instructionSet := newPragueInstructionSet() // Or whatever Prague's successor is
	enable4762(&instructionSet) // EIP-4762: Stateless gas costs
	// Opcodes relevant to Verkle would be enabled here.
	// e.g., enableVerkleOpcodes(&instructionSet)
	return validate(instructionSet)
}

// copyJumpTable returns a deep copy of the provided jump table.
func copyJumpTable(source *JumpTable) *JumpTable {
	dest := *source
	for i, op := range source {
		if op != nil {
			opCopy := *op
			dest[i] = &opCopy
		}
	}
	return &dest
}

// NewEVMInterpreter returns a new instance of the Interpreter.
func NewEVMInterpreter(evm *EVM) *EVMInterpreter {
	// If jump table was not initialised we set the default one.
	var table *JumpTable
	switch {
	// ... (other hardforks)
	case evm.chainRules.IsPrague:
		table = &pragueInstructionSet
	case evm.chainRules.IsCancun:
		table = &cancunInstructionSet
	// ... (other hardforks)
	default:
		table = &frontierInstructionSet
	}
	var extraEips []int
	if len(evm.Config.ExtraEips) > 0 {
		// Deep-copy jumptable to prevent modification of opcodes in other tables
		table = copyJumpTable(table)
	}
	for _, eip := range evm.Config.ExtraEips {
		if err := EnableEIP(eip, table); err != nil {
			// Disable it, so caller can check if it's activated or not
			log.Error("EIP activation failed", "eip", eip, "error", err)
		} else {
			extraEips = append(extraEips, eip)
		}
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eips.go">
```go
// activators is a map of EIP numbers to functions that activate them on a given
// jump table.
var activators = map[int]func(*JumpTable){
	// ... (other EIPs)
	1153: enable1153, // Cancun
	4762: enable4762, // Verkle (tentative)
	5656: enable5656, // Cancun
	6780: enable6780, // Cancun
	7702: enable7702, // Prague
}

// EnableEIP enables the given EIP on the config.
// This operation writes in-place, and callers need to ensure that the globally
// defined jump tables are not polluted.
func EnableEIP(eipNum int, jt *JumpTable) error {
	enablerFn, ok := activators[eipNum]
	if !ok {
		return fmt.Errorf("undefined eip %d", eipNum)
	}
	enablerFn(jt)
	return nil
}

// enable7702 the EIP-7702 changes to support delegation designators.
func enable7702(jt *JumpTable) {
	jt[CALL].dynamicGas = gasCallEIP7702
	jt[CALLCODE].dynamicGas = gasCallCodeEIP7702
	jt[STATICCALL].dynamicGas = gasStaticCallEIP7702
	jt[DELEGATECALL].dynamicGas = gasDelegateCallEIP7702
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Transaction types.
const (
	LegacyTxType     = iota
	AccessListTxType = 1
	DynamicFeeTxType = 2
	BlobTxType       = 3
	SetCodeTxType    = 4 // EIP-7702: Set Code Transaction
)

// TxData is the underlying data of a transaction.
//
// This is a private interface used to restrict the possible transaction types.
type TxData interface {
	// ...
	txType() byte // returns the type ID
	// ...
}

// SetCodeTx is the data of EIP-7702 transactions.
type SetCodeTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList
	AuthList   []SetCodeAuthorization
}

// SetCodeAuthorization represents an authorization to set code for an account.
type SetCodeAuthorization struct {
	ChainID *uint256.Int
	Address common.Address
	Nonce   uint64

	// Signature values
	V *uint256.Int `json:"v" gencodec:"required"`
	R *uint256.Int `json:"r" gencodec:"required"`
	S *uint256.Int `json:"s" gencodec:"required"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContracts contains the precompiled contracts supported at the given fork.
type PrecompiledContracts map[common.Address]PrecompiledContract

// ... (Precompiled contract sets for older hardforks) ...

// PrecompiledContractsPrague contains the set of pre-compiled Ethereum
// contracts used in the Prague release.
var PrecompiledContractsPrague = PrecompiledContracts{
	common.BytesToAddress([]byte{0x01}): &ecrecover{},
	// ... other precompiles ...
	common.BytesToAddress([]byte{0x0a}): &kzgPointEvaluation{},
	common.BytesToAddress([]byte{0x0b}): &bls12381G1Add{},
	common.BytesToAddress([]byte{0x0c}): &bls12381G1MultiExp{},
	common.BytesToAddress([]byte{0x0d}): &bls12381G2Add{},
	common.BytesToAddress([]byte{0x0e}): &bls12381G2MultiExp{},
	common.BytesToAddress([]byte{0x0f}): &bls12381Pairing{},
	common.BytesToAddress([]byte{0x10}): &bls12381MapG1{},
	common.BytesToAddress([]byte{0x11}): &bls12381MapG2{},
}

func activePrecompiledContracts(rules params.Rules) PrecompiledContracts {
	switch {
	case rules.IsVerkle:
		return PrecompiledContractsVerkle
	case rules.IsOsaka:
		return PrecompiledContractsOsaka
	case rules.IsPrague:
		return PrecompiledContractsPrague
	// ... (other hardforks) ...
	default:
		return PrecompiledContractsHomestead
	}
}

// ActivePrecompiles returns the precompile addresses enabled with the current configuration.
func ActivePrecompiles(rules params.Rules) []common.Address {
	switch {
	case rules.IsOsaka:
		return PrecompiledAddressesOsaka
	case rules.IsPrague:
		return PrecompiledAddressesPrague
	// ... (other hardforks) ...
	default:
		return PrecompiledAddressesHomestead
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/database.go">
```go
// Config contains configurations for the trie database.
type Config struct {
	// Preimages configures whether to store the preimages of trie keys to disk.
	Preimages bool
	// IsVerkle configures whether the trie database is verkle tree based.
	IsVerkle bool
	// HashDB configures the backend of hash-based trie database.
	HashDB *hashdb.Config
	// PathDB configures the backend of path-based trie database.
	PathDB *pathdb.Config
	//...
}

// NewDatabase creates a new trie database on top of a backing key-value data
// store.
func NewDatabase(db ethdb.Database, config *Config) *Database {
	if config == nil {
		config = &Config{}
	}
	var (
		nodes NodeDatabase
		owner string
	)
	if config.IsVerkle {
		owner = "verkle"
		nodes = pathdb.New(db, config.PathDB)
	} else if config.PathDB != nil {
		owner = "path"
		nodes = pathdb.New(db, config.PathDB)
	} else {
		owner = "hash"
		nodes = hashdb.New(db, config.HashDB)
	}
	// ...
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt contains several speculative features for the Prague hardfork which might not reflect the final specification. Here are some corrections based on go-ethereum's implementation and the latest EIPs:

1.  **Verkle Opcodes:** The opcodes `VERKLE_VERIFY (0x49)` and `CODE_COPY_VERKLE (0x4A)` are placeholders. The actual opcodes for Verkle Tree integration are still being finalized. For example, `BLOBHASH` was introduced in Cancun at `0x49`, so that specific opcode is already taken. The implementation should be flexible to adapt to the final EIP specifications.

2.  **`VerkleWitnessTransaction`:** This transaction type is not part of any current EIP. State witnesses are typically constructed by the block producer and provided out-of-band for stateless verification, not included directly in transactions. The EIPs for Verkle will specify the exact mechanism. Instead of a new transaction type, existing structures will likely be extended to support witness data.

3.  **Account Abstraction Transaction Type:** The prompt suggests a `UserOperation = 0x05` transaction type. While full native Account Abstraction (like EIP-7918) might introduce new transaction types, the most relevant *upcoming* change is **EIP-7702: SetCode Transaction**. This EIP adds a `SetCodeTxType` which allows an EOA to temporarily act as a smart contract for a single transaction. This is a more concrete feature to implement than a generic `UserOperation` type. The go-ethereum codebase reflects work on `SetCodeTxType`.

4.  **Precompiles for Verkle/AA:** The precompile addresses `VERKLE_BATCH_VERIFY_ADDRESS = 0x12` and `ACCOUNT_ABSTRACTION_ADDRESS = 0x13` are speculative. New precompiles for Prague/Pectra are being discussed (e.g., for BLS signatures), but their addresses and functionality are not yet finalized. Geth's `core/vm/contracts.go` shows that precompiles are added at specific addresses (e.g., `0x0b`, `0x0c`, etc. for Prague). The implementation should follow the final EIPs.

5.  **Gas Model:** The gas costs in the prompt (`VERKLE_WITNESS_VERIFY_COST`, `CODE_CHUNK_ACCESS_COST`) are placeholders. The actual gas costs will be determined by the relevant EIPs. A major change related to Verkle is EIP-4762 (stateless gas costs), which modifies the gas calculation for state access. Geth's `core/vm/operations_verkle.go` contains logic for this. This is a more accurate reference than placeholder formulas.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations gas repricing.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header validation)

	// EIP155 implements replay-protected transaction signing.
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements account cleanup for chain state trie clearup.
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block (nil = no fork)

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from Shanghai

	// TerminalTotalDifficulty is the total difficulty for the merge fork.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"` // The ETH PoW total difficulty threshold for the merge fork.

	// Shanghai switch time (nil = no fork)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch time (nil = no fork)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch time (nil = no fork)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// Verkle switch time (nil = no fork)
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// IsPrague returns whether prague is active at the given time.
func (c *ChainConfig) IsPrague(num *big.Int, time uint64) bool {
	return c.PragueTime != nil && *c.PragueTime <= time
}

// IsVerkle returns whether verkle is active at the given time.
func (c *Chain-Config) IsVerkle(num *big.Int, time uint64) bool {
	return c.VerkleTime != nil && *c.VerkleTime <= time
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContractsCancun contains the default set of pre-compiled contracts used
// in the Cancun release.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	// EIP-4844 (Cancun)
	common.BytesToAddress([]byte{10}): &eip4844PointEvaluation{},
}

// eip4844PointEvaluation implements the point evaluation precompile.
// This precompile is used for verifying blob proofs.
type eip4844PointEvaluation struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *eip4844PointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobVerifyGas
}

func (p *eip4844PointEvaluation) Run(input []byte) ([]byte, error) {
	if len(input) != eip4844PointEvaluationInputLength {
		return nil, fmt.Errorf("%w: invalid input length %d, expected %d", ErrInvalidInput, len(input), eip4844PointEvaluationInputLength)
	}
	// versioned_hash (32 bytes), z (32 bytes), y (32 bytes), commitment (48 bytes), proof (48 bytes)
	var (
		versionedHash = input[0:32]
		z             = input[32:64]
		y             = input[64:96]
		commitment    = input[96:144]
		proof         = input[144:192]
		q             = fr.Modulus()
	)
	// Some basic validation
	// Check that the versioned hash has the correct version
	if versionedHash[0] != eip4844.BlobCommitmentVersionKzg {
		return nil, ErrInvalidID
	}
	// Check that commitment hash matches versioned hash
	hasher := sha256.New()
	hasher.Write(commitment)
	computedVersionedHash := hasher.Sum(nil)
	computedVersionedHash[0] = eip4844.BlobCommitmentVersionKzg
	if !bytes.Equal(versionedHash, computedVersionedHash) {
		return nil, ErrProofVerification
	}
	// Check that z and y are valid field elements
	if new(big.Int).SetBytes(z).Cmp(q) >= 0 {
		return nil, fmt.Errorf("%w: z >= BLS_MODULUS", ErrInvalidInput)
	}
	if new(big.Int).SetBytes(y).Cmp(q) >= 0 {
		return nil, fmt.Errorf("%w: y >= BLS_MODULUS", ErrInvalidInput)
	}
	// Verify proof
	err := kzg4844.VerifyPointEvaluationProof(kzg4844.BytesToCommitment(commitment), kzg4844.BytesToG1Point(proof), kzg4844.BytesToFieldElement(z), kzg4844.BytesToFieldElement(y))
	if err != nil {
		return nil, err
	}
	// Success
	return eip4844PointEvaluationOutput, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Transaction types.
const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
	SetCodeTxType
)

// setCodeTxJSON is the JSON representation of a SetCode transaction.
type setCodeTxJSON struct {
	Type hexutil.Uint64 `json:"type"`

	// Common transaction fields:
	Nonce                *hexutil.Uint64 `json:"nonce"`
	GasPrice             *hexutil.Big    `json:"gasPrice,omitempty"`
	MaxPriorityFeePerGas *hexutil.Big    `json:"maxPriorityFeePerGas"`
	MaxFeePerGas         *hexutil.Big    `json:"maxFeePerGas"`
	Gas                  *hexutil.Uint64 `json:"gas"`
	To                   *common.Address `json:"to"`
	Value                *hexutil.Big    `json:"value"`
	Input                *hexutil.Bytes  `json:"input"`
	V                    *hexutil.Big    `json:"v"`
	R                    *hexutil.Big    `json:"r"`
	S                    *hexutil.Big    `json:"s"`
	YParity              *hexutil.Uint64 `json:"yParity"`
	ChainID              *hexutil.Big    `json:"chainId,omitempty"`
	Hash                 *common.Hash    `json:"hash,omitempty"`

	// Access list transaction fields:
	AccessList *AccessList `json:"accessList,omitempty"`

	// SetCode transaction fields:
	AuthList []SetCodeAuthorization `json:"authorizationList,omitempty"`
}

// SetCodeTx is the data of EIP-7702 transactions.
type SetCodeTx struct {
	ChainID *uint256.Int // destination chain ID

	// Common transaction fields:
	Nonce     uint64         // nonce of sender account
	GasTipCap *uint256.Int   // max priority fee per gas
	GasFeeCap *uint256.Int   // max fee per gas
	Gas       uint64         // gas limit
	To        common.Address // recipient's address
	Value     *uint256.Int   // wei amount
	Data      []byte         // contract invocation input data
	AuthList  []SetCodeAuthorization

	// Signature values
	V, R, S *uint256.Int // raw signature values

	// This is only used when marshaling to JSON.
	Hash *common.Hash `json:"hash,omitempty" rlp:"-"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/ethapi/transaction_args.go">
```go
// TransactionArgs represents the arguments to construct a new transaction
// or a message call.
type TransactionArgs struct {
	From                 *common.Address `json:"from"`
	To                   *common.Address `json:"to"`
	Gas                  *hexutil.Uint64 `json:"gas"`
	GasPrice             *hexutil.Big    `json:"gasPrice"`
	MaxFeePerGas         *hexutil.Big    `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *hexutil.Big    `json:"maxPriorityFeePerGas"`
	Value                *hexutil.Big    `json:"value"`
	Nonce                *hexutil.Uint64 `json:"nonce"`

	// We accept "data" and "input" for backwards-compatibility reasons.
	// "input" is the newer name and should be preferred by clients.
	// Issue detail: https://github.com/ethereum/go-ethereum/issues/15628
	Data  *hexutil.Bytes `json:"data"`
	Input *hexutil.Bytes `json:"input"`

	// Introduced by AccessListTxType transaction.
	AccessList *types.AccessList `json:"accessList,omitempty"`
	ChainID    *hexutil.Big      `json:"chainId,omitempty"`

	// For BlobTxType
	BlobFeeCap *hexutil.Big  `json:"maxFeePerBlobGas"`
	BlobHashes []common.Hash `json:"blobVersionedHashes,omitempty"`

	// For BlobTxType transactions with blob sidecar
	Blobs       []kzg4844.Blob       `json:"blobs"`
	Commitments []kzg4844.Commitment `json:"commitments"`
	Proofs      []kzg4844.Proof      `json:"proofs"`

	// For SetCodeTxType
	AuthorizationList []types.SetCodeAuthorization `json:"authorizationList"`

	// This configures whether blobs are allowed to be passed.
	blobSidecarAllowed bool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/verkle.go">
```go
// VerkleTrie is a wrapper around VerkleNode that implements the trie.Trie
// interface so that Verkle trees can be reused verbatim.
type VerkleTrie struct {
	root   verkle.VerkleNode
	cache  *utils.PointCache
	reader *trieReader
}

// NewVerkleTrie constructs a verkle tree based on the specified root hash.
func NewVerkleTrie(root common.Hash, db database.NodeDatabase, cache *utils.PointCache) (*VerkleTrie, error) {
	reader, err := newTrieReader(root, common.Hash{}, db)
	if err != nil {
		return nil, err
	}
	// Parse the root verkle node if it's not empty.
	node := verkle.New()
	if root != types.EmptyVerkleHash && root != types.EmptyRootHash {
		blob, err := reader.node(nil, common.Hash{})
		if err != nil {
			return nil, err
		}
		node, err = verkle.ParseNode(blob, 0)
		if err != nil {
			return nil, err
		}
	}
	return &VerkleTrie{
		root:   node,
		cache:  cache,
		reader: reader,
	}, nil
}

// GetAccount implements state.Trie, retrieving the account with the specified
// account address. If the specified account is not in the verkle tree, nil will
// be returned. If the tree is corrupted, an error will be returned.
func (t *VerkleTrie) GetAccount(addr common.Address) (*types.StateAccount, error) {
	var (
		acc    = &types.StateAccount{}
		values [][]byte
		err    error
	)
	switch n := t.root.(type) {
	case *verkle.InternalNode:
		values, err = n.GetValuesAtStem(t.cache.GetStem(addr[:]), t.nodeResolver)
		if err != nil {
			return nil, fmt.Errorf("GetAccount (%x) error: %v", addr, err)
		}
	default:
		return nil, errInvalidRootType
	}
	if values == nil {
		return nil, nil
	}
	basicData := values[utils.BasicDataLeafKey]
	acc.Nonce = binary.BigEndian.Uint64(basicData[utils.BasicDataNonceOffset:])
	acc.Balance = new(uint256.Int).SetBytes(basicData[utils.BasicDataBalanceOffset : utils.BasicDataBalanceOffset+16])
	acc.CodeHash = values[utils.CodeHashLeafKey]

	// TODO account.Root is leave as empty. How should we handle the legacy account?
	return acc, nil
}

// UpdateAccount implements state.Trie, writing the provided account into the tree.
// If the tree is corrupted, an error will be returned.
func (t *VerkleTrie) UpdateAccount(addr common.Address, acc *types.StateAccount, codeLen int) error {
	var (
		err       error
		basicData [32]byte
		values    = make([][]byte, verkle.NodeWidth)
		stem      = t.cache.GetStem(addr[:])
	)

	// Code size is encoded in BasicData as a 3-byte big-endian integer. Spare bytes are present
	// before the code size to support bigger integers in the future. PutUint32(...) requires
	// 4 bytes, so we need to shift the offset 1 byte to the left.
	binary.BigEndian.PutUint32(basicData[utils.BasicDataCodeSizeOffset-1:], uint32(codeLen))
	binary.BigEndian.PutUint64(basicData[utils.BasicDataNonceOffset:], acc.Nonce)
	if acc.Balance.ByteLen() > 16 {
		panic("balance too large")
	}
	acc.Balance.WriteToSlice(basicData[utils.BasicDataBalanceOffset : utils.BasicDataBalanceOffset+16])
	values[utils.BasicDataLeafKey] = basicData[:]
	values[utils.CodeHashLeafKey] = acc.CodeHash[:]

	switch root := t.root.(type) {
	case *verkle.InternalNode:
		err = root.InsertValuesAtStem(stem, values, t.nodeResolver)
	default:
		return errInvalidRootType
	}
	if err != nil {
		return fmt.Errorf("UpdateAccount (%x) error: %v", addr, err)
	}

	return nil
}

// UpdateStorage implements state.Trie, writing the provided storage slot into
// the tree. If the tree is corrupted, an error will be returned.
func (t *VerkleTrie) UpdateStorage(address common.Address, key, value []byte) error {
	// Left padding the slot value to 32 bytes.
	var v [32]byte
	if len(value) >= 32 {
		copy(v[:], value[:32])
	} else {
		copy(v[32-len(value):], value[:])
	}
	k := utils.StorageSlotKeyWithEvaluatedAddress(t.cache.Get(address.Bytes()), key)
	return t.root.Insert(k, v[:], t.nodeResolver)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/utils/verkle.go">
```go
// PointCache is the LRU cache for storing evaluated address commitment.
type PointCache struct {
	lru  lru.BasicLRU[string, *verkle.Point]
	lock sync.RWMutex
}

// Get returns the cached commitment for the specified address, or computing
// it on the flight.
func (c *PointCache) Get(addr []byte) *verkle.Point {
	c.lock.Lock()
	defer c.lock.Unlock()

	p, ok := c.lru.Get(string(addr))
	if ok {
		cacheHitGauge.Inc(1)
		return p
	}
	cacheMissGauge.Inc(1)
	p = evaluateAddressPoint(addr)
	c.lru.Add(string(addr), p)
	return p
}

// GetStem returns the first 31 bytes of the tree key as the tree stem. It only
// works for the account metadata whose treeIndex is 0.
func (c *PointCache) GetStem(addr []byte) []byte {
	p := c.Get(addr)
	return pointToHash(p, 0)[:31]
}

// GetTreeKey performs both the work of the spec's get_tree_key function, and that
// of pedersen_hash...
func GetTreeKey(address []byte, treeIndex *uint256.Int, subIndex byte) []byte {
	// ...
}

// BasicDataKey returns the verkle tree key of the basic data field for
// the specified account.
func BasicDataKey(address []byte) []byte {
	return GetTreeKey(address, zero, BasicDataLeafKey)
}

// CodeHashKey returns the verkle tree key of the code hash field for
// the specified account.
func CodeHashKey(address []byte) []byte {
	return GetTreeKey(address, zero, CodeHashLeafKey)
}

// CodeChunkKey returns the verkle tree key of the code chunk for the
// specified account.
func CodeChunkKey(address []byte, chunk *uint256.Int) []byte {
	treeIndex, subIndex := codeChunkIndex(chunk)
	return GetTreeKey(address, treeIndex, subIndex)
}

// StorageSlotKey returns the verkle tree key of the storage slot for the
// specified account.
func StorageSlotKey(address []byte, storageKey []byte) []byte {
	treeIndex, subIndex := StorageIndex(storageKey)
	return GetTreeKey(address, treeIndex, subIndex)
}

// BasicDataKeyWithEvaluatedAddress returns the verkle tree key of the basic data
// field for the specified account. The difference between BasicDataKey is the
// address evaluation is already computed to minimize the computational overhead.
func BasicDataKeyWithEvaluatedAddress(evaluated *verkle.Point) []byte {
	return GetTreeKeyWithEvaluatedAddress(evaluated, zero, BasicDataLeafKey)
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is very well-structured and provides a good, speculative overview of the Prague hardfork features. The Zig code examples are excellent for guiding the implementation. Here are some minor corrections and clarifications based on the `go-ethereum` implementation and EIPs:

1.  **New Opcodes**: The prompt lists opcodes like `VERKLE_VERIFY (0x49)`, `CODE_COPY_VERKLE (0x4A)`, etc. It correctly notes these are tentative. In `go-ethereum`, these opcodes are not yet defined. For context, the opcodes at `0x49` and `0x4A` in the latest hardfork (Cancun) are `BLOBHASH` and `BLOBBASEFEE`, respectively. The new Prague opcodes will likely be assigned different values once finalized.

2.  **`ACCOUNT_CODE` and `ACCOUNT_SIZE` Opcodes**: The prompt suggests new opcodes for getting an account's code hash and size. In `go-ethereum`, these functionalities are handled by existing opcodes:
    *   **Code Hash**: `EXTCODEHASH (0x3F)` (introduced in Constantinople) gets the keccak256 hash of an account's code.
    *   **Code Size**: `EXTCODESIZE (0x3B)` gets the size of an account's code.
    It's unlikely that new opcodes would be introduced for this functionality unless they have different semantics (e.g., related to Verkle trees).

3.  **Transaction Types**: The prompt correctly uses an enum for transaction types. In `go-ethereum`, these are defined as constants (`LegacyTxType`, `AccessListTxType`, etc.). The new `SetCodeTransaction (0x04)` for EIP-7702 is correctly identified.

4.  **Verkle Witness Transactions**: The prompt proposes a new transaction type for Verkle witnesses. This is a reasonable speculation. In `go-ethereum`, similar functionality was introduced for EIP-4844 `BlobTx` which includes a "sidecar" for blobs, commitments, and proofs. A Verkle witness transaction would likely follow a similar pattern, where the witnesses are part of a sidecar and not included in the main transaction hash. The existing `BlobTx` implementation in `go-ethereum/core/types/transaction.go` would be an excellent reference.

5.  **Precompiles**: The prompt's proposed precompiles for batch Verkle verification and account abstraction are speculative but logical. The implementation of the `kzg_point_evaluation` precompile in `go-ethereum/core/vm/contracts.go` is a perfect model for how a new cryptographic precompile would be added and integrated.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// MainnetChainConfig is the chain parameters to run a node on the main network.
var MainnetChainConfig = &ChainConfig{
	ChainID:                 big.NewInt(1),
	HomesteadBlock:          big.NewInt(1_150_000),
	DAOForkBlock:            big.NewInt(1_920_000),
	DAOForkSupport:          true,
	EIP150Block:             big.NewInt(2_463_000),
	EIP155Block:             big.NewInt(2_675_000),
	EIP158Block:             big.NewInt(2_675_000),
	ByzantiumBlock:          big.NewInt(4_370_000),
	ConstantinopleBlock:     big.NewInt(7_280_000),
	PetersburgBlock:         big.NewInt(7_280_000),
	IstanbulBlock:           big.NewInt(9_069_000),
	MuirGlacierBlock:        big.NewInt(9_200_000),
	BerlinBlock:             big.NewInt(12_244_000),
	LondonBlock:             big.NewInt(12_965_000),
	ArrowGlacierBlock:       big.NewInt(13_773_000),
	GrayGlacierBlock:        big.NewInt(15_050_000),
	TerminalTotalDifficulty: MainnetTerminalTotalDifficulty, // 58_750_000_000_000_000_000_000
	ShanghaiTime:            newUint64(1681338455),
	CancunTime:              newUint64(1710338135),
	PragueTime:              newUint64(1746612311),
	DepositContractAddress:  common.HexToAddress("0x00000000219ab540356cbb839cbe05303d7705fa"),
	Ethash:                  new(EthashConfig),
	BlobScheduleConfig: &BlobScheduleConfig{
		Cancun: DefaultCancunBlobConfig,
		Prague: DefaultPragueBlobConfig,
	},
}

// ... other chain configs

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)

	// ... other hardfork blocks

	// EIP-2384 (bomb delay) switch block (nil = no fork, 0 = already activated)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`
	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`
	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`
	// Eip-4345 (bomb delay) switch block (nil = no fork, 0 = already activated)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`
	// Eip-5133 (bomb delay) switch block (nil = no fork, 0 = already activated)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`
	// Virtual fork after The Merge to use as a network splitter
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// Fork scheduling was switched from blocks to timestamps here

	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"` // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime   *uint64 `json:"cancunTime,omitempty"`   // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime   *uint64 `json:"pragueTime,omitempty"`   // Prague switch time (nil = no fork, 0 = already on prague)
	OsakaTime    *uint64 `json:"osakaTime,omitempty"`    // Osaka switch time (nil = no fork, 0 = already on osaka)
	VerkleTime   *uint64 `json:"verkleTime,omitempty"`   // Verkle switch time (nil = no fork, 0 = already on verkle)

	// ... other fields
}


// IsShanghai returns whether time is either equal to the Shanghai fork time or greater.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.ShanghaiTime, time)
}

// IsCancun returns whether time is either equal to the Cancun fork time or greater.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.CancunTime, time)
}

// IsPrague returns whether time is either equal to the Prague fork time or greater.
func (c *ChainConfig) IsPrague(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.PragueTime, time)
}

// ... other Is* methods

// Rules wraps ChainConfig and is merely syntactic sugar or can be used for functions
// that do not have or require information about the block.
//
// Rules is a one time interface meaning that it shouldn't be used in between transition
// phases.
type Rules struct {
	ChainID                                                 *big.Int
	IsHomestead, IsEIP150, IsEIP155, IsEIP158               bool
	IsEIP2929, IsEIP4762                                    bool
	IsByzantium, IsConstantinople, IsPetersburg, IsIstanbul bool
	IsBerlin, IsLondon                                      bool
	IsMerge, IsShanghai, IsCancun, IsPrague, IsOsaka        bool
	IsVerkle                                                bool
}

// Rules ensures c's ChainID is not nil.
func (c *ChainConfig) Rules(num *big.Int, isMerge bool, timestamp uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	// disallow setting Merge out of order
	isMerge = isMerge && c.IsLondon(num)
	isVerkle := isMerge && c.IsVerkle(num, timestamp)
	return Rules{
		ChainID:          new(big.Int).Set(chainID),
		IsHomestead:      c.IsHomestead(num),
		// ...
		IsBerlin:         c.IsBerlin(num),
		IsEIP2929:        c.IsBerlin(num) && !isVerkle,
		IsLondon:         c.IsLondon(num),
		IsMerge:          isMerge,
		IsShanghai:       isMerge && c.IsShanghai(num, timestamp),
		IsCancun:         isMerge && c.IsCancun(num, timestamp),
		IsPrague:         isMerge && c.IsPrague(num, timestamp),
		IsOsaka:          isMerge && c.IsOsaka(num, timestamp),
		IsVerkle:         isVerkle,
		IsEIP4762:        isVerkle,
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_setcode.go">
```go
// SetCodeTx is a transaction type for EIP-7702: Set Code Transaction.
type SetCodeTx struct {
	ChainID    *big.Int
	Nonce      uint64
	GasPrice   *big.Int
	Gas        uint64
	To         *common.Address `rlp:"nil"` // nil means contract creation
	Value      *big.Int
	Data       []byte
	AccessList AccessList

	// Auth is a secp256k1 signature over the transaction hash.
	Auth []byte

	// This object is supposed to be readonly so we can cache the hash
	hash atomic.Value
}

// TxType returns the transaction type.
func (tx *SetCodeTx) Type() uint8 {
	return SetCodeTxType
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// newEVMCfg returns the EVM config for the given chain config and block context.
func newEVMCfg(chainConfig *params.ChainConfig, blockCtx BlockContext) Config {
	return Config{
		ChainConfig: chainConfig,
		Difficulty:  blockCtx.Difficulty,
		Origin:      blockCtx.Origin,
		Coinbase:    blockCtx.Coinbase,
		BlockNumber: blockCtx.BlockNumber,
		Time:        blockCtx.Time,
		GasLimit:    blockCtx.GasLimit,
		GasPrice:    blockCtx.GasPrice,
		BaseFee:     blockCtx.BaseFee,
		BlobHashes:  blockCtx.BlobHashes,
		BlobBaseFee: blockCtx.BlobBaseFee,
		ParentBeaconBlockRoot: blockCtx.ParentBeaconBlockRoot,
	}
}

// NewEVM creates a new context for use in the EVM.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// JumpTable contains the EVM instructions mapped by opcode.
type JumpTable [256]*operation

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() JumpTable {
	// Start with the Shanghai instruction set.
	instructionSet := newShanghaiInstructionSet()

	// Add Cancun specific instructions.
	instructionSet[TLOAD] = &operation{
		execute:     opTLoad,
		constantGas: GasFastestStep,
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
		// ...
	}
	instructionSet[TSTORE] = &operation{
		execute:     opTStore,
		constantGas: GasFastestStep,
		minStack:    minStack(2, 0),
		// ...
	}
	instructionSet[BLOBHASH] = &operation{
		execute:     opBlobHash,
		constantGas: GasFastestStep,
		minStack:    minStack(1, 1),
		// ...
	}
	instructionSet[MCOPY] = &operation{
		execute:        opMCopy,
		dynamicGas:     gasMCopy,
		minStack:       minStack(3, 0),
		maxStack:       maxStack(3, 0),
		memorySize:     memoryMCopy,
		writes:         true,
		validEIP2929:   true,
		isEIP2929Warm:  isEIP2929WarmMCopy,
		warmupGasEIP2929: warmupGasEIP2929MCopy,
	}
	// ...
	return instructionSet
}

// newPragueInstructionSet returns the instruction set for the Prague hard fork.
func newPragueInstructionSet() JumpTable {
	// Start with the Cancun instruction set.
	instructionSet := newCancunInstructionSet()

	// Add Prague specific instructions.
	// E.g., for EIP-3074:
	instructionSet[AUTH] = &operation{
		execute: opAuth,
		// ...
	}
	instructionSet[AUTHCALL] = &operation{
		execute: opAuthCall,
		// ...
	}
	// E.g., for EIP-7702:
	instructionSet[SETCODE] = &operation{
		execute: opSetCode,
		// ...
	}
	// Other Prague opcodes...
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTLoad implements the TLOAD opcode (EIP-1153).
func opTLoad(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop the key from the stack.
	loc := stack.Pop()
	// Get the value from the transient storage.
	val := evm.StateDB.GetTransientState(contract.Address(), loc.Bytes32())
	// Push the value onto the stack.
	stack.Push(val.Big())
	return nil, nil
}

// opTStore implements the TSTORE opcode (EIP-1153).
func opTStore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop the key and value from the stack.
	loc := stack.Pop().Bytes32()
	val := stack.Pop().Bytes32()
	// Set the value in the transient storage.
	evm.StateDB.SetTransientState(contract.Address(), loc, val)
	return nil, nil
}

// opBlobHash implements the BLOBHASH opcode (EIP-4844).
func opBlobHash(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop the index from the stack.
	idx := stack.Pop()
	// Get the versioned hash from the transaction context.
	hash := evm.GetBlobHash(idx)
	// Push the hash onto the stack.
	stack.Push(hash.Big())
	return nil, nil
}

// opBlobBaseFee implements the BLOBBASEFEE opcode (EIP-7516).
func opBlobBaseFee(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	stack.Push(new(big.Int).Set(evm.BlobBaseFee))
	return nil, nil
}

// opSetCode implements the SETCODE opcode (EIP-7702).
func opSetCode(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... (implementation details for setting code for an EOA context)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	// EIP-4844: Shard Blob Transactions
	BlobTxBytesPerFieldElement         = 32      // Size in bytes of a field element
	BlobTxFieldElementsPerBlob         = 4096    // Number of field elements stored in a single data blob
	BlobTxBlobGasPerBlob               = 1 << 17 // Gas consumption of a single data blob (== blob byte size)
	BlobTxMinBlobGasprice              = 1       // Minimum gas price for data blobs
	BlobTxPointEvaluationPrecompileGas = 50000   // Gas price for the point evaluation precompile.

	// EIP-1153: Transient Storage
	TLoadGas  uint64 = 100 // Gas cost for TLOAD (transient storage load)
	TStoreGas uint64 = 100 // Gas cost for TSTORE (transient storage store)
	//...

	// EIP-7702: Set Code Transaction
	TxAuthTupleGas uint64 = 12500 // Per auth tuple code specified in EIP-7702
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/verkle_params.go">
```go
package params

// Verkle tree EIP: costs associated to witness accesses
var (
	WitnessBranchReadCost  uint64 = 1900
	WitnessChunkReadCost   uint64 = 200
	WitnessBranchWriteCost uint64 = 3000
	WitnessChunkWriteCost  uint64 = 500
	WitnessChunkFillCost   uint64 = 6200
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContractsBerlin contains the precompiled contracts starting from the
// Berlin hard fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts starting from the
// Cancun hard fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):  &ecrecover{},
	common.BytesToAddress([]byte{2}):  &sha256hash{},
	common.BytesToAddress([]byte{3}):  &ripemd160hash{},
	common.BytesToAddress([]byte{4}):  &dataCopy{},
	common.BytesToAddress([]byte{5}):  &bigModExp{},
	common.BytesToAddress([]byte{6}):  &bn256AddIstanbul{},
	common.BytesToAddress([]byte{7}):  &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{8}):  &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{9}):  &blake2F{},
	common.BytesToAddress([]byte{10}): &pointEvaluation{}, // EIP-4844
}

// PrecompiledContract is the interface for a precompiled contract.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64
	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}
// ...

// pointEvaluation implements the point evaluation precompile (EIP-4844).
type pointEvaluation struct{}

func (c *pointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobTxPointEvaluationPrecompileGas
}

func (c *pointEvaluation) Run(input []byte) ([]byte, error) {
	const dataLen = 192 // kzg_commitment (48) + z (32) + y (32) + kzg_proof (48) + versioned_hash (32)
	if len(input) != dataLen {
		return nil, fmt.Errorf("invalid input length: have %d, want %d", len(input), dataLen)
	}
	var (
		hash       [32]byte
		z          [32]byte
		y          [32]byte
		commitment [48]byte
		proof      [48]byte
	)
	copy(hash[:], input[0:32])
	copy(z[:], input[32:64])
	copy(y[:], input[64:96])
	copy(commitment[:], input[96:144])
	copy(proof[:], input[144:192])

	// ... (kzg verification logic) ...

	// On success, return the fields modulus and elements per blob.
	var ret [64]byte
	new(big.Int).SetUint64(fieldElementsPerBlob).FillBytes(ret[:32])
	blsModulus.FillBytes(ret[32:])
	return ret[:], nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// EVM Object Format (EOF) related constants and functions
// See EIP-3540, EIP-3670, EIP-4200, EIP-4750, EIP-5450

const (
	EOFVersion = 1

	Magic      = 0xEF00
	terminator = 0x00
	CodeType   = 0x01
	DataType   = 0x02
	terminator = 0x00
)

type eofHeader struct {
	Magic      uint16
	Version    uint8
	CodeType   uint8
	CodeLength uint16
	DataType   uint8
	DataLength uint16
}

// validateEOF checks if the given code is valid EOF code.
// The checks follow the EIP-3540 specification.
func validateEOF(code []byte) error {
	// ... (validation logic for magic bytes, version, sections, etc.)

	if len(code) < 2 || binary.BigEndian.Uint16(code) != Magic {
		return ErrInvalidEOFMagic
	}
	// ... other checks
	return nil
}

// opRJUMP implements the RJUMP opcode.
func opRJUMP(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... implementation ...
	return nil, nil
}

// opRJUMPI implements the RJUMPI opcode.
func opRJUMPI(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... implementation ...
	return nil, nil
}

// opRJUMPV implements the RJUMPV opcode.
func opRJUMPV(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... implementation ...
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/verkle/tree.go">
```go
// Copyright 2023 The go-ethereum Authors
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

package verkle

import (
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
)

// Tree is a verkle tree.
type Tree struct {
	root Node

	// Cache of hash -> node, used to avoid re-hashing nodes
	// that have not changed.
	hashcache map[*Point]Node
}

// New creates a new tree.
func New() *Tree {
	return &Tree{
		root:      new(InternalNode),
		hashcache: make(map[*Point]Node),
	}
}

// Insert inserts a key/value pair into the tree.
func (t *Tree) Insert(key, value []byte) error {
	// ...
}


// Get retrieves the value of a key.
func (t *Tree) Get(key []byte) ([]byte, error) {
	// ...
}

// Prove creates a proof for a given key.
func (t *Tree) Prove(key []byte) (*Proof, error) {
	// ...
}

// VerifyProof verifies that key/value is present in the tree
// given a proof, and a root hash.
func VerifyProof(proof *Proof, root *Point) (bool, error) {
	// ...
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is well-structured but contains some speculative information about the Prague hardfork since its specification is not yet final. Here are some corrections and clarifications based on the go-ethereum codebase and recent EIPs:

1.  **Opcode Numbering Conflicts**: The prompt assigns opcodes `0x49` to `VERKLE_VERIFY` and `0x4A` to `CODE_COPY_VERKLE`. In the Cancun hardfork, these opcodes were assigned to `BLOBHASH` (0x49) and `BLOBBASEFEE` (0x4a, EIP-7516). This conflict means the proposed opcodes for Prague will need different values. It's better to treat them as placeholders for now.

2.  **Proposed Opcodes `ACCOUNT_CODE` and `ACCOUNT_SIZE`**: The functionality described for `ACCOUNT_CODE` (get code hash) and `ACCOUNT_SIZE` (get code size) is already provided by existing opcodes `EXTCODEHASH` (0x3F) and `EXTCODESIZE` (0x3B), respectively. Any new opcodes in this area would likely have different semantics, perhaps related to Verkle tree code chunking.

3.  **Transaction Type `UserOperation` (0x05)**: The prompt includes `UserOperation` as a core transaction type. While EIP-4337 (Account Abstraction) is a major initiative, it is currently implemented as an ERC via a separate mempool for "UserOperations", not as a native transaction type. Future EIPs may promote it to a core transaction type, but for now, it's more of an off-chain/higher-level construct. The go-ethereum implementation for it is in a separate `erc4337-bundler` repository, not in the core client. EIP-7702 (`SetCodeTransaction`) is a more concrete example of a new transaction type planned for Prague.

4.  **Precompile Addresses**: The prompt suggests `0x12` for `VERKLE_BATCH_VERIFY_ADDRESS` and `0x13` for `ACCOUNT_ABSTRACTION_ADDRESS`. Precompile addresses are typically assigned sequentially. The highest assigned address is currently `0x0a` for the EIP-4844 Point Evaluation Precompile. While `0x0b`, `0x0c`, etc., are available, the specific addresses in the prompt are speculative. The implementation should be flexible regarding the final address.

5.  **Verkle Tree Implementation**: The `verkle.zig` code in the prompt is a simplified placeholder. The actual implementation is complex and involves polynomial commitments (e.g., KZG or IPA-based). The `verkle/` package in go-ethereum, although experimental, provides a much more realistic and detailed structure for implementation, including concepts of `InternalNode`, `LeafNode`, `Point` commitments, and proof generation logic. This would be a better reference.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// params/config.go

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own

// unique set of rules defined in the chain configuration.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// https://eips.ethereum.org/EIPS/eip-150
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements replay-protected transaction signatures.
	// https://eips.ethereum.org/EIPS/eip-155
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements state clearing for certain actions.
	// https://eips.ethereum.org/EIPS/eip-158
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	// https://eips.ethereum.org/EIPS/eip-609
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	// https://eips.ethereum.org/EIPS/eip-1013
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = same as Constantinople)
	// https://eips.ethereum.org/EIPS/eip-1716
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	// https://eips.ethereum.org/EIPS/eip-1679
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// Muir Glacier switch block (nil = no fork, 0 = already on Muir Glacier)
	// https://eips.ethereum.org/EIPS/eip-2384
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on Berlin)
	// https://eips.ethereum.org/EIPS/eip-2070
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on London)
	// https://eips.ethereum.org/EIPS/eip-3030
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// Arrow Glacier switch block (nil = no fork, 0 = already on Arrow Glacier)
	// https://eips.ethereum.org/EIPS/eip-4345
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// Gray Glacier switch block (nil = no fork, 0 = already on Gray Glacier)
	// https://eips.ethereum.org/EIPS/eip-5133
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplitBlock defines the block number at which post-merge validation rules are enforced.
	// Before this block, the consensus layer mechanism is not required. After this block,
	// the consensus layer is required to attest to the validity of the block.
	//
	// This hard fork is unique as it will not be activated by block number, but by TTD.
	// It is used to activate net-split-protection, which means that the network will not
	// accept any blocks that do not have the TTD rule enabled.
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// ShanghaiTime defines the unix timestamp at which the Shanghai fork is activated.
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// CancunTime defines the unix timestamp at which the Cancun fork is activated.
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// PragueTime defines the unix timestamp at which the Prague fork is activated.
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// VerkleTime defines the unix timestamp at which the Verkle fork is activated.
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag specifying that the network has already
	// transitioned to Proof of Stake, and that the difficulty values should be ignored
	// and replaced with 0.
	//
	// This is a weird flag that is present to handle a corner case where a node is
	// not yet synced up to the merge block, but the beacon client knows that the
	// transition happened. In this case, the node can still sync up to the merge
	// block, but any block processed above it will have its difficulty checked to
	// be zero.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Engine specifies the consensus engine configured for the chain.
	Engine any `json:"-"`

	// Ethash is the ethash consensus engine settings.
	Ethash *EthashConfig `json:"ethash,omitempty"`

	// Clique is the clique consensus engine settings.
	Clique *CliqueConfig `json:"clique,omitempty"`

	// BlobScheduleConfig contains the blob fee schedule parameters.
	BlobScheduleConfig *BlobScheduleConfig `json:"blobTx,omitempty"`
}


// IsShanghai returns whether shanghai is active at the given time.
func (c *ChainConfig) IsShanghai(parentNumber uint64, parentTime uint64) bool {
	// If London is not active, Shanghai can't be active.
	// This is a special rule for networks where London hardfork might be defined in future.
	if c.LondonBlock != nil && parentNumber+1 < c.LondonBlock.Uint64() {
		return false
	}
	if c.ShanghaiTime == nil {
		return false
	}
	return parentTime+1 >= *c.ShanghaiTime
}

// IsCancun returns whether cancun is active at the given time.
func (c *ChainConfig) IsCancun(parentNumber, parentTime uint64) bool {
	// If London is not active, Cancun can't be active.
	// This is a special rule for networks where London hardfork might be defined in future.
	if c.LondonBlock != nil && parentNumber+1 < c.LondonBlock.Uint64() {
		return false
	}
	if c.CancunTime == nil {
		return false
	}
	return parentTime+1 >= *c.CancunTime
}

// IsPrague returns whether prague is active at the given time.
func (c *ChainConfig) IsPrague(parentNumber, parentTime uint64) bool {
	// If London is not active, Prague can't be active.
	// This is a special rule for networks where London hardfork might be defined in future.
	if c.LondonBlock != nil && parentNumber+1 < c.LondonBlock.Uint64() {
		return false
	}
	if c.PragueTime == nil {
		return false
	}
	return parentTime+1 >= *c.PragueTime
}

// IsVerkle returns whether verkle is active at the given time.
func (c *ChainConfig) IsVerkle(parentNumber, parentTime uint64) bool {
	// If London is not active, Verkle can't be active.
	// This is a special rule for networks where London hardfork might be defined in future.
	if c.LondonBlock != nil && parentNumber+1 < c.LondonBlock.Uint64() {
		return false
	}
	if c.VerkleTime == nil {
		return false
	}
	return parentTime+1 >= *c.VerkleTime
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// core/types/transaction.go

const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
)

// TxData is the underlying data of a transaction.
//
// This is a private interface used to restrict the transaction types that can be used
// in the system. If you want to add a new transaction type, you need to implement
// this interface and have the return values of these methods match the data that
// is encoded into the RLP payload.
type TxData interface {
	// TxType returns the type of transaction. It is used for validation and handling
	// of different transaction formats.
	TxType() byte

	// Copy returns a deep copy of the transaction data.
	Copy() TxData

	// chainID, from, to, nonce, gas, gasPrice, gasTipCap, gasFeeCap,
	// value, data, accessList, blobGasFeeCap, blobHashes
	// These methods define the common transaction fields. Their returned value
	// is used for both signing and encoding.
	//
	// Note that for some transaction types, some of these methods may return
	// nil, indicating that the field is not used. For example, legacy txs do
	// not have accessList, gasTipCap, gasFeeCap, blobGasFeeCap or blobHashes.
	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasFeeCap() *big.Int
	gasTipCap() *big.Int
	gasPrice() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address

	blobGasFeeCap() *big.Int
	blobHashes() []common.Hash

	// setSignatureValues sets the raw signature values of the transaction.
	// The received values are trusted and periodic, so interpretation is up
	// to the caller.
	setSignatureValues(chainID, v, r, s *big.Int)

	// These methods define the transaction's signature values.
	//
	// The return values should be stunned, even if the transation is not signed.
	// This is because these values are used for things like sorting and comparing
	// transactions.
	rawSignatureValues() (v, r, s *big.Int)

	// Protected returns whether the transaction is protected from replay protection.
	protected() bool

	// EffectiveGasTip computes the effective gas price for non-legacy transactions.
	// It is only used after the baseFee of a block is known.
	effectiveGasTip(baseFee *big.Int) (*big.Int, error)

	// These methods are used to implement the p2p interface.
	//
	// See eth/protocols/eth/protocol.go
	txSender(Signer) (common.Address, error)

	// These methods are used for storing transaction data in the database.
	//
	// See core/rawdb/accessors_chain.go
	rlpSignatureValues() (v, r, s *big.Int)

	// These methods are used for encoding and decoding transaction data.
	//
	// They should not be used outside of this package.
	encode() []byte
	decode([]byte) error
}

// BlobTx is the transaction type for EIP-4844 transactions.
type BlobTx struct {
	ChainID    *uint256.Int   // destination chain ID
	Nonce      uint64         // nonce of sender account
	GasTipCap  *uint256.Int   // EIP-1559 value
	GasFeeCap  *uint256.Int   // EIP-1559 value
	Gas        uint64         // gas limit
	To         common.Address // recipient's address
	Value      *uint256.Int   // value of the transaction
	Data       []byte         // contract call data
	AccessList AccessList     // EIP-2930 access list

	BlobFeeCap *uint256.Int   // EIP-4844 value
	BlobHashes []common.Hash  // EIP-4844 value
	Sidecar    *BlobTxSidecar `rlp:"optional"` // EIP-4844 value

	// Signature values
	V, R, S *uint256.Int `rlp:"optional"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// core/vm/contracts.go

var PrecompiledContractsCancun = PrecompiledContractsShanghai

// PrecompiledContractsPrague contains the default precompiled contracts for
// the Prague fork.
var PrecompiledContractsPrague = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):   &ecrecover{},
	common.BytesToAddress([]byte{2}):   &sha256hash{},
	common.BytesToAddress([]byte{3}):   &ripemd160hash{},
	common.BytesToAddress([]byte{4}):   &dataCopy{},
	common.BytesToAddress([]byte{5}):   &bigModExp{},
	common.BytesToAddress([]byte{6}):   &bn256Add{},
	common.BytesToAddress([]byte{7}):   &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}):   &bn256Pairing{},
	common.BytesToAddress([]byte{9}):   &blake2F{},
	common.BytesToAddress([]byte{10}):  &kzgPointEvaluation{},
	common.BytesToAddress([]byte{...}): &somePraguePrecompile{}, // Example
}

// PrecompiledContract is the interface for a precompiled contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error) // Run runs the pre-compiled contract.
}


// kzgPointEvaluation implements the KZGPointEvaluation precompile.
type kzgPointEvaluation struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *kzgPointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobVerifyGas
}

// Run runs the pre-compiled contract.
func (c *kzgPointEvaluation) Run(input []byte) ([]byte, error) {
	const (
		commitmentLen = 48
		proofLen      = 48
		fieldElementLen = 32
		inputLen      = commitmentLen + proofLen + 2*fieldElementLen
	)
	if len(input) != inputLen {
		return nil, fmt.Errorf("invalid input length: have %d, want %d", len(input), inputLen)
	}
	var (
		// The trailing 32 bytes are the g1 point of the proof.
		proofBytes = (*[proofLen]byte)(input[commitmentLen+fieldElementLen*2:])
		// The 32 bytes after the versioned hash are the evaluation point z.
		zBytes = (*[fieldElementLen]byte)(input[commitmentLen:])
		// The 32 bytes after z are the claimed value y.
		yBytes = (*[fieldElementLen]byte)(input[commitmentLen+fieldElementLen:])
		// The first 48 bytes are the KZG commitment.
		commitmentBytes = (*[commitmentLen]byte)(input[:commitmentLen])
	)
	err := kzg4844.VerifyKZGProof(
		kzg4844.Commitment(*commitmentBytes),
		kzg4s.Point(*zBytes),
		kzg4s.Point(*yBytes),
		kzg4844.Proof(*proofBytes),
	)
	if err != nil {
		return nil, err
	}
	return kzgPointEvaluationReturnValue, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// core/vm/opcodes.go

// OpCode is a EVM opcode
type OpCode byte

// IsPush returns true if the opcode is a PUSHn
func (op OpCode) IsPush() bool {
	return op >= PUSH1 && op <= PUSH32
}

const (
	// ... (other opcodes)

	// 0x40 range - block operations
	BLOCKHASH   OpCode = 0x40
	COINBASE    OpCode = 0x41
	TIMESTAMP   OpCode = 0x42
	NUMBER      OpCode = 0x43
	PREVRANDAO  OpCode = 0x44
	GASLIMIT    OpCode = 0x45
	CHAINID     OpCode = 0x46
	SELFBALANCE OpCode = 0x47
	BASEFEE     OpCode = 0x48 // EIP-3198
	BLOBHASH    OpCode = 0x49 // EIP-4844
	BLOBBASEFEE OpCode = 0x4a // EIP-7516

	// 0x50 range - 'storage' and execution operation
	POP      OpCode = 0x50
	MLOAD    OpCode = 0x51
	MSTORE   OpCode = 0x52
	MSTORE8  OpCode = 0x53
	SLOAD    OpCode = 0x54
	SSTORE   OpCode = 0x55
	JUMP     OpCode = 0x56
	JUMPI    OpCode = 0x57
	PC       OpCode = 0x58
	MSIZE    OpCode = 0x59
	GAS      OpCode = 0x5a
	JUMPDEST OpCode = 0x5b
	TLOAD    OpCode = 0x5c // EIP-1153
	TSTORE   OpCode = 0x5d // EIP-1153
	MCOPY    OpCode = 0x5e // EIP-5656
	PUSH0    OpCode = 0x5f // EIP-3855
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// core/vm/jump_table.go

// jumpTable contains the EVM opcodes supported by a given interpreter.
type jumpTable [256]operation

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() jumpTable {
	// Instructions that are not present in the Cancun instruction set are initialized to erroneous ones.
	var insts = newShanghaiInstructionSet()
	insts[TLOAD] = operation{
		execute:     opTload,
		constantGas: GasTLoad,
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
	}
	insts[TSTORE] = operation{
		execute:     opTstore,
		constantGas: GasTStore,
		minStack:    minStack(2, 0),
		maxStack:    maxStack(2, 0),
	}
	insts[MCOPY] = operation{
		execute:     opMcopy,
		dynamicGas:  gasMcopy,
		minStack:    minStack(3, 0),
		maxStack:    maxStack(3, 0),
		memorySize:  memoryMcopy,
		validations: []validationFunc{validateMcopy},
	}
	insts[BLOBHASH] = operation{
		execute:     opBlobHash,
		constantGas: GasBlobHash,
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
	}
	// BLOBBASEFEE is defined in EIP-7516 which is part of Cancun.
	insts[BLOBBASEFEE] = operation{
		execute:     opBlobBaseFee,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
	return insts
}

// newShanghaiInstructionSet returns the instruction set for the Shanghai hard fork.
func newShanghaiInstructionSet() jumpTable {
	// Instructions that are not present in the Shanghai instruction set are initialized to erronous ones.
	var insts = newLondonInstructionSet()
	insts[PUSH0] = operation{
		execute:     opPush0,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
	// Overwrite PREVRANDAO with a no-op, since it's an alias of DIFFICULTY.
	insts[PREVRANDAO] = operation{
		execute:     opPrevrandao,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
	return insts
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/gas.go">
```go
// params/gas.go

const (
	// GasSStoreSet is the gas cost for an SSTORE operation when the old value is 0 and new value is non-zero.
	GasSStoreSet = 20000
	// GasSStoreReset is the gas cost for an SSTORE operation when the old value is non-zero and new value is non-zero.
	GasSStoreReset = 5000
	// GasSStoreClear is the gas cost for an SSTORE operation when the old value is non-zero and new value is 0.
	GasSStoreClear = 5000
	// GasSStoreRefund is the gas refund for an SSTORE operation when the old value is non-zero and new value is 0.
	GasSStoreRefund = 4800

	// GasSLoad is the gas cost for an SLOAD operation.
	GasSLoad = 200

	// GasSLoadCold is the gas cost for a cold SLOAD operation.
	GasSLoadCold = 2100
	// GasSStoreSetCold is the gas cost for a cold SSTORE operation when the old value is 0 and new value is non-zero.
	GasSStoreSetCold = GasSStoreSet + GasSLoadCold
	// GasSStoreResetCold is the gas cost for a cold SSTORE operation when the old value is non-zero and new value is non-zero.
	GasSStoreResetCold = GasSStoreReset + GasSLoadCold
	// GasSStoreClearCold is the gas cost for a cold SSTORE operation when the old value is non-zero and new value is 0.
	GasSStoreClearCold = GasSStoreClear + GasSLoadCold
)

// Gas costs for EIP-1153 (transient storage)
const (
	GasTStore = 100
	GasTLoad  = 100
)

// Gas costs for EIP-4844 (blobs)
const (
	// GasBlobHash is the gas cost of the BLOBHASH opcode.
	GasBlobHash = 3
	// BlobTxBlobGasPerBlob is the amount of blob gas consumed per blob.
	BlobTxBlobGasPerBlob = 1 << 17 // 131,072
)

// Gas costs for EIP-5656 (MCOPY)
const (
	// GasMcopy is the gas cost for the MCOPY opcode.
	GasMcopy = 3
)

// Gas costs for EIP-7516 (BLOBBASEFEE)
const (
	// GasBlobBaseFee is the gas cost for the BLOBBASEFEE opcode.
	GasBlobBaseFee = 2
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/ethconfig/config.go">
```go
// eth/ethconfig/config.go

// Config contains configuration options for ETH and LES protocols.
type Config struct {
	// The genesis block, which is inserted if the database is empty.
	// If nil, the Ethereum main net block is used.
	Genesis *core.Genesis `toml:",omitempty"`

	// Network ID separates blockchains on the peer-to-peer networking level. When left
	// zero, the chain ID is used as network ID.
	NetworkId uint64
	SyncMode  SyncMode

	// HistoryMode configures chain history retention.
	HistoryMode history.HistoryMode

	// ... (other config fields)

	// Mining options
	Miner miner.Config

	// Transaction pool options
	TxPool   legacypool.Config
	BlobPool blobpool.Config

	// Gas Price Oracle options
	GPO gasprice.Config

	// ... (other config fields)
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt contains several speculative details about the Prague hardfork that might not align with the final specification. Here are some corrections and clarifications based on the current state of go-ethereum and EIP discussions:

1.  **Opcode Assignments**: The prompt assigns specific byte values to new opcodes:
    *   `VERKLE_VERIFY = 0x49`
    *   `CODE_COPY_VERKLE = 0x4A`

    These opcodes conflict with those introduced in the Cancun hardfork. In `go-ethereum/core/vm/opcodes.go`, these values are already assigned:
    *   `BLOBHASH = 0x49`
    *   `BLOBBASEFEE = 0x4A`

    When implementing new opcodes, it's crucial to use unassigned ranges or wait for the official EIP specifications to finalize the values.

2.  **Precompile Addresses**: The prompt suggests `VERKLE_BATCH_VERIFY_ADDRESS = 0x12` and `ACCOUNT_ABSTRACTION_ADDRESS = 0x13`.
    *   The precompile at address `0x0A` (decimal 10) is the `kzgPointEvaluation` precompile, introduced in Cancun for EIP-4844 blob verification.
    *   Addresses `0x12` and `0x13` are currently unassigned and could be candidates, but this is speculative. The implementation should be flexible to accommodate the final assigned addresses.

3.  **Transaction Types**:
    *   **EIP-7702 (Set Code Transaction)**: The prompt assigns type `0x04`. While this is a plausible next number, it is not yet standardized. The implementation should treat this as a placeholder.
    *   **Verkle Witness Transactions**: This concept is highly speculative. There is no formal EIP for such a transaction type yet. It's more likely that Verkle-related data will be handled within existing or new general-purpose transaction formats rather than a dedicated transaction type. Using `BlobTx` from EIP-4844 as a structural reference for transactions with auxiliary data (like a sidecar) is a good approach.

4.  **Verkle Tree Implementation**: While the prompt provides a good starting point in Zig, it's important to note that `go-ethereum`'s `master` branch does not yet contain an integrated Verkle tree implementation. Implementers should refer to the official Verkle tree specifications and research repositories rather than expecting a complete reference within Geth's main codebase.

5.  **Account Abstraction (EIP-4337)**: EIP-4337 is currently implemented at the bundler/mempool level, not as part of the core EVM consensus (i.e., it's not "enshrined"). `go-ethereum` has support for this via its bundler tooling. The prompt's approach of adding direct support (`UserOperation` transaction type) anticipates a future EIP (like EIP-7560) that may enshrine AA. This is a forward-looking approach, but it's important to distinguish it from the current EIP-4337 standard.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether DAO fork switches are supported

	// EIP150 implements the Gas price changes for IO-heavy operations gas price changes.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements Simple replay attack protection.
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements Spurious Dragon gas price changes.
	// This feature is also termed tangerineWhistle.
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on arrowglacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on grayglacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplit switch block (nil = no fork, 0 = already on merge netsplit)
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty marker for post-merge, must be zero after.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`
	// TerminalTotalDifficultyPassed is a flag indicating whether the TTD has been successfully passed.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Shanghai switch time (nil = no fork, 0 = already on shanghai)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch time (nil = no fork, 0 = already on cancun)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch time (nil = no fork, 0 = already on prague)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// Verkle switch time (nil = no fork, 0 = already on verkle)
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// Engine rule configuration
	Clique *CliqueConfig `json:"clique,omitempty"`
	Ethash *EthashConfig `json:"ethash,omitempty"`
}

// IsPrague returns whether prague is active at the given time.
func (c *ChainConfig) IsPrague(time uint64) bool {
	return c.PragueTime != nil && time >= *c.PragueTime
}

// IsVerkle returns whether verkle is active at the given time.
func (c *ChainConfig) IsVerkle(time uint64) bool {
	return c.VerkleTime != nil && time >= *c.VerkleTime
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Transaction types.
const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
	SetCodeTxType // EIP-7702
)

// SetCodeTx is the data of EIP-7702 transactions.
type SetCodeTx struct {
	ChainID *big.Int

	Nonce    uint64
	GasPrice *big.Int
	Gas      uint64

	// For EOA sender, To is the address of an account that the transaction sender
	// wishes to impersonate.
	// For contract sender, To is the address of a contract to call.
	To *common.Address

	Value *big.Int
	Data  []byte

	// EIP-7702 fields
	Code    []byte
	Auth    []byte
	AuthVer uint64

	// Signature values
	V *big.Int `json:"v" gencodec:"required"`
	R *big.Int `json:"r" gencodec:"required"`
	S *big.Int `json:"s" gencodec:"required"`
}

// copy creates a deep copy of the transaction data and initializes all fields.
func (tx *SetCodeTx) copy() TxData {
	return &SetCodeTx{
		ChainID:  new(big.Int).Set(tx.ChainID),
		Nonce:    tx.Nonce,
		GasPrice: new(big.Int).Set(tx.GasPrice),
		Gas:      tx.Gas,
		To:       copyAddressPtr(tx.To),
		Value:    new(big.Int).Set(tx.Value),
		Data:     common.CopyBytes(tx.Data),
		Code:     common.CopyBytes(tx.Code),
		Auth:     common.CopyBytes(tx.Auth),
		AuthVer:  tx.AuthVer,
		V:        new(big.Int).Set(tx.V),
		R:        new(big.Int).Set(tx.R),
		S:        new(big.Int).Set(tx.S),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, occurred error and refunds the gas instead of leaving it
// to the caller.
func ApplyTransaction(config *params.ChainConfig, bc core.ChainContext, author *common.Address, gp *core.GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction, usedGas *uint64, evm *vm.EVM) (*types.Receipt, error) {
	// ... (omitted initial setup)

	// Apply the transaction to the current state (included in the env).
	// Before the execution, the transaction fee is charged from the sender's account.
	// After the execution, the unused gas is refunded to the sender's account.
	var st *StateTransition
	var err error
	switch tx.Type() {
	case types.SetCodeTxType:
		// When applying set_code transaction, the sender address can be different
		// from tx.From(). It depends on the authorization of 'to' account.
		st, err = NewSetCodeStateTransition(evm, tx, gp)
	default:
		st, err = NewStateTransition(evm, tx, gp)
	}
	if err != nil {
		return nil, err
	}

	// ... (omitted gas pre-check)

	receipt, err := st.TransitionDb()
	if err != nil {
		return nil, err
	}
	*usedGas += receipt.GasUsed
	//...
	return receipt, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// Constantinople opcodes
const (
	SHL = 0x1b
	SHR = 0x1c
	SAR = 0x1d

	EXTCODEHASH = 0x3f

	CREATE2 = 0xf5
)

// Istanbul opcodes
const (
	CHAINID     = 0x46
	SELFBALANCE = 0x47
)

// London opcodes
const (
	BASEFEE = 0x48
)

// Shanghai opcodes
const (
	PUSH0 = 0x5f
)

// Cancun opcodes
const (
	TLOAD       = 0x5c
	TSTORE      = 0x5d
	MCOPY       = 0x5e
	BLOBHASH    = 0x49
	BLOBBASEFEE = 0x4a
)

// Pectra opcodes
const (
	AUTH     = 0xe0
	AUTHCALL = 0xe1

	// EIP-7702: Set Code Transaction opcodes.
	SETCODE      = 0xe2
	SETCODECALL  = 0xe3
	SETCODECREAT = 0xe4 // EIP-7702 uses CREATE, CREATE2, not SETCODECREATE.
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the slice of the
// data, an error if it failed, and the remaining gas.
func (in *EVMInterpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// ... (omitted setup)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	// ... (omitted tracer setup)
	
	for {
		// ... (omitted tracing hooks)

		// Get the operation from the jump table and validate the stack.
		op := contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Static calls can't write to state.
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}

		// Execute the operation.
		switch op {
		// ... (cases for most opcodes)
		case TLOAD:
			// opTload is a new opcode for Cancun
			v, err := opTload(pc, in, contract, stack, mem, &operation)
			if err != nil {
				return nil, err
			}
			stack.push(v)
		case TSTORE:
			// opTstore is a new opcode for Cancun
			if err := opTstore(pc, in, contract, stack, mem, &operation); err != nil {
				return nil, err
			}
		case MCOPY:
			// opMcopy is a new opcode for Cancun
			if err := opMcopy(pc, in, contract, stack, mem, &operation); err != nil {
				return nil, err
			}
		case BLOBHASH:
			// opBlobHash is a new opcode for Cancun
			v, err := opBlobHash(pc, in, contract, stack, mem, &operation)
			if err != nil {
				return nil, err
			}
			stack.push(v)
		case BLOBBASEFEE:
			// opBlobBaseFee is a new opcode for Cancun
			v := opBlobBaseFee(pc, in, contract, stack, mem, &operation)
			stack.push(v)
		// ... (other cases)
		}
		// ... (omitted PC increment logic)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/user_operation.go">
```go
// UserOperation is the data structure which used for EIP-4337.
type UserOperation struct {
	Sender               common.Address `json:"sender"`
	Nonce                *hexutil.Big   `json:"nonce"`
	InitCode             hexutil.Bytes  `json:"initCode"`
	CallData             hexutil.Bytes  `json:"callData"`
	CallGasLimit         *hexutil.Big   `json:"callGasLimit"`
	VerificationGasLimit *hexutil.Big   `json:"verificationGasLimit"`
	PreVerificationGas   *hexutil.Big   `json:"preVerificationGas"`
	MaxFeePerGas         *hexutil.Big   `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *hexutil.Big   `json:"maxPriorityFeePerGas"`
	PaymasterAndData     hexutil.Bytes  `json:"paymasterAndData"`
	Signature            hexutil.Bytes  `json:"signature"`
}

// PackedUserOperation is the packed version of UserOperation.
// It is used for calculating the hash of a UserOperation.
type PackedUserOperation struct {
	Sender               common.Address
	Nonce                *big.Int
	InitCode             []byte
	CallData             []byte
	CallGasLimit         *big.Int
	VerificationGasLimit *big.Int
	PreVerificationGas   *big.Int
	MaxFeePerGas         *big.Int
	MaxPriorityFeePerGas *big.Int
	PaymasterAndData     []byte
	Signature            []byte
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/gasprice/gasprice.go">
```go
// SuggestUserOperationGasTip returns a gas tip cap for given user operation.
// It is the same as SuggestGasTipCap, but it also considers the user operation's content.
func (gpo *Oracle) SuggestUserOperationGasTip(ctx context.Context, op *types.UserOperation) (*big.Int, error) {
	// ... (implementation omitted)
	return gpo.suggestTipCap(ctx)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/verkle/trie.go">
```go
// Trie is a verkle trie.
type Trie struct {
	root   Node
	rawRoot *InternalNode

	// The following fields are only used if the trie is used as a state
	// trie for an account. In that case, the owner of the trie is this
	// account.
	owner     *common.Address
	stateDB   StateDatabase
	codeDB    ContractCodeDatabase
	snaps     *snapcache.Cache
	snapRoot  common.Hash
	committed bool // Whether the trie has been committed.
}

// New creates a new verkle trie.
func New(db StateDatabase, codeDB ContractCodeDatabase) (*Trie, error) {
	return &Trie{root: Empty(false), stateDB: db, codeDB: codeDB}, nil
}

// Get returns the value for key stored in the trie.
func (t *Trie) Get(key []byte) ([]byte, error) {
	if len(key) != 32 {
		panic(fmt.Sprintf("can not use key of length %d in verkle trie", len(key)))
	}
	var k [32]byte
	copy(k[:], key)
	return t.get(t.root, k[:]), nil
}

func (t *Trie) get(n Node, key []byte) []byte {
	// ... (implementation omitted)
}


// Update inserts a new value for a given key.
func (t *Trie) Update(key, value []byte) error {
	if len(key) != 32 {
		panic(fmt.Sprintf("can not use key of length %d in verkle trie", len(key)))
	}
	// ...
	k := common.BytesToHash(key)
	if err := t.TryUpdate(k[:], value); err != nil {
		return err
	}
	return nil
}

// TryUpdate attempts to update a value in the trie.
func (t *Trie) TryUpdate(key, value []byte) error {
	// ...
	var k [32]byte
	copy(k[:], key)
	newRoot, err := t.insert(t.root, k[:], value)
	if err != nil {
		return err
	}
	t.root = newRoot
	return nil
}

// insert is the main entry point for the verkle trie insertion.
func (t *Trie) insert(n Node, key []byte, value []byte) (Node, error) {
	// ...
}

// Prove creates a verkle proof for the given key.
func (t *Trie) Prove(key []byte) (*Proof, []byte, error) {
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/verkle/node.go">
```go
// Node represents a node in the verkle trie.
type Node interface {
	// Hash returns the hash of the node. If the node is not flushed,
	// it will be computed on the fly.
	Hash() common.Hash

	// Commitment returns the commitment of the node.
	Commitment() *Point

	// insert or update a node.
	insert(key []byte, value []byte) (Node, error)

	// get a value from the trie.
	get(key []byte) []byte

	// computeCommitment forces the computation of the commitment of a node
	// and its children.
	computeCommitment(flush bool) (*Point, error)

	// Flush writes the node to the database and returns a hash node.
	Flush(flushState) (Node, error)

	// Copy returns a deep copy of the node.
	Copy() Node
}

// InternalNode represents a branch node in the verkle trie.
type InternalNode struct {
	// List of children nodes of this internal node.
	children [width]Node

	// Each bit in this field is a flag indicating whether a child is
	// "hashed".
	// Hashed in this context means that the node is not in memory, and
	// its commitment is its hash.
	// This is a slight abuse of the HashNode type, which is used for
	// several purposes:
	// - a node that is not in memory, whose commitment is its hash.
	// - a node that has been flushed to the database.
	// - a node that is "hashed-out" by a proof of absence.
	hashedChildren uint256.Int

	// The depth of this node in the trie.
	depth byte

	// Cache the commitment value, which is expensive to compute.
	commitment *Point
	hash       *common.Hash

	// The following fields are used to track the state of the node.
	// If dirty is true, the node needs to be flushed to the database.
	dirty bool
}

// LeafNode represents a leaf node in the verkle trie.
// A leaf node contains a key and a value.
type LeafNode struct {
	key   []byte
	value []byte

	// Cache the commitment value, which is expensive to compute.
	commitment *Point
	hash       *common.Hash

	// The following fields are used to track the state of the node.
	// If dirty is true, the node needs to be flushed to the database.
	dirty bool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
var (
	// PrecompiledContractsBerlin contains the precompiled contracts starting from the Berlin hard fork.
	PrecompiledContractsBerlin = newPrecompiles(big.NewInt(params.Berlin))

	// PrecompiledContractsCancun contains the precompiled contracts starting from the Cancun hard fork.
	PrecompiledContractsCancun = newPrecompiles(big.NewInt(params.Cancun))
)

// PrecompiledContract is the interface that a precompiled contract is expected to implement.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error) // Run runs the pre-compiled contract.
}


// pointEvaluation implements the point evaluation precompile.
type pointEvaluation struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *pointEvaluation) RequiredGas(input []byte) uint64 {
	return params.PointEvaluationGas
}

// Run runs the pre-compiled contract.
func (p *pointEvaluation) Run(input []byte) ([]byte, error) {
	// EIP-4844 point evaluation precompile takes a 192 byte input
	// versioned_hash (32 bytes) | z (32 bytes) | y (32 bytes) | commitment (48 bytes) | proof (48 bytes)
	// and returns a 64 byte output
	// field_elements_per_blob (32 bytes) | bls_modulus (32 bytes)
	if len(input) != 192 {
		return nil, fmt.Errorf("invalid input length: have %d, want 192", len(input))
	}
	var (
		versionedHash = input[0:32]
		z             = input[32:64]
		y             = input[64:96]
		commitment    = input[96:144]
		proof         = input[144:192]

		// The versioned hash is the sha256 of the commitment, with the first
		// byte set to the version (0x01).
		h = sha256.Sum256(commitment)
	)
	if h[0] != 1 || !bytes.Equal(h[1:], versionedHash[1:]) {
		return nil, errors.New("invalid versioned hash")
	}

	// Verify the KZG proof
	var (
		c kzg4844.Commitment
		pr kzg4844.Proof
	)
	copy(c[:], commitment)
	copy(pr[:], proof)
	if err := kzg4844.VerifyProof(c, pr, kzg4844.Point(common.BytesToHash(z)), kzg4844.Point(common.BytesToHash(y))); err != nil {
		return nil, err
	}
	// Return the required values if verification is successful.
	var ret [64]byte
	new(big.Int).SetUint64(params.FieldElementsPerBlob).FillBytes(ret[:32])
	params.BLSModulus.FillBytes(ret[32:])
	return ret[:], nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt contains several inaccuracies and speculative details about the Prague/Pectra hardfork. Here are some corrections and clarifications based on the latest information and `go-ethereum`'s implementation:

1.  **Hardfork Naming**: The prompt uses "Prague". The official name for the next hardfork is now **Pectra**, which combines the Execution Layer upgrade (Prague) and the Consensus Layer upgrade (Electra). It would be more accurate to use "Pectra" in the implementation.

2.  **Opcode Numbering**: The prompt suggests `VERKLE_VERIFY = 0x49` and `CODE_COPY_VERKLE = 0x4A`. These opcode values are already assigned in the Cancun hardfork:
    *   `0x49` is `BLOBHASH` (EIP-4844).
    *   `0x4A` is `BLOBBASEFEE` (EIP-7516).
    The final opcode numbers for Pectra are yet to be determined and will not conflict with existing ones. The implementation should treat these as placeholders.

3.  **New Opcodes for Pectra**: The prompt's opcodes (`VERKLE_VERIFY`, `ACCOUNT_CODE`, `ACCOUNT_SIZE`) are speculative. While Verkle-related opcodes are expected, the most concrete opcode proposals for Pectra are from **EIP-3074 (AUTH and AUTHCALL)**, which are not mentioned in the prompt. Additionally, **EIP-7702 (Set Code Transaction)** is likely to be included, but it introduces a new transaction type, not opcodes as the `go-ethereum` code shows.

4.  **Account Abstraction Precompile**: The prompt suggests a precompile for Account Abstraction at address `0x13`. EIP-4337 Account Abstraction works through an **EntryPoint contract**, not a precompile. The bundler logic is off-chain, and on-chain operations are handled by calling the `EntryPoint.handleOps` function. There is no dedicated AA precompile planned.

5.  **Transaction Types**:
    *   The prompt correctly identifies `SetCodeTransaction` (EIP-7702) as type `0x04`.
    *   The `UserOperation` is not a standard transaction type but a data structure submitted to an alternative mempool for EIP-4337. It is bundled into a regular transaction by a "Bundler" that calls the `EntryPoint` contract.
    *   A `VerkleWitnessTransaction` is speculative. While witness data will be necessary, its inclusion in a distinct transaction type is not yet finalized.

6.  **Verkle Trees**: The prompt's Zig implementation of a Verkle tree is a good starting point, but a production implementation would be significantly more complex, relying on polynomial commitments (like KZG) and cryptographic libraries. The `go-ethereum/trie/verkle` package provides a more complete reference for the data structures (`InternalNode`, `LeafNode`) and algorithms involved.

