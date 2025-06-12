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

#### 1. **Unit Tests** (`/test/evm/l2/l2_chain_support_test.zig`)
```zig
// Test basic L2 chain support functionality
test "l2_chain_support basic functionality works correctly"
test "l2_chain_support handles edge cases properly"
test "l2_chain_support validates inputs appropriately"
test "l2_chain_support produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "l2_chain_support integrates with EVM properly"
test "l2_chain_support maintains system compatibility"
test "l2_chain_support works with existing components"
test "l2_chain_support handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "l2_chain_support meets performance requirements"
test "l2_chain_support optimizes resource usage"
test "l2_chain_support scales appropriately with load"
test "l2_chain_support benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "l2_chain_support meets specification requirements"
test "l2_chain_support maintains EVM compatibility"
test "l2_chain_support handles hardfork transitions"
test "l2_chain_support cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "l2_chain_support handles errors gracefully"
test "l2_chain_support proper error propagation"
test "l2_chain_support recovery from failure states"
test "l2_chain_support validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "l2_chain_support prevents security vulnerabilities"
test "l2_chain_support handles malicious inputs safely"
test "l2_chain_support maintains isolation boundaries"
test "l2_chain_support validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "l2_chain_support basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = l2_chain_support.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const l2_chain_support = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
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
```cpp
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
```
</file>
</evmone>

## Implementation Insights from EVMONE

### Key EVMONE L2 Adaptation Patterns

1. **Revision-Based Configuration**: EVMONE uses EVM revisions to handle different rule sets. This can be extended to support L2-specific configurations by adding custom revision enums.

2. **Gas Cost Table Architecture**: The multi-dimensional gas cost table `gas_costs[revision][opcode]` provides a perfect foundation for L2-specific gas models.

3. **Pluggable Precompile System**: The trait-based precompile dispatch system allows easy addition of L2-specific precompiles without modifying core execution logic.

4. **Transaction Type Support**: EVMONE's transaction type system can be extended to support L2-specific transaction types like Optimism deposits.

5. **Conditional Feature Activation**: The revision-based feature enabling pattern can gate L2-specific opcodes and behavior.

### Recommended Adaptations for L2 Support

```zig
// Extend EVMONE's revision concept for L2s
pub const ChainType = enum {
    ethereum_mainnet,
    optimism,
    arbitrum,
    polygon,
    base,
    
    pub fn get_gas_table(self: ChainType, hardfork: HardFork) *const [256]u64 {
        return switch (self) {
            .ethereum_mainnet => &ethereum_gas_costs[hardfork],
            .optimism => &optimism_gas_costs[hardfork],
            .arbitrum => &arbitrum_gas_costs[hardfork],
            .polygon => &polygon_gas_costs[hardfork],
            .base => &base_gas_costs[hardfork],
        };
    }
};

// L2-aware precompile dispatch
pub fn call_precompile(chain: ChainType, address: Address, input: []const u8) !PrecompileResult {
    const precompile_id = address.bytes[19];
    
    return switch (chain) {
        .optimism => if (is_optimism_precompile(precompile_id)) 
            optimism_precompiles[precompile_id].execute(input)
        else 
            standard_precompiles[precompile_id].execute(input),
            
        .ethereum_mainnet => standard_precompiles[precompile_id].execute(input),
        // ... other chains
    };
}
```

## References

- [Optimism Specs](https://github.com/ethereum-optimism/optimism/tree/develop/specs) - OP Stack specification
- [Arbitrum Documentation](https://docs.arbitrum.io/) - Arbitrum technical details
- [Polygon PoS Documentation](https://docs.polygon.technology/) - Polygon architecture
- [Base Documentation](https://docs.base.org/) - Base (OP Stack) specifics
- [L2Beat](https://l2beat.com/) - L2 ecosystem overview