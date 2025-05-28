const std = @import("std");
const constants = @import("constants.zig");
const GasResult = constants.GasResult;

pub const GasError = error{
    OutOfGas,
    GasOverflow,
    InsufficientGasForCall,
    GasLimitExceeded,
};

/// Gas costs for common operations (latest hardfork)
pub const GasCosts = struct {
    // Base costs
    pub const ZERO: u64 = 0;
    pub const JUMPDEST: u64 = 1;
    pub const BASE: u64 = 2;
    pub const VERYLOW: u64 = 3;
    pub const LOW: u64 = 5;
    pub const MID: u64 = 8;
    pub const HIGH: u64 = 10;
    
    // Memory and storage
    pub const MEMORY: u64 = 3;
    pub const STORAGE_SET: u64 = 20000;
    pub const STORAGE_RESET: u64 = 5000;
    pub const STORAGE_CLEAR_REFUND: u64 = 15000;
    
    // Call-related
    pub const CALL: u64 = 700;
    pub const CALLVALUE: u64 = 9000;
    pub const NEWACCOUNT: u64 = 25000;
    pub const EXP: u64 = 10;
    pub const EXPBYTE: u64 = 50;
    
    // Create
    pub const CREATE: u64 = 32000;
    pub const CREATE2: u64 = 32000;
    pub const CREATE_DATA: u64 = 200;
    
    // Transaction
    pub const TRANSACTION: u64 = 21000;
    pub const TRANSACTION_CREATE: u64 = 53000;
    pub const TRANSACTION_ZERO_DATA: u64 = 4;
    pub const TRANSACTION_NON_ZERO_DATA: u64 = 16;
    
    // Logs
    pub const LOG: u64 = 375;
    pub const LOGDATA: u64 = 8;
    pub const LOGTOPIC: u64 = 375;
    
    // Other
    pub const KECCAK256: u64 = 30;
    pub const KECCAK256_WORD: u64 = 6;
    pub const COPY: u64 = 3;
    pub const BLOCKHASH: u64 = 20;
    pub const CODEDEPOSIT: u64 = 200;
    
    // EIP-2929 (Berlin) - Access lists
    pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
    pub const COLD_SLOAD_COST: u64 = 2100;
    pub const WARM_STORAGE_READ_COST: u64 = 100;
    
    // EIP-3529 (London) - Refund changes
    pub const STORAGE_CLEAR_REFUND_REDUCED: u64 = 4800;
    pub const MAX_REFUND_QUOTIENT: u64 = 5;
};

pub const Gas = struct {
    /// Current gas remaining
    remaining: u64,
    /// Gas limit for this execution
    limit: u64,
    /// Gas used so far
    used: u64,
    /// Refund counter
    refund: u64,
    /// Memory size last paid for
    memory_size: u64,

    // Initialization

    /// Create new gas meter with given limit
    pub fn init(gas_limit: u64) Gas {
        return Gas{
            .remaining = gas_limit,
            .limit = gas_limit,
            .used = 0,
            .refund = 0,
            .memory_size = 0,
        };
    }

    // Basic gas operations

    /// Consume gas, returns error if insufficient
    pub inline fn consume(self: *Gas, amount: u64) GasError!void {
        if (amount > self.remaining) {
            return error.OutOfGas;
        }
        self.remaining -= amount;
        self.used += amount;
    }

    /// Try to consume gas, returns false if insufficient (no error)
    pub inline fn tryConsume(self: *Gas, amount: u64) bool {
        if (amount > self.remaining) {
            return false;
        }
        self.remaining -= amount;
        self.used += amount;
        return true;
    }

    /// Add gas (for gas refunds or call returns)
    pub inline fn refundGas(self: *Gas, amount: u64) void {
        self.remaining = @min(self.remaining + amount, self.limit);
        self.used = self.limit - self.remaining;
    }

    /// Add to refund counter
    pub fn addRefund(self: *Gas, amount: u64) void {
        self.refund = self.refund + amount;
    }

    /// Subtract from refund counter (with underflow protection)
    pub fn subRefund(self: *Gas, amount: u64) void {
        if (amount > self.refund) {
            self.refund = 0;
        } else {
            self.refund -= amount;
        }
    }

    /// Get effective refund (capped by London rules)
    pub fn getEffectiveRefund(self: *const Gas) u64 {
        // EIP-3529: Refund is capped at used_gas / 5
        const max_refund = self.used / GasCosts.MAX_REFUND_QUOTIENT;
        return @min(self.refund, max_refund);
    }

    // Memory gas calculations

    /// Calculate memory expansion cost
    pub fn memoryGasCost(self: *const Gas, offset: u64, size: u64) GasResult {
        if (size == 0) {
            return GasResult{ .cost = 0, .overflow = false };
        }

        // Check for overflow
        const end_offset = offset +% size;
        if (end_offset < offset) {
            return GasResult{ .cost = 0, .overflow = true };
        }

        // Calculate new memory size (rounded up to 32-byte words)
        const new_mem_size = (end_offset + 31) / 32 * 32;
        
        if (new_mem_size <= self.memory_size) {
            return GasResult{ .cost = 0, .overflow = false };
        }

        const new_mem_size_words = new_mem_size / 32;
        const old_mem_size_words = self.memory_size / 32;

        // Memory cost formula: memory_cost = (memory_size_word ** 2) / 512 + (3 * memory_size_word)
        const new_cost = (new_mem_size_words * new_mem_size_words) / 512 + (3 * new_mem_size_words);
        const old_cost = (old_mem_size_words * old_mem_size_words) / 512 + (3 * old_mem_size_words);

        const cost = new_cost - old_cost;

        return GasResult{
            .cost = cost,
            .overflow = false,
        };
    }

    /// Update memory size after expansion
    pub fn expandMemory(self: *Gas, new_size: u64) void {
        if (new_size > self.memory_size) {
            self.memory_size = new_size;
        }
    }

    // Storage gas calculations

    /// Calculate SSTORE gas cost (EIP-2200 with EIP-2929)
    pub fn sstoreGasCost(
        self: *Gas,
        original: u64,
        current: u64,
        new: u64,
        is_cold: bool,
    ) GasResult {
        // Base cost
        var cost: u64 = if (is_cold) GasCosts.COLD_SLOAD_COST else GasCosts.WARM_STORAGE_READ_COST;

        // EIP-2200 logic
        if (new == current) {
            // No-op
            return GasResult{ .cost = cost, .overflow = false };
        }

        if (original == current) {
            // First modification in transaction
            if (original == 0) {
                // Creating new storage
                cost += GasCosts.STORAGE_SET;
            } else if (new == 0) {
                // Clearing storage
                cost += GasCosts.STORAGE_RESET;
                self.addRefund(GasCosts.STORAGE_CLEAR_REFUND_REDUCED);
            } else {
                // Changing existing value
                cost += GasCosts.STORAGE_RESET;
            }
        } else {
            // Subsequent modification
            cost += GasCosts.WARM_STORAGE_READ_COST;
            
            if (original != 0) {
                if (current == 0) {
                    // Recreating in same transaction
                    self.subRefund(GasCosts.STORAGE_CLEAR_REFUND_REDUCED);
                } else if (new == 0) {
                    // Clearing again
                    self.addRefund(GasCosts.STORAGE_CLEAR_REFUND_REDUCED);
                }
            }
            
            if (original == new) {
                // Reverting to original
                if (original == 0) {
                    self.addRefund(GasCosts.STORAGE_SET - GasCosts.WARM_STORAGE_READ_COST);
                } else {
                    self.addRefund(GasCosts.STORAGE_RESET - GasCosts.WARM_STORAGE_READ_COST);
                }
            }
        }

        return GasResult{ .cost = cost, .overflow = false };
    }

    // Call gas calculations

    /// Calculate gas for CALL operations
    pub fn callGasCost(
        _: *Gas,
        value: u64,
        target_exists: bool,
        is_cold: bool,
    ) GasResult {
        var cost: u64 = if (is_cold) GasCosts.COLD_ACCOUNT_ACCESS_COST else GasCosts.WARM_STORAGE_READ_COST;

        if (value > 0) {
            cost += GasCosts.CALLVALUE;
            if (!target_exists) {
                cost += GasCosts.NEWACCOUNT;
            }
        }

        return GasResult{ .cost = cost, .overflow = false };
    }

    /// Calculate gas allocation for sub-call
    pub fn callGasAllocation(self: *const Gas, gas_param: u64) u64 {
        // All but one 64th of gas can be passed to sub-call
        const remaining_after_call = self.remaining / 64;
        const available_for_call = self.remaining - remaining_after_call;
        
        return @min(gas_param, available_for_call);
    }

    /// Calculate stipend for calls with value
    pub fn callStipend(value: u64) u64 {
        return if (value > 0) 2300 else 0;
    }

    // Other dynamic costs

    /// Calculate EXP gas cost
    pub fn expGasCost(exponent: u64) GasResult {
        if (exponent == 0) {
            return GasResult{ .cost = GasCosts.EXP, .overflow = false };
        }

        // Count significant bytes in exponent
        const bits = @bitSizeOf(u64) - @clz(exponent);
        const bytes = (bits + 7) / 8;
        const cost = GasCosts.EXP + GasCosts.EXPBYTE * bytes;

        return GasResult{ .cost = cost, .overflow = false };
    }

    /// Calculate KECCAK256 gas cost
    pub fn keccak256GasCost(size: u64) GasResult {
        const word_size = (size + 31) / 32;
        const cost = GasCosts.KECCAK256 + GasCosts.KECCAK256_WORD * word_size;
        
        return GasResult{ .cost = cost, .overflow = false };
    }

    /// Calculate *COPY operations gas cost
    pub fn copyGasCost(size: u64) GasResult {
        const word_size = (size + 31) / 32;
        const cost = GasCosts.COPY * word_size;
        
        return GasResult{ .cost = cost, .overflow = false };
    }

    /// Calculate LOG* operations gas cost
    pub fn logGasCost(size: u64, topic_count: u8) GasResult {
        const cost = GasCosts.LOG + 
                    GasCosts.LOGDATA * size + 
                    GasCosts.LOGTOPIC * topic_count;
        
        return GasResult{ .cost = cost, .overflow = false };
    }

    /// Calculate CREATE/CREATE2 gas cost
    pub fn createGasCost(init_code_size: u64) GasResult {
        const word_size = (init_code_size + 31) / 32;
        const cost = GasCosts.CREATE + GasCosts.CREATE_DATA * word_size;
        
        return GasResult{ .cost = cost, .overflow = false };
    }

    // Transaction costs

    /// Calculate intrinsic gas for transaction
    pub fn transactionIntrinsicGas(
        data: []const u8,
        is_contract_creation: bool,
        access_list_addresses: usize,
        access_list_storage_keys: usize,
    ) GasResult {
        var cost: u64 = if (is_contract_creation) 
            GasCosts.TRANSACTION_CREATE 
        else 
            GasCosts.TRANSACTION;

        // Data costs
        for (data) |byte| {
            if (byte == 0) {
                cost += GasCosts.TRANSACTION_ZERO_DATA;
            } else {
                cost += GasCosts.TRANSACTION_NON_ZERO_DATA;
            }
        }

        // EIP-2930: Access list costs
        cost += 2400 * access_list_addresses;
        cost += 1900 * access_list_storage_keys;

        return GasResult{ .cost = cost, .overflow = false };
    }
};

/// Fast opcode gas lookup table
pub const OPCODE_GAS_COSTS = [256]u64{
    GasCosts.ZERO,       // 0x00 STOP
    GasCosts.VERYLOW,    // 0x01 ADD
    GasCosts.LOW,        // 0x02 MUL
    GasCosts.VERYLOW,    // 0x03 SUB
    GasCosts.LOW,        // 0x04 DIV
    GasCosts.LOW,        // 0x05 SDIV
    GasCosts.LOW,        // 0x06 MOD
    GasCosts.LOW,        // 0x07 SMOD
    GasCosts.MID,        // 0x08 ADDMOD
    GasCosts.MID,        // 0x09 MULMOD
    0,                   // 0x0a EXP (dynamic)
    GasCosts.HIGH,       // 0x0b SIGNEXTEND
    0, 0, 0, 0,          // 0x0c - 0x0f
    GasCosts.VERYLOW,    // 0x10 LT
    GasCosts.VERYLOW,    // 0x11 GT
    GasCosts.VERYLOW,    // 0x12 SLT
    GasCosts.VERYLOW,    // 0x13 SGT
    GasCosts.VERYLOW,    // 0x14 EQ
    GasCosts.VERYLOW,    // 0x15 ISZERO
    GasCosts.VERYLOW,    // 0x16 AND
    GasCosts.VERYLOW,    // 0x17 OR
    GasCosts.VERYLOW,    // 0x18 XOR
    GasCosts.VERYLOW,    // 0x19 NOT
    GasCosts.VERYLOW,    // 0x1a BYTE
    GasCosts.VERYLOW,    // 0x1b SHL
    GasCosts.VERYLOW,    // 0x1c SHR
    GasCosts.VERYLOW,    // 0x1d SAR
    0, 0,                // 0x1e - 0x1f
    0,                   // 0x20 KECCAK256 (dynamic)
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x21 - 0x2f
    GasCosts.BASE,       // 0x30 ADDRESS
    0,                   // 0x31 BALANCE (dynamic)
    GasCosts.BASE,       // 0x32 ORIGIN
    GasCosts.BASE,       // 0x33 CALLER
    GasCosts.BASE,       // 0x34 CALLVALUE
    GasCosts.VERYLOW,    // 0x35 CALLDATALOAD
    GasCosts.BASE,       // 0x36 CALLDATASIZE
    0,                   // 0x37 CALLDATACOPY (dynamic)
    GasCosts.BASE,       // 0x38 CODESIZE
    0,                   // 0x39 CODECOPY (dynamic)
    GasCosts.BASE,       // 0x3a GASPRICE
    0,                   // 0x3b EXTCODESIZE (dynamic)
    0,                   // 0x3c EXTCODECOPY (dynamic)
    GasCosts.BASE,       // 0x3d RETURNDATASIZE
    0,                   // 0x3e RETURNDATACOPY (dynamic)
    0,                   // 0x3f EXTCODEHASH (dynamic)
    GasCosts.BLOCKHASH,  // 0x40 BLOCKHASH
    GasCosts.BASE,       // 0x41 COINBASE
    GasCosts.BASE,       // 0x42 TIMESTAMP
    GasCosts.BASE,       // 0x43 NUMBER
    GasCosts.BASE,       // 0x44 DIFFICULTY/PREVRANDAO
    GasCosts.BASE,       // 0x45 GASLIMIT
    GasCosts.BASE,       // 0x46 CHAINID
    GasCosts.BASE,       // 0x47 SELFBALANCE
    GasCosts.BASE,       // 0x48 BASEFEE
    0, 0, 0, 0, 0, 0, 0, // 0x49 - 0x4f
    GasCosts.VERYLOW,    // 0x50 POP
    GasCosts.VERYLOW,    // 0x51 MLOAD
    GasCosts.VERYLOW,    // 0x52 MSTORE
    GasCosts.VERYLOW,    // 0x53 MSTORE8
    0,                   // 0x54 SLOAD (dynamic)
    0,                   // 0x55 SSTORE (dynamic)
    GasCosts.MID,        // 0x56 JUMP
    GasCosts.HIGH,       // 0x57 JUMPI
    GasCosts.BASE,       // 0x58 PC
    GasCosts.BASE,       // 0x59 MSIZE
    GasCosts.BASE,       // 0x5a GAS
    GasCosts.JUMPDEST,   // 0x5b JUMPDEST
    0, 0, 0, 0,          // 0x5c - 0x5f
    GasCosts.VERYLOW,    // 0x60 PUSH1
    GasCosts.VERYLOW,    // 0x61 PUSH2
    GasCosts.VERYLOW,    // 0x62 PUSH3
    GasCosts.VERYLOW,    // 0x63 PUSH4
    GasCosts.VERYLOW,    // 0x64 PUSH5
    GasCosts.VERYLOW,    // 0x65 PUSH6
    GasCosts.VERYLOW,    // 0x66 PUSH7
    GasCosts.VERYLOW,    // 0x67 PUSH8
    GasCosts.VERYLOW,    // 0x68 PUSH9
    GasCosts.VERYLOW,    // 0x69 PUSH10
    GasCosts.VERYLOW,    // 0x6a PUSH11
    GasCosts.VERYLOW,    // 0x6b PUSH12
    GasCosts.VERYLOW,    // 0x6c PUSH13
    GasCosts.VERYLOW,    // 0x6d PUSH14
    GasCosts.VERYLOW,    // 0x6e PUSH15
    GasCosts.VERYLOW,    // 0x6f PUSH16
    GasCosts.VERYLOW,    // 0x70 PUSH17
    GasCosts.VERYLOW,    // 0x71 PUSH18
    GasCosts.VERYLOW,    // 0x72 PUSH19
    GasCosts.VERYLOW,    // 0x73 PUSH20
    GasCosts.VERYLOW,    // 0x74 PUSH21
    GasCosts.VERYLOW,    // 0x75 PUSH22
    GasCosts.VERYLOW,    // 0x76 PUSH23
    GasCosts.VERYLOW,    // 0x77 PUSH24
    GasCosts.VERYLOW,    // 0x78 PUSH25
    GasCosts.VERYLOW,    // 0x79 PUSH26
    GasCosts.VERYLOW,    // 0x7a PUSH27
    GasCosts.VERYLOW,    // 0x7b PUSH28
    GasCosts.VERYLOW,    // 0x7c PUSH29
    GasCosts.VERYLOW,    // 0x7d PUSH30
    GasCosts.VERYLOW,    // 0x7e PUSH31
    GasCosts.VERYLOW,    // 0x7f PUSH32
    GasCosts.BASE,       // 0x80 DUP1
    GasCosts.BASE,       // 0x81 DUP2
    GasCosts.BASE,       // 0x82 DUP3
    GasCosts.BASE,       // 0x83 DUP4
    GasCosts.BASE,       // 0x84 DUP5
    GasCosts.BASE,       // 0x85 DUP6
    GasCosts.BASE,       // 0x86 DUP7
    GasCosts.BASE,       // 0x87 DUP8
    GasCosts.BASE,       // 0x88 DUP9
    GasCosts.BASE,       // 0x89 DUP10
    GasCosts.BASE,       // 0x8a DUP11
    GasCosts.BASE,       // 0x8b DUP12
    GasCosts.BASE,       // 0x8c DUP13
    GasCosts.BASE,       // 0x8d DUP14
    GasCosts.BASE,       // 0x8e DUP15
    GasCosts.BASE,       // 0x8f DUP16
    GasCosts.BASE,       // 0x90 SWAP1
    GasCosts.BASE,       // 0x91 SWAP2
    GasCosts.BASE,       // 0x92 SWAP3
    GasCosts.BASE,       // 0x93 SWAP4
    GasCosts.BASE,       // 0x94 SWAP5
    GasCosts.BASE,       // 0x95 SWAP6
    GasCosts.BASE,       // 0x96 SWAP7
    GasCosts.BASE,       // 0x97 SWAP8
    GasCosts.BASE,       // 0x98 SWAP9
    GasCosts.BASE,       // 0x99 SWAP10
    GasCosts.BASE,       // 0x9a SWAP11
    GasCosts.BASE,       // 0x9b SWAP12
    GasCosts.BASE,       // 0x9c SWAP13
    GasCosts.BASE,       // 0x9d SWAP14
    GasCosts.BASE,       // 0x9e SWAP15
    GasCosts.BASE,       // 0x9f SWAP16
    0,                   // 0xa0 LOG0 (dynamic)
    0,                   // 0xa1 LOG1 (dynamic)
    0,                   // 0xa2 LOG2 (dynamic)
    0,                   // 0xa3 LOG3 (dynamic)
    0,                   // 0xa4 LOG4 (dynamic)
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xa5 - 0xaf
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xb0 - 0xbf
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xc0 - 0xcf
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xd0 - 0xdf
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0xe0 - 0xef
    0,                   // 0xf0 CREATE (dynamic)
    0,                   // 0xf1 CALL (dynamic)
    0,                   // 0xf2 CALLCODE (dynamic)
    GasCosts.ZERO,       // 0xf3 RETURN
    0,                   // 0xf4 DELEGATECALL (dynamic)
    0,                   // 0xf5 CREATE2 (dynamic)
    0, 0, 0, 0,          // 0xf6 - 0xf9
    0,                   // 0xfa STATICCALL (dynamic)
    0, 0,                // 0xfb - 0xfc
    GasCosts.ZERO,       // 0xfd REVERT
    0,                   // 0xfe INVALID
    0,                   // 0xff SELFDESTRUCT (dynamic)
};

/// Get static gas cost for opcode
pub inline fn getStaticGasCost(opcode: u8) u64 {
    return OPCODE_GAS_COSTS[opcode];
}