const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

// Helper to convert Stack errors to ExecutionError
fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const slot = try stack_pop(&frame.stack);
    
    // EIP-2929: Check if storage slot is cold and consume appropriate gas
    const is_cold = try frame.contract.mark_storage_slot_warm(slot, null);
    if (is_cold) {
        // Cold storage access costs more (2100 gas)
        try frame.consume_gas(gas_constants.ColdSloadCost - gas_constants.WarmStorageReadCost); // Subtract the warm cost already consumed by the opcode
    }
    
    // Get storage value
    const value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}

/// SSTORE opcode (0x55): Store value in persistent storage
/// 
/// Writes a 256-bit value to a storage slot in the current contract's storage.
/// This is one of the most expensive operations due to state persistence costs.
/// 
/// ## Stack Requirements
/// - Consumes 2 values: [slot, value]
///   - `slot`: 256-bit storage slot key
///   - `value`: 256-bit value to store
/// 
/// ## Gas Cost (Complex - varies by hardfork and state transitions)
/// 
/// ### Pre-Berlin (EIP-2200):
/// - SLOAD cost (200 gas) + dynamic cost based on state transition:
///   - Zero → Non-zero: 20,000 gas (SSTORE_SET)
///   - Non-zero → Different non-zero: 5,000 gas (SSTORE_RESET)
///   - Non-zero → Zero: 5,000 gas + 15,000 refund (SSTORE_CLEAR)
///   - Any → Same: 200 gas (SLOAD cost only)
/// 
/// ### Berlin+ (EIP-2929 + EIP-3529):
/// - Cold access: 2,100 gas + dynamic cost
/// - Warm access: 100 gas + dynamic cost
/// - Dynamic costs:
///   - Zero → Non-zero: 20,000 gas
///   - Non-zero → Different non-zero: 2,900 gas (reduced from 5,000)
///   - Non-zero → Zero: 2,900 gas + 4,800 refund (reduced from 15,000)
///   - Any → Same: 100 gas
/// 
/// ## State Transitions
/// - **Clean**: Slot hasn't been modified in current transaction
/// - **Dirty**: Slot has been modified in current transaction
/// - **Original**: Value at start of transaction
/// - **Current**: Current value in storage
/// - **New**: Value being written
/// 
/// ## Edge Cases
/// - Fails in static calls (no state modifications allowed)
/// - Storage slots are contract-specific (isolated per address)
/// - Refunds are capped at gas_used/5 (EIP-3529)
/// - Setting to zero doesn't actually delete - slot remains allocated
/// 
/// ## Security Considerations
/// - Reentrancy: Storage changes persist even if later subcall reverts
/// - Gas griefing: Changing from zero costs significantly more
/// - Cold/warm tracking prevents some gas-based attacks (EIP-2929)
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Static calls cannot modify state
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const slot = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    
    // EIP-2929: Track cold/warm storage access
    // First access in transaction costs 2100 gas, subsequent accesses cost 100
    const is_cold = try frame.contract.mark_storage_slot_warm(slot, null);
    if (is_cold) {
        try frame.consume_gas(gas_constants.ColdSloadCost);
    }
    
    // Note: Additional dynamic gas costs for the actual storage modification
    // are handled by the VM's set_storage implementation based on state transition
    
    // Set storage value
    try error_mapping.vm_set_storage(vm, frame.contract.address, slot, value);
    
    return Operation.ExecutionResult{};
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const slot = try stack_pop(&frame.stack);
    
    // Get transient storage value (EIP-1153)
    const value = try error_mapping.vm_get_transient_storage(vm, frame.contract.address, slot);
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const slot = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    
    // Set transient storage value (EIP-1153)
    try error_mapping.vm_set_transient_storage(vm, frame.contract.address, slot, value);
    
    return Operation.ExecutionResult{};
}