//! Gas-aware dispatch module for ZigEVM
//! This module handles the dispatch of opcodes to their implementations with accurate gas tracking

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const ExecutionResult = types.ExecutionResult;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const ReturnData = @import("../interpreter/return_data.zig").ReturnData;
const arithmetic = @import("arithmetic.zig");
const bitwise = @import("bitwise.zig");
const memory_ops = @import("memory.zig");
const return_data_ops = @import("return_data.zig");
const storage_ops = @import("storage.zig");
const environment_ops = @import("environment.zig");
const stack_ops = @import("stack_ops.zig");
const control_flow = @import("control_flow.zig");
const call_ops = @import("call_ops.zig");
const Storage = storage_ops.Storage;
const EvmEnvironment = environment_ops.EvmEnvironment;
const Opcode = @import("opcodes.zig").Opcode;
const gas_mod = @import("../gas/gas.zig");
const GasCalculator = gas_mod.GasCalculator;
const GasTier = gas_mod.GasTier;

/// Instruction handler function type
pub const InstructionFn = fn (
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_calc: *GasCalculator,
    return_data: ?*ReturnData,
) Error!void;

/// Execute the current instruction using our GasCalculator
/// This function is called by the interpreter to execute the current opcode
pub fn executeInstruction(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_calc: *GasCalculator,
    return_data: ?*ReturnData,
    storage: ?*Storage,
    is_static: bool,
    environment: ?*EvmEnvironment,
    calldata: ?[]const u8,
    gas_price: ?*U256,
) Error!void {
    // Get the current opcode
    const opcode = code[pc.*];
    
    // Dispatch based on opcode
    switch (opcode) {
        // 0x0* - Stop and arithmetic
        @intFromEnum(Opcode.STOP) => {
            // STOP is handled in the interpreter
            pc.* += 1;
            return;
        },
        @intFromEnum(Opcode.ADD) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            try stack.push(a.add(b));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.MUL) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            try stack.push(a.mul(b));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SUB) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            try stack.push(a.sub(b));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.DIV) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (b.isZero()) {
                try stack.push(U256.zero());
            } else {
                try stack.push(a.div(b));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SDIV) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (b.isZero()) {
                try stack.push(U256.zero());
            } else {
                try stack.push(a.sdiv(b));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.MOD) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (b.isZero()) {
                try stack.push(U256.zero());
            } else {
                try stack.push(a.mod(b));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SMOD) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (b.isZero()) {
                try stack.push(U256.zero());
            } else {
                try stack.push(a.smod(b));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.ADDMOD) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.mid);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            const n = try stack.pop();
            
            if (n.isZero()) {
                try stack.push(U256.zero());
            } else {
                try stack.push(a.addmod(b, n));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.MULMOD) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.mid);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            const n = try stack.pop();
            
            if (n.isZero()) {
                try stack.push(U256.zero());
            } else {
                try stack.push(a.mulmod(b, n));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.EXP) => {
            // Pop values first to calculate gas
            const base = try stack.pop();
            const exponent = try stack.pop();
            
            // Charge gas for EXP operation (dynamic based on exponent size)
            try gas_calc.chargeExp(exponent);
            
            // Execute opcode
            try stack.push(base.exp(exponent));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SIGNEXTEND) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.low);
            
            // Execute opcode
            const b = try stack.pop();
            const x = try stack.pop();
            
            if (b.words[0] >= 32) {
                // If b >= 32, no change
                try stack.push(x);
            } else {
                const bit_index = b.words[0] * 8 + 7;
                const mask = U256.shl(U256.fromU64(1), bit_index);
                const is_negative = x.bitAnd(mask).cmp(U256.zero()) != 0;
                
                if (is_negative) {
                    // Set all higher bits to 1
                    var set_mask = U256.fromU64((1 << bit_index) - 1);
                    set_mask = set_mask.bitNot();
                    try stack.push(x.bitOr(set_mask));
                } else {
                    // Set all higher bits to 0
                    var clear_mask = U256.fromU64((1 << bit_index) - 1);
                    try stack.push(x.bitAnd(clear_mask));
                }
            }
            
            // Advance PC
            pc.* += 1;
        },
        
        // 0x1* - Comparison and bitwise
        @intFromEnum(Opcode.LT) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (a.cmp(b) < 0) {
                try stack.push(U256.fromU64(1));
            } else {
                try stack.push(U256.zero());
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.GT) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (a.cmp(b) > 0) {
                try stack.push(U256.fromU64(1));
            } else {
                try stack.push(U256.zero());
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SLT) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            // For signed comparison, check the sign bit
            const a_negative = a.isNegative();
            const b_negative = b.isNegative();
            
            if (a_negative != b_negative) {
                try stack.push(U256.fromU64(if (a_negative) 1 else 0));
            } else {
                try stack.push(U256.fromU64(if (a.cmp(b) < 0) 1 else 0));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SGT) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            // For signed comparison, check the sign bit
            const a_negative = a.isNegative();
            const b_negative = b.isNegative();
            
            if (a_negative != b_negative) {
                try stack.push(U256.fromU64(if (b_negative) 1 else 0));
            } else {
                try stack.push(U256.fromU64(if (a.cmp(b) > 0) 1 else 0));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.EQ) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            if (a.cmp(b) == 0) {
                try stack.push(U256.fromU64(1));
            } else {
                try stack.push(U256.zero());
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.ISZERO) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            
            if (a.isZero()) {
                try stack.push(U256.fromU64(1));
            } else {
                try stack.push(U256.zero());
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.AND) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            try stack.push(a.bitAnd(b));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.OR) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            try stack.push(a.bitOr(b));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.XOR) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            const b = try stack.pop();
            
            try stack.push(a.bitXor(b));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.NOT) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const a = try stack.pop();
            
            try stack.push(a.bitNot());
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.BYTE) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const i = try stack.pop();
            const x = try stack.pop();
            
            // If i >= 32, result is 0
            if (i.words[0] >= 32) {
                try stack.push(U256.zero());
            } else {
                // Get the byte at position i (counting from the most significant byte)
                const byte_pos = 31 - i.words[0];
                var result = U256.zero();
                
                // Calculate which word contains the byte
                const word_index = byte_pos / 8;
                const byte_index = byte_pos % 8;
                
                // Extract the byte
                const byte_value = (x.words[word_index] >> (byte_index * 8)) & 0xFF;
                result.words[0] = byte_value;
                
                try stack.push(result);
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SHL) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const shift = try stack.pop();
            const value = try stack.pop();
            
            if (shift.words[0] >= 256) {
                // If shift >= 256, result is 0
                try stack.push(U256.zero());
            } else {
                try stack.push(value.shl(shift.words[0]));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SHR) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const shift = try stack.pop();
            const value = try stack.pop();
            
            if (shift.words[0] >= 256) {
                // If shift >= 256, result is 0
                try stack.push(U256.zero());
            } else {
                try stack.push(value.shr(shift.words[0]));
            }
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SAR) => {
            // Charge gas according to tier
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const shift = try stack.pop();
            const value = try stack.pop();
            
            if (shift.words[0] >= 256) {
                // If shift >= 256, result is 0 or -1 (all 1s) depending on sign bit
                if (value.isNegative()) {
                    var all_ones = U256{ .words = .{ 0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF,
                                                   0xFFFFFFFFFFFFFFFF, 0xFFFFFFFFFFFFFFFF } };
                    try stack.push(all_ones);
                } else {
                    try stack.push(U256.zero());
                }
            } else {
                try stack.push(value.sar(shift.words[0]));
            }
            
            // Advance PC
            pc.* += 1;
        },
        
        // 0x5* - Memory and storage
        @intFromEnum(Opcode.MLOAD) => {
            // Charge gas for MLOAD (3 gas base cost plus memory expansion cost)
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const offset = try stack.pop();
            
            // Ensure the offset fits in usize
            if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
                return Error.InvalidOffset;
            }
            
            // Convert to usize
            const mem_offset = @as(usize, offset.words[0]);
            
            // Charge memory expansion cost
            try gas_calc.chargeMemoryExpansion(mem_offset + 32);
            
            // Load 32 bytes from memory
            const value = memory.load(mem_offset);
            try stack.push(value);
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.MSTORE) => {
            // Charge gas for MSTORE (3 gas base cost plus memory expansion cost)
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const offset = try stack.pop();
            const value = try stack.pop();
            
            // Ensure the offset fits in usize
            if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
                return Error.InvalidOffset;
            }
            
            // Convert to usize
            const mem_offset = @as(usize, offset.words[0]);
            
            // Charge memory expansion cost
            try gas_calc.chargeMemoryExpansion(mem_offset + 32);
            
            // Store 32 bytes to memory
            memory.store32(mem_offset, value);
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.MSTORE8) => {
            // Charge gas for MSTORE8 (3 gas base cost plus memory expansion cost)
            try gas_calc.chargeGasTier(.very_low);
            
            // Execute opcode
            const offset = try stack.pop();
            const value = try stack.pop();
            
            // Ensure the offset fits in usize
            if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
                return Error.InvalidOffset;
            }
            
            // Convert to usize
            const mem_offset = @as(usize, offset.words[0]);
            
            // Charge memory expansion cost
            try gas_calc.chargeMemoryExpansion(mem_offset + 1);
            
            // Store 1 byte to memory
            const byte_value = @as(u8, @truncate(value.words[0]));
            memory.store8(mem_offset, byte_value);
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.MSIZE) => {
            // Charge gas for MSIZE
            try gas_calc.chargeGasTier(.base);
            
            // Execute opcode
            try stack.push(U256.fromU64(memory.size));
            
            // Advance PC
            pc.* += 1;
        },
        @intFromEnum(Opcode.SLOAD) => {
            if (storage) |s| {
                // Pop key from stack
                const key = try stack.pop();
                
                // Check for access list status (cold/warm)
                const is_cold = !s.isColdSlot(key);
                
                // Charge gas for SLOAD with correct access cost
                try gas_calc.chargeAccountAccess(is_cold);
                
                // Get value from storage
                const value = s.get(key);
                
                // Push value to stack
                try stack.push(value);
                
                // Advance PC
                pc.* += 1;
            } else {
                return Error.StorageUnavailable;
            }
        },
        @intFromEnum(Opcode.SSTORE) => {
            if (storage) |s| {
                // Check if we're in static mode (no state changes allowed)
                if (is_static) {
                    return Error.StaticModeViolation;
                }
                
                // Pop key and value from stack
                const key = try stack.pop();
                const new_value = try stack.pop();
                
                // Get original and current value
                const original_value = s.getOriginal(key);
                const current_value = s.get(key);
                
                // Check for access list status (cold/warm)
                const is_cold = !s.isColdSlot(key);
                
                // Charge gas for SSTORE with correct calculations for EIP-2200 and access lists
                try gas_calc.chargeSstore(is_cold, original_value, current_value, new_value);
                
                // Store value
                s.set(key, new_value);
                
                // Advance PC
                pc.* += 1;
            } else {
                return Error.StorageUnavailable;
            }
        },
        @intFromEnum(Opcode.JUMP) => {
            // Charge gas for JUMP
            try gas_calc.chargeGasTier(.mid);
            
            // Execute opcode
            const dest = try stack.pop();
            
            // Ensure the destination fits in usize
            if (dest.words[1] != 0 or dest.words[2] != 0 or dest.words[3] != 0) {
                return Error.InvalidJump;
            }
            
            // Convert to usize
            const jump_dest = @as(usize, dest.words[0]);
            
            // Set PC to jump destination (validator will check if it's valid)
            pc.* = jump_dest;
            
            // Don't advance PC here, as we've already set it directly
        },
        @intFromEnum(Opcode.JUMPI) => {
            // Charge gas for JUMPI
            try gas_calc.chargeGasTier(.high);
            
            // Execute opcode
            const dest = try stack.pop();
            const cond = try stack.pop();
            
            // Check condition
            if (!cond.isZero()) {
                // Ensure the destination fits in usize
                if (dest.words[1] != 0 or dest.words[2] != 0 or dest.words[3] != 0) {
                    return Error.InvalidJump;
                }
                
                // Convert to usize
                const jump_dest = @as(usize, dest.words[0]);
                
                // Set PC to jump destination (validator will check if it's valid)
                pc.* = jump_dest;
            } else {
                // No jump, advance PC
                pc.* += 1;
            }
        },
        @intFromEnum(Opcode.JUMPDEST) => {
            // Charge gas for JUMPDEST
            try gas_calc.chargeGasTier(.base);
            
            // No operation needed for JUMPDEST
            
            // Advance PC
            pc.* += 1;
        },
        
        // PUSH operations (0x60-0x7F)
        @intFromEnum(Opcode.PUSH1)...@intFromEnum(Opcode.PUSH32) => {
            // Charge gas for PUSH
            try gas_calc.chargeGasTier(.very_low);
            
            // Get the number of bytes to push (PUSH1 = 1 byte, PUSH2 = 2 bytes, etc.)
            const n = opcode - (@intFromEnum(Opcode.PUSH1) - 1);
            
            // Build value to push
            var value = U256.zero();
            
            // Check if we have enough bytes left
            if (pc.* + n >= code.len) {
                // Not enough bytes left, pad with zeros
                const available = code.len - (pc.* + 1);
                for (0..available) |i| {
                    if (pc.* + 1 + i < code.len) {
                        value = value.shl(8);
                        value = value.add(U256.fromU64(code[pc.* + 1 + i]));
                    }
                }
            } else {
                // Read n bytes
                for (0..n) |i| {
                    value = value.shl(8);
                    value = value.add(U256.fromU64(code[pc.* + 1 + i]));
                }
            }
            
            // Push value to stack
            try stack.push(value);
            
            // Advance PC (skip the immediate bytes too)
            pc.* += 1 + n;
        },
        
        // DUP operations (0x80-0x8F)
        @intFromEnum(Opcode.DUP1)...@intFromEnum(Opcode.DUP16) => {
            // Charge gas for DUP
            try gas_calc.chargeGasTier(.very_low);
            
            // Get the index of the item to duplicate (DUP1 = 1st item, DUP2 = 2nd item, etc.)
            const n = opcode - @intFromEnum(Opcode.DUP1) + 1;
            
            // Check stack size
            if (stack.getSize() < n) {
                return Error.StackUnderflow;
            }
            
            // Get the value to duplicate
            const value = try stack.get(n - 1);
            
            // Push the duplicate to the stack
            try stack.push(value.*);
            
            // Advance PC
            pc.* += 1;
        },
        
        // SWAP operations (0x90-0x9F)
        @intFromEnum(Opcode.SWAP1)...@intFromEnum(Opcode.SWAP16) => {
            // Charge gas for SWAP
            try gas_calc.chargeGasTier(.very_low);
            
            // Get the index of the item to swap with the top (SWAP1 = 1st item, SWAP2 = 2nd item, etc.)
            const n = opcode - @intFromEnum(Opcode.SWAP1) + 1;
            
            // Check stack size
            if (stack.getSize() < n + 1) {
                return Error.StackUnderflow;
            }
            
            // Swap the top item with the nth item
            try stack.swap(0, n);
            
            // Advance PC
            pc.* += 1;
        },
        
        // Other opcodes would need similar implementations
        
        else => {
            return Error.InvalidOpcode;
        }
    }
}

// Tests for this module would mirror those in the original dispatch.zig,
// but they would use the GasCalculator instead of direct gas tracking.