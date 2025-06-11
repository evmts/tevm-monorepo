# Implement Fuzzing Infrastructure

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_fuzzing_infrastructure` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_fuzzing_infrastructure feat_implement_fuzzing_infrastructure`
3. **Work in isolation**: `cd g/feat_implement_fuzzing_infrastructure`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive fuzzing infrastructure to automatically discover edge cases, security vulnerabilities, and correctness issues in the EVM implementation. This includes bytecode fuzzing, transaction fuzzing, state fuzzing, and gas fuzzing with intelligent generation strategies and crash analysis capabilities.

## ELI5

Imagine having a thousand monkeys randomly pressing buttons on a complex machine to see if they can break it - that's essentially what fuzzing does for software. It automatically generates millions of random and semi-random inputs to stress-test our EVM, like feeding it weird bytecode, unusual transactions, or extreme parameter values that a human tester might never think to try. When the fuzzer finds an input that crashes the system or produces unexpected behavior, it saves that "recipe for chaos" so we can fix the bug and make our EVM more robust against both accidental mistakes and malicious attacks.

## Fuzzing Strategies

### Core Fuzzing Approaches

#### 1. Bytecode Fuzzing
```zig
pub const BytecodeFuzzer = struct {
    allocator: std.mem.Allocator,
    rng: std.rand.Random,
    config: BytecodeFuzzConfig,
    
    pub const BytecodeFuzzConfig = struct {
        max_bytecode_size: u32,
        min_bytecode_size: u32,
        opcode_weights: std.HashMap(u8, f32, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
        invalid_opcode_probability: f32,
        jump_target_corruption_rate: f32,
        stack_operation_bias: f32,
        
        pub fn default() BytecodeFuzzConfig {
            return BytecodeFuzzConfig{
                .max_bytecode_size = 1024 * 24, // 24KB limit
                .min_bytecode_size = 1,
                .opcode_weights = std.HashMap(u8, f32, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage).init(allocator),
                .invalid_opcode_probability = 0.1,
                .jump_target_corruption_rate = 0.05,
                .stack_operation_bias = 0.3,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, seed: u64, config: BytecodeFuzzConfig) BytecodeFuzzer {
        var prng = std.rand.DefaultPrng.init(seed);
        return BytecodeFuzzer{
            .allocator = allocator,
            .rng = prng.random(),
            .config = config,
        };
    }
    
    pub fn generate_bytecode(self: *BytecodeFuzzer) ![]u8 {
        const size = self.rng.intRangeAtMost(u32, self.config.min_bytecode_size, self.config.max_bytecode_size);
        var bytecode = try self.allocator.alloc(u8, size);
        
        var pos: u32 = 0;
        while (pos < size) {
            const opcode = self.select_weighted_opcode();
            bytecode[pos] = opcode;
            pos += 1;
            
            // Handle opcodes that require immediate data
            const immediate_bytes = self.get_immediate_bytes(opcode);
            if (immediate_bytes > 0 and pos + immediate_bytes <= size) {
                // Generate immediate data
                for (0..immediate_bytes) |i| {
                    bytecode[pos + i] = self.rng.int(u8);
                }
                pos += immediate_bytes;
            }
        }
        
        // Post-process to add valid JUMPDEST targets sometimes
        try self.add_jump_destinations(bytecode);
        
        return bytecode;
    }
    
    fn select_weighted_opcode(self: *BytecodeFuzzer) u8 {
        // Use weighted selection based on opcode frequency
        if (self.rng.float(f32) < self.config.invalid_opcode_probability) {
            // Generate invalid opcode
            var opcode: u8 = undefined;
            while (true) {
                opcode = self.rng.int(u8);
                if (!self.is_valid_opcode(opcode)) break;
            }
            return opcode;
        }
        
        // Select from valid opcodes with weights
        const weights = [_]f32{
            0.1,  // STOP (0x00)
            0.8,  // ADD (0x01)
            0.8,  // MUL (0x02)
            0.8,  // SUB (0x03)
            0.5,  // DIV (0x04)
            0.3,  // SDIV (0x05)
            0.5,  // MOD (0x06)
            0.3,  // SMOD (0x07)
            0.5,  // ADDMOD (0x08)
            0.5,  // MULMOD (0x09)
            0.3,  // EXP (0x0A)
            0.2,  // SIGNEXTEND (0x0B)
            // ... continue for all opcodes
        };
        
        const total_weight = 100.0;
        const random_weight = self.rng.float(f32) * total_weight;
        
        var cumulative_weight: f32 = 0;
        for (weights, 0..) |weight, i| {
            cumulative_weight += weight;
            if (random_weight <= cumulative_weight) {
                return @as(u8, @intCast(i));
            }
        }
        
        return 0x00; // STOP as fallback
    }
    
    fn get_immediate_bytes(self: *BytecodeFuzzer, opcode: u8) u32 {
        _ = self;
        return switch (opcode) {
            0x60...0x7F => opcode - 0x5F, // PUSH1-PUSH32
            else => 0,
        };
    }
    
    fn add_jump_destinations(self: *BytecodeFuzzer, bytecode: []u8) !void {
        // Find JUMP and JUMPI instructions and potentially add JUMPDEST targets
        for (bytecode, 0..) |byte, i| {
            if (byte == 0x56 or byte == 0x57) { // JUMP or JUMPI
                if (self.rng.float(f32) < 1.0 - self.config.jump_target_corruption_rate) {
                    // Add a valid JUMPDEST somewhere in the bytecode
                    const target_pos = self.rng.intRangeAtMost(usize, 0, bytecode.len - 1);
                    if (self.is_valid_jump_target_position(bytecode, target_pos)) {
                        bytecode[target_pos] = 0x5B; // JUMPDEST
                    }
                }
            }
        }
    }
    
    fn is_valid_opcode(self: *BytecodeFuzzer, opcode: u8) bool {
        _ = self;
        return switch (opcode) {
            0x00...0x0B, 0x10...0x1D, 0x20, 0x30...0x3F, 0x40...0x4A, 0x50...0x5E,
            0x5F...0x8F, 0x90...0x9F, 0xA0...0xA4, 0xF0...0xF5, 0xFA, 0xFD...0xFF => true,
            else => false,
        };
    }
    
    fn is_valid_jump_target_position(self: *BytecodeFuzzer, bytecode: []const u8, pos: usize) bool {
        _ = self;
        // Check if position is not inside PUSH immediate data
        var i: usize = 0;
        while (i < pos) {
            const opcode = bytecode[i];
            if (opcode >= 0x60 and opcode <= 0x7F) { // PUSH1-PUSH32
                const push_size = opcode - 0x5F;
                i += 1 + push_size;
                if (pos < i) return false; // Inside PUSH data
            } else {
                i += 1;
            }
        }
        return true;
    }
};
```

#### 2. Transaction Fuzzing
```zig
pub const TransactionFuzzer = struct {
    allocator: std.mem.Allocator,
    rng: std.rand.Random,
    config: TransactionFuzzConfig,
    
    pub const TransactionFuzzConfig = struct {
        max_gas_limit: u64,
        max_value: U256,
        max_data_size: u32,
        address_pool_size: u32,
        invalid_signature_rate: f32,
        edge_case_bias: f32,
        
        pub fn default() TransactionFuzzConfig {
            return TransactionFuzzConfig{
                .max_gas_limit = 30_000_000,
                .max_value = U256.from_u64(std.math.maxInt(u64)),
                .max_data_size = 1024 * 1024, // 1MB
                .address_pool_size = 1000,
                .invalid_signature_rate = 0.1,
                .edge_case_bias = 0.2,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, seed: u64, config: TransactionFuzzConfig) TransactionFuzzer {
        var prng = std.rand.DefaultPrng.init(seed);
        return TransactionFuzzer{
            .allocator = allocator,
            .rng = prng.random(),
            .config = config,
        };
    }
    
    pub fn generate_transaction(self: *TransactionFuzzer) !FuzzTransaction {
        return FuzzTransaction{
            .from = self.generate_address(),
            .to = if (self.rng.boolean()) self.generate_address() else null,
            .value = self.generate_value(),
            .gas_limit = self.generate_gas_limit(),
            .gas_price = self.generate_gas_price(),
            .max_fee_per_gas = if (self.rng.boolean()) self.generate_gas_price() else null,
            .max_priority_fee_per_gas = if (self.rng.boolean()) self.generate_gas_price() else null,
            .data = try self.generate_call_data(),
            .nonce = self.generate_nonce(),
            .chain_id = self.generate_chain_id(),
            .access_list = if (self.rng.boolean()) try self.generate_access_list() else null,
            .blob_versioned_hashes = if (self.rng.boolean()) try self.generate_blob_hashes() else null,
            .max_fee_per_blob_gas = if (self.rng.boolean()) self.generate_gas_price() else null,
        };
    }
    
    fn generate_address(self: *TransactionFuzzer) Address {
        var addr: Address = undefined;
        self.rng.bytes(&addr.bytes);
        return addr;
    }
    
    fn generate_value(self: *TransactionFuzzer) U256 {
        if (self.rng.float(f32) < self.config.edge_case_bias) {
            // Generate edge case values
            return switch (self.rng.intRangeAtMost(u8, 0, 4)) {
                0 => 0, // Zero value
                1 => 1, // Minimum value
                2 => U256.max_value(), // Maximum value
                3 => U256.from_u64(1000000000000000000), // 1 ETH in wei
                else => U256.from_u64(self.rng.int(u64)),
            };
        }
        
        return U256.from_u64(self.rng.intRangeAtMost(u64, 0, std.math.maxInt(u64)));
    }
    
    fn generate_gas_limit(self: *TransactionFuzzer) u64 {
        if (self.rng.float(f32) < self.config.edge_case_bias) {
            return switch (self.rng.intRangeAtMost(u8, 0, 4)) {
                0 => 0, // Invalid gas limit
                1 => 21000, // Minimum for basic transaction
                2 => self.config.max_gas_limit, // Maximum gas
                3 => self.config.max_gas_limit + 1, // Over limit
                else => self.rng.intRangeAtMost(u64, 21000, 100000),
            };
        }
        
        return self.rng.intRangeAtMost(u64, 21000, self.config.max_gas_limit);
    }
    
    fn generate_gas_price(self: *TransactionFuzzer) u64 {
        if (self.rng.float(f32) < self.config.edge_case_bias) {
            return switch (self.rng.intRangeAtMost(u8, 0, 3)) {
                0 => 0, // Zero gas price
                1 => 1, // Minimum gas price
                2 => std.math.maxInt(u64), // Maximum gas price
                else => self.rng.intRangeAtMost(u64, 1000000000, 100000000000), // 1-100 Gwei
            };
        }
        
        return self.rng.intRangeAtMost(u64, 1000000000, 100000000000); // 1-100 Gwei
    }
    
    fn generate_call_data(self: *TransactionFuzzer) ![]u8 {
        const size = if (self.rng.float(f32) < self.config.edge_case_bias)
            switch (self.rng.intRangeAtMost(u8, 0, 3)) {
                0 => 0, // Empty data
                1 => 4, // Just function selector
                2 => self.config.max_data_size, // Maximum size
                else => self.rng.intRangeAtMost(u32, 0, 1024),
            }
        else
            self.rng.intRangeAtMost(u32, 0, self.config.max_data_size);
        
        var data = try self.allocator.alloc(u8, size);
        self.rng.bytes(data);
        
        return data;
    }
    
    fn generate_nonce(self: *TransactionFuzzer) u64 {
        if (self.rng.float(f32) < self.config.edge_case_bias) {
            return switch (self.rng.intRangeAtMost(u8, 0, 2)) {
                0 => 0, // Starting nonce
                1 => std.math.maxInt(u64), // Maximum nonce
                else => self.rng.int(u64),
            };
        }
        
        return self.rng.intRangeAtMost(u64, 0, 1000000);
    }
    
    fn generate_chain_id(self: *TransactionFuzzer) u64 {
        const common_chains = [_]u64{ 1, 10, 42161, 137, 8453, 11155111 };
        
        if (self.rng.float(f32) < 0.8) {
            return common_chains[self.rng.intRangeAtMost(usize, 0, common_chains.len - 1)];
        }
        
        return self.rng.int(u64);
    }
    
    fn generate_access_list(self: *TransactionFuzzer) ![]AccessListEntry {
        const num_entries = self.rng.intRangeAtMost(u8, 1, 10);
        var access_list = try self.allocator.alloc(AccessListEntry, num_entries);
        
        for (access_list) |*entry| {
            entry.address = self.generate_address();
            
            const num_keys = self.rng.intRangeAtMost(u8, 0, 5);
            entry.storage_keys = try self.allocator.alloc(U256, num_keys);
            
            for (entry.storage_keys) |*key| {
                key.* = U256.from_u64(self.rng.int(u64));
            }
        }
        
        return access_list;
    }
    
    fn generate_blob_hashes(self: *TransactionFuzzer) ![]U256 {
        const num_blobs = self.rng.intRangeAtMost(u8, 1, 6); // Max 6 blobs per tx
        var hashes = try self.allocator.alloc(U256, num_blobs);
        
        for (hashes) |*hash| {
            hash.* = U256.from_u64(self.rng.int(u64));
        }
        
        return hashes;
    }
};

pub const FuzzTransaction = struct {
    from: Address,
    to: ?Address,
    value: U256,
    gas_limit: u64,
    gas_price: u64,
    max_fee_per_gas: ?u64,
    max_priority_fee_per_gas: ?u64,
    data: []u8,
    nonce: u64,
    chain_id: u64,
    access_list: ?[]AccessListEntry,
    blob_versioned_hashes: ?[]U256,
    max_fee_per_blob_gas: ?u64,
};

pub const AccessListEntry = struct {
    address: Address,
    storage_keys: []U256,
};
```

#### 3. State Fuzzing
```zig
pub const StateFuzzer = struct {
    allocator: std.mem.Allocator,
    rng: std.rand.Random,
    config: StateFuzzConfig,
    
    pub const StateFuzzConfig = struct {
        max_accounts: u32,
        max_storage_slots_per_account: u32,
        max_code_size: u32,
        balance_distribution: BalanceDistribution,
        code_complexity_bias: f32,
        
        pub const BalanceDistribution = enum {
            Uniform,
            PowerLaw,
            EdgeCases,
        };
        
        pub fn default() StateFuzzConfig {
            return StateFuzzConfig{
                .max_accounts = 1000,
                .max_storage_slots_per_account = 100,
                .max_code_size = 24 * 1024, // 24KB
                .balance_distribution = .PowerLaw,
                .code_complexity_bias = 0.3,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, seed: u64, config: StateFuzzConfig) StateFuzzer {
        var prng = std.rand.DefaultPrng.init(seed);
        return StateFuzzer{
            .allocator = allocator,
            .rng = prng.random(),
            .config = config,
        };
    }
    
    pub fn generate_state(self: *StateFuzzer, vm: *Vm) !void {
        const num_accounts = self.rng.intRangeAtMost(u32, 1, self.config.max_accounts);
        
        for (0..num_accounts) |_| {
            const address = self.generate_address();
            const account = try self.generate_account();
            
            // Set account in VM state
            try vm.state.set_balance(address, account.balance);
            try vm.state.set_nonce(address, account.nonce);
            
            if (account.code.len > 0) {
                try vm.state.set_code(address, account.code);
            }
            
            // Set storage
            for (account.storage.items) |storage_entry| {
                try vm.state.set_storage(address, storage_entry.key, storage_entry.value);
            }
        }
    }
    
    fn generate_address(self: *StateFuzzer) Address {
        var addr: Address = undefined;
        self.rng.bytes(&addr.bytes);
        return addr;
    }
    
    fn generate_account(self: *StateFuzzer) !FuzzAccount {
        return FuzzAccount{
            .balance = self.generate_balance(),
            .nonce = self.generate_account_nonce(),
            .code = try self.generate_account_code(),
            .storage = try self.generate_storage(),
        };
    }
    
    fn generate_balance(self: *StateFuzzer) U256 {
        return switch (self.config.balance_distribution) {
            .Uniform => U256.from_u64(self.rng.int(u64)),
            .PowerLaw => {
                // Most accounts have small balances, few have large balances
                const exponent = self.rng.float(f64) * 10.0;
                const balance = std.math.pow(f64, 10.0, exponent);
                return U256.from_u64(@as(u64, @intFromFloat(@min(balance, @as(f64, @floatFromInt(std.math.maxInt(u64)))))));
            },
            .EdgeCases => switch (self.rng.intRangeAtMost(u8, 0, 4)) {
                0 => 0, // Empty account
                1 => 1, // Minimal balance
                2 => U256.max_value(), // Maximum balance
                3 => U256.from_u64(1000000000000000000), // 1 ETH
                else => U256.from_u64(self.rng.int(u64)),
            },
        };
    }
    
    fn generate_account_nonce(self: *StateFuzzer) u64 {
        if (self.rng.float(f32) < 0.2) {
            return switch (self.rng.intRangeAtMost(u8, 0, 3)) {
                0 => 0, // New account
                1 => 1, // First transaction
                2 => std.math.maxInt(u64), // Maximum nonce
                else => self.rng.intRangeAtMost(u64, 1, 1000),
            };
        }
        
        return self.rng.intRangeAtMost(u64, 0, 1000000);
    }
    
    fn generate_account_code(self: *StateFuzzer) ![]u8 {
        if (self.rng.float(f32) < 0.3) {
            // Empty account (EOA)
            return &[_]u8{};
        }
        
        // Generate contract code
        var bytecode_fuzzer = BytecodeFuzzer.init(self.allocator, self.rng.int(u64), BytecodeFuzzConfig.default());
        return bytecode_fuzzer.generate_bytecode();
    }
    
    fn generate_storage(self: *StateFuzzer) !std.ArrayList(StorageEntry) {
        var storage = std.ArrayList(StorageEntry).init(self.allocator);
        
        const num_slots = self.rng.intRangeAtMost(u32, 0, self.config.max_storage_slots_per_account);
        
        for (0..num_slots) |_| {
            const entry = StorageEntry{
                .key = U256.from_u64(self.rng.int(u64)),
                .value = U256.from_u64(self.rng.int(u64)),
            };
            try storage.append(entry);
        }
        
        return storage;
    }
};

pub const FuzzAccount = struct {
    balance: U256,
    nonce: u64,
    code: []u8,
    storage: std.ArrayList(StorageEntry),
};

pub const StorageEntry = struct {
    key: U256,
    value: U256,
};
```

## Implementation Requirements

### Core Functionality
1. **Multiple Fuzzing Strategies**: Bytecode, transaction, state, and gas fuzzing
2. **Intelligent Generation**: Weighted selection and edge case bias
3. **Crash Detection**: Automatic crash detection and analysis
4. **Corpus Management**: Seed corpus and mutation strategies
5. **Coverage Tracking**: Code coverage to guide fuzzing
6. **Parallel Execution**: Multi-threaded fuzzing for performance

## Implementation Tasks

### Task 1: Implement Main Fuzzing Framework
File: `/src/evm/fuzzing/fuzzer.zig`
```zig
const std = @import("std");
const Vm = @import("../vm.zig").Vm;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const BytecodeFuzzer = @import("bytecode_fuzzer.zig").BytecodeFuzzer;
const TransactionFuzzer = @import("transaction_fuzzer.zig").TransactionFuzzer;
const StateFuzzer = @import("state_fuzzer.zig").StateFuzzer;

pub const Fuzzer = struct {
    allocator: std.mem.Allocator,
    vm: Vm,
    config: FuzzConfig,
    stats: FuzzStats,
    crash_reporter: CrashReporter,
    corpus: FuzzCorpus,
    
    pub const FuzzConfig = struct {
        seed: u64,
        max_iterations: u64,
        timeout_seconds: u32,
        target_coverage: f32,
        crash_detection: bool,
        parallel_workers: u32,
        corpus_dir: ?[]const u8,
        
        pub fn default() FuzzConfig {
            return FuzzConfig{
                .seed = @as(u64, @intCast(std.time.timestamp())),
                .max_iterations = 1000000,
                .timeout_seconds = 3600, // 1 hour
                .target_coverage = 0.8,
                .crash_detection = true,
                .parallel_workers = 4,
                .corpus_dir = null,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: FuzzConfig) !Fuzzer {
        return Fuzzer{
            .allocator = allocator,
            .vm = try Vm.init(allocator, 1), // Mainnet
            .config = config,
            .stats = FuzzStats.init(),
            .crash_reporter = CrashReporter.init(allocator),
            .corpus = try FuzzCorpus.init(allocator, config.corpus_dir),
        };
    }
    
    pub fn deinit(self: *Fuzzer) void {
        self.vm.deinit();
        self.crash_reporter.deinit();
        self.corpus.deinit();
    }
    
    pub fn run_fuzzing_campaign(self: *Fuzzer) !FuzzResult {
        std.log.info("Starting fuzzing campaign with seed {}", .{self.config.seed});
        std.log.info("Target: {} iterations, {} workers", .{ self.config.max_iterations, self.config.parallel_workers });
        
        const start_time = std.time.milliTimestamp();
        
        if (self.config.parallel_workers > 1) {
            try self.run_parallel_fuzzing();
        } else {
            try self.run_sequential_fuzzing();
        }
        
        const end_time = std.time.milliTimestamp();
        const duration_ms = end_time - start_time;
        
        std.log.info("Fuzzing completed in {}ms", .{duration_ms});
        self.stats.print_summary();
        
        return FuzzResult{
            .iterations = self.stats.total_iterations,
            .crashes_found = self.stats.crashes_found,
            .coverage_achieved = self.stats.coverage_percentage,
            .duration_ms = duration_ms,
            .unique_paths = self.stats.unique_execution_paths,
        };
    }
    
    fn run_sequential_fuzzing(self: *Fuzzer) !void {
        var iteration: u64 = 0;
        
        while (iteration < self.config.max_iterations) {
            // Generate random test case
            const test_case = try self.generate_test_case();
            defer test_case.deinit();
            
            // Execute test case
            const result = self.execute_test_case(test_case) catch |err| {
                // Potential crash detected
                try self.handle_crash(test_case, err);
                self.stats.crashes_found += 1;
                continue;
            };
            
            // Update statistics
            try self.update_coverage(result);
            self.stats.total_iterations += 1;
            
            // Check if we should add to corpus
            if (self.is_interesting_test_case(result)) {
                try self.corpus.add_test_case(test_case);
            }
            
            iteration += 1;
            
            if (iteration % 10000 == 0) {
                std.log.info("Completed {} iterations, {} crashes found", .{ iteration, self.stats.crashes_found });
            }
        }
    }
    
    fn run_parallel_fuzzing(self: *Fuzzer) !void {
        // Simplified parallel implementation
        // Real implementation would use thread pool
        var workers = try self.allocator.alloc(std.Thread, self.config.parallel_workers);
        defer self.allocator.free(workers);
        
        for (workers, 0..) |*worker, i| {
            const worker_seed = self.config.seed + i;
            worker.* = try std.Thread.spawn(.{}, worker_fuzzing_loop, .{ self, worker_seed });
        }
        
        for (workers) |worker| {
            worker.join();
        }
    }
    
    fn worker_fuzzing_loop(self: *Fuzzer, seed: u64) void {
        var local_rng = std.rand.DefaultPrng.init(seed);
        const iterations_per_worker = self.config.max_iterations / self.config.parallel_workers;
        
        var iteration: u64 = 0;
        while (iteration < iterations_per_worker) {
            const test_case = self.generate_test_case_with_rng(local_rng.random()) catch continue;
            defer test_case.deinit();
            
            const result = self.execute_test_case(test_case) catch |err| {
                self.handle_crash(test_case, err) catch {};
                continue;
            };
            
            self.update_coverage(result) catch {};
            iteration += 1;
        }
    }
    
    fn generate_test_case(self: *Fuzzer) !FuzzTestCase {
        const strategy = self.select_fuzzing_strategy();
        
        return switch (strategy) {
            .Bytecode => try self.generate_bytecode_test_case(),
            .Transaction => try self.generate_transaction_test_case(),
            .State => try self.generate_state_test_case(),
            .Mixed => try self.generate_mixed_test_case(),
        };
    }
    
    fn generate_test_case_with_rng(self: *Fuzzer, rng: std.rand.Random) !FuzzTestCase {
        _ = self;
        _ = rng;
        // Implementation with specific RNG for parallel workers
        return FuzzTestCase{
            .type = .Bytecode,
            .bytecode = &[_]u8{0x00}, // STOP
            .transaction = null,
            .state = null,
        };
    }
    
    fn select_fuzzing_strategy(self: *Fuzzer) FuzzStrategy {
        // Select strategy based on current coverage and statistics
        const strategies = [_]FuzzStrategy{ .Bytecode, .Transaction, .State, .Mixed };
        const weights = [_]f32{ 0.4, 0.3, 0.2, 0.1 };
        
        var rng = std.rand.DefaultPrng.init(self.config.seed);
        const random_weight = rng.random().float(f32);
        
        var cumulative_weight: f32 = 0;
        for (weights, 0..) |weight, i| {
            cumulative_weight += weight;
            if (random_weight <= cumulative_weight) {
                return strategies[i];
            }
        }
        
        return .Bytecode;
    }
    
    fn generate_bytecode_test_case(self: *Fuzzer) !FuzzTestCase {
        var bytecode_fuzzer = BytecodeFuzzer.init(self.allocator, self.config.seed, BytecodeFuzzConfig.default());
        const bytecode = try bytecode_fuzzer.generate_bytecode();
        
        return FuzzTestCase{
            .type = .Bytecode,
            .bytecode = bytecode,
            .transaction = null,
            .state = null,
        };
    }
    
    fn generate_transaction_test_case(self: *Fuzzer) !FuzzTestCase {
        var tx_fuzzer = TransactionFuzzer.init(self.allocator, self.config.seed, TransactionFuzzConfig.default());
        const transaction = try tx_fuzzer.generate_transaction();
        
        return FuzzTestCase{
            .type = .Transaction,
            .bytecode = null,
            .transaction = transaction,
            .state = null,
        };
    }
    
    fn generate_state_test_case(self: *Fuzzer) !FuzzTestCase {
        var state_fuzzer = StateFuzzer.init(self.allocator, self.config.seed, StateFuzzConfig.default());
        
        return FuzzTestCase{
            .type = .State,
            .bytecode = null,
            .transaction = null,
            .state = state_fuzzer, // Would contain state modifications
        };
    }
    
    fn generate_mixed_test_case(self: *Fuzzer) !FuzzTestCase {
        // Combine multiple fuzzing strategies
        return FuzzTestCase{
            .type = .Mixed,
            .bytecode = null,
            .transaction = null,
            .state = null,
        };
    }
    
    fn execute_test_case(self: *Fuzzer, test_case: FuzzTestCase) !ExecutionResult {
        return switch (test_case.type) {
            .Bytecode => {
                if (test_case.bytecode) |bytecode| {
                    return self.vm.execute_bytecode(bytecode, 1000000); // 1M gas limit
                } else {
                    return error.InvalidTestCase;
                }
            },
            .Transaction => {
                if (test_case.transaction) |tx| {
                    return self.vm.execute_transaction(tx);
                } else {
                    return error.InvalidTestCase;
                }
            },
            .State => {
                // Execute state modifications
                return ExecutionResult.halt; // Placeholder
            },
            .Mixed => {
                // Execute combined test case
                return ExecutionResult.halt; // Placeholder
            },
        };
    }
    
    fn handle_crash(self: *Fuzzer, test_case: FuzzTestCase, err: anyerror) !void {
        try self.crash_reporter.report_crash(test_case, err);
        
        // Save crashing test case for reproduction
        const crash_filename = try std.fmt.allocPrint(
            self.allocator,
            "crash_{}.bin",
            .{std.time.milliTimestamp()}
        );
        defer self.allocator.free(crash_filename);
        
        try self.save_test_case(test_case, crash_filename);
        
        std.log.warn("Crash detected: {} - saved to {s}", .{ err, crash_filename });
    }
    
    fn update_coverage(self: *Fuzzer, result: ExecutionResult) !void {
        // Update code coverage statistics
        _ = self;
        _ = result;
        // Implementation would track which code paths were executed
    }
    
    fn is_interesting_test_case(self: *Fuzzer, result: ExecutionResult) bool {
        // Determine if test case should be added to corpus
        _ = self;
        _ = result;
        return false; // Placeholder
    }
    
    fn save_test_case(self: *Fuzzer, test_case: FuzzTestCase, filename: []const u8) !void {
        _ = self;
        _ = test_case;
        _ = filename;
        // Implementation would serialize test case to file
    }
};

pub const FuzzStrategy = enum {
    Bytecode,
    Transaction,
    State,
    Mixed,
};

pub const FuzzTestCase = struct {
    type: FuzzStrategy,
    bytecode: ?[]u8,
    transaction: ?FuzzTransaction,
    state: ?StateFuzzer,
    
    pub fn deinit(self: FuzzTestCase) void {
        if (self.bytecode) |bytecode| {
            std.heap.page_allocator.free(bytecode);
        }
        // Cleanup other fields as needed
    }
};

pub const FuzzResult = struct {
    iterations: u64,
    crashes_found: u32,
    coverage_achieved: f32,
    duration_ms: i64,
    unique_paths: u32,
};

pub const FuzzStats = struct {
    total_iterations: u64,
    crashes_found: u32,
    coverage_percentage: f32,
    unique_execution_paths: u32,
    
    pub fn init() FuzzStats {
        return FuzzStats{
            .total_iterations = 0,
            .crashes_found = 0,
            .coverage_percentage = 0.0,
            .unique_execution_paths = 0,
        };
    }
    
    pub fn print_summary(self: *const FuzzStats) void {
        std.log.info("=== FUZZING SUMMARY ===");
        std.log.info("Iterations: {}", .{self.total_iterations});
        std.log.info("Crashes found: {}", .{self.crashes_found});
        std.log.info("Coverage: {d:.1}%", .{self.coverage_percentage * 100});
        std.log.info("Unique paths: {}", .{self.unique_execution_paths});
    }
};

pub const CrashReporter = struct {
    allocator: std.mem.Allocator,
    crashes: std.ArrayList(CrashReport),
    
    pub fn init(allocator: std.mem.Allocator) CrashReporter {
        return CrashReporter{
            .allocator = allocator,
            .crashes = std.ArrayList(CrashReport).init(allocator),
        };
    }
    
    pub fn deinit(self: *CrashReporter) void {
        self.crashes.deinit();
    }
    
    pub fn report_crash(self: *CrashReporter, test_case: FuzzTestCase, err: anyerror) !void {
        const crash = CrashReport{
            .error_type = err,
            .test_case = test_case,
            .timestamp = std.time.milliTimestamp(),
            .stack_trace = try self.capture_stack_trace(),
        };
        
        try self.crashes.append(crash);
    }
    
    fn capture_stack_trace(self: *CrashReporter) ![]u8 {
        _ = self;
        // Implementation would capture stack trace
        return try self.allocator.dupe(u8, "Stack trace not implemented");
    }
};

pub const CrashReport = struct {
    error_type: anyerror,
    test_case: FuzzTestCase,
    timestamp: i64,
    stack_trace: []u8,
};

pub const FuzzCorpus = struct {
    allocator: std.mem.Allocator,
    test_cases: std.ArrayList(FuzzTestCase),
    corpus_dir: ?[]const u8,
    
    pub fn init(allocator: std.mem.Allocator, corpus_dir: ?[]const u8) !FuzzCorpus {
        var corpus = FuzzCorpus{
            .allocator = allocator,
            .test_cases = std.ArrayList(FuzzTestCase).init(allocator),
            .corpus_dir = corpus_dir,
        };
        
        if (corpus_dir) |dir| {
            try corpus.load_corpus(dir);
        }
        
        return corpus;
    }
    
    pub fn deinit(self: *FuzzCorpus) void {
        for (self.test_cases.items) |test_case| {
            test_case.deinit();
        }
        self.test_cases.deinit();
    }
    
    pub fn add_test_case(self: *FuzzCorpus, test_case: FuzzTestCase) !void {
        try self.test_cases.append(test_case);
        
        if (self.corpus_dir) |dir| {
            try self.save_test_case_to_corpus(dir, test_case);
        }
    }
    
    fn load_corpus(self: *FuzzCorpus, dir: []const u8) !void {
        _ = self;
        _ = dir;
        // Implementation would load existing test cases from directory
    }
    
    fn save_test_case_to_corpus(self: *FuzzCorpus, dir: []const u8, test_case: FuzzTestCase) !void {
        _ = self;
        _ = dir;
        _ = test_case;
        // Implementation would save test case to corpus directory
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/fuzzing/fuzzing_test.zig`

### Test Cases
```zig
test "bytecode fuzzer generation" {
    // Test bytecode generation with various configurations
    // Test valid/invalid opcode distribution
    // Test JUMPDEST placement
}

test "transaction fuzzer generation" {
    // Test transaction field generation
    // Test edge case bias
    // Test signature validity
}

test "state fuzzer generation" {
    // Test account generation
    // Test storage generation
    // Test balance distributions
}

test "crash detection and reporting" {
    // Test crash detection mechanisms
    // Test crash report generation
    // Test stack trace capture
}

test "corpus management" {
    // Test corpus loading and saving
    // Test interesting test case detection
    // Test mutation strategies
}

test "parallel fuzzing" {
    // Test multi-threaded execution
    // Test result aggregation
    // Test seed diversity
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/fuzzing/fuzzer.zig` - Main fuzzing framework
- `/src/evm/fuzzing/bytecode_fuzzer.zig` - Bytecode generation and mutation
- `/src/evm/fuzzing/transaction_fuzzer.zig` - Transaction fuzzing
- `/src/evm/fuzzing/state_fuzzer.zig` - State space exploration
- `/src/evm/fuzzing/crash_detector.zig` - Crash detection and analysis
- `/src/evm/fuzzing/coverage_tracker.zig` - Code coverage tracking
- `/src/evm/fuzzing/cli.zig` - Command line interface
- `/src/evm/vm.zig` - Add fuzzing hooks and crash detection
- `/build.zig` - Add fuzzing build targets
- `/test/evm/fuzzing/fuzzing_test.zig` - Comprehensive tests

## Success Criteria

1. **Comprehensive Coverage**: Fuzz all major EVM components and operations
2. **Crash Detection**: Automatically detect and report crashes, hangs, and errors
3. **Intelligence**: Use coverage feedback to guide test generation
4. **Performance**: Execute thousands of test cases per second
5. **Reproducibility**: Save and replay crashing test cases
6. **Automation**: Integration with CI/CD for continuous fuzzing

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Memory safety** - Fuzzer itself must not crash or leak memory
3. **Deterministic** - Same seed should produce same test cases
4. **Efficient** - Minimize overhead in instrumentation and tracking
5. **Comprehensive** - Cover edge cases that manual testing might miss
6. **CI/CD ready** - Automated fuzzing in continuous integration

## References

- [LibFuzzer](https://llvm.org/docs/LibFuzzer.html) - LLVM fuzzing library
- [AFL++](https://aflplus.plus/) - Advanced fuzzing framework
- [Echidna](https://github.com/crytic/echidna) - Ethereum smart contract fuzzer
- [Foundry Fuzz Testing](https://book.getfoundry.sh/forge/fuzz-testing) - Solidity fuzzing
- [Go-fuzz](https://github.com/dvyukov/go-fuzz) - Go fuzzing framework