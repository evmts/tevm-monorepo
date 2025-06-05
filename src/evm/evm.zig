const std = @import("std");

// Import external modules
pub const Address = @import("Address");

// Import all EVM modules
pub const CodeAnalysis = @import("code_analysis.zig");
pub const Contract = @import("contract.zig");
pub const ExecutionError = @import("execution_error.zig");
pub const Frame = @import("frame.zig");
pub const Hardfork = @import("hardfork.zig");
pub const JumpTable = @import("jump_table.zig");
pub const Memory = @import("memory.zig");
pub const Opcode = @import("opcode.zig");
pub const Operation = @import("operation.zig");
pub const Stack = @import("stack.zig");
pub const stack_validation = @import("stack_validation.zig");
pub const StoragePool = @import("storage_pool.zig");
pub const Vm = @import("vm.zig");

// Import opcodes
pub const opcodes = @import("opcodes/package.zig");

// Import utility modules
pub const bitvec = @import("bitvec.zig");
pub const chain_rules = @import("chain_rules.zig");
pub const constants = @import("constants.zig");
pub const eip_7702_bytecode = @import("eip_7702_bytecode.zig");
pub const fee_market = @import("fee_market.zig");
pub const gas_constants = @import("gas_constants.zig");
pub const memory_limits = @import("memory_limits.zig");

// Export all error types for strongly typed error handling

// VM error types
pub const VmError = Vm.VmError;
pub const VmStorageError = Vm.VmStorageError;
pub const VmStateError = Vm.VmStateError;
pub const VmInitError = Vm.VmInitError;
pub const VmInterpretError = Vm.VmInterpretError;
pub const VmAccessListError = Vm.VmAccessListError;
pub const VmAddressCalculationError = Vm.VmAddressCalculationError;
pub const CreateContractError = Vm.CreateContractError;
pub const CallContractError = Vm.CallContractError;
pub const ConsumeGasError = Vm.ConsumeGasError;
pub const Create2ContractError = Vm.Create2ContractError;
pub const CallcodeContractError = Vm.CallcodeContractError;
pub const DelegatecallContractError = Vm.DelegatecallContractError;
pub const StaticcallContractError = Vm.StaticcallContractError;
pub const EmitLogError = Vm.EmitLogError;
pub const InitTransactionAccessListError = Vm.InitTransactionAccessListError;
pub const PreWarmAddressesError = Vm.PreWarmAddressesError;
pub const PreWarmStorageSlotsError = Vm.PreWarmStorageSlotsError;
pub const GetAddressAccessCostError = Vm.GetAddressAccessCostError;
pub const GetStorageAccessCostError = Vm.GetStorageAccessCostError;
pub const GetCallCostError = Vm.GetCallCostError;
pub const ValidateStaticContextError = Vm.ValidateStaticContextError;
pub const SetStorageProtectedError = Vm.SetStorageProtectedError;
pub const SetTransientStorageProtectedError = Vm.SetTransientStorageProtectedError;
pub const SetBalanceProtectedError = Vm.SetBalanceProtectedError;
pub const SetCodeProtectedError = Vm.SetCodeProtectedError;
pub const EmitLogProtectedError = Vm.EmitLogProtectedError;
pub const CreateContractProtectedError = Vm.CreateContractProtectedError;
pub const Create2ContractProtectedError = Vm.Create2ContractProtectedError;
pub const ValidateValueTransferError = Vm.ValidateValueTransferError;
pub const SelfdestructProtectedError = Vm.SelfdestructProtectedError;
pub const RunError = Vm.RunError;

// Frame error types
pub const FrameError = Frame.FrameError;

// Memory error types
pub const MemoryError = Memory.MemoryError;

// Stack error types
pub const StackError = Stack.Error;

// Contract error types
pub const ContractError = Contract.ContractError;
pub const StorageOperationError = Contract.StorageOperationError;
pub const CodeAnalysisError = Contract.CodeAnalysisError;
pub const MarkStorageSlotWarmError = Contract.MarkStorageSlotWarmError;

// Access List error types
pub const AccessList = @import("access_list.zig");
pub const AccessAddressError = AccessList.AccessAddressError;
pub const AccessStorageSlotError = AccessList.AccessStorageSlotError;
pub const PreWarmAddressesAccessListError = AccessList.PreWarmAddressesError;
pub const PreWarmStorageSlotsAccessListError = AccessList.PreWarmStorageSlotsError;
pub const InitTransactionError = AccessList.InitTransactionError;
pub const GetCallCostAccessListError = AccessList.GetCallCostError;

// Address error types
pub const CalculateAddressError = Address.CalculateAddressError;
pub const CalculateCreate2AddressError = Address.CalculateCreate2AddressError;

// Execution error
pub const ExecutionErrorEnum = ExecutionError.Error;

// Tests - run all module tests
test {
    std.testing.refAllDeclsRecursive(@This());
}
