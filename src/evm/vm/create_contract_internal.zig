const std = @import("std");
const Address = @import("Address");
const Contract = @import("../frame/contract.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const CreateResult = @import("create_result.zig").CreateResult;
const Keccak256 = std.crypto.hash.sha3.Keccak256;
const constants = @import("../constants/constants.zig");
const Log = @import("../log.zig");
const Vm = @import("../vm.zig");

pub fn create_contract_internal(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64, new_address: Address.Address) (std.mem.Allocator.Error || @import("../state/database_interface.zig").DatabaseError || ExecutionError.Error)!CreateResult {
    Log.debug("VM.create_contract_internal: Creating contract from {any} to {any}, value={}, gas={}", .{ creator, new_address, value, gas });
    if (self.state.get_code(new_address).len > 0) {
        @branchHint(.unlikely);
        // Contract already exists at this address - fail
        return CreateResult.initFailure(gas, null);
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        @branchHint(.unlikely);
        // Insufficient balance - fail
        return CreateResult.initFailure(gas, null);
    }

    if (value > 0) {
        try self.state.set_balance(creator, creator_balance - value);
        try self.state.set_balance(new_address, value);
    }

    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    var init_contract = Contract.init(
        creator, // caller (who is creating this contract)
        new_address, // address (the new contract's address)
        value, // value being sent to this contract
        gas, // gas available for init code execution
        init_code, // the init code to execute
        code_hash, // hash of the init code
        &[_]u8{}, // no input data for init code
        false, // not static
    );
    defer init_contract.deinit(self.allocator, null);

    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        if (err == ExecutionError.Error.REVERT) {
            // On revert, consume partial gas
            return CreateResult.initFailure(init_contract.gas, null);
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult.initFailure(0, null);
    };

    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult.initFailure(0, null);
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult.initFailure(0, null);
    }

    try self.state.set_code(new_address, deployment_code);

    const gas_left = init_result.gas_left - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = deployment_code,
    };
}