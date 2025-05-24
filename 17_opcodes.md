# Opcode Implementations Issue

## Overview

The opcodes package implements all EVM operations organized by category (arithmetic, bitwise, memory, storage, calls, etc.) with proper gas accounting, stack validation, and error handling following the Ethereum Yellow Paper specifications.

## Requirements

- Implement all 256 possible EVM opcodes
- Organize by logical categories (math, bitwise, memory, etc.)
- Handle stack requirements and validation
- Calculate dynamic gas costs correctly
- Support all hardfork changes
- Handle edge cases per Yellow Paper
- Optimize hot-path operations
- Support EOF opcodes
- Provide consistent error handling
- Enable efficient testing

## Interface

```zig
const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const B256 = @import("utils").B256;
const Address = @import("address").Address;

/// Common opcode errors
pub const OpcodeError = error{
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    OutOfGas,
    OutOfBounds,
    WriteProtection,
    InvalidEOFCode,
    ReturnDataOutOfBounds,
    CallDepthExceeded,
    InsufficientBalance,
    ContractAddressCollision,
    InvalidCreation,
};

/// Opcode categories for organization
pub const OpcodeCategoryType = enum {
    Arithmetic,
    Bitwise,
    Comparison,
    Memory,
    Storage,
    Control,
    Stack,
    Push,
    Dup,
    Swap,
    Log,
    Call,
    Create,
    System,
    Block,
    Env,
};

// Math operations (math.zig)
pub const math = struct {
    /// 0x01: ADD - Addition
    pub fn add(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        try frame.push(a +% b); // Wrapping addition
    }

    /// 0x02: MUL - Multiplication
    pub fn mul(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        try frame.push(a *% b); // Wrapping multiplication
    }

    /// 0x03: SUB - Subtraction
    pub fn sub(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        try frame.push(a -% b); // Wrapping subtraction
    }

    /// 0x04: DIV - Integer division
    pub fn div(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        if (b == 0) {
            try frame.push(0);
        } else {
            try frame.push(a / b);
        }
    }

    /// 0x05: SDIV - Signed integer division
    pub fn sdiv(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        
        if (b == 0) {
            try frame.push(0);
            return;
        }
        
        // Handle two's complement signed division
        const a_sign = a >> 255;
        const b_sign = b >> 255;
        
        var abs_a = if (a_sign == 1) (~a +% 1) else a;
        var abs_b = if (b_sign == 1) (~b +% 1) else b;
        
        const result = abs_a / abs_b;
        const signed_result = if (a_sign != b_sign) (~result +% 1) else result;
        
        try frame.push(signed_result);
    }

    /// 0x06: MOD - Modulo
    pub fn mod(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        if (b == 0) {
            try frame.push(0);
        } else {
            try frame.push(a % b);
        }
    }

    /// 0x08: ADDMOD - Addition modulo
    pub fn addmod(interpreter: *Interpreter, frame: *Frame) !void {
        const n = try frame.pop();
        const b = try frame.pop();
        const a = try frame.pop();
        
        if (n == 0) {
            try frame.push(0);
        } else {
            // Use wider type to prevent overflow
            const result = (@as(u512, a) + @as(u512, b)) % @as(u512, n);
            try frame.push(@intCast(u256, result));
        }
    }

    /// 0x0a: EXP - Exponentiation
    pub fn exp(interpreter: *Interpreter, frame: *Frame) !void {
        const exp = try frame.pop();
        const base = try frame.pop();
        
        // Dynamic gas calculation
        const exp_bytes = (256 - @clz(exp) + 7) / 8;
        const gas_cost = 10 + 50 * exp_bytes;
        try frame.gas.consume(gas_cost);
        
        // Compute base^exp
        var result: u256 = 1;
        var b = base;
        var e = exp;
        
        while (e > 0) {
            if (e & 1 == 1) {
                result *%= b;
            }
            b *%= b;
            e >>= 1;
        }
        
        try frame.push(result);
    }
};

// Bitwise operations (bitwise.zig)
pub const bitwise = struct {
    /// 0x16: AND - Bitwise AND
    pub fn bitAnd(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        try frame.push(a & b);
    }

    /// 0x17: OR - Bitwise OR
    pub fn bitOr(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        try frame.push(a | b);
    }

    /// 0x18: XOR - Bitwise XOR
    pub fn bitXor(interpreter: *Interpreter, frame: *Frame) !void {
        const b = try frame.pop();
        const a = try frame.pop();
        try frame.push(a ^ b);
    }

    /// 0x19: NOT - Bitwise NOT
    pub fn bitNot(interpreter: *Interpreter, frame: *Frame) !void {
        const a = try frame.pop();
        try frame.push(~a);
    }

    /// 0x1a: BYTE - Get byte from word
    pub fn byte(interpreter: *Interpreter, frame: *Frame) !void {
        const index = try frame.pop();
        const value = try frame.pop();
        
        if (index >= 32) {
            try frame.push(0);
        } else {
            const byte_index = 31 - @intCast(u8, index);
            const byte_value = (value >> (@intCast(u8, byte_index) * 8)) & 0xFF;
            try frame.push(byte_value);
        }
    }

    /// 0x1b: SHL - Shift left
    pub fn shl(interpreter: *Interpreter, frame: *Frame) !void {
        const shift = try frame.pop();
        const value = try frame.pop();
        
        if (shift >= 256) {
            try frame.push(0);
        } else {
            try frame.push(value << @intCast(u8, shift));
        }
    }

    /// 0x1c: SHR - Logical shift right
    pub fn shr(interpreter: *Interpreter, frame: *Frame) !void {
        const shift = try frame.pop();
        const value = try frame.pop();
        
        if (shift >= 256) {
            try frame.push(0);
        } else {
            try frame.push(value >> @intCast(u8, shift));
        }
    }

    /// 0x1d: SAR - Arithmetic shift right
    pub fn sar(interpreter: *Interpreter, frame: *Frame) !void {
        const shift = try frame.pop();
        const value = try frame.pop();
        
        if (shift >= 256) {
            // Check sign bit
            if (value >> 255 == 1) {
                try frame.push(std.math.maxInt(u256)); // All 1s
            } else {
                try frame.push(0);
            }
        } else {
            // Arithmetic shift preserving sign
            const shift_amount = @intCast(u8, shift);
            const shifted = value >> shift_amount;
            
            if (value >> 255 == 1) {
                // Fill with 1s from the left
                const mask = ((@as(u256, 1) << shift_amount) - 1) << @intCast(u8, 256 - shift);
                try frame.push(shifted | mask);
            } else {
                try frame.push(shifted);
            }
        }
    }
};

// Memory operations (memory.zig)
pub const memory = struct {
    /// 0x51: MLOAD - Load word from memory
    pub fn mload(interpreter: *Interpreter, frame: *Frame) !void {
        const offset = try frame.pop();
        
        // Ensure memory is available
        try frame.ensureMemory(@intCast(usize, offset), 32);
        
        const value = try frame.readMemoryWord(@intCast(usize, offset));
        try frame.push(value);
    }

    /// 0x52: MSTORE - Store word to memory
    pub fn mstore(interpreter: *Interpreter, frame: *Frame) !void {
        const offset = try frame.pop();
        const value = try frame.pop();
        
        try frame.writeMemoryWord(@intCast(usize, offset), value);
    }

    /// 0x53: MSTORE8 - Store byte to memory
    pub fn mstore8(interpreter: *Interpreter, frame: *Frame) !void {
        const offset = try frame.pop();
        const value = try frame.pop();
        
        try frame.ensureMemory(@intCast(usize, offset), 1);
        
        const byte_value = @intCast(u8, value & 0xFF);
        try frame.memory.setByte(@intCast(usize, offset), byte_value);
    }

    /// 0x59: MSIZE - Get memory size
    pub fn msize(interpreter: *Interpreter, frame: *Frame) !void {
        const size = frame.memory.size();
        try frame.push(@intCast(u256, size));
    }

    /// 0x5e: MCOPY - Copy memory (EIP-5656)
    pub fn mcopy(interpreter: *Interpreter, frame: *Frame) !void {
        const size = try frame.pop();
        const src = try frame.pop();
        const dst = try frame.pop();
        
        if (size == 0) return;
        
        const src_offset = @intCast(usize, src);
        const dst_offset = @intCast(usize, dst);
        const copy_size = @intCast(usize, size);
        
        // Ensure memory for both source and destination
        try frame.ensureMemory(src_offset, copy_size);
        try frame.ensureMemory(dst_offset, copy_size);
        
        // Dynamic gas cost
        const word_size = (copy_size + 31) / 32;
        try frame.gas.consume(3 * word_size);
        
        // Copy with overlap handling
        if (src_offset != dst_offset) {
            const src_data = try frame.memory.getSlice(src_offset, copy_size);
            var temp = try frame.allocator.alloc(u8, copy_size);
            defer frame.allocator.free(temp);
            @memcpy(temp, src_data);
            try frame.memory.setData(dst_offset, temp);
        }
    }
};

// Storage operations (storage.zig)
pub const storage = struct {
    /// 0x54: SLOAD - Load from storage
    pub fn sload(interpreter: *Interpreter, frame: *Frame) !void {
        const slot = B256.fromU256(try frame.pop());
        
        // Access list tracking (Berlin)
        const address = frame.getAddress();
        const is_cold = try interpreter.state_manager.access_list.addSlot(address, slot);
        
        // Dynamic gas based on warm/cold
        const gas_cost: u64 = if (is_cold) 2100 else 100;
        try frame.gas.consume(gas_cost);
        
        const value = try interpreter.state_manager.getStorage(address, slot);
        try frame.push(value.toU256());
    }

    /// 0x55: SSTORE - Store to storage
    pub fn sstore(interpreter: *Interpreter, frame: *Frame) !void {
        if (frame.is_static) {
            return error.WriteProtection;
        }
        
        const value = B256.fromU256(try frame.pop());
        const slot = B256.fromU256(try frame.pop());
        const address = frame.getAddress();
        
        // Get current and original values for gas calculation
        const current = try interpreter.state_manager.getStorage(address, slot);
        const original = try interpreter.state_manager.getOriginalStorage(address, slot);
        
        // Access list tracking
        const is_cold = try interpreter.state_manager.access_list.addSlot(address, slot);
        
        // Calculate gas cost (EIP-2200 with EIP-2929)
        const gas_result = frame.gas.sstoreGasCost(original, current, value, is_cold);
        try frame.gas.consume(gas_result.cost);
        
        // Set new value
        try interpreter.state_manager.setStorage(address, slot, value);
    }

    /// 0x5c: TLOAD - Load from transient storage (EIP-1153)
    pub fn tload(interpreter: *Interpreter, frame: *Frame) !void {
        const slot = B256.fromU256(try frame.pop());
        const address = frame.getAddress();
        
        const value = interpreter.transient_storage.get(address, slot) orelse B256.zero();
        try frame.push(value.toU256());
    }

    /// 0x5d: TSTORE - Store to transient storage (EIP-1153)
    pub fn tstore(interpreter: *Interpreter, frame: *Frame) !void {
        if (frame.is_static) {
            return error.WriteProtection;
        }
        
        const value = B256.fromU256(try frame.pop());
        const slot = B256.fromU256(try frame.pop());
        const address = frame.getAddress();
        
        try interpreter.transient_storage.set(address, slot, value);
    }
};

// Control flow operations (controlflow.zig)
pub const control = struct {
    /// 0x00: STOP - Halt execution
    pub fn stop(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        frame.halt(.Stop);
    }

    /// 0x56: JUMP - Unconditional jump
    pub fn jump(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const dest = try frame.pop();
        
        if (dest > std.math.maxInt(usize)) {
            return error.InvalidJump;
        }
        
        const dest_usize = @intCast(usize, dest);
        if (!frame.isValidJump(dest_usize)) {
            return error.InvalidJump;
        }
        
        try frame.jump(dest_usize);
    }

    /// 0x57: JUMPI - Conditional jump
    pub fn jumpi(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const condition = try frame.pop();
        const dest = try frame.pop();
        
        if (condition != 0) {
            if (dest > std.math.maxInt(usize)) {
                return error.InvalidJump;
            }
            
            const dest_usize = @intCast(usize, dest);
            if (!frame.isValidJump(dest_usize)) {
                return error.InvalidJump;
            }
            
            try frame.jump(dest_usize);
        }
    }

    /// 0x58: PC - Get program counter
    pub fn pc(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        try frame.push(@intCast(u256, frame.pc));
    }

    /// 0x5b: JUMPDEST - Jump destination marker
    pub fn jumpdest(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        _ = frame;
        // No-op, just marks valid jump destination
    }

    /// 0xf3: RETURN - Return from execution
    pub fn return_(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = try frame.pop();
        const offset = try frame.pop();
        
        if (size > 0) {
            const offset_usize = @intCast(usize, offset);
            const size_usize = @intCast(usize, size);
            
            const data = try frame.readMemory(offset_usize, size_usize);
            const return_data = try frame.allocator.dupe(u8, data);
            try frame.setReturnData(return_data);
        }
        
        frame.halt(.Return);
    }

    /// 0xfd: REVERT - Revert execution
    pub fn revert(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = try frame.pop();
        const offset = try frame.pop();
        
        if (size > 0) {
            const offset_usize = @intCast(usize, offset);
            const size_usize = @intCast(usize, size);
            
            const data = try frame.readMemory(offset_usize, size_usize);
            const return_data = try frame.allocator.dupe(u8, data);
            try frame.setReturnData(return_data);
        }
        
        frame.halt(.Revert);
    }

    /// 0xfe: INVALID - Invalid operation
    pub fn invalid(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        _ = frame;
        return error.InvalidOpcode;
    }
};

// Stack operations (push.zig, stack.zig)
pub const stack = struct {
    /// 0x50: POP - Remove item from stack
    pub fn pop(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        _ = try frame.pop();
    }

    /// 0x5f: PUSH0 - Push 0 onto stack (EIP-3855)
    pub fn push0(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        try frame.push(0);
    }

    /// Push operations generator
    pub fn makePush(comptime n: u8) fn (*Interpreter, *Frame) anyerror!void {
        return struct {
            pub fn push(interpreter: *Interpreter, frame: *Frame) !void {
                _ = interpreter;
                
                // Ensure we have enough bytes
                if (frame.pc + n >= frame.contract.code.len) {
                    // Push zero-padded value
                    var value: u256 = 0;
                    const available = frame.contract.code.len - frame.pc - 1;
                    
                    for (0..available) |i| {
                        value = (value << 8) | frame.contract.code[frame.pc + 1 + i];
                    }
                    
                    try frame.push(value << @intCast(u8, (n - available) * 8));
                } else {
                    // Read n bytes from code
                    var value: u256 = 0;
                    for (0..n) |i| {
                        value = (value << 8) | frame.contract.code[frame.pc + 1 + i];
                    }
                    try frame.push(value);
                }
                
                // Advance PC past the push data
                frame.advance(n);
            }
        }.push;
    }

    // Generate PUSH1-PUSH32
    pub const push1 = makePush(1);
    pub const push2 = makePush(2);
    pub const push3 = makePush(3);
    pub const push4 = makePush(4);
    pub const push5 = makePush(5);
    pub const push6 = makePush(6);
    pub const push7 = makePush(7);
    pub const push8 = makePush(8);
    pub const push9 = makePush(9);
    pub const push10 = makePush(10);
    pub const push11 = makePush(11);
    pub const push12 = makePush(12);
    pub const push13 = makePush(13);
    pub const push14 = makePush(14);
    pub const push15 = makePush(15);
    pub const push16 = makePush(16);
    pub const push17 = makePush(17);
    pub const push18 = makePush(18);
    pub const push19 = makePush(19);
    pub const push20 = makePush(20);
    pub const push21 = makePush(21);
    pub const push22 = makePush(22);
    pub const push23 = makePush(23);
    pub const push24 = makePush(24);
    pub const push25 = makePush(25);
    pub const push26 = makePush(26);
    pub const push27 = makePush(27);
    pub const push28 = makePush(28);
    pub const push29 = makePush(29);
    pub const push30 = makePush(30);
    pub const push31 = makePush(31);
    pub const push32 = makePush(32);

    /// DUP operation generator
    pub fn makeDup(comptime n: u8) fn (*Interpreter, *Frame) anyerror!void {
        return struct {
            pub fn dup(interpreter: *Interpreter, frame: *Frame) !void {
                _ = interpreter;
                try frame.dup(n);
            }
        }.dup;
    }

    /// SWAP operation generator
    pub fn makeSwap(comptime n: u8) fn (*Interpreter, *Frame) anyerror!void {
        return struct {
            pub fn swap(interpreter: *Interpreter, frame: *Frame) !void {
                _ = interpreter;
                try frame.swap(n);
            }
        }.swap;
    }

    // Generate DUP1-DUP16
    pub const dup1 = makeDup(1);
    pub const dup2 = makeDup(2);
    pub const dup3 = makeDup(3);
    pub const dup4 = makeDup(4);
    pub const dup5 = makeDup(5);
    pub const dup6 = makeDup(6);
    pub const dup7 = makeDup(7);
    pub const dup8 = makeDup(8);
    pub const dup9 = makeDup(9);
    pub const dup10 = makeDup(10);
    pub const dup11 = makeDup(11);
    pub const dup12 = makeDup(12);
    pub const dup13 = makeDup(13);
    pub const dup14 = makeDup(14);
    pub const dup15 = makeDup(15);
    pub const dup16 = makeDup(16);

    // Generate SWAP1-SWAP16
    pub const swap1 = makeSwap(1);
    pub const swap2 = makeSwap(2);
    pub const swap3 = makeSwap(3);
    pub const swap4 = makeSwap(4);
    pub const swap5 = makeSwap(5);
    pub const swap6 = makeSwap(6);
    pub const swap7 = makeSwap(7);
    pub const swap8 = makeSwap(8);
    pub const swap9 = makeSwap(9);
    pub const swap10 = makeSwap(10);
    pub const swap11 = makeSwap(11);
    pub const swap12 = makeSwap(12);
    pub const swap13 = makeSwap(13);
    pub const swap14 = makeSwap(14);
    pub const swap15 = makeSwap(15);
    pub const swap16 = makeSwap(16);
};

// Environmental operations (environment.zig)
pub const env = struct {
    /// 0x30: ADDRESS - Get address of current contract
    pub fn address(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const addr = frame.getAddress();
        try frame.push(addr.toU256());
    }

    /// 0x31: BALANCE - Get balance of address
    pub fn balance(interpreter: *Interpreter, frame: *Frame) !void {
        const addr = Address.fromU256(try frame.pop());
        
        // Access list tracking
        const is_cold = try interpreter.state_manager.access_list.addAddress(addr);
        const gas_cost: u64 = if (is_cold) 2600 else 100;
        try frame.gas.consume(gas_cost);
        
        const balance = try interpreter.state_manager.getBalance(addr);
        try frame.push(balance);
    }

    /// 0x32: ORIGIN - Get origin address
    pub fn origin(interpreter: *Interpreter, frame: *Frame) !void {
        _ = frame;
        try frame.push(interpreter.tx_context.origin.toU256());
    }

    /// 0x33: CALLER - Get caller address
    pub fn caller(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const caller = frame.getCaller();
        try frame.push(caller.toU256());
    }

    /// 0x34: CALLVALUE - Get value sent
    pub fn callvalue(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const value = frame.getValue();
        try frame.push(value);
    }

    /// 0x35: CALLDATALOAD - Load from call data
    pub fn calldataload(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const offset = try frame.pop();
        const offset_usize = @intCast(usize, offset);
        
        const input = frame.getInput();
        var result: u256 = 0;
        
        // Read 32 bytes from calldata (pad with zeros)
        for (0..32) |i| {
            if (offset_usize + i < input.len) {
                result = (result << 8) | input[offset_usize + i];
            } else {
                result = result << 8;
            }
        }
        
        try frame.push(result);
    }

    /// 0x36: CALLDATASIZE - Get call data size
    pub fn calldatasize(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = frame.getInput().len;
        try frame.push(@intCast(u256, size));
    }

    /// 0x37: CALLDATACOPY - Copy call data to memory
    pub fn calldatacopy(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = try frame.pop();
        const data_offset = try frame.pop();
        const mem_offset = try frame.pop();
        
        if (size == 0) return;
        
        const mem_offset_usize = @intCast(usize, mem_offset);
        const data_offset_usize = @intCast(usize, data_offset);
        const size_usize = @intCast(usize, size);
        
        // Ensure memory
        try frame.ensureMemory(mem_offset_usize, size_usize);
        
        // Dynamic gas
        const word_size = (size_usize + 31) / 32;
        try frame.gas.consume(3 * word_size);
        
        // Copy with bounds checking
        const input = frame.getInput();
        try frame.memory.setDataBounded(
            mem_offset_usize,
            input,
            data_offset_usize,
            size_usize,
        );
    }

    /// 0x38: CODESIZE - Get code size
    pub fn codesize(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = frame.getCodeSize();
        try frame.push(@intCast(u256, size));
    }

    /// 0x39: CODECOPY - Copy code to memory
    pub fn codecopy(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = try frame.pop();
        const code_offset = try frame.pop();
        const mem_offset = try frame.pop();
        
        if (size == 0) return;
        
        const mem_offset_usize = @intCast(usize, mem_offset);
        const code_offset_usize = @intCast(usize, code_offset);
        const size_usize = @intCast(usize, size);
        
        // Ensure memory
        try frame.ensureMemory(mem_offset_usize, size_usize);
        
        // Dynamic gas
        const word_size = (size_usize + 31) / 32;
        try frame.gas.consume(3 * word_size);
        
        // Copy with bounds checking
        const code = frame.getCode();
        try frame.memory.setDataBounded(
            mem_offset_usize,
            code,
            code_offset_usize,
            size_usize,
        );
    }

    /// 0x3a: GASPRICE - Get gas price
    pub fn gasprice(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(interpreter.tx_context.gas_price);
    }

    /// 0x3b: EXTCODESIZE - Get external code size
    pub fn extcodesize(interpreter: *Interpreter, frame: *Frame) !void {
        const addr = Address.fromU256(try frame.pop());
        
        // Access list tracking
        const is_cold = try interpreter.state_manager.access_list.addAddress(addr);
        const gas_cost: u64 = if (is_cold) 2600 else 100;
        try frame.gas.consume(gas_cost);
        
        const code = try interpreter.state_manager.getCode(addr);
        try frame.push(@intCast(u256, code.len));
    }

    /// 0x3c: EXTCODECOPY - Copy external code
    pub fn extcodecopy(interpreter: *Interpreter, frame: *Frame) !void {
        const size = try frame.pop();
        const code_offset = try frame.pop();
        const mem_offset = try frame.pop();
        const addr = Address.fromU256(try frame.pop());
        
        if (size == 0) return;
        
        // Access list tracking
        const is_cold = try interpreter.state_manager.access_list.addAddress(addr);
        const gas_cost: u64 = if (is_cold) 2600 else 100;
        try frame.gas.consume(gas_cost);
        
        const mem_offset_usize = @intCast(usize, mem_offset);
        const code_offset_usize = @intCast(usize, code_offset);
        const size_usize = @intCast(usize, size);
        
        // Ensure memory
        try frame.ensureMemory(mem_offset_usize, size_usize);
        
        // Dynamic gas for copy
        const word_size = (size_usize + 31) / 32;
        try frame.gas.consume(3 * word_size);
        
        // Get external code
        const code = try interpreter.state_manager.getCode(addr);
        
        // Copy with bounds checking
        try frame.memory.setDataBounded(
            mem_offset_usize,
            code,
            code_offset_usize,
            size_usize,
        );
    }

    /// 0x3d: RETURNDATASIZE - Get return data size
    pub fn returndatasize(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = frame.getReturnDataSize();
        try frame.push(@intCast(u256, size));
    }

    /// 0x3e: RETURNDATACOPY - Copy return data
    pub fn returndatacopy(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = try frame.pop();
        const data_offset = try frame.pop();
        const mem_offset = try frame.pop();
        
        if (size == 0) return;
        
        const mem_offset_usize = @intCast(usize, mem_offset);
        const data_offset_usize = @intCast(usize, data_offset);
        const size_usize = @intCast(usize, size);
        
        // Check bounds
        const return_data = frame.getReturnData();
        if (data_offset_usize + size_usize > return_data.len) {
            return error.ReturnDataOutOfBounds;
        }
        
        // Ensure memory
        try frame.ensureMemory(mem_offset_usize, size_usize);
        
        // Dynamic gas
        const word_size = (size_usize + 31) / 32;
        try frame.gas.consume(3 * word_size);
        
        // Copy
        try frame.memory.setData(
            mem_offset_usize,
            return_data[data_offset_usize..data_offset_usize + size_usize],
        );
    }

    /// 0x3f: EXTCODEHASH - Get external code hash
    pub fn extcodehash(interpreter: *Interpreter, frame: *Frame) !void {
        const addr = Address.fromU256(try frame.pop());
        
        // Access list tracking
        const is_cold = try interpreter.state_manager.access_list.addAddress(addr);
        const gas_cost: u64 = if (is_cold) 2600 else 100;
        try frame.gas.consume(gas_cost);
        
        const account = try interpreter.state_manager.getAccount(addr);
        
        if (account == null or account.?.isEmpty()) {
            try frame.push(0);
        } else {
            try frame.push(account.?.code_hash.toU256());
        }
    }
};

// Block operations (block.zig)
pub const block = struct {
    /// 0x40: BLOCKHASH - Get block hash
    pub fn blockhash(interpreter: *Interpreter, frame: *Frame) !void {
        const block_number = try frame.pop();
        
        // Only last 256 blocks are available
        const current_block = interpreter.block_context.number;
        
        if (block_number >= current_block or 
            current_block - block_number > 256) {
            try frame.push(0);
        } else {
            const hash = try interpreter.getBlockHash(@intCast(u64, block_number));
            try frame.push(hash.toU256());
        }
    }

    /// 0x41: COINBASE - Get block coinbase
    pub fn coinbase(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(interpreter.block_context.coinbase.toU256());
    }

    /// 0x42: TIMESTAMP - Get block timestamp
    pub fn timestamp(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(@intCast(u256, interpreter.block_context.timestamp));
    }

    /// 0x43: NUMBER - Get block number
    pub fn number(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(@intCast(u256, interpreter.block_context.number));
    }

    /// 0x44: DIFFICULTY/PREVRANDAO - Get block difficulty
    pub fn difficulty(interpreter: *Interpreter, frame: *Frame) !void {
        // Post-merge this returns PREVRANDAO
        try frame.push(interpreter.block_context.difficulty);
    }

    /// 0x45: GASLIMIT - Get block gas limit
    pub fn gaslimit(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(@intCast(u256, interpreter.block_context.gas_limit));
    }

    /// 0x46: CHAINID - Get chain ID
    pub fn chainid(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(@intCast(u256, interpreter.chain_id));
    }

    /// 0x47: SELFBALANCE - Get own balance
    pub fn selfbalance(interpreter: *Interpreter, frame: *Frame) !void {
        const address = frame.getAddress();
        const balance = try interpreter.state_manager.getBalance(address);
        try frame.push(balance);
    }

    /// 0x48: BASEFEE - Get base fee
    pub fn basefee(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(@intCast(u256, interpreter.block_context.base_fee));
    }

    /// 0x49: BLOBHASH - Get blob hash (EIP-4844)
    pub fn blobhash(interpreter: *Interpreter, frame: *Frame) !void {
        const index = try frame.pop();
        
        if (index >= interpreter.tx_context.blob_hashes.len) {
            try frame.push(0);
        } else {
            const hash = interpreter.tx_context.blob_hashes[@intCast(usize, index)];
            try frame.push(hash.toU256());
        }
    }

    /// 0x4a: BLOBBASEFEE - Get blob base fee (EIP-4844)
    pub fn blobbasefee(interpreter: *Interpreter, frame: *Frame) !void {
        try frame.push(@intCast(u256, interpreter.block_context.blob_base_fee));
    }
};

// Crypto operations (crypto.zig)
pub const crypto = struct {
    /// 0x20: SHA3/KECCAK256 - Compute Keccak-256 hash
    pub fn sha3(interpreter: *Interpreter, frame: *Frame) !void {
        _ = interpreter;
        const size = try frame.pop();
        const offset = try frame.pop();
        
        if (size == 0) {
            // Hash of empty data
            const empty_hash = B256.fromHex("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
            try frame.push(empty_hash.toU256());
            return;
        }
        
        const offset_usize = @intCast(usize, offset);
        const size_usize = @intCast(usize, size);
        
        // Ensure memory
        try frame.ensureMemory(offset_usize, size_usize);
        
        // Dynamic gas
        const word_size = (size_usize + 31) / 32;
        try frame.gas.consume(6 * word_size);
        
        // Get data and hash
        const data = try frame.memory.getSlice(offset_usize, size_usize);
        const hash = B256.keccak256(data);
        
        try frame.push(hash.toU256());
    }
};

// Log operations (log.zig)
pub const log = struct {
    /// LOG operation generator
    pub fn makeLog(comptime n: u8) fn (*Interpreter, *Frame) anyerror!void {
        return struct {
            pub fn log(interpreter: *Interpreter, frame: *Frame) !void {
                if (frame.is_static) {
                    return error.WriteProtection;
                }
                
                const size = try frame.pop();
                const offset = try frame.pop();
                
                var topics: [4]B256 = undefined;
                for (0..n) |i| {
                    topics[i] = B256.fromU256(try frame.pop());
                }
                
                if (size == 0) {
                    // Empty data
                    try interpreter.addLog(frame.getAddress(), topics[0..n], &[_]u8{});
                    return;
                }
                
                const offset_usize = @intCast(usize, offset);
                const size_usize = @intCast(usize, size);
                
                // Ensure memory
                try frame.ensureMemory(offset_usize, size_usize);
                
                // Dynamic gas for data
                const byte_cost = 8 * size_usize;
                try frame.gas.consume(byte_cost);
                
                // Get log data
                const data = try frame.memory.getSlice(offset_usize, size_usize);
                const log_data = try frame.allocator.dupe(u8, data);
                
                // Add log
                try interpreter.addLog(frame.getAddress(), topics[0..n], log_data);
            }
        }.log;
    }

    pub const log0 = makeLog(0);
    pub const log1 = makeLog(1);
    pub const log2 = makeLog(2);
    pub const log3 = makeLog(3);
    pub const log4 = makeLog(4);
};

// System operations (calls.zig, system.zig)
pub const system = struct {
    /// 0xf0: CREATE - Create new contract
    pub fn create(interpreter: *Interpreter, frame: *Frame) !void {
        if (frame.is_static) {
            return error.WriteProtection;
        }
        
        const size = try frame.pop();
        const offset = try frame.pop();
        const value = try frame.pop();
        
        // Check depth
        if (frame.depth >= 1024) {
            try frame.push(0);
            return;
        }
        
        // Get init code
        const offset_usize = @intCast(usize, offset);
        const size_usize = @intCast(usize, size);
        
        if (size_usize > 0) {
            try frame.ensureMemory(offset_usize, size_usize);
        }
        
        const init_code = if (size_usize > 0) 
            try frame.memory.getSlice(offset_usize, size_usize)
        else 
            &[_]u8{};
        
        // Calculate gas for creation
        const init_code_cost = @intCast(u64, init_code.len) * 200;
        try frame.gas.consume(init_code_cost);
        
        // Calculate contract address
        const sender = frame.getAddress();
        const nonce = try interpreter.state_manager.getNonce(sender);
        const contract_address = Address.fromCreateLegacy(sender, nonce);
        
        // Check for collision
        if (try interpreter.state_manager.accountExists(contract_address)) {
            try frame.push(0);
            return;
        }
        
        // Allocate gas for sub-call
        const gas_allocation = frame.gas.callGasAllocation(frame.gas.remaining);
        
        // Create sub-context and execute
        const result = try interpreter.create(
            CreateParams{
                .caller = sender,
                .value = value,
                .init_code = init_code,
                .gas = gas_allocation,
                .salt = null,
            },
        );
        
        // Refund unused gas
        frame.gas.refundGas(result.gas_left);
        
        // Set return data
        if (result.output) |output| {
            try frame.setReturnData(output);
        }
        
        // Push result
        if (result.success) {
            try frame.push(contract_address.toU256());
        } else {
            try frame.push(0);
        }
    }

    /// 0xf1: CALL - Message call
    pub fn call(interpreter: *Interpreter, frame: *Frame) !void {
        const ret_size = try frame.pop();
        const ret_offset = try frame.pop();
        const arg_size = try frame.pop();
        const arg_offset = try frame.pop();
        const value = try frame.pop();
        const to = Address.fromU256(try frame.pop());
        const gas_param = try frame.pop();
        
        // Check depth
        if (frame.depth >= 1024) {
            try frame.push(0);
            return;
        }
        
        // Get call data
        const arg_offset_usize = @intCast(usize, arg_offset);
        const arg_size_usize = @intCast(usize, arg_size);
        
        const call_data = if (arg_size_usize > 0) blk: {
            try frame.ensureMemory(arg_offset_usize, arg_size_usize);
            break :blk try frame.memory.getSlice(arg_offset_usize, arg_size_usize);
        } else &[_]u8{};
        
        // Ensure return memory
        const ret_offset_usize = @intCast(usize, ret_offset);
        const ret_size_usize = @intCast(usize, ret_size);
        if (ret_size_usize > 0) {
            try frame.ensureMemory(ret_offset_usize, ret_size_usize);
        }
        
        // Calculate gas
        const target_exists = try interpreter.state_manager.accountExists(to);
        const is_cold = try interpreter.state_manager.access_list.addAddress(to);
        
        const call_cost = frame.gas.callGasCost(value, target_exists, is_cold);
        try frame.gas.consume(call_cost.cost);
        
        const gas_allocation = frame.gas.callGasAllocation(@intCast(u64, gas_param));
        const stipend = Gas.callStipend(value);
        
        // Execute call
        const result = try interpreter.call(
            CallParams{
                .caller = frame.getAddress(),
                .to = to,
                .value = value,
                .data = call_data,
                .gas = gas_allocation + stipend,
                .is_static = false,
            },
        );
        
        // Refund unused gas
        frame.gas.refundGas(result.gas_left);
        
        // Set return data
        if (result.output) |output| {
            try frame.setReturnData(output);
            
            // Copy to memory
            if (ret_size_usize > 0) {
                const copy_size = @min(ret_size_usize, output.len);
                try frame.memory.setData(ret_offset_usize, output[0..copy_size]);
                
                // Zero fill remaining
                if (copy_size < ret_size_usize) {
                    const zero_start = ret_offset_usize + copy_size;
                    const zero_size = ret_size_usize - copy_size;
                    var zeros = try frame.allocator.alloc(u8, zero_size);
                    defer frame.allocator.free(zeros);
                    @memset(zeros, 0);
                    try frame.memory.setData(zero_start, zeros);
                }
            }
        }
        
        // Push result
        try frame.push(if (result.success) 1 else 0);
    }

    /// 0xff: SELFDESTRUCT - Destroy contract
    pub fn selfdestruct(interpreter: *Interpreter, frame: *Frame) !void {
        if (frame.is_static) {
            return error.WriteProtection;
        }
        
        const beneficiary = Address.fromU256(try frame.pop());
        
        // Access list tracking
        const is_cold = try interpreter.state_manager.access_list.addAddress(beneficiary);
        const gas_cost: u64 = if (is_cold) 2600 else 0;
        
        // Additional cost for creating account
        const beneficiary_exists = try interpreter.state_manager.accountExists(beneficiary);
        const balance = try interpreter.state_manager.getBalance(frame.getAddress());
        
        if (!beneficiary_exists and balance > 0) {
            try frame.gas.consume(25000);
        }
        
        try frame.gas.consume(gas_cost);
        
        // Schedule for destruction
        try interpreter.scheduleSelfDestruct(frame.getAddress(), beneficiary);
        
        frame.halt(.Stop);
    }
};
```

## Code Reference from Existing Implementation

From various opcode files in src/Evm/opcodes/:

```zig
// From math.zig
pub fn executeMathOperation(operation: MathOp, stack: *Stack) EvmError!void {
    switch (operation) {
        .Add => {
            const b = try stack.pop();
            const a = try stack.pop();
            try stack.push(a +% b);
        },
        .Mul => {
            const b = try stack.pop();
            const a = try stack.pop();
            try stack.push(a *% b);
        },
        // ...
    }
}

// From storage.zig
pub fn sstore(interpreter: *Interpreter) !void {
    const value = try interpreter.stack.pop();
    const key = try interpreter.stack.pop();
    
    // Check if we're in a static call
    if (interpreter.is_static) {
        return error.WriteProtection;
    }
    
    // Perform the storage operation
    try interpreter.state.setStorage(interpreter.contract.address, key, value);
}
```

## Usage Example

```zig
// In interpreter main loop
const opcode = frame.contract.code[frame.pc];

switch (opcode) {
    0x01 => try math.add(&interpreter, &frame),
    0x02 => try math.mul(&interpreter, &frame),
    0x10 => try comparison.lt(&interpreter, &frame),
    0x20 => try crypto.sha3(&interpreter, &frame),
    0x30 => try env.address(&interpreter, &frame),
    0x51 => try memory.mload(&interpreter, &frame),
    0x54 => try storage.sload(&interpreter, &frame),
    0x56 => try control.jump(&interpreter, &frame),
    0x60...0x7f => try stack.push_n(&interpreter, &frame, opcode - 0x5f),
    0x80...0x8f => try stack.dup_n(&interpreter, &frame, opcode - 0x7f),
    0x90...0x9f => try stack.swap_n(&interpreter, &frame, opcode - 0x8f),
    0xa0...0xa4 => try log.log_n(&interpreter, &frame, opcode - 0xa0),
    0xf1 => try system.call(&interpreter, &frame),
    0xfe => return error.InvalidOpcode,
    else => return error.InvalidOpcode,
}
```

## Testing Requirements

1. **Correctness**:
   - Test each opcode against test vectors
   - Test edge cases (division by zero, overflows)
   - Test gas consumption accuracy

2. **Stack Validation**:
   - Test stack underflow detection
   - Test stack overflow prevention
   - Test correct stack manipulation

3. **Memory/Storage**:
   - Test memory expansion
   - Test storage gas calculation
   - Test transient storage

4. **Control Flow**:
   - Test jump validation
   - Test call depth limits
   - Test return data handling

5. **Hardfork Compatibility**:
   - Test opcode availability per fork
   - Test gas cost changes
   - Test behavior differences

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EVM Opcodes Reference](https://www.evm.codes/)
- [Go-Ethereum instructions.go](https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go)
- [revm instructions](https://github.com/bluealloy/revm/tree/main/crates/interpreter/src/instructions)