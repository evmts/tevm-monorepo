const std = @import("std");
const Precompiled = @import("Precompiled.zig").PrecompiledContract;
const B256 = @import("../../Types/B256.ts");
const ExecutionError = @import("../Frame.zig").ExecutionError;

/// PrecompiledContract represents a precompiled contract in the EVM
pub const Contract = struct {
    /// Address of the precompiled contract (1-9)
    address: B256,
    
    /// The actual precompiled contract type
    contract_type: Precompiled,
    
    /// The allocator to use for memory allocation
    allocator: std.mem.Allocator,
    
    /// Initialize a new precompiled contract
    pub fn init(address: B256, allocator: std.mem.Allocator) ?Contract {
        const contract_type = Precompiled.fromAddress(address) orelse return null;
        
        return Contract{
            .address = address,
            .contract_type = contract_type,
            .allocator = allocator,
        };
    }
    
    /// Run the precompiled contract
    /// @param input Input data for the contract
    /// @return Output data from the contract
    pub fn run(self: *const Contract, input: []const u8) ExecutionError![]const u8 {
        return self.contract_type.execute(input, self.allocator);
    }
    
    /// Get the gas cost for running the precompiled contract
    /// @param input Input data for the contract
    /// @return Gas cost
    pub fn gasCost(self: *const Contract, input: []const u8) u64 {
        return self.contract_type.gasCost(input);
    }
    
    /// Check if an address is a precompiled contract
    pub fn isPrecompiled(address: B256) bool {
        return Precompiled.isPrecompiled(address);
    }
    
    /// Create a precompiled contract from an address
    pub fn fromAddress(address: B256, allocator: std.mem.Allocator) ?Contract {
        return init(address, allocator);
    }
};