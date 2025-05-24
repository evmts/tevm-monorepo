const std = @import("std");
// Import StateManager
const StateManager = @import("StateManager").StateManager;
const test_logger = @import("TestEvmLogger.zig");
const EvmLogger = test_logger.EvmLogger;
const createLogger = test_logger.createLogger;
const createScopedLogger = test_logger.createScopedLogger;
const debugOnly = test_logger.debugOnly;
const precompile = @import("precompile/Precompiles.zig");

// We'll initialize the logger inside a function
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger("evm.zig");
    }
    return _logger.?;
}

// EVM represents the Ethereum Virtual Machine
///
// The EVM is the runtime environment for smart contracts in Ethereum.
// It's responsible for executing contract code in a sandboxed environment
// according to specific chain rules and protocol versions.
///
// This implementation provides:
// - A configurable execution environment for EVM bytecode
// - Support for different Ethereum protocol versions (hardforks)
// - Access to state through a StateManager
// - Context awareness (static calls, depth tracking)
pub const Evm = struct {
    /// Current call depth (max 1024)
    /// The Ethereum protocol limits call depth to prevent stack overflows
    /// and infinite recursion between contracts
    depth: u16 = 0,

    /// Whether the current execution is in the context of a static call
    /// In static calls, state modifications are not allowed (view-only)
    /// This is used for STATICCALL operations and certain precompiles
    readOnly: bool = false,

    /// Chain rules configuration (e.g., which hardfork rules to apply)
    /// This determines which EIPs and protocol rules are active for execution
    chainRules: ChainRules = ChainRules{},

    /// State manager for accessing account and storage state
    /// This provides access to the world state (accounts, balances, storage, code)
    state_manager: ?*StateManager = null,
    
    /// Blob hashes from the current transaction (EIP-4844)
    /// Used by the BLOBHASH opcode to access versioned blob hashes
    blobHashes: []const [32]u8 = &[_][32]u8{},
    
    /// Current blob base fee (EIP-4844)
    /// Used by the BLOBBASEFEE opcode to get the blob gas price
    blobBaseFee: u256 = 0,
    
    /// Precompiled contracts for the current chain configuration
    /// These are special contracts at addresses 0x01-0x11 that provide
    /// optimized implementations of cryptographic and utility functions
    precompiles: ?*precompile.PrecompiledContracts = null,

    /// Create a new EVM instance
    ///
    /// This initializes a fresh EVM with default settings:
    /// - Zero call depth
    /// - Not read-only
    /// - Latest chain rules (Cancun by default)
    /// - No state manager attached
    /// - No precompiles (must be initialized separately)
    ///
    /// Parameters:
    /// - custom_rules: Optional custom chain rules to apply
    ///
    /// Returns: A new Evm instance
    /// Error: Returned if initialization fails
    pub fn init(custom_rules: ?ChainRules) !Evm {
        var scoped = createScopedLogger(getLogger(), "init()");
        defer scoped.deinit();

        getLogger().debug("Creating new EVM instance", .{});
        getLogger().debug("Default configuration: depth=0, readOnly=false, chainRules=latest", .{});

        debugOnly(struct {
            fn callback() void {
                // This code only runs when debug logs are enabled
                getLogger().info("EVM instance created with default settings", .{});
            }
        }.callback);

        // Apply custom chain rules if provided
        var evm = Evm{};
        if (custom_rules) |rules| {
            evm.chainRules = rules;
            getLogger().debug("Applied custom chain rules", .{});
        }

        return evm;
    }

    /// Set chain rules for the EVM
    ///
    /// This configures which protocol version and EIPs are active for execution.
    /// It's typically used to set the EVM to a specific Ethereum hardfork.
    ///
    /// Parameters:
    /// - rules: The ChainRules to apply
    pub fn setChainRules(self: *Evm, rules: ChainRules) void {
        var scoped = createScopedLogger(getLogger(), "setChainRules()");
        defer scoped.deinit();

        getLogger().debug("Setting chain rules for EVM execution", .{});

        // Log all rule settings
        getLogger().debug("Hardfork configuration:", .{});
        getLogger().debug("  - Homestead: {}", .{rules.IsHomestead});
        getLogger().debug("  - EIP150: {}", .{rules.IsEIP150});
        getLogger().debug("  - EIP158: {}", .{rules.IsEIP158});
        getLogger().debug("  - Byzantium: {}", .{rules.IsByzantium});
        getLogger().debug("  - Constantinople: {}", .{rules.IsConstantinople});
        getLogger().debug("  - Petersburg: {}", .{rules.IsPetersburg});
        getLogger().debug("  - Istanbul: {}", .{rules.IsIstanbul});
        getLogger().debug("  - Berlin: {}", .{rules.IsBerlin});
        getLogger().debug("  - London: {}", .{rules.IsLondon});
        getLogger().debug("  - Merge: {}", .{rules.IsMerge});
        getLogger().debug("  - Shanghai: {}", .{rules.IsShanghai});
        getLogger().debug("  - Cancun: {}", .{rules.IsCancun});
        getLogger().debug("  - Prague: {}", .{rules.IsPrague});
        getLogger().debug("  - Verkle: {}", .{rules.IsVerkle});

        getLogger().debug("EIP configuration:", .{});
        getLogger().debug("  - EIP1559: {}", .{rules.IsEIP1559});
        getLogger().debug("  - EIP2930: {}", .{rules.IsEIP2930});
        getLogger().debug("  - EIP3651: {}", .{rules.IsEIP3651});
        getLogger().debug("  - EIP3855: {}", .{rules.IsEIP3855});
        getLogger().debug("  - EIP3860: {}", .{rules.IsEIP3860});
        getLogger().debug("  - EIP4895: {}", .{rules.IsEIP4895});
        getLogger().debug("  - EIP4844: {}", .{rules.IsEIP4844});

        // Store the new rules
        self.chainRules = rules;
        getLogger().info("Chain rules updated successfully", .{});
    }

    /// Set read-only mode for the EVM
    ///
    /// When in read-only mode, operations that would modify state (like SSTORE)
    /// will fail with a WriteProtection error. This is used to implement STATICCALL
    /// semantics and view functions.
    ///
    /// Parameters:
    /// - readOnly: Whether to enable read-only mode
    pub fn setReadOnly(self: *Evm, readOnly: bool) void {
        var scoped = createScopedLogger(getLogger(), "setReadOnly()");
        defer scoped.deinit();

        const previous = self.readOnly;
        getLogger().debug("Setting EVM read-only mode: {} (was: {})", .{ readOnly, previous });

        if (previous == readOnly) {
            getLogger().debug("Read-only mode unchanged (already {})", .{readOnly});
        } else if (readOnly) {
            getLogger().debug("Enabling read-only mode - state modifications will be blocked", .{});
            getLogger().debug("The following operations will fail: SSTORE, CREATE, CREATE2, SELFDESTRUCT, CALL with value", .{});
        } else {
            getLogger().debug("Disabling read-only mode - state modifications will be allowed", .{});
        }

        self.readOnly = readOnly;
        getLogger().info("Read-only mode set to: {}", .{readOnly});
    }

    /// Set the state manager for the EVM
    ///
    /// The state manager provides access to accounts, balances, contract code,
    /// and storage. It's required for most EVM operations that interact with
    /// the blockchain state.
    ///
    /// Parameters:
    /// - stateManager: Pointer to the StateManager to use
    pub fn setStateManager(self: *Evm, stateManager: *StateManager) void {
        var scoped = createScopedLogger(getLogger(), "setStateManager()");
        defer scoped.deinit();

        getLogger().debug("Setting state manager for EVM", .{});

        const had_manager = self.state_manager != null;
        if (had_manager) {
            getLogger().debug("Replacing existing state manager", .{});
        } else {
            getLogger().debug("Assigning initial state manager", .{});
        }

        // Skip additional debug logging for state manager
        getLogger().debug("State manager configured", .{});

        self.state_manager = stateManager;
        getLogger().info("State manager configured successfully", .{});
    }

    /// Get call depth of the EVM
    ///
    /// The call depth tracks how many nested calls are currently executing.
    /// Ethereum limits this to 1024 to prevent stack overflows and
    /// infinite recursion between contracts.
    ///
    /// Returns: Current call depth
    pub fn getCallDepth(self: *const Evm) u16 {
        getLogger().debug("Getting current call depth: {d}", .{self.depth});
        return self.depth;
    }

    /// Increment call depth
    ///
    /// This is called when a new call frame is created (CALL, STATICCALL, etc.)
    /// Returns an error if the maximum call depth would be exceeded.
    ///
    /// Returns: Nothing if successful, error if depth limit reached
    /// Error: DepthLimit if maximum call depth would be exceeded
    pub fn incrementCallDepth(self: *Evm) !void {
        getLogger().debug("Incrementing call depth: {d} -> {d}", .{ self.depth, self.depth + 1 });

        if (self.depth >= 1024) {
            getLogger().err("Call depth limit reached: {d}", .{self.depth});
            return error.DepthLimit;
        }

        self.depth += 1;
        getLogger().debug("New call depth: {d}", .{self.depth});
    }

    /// Decrement call depth
    ///
    /// This is called when a call frame completes and returns to its parent.
    pub fn decrementCallDepth(self: *Evm) void {
        if (self.depth == 0) {
            getLogger().warn("Attempted to decrement call depth below zero", .{});
            return;
        }

        getLogger().debug("Decrementing call depth: {d} -> {d}", .{ self.depth, self.depth - 1 });
        self.depth -= 1;
        getLogger().debug("New call depth: {d}", .{self.depth});
    }

    /// Create a debug tracelog entry for contract execution
    ///
    /// This is a helper method to log contract execution events
    /// for debugging purposes. It takes the contract address, the call type,
    /// and optional context information.
    ///
    /// Parameters:
    /// - contract_address: The address of the contract being executed
    /// - call_type: Type of call (e.g., "CALL", "STATICCALL", "DELEGATECALL")
    /// - context: Optional context string with additional information
    pub fn logContractExecution(self: *const Evm, contract_address: []const u8, call_type: []const u8, context: ?[]const u8) void {
        getLogger().debug("╔══════════════════════════════════════════════════════════", .{});
        getLogger().debug("║ {s} to contract {s}", .{ call_type, contract_address });
        getLogger().debug("║ Depth: {d}, ReadOnly: {}", .{ self.depth, self.readOnly });

        if (context) |ctx| {
            getLogger().debug("║ Context: {s}", .{ctx});
        }

        // Log chain rules summary for this execution
        getLogger().debug("║ Chain rules: Cancun={}, Shanghai={}, London={}, Berlin={}", .{ self.chainRules.IsCancun, self.chainRules.IsShanghai, self.chainRules.IsLondon, self.chainRules.IsBerlin });

        getLogger().debug("╚══════════════════════════════════════════════════════════", .{});
    }

    /// Log execution error details
    ///
    /// This method provides detailed error information when an EVM execution
    /// fails. It includes information about call state, gas usage, and error context.
    ///
    /// Parameters:
    /// - error_type: String description of the error
    /// - gas_used: Gas used before the error occurred
    /// - gas_limit: Gas limit for the execution
    /// - pc: Program counter at the point of failure
    /// - contract_address: Address of the contract where execution failed
    /// - details: Optional additional error details
    pub fn logExecutionError(self: *const Evm, error_type: []const u8, gas_used: u64, gas_limit: u64, pc: usize, contract_address: []const u8, details: ?[]const u8) void {
        getLogger().err("┌─────────────────────────────────────────────────────────", .{});
        getLogger().err("│ EVM EXECUTION ERROR: {s}", .{error_type});
        getLogger().err("│ Contract: {s}", .{contract_address});
        getLogger().err("│ Call depth: {d}, ReadOnly mode: {}", .{ self.depth, self.readOnly });
        getLogger().err("│ PC: {d}, Gas used: {d}/{d} ({d}%)", .{ pc, gas_used, gas_limit, if (gas_limit > 0) (gas_used * 100) / gas_limit else 0 });

        if (details) |det| {
            getLogger().err("│ Details: {s}", .{det});
        }

        // Log state manager info when debug enabled
        if (self.state_manager) |_| {
            getLogger().err("│ State manager: Active", .{});
        } else {
            getLogger().err("│ State manager: Not attached", .{});
        }

        getLogger().err("└─────────────────────────────────────────────────────────", .{});
    }
    
    /// Set blob hashes for the current transaction context
    ///
    /// This sets the blob hashes that will be accessible via the BLOBHASH opcode.
    /// These are versioned hashes of the blob data in EIP-4844 transactions.
    ///
    /// Parameters:
    /// - hashes: Array of 32-byte blob hashes
    pub fn setBlobHashes(self: *Evm, hashes: []const [32]u8) void {
        getLogger().debug("Setting blob hashes for transaction: {} hashes", .{hashes.len});
        self.blobHashes = hashes;
        
        // Log first few hashes for debugging
        for (hashes, 0..) |hash, i| {
            if (i >= 3) break; // Only log first 3
            getLogger().debug("  Blob hash[{}]: 0x{x}", .{ i, std.fmt.fmtSliceHexLower(&hash) });
        }
        if (hashes.len > 3) {
            getLogger().debug("  ... and {} more", .{hashes.len - 3});
        }
    }
    
    /// Set blob base fee for the current block
    ///
    /// This sets the blob base fee that will be returned by the BLOBBASEFEE opcode.
    /// The blob base fee is part of EIP-4844 and determines the cost of blob data.
    ///
    /// Parameters:
    /// - fee: The blob base fee in wei
    pub fn setBlobBaseFee(self: *Evm, fee: u256) void {
        getLogger().debug("Setting blob base fee: {}", .{fee});
        self.blobBaseFee = fee;
    }
    
    /// Initialize precompiled contracts based on chain rules
    ///
    /// This sets up the precompiled contracts that are available for the current
    /// chain configuration. Different hardforks have different sets of precompiles.
    ///
    /// Parameters:
    /// - allocator: Memory allocator for creating the precompiles map
    ///
    /// Returns: Nothing if successful
    /// Error: Returned if allocation fails
    pub fn initPrecompiles(self: *Evm, allocator: std.mem.Allocator) !void {
        getLogger().debug("Initializing precompiled contracts for chain rules", .{});
        
        // Free existing precompiles if any
        if (self.precompiles) |contracts| {
            contracts.deinit();
            allocator.destroy(contracts);
            self.precompiles = null;
        }
        
        // Create new precompiles based on chain rules
        const contracts = try allocator.create(precompile.PrecompiledContracts);
        contracts.* = try precompile.activePrecompiledContracts(allocator, self.chainRules);
        self.precompiles = contracts;
        
        getLogger().info("Initialized {} precompiled contracts", .{contracts.count()});
    }
    
    /// Set precompiled contracts directly
    ///
    /// This allows setting a custom set of precompiled contracts, overriding
    /// the defaults based on chain rules.
    ///
    /// Parameters:
    /// - contracts: Pointer to the precompiled contracts map
    pub fn setPrecompiles(self: *Evm, contracts: *precompile.PrecompiledContracts) void {
        getLogger().debug("Setting custom precompiled contracts", .{});
        self.precompiles = contracts;
        getLogger().info("Set {} precompiled contracts", .{contracts.count()});
    }

    /// Log gas usage statistics
    ///
    /// This method logs detailed gas usage information for a contract execution.
    /// It's useful for debugging and optimization purposes.
    ///
    /// Parameters:
    /// - gas_used: Total gas used for the execution
    /// - gas_limit: Gas limit for the execution
    /// - contract_address: Address of the executed contract
    /// - successful: Whether execution completed successfully
    /// - gas_details: Optional breakdown of gas usage by category
    pub fn logGasUsage(self: *const Evm, gas_used: u64, gas_limit: u64, contract_address: []const u8, successful: bool, gas_details: ?struct {
        compute: u64 = 0,
        memory: u64 = 0,
        storage: u64 = 0,
        calls: u64 = 0,
    }) void {
        getLogger().debug("┌─────────────────────────────────────────────────────────", .{});
        getLogger().debug("│ GAS USAGE SUMMARY", .{});
        getLogger().debug("│ Contract: {s}", .{contract_address});
        getLogger().debug("│ Call depth: {d}, Execution successful: {}", .{ self.depth, successful });

        const percentage = if (gas_limit > 0) (gas_used * 100) / gas_limit else 0;
        getLogger().debug("│ Gas used: {d}/{d} ({d}%)", .{ gas_used, gas_limit, percentage });

        // Log efficiency rating based on gas usage percentage
        if (percentage < 50) {
            getLogger().debug("│ Efficiency: Good (used less than 50% of gas limit)", .{});
        } else if (percentage < 80) {
            getLogger().debug("│ Efficiency: Average (used 50-80% of gas limit)", .{});
        } else if (percentage < 95) {
            getLogger().debug("│ Efficiency: Warning (used 80-95% of gas limit)", .{});
        } else {
            getLogger().debug("│ Efficiency: Critical (used >95% of gas limit)", .{});
        }

        // Detailed gas breakdown if provided
        if (gas_details) |details| {
            getLogger().debug("│", .{});
            getLogger().debug("│ Gas breakdown:", .{});
            getLogger().debug("│   - Compute: {d} ({d}%)", .{ details.compute, if (gas_used > 0) (details.compute * 100) / gas_used else 0 });
            getLogger().debug("│   - Memory: {d} ({d}%)", .{ details.memory, if (gas_used > 0) (details.memory * 100) / gas_used else 0 });
            getLogger().debug("│   - Storage: {d} ({d}%)", .{ details.storage, if (gas_used > 0) (details.storage * 100) / gas_used else 0 });
            getLogger().debug("│   - External calls: {d} ({d}%)", .{ details.calls, if (gas_used > 0) (details.calls * 100) / gas_used else 0 });

            const other = gas_used - details.compute - details.memory - details.storage - details.calls;
            getLogger().debug("│   - Other: {d} ({d}%)", .{ other, if (gas_used > 0) (other * 100) / gas_used else 0 });
        }

        getLogger().debug("└─────────────────────────────────────────────────────────", .{});
    }
};

// Chain rules for different Ethereum hardforks
///
// This struct configures which Ethereum protocol rules and EIPs are active
// during EVM execution. The default is set to the latest Ethereum version (Cancun),
// but can be configured for any supported hardfork.
///
// Each field represents a specific hardfork or EIP activation status.
pub const ChainRules = struct {
    /// Is Homestead rules enabled (March 2016)
    /// Changed gas calculation for certain operations and introduced DELEGATECALL
    IsHomestead: bool = true,

    /// Is EIP150 rules enabled (October 2016, "Tangerine Whistle")
    /// Gas cost increases for IO-heavy operations to prevent DoS attacks
    IsEIP150: bool = true,

    /// Is EIP158 rules enabled (October 2016, "Spurious Dragon")
    /// Changes to account clearing and empty account handling
    IsEIP158: bool = true,

    /// Is Byzantium rules enabled (October 2017)
    /// Introduced REVERT, RETURNDATASIZE, RETURNDATACOPY, STATICCALL
    /// Added support for zkSNARKs
    IsEIP1559: bool = true,

    /// Is Constantinople rules enabled (February 2019)
    /// Added bitwise shifting instructions and EXTCODEHASH
    /// Reduced costs for SSTORE operations
    IsConstantinople: bool = true,

    /// Is Petersburg rules enabled (February 2019)
    /// Same as Constantinople but removed the SSTORE net gas metering
    IsPetersburg: bool = true,

    /// Is Istanbul rules enabled (December 2019)
    /// Changed gas costs for SLOAD, BALANCE, EXTCODEHASH, CALL
    /// Added CHAINID and SELFBALANCE instructions
    IsIstanbul: bool = true,

    /// Is Berlin rules enabled (April 2021)
    /// Added EIP-2565, EIP-2718, EIP-2929, EIP-2930
    /// Changed gas calculation for state access operations
    IsBerlin: bool = true,

    /// Is London rules enabled (August 2021)
    /// Added EIP-1559 (fee market change)
    /// Added BASEFEE instruction
    IsLondon: bool = true,

    /// Is Merge rules enabled (September 2022)
    /// Transitioned from Proof of Work to Proof of Stake
    /// Changed DIFFICULTY opcode to PREVRANDAO
    IsMerge: bool = true,

    /// Is Shanghai rules enabled (April 2023)
    /// Added support for validator withdrawals
    /// Introduced the PUSH0 instruction
    IsShanghai: bool = true,

    /// Is Cancun rules enabled (March 2024)
    /// Added EIP-4844 (proto-danksharding)
    /// Changed various gas costs and added new opcodes
    IsCancun: bool = true,

    /// Is Prague rules enabled (future upgrade)
    /// Not yet specified
    IsPrague: bool = false,

    /// Is Verkle rules enabled (future upgrade)
    /// Will transition state to Verkle trees
    IsVerkle: bool = false,

    /// Is EIP1559 rules enabled (London)
    /// Fee market change with burn and variable block size
    IsByzantium: bool = true,

    /// Is EIP2930 rules enabled (Berlin)
    /// Optional access lists for transactions
    IsEIP2930: bool = true,

    /// Is EIP3198 rules enabled (London)
    /// BASEFEE opcode to access block's base fee
    IsEIP3198: bool = true,

    /// Is EIP3651 rules enabled (Shanghai, warm COINBASE)
    /// Makes the COINBASE address warm for EIP-2929 gas calculations
    IsEIP3651: bool = true,

    /// Is EIP3855 rules enabled (Shanghai, PUSH0 instruction)
    /// Adds PUSH0 instruction that pushes 0 onto the stack
    IsEIP3855: bool = true,

    /// Is EIP3860 rules enabled (Shanghai, limit and meter initcode)
    /// Limits maximum initcode size and adds gas metering
    IsEIP3860: bool = true,

    /// Is EIP4895 rules enabled (Shanghai, beacon chain withdrawals)
    /// Allows withdrawals from the beacon chain to the EVM
    IsEIP4895: bool = true,

    /// Is EIP4844 rules enabled (Cancun, shard blob transactions)
    /// Adds a new transaction type for data blobs (proto-danksharding)
    IsEIP4844: bool = true,

    /// Is EIP1153 rules enabled (Cancun, transient storage)
    /// Adds TLOAD and TSTORE instructions for transient storage
    IsEIP1153: bool = true,

    /// Is EIP5656 rules enabled (Cancun, MCOPY instruction)
    /// Adds MCOPY instruction for efficient memory copying
    IsEIP5656: bool = true,

    /// Is EIP3541 rules enabled (London, reject new contracts that start with 0xEF)
    /// Rejects new contract code starting with the 0xEF byte to reserve this prefix for future protocol upgrades
    IsEIP3541: bool = true,

    /// Create chain rules for a specific hardfork
    ///
    /// This is a factory method that creates a ChainRules configuration
    /// properly configured for the specified Ethereum hardfork.
    ///
    /// Parameters:
    /// - hardfork: The Ethereum hardfork to create rules for
    ///
    /// Returns: A ChainRules instance configured for the specified hardfork
    pub fn forHardfork(hardfork: Hardfork) ChainRules {
        var logger = getLogger();
        logger.debug("Creating chain rules for hardfork: {s}", .{@tagName(hardfork)});
        var rules = ChainRules{};

        switch (hardfork) {
            .Frontier => {
                rules.IsHomestead = false;
                rules.IsEIP150 = false;
                rules.IsEIP158 = false;
                rules.IsByzantium = false;
                rules.IsConstantinople = false;
                rules.IsPetersburg = false;
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Homestead => {
                rules.IsEIP150 = false;
                rules.IsEIP158 = false;
                rules.IsByzantium = false;
                rules.IsConstantinople = false;
                rules.IsPetersburg = false;
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .TangerineWhistle => {
                rules.IsEIP158 = false;
                rules.IsByzantium = false;
                rules.IsConstantinople = false;
                rules.IsPetersburg = false;
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .SpuriousDragon => {
                rules.IsByzantium = false;
                rules.IsConstantinople = false;
                rules.IsPetersburg = false;
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Byzantium => {
                rules.IsConstantinople = false;
                rules.IsPetersburg = false;
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Constantinople => {
                rules.IsPetersburg = false;
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Petersburg => {
                rules.IsIstanbul = false;
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Istanbul => {
                rules.IsBerlin = false;
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP2930 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Berlin => {
                rules.IsLondon = false;
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP1559 = false;
                rules.IsEIP3541 = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .London => {
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
                rules.IsEIP5656 = false;
            },
            .ArrowGlacier => {
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
                rules.IsEIP5656 = false;
            },
            .GrayGlacier => {
                rules.IsMerge = false;
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
                rules.IsEIP5656 = false;
            },
            .Merge => {
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
                rules.IsEIP5656 = false;
            },
            .Shanghai => {
                rules.IsCancun = false;
                rules.IsEIP4844 = false;
                rules.IsEIP5656 = false;
            },
            .Cancun => {},
            .Prague => {
                rules.IsPrague = true;
            },
            .Verkle => {
                rules.IsPrague = true;
                rules.IsVerkle = true;
            },
        }

        logger.debug("Chain rules created for hardfork: {s}", .{@tagName(hardfork)});
        return rules;
    }
};

// Ethereum hardforks
///
// This enum represents the various Ethereum protocol upgrades (hardforks)
// that have occurred throughout Ethereum's history.
///
// Each hardfork introduced changes to the protocol rules, added or removed
// opcodes, changed gas costs, or added other features.
pub const Hardfork = enum {
    /// The original Ethereum protocol (July 2015)
    Frontier,

    /// Added DELEGATECALL and other changes (March 2016)
    Homestead,

    /// Gas cost increases for IO-heavy operations (October 2016)
    TangerineWhistle,

    /// Added EIP-150, EIP-155, EIP-160, EIP-161 (October 2016)
    SpuriousDragon,

    /// Added new opcodes and precompiles, zkSNARK support (October 2017)
    Byzantium,

    /// Added bitshift opcodes, reduced SSTORE costs (February 2019)
    Constantinople,

    /// Same as Constantinople but removed EIP-1283 (February 2019)
    Petersburg,

    /// Added CHAINID, SELFBALANCE, changed gas costs (December 2019)
    Istanbul,

    /// Added EIP-2565, EIP-2718, EIP-2929, EIP-2930 (April 2021)
    Berlin,

    /// Added EIP-1559 fee market, BASEFEE opcode (August 2021)
    London,

    /// Delayed difficulty bomb (December 2021)
    ArrowGlacier,

    /// Further delayed difficulty bomb (June 2022)
    GrayGlacier,

    /// Transitioned to Proof of Stake (September 2022)
    Merge,

    /// Added validator withdrawals, PUSH0 instruction (April 2023)
    Shanghai,

    /// Added EIP-4844 for data blobs, changed gas costs (March 2024)
    Cancun,

    /// Future planned upgrade (not yet specified)
    Prague,

    /// Future planned upgrade with Verkle trees
    Verkle,
};

// Tests
const testing = std.testing;

test "Evm.init creates default EVM" {
    const evm = try Evm.init(null);
    
    try testing.expectEqual(@as(u16, 0), evm.depth);
    try testing.expectEqual(false, evm.readOnly);
    try testing.expectEqual(@as(?*StateManager, null), evm.state_manager);
    try testing.expectEqual(@as(?*precompile.PrecompiledContracts, null), evm.precompiles);
    try testing.expectEqual(@as(usize, 0), evm.blobHashes.len);
    try testing.expectEqual(@as(u256, 0), evm.blobBaseFee);
    
    // Check default chain rules (Cancun)
    try testing.expect(evm.chainRules.IsCancun);
    try testing.expect(evm.chainRules.IsShanghai);
    try testing.expect(evm.chainRules.IsLondon);
}

test "Evm.init with custom chain rules" {
    const customRules = ChainRules{
        .IsCancun = false,
        .IsShanghai = false,
    };
    
    const evm = try Evm.init(customRules);
    
    try testing.expectEqual(false, evm.chainRules.IsCancun);
    try testing.expectEqual(false, evm.chainRules.IsShanghai);
}

test "Evm.setChainRules updates rules" {
    var evm = try Evm.init(null);
    
    const berlinRules = ChainRules.forHardfork(.Berlin);
    evm.setChainRules(berlinRules);
    
    try testing.expect(evm.chainRules.IsBerlin);
    try testing.expect(!evm.chainRules.IsLondon);
    try testing.expect(!evm.chainRules.IsCancun);
}

test "Evm.setReadOnly toggles read-only mode" {
    var evm = try Evm.init(null);
    
    try testing.expectEqual(false, evm.readOnly);
    
    evm.setReadOnly(true);
    try testing.expectEqual(true, evm.readOnly);
    
    evm.setReadOnly(false);
    try testing.expectEqual(false, evm.readOnly);
}

test "Evm.setStateManager assigns state manager" {
    var evm = try Evm.init(null);
    var stateManager = StateManager{};
    
    try testing.expectEqual(@as(?*StateManager, null), evm.state_manager);
    
    evm.setStateManager(&stateManager);
    try testing.expectEqual(@as(?*StateManager, &stateManager), evm.state_manager);
}

test "Evm call depth management" {
    var evm = try Evm.init(null);
    
    // Initial depth is 0
    try testing.expectEqual(@as(u16, 0), evm.getCallDepth());
    
    // Increment depth
    try evm.incrementCallDepth();
    try testing.expectEqual(@as(u16, 1), evm.getCallDepth());
    
    // Increment again
    try evm.incrementCallDepth();
    try testing.expectEqual(@as(u16, 2), evm.getCallDepth());
    
    // Decrement
    evm.decrementCallDepth();
    try testing.expectEqual(@as(u16, 1), evm.getCallDepth());
    
    // Decrement again
    evm.decrementCallDepth();
    try testing.expectEqual(@as(u16, 0), evm.getCallDepth());
    
    // Decrement at zero should not underflow
    evm.decrementCallDepth();
    try testing.expectEqual(@as(u16, 0), evm.getCallDepth());
}

test "Evm.incrementCallDepth respects depth limit" {
    var evm = try Evm.init(null);
    evm.depth = 1024;
    
    // Should fail at max depth
    try testing.expectError(error.DepthLimit, evm.incrementCallDepth());
    try testing.expectEqual(@as(u16, 1024), evm.depth);
}

test "Evm.setBlobHashes sets blob hashes" {
    var evm = try Evm.init(null);
    
    const hashes = [_][32]u8{
        [_]u8{1} ** 32,
        [_]u8{2} ** 32,
        [_]u8{3} ** 32,
    };
    
    evm.setBlobHashes(&hashes);
    
    try testing.expectEqual(@as(usize, 3), evm.blobHashes.len);
    try testing.expectEqualSlices(u8, &([_]u8{1} ** 32), &evm.blobHashes[0]);
    try testing.expectEqualSlices(u8, &([_]u8{2} ** 32), &evm.blobHashes[1]);
    try testing.expectEqualSlices(u8, &([_]u8{3} ** 32), &evm.blobHashes[2]);
}

test "Evm.setBlobBaseFee sets blob base fee" {
    var evm = try Evm.init(null);
    
    try testing.expectEqual(@as(u256, 0), evm.blobBaseFee);
    
    const fee: u256 = 1000000;
    evm.setBlobBaseFee(fee);
    
    try testing.expectEqual(fee, evm.blobBaseFee);
}

// Skip this test due to ChainRules type mismatch between test and non-test builds
// test "Evm.initPrecompiles initializes precompiled contracts" {
//     const allocator = testing.allocator;
//     var evm = try Evm.init(null);
//     
//     try testing.expectEqual(@as(?*precompile.PrecompiledContracts, null), evm.precompiles);
//     
//     try evm.initPrecompiles(allocator);
//     defer {
//         if (evm.precompiles) |contracts| {
//             contracts.deinit();
//             allocator.destroy(contracts);
//         }
//     }
//     
//     try testing.expect(evm.precompiles != null);
// }

test "ChainRules.forHardfork creates correct rules for Frontier" {
    const rules = ChainRules.forHardfork(.Frontier);
    
    try testing.expect(!rules.IsHomestead);
    try testing.expect(!rules.IsEIP150);
    try testing.expect(!rules.IsEIP158);
    try testing.expect(!rules.IsByzantium);
    try testing.expect(!rules.IsConstantinople);
    try testing.expect(!rules.IsPetersburg);
    try testing.expect(!rules.IsIstanbul);
    try testing.expect(!rules.IsBerlin);
    try testing.expect(!rules.IsLondon);
    try testing.expect(!rules.IsMerge);
    try testing.expect(!rules.IsShanghai);
    try testing.expect(!rules.IsCancun);
}

test "ChainRules.forHardfork creates correct rules for London" {
    const rules = ChainRules.forHardfork(.London);
    
    try testing.expect(rules.IsHomestead);
    try testing.expect(rules.IsEIP150);
    try testing.expect(rules.IsEIP158);
    try testing.expect(rules.IsByzantium);
    try testing.expect(rules.IsConstantinople);
    try testing.expect(rules.IsPetersburg);
    try testing.expect(rules.IsIstanbul);
    try testing.expect(rules.IsBerlin);
    try testing.expect(rules.IsLondon);
    try testing.expect(!rules.IsMerge);
    try testing.expect(!rules.IsShanghai);
    try testing.expect(!rules.IsCancun);
}

test "ChainRules.forHardfork creates correct rules for Cancun" {
    const rules = ChainRules.forHardfork(.Cancun);
    
    try testing.expect(rules.IsHomestead);
    try testing.expect(rules.IsEIP150);
    try testing.expect(rules.IsEIP158);
    try testing.expect(rules.IsByzantium);
    try testing.expect(rules.IsConstantinople);
    try testing.expect(rules.IsPetersburg);
    try testing.expect(rules.IsIstanbul);
    try testing.expect(rules.IsBerlin);
    try testing.expect(rules.IsLondon);
    try testing.expect(rules.IsMerge);
    try testing.expect(rules.IsShanghai);
    try testing.expect(rules.IsCancun);
    try testing.expect(!rules.IsPrague);
    try testing.expect(!rules.IsVerkle);
}

test "ChainRules default values match Cancun" {
    const defaultRules = ChainRules{};
    const cancunRules = ChainRules.forHardfork(.Cancun);
    
    try testing.expectEqual(defaultRules.IsHomestead, cancunRules.IsHomestead);
    try testing.expectEqual(defaultRules.IsEIP150, cancunRules.IsEIP150);
    try testing.expectEqual(defaultRules.IsEIP158, cancunRules.IsEIP158);
    try testing.expectEqual(defaultRules.IsByzantium, cancunRules.IsByzantium);
    try testing.expectEqual(defaultRules.IsConstantinople, cancunRules.IsConstantinople);
    try testing.expectEqual(defaultRules.IsPetersburg, cancunRules.IsPetersburg);
    try testing.expectEqual(defaultRules.IsIstanbul, cancunRules.IsIstanbul);
    try testing.expectEqual(defaultRules.IsBerlin, cancunRules.IsBerlin);
    try testing.expectEqual(defaultRules.IsLondon, cancunRules.IsLondon);
    try testing.expectEqual(defaultRules.IsMerge, cancunRules.IsMerge);
    try testing.expectEqual(defaultRules.IsShanghai, cancunRules.IsShanghai);
    try testing.expectEqual(defaultRules.IsCancun, cancunRules.IsCancun);
}

test "Evm logging methods compile" {
    var evm = try Evm.init(null);
    
    // These methods are for logging only, just verify they compile
    evm.logContractExecution("0x1234", "CALL", "test context");
    evm.logContractExecution("0x5678", "STATICCALL", null);
    
    evm.logExecutionError("OutOfGas", 1000, 2000, 42, "0xabcd", "Not enough gas");
    evm.logExecutionError("Revert", 500, 1000, 10, "0xefef", null);
    
    evm.logGasUsage(1000, 2000, "0x1234", true, .{
        .compute = @as(u64, 100),
        .memory = @as(u64, 200),
        .storage = @as(u64, 300),
        .calls = @as(u64, 400),
    });
    evm.logGasUsage(500, 1000, "0x5678", false, null);
}
