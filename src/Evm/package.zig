// Package entry point for Evm
// This file should now re-export from the Evm module
const EvmModule = @import("Evm");

pub const Evm = EvmModule.Evm;
pub const Frame = EvmModule.Frame;
pub const ExecutionError = EvmModule.InterpreterError; // Assuming InterpreterError is the one needed
pub const Interpreter = EvmModule.Interpreter;
pub const Contract = EvmModule.Contract;
pub const Memory = EvmModule.Memory;
pub const Stack = EvmModule.Stack;
// pub const ExecutionStatus = EvmModule.ExecutionStatus; // Commented out - source unclear from EvmModule
// pub const Log = EvmModule.Log; // Commented out - source unclear from EvmModule
pub const JumpTable = EvmModule.JumpTable;
pub const EvmLogger = EvmModule.EvmLogger;
pub const Withdrawal = EvmModule.Withdrawal; // Assuming Evm exports this
pub const WithdrawalProcessor = EvmModule.WithdrawalProcessor; // Assuming Evm exports this
pub const opcodes = EvmModule.opcodes; // Assuming Evm exports this
