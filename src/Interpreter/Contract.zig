const std = @import("std");
const bitvec = @import("bitvec.zig");
const opcodes = @import("opcodes.zig");
const address = @import("Address");

/// Contract represents an ethereum contract in the state database
pub const Contract = struct {
    address: address.Address,
    /// Locally cached result of JUMPDEST analysis for this specific contract
    analysis: ?bitvec.BitVec,
    caller: address.Address,
    code: []const u8,
    code_hash: [32]u8,
    gas: u64,
    input: []const u8,
    is_deployment: bool = false,
    is_system_call: bool = false,
    /// Cached JUMPDEST analysis results for all analyzed contracts
    jumpdests: ?std.StringHashMap(bitvec.BitVec),
    value: u256,

    pub fn init(caller: address.Address, contract_address: address.Address, value: u256, gas: u64, jumpdests: ?std.StringHashMap(bitvec.BitVec)) Contract {
        return Contract{
            .caller = caller,
            .address = contract_address,
            .jumpdests = jumpdests,
            .analysis = null,
            .code = &.{},
            .code_hash = [_]u8{0} ** 32,
            .input = &.{},
            .gas = gas,
            .value = value,
        };
    }

    pub fn validJumpdest(self: *Contract, dest: u256) bool {
        if (dest.isAboveOrEqual(self.code.len)) {
            return false;
        }
        const udest = dest.toU64();
        if (self.code[udest] != opcodes.JUMPDEST_OPCODE) {
            return false;
        }
        return self.isCode(udest);
    }

    pub fn isCode(self: *Contract, udest: u64) bool {
        if (self.analysis) |analysis| {
            return analysis.codeSegment(udest);
        }
        if (!std.mem.allEqual(u8, &self.code_hash, 0)) {
            if (self.jumpdests) |*jumpdests| {
                var hash_str: [64]u8 = undefined;
                _ = std.fmt.bufPrint(&hash_str, "{s}", .{std.fmt.fmtSliceHexLower(&self.code_hash)}) catch "0";

                if (jumpdests.get(&hash_str)) |analysis| {
                    self.analysis = analysis;
                    return analysis.codeSegment(udest);
                } else {
                    var analysis = bitvec.codeBitmap(self.code);
                    jumpdests.put(&hash_str, analysis) catch {};
                    self.analysis = analysis;
                    return analysis.codeSegment(udest);
                }
            }
        }
        if (self.analysis == null) {
            self.analysis = bitvec.codeBitmap(self.code);
        }
        return self.analysis.?.codeSegment(udest);
    }

    pub fn getOp(self: *const Contract, n: u64) u8 {
        if (n < self.code.len) {
            return self.code[n];
        }
        return opcodes.STOP_OPCODE;
    }

    pub fn getCaller(self: *const Contract) address.Address {
        return self.caller;
    }

    pub fn useGas(self: *Contract, gas_amount: u64) bool {
        if (self.gas < gas_amount) {
            return false;
        }
        self.gas -= gas_amount;
        return true;
    }

    pub fn refundGas(self: *Contract, gas_amount: u64) void {
        if (gas_amount == 0) {
            return;
        }
        self.gas += gas_amount;
    }

    pub fn getAddress(self: *const Contract) address.Address {
        return self.address;
    }

    pub fn getValue(self: *const Contract) u256 {
        return self.value;
    }

    pub fn setCallCode(self: *Contract, hash: [32]u8, code: []const u8) void {
        self.code = code;
        self.code_hash = hash;
    }
};

pub fn createContract(caller: address.Address, contract_address: address.Address, value: u256, gas: u64) Contract {
    const jumpdests = std.StringHashMap(bitvec.BitVec).init(std.heap.page_allocator);
    return Contract.init(caller, contract_address, value, gas, jumpdests);
}

pub fn createContractWithParent(caller: address.Address, contract_address: address.Address, value: u256, gas: u64, parent: *const Contract) Contract {
    return Contract.init(caller, contract_address, value, gas, parent.jumpdests);
}
