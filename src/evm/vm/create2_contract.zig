const std = @import("std");
const Address = @import("Address");
const ExecutionError = @import("../execution/execution_error.zig");
const CreateResult = @import("create_result.zig").CreateResult;
const Vm = @import("../vm.zig");

pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError || @import("../state/database_interface.zig").DatabaseError || ExecutionError.Error;

/// Create a new contract using CREATE2 opcode semantics.
///
/// Calculates a deterministic address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:],
/// transfers value if specified, executes the initialization code, and deploys
/// the resulting bytecode. Unlike CREATE, the address is predictable before deployment.
pub fn create2_contract(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}