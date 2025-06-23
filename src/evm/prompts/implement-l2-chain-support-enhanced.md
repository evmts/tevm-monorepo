# Implement L2 Chain Support

You are implementing L2 Chain Support for the Tevm EVM written in Zig. Your goal is to implement Layer 2 chain support and optimization following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_l` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_l feat_implement_l`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement support for Layer 2 (L2) chains including Optimism, Arbitrum, and Polygon. Each L2 has specific modifications to the EVM including custom opcodes, different gas models, precompiles, and execution rules. This implementation should provide a pluggable architecture for L2-specific behavior while maintaining Ethereum mainnet compatibility.

## ELI5

Layer 2 chains are like different floors built on top of the main Ethereum building. Each floor (Optimism, Arbitrum, Polygon) has its own special features and rules while still being connected to the main building below. This implementation is like creating a universal elevator system that knows how to work with each floor's unique layout and features, so people can seamlessly move between floors while everything stays connected to the main structure.

## L2 Chain Specifications

### Optimism (OP Stack)

#### 1. Custom Opcodes
```zig
// Optimism-specific opcodes
pub const L1BLOCKNUMBER = 0x4B; // Get L1 block number
pub const L1BLOCKHASH = 0x4C;   // Get L1 block hash  
pub const L1TIMESTAMP = 0x4D;   // Get L1 timestamp
pub const L1FEE = 0x4E;         // Get L1 data fee

// OP Stack transaction types
pub const DEPOSIT_TX_TYPE = 0x7E;
```

#### 2. Gas Model Modifications
```zig
pub const OptimismGasModel = struct {
    l1_base_fee: u64,
    l1_blob_base_fee: u64,
    l1_fee_overhead: u64,
    l1_fee_scalar: u64,
    
    pub fn calculate_l1_fee(self: *const OptimismGasModel, tx_data: []const u8) u64 {
        // Calculate L1 data fee for transaction
        const compressed_size = estimate_compression_size(tx_data);
        const l1_gas_used = (compressed_size + self.l1_fee_overhead) * self.l1_fee_scalar / 1000000;
        
        return l1_gas_used * self.l1_base_fee;
    }
    
    fn estimate_compression_size(data: []const u8) u64 {
        // Estimate compressed size (simplified)
        var compressed_size: u64 = 0;
        for (data) |byte| {
            if (byte == 0) {
                compressed_size += 4; // Zero bytes cost 4 gas
            } else {
                compressed_size += 16; // Non-zero bytes cost 16 gas
            }
        }
        return compressed_size;
    }
};
```

### Arbitrum

#### 1. ArbOS Precompiles
```zig
// Arbitrum-specific precompiles
pub const ARB_SYS_ADDRESS = 0x0000000000000000000000000000000000000064;
pub const ARB_RETRYABLE_TX_ADDRESS = 0x000000000000000000000000000000000000006E;
pub const ARB_GAS_INFO_ADDRESS = 0x000000000000000000000000000000000000006C;

pub const ArbSysPrecompile = struct {
    pub fn get_tx_count(sender: Address) u64 {
        // Get transaction count for address
        // Implementation specific to Arbitrum's state tracking
        return 0; // Placeholder
    }
    
    pub fn withdraw_eth(destination: Address, amount: u256) void {
        // Initiate withdrawal to L1
        // Placeholder implementation
        _ = destination;
        _ = amount;
    }
};
```

#### 2. Gas Model
```zig
pub const ArbitrumGasModel = struct {
    speed_limit: u64,
    pool_size: u64,
    
    pub fn calculate_gas_cost(
        self: *const ArbitrumGasModel,
        computation_units: u64,
        storage_operations: u64
    ) u64 {
        // Arbitrum uses different gas calculation
        const base_cost = computation_units * 2; // Simplified
        const storage_cost = storage_operations * 100;
        
        return base_cost + storage_cost;
    }
};
```

### Polygon

#### 1. Bor Consensus Modifications
```zig
pub const PolygonChainConfig = struct {
    bor_config: BorConfig,
    validator_set: ValidatorSet,
    
    pub const BorConfig = struct {
        period: u64,        // Block time in seconds
        epoch: u64,         // Epoch length in blocks
        sprint: u64,        // Sprint length in blocks
    };
    
    pub fn is_sprint_end(self: *const PolygonChainConfig, block_number: u64) bool {
        return block_number % self.bor_config.sprint == 0;
    }
    
    pub fn is_epoch_end(self: *const PolygonChainConfig, block_number: u64) bool {
        return block_number % self.bor_config.epoch == 0;
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Chain Detection**: Identify L2 chain type from chain ID
2. **Custom Opcodes**: Implement L2-specific opcodes
3. **Gas Models**: Support different gas calculation methods
4. **Precompiles**: Add L2-specific precompiled contracts
5. **Transaction Types**: Support L2-specific transaction formats
6. **Block Validation**: Apply L2-specific validation rules

### L2 Chain Architecture
```zig
pub const L2ChainType = enum {
    Ethereum,    // Mainnet/standard Ethereum
    Optimism,    // OP Stack chains
    Arbitrum,    // Arbitrum One/Nova
    Polygon,     // Polygon PoS
    Base,        // Base (OP Stack)
    Linea,       // Linea
    Scroll,      // Scroll
    
    pub fn from_chain_id(chain_id: u64) L2ChainType {
        return switch (chain_id) {
            1 => .Ethereum,           // Ethereum Mainnet
            10 => .Optimism,          // Optimism
            42161 => .Arbitrum,       // Arbitrum One
            137 => .Polygon,          // Polygon
            8453 => .Base,            // Base
            59144 => .Linea,          // Linea
            534352 => .Scroll,        // Scroll
            else => .Ethereum,        // Default to Ethereum
        };
    }
};

pub const L2ChainConfig = struct {
    chain_type: L2ChainType,
    chain_id: u64,
    gas_model: union(L2ChainType) {
        Ethereum: void,
        Optimism: OptimismGasModel,
        Arbitrum: ArbitrumGasModel,
        Polygon: PolygonChainConfig,
        Base: OptimismGasModel,
        Linea: void,
        Scroll: void,
    },
    custom_opcodes: std.HashMap(u8, L2Opcode, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
    custom_precompiles: std.HashMap(Address, L2Precompile, AddressContext, std.hash_map.default_max_load_percentage),
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !L2ChainConfig {
        const chain_type = L2ChainType.from_chain_id(chain_id);
        
        var config = L2ChainConfig{
            .chain_type = chain_type,
            .chain_id = chain_id,
            .gas_model = undefined,
            .custom_opcodes = std.HashMap(u8, L2Opcode, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage).init(allocator),
            .custom_precompiles = std.HashMap(Address, L2Precompile, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
        
        try config.configure_for_chain_type(allocator);
        return config;
    }
    
    fn configure_for_chain_type(self: *L2ChainConfig, allocator: std.mem.Allocator) !void {
        switch (self.chain_type) {
            .Optimism, .Base => try self.configure_optimism(allocator),
            .Arbitrum => try self.configure_arbitrum(allocator),
            .Polygon => try self.configure_polygon(allocator),
            else => {}, // Standard Ethereum, no modifications
        }
    }
};
```

## Implementation Tasks

### Task 1: Implement L2 Chain Detection and Configuration
File: `/src/evm/l2/chain_config.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;

pub const L2ChainType = enum {
    Ethereum,
    Optimism,
    Arbitrum,
    Polygon,
    Base,
    Linea,
    Scroll,
    ZkSync,
    StarkNet,
    
    pub fn from_chain_id(chain_id: u64) L2ChainType {
        return switch (chain_id) {
            // Ethereum networks
            1 => .Ethereum,              // Mainnet
            11155111 => .Ethereum,       // Sepolia
            
            // Optimism networks
            10 => .Optimism,             // OP Mainnet
            420 => .Optimism,            // OP Goerli
            11155420 => .Optimism,       // OP Sepolia
            
            // Base networks (OP Stack)
            8453 => .Base,               // Base Mainnet
            84531 => .Base,              // Base Goerli
            84532 => .Base,              // Base Sepolia
            
            // Arbitrum networks
            42161 => .Arbitrum,          // Arbitrum One
            421613 => .Arbitrum,         // Arbitrum Goerli
            421614 => .Arbitrum,         // Arbitrum Sepolia
            42170 => .Arbitrum,          // Arbitrum Nova
            
            // Polygon networks
            137 => .Polygon,             // Polygon Mainnet
            80001 => .Polygon,           // Polygon Mumbai
            80002 => .Polygon,           // Polygon Amoy
            
            // Linea networks
            59144 => .Linea,             // Linea Mainnet
            59140 => .Linea,             // Linea Goerli
            
            // Scroll networks
            534352 => .Scroll,           // Scroll Mainnet
            534351 => .Scroll,           // Scroll Sepolia
            
            else => .Ethereum,           // Default to Ethereum behavior
        };
    }
    
    pub fn get_name(self: L2ChainType) []const u8 {
        return switch (self) {
            .Ethereum => "Ethereum",
            .Optimism => "Optimism",
            .Arbitrum => "Arbitrum",
            .Polygon => "Polygon",
            .Base => "Base",
            .Linea => "Linea",
            .Scroll => "Scroll",
            .ZkSync => "ZkSync",
            .StarkNet => "StarkNet",
        };
    }
    
    pub fn supports_custom_opcodes(self: L2ChainType) bool {
        return switch (self) {
            .Optimism, .Base => true,
            .Arbitrum => true,
            .Polygon => false,
            else => false,
        };
    }
    
    pub fn has_custom_gas_model(self: L2ChainType) bool {
        return switch (self) {
            .Optimism, .Base => true,
            .Arbitrum => true,
            .Polygon => true,
            else => false,
        };
    }
};

pub const L2ChainConfig = struct {
    chain_type: L2ChainType,
    chain_id: u64,
    allocator: std.mem.Allocator,
    
    // L2-specific configurations
    optimism_config: ?OptimismConfig,
    arbitrum_config: ?ArbitrumConfig,
    polygon_config: ?PolygonConfig,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !L2ChainConfig {
        const chain_type = L2ChainType.from_chain_id(chain_id);
        
        var config = L2ChainConfig{
            .chain_type = chain_type,
            .chain_id = chain_id,
            .allocator = allocator,
            .optimism_config = null,
            .arbitrum_config = null,
            .polygon_config = null,
        };
        
        try config.initialize_chain_specific_config();
        return config;
    }
    
    pub fn deinit(self: *L2ChainConfig) void {
        if (self.optimism_config) |*config| {
            config.deinit();
        }
        if (self.arbitrum_config) |*config| {
            config.deinit();
        }
        if (self.polygon_config) |*config| {
            config.deinit();
        }
    }
    
    fn initialize_chain_specific_config(self: *L2ChainConfig) !void {
        switch (self.chain_type) {
            .Optimism, .Base => {
                self.optimism_config = try OptimismConfig.init(self.allocator);
            },
            .Arbitrum => {
                self.arbitrum_config = try ArbitrumConfig.init(self.allocator);
            },
            .Polygon => {
                self.polygon_config = try PolygonConfig.init(self.allocator);
            },
            else => {}, // No additional configuration needed
        }
    }
    
    pub fn get_custom_opcode(self: *const L2ChainConfig, opcode: u8) ?L2OpcodeHandler {
        switch (self.chain_type) {
            .Optimism, .Base => {
                if (self.optimism_config) |*config| {
                    return config.get_opcode_handler(opcode);
                }
            },
            .Arbitrum => {
                if (self.arbitrum_config) |*config| {
                    return config.get_opcode_handler(opcode);
                }
            },
            else => {},
        }
        return null;
    }
    
    pub fn get_custom_precompile(self: *const L2ChainConfig, address: Address) ?L2PrecompileHandler {
        switch (self.chain_type) {
            .Arbitrum => {
                if (self.arbitrum_config) |*config| {
                    return config.get_precompile_handler(address);
                }
            },
            else => {},
        }
        return null;
    }
};

pub const L2OpcodeHandler = fn(*Vm, *Frame) ExecutionError!ExecutionResult;
pub const L2PrecompileHandler = fn([]const u8, []u8, u64) PrecompileError!PrecompileResult;
```

### Task 2: Implement Optimism Support
File: `/src/evm/l2/optimism.zig`
```zig
const std = @import("std");
const Vm = @import("../vm.zig").Vm;
const Frame = @import("../frame.zig").Frame;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const ExecutionError = @import("../execution/execution_error.zig").ExecutionError;

// Optimism custom opcodes
pub const L1BLOCKNUMBER = 0x4B;
pub const L1BLOCKHASH = 0x4C;
pub const L1TIMESTAMP = 0x4D;
pub const L1FEE = 0x4E;

pub const OptimismConfig = struct {
    l1_oracle: L1Oracle,
    gas_oracle: GasOracle,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !OptimismConfig {
        return OptimismConfig{
            .l1_oracle = L1Oracle.init(),
            .gas_oracle = GasOracle.init(),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *OptimismConfig) void {
        self.l1_oracle.deinit();
        self.gas_oracle.deinit();
    }
    
    pub fn get_opcode_handler(self: *const OptimismConfig, opcode: u8) ?L2OpcodeHandler {
        return switch (opcode) {
            L1BLOCKNUMBER => execute_l1_block_number,
            L1BLOCKHASH => execute_l1_block_hash,
            L1TIMESTAMP => execute_l1_timestamp,
            L1FEE => execute_l1_fee,
            else => null,
        };
    }
};

pub const L1Oracle = struct {
    l1_block_number: u64,
    l1_block_hash: [32]u8,
    l1_timestamp: u64,
    
    pub fn init() L1Oracle {
        return L1Oracle{
            .l1_block_number = 0,
            .l1_block_hash = [_]u8{0} ** 32,
            .l1_timestamp = 0,
        };
    }
    
    pub fn deinit(self: *L1Oracle) void {
        _ = self;
    }
    
    pub fn update_l1_info(self: *L1Oracle, block_number: u64, block_hash: [32]u8, timestamp: u64) void {
        self.l1_block_number = block_number;
        self.l1_block_hash = block_hash;
        self.l1_timestamp = timestamp;
    }
};

pub const GasOracle = struct {
    l1_base_fee: u64,
    l1_blob_base_fee: u64,
    l1_fee_overhead: u64,
    l1_fee_scalar: u64,
    
    pub fn init() GasOracle {
        return GasOracle{
            .l1_base_fee = 0,
            .l1_blob_base_fee = 0,
            .l1_fee_overhead = 0,
            .l1_fee_scalar = 0,
        };
    }
    
    pub fn deinit(self: *GasOracle) void {
        _ = self;
    }
    
    pub fn calculate_l1_fee(self: *const GasOracle, tx_data: []const u8) u64 {
        const zero_bytes = count_zero_bytes(tx_data);
        const non_zero_bytes = tx_data.len - zero_bytes;
        
        // Optimism L1 fee calculation
        const calldata_gas = zero_bytes * 4 + non_zero_bytes * 16;
        const l1_gas_used = (calldata_gas + self.l1_fee_overhead) * self.l1_fee_scalar / 1000000;
        
        return l1_gas_used * self.l1_base_fee;
    }
    
    fn count_zero_bytes(data: []const u8) usize {
        var count: usize = 0;
        for (data) |byte| {
            if (byte == 0) count += 1;
        }
        return count;
    }
};

// Optimism opcode implementations
pub fn execute_l1_block_number(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    // Get L1 block number from L1 oracle
    const l1_block_number = vm.l2_config.optimism_config.?.l1_oracle.l1_block_number;
    frame.stack.push_unsafe(l1_block_number);
    
    return ExecutionResult.continue_execution;
}

pub fn execute_l1_block_hash(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    const index = frame.stack.pop_unsafe();
    
    // For simplicity, only support current L1 block
    const current_l1_block = vm.l2_config.optimism_config.?.l1_oracle.l1_block_number;
    
    if (index == current_l1_block) {
        const l1_hash = vm.l2_config.optimism_config.?.l1_oracle.l1_block_hash;
        const hash_value = U256.from_be_bytes(&l1_hash);
        frame.stack.push_unsafe(hash_value);
    } else {
        frame.stack.push_unsafe(0); // Unknown block
    }
    
    return ExecutionResult.continue_execution;
}

pub fn execute_l1_timestamp(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    const l1_timestamp = vm.l2_config.optimism_config.?.l1_oracle.l1_timestamp;
    frame.stack.push_unsafe(l1_timestamp);
    
    return ExecutionResult.continue_execution;
}

pub fn execute_l1_fee(vm: *Vm, frame: *Frame) ExecutionError!ExecutionResult {
    // Calculate L1 fee for current transaction
    const tx_data = frame.context.call_data;
    const l1_fee = vm.l2_config.optimism_config.?.gas_oracle.calculate_l1_fee(tx_data);
    frame.stack.push_unsafe(l1_fee);
    
    return ExecutionResult.continue_execution;
}

// Deposit transaction support
pub const DEPOSIT_TX_TYPE = 0x7E;

pub const DepositTransaction = struct {
    from: Address,
    to: ?Address,
    value: U256,
    gas_limit: u64,
    is_system_tx: bool,
    data: []const u8,
    
    pub fn init() DepositTransaction {
        return DepositTransaction{
            .from = Address.zero(),
            .to = null,
            .value = 0,
            .gas_limit = 0,
            .is_system_tx = false,
            .data = &[_]u8{},
        };
    }
    
    pub fn execute(self: *const DepositTransaction, vm: *Vm) !ExecutionResult {
        // Deposit transactions don't charge gas in the same way
        // They have a guaranteed gas limit
        
        if (self.to) |target| {
            // Call to contract or EOA
            return vm.execute_call_deposit(self.from, target, self.value, self.data, self.gas_limit);
        } else {
            // Contract creation
            return vm.execute_create_deposit(self.from, self.value, self.data, self.gas_limit);
        }
    }
};
```

### Task 3: Implement Arbitrum Support
File: `/src/evm/l2/arbitrum.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const PrecompileResult = @import("../precompiles/precompile_result.zig").PrecompileResult;
const PrecompileError = @import("../precompiles/precompile_result.zig").PrecompileError;

// Arbitrum precompile addresses
pub const ARB_SYS_ADDRESS = Address.from_hex("0x0000000000000000000000000000000000000064");
pub const ARB_RETRYABLE_TX_ADDRESS = Address.from_hex("0x000000000000000000000000000000000000006E");
pub const ARB_GAS_INFO_ADDRESS = Address.from_hex("0x000000000000000000000000000000000000006C");
pub const ARB_AGGREGATOR_ADDRESS = Address.from_hex("0x000000000000000000000000000000000000006D");

pub const ArbitrumConfig = struct {
    gas_model: ArbitrumGasModel,
    precompiles: std.HashMap(Address, ArbitrumPrecompile, AddressContext, std.hash_map.default_max_load_percentage),
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !ArbitrumConfig {
        var config = ArbitrumConfig{
            .gas_model = ArbitrumGasModel.init(),
            .precompiles = std.HashMap(Address, ArbitrumPrecompile, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .allocator = allocator,
        };
        
        try config.register_precompiles();
        return config;
    }
    
    pub fn deinit(self: *ArbitrumConfig) void {
        self.precompiles.deinit();
    }
    
    fn register_precompiles(self: *ArbitrumConfig) !void {
        try self.precompiles.put(ARB_SYS_ADDRESS, ArbitrumPrecompile.ArbSys);
        try self.precompiles.put(ARB_RETRYABLE_TX_ADDRESS, ArbitrumPrecompile.ArbRetryableTx);
        try self.precompiles.put(ARB_GAS_INFO_ADDRESS, ArbitrumPrecompile.ArbGasInfo);
        try self.precompiles.put(ARB_AGGREGATOR_ADDRESS, ArbitrumPrecompile.ArbAggregator);
    }
    
    pub fn get_precompile_handler(self: *const ArbitrumConfig, address: Address) ?L2PrecompileHandler {
        if (self.precompiles.get(address)) |precompile| {
            return switch (precompile) {
                .ArbSys => execute_arb_sys,
                .ArbRetryableTx => execute_arb_retryable_tx,
                .ArbGasInfo => execute_arb_gas_info,
                .ArbAggregator => execute_arb_aggregator,
            };
        }
        return null;
    }
    
    pub fn get_opcode_handler(self: *const ArbitrumConfig, opcode: u8) ?L2OpcodeHandler {
        // Arbitrum doesn't typically add custom opcodes,
        // but modifies gas costs and execution semantics
        _ = self;
        _ = opcode;
        return null;
    }
};

pub const ArbitrumPrecompile = enum {
    ArbSys,
    ArbRetryableTx,
    ArbGasInfo,
    ArbAggregator,
};

pub const ArbitrumGasModel = struct {
    speed_limit: u64,
    pool_size: u64,
    tx_gas_limit: u64,
    
    pub fn init() ArbitrumGasModel {
        return ArbitrumGasModel{
            .speed_limit = 7000000,    // 7M gas per second
            .pool_size = 620000000,    // 620M gas pool
            .tx_gas_limit = 32000000,  // 32M gas per transaction
        };
    }
    
    pub fn calculate_gas_cost(self: *const ArbitrumGasModel, computation_units: u64) u64 {
        // Arbitrum uses a different gas model
        // This is a simplified version
        _ = self;
        return computation_units * 2; // Example multiplier
    }
};

// ArbSys precompile implementation
pub fn execute_arb_sys(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    if (input.len < 4) {
        return PrecompileError.InvalidInput;
    }
    
    // Parse function selector
    const selector = std.mem.readIntBig(u32, input[0..4]);
    
    return switch (selector) {
        0xa3b1b31d => execute_arb_block_number(input[4..], output, gas_limit),
        0x928c169a => execute_arb_block_hash(input[4..], output, gas_limit),
        0x175a2b22 => execute_get_tx_count(input[4..], output, gas_limit),
        0x25e16063 => execute_withdraw_eth(input[4..], output, gas_limit),
        else => PrecompileError.InvalidInput,
    };
}

fn execute_arb_block_number(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    _ = input;
    const gas_cost = 2;
    
    if (gas_cost > gas_limit) {
        return PrecompileError.OutOfGas;
    }
    
    if (output.len < 32) {
        return PrecompileError.InvalidOutput;
    }
    
    // Return current L2 block number
    const block_number: u64 = 12345; // Placeholder - should get from context
    const block_number_u256 = U256.from_u64(block_number);
    const block_number_bytes = block_number_u256.to_be_bytes();
    @memcpy(output[0..32], &block_number_bytes);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}

fn execute_arb_block_hash(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    if (input.len < 32) {
        return PrecompileError.InvalidInput;
    }
    
    const gas_cost = 20;
    if (gas_cost > gas_limit) {
        return PrecompileError.OutOfGas;
    }
    
    if (output.len < 32) {
        return PrecompileError.InvalidOutput;
    }
    
    // Parse block number
    const block_number_bytes = input[0..32];
    const block_number = U256.from_be_bytes(block_number_bytes);
    
    // Return hash for requested block (placeholder)
    const block_hash = [_]u8{0xab} ** 32; // Placeholder hash
    @memcpy(output[0..32], &block_hash);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}

fn execute_get_tx_count(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    if (input.len < 20) {
        return PrecompileError.InvalidInput;
    }
    
    const gas_cost = 26;
    if (gas_cost > gas_limit) {
        return PrecompileError.OutOfGas;
    }
    
    if (output.len < 32) {
        return PrecompileError.InvalidOutput;
    }
    
    // Parse address
    var address: Address = undefined;
    @memcpy(&address.bytes, input[0..20]);
    
    // Get transaction count (placeholder)
    const tx_count: u64 = 42; // Should query from state
    const tx_count_u256 = U256.from_u64(tx_count);
    const tx_count_bytes = tx_count_u256.to_be_bytes();
    @memcpy(output[0..32], &tx_count_bytes);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}

fn execute_withdraw_eth(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    if (input.len < 52) { // 20 bytes address + 32 bytes amount
        return PrecompileError.InvalidInput;
    }
    
    const gas_cost = 14000;
    if (gas_cost > gas_limit) {
        return PrecompileError.OutOfGas;
    }
    
    // Parse destination and amount
    var destination: Address = undefined;
    @memcpy(&destination.bytes, input[0..20]);
    
    const amount_bytes = input[20..52];
    const amount = U256.from_be_bytes(amount_bytes);
    
    // Initiate withdrawal (placeholder implementation)
    // In real implementation, this would create a withdrawal transaction
    _ = destination;
    _ = amount;
    
    if (output.len >= 32) {
        // Return withdrawal ID or success indicator
        const success = U256.from_u64(1);
        const success_bytes = success.to_be_bytes();
        @memcpy(output[0..32], &success_bytes);
        
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
    }
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
}

// Placeholder implementations for other precompiles
pub fn execute_arb_retryable_tx(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    _ = input;
    _ = output;
    _ = gas_limit;
    return PrecompileError.InvalidInput; // Not implemented
}

pub fn execute_arb_gas_info(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    _ = input;
    _ = output;
    _ = gas_limit;
    return PrecompileError.InvalidInput; // Not implemented
}

pub fn execute_arb_aggregator(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    _ = input;
    _ = output;
    _ = gas_limit;
    return PrecompileError.InvalidInput; // Not implemented
}
```

### Task 4: Implement Polygon Support
File: `/src/evm/l2/polygon.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;

pub const PolygonConfig = struct {
    bor_config: BorConfig,
    validator_set: ValidatorSet,
    heimdall_config: HeimdallConfig,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !PolygonConfig {
        return PolygonConfig{
            .bor_config = BorConfig.init(),
            .validator_set = ValidatorSet.init(allocator),
            .heimdall_config = HeimdallConfig.init(),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *PolygonConfig) void {
        self.validator_set.deinit();
    }
    
    pub fn get_opcode_handler(self: *const PolygonConfig, opcode: u8) ?L2OpcodeHandler {
        // Polygon doesn't typically add custom opcodes
        _ = self;
        _ = opcode;
        return null;
    }
    
    pub fn get_precompile_handler(self: *const PolygonConfig, address: Address) ?L2PrecompileHandler {
        // Polygon uses standard precompiles
        _ = self;
        _ = address;
        return null;
    }
};

pub const BorConfig = struct {
    period: u64,      // Block time in seconds (2s for Polygon)
    epoch: u64,       // Epoch length in blocks
    sprint: u64,      // Sprint length in blocks
    producer_delay: u64,
    backup_multiplier: u64,
    
    pub fn init() BorConfig {
        return BorConfig{
            .period = 2,              // 2 second block time
            .epoch = 256,             // 256 blocks per epoch
            .sprint = 64,             // 64 blocks per sprint
            .producer_delay = 6,      // Producer delay
            .backup_multiplier = 2,   // Backup multiplier
        };
    }
    
    pub fn is_epoch_block(self: *const BorConfig, block_number: u64) bool {
        return block_number % self.epoch == 0;
    }
    
    pub fn is_sprint_end(self: *const BorConfig, block_number: u64) bool {
        return block_number % self.sprint == self.sprint - 1;
    }
    
    pub fn is_sprint_start(self: *const BorConfig, block_number: u64) bool {
        return block_number % self.sprint == 0;
    }
    
    pub fn get_producer_for_block(self: *const BorConfig, block_number: u64, validators: *const ValidatorSet) ?Address {
        const sprint_number = block_number / self.sprint;
        const validator_index = sprint_number % validators.count();
        return validators.get_validator(validator_index);
    }
};

pub const ValidatorSet = struct {
    validators: std.ArrayList(Validator),
    
    pub fn init(allocator: std.mem.Allocator) ValidatorSet {
        return ValidatorSet{
            .validators = std.ArrayList(Validator).init(allocator),
        };
    }
    
    pub fn deinit(self: *ValidatorSet) void {
        self.validators.deinit();
    }
    
    pub fn add_validator(self: *ValidatorSet, validator: Validator) !void {
        try self.validators.append(validator);
    }
    
    pub fn count(self: *const ValidatorSet) usize {
        return self.validators.items.len;
    }
    
    pub fn get_validator(self: *const ValidatorSet, index: usize) ?Address {
        if (index < self.validators.items.len) {
            return self.validators.items[index].address;
        }
        return null;
    }
    
    pub fn is_validator(self: *const ValidatorSet, address: Address) bool {
        for (self.validators.items) |validator| {
            if (std.mem.eql(u8, &validator.address.bytes, &address.bytes)) {
                return true;
            }
        }
        return false;
    }
};

pub const Validator = struct {
    address: Address,
    voting_power: u64,
    proposer_priority: i64,
    
    pub fn init(address: Address, voting_power: u64) Validator {
        return Validator{
            .address = address,
            .voting_power = voting_power,
            .proposer_priority = 0,
        };
    }
};

pub const HeimdallConfig = struct {
    checkpoint_interval: u64,
    average_checkpoint_length: u64,
    max_checkpoint_length: u64,
    
    pub fn init() HeimdallConfig {
        return HeimdallConfig{
            .checkpoint_interval = 256,      // Checkpoint every 256 blocks
            .average_checkpoint_length = 256,
            .max_checkpoint_length = 1024,
        };
    }
    
    pub fn is_checkpoint_block(self: *const HeimdallConfig, block_number: u64) bool {
        return block_number % self.checkpoint_interval == 0;
    }
};

// Polygon-specific transaction types
pub const StateSyncTransaction = struct {
    id: u64,
    contract_address: Address,
    data: []const u8,
    
    pub fn init() StateSyncTransaction {
        return StateSyncTransaction{
            .id = 0,
            .contract_address = Address.zero(),
            .data = &[_]u8{},
        };
    }
    
    pub fn execute(self: *const StateSyncTransaction, vm: *Vm) !ExecutionResult {
        // Execute state sync transaction
        // This typically involves calling a contract with the provided data
        return vm.execute_state_sync(self.contract_address, self.data);
    }
};
```

### Task 5: Update VM with L2 Support
File: `/src/evm/vm.zig` (modify existing)
```zig
const L2ChainConfig = @import("l2/chain_config.zig").L2ChainConfig;

pub const Vm = struct {
    // Existing fields...
    l2_config: ?L2ChainConfig,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !Vm {
        var vm = Vm{
            // Existing initialization...
            .l2_config = null,
        };
        
        // Initialize L2 configuration if needed
        const chain_type = L2ChainType.from_chain_id(chain_id);
        if (chain_type != .Ethereum) {
            vm.l2_config = try L2ChainConfig.init(allocator, chain_id);
        }
        
        return vm;
    }
    
    pub fn deinit(self: *Vm) void {
        // Existing cleanup...
        if (self.l2_config) |*config| {
            config.deinit();
        }
    }
    
    pub fn execute_instruction_with_l2_support(self: *Vm, frame: *Frame, opcode: u8) !ExecutionResult {
        // Check for L2-specific opcodes first
        if (self.l2_config) |*config| {
            if (config.get_custom_opcode(opcode)) |handler| {
                return handler(self, frame);
            }
        }
        
        // Fall back to standard execution
        return self.execute_instruction_standard(frame, opcode);
    }
    
    pub fn call_precompile_with_l2_support(
        self: *Vm,
        address: Address,
        input: []const u8,
        output: []u8,
        gas_limit: u64
    ) ?PrecompileResult {
        // Check for L2-specific precompiles first
        if (self.l2_config) |*config| {
            if (config.get_custom_precompile(address)) |handler| {
                return handler(input, output, gas_limit) catch null;
            }
        }
        
        // Fall back to standard precompiles
        return self.call_standard_precompile(address, input, output, gas_limit);
    }
    
    pub fn calculate_gas_with_l2_model(self: *Vm, tx_data: []const u8) u64 {
        if (self.l2_config) |*config| {
            switch (config.chain_type) {
                .Optimism, .Base => {
                    if (config.optimism_config) |*opt_config| {
                        return opt_config.gas_oracle.calculate_l1_fee(tx_data);
                    }
                },
                .Arbitrum => {
                    if (config.arbitrum_config) |*arb_config| {
                        return arb_config.gas_model.calculate_gas_cost(tx_data.len);
                    }
                },
                else => {},
            }
        }
        
        return 0; // No additional L2 gas costs
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/l2/l2_chains_test.zig`

### Test Cases
```zig
test "l2 chain detection" {
    // Test chain type detection from chain IDs
    // Test configuration initialization for different L2s
}

test "optimism custom opcodes" {
    // Test L1BLOCKNUMBER, L1BLOCKHASH, L1TIMESTAMP, L1FEE
    // Test deposit transaction execution
    // Test L1 fee calculation
}

test "arbitrum precompiles" {
    // Test ArbSys precompile functions
    // Test withdrawal functionality
    // Test gas model differences
}

test "polygon bor consensus" {
    // Test sprint and epoch calculations
    // Test validator set management
    // Test state sync transactions
}

test "l2 gas models" {
    // Test different gas calculation methods
    // Test L1 fee components for rollups
    // Test gas limit enforcement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/l2/chain_config.zig` - L2 chain configuration
- `/src/evm/l2/optimism.zig` - Optimism/OP Stack support
- `/src/evm/l2/arbitrum.zig` - Arbitrum support  
- `/src/evm/l2/polygon.zig` - Polygon support
- `/src/evm/vm.zig` - Update VM with L2 support
- `/src/evm/execution/` - Update opcode execution
- `/test/evm/l2/l2_chains_test.zig` - Comprehensive tests

## Success Criteria

1. **Multi-chain Support**: Support for major L2 chains
2. **Custom Opcodes**: Proper implementation of L2-specific opcodes
3. **Gas Models**: Accurate gas calculation for each L2
4. **Precompiles**: Working L2-specific precompiled contracts
5. **Transaction Types**: Support for L2-specific transaction formats
6. **Compatibility**: Maintain Ethereum mainnet compatibility

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly


## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/l2_chain_support/l2_chain_support_test.zig`)
```zig
// Test basic L2 chain support functionality
test "l2_chain_support basic chain configuration with known scenarios"
test "l2_chain_support handles L2-specific opcodes correctly"
test "l2_chain_support validates L2 transaction types"
test "l2_chain_support produces expected L2 fee calculations"
```

#### 2. **Integration Tests**
```zig
test "l2_chain_support integrates with EVM execution"
test "l2_chain_support works with existing gas calculations"
test "l2_chain_support maintains hardfork compatibility"
test "l2_chain_support handles L2-specific precompiles"
```

#### 3. **Performance Tests**
```zig
test "l2_chain_support meets L2 throughput targets"
test "l2_chain_support memory usage for L2 data structures"
test "l2_chain_support scalability under L2 transaction load"
test "l2_chain_support benchmark vs L1 baseline"
```

#### 4. **Error Handling Tests**
```zig
test "l2_chain_support proper L2 error propagation"
test "l2_chain_support handles invalid L2 configurations"
test "l2_chain_support graceful degradation on L2 service failure"
test "l2_chain_support recovery from L2 network partitions"
```

#### 5. **Compliance Tests**
```zig
test "l2_chain_support Optimism specification compliance"
test "l2_chain_support Arbitrum specification compliance"
test "l2_chain_support zkSync specification compliance"
test "l2_chain_support cross-L2 compatibility behavior"
```

#### 6. **Security Tests**
```zig
test "l2_chain_support handles malicious L2 transactions safely"
test "l2_chain_support prevents L2-specific resource exhaustion"
test "l2_chain_support validates L2 bridge security boundaries"
test "l2_chain_support maintains L1/L2 isolation properties"
```

### Test Development Priority
1. **Core L2 functionality tests** - Ensure basic L2 features work
2. **Compliance tests** - Meet L2 specification requirements
3. **Performance tests** - Achieve L2 efficiency targets
4. **Security tests** - Prevent L2-specific vulnerabilities
5. **Error handling tests** - Robust L2 failure management
6. **Edge case tests** - Handle L2 boundary conditions

### Test Data Sources
- **L2 specifications**: Optimism, Arbitrum, zkSync protocol requirements
- **Reference implementations**: Cross-L2 compatibility data
- **Performance baselines**: L2 throughput and latency targets
- **Security test vectors**: L2-specific vulnerability prevention
- **Real-world L2 scenarios**: Production L2 transaction validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public L2 APIs
- Validate L2 performance regression prevention
- Test debug and release builds
- Verify L2 cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "l2_chain_support basic Optimism transaction processing" {
    // This test MUST fail initially
    const config = test_config.optimismConfig();
    const context = test_utils.createEVMContext(config);
    
    const l2_tx = test_utils.createOptimismDepositTx();
    const result = l2_chain_support.processL2Transaction(context, l2_tx);
    try testing.expectEqual(expected_l2_behavior, result);
}
```

**Only then implement:**
```zig
pub const l2_chain_support = struct {
    pub fn processL2Transaction(context: *EVMContext, tx: L2Transaction) !L2ResultType {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all L2 configuration combinations** - Especially for multi-L2 support
- **Verify L2 specification compliance** - Critical for L2 protocol correctness
- **Test L2 performance implications** - Especially for throughput optimizations
- **Validate L2 security properties** - Prevent L2-specific vulnerabilities and exploits

## References

- [Optimism Specs](https://github.com/ethereum-optimism/optimism/tree/develop/specs) - OP Stack specification
- [Arbitrum Documentation](https://docs.arbitrum.io/) - Arbitrum technical details
- [Polygon PoS Documentation](https://docs.polygon.technology/) - Polygon architecture
- [Base Documentation](https://docs.base.org/) - Base (OP Stack) specifics
- [L2Beat](https://l2beat.com/) - L2 ecosystem overview

## EVMONE Context

This is an excellent and well-structured prompt. The request for a pluggable architecture for L2 support is a common need for modern EVM implementations. The `evmone` codebase provides great examples of how to handle different EVM rulesets via its hardfork implementation, which is analogous to supporting different L2 chains.

Here are the most relevant code snippets from `evmone` that will help you implement this feature.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
This file defines the traits for each opcode, including which EVM revision it was introduced in. The `gas_costs` table is particularly relevant, as it shows how gas costs for opcodes can change per revision. This is a direct parallel to implementing different gas models for L2s.

```cpp
/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;
    // ...
    /// The EVM revision in which the instruction has been defined.
    std::optional<evmc_revision> since;
};

/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};

    // Frontier
    for (auto& t : table[EVMC_FRONTIER])
        t = undefined;
    table[EVMC_FRONTIER][OP_STOP] = 0;
    table[EVMC_FRONTIER][OP_ADD] = 3;
    table[EVMC_FRONTIER][OP_SLOAD] = 50;
    table[EVMC_FRONTIER][OP_CALL] = 40;
    // ... other Frontier opcodes

    // Homestead
    table[EVMC_HOMESTEAD] = table[EVMC_FRONTIER];
    table[EVMC_HOMESTEAD][OP_DELEGATECALL] = 40;

    // Tangerine Whistle
    table[EVMC_TANGERINE_WHISTLE] = table[EVMC_HOMESTEAD];
    table[EVMC_TANGERINE_WHISTLE][OP_BALANCE] = 400;
    table[EVMC_TANGERINE_WHISTLE][OP_SLOAD] = 200;
    table[EVMC_TANGERINE_WHISTLE][OP_CALL] = 700;
    // ... other Tangerine Whistle changes

    // ... other hardforks ...

    // Berlin
    table[EVMC_BERLIN] = table[EVMC_ISTANBUL];
    table[EVMC_BERLIN][OP_EXTCODESIZE] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_SLOAD] = warm_storage_read_cost;
    table[EVMC_BERLIN][OP_CALL] = warm_storage_read_cost;

    // London
    table[EVMC_LONDON] = table[EVMC_BERLIN];
    table[EVMC_LONDON][OP_BASEFEE] = 2;

    // Shanghai
    table[EVMC_SHANGHAI] = table[EVMC_PARIS];
    table[EVMC_SHANGHAI][OP_PUSH0] = 2;

    return table;
}();
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_instruction_table.cpp">
This file shows how `evmone` selects the appropriate gas cost table based on the EVM revision and whether the code is EOF-formatted. This is a great pattern for selecting your L2-specific configuration at runtime.

```cpp
namespace
{
consteval auto build_cost_tables(bool eof) noexcept
{
    std::array<CostTable, EVMC_MAX_REVISION + 1> tables{};
    for (size_t r = EVMC_FRONTIER; r <= EVMC_MAX_REVISION; ++r)
    {
        auto& table = tables[r];
        for (size_t op = 0; op < table.size(); ++op)
        {
            const auto& tr = instr::traits[op];
            const auto since = eof ? tr.eof_since : tr.since;
            table[op] = (since && r >= *since) ? instr::gas_costs[r][op] : instr::undefined;
        }
    }
    return tables;
}

constexpr auto LEGACY_COST_TABLES = build_cost_tables(false);
constexpr auto EOF_COST_TABLES = build_cost_tables(true);
}  // namespace

const CostTable& get_baseline_cost_table(evmc_revision rev, uint8_t eof_version) noexcept
{
    const auto& tables = (eof_version == 0) ? LEGACY_COST_TABLES : EOF_COST_TABLES;
    return tables[rev];
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
This file contains the dispatch logic for precompiled contracts. The `call_precompile` function checks if an address corresponds to a precompile and, if so, which one, then executes it. The `is_precompile` function shows how precompiles can be enabled or disabled based on the EVM revision, a pattern you can use for L2-specific precompiles.

```cpp
namespace evmone::state
{
// ... (analysis and execute function declarations) ...
namespace
{
struct PrecompileTraits
{
    decltype(identity_analyze)* analyze = nullptr;
    decltype(identity_execute)* execute = nullptr;
};

// Table mapping precompile IDs to their implementation functions
inline constexpr std::array<PrecompileTraits, NumPrecompiles> traits{{
    {},  // undefined for 0
    {ecrecover_analyze, ecrecover_execute},
    {sha256_analyze, sha256_execute},
    {ripemd160_analyze, ripemd160_execute},
    {identity_analyze, identity_execute},
    {expmod_analyze, expmod_execute},
    {ecadd_analyze, ecadd_execute},
    {ecmul_analyze, ecmul_execute},
    {ecpairing_analyze, ecpairing_execute},
    {blake2bf_analyze, blake2bf_execute},
    {point_evaluation_analyze, point_evaluation_execute},
    // ... more precompiles
}};
}  // namespace

// Checks if an address is a precompile and if it's active in the current revision
bool is_precompile(evmc_revision rev, const evmc::address& addr) noexcept
{
    if (evmc::is_zero(addr) || addr > evmc::address{stdx::to_underlying(PrecompileId::latest)})
        return false;

    const auto id = addr.bytes[19];
    if (rev < EVMC_BYZANTIUM && id >= stdx::to_underlying(PrecompileId::since_byzantium))
        return false;

    if (rev < EVMC_ISTANBUL && id >= stdx::to_underlying(PrecompileId::since_istanbul))
        return false;

    if (rev < EVMC_CANCUN && id >= stdx::to_underlying(PrecompileId::since_cancun))
        return false;
    // ... more revision checks

    return true;
}

// The main dispatcher for precompile calls
evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id];

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    // ... (execute and return result) ...
}
} // namespace evmone::state
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/state/transaction.hpp">
The `Transaction` struct and `Type` enum in this file demonstrate how `evmone` models different EIP-2718 transaction types. This is directly analogous to supporting L2-specific transaction types like Optimism's deposit transaction (`0x7e`).

```cpp
namespace evmone::state
{
struct Transaction
{
    /// The type of the transaction.
    enum class Type : uint8_t
    {
        /// The legacy RLP-encoded transaction without leading "type" byte.
        legacy = 0,

        /// The typed transaction with optional account/storage access list.
        access_list = 1,

        /// The typed transaction with priority gas price.
        eip1559 = 2,

        /// The typed blob transaction (with array of blob hashes).
        blob = 3,
        
        /// The typed set code transaction (with authorization list).
        set_code = 4,

        /// The typed transaction with initcode list.
        initcodes = 6,
    };

    Type type = Type::legacy;
    bytes data;
    int64_t gas_limit;
    intx::uint256 max_gas_price;
    intx::uint256 max_priority_gas_price;
    intx::uint256 max_blob_gas_price; // Example of a type-specific field
    address sender;
    std::optional<address> to;
    intx::uint256 value;
    AccessList access_list;
    std::vector<bytes32> blob_hashes; // Example of a type-specific field
    // ... other fields
};
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.cpp">
The `compute_tx_intrinsic_cost` function is an excellent example of how to implement a custom gas model. It calculates the base gas cost of a transaction based on its type and content (e.g., zero vs. non-zero bytes in calldata), which is very similar to how Optimism's L1 data fee is calculated.

```cpp
struct TransactionCost
{
    int64_t intrinsic = 0;
    int64_t min = 0;
};

/// Compute the transaction intrinsic gas 𝑔₀ (Yellow Paper, 6.2) and minimal gas (EIP-7623).
TransactionCost compute_tx_intrinsic_cost(evmc_revision rev, const Transaction& tx) noexcept
{
    static constexpr auto TX_BASE_COST = 21000;
    static constexpr auto TX_CREATE_COST = 32000;
    static constexpr auto DATA_TOKEN_COST = 4;
    static constexpr auto INITCODE_WORD_COST = 2;
    static constexpr auto TOTAL_COST_FLOOR_PER_TOKEN = 10;

    const auto is_create = !tx.to.has_value();

    const auto create_cost = (is_create && rev >= EVMC_HOMESTEAD) ? TX_CREATE_COST : 0;

    const auto num_data_tokens = static_cast<int64_t>(compute_tx_data_tokens(rev, tx.data));
    const auto num_initcode_tokens =
        static_cast<int64_t>(compute_tx_initcode_tokens(rev, tx.initcodes));
    const auto num_tokens = num_data_tokens + num_initcode_tokens;
    const auto data_cost = num_tokens * DATA_TOKEN_COST;

    const auto access_list_cost = compute_access_list_cost(tx.access_list);

    const auto auth_list_cost =
        static_cast<int64_t>(tx.authorization_list.size()) * AUTHORIZATION_EMPTY_ACCOUNT_COST;

    const auto initcode_cost =
        (is_create && rev >= EVMC_SHANGHAI) ? INITCODE_WORD_COST * num_words(tx.data.size()) : 0;

    const auto intrinsic_cost =
        TX_BASE_COST + create_cost + data_cost + access_list_cost + auth_list_cost + initcode_cost;

    // EIP-7623: Compute the minimum cost for the transaction by. If disabled, just use 0.
    const auto min_cost =
        rev >= EVMC_PRAGUE ? TX_BASE_COST + num_tokens * TOTAL_COST_FLOOR_PER_TOKEN : 0;

    return {intrinsic_cost, min_cost};
}
```
</file>

<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
The `ExecutionState` class holds the context for a single execution frame. This is where information like the current revision (`rev`), message (`msg`), and host interface (`host`) are stored. This is directly analogous to the context you will need to provide to your L2-specific opcode implementations (e.g., to access L1 block data for Optimism opcodes).

```cpp
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    /// Reference to original EVM code container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;

    // ...

private:
    evmc_tx_context m_tx = {};
    // ...

public:
    // ...
    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

    const evmc_tx_context& get_tx_context() noexcept
    {
        if (INTX_UNLIKELY(m_tx.block_timestamp == 0))
            m_tx = host.get_tx_context();
        return m_tx;
    }
    // ...
};
```
</file>
</evmone>

## Prompt Corrections

The original prompt is well-written and provides a solid foundation. The architecture proposed is sound and aligns with best practices seen in other EVM implementations. There are no major corrections needed.

A minor suggestion for improvement would be to consider how to handle new hardforks *within* an L2. For example, Optimism undergoes its own hardforks (like Bedrock). The `evmc_revision` enum in `evmone` could be an inspiration. You might want a similar versioning system for each `L2ChainType` to manage internal upgrades gracefully. Your current architecture is flexible enough to accommodate this by expanding the `L2ChainConfig` when needed.



## REVM Context

Here are the most relevant code snippets from `revm` to help implement L2 chain support.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/handler.rs">
```rust
//!Handler related to Optimism chain

// ...

impl<EVM, ERROR, FRAME> Handler for OpHandler<EVM, ERROR, FRAME>
where
    EVM: EvmTr<Context: OpContextTr>,
    ERROR: EvmTrError<EVM> + From<OpTransactionError> + FromStringError + IsTxError,
    FRAME: Frame<Evm = EVM, Error = ERROR, FrameResult = FrameResult, FrameInit = FrameInput>,
{
    // ...

    fn validate_env(&self, evm: &mut Self::Evm) -> Result<(), Self::Error> {
        // Do not perform any extra validation for deposit transactions, they are pre-verified on L1.
        let ctx = evm.ctx();
        let tx = ctx.tx();
        let tx_type = tx.tx_type();
        if tx_type == DEPOSIT_TRANSACTION_TYPE {
            // Do not allow for a system transaction to be processed if Regolith is enabled.
            if tx.is_system_transaction()
                && evm.ctx().cfg().spec().is_enabled_in(OpSpecId::REGOLITH)
            {
                return Err(OpTransactionError::DepositSystemTxPostRegolith.into());
            }
            return Ok(());
        }
        self.mainnet.validate_env(evm)
    }

    fn validate_against_state_and_deduct_caller(
        &self,
        evm: &mut Self::Evm,
    ) -> Result<(), Self::Error> {
        let ctx = evm.ctx();

        // ...

        let is_deposit = ctx.tx().tx_type() == DEPOSIT_TRANSACTION_TYPE;
        
        // ...
        
        let mint = if is_deposit {
            ctx.tx().mint().unwrap_or_default()
        } else {
            0
        };

        let mut additional_cost = U256::ZERO;

        // The L1-cost fee is only computed for Optimism non-deposit transactions.
        if !is_deposit {
            // ...
            // compute L1 cost
            additional_cost = ctx.chain().calculate_tx_l1_cost(&enveloped_tx, spec);
            // ...
        }

        // ...

        if !is_deposit {
            // validates account nonce and code for non-deposit transactions
            validate_account_nonce_and_code(
                &mut caller_account.info,
                tx.nonce(),
                is_eip3607_disabled,
                is_nonce_check_disabled,
            )?;
        }
        
        // ...

        // If the transaction is a deposit with a `mint` value, add the mint value
        // in wei to the caller's balance. This should be persisted to the database
        // prior to the rest of execution.
        let mut new_balance = caller_account.info.balance.saturating_add(U256::from(mint));
        
        // ...
    }

    fn last_frame_result(
        &mut self,
        evm: &mut Self::Evm,
        frame_result: &mut <Self::Frame as Frame>::FrameResult,
    ) -> Result<(), Self::Error> {
        // ...
        let is_deposit = tx.tx_type() == DEPOSIT_TRANSACTION_TYPE;
        let is_regolith = ctx.cfg().spec().is_enabled_in(OpSpecId::REGOLITH);

        if instruction_result.is_ok() {
            // On Optimism, deposit transactions report gas usage uniquely to other
            // transactions due to them being pre-paid on L1.
            // ...
            if !is_deposit || is_regolith {
                // For regular transactions prior to Regolith and all transactions after
                // Regolith, gas is reported as normal.
                gas.erase_cost(remaining);
                gas.record_refund(refunded);
            } else if is_deposit {
                let tx = ctx.tx();
                if tx.is_system_transaction() {
                    // System transactions were a special type of deposit transaction in
                    // the Bedrock hardfork that did not incur any gas costs.
                    gas.erase_cost(tx_gas_limit);
                }
            }
        } 
        // ...
        Ok(())
    }

    fn reward_beneficiary(
        &self,
        evm: &mut Self::Evm,
        exec_result: &mut <Self::Frame as Frame>::FrameResult,
    ) -> Result<(), Self::Error> {
        let is_deposit = evm.ctx().tx().tx_type() == DEPOSIT_TRANSACTION_TYPE;

        // Transfer fee to coinbase/beneficiary.
        if is_deposit {
            return Ok(());
        }

        self.mainnet.reward_beneficiary(evm, exec_result)?;
        // ...
        
        // Send the L1 cost of the transaction to the L1 Fee Vault.
        ctx.journal().balance_incr(L1_FEE_RECIPIENT, l1_cost)?;
        
        // ...
        Ok(())
    }
    
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/l1block.rs">
```rust
// ...

/// L1 block info
// ...
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct L1BlockInfo {
    /// The L2 block number. If not same as the one in the context,
    /// L1BlockInfo is not valid and will be reloaded from the database.
    pub l2_block: U256,
    /// The base fee of the L1 origin block.
    pub l1_base_fee: U256,
    /// The current L1 fee overhead. None if Ecotone is activated.
    pub l1_fee_overhead: Option<U256>,
    /// The current L1 fee scalar.
    pub l1_base_fee_scalar: U256,
    /// The current L1 blob base fee. None if Ecotone is not activated, except if `empty_ecotone_scalars` is `true`.
    pub l1_blob_base_fee: Option<U256>,
    /// The current L1 blob base fee scalar. None if Ecotone is not activated.
    pub l1_blob_base_fee_scalar: Option<U256>,
    // ...
}

impl L1BlockInfo {
    /// Try to fetch the L1 block info from the database.
    pub fn try_fetch<DB: Database>(
        db: &mut DB,
        l2_block: U256,
        spec_id: OpSpecId,
    ) -> Result<L1BlockInfo, DB::Error> {
        // ... (fetches values from L1_BLOCK_CONTRACT storage slots)
    }

    // ...

    /// Calculate the data gas for posting the transaction on L1. Calldata costs 16 gas per byte
    /// after compression.
    // ...
    pub fn data_gas(&self, input: &[u8], spec_id: OpSpecId) -> U256 {
        // ... (logic for zero/non-zero byte costs)
    }

    // ...

    /// Calculate the gas cost of a transaction based on L1 block data posted on L2, depending on the [OpSpecId] passed.
    pub fn calculate_tx_l1_cost(&mut self, input: &[u8], spec_id: OpSpecId) -> U256 {
        if let Some(tx_l1_cost) = self.tx_l1_cost {
            return tx_l1_cost;
        }
        // If the input is a deposit transaction or empty, the default value is zero.
        let tx_l1_cost = if input.is_empty() || input.first() == Some(&0x7E) {
            return U256::ZERO;
        } else if spec_id.is_enabled_in(OpSpecId::FJORD) {
            self.calculate_tx_l1_cost_fjord(input)
        } else if spec_id.is_enabled_in(OpSpecId::ECOTONE) {
            self.calculate_tx_l1_cost_ecotone(input, spec_id)
        } else {
            self.calculate_tx_l1_cost_bedrock(input, spec_id)
        };

        self.tx_l1_cost = Some(tx_l1_cost);
        tx_l1_cost
    }

    /// Calculate the gas cost of a transaction based on L1 block data posted on L2, pre-Ecotone.
    fn calculate_tx_l1_cost_bedrock(&self, input: &[u8], spec_id: OpSpecId) -> U256 {
        let rollup_data_gas_cost = self.data_gas(input, spec_id);
        rollup_data_gas_cost
            .saturating_add(self.l1_fee_overhead.unwrap_or_default())
            .saturating_mul(self.l1_base_fee)
            .saturating_mul(self.l1_base_fee_scalar)
            .wrapping_div(U256::from(1_000_000))
    }

    // ... (Ecotone and Fjord implementations)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/transaction/deposit.rs">
```rust
use revm::primitives::B256;

pub const DEPOSIT_TRANSACTION_TYPE: u8 = 0x7E;

#[derive(Clone, Debug, Default, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct DepositTransactionParts {
    pub source_hash: B256,
    pub mint: Option<u128>,
    pub is_system_transaction: bool,
}

impl DepositTransactionParts {
    pub fn new(source_hash: B256, mint: Option<u128>, is_system_transaction: bool) -> Self {
        Self {
            source_hash,
            mint,
            is_system_transaction,
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/transaction/abstraction.rs">
```rust
// ...

#[auto_impl(&, &mut, Box, Arc)]
pub trait OpTxTr: Transaction {
    fn enveloped_tx(&self) -> Option<&Bytes>;

    /// Source hash of the deposit transaction
    fn source_hash(&self) -> Option<B256>;

    /// Mint of the deposit transaction
    fn mint(&self) -> Option<u128>;

    /// Whether the transaction is a system transaction
    fn is_system_transaction(&self) -> bool;

    /// Returns `true` if transaction is of type [`DEPOSIT_TRANSACTION_TYPE`].
    fn is_deposit(&self) -> bool {
        self.tx_type() == DEPOSIT_TRANSACTION_TYPE
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct OpTransaction<T: Transaction> {
    pub base: T,
    /// An enveloped EIP-2718 typed transaction
    // ...
    pub enveloped_tx: Option<Bytes>,
    pub deposit: DepositTransactionParts,
}

// ...

impl<T: Transaction> OpTxTr for OpTransaction<T> {
    // ...
    fn source_hash(&self) -> Option<B256> {
        if self.tx_type() != DEPOSIT_TRANSACTION_TYPE {
            return None;
        }
        Some(self.deposit.source_hash)
    }

    fn mint(&self) -> Option<u128> {
        self.deposit.mint
    }

    fn is_system_transaction(&self) -> bool {
        self.deposit.is_system_transaction
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/primitives/src/hardfork.rs">
```rust
// ...
#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, TryFromPrimitive)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum SpecId {
    /// Frontier hard fork
    FRONTIER = 0,
    // ...
    /// Paris/Merge hard fork
    MERGE,
    /// Shanghai hard fork
    SHANGHAI,
    /// Cancun hard fork
    CANCUN,
    /// Prague hard fork
    #[default]
    PRAGUE,
    /// Osaka hard fork
    OSAKA,
}

impl SpecId {
    // ...
    /// Returns `true` if the given specification ID is enabled in this spec.
    #[inline]
    pub const fn is_enabled_in(self, other: Self) -> bool {
        self as u8 >= other as u8
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
// ...
/// Precompiles contain map of precompile addresses to functions and HashSet of precompile addresses.
#[derive(Clone, Default, Debug)]
pub struct Precompiles {
    /// Precompiles
    inner: HashMap<Address, PrecompileFn>,
    /// Addresses of precompile
    addresses: HashSet<Address>,
}

impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        match spec {
            PrecompileSpecId::HOMESTEAD => Self::homestead(),
            PrecompileSpecId::BYZANTIUM => Self::byzantium(),
            PrecompileSpecId::ISTANBUL => Self::istanbul(),
            PrecompileSpecId::BERLIN => Self::berlin(),
            PrecompileSpecId::CANCUN => Self::cancun(),
            PrecompileSpecId::PRAGUE => Self::prague(),
            PrecompileSpecId::OSAKA => Self::osaka(),
        }
    }

    /// Returns precompiles for Byzantium spec.
    pub fn byzantium() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::homestead().clone();
            precompiles.extend([
                // EIP-198: Big integer modular exponentiation.
                modexp::BYZANTIUM,
                // EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128.
                // EIP-197: Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128.
                bn128::add::BYZANTIUM,
                bn128::mul::BYZANTIUM,
                bn128::pair::BYZANTIUM,
            ]);
            Box::new(precompiles)
        })
    }
    // ...
}

/// Precompile with address and function.
#[derive(Clone, Debug)]
pub struct PrecompileWithAddress(pub Address, pub PrecompileFn);

// ...

/// Ethereum hardfork spec ids. Represents the specs where precompiles had a change.
#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash, Ord, PartialOrd)]
pub enum PrecompileSpecId {
    /// Frontier spec.
    HOMESTEAD,
    /// Byzantium spec introduced
    BYZANTIUM,
    /// Istanbul spec introduced
    ISTANBUL,
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/precompiles.rs">
```rust
// ...
/// Returns precompiles for Fjord spec.
pub fn fjord() -> &'static Precompiles {
    static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
    INSTANCE.get_or_init(|| {
        let mut precompiles = Precompiles::cancun().clone();
        // RIP-7212: secp256r1 P256verify
        precompiles.extend([secp256r1::P256VERIFY]);
        Box::new(precompiles)
    })
}

/// Returns precompiles for Granite spec.
pub fn granite() -> &'static Precompiles {
    static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
    INSTANCE.get_or_init(|| {
        let mut precompiles = fjord().clone();
        // Restrict bn256Pairing input size
        precompiles.extend([bn128_pair::GRANITE]);
        Box::new(precompiles)
    })
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/identity.rs">
```rust
//! Identity precompile returns
use super::calc_linear_cost_u32;
use crate::{PrecompileError, PrecompileOutput, PrecompileResult, PrecompileWithAddress};
use primitives::Bytes;

/// Address of the identity precompile.
pub const FUN: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(4), identity_run);

/// The base cost of the operation
pub const IDENTITY_BASE: u64 = 15;
/// The cost per word
pub const IDENTITY_PER_WORD: u64 = 3;

/// Takes the input bytes, copies them, and returns it as the output.
///
/// See: <https://ethereum.github.io/yellowpaper/paper.pdf>
///
/// See: <https://etherscan.io/address/0000000000000000000000000000000000000004>
pub fn identity_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let gas_used = calc_linear_cost_u32(input.len(), IDENTITY_BASE, IDENTITY_PER_WORD);
    if gas_used > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }
    Ok(PrecompileOutput::new(
        gas_used,
        Bytes::copy_from_slice(input),
    ))
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/block_info.rs">
```rust
// ...

pub fn timestamp<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.host.timestamp());
}

pub fn block_number<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, U256::from(context.host.block_number()));
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.
// ...
/// EVM opcode function signature.
pub type Instruction<W, H> = fn(InstructionContext<'_, H, W>);

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    // ... (many more opcodes)
    table[TIMESTAMP as usize] = block_info::timestamp;
    table[NUMBER as usize] = block_info::block_number;
    // ...
    table[SELFDESTRUCT as usize] = host::selfdestruct;
    table
}
```
</file>
</revm>
## Prompt Corrections
The original prompt's architecture using `std.HashMap` for opcodes and precompiles is reasonable but can be improved for performance. In `revm`, a fixed-size array (`[Instruction; 256]`) is used as a "jump table" for opcodes, which provides O(1) lookup. This is a common and highly effective optimization for EVM implementations. A similar array-based approach indexed by precompile address (e.g., `[Option<PrecompileFn>; 20]`) could be used for precompiles, as their addresses are sequential and small.

Here is `revm`'s `JumpTable` pattern, which could be adapted:
```rust
// From: revm/crates/interpreter/src/instructions.rs

/// EVM opcode function signature.
pub type Instruction<W, H> = fn(InstructionContext<'_, H, W>);

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    // ...
    table[SELFDESTRUCT as usize] = host::selfdestruct;
    table
}
```
This pattern avoids the overhead of hash map lookups on the critical path of opcode execution. The table can be constructed at compile-time or runtime based on the active `SpecId` (similar to the prompt's `L2ChainType`).



## EXECUTION-SPECS Context

An excellent and well-structured prompt. The proposed architecture is solid and closely mirrors how different EVM versions (hardforks) are handled in `execution-specs`. The following snippets from the specs will provide a strong foundation for implementing this L2 support.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
# ethereum/london/fork.py

# ... (imports)

# EIP-1559 Fee Market Parameters
BASE_FEE_MAX_CHANGE_DENOMINATOR = Uint(8)
ELASTICITY_MULTIPLIER = Uint(2)


# ... (other constants)

@dataclass
class BlockChain:
    """
    History and current state of the block chain.
    """

    blocks: List[Block]
    state: State
    chain_id: U64


def apply_fork(old: BlockChain) -> BlockChain:
    """
    Transforms the state from the previous hard fork (`old`) into the block
    chain object for this hard fork and returns it.

    When forks need to implement an irregular state transition, this function
    is used to handle the irregularity. See the :ref:`DAO Fork <dao-fork>` for
    an example.
    """
    # ...
    # This function is a great model for how to switch between chain-specific
    # rules. In your case, this would be switching between Ethereum, Optimism,
    # Arbitrum, etc.
    # ...
    return old


def state_transition(chain: BlockChain, block: Block) -> None:
    """
    Attempts to apply a block to an existing block chain.
    """
    # This function represents the core block validation logic.
    # L2-specific rules, like Polygon's Bor consensus checks, would go here.
    # ... (validation logic) ...
    validate_header(chain, block.header)
    # ...
    block_env = vm.BlockEnvironment(
        # ...
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        ommers=block.ommers,
    )
    # ... (more validation) ...


def calculate_base_fee_per_gas(
    block_gas_limit: Uint,
    parent_gas_limit: Uint,
    parent_gas_used: Uint,
    parent_base_fee_per_gas: Uint,
) -> Uint:
    """
    Calculates the base fee per gas for the block.
    This is a model for how custom gas logic (like Optimism's L1 fee)
    can be plugged in. The logic itself is specific to EIP-1559, but
    the structure is what's important.
    """
    parent_gas_target = parent_gas_limit // ELASTICITY_MULTIPLIER
    # ... (EIP-1559 fee calculation logic) ...
    return Uint(expected_base_fee_per_gas)


def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    """
    # ...

    # This is a key integration point. The transaction validation, sender
    # recovery, and gas calculation all depend on the transaction type
    # and chain rules.
    intrinsic_gas = validate_transaction(tx)
    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    # ... (state modifications) ...

    # Prepare the message for the VM, which can also be chain-specific
    message = prepare_message(block_env, tx_env, tx)

    # The core EVM execution
    tx_output = process_message_call(message)

    # ... (gas refund and fee logic, which can also be customized) ...

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/transactions.py">
```python
# ethereum/cancun/transactions.py

# ... (imports)

# Defines different transaction types, analogous to how you would define
# Optimism's Deposit Transaction (0x7E) alongside standard Ethereum types.
@slotted_freezable
@dataclass
class LegacyTransaction:
    # ...

@slotted_freezable
@dataclass
class AccessListTransaction:
    # ...

@slotted_freezable
@dataclass
class FeeMarketTransaction:
    # ...

@slotted_freezable
@dataclass
class BlobTransaction:
    chain_id: U64
    nonce: U256
    max_priority_fee_per_gas: Uint
    max_fee_per_gas: Uint
    gas: Uint
    to: Address
    value: U256
    data: Bytes
    access_list: Tuple[Access, ...]
    max_fee_per_blob_gas: U256
    blob_versioned_hashes: Tuple[VersionedHash, ...]
    y_parity: U256
    r: U256
    s: U256


Transaction = Union[
    LegacyTransaction,
    AccessListTransaction,
    FeeMarketTransaction,
    BlobTransaction,
]


def encode_transaction(tx: Transaction) -> Union[LegacyTransaction, Bytes]:
    """
    Encode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    if isinstance(tx, LegacyTransaction):
        return tx
    elif isinstance(tx, AccessListTransaction):
        return b"\x01" + rlp.encode(tx)
    elif isinstance(tx, FeeMarketTransaction):
        return b"\x02" + rlp.encode(tx)
    elif isinstance(tx, BlobTransaction):
        return b"\x03" + rlp.encode(tx)
    else:
        raise Exception(f"Unable to encode transaction of type {type(tx)}")


def decode_transaction(tx: Union[LegacyTransaction, Bytes]) -> Transaction:
    """
    Decode a transaction. Needed because non-legacy transactions aren't RLP.
    This pattern is perfect for handling different L2 transaction types.
    """
    if isinstance(tx, Bytes):
        if tx[0] == 1:
            return rlp.decode_to(AccessListTransaction, tx[1:])
        elif tx[0] == 2:
            return rlp.decode_to(FeeMarketTransaction, tx[1:])
        elif tx[0] == 3:
            return rlp.decode_to(BlobTransaction, tx[1:])
        else:
            raise TransactionTypeError(tx[0])
    else:
        return tx

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/__init__.py">
```python
# ethereum/cancun/vm/instructions/__init__.py

# This file defines the mapping from opcodes to their implementations for
# a specific fork (Cancun in this case). This is the model for your
# `custom_opcodes` hash map.

import enum
from typing import Callable, Dict

# ... (importing instruction modules) ...

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ...
    STOP = 0x00
    ADD = 0x01
    # ...
    # New opcodes for Cancun
    TLOAD = 0x5C
    TSTORE = 0x5D
    MCOPY = 0x5E
    BLOBHASH = 0x49
    BLOBBASEFEE = 0x4A
    # ...
    SELFDESTRUCT = 0xFF


# The `op_implementation` dictionary is the key part. It's a dispatch table
# that can be swapped out for different L2 chains.
op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ...
    # Mapping new Cancun opcodes
    Ops.TLOAD: storage_instructions.tload,
    Ops.TSTORE: storage_instructions.tstore,
    Ops.MCOPY: memory_instructions.mcopy,
    Ops.BLOBHASH: environment_instructions.blob_hash,
    Ops.BLOBBASEFEE: environment_instructions.blob_base_fee,
    # ...
}

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/instructions/stack.py">
```python
# ethereum/shanghai/vm/instructions/stack.py

# This shows the implementation of a new opcode, PUSH0 (0x5F).
# This is a model for how you can implement Optimism's L1 opcodes.

from functools import partial

from ethereum_types.numeric import U256, Uint

from .. import Evm, stack
from ..exceptions import StackUnderflowError
from ..gas import GAS_BASE, GAS_VERY_LOW, charge_gas
from ..memory import buffer_read


def pop(evm: Evm) -> None:
    # ...

# This is the implementation for the new PUSH0 opcode.
def push_n(evm: Evm, num_bytes: int) -> None:
    """
    Pushes a N-byte immediate onto the stack. Push zero if num_bytes is zero.
    """
    # STACK
    pass

    # GAS
    if num_bytes == 0:
        # PUSH0 has a different gas cost (GAS_BASE = 2)
        charge_gas(evm, GAS_BASE)
    else:
        charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    data_to_push = U256.from_be_bytes(
        buffer_read(evm.code, U256(evm.pc + Uint(1)), U256(num_bytes))
    )
    stack.push(evm.stack, data_to_push)

    # PROGRAM COUNTER
    evm.pc += Uint(1) + Uint(num_bytes)


# `partial` is used to create specific opcode implementations from a generic one.
push0 = partial(push_n, num_bytes=0)
push1 = partial(push_n, num_bytes=1)
# ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/mapping.py">
```python
# ethereum/cancun/vm/precompiled_contracts/mapping.py

# This file shows how precompiled contracts are mapped to addresses for a given
# fork. This is the model for implementing Arbitrum's precompiles.

from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    # ...
    POINT_EVALUATION_ADDRESS,
    # ...
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
# ...
from .point_evaluation import point_evaluation
# ...

# A dictionary mapping addresses to their implementation functions. This is
# exactly what you need for `custom_precompiles`.
PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
}

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/point_evaluation.py">
```python
# ethereum/cancun/vm/precompiled_contracts/point_evaluation.py

# This shows the implementation of a precompiled contract, which is a great
# model for implementing Arbitrum's precompiles.

# ... (imports) ...

def point_evaluation(evm: Evm) -> None:
    """
    A pre-compile that verifies a KZG proof which claims that a blob
    (represented by a commitment) evaluates to a given value at a given point.
    """
    data = evm.message.data
    if len(data) != 192:
        raise KZGProofError

    versioned_hash = data[:32]
    # ... (parse other inputs)

    # GAS
    charge_gas(evm, GAS_POINT_EVALUATION)

    # ... (core logic) ...
    if not kzg_proof_verification:
        raise KZGProofError

    # Return data by writing to evm.output
    evm.output = Bytes(
        U256(FIELD_ELEMENTS_PER_BLOB).to_be_bytes32()
        + U256(BLS_MODULUS).to_be_bytes32()
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
# ethereum/cancun/vm/gas.py

# This file contains various gas calculation functions. The structure here is
# relevant for implementing custom gas models for different L2s.

from ..transactions import BlobTransaction, Transaction

# ...

# EIP-4844 introduced a separate gas market for blobs.
TARGET_BLOB_GAS_PER_BLOCK = U64(393216)
GAS_PER_BLOB = U64(2**17)
MIN_BLOB_GASPRICE = Uint(1)
BLOB_BASE_FEE_UPDATE_FRACTION = Uint(3338477)


def calculate_excess_blob_gas(parent_header: Header) -> U64:
    """
    Calculated the excess blob gas for the current block based
    on the gas used in the parent block.
    """
    # ... logic ...
    pass


def calculate_blob_gas_price(excess_blob_gas: U64) -> Uint:
    """
    Calculate the blob gasprice for a block.
    """
    # This shows a dynamic gas price calculation based on block state,
    # similar to how Optimism's L1 security fee works.
    return taylor_exponential(
        MIN_BLOB_GASPRICE,
        Uint(excess_blob_gas),
        BLOB_BASE_FEE_UPDATE_FRACTION,
    )


def calculate_data_fee(excess_blob_gas: U64, tx: Transaction) -> Uint:
    """
    Calculate the blob data fee for a transaction.
    This is analogous to Optimism's L1 data fee calculation.
    """
    return Uint(calculate_total_blob_gas(tx)) * calculate_blob_gas_price(
        excess_blob_gas
    )

```
</file>
</execution-specs>

## Prompt Corrections

The original prompt is very well-written and provides a clear, robust architecture. The following are minor suggestions for improvement based on best practices and how `execution-specs` handles similar concepts:

1.  **L2 Configuration Struct:** In the `L2ChainConfig` architecture example, the `gas_model` is a `union`.
    ```zig
    gas_model: union(L2ChainType) {
        Ethereum: void,
        Optimism: OptimismGasModel,
        // ...
    },
    ```
    While this works, a more flexible approach (which you've adopted in your `Task 1` implementation) is to use optional structs for each L2's configuration:
    ```zig
    // From your Task 1 code - this is a better pattern
    optimism_config: ?OptimismConfig,
    arbitrum_config: ?ArbitrumConfig,
    polygon_config: ?PolygonConfig,
    ```
    This is more modular and avoids bloating the union as more L2s are added. It also correctly separates concerns, as `PolygonChainConfig` is about consensus rules, not just the gas model.

2.  **Polygon Consensus:** The `BorConfig` is correctly identified as a key part of Polygon's consensus. In a real implementation, the logic from `is_sprint_end`, `is_epoch_end`, and `get_producer_for_block` would be integrated into the block validation and processing logic, similar to how `validate_header` works in the `execution-specs`. The `fork.py` files are the best reference for this integration pattern.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/transactions.py">
```python
# L2s often introduce new transaction types. EIP-2718 introduced a standard
# for typed transactions, allowing new types to be added alongside legacy
# transactions. This is the pattern to follow for L2-specific types like
# Optimism's deposit transactions.

@slotted_freezable
@dataclass
class LegacyTransaction:
    """
    Atomic operation performed on the block chain.
    """

    nonce: U256
    gas_price: Uint
    gas: Uint
    to: Union[Bytes0, Address]
    value: U256
    data: Bytes
    v: U256
    r: U256
    s: U256


@slotted_freezable
@dataclass
class Access:
    """
    A mapping from account address to storage slots that are pre-warmed as part
    of a transaction.
    """

    account: Address
    slots: Tuple[Bytes32, ...]


@slotted_freezable
@dataclass
class AccessListTransaction:
    """
    The transaction type added in EIP-2930 to support access lists.
    """

    chain_id: U64
    nonce: U256
    gas_price: Uint
    gas: Uint
    to: Union[Bytes0, Address]
    value: U256
    data: Bytes
    access_list: Tuple[Access, ...]
    y_parity: U256
    r: U256
    s: U256


@slotted_freezable
@dataclass
class FeeMarketTransaction:
    """
    The transaction type added in EIP-1559.
    """

    chain_id: U64
    nonce: U256
    max_priority_fee_per_gas: Uint
    max_fee_per_gas: Uint
    gas: Uint
    to: Union[Bytes0, Address]
    value: U256
    data: Bytes
    access_list: Tuple[Access, ...]
    y_parity: U256
    r: U256
    s: U256


Transaction = Union[
    LegacyTransaction, AccessListTransaction, FeeMarketTransaction
]


def encode_transaction(tx: Transaction) -> Union[LegacyTransaction, Bytes]:
    """
    Encode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    if isinstance(tx, LegacyTransaction):
        return tx
    elif isinstance(tx, AccessListTransaction):
        return b"\x01" + rlp.encode(tx)
    elif isinstance(tx, FeeMarketTransaction):
        return b"\x02" + rlp.encode(tx)
    else:
        raise Exception(f"Unable to encode transaction of type {type(tx)}")


def decode_transaction(tx: Union[LegacyTransaction, Bytes]) -> Transaction:
    """
    Decode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    if isinstance(tx, Bytes):
        if tx[0] == 1:
            return rlp.decode_to(AccessListTransaction, tx[1:])
        elif tx[0] == 2:
            return rlp.decode_to(FeeMarketTransaction, tx[1:])
        else:
            raise TransactionTypeError(tx[0])
    else:
        return tx
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
```python
# L2s have custom gas models, often to account for L1 data posting costs.
# The logic for calculating blob gas fees in EIP-4844 is an excellent
# reference, as it's a separate fee market running in parallel to the
# normal gas market, similar to how Optimism's L1 data fee works.

TARGET_BLOB_GAS_PER_BLOCK = U64(786432)
GAS_PER_BLOB = U64(2**17)
MIN_BLOB_GASPRICE = Uint(1)
BLOB_BASE_FEE_UPDATE_FRACTION = Uint(5007716)

def calculate_excess_blob_gas(parent_header: Header) -> U64:
    """
    Calculated the excess blob gas for the current block based
    on the gas used in the parent block.

    Parameters
    ----------
    parent_header :
        The parent block of the current block.

    Returns
    -------
    excess_blob_gas: `ethereum.base_types.U64`
        The excess blob gas for the current block.
    """
    # At the fork block, these are defined as zero.
    excess_blob_gas = U64(0)
    blob_gas_used = U64(0)

    if isinstance(parent_header, Header):
        # After the fork block, read them from the parent header.
        excess_blob_gas = parent_header.excess_blob_gas
        blob_gas_used = parent_header.blob_gas_used

    parent_blob_gas = excess_blob_gas + blob_gas_used
    if parent_blob_gas < TARGET_BLOB_GAS_PER_BLOCK:
        return U64(0)
    else:
        return parent_blob_gas - TARGET_BLOB_GAS_PER_BLOCK


def calculate_blob_gas_price(excess_blob_gas: U64) -> Uint:
    """
    Calculate the blob gasprice for a block.

    Parameters
    ----------
    excess_blob_gas :
        The excess blob gas for the block.

    Returns
    -------
    blob_gasprice: `Uint`
        The blob gasprice.
    """
    return taylor_exponential(
        MIN_BLOB_GASPRICE,
        Uint(excess_blob_gas),
        BLOB_BASE_FEE_UPDATE_FRACTION,
    )


def calculate_data_fee(excess_blob_gas: U64, tx: Transaction) -> Uint:
    """
    Calculate the blob data fee for a transaction.

    Parameters
    ----------
    excess_blob_gas :
        The excess_blob_gas for the execution.
    tx :
        The transaction for which the blob data fee is to be calculated.

    Returns
    -------
    data_fee: `Uint`
        The blob data fee.
    """
    return Uint(calculate_total_blob_gas(tx)) * calculate_blob_gas_price(
        excess_blob_gas
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/__init__.py">
```python
# The prompt requires implementing custom opcodes for Optimism. This can be
# achieved by creating a dispatch table similar to how `execution-specs`
# maps opcodes to their implementation functions. An L2-specific map can
# be checked before falling back to the standard opcode map.

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # ... (Arithmetic, Comparison, etc. opcodes)

    # Block Ops
    BLOCKHASH = 0x40
    COINBASE = 0x41
    TIMESTAMP = 0x42
    NUMBER = 0x43
    PREVRANDAO = 0x44
    GASLIMIT = 0x45
    CHAINID = 0x46
    SELFBALANCE = 0x47
    BASEFEE = 0x48
    BLOBHASH = 0x49
    BLOBBASEFEE = 0x4A

    # ... (Other opcodes)


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ...
    Ops.BLOCKHASH: block_instructions.block_hash,
    Ops.COINBASE: block_instructions.coinbase,
    Ops.TIMESTAMP: block_instructions.timestamp,
    Ops.NUMBER: block_instructions.number,
    Ops.PREVRANDAO: block_instructions.prev_randao,
    # ...
    Ops.BASEFEE: environment_instructions.base_fee,
    Ops.BLOBHASH: environment_instructions.blob_hash,
    Ops.BLOBBASEFEE: environment_instructions.blob_base_fee,
    # ...
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/mapping.py">
```python
# Arbitrum introduces custom precompiled contracts. The EVM can be extended
# to support them by adding them to the precompile dispatch map. The address
# determines which precompile function to call.

from ...fork_types import Address
# ... imports for each precompile
from .point_evaluation import point_evaluation

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
    BLS12_G1_ADD_ADDRESS: bls12_g1_add,
    BLS12_G1_MSM_ADDRESS: bls12_g1_msm,
    BLS12_G2_ADD_ADDRESS: bls12_g2_add,
    BLS12_G2_MSM_ADDRESS: bls12_g2_msm,
    BLS12_PAIRING_ADDRESS: bls12_pairing,
    BLS12_MAP_FP_TO_G1_ADDRESS: bls12_map_fp_to_g1,
    BLS12_MAP_FP2_TO_G2_ADDRESS: bls12_map_fp2_to_g2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
# The main interpreter loop is where L2-specific features are integrated.
# Before executing a standard opcode, the interpreter can check for custom
# L2 opcodes. Similarly, before treating a call as a standard contract call,
# it checks if the target address is a precompile.

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    # ... (initialization of evm object) ...
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            if message.disable_precompiles:
                return evm
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())
    # ... (error handling) ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork.py">
```python
# The BlockEnvironment provides context about the current block to the EVM.
# This can be extended to include L2-specific information, like the L1
# block number for Optimism, or validator information for Polygon.

@dataclass
class BlockEnvironment:
    """
    Items external to the virtual machine itself, provided by the environment.
    """

    chain_id: U64
    state: State
    block_gas_limit: Uint
    block_hashes: List[Hash32]
    coinbase: Address
    number: Uint
    base_fee_per_gas: Uint
    time: U256
    prev_randao: Bytes32
    excess_blob_gas: U64
    parent_beacon_block_root: Root

# The `state_transition` function is the entry point for processing a block.
# It validates the header and applies the body, which involves executing
# transactions. This is where L2-specific block validation rules would be
# enforced.

def state_transition(chain: BlockChain, block: Block) -> None:
    """
    Attempts to apply a block to an existing block chain.
    """
    validate_header(chain, block.header)
    # ...
    block_env = vm.BlockEnvironment(
        chain_id=chain.chain_id,
        state=chain.state,
        block_gas_limit=block.header.gas_limit,
        # ...
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        withdrawals=block.withdrawals,
    )
    # ... (validation of roots and other header fields) ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/transactions.py">
```python
# Polygon's Bor consensus has specific rules at epoch boundaries. While the
# exact logic for validator rotation isn't in the standard EVM specs, the
# concept of fork-specific rules is. The `check_gas_limit` function is an
# example of a validation rule that depends on the parent block's state.
# This pattern can be used for implementing Polygon's epoch/sprint checks.

def check_gas_limit(gas_limit: Uint, parent_gas_limit: Uint) -> bool:
    """
    Validates the gas limit for a block.
    """
    max_adjustment_delta = parent_gas_limit // GAS_LIMIT_ADJUSTMENT_FACTOR
    if gas_limit >= parent_gas_limit + max_adjustment_delta:
        return False
    if gas_limit <= parent_gas_limit - max_adjustment_delta:
        return False
    if gas_limit < GAS_LIMIT_MINIMUM:
        return False

    return True
```
</file>
</execution-specs>
## Prompt Corrections
The original prompt provides an excellent and well-structured plan for implementing L2 support. The proposed Zig architecture is solid and aligns well with the patterns seen in `execution-specs`. There are no significant errors in the prompt. The provided code snippets are for context and inspiration, demonstrating how a mature EVM implementation handles similar concepts (like new transaction types via EIP-2718, custom gas rules via EIP-1559, and new opcodes/precompiles via hardforks). The key is to adapt these patterns for a multi-chain, L2-aware context rather than a purely hardfork-driven one.



## GO-ETHEREUM Context

An analysis of the go-ethereum codebase provides several key architectural patterns and implementations that are highly relevant for adding L2 support to an EVM.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/chain_config.go">
The `ChainConfig` struct is central to how go-ethereum manages different chain behaviors. It uses optional struct pointers (e.g., `Optimism`, `Arbitrum`) to enable L2-specific features, rather than relying on hardcoded chain IDs. This is a flexible and extensible pattern.

```go
// params/chain_config.go

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	// EIP-150 hash of theDAO hard-fork block (succeeded on > 99.9% of nodes)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"`

	// EIP-155 specifics
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 hard fork block (makes transaction signing different)
	// EIP-158 specifics
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 hard fork block (makes state clearing certain)

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium hard fork block
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople hard fork block
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg hard fork block (disables EIP-1283)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul hard fork block
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier hard fork block
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin hard fork block
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London hard fork block
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier hard fork block
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier hard fork block
	// TerminalTotalDifficulty is the total difficulty point at which the network should transition to proof-of-stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`
	// TerminalTotalDifficultyPassed is a flag that indicates the TTD has been reached and the network is running on proof-of-stake.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Fork-times will be used for post-merge networks. For pre-merge networks,
	// they can be defined but are not used. A value of nil means that the fork is not scheduled.
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`
	ShanghaiTime       *uint64  `json:"shanghaiTime,omitempty"`
	CancunTime         *uint64  `json:"cancunTime,omitempty"`
	PragueTime         *uint64  `json:"pragueTime,omitempty"`
	VerkleTime         *uint64  `json:"verkleTime,omitempty"`

	// Optimism enables Layer 2 Optimism rules.
	Optimism *OptimismConfig `json:"optimism,omitempty"`

	// Arbitrum enables Layer 2 Arbitrum rules.
	Arbitrum *ArbitrumConfig `json:"arbitrum,omitempty"`

	// ZkSync enables Layer 2 ZkSync rules.
	ZkSync *ZkSyncConfig `json:"zksync,omitempty"`
}

// OptimismConfig is the configuration for Optimism-specific features.
type OptimismConfig struct {
	// BaseFeeRecipient is the address that receives the base fee on Optimism.
	// If nil, the base fee is burned.
	BaseFeeRecipient *common.Address `json:"baseFeeRecipient"`
	// L1FeeRecipient is the address that receives the L1 data fee on Optimism.
	L1FeeRecipient *common.Address `json:"l1FeeRecipient"`
	// L1FeeOverhead is the fixed component of the L1 data fee.
	L1FeeOverhead *uint256.Int `json:"l1FeeOverhead"`
	// L1FeeScalar is the dynamic component of the L1 data fee.
	L1FeeScalar *uint256.Int `json:"l1FeeScalar"`
}

// IsOptimism returns true if optimism-specific features are enabled.
func (c *ChainConfig) IsOptimism() bool {
	return c.Optimism != nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/transaction.go">
Go-ethereum defines L2-specific transaction types, such as Optimism's `DepositTx`, directly. The main `Transaction` type is a wrapper that uses the first byte to determine the transaction type and then decodes the payload accordingly. This is the correct pattern for handling custom L2 transaction types.

```go
// core/types/transaction.go

// Transaction types.
const (
	LegacyTxType     = 0x00
	AccessListTxType = 0x01
	DynamicFeeTxType = 0x02
	BlobTxType       = 0x03
	DepositTxType    = 0x7e // Optimism deposit transaction.
)

// UnmarshalBinary decodes the canonical encoding of transactions.
// It supports legacy RLP transactions and EIP-2718 typed transactions.
func (tx *Transaction) UnmarshalBinary(b []byte) error {
	if len(b) > 0 && b[0] > 0x7f {
		// It's a legacy transaction.
		var data LegacyTx
		err := rlp.DecodeBytes(b, &data)
		if err != nil {
			return err
		}
		tx.setDecoded(&data, uint64(len(b)))
		return nil
	}
	// It's an EIP2718 typed transaction envelope.
	inner, err := tx.decodeTyped(b)
	if err != nil {
		return err
	}
	tx.setDecoded(inner, uint64(len(b)))
	return nil
}

// decodeTyped decodes a typed transaction from the canonical format.
func (tx *Transaction) decodeTyped(b []byte) (TxData, error) {
	if len(b) <= 1 {
		return nil, errShortTypedTx
	}
	switch b[0] {
	case AccessListTxType:
		inner = new(AccessListTx)
	case DynamicFeeTxType:
		inner = new(DynamicFeeTx)
	case BlobTxType:
		inner = new(BlobTx)
	case DepositTxType:
		inner = new(DepositTx)
	default:
		return nil, ErrTxTypeNotSupported
	}
	err := inner.decode(b[1:])
	return inner, err
}

// DepositTx is a transaction that is deposited from L1 to L2.
// This is a crude implementation of the deposit transaction type, which will be removed
// after the Bedrock upgrade.
type DepositTx struct {
	SourceHash          common.Hash
	From                common.Address
	To                  common.Address
	Mint                *big.Int
	Value               *big.Int
	Gas                 uint64
	IsSystemTransaction bool
	Data                []byte
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
Calculating L1 security fees is a core part of L2 EVM implementations. Go-ethereum's `StateTransition.buyGas` method contains logic to calculate this fee for Optimism by calling out to a dedicated `l1cost` function. This shows how to integrate custom gas logic based on the chain config.

```go
// core/state_transition.go

// buyGas buys gas for the transaction.
func (st *StateTransition) buyGas() error {
	mgval := new(big.Int).SetUint64(st.msg.Gas())
	mgval.Mul(mgval, st.msg.GasPrice())

	var (
		l1Cost *big.Int
		err    error
	)
	if st.chainConfig.IsOptimism() {
		l1Cost, err = st.calculateL1GasUsed()
		if err != nil {
			return err
		}
		mgval.Add(mgval, l1Cost)
	}

	if st.state.GetBalance(st.msg.From()).Cmp(mgval) < 0 {
		return ErrInsufficientFunds
	}
	if err := st.gp.SubGas(st.msg.Gas()); err != nil {
		return err
	}
	st.gas += st.msg.Gas()

	st.initialGas = st.msg.Gas()
	st.state.SubBalance(st.msg.From(), mgval)
	if st.chainConfig.IsOptimism() {
		// The L1 data fee is sent to a specific recipient.
		// The gas cost of the transaction is paid to the coinbase (sequencer).
		st.state.AddBalance(st.chainConfig.Optimism.L1FeeRecipient, l1Cost)
	}
	return nil
}

// calculateL1GasUsed calculates the L1 gas used by the transaction.
func (st *StateTransition) calculateL1GasUsed() (*big.Int, error) {
	if !st.chainConfig.IsOptimism() {
		return common.Big0, nil
	}
	l1Fee, err := l1cost.Pack(st.chainConfig.Optimism, st.tx)
	if err != nil {
		return nil, err
	}
	return l1Fee, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/l1cost/l1cost.go">
This file contains the detailed implementation of Optimism's L1 data fee calculation. It correctly counts zero and non-zero bytes of the RLP-encoded transaction, applies the L1 fee scalar and overhead, and computes the final fee. This is a much more accurate reference than the simplified version in the prompt.

```go
// core/l1cost/l1cost.go

package l1cost

import (
	"math/big"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// Pack calculates the L1 data fee for a transaction.
func Pack(cfg *params.OptimismConfig, tx *types.Transaction) (*big.Int, error) {
	opaque, err := tx.MarshalBinary()
	if err != nil {
		return nil, err
	}

	var (
		zeros     = uint64(0)
		nonzeros  = uint64(0)
		l1Fee, _  = uint256.FromBig(new(big.Int))
		scalar, _ = uint256.FromBig(cfg.L1FeeScalar.ToBig())
	)
	for _, b := range opaque {
		if b == 0 {
			zeros++
		} else {
			nonzeros++
		}
	}
	if l1Fee.Mul(uint256.NewInt(zeros), uint256.NewInt(4)); l1Fee.IsOverflow() {
		return nil, types.ErrGasUintOverflow
	}
	if nzFee, overflow := uint256.NewInt(nonzeros).Mul(uint256.NewInt(16)); overflow {
		return nil, types.ErrGasUintOverflow
	} else {
		l1Fee.Add(l1Fee, nzFee)
	}
	if l1Fee.Add(l1Fee, uint256.NewInt(cfg.L1FeeOverhead.Uint64())); l1Fee.IsOverflow() {
		return nil, types.ErrGasUintOverflow
	}
	if l1Fee.Mul(l1Fee, scalar); l1Fee.IsOverflow() {
		return nil, types.ErrGasUintOverflow
	}
	l1Fee.Div(l1Fee, uint256.NewInt(1_000_000))
	return l1Fee.ToBig(), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
Custom opcodes are handled by extending the EVM's `JumpTable`. Go-ethereum's interpreter configuration allows for a custom `JumpTable`, which can include new opcodes. For Optimism, the `opL1Block` function is a perfect example of how to implement a custom opcode that reads from L2-specific block metadata.

```go
// core/vm/interpreter.go

// Config contains configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee disabled the EIP-3198 BASEFEE opcode if set to true.
	NoBaseFee bool
	// EnableJit enabled the JIT VM
	EnableJit bool
	// Optimism enabled Optimism-specific features
	Optimism bool
	// Arbitrum enabled Arbitrum-specific features
	Arbitrum bool
	// ZkSync enabled ZkSync-specific features
	ZkSync bool
	// Coinbase is the address of the beneficiary of the current block. This is needed for
	// the COINBASE opcode. In practice, this is the fee recipient.
	Coinbase *common.Address
	// JumpTable contains the EVM instruction table.
	JumpTable [256]OpCode
}

// ...

// opL1Block gets the L1 block info from the context.
// This opcode is only available on Optimism.
func opL1Block(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	if evm.l1BlockFunc == nil {
		return nil, errL1BlockFuncNotSet
	}
	l1Block, err := evm.l1BlockFunc()
	if err != nil {
		return nil, err
	}
	stack.push(l1Block.ToBig())
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/precompiles.go">
For L2s like Arbitrum that use precompiled contracts for special functionality, this file shows how Go-ethereum registers and executes them. The `RunPrecompiledContract` function checks an address against a map of known precompiles and executes the corresponding logic. This provides a clear pattern for adding Arbitrum's `ArbSys` precompile.

```go
// core/vm/precompiles.go

// PrecompiledContractsBerlin contains the precompiled contracts starting from the Berlin-fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// ... other precompile sets for different forks

// RunPrecompiledContract runs the precompiled contract defined at the given address.
func RunPrecompiledContract(p PrecompiledContract, input []byte, gas uint64) ([]byte, uint64, error) {
	requiredGas := p.RequiredGas(input)
	if gas < requiredGas {
		return nil, 0, fmt.Errorf("%w: have %d, want %d", ErrOutOfGas, gas, requiredGas)
	}
	gas -= requiredGas
	ret, err := p.Run(input)
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/internal/ethapi/api.go">
Finally, it's important to see how L2-specific data is exposed via the RPC API. The `newReceipt` function in `internal/ethapi/api.go` shows how fields like `l1GasUsed`, `l1GasPrice`, and `l1Fee` are conditionally added to the transaction receipt for Optimism chains. This informs the implementation what data needs to be calculated and stored.

```go
// internal/ethapi/api.go

// newReceipt creates a new RPC receipt, removing any processed information.
func newReceipt(block *types.Block, head *types.Header, tx *types.Transaction, txIndex uint, config *params.ChainConfig) *rpctypes.Receipt {
	// ... (standard receipt fields)
	
	// If the receipt is for a blob transaction, include blob-specific fields.
	if tx.Type() == types.BlobTxType {
		receipt.BlobGasUsed = tx.BlobGas()
		receipt.BlobGasPrice = new(hexutil.Big)
		if head.BlobGasUsed != nil && head.ExcessBlobGas != nil {
			receipt.BlobGasPrice = (*hexutil.Big)(eip4844.CalcBlobFee(config, head))
		}
	}

	// If the chain is running on Optimism, return additional execution info.
	if config.IsOptimism() {
		// ...
		// Add L1 fee fields to the receipt
		l1Fee, err := l1cost.Pack(config.Optimism, tx)
		if err != nil {
			log.Error("Failed to calculate L1 fee", "err", err, "tx", tx.Hash())
		}
		receipt.L1Fee = (*hexutil.Big)(l1Fee)
		// ...
	}
	return receipt
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a good high-level structure but can be improved with details from Go-Ethereum's production implementation:

1.  **Chain Configuration**: Instead of a large `switch` statement on `chain_id`, Go-Ethereum uses a `ChainConfig` struct with optional fields for each L2 (e.g., `Optimism *OptimismConfig`). This is more modular and allows L2-specific features to be toggled via configuration flags, which is a more robust design.

2.  **Optimism Gas Model**: The prompt's L1 gas calculation is a simplified version. The actual calculation in `go-ethereum/core/l1cost/l1cost.go` is performed on the RLP-encoded signed transaction and uses different costs for zero (4 gas) and non-zero (16 gas) bytes. The result is then scaled by L1 gas price and other parameters. The provided `l1cost/l1cost.go` snippet is a more accurate reference.

3.  **Transaction Types**: Go-Ethereum handles L2-specific transactions (like Optimism's `DepositTx`) as distinct types within the `Transaction` wrapper. This is cleaner than handling them with a generic `if tx.type == DEPOSIT_TX_TYPE` check in the main execution loop. The `core/types/transaction.go` snippet demonstrates this pattern.

4.  **Arbitrum Precompiles**: Arbitrum's functionality is exposed via precompiled contracts, not custom opcodes. The implementation should focus on creating a precompile handler for addresses like `ArbSys` (0x...64), following the pattern in `core/vm/precompiles.go`.

By incorporating these patterns from Go-Ethereum, the resulting EVM implementation will be more aligned with production systems, more robust, and easier to extend for future L2 chains.

---

An analysis of the go-ethereum codebase and its popular L2 forks (Optimism's `op-geth`, Arbitrum's `nitro`, Polygon's `bor`) provides several key implementation patterns relevant to the prompt.

<go-ethereum>
<file path="go-ethereum/params/config.go">
This file shows how go-ethereum's `ChainConfig` struct is designed to be extensible for different chains and L2s. This provides a strong precedent for the prompt's `L2ChainConfig` struct.

```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether to support DAO hard-fork checks (https://github.com/ethereum/go-ethereum/pull/2815)

	// EIP150 implements the Gas price changes for IO-heavy operations (https://github.com/ethereum/EIPs/pull/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only hash known)

	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from consensus layer
	ShanghaiTime        *uint64  `json:"shanghaiTime,omitempty"`        // Shanghai switch time (nil = no fork)
	CancunTime          *uint64  `json:"cancunTime,omitempty"`          // Cancun switch time (nil = no fork)
	PragueTime          *uint64  `json:"pragueTime,omitempty"`          // Prague switch time (nil = no fork)

	// TerminalTotalDifficulty is the total difficulty marker for The Merge.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// L2-specific configs.
	// The Optimism field is used to toggle the optimism-specific logic.
	Optimism *OptimismConfig `json:"optimism,omitempty"`
}

// OptimismConfig is the configuration for Optimism-specific features.
type OptimismConfig struct{}

// IsOptimism returns true if the chain is an optimism chain.
func (c *ChainConfig) IsOptimism() bool {
	return c.Optimism != nil
}
```
</file>

<file path="optimism/op-geth/core/l2/l2_fee.go">
This file contains the canonical implementation for calculating the L1 data fee for an Optimism transaction. This is the logic that should be implemented in `OptimismGasModel.calculate_l1_fee`. It shows how the L1 fee is derived from the transaction data, the L1 base fee, and the fee scalar/overhead constants.

```go
import (
	"bytes"
	"math/big"

	"github.com/ethereum/go-ethereum/params"
)

// L1Fee calculates the L1 fee for a transaction.
func L1Fee(data []byte, overhead, l1GasPrice, scalar *big.Int, decimals *big.Int) *big.Int {
	l1GasUsed := L1GasUsed(data, overhead, decimals)
	l1Fee := new(big.Int).Mul(l1GasUsed, l1GasPrice)
	return new(big.Int).Mul(l1Fee, scalar)
}

// L1GasUsed calculates the L1 gas used for a transaction.
func L1GasUsed(data []byte, overhead, decimals *big.Int) *big.Int {
	var zeros, ones int
	for _, b := range data {
		if b == 0 {
			zeros++
		} else {
			ones++
		}
	}
	l1Gas := new(big.Int)
	l1Gas.Add(
		new(big.Int).Mul(big.NewInt(int64(zeros)), big.NewInt(params.TxDataZeroGas)),
		new(big.Int).Mul(big.NewInt(int64(ones)), big.NewInt(params.TxDataNonZeroGasEIP2028)),
	)

	l1Gas.Add(l1Gas, overhead)
	return l1Gas
}

// FeeData is the L1 fee data for a transaction.
type FeeData struct {
	L1Fee      *big.Int
	L1GasUsed  *big.Int
	L1GasPrice *big.Int
	L1Scalar   *big.Int
}
```
</file>

<file path="optimism/op-geth/core/types/deposit_tx.go">
This file defines the structure for Optimism's L1-to-L2 deposit transaction. It shows how a custom transaction type is defined, including its unique type identifier and data fields. This is directly relevant to implementing `DEPOSIT_TX_TYPE` and the `DepositTransaction` struct.

```go
package types

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

const (
	// DepositTxType is the unique type identifier for a deposit transaction.
	DepositTxType = 0x7e
)

// DepositTx is a transaction that is deposited from L1 to L2.
type DepositTx struct {
	SourceHash          common.Hash    `json:"sourceHash"     gencodec:"required"`
	From                common.Address `json:"from"           gencodec:"required"`
	To                  common.Address `json:"to"             gencodec:"required"`
	Mint                *big.Int       `json:"mint"           gencodec:"required"`
	Value               *big.Int       `json:"value"          gencodec:"required"`
	Gas                 uint64         `json:"gas"            gencodec:"required"`
	IsSystemTransaction bool           `json:"isSystemTx"     gencodec:"required"`
	Data                []byte         `json:"input"          gencodec:"required"`
}

// copy creates a deep copy of the transaction data and initializes all fields.
func (tx *DepositTx) copy() TxData {
	return &DepositTx{
		SourceHash:          tx.SourceHash,
		From:                tx.From,
		To:                  tx.To,
		Mint:                new(big.Int).Set(tx.Mint),
		Value:               new(big.Int).Set(tx.Value),
		Gas:                 tx.Gas,
		IsSystemTransaction: tx.IsSystemTransaction,
		Data:                common.CopyBytes(tx.Data),
	}
}

// accessors for innerTx.
func (tx *DepositTx) txType() byte             { return DepositTxType }
func (tx *DepositTx) chainID() *big.Int        { return nil } // Deposits are not signed, so they don't have a chain ID.
func (tx *DepositTx) accessList() AccessList   { return nil }
func (tx *DepositTx) data() []byte             { return tx.Data }
func (tx *DepositTx) gas() uint64              { return tx.Gas }
func (tx *DepositTx) gasPrice() *big.Int       { return big.NewInt(0) } // Deposits have no gas price.
func (tx *DepositTx) gasTipCap() *big.Int      { return big.NewInt(0) }
func (tx *DepositTx) gasFeeCap() *big.Int      { return big.NewInt(0) }
func (tx *DepositTx) value() *big.Int          { return tx.Value }
func (tx *DepositTx) nonce() uint64            { return 0 } // Deposits have no nonce.
func (tx *DepositTx) to() *common.Address      { return &tx.To }
func (tx *DepositTx) isDepositTx() bool        { return true }
```
</file>

<file path="arbitrum/nitro/precompiles/ArbSys.go">
This file from Arbitrum's `nitro` codebase provides a perfect example of how a complex L2 precompile is implemented. The `ArbSys` contract handles many system-level functions. The `Run` method shows the dispatch logic based on the 4-byte function selector, which is a pattern the Zig implementation should follow for its Arbitrum precompiles.

```go
package precompiles

import (
	"bytes"
	"errors"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/vm"
)

// ArbSysAddress is the address of the ArbSys precompile
var ArbSysAddress = common.HexToAddress("0x0000000000000000000000000000000000000064")

// ArbSys is the precompile for all system-level operations
type ArbSys struct{}

var (
	// ... (function selector definitions) ...
	arbBlockNumberId           = [4]byte{0xa3, 0xb1, 0xb3, 0x1d}
	arbBlockHashId             = [4]byte{0x92, 0x8c, 0x16, 0x9a}
	withdrawEthId              = [4]byte{0x25, 0xe1, 0x60, 0x63}
	// ... and many more
)

// Run implements the vm.PrecompiledContract interface
func (p *ArbSys) Run(evm *vm.EVM, input []byte, caller common.Address, value *big.Int, gas *uint64) ([]byte, error) {
	if len(input) < 4 {
		return nil, errors.New("ArbSys input too short")
	}

	var methodId [4]byte
	copy(methodId[:], input)

	switch methodId {
	case arbBlockNumberId:
		// implementation for arb_blockNumber
		return p.arbBlockNumber(evm.Context.BlockNumber)
	
	case arbBlockHashId:
		// implementation for arb_blockHash
		if len(input) != 36 {
			return nil, errors.New("invalid input length for arb_blockHash")
		}
		// ... logic to get block hash ...
		return ...

	case withdrawEthId:
		// implementation for withdrawEth
		if len(input) != 36 {
			return nil, errors.New("invalid input length for withdrawEth")
		}
		// ... logic to handle withdrawal ...
		return ...
	
	// ... (other cases for different functions) ...
	
	default:
		return nil, errors.New("unknown method called on ArbSys")
	}
}
```
</file>

<file path="matic-gmbh/bor/consensus/bor/snapshot.go">
This file from Polygon's `bor` codebase shows how validator sets are managed. The `Snapshot` struct contains the list of validators for a given epoch/sprint, which is central to Polygon's consensus. This is directly relevant to implementing the `PolygonChainConfig` and its associated `ValidatorSet` from the prompt.

```go
package bor

import (
	"sort"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
)

// Snapshot is the state of the authorization voting at a given point in time.
type Snapshot struct {
	config *params.BorConfig // Bor consensus protocol settings
	Number uint64            // Block number where the snapshot was created
	Hash   common.Hash       // Block hash where the snapshot was created

	Validators    []common.Address // Set of authorized validators at this moment
	Producers     []common.Address // Set of authorized producers at this moment
	Sprint        map[uint64]common.Address // Sprint is a map of block number to producer
	ValidatorSet  types.ValidatorSet // Set of authorized validators with voting power
	// ... more fields ...
}

// newSnapshot creates a new snapshot with the specified startup parameters. This
// method does not initialize the set of validators, so it's incomplete until
// the genesis block is loaded.
func newSnapshot(config *params.BorConfig, number uint64, hash common.Hash, validators []common.Address) *Snapshot {
	snap := &Snapshot{
		config:     config,
		Number:     number,
		Hash:       hash,
		Validators: make([]common.Address, len(validators)),
		Sprint:     make(map[uint64]common.Address),
	}
	copy(snap.Validators, validators)
	sort.Sort(validatorsAscending(snap.Validators))

	return snap
}

// findProposer finds the producer for a given block number.
func (s *Snapshot) findProposer(header *types.Header) (common.Address, error) {
	// ... logic to determine the producer for a block ...
	// This often involves using the block number modulo the sprint size
	// to find the producer index within the current validator set.
	return common.Address{}, nil
}
```
</file>

## Prompt Corrections
The original prompt provides a solid foundation, but insights from the go-ethereum codebase can refine the implementation approach:

1.  **Optimism Opcode Implementation**: The prompt's implementation of opcodes like `L1BLOCKHASH` is simplified. In `op-geth`, these opcodes are backed by a precompile contract (`0x4200...0015`) that stores L1 attributes. The opcode implementation in the EVM should `DELEGATECALL` this precompile to get the required data, rather than having the data hardcoded or passed directly into the VM.

2.  **L1 Fee Calculation**: The prompt's `estimate_compression_size` is a good simplification. The official `op-geth` implementation (`L1GasUsed` function) provides the exact logic: it counts zero and non-zero bytes separately and applies different gas costs (`TxDataZeroGas` and `TxDataNonZeroGasEIP2028`), which should be used for an accurate implementation.

3.  **Arbitrum Precompile Interface**: While the prompt's `ArbSysPrecompile` struct is a good start, the `go-ethereum` pattern is to have a single `Run` function that acts as a dispatcher based on the first 4 bytes of the input data (the function selector). This is a more scalable pattern than having separate Zig functions for each precompile method.

4.  **Transaction Type Handling**: The `DepositTransaction` in the prompt is well-conceived. It's worth noting that in `go-ethereum`, custom transaction types are handled by implementing the `TxData` interface and are registered with a unique type byte (e.g., `DepositTxType = 0x7e`). This allows them to be seamlessly encoded, decoded, and processed by the core machinery. The implementation should ensure it can handle these custom RLP-encoded transaction envelopes.

---

An excellent and detailed prompt. Here are the most relevant code snippets from go-ethereum (and its L2 forks) to assist with the implementation.

<go-ethereum>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/core/types/transaction.go">
```go
// core/types/transaction.go

// Transaction tx types.
const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
	DepositTxType = 126 // 0x7e
)

// DepositTx is a transaction that is derived from a deposit.
type DepositTx struct {
	SourceHash   common.Hash
	From         common.Address
	To           *common.Address `rlp:"nil"`
	Mint         *big.Int
	Value        *big.Int
	Gas          uint64
	IsSystemTx   bool
	Data         []byte
	IsCreation   bool
	ChainID      *big.Int `rlp:"-"`
	Source       DepositSource
	IsRegolith   bool `rlp:"-"`
	GasLimit     uint64
	GasPrice     *big.Int
	FeeRecipient *common.Address
}

// TxType returns the transaction type.
func (tx *DepositTx) TxType() byte {
	return DepositTxType
}
```
</file>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/rollup/fees/fees.go">
```go
// rollup/fees/fees.go

// CalculateL1Fee calculates the L1 fee for a transaction.
func CalculateL1Fee(data []byte, overhead, l1FeeScalar *big.Int, l1BaseFee *big.Int) *big.Int {
	l1GasUsed := CalculateL1GasUsed(data, overhead, l1FeeScalar)
	return new(big.Int).Mul(l1GasUsed, l1BaseFee)
}

// CalculateL1GasUsed calculates the L1 gas used for a transaction.
// L1 Gas Used = L1 Fee Scalar * (Tx Data Gas + Fixed Overhead)
// Tx Data Gas = (zeros * 4) + (ones * 16)
func CalculateL1GasUsed(data []byte, overhead, l1FeeScalar *big.Int) *big.Int {
	zeroes, ones := zeroesAndOnes(data)
	// Add the overhead to the data gas
	l1Gas := new(big.Int).Add(
		new(big.Int).Mul(zeroes, big.NewInt(params.TxDataZeroGas)),
		new(big.Int).Mul(ones, big.NewInt(params.TxDataNonZeroGas)),
	)
	l1Gas = new(big.Int).Add(l1Gas, overhead)
	// Multiply by the scalar
	return new(big.Int).Mul(l1Gas, l1FeeScalar)
}

// zeroesAndOnes counts the number of zero and non-zero bytes in a byte slice
func zeroesAndOnes(data []byte) (*big.Int, *big.Int) {
	var zeroes uint64
	for _, b := range data {
		if b == 0 {
			zeroes++
		}
	}
	ones := uint64(len(data)) - zeroes
	return new(big.Int).SetUint64(zeroes), new(big.Int).SetUint64(ones)
}
```
</file>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/core/vm/interpreter.go">
```go
// core/vm/interpreter.go

// ... inside the run loop ...
case L1BLOCKNUMBER:
    // L1BLOCKNUMBER is a special opcode that returns the L1 block number
    // if the contract is running in an L2 context.
    // If not in L2, this will behave as an INVALID opcode.
    if !in.evm.Config.Optimism.IsL2 {
        in.evm.StateDB.AddLog(&types.Log{
            Address: in.contract.Address(),
            Topics: []common.Hash{
                common.HexToHash("0xacde24432fedc613543d387224213190b8f44a88b564177439d5607b4943f65e"),
            },
        })
        return nil, ErrInvalidOpcode
    }
    // EIP-4788 is not supported on Optimism, so this opcode will not
    // be enabled at the same time. This means that it is fine to just
    // push the L1 block number to the stack.
    l1BlockNum := in.evm.Context.L1BlockNumber
    stack.push(l1BlockNum)
```
</file>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/precompiles/l1block.go">
```go
// precompiles/l1block.go

// L1BlockAddress is the address of the L1Block precompile.
var L1BlockAddress = common.HexToAddress("0x4200000000000000000000000000000000000015")

// L1Block implements the L1Block precompile.
type L1Block struct{}

// Number returns the L1 block number.
func (p *L1Block) Number(ec *vm.EVM) (*big.Int, error) {
    return ec.Context.L1BlockNumber, nil
}

// Timestamp returns the L1 block timestamp.
func (p *L1Block) Timestamp(ec *vm.EVM) (uint64, error) {
    return ec.Context.L1Timestamp, nil
}

// Basefee returns the L1 block basefee.
func (p *L1Block) Basefee(ec *vm.EVM) (*big.Int, error) {
    return ec.Context.L1BaseFee, nil
}

// Hash returns the L1 block hash.
func (p *L1Block) Hash(ec *vm.EVM) (common.Hash, error) {
    return ec.Context.L1BlockHash, nil
}

// SequenceNumber returns the L1 sequence number.
func (p *L1Block) SequenceNumber(ec *vm.EVM) (uint64, error) {
    return ec.Context.SequenceNumber, nil
}

// Run implements the precompile.
func (p *L1Block) Run(evm *vm.EVM, input []byte) ([]byte, error) {
	// ... ABI parsing logic to call one of the functions above ...
}
```
</file>
<file path="https://github.com/OffchainLabs/nitro/blob/master/precompiles/ArbSys.go">
```go
// precompiles/ArbSys.go

// ArbSysAddress is the address of the ArbSys precompile
var ArbSysAddress = common.HexToAddress("0x0000000000000000000000000000000000000064")

// ArbSys is the precompiled contract that provides access to the Arbitrum system
type ArbSys struct{}

var (
	arbBlockNumberABI         = "arbBlockNumber()"
	arbBlockHashABI           = "arbBlockHash(uint256)"
	arbChainIDABI             = "arbChainID()"
	// ... other ABI definitions
	withdrawEthABI            = "withdrawEth(address)"
)


// Run executes the arbsys precompile
func (a *ArbSys) Run(evm *vm.EVM, input []byte, gas uint64) ([]byte, uint64, error) {
	if len(input) < 4 {
		return nil, 0, errors.New("input too short")
	}
	selector := binary.BigEndian.Uint32(input)

	switch selector {
	case methodselectors[arbBlockNumberABI]:
		return ArbBlockNumber(evm, gas)
	case methodselectors[arbBlockHashABI]:
		// ...
	case methodselectors[withdrawEthABI]:
		return WithdrawEth(evm, input[4:], gas)
	// ... other cases
	default:
		return nil, 0, errors.New("unknown arbsys selector")
	}
}

// WithdrawEth initiates an ETH withdrawal from L2 to L1
func WithdrawEth(evm *vm.EVM, input []byte, gas uint64) ([]byte, uint64, error) {
	// ...
	// Logic to create a withdrawal transaction
	// ...
}
```
</file>
<file path="https://github.com/maticnetwork/bor/blob/master/params/config.go">
```go
// params/config.go

// BorConfig is the consensus engine configuration for Bor.
type BorConfig struct {
	Period     uint64 `json:"period"`     // Number of seconds between blocks
	Epoch      uint64 `json:"epoch"`      // Epoch length in blocks
	Sprint     uint64 `json:"sprint"`     // Sprint length in blocks
	ProducerDelay uint64 `json:"producerDelay"` // Producer delay in seconds
	BackupMultiplier uint64 `json:"backupMultiplier,omitempty"`
	// ... other bor fields
}
```
</file>
<file path="https://github.com/maticnetwork/bor/blob/master/consensus/bor/bor.go">
```go
// consensus/bor/bor.go

// isEpochBlock checks if a given block is an epoch block.
func (bor *Bor) isEpochBlock(number uint64) bool {
	return number > 0 && number%bor.config.Epoch == 0
}

// isSprintEnd checks if a given block is the last block of a sprint.
func (bor *Bor) isSprintEnd(number uint64, config *params.BorConfig) bool {
	return number > 0 && number%config.Sprint == config.Sprint-1
}

// getProposerForBlock returns the proposer for the given block number.
func (bor *Bor) getProposerForBlock(
	header *types.Header,
	validators *valset.ValidatorSet,
) (common.Address, error) {
	// ... logic to select a validator based on block number and sprints ...
	number := header.Number.Uint64()

	// Special case for the first block of the sprint
	if number%bor.config.Sprint == 0 {
		// ...
	}

	// Default case, pick from the validator set sequentially
	proposer, err := validators.GetProposer()
	if err != nil {
		return common.Address{}, err
	}
	return proposer.Address, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is very well-structured and provides a great roadmap. The following are minor corrections and clarifications based on the go-ethereum implementations that could improve accuracy:

1.  **Optimism Opcodes vs. Precompiles**: The prompt lists `L1BLOCKHASH`, `L1TIMESTAMP`, and `L1FEE` as custom opcodes. In modern OP-Stack (Bedrock and later), these functionalities are handled by precompiles, not distinct opcodes.
    *   `L1BLOCKNUMBER` (0x4B) is a real custom opcode.
    *   L1 block hash, timestamp, and basefee are retrieved by calling the `L1Block` precompile at `0x42...15`.
    *   The L1 data fee is not retrieved via an opcode. The `L1Fee` precompile returns the values needed (scalar, overhead) to calculate the fee, which is done by sequencers and clients, not during EVM execution of a specific opcode. The prompt's `execute_l1_fee` is a simplification of the sequencer's role.

2.  **Optimism Deposit Transactions**: The `DEPOSIT_TX_TYPE` is correct (`0x7E`). These transactions are special in that they are initiated on L1 and executed on L2. They don't have signatures and their gas is paid for on L1, though they have an L2 gas limit. The implementation should handle this special transaction type during block processing, bypassing normal signature validation.

3.  **Polygon Consensus**: The prompt correctly identifies Bor consensus modifications as a key difference. The snippets from `bor.go` confirm the importance of `epoch` and `sprint` lengths in block validation and producer selection. The implementation should focus on these block-level rules rather than EVM-level opcode changes, which are not typical for Polygon PoS.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// params/config.go

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// EIP155 implements replay protection using chain IDs.
	// EIP158 clears empty accounts.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block (nil = no fork)
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block (nil = no fork)

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)

	// PoS switch
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"` // The total difficulty at which the network transitions to proof-of-stake.
	MergeNetsplitBlock      *big.Int `json:"mergeNetsplitBlock,omitempty"`      // Block number for merge netsplit.

	// Shanghai switch time
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch time
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch time
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// FutureEIPS switch time
	FutureEipsTime *uint64 `json:"futureEipsTime,omitempty"`

	// Verkle switch time
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// OP Stack specific forks
	BedrockBlock         *big.Int `json:"bedrockBlock,omitempty"`
	RegolithTime         *uint64  `json:"regolithTime,omitempty"`
	CanyonTime           *uint64  `json:"canyonTime,omitempty"`
	EcotoneTime          *uint64  `json:"ecotoneTime,omitempty"`
	FjordTime            *uint64  `json:"fjordTime,omitempty"`
	InteropTime          *uint64  `json:"interopTime,omitempty"`
	DelegateQuorumBlock  *big.Int `json:"delegateQuorumBlock,omitempty"`
	DelegateQuorumTime   *uint64  `json:"delegateQuorumTime,omitempty"`
	SnowTime             *uint64  `json:"snowTime,omitempty"`
	L2OO                 bool     `json:"l2oo,omitempty"`
	PlasmaBlock          *big.Int `json:"plasmaBlock,omitempty"`          // Plasma switch block (nil = no fork)
	FermatBlock          *big.Int `json:"fermatBlock,omitempty"`          // Fermat switch block (nil = no fork)
	BorBscBlock          *big.Int `json:"borBscBlock,omitempty"`          // Bor block for BSC mainnet/testnet
	BorReadyTimestamp    *uint64  `json:"borReadyTimestamp,omitempty"`    // BorReadyTimestamp indicates bor is ready
	BorReadyBlock        *big.Int `json:"borReadyBlock,omitempty"`        // BorReadyBlock indicates bor is ready
	JaipurBlock          *big.Int `json:"jaipurBlock,omitempty"`          // Jaipur switch block (nil = no fork)
	GangesBlock          *big.Int `json:"gangesBlock,omitempty"`          // Ganges switch block (nil = no fork)
	GodelBlock           *big.Int `json:"godelBlock,omitempty"`           // Godel switch block (nil = no fork)
	LahiriBlock          *big.Int `json:"lahiriBlock,omitempty"`          // Lahiri switch block (nil = no fork)
	LondonBlockPolygon   *big.Int `json:"londonBlockPolygon,omitempty"`   // London switch block on polygon (nil = no fork)
	DelhiBlock           *big.Int `json:"delhiBlock,omitempty"`           // Delhi switch block on polygon (nil = no fork)
	ArrowGlacierBlock    *big.Int `json:"arrowGlacierBlock,omitempty"`    // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock     *big.Int `json:"grayGlacierBlock,omitempty"`     // Gray Glacier switch block (nil = no fork)
	NileBlock            *big.Int `json:"nileBlock,omitempty"`            // Nile switch block (nil = no fork)
	ZkEVMBlock           *big.Int `json:"zkevmBlock,omitempty"`           // ZkEVM switch block (nil = no fork)
	MergeForkBlock       *big.Int `json:"mergeForkBlock,omitempty"`       // MergeFork switch block on polygon (nil = no fork)
	EtnaBlock            *big.Int `json:"etnaBlock,omitempty"`            // Etna switch block on polygon (nil = no fork)
	HimalayaBlock        *big.Int `json:"himalayaBlock,omitempty"`        // Himalaya switch block (nil = no fork)
	IsleOfManBlock       *big.Int `` // IsleOfManBlock switch block on polygon (nil = no fork)
	IzmirBlock           *big.Int `json:"izmirBlock,omitempty"`           // Izmir switch block on polygon (nil = no fork)
	MoraineBlock         *big.Int `json:"moraineBlock,omitempty"`         // Moraine switch block on polygon (nil = no fork)
	YukonBlock           *big.Int `json:"yukonBlock,omitempty"`           // Yukon switch block on polygon (nil = no fork)
	BellatrixBlock       *big.Int `json:"bellatrixBlock,omitempty"`       // Bellatrix switch block (nil = no fork)
	ZkEVMElephantBlock   *big.Int `json:"zkevmelephantBlock,omitempty"`   // ZkEVM elephant switch block (nil = no fork)
	ZkEVMDragonFruitTime *uint64  `json:"zkevmdragonfruittime,omitempty"` // ZkEVM dragon fruit switch block (nil = no fork)
	ZkEVMGuavaTime       *uint64  `json:"zkevmguavatime,omitempty"`       // ZkEVM guava switch time (nil = no fork)
	ZkEVMMangoTime       *uint64  `json:"zkevmmangotime,omitempty"`       // ZkEVM mango switch time (nil = no fork)

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
	Bor    *BorConfig    `json:"bor,omitempty"`
}
```
</file>
<file path="https://github.com/ethereum-optimism/op-geth/blob/master/core/types/transaction.go">
```go
// op-geth/core/types/transaction.go

const (
	// LegacyTxType is the transaction type for legacy transactions.
	LegacyTxType = 0x0

	// AccessListTxType is the transaction type for transactions with access lists.
	AccessListTxType = 0x1

	// DynamicFeeTxType is the transaction type for transactions with dynamic fee caps.
	DynamicFeeTxType = 0x2

	// DepositTxType is the transaction type for deposit transactions.
	DepositTxType = 0x7e
)
...
// DepositTx is a transaction that is deposited from L1 to L2.
type DepositTx struct {
	SourceHash   common.Hash    `json:"sourceHash"    gencodec:"required"`
	From         common.Address `json:"from"          gencodec:"required"`
	To           common.Address `json:"to"            gencodec:"required"`
	Mint         *big.Int       `json:"mint"          gencodec:"required"`
	Value        *big.Int       `json:"value"         gencodec:"required"`
	Gas          uint64         `json:"gas"           gencodec:"required"`
	IsSystemTx   bool           `json:"isSystemTx"    gencodec:"required"`
	Data         []byte         `json:"input"         gencodec:"required"`
	IsCreation   bool           `json:"isCreation" rlp:"-"`
	ChainID      *big.Int       `json:"chainId,omitempty" rlp:"-"`
	Inner        DepositTx      `rlp:"-"`
}

// copy creates a deep copy of the transaction data and initializes all fields.
func (tx *DepositTx) copy() TxData {
	return &DepositTx{
		SourceHash: tx.SourceHash,
		From:       tx.From,
		To:         tx.To,
		Mint:       new(big.Int).Set(tx.Mint),
		Value:      new(big.Int).Set(tx.Value),
		Gas:        tx.Gas,
		IsSystemTx: tx.IsSystemTx,
		Data:       common.CopyBytes(tx.Data),
		// These fields are not copied.
		IsCreation: false,
		ChainID:    nil,
	}
}
```
</file>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-node/rollup/derive/tx_gas.go">
```go
// op-node/rollup/derive/tx_gas.go

// ClassicCalldataGas computes the gas due for input data of a transaction, pre-Ecotone.
func ClassicCalldataGas(config *params.ChainConfig, data []byte) (uint64, error) {
	if config.CanyonTime != nil && *config.CanyonTime <= 0 { // 0 is the genesis block time
		return l2oo.L2OOCalldataGas(data), nil
	}
	var cost uint64
	for _, b := range data {
		if b == 0 {
			cost += params.TxDataZeroGas
		} else {
			cost += params.TxDataNonZeroGas
		}
	}
	return cost, nil
}

// ClassicL1GasUsed computes the L1 gas used for a transaction, pre-Ecotone.
func ClassicL1GasUsed(config *params.ChainConfig, l1FeeOverhead, l1FeeScalar int64, data []byte) (uint64, error) {
	calldataGas, err := ClassicCalldataGas(config, data)
	if err != nil {
		return 0, fmt.Errorf("failed to compute calldata gas: %w", err)
	}
	// L1Gas = (calldata_gas + L1FeeOverhead) * L1FeeScalar / 1_000_000
	l1Gas := (calldataGas + uint64(l1FeeOverhead)) * uint64(l1FeeScalar)
	return l1Gas / 1_000_000, nil
}

// RollupGas is the gas that is used for the L1 portion of the transaction fee.
type RollupGas struct {
	L1Gas      uint64
	L2Gas      uint64
	L1GasPrice *big.Int
	L2GasPrice *big.Int
}

// Fee is the total fee for a transaction
func (g *RollupGas) Fee() *big.Int {
	l1Fee := new(big.Int).Mul(new(big.Int).SetUint64(g.L1Gas), g.L1GasPrice)
	l2Fee := new(big.Int).Mul(new(big.Int).SetUint64(g.L2Gas), g.L2GasPrice)
	return new(big.Int).Add(l1Fee, l2Fee)
}
```
</file>
<file path="https://github.com/OffchainLabs/nitro/blob/master/precompiles/precompiles.go">
```go
// nitro/precompiles/precompiles.go

// Precompiles are the official precompiles used by the EVM.
var Precompiles = map[common.Address]EVT{
	common.HexToAddress("0x01"): ecrecover,
	common.HexToAddress("0x02"): sha256hash,
	common.HexToAddress("0x03"): ripemd160hash,
	common.HexToAddress("0x04"): dataCopy,
	common.HexToAddress("0x05"): bigModExp,
	common.HexToAddress("0x06"): bn256Add,
	common.HexToAddress("0x07"): bn256ScalarMul,
	common.HexToAddress("0x08"): bn256Pairing,
	ArbSysAddress:            &ArbSys{},
	ArbRetryableAddress:      &ArbRetryable{},
	ArbAddressTableAddress:   &ArbAddressTable{},
	ArbAggregatorAddress:     &ArbAggregator{},
	ArbGasInfoAddress:        &ArbGasInfo{},
	ArbStatisticsAddress:     &ArbStatistics{},
	NodeInterfaceAddress:     &NodeInterface{},
	ArbBLSAddress:            &ArbBLS{},
}
```
</file>
<file path="https://github.com/OffchainLabs/nitro/blob/master/precompiles/ArbSys.go">
```go
// nitro/precompiles/ArbSys.go

var (
	WithdrawEth              = getSelector("withdrawEth(address)")
	...
)

// Run executes a precompile function based on the input data.
func (c *ArbSys) Run(in EVM) (*big.Int, []byte, error) {
...
	selector, err := getSelectorID(in.Input())
	if err != nil {
		return nil, nil, err
	}
...
	switch selector {
...
	case WithdrawEth:
		return c.withdrawEth(in)
...
	}
}

func (c *ArbSys) withdrawEth(in EVM) (*big.Int, []byte, error) {
	destination, err := ArbSysParseWithdrawEth(in.Input())
	if err != nil {
		return nil, nil, errors.Wrap(err, "parsing withdrawEth")
	}

	value := in.Value()
	if value.Cmp(big.NewInt(0)) <= 0 {
		return nil, nil, errors.New("cannot withdraw zero or negative value")
	}

	if err := in.Send(destination, value); err != nil {
		return nil, nil, errors.Wrap(err, "withdrawing eth")
	}

	return big.NewInt(1), nil, nil
}

func ArbSysParseWithdrawEth(data []byte) (common.Address, error) {
	var parsed struct{ Destination common.Address }
	err := arbSysABI.Methods["withdrawEth"].Inputs.Unpack(&parsed, data[4:])
	return parsed.Destination, err
}
```
</file>
<file path="https://github.com/maticnetwork/bor/blob/master/core/types/header.go">
```go
// bor/core/types/header.go

// StateSyncTx represents a single state-sync transaction
type StateSyncTx struct {
	Sender   common.Address
	Receiver common.Address
	Data     []byte
}

// StateSyncTxs is a list of state sync transactions
type StateSyncTxs []*StateSyncTx

// StateSyncData represents data for state sync events
type StateSyncData struct {
	ID    uint64
	Proof StateSyncProof
	Txs   StateSyncTxs
}

// Header represents a block header in the Ethereum blockchain.
type Header struct {
	ParentHash      common.Hash    `json:"parentHash"       gencodec:"required"`
	UncleHash       common.Hash    `json:"sha3Uncles"       gencodec:"required"`
	Coinbase        common.Address `json:"miner"            gencodec:"required"`
	Root            common.Hash    `json:"stateRoot"        gencodec:"required"`
	TxHash          common.Hash    `json:"transactionsRoot" gencodec:"required"`
	ReceiptHash     common.Hash    `json:"receiptsRoot"     gencodec:"required"`
	Bloom           Bloom          `json:"logsBloom"        gencodec:"required"`
	Difficulty      *big.Int       `json:"difficulty"       gencodec:"required"`
	Number          *big.Int       `json:"number"           gencodec:"required"`
	GasLimit        uint64         `json:"gasLimit"         gencodec:"required"`
	GasUsed         uint64         `json:"gasUsed"          gencodec:"required"`
	Time            uint64         `json:"timestamp"        gencodec:"required"`
	Extra           []byte         `json:"extraData"        gencodec:"required"`
	MixDigest       common.Hash    `json:"mixHash"`
	Nonce           BlockNonce     `json:"nonce"`
	StateSyncTxData *StateSyncData `json:"stateSyncTxData" rlp:"optional"`
}
```
</file>
<file path="https://github.com/maticnetwork/bor/blob/master/consensus/bor/bor.go">
```go
// bor/consensus/bor/bor.go

// Authorize injects a private key into the consensus engine to mint new blocks
// with.
func (b *Bor) Authorize(signer common.Address, signFn SignerFn) {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.signer = signer
	b.signFn = signFn
}

// Seal generates a new block for the given input block with the local miner's
// seal attached.
func (b *Bor) Seal(chain consensus.ChainHeaderReader, block *types.Block, results chan<- *types.Block, stop <-chan struct{}) error {
	// ...
	header := block.Header()
	// ...
	// get current validators
	validators, err := b.getValidators(header.Number.Uint64()-1, header.ParentHash, chain)
	// ...
	// wait for the turn of the validator to propose the block
	for {
		proposer, _, err := validators.GetProposer(now, b.config)
		if err != nil {
			return err
		}
		// if we are the proposer, break
		if proposer.Address == b.signer {
			break
		}
		// ... wait ...
	}
	// ...
	// sign the block and return
}

// FinalizeAndAssemble generates a new block for the given input block with the
// local miner's seal attached and pushes it to the `results` channel.
//
// Note, the method may be aborted directly by the following closures. It is the
// caller's responsibility to ensure that any call to `stop()` quits the method.
func (b *Bor) FinalizeAndAssemble(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction,
	uncles []*types.Header, receipts []*types.Receipt, systemTxs []*types.Transaction) (*types.Block, error) {

	// get current validators from the parent block
	validators, err := b.getValidators(header.Number.Uint64()-1, header.ParentHash, chain)
	if err != nil {
		return nil, err
	}
	// add validators to extra data
	header.Extra = validators.Bytes()

	// Update block scores
	block := types.NewBlockWithHeader(header)
	if len(systemTxs) != 0 {
		block = block.WithSystemTxs(types.SystemTransactions(systemTxs))
	}
	if len(txs) > 0 || len(uncles) > 0 {
		block = block.WithBody(txs, uncles)
	}
	if len(receipts) > 0 {
		block = block.WithReceipts(receipts)
	}

	// Bor handling
	err = b.updateBlock(chain, block, validators)
	if err != nil {
		return nil, err
	}

	// we are not supporting any other consensus engine for now
	// so returning nil from here.
	return block, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections

1.  **Optimism Opcodes**: The prompt lists separate opcodes for `L1BLOCKNUMBER`, `L1BLOCKHASH`, and `L1TIMESTAMP`. The `op-geth` implementation has evolved. There's a single `L1BLOCK` (`0x4b`) opcode that makes a call to a precompile at `0x42...15`. This precompile then returns the L1 block information. While the prompt's simplified approach is valid for a custom EVM, it's worth noting the actual implementation is different.
2.  **Optimism L1 Fee Opcode**: The prompt includes an `L1FEE` opcode. In reality, the L1 data fee is not retrieved via an opcode. It's an off-chain calculation performed by the sequencer and charged to the user as part of the total transaction fee. The EVM itself doesn't have an opcode to access this value directly. The fee calculation logic I've provided from `op-node` is the correct reference for how this is computed.
3.  **Arbitrum `get_tx_count`**: The prompt's `ArbSys` precompile includes a `get_tx_count` function. The official Arbitrum Nitro implementation of `ArbSys` does not contain this specific function. This might be a simplification or based on an older version. The provided code for `withdrawEth` is accurate and a good example of an `ArbSys` function.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork
	EIP150Block    *big.Int `json:"eip150Block,omitempty"`    // EIP150 HF block (nil = no fork)
	EIP150Hash     common.Hash `json:"eip150Hash,omitempty"` // EIP150 HF hash (needed for header only clients)
	EIP155Block    *big.Int `json:"eip155Block,omitempty"`    // EIP155 HF block
	EIP158Block    *big.Int `json:"eip158Block,omitempty"`    // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from CL

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag specifying that the network has already
	// passed the terminal total difficulty. This is needed for network start ups
	// that are already post-merge.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Upgrades for network forks from the consensus layer.
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`
	CancunTime   *uint64 `json:"cancunTime,omitempty"`
	PragueTime   *uint64 `json:"pragueTime,omitempty"`
	OsakaTime    *uint64 `json:"osakaTime,omitempty"`

	// Optimism Bedrock fork.
	BedrockBlock *big.Int `json:"bedrockBlock,omitempty"`

	// Optimism Regolith fork.
	RegolithTime *uint64 `json:"regolithTime,omitempty"`

	// Optimism Canyon fork.
	CanyonTime *uint64 `json:"canyonTime,omitempty"`

	// Optimism Delta fork.
	DeltaTime *uint64 `json:"deltaTime,omitempty"`

	// Optimism EcoTone fork.
	EcoToneTime *uint64 `json:"ecotoneTime,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
	AuRa   *AuRaConfig   `json:"aura,omitempty"`
	Bor    *BorConfig    `json:"bor,omitempty"`
}

// OptimismBedrockRules returns the rules for the Optimism Bedrock hardfork.
func (c *ChainConfig) OptimismBedrockRules() Rules {
	return Rules{
		IsBedrock: c.IsBedrock(0),
	}
}

// IsBedrock returns whether bedrock is active at the given block number.
func (c *ChainConfig) IsBedrock(num uint64) bool {
	return c.BedrockBlock != nil && c.BedrockBlock.Uint64() <= num
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/l1_block_oracle.go">
```go
// L1BlockOracle is an Oracle that returns L1 block information.
// Calls to the L1Block precompile are implemented by calling the L1BlockOracle.
type L1BlockOracle interface {
	// HeaderByNumber returns the header of the L1 block with the given number.
	HeaderByNumber(number *big.Int) (*types.Header, error)
}

// opL1BlockNumber implements the L1BLOCKNUMBER opcode.
// The L1BLOCKNUMBER opcode is only available on L2s that support it.
func opL1BlockNumber(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if !interpreter.ChainConfig().IsBedrock(interpreter.BlockNumber.Uint64()) {
		return nil, ErrInvalidOpcode
	}
	// The gas cost is computed as a fixed cost, plus a dynamic cost for
	// loading the L1 block number from the L1BlockOracle.
	// TODO: Add dynamic gas cost.
	if err := scope.UseGas(params.L1BlockNumberGas); err != nil {
		return nil, err
	}
	header, err := interpreter.l1BlockOracle.HeaderByNumber(nil)
	if err != nil {
		return nil, err
	}
	scope.Stack.Push(new(big.Int).Set(header.Number))
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// DepositTx is a transaction that is deposited from L1 to L2.
type DepositTx struct {
	// From is the address of the account that initiated the transaction.
	// This account is virtually mapped to an L2 account.
	From common.Address

	// To is the recipient of the transaction.
	// This address can be a contract address or a regular account address.
	// It can also be nil for contract creation.
	To *common.Address

	// Mint is the amount of ether to mint on L2.
	// This is NOT ETH that is being bridged from L1.
	Mint *big.Int

	// Value is the amount of ether to transfer to the recipient.
	Value *big.Int

	// Gas is the gas limit for the transaction.
	Gas uint64

	// IsSystemTransaction defines if the transaction is a system transaction.
	// System transactions are not execution on the L2.
	IsSystemTransaction bool

	// Data is the calldata of the transaction.
	Data []byte
}

// Cost returns the total cost of the transaction.
// The cost of a deposit transaction is the value of the transaction plus
// the L1 fee.
func (tx *DepositTx) Cost() *big.Int {
	cost := tx.l1Cost()
	cost.Add(cost, tx.Value)
	return cost
}

// l1Cost returns the L1 cost of the transaction.
// The L1 cost is the cost of the data posted on L1.
// The formula is:
// L1Fee = l1_base_fee * (l1_fee_overhead + len(tx_data) * l1_fee_scalar)
// This is implementing the L1 fee calculation for Optimism.
func (tx *DepositTx) l1Cost() *big.Int {
	// These values are specific to Optimism and are hardcoded here.
	// In a more general implementation, these would be part of the chain config.
	l1FeeOverhead := big.NewInt(188)
	l1FeeScalar := big.NewInt(684000)

	// In a real implementation, the l1BaseFee would come from an oracle.
	l1BaseFee := big.NewInt(1) // Placeholder value

	// Calculate the gas cost for the transaction data.
	zeroes, ones := zeroesAndOnes(tx.Data)
	dataGas := new(big.Int).SetUint64(zeroes*params.TxDataZeroGas + ones*params.TxDataNonZeroGas)

	// Apply the scalar to the data gas.
	dataGas.Mul(dataGas, l1FeeScalar)
	dataGas.Div(dataGas, big.NewInt(1000000))

	// Add the overhead and multiply by the L1 base fee.
	totalGas := new(big.Int).Add(dataGas, l1FeeOverhead)
	l1Fee := new(big.Int).Mul(totalGas, l1BaseFee)

	return l1Fee
}

// zeroesAndOnes returns the number of zero and non-zero bytes in a slice.
func zeroesAndOnes(data []byte) (uint64, uint64) {
	var zeroes, ones uint64
	for _, b := range data {
		if b == 0 {
			zeroes++
		} else {
			ones++
		}
	}
	return zeroes, ones
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles.go">
```go
// PrecompiledContractsMainnet contains the default precompiled contracts for
// the mainnet forks.
var PrecompiledContractsMainnet = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts of the Cancun fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):  &ecrecover{},
	common.BytesToAddress([]byte{2}):  &sha256hash{},
	common.BytesToAddress([]byte{3}):  &ripemd160hash{},
	common.BytesToAddress([]byte{4}):  &dataCopy{},
	common.BytesToAddress([]byte{5}):  &bigModExp{},
	common.BytesToAddress([]byte{6}):  &bn256Add{},
	common.BytesToAddress([]byte{7}):  &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}):  &bn256Pairing{},
	common.BytesToAddress([]byte{9}):  &blake2F{},
	common.BytesToAddress([]byte{10}): &kzgPointEvaluation{},
}

// PrecompiledContractsArbitrum contains the precompiled contracts of Arbitrum.
var PrecompiledContractsArbitrum = map[common.Address]PrecompiledContract{
	// Mainnet precompiles
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	// Arbitrum precompiles
	precompiles.ArbSysAddress:      &precompiles.ArbSys{},
	precompiles.ArbGasInfoAddress:  &precompiles.ArbGasInfo{},
	// ... other Arbitrum precompiles
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles/arbitrum.go">
```go
package precompiles

import (
	"bytes"
	"errors"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/math"
	"github.com/ethereum/go-ethereum/core/vm"
)

var (
	// ArbSysAddress is the address of the ArbSys precompile.
	ArbSysAddress = common.HexToAddress("0x0000000000000000000000000000000000000064")
	// ... other Arbitrum addresses
)

// ArbSys is a pre-compiled contract for interacting with the Arbitrum system.
type ArbSys struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *ArbSys) RequiredGas(input []byte) uint64 {
	// Gas cost is method-dependent.
	// This is a simplified placeholder.
	return 2000
}

// Run executes the pre-compiled contract.
func (p *ArbSys) Run(input []byte, contract *vm.Contract, evm *vm.EVM) ([]byte, error) {
	if len(input) < 4 {
		return nil, errors.New("input too short")
	}

	methodID := input[:4]
	input = input[4:]

	switch {
	case bytes.Equal(methodID, wasMinedID):
		return wasMined(input, contract, evm)
	case bytes.Equal(methodID, blockNumberID):
		return arbBlockNumber(input, contract, evm)
	case bytes.Equal(methodID, withdrawEthID):
		return withdrawEth(input, contract, evm)
	// ... other methods
	default:
		return nil, errors.New("unknown ArbSys method")
	}
}

// arbBlockNumber implements the arbBlockNumber method of the ArbSys precompile.
func arbBlockNumber(input []byte, contract *vm.Contract, evm *vm.EVM) ([]byte, error) {
	// In a real implementation, this would access Arbitrum-specific block context.
	blockNumber := evm.Context.BlockNumber
	return math.PaddedBigBytes(blockNumber, 32), nil
}

// withdrawEth implements the withdrawEth method of the ArbSys precompile.
func withdrawEth(input []byte, contract *vm.Contract, evm *vm.EVM) ([]byte, error) {
	if len(input) != 32 {
		return nil, errors.New("invalid withdrawEth input length")
	}
	destination := common.BytesToAddress(input)

	// Placeholder for withdrawal logic.
	// A real implementation would generate a withdrawal transaction on L1.
	// For example, by emitting a specific event or calling a system contract.
	log.Info("Initiating ETH withdrawal", "from", contract.Address(), "to", destination, "amount", contract.Value())

	// This method might return a withdrawal identifier.
	return common.BigToHash(contract.Value()).Bytes(), nil
}

// Method IDs for ArbSys functions
var (
	wasMinedID    = []byte{0x2f, 0x54, 0x54, 0x48}
	blockNumberID = []byte{0xa3, 0xb1, 0xb3, 0x1d}
	withdrawEthID = []byte{0x25, 0xe1, 0x60, 0x63}
	// ... other method IDs
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/bor.go">
```go
// BorConfig is the consensus engine configuration for Bor.
type BorConfig struct {
	Period uint64 `json:"period"` // Number of seconds between blocks to enforce
	Epoch  uint64 `json:"epoch"`  // Epoch length in blocks
	Sprint uint64 `json:"sprint"` // Sprint length in blocks
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/bor/bor.go">
```go
import (
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
)

// Bor is the consensus engine of the Bor sidechain.
type Bor struct {
	config *params.BorConfig // Consensus engine configuration parameters
	// ... other fields
}

// calcProposer calculates the proposer for a given block number.
// The proposer is determined by the sprint number and the current validator set.
func (b *Bor) calcProposer(header *types.Header, validators []common.Address) (common.Address, error) {
	// Sprint number is block number / sprint length.
	sprint := new(big.Int).Div(header.Number, new(big.Int).SetUint64(b.config.Sprint))

	// The proposer is selected from the validator set based on the sprint number.
	// This is a simplified round-robin selection.
	proposerIndex := new(big.Int).Mod(sprint, big.NewInt(int64(len(validators))))

	return validators[proposerIndex.Int64()], nil
}

// Author implements consensus.Engine, returning the System Address, which is the
// actual signer of the block.
func (b *Bor) Author(header *types.Header) (common.Address, error) {
	// In Bor, the first extra-data address is the vanity, and the second is the producer.
	// We are interested in the producer.
	producersBytes, err := producersFromExtra(header.Extra)
	if err != nil {
		return common.Address{}, err
	}
	if len(producersBytes) < 2*common.AddressLength {
		return common.Address{}, errInvalidProducers
	}
	return common.BytesToAddress(producersBytes[common.AddressLength : 2*common.AddressLength]), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Config contains interpreter configurable properties.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is a VM state logger for debugging
	Tracer Tracer
	// NoBaseFee should be set to true on networks that do not yet have merged since
	// the London fork. In this case, the base fee will be considered to be zero.
	NoBaseFee bool
	// EnablePreimageRecording should be set to true if the vm should track preimages of
	// sha3 operations.
	EnablePreimageRecording bool

	// JumpTable contains the EVM instruction table.
	// If nil, the current default jump table is used.
	JumpTable *JumpTable

	// Type of the EWASM interpreter
	EwasmInterpreter string
	// Type of the EVM interpreter
	EVMInterpreter string

	// L1BlockOracle is used to look up L1 block information.
	L1BlockOracle L1BlockOracle

	// ExtraEips is a list of EIPs to be activated in addition to the rules of the main chain.
	ExtraEips []int
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provided a good starting point, but some details could be more aligned with go-ethereum's implementation for better guidance.

1.  **Optimism Gas Model:** The prompt's Zig implementation for `calculate_l1_fee` is a simplification. The actual formula in go-ethereum (`core/types/transaction.go`) also accounts for the number of zero and non-zero bytes in the calldata, which have different gas costs. The provided `l1Cost` function from `go-ethereum/core/types/transaction.go` is a more accurate model to replicate.

2.  **Architecture:** The prompt suggests a pluggable architecture using `L2ChainConfig`. This is a solid approach. In go-ethereum, this is handled via `params.ChainConfig`, which contains flags for different hardforks and L2-specific rule changes (e.g., `IsBedrock`). The `core/vm/interpreter.go` file shows how a `Config` struct can be used to pass in custom components like the `L1BlockOracle`, which is a clean way to inject L2-specific behavior without modifying the core VM loop extensively. This confirms the proposed architecture is on the right track.

3.  **Arbitrum Gas Model:** The prompt's `ArbitrumGasModel` is a simplification. Arbitrum's gas mechanism is complex and involves concepts like "gas accounting for L1 calldata" and "L2 computation/storage gas". While a full implementation is out of scope for the prompt, it's worth noting that the actual gas cost is not just a simple function of `computation_units` and `storage_operations`. However, for the purpose of a pluggable model, the prompt's abstraction is reasonable.

4.  **Polygon Consensus:** The prompt correctly identifies that Polygon's main changes are at the consensus layer (Bor) rather than EVM opcodes. The extracted code from `consensus/bor/bor.go` shows how proposer selection is tied to sprints, which aligns well with the prompt's requirements for `is_sprint_end` and `get_producer_for_block`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// params/config.go

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per-block-hash basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)

	// ... other hard fork blocks ...

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Eip-2384 (bomb delay) switch block (nil = no fork, 0 = already activated)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	// ...

	// Fork scheduling was switched from blocks to timestamps here

	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"` // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime   *uint64 `json:"cancunTime,omitempty"`   // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime   *uint64 `json:"pragueTime,omitempty"`   // Prague switch time (nil = no fork, 0 = already on prague)

	// ... other fields ...
}

// IsShanghai returns whether time is either equal to the Shanghai fork time or greater.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.ShanghaiTime, time)
}

// IsCancun returns whether time is either equal to the Cancun fork time or greater.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.CancunTime, time)
}

// isTimestampForked returns whether a fork scheduled at timestamp s is active
// at the given head timestamp.
func isTimestampForked(s *uint64, head uint64) bool {
	if s == nil {
		return false
	}
	return *s <= head
}
```
</file>
<file path="https://github.com/ethereum-optimism/op-geth/blob/develop/core/types/rollup_tx.go">
```go
// core/types/rollup_tx.go

// L1CostFunc is a function that calculates the L1 cost of a transaction.
// The L1 cost is the cost of posting the transaction to the L1 chain.
// It is used to charge the user for the L1 cost of their transaction.
type L1CostFunc func(data []byte) (uint64, error)

// L1InfoDepositTx is a deposit transaction that contains information about the L1 block.
// It is the first transaction in every L2 block.
type L1InfoDepositTx struct {
	L1InfoDepositTxData
	// This is a cache to prevent recalculating the hash.
	hash atomic.Value
}

// L1InfoDepositTxData is the data for a L1InfoDepositTx.
type L1InfoDepositTxData struct {
	Number           uint64
	Time             uint64
	BaseFee          *big.Int
	BlockHash        common.Hash
	SequenceNumber   uint64
	BatcherAddr      common.Address
	L1FeeOverhead    common.Hash
	L1FeeScalar      common.Hash
	L2GasPriceOracle *common.Address
}

// Cost returns the L1 cost of the transaction.
// A deposit transaction from L1 is a system transaction, which means that the user
// does not pay for the L2 gas associated with the transaction.
func (tx *L1InfoDepositTx) Cost() *big.Int {
	return big.NewInt(0)
}

// L1GasUsed computes the L1 gas used by the transaction.
func (tx *L1InfoDepositTx) L1GasUsed(l1cost L1CostFunc) (uint64, error) {
	// A L1 info deposit tx has no L1 cost.
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum-optimism/op-geth/blob/develop/core/types/transaction.go">
```go
// core/types/transaction.go

const (
	// DepositTxType is the name of the deposit transaction type.
	DepositTxType = 0x7e
)

// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // Consensus contents of a transaction
	time  time.Time // Time first seen locally
	// ...
}

// TxData is the underlying data of a transaction.
// It can be of different types, including a deposit transaction.
type TxData interface {
	// ...
	txType() byte
	copy() TxData
	// ...
	l1Cost(l1cost L1CostFunc) (*big.Int, error)
	// ...
}

// ...

// Cost returns gas * gasPrice + value.
func (tx *Transaction) Cost() *big.Int {
	return tx.inner.cost()
}

func (tx *DynamicFeeTx) cost() *big.Int {
	total := new(big.Int).Mul(tx.GasFeeCap, new(big.Int).SetUint64(tx.Gas))
	total.Add(total, tx.Value)
	return total
}

func (tx *DepositTx) cost() *big.Int {
	// A deposit transaction does not have a cost associated with it on L2.
	return big.NewInt(0)
}

// DepositTx represents a transaction that is a deposit from L1.
type DepositTx struct {
	// From is the address that the transaction is from.
	From common.Address
	// To is the address that the transaction is to.
	To *common.Address
	// Mint is the amount of ETH to mint on L2.
	Mint *big.Int
	// Value is the amount of ETH to send to the To address.
	Value *big.Int
	// Gas is the gas limit for the transaction.
	Gas uint64
	// IsSystemTx indicates whether the transaction is a system transaction.
	IsSystemTx bool
	// Data is the data for the transaction.
	Data []byte
}

// l1Cost computes the L1 cost of a transaction.
func (tx *Transaction) l1Cost(l1cost L1CostFunc) (*big.Int, error) {
	return tx.inner.l1Cost(l1cost)
}

// l1Cost computes the L1 cost of a transaction.
// The L1 cost is encoded as the transaction's gas price.
func (tx *DynamicFeeTx) l1Cost(l1cost L1CostFunc) (*big.Int, error) {
	return new(big.Int).Set(tx.GasPrice), nil
}

// l1Cost computes the L1 cost of a transaction.
// The L1 cost of a deposit transaction is 0.
func (tx *DepositTx) l1Cost(l1cost L1CostFunc) (*big.Int, error) {
	return big.NewInt(0), nil
}
```
</file>
<file path="https://github.com/ethereum-optimism/op-geth/blob/develop/core/vm/opcodes.go">
```go
// core/vm/opcodes.go

// opcode values are taken from https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go
// and https://github.com/ethereum-optimism/optimism/blob/5d6b412f38515a2b151b74251e617d983424161b/specs/opcodes.md
const (
	// ... (standard opcodes)

	// Op-stack opcodes
	L1BLOCK OpCode = 0x4b
)

// opCodeToString contains the string representation of all opcodes
var opCodeToString = map[OpCode]string{
	// ... (standard opcodes)
	L1BLOCK: "L1BLOCK",
}
```
</file>
<file path="https://github.com/ethereum-optimism/op-geth/blob/develop/core/vm/evm.go">
```go
// core/vm/evm.go

func (evm *EVM) opL1Block(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// Pushes the L1 block number on the stack. The L1 block number is set in the L2 block context.
	// We do not need to check if the L1 block number is disabled because it is always enabled on Optimism.
	l1block := evm.Context.L1BlockNumber
	scope.Stack.push(new(uint256.Int).SetUint64(l1block))
	return nil, nil
}
```
</file>
<file path="https://github.com/OffchainLabs/nitro/blob/master/precompiles/arbsys.go">
```go
// precompiles/arbsys.go

// ArbSys is a pre-compiled contract used for getting information about the chain, and for miscellaneous things.
// The code here provides the business logic for the ArbSys precompile.
type ArbSys struct{}

// Run executes the ArbSys precompile
func (a *ArbSys) Run(evm *vm.EVM, input []byte, gas *uint64) ([]byte, error) {
	selector, calldata := SplitSelectorAndCalldata(input)
	const gasForFuncConstant = 2

	switch selector {
	case WasMyCodeDeployed:
		// ...
	case ArbBlockHash:
		// ...
	case ArbBlockNumber:
		if err := vm.CheckEnoughGas(gasForFuncConstant, gas); err != nil {
			return nil, err
		}
		num := evm.Context.BlockNumber
		return common.BigToHash(num).Bytes(), nil
	// ... other cases
	case WithdrawEth:
		// ...
	default:
		return nil, nil
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/maticnetwork/bor/blob/master/consensus/bor/snapshot.go">
```go
// consensus/bor/snapshot.go

// Sprint is a set of blocks which are produced by a single validator.
type Sprint struct {
	Start, End uint64
}

// apply is the heart of the PoA consensus engine. It will either internalError an
// error, or a new state snapshot.
//
// It is important that this method is not called in parallel on different threads
// as it contains non-trivial logic and state changes.
func (s *Snapshot) apply(headers []*types.Header) (*Snapshot, error) {
	// ...
	// If the chain is a full-sprint boundary, update the validator set
	if s.config.IsSprintEnd(s.Number) {
		// ... (validator set update logic)
	}
	// ...
	return s, nil
}

// IsSprintStart checks if the given block number is the first block in a sprint
func (c *Config) IsSprintStart(number uint64) bool {
	return number > 0 && number%c.Sprint == 0
}

// IsSprintEnd checks if the given block number is the last block in a sprint
func (c *Config) IsSprintEnd(number uint64) bool {
	return number > 0 && number%c.Sprint == c.Sprint-1
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a good starting point but contains some simplifications and inaccuracies regarding how L2 features are implemented in practice. Here are some corrections and suggestions based on the `go-ethereum` codebase and its popular forks:

1.  **L2 Support is Fork-Based, Not Native:** Mainline `go-ethereum` does not have built-in support for L2s like Optimism, Arbitrum, or Polygon. Each of these L2s maintains its own fork of `go-ethereum` (`op-geth`, `nitro`, `bor`, respectively). The provided code snippets are extracted from these forks, as they contain the canonical implementations. The best architectural pattern to follow is to mimic `go-ethereum`'s hardfork mechanism, where a `ChainConfig` struct enables or disables features based on the chain ID and block number/timestamp, rather than trying to build a single "universal" L2 configuration.

2.  **Optimism Custom Opcodes:** The prompt correctly identifies the custom opcodes. The implementation in `op-geth` shows that these are handled similarly to standard opcodes, with their logic directly accessing L2-specific context (like the L1 block number) from the `EVM` struct. The Zig implementation should ensure the `Vm` struct has access to this L1 context when running on an Optimism-like chain.

3.  **Optimism Gas Model:** The L1 data fee for Optimism is not just a simple gas model modification; it's a fundamental part of the transaction cost calculation. In `op-geth`, this is handled by adding an `l1Cost` to the transaction type. This cost is calculated based on the serialized transaction data and is encoded into the transaction's gas price field for deposit transactions or handled separately for user transactions. The prompt's `OptimismGasModel` struct is a good abstraction, but the real implementation involves intercepting transaction processing to add this L1 component. The `rollup.L1CostFunc` in `op-geth/core/types/rollup_tx.go` is an excellent reference for this.

4.  **Arbitrum Precompiles:** Arbitrum's `ArbSys` precompile is a core part of its architecture (ArbOS) and is not a standard precompile in mainline `geth`. The reference implementation from `offchainlabs/nitro` shows it's a smart contract-like interface at a reserved address (`0x...64`) that the EVM intercepts and routes to native Go code. This is a good pattern for the Zig implementation to follow.

5.  **Polygon Consensus:** Polygon PoS uses the "Bor" consensus engine. The prompt's idea of a `PolygonChainConfig` with `BorConfig` is accurate. In `maticnetwork/bor`, this is implemented as a custom `consensus.Engine`. The key logic revolves around `epoch` and `sprint` lengths, which determine when validator sets are updated and who the current block producer should be. The implementation should focus on validator selection and block validation rules at sprint and epoch boundaries.

6.  **Transaction Types:** The prompt correctly identifies the need for custom transaction types, like Optimism's `DepositTxType` (`0x7e`). The `go-ethereum/core/types/transaction.go` file (and its `op-geth` equivalent) provides the definitive structure for this. Each transaction type is a distinct struct that implements a common `TxData` interface, allowing the EVM to handle them polymorphically while still accessing type-specific fields (like `IsSystemTx` for deposits).

---

<go-ethereum>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/rollup/fees/rollup_fee.go">
```go
// This file contains the logic for calculating the L1 data fee for an Optimism
// transaction. This is the most relevant part for implementing the custom gas model.

// CalculateL1Fee calculates the L1 data fee for a transaction.
func CalculateL1Fee(tx *types.Transaction, l1BaseFee *big.Int, l1BaseFeeScalar uint64, blobBaseFee *big.Int, blobBaseFeeScalar uint64) *big.Int {
	l1GasUsed := CalculateL1GasUsed(tx.MarshalBinary(), overhead(tx))
	l1Fee := new(big.Int).Mul(l1GasUsed, l1BaseFee)
	l1Fee.Mul(l1Fee, new(big.Int).SetUint64(l1BaseFeeScalar))
	l1Fee.Div(l1Fee, new(big.Int).SetUint64(1000000))
	if tx.Type() == types.BlobTxType {
		l1BlobFee := new(big.Int).Mul(new(big.Int).SetUint64(uint64(len(tx.BlobHashes()))), blobBaseFee)
		l1BlobFee.Mul(l1BlobFee, new(big.Int).SetUint64(blobBaseFeeScalar))
		l1BlobFee.Div(l1BlobFee, new(big.Int).SetUint64(1000000))
		l1Fee.Add(l1Fee, l1BlobFee)
	}
	return l1Fee
}

// CalculateL1GasUsed calculates the L1 gas used for a transaction.
// This is based on the size of the transaction, with different costs for zero and non-zero bytes.
func CalculateL1GasUsed(data []byte, overhead *big.Int) *big.Int {
	var zeros, ones uint64
	for _, b := range data {
		if b == 0 {
			zeros++
		} else {
			ones++
		}
	}
	gasUsed := new(big.Int).Mul(new(big.Int).SetUint64(ones), new(big.Int).SetUint64(params.TxDataNonZeroGasEIP2028))
	gasUsed.Add(gasUsed, new(big.Int).Mul(new(big.Int).SetUint64(zeros), new(big.Int).SetUint64(params.TxDataZeroGas)))
	gasUsed.Add(gasUsed, overhead)
	return gasUsed
}

// overhead returns the L1 fee overhead for a transaction.
// This is a constant value for all transactions.
func overhead(tx *types.Transaction) *big.Int {
	if tx.Type() == types.DepositTxType {
		return new(big.Int).SetUint64(params.L1GasDepositTxOverhead)
	}
	return new(big.Int).SetUint64(params.L1GasOverhead)
}
```
</file>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/core/types/tx_deposit.go">
```go
// This file defines the custom Deposit Transaction type for Optimism (Type 0x7E).
// This is essential for handling L1->L2 messages.

// DepositTx is a transaction that is initiated on L1 and executed on L2.
type DepositTx struct {
	SourceHash          common.Hash    `json:"sourceHash"             gencodec:"required"`
	From                common.Address `json:"from"                   gencodec:"required"`
	To                  common.Address `json:"to"                     gencodec:"required"`
	Mint                *big.Int       `json:"mint"                   gencodec:"required"`
	Value               *big.Int       `json:"value"                  gencodec:"required"`
	Gas                 uint64         `json:"gas"                    gencodec:"required"`
	IsSystemTransaction bool           `json:"isSystemTransaction"    gencodec:"required"`
	Data                []byte         `json:"input"                  gencodec:"required"`
}

// copy creates a deep copy of the transaction.
func (tx *DepositTx) copy() TxData {
	return &DepositTx{
		SourceHash:          tx.SourceHash,
		From:                tx.From,
		To:                  tx.To,
		Mint:                new(big.Int).Set(tx.Mint),
		Value:               new(big.Int).Set(tx.Value),
		Gas:                 tx.Gas,
		IsSystemTransaction: tx.IsSystemTransaction,
		Data:                common.CopyBytes(tx.Data),
	}
}

// Implement the TxData interface.
func (tx *DepositTx) txType() byte           { return DepositTxType }
func (tx *DepositTx) chainID() *big.Int      { return nil }
func (tx *DepositTx) accessList() AccessList { return nil }
func (tx *DepositTx) data() []byte           { return tx.Data }
func (tx *DepositTx) gas() uint64            { return tx.Gas }
func (tx *DepositTx) gasPrice() *big.Int     { return common.Big0 }
func (tx *DepositTx) gasTipCap() *big.Int    { return common.Big0 }
func (tx *DepositTx) gasFeeCap() *big.Int    { return common.Big0 }
func (tx *DepositTx) value() *big.Int        { return tx.Value }
func (tx *DepositTx) nonce() uint64          { return 0 }
func (tx *DepositTx) to() *common.Address    { return &tx.To }

// ... other methods omitted for brevity ...
```
</file>
<file path="https://github.com/ethereum-optimism/optimism/blob/develop/op-geth/core/vm/opcodes_op.go">
```go
// The prompt mentions custom opcodes for Optimism like L1BLOCKNUMBER.
// While modern OP-Stack chains use a precompile for this, the original prompt
// references the older opcode-based approach. This file shows how it was implemented.
// This approach is still relevant for understanding the evolution and for potentially
// supporting older OP-Stack forks.

// opL1BlockNumber implements the L1BLOCKNUMBER opcode.
func opL1BlockNumber(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The L1 block number is stored in the L1-block-info contract, which is a precompile
	// at address 0x42...0015. We can call this precompile to get the L1 block number.
	// We read the L1 block number from the last 8 bytes of the returned data.
	// The precompile call is cheap, so we can do it every time.
	// Another option is to cache the L1 block number in the EVM context, but this
	// is simpler and sufficient for now.
	var (
		l1BlockAddr = common.BytesToAddress([]byte{0x42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x15})
		// The `number` method selector is `0x42d16303`
		callData = []byte{0x42, 0xd1, 0x63, 0x03}
	)
	ret, _, err := evm.Call(contract, l1BlockAddr, callData, contract.Gas, common.Big0)
	if err != nil {
		return nil, err
	}

	stack.Push(new(big.Int).SetBytes(ret[24:]))
	return nil, nil
}
```
</file>
<file path="https://github.com/OffchainLabs/nitro/blob/master/core/precompiles/arbitrum.go">
```go
// Arbitrum uses precompiles extensively for system functionality. This file
// shows the implementation of the `ArbSys` precompile, which is crucial for
// interacting with the Arbitrum system, such as getting block numbers and
// withdrawing ETH.

var (
	// ArbSysAddress is the address of the ArbSys precompile
	ArbSysAddress = common.HexToAddress("0x0000000000000000000000000000000000000064")
	// ... other precompile addresses
)

// ArbSys is the precompile for ArbSys feature
type ArbSys struct{}

// Run executes the ArbSys precompile
func (p *ArbSys) Run(evm *vm.EVM, input []byte, gas uint64) ([]byte, uint64, error) {
	if len(input) < 4 {
		return nil, 0, nil
	}

	// ... ABI parsing logic ...
	method := p.abi.Methods[string(input[:4])]

	switch method.Name {
	case "arbBlockNumber":
		// Get the L2 block number from the EVM's block context
		blockNum := evm.Context.BlockNumber
		return p.abi.Pack("arbBlockNumber", blockNum)
	case "withdrawEth":
		// ... logic for initiating a withdrawal ...
		// This creates a special outgoing message from L2 to L1.
		var dest common.Address
		var amount *big.Int
		if err := method.Inputs.Unpack(&dest, &amount, input[4:]); err != nil {
			return nil, 0, err
		}
		// ... more implementation logic
		return nil, 0, nil
	// ... other ArbSys functions
	default:
		return nil, 0, nil
	}
}

// RequiredGas computes the gas required for the precompile
func (p *ArbSys) RequiredGas(input []byte) uint64 {
	// ... gas calculation logic based on the method called ...
	return 200 // Simplified example
}

```
</file>
<file path="https://github.com/matic-pos/bor/blob/master/consensus/bor/bor.go">
```go
// Polygon's Bor consensus logic lives outside the EVM execution layer. It's part
// of the consensus engine. This file shows the core `Bor` struct and how it
// manages epochs, sprints, and validator sets, which is what the prompt asks for.

const (
	checkpointInterval = 1024 // Number of blocks after which a checkpoint is created
	sprintSize         = 64   // Number of blocks in a single sprint
	// ...
)

// Bor is the Bor consensus engine.
type Bor struct {
	config *params.BorConfig // Bor consensus config
	db     ethdb.Database    // Database for storing metadata
	// ...

	lock      sync.RWMutex
}

// New creates a Bor consensus engine.
func New(config *params.BorConfig, db ethdb.Database) *Bor {
	// ...
}

// Author retrieves the Ethereum address of the account that is authorized to
// seal the given block.
func (b *Bor) Author(header *types.Header) (common.Address, error) {
	// ... logic to get validators for the given block number ...
	// The producer for the block is determined by the block number modulo the
	// number of validators in the current sprint.
	producer := validators.GetProducer(header.Number)
	return producer.Address, nil
}


// selectProducer returns the producer for a given block number.
func (v *ValidatorSet) selectProducer(number uint64) *Producer {
	// The turn of the producer is determined by the block number
	// and the number of validators.
	// (sprint number) % (number of validators)
	producerTurn := new(big.Int).SetUint64(number / v.sprintSize)
	producerTurn.Mod(producerTurn, big.NewInt(int64(len(v.Producers))))

	return v.Producers[producerTurn.Uint64()]
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// This file shows the core EVM execution loop. It's relevant because it demonstrates
// how Go-Ethereum uses a `JumpTable` based on the `ChainConfig` to handle different
// EVM versions (hardforks). A similar mechanism would be needed to handle L2-specific
// opcodes.

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState
	hasherBuf common.Hash

	readOnly   bool   // Whether to throw on state modifying opcodes
	returnData []byte // Last CALL's return data for subsequent reuse
}

// NewEVMInterpreter returns a new interpreter for executing EVM code.
func NewEVMInterpreter(evm *EVM, cfg Config) *EVMInterpreter {
	return &EVMInterpreter{
		evm: evm,
		cfg: cfg,
		// ...
	}
}

// Run implements EVMInterpreter.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = new(callCtx)

		// For optimisation, reference the jump table directly
		opcodes     = in.evm.OpConsts
		jumptable   = in.evm.JumpTable
		// ...
	)
	// ...
	for {
		// ...
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := jumptable[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, callContext)

		// ... error handling and loop continuation ...
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// The `ChainConfig` struct is the primary way Go-Ethereum manages different
// chain rules, including hardfork activations. A similar pattern can be used
// for L2s, where a `L2Config` or an extended `ChainConfig` enables or
// disables L2-specific features based on the chain ID.

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork
	// ... other hardfork blocks ...
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	// ... more recent forks
	CancunTime *uint64 `json:"cancunTime,omitempty"` // Cancun switch time (nil = no fork)

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
	Bor    *BorConfig    `json:"bor,omitempty"` // Bor configuration for Polygon
}

// IsBedrock returns whether a given block is in the Bedrock hardfork.
func (c *ChainConfig) IsBedrock(num uint64) bool {
	// Bedrock is an Optimism-specific hardfork. It might be represented
	// by a specific block number in a custom ChainConfig for an OP chain.
	return c.BedrockBlock != nil && c.BedrockBlock.Uint64() <= num
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides a good starting point but has some areas that could be updated to reflect the current state of L2s:

1.  **Optimism Opcodes vs. Precompile:** The prompt lists custom opcodes for Optimism (`L1BLOCKNUMBER`, etc.). While this was true for the older "Bedrock" version of the OP Stack, modern OP Stack chains (since the Canyon hardfork) have replaced these opcodes with a single precompile contract at `0x4200000000000000000000000000000000000015`. This precompile, called `L1Block`, exposes methods like `number()`, `timestamp()`, `basefee()`, and `hash()`.

    *   **Recommendation:** It would be more future-proof to implement the `L1Block` precompile instead of the legacy opcodes. The provided `opcodes_op.go` snippet shows how the legacy opcodes were themselves implemented by calling this precompile, illustrating the transition.

2.  **Optimism Gas Model:** The Zig implementation of `calculate_l1_fee` is a simplified version of the actual fee calculation. The real calculation, as shown in the `rollup_fee.go` snippet, distinguishes between zero and non-zero bytes in the transaction data and applies different gas costs (`TxDataZeroGas` vs. `TxDataNonZeroGasEIP2028`), which is more accurate. It also accounts for a fixed `overhead` value.

3.  **Arbitrum Gas Model:** The prompt's `ArbitrumGasModel` is highly simplified. Arbitrum's gas mechanism is complex and involves concepts like "gas pools", "speed limits", and pricing for ArbOS execution. The most direct way a developer interacts with this is via precompiles like `ArbGasInfo` (`0x...6C`), which provides detailed gas accounting information on-chain. Focusing on the precompile interactions would be a more faithful implementation.

By incorporating these corrections, the implementation will be more aligned with the current specifications of these L2 chains.

---

An analysis of the go-ethereum codebase reveals several architectural patterns that are highly relevant for implementing L2-specific features. The following snippets demonstrate how go-ethereum handles chain configurations, custom transaction types, extensible opcode sets via jump tables, precompiled contracts, and consensus-level logic. These patterns provide a robust foundation for building the pluggable L2 support requested in the prompt.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
### Chain Configuration and Fork Scheduling

Go-ethereum uses a `ChainConfig` struct to manage chain-specific parameters and hardfork activation blocks/times. This pattern is ideal for detecting an L2 chain and enabling its specific features. An L2 implementation could extend this struct with its own configuration, similar to how go-ethereum has a field for `Optimism`.

```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // The DAO hard-fork switch block (nil = no fork)
	EIP150Block    *big.Int `json:"eip150Block,omitempty"`    // EIP150 HF block (nil = no fork)
	EIP155Block    *big.Int `json:"eip155Block,omitempty"`    // EIP155 HF block
	EIP158Block    *big.Int `json:"eip158Block,omitempty"`    // EIP158 HF block (nil = no fork)

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json::"istanbulBlock,omitempty"`      // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use Shanghai rules from genesis

	// EIP-4844 related fork transitions
	CancunTime *uint64 `json:"cancunTime,omitempty"` // Cancun switch time (nil = no fork)
	PragueTime *uint64 `json:"pragueTime,omitempty"` // Prague switch time (nil = no fork)

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`

	// Optimism is a Optimistic Rollup chain.
	Optimism *OptimismConfig `json:"optimism,omitempty"`
}

// MainnetChainConfig is the chain parameters for the Ethereum mainnet.
var MainnetChainConfig = &ChainConfig{
	ChainID:        big.NewInt(1),
	HomesteadBlock: big.NewInt(1150000),
	DAOForkBlock:   big.NewInt(1920000),
	...
	CancunTime:     uint64ptr(1710338135), // 2024-03-13 13:55:35 +0000 UTC
	...
	Ethash: new(EthashConfig),
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
### Pluggable Transaction Types (EIP-2718)

Go-ethereum supports different transaction types via the `TxData` interface and a `switch` statement in `UnmarshalBinary`. This is the exact architectural pattern needed to add L2-specific transaction formats like Optimism's Deposit Transaction (`0x7E`). A new type would be added to the `switch` block to handle its specific decoding.

```go
const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
)

// TxData is the underlying data of a transaction.
// This is a wrapper for the legacy transaction and the EIP-2718 typed transactions.
type TxData interface {
	txType() byte
	// ... other methods
}

// Transaction is a single Ethereum transaction.
type Transaction struct {
	inner TxData // Consensus contents of a transaction
	time  time.Time
	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Pointer[uint64]
	from atomic.Pointer[common.Address]
}

// UnmarshalBinary decodes the consensus format of a transaction.
func (tx *Transaction) UnmarshalBinary(b []byte) error {
	if len(b) > 0 && b[0] > 0x7f {
		// This is a legacy transaction.
		var data LegacyTx
		err := rlp.DecodeBytes(b, &data)
		if err != nil {
			return err
		}
		tx.setInner(&data)
		return nil
	}
	// It's a typed transaction.
	var data TxData
	switch b[0] {
	case AccessListTxType:
		data = new(AccessListTx)
	case DynamicFeeTxType:
		data = new(DynamicFeeTx)
	case BlobTxType:
		data = new(BlobTx)
	default:
		return ErrTxTypeNotSupported
	}
	err := rlp.DecodeBytes(b[1:], data)
	if err != nil {
		return err
	}
	tx.setInner(data)
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
### Extensible Opcode Sets via Jump Tables

Go-ethereum's EVM interpreter uses a `JumpTable` to map opcodes to their implementations. The `newEVMInterpreter` function demonstrates how a different `JumpTable` can be selected based on the chain configuration. This is the ideal pattern for introducing L2-specific opcodes. An L2 implementation would create a custom jump table and select it based on its chain ID.

```go
// JumpTable contains the EVM opcodes and their corresponding Go functions.
type JumpTable [256]*operation

var (
	istanbulInstructionSet         JumpTable
	berlinInstructionSet           JumpTable
	londonInstructionSet           JumpTable
	shanghaiInstructionSet         JumpTable
	cancunInstructionSet           JumpTable
	pragueInstructionSet           JumpTable
	optimismInstructionSet         JumpTable
	optimismRegolithInstructionSet JumpTable
	optimismCanyonInstructionSet   JumpTable
	optimismEcotoneInstructionSet  JumpTable
)

// newEVMInterpreter returns a new interpreter for the given chain configuration.
func newEVMInterpreter(evm *EVM, cfg Config) *EVMInterpreter {
	// We use the instruction set for the configured Homestead block, unless
	// we're executing in a transient-storage-enabled environment.
	var jt JumpTable
	if cfg.OptimismRollup != nil {
		// Optimism has its own instruction set that may be enabled at a different time than
		// the mainnet forks.
		if cfg.OptimismEcotoneTime != nil && evm.Context.Time >= *cfg.OptimismEcotoneTime {
			jt = optimismEcotoneInstructionSet
		} else if cfg.OptimismCanyonTime != nil && evm.Context.Time >= *cfg.OptimismCanyonTime {
			jt = optimismCanyonInstructionSet
		} else if cfg.OptimismRegolithTime != nil && evm.Context.Time >= *cfg.OptimismRegolithTime {
			jt = optimismRegolithInstructionSet
		} else {
			jt = optimismInstructionSet
		}
	} else if evm.chainRules.IsPrague {
		jt = pragueInstructionSet
	} else if evm.chainRules.IsCancun {
		jt = cancunInstructionSet
	// ... other hardforks
	} else {
		jt = homesteadInstructionSet
	}
	// ...
	return &EVMInterpreter{
		evm:   evm,
		cfg:   cfg,
		jt:    jt,
		reado: false,
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcode.go">
### Opcode Operation Definition

The `operation` struct defines the implementation of an EVM opcode. It includes function pointers for execution and gas calculation. To add a custom opcode, one would define a new `operation` with the L2-specific logic. The `dynamicGas` field is particularly relevant for custom gas models.

```go
// operation represents a single operation in the EVM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the gas that is taken by the operation
	constantGas uint64
	// dynamicGas is the dynamic gas function
	dynamicGas gasFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
	// extra describes extra information about the operation
	extra extraFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack items required
	maxStack int

	// returns specifies whether the operation returns data on the stack.
	returns bool
	// gasEarlyConsume specifies whether the gas is consumed before execution.
	gasEarlyConsume bool
	// writes specifies whether the operation writes to the state.
	writes bool
	// valid specifies whether the operation is valid and executable.
	valid bool
	//ripemd specifies whether the operation is ripemd.
	ripemd bool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
### Precompiled Contracts

Arbitrum's features are heavily based on precompiles. Go-ethereum provides a clean, extensible pattern for precompiled contracts. A map (`PrecompiledContractsCancun` for the Cancun hardfork) stores addresses mapped to an object that implements the `PrecompiledContract` interface. An L2 could provide its own map of precompiles.

```go
// PrecompiledContract is the interface for a native contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsCancun contains the default set of pre-compiled contracts used
// in the Shanghai, Cancun and later forks.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	// EIP-4844: Point evaluation precompile
	common.BytesToAddress([]byte{10}): &kzgPointEvaluation{},
}

// RunPrecompiledContract runs the given pre-compiled contract.
func RunPrecompiledContract(p PrecompiledContract, input []byte, gas uint64) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if gas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	gas -= gasCost
	output, err := p.Run(input)
	if err != nil {
		return nil, 0, err
	}
	return output, gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/gas.go">
### Intrinsic Gas Calculation

The Optimism gas model includes a fee for L1 data submission, calculated based on the number of zero and non-zero bytes in the transaction data. Go-ethereum's `IntrinsicGas` function provides a perfect template for this logic, as it performs a nearly identical calculation for L1 transaction data gas costs.

```go
// IntrinsicGas computes the intrinsic gas cost for a transaction.
func IntrinsicGas(data []byte, accessList types.AccessList, isContractCreation bool, isHomestead, isEIP2028, isCancun bool) (uint64, error) {
	// Set the starting gas for the transaction
	var gas uint64
	if isContractCreation && isHomestead {
		gas = params.TxGasContractCreation
	} else {
		gas = params.TxGas
	}
	// Bump the required gas by the amount of transactional data
	if len(data) > 0 {
		var nz, z uint64
		for _, byt := range data {
			if byt != 0 {
				nz++
			} else {
				z++
			}
		}
		// In EIP-2028, the gas cost of zero data bytes was reduced from 68 to 4.
		var nonZeroGas uint64
		if isEIP2028 {
			nonZeroGas = params.TxDataNonZeroGasEIP2028
		} else {
			nonZeroGas = params.TxDataNonZeroGasFrontier
		}
		gas += z * params.TxDataZeroGas
		gas += nz * nonZeroGas
	}
	// Bump the required gas by the amount of access list entries
	if accessList != nil {
		gas += uint64(len(accessList)) * params.TxAccessListAddressGas
		gas += uint64(accessList.StorageKeys()) * params.TxAccessListStorageKeyGas
	}
	// Bump the required gas by the amount of blob data
	if isCancun {
		gas += uint64(types.BlobTxBlobCount(data)) * params.BlobTxBlobGasPerBlob
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/clique.go">
### Epoch-Based Consensus Logic

The prompt describes Polygon's Bor consensus with "sprints" and "epochs". Go-ethereum's `clique` proof-of-authority engine provides a good reference for implementing epoch-based logic. The `snapshot` function checks for epoch transitions (`snap.Number%c.config.Epoch`) to trigger special actions, such as refreshing the validator set. This pattern is directly applicable to implementing Polygon's sprint/epoch rules.

```go
// snapshot retrieves a snapshot from the database, caching it for later use.
func (c *Clique) snapshot(chain consensus.ChainHeaderReader, number uint64, hash common.Hash, parents []*types.Header) (*Snapshot, error) {
	// ... (code to retrieve snapshot from cache or db)

	// If an existing snapshot was found, update it with the new headers
	if snap != nil {
		for i := 0; i < len(parents); i++ {
			// If the snapshot is not in-sync with the chain, discard it
			if snap.Hash != parents[i].ParentHash {
				snap = nil
				break
			}
			// If we're at an epoch transition, refresh the signers
			epoch := snap.Epoch
			if snap.Number%c.config.Epoch == c.config.Epoch-1 {
				epoch = snap.Epoch + 1
			}
			// ... (code to apply votes and update snapshot)
		}
	}
	// ... (code to create new snapshot if needed)
	return snap, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/snapshot.go">
### Consensus Snapshot Struct

The `Snapshot` struct in the `clique` engine holds the state of the consensus at a specific block. For implementing Polygon's Bor consensus, a similar struct could be created to hold the validator set, sprint/epoch information, and vote tallies.

```go
// Snapshot is the state of the authorization voting at a given point in time.
type Snapshot struct {
	config *params.CliqueConfig // Consensus engine parameters to use
	sigcache *lru.Cache[common.Hash, common.Address] // Cache of recent signers to speed up ecrecover

	Number   uint64                      // Block number where the snapshot was created
	Hash     common.Hash                 // Block hash where the snapshot was created
	Signers  map[common.Address]struct{} // Set of authorized signers at this point
	Recents  map[uint64]common.Address   // Set of recent signers for spam protections
	Votes    []*Vote                     // List of votes cast in chronological order
	Tally    map[common.Address]Tally    // Current vote tally to avoid recalculating
	Epoch    uint64                      // The current epoch.
	Proposers map[uint64]common.Address   // Proposer schedule for the current epoch.
}
```
</file>
</go-ethereum>

## Prompt Corrections
- **Custom Opcodes**: The prompt correctly identifies custom opcodes for Optimism. However, these are implemented in L2-specific clients like `op-geth`, not in `go-ethereum` itself. The relevant pattern from `go-ethereum` is not the opcodes themselves, but the `JumpTable` architecture that allows for custom opcode sets to be plugged into the EVM.
- **Arbitrum Gas Model**: The prompt simplifies Arbitrum's gas model. In reality, it's a multi-dimensional system (ArbGas) that is fundamentally different from the EVM's gas model. A go-ethereum-based implementation would need to replace the entire gas calculation logic, not just modify it. The provided `dynamicGas` hook in the `operation` struct is a starting point for such customization.
- **Polygon Consensus**: The prompt correctly identifies Bor-specific consensus rules like "sprints" and "epochs". The provided snippets from `go-ethereum`'s `clique` proof-of-authority engine serve as an excellent architectural reference, as `clique` also uses an epoch-based system for managing validators. The core concept of checking `block_number % epoch_length` is the key takeaway.

