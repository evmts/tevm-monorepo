# Implement Modular Context System

You are implementing Modular Context System for the Tevm EVM written in Zig. Your goal is to implement modular context system for execution environments following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_modular_context_system` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_modular_context_system feat_implement_modular_context_system`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive modular context system that allows pluggable block contexts, transaction contexts, and configuration contexts. This enables easy customization for different blockchain environments (mainnet, testnets, L2s) while maintaining type safety and performance. The system should support runtime context switching and context inheritance.

## ELI5

Think of a modular context system like having a smart thermostat that can automatically adjust its behavior based on the room it's in. Instead of having one rigid system, you have interchangeable "context modules" that define how the EVM should behave in different situations.

Here's how it works:
- **Block Context**: Like knowing what season it is (defines gas prices, block limits, available opcodes)
- **Transaction Context**: Like knowing who's in the room (sender, recipient, value being sent)
- **Configuration Context**: Like knowing what type of building it is (mainnet vs testnet vs L2 with different rules)

The "modular" part means:
- **Plug-and-Play**: You can easily swap out context modules for different blockchain environments
- **Runtime Switching**: The EVM can change its behavior on-the-fly as contexts change
- **Inheritance**: New contexts can inherit properties from parent contexts and just override what's different

This is incredibly useful for:
- **Multi-Chain Support**: The same EVM code can run on Ethereum mainnet, Polygon, Arbitrum, etc.
- **Testing**: Easy to simulate different network conditions and hardforks
- **Development**: Developers can quickly test against different blockchain environments
- **Optimization**: Each context can be optimized for its specific use case

The enhanced version includes:
- **Smart Caching**: Frequently used contexts are cached for performance
- **Type Safety**: Ensures contexts are compatible and won't cause runtime errors
- **Dynamic Loading**: Contexts can be loaded and configured at runtime
- **Conflict Resolution**: Handles cases where different contexts have conflicting rules

Without this system, supporting multiple blockchains would require separate codebases for each one!

## Modular Context System Specifications

### Core Context Framework

#### 1. Context Manager
```zig
pub const ContextManager = struct {
    allocator: std.mem.Allocator,
    config: ContextConfig,
    context_factory: ContextFactory,
    context_cache: ContextCache,
    inheritance_manager: InheritanceManager,
    
    pub const ContextConfig = struct {
        enable_context_caching: bool,
        enable_context_inheritance: bool,
        enable_runtime_switching: bool,
        max_cached_contexts: u32,
        context_validation: ContextValidation,
        inheritance_depth: u32,
        
        pub const ContextValidation = enum {
            None,       // No validation
            Basic,      // Basic type checking
            Strict,     // Full validation
            Custom,     // Custom validation hooks
        };
        
        pub fn mainnet() ContextConfig {
            return ContextConfig{
                .enable_context_caching = true,
                .enable_context_inheritance = true,
                .enable_runtime_switching = false,
                .max_cached_contexts = 100,
                .context_validation = .Strict,
                .inheritance_depth = 5,
            };
        }
        
        pub fn testnet() ContextConfig {
            return ContextConfig{
                .enable_context_caching = true,
                .enable_context_inheritance = true,
                .enable_runtime_switching = true,
                .max_cached_contexts = 50,
                .context_validation = .Basic,
                .inheritance_depth = 3,
            };
        }
        
        pub fn l2_optimized() ContextConfig {
            return ContextConfig{
                .enable_context_caching = false,
                .enable_context_inheritance = false,
                .enable_runtime_switching = true,
                .max_cached_contexts = 10,
                .context_validation = .None,
                .inheritance_depth = 1,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ContextConfig) !ContextManager {
        return ContextManager{
            .allocator = allocator,
            .config = config,
            .context_factory = try ContextFactory.init(allocator, config),
            .context_cache = try ContextCache.init(allocator, config.max_cached_contexts),
            .inheritance_manager = InheritanceManager.init(config.inheritance_depth),
        };
    }
    
    pub fn deinit(self: *ContextManager) void {
        self.context_factory.deinit();
        self.context_cache.deinit();
    }
    
    pub fn create_execution_context(self: *ContextManager, context_spec: ContextSpec) !ExecutionContext {
        // Check cache first
        if (self.config.enable_context_caching) {
            if (self.context_cache.get(context_spec)) |cached_context| {
                return cached_context.clone();
            }
        }
        
        // Create new context
        var context = try self.context_factory.create_context(context_spec);
        
        // Apply inheritance if enabled
        if (self.config.enable_context_inheritance and context_spec.parent_context != null) {
            try self.inheritance_manager.apply_inheritance(&context, context_spec.parent_context.?);
        }
        
        // Validate context
        try self.validate_context(&context);
        
        // Cache if enabled
        if (self.config.enable_context_caching) {
            try self.context_cache.put(context_spec, context.clone());
        }
        
        return context;
    }
    
    pub fn switch_context(self: *ContextManager, current: *ExecutionContext, new_spec: ContextSpec) !void {
        if (!self.config.enable_runtime_switching) {
            return error.RuntimeSwitchingDisabled;
        }
        
        const new_context = try self.create_execution_context(new_spec);
        
        // Preserve essential state during switch
        try self.preserve_context_state(current, &new_context);
        
        // Replace current context
        current.deinit();
        current.* = new_context;
    }
    
    fn validate_context(self: *ContextManager, context: *const ExecutionContext) !void {
        switch (self.config.context_validation) {
            .None => {},
            .Basic => try self.basic_validation(context),
            .Strict => try self.strict_validation(context),
            .Custom => try self.custom_validation(context),
        }
    }
    
    fn basic_validation(self: *ContextManager, context: *const ExecutionContext) !void {
        _ = self;
        
        // Basic type and null checks
        if (context.block_context == null) {
            return error.MissingBlockContext;
        }
        if (context.transaction_context == null) {
            return error.MissingTransactionContext;
        }
    }
    
    fn strict_validation(self: *ContextManager, context: *const ExecutionContext) !void {
        try self.basic_validation(context);
        
        // Validate block context consistency
        if (context.block_context.?.number < 0) {
            return error.InvalidBlockNumber;
        }
        
        // Validate transaction context consistency
        if (context.transaction_context.?.gas_limit == 0) {
            return error.InvalidGasLimit;
        }
        
        // Validate hardfork compatibility
        try self.validate_hardfork_compatibility(context);
    }
    
    fn custom_validation(self: *ContextManager, context: *const ExecutionContext) !void {
        _ = self;
        _ = context;
        
        // Placeholder for custom validation hooks
        // Would call user-defined validation functions
    }
    
    fn validate_hardfork_compatibility(self: *ContextManager, context: *const ExecutionContext) !void {
        _ = self;
        
        const block_number = context.block_context.?.number;
        const hardfork = context.configuration_context.hardfork;
        
        // Validate that hardfork is appropriate for block number
        switch (hardfork) {
            .Frontier => if (block_number < 0) return error.InvalidHardfork,
            .Homestead => if (block_number < 1150000) return error.InvalidHardfork,
            .Byzantium => if (block_number < 4370000) return error.InvalidHardfork,
            .London => if (block_number < 12965000) return error.InvalidHardfork,
            .Cancun => if (block_number < 19426587) return error.InvalidHardfork,
            else => {},
        }
    }
    
    fn preserve_context_state(self: *ContextManager, old: *const ExecutionContext, new: *ExecutionContext) !void {
        _ = self;
        
        // Preserve gas usage
        new.transaction_context.?.gas_used = old.transaction_context.?.gas_used;
        
        // Preserve call depth
        new.call_depth = old.call_depth;
        
        // Preserve access lists if compatible
        if (new.supports_access_lists() and old.supports_access_lists()) {
            new.access_list = try old.access_list.clone();
        }
    }
    
    pub const ContextSpec = struct {
        block_context_type: BlockContextType,
        transaction_context_type: TransactionContextType,
        configuration_context_type: ConfigurationContextType,
        parent_context: ?*const ExecutionContext,
        custom_parameters: ?CustomParameters,
        
        pub const BlockContextType = enum {
            Mainnet,
            Testnet,
            L2Optimism,
            L2Arbitrum,
            L2Polygon,
            Custom,
        };
        
        pub const TransactionContextType = enum {
            Legacy,
            AccessList,
            EIP1559,
            Blob,
            Custom,
        };
        
        pub const ConfigurationContextType = enum {
            Standard,
            Debug,
            Tracing,
            Fuzzing,
            Custom,
        };
        
        pub const CustomParameters = struct {
            block_params: ?BlockParameters,
            transaction_params: ?TransactionParameters,
            config_params: ?ConfigurationParameters,
        };
    };
};
```

#### 2. Execution Context
```zig
pub const ExecutionContext = struct {
    allocator: std.mem.Allocator,
    block_context: ?*BlockContext,
    transaction_context: ?*TransactionContext,
    configuration_context: ConfigurationContext,
    call_depth: u32,
    access_list: AccessList,
    context_id: u64,
    parent_id: ?u64,
    
    pub fn init(allocator: std.mem.Allocator) ExecutionContext {
        return ExecutionContext{
            .allocator = allocator,
            .block_context = null,
            .transaction_context = null,
            .configuration_context = ConfigurationContext.default(),
            .call_depth = 0,
            .access_list = AccessList.init(allocator),
            .context_id = generate_context_id(),
            .parent_id = null,
        };
    }
    
    pub fn deinit(self: *ExecutionContext) void {
        if (self.block_context) |context| {
            context.deinit();
            self.allocator.destroy(context);
        }
        if (self.transaction_context) |context| {
            context.deinit();
            self.allocator.destroy(context);
        }
        self.access_list.deinit();
    }
    
    pub fn clone(self: *const ExecutionContext) !ExecutionContext {
        var cloned = ExecutionContext.init(self.allocator);
        
        // Clone block context
        if (self.block_context) |block_ctx| {
            cloned.block_context = try self.allocator.create(BlockContext);
            cloned.block_context.?.* = try block_ctx.clone();
        }
        
        // Clone transaction context
        if (self.transaction_context) |tx_ctx| {
            cloned.transaction_context = try self.allocator.create(TransactionContext);
            cloned.transaction_context.?.* = try tx_ctx.clone();
        }
        
        // Clone configuration context
        cloned.configuration_context = self.configuration_context;
        
        // Clone access list
        cloned.access_list = try self.access_list.clone();
        
        cloned.call_depth = self.call_depth;
        cloned.context_id = generate_context_id();
        cloned.parent_id = self.context_id;
        
        return cloned;
    }
    
    pub fn create_child_context(self: *const ExecutionContext, context_type: ChildContextType) !ExecutionContext {
        var child = try self.clone();
        child.call_depth += 1;
        child.parent_id = self.context_id;
        
        // Modify child context based on type
        switch (context_type) {
            .Call => {
                // Preserve most context for calls
            },
            .Create => {
                // Reset some context for contract creation
                if (child.transaction_context) |tx_ctx| {
                    tx_ctx.to = null; // No recipient for CREATE
                }
            },
            .DelegateCall => {
                // Preserve caller context
                if (child.transaction_context) |tx_ctx| {
                    tx_ctx.caller = self.transaction_context.?.caller;
                    tx_ctx.value = self.transaction_context.?.value;
                }
            },
            .StaticCall => {
                // Read-only context
                child.configuration_context.is_static = true;
            },
        }
        
        return child;
    }
    
    pub fn supports_access_lists(self: *const ExecutionContext) bool {
        return self.configuration_context.hardfork.supports_access_lists();
    }
    
    pub fn supports_eip1559(self: *const ExecutionContext) bool {
        return self.configuration_context.hardfork.supports_eip1559();
    }
    
    pub fn supports_blob_transactions(self: *const ExecutionContext) bool {
        return self.configuration_context.hardfork.supports_blob_transactions();
    }
    
    pub fn get_gas_price(self: *const ExecutionContext) u256 {
        if (self.transaction_context) |tx_ctx| {
            return switch (tx_ctx.transaction_type) {
                .Legacy => tx_ctx.gas_price,
                .AccessList => tx_ctx.gas_price,
                .EIP1559 => {
                    const base_fee = self.block_context.?.base_fee_per_gas;
                    const priority_fee = tx_ctx.max_priority_fee_per_gas;
                    const max_fee = tx_ctx.max_fee_per_gas;
                    return @min(base_fee + priority_fee, max_fee);
                },
                .Blob => {
                    // Similar to EIP1559 but with blob fee considerations
                    const base_fee = self.block_context.?.base_fee_per_gas;
                    const priority_fee = tx_ctx.max_priority_fee_per_gas;
                    const max_fee = tx_ctx.max_fee_per_gas;
                    return @min(base_fee + priority_fee, max_fee);
                },
            };
        }
        return 0;
    }
    
    pub const ChildContextType = enum {
        Call,
        Create,
        DelegateCall,
        StaticCall,
    };
    
    fn generate_context_id() u64 {
        // Simple counter-based ID generation
        // In practice, would use atomic counter or UUID
        const static = struct {
            var counter: u64 = 0;
        };
        static.counter += 1;
        return static.counter;
    }
};
```

#### 3. Block Context
```zig
pub const BlockContext = union(enum) {
    Mainnet: MainnetBlockContext,
    Testnet: TestnetBlockContext,
    L2Optimism: OptimismBlockContext,
    L2Arbitrum: ArbitrumBlockContext,
    L2Polygon: PolygonBlockContext,
    Custom: CustomBlockContext,
    
    pub fn deinit(self: *BlockContext) void {
        switch (self.*) {
            inline else => |*context| context.deinit(),
        }
    }
    
    pub fn clone(self: *const BlockContext) !BlockContext {
        return switch (self.*) {
            inline else => |*context| @unionInit(BlockContext, @tagName(self.*), try context.clone()),
        };
    }
    
    pub fn get_number(self: *const BlockContext) u64 {
        return switch (self.*) {
            inline else => |*context| context.number,
        };
    }
    
    pub fn get_timestamp(self: *const BlockContext) u64 {
        return switch (self.*) {
            inline else => |*context| context.timestamp,
        };
    }
    
    pub fn get_difficulty(self: *const BlockContext) u256 {
        return switch (self.*) {
            inline else => |*context| context.difficulty,
        };
    }
    
    pub fn get_gas_limit(self: *const BlockContext) u64 {
        return switch (self.*) {
            inline else => |*context| context.gas_limit,
        };
    }
    
    pub fn get_base_fee_per_gas(self: *const BlockContext) u256 {
        return switch (self.*) {
            inline else => |*context| context.base_fee_per_gas,
        };
    }
    
    pub fn get_coinbase(self: *const BlockContext) Address {
        return switch (self.*) {
            inline else => |*context| context.coinbase,
        };
    }
};

pub const MainnetBlockContext = struct {
    number: u64,
    timestamp: u64,
    difficulty: u256,
    gas_limit: u64,
    base_fee_per_gas: u256,
    coinbase: Address,
    chain_id: u64,
    block_hash: Hash,
    parent_hash: Hash,
    
    pub fn init(block_number: u64) MainnetBlockContext {
        return MainnetBlockContext{
            .number = block_number,
            .timestamp = std.time.timestamp(),
            .difficulty = 0, // PoS era
            .gas_limit = 30_000_000,
            .base_fee_per_gas = 20_000_000_000, // 20 gwei
            .coinbase = Address.zero(),
            .chain_id = 1, // Mainnet
            .block_hash = Hash.zero(),
            .parent_hash = Hash.zero(),
        };
    }
    
    pub fn deinit(self: *MainnetBlockContext) void {
        _ = self;
        // No cleanup needed for basic fields
    }
    
    pub fn clone(self: *const MainnetBlockContext) !MainnetBlockContext {
        return self.*; // Simple copy for basic fields
    }
};

pub const OptimismBlockContext = struct {
    number: u64,
    timestamp: u64,
    difficulty: u256,
    gas_limit: u64,
    base_fee_per_gas: u256,
    coinbase: Address,
    chain_id: u64,
    block_hash: Hash,
    parent_hash: Hash,
    // Optimism-specific fields
    l1_block_number: u64,
    l1_block_hash: Hash,
    l1_timestamp: u64,
    sequence_number: u64,
    
    pub fn init(block_number: u64, l1_block_number: u64) OptimismBlockContext {
        return OptimismBlockContext{
            .number = block_number,
            .timestamp = std.time.timestamp(),
            .difficulty = 0,
            .gas_limit = 30_000_000,
            .base_fee_per_gas = 1_000_000, // 0.001 gwei (much lower on L2)
            .coinbase = Address.zero(),
            .chain_id = 10, // Optimism
            .block_hash = Hash.zero(),
            .parent_hash = Hash.zero(),
            .l1_block_number = l1_block_number,
            .l1_block_hash = Hash.zero(),
            .l1_timestamp = std.time.timestamp(),
            .sequence_number = block_number,
        };
    }
    
    pub fn deinit(self: *OptimismBlockContext) void {
        _ = self;
    }
    
    pub fn clone(self: *const OptimismBlockContext) !OptimismBlockContext {
        return self.*;
    }
};

// Similar implementations for ArbitrumBlockContext, PolygonBlockContext, etc.
```

#### 4. Transaction Context
```zig
pub const TransactionContext = struct {
    transaction_type: TransactionType,
    caller: Address,
    to: ?Address,
    value: u256,
    data: []const u8,
    gas_limit: u64,
    gas_used: u64,
    gas_price: u256,
    max_fee_per_gas: ?u256,
    max_priority_fee_per_gas: ?u256,
    max_fee_per_blob_gas: ?u256,
    blob_versioned_hashes: ?[]Hash,
    access_list: ?[]AccessListEntry,
    nonce: u64,
    
    pub const TransactionType = enum(u8) {
        Legacy = 0,
        AccessList = 1,
        EIP1559 = 2,
        Blob = 3,
    };
    
    pub const AccessListEntry = struct {
        address: Address,
        storage_keys: []Hash,
    };
    
    pub fn init(allocator: std.mem.Allocator, tx_type: TransactionType) TransactionContext {
        return TransactionContext{
            .transaction_type = tx_type,
            .caller = Address.zero(),
            .to = null,
            .value = 0,
            .data = &[_]u8{},
            .gas_limit = 21000,
            .gas_used = 0,
            .gas_price = 0,
            .max_fee_per_gas = null,
            .max_priority_fee_per_gas = null,
            .max_fee_per_blob_gas = null,
            .blob_versioned_hashes = null,
            .access_list = null,
            .nonce = 0,
        };
    }
    
    pub fn deinit(self: *TransactionContext) void {
        // Cleanup dynamically allocated fields if any
        _ = self;
    }
    
    pub fn clone(self: *const TransactionContext) !TransactionContext {
        // Deep clone with proper memory management
        var cloned = self.*;
        
        // Clone data if present
        if (self.data.len > 0) {
            const allocator = std.heap.page_allocator; // Would use proper allocator
            cloned.data = try allocator.dupe(u8, self.data);
        }
        
        // Clone access list if present
        if (self.access_list) |access_list| {
            const allocator = std.heap.page_allocator;
            cloned.access_list = try allocator.dupe(AccessListEntry, access_list);
        }
        
        // Clone blob hashes if present
        if (self.blob_versioned_hashes) |hashes| {
            const allocator = std.heap.page_allocator;
            cloned.blob_versioned_hashes = try allocator.dupe(Hash, hashes);
        }
        
        return cloned;
    }
    
    pub fn is_contract_creation(self: *const TransactionContext) bool {
        return self.to == null;
    }
    
    pub fn supports_access_lists(self: *const TransactionContext) bool {
        return self.transaction_type == .AccessList or 
               self.transaction_type == .EIP1559 or 
               self.transaction_type == .Blob;
    }
    
    pub fn get_effective_gas_price(self: *const TransactionContext, base_fee: u256) u256 {
        return switch (self.transaction_type) {
            .Legacy, .AccessList => self.gas_price,
            .EIP1559, .Blob => {
                const priority_fee = self.max_priority_fee_per_gas.?;
                const max_fee = self.max_fee_per_gas.?;
                return @min(base_fee + priority_fee, max_fee);
            },
        };
    }
};
```

#### 5. Configuration Context
```zig
pub const ConfigurationContext = struct {
    hardfork: Hardfork,
    chain_id: u64,
    is_static: bool,
    debug_mode: bool,
    tracing_enabled: bool,
    gas_tracking: GasTracking,
    validation_level: ValidationLevel,
    optimization_level: OptimizationLevel,
    
    pub const GasTracking = enum {
        None,
        Basic,
        Detailed,
        Profiling,
    };
    
    pub const ValidationLevel = enum {
        None,
        Basic,
        Strict,
        Paranoid,
    };
    
    pub const OptimizationLevel = enum {
        Debug,
        Balanced,
        Performance,
        Size,
    };
    
    pub fn default() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 1,
            .is_static = false,
            .debug_mode = false,
            .tracing_enabled = false,
            .gas_tracking = .Basic,
            .validation_level = .Basic,
            .optimization_level = .Balanced,
        };
    }
    
    pub fn mainnet() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 1,
            .is_static = false,
            .debug_mode = false,
            .tracing_enabled = false,
            .gas_tracking = .Basic,
            .validation_level = .Strict,
            .optimization_level = .Performance,
        };
    }
    
    pub fn testnet() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 11155111, // Sepolia
            .is_static = false,
            .debug_mode = true,
            .tracing_enabled = true,
            .gas_tracking = .Detailed,
            .validation_level = .Strict,
            .optimization_level = .Debug,
        };
    }
    
    pub fn l2_optimism() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 10,
            .is_static = false,
            .debug_mode = false,
            .tracing_enabled = false,
            .gas_tracking = .Basic,
            .validation_level = .Basic,
            .optimization_level = .Performance,
        };
    }
    
    pub fn allows_state_modification(self: *const ConfigurationContext) bool {
        return !self.is_static;
    }
    
    pub fn requires_strict_validation(self: *const ConfigurationContext) bool {
        return self.validation_level == .Strict or self.validation_level == .Paranoid;
    }
    
    pub fn should_optimize_for_performance(self: *const ConfigurationContext) bool {
        return self.optimization_level == .Performance;
    }
};
```

#### 6. Context Factory
```zig
pub const ContextFactory = struct {
    allocator: std.mem.Allocator,
    config: ContextManager.ContextConfig,
    block_factories: BlockFactoryRegistry,
    transaction_factories: TransactionFactoryRegistry,
    
    pub fn init(allocator: std.mem.Allocator, config: ContextManager.ContextConfig) !ContextFactory {
        return ContextFactory{
            .allocator = allocator,
            .config = config,
            .block_factories = try BlockFactoryRegistry.init(allocator),
            .transaction_factories = try TransactionFactoryRegistry.init(allocator),
        };
    }
    
    pub fn deinit(self: *ContextFactory) void {
        self.block_factories.deinit();
        self.transaction_factories.deinit();
    }
    
    pub fn create_context(self: *ContextFactory, spec: ContextManager.ContextSpec) !ExecutionContext {
        var context = ExecutionContext.init(self.allocator);
        
        // Create block context
        context.block_context = try self.create_block_context(spec.block_context_type);
        
        // Create transaction context
        context.transaction_context = try self.create_transaction_context(spec.transaction_context_type);
        
        // Set configuration context
        context.configuration_context = self.create_configuration_context(spec.configuration_context_type);
        
        // Apply custom parameters if provided
        if (spec.custom_parameters) |params| {
            try self.apply_custom_parameters(&context, params);
        }
        
        return context;
    }
    
    fn create_block_context(self: *ContextFactory, context_type: ContextManager.ContextSpec.BlockContextType) !*BlockContext {
        const block_context = try self.allocator.create(BlockContext);
        
        block_context.* = switch (context_type) {
            .Mainnet => BlockContext{ .Mainnet = MainnetBlockContext.init(0) },
            .Testnet => BlockContext{ .Testnet = TestnetBlockContext.init(0) },
            .L2Optimism => BlockContext{ .L2Optimism = OptimismBlockContext.init(0, 0) },
            .L2Arbitrum => BlockContext{ .L2Arbitrum = ArbitrumBlockContext.init(0, 0) },
            .L2Polygon => BlockContext{ .L2Polygon = PolygonBlockContext.init(0) },
            .Custom => BlockContext{ .Custom = CustomBlockContext.init() },
        };
        
        return block_context;
    }
    
    fn create_transaction_context(self: *ContextFactory, context_type: ContextManager.ContextSpec.TransactionContextType) !*TransactionContext {
        const tx_context = try self.allocator.create(TransactionContext);
        
        const tx_type = switch (context_type) {
            .Legacy => TransactionContext.TransactionType.Legacy,
            .AccessList => TransactionContext.TransactionType.AccessList,
            .EIP1559 => TransactionContext.TransactionType.EIP1559,
            .Blob => TransactionContext.TransactionType.Blob,
            .Custom => TransactionContext.TransactionType.Legacy, // Default for custom
        };
        
        tx_context.* = TransactionContext.init(self.allocator, tx_type);
        return tx_context;
    }
    
    fn create_configuration_context(self: *ContextFactory, context_type: ContextManager.ContextSpec.ConfigurationContextType) ConfigurationContext {
        _ = self;
        
        return switch (context_type) {
            .Standard => ConfigurationContext.default(),
            .Debug => blk: {
                var config = ConfigurationContext.default();
                config.debug_mode = true;
                config.tracing_enabled = true;
                config.gas_tracking = .Detailed;
                config.validation_level = .Strict;
                config.optimization_level = .Debug;
                break :blk config;
            },
            .Tracing => blk: {
                var config = ConfigurationContext.default();
                config.tracing_enabled = true;
                config.gas_tracking = .Profiling;
                config.validation_level = .Strict;
                break :blk config;
            },
            .Fuzzing => blk: {
                var config = ConfigurationContext.default();
                config.debug_mode = true;
                config.validation_level = .Paranoid;
                config.optimization_level = .Debug;
                break :blk config;
            },
            .Custom => ConfigurationContext.default(),
        };
    }
    
    fn apply_custom_parameters(self: *ContextFactory, context: *ExecutionContext, params: ContextManager.ContextSpec.CustomParameters) !void {
        _ = self;
        
        if (params.block_params) |block_params| {
            // Apply custom block parameters
            switch (context.block_context.?.*) {
                .Mainnet => |*mainnet| {
                    if (block_params.number) |number| mainnet.number = number;
                    if (block_params.timestamp) |timestamp| mainnet.timestamp = timestamp;
                    if (block_params.gas_limit) |gas_limit| mainnet.gas_limit = gas_limit;
                },
                // Similar for other block context types
                else => {},
            }
        }
        
        if (params.transaction_params) |tx_params| {
            // Apply custom transaction parameters
            if (tx_params.gas_limit) |gas_limit| {
                context.transaction_context.?.gas_limit = gas_limit;
            }
            if (tx_params.gas_price) |gas_price| {
                context.transaction_context.?.gas_price = gas_price;
            }
        }
        
        if (params.config_params) |config_params| {
            // Apply custom configuration parameters
            if (config_params.hardfork) |hardfork| {
                context.configuration_context.hardfork = hardfork;
            }
            if (config_params.chain_id) |chain_id| {
                context.configuration_context.chain_id = chain_id;
            }
        }
    }
};

// Factory registries for extensibility
pub const BlockFactoryRegistry = struct {
    allocator: std.mem.Allocator,
    factories: std.HashMap([]const u8, BlockContextFactory, StringContext, std.hash_map.default_max_load_percentage),
    
    pub const BlockContextFactory = struct {
        create_fn: *const fn(std.mem.Allocator, []const u8) anyerror!*BlockContext,
        name: []const u8,
        version: []const u8,
    };
    
    pub fn init(allocator: std.mem.Allocator) !BlockFactoryRegistry {
        return BlockFactoryRegistry{
            .allocator = allocator,
            .factories = std.HashMap([]const u8, BlockContextFactory, StringContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *BlockFactoryRegistry) void {
        self.factories.deinit();
    }
    
    pub fn register_factory(self: *BlockFactoryRegistry, name: []const u8, factory: BlockContextFactory) !void {
        try self.factories.put(name, factory);
    }
    
    pub fn create_block_context(self: *BlockFactoryRegistry, name: []const u8, params: []const u8) !*BlockContext {
        if (self.factories.get(name)) |factory| {
            return try factory.create_fn(self.allocator, params);
        }
        return error.UnknownBlockContextType;
    }
    
    pub const StringContext = struct {
        pub fn hash(self: @This(), key: []const u8) u64 {
            _ = self;
            return std.hash_map.hashString(key);
        }
        
        pub fn eql(self: @This(), a: []const u8, b: []const u8) bool {
            _ = self;
            return std.mem.eql(u8, a, b);
        }
    };
};

pub const TransactionFactoryRegistry = struct {
    allocator: std.mem.Allocator,
    factories: std.HashMap([]const u8, TransactionContextFactory, BlockFactoryRegistry.StringContext, std.hash_map.default_max_load_percentage),
    
    pub const TransactionContextFactory = struct {
        create_fn: *const fn(std.mem.Allocator, []const u8) anyerror!*TransactionContext,
        name: []const u8,
        version: []const u8,
    };
    
    pub fn init(allocator: std.mem.Allocator) !TransactionFactoryRegistry {
        return TransactionFactoryRegistry{
            .allocator = allocator,
            .factories = std.HashMap([]const u8, TransactionContextFactory, BlockFactoryRegistry.StringContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *TransactionFactoryRegistry) void {
        self.factories.deinit();
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Pluggable Context Components**: Mix and match block, transaction, and configuration contexts
2. **Runtime Context Switching**: Change contexts during execution based on conditions
3. **Context Inheritance**: Derive new contexts from existing ones with modifications
4. **Type Safety**: Ensure all context combinations are valid and type-safe
5. **Performance Optimization**: Minimize overhead through caching and efficient creation
6. **Extensibility**: Support custom context types through factory registration

## Implementation Tasks

### Task 1: Implement Context Cache
File: `/src/evm/modular_context/context_cache.zig`
```zig
const std = @import("std");
const ContextManager = @import("context_manager.zig").ContextManager;
const ExecutionContext = @import("execution_context.zig").ExecutionContext;

pub const ContextCache = struct {
    allocator: std.mem.Allocator,
    cache: std.HashMap(u64, CacheEntry, HashContext, std.hash_map.default_max_load_percentage),
    max_entries: u32,
    hit_count: u64,
    miss_count: u64,
    
    pub const CacheEntry = struct {
        context: ExecutionContext,
        access_count: u64,
        last_access: i64,
        creation_time: i64,
    };
    
    pub fn init(allocator: std.mem.Allocator, max_entries: u32) !ContextCache {
        return ContextCache{
            .allocator = allocator,
            .cache = std.HashMap(u64, CacheEntry, HashContext, std.hash_map.default_max_load_percentage).init(allocator),
            .max_entries = max_entries,
            .hit_count = 0,
            .miss_count = 0,
        };
    }
    
    pub fn deinit(self: *ContextCache) void {
        // Clean up all cached contexts
        var iterator = self.cache.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.context.deinit();
        }
        self.cache.deinit();
    }
    
    pub fn get(self: *ContextCache, spec: ContextManager.ContextSpec) ?ExecutionContext {
        const key = self.hash_spec(spec);
        
        if (self.cache.getPtr(key)) |entry| {
            entry.access_count += 1;
            entry.last_access = std.time.milliTimestamp();
            self.hit_count += 1;
            
            return entry.context.clone() catch {
                self.miss_count += 1;
                return null;
            };
        }
        
        self.miss_count += 1;
        return null;
    }
    
    pub fn put(self: *ContextCache, spec: ContextManager.ContextSpec, context: ExecutionContext) !void {
        const key = self.hash_spec(spec);
        
        // Check if cache is full
        if (self.cache.count() >= self.max_entries) {
            try self.evict_lru();
        }
        
        const entry = CacheEntry{
            .context = try context.clone(),
            .access_count = 1,
            .last_access = std.time.milliTimestamp(),
            .creation_time = std.time.milliTimestamp(),
        };
        
        try self.cache.put(key, entry);
    }
    
    fn hash_spec(self: *ContextCache, spec: ContextManager.ContextSpec) u64 {
        _ = self;
        
        var hasher = std.hash_map.DefaultHasher.init();
        hasher.update(std.mem.asBytes(&spec.block_context_type));
        hasher.update(std.mem.asBytes(&spec.transaction_context_type));
        hasher.update(std.mem.asBytes(&spec.configuration_context_type));
        
        if (spec.parent_context) |parent| {
            hasher.update(std.mem.asBytes(&parent.context_id));
        }
        
        return hasher.final();
    }
    
    fn evict_lru(self: *ContextCache) !void {
        var oldest_key: ?u64 = null;
        var oldest_time: i64 = std.math.maxInt(i64);
        
        var iterator = self.cache.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.last_access < oldest_time) {
                oldest_time = entry.value_ptr.last_access;
                oldest_key = entry.key_ptr.*;
            }
        }
        
        if (oldest_key) |key| {
            if (self.cache.fetchRemove(key)) |removed| {
                removed.value.context.deinit();
            }
        }
    }
    
    pub fn get_hit_rate(self: *const ContextCache) f64 {
        const total = self.hit_count + self.miss_count;
        if (total == 0) return 0.0;
        return @as(f64, @floatFromInt(self.hit_count)) / @as(f64, @floatFromInt(total));
    }
    
    pub const HashContext = struct {
        pub fn hash(self: @This(), key: u64) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u64, b: u64) bool {
            _ = self;
            return a == b;
        }
    };
};
```

### Task 2: Implement Inheritance Manager
File: `/src/evm/modular_context/inheritance_manager.zig`
```zig
const std = @import("std");
const ExecutionContext = @import("execution_context.zig").ExecutionContext;

pub const InheritanceManager = struct {
    max_depth: u32,
    inheritance_rules: InheritanceRules,
    
    pub const InheritanceRules = struct {
        inherit_block_context: bool,
        inherit_transaction_context: bool,
        inherit_configuration_context: bool,
        inherit_access_list: bool,
        override_on_conflict: bool,
        
        pub fn default() InheritanceRules {
            return InheritanceRules{
                .inherit_block_context = true,
                .inherit_transaction_context = true,
                .inherit_configuration_context = true,
                .inherit_access_list = true,
                .override_on_conflict = false,
            };
        }
    };
    
    pub fn init(max_depth: u32) InheritanceManager {
        return InheritanceManager{
            .max_depth = max_depth,
            .inheritance_rules = InheritanceRules.default(),
        };
    }
    
    pub fn apply_inheritance(
        self: *InheritanceManager, 
        child: *ExecutionContext, 
        parent: *const ExecutionContext
    ) !void {
        // Check inheritance depth
        var current_depth: u32 = 0;
        var current_parent = parent;
        
        while (current_parent.parent_id != null and current_depth < self.max_depth) {
            current_depth += 1;
            // Would traverse to actual parent context in real implementation
            break;
        }
        
        if (current_depth >= self.max_depth) {
            return error.InheritanceDepthExceeded;
        }
        
        // Apply inheritance rules
        if (self.inheritance_rules.inherit_block_context and child.block_context == null) {
            if (parent.block_context) |parent_block| {
                child.block_context = try child.allocator.create(@TypeOf(parent_block.*));
                child.block_context.?.* = try parent_block.clone();
            }
        }
        
        if (self.inheritance_rules.inherit_transaction_context and child.transaction_context == null) {
            if (parent.transaction_context) |parent_tx| {
                child.transaction_context = try child.allocator.create(@TypeOf(parent_tx.*));
                child.transaction_context.?.* = try parent_tx.clone();
            }
        }
        
        if (self.inheritance_rules.inherit_configuration_context) {
            // Merge configuration contexts
            try self.merge_configuration_context(&child.configuration_context, &parent.configuration_context);
        }
        
        if (self.inheritance_rules.inherit_access_list) {
            child.access_list = try parent.access_list.clone();
        }
        
        // Set parent relationship
        child.parent_id = parent.context_id;
    }
    
    fn merge_configuration_context(
        self: *InheritanceManager,
        child: *ConfigurationContext,
        parent: *const ConfigurationContext
    ) !void {
        // Merge configuration contexts based on override rules
        if (!self.inheritance_rules.override_on_conflict) {
            // Parent values take precedence when child doesn't have a value set
            if (child.hardfork == .Frontier) { // Assuming Frontier is default
                child.hardfork = parent.hardfork;
            }
            if (child.chain_id == 0) {
                child.chain_id = parent.chain_id;
            }
            // Inherit boolean flags if not explicitly set
            child.is_static = child.is_static or parent.is_static;
        } else {
            // Child values override parent values
            // No action needed as child already has its values
        }
    }
};
```

### Task 3: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const ContextManager = @import("modular_context/context_manager.zig").ContextManager;
const ExecutionContext = @import("modular_context/execution_context.zig").ExecutionContext;

pub const Vm = struct {
    // Existing fields...
    context_manager: ?ContextManager,
    current_context: ?ExecutionContext,
    context_enabled: bool,
    
    pub fn enable_modular_contexts(self: *Vm, config: ContextManager.ContextConfig) !void {
        self.context_manager = try ContextManager.init(self.allocator, config);
        self.context_enabled = true;
    }
    
    pub fn disable_modular_contexts(self: *Vm) void {
        if (self.context_manager) |*manager| {
            manager.deinit();
            self.context_manager = null;
        }
        if (self.current_context) |*context| {
            context.deinit();
            self.current_context = null;
        }
        self.context_enabled = false;
    }
    
    pub fn set_execution_context(self: *Vm, context_spec: ContextManager.ContextSpec) !void {
        if (!self.context_enabled or self.context_manager == null) return;
        
        // Clean up previous context
        if (self.current_context) |*context| {
            context.deinit();
        }
        
        // Create new context
        self.current_context = try self.context_manager.?.create_execution_context(context_spec);
    }
    
    pub fn switch_context_for_call(self: *Vm, call_type: ExecutionContext.ChildContextType) !void {
        if (!self.context_enabled or self.current_context == null) return;
        
        const child_context = try self.current_context.?.create_child_context(call_type);
        
        // Replace current context with child
        self.current_context.?.deinit();
        self.current_context = child_context;
    }
    
    pub fn get_block_number(self: *Vm) u64 {
        if (self.current_context) |*context| {
            if (context.block_context) |block_ctx| {
                return block_ctx.get_number();
            }
        }
        return 0; // Default fallback
    }
    
    pub fn get_gas_price(self: *Vm) u256 {
        if (self.current_context) |*context| {
            return context.get_gas_price();
        }
        return 0;
    }
    
    pub fn is_static_context(self: *Vm) bool {
        if (self.current_context) |*context| {
            return !context.configuration_context.allows_state_modification();
        }
        return false;
    }
    
    pub fn get_chain_id(self: *Vm) u64 {
        if (self.current_context) |*context| {
            return context.configuration_context.chain_id;
        }
        return 1; // Default to mainnet
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/modular_context/modular_context_test.zig`

### Test Cases
```zig
test "context manager initialization and configuration" {
    // Test manager creation with different configs
    // Test context factory setup
    // Test cache initialization
}

test "execution context creation and cloning" {
    // Test context creation with different specifications
    // Test context cloning and deep copying
    // Test context inheritance
}

test "block context variants" {
    // Test mainnet block context
    // Test L2 block contexts (Optimism, Arbitrum, Polygon)
    // Test custom block contexts
}

test "transaction context types" {
    // Test legacy transaction contexts
    // Test EIP-1559 transaction contexts
    // Test blob transaction contexts
}

test "context inheritance system" {
    // Test parent-child context relationships
    // Test inheritance rules application
    // Test inheritance depth limits
}

test "context caching mechanism" {
    // Test cache hit/miss scenarios
    // Test LRU eviction
    // Test cache performance impact
}

test "runtime context switching" {
    // Test context switching during execution
    // Test call context creation
    // Test static call restrictions
}

test "integration with VM execution" {
    // Test VM integration
    // Test context-aware opcode execution
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/modular_context/context_manager.zig` - Main context management framework
- `/src/evm/modular_context/execution_context.zig` - Unified execution context
- `/src/evm/modular_context/block_context.zig` - Block context variants
- `/src/evm/modular_context/transaction_context.zig` - Transaction context types
- `/src/evm/modular_context/configuration_context.zig` - Configuration contexts
- `/src/evm/modular_context/context_factory.zig` - Context creation and management
- `/src/evm/modular_context/context_cache.zig` - Context caching system
- `/src/evm/modular_context/inheritance_manager.zig` - Context inheritance logic
- `/src/evm/vm.zig` - VM integration with modular contexts
- `/test/evm/modular_context/modular_context_test.zig` - Comprehensive tests

## Success Criteria

1. **Flexible Configuration**: Support multiple blockchain environments through pluggable contexts
2. **Type Safety**: All context combinations are validated and type-safe at compile time
3. **Performance Efficiency**: Minimal overhead through intelligent caching and efficient creation
4. **Easy Extensibility**: Simple addition of new context types through factory registration
5. **Runtime Adaptability**: Dynamic context switching based on execution requirements
6. **Clean Integration**: Seamless integration with existing VM execution flow

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

#### 1. **Unit Tests** (`/test/evm/modular_context/modular_context_system_test.zig`)
```zig
// Test basic modular context system functionality
test "modular_context_system basic functionality with known scenarios"
test "modular_context_system handles edge cases correctly"
test "modular_context_system validates state changes"
test "modular_context_system correct behavior under load"
```

#### 2. **Integration Tests**
```zig
test "modular_context_system integrates with EVM context correctly"
test "modular_context_system works with existing systems"
test "modular_context_system maintains backward compatibility"
test "modular_context_system handles system interactions"
```

#### 3. **State Management Tests**
```zig
test "modular_context_system state transitions work correctly"
test "modular_context_system handles concurrent state access"
test "modular_context_system maintains state consistency"
test "modular_context_system reverts state on failure"
```

#### 4. **Performance Tests**
```zig
test "modular_context_system performance with realistic workloads"
test "modular_context_system memory efficiency and allocation patterns"
test "modular_context_system scalability under high load"
test "modular_context_system benchmark against baseline implementation"
```

#### 5. **Error Handling Tests**
```zig
test "modular_context_system error propagation works correctly"
test "modular_context_system proper error types returned"
test "modular_context_system handles resource exhaustion gracefully"
test "modular_context_system recovery from failure states"
```

#### 6. **Context Switching Tests**
```zig
test "modular_context_system runtime context switching correctness"
test "modular_context_system context inheritance behavior"
test "modular_context_system configuration validation"
test "modular_context_system conflict resolution"
```

#### 7. **Multi-Chain Support Tests**
```zig
test "modular_context_system maintains EVM specification compliance"
test "modular_context_system blockchain environment compatibility"
test "modular_context_system hardfork rule management"
test "modular_context_system type safety validation"
```

### Test Development Priority
1. **Start with core context management tests** - Ensures basic context switching works
2. **Add configuration validation tests** - Verifies context compatibility and safety
3. **Implement inheritance tests** - Critical for context hierarchy functionality
4. **Add performance benchmarks** - Ensures production readiness
5. **Test multi-chain compatibility** - Robust cross-blockchain operation
6. **Add integration tests** - System-level correctness verification

### Test Data Sources
- **EVM specification requirements**: Context parameter compliance
- **Reference implementation behavior**: Multi-chain configuration patterns
- **Performance benchmarks**: Context switching overhead and memory usage
- **Real-world scenarios**: Blockchain environment configurations and transitions
- **Edge case generation**: Boundary testing for context limits and conflicts

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify memory safety and leak detection

### Test-First Examples

**Before writing any implementation:**
```zig
test "modular_context_system basic functionality" {
    // This test MUST fail initially
    const context = test_utils.createTestContext();
    var context_manager = ContextManager.init(context.allocator);
    
    const block_context = try context_manager.create_block_context(.Mainnet);
    try testing.expect(block_context.chain_id == 1);
}
```

**Only then implement:**
```zig
pub const ContextManager = struct {
    pub fn create_block_context(self: *ContextManager, network: NetworkType) !BlockContext {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test context switching thoroughly** - Architecture changes affect whole EVM execution
- **Verify type safety** - Especially important for configuration validation
- **Test performance implications** - Ensure context management doesn't impact EVM execution
- **Validate multi-chain support** - Critical for cross-blockchain compatibility

## References

- [Strategy Pattern](https://en.wikipedia.org/wiki/Strategy_pattern) - Design pattern for pluggable algorithms
- [Context Object Pattern](https://martinfowler.com/eaaCatalog/contextObject.html) - Pattern for passing context information
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) - Pattern for configurable components
- [Factory Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) - Pattern for object creation
- [Chain of Responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) - Pattern for inheritance hierarchies

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.hpp>
#include <intx/intx.hpp>
#include <exception>
#include <memory>
#include <string>
#include <vector>

namespace evmone
{
namespace advanced
{
struct AdvancedCodeAnalysis;
}
namespace baseline
{
class CodeAnalysis;
}

using evmc::bytes;
using evmc::bytes_view;
using intx::uint256;


/// Provides memory for EVM stack.
class StackSpace
{
    static uint256* allocate() noexcept;

    struct Deleter
    {
        void operator()(void* p) noexcept;
    };

    /// The storage allocated for maximum possible number of items.
    /// Items are aligned to 256 bits for better packing in cache lines.
    std::unique_ptr<uint256, Deleter> m_stack_space;

public:
    /// The maximum number of EVM stack items.
    static constexpr auto limit = 1024;

    StackSpace() noexcept : m_stack_space{allocate()} {}

    /// Returns the pointer to the "bottom", i.e. below the stack space.
    [[nodiscard]] uint256* bottom() noexcept { return m_stack_space.get(); }
};


/// The EVM memory.
class Memory
{
    // ... implementation details ...
public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept;

    uint8_t& operator[](size_t index) noexcept;
    [[nodiscard]] const uint8_t* data() const noexcept;
    [[nodiscard]] size_t size() const noexcept;
    void grow(size_t new_size) noexcept;
    void clear() noexcept;
};

/// Initcode read from Initcode Transaction (EIP-7873).
struct TransactionInitcode
{
    bytes_view code;
    std::optional<bool> is_valid;
};

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;
    std::optional<bytes> deploy_container;

private:
    evmc_tx_context m_tx = {};
    std::optional<std::unordered_map<evmc::bytes32, TransactionInitcode>> m_initcodes;

public:
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;
    StackSpace stack_space;

    ExecutionState() noexcept = default;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

    void reset(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept;

    [[nodiscard]] bool in_static_mode() const { return (msg->flags & EVMC_STATIC) != 0; }

    const evmc_tx_context& get_tx_context() noexcept;

    [[nodiscard]] TransactionInitcode* get_tx_initcode_by_hash(const evmc_bytes32& hash);
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include "state.hpp"
#include "state_view.hpp"
#include <optional>

namespace evmone::state
{
using evmc::uint256be;

/// Computes the address of to-be-created contract with the CREATE scheme.
[[nodiscard]] address compute_create_address(const address& sender, uint64_t sender_nonce) noexcept;
/// Computes the address of to-be-created contract with the CREATE2 scheme.
[[nodiscard]] address compute_create2_address(
    const address& sender, const bytes32& salt, bytes_view init_code) noexcept;
/// Computes the address of to-be-created contract with the EOFCREATE scheme.
[[nodiscard]] address compute_eofcreate_address(
    const address& sender, const bytes32& salt) noexcept;

class Host : public evmc::Host
{
    evmc_revision m_rev;
    evmc::VM& m_vm;
    State& m_state;
    const BlockInfo& m_block;
    const BlockHashes& m_block_hashes;
    const Transaction& m_tx;
    std::vector<Log> m_logs;
    std::vector<evmc_tx_initcode> m_tx_initcodes;

public:
    Host(evmc_revision rev, evmc::VM& vm, State& state, const BlockInfo& block,
        const BlockHashes& block_hashes, const Transaction& tx) noexcept;

    [[nodiscard]] std::vector<Log>&& take_logs() noexcept { return std::move(m_logs); }

    evmc::Result call(const evmc_message& msg) noexcept override;

private:
    [[nodiscard]] bool account_exists(const address& addr) const noexcept override;
    [[nodiscard]] bytes32 get_storage(
        const address& addr, const bytes32& key) const noexcept override;
    evmc_storage_status set_storage(
        const address& addr, const bytes32& key, const bytes32& value) noexcept override;
    [[nodiscard]] evmc::bytes32 get_transient_storage(
        const address& addr, const bytes32& key) const noexcept override;
    void set_transient_storage(
        const address& addr, const bytes32& key, const bytes32& value) noexcept override;
    [[nodiscard]] uint256be get_balance(const address& addr) const noexcept override;
    [[nodiscard]] size_t get_code_size(const address& addr) const noexcept override;
    [[nodiscard]] bytes32 get_code_hash(const address& addr) const noexcept override;
    size_t copy_code(const address& addr, size_t code_offset, uint8_t* buffer_data,
        size_t buffer_size) const noexcept override;
    bool selfdestruct(const address& addr, const address& beneficiary) noexcept override;
    evmc::Result create(const evmc_message& msg) noexcept;
    [[nodiscard]] evmc_tx_context get_tx_context() const noexcept override;
    [[nodiscard]] bytes32 get_block_hash(int64_t block_number) const noexcept override;
    void emit_log(const address& addr, const uint8_t* data, size_t data_size,
        const bytes32 topics[], size_t topics_count) noexcept override;
    evmc_access_status access_account(const address& addr) noexcept override;
    evmc_access_status access_storage(const address& addr, const bytes32& key) noexcept override;
    std::optional<evmc_message> prepare_message(evmc_message msg) noexcept;
    evmc::Result execute_message(const evmc_message& msg) noexcept;
};
}  // namespace evmone::state
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/transaction.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include "bloom_filter.hpp"
#include "state_diff.hpp"
#include <intx/intx.hpp>
#include <optional>
#include <vector>

namespace evmone::state
{
using AccessList = std::vector<std::pair<address, std::vector<bytes32>>>;

struct Transaction
{
    /// The type of the transaction.
    enum class Type : uint8_t
    {
        legacy = 0,
        access_list = 1,
        eip1559 = 2,
        blob = 3,
        set_code = 4,
        initcodes = 6,
    };

    /// Returns amount of blob gas used by this transaction
    [[nodiscard]] uint64_t blob_gas_used() const;

    Type type = Type::legacy;
    bytes data;
    int64_t gas_limit;
    intx::uint256 max_gas_price;
    intx::uint256 max_priority_gas_price;
    intx::uint256 max_blob_gas_price;
    address sender;
    std::optional<address> to;
    intx::uint256 value;
    AccessList access_list;
    std::vector<bytes32> blob_hashes;
    uint64_t chain_id = 0;
    uint64_t nonce = 0;
    intx::uint256 r;
    intx::uint256 s;
    uint8_t v = 0;
    AuthorizationList authorization_list;
    std::vector<bytes> initcodes;
};

struct Log
{
    address addr;
    bytes data;
    std::vector<bytes32> topics;
};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/block.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include "hash_utils.hpp"
#include <intx/intx.hpp>
#include <vector>

namespace evmone::state
{
struct Ommer
{
    address beneficiary;
    uint32_t delta = 0;
};

struct Withdrawal
{
    uint64_t index = 0;
    uint64_t validator_index = 0;
    address recipient;
    uint64_t amount_in_gwei = 0;

    [[nodiscard]] intx::uint256 get_amount() const noexcept;
};

struct BlockInfo
{
    int64_t number = 0;
    int64_t timestamp = 0;
    hash256 hash;
    hash256 parent_hash;
    int64_t parent_timestamp = 0;
    int64_t gas_limit = 0;
    int64_t gas_used = 0;
    address coinbase;
    int64_t difficulty = 0;
    int64_t parent_difficulty = 0;
    hash256 parent_ommers_hash;
    bytes32 prev_randao;
    hash256 parent_beacon_block_root;
    uint64_t base_fee = 0;
    std::optional<uint64_t> blob_gas_used;
    std::optional<uint64_t> excess_blob_gas;
    std::optional<intx::uint256> blob_base_fee;
    std::vector<Ommer> ommers;
    std::vector<Withdrawal> withdrawals;
};
}  // namespace evmone::state
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "instructions_opcodes.hpp"
#include <array>
#include <optional>

namespace evmone::instr
{
/// The special gas cost value marking an EVM instruction as "undefined".
constexpr int16_t undefined = -1;

/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs. For instructions undefined
/// in given EVM revision, the value is instr::undefined.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};

    for (auto& t : table[EVMC_FRONTIER])
        t = undefined;
    table[EVMC_FRONTIER][OP_STOP] = 0;
    table[EVMC_FRONTIER][OP_ADD] = 3;
    // ...
    table[EVMC_HOMESTEAD] = table[EVMC_FRONTIER];
    table[EVMC_HOMESTEAD][OP_DELEGATECALL] = 40;
    // ...
    table[EVMC_BERLIN] = table[EVMC_ISTANBUL];
    table[EVMC_BERLIN][OP_EXTCODESIZE] = warm_storage_read_cost;
    // ...
    table[EVMC_SHANGHAI] = table[EVMC_PARIS];
    table[EVMC_SHANGHAI][OP_PUSH0] = 2;
    // ...
    table[EVMC_CANCUN] = table[EVMC_SHANGHAI];
    table[EVMC_CANCUN][OP_BLOBHASH] = 3;
    table[EVMC_CANCUN][OP_BLOBBASEFEE] = 2;
    table[EVMC_CANCUN][OP_TLOAD] = warm_storage_read_cost;
    table[EVMC_CANCUN][OP_TSTORE] = warm_storage_read_cost;
    table[EVMC_CANCUN][OP_MCOPY] = 3;

    return table;
}();

}  // namespace evmone::instr
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "delegation.hpp"
#include "eof.hpp"
#include "instructions.hpp"
#include <variant>

// ...

template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(
        Op == OP_CALL || Op == OP_CALLCODE || Op == OP_DELEGATECALL || Op == OP_STATICCALL);

    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();

    if (state.rev >= EVMC_BERLIN && state.host.access_account(dst) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::additional_cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }

    // ... memory checks ...

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.flags = (Op == OP_STATICCALL) ? uint32_t{EVMC_STATIC} : state.msg->flags;
    // ...
    msg.depth = state.msg->depth + 1;
    msg.recipient = (Op == OP_CALL || Op == OP_STATICCALL) ? dst : state.msg->recipient;
    msg.code_address = code_addr;
    msg.sender = (Op == OP_DELEGATECALL) ? state.msg->sender : state.msg->recipient;
    msg.value =
        (Op == OP_DELEGATECALL) ? state.msg->value : intx::be::store<evmc::uint256be>(value);

    // ... gas calculation ...
    if (state.rev >= EVMC_TANGERINE_WHISTLE)
        msg.gas = std::min(msg.gas, gas_left - gas_left / 64);
    else if (msg.gas > gas_left)
        return {EVMC_OUT_OF_GAS, gas_left};

    if (has_value)
    {
        msg.gas += 2300;  // Add stipend.
        gas_left += 2300;
    }

    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.
    
    // ... balance check ...

    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    // ... copy output & update gas ...
    
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/lru_cache.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2024 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cassert>
#include <list>
#include <optional>
#include <unordered_map>

namespace evmone
{
/// Least Recently Used (LRU) cache.
///
/// A map of Key to Value with a fixed capacity. When the cache is full, a newly inserted entry
/// replaces (evicts) the least recently used entry.
/// All operations have O(1) complexity.
template <typename Key, typename Value>
class LRUCache
{
    struct LRUEntry
    {
        const Key& key;
        Value value;
    };

    using LRUList = std::list<LRUEntry>;
    using LRUIterator = typename LRUList::iterator;
    using Map = std::unordered_map<Key, LRUIterator>;

    const size_t capacity_;
    LRUList lru_list_;
    Map map_;

    void move_to_back(LRUIterator it) noexcept;

public:
    explicit LRUCache(size_t capacity);
    void clear() noexcept;
    std::optional<Value> get(const Key& key) noexcept;
    void put(Key key, Value value);
};

}  // namespace evmone
```
</file>
</evmone>
## Prompt Corrections
The provided prompt is an excellent, detailed specification for a complex feature. There are no corrections to be made, as it accurately describes a robust context system. The `evmone` snippets above provide battle-tested C++ implementations of the core concepts requested in the prompt, which should serve as a valuable reference for the Zig implementation. The main takeaway from `evmone` is its clear separation of concerns:
- **`ExecutionState`**: Manages the transient state of a single execution frame (stack, memory, gas, return data).
- **`Host` Interface**: An abstraction layer for querying external state like account balances, code, and block/transaction information (`evmc_tx_context`).
- **`evmc_revision`**: A simple enum used to configure the EVM's behavior (opcodes, gas costs), acting as the `ConfigurationContext`.

This mirrors the modular design requested in the prompt and can serve as a proven architectural pattern.



## REVM Context

An analysis of the `revm` codebase reveals a robust and modular context system that closely aligns with the requested feature. The following code snippets provide a clear blueprint for implementing a similar system.

`revm` separates context into three main parts, all contained within a `Context` struct:
1.  `CfgEnv`: Corresponds to the prompt's `ConfigurationContext`, handling chain ID and hardfork specifications (`SpecId`).
2.  `BlockEnv`: Corresponds to the prompt's `BlockContext`, holding block-specific data like number, timestamp, and fees.
3.  `TxEnv`: Corresponds to the prompt's `TransactionContext`, holding transaction-specific data like caller, value, and input data.

The `op-revm` crate further demonstrates the modularity by extending these contexts for an L2 environment (Optimism), showcasing how to implement pluggable contexts as requested.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/primitives/src/hardfork.rs">
```rust
//! Specification IDs and their activation block

/// Specification IDs and their activation block
///
/// Information was obtained from the [Ethereum Execution Specifications](https://github.com/ethereum/execution-specs).
#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, TryFromPrimitive)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum SpecId {
    /// Frontier hard fork
    FRONTIER = 0,
    // ... other hardforks
    /// Homestead hard fork
    HOMESTEAD,
    /// Tangerine Whistle hard fork
    TANGERINE,
    /// Spurious Dragon hard fork
    SPURIOUS_DRAGON,
    /// Byzantium hard fork
    BYZANTIUM,
    /// Constantinople hard fork
    CONSTANTINOPLE,
    /// Petersburg hard fork
    PETERSBURG,
    /// Istanbul hard fork
    ISTANBUL,
    // ...
    /// London hard fork
    LONDON,
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
    // ...
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
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/cfg.rs">
```rust
//! This module contains [`CfgEnv`] and implements [`Cfg`] trait for it.
pub use context_interface::Cfg;

use primitives::{eip170::MAX_CODE_SIZE, hardfork::SpecId};

/// EVM configuration
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CfgEnv<SPEC = SpecId> {
    /// Chain ID of the EVM
    pub chain_id: u64,
    /// Specification for EVM represent the hardfork
    pub spec: SPEC,
    /// If some it will effects EIP-170: Contract code size limit.
    pub limit_contract_code_size: Option<usize>,
    // ... other config fields
}

impl<SPEC: Into<SpecId> + Copy> Cfg for CfgEnv<SPEC> {
    type Spec = SPEC;

    fn chain_id(&self) -> u64 {
        self.chain_id
    }

    fn spec(&self) -> Self::Spec {
        self.spec
    }

    // ... other Cfg methods
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/block.rs">
```rust
//! This module contains [`BlockEnv`] and it implements [`Block`] trait.
use context_interface::block::{BlobExcessGasAndPrice, Block};
use primitives::{Address, B256, U256};

/// The block environment
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct BlockEnv {
    /// The number of ancestor blocks of this block (block height)
    pub number: U256,
    /// Beneficiary (Coinbase or miner) is a address that have signed the block
    pub beneficiary: Address,
    /// The timestamp of the block in seconds since the UNIX epoch
    pub timestamp: U256,
    /// The gas limit of the block
    pub gas_limit: u64,
    /// The base fee per gas, added in the London upgrade with [EIP-1559]
    pub basefee: u64,
    /// The difficulty of the block
    ///
    /// Unused after the Paris (AKA the merge) upgrade, and replaced by `prevrandao`.
    pub difficulty: U256,
    /// The output of the randomness beacon provided by the beacon chain
    ///
    /// Replaces `difficulty` after the Paris (AKA the merge) upgrade with [EIP-4399].
    pub prevrandao: Option<B256>,
    /// Excess blob gas and blob gasprice
    pub blob_excess_gas_and_price: Option<BlobExcessGasAndPrice>,
}

impl Block for BlockEnv {
    // ... trait implementation mapping fields
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/tx.rs">
```rust
//! This module contains [`TxEnv`] struct and implements [`Transaction`] trait for it.
use crate::TransactionType;
use context_interface::{
    transaction::{AccessList, Transaction},
};
use primitives::{Address, Bytes, TxKind, B256, U256};
use std::vec::Vec;


/// The Transaction Environment is a struct that contains all fields that can be found in all Ethereum transaction
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TxEnv {
    /// Transaction type
    pub tx_type: u8,
    /// Caller aka Author aka transaction signer
    pub caller: Address,
    /// The gas limit of the transaction.
    pub gas_limit: u64,
    /// The gas price of the transaction.
    /// For EIP-1559 transaction this represent max_gas_fee.
    pub gas_price: u128,
    /// The destination of the transaction
    pub kind: TxKind,
    /// The value sent to `transact_to`
    pub value: U256,
    /// The data of the transaction
    pub data: Bytes,
    /// The nonce of the transaction
    pub nonce: u64,
    /// The chain ID of the transaction
    pub chain_id: Option<u64>,
    /// A list of addresses and storage keys that the transaction plans to access
    pub access_list: AccessList,
    /// The priority fee per gas
    pub gas_priority_fee: Option<u128>,
    /// The list of blob versioned hashes
    pub blob_hashes: Vec<B256>,
    /// The max fee per blob gas
    pub max_fee_per_blob_gas: u128,
    // ...
}

impl Transaction for TxEnv {
    // ... trait implementation mapping fields
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/context.rs">
```rust
//! This module contains [`Context`] struct and implements [`ContextTr`] trait for it.
// ... imports

/// EVM context contains data that EVM needs for execution.
pub struct Context<
    BLOCK = BlockEnv,
    TX = TxEnv,
    CFG = CfgEnv,
    DB: Database = EmptyDB,
    // ... other generics
> {
    /// Block information.
    pub block: BLOCK,
    /// Transaction information.
    pub tx: TX,
    /// Configurations.
    pub cfg: CFG,
    /// EVM State with journaling support and database.
    pub journaled_state: JOURNAL,
    // ...
}

impl<...> ContextTr for Context<...>
{
    // ... implementation of ContextTr trait
    fn tx(&self) -> &Self::Tx { &self.tx }
    fn block(&self) -> &Self::Block { &self.block }
    fn cfg(&self) -> &Self::Cfg { &self.cfg }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/spec.rs">
```rust
// This file shows how revm is extended for Optimism, a layer 2.
// It defines a custom SpecId for Optimism-specific hardforks.
use revm::primitives::hardfork::{name as eth_name, SpecId, UnknownHardfork};

#[repr(u8)]
#[derive(Clone, Copy, Debug, Hash, PartialEq, Eq, PartialOrd, Ord, Default)]
pub enum OpSpecId {
    BEDROCK = 100,
    REGOLITH,
    CANYON,
    ECOTONE,
    FJORD,
    GRANITE,
    HOLOCENE,
    #[default]
    ISTHMUS,
    INTEROP,
    OSAKA,
}

impl OpSpecId {
    /// Converts the [`OpSpecId`] into a [`SpecId`].
    pub const fn into_eth_spec(self) -> SpecId {
        match self {
            Self::BEDROCK | Self::REGOLITH => SpecId::MERGE,
            Self::CANYON => SpecId::SHANGHAI,
            Self::ECOTONE | Self::FJORD | Self::GRANITE | Self::HOLOCENE => SpecId::CANCUN,
            Self::ISTHMUS | Self::INTEROP => SpecId::PRAGUE,
            Self::OSAKA => SpecId::OSAKA,
        }
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/l1block.rs">
```rust
// This file defines a custom block context for Optimism, `L1BlockInfo`,
// which is a perfect example of a pluggable block context.
use revm::{
    database_interface::Database, primitives::U256,
};

/// L1 block info
///
/// We can extract L1 epoch data from each L2 block, by looking at the `setL1BlockValues`
/// transaction data. This data is then used to calculate the L1 cost of a transaction.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct L1BlockInfo {
    /// The L2 block number.
    pub l2_block: U256,
    /// The base fee of the L1 origin block.
    pub l1_base_fee: U256,
    /// The current L1 fee overhead.
    pub l1_fee_overhead: Option<U256>,
    /// The current L1 fee scalar.
    pub l1_base_fee_scalar: U256,
    /// The current L1 blob base fee.
    pub l1_blob_base_fee: Option<U256>,
    // ... other L2 specific fields
}

impl L1BlockInfo {
    /// Try to fetch the L1 block info from the database.
    pub fn try_fetch<DB: Database>(
        db: &mut DB,
        l2_block: U256,
        spec_id: OpSpecId,
    ) -> Result<L1BlockInfo, DB::Error> {
        // ... logic to load L1 info from L2 state
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/transaction/abstraction.rs">
```rust
// This file shows how to create a custom transaction type for Optimism
// by wrapping the base `TxEnv`. This is a great example of a pluggable
// transaction context.
use super::deposit::{DepositTransactionParts, DEPOSIT_TRANSACTION_TYPE};
use revm::{context::TxEnv, context_interface::transaction::Transaction};

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
    // ...
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct OpTransaction<T: Transaction> {
    pub base: T,
    pub enveloped_tx: Option<Bytes>,
    pub deposit: DepositTransactionParts,
}

impl<T: Transaction> Transaction for OpTransaction<T> {
    // ... delegates to `base` transaction
}

impl<T: Transaction> OpTxTr for OpTransaction<T> {
    // ... implements Optimism-specific transaction fields
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/host.rs">
```rust
// The `Host` trait defines the interface between the Interpreter and the
// environment (the Context). Opcodes that need external data use these methods.
// This is how the modular contexts are exposed to the EVM core.
use context_interface::{
    context::{ContextTr, SStoreResult, SelfDestructResult, StateLoad},
    // ...
};
use primitives::{Address, Bytes, Log, StorageKey, StorageValue, B256, U256};


/// Host trait with all methods that are needed by the Interpreter.
pub trait Host {
    /* Block */

    /// Block basefee, calls ContextTr::block().basefee()
    fn basefee(&self) -> U256;
    /// Block gas limit, calls ContextTr::block().gas_limit()
    fn gas_limit(&self) -> U256;
    /// Block timestamp, calls ContextTr::block().timestamp()
    fn timestamp(&self) -> U256;
    /// Block beneficiary, calls ContextTr::block().beneficiary()
    fn beneficiary(&self) -> Address;

    /* Transaction */

    /// Transaction effective gas price, calls `ContextTr::tx().effective_gas_price(basefee as u128)`
    fn effective_gas_price(&self) -> U256;
    /// Transaction caller, calls `ContextTr::tx().caller()`
    fn caller(&self) -> Address;

    /* Database */
    // ... database access methods

    /* Journal */
    // ... state modification methods
}

// The EVM's context implements the Host trait, connecting the EVM to the environment.
impl<CTX: ContextTr> Host for CTX {
    /* Block */
    fn basefee(&self) -> U256 { U256::from(self.block().basefee()) }
    fn gas_limit(&self) -> U256 { U256::from(self.block().gas_limit()) }
    fn timestamp(&self) -> U256 { U256::from(self.block().timestamp()) }
    fn beneficiary(&self) -> Address { self.block().beneficiary() }

    /* Transaction */
    fn effective_gas_price(&self) -> U256 {
        let basefee = self.block().basefee() as u128;
        U256::from(self.tx().effective_gas_price(basefee))
    }
    fn caller(&self) -> Address { self.tx().caller() }

    // ... more implementations
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
// This demonstrates how different sets of precompiles are constructed based on the
// hardfork spec, which is part of the Configuration Context.
use primitives::{hardfork::SpecId, Address, HashMap};
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
                // EIP-196 & EIP-197
                bn128::add::BYZANTIUM,
                bn128::mul::BYZANTIUM,
                bn128::pair::BYZANTIUM,
            ]);
            Box::new(precompiles)
        })
    }
    // ... more factories for other hardforks
}
```
</file>
</revm>
## Prompt Corrections
The original prompt is well-structured and provides a solid foundation for building a modular context system in Zig. `revm`'s architecture validates this approach. A few minor points to consider during implementation:

1.  **Context vs. Environment**: `revm` uses `CfgEnv`, `BlockEnv`, and `TxEnv` to hold environment-specific data. The term "Environment" might be slightly more precise than "Context" for these data-holding structs, to distinguish them from the overall `ExecutionContext`. However, this is purely a naming preference.
2.  **Manager vs. Handler**: The prompt's `ContextManager` is analogous to `revm`'s `Handler` (e.g., `MainnetHandler`, `OpHandler`). The `Handler` orchestrates the entire transaction lifecycle (validation, pre-execution, execution, post-execution). The prompt's design is sound, but looking at `revm`'s `handler` crate could provide valuable insights into managing the execution flow.
3.  **L2-Specific Logic**: The `op-revm` crate shows that L2s often need to override not just data contexts (`L1BlockInfo`) but also *logic*, like fee calculation (`reimburse_caller`). The proposed `ContextManager` should also consider how to make its internal logic pluggable, perhaps via function pointers or a trait/interface system, similar to how `OpHandler` overrides `MainnetHandler`.
4.  **Performance**: `revm` makes heavy use of Rust's trait system and generics to achieve zero-cost abstractions. For performance-critical code in Zig, consider using `comptime` and interfaces to achieve similar compile-time polymorphism and avoid runtime overhead where possible.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
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


@dataclass
class TransactionEnvironment:
    """
    Items that are used by contract creation or message call.
    """

    origin: Address
    gas_price: Uint
    gas: Uint
    access_list_addresses: Set[Address]
    access_list_storage_keys: Set[Tuple[Address, Bytes32]]
    transient_storage: TransientStorage
    blob_versioned_hashes: Tuple[VersionedHash, ...]
    index_in_block: Optional[Uint]
    tx_hash: Optional[Hash32]
    traces: List[dict]


@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: BlockEnvironment
    tx_env: TransactionEnvironment
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code_address: Optional[Address]
    code: Bytes
    depth: Uint
    should_transfer_value: bool
    is_static: bool
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
    parent_evm: Optional["Evm"]


@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]


def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    evm.accounts_to_delete.update(child_evm.accounts_to_delete)
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.
    """
    evm.gas_left += child_evm.gas_left
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/transactions.py">
```python
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


@slotted_freezable
@dataclass
class BlobTransaction:
    """
    The transaction type added in EIP-4844.
    """

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


def decode_transaction(tx: Union[LegacyTransaction, Bytes]) -> Transaction:
    """
    Decode a transaction. Needed because non-legacy transactions aren't RLP.
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/hardforks/chain_rules.py">
```python
from typing import List

from ethereum_spec_tools.forks import Hardfork


class ChainRules:
    """
    The ChainRules class contains all the rules for a particular chain.
    """

    def __init__(self, *args, **kwargs):  # type: ignore
        for k, v in kwargs.items():
            setattr(self, k, v)

    @classmethod
    def from_fork(cls, fork: str) -> "ChainRules":
        """
        Create a ChainRules object for a specific fork.
        """
        fork_rules: List[str] = []

        # Get all the fork rules from the fork module
        for hardfork in Hardfork.discover():
            fork_name = hardfork.name.split(".")[-1]
            fork_rules.append(fork_name)

        # Create a dictionary of all the rules
        all_rules = {f"Is{k.title().replace('_', '')}": False for k in fork_rules}

        # Enable the rules for the given fork
        for i, fork_rule in enumerate(fork_rules):
            all_rules[f"Is{fork_rule.title().replace('_', '')}"] = True
            if fork_rule == fork:
                break

        return cls(**all_rules)


# By default, all the chain rules are set to the latest fork
# Each fork will have a file that will set the chain rules for that fork.
# The fork file will look like this:
# from ethereum.berlin.fork import Berlin
# from ethereum.london.fork import London
# from ethereum.paris.fork import Paris
# from ethereum.shanghai.fork import Shanghai
# from ethereum.cancun.fork import Cancun
# from ethereum.prague.fork import Prague

# FORK_BLOCK = 12965000


# class London(Berlin):
#     """
#     The London fork of the Ethereum mainnet.
#     """

#     @classmethod
#     def header_validaity(cls, header: Header, parent_header: Header) -> None:
#         super().header_validaity(header, parent_header)
#         # EIP-1559: Validate base fee
#         if parent_header.base_fee_per_gas is not None:
#             ...

#     ...
# some dummy class for the latest fork
class LatestFork:
    """
    A dummy class that represents the latest fork.
    """

    pass


# Chain rules for the latest fork
chain_rules = ChainRules.from_fork(LatestFork.__name__.lower())


# Set the default chain rules to the latest fork
# Update this to the latest fork
DEFAULT_CHAIN_RULES = ChainRules.from_fork("prague")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    evm.return_data = b""

    if evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT:
        evm.gas_left += gas
        push(evm.stack, U256(0))
        return

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        block_env=evm.message.block_env,
        tx_env=evm.message.tx_env,
        caller=caller,
        target=to,
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        current_target=to,
        depth=evm.message.depth + Uint(1),
        code_address=code_address,
        should_transfer_value=should_transfer_value,
        is_static=True if is_staticcall else evm.message.is_static,
        accessed_addresses=evm.accessed_addresses.copy(),
        accessed_storage_keys=evm.accessed_storage_keys.copy(),
        parent_evm=evm,
    )
    child_evm = process_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

    actual_output_size = min(memory_output_size, U256(len(child_evm.output)))
    memory_write(
        evm.memory,
        memory_output_start_position,
        child_evm.output[:actual_output_size],
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.

    Transactions are entirely implicit and can be nested. It is not possible to
    calculate the state root during a transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    transient_storage._snapshots.append(
        {k: copy_trie(t) for (k, t) in transient_storage._tries.items()}
    )


def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._snapshots.pop()


def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt provides a detailed and well-structured plan for a modular context system. The design is excellent and closely mirrors the flexibility needed for a multi-fork, multi-chain EVM.

Based on the `execution-specs`, here are a few minor clarifications and suggestions:

1.  **`ConfigurationContext` and `Hardfork`:**
    *   The prompt's `ConfigurationContext` combines hardfork rules (like `hardfork`, `chain_id`) with execution-time flags (like `is_static`, `debug_mode`). This is a good design.
    *   The `execution-specs` handle hardfork rules via the `ChainRules` class (see `src/ethereum/hardforks/chain_rules.py`), which is a great pattern to follow for the `hardfork` and `chain_id` fields.
    *   Flags like `is_static` are managed per-call frame in the specs (in the `Message` object), which maps well to the prompt's `ExecutionContext`. This is correct.
    *   Flags like `debug_mode` and `tracing_enabled` are client-level concerns not specified in the execution specs, but are perfectly valid to include in a `ConfigurationContext` for a real-world implementation.

2.  **`BlockContext` and L2s:**
    *   The prompt correctly identifies that different chains (especially L2s) have different block parameters. The `BlockContext` union is a good way to model this.
    *   In the `execution-specs`, block parameters are defined in the `Header` dataclass within each fork's `blocks.py` file. For L2-specific fields (like `l1_block_number` for Optimism), creating distinct structs within the `BlockContext` union is the right approach.

3.  **Transaction Context:**
    *   The prompt's `TransactionContext` struct is a good abstraction. In `execution-specs`, different transaction types are handled by separate dataclasses (e.g., `LegacyTransaction`, `FeeMarketTransaction`, `BlobTransaction`). The prompt's approach of having a single struct with a `TransactionType` enum and optional fields is a valid and common implementation strategy. It mirrors the logic inside `decode_transaction` which acts as a factory.

4.  **`validate_hardfork_compatibility`:**
    *   The prompt's implementation of this function is a good start. In practice, this logic is more complex and is woven into the `ChainRules` and `JumpTable` initialization. The `for_hardfork` function in `src/ethereum/hardforks/chain_rules.py` is the canonical reference for which EIPs (and thus opcodes and behaviors) are active at which fork. Using a similar mechanism to enable/disable features based on the `hardfork` in the `ConfigurationContext` would be robust.

The prompt is already very well-aligned with the principles found in the execution specs. The provided snippets will serve as excellent, concrete references for implementing the proposed design.

---

An excellent and detailed prompt. Implementing a modular context system is crucial for a robust and maintainable EVM. The provided specifications are well-structured.

To aid in the implementation, I have extracted the most relevant context from the `ethereum/execution-specs` codebase. This Python-based specification serves as the ground truth for EVM behavior and its data structures directly inspired the design of your proposed `ExecutionContext`, `BlockContext`, `TransactionContext`, and `ConfigurationContext`.

The following snippets will be particularly useful:

1.  **Context Data Structures**: The `BlockEnvironment`, `TransactionEnvironment`, and `Message` dataclasses from `cancun/vm/__init__.py` are the direct Python counterparts to your proposed context structs. They clearly delineate the information available at the block, transaction, and individual call levels.
2.  **Transaction Types**: The various `Transaction` dataclasses from `cancun/transactions.py` show exactly which fields are associated with Legacy, EIP-2930 (AccessList), EIP-1559, and EIP-4844 (Blob) transactions. This is essential for correctly implementing the `TransactionContext` and its variants.
3.  **Context Creation and Usage**: The `process_transaction` function from `cancun/fork.py` demonstrates how the `BlockEnvironment` and `TransactionEnvironment` are constructed from block and transaction data.
4.  **Child Context Creation**: The `generic_call` function from `cancun/vm/instructions/system.py` shows how a new `Message` (equivalent to `ExecutionContext`) is created for a sub-call, inheriting or modifying state from its parent, which directly maps to your `create_child_context` requirement.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
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


@dataclass
class TransactionEnvironment:
    """
    Items that are used by contract creation or message call.
    """

    origin: Address
    gas_price: Uint
    gas: Uint
    access_list_addresses: Set[Address]
    access_list_storage_keys: Set[Tuple[Address, Bytes32]]
    transient_storage: TransientStorage
    blob_versioned_hashes: Tuple[VersionedHash, ...]
    index_in_block: Optional[Uint]
    tx_hash: Optional[Hash32]
    traces: List[dict]


@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: BlockEnvironment
    tx_env: TransactionEnvironment
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code_address: Optional[Address]
    code: Bytes
    depth: Uint
    should_transfer_value: bool
    is_static: bool
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
    parent_evm: Optional["Evm"]


@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/transactions.py">
```python
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


@slotted_freezable
@dataclass
class BlobTransaction:
    """
    The transaction type added in EIP-4844.
    """

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
    LegacyTransaction, AccessListTransaction, FeeMarketTransaction, BlobTransaction
]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    # ... (intrinsic gas validation)

    (
        sender,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    # ... (gas fee calculations and deductions)

    # This tx_env is the equivalent of the TransactionContext
    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        access_list_addresses=access_list_addresses,
        access_list_storage_keys=access_list_storage_keys,
        transient_storage=TransientStorage(),
        blob_versioned_hashes=blob_versioned_hashes,
        index_in_block=index,
        tx_hash=get_transaction_hash(encode_transaction(tx)),
        traces=[],
    )

    # The Message is the equivalent of the ExecutionContext
    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... (process output and refund gas)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    # ... (depth check)

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code

    # This is the creation of a child context (Message) from the parent (evm.message)
    child_message = Message(
        block_env=evm.message.block_env, # Inherited
        tx_env=evm.message.tx_env,       # Inherited
        caller=caller,                   # Set for this call
        target=to,                       # Set for this call
        gas=gas,                         # Set for this call
        value=value,                     # Set for this call
        data=call_data,
        code=code,
        current_target=to,
        depth=evm.message.depth + Uint(1), # Incremented depth
        code_address=code_address,
        should_transfer_value=should_transfer_value,
        is_static=True if is_staticcall else evm.message.is_static, # Set for static calls
        accessed_addresses=evm.accessed_addresses.copy(),
        accessed_storage_keys=evm.accessed_storage_keys.copy(),
        parent_evm=evm,
    )
    child_evm = process_message(child_message)

    # ... (process child_evm result)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/hardforks.py">
```python
# The ordering of the forks, from older to newer
# This can be used to model the `hardfork` enum in ConfigurationContext.
# Note: Prague is still in development, Cancun is the latest mainnet fork.
FORK_SEQUENCE: Tuple[str, ...] = (
    "frontier",
    "homestead",
    "dao_fork",
    "tangerine_whistle",
    "spurious_dragon",
    "byzantium",
    "constantinople",
    "petersburg",
    "istanbul",
    "muir_glacier",
    "berlin",
    "london",
    "arrow_glacier",
    "gray_glacier",
    "paris",
    "shanghai",
    "cancun",
    "prague",
)
```
</file>
</execution-specs>

## Prompt Corrections

The provided prompt is very well-designed. The proposed modular context system is a strong pattern for building a flexible EVM. Here are a couple of minor observations and suggestions based on the `execution-specs`:

1.  **Separation of Concerns in Contexts**: The prompt's `ExecutionContext` combines several concerns. The `execution-specs` provide a good model for separating these:
    *   **Block-level Context**: Information that is constant for all transactions in a block (e.g., `block_number`, `timestamp`, `coinbase`, `base_fee`). This maps well to your `BlockContext`. The `BlockEnvironment` in the specs is the direct equivalent.
    *   **Transaction-level Context**: Information that is constant for the duration of a single transaction (e.g., `tx.origin`, `tx.gas_price`). This is represented by the `TransactionEnvironment` in the specs.
    *   **Call-level Context**: Information that changes with each nested call (e.g., `msg.sender`, `msg.value`, `calldata`, `is_static`). This is represented by the `Message` object in the specs.

    Your `ExecutionContext` serves as the `Message` equivalent. It's beneficial to recognize that `BlockContext` and parts of `TransactionContext` (like `tx.origin`) are inherited from the top-level environment, while other parts (like `caller`, `value`) change with each sub-call.

2.  **Hardfork Rules vs. Configuration**: Your `ConfigurationContext` combines hardfork rules (which are constant for a given network state) with call-specific flags (`is_static`) and implementation-specific flags (`debug_mode`). It might be cleaner to model this after the specs:
    *   Keep hardfork rules (like `IsEIP1559`, `IsCancun` from `london/fork.py` or `cancun/fork.py`) as a separate, immutable struct for a given VM instance. This is what your `Hardfork` enum achieves.
    *   The `is_static` flag is a property of a specific call frame, not a global configuration. The `generic_call` function in `system.py` shows it being set to `True` for `STATICCALL`, which is the correct place for it. This aligns with your `create_child_context` logic.

These are minor structural suggestions inspired by the reference implementation. Your overall design is sound and effectively captures the necessary components for a modular EVM.



## GO-ETHEREUM Context

Here are the most relevant code snippets from go-ethereum to help you implement the modular context system.

### Rationale for selection

The selected Go-ethereum code provides direct parallels to the components requested in the prompt:

1.  **ExecutionContext:** The `vm.EVM` struct serves as the primary execution context, holding references to the state database, chain configuration, block context, and transaction context.
2.  **Block Context:** The `vm.BlockContext` struct and the `NewEVMBlockContext` factory function directly map to the concept of a pluggable block context, showing how it's constructed from a block header.
3.  **Transaction Context:** The `types.Transaction` struct, with its `TxData` interface, illustrates how different transaction types (legacy, EIP-1559, etc.) can be handled polymorphically, aligning with the "pluggable transaction context" requirement.
4.  **Configuration Context:** The `params.ChainConfig` struct is the go-ethereum equivalent of the `ConfigurationContext`, defining all network-wide parameters and hardfork activation blocks. The `vm.Config` struct provides per-execution configuration like tracing and debugging flags.
5.  **Context Inheritance/Switching:** The `opDelegateCall` function from `core/vm/instructions.go` is a perfect example of creating a "child context". It demonstrates how a new execution frame is created for a sub-call, inheriting state from the parent but modifying specific context parameters like the `caller` and `value`.

These snippets collectively demonstrate a robust, real-world implementation of the concepts outlined in the prompt, providing a valuable reference for building the new system in Zig.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
//
// The EVM should be considered a single use object.
type EVM struct {
	// Context provides auxiliary blockchain related information
	TxContext
	BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// global configuration options
	vmConfig Config

	// interpreter is the contract interpreter
	interpreter *EVMInterpreter

	// callGasTemp is a temporary gas counter for call calculations.
	callGasTemp uint64
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		chainConfig:  chainConfig,
		vmConfig:     vmConfig,
	}
	evm.interpreter = NewEVMInterpreter(evm, vmConfig)
	return evm
}

// BlockContext provides information about the block and the chain that the
// message is being processed in.
type BlockContext struct {
	// CanTransfer returns whether the account has enough ether to send the
	// value. This is the balance check before the transfer is actually happens.
	CanTransfer CanTransferFunc
	// Transfer transfers ether from one account to the other.
	Transfer TransferFunc
	// GetHash returns the hash corresponding to n.
	GetHash GetHashFunc

	// Main-chain information
	Coinbase    common.Address // Provides the coinbase address of the current block
	GasLimit    uint64         // Provides the gas limit of the current block
	BlockNumber *big.Int       // Provides the block number of the current block
	Time        uint64         // Provides the timestamp of the current block
	Difficulty  *big.Int       // Provides the difficulty of the current block
	Random      *common.Hash   // Provides the random value (previously mixDigest) of the current block
	BaseFee     *big.Int       // Provides the base fee of the current block
	BlobBaseFee *big.Int       // Provides the blob base fee of the current block (EIP-4844)
}

// TxContext provides information about the transaction and the initial sender account.
type TxContext struct {
	Origin      common.Address // Provides the origin address of the transaction
	GasPrice    *big.Int       // Provides the gas price of the transaction
	BlobHashes  []common.Hash  // Provides the blob hashes of the transaction (EIP-4844)
	BlobFeeCap  *big.Int       // Provides the blob fee cap of the transaction (EIP-4844)
}

// Config are the configuration options for the EVM.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee may be used to temporary disable London support
	NoBaseFee bool
	// EnablePreimageRecording switch on SHA3 preimages recording
	EnablePreimageRecording bool

	// Per-transaction state access list to be used with the EVM.
	AccessList *types.AccessList

	// External hooks that are invoked during EVM execution.
	// These hooks are experimental and might be changed in the future.
	Hooks *Hooks
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/evm.go">
```go
// NewEVMBlockContext creates a new context for use in the EVM.
func NewEVMBlockContext(header *types.Header, chain ChainContext, author *common.Address) vm.BlockContext {
	var (
		beneficiary common.Address
		baseFee     *big.Int
		blobBaseFee *big.Int
		random      *common.Hash
	)

	// If we don't have an explicit author (i.e. not mining), extract from the header
	if author == nil {
		beneficiary, _ = chain.Engine().Author(header) // Ignore error, we're past header validation
	} else {
		beneficiary = *author
	}
	if header.BaseFee != nil {
		baseFee = new(big.Int).Set(header.BaseFee)
	}
	if header.ExcessBlobGas != nil {
		blobBaseFee = eip4844.CalcBlobFee(chain.Config(), header)
	}
	if header.Difficulty.Sign() == 0 {
		random = &header.MixDigest
	}
	return vm.BlockContext{
		CanTransfer: CanTransfer,
		Transfer:    Transfer,
		GetHash:     GetHashFn(header, chain),
		Coinbase:    beneficiary,
		BlockNumber: new(big.Int).Set(header.Number),
		Time:        header.Time,
		Difficulty:  new(big.Int).Set(header.Difficulty),
		BaseFee:     baseFee,
		BlobBaseFee: blobBaseFee,
		GasLimit:    header.GasLimit,
		Random:      random,
	}
}

// NewEVMTxContext creates a new transaction context for a single transaction.
func NewEVMTxContext(msg *Message) vm.TxContext {
	ctx := vm.TxContext{
		Origin:     msg.From,
		GasPrice:   new(big.Int).Set(msg.GasPrice),
		BlobHashes: msg.BlobHashes,
	}
	if msg.BlobGasFeeCap != nil {
		ctx.BlobFeeCap = new(big.Int).Set(msg.BlobGasFeeCap)
	}
	return ctx
}
```
</file>
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

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements replay-protected transaction signatures.
	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements state clearing for empty accounts.
	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-158.md
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = same as Constantinople)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// Muir Glacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// Arrow Glacier switch block (nil = no fork, 0 = already on arrowglacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// Gray Glacier switch block (nil = no fork, 0 = already on grayglacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplitBlock defines the block number at which the network condition
	// of a merge-enabled network without a PoW-to-PoS transition is enforced.
	//
	// On networks that do not have a terminal total difficulty, like testnets,
	// a merge fork block is used to transition the network to proof-of-stake.
	// In this case, the terminal total difficulty should be set to zero.
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from proof-of-work to proof-of-stake.
	//
	// A nil value means the network is not merged.
	// A zero value means the network is post-merge from genesis.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag specifying that the network has passed
	// the terminal total difficulty. This is a non-consensus changing field which is
	// used by ethstats to display the correct information.
	//
	// This is a temporary field until ethstats is directly hooked into the consensus
	// engine.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// ShanghaiTime is the timestamp at which the network upgrades to Shanghai.
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// CancunTime is the timestamp at which the network upgrades to Cancun.
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// PragueTime is the timestamp at which the network upgrades to Prague.
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// VerkleTime is the timestamp at which the network upgrades to Verkle.
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// MainnetChainConfig is the chain parameters for the main net.
var MainnetChainConfig = &ChainConfig{
	ChainID:             big.NewInt(1),
	HomesteadBlock:      big.NewInt(1150000),
	DAOForkBlock:        big.NewInt(1920000),
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(2463000),
	EIP155Block:         big.NewInt(2675000),
	EIP158Block:         big.NewInt(2675000),
	ByzantiumBlock:      big.NewInt(4370000),
	ConstantinopleBlock: big.NewInt(7280000),
	PetersburgBlock:     big.NewInt(7280000),
	IstanbulBlock:       big.NewInt(9069000),
	MuirGlacierBlock:    big.NewInt(9200000),
	BerlinBlock:         big.NewInt(12244000),
	LondonBlock:         big.NewInt(12965000),
	ArrowGlacierBlock:   big.NewInt(13773000),
	GrayGlacierBlock:    big.NewInt(15050000),
	// TerminalTotalDifficulty is the total difficulty for the mainnet Merge transition.
	TerminalTotalDifficulty:       math.MustParseBig256("58750000000000000000000"),
	ShanghaiTime:                  &params.MainnetShanghaiTime,
	CancunTime:                    &params.MainnetCancunTime,
	PragueTime:                    &params.MainnetPragueTime,
	VerkleTime:                    &params.MainnetVerkleTime,
	Ethash:                        new(EthashConfig),
	BlobScheduleConfig: &BlobScheduleConfig{
		Cancun: params.DefaultCancunBlobConfig,
		Prague: params.DefaultPragueBlobConfig,
		Osaka:  params.DefaultOsakaBlobConfig,
		Verkle: params.DefaultPragueBlobConfig,
	},
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // Consensus contents of a transaction
	time  time.Time // Time first seen locally (spam avoidance)

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Uint64
	from atomic.Pointer[sigCache]
}

// TxData is the underlying data of a transaction.
//
// This is implemented by DynamicFeeTx, LegacyTx and AccessListTx.
type TxData interface {
	txType() byte // returns the type ID
	copy() TxData // creates a deep copy and initializes all fields

	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasPrice() *big.Int
	gasTipCap() *big.Int
	gasFeeCap() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address

	rawSignatureValues() (v, r, s *big.Int)
	setSignatureValues(chainID, v, r, s *big.Int)
	
	// ... (other methods)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opDelegateCall operates on DELEGATECALL, which is similar to CALLCODE, but
// with an addition of preserving the caller and value fields.
func opDelegateCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	// Pop gas, address, input offset, input size, output offset, output size from the stack.
	gas, addr, inOffset, inSize, outOffset, outSize := scope.Stack.Pop6()

	// Ensure that the requested gas is not larger than the available gas.
	gas.Div(&gas, interpreter.evm.callGasTemp) // Clear the higher bits
	callGas := gas.Uint64()
	if callGas > interpreter.Gas() {
		return nil, ErrOutOfGas
	}
	// Memory bounds check for input and output.
	if err := scope.Memory.BoundsCheck(inOffset, inSize); err != nil {
		return nil, err
	}
	if err := scope.Memory.BoundsCheck(outOffset, outSize); err != nil {
		return nil, err
	}

	var (
		// The address of the code to execute is what's on the stack.
		codeAddress = common.Address(addr.Bytes20())
		// The input data is a slice of memory.
		input = scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())
	)

	// Call the interpreter.
	// DELEGATECALL is allowed to modify the state.
	// The caller and value of the callee is the same as the caller of the caller.
	// It's a weird quirk of DELEGATECALL that has been fixed in the most recent
	// callers.
	ret, returnGas, err := interpreter.evm.DelegateCall(scope.Contract, codeAddress, input, callGas)
	if err != nil {
		return nil, err
	}
	interpreter.SubGas(callGas)
	interpreter.AddGas(returnGas)

	scope.Stack.Push(new(uint256.Int).SetBool(err == nil))
	if err == nil {
		scope.Memory.Set(outOffset.Uint64(), outSize.Uint64(), ret)
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm      *EVM
	config   Config
	gasPool  *core.GasPool
	readOnly bool // whether to throw on stateful modifications
	ret      []byte

	// The following fields are per-transaction and change on every new tx
	msgStack    []*callCtx
	hasher      crypto.KeccakState
	hasherBuf   common.Hash
	sharedStack *Stack // shared stack between calls
}
// ...
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup code)

	// The main execution loop
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the PC
		// to be uint256. Practically much less so.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for tracer
		logged  bool   // deferred tracer should ignore already logged steps
		res     []byte // result of the opcode execution function
	)
	// Don't move this deferred function, it's placed before theCapture-and-Tracer since that is a closure with reference to the pc.
	defer func() {
		//r := recover()
		returned(stack)
		returned(mem)
	}()

	//...

	for {
		//... (opcode fetching and gas checks)

		// Get the operation from the jump table and validate the stack.
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		//...

		// Static call violation check
		if in.readOnly && in.evm.chainRules.IsByzantium {
			// If the interpreter is operating in readonly mode, make sure no
			// state modifying operation is performed. The Homestead interpreter
			// raised an error. The Byzantium interpreter considers them legal
			// but reverts the state and subtracts gas.
			if operation.writes {
				return nil, ErrWriteProtection
			}
		}
		//...
		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		//...
	}
//...
}


```
</file>
</go-ethereum>

---

An analysis of the `go-ethereum` codebase reveals a robust, though not explicitly "modular" in the same way as the prompt, system for handling different execution contexts. The core components are `vm.EVMContext` for block/transaction info, `params.ChainConfig` for fork rules, and the `types.TxData` interface for pluggable transaction types.

The following Go code snippets are highly relevant for implementing the proposed modular context system.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/context.go">
```go
// core/vm/context.go

// EVMContext provides the EVM with auxiliary information. Once provided
// it shouldn't be modified.
type EVMContext struct {
	// CanTransfer returns whether the account has enough cash to send the
	// given amount. This function is called before the EVM runs to ensure
	// the depth of the calls is not exceeding the limits.
	CanTransfer CanTransferFunc

	// Transfer transfers ether from one account to the other.
	Transfer TransferFunc

	// GetHash returns the hash of a block for a given block number.
	GetHash GetHashFunc

	// Block information
	Coinbase    common.Address // The coinbase address for the current block
	GasLimit    uint64         // The gas limit for the current block
	BlockNumber *big.Int       // The block number of the current block
	Time        uint64         // The timestamp of the current block
	Difficulty  *big.Int       // The difficulty of the current block
	BaseFee     *big.Int       // The base fee of the current block
	BlobBaseFee *big.Int       // The blob base fee of the current block (EIP-4844)
	Random      *common.Hash   // The random seed of the current block

	// TxContext provides information about the transaction
	// that is being executed.
	TxContext
}

// TxContext provides information about a transaction that is being
// executed in the EVM.
type TxContext struct {
	Origin     common.Address // The origin of the transaction
	GasPrice   *big.Int       // The gas price of the transaction
	BlobHashes []common.Hash  // The blob hashes of the transaction (EIP-4844)
}
```
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
// core/state_transition.go

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	evm.SetTxContext(NewEVMTxContext(msg))
	return newStateTransition(evm, msg, gp).execute()
}

// A Message contains the data derived from a single transaction that is relevant to state
// processing.
type Message struct {
	To                    *common.Address
	From                  common.Address
	Nonce                 uint64
	Value                 *big.Int
	GasLimit              uint64
	GasPrice              *big.Int
	GasFeeCap             *big.Int
	GasTipCap             *big.Int
	Data                  []byte
	AccessList            types.AccessList
	BlobGasFeeCap         *big.Int
	BlobHashes            []common.Hash
	...
}

// stateTransition represents a state transition.
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// newStateTransition initialises and returns a new state transition object.
func newStateTransition(evm *vm.EVM, msg *Message, gp *GasPool) *stateTransition {
	return &stateTransition{
		gp:    gp,
		evm:   evm,
		msg:   msg,
		state: evm.StateDB,
	}
}

// This function is the "factory" logic that assembles and executes a context.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... pre-check logic (nonce, balance, etc.) ...

	// Intrinsic gas calculation
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	...

	// Prepare the state access list for the transaction.
	st.state.Prepare(rules, msg.From, st.evm.Context.Coinbase, msg.To, vm.ActivePrecompiles(rules), msg.AccessList)

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gasRemaining, vmerr = st.evm.Create(msg.From, msg.Data, st.gasRemaining, value)
	} else {
		// Increment the nonce for the next transaction.
		st.state.SetNonce(msg.From, st.state.GetNonce(msg.From)+1, tracing.NonceChangeEoACall)
		...
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// ... gas refund and fee payment logic ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/block.go">
```go
// core/types/block.go

// Header represents a block header in the Ethereum blockchain.
// This struct is the primary source for the `BlockContext`.
type Header struct {
	ParentHash  common.Hash    `json:"parentHash"       gencodec:"required"`
	UncleHash   common.Hash    `json:"sha3Uncles"       gencodec:"required"`
	Coinbase    common.Address `json:"miner"`
	Root        common.Hash    `json:"stateRoot"        gencodec:"required"`
	TxHash      common.Hash    `json:"transactionsRoot" gencodec:"required"`
	ReceiptHash common.Hash    `json:"receiptsRoot"     gencodec:"required"`
	Bloom       Bloom          `json:"logsBloom"        gencodec:"required"`
	Difficulty  *big.Int       `json:"difficulty"       gencodec:"required"`
	Number      *big.Int       `json:"number"           gencodec:"required"`
	GasLimit    uint64         `json:"gasLimit"         gencodec:"required"`
	GasUsed     uint64         `json:"gasUsed"          gencodec:"required"`
	Time        uint64         `json:"timestamp"        gencodec:"required"`
	Extra       []byte         `json:"extraData"        gencodec:"required"`
	MixDigest   common.Hash    `json:"mixHash"`
	Nonce       BlockNonce     `json:"nonce"`

	// BaseFee was added by EIP-1559 and is ignored in legacy headers.
	BaseFee *big.Int `json:"baseFeePerGas" rlp:"optional"`

	// WithdrawalsHash was added by EIP-4895 and is ignored in legacy headers.
	WithdrawalsHash *common.Hash `json:"withdrawalsRoot" rlp:"optional"`

	// BlobGasUsed was added by EIP-4844 and is ignored in legacy headers.
	BlobGasUsed *uint64 `json:"blobGasUsed" rlp:"optional"`

	// ExcessBlobGas was added by EIP-4844 and is ignored in legacy headers.
	ExcessBlobGas *uint64 `json:"excessBlobGas" rlp:"optional"`

	// ParentBeaconRoot was added by EIP-4788 and is ignored in legacy headers.
	ParentBeaconRoot *common.Hash `json:"parentBeaconBlockRoot" rlp:"optional"`

	// RequestsHash was added by EIP-7685 and is ignored in legacy headers.
	RequestsHash *common.Hash `json:"requestsHash" rlp:"optional"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/transaction.go">
```go
// core/types/transaction.go

// This interface defines the modularity for different transaction types.
// It corresponds to the prompt's `TransactionContext` variants.
type TxData interface {
	txType() byte // returns the type ID
	copy() TxData // creates a deep copy and initializes all fields

	// accessors
	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasPrice() *big.Int
	gasTipCap() *big.Int
	gasFeeCap() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address

	// signature values
	rawSignatureValues() (v, r, s *big.Int)
	setSignatureValues(chainID, v, r, s *big.Int)
}

// Transaction is the Ethereum transaction wrapper type.
type Transaction struct {
	inner TxData    // The transaction payload, which is one of the TxData implementations.
	time  time.Time // Time the transaction was first seen locally

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Uint64
	from atomic.Pointer[common.Address]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/tx_legacy.go">
```go
// core/types/tx_legacy.go

// LegacyTx is the transaction data of the original Ethereum transactions.
// This is an implementation of the `TxData` interface, corresponding to the
// prompt's `Legacy` transaction context.
type LegacyTx struct {
	Nonce    uint64          // nonce of sender account
	GasPrice *big.Int        // wei per gas
	Gas      uint64          // gas limit
	To       *common.Address `rlp:"nil"` // nil means contract creation
	Value    *big.Int        // wei amount
	Data     []byte          // contract invocation input data
	V, R, S  *big.Int        // signature values
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/tx_blob.go">
```go
// core/types/tx_blob.go

// BlobTx is the transaction data of an EIP-4844 blob transaction.
// This is an implementation of the `TxData` interface, corresponding to the
// prompt's `Blob` transaction context.
type BlobTx struct {
	ChainID    *uint256.Int    // destination chain ID
	Nonce      uint64          // nonce of sender account
	GasTipCap  *uint256.Int    // EIP-1559 value
	GasFeeCap  *uint256.Int    // EIP-1559 value
	Gas        uint64          // gas limit
	To         common.Address  // non-nil means contract call
	Value      *uint256.Int    // 18-decimal ETH asset
	Data       []byte          // contract invocation input data
	AccessList AccessList      // EIP-2930 access list
	BlobFeeCap *uint256.Int    // EIP-4844 value
	BlobHashes []common.Hash   // EIP-4844 value
	V, R, S    *uint256.Int    // signature values
	// sidecar is the blob data this transaction references. This field is not part of
	// the transaction data, but it's needed for transaction validation.
	sidecar *BlobTxSidecar `rlp:"-"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/config.go">
```go
// params/config.go

// ChainConfig is the core config which determines the blockchain settings.
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
// This corresponds to the prompt's `ConfigurationContext` for protocol rules.
type ChainConfig struct {
	ChainID             *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection
	HomesteadBlock      *big.Int `json:"homesteadBlock,omitempty"`
	DAOForkBlock        *big.Int `json:"daoForkBlock,omitempty"`
	DAOForkSupport      bool     `json:"daoForkSupport,omitempty"`
	EIP150Block         *big.Int `json:"eip150Block,omitempty"`
	EIP150Hash          common.Hash `json:"eip150Hash,omitempty"`
	EIP155Block         *big.Int `json:"eip155Block,omitempty"`
	EIP158Block         *big.Int `json:"eip158Block,omitempty"`
	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`
	ShanghaiTime        *uint64  `json:"shanghaiTime,omitempty"`
	CancunTime          *uint64  `json:"cancunTime,omitempty"`
	PragueTime          *uint64  `json:"pragueTime,omitempty"`
	VerkleTime          *uint64  `json:"verkleTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// Ethash consensus algorithm configuration.
	Ethash *EthashConfig `json:"ethash,omitempty"`

	// Clique consensus algorithm configuration.
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// Rules is a set of rules for a specific chain block. The rules are derived
// from the chain configuration and the block number.
type Rules struct {
	IsHomestead,
	IsEIP150,
	IsEIP155,
	IsEIP158,
	IsByzantium,
	IsConstantinople,
	IsPetersburg,
	IsIstanbul,
	IsBerlin,
	IsLondon,
	IsMerge,
	IsShanghai,
	IsCancun,
	IsPrague,
	IsVerkle bool
}

// Rules returns the rule set for the given block number and timestamp.
func (c *ChainConfig) Rules(num *big.Int, time uint64) Rules {
    // ... logic to determine which rules are active based on block number and timestamp ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// core/vm/evm.go

// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that the EVM is fully
// stateless and has no knowledge of the state of the blockchain.
// It only acts as an interpreter.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context EVMContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// Config are the configuration options for the EVM
	Config Config
	...
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx EVMContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		Config:      vmConfig,
	}
	evm.Context.TxContext = txCtx // TODO(rjl493456442): this is an odd spaghetti
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// Call executes the contract associated with the destination address.
// It returns the EVM output bytes, the remaining gas, and an error if one occurred.
//
// The method strictly copies the provided EVM parameter members, so all
// fields can be safely modified without affecting the calling EVM.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... gas checking and validation ...

	// Create a new entry on the call stack.
	// This is analogous to `create_child_context` in the prompt.
	// It creates a new scope for the sub-call.
	evm.depth++
	defer func() { evm.depth-- }()

	// ... logic to handle value transfer, snapshotting state ...

	// Run the EVM.
	ret, err = run(evm, contract, input, false)

	// ... logic to revert state on error or finalize changes ...

	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... gas checking and validation ...
	
	// Depth check on the call stack.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}

	// Create a new account on the state.
	contractAddr = evm.StateDB.CreateAccount(caller.Address())
	
	// Create a new contract and execution context for the deployment.
	// This is another form of child context creation.
	contract := NewContract(caller, Account(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)
	
	// Run the EVM.
	ret, err = run(evm, contract, nil, true)

	// ... logic to check code size, store code, and handle errors ...

	return ret, contractAddr, gas, err
}
```
</file>
</go-ethereum>

---

Here are the most relevant code snippets from go-ethereum to help implement the `Modular Context System`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on a given state with
// a given context.
type EVM struct {
	// Context provides information about the transaction and block
	TxContext
	BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// Depth is the call depth, which is restricted to 1024
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// Chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the
	// virtual machine.
	Config Config

	// Interpreter is the EVM interpreter instance
	interpreter *Interpreter

	// readOnly denotes whether the EVM is in read-only mode, in which case state-modifying
	// instructions are disallowed. The read-only flag corresponds to the STATICCALL opcode.
	readOnly bool

	// returnData is the return data of the last call.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		StateDB:      statedb,
		BlockContext: blockCtx,
		TxContext:    txCtx,
		chainConfig:  chainConfig,
		Config:       vmConfig,
		chainRules:   chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
	}
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/context.go">
```go
// BlockContext provides information about a block to the EVM.
type BlockContext interface {
	// CanTransfer returns whether the account containing
	// the given balance can transfer the given amount.
	//
	// This function is called by the EVM on SSTORE instructions
	// and should be vetted against the consensus rules.
	CanTransfer(StateDB, common.Address, *big.Int) bool
	// Transfer transfers ether from sender to recipient.
	Transfer(StateDB, common.Address, common.Address, *big.Int)
	// GetHash returns the hash of the n'th block.
	GetHash(uint64) common.Hash

	// Block information
	Coinbase() common.Address
	GasLimit() uint64
	BlockNumber() *big.Int
	Time() uint64
	Difficulty() *big.Int
	BaseFee() *big.Int
	Random() *common.Hash
}

// TxContext provides information about a transaction to the EVM.
type TxContext struct {
	// GasPrice returns the gas price of the transaction.
	GasPrice *big.Int
	// Origin returns the coinbase address of the transaction.
	Origin common.Address
	// BlobHashes contains the versioned hashes of blobs in the transactions.
	BlobHashes []common.Hash
	// BlobBaseFee returns the blob base fee of the block.
	BlobBaseFee *big.Int
}

// evmBlockContext is an implementation of BlockContext based on a given ChainContext and
// block header.
type evmBlockContext struct {
	// a real chain object
	chain ChainContext
	// the header of the block to process
	header *types.Header
	// the random value of the block to process
	// this is a separate field because it's only available post-merge
	random *common.Hash
}

// NewEVMBlockContext creates a new context for use in the EVM.
func NewEVMBlockContext(header *types.Header, chainCtx ChainContext, author *common.Address) BlockContext {
	var coinbase common.Address
	if author != nil {
		coinbase = *author
	} else if header.Coinbase != (common.Address{}) {
		coinbase = header.Coinbase
	}
	var random *common.Hash
	if header.MixDigest != (common.Hash{}) {
		random = &header.MixDigest
	}
	return &evmBlockContext{
		chain:  chainCtx,
		header: header,
		random: random,
	}
}
```
</file>

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
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// (https://github.com/ethereum/EIPs/pull/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)

	// EIP155 implements replay-protected transaction signatures.
	// (https://github.com/ethereum/EIPs/pull/155)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements state clearing for non-existent accounts.
	// (https://github.com/ethereum/EIPs/pull/158)
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork, 0 = already activated)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork, 0 = already activated)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork, 0 = already activated)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use Shanghai rules from genesis.
	ShanghaiTime        *uint64  `json:"shanghaiTime,omitempty"`        // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime          *uint64  `json:"cancunTime,omitempty"`          // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime          *uint64  `json:"pragueTime,omitempty"`          // Prague switch time (nil = no fork, 0 = already on prague)
	VerkleTime          *uint64  `json:"verkleTime,omitempty"`          // Verkle switch time (nil = no fork, 0 = already on verkle)

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// MainnetChainConfig is the chain parameters to run a node on the main network.
var MainnetChainConfig = &ChainConfig{
	ChainID:             big.NewInt(1),
	HomesteadBlock:      big.NewInt(1150000),
	DAOForkBlock:        big.NewInt(1920000),
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(2463000),
	EIP155Block:         big.NewInt(2675000),
	EIP158Block:         big.NewInt(2675000),
	ByzantiumBlock:      big.NewInt(4370000),
	ConstantinopleBlock: big.NewInt(7280000),
	PetersburgBlock:     big.NewInt(7280000),
	IstanbulBlock:       big.NewInt(9069000),
	MuirGlacierBlock:    big.NewInt(9200000),
	BerlinBlock:         big.NewInt(12244000),
	LondonBlock:         big.NewInt(12965000),
	ArrowGlacierBlock:   big.NewInt(13773000),
	GrayGlacierBlock:    big.NewInt(15050000),
	MergeNetsplitBlock:  big.NewInt(15537394),
	ShanghaiTime:        &shanghaiTime,
	CancunTime:          &cancunTime,
	PragueTime:          &pragueTime,

	TerminalTotalDifficulty:       big.NewInt(58750000000000000000000),
	TerminalTotalDifficultyPassed: true,

	Ethash: new(EthashConfig),
}

// SepoliaChainConfig contains the chain parameters for the Sepolia testnet.
var SepoliaChainConfig = &ChainConfig{
	ChainID:                 big.NewInt(11155111),
	HomesteadBlock:          big.NewInt(0),
	DAOForkBlock:            nil,
	DAOForkSupport:          true,
	EIP150Block:             big.NewInt(0),
	EIP155Block:             big.NewInt(0),
	EIP158Block:             big.NewInt(0),
	ByzantiumBlock:          big.NewInt(0),
	ConstantinopleBlock:     big.NewInt(0),
	PetersburgBlock:         big.NewInt(0),
	IstanbulBlock:           big.NewInt(0),
	MuirGlacierBlock:        big.NewInt(0),
	BerlinBlock:             big.NewInt(0),
	LondonBlock:             big.NewInt(0),
	ArrowGlacierBlock:       nil,
	GrayGlacierBlock:        nil,
	MergeNetsplitBlock:      big.NewInt(1735371),
	ShanghaiTime:            &sepoliaShanghaiTime,
	CancunTime:              &sepoliaCancunTime,
	PragueTime:              &pragueTime,
	TerminalTotalDifficulty: big.NewInt(17000000000000000),

	Ethash: new(EthashConfig),
	Clique: &CliqueConfig{
		Period: 15,
		Epoch:  200,
	},
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack frame and is used to populate
	// the CALLER opcode.
	//
	// This field is not set for deployments.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  atomic.Pointer[codeAnalysis]

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	Gas   uint64
	value *big.Int

	// Part of the EIP-2200 spec, if a contract is created with CREATE2,
	// the address of the new contract is calculated differently.
	create bool
}

// NewContract returns a new contract environment for the execution of EVM without
// creating a new contract on the stateDB.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		Gas:    gas,
		value:  value,
	}
	if caller != nil {
		c.CallerAddress = caller.Address()
	}
	return c
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/core/vm/instructions.go">
```go
// opCall is the general CALL opcode.
func opCall(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	stack := scope.Stack
	gas, to, value, inOffset, inSize, retOffset, retSize := stack.pop7()
	toAddress := common.Address(to.Bytes20())

	// Memory expansion for call arguments
	if err := interpreter.evm.makeCallMemory(scope.Memory, inOffset, inSize, retOffset, retSize); err != nil {
		return nil, err
	}
	// Get the arguments from memory
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	// Make the call
	ret, returnGas, err := interpreter.evm.Call(scope.Contract, toAddress, args, gas.Uint64(), value)

	// Push result to stack: 1 for success, 0 for failure
	if err != nil {
		stack.push(const0)
	} else {
		stack.push(const1)
	}
	// Copy return data to memory
	if err == nil {
		scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}
	scope.Contract.Gas = returnGas
	return ret, nil
}

// opDelegateCall is the DELEGATECALL opcode.
func opDelegateCall(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	stack := scope.Stack
	gas, to, inOffset, inSize, retOffset, retSize := stack.pop6()
	toAddress := common.Address(to.Bytes20())

	// Memory expansion for call arguments
	if err := interpreter.evm.makeCallMemory(scope.Memory, inOffset, inSize, retOffset, retSize); err != nil {
		return nil, err
	}
	// Get arguments from memory
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	// Perform the delegate call
	ret, returnGas, err := interpreter.evm.DelegateCall(scope.Contract, toAddress, args, gas.Uint64())

	// Push result to stack and copy return data to memory
	if err != nil {
		stack.push(const0)
	} else {
		stack.push(const1)
		scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}
	scope.Contract.Gas = returnGas
	return ret, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/core/types/transaction.go">
```go
// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // Consensus contents of a transaction
	time  time.Time // Time first seen locally

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Uint64
	from atomic.Pointer[common.Address]
}

// TxData is the underlying data of a transaction.
type TxData interface {
	// TxType returns the type of the transaction.
	TxType() byte
	// Copy returns a deep copy of the transaction data.
	Copy() TxData
	// ... (accessors for chain id, gas, price, data, etc.)
}

// Different transaction types.
const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
)

// LegacyTx is the transaction data of regular Ethereum transactions.
type LegacyTx struct {
	Nonce    uint64          // nonce of sender account
	GasPrice *big.Int        // wei per gas
	Gas      uint64          // gas limit
	To       *common.Address `rlp:"nil"` // nil means contract creation
	Value    *big.Int        // wei amount
	Data     []byte          // contract invocation input data
	V, R, S  *big.Int        // signature values
}

// AccessListTx is the transaction data of EIP-2930 access list transactions.
type AccessListTx struct {
	ChainID    *big.Int // destination chain ID
	Nonce      uint64
	GasPrice   *big.Int
	Gas        uint64
	To         *common.Address `rlp:"nil"`
	Value      *big.Int
	Data       []byte
	AccessList AccessList
	V, R, S    *big.Int
}

// DynamicFeeTx is the transaction data of EIP-1559 transactions.
type DynamicFeeTx struct {
	ChainID    *big.Int
	Nonce      uint64
	GasTipCap  *big.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *big.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         *common.Address `rlp:"nil"`
	Value      *big.Int
	Data       []byte
	AccessList AccessList
	V, R, S    *big.Int
}

// BlobTx is the transaction data of EIP-4844 transactions.
type BlobTx struct {
	ChainID       *big.Int
	Nonce         uint64
	GasTipCap     *big.Int
	GasFeeCap     *big.Int
	Gas           uint64
	To            common.Address
	Value         *big.Int
	Data          []byte
	AccessList    AccessList
	BlobFeeCap    *big.Int
	BlobHashes    []common.Hash
	V, R, S       *big.Int
	sidecar       *BlobTxSidecar `rlp:"-"` // Non-consensus field.
	yParity       *big.Int       `rlp:"-"` // Lazily computed, will be populated if not present.
	blobGas       *uint64        `rlp:"-"`
	blobGasFeeCap *big.Int       `rlp:"-"`
}

// AsMessage returns the transaction as a core.Message.
//
// AsMessage requires a signer to derive the sender.
func (tx *Transaction) AsMessage(s Signer, baseFee *big.Int) (Message, error) {
	msg, err := tx.asMessage(s)
	if err != nil {
		return nil, err
	}
	msg.SetGasFee(baseFee)
	return msg, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/core/state_processor.go">
```go
// StateProcessor is a basic Processor, which takes care of transitioning
// state from one point to another.
//
// StateProcessor implements Processor.
type StateProcessor struct {
	config *params.ChainConfig // Chain configuration options
	bc     ChainContext        // Canonical block chain
	engine consensus.Engine    // Consensus engine
}

// NewStateProcessor initialises a new state processor.
func NewStateProcessor(config *params.ChainConfig, bc ChainContext, engine consensus.Engine) *StateProcessor {
	return &StateProcessor{
		config: config,
		bc:     bc,
		engine: engine,
	}
}

// Process processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb and applying any rewards to both
// the processor (coinbase) and any included uncles.
//
// Process returns the receipts and logs accumulated during the process and
// returns the amount of gas that was used in the process. If any of the
// transactions failed to execute due to insufficient gas it will return an error.
func (p *StateProcessor) Process(block *types.Block, statedb *state.StateDB, cfg vm.Config) (*ProcessResult, error) {
	var (
		receipts    types.Receipts
		usedGas     = new(uint64)
		header      = block.Header()
		blockNumber = header.Number
		allLogs     []*types.Log
		gp          = new(GasPool).AddGas(header.GasLimit)
		requests    [][]byte
	)
	// Create a new EVM context and environments
	var (
		author *common.Address
		// If the author is not specified, it will be loaded from the header.
		blockCtx = NewEVMBlockContext(header, p.bc, author)
	)
	for i, tx := range block.Transactions() {
		statedb.SetTxContext(tx.Hash(), i)

		msg, err := tx.AsMessage(types.MakeSigner(p.config, blockNumber, header.Time), header.BaseFee)
		if err != nil {
			return nil, fmt.Errorf("could not apply transaction %d [%v]: %w", i, tx.Hash(), err)
		}
		// Create a new EVM context for the transaction.
		txCtx := NewEVMTxContext(msg)

		evm := NewEVM(blockCtx, txCtx, statedb, p.config, cfg)
		// ...
	}
	// ...
}
```
</file>

## Prompt Corrections

The original prompt describes a well-structured modular system in Zig. The concepts map cleanly to go-ethereum's design, although the implementation details differ. Here are a few observations:

1.  **`ExecutionContext` Granularity**: In the prompt, `ExecutionContext` seems to be a single, monolithic object that is cloned and modified. In go-ethereum, this context is split between `vm.EVM` (which holds block, transaction, and chain config context) and `vm.Contract` (which holds the context for a specific call, like code, input, caller, and value). This separation might be a useful pattern to consider.

2.  **Context Creation**: The prompt proposes a `ContextFactory`. In go-ethereum, `core.NewEVM` acts as the primary factory. It's called at the start of a transaction processing loop (`StateProcessor.Process`) and also recursively within opcodes like `opCall` to create child execution contexts. This shows a real-world application of how contexts are created and nested.

3.  **L2-Specific Contexts**: The prompt's `BlockContext` union with variants for Optimism, Arbitrum, etc., is a good design. While go-ethereum's `vm.BlockContext` is an interface, different L2s (like Optimism's bedrock) provide their own implementations of this interface to introduce L2-specific fields and logic (e.g., L1 block info), validating the prompt's design choice.

4.  **Runtime Switching and Inheritance**: The `switch_context_for_call` and `apply_inheritance` concepts are well-represented in how go-ethereum's `opCall` and `opDelegateCall` work. `opCall` creates a new, distinct child context, whereas `opDelegateCall` creates a child context that inherits the caller and value from its parent, perfectly matching the "inheritance" idea. The code snippets for these opcodes will be highly valuable.

---

No response received

---

No response received

---

No response received

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on a given state with
// a given context. It should be noted that the EVM is not thread safe.
type EVM struct {
	// BlockContext provides information about the current block.
	BlockContext
	// TxContext provides information about the current transaction.
	TxContext
	// StateDB provides access to the world state.
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain provides access to required blockchain info
	chain ChainContext
	// vmConfig contains configuration options for the EVM
	vmConfig Config
	// interpreter is the contract interpreter
	interpreter *Interpreter
	// gas is the amount of gas available for the current execution
	gas uint64
	// usedGas is the amount of gas used in the current execution
	usedGas uint64
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		chainConfig:  chainConfig,
		vmConfig:     vmConfig,
	}

	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// BlockContext provides the EVM with information about the current block.
type BlockContext struct {
	// CanTransfer returns whether the account has enough cash for the given transfer.
	CanTransfer CanTransferFunc
	// Transfer transfers cash from sender to recipient, creating the recipient
	// account if it does not already exist.
	Transfer TransferFunc
	// GetHash returns the hash of a block by its number.
	GetHash GetHashFunc

	// Block information
	Coinbase    common.Address // Provides information for the COINBASE instruction.
	GasLimit    uint64         // Provides information for the GASLIMIT instruction.
	BlockNumber *big.Int       // Provides information for the NUMBER instruction.
	Time        uint64         // Provides information for the TIMESTAMP instruction.
	Difficulty  *big.Int       // Provides information for the DIFFICULTY instruction (and the PREVRANDAO instruction post-merge).
	BaseFee     *big.Int       // Provides information for the BASEFEE instruction (EIP-1559).
	BlobBaseFee *big.Int       // Provides information for the BLOBBASEFEE instruction (EIP-4844).
	BlobHashes  []common.Hash  // Provides information for the BLOBHASH instruction (EIP-4844).
}

// TxContext provides the EVM with information about the current transaction.
type TxContext struct {
	// For most use cases, there is no need to set these fields. Methods on the
	// StateDB are used by default.
	//
	// In some cases, they can be used to provide information that is not yet
	// part of the state tree. For example, when executing a pending transaction.
	Origin      common.Address // Provides information for the ORIGIN instruction.
	GasPrice    *big.Int       // Provides information for the GASPRICE instruction.
	BlobHashes  []common.Hash  // Versioned hashes for blob transactions
	BlobFeeCap  *big.Int       // Fee cap for blob gas (EIP-4844)
	WarmedAddrs []common.Address
	WarmedSlots []types.WarmSlot
}

// Call executes the contract associated with the destination address. It is up to the caller to
// decide whether the created contract should be committed to the state or not in case of an
// error.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.vmConfig.NoRecursion && evm.depth > 0 {
		return nil, gas, nil
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context().CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	// Even though we have expressed our intent to transfer the value, we must not actually
	// do it here, since it is possible that the callee is a precompile and might abort.
	// In that case, we would have to revert. This is way too much hassle.
	//
	// Instead, we do it *after* we have determined that the callee is not a precompile.
	if evm.vmConfig.IsEIP2929(evm.BlockNumber) {
		evm.StateDB.AddAddressToAccessList(addr)
	}
	if p := evm.precompile(addr); p != nil {
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// So, it's a regular contract. Now, we can safely do the value transfer.
		evm.StateDB.Transfer(caller.Address(), to.Address(), value)

		code := evm.StateDB.GetCode(to.Address())
		if len(code) == 0 {
			// According to EIP-211, if a call is made to an account that does not exist or that is empty
			// (as defined by EIP-161) then the call must not fail, and the return data of the call must be empty.
			// The only exception is when the call is a value transfer. In that case, the call must fail with
			// an out-of-gas error.
			if value.Sign() > 0 {
				err = ErrInsufficientBalance
			}
			ret, gas, err = nil, gas, err
		} else {
			// Initialise a new contract and set the code that is to be used by the EVM.
			// The contract is a scoped environment for this execution context only.
			contract := NewContract(caller, to, value, gas)
			contract.Code = code
			contract.Input = input

			ret, gas, err = evm.interpreter.Run(contract, input, false)
		}
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			// In case of a revert, we want to restore the gas to the state before
			// the call, and charge the cost of the call.
			// In other cases, we want to leave the gas as it is, so the caller can
			// deal with it.
			leftOverGas = gas
		}
	}
	return ret, leftOverGas, err
}
// DelegateCall executes the contract associated with the destination address with the call
// frame of the calling contract.
func (evm *EVM) DelegateCall(caller ContractRef, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if evm.vmConfig.IsEIP2929(evm.BlockNumber) {
		evm.StateDB.AddAddressToAccessList(addr)
	}
	if p := evm.precompile(to.Address()); p != nil {
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	} else {
		contract := NewContract(caller, to, nil, gas)
		contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(to.Address()), evm.StateDB.GetCode(to.Address()))
		contract.Input = input

		ret, gas, err = evm.interpreter.Run(contract, input, false)
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			leftOverGas = gas
		}
	}
	return ret, leftOverGas, err
}

// StaticCall executes the contract associated with the destination address with the call
// frame of the calling contract, but will not change the state.
func (evm *EVM) StaticCall(caller ContractRef, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Make sure the interpreter iscarbons to readonly
	evm.interpreter.readOnly = true
	defer func() { evm.interpreter.readOnly = false }()

	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	// Since the state is readonly, there's no need to commit or revert a snapshot
	// call needs to be made.
	// In cases of a CREATE, the contract address passed is the parent contract
	// and the readOnly flag needs to be set, so it's fine to just set the flag
	// and call the regular Call method
	if evm.vmConfig.IsEIP2929(evm.BlockNumber) {
		evm.StateDB.AddAddressToAccessList(addr)
	}
	if p := evm.precompile(to.Address()); p != nil {
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the
		// EVM. The contract is a scoped environment for this execution context
		// only.
		contract := NewContract(caller, to, nil, gas)
		contract.Code = evm.StateDB.GetCode(to.Address())
		contract.Input = input

		ret, gas, err = evm.interpreter.Run(contract, input, true)
	}

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			leftOverGas = gas
		}
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used as a pointer to the caller's account.
type AccountRef common.Address

// Address returns the address of the contract
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of address(this) and is often used in private
	// contracts to guard access.
	CallerAddress common.Address
	// caller is a reference to the calling account. However, if the call is a
	// delegatecall, the caller will be the previous caller and not the
	// original account (for DELEGATECALL all other parameters are inherited).
	caller ContractRef
	// self is the executing contract's address
	self ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // JUMPDEST analysis of the code running in the current context

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *big.Int
	Gas   uint64

	// Sane indicates whether the contract is well-formed according to the EVM spec.
	// There are two cases where it may be false:
	// - the final opcode is not a STOP or RETURN
	// - a PUSH outside the code bounds
	Sane bool

	// Schain indicates whether the contract was validated against Shanghai rules.
	Schain bool
}

// NewContract returns a new contract environment for the execution of EVM without
// creating a new origin account.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, value: value, Gas: gas}

	// We're not checking for `caller` reference types because we want to allow
	// any type to be used as a caller to the contract.
	return c
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
// It is used to create a new contract for the delegatecall opcode.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: caller must be explicitly set by the calling opcode
	c.self = c.caller
	return c
}

// GetOp returns the n'th element in the contract's byte array
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
// StateTransition a state transition object
type StateTransition struct {
	gp         *GasPool
	msg        Message
	gas        uint64
	gasPrice   *big.Int
	initialGas uint64
	value      *big.Int
	data       []byte
	state      StateDB
	evm        *EVM
}

// ApplyMessage computes the new state by applying the given message
// against the old state.
func ApplyMessage(evm *EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// NewStateTransition initialises and returns a new state transition object.
func NewStateTransition(evm *EVM, msg Message, gp *GasPool) *StateTransition {
	return &StateTransition{
		gp:         gp,
		msg:        msg,
		gas:        msg.Gas(),
		gasPrice:   msg.GasPrice(),
		initialGas: msg.Gas(),
		value:      msg.Value(),
		data:       msg.Data(),
		state:      evm.StateDB,
		evm:        evm,
	}
}

// TransitionDb will transition the state by applying the current message and
// returning the result including the used gas. It returns an error if failed.
// An error indicates a consensus issue.
func (st *StateTransition) TransitionDb() (*ExecutionResult, error) {
	// ... (intrinsic gas calculation and pre-checks)

	// Transfer funds from sender to receiver, creating the receiver if needed
	st.state.Transfer(st.msg.From(), st.msg.To(), st.value)

	// Execute the message, either as a contract call or as a creation
	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not returned
	)
	if st.msg.To() == nil {
		ret, _, st.gas, vmerr = st.evm.Create(st.msg.From(), st.data, st.gas, st.value)
	} else {
		ret, st.gas, vmerr = st.evm.Call(st.msg.From(), st.msg.To(), st.data, st.gas, st.value)
	}

	// ... (gas refund and finalization)

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/instructions.go">
```go
func opCreate(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// ... (gas calculation and stack popping) ...
	gas := scope.Stack.pop()
	offset, size := scope.Stack.pop(), scope.Stack.pop()
	value := scope.Stack.pop()

	// ...

	// an expanding memory need to be paid
	if err := scope.Memory.Resize(offset.Uint64() + size.Uint64()); err != nil {
		return nil, err
	}
	// The call starts with a specified amount of gas. The gas passed to the
	// create function has been paid for in the previous step.
	//
	// EIP-150: The gas passed to the sub-call must be no more than 63/64 of the
	// currently available gas.
	callGas, err := interpreter.callGas(scope.Gas)
	if err != nil {
		return nil, err
	}
	// Call Create.
	addr, _, leftOverGas, err := interpreter.evm.Create(scope.Contract.Caller(), scope.Memory.GetPtr(offset.Uint64(), size.Uint64()), callGas, value.ToBig())

	// ... (handle result) ...
	return nil, nil
}

func opCall(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// ... (gas calculation and stack popping) ...
	gas, to, value, inOffset, inSize, retOffset, retSize := scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop()
	
	// ...

	// Get the arguments from the memory.
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	callGas, err := interpreter.callGas(scope.Gas)
	if err != nil {
		return nil, err
	}

	// Call the contract.
	ret, leftOverGas, err := interpreter.evm.Call(scope.Contract, common.Address(to.Bytes20()), args, callGas, value.ToBig())

	// ... (handle result) ...
	return nil, nil
}

func opDelegateCall(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// ... (stack popping) ...
	gas, to, inOffset, inSize, retOffset, retSize := scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop()

	// ...

	// Get arguments from the memory
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	callGas, err := interpreter.callGas(scope.Gas)
	if err != nil {
		return nil, err
	}
	// Call the contract.
	ret, leftOverGas, err := interpreter.evm.DelegateCall(scope.Contract, common.Address(to.Bytes20()), args, callGas)

	// ... (handle result) ...
	return nil, nil
}

func opStaticCall(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	// ... (stack popping) ...
	gas, to, inOffset, inSize, retOffset, retSize := scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop(), scope.Stack.pop()

	// ...

	// Get arguments from the memory
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	callGas, err := interpreter.callGas(scope.Gas)
	if err != nil {
		return nil, err
	}
	// Call the contract.
	ret, leftOverGas, err := interpreter.evm.StaticCall(scope.Contract, common.Address(to.Bytes20()), args, callGas)

	// ... (handle result) ...
	return nil, nil
}

func opCoinbase(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	scope.Stack.push(new(uint256.Int).SetBytes(interpreter.evm.Coinbase.Bytes()))
	return nil, nil
}

func opTimestamp(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	scope.Stack.push(new(uint256.Int).SetUint64(interpreter.evm.Time))
	return nil, nil
}

func opBlockNumber(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	scope.Stack.push(new(uint256.Int).Set(interpreter.evm.BlockNumber))
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/config.go">
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

	// EIP150 implements the Gas price changes for IO-heavy operations (EIP-150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients)

	// EIP155 implements Simple replay attack protection (EIP-155)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements Spurious Dragon gas repricing and state clearing (EIP-158)
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on arrowglacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on grayglacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplitBlock switch block (nil = no fork, 0 = already on merge)
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// Shanghai switch time (nil = no fork, 0 = already on shanghai)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch time (nil = no fork, 0 = already on cancun)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch time (nil = no fork, 0 = already on prague)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty for the merge fork.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`

	// EIP-4844 parameters
	BlobScheduleConfig *BlobScheduleConfig `json:"blobSchedule,omitempty"`

	// EIP-2935 parameters
	ParentBlockHashHistory int `json:"parentBlockHashHistory,omitempty"`

	// EIP-7702 parameters
	Auth *AuRAConfig `json:"auth,omitempty"`
}

// MainnetChainConfig is the chain parameters to run a node on the main network.
var MainnetChainConfig = &ChainConfig{
	ChainID:             mainnetChainID,
	HomesteadBlock:      big.NewInt(1150000),
	DAOForkBlock:        big.NewInt(1920000),
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(2463000),
	EIP150Hash:          common.HexToHash("0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0"),
	EIP155Block:         big.NewInt(2675000),
	EIP158Block:         big.NewInt(2675000),
	ByzantiumBlock:      big.NewInt(4370000),
	ConstantinopleBlock: big.NewInt(7280000),
	PetersburgBlock:     big.NewInt(7280000),
	IstanbulBlock:       big.NewInt(9069000),
	MuirGlacierBlock:    big.NewInt(9200000),
	BerlinBlock:         big.NewInt(12244000),
	LondonBlock:         big.NewInt(12965000),
	ArrowGlacierBlock:   big.NewInt(13773000),
	GrayGlacierBlock:    big.NewInt(15050000),
	MergeNetsplitBlock:  big.NewInt(15537394),
	ShanghaiTime:        &mainnetShanghaiTime,
	CancunTime:          &mainnetCancunTime,
	PragueTime:          &mainnetPragueTime,
	// OsakaTime:                  &mainnetOsakaTime,

	TerminalTotalDifficulty:       mainnetTTD,
	TerminalTotalDifficultyPassed: true,

	Ethash: new(EthashConfig),
	BlobScheduleConfig: &BlobScheduleConfig{
		Cancun: DefaultCancunBlobConfig,
	},
}

// TestChainConfig is a chain config to be used for testing purposes.
var TestChainConfig = &ChainConfig{
	ChainID:             big.NewInt(1),
	HomesteadBlock:      big.NewInt(0),
	DAOForkBlock:        nil,
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(0),
	EIP155Block:         big.NewInt(0),
	EIP158Block:         big.NewInt(0),
	ByzantiumBlock:      big.NewInt(0),
	ConstantinopleBlock: big.NewInt(0),
	PetersburgBlock:     big.NewInt(0),
	IstanbulBlock:       big.NewInt(0),
	MuirGlacierBlock:    big.NewInt(0),
	BerlinBlock:         big.NewInt(0),
	LondonBlock:         big.NewInt(0),
	ArrowGlacierBlock:   big.NewInt(0),
	GrayGlacierBlock:    big.NewInt(0),
	MergeNetsplitBlock:  big.NewInt(0),
	ShanghaiTime:        uint64ptr(0),
	CancunTime:          uint64ptr(0),
	PragueTime:          uint64ptr(0),
	// OsakaTime:                  uint64ptr(0),
	Ethash: new(EthashConfig),
	BlobScheduleConfig: &BlobScheduleConfig{
		Cancun: DefaultCancunBlobConfig,
	},
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/transaction.go">
```go
// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // Consensus contents of a transaction
	time  time.Time // Time first seen locally (for viewing/sorting)

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Pointer[uint64]
	from atomic.Pointer[common.Address]
}

// TxData is the underlying data of a transaction.
//
// This is a private interface, and the inner type will become public in the future.
type TxData interface {
	// TODO: embed mustImplemenetTxData once all tx types are migrated.

	// TxType returns the transaction type.
	TxType() byte
	// Copy returns a deep copy of the transaction data.
	Copy() TxData
	// accessors for inner fields
	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasPrice() *big.Int
	gasTipCap() *big.Int
	gasFeeCap() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address
	// blob accessors
	blobGas() uint64
	blobGasFeeCap() *big.Int
	blobHashes() []common.Hash
	// authorization list accessors
	authorizationList() []SetCodeAuthorization

	// signature values
	v() *big.Int
	r() *big.Int
	s() *big.Int
	rawSignatureValues() (v, r, s *big.Int)

	setV(v *big.Int)
	setR(r *big.Int)
	setS(s *big.Int)
	setSignatureValues(v, r, s *big.Int)

	// for sorting
	effectiveGasTip(baseFee *big.Int) (*big.Int, error)
	effectiveGasPrice(baseFee *big.Int) *big.Int
	rawGasFeeCap() *big.Int
	rawGasTipCap() *big.Int
}

// LegacyTx is the transaction data of regular Ethereum transactions.
type LegacyTx struct {
	Nonce    uint64
	GasPrice *big.Int
	Gas      uint64
	To       *common.Address `rlp:"nil"` // nil means contract creation
	Value    *big.Int
	Data     []byte
	V, R, S  *big.Int // Signature values
}

// AccessListTx is the data of EIP-2930 access list transactions.
type AccessListTx struct {
	ChainID    *big.Int
	Nonce      uint64
	GasPrice   *big.Int
	Gas        uint64
	To         *common.Address `rlp:"nil"` // nil means contract creation
	Value      *big.Int
	Data       []byte
	AccessList AccessList
	V, R, S    *big.Int // Signature values
}

// DynamicFeeTx is the data of EIP-1559 transactions.
type DynamicFeeTx struct {
	ChainID    *big.Int
	Nonce      uint64
	GasTipCap  *big.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *big.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         *common.Address `rlp:"nil"` // nil means contract creation
	Value      *big.Int
	Data       []byte
	AccessList AccessList
	V, R, S    *big.Int // Signature values
}

// BlobTx is the data of EIP-4844 transactions.
type BlobTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList

	BlobFeeCap *uint256.Int // a.k.a. maxFeePerBlobGas
	BlobHashes []common.Hash

	V, R, S *uint256.Int // Signature values

	// This is a cached sidecar. The sidecar is not part of the RLP encoding of the
	// transaction itself, but is sent alongside it in a separate gossip message.
	sidecar atomic.Pointer[BlobTxSidecar]
}

// SetCodeTx is the data of EIP-7702 transactions.
type SetCodeTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList

	// EOA-related fields
	AuthList []SetCodeAuthorization

	V, R, S *uint256.Int // Signature values
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt's `ExecutionContext.get_gas_price` method has a simplified gas calculation for EIP-1559 transactions. The `go-ethereum` implementation uses `maxFeePerGas` as a cap on the total fee (`baseFee + priorityFee`). This is a crucial detail for correctness.

The prompt also defines `ConfigurationContext` and `ContextManager.ContextConfig` as separate entities that both contain hardfork/chain information. In `go-ethereum`, this is unified under `params.ChainConfig` for protocol rules and `vm.Config` for execution-time settings (like tracing). A cleaner design might merge these two into a single configuration source.

The concept of a `ContextManager` that caches entire `ExecutionContext` objects is novel. `go-ethereum`'s performance optimizations focus on caching state tries (`StateDB`) and compiled contracts (`analysis`), since the execution context itself is lightweight and highly dynamic. Caching full execution contexts might be inefficient due to their stateful nature (e.g., gas used, call depth). The implementation should consider if caching the configuration/setup parts is more effective than caching the entire stateful context.

---

No response received

