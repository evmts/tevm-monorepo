//! Gas module for ZigEVM
//! This module exports all gas-related functionality

// Re-export everything from the constants module
pub const constants = @import("constants.zig");
pub const GasCosts = constants.GasCosts;
pub const getBasicGas = constants.getBasicGas;
pub const memoryGas = constants.memoryGas;
pub const memoryCopyGas = constants.memoryCopyGas;
pub const storageGas = constants.storageGas;
pub const logGas = constants.logGas;
pub const sha3Gas = constants.sha3Gas;
pub const balanceGas = constants.balanceGas;
pub const expGas = constants.expGas;
pub const extcodehashGas = constants.extcodehashGas;

// Re-export the calculator
pub const calculator = @import("calculator.zig");
pub const GasCalculator = calculator.GasCalculator;

// Re-export dynamic calculations
pub const dynamic = @import("dynamic.zig");
pub const memoryExpansionGas = dynamic.memoryExpansionGas;
pub const copyGas = dynamic.copyGas;
pub const callGas = dynamic.callGas;
pub const sstoreGas = dynamic.sstoreGas;
pub const accessListGas = dynamic.accessListGas;

// Additional re-exports and helpers can be added here