/// Environment information operations module for the EVM
/// 
/// This module defines operations that provide access to the execution environment,
/// including addresses, balances, call data, code, and other contextual information.
/// These operations allow contracts to introspect their execution context and
/// interact with other accounts on the blockchain.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const environment = opcodes.environment;

/// ADDRESS operation (0x30): Get Current Contract Address
/// 
/// Pushes the address of the currently executing contract onto the stack.
/// This is the address that holds the code being executed.
/// 
/// Stack: [...] → [..., address]
/// Gas: 2 (GasQuickStep)
/// 
/// Commonly used for:
/// - Self-referential logic
/// - Checking if contract is being called directly
/// - Computing CREATE2 addresses
pub const ADDRESS = Operation{
    .execute = environment.op_address,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// BALANCE operation (0x31): Get Account Balance
/// 
/// Retrieves the balance (in wei) of the specified address and pushes it onto the stack.
/// The address is taken from the stack.
/// 
/// Stack: [..., address] → [..., balance]
/// Gas: Variable (depends on hardfork and whether address is warm/cold)
/// 
/// Gas costs changed significantly across hardforks:
/// - Frontier-Tangerine: 20
/// - Tangerine-Istanbul: 400
/// - Istanbul-Berlin: 700
/// - Berlin+: 100 (warm) or 2600 (cold)
pub const BALANCE = Operation{
    .execute = environment.op_balance,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// ORIGIN operation (0x32): Get Transaction Origin
/// 
/// Pushes the address of the original transaction sender (EOA) onto the stack.
/// This remains constant throughout all nested calls.
/// 
/// Stack: [...] → [..., origin]
/// Gas: 2 (GasQuickStep)
/// 
/// Warning: Using tx.origin for authorization is a security anti-pattern
/// as it's vulnerable to phishing attacks. Use msg.sender instead.
pub const ORIGIN = Operation{
    .execute = environment.op_origin,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// CALLER operation (0x33): Get Message Sender
/// 
/// Pushes the address of the immediate caller onto the stack.
/// This is the account that directly called or created the current contract.
/// 
/// Stack: [...] → [..., caller]
/// Gas: 2 (GasQuickStep)
/// 
/// Essential for:
/// - Access control and authorization
/// - Tracking who initiated the current call
/// - Implementing ownership patterns
pub const CALLER = Operation{
    .execute = environment.op_caller,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// CALLVALUE operation (0x34): Get Call Value
/// 
/// Pushes the amount of Wei sent with the current call onto the stack.
/// For contract creation, this is the initial endowment.
/// 
/// Stack: [...] → [..., value]
/// Gas: 2 (GasQuickStep)
/// 
/// Used for:
/// - Implementing payable functions
/// - Checking payment amounts
/// - Rejecting calls with unexpected value
pub const CALLVALUE = Operation{
    .execute = environment.op_callvalue,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// CALLDATALOAD operation (0x35): Load Call Data Word
/// 
/// Loads 32 bytes from call data at the specified offset and pushes onto the stack.
/// If reading beyond call data bounds, pads with zeros.
/// 
/// Stack: [..., offset] → [..., data]
/// Gas: 3 (GasFastestStep)
/// 
/// Used for:
/// - Reading function selectors (first 4 bytes)
/// - Loading function arguments
/// - Implementing low-level call data parsing
pub const CALLDATALOAD = Operation{
    .execute = environment.op_calldataload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// CALLDATASIZE operation (0x36): Get Call Data Size
/// 
/// Pushes the size of call data in bytes onto the stack.
/// For contract creation, this is the size of initialization code.
/// 
/// Stack: [...] → [..., size]
/// Gas: 2 (GasQuickStep)
/// 
/// Used for:
/// - Validating call data length
/// - Implementing variadic functions
/// - Bounds checking before CALLDATACOPY
pub const CALLDATASIZE = Operation{
    .execute = environment.op_calldatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// CODESIZE operation (0x38): Get Code Size
/// 
/// Pushes the size of the current contract's code in bytes onto the stack.
/// During contract creation, this returns the size of the initialization code.
/// 
/// Stack: [...] → [..., size]
/// Gas: 2 (GasQuickStep)
/// 
/// Used for:
/// - Code introspection
/// - Bounds checking for CODECOPY
/// - Detecting contract deployment phase
pub const CODESIZE = Operation{
    .execute = environment.op_codesize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// CODECOPY operation (0x39): Copy Code to Memory
/// 
/// Copies code from the current contract to memory.
/// During creation, copies initialization code; otherwise, runtime code.
/// 
/// Stack: [..., destOffset, offset, size] → [...]
/// Gas: 3 + 3 × (size + 31) ÷ 32
/// 
/// Where:
/// - destOffset: Destination in memory
/// - offset: Source offset in code
/// - size: Number of bytes to copy
/// 
/// Used for code introspection and metamorphic contracts.
pub const CODECOPY = Operation{
    .execute = environment.op_codecopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

/// GASPRICE operation (0x3A): Get Gas Price
/// 
/// Pushes the gas price of the current transaction onto the stack.
/// This is the price per unit of gas in Wei.
/// 
/// Stack: [...] → [..., gas_price]
/// Gas: 2 (GasQuickStep)
/// 
/// Used for:
/// - Calculating transaction costs
/// - Implementing gas price oracles
/// - Economic decision making in contracts
pub const GASPRICE = Operation{
    .execute = environment.op_gasprice,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// EXTCODESIZE operation (0x3B): Get External Code Size
/// 
/// Returns the size of the code at the specified address.
/// Returns 0 for non-contract addresses (EOAs).
/// 
/// Stack: [..., address] → [..., size]
/// Gas: Variable (depends on hardfork and address warm/cold status)
/// 
/// Used for:
/// - Checking if an address is a contract
/// - Pre-call validation
/// - Contract existence verification
pub const EXTCODESIZE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODECOPY operation (0x3C): Copy External Code
/// 
/// Copies code from another contract to memory.
/// If the address is not a contract, copies nothing (memory unchanged).
/// 
/// Stack: [..., address, destOffset, offset, size] → [...]
/// Gas: Variable + 3 × (size + 31) ÷ 32
/// 
/// Where:
/// - address: Contract to copy code from
/// - destOffset: Destination in memory
/// - offset: Source offset in external code
/// - size: Number of bytes to copy
/// 
/// Used for code analysis and verification.
pub const EXTCODECOPY = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODEHASH operation (0x3F): Get External Code Hash
/// 
/// Returns the keccak256 hash of the code at the specified address.
/// Returns 0 for non-existent accounts, 0xc5d2...c5d2 for empty accounts.
/// 
/// Stack: [..., address] → [..., hash]
/// Gas: Variable (depends on hardfork and address warm/cold status)
/// 
/// Introduced in Constantinople (EIP-1052).
/// More efficient than EXTCODECOPY for code verification.
pub const EXTCODEHASH = Operation{
    .execute = environment.op_extcodehash,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// CHAINID operation (0x46): Get Chain ID
/// 
/// Pushes the current chain ID onto the stack.
/// This helps prevent replay attacks across different chains.
/// 
/// Stack: [...] → [..., chain_id]
/// Gas: 2 (GasQuickStep)
/// 
/// Introduced in Istanbul (EIP-1344).
/// Common chain IDs: 1 (mainnet), 5 (goerli), 137 (polygon), etc.
pub const CHAINID = Operation{
    .execute = environment.op_chainid,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// SELFBALANCE operation (0x47): Get Current Contract Balance
/// 
/// Pushes the balance of the currently executing contract onto the stack.
/// More efficient than BALANCE(ADDRESS) combination.
/// 
/// Stack: [...] → [..., balance]
/// Gas: 5 (GasFastStep)
/// 
/// Introduced in Istanbul (EIP-1884).
/// Useful for contracts that need to check their own balance frequently.
pub const SELFBALANCE = Operation{
    .execute = environment.op_selfbalance,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// BALANCE operation for Frontier to Tangerine Whistle
/// 
/// Early version with lower gas cost.
/// Gas: 20 (GasExtStep)
/// 
/// Used in hardforks: Frontier, Homestead
pub const BALANCE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_balance,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// BALANCE operation for Tangerine Whistle to Istanbul
/// 
/// Increased gas cost to mitigate DoS attacks.
/// Gas: 400
/// 
/// Used in hardforks: Tangerine Whistle through Byzantium
pub const BALANCE_TANGERINE_TO_ISTANBUL = Operation{
    .execute = environment.op_balance,
    .constant_gas = 400,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// BALANCE operation for Istanbul to Berlin
/// 
/// Further increased gas cost.
/// Gas: 700
/// 
/// Used in hardforks: Istanbul, Muir Glacier
pub const BALANCE_ISTANBUL_TO_BERLIN = Operation{
    .execute = environment.op_balance,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// BALANCE operation for Berlin to Present
/// 
/// Introduces access lists and warm/cold account distinction.
/// Gas: 100 (warm) or 2600 (cold)
/// 
/// Used in hardforks: Berlin onwards
pub const BALANCE_BERLIN_TO_PRESENT = Operation{
    .execute = environment.op_balance,
    .constant_gas = 0, // Dynamic gas in Berlin+
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODESIZE operation for Frontier to Tangerine Whistle
/// 
/// Early version with lower gas cost.
/// Gas: 20 (GasExtStep)
/// 
/// Used in hardforks: Frontier, Homestead
pub const EXTCODESIZE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODESIZE operation for Tangerine Whistle to Berlin
/// 
/// Increased gas cost to mitigate DoS attacks.
/// Gas: 700
/// 
/// Used in hardforks: Tangerine Whistle through Berlin
pub const EXTCODESIZE_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODECOPY operation for Frontier to Tangerine Whistle
/// 
/// Early version with lower gas cost.
/// Gas: 20 + copy costs
/// 
/// Used in hardforks: Frontier, Homestead
pub const EXTCODECOPY_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODECOPY operation for Tangerine Whistle to Berlin
/// 
/// Increased gas cost to mitigate DoS attacks.
/// Gas: 700 + copy costs
/// 
/// Used in hardforks: Tangerine Whistle through Berlin
pub const EXTCODECOPY_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 700,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};
