const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;

// Import helper functions from error_mapping

pub fn op_address(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push contract address as u256
    const addr = to_u256(frame.contract.address);
    try frame.stack.append(addr);

    return Operation.ExecutionResult{};
}

pub fn op_balance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get balance from VM state
    const balance = vm.state.get_balance(address);
    try frame.stack.append(balance);

    return Operation.ExecutionResult{};
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push transaction origin address
    const origin = to_u256(vm.context.tx_origin);
    try frame.stack.append(origin);

    return Operation.ExecutionResult{};
}

pub fn op_caller(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push caller address
    const caller = to_u256(frame.contract.caller);
    try frame.stack.append(caller);

    return Operation.ExecutionResult{};
}

pub fn op_callvalue(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push call value
    try frame.stack.append(frame.contract.value);

    return Operation.ExecutionResult{};
}

pub fn op_gasprice(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push gas price from transaction context
    try frame.stack.append(vm.context.gas_price);

    return Operation.ExecutionResult{};
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code size from VM state
    const code = vm.state.get_code(address);
    try frame.stack.append(@as(u256, @intCast(code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const mem_offset = try frame.stack.pop();
    const code_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const address = from_u256(address_u256);
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get external code from VM state
    const code = vm.state.get_code(address);

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code from VM state and compute hash
    const code = vm.state.get_code(address);
    if (code.len == 0) {
        @branchHint(.unlikely);
        // Empty account - return zero
        try frame.stack.append(0);
    } else {
        // Compute keccak256 hash of the code
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});

        // Convert hash to u256 using std.mem for efficiency
        const hash_u256 = std.mem.readInt(u256, &hash, .big);
        try frame.stack.append(hash_u256);
    }

    return Operation.ExecutionResult{};
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get balance of current executing contract
    const self_address = frame.contract.address;
    const balance = vm.state.get_balance(self_address);
    try frame.stack.append(balance);

    return Operation.ExecutionResult{};
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push chain ID from VM context
    try frame.stack.append(vm.context.chain_id);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of calldata - use frame.input which is set by the VM
    // The frame.input is the actual calldata for this execution context
    try frame.stack.append(@as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of current contract's code
    try frame.stack.append(@as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try frame.stack.pop();

    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        // Offset too large, push zero
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const calldata = frame.input; // Use frame.input, not frame.contract.input

    // Load 32 bytes from calldata, padding with zeros if necessary
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        if (offset_usize + i < calldata.len) {
            @branchHint(.likely);
            value = (value << 8) | calldata[offset_usize + i];
        } else {
            value = value << 8; // Pad with zero
        }
    }

    try frame.stack.append(value);

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, data offset, and size
    const mem_offset = try frame.stack.pop();
    const data_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation (VERYLOW * word_count)
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get calldata from frame.input
    const calldata = frame.input;

    // Use set_data_bounded to copy the calldata to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, calldata, data_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, code offset, and size
    const mem_offset = try frame.stack.pop();
    const code_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get current contract code
    const code = frame.contract.code;

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}
/// RETURNDATALOAD opcode (0xF7): Loads a 32-byte word from return data
/// This is an EOF opcode that allows reading from the return data buffer
pub fn op_returndataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try frame.stack.pop();

    // Check if offset is within bounds
    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const offset_usize = @as(usize, @intCast(offset));
    const return_data = frame.return_data.get();

    // If offset + 32 > return_data.len, this is an error (unlike CALLDATALOAD which pads with zeros)
    if (offset_usize + 32 > return_data.len) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    // Load 32 bytes from return data
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        value = (value << 8) | return_data[offset_usize + i];
    }

    try frame.stack.append(value);

    return Operation.ExecutionResult{};
}
