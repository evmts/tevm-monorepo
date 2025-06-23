const Address = @import("Address");
const CreateResult = @import("create_result.zig").CreateResult;
const Vm = @import("../vm.zig");
const ValidateStaticContextError = @import("validate_static_context.zig").ValidateStaticContextError;
const Create2ContractError = @import("create2_contract.zig").Create2ContractError;

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;

/// Create a contract with CREATE2 and static context protection.
/// Prevents contract creation during static calls.
pub fn create2_contract_protected(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}