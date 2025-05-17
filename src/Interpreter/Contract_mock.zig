const std = @import("std");
const bitvec = @import("bitvec.zig");
const opcodes = @import("opcodes.zig");

// Opcode constants for testing
pub const STOP_OPCODE: u8 = 0x00;
pub const JUMPDEST_OPCODE: u8 = 0x5B;

/// Mock Address for testing
pub const Address = struct {
    value: u8 = 0,
    
    pub fn equals(self: Address, other: Address) bool {
        return self.value == other.value;
    }
};

/// Mock U256 for testing
pub const U256 = struct {
    value: u64 = 0,
    
    pub fn fromU64(value: u64) U256 {
        return U256{ .value = value };
    }
    
    pub fn toU64(self: U256) u64 {
        return self.value;
    }
    
    pub fn isAboveOrEqual(self: U256, other: U256) bool {
        return self.value >= other.value;
    }
    
    pub fn from(value: usize) U256 {
        return U256{ .value = @intCast(value) };
    }
};

/// Contract represents an ethereum contract in the state database
pub const Contract = struct {
    /// The address of the account that initialized this contract
    /// When the "call method" is delegated, this needs to be set to the caller's caller
    caller: Address,
    
    /// The address of the contract
    address: Address,
    
    /// Cached JUMPDEST analysis results for all analyzed contracts
    jumpdests: ?std.StringHashMap(bitvec.BitVec),
    
    /// Locally cached result of JUMPDEST analysis for this specific contract
    analysis: ?bitvec.BitVec,
    
    /// The contract bytecode
    code: []const u8,
    
    /// Hash of the contract code
    code_hash: [32]u8,
    
    /// The input data provided to the contract call
    input: []const u8,
    
    /// Whether this execution frame is a contract deployment
    is_deployment: bool = false,
    
    /// Whether this is a system call
    is_system_call: bool = false,
    
    /// Remaining gas available for execution
    gas: u64,
    
    /// Value sent with the call
    value: U256,
    
    /// Create a new Contract
    pub fn init(
        caller: Address, 
        address: Address, 
        value: U256, 
        gas: u64, 
        jumpdests: ?std.StringHashMap(bitvec.BitVec)
    ) Contract {
        return Contract{
            .caller = caller,
            .address = address,
            .jumpdests = jumpdests,
            .analysis = null,
            .code = &.{},
            .code_hash = [_]u8{0} ** 32,
            .input = &.{},
            .gas = gas,
            .value = value,
        };
    }
    
    /// Verify if a jump destination is valid
    pub fn validJumpdest(self: *Contract, dest: U256) bool {
        // Check for overflow and if destination is within code bounds
        if (dest.isAboveOrEqual(U256.from(self.code.len))) {
            return false;
        }
        
        const udest = dest.toU64();
        
        // Only JUMPDEST opcode is a valid destination
        if (self.code[udest] != JUMPDEST_OPCODE) {
            return false;
        }
        
        // Check if the destination is actual code, not data of a PUSH operation
        return self.isCode(udest);
    }
    
    /// Check if the position is actual code and not data
    pub fn isCode(self: *Contract, udest: u64) bool {
        // Check if we already have the analysis cached
        if (self.analysis) |analysis| {
            return analysis.codeSegment(udest);
        }
        
        // For contracts with a code hash (not temporary init code)
        if (!std.mem.allEqual(u8, &self.code_hash, 0)) {
            if (self.jumpdests) |*jumpdests| {
                // Convert code_hash to string for hashmap key
                var hash_str: [64]u8 = undefined;
                _ = std.fmt.bufPrint(&hash_str, "{s}", .{std.fmt.fmtSliceHexLower(&self.code_hash)}) catch "0";
                
                // Try to get cached analysis from jumpdests map
                if (jumpdests.get(&hash_str)) |analysis| {
                    // Cache it locally for faster access in future calls
                    self.analysis = analysis;
                    return analysis.codeSegment(udest);
                } else {
                    // Analyze the code and save the result
                    var analysis = bitvec.codeBitmap(self.code);
                    // Store in the jumpdests map
                    jumpdests.put(&hash_str, analysis) catch {};
                    // Also cache it locally
                    self.analysis = analysis;
                    return analysis.codeSegment(udest);
                }
            }
        }
        
        // For initialization code without a code hash in state trie
        // Analyze locally without storing in the global jumpdests map
        if (self.analysis == null) {
            self.analysis = bitvec.codeBitmap(self.code);
        }
        
        return self.analysis.?.codeSegment(udest);
    }
    
    /// Get the opcode at the specified program counter
    pub fn getOp(self: *const Contract, n: u64) u8 {
        if (n < self.code.len) {
            return self.code[n];
        }
        return STOP_OPCODE; // Return STOP if beyond code length
    }
    
    /// Get the caller address
    pub fn getCaller(self: *const Contract) Address {
        return self.caller;
    }
    
    /// Attempt to use gas and subtract it from the remaining gas
    /// Returns true if there was enough gas, false otherwise
    pub fn useGas(self: *Contract, gas_amount: u64) bool {
        if (self.gas < gas_amount) {
            return false;
        }
        self.gas -= gas_amount;
        return true;
    }
    
    /// Refund gas to the contract
    pub fn refundGas(self: *Contract, gas_amount: u64) void {
        if (gas_amount == 0) {
            return;
        }
        self.gas += gas_amount;
    }
    
    /// Get the contract's address
    pub fn getAddress(self: *const Contract) Address {
        return self.address;
    }
    
    /// Get the value sent with the call
    pub fn getValue(self: *const Contract) U256 {
        return self.value;
    }
    
    /// Set the contract's code and hash
    pub fn setCallCode(self: *Contract, hash: [32]u8, code: []const u8) void {
        self.code = code;
        self.code_hash = hash;
    }
};

/// Create a new contract instance with default jumpdests map
pub fn createContract(
    caller: Address, 
    address: Address, 
    value: U256, 
    gas: u64
) Contract {
    // Initialize a new jumpdests map
    const jumpdests = std.StringHashMap(bitvec.BitVec).init(std.heap.page_allocator);
    return Contract.init(caller, address, value, gas, jumpdests);
}

/// Create a new contract with the same jumpdests map as a parent contract
pub fn createContractWithParent(
    caller: Address, 
    address: Address, 
    value: U256, 
    gas: u64, 
    parent: *const Contract
) Contract {
    return Contract.init(caller, address, value, gas, parent.jumpdests);
}