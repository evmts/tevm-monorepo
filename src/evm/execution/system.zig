const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../frame/contract.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;
const Log = @import("../log.zig");

// ============================================================================
// Call Operation Types and Gas Calculation
// ============================================================================

/// Call operation types for gas calculation
pub const CallType = enum {
    Call,
    CallCode,
    DelegateCall,
    StaticCall,
};

/// Input parameters for contract call operations
///
/// Contains all necessary information to execute a contract call including
/// addresses, value, call data, gas limits, and context information.
pub const CallInput = struct {
    /// Address of the contract to call
    contract_address: Address,

    /// Address of the caller (msg.sender in the called contract)
    caller: Address,

    /// Value to transfer (ETH amount in wei)
    value: u256,

    /// Input data (calldata) to pass to the contract
    input: []const u8,

    /// Gas limit for the call execution
    gas_limit: u64,

    /// Whether this is a static call (read-only, no state changes)
    is_static: bool,

    /// Current call depth in the call stack
    depth: u32,

    /// Original caller for DELEGATECALL context preservation (optional)
    original_caller: ?Address = null,

    /// Original value for DELEGATECALL context preservation (optional)
    original_value: ?u256 = null,

    /// Create CallInput for a CALL operation
    pub fn call(
        contract_address: Address,
        caller: Address,
        value: u256,
        input: []const u8,
        gas_limit: u64,
        is_static: bool,
        depth: u32,
    ) CallInput {
        return CallInput{
            .contract_address = contract_address,
            .caller = caller,
            .value = value,
            .input = input,
            .gas_limit = gas_limit,
            .is_static = is_static,
            .depth = depth,
        };
    }

    /// Create CallInput for a DELEGATECALL operation
    /// Preserves original caller and value from parent context
    pub fn delegate_call(
        contract_address: Address,
        original_caller: Address,
        original_value: u256,
        input: []const u8,
        gas_limit: u64,
        is_static: bool,
        depth: u32,
    ) CallInput {
        return CallInput{
            .contract_address = contract_address,
            .caller = original_caller, // Preserve original caller
            .value = original_value, // Preserve original value
            .input = input,
            .gas_limit = gas_limit,
            .is_static = is_static,
            .depth = depth,
            .original_caller = original_caller,
            .original_value = original_value,
        };
    }

    /// Create CallInput for a STATICCALL operation
    /// Implicitly sets value to 0 and is_static to true
    pub fn static_call(
        contract_address: Address,
        caller: Address,
        input: []const u8,
        gas_limit: u64,
        depth: u32,
    ) CallInput {
        return CallInput{
            .contract_address = contract_address,
            .caller = caller,
            .value = 0, // Static calls cannot transfer value
            .input = input,
            .gas_limit = gas_limit,
            .is_static = true, // Force static context
            .depth = depth,
        };
    }
};

/// Result of a contract call operation
///
/// Contains the execution result, gas usage, output data, and success status.
pub const CallResult = struct {
    /// Whether the call succeeded (true) or reverted (false)
    success: bool,

    /// Gas consumed during execution
    gas_used: u64,

    /// Gas remaining after execution
    gas_left: u64,

    /// Output data returned by the called contract
    output: ?[]const u8,

    /// Create a successful call result
    pub fn success_result(gas_used: u64, gas_left: u64, output: ?[]const u8) CallResult {
        return CallResult{
            .success = true,
            .gas_used = gas_used,
            .gas_left = gas_left,
            .output = output,
        };
    }

    /// Create a failed call result
    pub fn failure_result(gas_used: u64, gas_left: u64, output: ?[]const u8) CallResult {
        return CallResult{
            .success = false,
            .gas_used = gas_used,
            .gas_left = gas_left,
            .output = output,
        };
    }
};

/// Calculate the 63/64th gas forwarding rule (EIP-150)
///
/// EIP-150 specifies that a maximum of 63/64 of remaining gas can be forwarded to subcalls.
/// This prevents griefing attacks where all gas is forwarded, leaving no gas for cleanup.
///
/// @param remaining_gas Available gas before the call
/// @return Maximum gas that can be forwarded (63/64 of remaining)
fn calculate_63_64_gas(remaining_gas: u64) u64 {
    if (remaining_gas == 0) return 0;
    return remaining_gas - (remaining_gas / 64);
}

/// Calculate complete gas cost for call operations
///
/// Implements the complete gas calculation as per EVM specification including:
/// - Base call cost (depends on call type)
/// - Account access cost (cold vs warm)
/// - Value transfer cost
/// - Account creation cost
/// - Memory expansion cost
/// - Gas forwarding calculation (63/64th rule)
///
/// @param call_type Type of call operation
/// @param value Value being transferred (0 for non-value calls)
/// @param target_exists Whether target account exists
/// @param is_cold_access Whether this is first access to account (EIP-2929)
/// @param remaining_gas Available gas before operation
/// @param memory_expansion_cost Cost for expanding memory
/// @param local_gas_limit Gas limit specified in call parameters
/// @return Total gas cost including forwarded gas
pub fn calculate_call_gas(
    call_type: CallType,
    value: u256,
    target_exists: bool,
    is_cold_access: bool,
    remaining_gas: u64,
    memory_expansion_cost: u64,
    local_gas_limit: u64,
) u64 {
    var gas_cost: u64 = 0;

    // Base cost for call operation type
    gas_cost += switch (call_type) {
        .Call => if (value > 0) gas_constants.CallValueCost else gas_constants.CallCodeCost,
        .CallCode => gas_constants.CallCodeCost,
        .DelegateCall => gas_constants.DelegateCallCost,
        .StaticCall => gas_constants.StaticCallCost,
    };

    // Account access cost (EIP-2929)
    if (is_cold_access) {
        gas_cost += gas_constants.ColdAccountAccessCost;
    }

    // Memory expansion cost
    gas_cost += memory_expansion_cost;

    // Account creation cost for new accounts with value transfer
    if (!target_exists and call_type == .Call and value > 0) {
        gas_cost += gas_constants.NewAccountCost;
    }

    // Calculate available gas for forwarding after subtracting operation costs
    if (gas_cost >= remaining_gas) {
        return gas_cost; // Out of gas - no forwarding possible
    }

    const gas_after_operation = remaining_gas - gas_cost;

    // Apply 63/64th rule to determine maximum forwardable gas
    const max_forwardable = calculate_63_64_gas(gas_after_operation);

    // Use minimum of requested gas and maximum forwardable
    const gas_to_forward = @min(local_gas_limit, max_forwardable);

    return gas_cost + gas_to_forward;
}

// ============================================================================
// Return Data Opcodes (EIP-211)
// ============================================================================

// Gas opcode handler
pub fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append(@as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) {
        @branchHint(.cold);
        return ExecutionError.Error.InvalidOffset;
    }
}

// Snapshot and revert helper functions for opcode-level state management

/// Create a snapshot for opcode-level state management
///
/// This function provides a convenient way for opcodes to create state snapshots
/// before performing operations that might need to be reverted.
///
/// ## Parameters
/// - `vm`: VM instance to create snapshot on
///
/// ## Returns
/// - Success: Snapshot identifier
/// - Error: OutOfMemory if snapshot allocation fails
pub fn create_snapshot(vm: *Vm) std.mem.Allocator.Error!usize {
    Log.debug("system.create_snapshot: Creating state snapshot", .{});
    return try vm.create_snapshot();
}

/// Commit a snapshot, making all changes permanent
///
/// This function commits all state changes made since the snapshot was created.
/// Once committed, the changes cannot be reverted using this snapshot.
///
/// ## Parameters
/// - `vm`: VM instance to commit snapshot on
/// - `snapshot_id`: Identifier of the snapshot to commit
pub fn commit_snapshot(vm: *Vm, snapshot_id: usize) void {
    Log.debug("system.commit_snapshot: Committing snapshot id={}", .{snapshot_id});
    vm.commit_snapshot(snapshot_id);
}

/// Revert to a snapshot, undoing all changes since the snapshot was created
///
/// This function restores the VM state to exactly how it was when the snapshot
/// was created. This is used for opcodes like REVERT and for failed operations.
///
/// ## Parameters
/// - `vm`: VM instance to revert snapshot on
/// - `snapshot_id`: Identifier of the snapshot to revert to
///
/// ## Returns
/// - Success: void
/// - Error: Invalid snapshot ID or reversion failure
pub fn revert_to_snapshot(vm: *Vm, snapshot_id: usize) !void {
    Log.debug("system.revert_to_snapshot: Reverting to snapshot id={}", .{snapshot_id});
    try vm.revert_to_snapshot(snapshot_id);
}

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    // Debug: CREATE opcode: value, offset, size

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        @branchHint(.unlikely);
        return ExecutionError.Error.MaxCodeSizeExceeded;
    }

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
    }

    // Calculate gas for creation
    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract
    const result = try vm.create_contract(frame.contract.address, value, init_code, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
        try frame.return_data.set(result.output orelse &[_]u8{});
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append(to_u256(result.address));

    // Set return data
    try frame.return_data.set(result.output orelse &[_]u8{});

    return Operation.ExecutionResult{};
}

/// CREATE2 opcode - Create contract with deterministic address
pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    const salt = try frame.stack.pop();

    if (frame.depth >= 1024) {
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        @branchHint(.unlikely);
        return ExecutionError.Error.MaxCodeSizeExceeded;
    }

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
    }

    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.Keccak256WordGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + hash_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
        try frame.return_data.set(result.output orelse &[_]u8{});
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append(to_u256(result.address));

    // Set return data
    try frame.return_data.set(result.output orelse &[_]u8{});

    return Operation.ExecutionResult{};
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check static call restrictions
    if (frame.is_static and value != 0) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the call
    const result = try vm.call_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    try frame.return_data.set(result.output orelse &[_]u8{});

    // Push success status (bounds checking already done by jump table)
    frame.stack.append_unsafe(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the callcode (execute target's code with current storage context)
    // For callcode, we use the current contract's address as the execution context
    const result = try vm.callcode_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    try frame.return_data.set(result.output orelse &[_]u8{});

    // Push success status (bounds checking already done by jump table)
    frame.stack.append_unsafe(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // DELEGATECALL takes 6 parameters (no value parameter)
    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check call depth limit
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // DELEGATECALL preserves the current context:
    // - Uses current contract's storage
    // - Preserves msg.sender and msg.value from parent call
    // - Executes target contract's code in current context
    // - Cannot transfer value (no value parameter)

    // Execute the delegatecall (execute target's code with current context)
    const result = try vm.delegatecall_contract(frame.contract.address, to_address, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    try frame.return_data.set(result.output orelse &[_]u8{});

    // Push success status (bounds checking already done by jump table)
    frame.stack.append_unsafe(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // STATICCALL takes 6 parameters (no value parameter)
    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check call depth limit
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // STATICCALL characteristics:
    // - Forces static context (no state changes allowed in called contract)
    // - Cannot transfer value (value is implicitly 0)
    // - Prevents SSTORE, CREATE, SELFDESTRUCT in called contract
    // - Uses clean call context (new msg.sender)

    // Execute the staticcall (read-only call with static restrictions)
    const result = try vm.staticcall_contract(frame.contract.address, to_address, args, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    try frame.return_data.set(result.output orelse &[_]u8{});

    // Push success status (bounds checking already done by jump table)
    frame.stack.append_unsafe(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

/// SELFDESTRUCT opcode (0xFF): Destroy the current contract and send balance to recipient
///
/// This opcode destroys the current contract, sending its entire balance to a recipient address.
/// The behavior has changed significantly across hardforks:
/// - Frontier: 0 gas cost
/// - Tangerine Whistle (EIP-150): 5000 gas base cost
/// - Spurious Dragon (EIP-161): Additional 25000 gas if creating a new account
/// - London (EIP-3529): Removed gas refunds for selfdestruct
///
/// In static call contexts, SELFDESTRUCT is forbidden and will revert.
/// The contract is only marked for destruction and actual deletion happens at transaction end.
///
/// Stack: [recipient_address] -> []
/// Gas: Variable based on hardfork and account creation
/// Memory: No memory access
/// Storage: Contract marked for destruction
pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const vm: *Vm = @ptrCast(interpreter);
    const frame: *Frame = @ptrCast(state);
    
    // Static call protection - SELFDESTRUCT forbidden in static context
    if (frame.is_static) {
        @branchHint(.cold);
        return ExecutionError.Error.WriteProtection;
    }
    
    // Pop recipient address from stack (bounds checking already done by jump table)
    const recipient_u256 = frame.stack.pop_unsafe();
    const recipient_address = from_u256(recipient_u256);
    
    // Get hardfork rules for gas calculation
    const chain_rules = vm.chain_rules;
    var gas_cost: u64 = 0;
    
    // Calculate base gas cost based on hardfork
    if (chain_rules.IsTangerineWhistle) {
        gas_cost += gas_constants.SelfdestructGas; // 5000 gas
    }
    // Before Tangerine Whistle: 0 gas cost
    
    // EIP-161: Account creation cost if transferring to a non-existent account
    if (chain_rules.IsSpuriousDragon) {
        @branchHint(.likely);
        
        // Check if the recipient account exists and is empty
        const recipient_exists = vm.state.account_exists(recipient_address);
        if (!recipient_exists) {
            @branchHint(.cold);
            gas_cost += gas_constants.CallNewAccountGas; // 25000 gas
        }
    }
    
    // Account for access list gas costs (EIP-2929)
    if (chain_rules.IsBerlin) {
        @branchHint(.likely);
        
        // Warm up recipient address access
        const access_cost = vm.state.warm_account_access(recipient_address);
        gas_cost += access_cost;
    }
    
    // Check if we have enough gas
    if (gas_cost > frame.gas_remaining) {
        @branchHint(.cold);
        return ExecutionError.Error.OutOfGas;
    }
    
    // Consume gas
    frame.gas_remaining -= gas_cost;
    
    // Mark contract for destruction with recipient
    vm.state.mark_for_destruction(frame.contract.address, recipient_address);
    
    // SELFDESTRUCT halts execution immediately
    return ExecutionError.Error.STOP;
}

/// EXTCALL opcode (0xF8): External call with EOF validation
/// Not implemented - EOF feature
pub fn op_extcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTDELEGATECALL opcode (0xF9): External delegate call with EOF validation
/// Not implemented - EOF feature
pub fn op_extdelegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTSTATICCALL opcode (0xFB): External static call with EOF validation
/// Not implemented - EOF feature
pub fn op_extstaticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}
