const std = @import("std");
const bitvec = @import("bitvec.zig");
const opcodes = @import("opcodes.zig");
const address = @import("Address");
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;

// Create a file-specific logger
const logger = createLogger(@src().file);

/// Contract represents an ethereum contract in the state database
/// It contains the contract's code, address, and execution context
/// including gas management, caller information, and execution state
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
    /// Gas refund counter for certain operations
    gas_refund: u64 = 0,
    /// Cache of access status for storage slots (warm vs cold)
    /// Maps storage slot keys to their access status (true = accessed/warm)
    storage_access: ?std.AutoHashMap(u256, bool) = null,
    /// Whether the contract account is cold (for EIP-2929 gas calculations)
    is_cold: bool = true,

    /// Initialize a new Contract instance
    /// 
    /// Parameters:
    /// - caller: The address that initiated the contract call
    /// - contract_address: The address of the contract being executed
    /// - value: The amount of ether sent with the call (in wei)
    /// - gas: The gas limit for this contract execution
    /// - jumpdests: Optional cache of previously analyzed JUMPDEST locations for contracts
    ///
    /// Returns: A new Contract instance with empty code
    pub fn init(caller: address.Address, contract_address: address.Address, value: u256, gas: u64, jumpdests: ?std.StringHashMap(bitvec.BitVec)) Contract {
        logger.debug("Initializing contract at address {any}", .{contract_address});
        logger.debug("  - Caller: {any}", .{caller});
        logger.debug("  - Value: {d}", .{value});
        logger.debug("  - Gas: {d}", .{gas});
        
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

    /// Validates if a jump destination is valid in the contract code
    ///
    /// A jump destination is valid if:
    /// 1. It's within the bounds of the code
    /// 2. The opcode at that location is JUMPDEST
    /// 3. It's part of actual code (not part of PUSH data)
    ///
    /// Parameters:
    /// - dest: The jump destination as a 256-bit value
    ///
    /// Returns: true if destination is valid, false otherwise
    pub fn validJumpdest(self: *Contract, dest: u256) bool {
        logger.debug("Checking jump destination: {d}", .{dest});
        
        if (dest.isAboveOrEqual(self.code.len)) {
            logger.debug("Jump destination out of code bounds: {d} >= {d}", .{dest, self.code.len});
            return false;
        }
        
        const udest = dest.toU64();
        if (self.code[udest] != opcodes.JUMPDEST_OPCODE) {
            logger.debug("Destination is not a JUMPDEST opcode: {x} != {x}", .{self.code[udest], opcodes.JUMPDEST_OPCODE});
            return false;
        }
        
        const result = self.isCode(udest);
        logger.debug("Jump destination validity: {}", .{result});
        return result;
    }

    /// Determines if a position is part of actual code (not PUSH data)
    ///
    /// This method uses or creates a bitmap of code segments that tracks
    /// which bytes in the contract are executable code vs. PUSH data
    ///
    /// Parameters:
    /// - udest: Position in the contract code to check
    ///
    /// Returns: true if position is part of executable code, false if it's data
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

    /// Gets the opcode at a specific position in the contract code
    ///
    /// Parameters:
    /// - n: Position in the contract code
    ///
    /// Returns: The opcode byte at the given position or STOP if out of bounds
    pub fn getOp(self: *const Contract, n: u64) u8 {
        if (n < self.code.len) {
            return self.code[n];
        }
        return opcodes.STOP_OPCODE;
    }

    /// Gets the address that initiated the contract call
    ///
    /// Returns: Address of the caller
    pub fn getCaller(self: *const Contract) address.Address {
        return self.caller;
    }

    /// Deducts gas from the contract's gas limit
    ///
    /// Parameters:
    /// - gas_amount: Amount of gas to use
    ///
    /// Returns: true if enough gas was available, false if insufficient gas
    pub fn useGas(self: *Contract, gas_amount: u64) bool {
        if (self.gas < gas_amount) {
            logger.warn("Insufficient gas: requested {d}, available {d}", .{gas_amount, self.gas});
            return false;
        }
        logger.debug("Using {d} gas, remaining: {d}", .{gas_amount, self.gas - gas_amount});
        self.gas -= gas_amount;
        return true;
    }

    /// Adds gas back to the contract's gas limit
    ///
    /// This is used when operations are reverted or when gas estimation is performed
    ///
    /// Parameters:
    /// - gas_amount: Amount of gas to refund to the contract's available gas
    pub fn refundGas(self: *Contract, gas_amount: u64) void {
        if (gas_amount == 0) {
            return;
        }
        logger.debug("Refunding {d} gas, new total: {d}", .{gas_amount, self.gas + gas_amount});
        self.gas += gas_amount;
    }
    
    /// Add gas to the EIP-3529 refund counter
    ///
    /// Used for operations that release storage (SSTORE clearing, SELFDESTRUCT)
    ///
    /// Parameters:
    /// - gas_amount: Amount of gas to add to the refund counter
    pub fn addGasRefund(self: *Contract, gas_amount: u64) void {
        logger.debug("Adding {d} to gas refund, new refund: {d}", .{gas_amount, self.gas_refund + gas_amount});
        self.gas_refund += gas_amount;
    }
    
    /// Subtract gas from the EIP-3529 refund counter
    ///
    /// Parameters:
    /// - gas_amount: Amount of gas to subtract from the refund counter
    /// Note: If the amount is greater than available refund, counter is clamped to 0
    pub fn subGasRefund(self: *Contract, gas_amount: u64) void {
        if (gas_amount > self.gas_refund) {
            logger.debug("Subtracting {d} from gas refund (clamping to 0)", .{gas_amount});
            self.gas_refund = 0;
        } else {
            logger.debug("Subtracting {d} from gas refund, new refund: {d}", .{gas_amount, self.gas_refund - gas_amount});
            self.gas_refund -= gas_amount;
        }
    }
    
    /// Get current gas refund counter value
    ///
    /// Returns: Current gas refund amount
    pub fn getGasRefund(self: *const Contract) u64 {
        return self.gas_refund;
    }

    /// Gets the address of the contract
    ///
    /// Returns: Address of the contract
    pub fn getAddress(self: *const Contract) address.Address {
        return self.address;
    }

    /// Gets the value (ETH) sent with the call
    ///
    /// Returns: Value in wei as a 256-bit integer
    pub fn getValue(self: *const Contract) u256 {
        return self.value;
    }

    /// Sets the contract's code and code hash
    ///
    /// Used when loading contract code during call setup
    ///
    /// Parameters:
    /// - hash: The 32-byte keccak256 hash of the code
    /// - code: The bytecode for the contract
    pub fn setCallCode(self: *Contract, hash: [32]u8, code: []const u8) void {
        logger.debug("Setting contract code, length: {d} bytes", .{code.len});
        logger.debug("  - Code hash: {any}", .{hash});
        self.code = code;
        self.code_hash = hash;
    }
    
    /// Initialize the storage access tracking map if not already initialized
    ///
    /// This is an internal helper function for EIP-2929 access list tracking
    fn ensureStorageAccess(self: *Contract) void {
        if (self.storage_access == null) {
            logger.debug("Initializing storage access tracking map", .{});
            self.storage_access = std.AutoHashMap(u256, bool).init(std.heap.page_allocator);
        }
    }
    
    /// Mark a storage slot as accessed (warm) for EIP-2929 gas calculations
    ///
    /// Parameters:
    /// - slot: The storage slot key to mark as accessed
    ///
    /// Returns: true if the slot was previously cold, false if already warm
    pub fn markStorageSlotWarm(self: *Contract, slot: u256) bool {
        self.ensureStorageAccess();
        const was_cold = self.isStorageSlotCold(slot);
        if (was_cold) {
            logger.debug("Marking storage slot {any} as warm (was cold)", .{slot});
            self.storage_access.?.put(slot, true) catch {
                logger.err("Failed to mark storage slot as warm", .{});
            };
        }
        return was_cold;
    }

    /// Check if a storage slot is cold (not accessed before) for EIP-2929
    ///
    /// Parameters:
    /// - slot: The storage slot key to check
    ///
    /// Returns: true if the slot is cold (not previously accessed), false if warm
    pub fn isStorageSlotCold(self: *const Contract, slot: u256) bool {
        if (self.storage_access == null) {
            return true;
        }
        if (self.storage_access.?.get(slot)) |is_warm| {
            return !is_warm;
        }
        // If not found in the map, it's cold
        return true;
    }

    /// Mark the contract account as warm for EIP-2929 gas calculations
    ///
    /// Returns: true if the account was previously cold, false if already warm
    pub fn markAccountWarm(self: *Contract) bool {
        const was_cold = self.is_cold;
        if (was_cold) {
            logger.debug("Marking contract account {any} as warm (was cold)", .{self.address});
            self.is_cold = false;
        }
        return was_cold;
    }

    /// Check if the contract account is cold for EIP-2929 gas calculations
    ///
    /// Returns: true if the account is cold (not previously accessed), false if warm
    pub fn isAccountCold(self: *const Contract) bool {
        return self.is_cold;
    }
    
    /// Clean up resources used by the contract
    ///
    /// This should be called when the contract is no longer needed
    /// to free memory used by analysis and storage access tracking
    pub fn deinit(self: *Contract) void {
        logger.debug("Deinitializing contract resources", .{});
        if (self.storage_access != null) {
            self.storage_access.?.deinit();
            self.storage_access = null;
        }
        
        if (self.analysis) |analysis| {
            // We don't own this memory if it came from the jumpdests cache
            // So only deinit if we created it ourselves (jumpdests is null)
            if (self.jumpdests == null) {
                analysis.deinit(std.heap.page_allocator);
            }
        }
    }
};

/// Create a new contract with a new JUMPDEST analysis cache
///
/// Parameters:
/// - caller: The address that initiated the contract call
/// - contract_address: The address of the contract being executed
/// - value: The amount of ether sent with the call (in wei)
/// - gas: The gas limit for this contract execution
///
/// Returns: A new Contract instance
pub fn createContract(caller: address.Address, contract_address: address.Address, value: u256, gas: u64) Contract {
    logger.debug("Creating new contract", .{});
    const jumpdests = std.StringHashMap(bitvec.BitVec).init(std.heap.page_allocator);
    return Contract.init(caller, contract_address, value, gas, jumpdests);
}

/// Create a new contract sharing the parent contract's JUMPDEST analysis cache
///
/// This is used for contract-to-contract calls where the JUMPDEST cache
/// can be reused to save computation
///
/// Parameters:
/// - caller: The address that initiated the contract call
/// - contract_address: The address of the contract being executed
/// - value: The amount of ether sent with the call (in wei)
/// - gas: The gas limit for this contract execution
/// - parent: The parent contract that called this contract
///
/// Returns: A new Contract instance with shared JUMPDEST cache
pub fn createContractWithParent(caller: address.Address, contract_address: address.Address, value: u256, gas: u64, parent: *const Contract) Contract {
    logger.debug("Creating contract with parent jumpdests table", .{});
    return Contract.init(caller, contract_address, value, gas, parent.jumpdests);
}
