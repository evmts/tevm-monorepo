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
</evmone>

## REVM Context

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
</revm>

## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork_types.py">
```python
from dataclasses import dataclass
from typing import Tuple, Union

from ethereum_types.bytes import Bytes, Bytes0, Bytes20, Bytes32, Bytes256
from ethereum_types.numeric import U64, U256, Uint

# ... (existing types)

@dataclass
class Authorization:
    """
    EIP-7702 Authorization
    """
    chain_id: U256
    address: Bytes20
    nonce: U64
    y_parity: U256
    r: U256
    s: U256

@dataclass
class SetCodeTransaction:
    """
    Represents a set code transaction (EIP-7702).
    """
    chain_id: U256
    nonce: Uint
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
```
</file>
</execution-specs>

## GO-ETHEREUM Context

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
</go-ethereum>

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
</evmone>

## REVM Context

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
</revm>

## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork_types.py">
```python
from dataclasses import dataclass
from typing import Tuple, Union

from ethereum_types.bytes import Bytes, Bytes0, Bytes20, Bytes32, Bytes256
from ethereum_types.numeric import U64, U256, Uint

# ... (existing types)

@dataclass
class Authorization:
    """
    EIP-7702 Authorization
    """
    chain_id: U256
    address: Bytes20
    nonce: U64
    y_parity: U256
    r: U256
    s: U256

@dataclass
class SetCodeTransaction:
    """
    Represents a set code transaction (EIP-7702).
    """
    chain_id: U256
    nonce: Uint
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
```
</file>
</execution-specs>

## GO-ETHEREUM Context

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
</go-ethereum>

## References

- [Prague Hardfork Meta EIP](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7600.md)
- [Verkle Trees Documentation](https://verkle.info/)
- [Account Abstraction ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)
- [EOF Specification](https://github.com/ethereum/EIPs/tree/master/EIPS) - Various EOF EIPs
- [Ethereum Research Forums](https://ethresear.ch/) - Latest Prague discussions