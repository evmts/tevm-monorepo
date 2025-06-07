/// System operations module for the EVM
/// 
/// This module defines operations for contract creation and inter-contract
/// communication. These are the most complex operations in the EVM, handling
/// contract deployment, external calls, and various calling conventions
/// (CALL, DELEGATECALL, STATICCALL, etc.).

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const system = opcodes.system;

/// CREATE operation (0xF0): Deploy New Contract
/// 
/// Creates a new contract with the provided initialization code.
/// The new contract's address is determined by the creator's address and nonce.
/// 
/// Stack: [..., value, offset, size] → [..., address]
/// Gas: 32000 + dynamic costs
/// 
/// Where:
/// - value: Wei to transfer to the new contract
/// - offset: Starting position of initialization code in memory
/// - size: Size of initialization code
/// - address: Address of newly created contract (0 on failure)
/// 
/// The initialization code is executed, and its return value becomes
/// the deployed contract's runtime code.
pub const CREATE = Operation{
    .execute = system.op_create,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

/// CREATE2 operation (0xF5): Deploy Contract with Deterministic Address
/// 
/// Creates a new contract with a deterministic address based on the
/// creator's address, a salt, and the initialization code hash.
/// 
/// Stack: [..., value, offset, size, salt] → [..., address]
/// Gas: 32000 + dynamic costs
/// 
/// Where:
/// - value: Wei to transfer to the new contract
/// - offset: Starting position of initialization code in memory
/// - size: Size of initialization code
/// - salt: 256-bit value for address calculation
/// - address: Address of newly created contract (0 on failure)
/// 
/// Address = keccak256(0xff ++ creator ++ salt ++ keccak256(init_code))[12:]
/// 
/// Introduced in Constantinople (EIP-1014).
/// Enables counterfactual contract deployment.
pub const CREATE2 = Operation{
    .execute = system.op_create2,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

/// CALL operation (0xF1): Message Call to Contract
/// 
/// Executes code at another address with a new call frame.
/// Can transfer value and provides input/output data handling.
/// 
/// Stack: [..., gas, address, value, argsOffset, argsSize, retOffset, retSize] → [..., success]
/// Gas: Complex dynamic calculation
/// 
/// Where:
/// - gas: Gas to send with the call
/// - address: Contract to call
/// - value: Wei to transfer
/// - argsOffset: Memory offset of call data
/// - argsSize: Size of call data
/// - retOffset: Memory offset to store return data
/// - retSize: Size of return data buffer
/// - success: 1 if call succeeded, 0 otherwise
/// 
/// State changes are reverted if the call fails.
pub const CALL = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

/// CALLCODE operation (0xF2): Execute External Code in Current Context
/// 
/// Executes code from another address in the current contract's context.
/// Similar to CALL but uses the current contract's storage and address.
/// 
/// Stack: [..., gas, address, value, argsOffset, argsSize, retOffset, retSize] → [..., success]
/// Gas: Complex dynamic calculation
/// 
/// Deprecated in favor of DELEGATECALL.
/// The value transfer happens to the current contract, not the code address.
/// Used in early proxy patterns before DELEGATECALL was available.
pub const CALLCODE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

/// DELEGATECALL operation (0xF4): Delegate Code Execution
/// 
/// Executes code from another address in the current contract's context,
/// preserving msg.sender and msg.value from the current call.
/// 
/// Stack: [..., gas, address, argsOffset, argsSize, retOffset, retSize] → [..., success]
/// Gas: Complex dynamic calculation
/// 
/// Where:
/// - gas: Gas to send with the call
/// - address: Contract code to execute
/// - argsOffset: Memory offset of call data
/// - argsSize: Size of call data
/// - retOffset: Memory offset to store return data
/// - retSize: Size of return data buffer
/// - success: 1 if call succeeded, 0 otherwise
/// 
/// Essential for proxy contracts and library patterns.
/// No value transfer occurs with DELEGATECALL.
pub const DELEGATECALL = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

/// STATICCALL operation (0xFA): Read-Only External Call
/// 
/// Executes code at another address with guarantee of no state modifications.
/// Reverts if the called code attempts any state changes.
/// 
/// Stack: [..., gas, address, argsOffset, argsSize, retOffset, retSize] → [..., success]
/// Gas: Complex dynamic calculation
/// 
/// Similar to CALL but:
/// - No value transfer allowed
/// - Called code cannot modify state (SSTORE, CREATE, etc.)
/// - Called code cannot make non-static calls
/// 
/// Introduced in Byzantium (EIP-214).
/// Perfect for implementing view/pure functions.
pub const STATICCALL = Operation{
    .execute = system.op_staticcall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

/// CALL operation for Frontier to Tangerine Whistle
/// 
/// Early version with lower gas cost.
/// Gas: 40 + dynamic costs
/// 
/// Used in hardforks: Frontier, Homestead
pub const CALL_FRONTIER_TO_TANGERINE = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas, // 40
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

/// CALL operation for Tangerine Whistle to Present
/// 
/// Increased base cost to prevent DoS attacks.
/// Gas: 700 + dynamic costs
/// 
/// Used in hardforks: Tangerine Whistle onwards
pub const CALL_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_call,
    .constant_gas = 700,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

/// CALLCODE operation for Frontier to Tangerine Whistle
/// 
/// Early version with lower gas cost.
/// Gas: 40 + dynamic costs
/// 
/// Used in hardforks: Frontier, Homestead
pub const CALLCODE_FRONTIER_TO_TANGERINE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas, // 40
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

/// CALLCODE operation for Tangerine Whistle to Present
/// 
/// Increased base cost to prevent DoS attacks.
/// Gas: 700 + dynamic costs
/// 
/// Used in hardforks: Tangerine Whistle onwards
pub const CALLCODE_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_callcode,
    .constant_gas = 700,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

/// DELEGATECALL operation for Tangerine Whistle to Present
/// 
/// DELEGATECALL was introduced in Tangerine Whistle (EIP-7).
/// Gas: 700 + dynamic costs
/// 
/// Used in hardforks: Tangerine Whistle onwards
pub const DELEGATECALL_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = 700,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};
