//! EVM (Ethereum Virtual Machine) module - Core execution engine
//!
//! This is the main entry point for the EVM implementation. It exports all
//! the components needed to execute Ethereum bytecode, manage state, and
//! handle the complete lifecycle of smart contract execution.
//!
//! ## Architecture Overview
//!
//! The EVM is structured into several key components:
//!
//! ### Core Execution
//! - **VM**: The main virtual machine that orchestrates execution
//! - **Frame**: Execution contexts for calls and creates
//! - **Stack**: 256-bit word stack (max 1024 elements)
//! - **Memory**: Byte-addressable memory (expands as needed)
//! - **Contract**: Code and storage management
//!
//! ### Opcodes
//! - **Opcode**: Enumeration of all EVM instructions
//! - **Operation**: Metadata about each opcode (gas, stack effects)
//! - **JumpTable**: Maps opcodes to their implementations
//! - **opcodes/**: Individual opcode implementations
//!
//! ### Error Handling
//! - **ExecutionError**: Unified error type for all execution failures
//! - Strongly typed errors for each component
//! - Error mapping utilities for consistent handling
//!
//! ### Utilities
//! - **CodeAnalysis**: Bytecode analysis and jump destination detection
//! - **Hardfork**: Fork-specific behavior configuration
//! - **gas_constants**: Gas cost calculations
//! - **chain_rules**: Chain-specific validation rules
//!
//! ## Usage Example
//!
//! ```zig
//! const evm = @import("evm");
//!
//! // Create a VM instance
//! var vm = try evm.Vm.init(allocator, config);
//! defer vm.deinit();
//!
//! // Execute bytecode
//! const result = try vm.run(bytecode, context);
//! ```
//!
//! ## Design Principles
//!
//! 1. **Correctness**: Strict adherence to Ethereum Yellow Paper
//! 2. **Performance**: Efficient execution with minimal allocations
//! 3. **Safety**: Strong typing and comprehensive error handling
//! 4. **Modularity**: Clear separation of concerns
//! 5. **Testability**: Extensive test coverage for all components

const std = @import("std");

// Import external modules
/// Address utilities for Ethereum addresses
pub const Address = @import("Address");

// Import all EVM modules

/// Bytecode analysis for jump destination detection
pub const CodeAnalysis = @import("contract/code_analysis.zig");

/// Contract code and storage management
pub const Contract = @import("contract/contract.zig");

/// Unified error types for EVM execution
pub const ExecutionError = @import("execution_error.zig");

/// Execution frame/context management
pub const Frame = @import("frame.zig");

/// Ethereum hardfork configuration
pub const Hardfork = @import("hardfork.zig");

/// Opcode to implementation mapping
pub const JumpTable = @import("jump_table.zig");

/// Byte-addressable memory implementation
pub const Memory = @import("memory.zig");

/// EVM instruction enumeration
pub const Opcode = @import("opcode.zig");

/// Opcode metadata (gas costs, stack effects)
pub const Operation = @import("operation.zig");

/// 256-bit word stack implementation
pub const Stack = @import("stack.zig");

/// Stack depth validation utilities
pub const stack_validation = @import("stack_validation.zig");

/// Storage slot pooling for gas optimization
pub const StoragePool = @import("contract/storage_pool.zig");

/// Main virtual machine implementation
pub const Vm = @import("vm.zig");

// Import opcodes
/// All opcode implementations (arithmetic, stack, memory, etc.)
pub const opcodes = @import("opcodes/package.zig");

// Import utility modules

/// Bit vector utilities for jump destination tracking
pub const bitvec = @import("contract/bitvec.zig");

/// Chain-specific validation rules
pub const chain_rules = @import("chain_rules.zig");

/// EVM constants (stack size, memory limits, etc.)
pub const constants = @import("constants/constants.zig");

/// EIP-7702 EOA delegation bytecode format
pub const eip_7702_bytecode = @import("contract/eip_7702_bytecode.zig");

/// Fee market calculations (EIP-1559)
pub const fee_market = @import("fee_market.zig");

/// Gas cost constants and calculations
pub const gas_constants = @import("constants/gas_constants.zig");

/// Memory size limits and expansion rules
pub const memory_limits = @import("constants/memory_limits.zig");

// Export all error types for strongly typed error handling
///
/// These error types provide fine-grained error handling throughout
/// the EVM. Each error type corresponds to a specific failure mode,
/// allowing precise error handling and recovery strategies.

// VM error types
/// Errors from VM contract creation operations
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

// VM result types
/// Result of running EVM bytecode
pub const RunResult = Vm.RunResult;
/// Result of CREATE/CREATE2 operations
pub const CreateResult = Vm.CreateResult;
/// Result of CALL/DELEGATECALL/STATICCALL operations
pub const CallResult = Vm.CallResult;

// Memory error types
/// Errors from memory operations (expansion, access)
pub const MemoryError = Memory.MemoryError;

// Stack error types
/// Errors from stack operations (overflow, underflow)
pub const StackError = Stack.Error;

// Contract error types
/// General contract operation errors
pub const ContractError = Contract.ContractError;
/// Storage access errors
pub const StorageOperationError = Contract.StorageOperationError;
/// Bytecode analysis errors
pub const CodeAnalysisError = Contract.CodeAnalysisError;
/// Storage warming errors (EIP-2929)
pub const MarkStorageSlotWarmError = Contract.MarkStorageSlotWarmError;

// Access List error types (imported via import statement to avoid circular deps)
/// Access list module for EIP-2929/2930 support
const AccessListModule = @import("access_list/access_list.zig");
/// Error accessing addresses in access list
pub const AccessAddressError = AccessListModule.AccessAddressError;
/// Error accessing storage slots in access list
pub const AccessStorageSlotError = AccessListModule.AccessStorageSlotError;
/// Error pre-warming addresses
pub const PreWarmAddressesAccessListError = AccessListModule.PreWarmAddressesError;
/// Error pre-warming storage slots
pub const PreWarmStorageSlotsAccessListError = AccessListModule.PreWarmStorageSlotsError;
/// Error initializing transaction access list
pub const InitTransactionError = AccessListModule.InitTransactionError;
/// Error calculating call costs with access list
pub const GetCallCostAccessListError = AccessListModule.GetCallCostError;

// Address error types
/// Error calculating CREATE address
pub const CalculateAddressError = Address.CalculateAddressError;
/// Error calculating CREATE2 address
pub const CalculateCreate2AddressError = Address.CalculateCreate2AddressError;

// Execution error
/// Main execution error enumeration used throughout EVM
pub const ExecutionErrorEnum = ExecutionError.Error;

// Tests - run all module tests
test {
    std.testing.refAllDeclsRecursive(@This());
}
