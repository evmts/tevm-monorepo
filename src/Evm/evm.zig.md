# evm.zig - Ethereum Virtual Machine Core Implementation

This document describes the Tevm EVM core implementation in `evm.zig` and compares it with other major EVM implementations.

## Overview

The `Evm` struct in Tevm implements the core Ethereum Virtual Machine environment that:
- Manages execution context (depth, read-only mode)
- Configures protocol rules via chain hardforks
- Provides access to state through StateManager
- Handles EIP-4844 blob data
- Manages precompiled contracts
- Extensive logging and debugging support

## Implementation Details

### Core Structure

```zig
pub const Evm = struct {
    depth: u16 = 0,                                    // Call depth (max 1024)
    readOnly: bool = false,                            // Static call context
    chainRules: ChainRules = ChainRules{},            // Protocol configuration (defaults to Cancun)
    state_manager: ?*StateManager = null,              // State access
    blobHashes: []const [32]u8 = &[_][32]u8{},       // EIP-4844 blob hashes
    blobBaseFee: u256 = 0,                            // EIP-4844 blob base fee
    precompiles: ?*PrecompiledContracts = null,       // Precompiled contracts
    logger: ?*Logger = null,                          // Logger instance (lazy initialized)
}
```

### Key Features

1. **Explicit Configuration**: All settings are explicit, defaults to Cancun hardfork
2. **Comprehensive Logging**: Detailed debug logging with lazy initialization
3. **Strong Type Safety**: Chain rules and hardforks as typed enums
4. **Memory Safety**: No hidden allocations, explicit memory management
5. **Testability**: Comprehensive test coverage with mocked dependencies
6. **Error Handling**: Explicit error types (e.g., `error.DepthLimit`)

### Core Operations

#### Initialization and Configuration
- `init(custom_rules)` - Create new EVM with optional custom rules
- `setChainRules(rules)` - Configure protocol version
- `setReadOnly(readOnly)` - Toggle static call mode
- `setStateManager(stateManager)` - Attach state access

#### Call Depth Management
- `getCallDepth()` - Get current nesting level
- `incrementCallDepth()` - Enter new call (returns `error.DepthLimit` if depth >= 1024)
- `decrementCallDepth()` - Exit call frame (safe underflow handling)

#### EIP-4844 Support
- `setBlobHashes(hashes)` - Set transaction blob hashes
- `setBlobBaseFee(fee)` - Set current blob base fee

#### Precompiled Contracts
- `initPrecompiles(allocator)` - Initialize based on chain rules
- `setPrecompiles(contracts)` - Set custom precompiles

#### Debugging Support
- `logContractExecution()` - Log execution context
- `logExecutionError()` - Log error details
- `logGasUsage()` - Log gas statistics
- `createScopedLogger()` - Create logger with EVM context
- `debugOnly()` - Execute callback only in debug builds
- `getLogger()` - Get or lazily initialize logger

### Chain Rules System

The `ChainRules` struct provides fine-grained protocol configuration:

```zig
pub const ChainRules = struct {
    // Hardfork flags
    IsHomestead: bool = true,
    IsEIP150: bool = true,
    IsEIP158: bool = true,
    IsByzantium: bool = true,
    IsConstantinople: bool = true,
    IsPetersburg: bool = true,
    IsIstanbul: bool = true,
    IsBerlin: bool = true,
    IsLondon: bool = true,
    IsMerge: bool = true,
    IsShanghai: bool = true,
    IsCancun: bool = true,      // Default: latest
    IsPrague: bool = false,
    IsVerkle: bool = false,
    
    // Individual EIP flags
    IsEIP1559: bool = true,      // Fee market
    IsEIP2930: bool = true,      // Access lists
    IsEIP3541: bool = true,      // Reject 0xEF contracts
    IsEIP3651: bool = true,      // Warm COINBASE
    IsEIP3855: bool = true,      // PUSH0 instruction
    IsEIP3860: bool = true,      // Limit initcode
    IsEIP4895: bool = true,      // Withdrawals
    IsEIP4844: bool = true,      // Blob transactions
    IsEIP1153: bool = true,      // Transient storage
    IsEIP5656: bool = true,      // MCOPY instruction
}
```

### Hardfork Support

The implementation supports all major Ethereum hardforks:

```zig
pub const Hardfork = enum {
    Frontier,          // July 2015 - Original launch
    Homestead,         // March 2016 - DELEGATECALL
    TangerineWhistle,  // October 2016 - Gas repricing
    SpuriousDragon,    // October 2016 - State clearing
    Byzantium,         // October 2017 - REVERT, zkSNARKs
    Constantinople,    // February 2019 - Bitshift ops
    Petersburg,        // February 2019 - Fix SSTORE
    Istanbul,          // December 2019 - Gas changes
    Berlin,            // April 2021 - Access lists
    London,            // August 2021 - EIP-1559
    ArrowGlacier,      // December 2021 - Difficulty bomb
    GrayGlacier,       // June 2022 - Difficulty bomb
    Merge,             // September 2022 - PoS
    Shanghai,          // April 2023 - Withdrawals
    Cancun,            // March 2024 - Proto-danksharding
    Prague,            // Future
    Verkle,            // Future - Verkle trees
}
```

## Comparison with Other Implementations

### Architecture Comparison

| Implementation | Architecture | State Access | Configuration | Focus |
|----------------|-------------|--------------|---------------|-------|
| Tevm (Zig) | Struct-based | StateManager pointer | ChainRules struct | Clarity & debugging |
| go-ethereum | Interface-based | StateDB interface | ChainConfig | Production features |
| revm (Rust) | Trait-based | Database traits | SpecId enum | Performance |
| evmone (C++) | EVMC standard | Host callbacks | Revision enum | Raw speed |

### Key Differences

#### 1. Configuration Approach

**Tevm**:
- Explicit ChainRules with all flags visible
- Factory method for hardfork configurations
- Defaults to latest (Cancun) with all EIPs enabled
- Note: BASEFEE opcode is part of London hardfork, not a separate EIP flag

**go-ethereum**:
- Complex ChainConfig with block numbers
- Rules derived from config and block
- More runtime flexibility

**revm**:
- SpecId enum for hardfork identification
- Minimal configuration surface
- Performance-oriented settings

**evmone**:
- EVMC revision enum
- Configuration through options
- Minimal overhead

#### 2. State Management

**Tevm**:
- Simple StateManager pointer
- Read-only flag for static calls
- Clear ownership model

**go-ethereum**:
- StateDB interface with snapshots
- Complex state transitions
- Integrated journaling

**revm**:
- Database traits for flexibility
- Journaled state changes
- Optimized access patterns

**evmone**:
- EVMC host interface
- Minimal state coupling
- Callback-based access

#### 3. Execution Context

**Tevm**:
- Simple depth counter
- Boolean read-only flag
- Explicit blob data fields

**go-ethereum**:
- Separate block/tx contexts
- Complex gas calculations
- Integrated tracing

**revm**:
- Frame-based execution
- Detailed gas tracking
- Handler abstraction

**evmone**:
- Minimal context
- EVMC message struct
- Stack-based execution

### Performance Characteristics

**Tevm Approach**:
- Extensive logging in debug builds
- Clear separation of concerns
- No hidden allocations
- Predictable performance

**Optimization Opportunities**:
1. **Logging**: Conditional compilation for production
2. **Inlining**: Force inline hot paths
3. **Precompiles**: Cache lookups
4. **Rules**: Bitfield for faster checks
5. **Memory**: Pool allocations

## Logging and Debugging

The implementation includes comprehensive logging with a lazy initialization pattern:

1. **Initialization Logging**: Tracks EVM setup
2. **Configuration Logging**: Shows all rule changes
3. **Execution Logging**: Contract calls and context
4. **Error Logging**: Detailed failure information
5. **Gas Logging**: Usage statistics and breakdown

### Logger Pattern

```zig
// Lazy logger initialization
pub fn getLogger(self: *Evm) *Logger {
    if (self.logger == null) {
        self.logger = Logger.getDefault();
    }
    return self.logger.?;
}

// Debug-only execution
pub fn debugOnly(self: *Evm, callback: fn (*Evm) void) void {
    if (@import("builtin").mode == .Debug) {
        callback(self);
    }
}
```

Example log output:
```
╔══════════════════════════════════════════════════════════
║ CALL to contract 0x1234567890
║ Depth: 1, ReadOnly: false
║ Context: Token transfer
║ Chain rules: Cancun=true, Shanghai=true, London=true, Berlin=true
╚══════════════════════════════════════════════════════════
```

## Best Practices

1. **Always Initialize Rules**: Use `ChainRules.forHardfork()` for consistency
2. **Check Depth Limits**: Always handle `DepthLimit` errors
3. **Manage Read-Only**: Set/restore read-only mode correctly
4. **Initialize Precompiles**: Based on chain rules before execution
5. **Use Logging**: Leverage debug logging for development

## Testing Strategy

The implementation includes comprehensive tests:

1. **Initialization Tests**: Default and custom configurations
2. **State Management**: StateManager attachment
3. **Depth Management**: Increment/decrement with limits
4. **Configuration Tests**: All hardfork configurations
5. **Blob Data Tests**: EIP-4844 support
6. **Logging Tests**: Verify log methods compile

**Note**: The `initPrecompiles` test is currently commented out due to a ChainRules type mismatch issue that needs to be resolved.

## Future Enhancements

Based on other implementations:

1. **Tracing Support**: Add execution tracing hooks
2. **Gas Optimization**: Inline gas calculations
3. **Witness Generation**: For stateless clients
4. **EOF Support**: Ethereum Object Format
5. **Performance Mode**: Disable logging in production
6. **Parallel Execution**: Multiple EVM instances

## Conclusion

The Tevm EVM implementation provides a clean, well-documented foundation for Ethereum execution. Its strengths include:

- **Clarity**: Explicit configuration and state management
- **Debugging**: Comprehensive logging support
- **Safety**: No hidden allocations or state
- **Testability**: Easy to test with clear interfaces

While it may not match the raw performance of evmone or the feature completeness of go-ethereum, it excels in maintainability and educational value. The design allows for incremental optimization while preserving its clear structure.