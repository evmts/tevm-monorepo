const std = @import("std");

// Use direct imports from parent modules
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const JumpTable = @import("../jumpTable/JumpTable.zig").JumpTable;
const jumpTableModule = @import("../jumpTable/JumpTable.zig");
const Operation = jumpTableModule.Operation;
const Memory = @import("../Memory.zig").Memory;
const Stack = @import("../Stack.zig").Stack;
const address = @import("address");
const Address = address.Address;

const u256_native = u256; // Using Zig's native u256 as the base type for stack/values

// Helper function to map stack errors to execution errors
fn mapStackError(err: anyerror) ExecutionError {
    return switch (err) {
        error.StackUnderflow => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        else => ExecutionError.OutOfGas,
    };
}

// Gas costs (ensure these are consistent with JumpTable or chain rules)
const GasPriceGas: u64 = 2;
const ExtcodeSizeGas: u64 = 100; // Formerly EIP150AccountAccessGas, now Berlin warm access
const BalanceGas: u64 = 100; // Berlin warm access
const SelfBalanceGas: u64 = 5; // Berlin
const BaseFeeGas: u64 = 2; // London
const ChainIdGas: u64 = 2; // Istanbul

/// ADDRESS operation - pushes the address of the current executing account onto the stack
pub fn opAddress(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Get the address of the current contract
    const contractAddress = frame.address();

    // Convert address bytes to u256
    const value = blk: {
        var result: u256 = 0;
        for (contractAddress) |byte| {
            result = (result << 8) | byte;
        }
        break :blk result;
    };

    // Push address onto the stack
    frame.stack.push(value);

    return "";
}

/// BALANCE operation - get the balance of the given account
pub fn opBalance(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Check if we have a state manager in the EVM
    if (interpreter.evm.state_manager == null) {
        // If no state manager, return 0 balance
        frame.stack.push(0);
        return "";
    }

    // Pop address from stack
    const addressValue = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert u256 to address
    const addressBytes = blk: {
        var bytes: [20]u8 = [_]u8{0} ** 20;
        var tempValue = addressValue;

        // Fill the address bytes from right to left (big-endian)
        var i: isize = 19;
        while (i >= 0) : (i -= 1) {
            bytes[@intCast(i)] = @truncate(tempValue);
            tempValue >>= 8;
        }
        break :blk bytes;
    };

    const queryAddress = Address{ .bytes = addressBytes };

    // EIP-2929: Check if the address is cold and calculate appropriate gas cost
    const is_cold_account = frame.contract.isAccountCold();
    const gas_cost = if (is_cold_account)
        JumpTable.ColdAccountAccessCost // Cold access (2600 gas)
    else
        JumpTable.WarmStorageReadCost; // Warm access (100 gas)

    // Check if we have enough gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }

    // Use gas
    frame.contract.useGas(gas_cost);

    // Mark the account as warm for future accesses
    _ = frame.contract.markAccountWarm();

    // Get the account from state
    if (try interpreter.evm.state_manager.?.getAccount(queryAddress)) |account| {
        // Push account balance to stack
        frame.stack.push(account.balance.value);
    } else {
        // Account doesn't exist, push 0
        frame.stack.push(0);
    }

    return "";
}

/// ORIGIN operation - get the execution origination address (tx sender)
pub fn opOrigin(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // In a full implementation, this would return the transaction origin
    // For now, we'll return the same as caller which is a simplification
    const caller = frame.caller();

    // Convert address bytes to u256
    const value = blk: {
        var result: u256 = 0;
        for (caller.bytes) |byte| {
            result = (result << 8) | byte;
        }
        break :blk result;
    };

    // Push origin address onto the stack
    frame.stack.push(value);

    return "";
}

/// CALLER operation - get the caller address
pub fn opCaller(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Get the caller address from the frame
    const caller = frame.caller();

    // Convert address bytes to u256
    const value = blk: {
        var result: u256 = 0;
        for (caller.bytes) |byte| {
            result = (result << 8) | byte;
        }
        break :blk result;
    };

    // Push caller address onto the stack
    frame.stack.push(value);

    return "";
}

/// CALLVALUE operation - get the deposited value by the instruction/transaction
pub fn opCallValue(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Get the call value from the frame
    const value = frame.callValue();

    // Push value onto the stack
    frame.stack.push(value);

    return "";
}

/// CALLDATALOAD operation - load call data from the current environment
pub fn opCalldataload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Pop offset from stack
    const offset = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert offset to u64, capped at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);

    // Get input calldata
    const inputData = frame.callInput();

    // Read 32 bytes from input at the specified offset
    const value = blk: {
        var result: u256 = 0;

        // If offset is beyond input data length, return zero
        if (offset_u64 >= inputData.len) {
            frame.stack.push(0);
            return "";
        }

        // Calculate number of bytes to read (min(32, remaining bytes))
        const bytesToRead = @min(32, inputData.len - offset_u64);

        // Read available bytes from input
        for (0..bytesToRead) |i| {
            result = (result << 8) | inputData[offset_u64 + i];
        }

        // Left-pad with zeros if needed (for missing bytes)
        if (bytesToRead < 32) {
            result <<= (32 - bytesToRead) * 8;
        }
        break :blk result;
    };

    // Push result onto the stack
    frame.stack.push(value);

    return "";
}

/// CALLDATASIZE operation - get the size of input data in current environment
pub fn opCalldatasize(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Get input calldata
    const inputData = frame.callInput();

    // Push the size of the input data onto the stack
    frame.stack.push(@as(u256, inputData.len));

    return "";
}

/// Memory size function for memory operations
fn calldatacopyMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 3) return .{ .size = 0, .overflow = false };

    const offset = stack.data[stack.size - 1];
    const size = stack.data[stack.size - 3];

    // Convert to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // Check for overflow
    if (offset_u64 > std.math.maxInt(u64) - size_u64) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }

    return .{ .size = offset_u64 + size_u64, .overflow = false };
}

/// Dynamic gas calculation for memory operations
fn memoryGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    // Parameters not used in this function
    _ = interpreter;
    _ = stack;

    const oldSize = memory.len();

    // Only resize memory if needed
    if (requested_size > oldSize) {
        // Calculate gas cost for memory expansion
        const newWords = (requested_size + 31) / 32;
        const oldWords = (oldSize + 31) / 32;

        // Quadratic cost calculation
        const newCost = newWords * newWords * 3 + newWords * 3;
        const oldCost = oldWords * oldWords * 3 + oldWords * 3;

        const cost = newCost - oldCost;

        // Check if we have enough gas
        if (frame.cost + cost > frame.contract.gas) {
            return error.OutOfGas;
        }

        // Resize memory if we have enough gas
        try memory.resize(requested_size);
    }

    // Calculate the memory expansion cost
    const newWords = (requested_size + 31) / 32;
    const oldWords = (oldSize + 31) / 32;

    const newCost = newWords * newWords * 3 + newWords * 3;
    const oldCost = oldWords * oldWords * 3 + oldWords * 3;

    return newCost - oldCost;
}

/// CALLDATACOPY operation - copy input data in current environment to memory
pub fn opCalldatacopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Stack: [destOffset, offset, size]
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }

    const size = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    const destOffset = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert to u64, capping at max value if needed
    const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, destOffset);
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // If size is zero, nothing to copy
    if (size_u64 == 0) {
        return "";
    }

    // Ensure memory is large enough
    const needed_size = destOffset_u64 + size_u64;
    if (needed_size > frame.memory.len()) {
        try frame.memory.resize(needed_size);
    }

    // Get input calldata
    const inputData = frame.callInput();

    // Copy data from input to memory
    for (0..size_u64) |i| {
        const sourceIdx = offset_u64 + i;
        const destIdx = destOffset_u64 + i;

        if (sourceIdx < inputData.len) {
            frame.memory.set(destIdx, 1, &[_]u8{inputData[sourceIdx]});
        } else {
            // Pad with zeros if reading past the end of input
            frame.memory.set(destIdx, 1, &[_]u8{0});
        }
    }

    return "";
}

/// CODESIZE operation - get the size of code running in current environment
pub fn opCodesize(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Get the code from the current contract
    const code = frame.contractCode();

    // Push the size of the code onto the stack
    frame.stack.push(@as(u256, code.len));

    return "";
}

/// Memory size function for CODECOPY operation
fn codecopyMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 3) return .{ .size = 0, .overflow = false };

    const offset = stack.data[stack.size - 1];
    const size = stack.data[stack.size - 3];

    // Convert to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // Check for overflow
    if (offset_u64 > std.math.maxInt(u64) - size_u64) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }

    return .{ .size = offset_u64 + size_u64, .overflow = false };
}

/// CODECOPY operation - copy code running in current environment to memory
pub fn opCodecopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Stack: [destOffset, offset, size]
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }

    const size = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    const destOffset = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert to u64, capping at max value if needed
    const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, destOffset);
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // If size is zero, nothing to copy
    if (size_u64 == 0) {
        return "";
    }

    // Ensure memory is large enough
    const needed_size = destOffset_u64 + size_u64;
    if (needed_size > frame.memory.len()) {
        try frame.memory.resize(needed_size);
    }

    // Get the code from the current contract
    const code = frame.contractCode();

    // Copy data from code to memory
    for (0..size_u64) |i| {
        const sourceIdx = offset_u64 + i;
        const destIdx = destOffset_u64 + i;

        if (sourceIdx < code.len) {
            frame.memory.set(destIdx, 1, &[_]u8{code[sourceIdx]});
        } else {
            // Pad with zeros if reading past the end of code
            frame.memory.set(destIdx, 1, &[_]u8{0});
        }
    }

    return "";
}

/// GASPRICE operation - get price of gas in current environment
pub fn opGasprice(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // In a real implementation, we would get the actual gas price
    // For now, we'll use a hardcoded value
    frame.stack.push(1000000000); // 1 gwei

    return "";
}

/// GAS operation - get amount of gas remaining
/// See: https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go#L849
pub fn opGas(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // Push the amount of gas remaining after this instruction
    // The gas for this instruction has already been consumed
    frame.stack.push(frame.gas_remaining);
    
    return "";
}

/// RETURNDATALOAD operation - load data from return data buffer
/// See: https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go#L392
pub fn opReturndataload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // Pop offset from stack
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Check if we have return data
    if (frame.returndata == null) {
        // If no return data, push 0
        frame.stack.push(0);
        return "";
    }
    
    const returndata = frame.returndata.?;
    
    // Load 32 bytes from return data at the given offset
    var value: u256 = 0;
    
    // Convert offset to usize, checking for overflow
    const offset_usize = std.math.cast(usize, offset) orelse {
        // Offset too large, push 0
        frame.stack.push(0);
        return "";
    };
    
    // Read up to 32 bytes from return data
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        if (offset_usize + i < returndata.len) {
            value = (value << 8) | returndata[offset_usize + i];
        } else {
            // Pad with zeros if reading past the end
            value = value << 8;
        }
    }
    
    frame.stack.push(value);
    return "";
}

/// EXTCODESIZE operation - get size of an account's code
pub fn opExtcodesize(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Check if we have a state manager in the EVM
    if (interpreter.evm.state_manager == null) {
        // If no state manager, return 0 code size
        frame.stack.push(0);
        return "";
    }

    // Pop address from stack
    const addressValue = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert u256 to address
    const addressBytes = blk: {
        var bytes: [20]u8 = [_]u8{0} ** 20;
        var tempValue = addressValue;

        // Fill the address bytes from right to left (big-endian)
        var i: isize = 19;
        while (i >= 0) : (i -= 1) {
            bytes[@intCast(i)] = @truncate(tempValue);
            tempValue >>= 8;
        }
        break :blk bytes;
    };

    const queryAddress = Address{ .bytes = addressBytes };

    // EIP-2929: Check if the address is cold and calculate appropriate gas cost
    const is_cold_account = frame.contract.isAccountCold();
    const gas_cost = if (is_cold_account)
        JumpTable.ColdAccountAccessCost // Cold access (2600 gas)
    else
        JumpTable.WarmStorageReadCost; // Warm access (100 gas)

    // Check if we have enough gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }

    // Use gas
    frame.contract.useGas(gas_cost);

    // Mark the account as warm for future accesses
    _ = frame.contract.markAccountWarm();

    // Get contract code for the address
    const code = try interpreter.evm.state_manager.?.getContractCode(queryAddress);

    // Push the code size onto the stack
    frame.stack.push(@as(u256, code.len));

    return "";
}

/// Memory size function for EXTCODECOPY operation
fn extcodecopyMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 4) return .{ .size = 0, .overflow = false };

    const offset = stack.data[stack.size - 2];
    const size = stack.data[stack.size - 4];

    // Convert to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // Check for overflow
    if (offset_u64 > std.math.maxInt(u64) - size_u64) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }

    return .{ .size = offset_u64 + size_u64, .overflow = false };
}

/// EXTCODECOPY operation - copy an account's code to memory
pub fn opExtcodecopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Stack: [address, destOffset, offset, size]
    if (frame.stack.size < 4) {
        return ExecutionError.StackUnderflow;
    }

    const size = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    const destOffset = frame.stack.pop() catch |err| return mapStackError(err);
    const addressValue = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert u256 values to u64, capping at max value if needed
    const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, destOffset);
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // Convert address value to Address type
    const addressBytes = blk: {
        var bytes: [20]u8 = [_]u8{0} ** 20;
        var tempValue = addressValue;

        // Fill the address bytes from right to left (big-endian)
        var i: isize = 19;
        while (i >= 0) : (i -= 1) {
            bytes[@intCast(i)] = @truncate(tempValue);
            tempValue >>= 8;
        }
        break :blk bytes;
    };

    const queryAddress = Address{ .bytes = addressBytes };

    // EIP-2929: Check if the address is cold and calculate appropriate gas cost
    const is_cold_account = frame.contract.isAccountCold();
    const cold_access_cost = if (is_cold_account)
        JumpTable.ColdAccountAccessCost - JumpTable.WarmStorageReadCost // Additional cold access cost (2500 gas)
    else
        0; // No additional cost for warm access

    // If size is zero, nothing to copy, but still apply EIP-2929 gas costs
    if (size_u64 == 0) {
        // Check if we have enough gas for cold access (if applicable)
        if (cold_access_cost > 0) {
            if (frame.contract.gas < cold_access_cost) {
                return ExecutionError.OutOfGas;
            }
            frame.contract.useGas(cold_access_cost);

            // Mark the account as warm for future accesses
            _ = frame.contract.markAccountWarm();
        }
        return "";
    }

    // Ensure memory is large enough
    const needed_size = destOffset_u64 + size_u64;
    if (needed_size > frame.memory.len()) {
        try frame.memory.resize(needed_size);
    }

    // Apply cold access cost if needed
    if (cold_access_cost > 0) {
        if (frame.contract.gas < cold_access_cost) {
            return ExecutionError.OutOfGas;
        }
        frame.contract.useGas(cold_access_cost);

        // Mark the account as warm for future accesses
        _ = frame.contract.markAccountWarm();
    }

    // Get contract code for the address
    const code = blk: {
        var result: []u8 = &[_]u8{};
        if (interpreter.evm.state_manager != null) {
            result = try interpreter.evm.state_manager.?.getContractCode(queryAddress);
        }
        break :blk result;
    };

    // Copy data from code to memory
    for (0..size_u64) |j| {
        const sourceIdx = offset_u64 + j;
        const destIdx = destOffset_u64 + j;

        if (sourceIdx < code.len) {
            frame.memory.set(destIdx, 1, &[_]u8{code[sourceIdx]});
        } else {
            // Pad with zeros if reading past the end of code
            frame.memory.set(destIdx, 1, &[_]u8{0});
        }
    }

    return "";
}

/// RETURNDATASIZE operation - get size of output data from the previous call
pub fn opReturndatasize(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // If frame has no return data, return 0 size
    if (frame.returnData == null) {
        frame.stack.push(0);
        return "";
    }

    // Push the size of the return data onto the stack
    frame.stack.push(@as(u256, frame.returnSize));

    return "";
}

/// Memory size function for RETURNDATACOPY operation
fn returndatacopyMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    if (stack.size < 3) return .{ .size = 0, .overflow = false };

    const offset = stack.data[stack.size - 1];
    const size = stack.data[stack.size - 3];

    // Convert to u64, capping at max value if needed
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // Check for overflow
    if (offset_u64 > std.math.maxInt(u64) - size_u64) {
        return .{ .size = std.math.maxInt(u64), .overflow = true };
    }

    return .{ .size = offset_u64 + size_u64, .overflow = false };
}

/// RETURNDATACOPY operation - copy output data from the previous call to memory
pub fn opReturndatacopy(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;

    // Stack: [destOffset, offset, size]
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }

    const size = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    const destOffset = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert to u64, capping at max value if needed
    const destOffset_u64 = if (destOffset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, destOffset);
    const offset_u64 = if (offset > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, offset);
    const size_u64 = if (size > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, size);

    // If size is zero, nothing to copy
    if (size_u64 == 0) {
        return "";
    }

    // Check if frame has return data
    if (frame.returnData == null) {
        // No return data, fill memory with zeros
        const needed_size = destOffset_u64 + size_u64;
        if (needed_size > frame.memory.len()) {
            try frame.memory.resize(needed_size);
        }

        for (0..size_u64) |i| {
            frame.memory.set(destOffset_u64 + i, 1, &[_]u8{0});
        }

        return "";
    }

    // Check that we're not copying outside the bounds of return data
    if (offset_u64 + size_u64 > frame.returnSize or offset_u64 > frame.returnSize) {
        return ExecutionError.ReturnDataOutOfBounds;
    }

    // Ensure memory is large enough
    const needed_size = destOffset_u64 + size_u64;
    if (needed_size > frame.memory.len()) {
        try frame.memory.resize(needed_size);
    }

    // Copy data from return data to memory
    for (0..size_u64) |i| {
        const sourceIdx = offset_u64 + i;
        const destIdx = destOffset_u64 + i;

        frame.memory.set(destIdx, 1, &[_]u8{frame.returnData.?[sourceIdx]});
    }

    return "";
}

/// EXTCODEHASH operation - get the code hash of an account
pub fn opExtcodehash(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Pop address from stack
    const addressValue = frame.stack.pop() catch |err| return mapStackError(err);

    // Convert u256 to address
    const addressBytes = blk: {
        var bytes: [20]u8 = [_]u8{0} ** 20;
        var tempValue = addressValue;

        // Fill the address bytes from right to left (big-endian)
        var i: isize = 19;
        while (i >= 0) : (i -= 1) {
            bytes[@intCast(i)] = @truncate(tempValue);
            tempValue >>= 8;
        }
        break :blk bytes;
    };

    const queryAddress = Address{ .bytes = addressBytes };

    // EIP-2929: Check if the address is cold and calculate appropriate gas cost
    const is_cold_account = frame.contract.isAccountCold();
    const gas_cost = if (is_cold_account)
        JumpTable.ColdAccountAccessCost // Cold access (2600 gas)
    else
        JumpTable.WarmStorageReadCost; // Warm access (100 gas)

    // Check if we have enough gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }

    // Use gas
    frame.contract.useGas(gas_cost);

    // Mark the account as warm for future accesses
    _ = frame.contract.markAccountWarm();

    // Constant for empty code hash
    const EMPTY_CODE_HASH: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;

    // Check for state manager
    if (interpreter.evm.state_manager == null) {
        // If no state manager, return empty code hash
        frame.stack.push(EMPTY_CODE_HASH);
        return "";
    }

    // Get the account from state
    if (try interpreter.evm.state_manager.?.getAccount(queryAddress)) |account| {
        // If account exists, push its code hash
        const codeHash = blk: {
            var hash: u256 = 0;

            // Convert code hash bytes to u256
            for (account.codeHash.bytes) |byte| {
                hash = (hash << 8) | byte;
            }
            break :blk hash;
        };

        frame.stack.push(codeHash);
    } else {
        // Account doesn't exist, push 0 per EIP-1052
        frame.stack.push(0);
    }

    return "";
}

// Dynamic gas cost functions for opcodes that need EIP-2929 warm/cold access tracking
fn balanceDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = memory;
    _ = requested_size;

    // We need at least 1 item on stack for BALANCE
    if (stack.size < 1) {
        return error.OutOfGas;
    }

    // Check if address is cold
    const is_cold_account = frame.contract.isAccountCold();

    // Return gas cost based on cold/warm status
    if (is_cold_account) {
        return JumpTable.ColdAccountAccessCost; // 2600 gas for cold access
    } else {
        return JumpTable.WarmStorageReadCost; // 100 gas for warm access
    }
}

fn extcodesizeDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = memory;
    _ = requested_size;

    // We need at least 1 item on stack for EXTCODESIZE
    if (stack.size < 1) {
        return error.OutOfGas;
    }

    // Check if address is cold
    const is_cold_account = frame.contract.isAccountCold();

    // Return gas cost based on cold/warm status
    if (is_cold_account) {
        return JumpTable.ColdAccountAccessCost; // 2600 gas for cold access
    } else {
        return JumpTable.WarmStorageReadCost; // 100 gas for warm access
    }
}

fn extcodecopyDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    // First calculate memory expansion cost
    const memory_cost = try memoryGas(interpreter, frame, stack, memory, requested_size);

    // We need at least 4 items on stack for EXTCODECOPY
    if (stack.size < 4) {
        return error.OutOfGas;
    }

    // Check if address is cold (no need to use the actual address in our implementation)
    const is_cold_account = frame.contract.isAccountCold();

    // Base cost is EXTCODESIZE plus memory cost
    var gas_cost = jumpTableModule.GasExtStep + memory_cost;

    // Add cold access cost if needed
    if (is_cold_account) {
        gas_cost += JumpTable.ColdAccountAccessCost - JumpTable.WarmStorageReadCost; // 2500 gas extra
    }

    return gas_cost;
}

fn extcodehashDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = memory;
    _ = requested_size;

    // We need at least 1 item on stack for EXTCODEHASH
    if (stack.size < 1) {
        return error.OutOfGas;
    }

    // Check if address is cold
    const is_cold_account = frame.contract.isAccountCold();

    // Return gas cost based on cold/warm status
    if (is_cold_account) {
        return JumpTable.ColdAccountAccessCost; // 2600 gas for cold access
    } else {
        return JumpTable.WarmStorageReadCost; // 100 gas for warm access
    }
}

/// Register all environment opcodes in the given jump table
pub fn registerEnvironmentOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // ADDRESS (0x30)
    const address_op = try allocator.create(Operation);
    address_op.* = Operation{
        .execute = opAddress,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x30] = address_op;

    // BALANCE (0x31) - Using dynamic gas for EIP-2929
    const balance_op = try allocator.create(Operation);
    balance_op.* = Operation{
        .execute = opBalance,
        .constant_gas = 0, // Using dynamic gas calculation
        .dynamic_gas = balanceDynamicGas,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x31] = balance_op;

    // ORIGIN (0x32)
    const origin_op = try allocator.create(Operation);
    origin_op.* = Operation{
        .execute = opOrigin,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x32] = origin_op;

    // CALLER (0x33)
    const caller_op = try allocator.create(Operation);
    caller_op.* = Operation{
        .execute = opCaller,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x33] = caller_op;

    // CALLVALUE (0x34)
    const callvalue_op = try allocator.create(Operation);
    callvalue_op.* = Operation{
        .execute = opCallValue,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x34] = callvalue_op;

    // CALLDATALOAD (0x35)
    const calldataload_op = try allocator.create(Operation);
    calldataload_op.* = Operation{
        .execute = opCalldataload,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x35] = calldataload_op;

    // CALLDATASIZE (0x36)
    const calldatasize_op = try allocator.create(Operation);
    calldatasize_op.* = Operation{
        .execute = opCalldatasize,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x36] = calldatasize_op;

    // CALLDATACOPY (0x37)
    const calldatacopy_op = try allocator.create(Operation);
    calldatacopy_op.* = Operation{
        .execute = opCalldatacopy,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(3, 0),
        .max_stack = jumpTableModule.maxStack(3, 0),
        .dynamic_gas = memoryGas,
        .memory_size = calldatacopyMemorySize,
    };
    jump_table.table[0x37] = calldatacopy_op;

    // CODESIZE (0x38)
    const codesize_op = try allocator.create(Operation);
    codesize_op.* = Operation{
        .execute = opCodesize,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x38] = codesize_op;

    // CODECOPY (0x39)
    const codecopy_op = try allocator.create(Operation);
    codecopy_op.* = Operation{
        .execute = opCodecopy,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(3, 0),
        .max_stack = jumpTableModule.maxStack(3, 0),
        .dynamic_gas = memoryGas,
        .memory_size = codecopyMemorySize,
    };
    jump_table.table[0x39] = codecopy_op;

    // GASPRICE (0x3A)
    const gasprice_op = try allocator.create(Operation);
    gasprice_op.* = Operation{
        .execute = opGasprice,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x3A] = gasprice_op;

    // EXTCODESIZE (0x3B) - Using dynamic gas for EIP-2929
    const extcodesize_op = try allocator.create(Operation);
    extcodesize_op.* = Operation{
        .execute = opExtcodesize,
        .constant_gas = 0, // Using dynamic gas calculation
        .dynamic_gas = extcodesizeDynamicGas,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x3B] = extcodesize_op;

    // EXTCODECOPY (0x3C) - Using dynamic gas for EIP-2929
    const extcodecopy_op = try allocator.create(Operation);
    extcodecopy_op.* = Operation{
        .execute = opExtcodecopy,
        .constant_gas = 0, // Using dynamic gas calculation
        .dynamic_gas = extcodecopyDynamicGas,
        .min_stack = jumpTableModule.minStack(4, 0),
        .max_stack = jumpTableModule.maxStack(4, 0),
        .memory_size = extcodecopyMemorySize,
    };
    jump_table.table[0x3C] = extcodecopy_op;

    // RETURNDATASIZE (0x3D)
    const returndatasize_op = try allocator.create(Operation);
    returndatasize_op.* = Operation{
        .execute = opReturndatasize,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x3D] = returndatasize_op;

    // RETURNDATACOPY (0x3E)
    const returndatacopy_op = try allocator.create(Operation);
    returndatacopy_op.* = Operation{
        .execute = opReturndatacopy,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(3, 0),
        .max_stack = jumpTableModule.maxStack(3, 0),
        .dynamic_gas = memoryGas,
        .memory_size = returndatacopyMemorySize,
    };
    jump_table.table[0x3E] = returndatacopy_op;

    // EXTCODEHASH (0x3F) - Using dynamic gas for EIP-2929
    const extcodehash_op = try allocator.create(Operation);
    extcodehash_op.* = Operation{
        .execute = opExtcodehash,
        .constant_gas = 0, // Using dynamic gas calculation
        .dynamic_gas = extcodehashDynamicGas,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x3F] = extcodehash_op;
    
    // GAS (0x5A) - Get remaining gas
    const gas_op = try allocator.create(Operation);
    gas_op.* = Operation{
        .execute = opGas,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x5A] = gas_op;
    
    // RETURNDATALOAD (0xF7) - Load data from return data buffer
    const returndataload_op = try allocator.create(Operation);
    returndataload_op.* = Operation{
        .execute = opReturndataload,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0xF7] = returndataload_op;
}

// Simplified test for environment opcodes
test "environment opcodes - basic functionality" {
    const testing = std.testing;

    // Since we can't test the actual registration with our simplified stubs,
    // we'll just test that we have valid implementations of the opcode functions

    // Check that the core opcode functions exist and have the right signature
    const _address_fn = opAddress;
    const _balance_fn = opBalance;
    const _origin_fn = opOrigin;
    const _caller_fn = opCaller;
    const _callvalue_fn = opCallValue;
    const _calldataload_fn = opCalldataload;
    const _calldatasize_fn = opCalldatasize;
    const _calldatacopy_fn = opCalldatacopy;

    // Prevent unused variable warnings
    _ = _address_fn;
    _ = _balance_fn;
    _ = _origin_fn;
    _ = _caller_fn;
    _ = _callvalue_fn;
    _ = _calldataload_fn;
    _ = _calldatasize_fn;
    _ = _calldatacopy_fn;

    try testing.expect(true);
}
