/// Implementation of the RETURNDATASIZE opcode
fn returndatasizeInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Placeholder - in a real implementation, this would access the actual return data buffer
    // Since we don't have access to the return data buffer here, we'll just
    // throw an error for now. The actual implementation would need the interpreter
    // to provide access to the return data buffer.
    
    // Consume gas (same as most simple opcodes)
    if (gas_left.* < 2) {
        return Error.OutOfGas;
    }
    gas_left.* -= 2;
    
    // For now, just push a zero size
    try stack.push(U256.zero());
    
    // Advance PC
    pc.* += 1;
}

/// Implementation of the RETURNDATACOPY opcode
fn returndatacopyInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    _ = code;
    _ = gas_refund;
    
    // Placeholder - in a real implementation, this would access the actual return data buffer
    // Since we don't have access to the return data buffer here, we'll just
    // throw an error for now. The actual implementation would need the interpreter
    // to provide access to the return data buffer.
    
    // Pop values from stack (even though we're not using them yet)
    const size = try stack.pop();
    const offset = try stack.pop();
    const dest_offset = try stack.pop();
    
    // Basic gas cost (3 gas) plus memory expansion cost
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Ensure the parameters fit in usize
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_size = @intCast(size.words[0]);
    const mem_offset = @intCast(offset.words[0]);
    const mem_dest = @intCast(dest_offset.words[0]);
    
    // Skip operation for zero size
    if (mem_size == 0) {
        pc.* += 1;
        return;
    }
    
    // This is just a placeholder that doesn't actually copy any data
    // In a full implementation, it would copy from the return data buffer to memory
    
    // Calculate memory expansion gas cost
    const mem_gas = memory.expand(mem_dest + mem_size);
    if (gas_left.* < mem_gas) {
        return Error.OutOfGas;
    }
    gas_left.* -= mem_gas;
    
    // For now, just write zeros to the destination
    const zeros = [_]u8{0} ** 32;
    const write_size = std.math.min(mem_size, 32);
    memory.store(mem_dest, zeros[0..write_size]);
    
    // Advance PC
    pc.* += 1;
}