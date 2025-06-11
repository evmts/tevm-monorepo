# Implement Fuzzing Infrastructure

You are implementing Fuzzing Infrastructure for the Tevm EVM written in Zig. Your goal is to implement fuzzing infrastructure for security testing following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_fuzzing_infrastructure` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_fuzzing_infrastructure feat_implement_fuzzing_infrastructure`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive fuzzing infrastructure to automatically discover edge cases, security vulnerabilities, and correctness issues in the EVM implementation. This includes bytecode fuzzing, transaction fuzzing, state fuzzing, and gas fuzzing with intelligent generation strategies and crash analysis capabilities.

## ELI5

Fuzzing is like having an extremely persistent and creative troublemaker test your system. Instead of following normal test cases, it throws random, weird, and unexpected inputs at your code to see what breaks. It's like stress-testing a bridge by having thousands of different vehicles drive across it in unpredictable ways - you'll discover weak spots and edge cases that normal testing would never find. This helps make the EVM more robust by finding bugs before real users encounter them.

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

#### 1. **Unit Tests** (`/test/evm/fuzzing/fuzzing_infrastructure_test.zig`)
```zig
// Test basic fuzzing functionality
test "bytecode_fuzzer basic functionality with known scenarios"
test "bytecode_fuzzer handles edge cases correctly"
test "bytecode_fuzzer validates input parameters"
test "bytecode_fuzzer produces correct output format"
test "transaction_fuzzer generates valid transactions"
test "state_fuzzer creates realistic state scenarios"
test "gas_fuzzer tests gas limit boundaries"
test "crash_analyzer detects failure patterns"
```

#### 2. **Integration Tests**
```zig
test "fuzzing_system integrates with EVM execution context"
test "fuzzing_system works with existing EVM systems"
test "fuzzing_system maintains compatibility with hardforks"
test "fuzzing_system handles system-level interactions"
test "fuzz_results integrate with crash analysis"
test "fuzzing_campaigns run automated sequences"
test "vulnerability_detection identifies security issues"
test "regression_testing prevents known issues"
```

#### 3. **Functional Tests**
```zig
test "fuzzing_system end-to-end functionality works correctly"
test "fuzzing_system handles realistic usage scenarios"
test "fuzzing_system maintains behavior under load"
test "fuzzing_system processes complex inputs correctly"
test "bytecode_fuzzing discovers edge cases"
test "transaction_fuzzing finds vulnerabilities"
test "state_fuzzing uncovers inconsistencies"
test "crash_reproduction validates findings"
```

#### 4. **Performance Tests**
```zig
test "fuzzing_system meets performance requirements"
test "fuzzing_system memory usage within bounds"
test "fuzzing_system scalability with large inputs"
test "fuzzing_system benchmark against baseline"
test "fuzz_generation_speed adequate"
test "execution_throughput_satisfactory"
test "coverage_analysis_efficient"
test "crash_detection_responsive"
```

#### 5. **Error Handling Tests**
```zig
test "fuzzing_system error propagation works correctly"
test "fuzzing_system proper error types and messages"
test "fuzzing_system graceful handling of invalid inputs"
test "fuzzing_system recovery from failure states"
test "fuzz_validation rejects malformed inputs"
test "execution_timeouts handled correctly"
test "crash_handling preserves debugging information"
test "resource_exhaustion managed properly"
```

#### 6. **Compatibility Tests**
```zig
test "fuzzing_system maintains EVM specification compliance"
test "fuzzing_system cross-client behavior consistency"
test "fuzzing_system backward compatibility preserved"
test "fuzzing_system platform-specific behavior verified"
test "fuzz_corpus_compatibility maintained"
test "crash_analysis_portability ensured"
test "vulnerability_detection_accuracy validated"
test "fuzzing_tools_integration supported"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic fuzzing generation and execution works correctly
2. **Add integration tests** - Verify system-level interactions with EVM execution
3. **Implement performance tests** - Meet efficiency requirements for fuzzing throughput
4. **Add error handling tests** - Robust failure management for fuzzing operations
5. **Test edge cases** - Handle boundary conditions like infinite loops and resource exhaustion
6. **Verify compatibility** - Ensure cross-platform consistency and tool integration

### Test Data Sources
- **EVM specification requirements**: Fuzzing target behavior verification
- **Reference implementation data**: Cross-client vulnerability testing
- **Performance benchmarks**: Fuzzing efficiency baseline
- **Real-world vulnerability examples**: Security validation scenarios
- **Synthetic test cases**: Edge condition and stress testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "bytecode_fuzzer basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    
    var fuzzer = BytecodeFuzzer.init(allocator, BytecodeFuzzer.BytecodeFuzzConfig.default());
    defer fuzzer.deinit();
    
    // Generate random bytecode
    const bytecode = try fuzzer.generateBytecode(100); // 100 bytes
    defer allocator.free(bytecode);
    
    // Validate basic properties
    try testing.expect(bytecode.len <= 100);
    try testing.expect(bytecode.len > 0);
    
    // Test that generated bytecode contains valid opcodes
    var valid_opcodes: u32 = 0;
    for (bytecode) |byte| {
        if (isValidOpcode(byte)) {
            valid_opcodes += 1;
        }
    }
    
    // Should have some valid opcodes (not all random bytes)
    try testing.expect(valid_opcodes > bytecode.len / 4);
}
```

**Only then implement:**
```zig
pub const BytecodeFuzzer = struct {
    pub fn generateBytecode(self: *BytecodeFuzzer, max_size: u32) ![]u8 {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test fuzzing coverage** - Ensure fuzzing explores diverse execution paths
- **Verify vulnerability detection** - Fuzzing must identify security issues
- **Test cross-platform fuzzing behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [LibFuzzer](https://llvm.org/docs/LibFuzzer.html) - LLVM fuzzing library
- [AFL++](https://aflplus.plus/) - Advanced fuzzing framework
- [Echidna](https://github.com/crytic/echidna) - Ethereum smart contract fuzzer
- [Foundry Fuzz Testing](https://book.getfoundry.sh/forge/fuzz-testing) - Solidity fuzzing
- [Go-fuzz](https://github.com/dvyukov/go-fuzz) - Go fuzzing framework

## EVMONE Context

An excellent and well-structured prompt for implementing a fuzzing infrastructure. `evmone` has a robust set of testing and fuzzing tools that serve as a great reference. Here are the most relevant code snippets to guide your implementation.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/fuzzer/fuzzer.cpp">
```cpp
/*
    This is the main fuzzing entry point for evmone. It uses libFuzzer.
    The `LLVMFuzzerTestOneInput` function is the core of the fuzzer, and the
    `populate_input` function is a brilliant example of how to translate a raw
    byte stream from the fuzzer into a structured test case, including EVM
    revision, message parameters, and host state. This is directly applicable
    to your `generate_test_case` logic.
*/

/// The reference VM: evmone Baseline
static auto ref_vm = evmc::VM{evmc_create_evmone()};

static evmc::VM external_vms[] = {
    evmc::VM{evmc_create_evmone(), {{"advanced", ""}}},
};

class FuzzHost : public evmc::MockedHost
{
public:
    uint8_t gas_left_factor = 0;

    evmc::Result call(const evmc_message& msg) noexcept override
    {
        auto result = MockedHost::call(msg);

        // Set gas_left.
        if (gas_left_factor == 0)
            result.gas_left = 0;
        else if (gas_left_factor == 1)
            result.gas_left = msg.gas;
        else
            result.gas_left = msg.gas / (gas_left_factor + 3);

        if (msg.kind == EVMC_CREATE || msg.kind == EVMC_CREATE2)
        {
            // Use the output to fill the create address.
            // We still keep the output to check if VM is going to ignore it.
            std::memcpy(result.create_address.bytes, result.output_data,
                std::min(sizeof(result.create_address), result.output_size));
        }

        return result;
    }
};

/*
    This struct is analogous to your `FuzzTestCase`. It holds all the
    randomized data needed to run a single fuzzing iteration.
*/
struct fuzz_input
{
    evmc_revision rev{};
    evmc_message msg{};
    FuzzHost host;

    /// Creates invalid input.
    fuzz_input() noexcept { msg.gas = -1; }

    explicit operator bool() const noexcept { return msg.gas != -1; }
};

/*
    This function demonstrates how to deterministically generate structured
    fuzzing inputs from a raw byte buffer. It covers generating various
    transaction parameters and world state configurations from a small set of
    bytes, which is a very efficient fuzzing technique.
*/
fuzz_input populate_input(const uint8_t* data, size_t data_size) noexcept
{
    auto in = fuzz_input{};

    constexpr auto min_required_size = 24;
    if (data_size < min_required_size)
        return in;

    const auto rev_4bits = data[0] >> 4;
    const auto kind_1bit = (data[0] >> 3) & 0b1;
    const auto static_1bit = (data[0] >> 2) & 0b1;
    const auto depth_2bits = uint8_t(data[0] & 0b11);
    const auto gas_24bits = (data[1] << 16) | (data[2] << 8) | data[3];  // Max 16777216.
    const auto input_size_16bits = unsigned(data[4] << 8) | data[5];
    const auto destination_8bits = data[6];
    const auto sender_8bits = data[7];
    const auto value_8bits = data[8];
    const auto create2_salt_8bits = data[9];

    // ... (rest of byte parsing for block context, accounts, etc.)

    data += min_required_size;
    data_size -= min_required_size;

    if (data_size < input_size_16bits)  // Not enough data for input.
        return in;

    in.rev = (rev_4bits > EVMC_LATEST_STABLE_REVISION) ? EVMC_LATEST_STABLE_REVISION :
                                                         static_cast<evmc_revision>(rev_4bits);

    in.msg.kind = kind_1bit ? EVMC_CREATE : EVMC_CALL;
    in.msg.flags = static_1bit ? EVMC_STATIC : 0;
    // ... (setting msg fields like gas, recipient, sender, value)

    // ... (populating host context: coinbase, timestamp, etc.)

    auto& account = in.host.accounts[in.msg.recipient];
    account.balance = generate_interesting_value(account_balance_8bits);
    const auto storage_key1 = generate_interesting_value(account_storage_key1_8bits);
    const auto storage_key2 = generate_interesting_value(account_storage_key2_8bits);
    account.storage[{}] = storage_key2;
    account.storage[storage_key1] = storage_key2;
    account.code = {data, data_size};  // Use remaining data as code.

    // ... (setting call result for mocked calls)

    return in;
}

/*
    This is the main entry point for a libFuzzer campaign. It shows the
    fuzzing loop: populate input, execute with a reference VM, then execute
    with the target VM(s) and compare the results. This differential
    fuzzing approach is excellent for finding correctness bugs.
*/
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t data_size) noexcept
{
    auto in = populate_input(data, data_size);
    if (!in)
        return 0;

    auto ref_host = in.host;  // Copy Host.
    const auto& code = ref_host.accounts[in.msg.recipient].code;

    // ...

    const auto ref_res = ref_vm.execute(ref_host, in.rev, in.msg, code.data(), code.size());
    const auto ref_status = check_and_normalize(ref_res.status_code);
    if (ref_status == EVMC_FAILURE)
        ASSERT_EQ(ref_res.gas_left, 0);

    for (auto& vm : external_vms)
    {
        auto host = in.host;  // Copy Host.
        const auto res = vm.execute(host, in.rev, in.msg, code.data(), code.size());

        const auto status = check_and_normalize(res.status_code);
        ASSERT_EQ(status, ref_status);
        ASSERT_EQ(res.gas_left, ref_res.gas_left);
        ASSERT_EQ(bytes_view(res.output_data, res.output_size),
            bytes_view(ref_res.output_data, ref_res.output_size));

        if (ref_status != EVMC_FAILURE)
        {
            // ... (assert equality for host state changes: logs, selfdestructs, etc.)
        }
    }

    return 0;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/synthetic_benchmarks.cpp">
```cpp
/*
    This file is a goldmine for intelligent bytecode generation.
    It demonstrates how to create structured, non-trivial bytecode for
    benchmarking, which is a perfect starting point for a fuzzer that
    wants to generate more than just random bytes.
*/

/// The instruction grouping by EVM stack requirements.
enum class InstructionCategory : char
{
    nop = 'n',     ///< No-op instruction.
    nullop = 'a',  ///< Nullary operator - produces a result without any stack input.
    unop = 'u',    ///< Unary operator.
    binop = 'b',   ///< Binary operator.
    push = 'p',    ///< PUSH instruction.
    dup = 'd',     ///< DUP instruction.
    swap = 's',    ///< SWAP instruction.
    other = 'X',   ///< Not any of the categories above.
};

/*
    This function generates the inner loop of a benchmark program. It shows
    how to create meaningful sequences of instructions based on their category
    (e.g., ensuring enough items are on the stack for a binary op). This
    logic is directly transferable to your `BytecodeFuzzer` to create more
    valid and interesting test cases.
*/
bytecode generate_loop_inner_code(CodeParams params)
{
    const auto [opcode, mode] = params;
    const auto category = get_instruction_category(opcode);
    switch (mode)
    {
    case Mode::min_stack:
        switch (category)
        {
        case InstructionCategory::nop:
            // JUMPDEST JUMPDEST ...
            return stack_limit * 2 * bytecode{opcode};

        case InstructionCategory::nullop:
            // CALLER POP CALLER POP ...
            return stack_limit * (bytecode{opcode} + OP_POP);

        case InstructionCategory::unop:
            // DUP1 NOT NOT ... POP
            return OP_DUP1 + stack_limit * 2 * bytecode{opcode} + OP_POP;

        case InstructionCategory::binop:
            // DUP1 DUP1 ADD DUP1 ADD DUP1 ADD ... POP
            return OP_DUP1 + (stack_limit - 1) * (OP_DUP1 + bytecode{opcode}) + OP_POP;

        // ... cases for push, dup, swap ...
        }
        break;

    case Mode::full_stack:
        switch (category)
        {
        // ... cases to fill the stack before operations ...
        case InstructionCategory::nullop:
            // CALLER CALLER ... POP POP ...
            return stack_limit * opcode + stack_limit * OP_POP;
        // ...
        }
        break;
    }

    return {};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/experimental/jumpdest_analysis.cpp">
```cpp
/*
    This file contains reference implementations for JUMPDEST analysis.
    The `reference` function is a clean, simple algorithm you can port to Zig.
    Your `BytecodeFuzzer` can use this to intelligently place `JUMPDEST`
    opcodes, and your VM will need a similar analysis to validate jumps.
*/
namespace evmone::exp::jda
{

/// The reference implementation of the EVM jumpdest analysis.
JumpdestBitset reference(bytes_view code)
{
    JumpdestBitset m(code.size());
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        if (static_cast<int8_t>(op) >= OP_PUSH1)
            i += op - (OP_PUSH1 - 1);
        else if (op == OP_JUMPDEST) [[unlikely]]
            m[i] = true;
    }
    return m;
}

}  // namespace evmone::exp::jda
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
/*
    This file is invaluable for building an intelligent bytecode fuzzer.
    Instead of hardcoding opcode properties, you can create a similar
    data structure in Zig. This allows your fuzzer to know the stack
    requirements, gas costs, and introduction revision for every opcode,
    enabling the generation of complex and valid (or near-valid) bytecode.
*/
namespace evmone::instr
{
/// The special gas cost value marking an EVM instruction as "undefined".
constexpr int16_t undefined = -1;

/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs.
constexpr inline GasCostTable gas_costs = []() noexcept { ... }();

/// The EVM instruction traits.
struct Traits
{
    const char* name = nullptr;
    uint8_t immediate_size = 0;
    bool is_terminating = false;
    uint8_t stack_height_required = 0;
    int8_t stack_height_change = 0;
    std::optional<evmc_revision> since;
    std::optional<evmc_revision> eof_since;
};

/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    table[OP_MUL] = {"MUL", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    // ... and so on for all 256 opcodes
    table[OP_PUSH1] = {"PUSH1", 1, false, 0, 1, EVMC_FRONTIER, REV_EOF1};
    // ...
    return table;
}();
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/transaction.hpp">
```cpp
/*
    This header defines the structures for transactions and logs.
    Your `TransactionFuzzer` and `FuzzTransaction` struct can be modeled
    directly after this, ensuring all relevant fields are covered, including
    those from newer EIPs like 1559, 2930, and 4844.
*/
namespace evmone::state
{
using AccessList = std::vector<std::pair<address, std::vector<bytes32>>>;

struct Transaction
{
    enum class Type : uint8_t
    {
        legacy = 0,
        access_list = 1,
        eip1559 = 2,
        blob = 3,
        set_code = 4,
        initcodes = 6,
    };

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

struct TransactionReceipt
{
    Transaction::Type type = Transaction::Type::legacy;
    evmc_status_code status = EVMC_INTERNAL_ERROR;
    int64_t gas_used = 0;
    int64_t cumulative_gas_used = 0;
    std::vector<Log> logs;
    BloomFilter logs_bloom_filter;
    StateDiff state_diff;
    std::optional<bytes32> post_state;
};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/test_state.hpp">
```cpp
/*
    The `TestAccount` and `TestState` structures from evmone's test suite are
    an excellent model for your `FuzzAccount` and for the state your `StateFuzzer`
    will generate. They include all essential components: nonce, balance, code,
    and storage.
*/
namespace evmone::test
{
/// Ethereum account representation for tests.
struct TestAccount
{
    uint64_t nonce = 0;
    uint256 balance;
    std::map<bytes32, bytes32> storage;
    bytes code;

    bool operator==(const TestAccount&) const noexcept = default;
};

/// Ethereum State representation for tests.
class TestState : public state::StateView, public std::map<address, TestAccount>
{
public:
    using map::map;

    std::optional<Account> get_account(const address& addr) const noexcept override;
    bytes get_account_code(const address& addr) const noexcept override;
    bytes32 get_storage(const address& addr, const bytes32& key) const noexcept override;
    
    // ...
};
}
```
</file>
</evmone>

## Prompt Corrections

Your prompt is very well-written and demonstrates a solid understanding of modern fuzzing techniques. The proposed Zig implementation structure is excellent. There are no major corrections, but here are a few suggestions based on the `evmone` implementation that could enhance your fuzzing infrastructure:

1.  **Data-Driven Opcode Properties**: In your `BytecodeFuzzer`, you have hardcoded logic for PUSH opcodes (`get_immediate_bytes`) and a weighted list for opcode selection. Consider adopting `evmone`'s approach from `lib/evmone/instructions_traits.hpp`. Creating a static table of opcode traits in Zig would make your fuzzer more maintainable and easier to update for new EVM hardforks. It centralizes information about stack usage, immediate data size, and gas cost for every opcode.

2.  **Differential Fuzzing**: The `evmone` fuzzer (`test/fuzzer/fuzzer.cpp`) compares the execution result of its "advanced" interpreter against its "baseline" interpreter. This is a powerful technique called differential fuzzing. If you ever create a second EVM implementation (e.g., an optimized version), you can use this same infrastructure to fuzz it against your current one to find correctness and consensus bugs.

3.  **EOF Fuzzing**: The EVM is moving towards the [EVM Object Format (EOF)](https://eips.ethereum.org/EIPS/eip-3540). `evmone` has extensive validation and execution logic for this. For a truly comprehensive fuzzer, you should eventually add a strategy for generating valid and invalid EOF containers. The `evmone/test/unittests/eof_validation_test.cpp` file contains hundreds of test cases that would be a great starting point for your EOF fuzzing corpus.

4.  **State Representation**: Your `StateFuzzer` correctly identifies the need to generate a world state. `evmone`'s `TestState` (a map of addresses to `TestAccount`) is a good model. For performance, `evmone`'s internal `Host` uses a journal to track state changes within a transaction, which allows for efficient reverts. While your fuzzer might not need this initially, it's a pattern to keep in mind for more complex, stateful fuzzing scenarios.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/opcode.rs">
```rust
//! EVM opcode definitions and utilities. It contains opcode information and utilities to work with opcodes.

/// Information about opcode, such as name, and stack inputs and outputs
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct OpCodeInfo {
    /// Invariant: `(name_ptr, name_len)` is a [`&'static str`][str].
    ///
    /// It is a shorted variant of [`str`] as
    /// the name length is always less than 256 characters.
    name_ptr: NonNull<u8>,
    name_len: u8,
    /// Stack inputs
    inputs: u8,
    /// Stack outputs
    outputs: u8,
    /// Number of intermediate bytes
    ///
    /// RJUMPV is a special case where the bytes len depends on bytecode value,
    /// for RJUMV size will be set to one byte as it is the minimum immediate size.
    immediate_size: u8,
    /// Used by EOF verification
    ///
    /// All not EOF opcodes are marked false.
    not_eof: bool,
    /// If the opcode stops execution. aka STOP, RETURN, ..
    terminating: bool,
}

// ... implementation ...

/// Created all opcodes constants and two maps:
///  * `OPCODE_INFO` maps opcode number to the opcode info
///  * `NAME_TO_OPCODE` that maps opcode name to the opcode number.
macro_rules! opcodes {
    ($($val:literal => $name:ident => $($modifier:ident $(( $($modifier_arg:expr),* ))?),*);* $(;)?) => {
        // ... macro implementation ...
    };
}


opcodes! {
    0x00 => STOP     => stack_io(0, 0), terminating;
    0x01 => ADD      => stack_io(2, 1);
    0x02 => MUL      => stack_io(2, 1);
    0x03 => SUB      => stack_io(2, 1);
    0x04 => DIV      => stack_io(2, 1);
    0x05 => SDIV     => stack_io(2, 1);
    0x06 => MOD      => stack_io(2, 1);
    0x07 => SMOD     => stack_io(2, 1);
    0x08 => ADDMOD   => stack_io(3, 1);
    0x09 => MULMOD   => stack_io(3, 1);
    0x0A => EXP      => stack_io(2, 1);
    0x0B => SIGNEXTEND => stack_io(2, 1);
    // ... all other opcodes
    0x56 => JUMP     => stack_io(1, 0), not_eof;
    0x57 => JUMPI    => stack_io(2, 0), not_eof;
    0x58 => PC       => stack_io(0, 1), not_eof;
    0x59 => MSIZE    => stack_io(0, 1);
    0x5A => GAS      => stack_io(0, 1), not_eof;
    0x5B => JUMPDEST => stack_io(0, 0);
    // ... PUSH opcodes
    0x60 => PUSH1  => stack_io(0, 1), immediate_size(1);
    0x61 => PUSH2  => stack_io(0, 1), immediate_size(2);
    // ... up to PUSH32
    0x7F => PUSH32 => stack_io(0, 1), immediate_size(32);
    // ... DUP, SWAP, LOG, etc.
    0xF3 => RETURN       => stack_io(2, 0), terminating;
    0xFD => REVERT       => stack_io(2, 0), terminating;
    0xFE => INVALID      => stack_io(0, 0), terminating;
    0xFF => SELFDESTRUCT => stack_io(1, 0), not_eof, terminating;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/legacy/analysis.rs">
```rust
/// Analyze the bytecode to find the jumpdests. Used to create a jump table
/// that is needed for [`crate::LegacyAnalyzedBytecode`].
/// This function contains a hot loop and should be optimized as much as possible.
///
/// # Safety
///
/// The function uses unsafe pointer arithmetic, but maintains the following invariants:
/// - The iterator never advances beyond the end of the bytecode
/// - All pointer offsets are within bounds of the bytecode
/// - The jump table is never accessed beyond its allocated size
///
/// Undefined behavior if the bytecode does not end with a valid STOP opcode. Please check
/// [`crate::LegacyAnalyzedBytecode::new`] for details on how the bytecode is validated.
pub fn analyze_legacy(bytecode: Bytes) -> (JumpTable, Bytes) {
    if bytecode.is_empty() {
        return (JumpTable::default(), Bytes::from_static(&[opcode::STOP]));
    }

    let mut jumps: BitVec<u8> = bitvec



## EXECUTION-SPECS Context

An excellent and detailed request. Building a robust fuzzing infrastructure is crucial for ensuring the security and correctness of an EVM implementation. The following code snippets from `execution-specs` provide the necessary context and definitions to build the specified fuzzers and framework.

<execution-specs>
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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork_types.py">
```python
from dataclasses import dataclass

from ethereum_rlp import rlp
from ethereum_types.bytes import Bytes, Bytes20, Bytes256
from ethereum_types.frozen import slotted_freezable
from ethereum_types.numeric import U256, Uint

from ..crypto.hash import Hash32, keccak256

Address = Bytes20
Root = Hash32
VersionedHash = Hash32

Bloom = Bytes256


@slotted_freezable
@dataclass
class Account:
    """
    State associated with an address.
    """

    nonce: Uint
    balance: U256
    code: Bytes


EMPTY_ACCOUNT = Account(
    nonce=Uint(0),
    balance=U256(0),
    code=bytearray(),
)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Set, Tuple

from ethereum_types.bytes import Bytes, Bytes32
from ethereum_types.frozen import modify
from ethereum_types.numeric import U256, Uint

from .fork_types import EMPTY_ACCOUNT, Account, Address, Root
from .trie import EMPTY_TRIE_ROOT, Trie, copy_trie, root, trie_get, trie_set


@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


@dataclass
class TransientStorage:
    """
    Contains all information that is preserved between message calls
    within a transaction.
    """

    _tries: Dict[Address, Trie[Bytes32, U256]] = field(default_factory=dict)
    _snapshots: List[Dict[Address, Trie[Bytes32, U256]]] = field(
        default_factory=list
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/__init__.py">
```python
import enum
from typing import Callable, Dict

# ... imports of instruction implementations

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # Arithmetic Ops
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ... all other opcodes ...
    BLOBHASH = 0x49
    BLOBBASEFEE = 0x4A
    TLOAD = 0x5C
    TSTORE = 0x5D
    MCOPY = 0x5E
    PUSH0 = 0x5F
    # ...
    CREATE = 0xF0
    CALL = 0xF1
    # ...
    SELFDESTRUCT = 0xFF
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/runtime.py">
```python
from typing import Set

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import Uint, ulen

from .instructions import Ops


def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.

    Valid jump destinations are defined as follows:
        * The jump destination is less than the length of the code.
        * The jump destination should have the `JUMPDEST` opcode (0x5B).
        * The jump destination shouldn't be part of the data corresponding to
          `PUSH-N` opcodes.

    Note - Jump destinations are 0-indexed.

    Parameters
    ----------
    code :
        The EVM code which is to be executed.

    Returns
    -------
    valid_jump_destinations: `Set[Uint]`
        The set of valid jump destinations in the code.
    """
    valid_jump_destinations = set()
    pc = Uint(0)

    while pc < ulen(code):
        try:
            current_opcode = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes, as they don't affect the jumpdest
            # analysis. Nevertheless, such invalid opcodes would be caught
            # and raised when the interpreter runs.
            pc += Uint(1)
            continue

        if current_opcode == Ops.JUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= current_opcode.value <= Ops.PUSH32.value:
            # If PUSH-N opcodes are encountered, skip the current opcode along
            # with the trailing data segment corresponding to the PUSH-N
            # opcodes.
            push_data_size = current_opcode.value - Ops.PUSH1.value + 1
            pc += Uint(push_data_size)

        pc += Uint(1)

    return valid_jump_destinations
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
from dataclasses import dataclass
from typing import Optional, Set, Tuple

from ethereum_types.bytes import Bytes0
from ethereum_types.numeric import U256, Uint, ulen

from ethereum.exceptions import EthereumException
# ... other imports

@dataclass
class MessageCallOutput:
    """
    Output of a particular message call
    # ... docstring ...
    """

    gas_left: Uint
    refund_counter: U256
    logs: Tuple[Log, ...]
    accounts_to_delete: Set[Address]
    error: Optional[EthereumException]


def process_message_call(message: Message) -> MessageCallOutput:
    # ... implementation ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/exceptions.py">
```python
from ethereum.exceptions import EthereumException


class ExceptionalHalt(EthereumException):
    """
    Indicates that the EVM has experienced an exceptional halt. This causes
    execution to immediately end with all gas being consumed.
    """


class Revert(EthereumException):
    """
    Raised by the `REVERT` opcode.

    Unlike other EVM exceptions this does not result in the consumption of all
    gas.
    """

    pass


class StackUnderflowError(ExceptionalHalt):
    # ...
    pass


class StackOverflowError(ExceptionalHalt):
    # ...
    pass


class OutOfGasError(ExceptionalHalt):
    # ...
    pass


class InvalidOpcode(ExceptionalHalt):
    # ...
    pass


class InvalidJumpDestError(ExceptionalHalt):
    # ...
    pass


class WriteInStaticContext(ExceptionalHalt):
    # ...
    pass


class KZGProofError(ExceptionalHalt):
    """
    Raised when the point evaluation precompile can't verify a proof.
    """

    pass
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
import enum
from dataclasses import dataclass
from typing import Optional, Union

from ethereum_types.bytes import Bytes

from ethereum.exceptions import EthereumException

@dataclass
class TransactionStart:
    """
    Trace event that is triggered at the start of a transaction.
    """


@dataclass
class TransactionEnd:
    """
    Trace event that is triggered at the end of a transaction.
    """

    gas_used: int
    output: Bytes
    error: Optional[EthereumException]


@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """

    op: enum.Enum


@dataclass
class OpException:
    """
    Trace event that is triggered when an opcode raises an exception.
    """

    error: Exception


@dataclass
class GasAndRefund:
    """
    Trace event that is triggered when gas is deducted.
    """

    gas_cost: int


TraceEvent = Union[
    TransactionStart,
    TransactionEnd,
    PrecompileStart,
    PrecompileEnd,
    OpStart,
    OpEnd,
    OpException,
    EvmStop,
    GasAndRefund,
]

def evm_trace(
    evm: object,
    event: TraceEvent,
    /,
    trace_memory: bool = False,
    trace_stack: bool = True,
    trace_return_data: bool = False,
) -> None:
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/evm_tools/t8n/t8n_types.py">
```python
class Alloc:
    """
    The alloc (state) type for the t8n tool.
    """
    # ...
    def __init__(self, t8n: "T8N", stdin: Optional[Dict] = None):
        if t8n.options.input_alloc == "stdin":
            assert stdin is not None
            data = stdin["alloc"]
        else:
            with open(t8n.options.input_alloc, "r") as f:
                data = json.load(f)

        # ... initialization logic ...
        state = t8n.json_to_state(data)
        self.state = state

    def to_json(self) -> Any:
        # ... serialization logic ...


class Txs:
    """
    Read the transactions file, sort out the valid transactions and
    return a list of transactions.
    """
    # ...
    def __init__(self, t8n: "T8N", stdin: Optional[Dict] = None):
        if t8n.options.input_txs == "stdin":
            assert stdin is not None
            data = stdin["txs"]
        else:
            with open(t8n.options.input_txs, "r") as f:
                data = json.load(f)

        # ... parsing logic ...

@dataclass
class Result:
    """Type that represents the result of a transition execution"""

    difficulty: Any
    base_fee: Any
    state_root: Any = None
    tx_root: Any = None
    receipt_root: Any = None
    # ... other fields ...
```
</file>
</execution-specs>

## Prompt Corrections

Your prompt provides an excellent, detailed structure for the fuzzing infrastructure. Here are a few minor corrections and suggestions based on the provided `execution-specs`:

1.  **Bytecode Fuzzer - `is_valid_opcode`**: Your current implementation of `is_valid_opcode` is a manual list of ranges. A more robust and maintainable approach would be to use the `Ops` enum from `src/ethereum/cancun/vm/instructions/__init__.py`. This ensures you are always fuzzing against the set of opcodes defined in the specification for the target fork.

2.  **Bytecode Fuzzer - `is_valid_jump_target_position`**: Your proposed implementation is a good start. For a canonical implementation, refer to `get_valid_jump_destinations` in `src/ethereum/cancun/vm/runtime.py`. It correctly handles skipping over `PUSH` data, which is a critical part of `JUMPDEST` validation.

3.  **Transaction Fuzzer**: The `FuzzTransaction` struct is well-designed. The `ethereum.cancun.transactions` module provides the definitive structures for all transaction types (`LegacyTransaction`, `AccessListTransaction`, `FeeMarketTransaction`, `BlobTransaction`). Using these as a reference will ensure your generated transactions match the spec precisely. The `AccessListEntry` in your prompt corresponds to the `Access` dataclass in the spec.

4.  **State Fuzzer**: Your `FuzzAccount` struct aligns well with the `Account` dataclass in `src/ethereum/cancun/fork_types.py`. Using the spec's `Account` definition as the ground truth is recommended.

5.  **Main Fuzzer - Execution**: The prompt has `vm.execute_transaction(tx)`. In `execution-specs`, this is a two-step process:
    *   First, a `Message` is created from the transaction and block context using a function like `prepare_message` (from `utils/message.py`).
    *   Then, this `Message` is passed to `process_message_call` (from `vm/interpreter.py`).
    This distinction is important as the `Message` contains a lot of context that the fuzzer might want to control or randomize.

6.  **Crash Detection**: Your prompt correctly identifies the need for crash detection. The `exceptions.py` file (`ExceptionalHalt` and its subclasses) provides a comprehensive list of all possible exceptional halts the fuzzer should aim to trigger and report. This is a much better source than trying to guess all failure modes.

7.  **Crash Reporting & Corpus Management**: The `t8n` tool (`t8n_types.py`) shows how `execution-specs` handles serialization of state (`Alloc`), transactions (`Txs`), and results. This is an excellent model for how your fuzzer could save crashing test cases or interesting inputs to a corpus directory.

By referencing these specific parts of the `execution-specs`, you can ensure your fuzzing infrastructure is robust, spec-compliant, and effective at finding bugs.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/transactions.py">
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
    SetCodeTransaction,
]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/__init__.py">
```python
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # Arithmetic Ops
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    DIV = 0x04
    SDIV = 0x05
    MOD = 0x06
    SMOD = 0x07
    ADDMOD = 0x08
    MULMOD = 0x09
    EXP = 0x0A
    SIGNEXTEND = 0x0B

    # Comparison Ops
    LT = 0x10
    GT = 0x11
    SLT = 0x12
    SGT = 0x13
    EQ = 0x14
    ISZERO = 0x15

    # Bitwise Ops
    AND = 0x16
    OR = 0x17
    XOR = 0x18
    NOT = 0x19
    BYTE = 0x1A
    SHL = 0x1B
    SHR = 0x1C
    SAR = 0x1D

    # Keccak Op
    KECCAK = 0x20

    # Environmental Ops
    ADDRESS = 0x30
    BALANCE = 0x31
    ORIGIN = 0x32
    CALLER = 0x33
    CALLVALUE = 0x34
    CALLDATALOAD = 0x35
    CALLDATASIZE = 0x36
    CALLDATACOPY = 0x37
    CODESIZE = 0x38
    CODECOPY = 0x39
    GASPRICE = 0x3A
    EXTCODESIZE = 0x3B
    EXTCODECOPY = 0x3C
    RETURNDATASIZE = 0x3D
    RETURNDATACOPY = 0x3E
    EXTCODEHASH = 0x3F

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

    # Control Flow Ops
    STOP = 0x00
    JUMP = 0x56
    JUMPI = 0x57
    PC = 0x58
    GAS = 0x5A
    JUMPDEST = 0x5B

    # Storage Ops
    SLOAD = 0x54
    SSTORE = 0x55
    TLOAD = 0x5C
    TSTORE = 0x5D

    # Pop Operation
    POP = 0x50

    # Push Operations
    PUSH0 = 0x5F
    PUSH1 = 0x60
    # ... (PUSH2-PUSH31 omitted for brevity)
    PUSH32 = 0x7F

    # Dup operations
    DUP1 = 0x80
    # ... (DUP2-DUP15 omitted for brevity)
    DUP16 = 0x8F

    # Swap operations
    SWAP1 = 0x90
    # ... (SWAP2-SWAP15 omitted for brevity)
    SWAP16 = 0x9F

    # Memory Operations
    MLOAD = 0x51
    MSTORE = 0x52
    MSTORE8 = 0x53
    MSIZE = 0x59
    MCOPY = 0x5E

    # Log Operations
    LOG0 = 0xA0
    LOG1 = 0xA1
    LOG2 = 0xA2
    LOG3 = 0xA3
    LOG4 = 0xA4

    # System Operations
    CREATE = 0xF0
    CALL = 0xF1
    CALLCODE = 0xF2
    RETURN = 0xF3
    DELEGATECALL = 0xF4
    CREATE2 = 0xF5
    STATICCALL = 0xFA
    REVERT = 0xFD
    SELFDESTRUCT = 0xFF
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/runtime.py">
```python
def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.

    Valid jump destinations are defined as follows:
        * The jump destination is less than the length of the code.
        * The jump destination should have the `JUMPDEST` opcode (0x5B).
        * The jump destination shouldn't be part of the data corresponding to
          `PUSH-N` opcodes.

    Note - Jump destinations are 0-indexed.

    Parameters
    ----------
    code :
        The EVM code which is to be executed.

    Returns
    -------
    valid_jump_destinations: `Set[Uint]`
        The set of valid jump destinations in the code.
    """
    valid_jump_destinations = set()
    pc = Uint(0)

    while pc < ulen(code):
        try:
            current_opcode = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes, as they don't affect the jumpdest
            # analysis. Nevertheless, such invalid opcodes would be caught
            # and raised when the interpreter runs.
            pc += Uint(1)
            continue

        if current_opcode == Ops.JUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= current_opcode.value <= Ops.PUSH32.value:
            # If PUSH-N opcodes are encountered, skip the current opcode along
            # with the trailing data segment corresponding to the PUSH-N
            # opcodes.
            push_data_size = current_opcode.value - Ops.PUSH1.value + 1
            pc += Uint(push_data_size)

        pc += Uint(1)

    return valid_jump_destinations
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/state.py">
```python
@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


@dataclass
class TransientStorage:
    """
    Contains all information that is preserved between message calls
    within a transaction.
    """

    _tries: Dict[Address, Trie[Bytes32, U256]] = field(default_factory=dict)
    _snapshots: List[Dict[Address, Trie[Bytes32, U256]]] = field(
        default_factory=list
    )


def get_account(state: State, address: Address) -> Account:
    # ...
    
def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    # ...

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    # ...
    
def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    # ...
    
def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ...

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ...

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
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
    authorizations: Tuple[Authorization, ...]
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
    disable_precompiles: bool
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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
@dataclass
class MessageCallOutput:
    """
    Output of a particular message call

    Contains the following:

          1. `gas_left`: remaining gas after execution.
          2. `refund_counter`: gas to refund after execution.
          3. `logs`: list of `Log` generated during execution.
          4. `accounts_to_delete`: Contracts which have self-destructed.
          5. `error`: The error from the execution if any.
          6. `return_data`: The output of the execution.
    """

    gas_left: Uint
    refund_counter: U256
    logs: Tuple[Log, ...]
    accounts_to_delete: Set[Address]
    error: Optional[EthereumException]
    return_data: Bytes


def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    output : `MessageCallOutput`
        Output of the message call
    """
    # ... (Implementation details on creating or calling a contract)


def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    ...
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        # ...
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ...
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    ...
    """
    trie_set(
        block_output.transactions_trie,
        rlp.encode(index),
        encode_transaction(tx),
    )

    intrinsic_gas, calldata_floor_gas_cost = validate_transaction(tx)

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

    sender_account = get_account(block_env.state, sender)

    # ... (gas calculation and state updates)

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        access_list_addresses=access_list_addresses,
        access_list_storage_keys=access_list_storage_keys,
        transient_storage=TransientStorage(),
        blob_versioned_hashes=blob_versioned_hashes,
        authorizations=authorizations,
        index_in_block=index,
        tx_hash=get_transaction_hash(encode_transaction(tx)),
        traces=[],
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... (refund calculation and state updates)
```
</file>
</execution-specs>

## Prompt Corrections
The prompt provides a good starting point for fuzzing infrastructure. Here are a few suggestions for improvement based on the `execution-specs`:

1.  **Refine `FuzzTransaction` struct**: The current `FuzzTransaction` struct combines fields from different transaction types (e.g., legacy `gas_price` and EIP-1559 `max_fee_per_gas`). The specs show these are distinct types. It would be more accurate to model `FuzzTransaction` as a Zig `union` or `enum` to represent each transaction type (`Legacy`, `AccessList`, `FeeMarket`, `Blob`) distinctly. This would allow the fuzzer to generate valid, type-specific transactions.

2.  **Explicit `EVM` context**: The fuzzing loop implicitly depends on a correctly configured `VM` and `State`. The prompt should be more explicit about how the `TransactionFuzzer` and `StateFuzzer` interact with a `BlockEnvironment` and `TransactionEnvironment` to set up the execution context for `vm.execute_transaction`, as shown in `prague/fork.py`. This includes setting block-level parameters like `base_fee`, `timestamp`, `coinbase`, etc., which are crucial for correct execution.

3.  **Crash Detection Details**: The prompt's `handle_crash` function catches `anyerror`. It would be beneficial to reference `execution-specs/src/ethereum/prague/vm/exceptions.py`, which lists specific, trappable EVM execution errors like `InvalidJumpDestError`, `StackOverflowError`, and `OutOfGasError`. The fuzzer could be designed to differentiate between expected EVM exceptions (which might not be bugs) and unexpected panics in the Zig implementation (which are likely bugs).



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/registry.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package metrics

import (
	"errors"
	"fmt"
	"reflect"
	"sort"
	"strings"
	"sync"
)

// ErrDuplicateMetric is the error returned by Registry.Register when a metric
// already exists. If you mean to Register that metric you must first
// Unregister the existing metric.
var ErrDuplicateMetric = errors.New("duplicate metric")

// A Registry holds references to a set of metrics by name and can iterate
// over them, calling callback functions provided by the user.
//
// This is an interface to encourage other structs to implement
// the Registry API as appropriate.
type Registry interface {

	// Each call the given function for each registered metric.
	Each(func(string, interface{}))

	// Get the metric by the given name or nil if none is registered.
	Get(string) interface{}

	// GetAll metrics in the Registry.
	GetAll() map[string]map[string]interface{}

	// GetOrRegister gets an existing metric or registers the given one.
	// The interface can be the metric to register if not found in registry,
	// or a function returning the metric for lazy instantiation.
	GetOrRegister(string, interface{}) interface{}

	// Register the given metric under the given name.
	Register(string, interface{}) error

	// RunHealthchecks run all registered healthchecks.
	RunHealthchecks()

	// Unregister the metric with the given name.
	Unregister(string)
}

// StandardRegistry the standard implementation of a Registry uses sync.map
// of names to metrics.
type StandardRegistry struct {
	metrics sync.Map
}

// Each call the given function for each registered metric.
func (r *StandardRegistry) Each(f func(string, interface{})) {
	for name, i := range r.registered() {
		f(name, i)
	}
}

// Get the metric by the given name or nil if none is registered.
func (r *StandardRegistry) Get(name string) interface{} {
	item, _ := r.metrics.Load(name)
	return item
}

// GetOrRegister gets an existing metric or creates and registers a new one. Threadsafe
// alternative to calling Get and Register on failure.
// The interface can be the metric to register if not found in registry,
// or a function returning the metric for lazy instantiation.
func (r *StandardRegistry) GetOrRegister(name string, i interface{}) interface{} {
	// fast path
	cached, ok := r.metrics.Load(name)
	if ok {
		return cached
	}
	if v := reflect.ValueOf(i); v.Kind() == reflect.Func {
		i = v.Call(nil)[0].Interface()
	}
	item, _, ok := r.loadOrRegister(name, i)
	if !ok {
		return i
	}
	return item
}

// Register the given metric under the given name. Returns a ErrDuplicateMetric
// if a metric by the given name is already registered.
func (r *StandardRegistry) Register(name string, i interface{}) error {
	// fast path
	_, ok := r.metrics.Load(name)
	if ok {
		return fmt.Errorf("%w: %v", ErrDuplicateMetric, name)
	}

	if v := reflect.ValueOf(i); v.Kind() == reflect.Func {
		i = v.Call(nil)[0].Interface()
	}
	_, loaded, _ := r.loadOrRegister(name, i)
	if loaded {
		return fmt.Errorf("%w: %v", ErrDuplicateMetric, name)
	}
	return nil
}

// GetAll metrics in the Registry
func (r *StandardRegistry) GetAll() map[string]map[string]interface{} {
	data := make(map[string]map[string]interface{})
	r.Each(func(name string, i interface{}) {
		values := make(map[string]interface{})
		switch metric := i.(type) {
		case *Counter:
			values["count"] = metric.Snapshot().Count()
		case *CounterFloat64:
			values["count"] = metric.Snapshot().Count()
		case *Gauge:
			values["value"] = metric.Snapshot().Value()
		case *GaugeFloat64:
			values["value"] = metric.Snapshot().Value()
		case *Healthcheck:
			values["error"] = nil
			metric.Check()
			if err := metric.Error(); nil != err {
				values["error"] = metric.Error().Error()
			}
		case Histogram:
			h := metric.Snapshot()
			ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			values["count"] = h.Count()
			values["min"] = h.Min()
			values["max"] = h.Max()
			values["mean"] = h.Mean()
			values["stddev"] = h.StdDev()
			values["median"] = ps[0]
			values["75%"] = ps[1]
			values["95%"] = ps[2]
			values["99%"] = ps[3]
			values["99.9%"] = ps[4]
		case *Meter:
			m := metric.Snapshot()
			values["count"] = m.Count()
			values["1m.rate"] = m.Rate1()
			values["5m.rate"] = m.Rate5()
			values["15m.rate"] = m.Rate15()
			values["mean.rate"] = m.RateMean()
		case *Timer:
			t := metric.Snapshot()
			ps := t.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			values["count"] = t.Count()
			values["min"] = t.Min()
			values["max"] = t.Max()
			values["mean"] = t.Mean()
			values["stddev"] = t.StdDev()
			values["median"] = ps[0]
			values["75%"] = ps[1]
			values["95%"] = ps[2]
			values["99%"] = ps[3]
			values["99.9%"] = ps[4]
			values["1m.rate"] = t.Rate1()
			values["5m.rate"] = t.Rate5()
			values["15m.rate"] = t.Rate15()
			values["mean.rate"] = t.RateMean()
		}
		data[name] = values
	})
	return data
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
package metrics

import (
	"sync/atomic"
)

// GetOrRegisterCounter returns an existing Counter or constructs and registers
// a new Counter.
func GetOrRegisterCounter(name string, r Registry) *Counter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewCounter).(*Counter)
}

// NewCounter constructs a new Counter.
func NewCounter() *Counter {
	return new(Counter)
}

// CounterSnapshot is a read-only copy of a Counter.
type CounterSnapshot int64

// Count returns the count at the time the snapshot was taken.
func (c CounterSnapshot) Count() int64 { return int64(c) }

// Counter hold an int64 value that can be incremented and decremented.
type Counter atomic.Int64

// Clear sets the counter to zero.
func (c *Counter) Clear() {
	(*atomic.Int64)(c).Store(0)
}

// Dec decrements the counter by the given amount.
func (c *Counter) Dec(i int64) {
	(*atomic.Int64)(c).Add(-i)
}

// Inc increments the counter by the given amount.
func (c *Counter) Inc(i int64) {
	(*atomic.Int64)(c).Add(i)
}

// Snapshot returns a read-only copy of the counter.
func (c *Counter) Snapshot() CounterSnapshot {
	return CounterSnapshot((*atomic.Int64)(c).Load())
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
package metrics

import (
	"math"
	"sync"
	"sync/atomic"
	"time"
)

// GetOrRegisterMeter returns an existing Meter or constructs and registers a
// new Meter.
// Be sure to unregister the meter from the registry once it is of no use to
// allow for garbage collection.
func GetOrRegisterMeter(name string, r Registry) *Meter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewMeter).(*Meter)
}

// NewMeter constructs a new Meter and launches a goroutine.
// Be sure to call Stop() once the meter is of no use to allow for garbage collection.
func NewMeter() *Meter {
	m := newMeter()
	arbiter.add(m)
	return m
}

// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// Count returns the count of events at the time the snapshot was taken.
func (m *MeterSnapshot) Count() int64 { return m.count }

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (m *MeterSnapshot) Rate1() float64 { return m.rate1 }

// Rate5 returns the five-minute moving average rate of events per second at
// the time the snapshot was taken.
func (m *MeterSnapshot) Rate5() float64 { return m.rate5 }

// Rate15 returns the fifteen-minute moving average rate of events per second
// at the time the snapshot was taken.
func (m *MeterSnapshot) Rate15() float64 { return m.rate15 }

// RateMean returns the meter's mean rate of events per second at the time the
// snapshot was taken.
func (m *MeterSnapshot) RateMean() float64 { return m.rateMean }

// Meter count events to produce exponentially-weighted moving average rates
// at one-, five-, and fifteen-minutes and a mean rate.
type Meter struct {
	count     atomic.Int64
	uncounted atomic.Int64 // not yet added to the EWMAs
	rateMean  atomic.Uint64

	a1, a5, a15 *EWMA
	startTime   time.Time
	stopped     atomic.Bool
}

func newMeter() *Meter {
	return &Meter{
		a1:        NewEWMA1(),
		a5:        NewEWMA5(),
		a15:       NewEWMA15(),
		startTime: time.Now(),
	}
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

// Snapshot returns a read-only copy of the meter.
func (m *Meter) Snapshot() *MeterSnapshot {
	return &MeterSnapshot{
		count:    m.count.Load() + m.uncounted.Load(),
		rate1:    m.a1.Snapshot().Rate(),
		rate5:    m.a5.Snapshot().Rate(),
		rate15:   m.a15.Snapshot().Rate(),
		rateMean: math.Float64frombits(m.rateMean.Load()),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/log.go">
```go
package metrics

import (
	"time"
)

type Logger interface {
	Printf(format string, v ...interface{})
}

func Log(r Registry, freq time.Duration, l Logger) {
	LogScaled(r, freq, time.Nanosecond, l)
}

// LogScaled outputs each metric in the given registry periodically using the given
// logger. Print timings in `scale` units (eg time.Millisecond) rather than nanos.
func LogScaled(r Registry, freq time.Duration, scale time.Duration, l Logger) {
	du := float64(scale)
	duSuffix := scale.String()[1:]

	for range time.Tick(freq) {
		r.Each(func(name string, i interface{}) {
			switch metric := i.(type) {
			case *Counter:
				l.Printf("counter %s\n", name)
				l.Printf("  count:       %9d\n", metric.Snapshot().Count())
			case *CounterFloat64:
				l.Printf("counter %s\n", name)
				l.Printf("  count:       %f\n", metric.Snapshot().Count())
			case *Gauge:
				l.Printf("gauge %s\n", name)
				l.Printf("  value:       %9d\n", metric.Snapshot().Value())
			case *GaugeFloat64:
				l.Printf("gauge %s\n", name)
				l.Printf("  value:       %f\n", metric.Snapshot().Value())
			case *GaugeInfo:
				l.Printf("gauge %s\n", name)
				l.Printf("  value:       %s\n", metric.Snapshot().Value())
			case Histogram:
				h := metric.Snapshot()
				ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
				l.Printf("histogram %s\n", name)
				l.Printf("  count:       %9d\n", h.Count())
				l.Printf("  min:         %9d\n", h.Min())
				l.Printf("  max:         %9d\n", h.Max())
				l.Printf("  mean:        %12.2f\n", h.Mean())
				l.Printf("  stddev:      %12.2f\n", h.StdDev())
				l.Printf("  median:      %12.2f\n", ps[0])
				l.Printf("  75%%:         %12.2f\n", ps[1])
				l.Printf("  95%%:         %12.2f\n", ps[2])
				l.Printf("  99%%:         %12.2f\n", ps[3])
				l.Printf("  99.9%%:       %12.2f\n", ps[4])
			case *Meter:
				m := metric.Snapshot()
				l.Printf("meter %s\n", name)
				l.Printf("  count:       %9d\n", m.Count())
				l.Printf("  1-min rate:  %12.2f\n", m.Rate1())
				l.Printf("  5-min rate:  %12.2f\n", m.Rate5())
				l.Printf("  15-min rate: %12.2f\n", m.Rate15())
				l.Printf("  mean rate:   %12.2f\n", m.RateMean())
			case *Timer:
				t := metric.Snapshot()
				ps := t.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
				l.Printf("timer %s\n", name)
				l.Printf("  count:       %9d\n", t.Count())
				l.Printf("  min:         %12.2f%s\n", float64(t.Min())/du, duSuffix)
				l.Printf("  max:         %12.2f%s\n", float64(t.Max())/du, duSuffix)
				l.Printf("  mean:        %12.2f%s\n", t.Mean()/du, duSuffix)
				l.Printf("  stddev:      %12.2f%s\n", t.StdDev()/du, duSuffix)
				l.Printf("  median:      %12.2f%s\n", ps[0]/du, duSuffix)
				l.Printf("  75%%:         %12.2f%s\n", ps[1]/du, duSuffix)
				l.Printf("  95%%:         %12.2f%s\n", ps[2]/du, duSuffix)
				l.Printf("  99%%:         %12.2f%s\n", ps[3]/du, duSuffix)
				l.Printf("  99.9%%:       %12.2f%s\n", ps[4]/du, duSuffix)
				l.Printf("  1-min rate:  %12.2f\n", t.Rate1())
				l.Printf("  5-min rate:  %12.2f\n", t.Rate5())
				l.Printf("  15-min rate: %12.2f\n", t.Rate15())
				l.Printf("  mean rate:   %12.2f\n", t.RateMean())
			}
		})
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/eofparse_test.go">
```go
// Copyright 2024 The go-ethereum Authors
// This file is part of go-ethereum.
//
// go-ethereum is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// go-ethereum is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with go-ethereum. If not, see <http://www.gnu.org/licenses/>.

package main

import (
	"bufio"
	"bytes"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/vm"
)

func FuzzEofParsing(f *testing.F) {
	// Seed with corpus from execution-spec-tests
	for i := 0; ; i++ {
		fname := fmt.Sprintf("testdata/eof/eof_corpus_%d.txt", i)
		corpus, err := os.Open(fname)
		if err != nil {
			break
		}
		f.Logf("Reading seed data from %v", fname)
		scanner := bufio.NewScanner(corpus)
		scanner.Buffer(make([]byte, 1024), 10*1024*1024)
		for scanner.Scan() {
			s := scanner.Text()
			if len(s) >= 2 && strings.HasPrefix(s, "0x") {
				s = s[2:]
			}
			b, err := hex.DecodeString(s)
			if err != nil {
				panic(err) // rotten corpus
			}
			f.Add(b)
		}
		corpus.Close()
		if err := scanner.Err(); err != nil {
			panic(err) // rotten corpus
		}
	}
	// And do the fuzzing
	f.Fuzz(func(t *testing.T, data []byte) {
		var (
			jt = vm.NewEOFInstructionSetForTesting()
			c  vm.Container
		)
		cpy := common.CopyBytes(data)
		if err := c.UnmarshalBinary(data, true); err == nil {
			c.ValidateCode(&jt, true)
			if have := c.MarshalBinary(); !bytes.Equal(have, data) {
				t.Fatal("Unmarshal-> Marshal failure!")
			}
		}
		if err := c.UnmarshalBinary(data, false); err == nil {
			c.ValidateCode(&jt, false)
			if have := c.MarshalBinary(); !bytes.Equal(have, data) {
				t.Fatal("Unmarshal-> Marshal failure!")
			}
		}
		if !bytes.Equal(cpy, data) {
			panic("data modified during unmarshalling")
		}
	})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/runtime/runtime.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package runtime implements the EVM execution runtime.
package runtime

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

// Config is a basic type specifying the amount of gas needed for a run.
type Config struct {
	ChainConfig *params.ChainConfig
	Difficulty  *big.Int
	Origin      common.Address
	Coinbase    common.Address
	BlockNumber *big.Int
	Time        uint64
	GasLimit    uint64
	GasPrice    *big.Int
	Value       *big.Int
	Debug       bool
	EVMConfig   vm.Config

	// PrunableState is the state database of a given block, which is not yet
	// committed to the trie. It's used for state access and witness creation.
	PrunableState state.StateDBCloner

	// For state tests.
	State                       *state.StateDB
	ParentBeaconBlockRoot       *common.Hash
	ParentBlobs                 []types.Blob
	ParentBlobGasUsed           *uint64
	ParentExcessBlobGas         *uint64
	ParentGasLimit              *uint64
	ParentGasUsed               *uint64
	ParentTimestamp             *uint64
	ParentDifficulty            *big.Int
	ParentMixDigest             *common.Hash
	BlobHashes                  []common.Hash
	BlobBaseFee                 *big.Int
	BaseFee                     *big.Int
	DisallowBaseFee             bool
	DisallowGasPrice            bool
	DisallowBlobs               bool
	DisallowEIP7702             bool
	OverrideCancunTime          *uint64
	OverridePragueTime          *uint.Int
	OverrideOsakaTime           *uint.Int
	OverrideEnableVerkleAtGenesis bool
}

// Execute is a generic EVM executor, which can be used for various purposes,
// including contract creation, calls, and state validation.
func Execute(code, input []byte, cfg *Config) ([]byte, *state.StateDB, error) {
	if cfg == nil {
		cfg = new(Config)
	}
	if cfg.EVMConfig.Tracer == nil && cfg.Debug {
		// TODO: This is only really needed for state tests, which is fine
		// for now. In the future we should consider moving this to a better
		// place.
		cfg.EVMConfig.Tracer = vm.NewStructLogger(nil)
	}

	if cfg.State == nil {
		cfg.State, _ = state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	}
	if cfg.ChainConfig == nil {
		cfg.ChainConfig = params.TestChainConfig
	}
	if cfg.Time == 0 {
		cfg.Time = 1337
	}
	if cfg.Difficulty == nil {
		cfg.Difficulty = new(big.Int)
	}
	if cfg.BlockNumber == nil {
		cfg.BlockNumber = new(big.Int)
	}
	if cfg.GasLimit == 0 {
		cfg.GasLimit = 1000000000
	}
	if cfg.GasPrice == nil {
		cfg.GasPrice = new(big.Int)
	}
	if cfg.Value == nil {
		cfg.Value = new(big.Int)
	}

	var (
		from  = cfg.Origin
		to    = common.Address{}
		block = types.NewBlockWithHeader(&types.Header{
			Coinbase:    cfg.Coinbase,
			Difficulty:  cfg.Difficulty,
			Number:      cfg.BlockNumber,
			GasLimit:    cfg.GasLimit,
			Time:        cfg.Time,
			BaseFee:     cfg.BaseFee,
			BlobHashes:  cfg.BlobHashes,
			ExcessBlobGas: new(uint64),
		})
		gp      = new(core.GasPool).AddGas(block.GasLimit())
		msg     = core.NewMessage(from, &to, 0, cfg.Value, cfg.GasLimit, cfg.GasPrice, cfg.GasPrice, cfg.GasPrice, input, nil, false)
		chain   = &core.HeaderChain{}
		context = core.NewEVMBlockContext(block.Header(), chain, nil)
	)
	context.BlobBaseFee = cfg.BlobBaseFee
	context.Random = cfg.ParentMixDigest

	vmenv := vm.NewEVM(context, cfg.State, cfg.ChainConfig, cfg.EVMConfig)
	ret, _, err := vmenv.Call(from, to, input, cfg.GasLimit, cfg.Value)
	return ret, cfg.State, err
}

// Call executes the given code on the given input, and uses the environment for the execution context.
func Call(addr common.Address, input []byte, cfg *Config) ([]byte, uint64, error) {
	if cfg == nil {
		cfg = new(Config)
	}
	if cfg.EVMConfig.Tracer == nil && cfg.Debug {
		cfg.EVMConfig.Tracer = vm.NewStructLogger(nil)
	}

	if cfg.State == nil {
		cfg.State, _ = state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	}
	if cfg.ChainConfig == nil {
		cfg.ChainConfig = params.TestChainConfig
	}
	if cfg.Time == 0 {
		cfg.Time = 1337
	}
	if cfg.Difficulty == nil {
		cfg.Difficulty = new(big.Int)
	}
	if cfg.BlockNumber == nil {
		cfg.BlockNumber = new(big.Int)
	}
	if cfg.GasLimit == 0 {
		cfg.GasLimit = 1000000000
	}
	if cfg.GasPrice == nil {
		cfg.GasPrice = new(big.Int)
	}
	if cfg.Value == nil {
		cfg.Value = new(big.Int)
	}

	var (
		from  = cfg.Origin
		to    = addr
		block = types.NewBlockWithHeader(&types.Header{
			Coinbase:    cfg.Coinbase,
			Difficulty:  cfg.Difficulty,
			Number:      cfg.BlockNumber,
			GasLimit:    cfg.GasLimit,
			Time:        cfg.Time,
			BaseFee:     cfg.BaseFee,
			BlobHashes:  cfg.BlobHashes,
			ExcessBlobGas: new(uint64),
		})
		gp      = new(core.GasPool).AddGas(block.GasLimit())
		msg     = core.NewMessage(from, &to, 0, cfg.Value, cfg.GasLimit, cfg.GasPrice, cfg.GasPrice, cfg.GasPrice, input, nil, false)
		chain   = &core.HeaderChain{}
		context = core.NewEVMBlockContext(block.Header(), chain, nil)
	)
	context.Random = cfg.ParentMixDigest
	context.BlobBaseFee = cfg.BlobBaseFee

	vmenv := vm.NewEVM(context, cfg.State, cfg.ChainConfig, cfg.EVMConfig)
	result, err := core.ApplyMessage(vmenv, msg, gp)

	return result.ReturnData, result.UsedGas, err
}

// Create executes the given code on the given input, and uses the environment for the execution context.
func Create(input []byte, cfg *Config) ([]byte, common.Address, uint64, error) {
	if cfg == nil {
		cfg = new(Config)
	}
	if cfg.EVMConfig.Tracer == nil && cfg.Debug {
		cfg.EVMConfig.Tracer = vm.NewStructLogger(nil)
	}

	if cfg.State == nil {
		cfg.State, _ = state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	}
	if cfg.ChainConfig == nil {
		cfg.ChainConfig = params.TestChainConfig
	}
	if cfg.Time == 0 {
		cfg.Time = 1337
	}
	if cfg.Difficulty == nil {
		cfg.Difficulty = new(big.Int)
	}
	if cfg.BlockNumber == nil {
		cfg.BlockNumber = new(big.Int)
	}
	if cfg.GasLimit == 0 {
		cfg.GasLimit = 1000000000
	}
	if cfg.GasPrice == nil {
		cfg.GasPrice = new(big.Int)
	}
	if cfg.Value == nil {
		cfg.Value = new(big.Int)
	}

	var (
		from    = cfg.Origin
		block   = types.NewBlockWithHeader(&types.Header{})
		gp      = new(core.GasPool).AddGas(block.GasLimit())
		msg     = core.NewMessage(from, nil, 0, cfg.Value, cfg.GasLimit, cfg.GasPrice, cfg.GasPrice, cfg.GasPrice, input, nil, false)
		chain   = &core.HeaderChain{}
		context = core.NewEVMBlockContext(block.Header(), chain, nil)
	)
	context.BlobBaseFee = cfg.BlobBaseFee
	context.Random = cfg.ParentMixDigest

	vmenv := vm.NewEVM(context, cfg.State, cfg.ChainConfig, cfg.EVMConfig)
	result, err := core.ApplyMessage(vmenv, msg, gp)
	return result.ReturnData, crypto.CreateAddress(from, 0), result.UsedGas, err
}
```
</go-ethereum>

## Prompt Corrections
The prompt's Zig implementation stubs for fuzzing are excellent and very detailed. They show a clear plan for building the infrastructure. No corrections are needed for the prompt itself, as it accurately describes the feature request. The provided `go-ethereum` snippets offer valuable real-world context and patterns for implementing the described fuzzing framework, particularly in the areas of metrics/statistics and providing examples of fuzz tests in the Geth codebase. The `metrics` package from Go-ethereum is a strong example of how to build a robust statistics collection system, which is directly applicable to the `FuzzStats` and `CrashReporter` components requested in the prompt. The `FuzzEofParsing` test shows a practical application of fuzzing within the Geth project itself.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/fuzzing/state_fuzzer.go">
```go
package fuzzing

import (
	"bytes"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
)

// fuzzTest is the structure that is RLP-decoded from the input to the fuzzer
type fuzzTest struct {
	Statedb  map[common.Address][]byte
	Block    *types.Header
	Txs      []*types.Transaction
	Gasprice *big.Int
	Config   *params.ChainConfig
}

// Fuzz is the entry point for the fuzzer. It accepts a []byte blob, which is
// RLP-decoded into a 'fuzzTest' structure.
// The test will then apply the transactions to the provided state and on top of
// the provided block.
func Fuzz(data []byte) int {
	var test fuzzTest
	if err := rlp.Decode(bytes.NewReader(data), &test); err != nil {
		return 0
	}
	if test.Block == nil || test.Config == nil || len(test.Txs) == 0 {
		return 0
	}
	// Create a pristine state database
	statedb, err := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	if err != nil {
		panic(err)
	}
	// Populate the pristine state with the provided accounts
	for addr, rlpbytes := range test.Statedb {
		var acc types.StateAccount
		if err := rlp.DecodeBytes(rlpbytes, &acc); err != nil {
			// skip this account if invalid rlp
			continue
		}
		statedb.SetNonce(addr, acc.Nonce)
		statedb.SetBalance(addr, acc.Balance, vm.Config{})
		statedb.SetCode(addr, acc.CodeHash)
		statedb.SetState(addr, common.BytesToHash(acc.Root.Bytes()), common.Hash{})
	}
	// Create a new environment, and apply the transactions
	var (
		signer       = types.NewLondonSigner(test.Config.ChainID)
		gaspool      = new(core.GasPool).AddGas(test.Block.GasLimit)
		blockContext = core.NewEVMBlockContext(test.Block, nil, nil)
		vmConfig     = vm.Config{}
	)
	// Iterate over the transactions and apply them
	for i, tx := range test.Txs {
		// In case of panic, we can find out what tx caused it
		statedb.SetTxContext(tx.Hash(), i)
		from, _ := types.Sender(signer, tx)
		msg, err := core.TransactionToMessage(tx, signer, test.Block.BaseFee)
		if err != nil {
			// In case of error, we don't know the from address.
			// But that's ok, we can't continue anyway
			continue
		}
		msg.From = from
		st := core.NewStateTransition(vm.NewEVM(blockContext, statedb, test.Config, vmConfig), msg, gaspool)
		st.Precheck()
		st.ApplyMessage()
	}
	return 1
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/fuzzing/evm_fuzzer.go">
```go
package fuzzing

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

var (
	fuzzChainConfig = params.TestChainConfig
	fuzzVmConfig    = vm.Config{}
	fuzzAddress     = common.HexToAddress("0x1337")
)

func init() {
	fuzzChainConfig.ChainID = big.NewInt(1)
	fuzzChainConfig.ConstantinopleBlock = new(big.Int)
	fuzzChainConfig.PetersburgBlock = new(big.Int)
	fuzzChainConfig.IstanbulBlock = new(big.Int)
	fuzzChainConfig.BerlinBlock = new(big.Int)
	fuzzChainConfig.LondonBlock = new(big.Int)
}

// Fuzz is the entry point for the fuzzer.
func Fuzz(data []byte) int {
	if len(data) == 0 {
		return 0
	}
	var (
		statedb, _ = state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
		evm        = vm.NewEVM(vm.BlockContext{}, vm.TxContext{}, statedb, fuzzChainConfig, fuzzVmConfig)
		gas        = uint64(100000)
	)
	statedb.CreateAccount(fuzzAddress)
	ret, _, err := evm.Call(vm.AccountRef(fuzzAddress), fuzzAddress, data, gas, big.NewInt(0))
	if err != nil {
		// EVM error, return 1 to increase score
		return 1
	}
	if len(ret) == 0 {
		// empty return, fuzz again
		return 0
	}
	return 1
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// analyse analyses the given code and returns the findings.
func analyse(code []byte) (jumpdests bitvec) {
	jumpdests = make(bitvec, len(code))

	for i := 0; i < len(code); {
		var (
			op     = OpCode(code[i])
			opsize = op.opsize()
		)
		if op == JUMPDEST {
			jumpdests.set(uint(i))
		}
		i += opsize
	}
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_blob.go">
```go
package types

import (
	"errors"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// BlobTx is the transaction data of a blob transaction.
type BlobTx struct {
	ChainID    *uint256.Int    // destination chain ID
	Nonce      uint64          // nonce of sender account
	GasTipCap  *uint256.Int    // max priority fee per gas
	GasFeeCap  *uint256.Int    // max fee per gas
	Gas        uint64          // gas limit
	To         common.Address  // destination address
	Value      *uint256.Int    // contract invocation input data
	Data       []byte          // rlp-encoded transaction body
	AccessList AccessList      // EIP-2930 access list
	BlobFeeCap *uint256.Int    // max fee per blob gas
	BlobHashes []common.Hash   // EIP-4844 blob versioned hashes
	Sidecar    *BlobTxSidecar  // EIP-4844 blob sidecar
	V, R, S    *uint256.Int    // signature values
	hash       common.Hash     // memoized hash
	from       common.Address  // memoized sender
	size       uint64          // memoized size
	err        atomic.Value[error] // memoized error
}

// BlobTxSidecar contains the blobs of a blob transaction.
type BlobTxSidecar struct {
	Blobs       []kzg4844.Blob
	Commitments []kzg4844.Commitment
	Proofs      []kzg4844.Proof
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
// Various error messages which can be returned by the EVM.
var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxInitCodeSizeExceeded  = errors.New("max initcode size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	ErrReturnDataOutOfBounds    = errors.New("return data out of bounds")
	ErrGasUintOverflow          = errors.New("gas uint64 overflow")
	ErrInvalidCode              = errors.New("invalid code: must not begin with 0xef")

	errStopToken = errors.New("stop token") // internal stop token, needed for vm logging
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/account.go">
```go
// StateAccount is the Ethereum consensus representation of accounts.
// These objects are stored in the state trie.
type StateAccount struct {
	Nonce    uint64
	Balance  *big.Int
	Root     common.Hash // merkle root of the storage trie
	CodeHash []byte
}

// Account is a wrapper around StateAccount with some helper functions for the testing framework.
type Account struct {
	Balance *big.Int
	Nonce   uint64
	Storage map[common.Hash]common.Hash
	Code    []byte
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ExecutionResult includes all output after executing given evm
// message no matter the execution itself is successful or not.
type ExecutionResult struct {
	UsedGas    uint64 // Total used gas, not including the refunded gas
	MaxUsedGas uint64 // Maximum gas consumed during execution, excluding gas refunds.
	Err        error  // Any error encountered during the execution(listed in core/vm/errors.go)
	ReturnData []byte // Returned data from evm(function result or data supplied with revert opcode)
}

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

// stateTransition represents a state transition.
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... pre-check logic ...
	if err := st.preCheck(); err != nil {
		return nil, err
	}
    // ... intrinsic gas calculation ...
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
		// ...
		// Execute the transaction's call.
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// ... refund and fee logic ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/fuzz/evm.go">
```go
package fuzz

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

var (
	fuzzChainConfig = params.TestChainConfig
	fuzzVmConfig    = vm.Config{}
)

// Fuzz is a go-fuzz compatible fuzz testing entry point.
func Fuzz(data []byte) int {
	if len(data) == 0 {
		return -1 // Invalid, but no panic
	}
	state, err := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	if err != nil {
		panic(err)
	}
	// Create a dummy environment for the EVM
	evm := vm.NewEVM(vm.BlockContext{}, vm.TxContext{}, state, fuzzChainConfig, fuzzVmConfig)

	// Execute the provided code and check for panics
	var (
		from       = common.Address{}
		to         = common.Address{}
		gas        = uint64(100000)
		value      = new(big.Int)
		statedb, _ = evm.StateDB.(vm.StateDB)
	)
	ret, _, err := evm.Call(vm.AccountRef(from), to, data, gas, value)
	if err != nil {
		// All non-nil errors are OK, the fuzzer will find the interesting ones.
		// We just need to avoid crashing.
		return 0
	}
	// The ret value is not checked, the fuzzer will find any interesting values.
	// It's just here to prevent the compiler from optimizing it away.
	_ = ret
	return 1
}

// FuzzEVM is a go-fuzz compatible fuzz testing entry point, which provides
// a structured way for fuzzing.
//
// The fuzzer provides a stream of bytes, which is then decoded into a set of
// parameters for the EVM. The input format is as follows:
//
//	- code:                remaining bytes
//	- gas:                 4 bytes
//	- price:               32 bytes
//	- value:               32 bytes
//	- caller:              20 bytes
//	- address:             20 bytes
//	- origin:              20 bytes
//	- block number:        8 bytes
//	- block time:          8 bytes
//	- block gas limit:     8 bytes
//	- block difficulty:    32 bytes
//	- block basefee:       32 bytes
//	- prestate (optional): RLP-encoded account states
func FuzzEVM(data []byte) int {
	var (
		gas                 uint64
		price, value        common.Hash
		caller, addr, origin common.Address
		blocknum, blocktime uint64
		gaslimit            uint64
		difficulty, baseFee common.Hash
		prestate            []byte
		code                []byte
	)
	// Some sanity check for input data.
	if len(data) < 4+32+32+20+20+20+8+8+8+32+32 {
		return 0
	}
	gas = uint64(data[0]) | uint64(data[1])<<8 | uint64(data[2])<<16 | uint64(data[3])<<24
	data = data[4:]

	price.SetBytes(data[:32])
	data = data[32:]

	value.SetBytes(data[:32])
	data = data[32:]

	caller.SetBytes(data[:20])
	data = data[20:]

	addr.SetBytes(data[:20])
	data = data[20:]

	origin.SetBytes(data[:20])
	data = data[20:]

	// [...] more field parsing

	if len(data) > 2 {
		// Check for presence of optional prestate data. It's marked as 'p' 's'.
		if data[0] == 'p' && data[1] == 's' {
			prestate = data[2:]
			code = nil
		} else {
			code = data
		}
	} else {
		code = data
	}
	fuzzEVM(code, gas, price.Big(), value.Big(), caller, addr, origin, blocknum, gaslimit, blocktime, difficulty.Big(), baseFee.Big(), prestate)
	return 1
}

// fuzzEVM is a helper to run the EVM fuzzer.
func fuzzEVM(code []byte, gas uint64, gasprice, value *big.Int, caller, addr, origin common.Address, blocknum, gaslimit, timestamp uint64, difficulty, basefee *big.Int, prestate []byte) {
	// [...] state and context setup
	// ...
	// Execute the provided code and check for panics.
	vm.NewEVM(bctx, tctx, st, params.MainnetChainConfig, vm.Config{}).Call(
		vm.AccountRef(caller),
		addr,
		code,
		gas,
		value,
	)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
package vm

import (
	"hash"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
)

// Interpreter is an EVM interpreter for use with transactions and contracts.
// The Interpreter should be considered a single use type.
type Interpreter struct {
	// evm is the pointer to the parent EVM and holds all the methods required
	// to interact with the chain on a contract's behalf.
	evm *EVM
	// cfg is the configuration for the current interpreter instance.
	cfg Config

	// gas is the amount of gas available for the current execution.
	gas uint64

	// [...] other fields
}

// Run executes the given code against the interpreter.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in a readOnly section
	if in.readOnly && !readOnly {
		in.readOnly = true
	}
	defer func() { in.readOnly = readOnly }() //
	in.returnStack.push(in.returnData)
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = in.Memory   // bound memory
		stack       = in.Stack    // bound stack
		callContext = in.callCtx   // a copy of call context
		// For optimisation, the pc (program counter) is stored where the code is
		// stored. The bytecode handler will also update the pc to the next instruction.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for tracer
		logged  bool   // deferred logger
	)
	contract.Input = input

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
	// Capture the tracer and call the enter function if it's not nil
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureEnter(in.evm, contract.Address(), to, input, in.gas, in.evm.depth)
	}
	defer func() {
		// If the tracer is not nil, capture the exit event
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureExit(ret, gasCopy-in.gas, err)
		}
	}()

	// The Interpreter main run loop. This loop will continue until execution of
	// operation codes completes with either a `STOP` or `RETURN` opcode or an
	// error occurs.
	for {
		// [...] trace logging
		
		// Get next opcode from the jump table
		op = contract.GetOp(pc)
		operation := in.evm.interpreter.opset.ops[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// [...]

		// Static calls can't write to state
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}

		cost, err = operation.gasCost(in.evm, contract, stack, mem, in.gas)
		if err != nil || !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}
		// [...]
		// execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
		if err != nil {
			return nil, err
		}
		// [...]
		
		pc++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
package vm

// OpCode is a single byte representing an instruction.
type OpCode byte

// [...] a long list of const OpCode definitions like:
const (
	// 0x0 range - arithmetic ops.
	STOP OpCode = iota
	ADD
	MUL
	SUB
	DIV
	SDIV
	MOD
	SMOD
	ADDMOD
	MULMOD
	EXP
	SIGNEXTEND
)

// OpCodeToString contains the string representation of each opcode.
var OpCodeToString = map[OpCode]string{
	STOP: "STOP",
	ADD:  "ADD",
	MUL:  "MUL",
	// ... and so on for all opcodes
}

// String implements the Stringer interface.
func (op OpCode) String() string {
	return OpCodeToString[op]
}

// opCode gas costs
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
package vm

// JumpdestAnalysis performs a jump destination analysis on the given code.
// The results are stored in a bit vector where a 1 denotes a valid jump
// destination.
func JumpdestAnalysis(code []byte) (dests bitvec) {
	// The code is not mutated, and the analysis is not stored, so there is no
	// need to copy it.
	dests = bitvec(make([]byte, len(code)/8+1))
	for pc := uint64(0); pc < uint64(len(code)); {
		var op OpCode = OpCode(code[pc])
		if op == JUMPDEST {
			dests.set(pc)
		} else if op >= PUSH1 && op <= PUSH32 {
			pc += uint64(op - PUSH1 + 1)
		}
		pc++
	}
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
package types

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

// Transaction types.
const (
	LegacyTxType = iota
	AccessListTxType
	DynamicFeeTxType
	BlobTxType
)

// TxData is the underlying data of a transaction.
// It is implemented by LegacyTx, AccessListTx, DynamicFeeTx and BlobTx.
type TxData interface {
	// [...]
	txType() byte // returns the type of the transaction
	// [...]
	gas() uint64         // returns the gas limit of the transaction
	gasPrice() *big.Int  // returns the gas price of the transaction
	gasTipCap() *big.Int // returns the gas tip cap of the transaction
	gasFeeCap() *big.Int // returns the gas fee cap of the transaction
	value() *big.Int     // returns the ether amount of the transaction
	nonce() uint64       // returns the sender account nonce of the transaction
	to() *common.Address // returns the recipient address of the transaction
	// [...]
}

// A Transaction is an opaque container for the transaction data.
type Transaction struct {
	inner TxData    // underlying transaction data
	time  time.Time // timestamp of inclusion in the blockchain
	// [...]
}


// LegacyTx is the transaction data of regular Ethereum transactions.
type LegacyTx struct {
	Nonce    uint64
	GasPrice *big.Int
	Gas      uint64
	To       *common.Address `rlp:"nil"` // nil means contract creation
	Value    *big.Int
	Data     []byte

	// Signature values
	V *big.Int `json:"v" gencodec:"required"`
	R *big.Int `json:"r" gencodec:"required"`
	S *big.Int `json:"s" gencodec:"required"`
}

// AccessListTx is the transaction data of EIP-2930 access list transactions.
type AccessListTx struct {
	ChainID    *big.Int
	Nonce      uint64
	GasPrice   *big.Int
	Gas        uint64
	To         *common.Address `rlp:"nil"`
	Value      *big.Int
	Data       []byte
	AccessList AccessList

	// Signature values
	V *big.Int `json:"v" gencodec:"required"`
	R *big.Int `json:"r" gencodec:"required"`
	S *big.Int `json:"s" gencodec:"required"`
}

// DynamicFeeTx is the transaction data of EIP-1559 transactions.
type DynamicFeeTx struct {
	ChainID   *big.Int
	Nonce     uint64
	GasTipCap *big.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap *big.Int // a.k.a. maxFeePerGas
	Gas       uint64
	To        *common.Address `rlp:"nil"`
	Value     *big.Int
	Data      []byte
	AccessList AccessList

	// Signature values
	V *big.Int `json:"v" gencodec:"required"`
	R *big.Int `json:"r" gencodec:"required"`
	S *big.Int `json:"s" gencodec:"required"`
}

// AccessList is an EIP-2930 access list.
type AccessList []AccessTuple

// AccessTuple is the element type of an access list.
type AccessTuple struct {
	Address     common.Address
	StorageKeys []common.Hash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/blob_tx.go">
```go
package types

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/rlp"
)

const (
	// BlobTxType is the type identifier for the EIP-4844 blob transaction.
	BlobTxType = 0x3
)

// BlobTx is the transaction data of EIP-4844 blob transactions.
type BlobTx struct {
	ChainID    *big.Int
	Nonce      uint64
	GasTipCap  *big.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *big.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         *common.Address
	Value      *big.Int
	Data       []byte
	AccessList AccessList

	MaxFeePerDataGas *big.Int
	BlobHashes       []common.Hash

	// Signature values
	V *big.Int
	R *big.Int
	S *big.Int

	// Sidecar data, not included in RLP encoding.
	Sidecar *BlobTxSidecar `rlp:"-"`
}

// BlobTxSidecar contains the blobs of a blob transaction.
type BlobTxSidecar struct {
	Blobs       []kzg4844.Blob
	Commitments []kzg4844.Commitment
	Proofs      []kzg4844.Proof
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/genesis.go">
```go
package core

import (
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
)

// Genesis specifies the header fields, difficulty, and funds of the genesis
// block.
type Genesis struct {
	Config     *params.ChainConfig `json:"config"`
	Nonce      uint64              `json:"nonce"`
	Timestamp  uint64              `json:"timestamp"`
	ExtraData  []byte              `json:"extraData"`
	GasLimit   uint64              `json:"gasLimit"   gencodec:"required"`
	Difficulty *big.Int            `json:"difficulty"  gencodec:"required"`
	Mixhash    common.Hash         `json:"mixHash"`
	Coinbase   common.Address      `json:"coinbase"`
	Alloc      GenesisAlloc        `json:"alloc"       gencodec:"required"`

	// These fields are used for consensus tests. Please don't use them
	// in production.
	Number     uint64      `json:"number"`
	GasUsed    uint64      `json:"gasUsed"`
	ParentHash common.Hash `json:"parentHash"`
	BaseFee    *big.Int    `json:"baseFeePerGas"`
}

// GenesisAlloc specifies the initial state that is part of the genesis block.
type GenesisAlloc map[common.Address]GenesisAccount

// GenesisAccount is an account in the state of the genesis block.
type GenesisAccount struct {
	Code       []byte                      `json:"code,omitempty"`
	Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
	Balance    *big.Int                    `json:"balance" gencodec:"required"`
	Nonce      uint64                      `json:"nonce,omitempty"`
	PrivateKey []byte                      `json:"secretKey,omitempty"` // For testing purpose only
}
```
</file>

## Prompt Corrections
The prompt is very well-structured and provides excellent Zig skeletons. Here are a few high-level suggestions for improvement based on go-ethereum's implementation:

1.  **Leverage Existing Fuzzing Engines**: The prompt outlines building a full fuzzing engine from scratch (corpus management, parallel execution, etc.). It would be more efficient to use an existing fuzzing engine like `libFuzzer` (which Zig has support for) and focus on writing a high-quality **harness**. The harness would be responsible for decoding the fuzzer's byte input into an EVM test case (bytecode, transaction, or state) and reporting crashes. Go-ethereum's `fuzz/evm.go` is a perfect example of such a harness built for `go-fuzz`.

2.  **State Test Format as a Fuzzing Corpus**: Go-ethereum's consensus tests use a JSON-based format to define complex scenarios, including pre-state, transactions, and expected post-state. This format is a powerful way to represent fuzzing test cases, especially for state and transaction fuzzing. The `Genesis` and `GenesisAccount` structs in `core/genesis.go` are a good starting point for defining the pre-state part of a test case. Adopting a similar structured format for the fuzzer's corpus can make test cases more readable, shareable, and easier to minimize.

3.  **Fuzzing Sequences of Transactions**: The `TransactionFuzzer` in the prompt generates a single transaction. A more powerful approach, which often uncovers deeper state-related bugs, is to fuzz a *sequence* of transactions within a single block or across multiple blocks. This allows the fuzzer to build up complex contract states and interactions that are difficult to achieve with a single transaction. The tests in `core/blockchain_snapshot_test.go` show patterns for programmatically generating and inserting chains of blocks, which could be adapted for fuzzing.

---

No response received

---

This request is for building a fuzzing infrastructure, which is a core part of go-ethereum's testing strategy. The provided Zig code outlines a structure for bytecode, transaction, and state fuzzers.

The most relevant Go-Ethereum code for this task can be found in the `tests` directory, which defines the JSON-based test formats, and in the EVM implementation itself, particularly how it analyzes bytecode for valid jump destinations. The existing fuzzers in `tests/fuzzers` also provide a good structural template.

I've selected the following files that provide a strong foundation for implementing the requested fuzzing infrastructure:
- `tests/state_test_util.go`: This is the most critical file. It defines the JSON structures for state tests (`stEnv`, `stTransaction`, `stPostState`), which are perfect models for the data your `TransactionFuzzer` and `StateFuzzer` need to generate. The `Run` method also provides a complete blueprint for the `execute_test_case` logic in your main fuzzer.
- `core/vm/jump_table.go`: The `bitvec` struct and `analyze` function from this file (in older go-ethereum versions, now refactored) are the direct inspiration for validating `JUMPDEST` locations. This is essential for your `BytecodeFuzzer`.
- `core/vm/opcodes.go`: Provides a complete list of EVM opcodes, which is necessary for your `BytecodeFuzzer`'s weighted selection logic.
- `tests/fuzzers/`: The fuzzing targets in this directory, like for the BLS precompiles, demonstrate the structure of a fuzzing harness that integrates with `go-fuzz`, which is a useful pattern for your main fuzzer loop and crash detection.

These snippets provide a robust and accurate reference for building a fuzzing system that is compatible with Ethereum's extensive test suites.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test_util.go">
```go
// StateTest checks transaction processing without block context.
// See https://github.com/ethereum/EIPs/issues/176 for the test format specification.
type StateTest struct {
	json stJSON
}

// ...

type stJSON struct {
	Env  stEnv                    `json:"env"`
	Pre  types.GenesisAlloc       `json:"pre"`
	Tx   stTransaction            `json:"transaction"`
	Out  hexutil.Bytes            `json:"out"`
	Post map[string][]stPostState `json:"post"`
}

type stPostState struct {
	Root            common.UnprefixedHash `json:"hash"`
	Logs            common.UnprefixedHash `json:"logs"`
	TxBytes         hexutil.Bytes         `json:"txbytes"`
	ExpectException string                `json:"expectException"`
	Indexes         struct {
		Data  int `json:"data"`
		Gas   int `json:"gas"`
		Value int `json:"value"`
	}
}

//go:generate go run github.com/fjl/gencodec -type stEnv -field-override stEnvMarshaling -out gen_stenv.go
type stEnv struct {
	Coinbase      common.Address `json:"currentCoinbase"      gencodec:"required"`
	Difficulty    *big.Int       `json:"currentDifficulty"    gencodec:"optional"`
	Random        *big.Int       `json:"currentRandom"        gencodec:"optional"`
	GasLimit      uint64         `json:"currentGasLimit"      gencodec:"required"`
	Number        uint64         `json:"currentNumber"        gencodec:"required"`
	Timestamp     uint64         `json:"currentTimestamp"     gencodec:"required"`
	BaseFee       *big.Int       `json:"currentBaseFee"       gencodec:"optional"`
	ExcessBlobGas *uint64        `json:"currentExcessBlobGas" gencodec:"optional"`
}

//go:generate go run github.com/fjl/gencodec -type stTransaction -field-override stTransactionMarshaling -out gen_sttransaction.go
type stTransaction struct {
	GasPrice             *big.Int            `json:"gasPrice"`
	MaxFeePerGas         *big.Int            `json:"maxFeePerGas"`
	MaxPriorityFeePerGas *big.Int            `json:"maxPriorityFeePerGas"`
	Nonce                uint64              `json:"nonce"`
	To                   string              `json:"to"`
	Data                 []string            `json:"data"`
	AccessLists          []*types.AccessList `json:"accessLists,omitempty"`
	GasLimit             []uint64            `json:"gasLimit"`
	Value                []string            `json:"value"`
	PrivateKey           []byte              `json:"secretKey"`
	Sender               *common.Address     `json:"sender"`
	BlobVersionedHashes  []common.Hash       `json:"blobVersionedHashes,omitempty"`
	BlobGasFeeCap        *big.Int            `json:"maxFeePerBlobGas,omitempty"`
	AuthorizationList    []*stAuthorization  `json:"authorizationList,omitempty"`
}

// ...

// Run executes a specific subtest and verifies the post-state and logs
func (t *StateTest) Run(subtest StateSubtest, vmconfig vm.Config, snapshotter bool, scheme string, postCheck func(err error, st *StateTestState)) (result error) {
	st, root, _, err := t.RunNoVerify(subtest, vmconfig, snapshotter, scheme)
	// Invoke the callback at the end of function for further analysis.
	defer func() {
		postCheck(result, &st)
		st.Close()
	}()

	checkedErr := t.checkError(subtest, err)
	if checkedErr != nil {
		return checkedErr
	}
	// The error has been checked; if it was unexpected, it's already returned.
	if err != nil {
		// Here, an error exists but it was expected.
		// We do not check the post state or logs.
		return nil
	}
	post := t.json.Post[subtest.Fork][subtest.Index]
	// N.B: We need to do this in a two-step process, because the first Commit takes care
	// of self-destructs, and we need to touch the coinbase _after_ a potential self-destruct.
	if root != common.Hash(post.Root) {
		return fmt.Errorf("post state root mismatch: got %x, want %x", root, post.Root)
	}
	if logs := rlpHash(st.StateDB.Logs()); logs != common.Hash(post.Logs) {
		return fmt.Errorf("post state logs hash mismatch: got %x, want %x", logs, post.Logs)
	}
	// Note: we can't reuse the statedb after this because it may be at an old root.
	// We need to create a new one to verify the remaining accounts.
	trieDB := st.StateDB.Database().TrieDB()
	statedb, err := state.New(root, state.NewDatabase(trieDB, nil))
	if err != nil {
		return err
	}
	// Check the remaining accounts in post.
	return t.checkPostState(statedb)
}

// RunNoVerify runs a specific subtest and returns the statedb and post-state root.
// Remember to call state.Close after verifying the test result!
func (t *StateTest) RunNoVerify(subtest StateSubtest, vmconfig vm.Config, snapshotter bool, scheme string) (st StateTestState, root common.Hash, gasUsed uint64, err error) {
	config, eips, err := GetChainConfig(subtest.Fork)
	if err != nil {
		return st, common.Hash{}, 0, UnsupportedForkError{subtest.Fork}
	}
	vmconfig.ExtraEips = eips

	block := t.genesis(config).ToBlock()
	st = MakePreState(rawdb.NewMemoryDatabase(), t.json.Pre, snapshotter, scheme)

	var baseFee *big.Int
	if config.IsLondon(new(big.Int)) {
		baseFee = t.json.Env.BaseFee
		if baseFee == nil {
			baseFee = big.NewInt(params.InitialBaseFee)
		}
	}
	post := t.json.Post[subtest.Fork][subtest.Index]
	msg, err := t.json.Tx.toMessage(post, baseFee)
	if err != nil {
		return st, common.Hash{}, 0, err
	}

	// Prepare the EVM.
	context := core.NewEVMBlockContext(block.Header(), &dummyChain{config: config}, &t.json.Env.Coinbase)
	context.GetHash = vmTestBlockHash
	context.BaseFee = baseFee
	context.Random = nil
	if t.json.Env.Difficulty != nil {
		context.Difficulty = new(big.Int).Set(t.json.Env.Difficulty)
	}
	if config.IsLondon(new(big.Int)) && t.json.Env.Random != nil {
		rnd := common.BigToHash(t.json.Env.Random)
		context.Random = &rnd
		context.Difficulty = big.NewInt(0)
	}
	if config.IsCancun(new(big.Int), block.Time()) && t.json.Env.ExcessBlobGas != nil {
		header := &types.Header{
			Time:          block.Time(),
			ExcessBlobGas: t.json.Env.ExcessBlobGas,
		}
		context.BlobBaseFee = eip4844.CalcBlobFee(config, header)
	}

	evm := vm.NewEVM(context, vm.StateDB(st.StateDB), config, vmconfig)

	// Execute the message.
	snapshot := st.StateDB.Snapshot()
	gaspool := new(core.GasPool)
	gaspool.AddGas(block.GasLimit())
	vmRet, err := core.ApplyMessage(evm, msg, gaspool)
	if err != nil {
		st.StateDB.RevertToSnapshot(snapshot)
		if tracer := evm.Config.Tracer; tracer != nil && tracer.OnTxEnd != nil {
			evm.Config.Tracer.OnTxEnd(nil, err)
		}
		return st, common.Hash{}, 0, err
	}
	// Add 0-value mining reward. This only makes a difference in the cases
	// where the coinbase self-destructed.
	st.StateDB.AddBalance(block.Coinbase(), new(uint256.Int), tracing.BalanceChangeUnspecified)

	// Commit state mutations into database.
	root, _ = st.StateDB.Commit(block.NumberU64(), config.IsEIP158(block.Number()), config.IsCancun(block.Number(), block.Time()))
	if tracer := evm.Config.Tracer; tracer != nil && tracer.OnTxEnd != nil {
		receipt := &types.Receipt{GasUsed: vmRet.UsedGas}
		tracer.OnTxEnd(receipt, nil)
	}
	return st, root, vmRet.UsedGas, nil
}

// ...

// MakePreState creates a state containing the given allocation.
func MakePreState(db ethdb.Database, accounts types.GenesisAlloc, snapshotter bool, scheme string) StateTestState {
	// ... (implementation to setup state.StateDB from genesis alloc)
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// Package vm provides the EVM (Ethereum Virtual Machine)
package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

// OpCode is a single byte representing an instruction.
type OpCode byte

//go:generate go run golang.org/x/tools/cmd/stringer -type=OpCode -linecomment

const (
	// 0x0 range - arithmetic ops.
	STOP OpCode = iota // 0x00
	ADD
	MUL
	SUB
	DIV
	SDIV
	MOD
	SMOD
	ADDMOD
	MULMOD
	EXP
	SIGNEXTEND

	// 0x10 range - bitwise logic ops.
	LT OpCode = iota + 0x10
	GT
	SLT
	SGT
	EQ
	ISZERO
	AND
	OR
	XOR
	NOT
	BYTE
	SHL
	SHR
	SAR

	// 0x20 range - crypto ops.
	KECCAK256 OpCode = 0x20

	// 0x30 range - closure state.
	ADDRESS OpCode = iota + 0x30
	BALANCE
	ORIGIN
	CALLER
	CALLVALUE
	CALLDATALOAD
	CALLDATASIZE
	CALLDATACOPY
	CODESIZE
	CODECOPY
	GASPRICE
	EXTCODESIZE
	EXTCODECOPY
	RETURNDATASIZE
	RETURNDATACOPY
	EXTCODEHASH

	// 0x40 range - block operations.
	BLOCKHASH OpCode = iota + 0x40
	COINBASE
	TIMESTAMP
	NUMBER
	DIFFICULTY
	GASLIMIT
	CHAINID
	SELFBALANCE
	BASEFEE
	BLOBHASH
	BLOBBASEFEE

	// 0x50 range - 'storage' and execution ops.
	POP OpCode = iota + 0x50
	MLOAD
	MSTORE
	MSTORE8
	SLOAD
	SSTORE
	JUMP
	JUMPI
	PC
	MSIZE
	GAS
	JUMPDEST // 0x5b

	// 0x60 range
	PUSH0 OpCode = 0x5f
	PUSH1 OpCode = iota + 0x60
	PUSH2
	// ... PUSH3 through PUSH31
	PUSH32

	// 0x80 range - dups
	DUP1 OpCode = iota + 0x80
	// ... DUP2 through DUP15
	DUP16

	// 0x90 range - swaps
	SWAP1 OpCode = iota + 0x90
	// ... SWAP2 through SWAP15
	SWAP16

	// 0xa0 range - logging ops.
	LOG0 OpCode = iota + 0xa0
	LOG1
	LOG2
	LOG3
	LOG4

	// 0xf0 range - closures.
	CREATE OpCode = iota + 0xf0
	CALL
	CALLCODE
	RETURN
	DELEGATECALL
	CREATE2
	// ...
	STATICCALL OpCode = 0xfa
	// ...
	REVERT OpCode = 0xfd
	INVALID OpCode = 0xfe
	SELFDESTRUCT OpCode = 0xff
)

// opCodeToString contains the mnemonic of each opcode for conversion to string.
var opCodeToString = [256]string{
	STOP:       "STOP",
	ADD:        "ADD",
	MUL:        "MUL",
	// ... and so on for all opcodes
}

// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.10.8/core/vm/jump_table.go">
```go
// bitvec is a bit vector which can be used to mark locations in the code.
type bitvec []byte

// newBitvec creates a new bit vector with the given size.
func newBitvec(size uint64) bitvec {
	return make(bitvec, size/8+1)
}

// set sets the bit at the given index.
func (b bitvec) set(i uint64) {
	b[i/8] |= 1 << (i % 8)
}

// set8 sets the bit at the given index.
func (b bitvec) set8(i uint64) {
	b[i] |= 1
}

// codeBitmap creates a new bitmap of the given code, where all valid jump
// destinations are marked.
func codeBitmap(code []byte) bitvec {
	// The code bitmap is generated from the code itself.
	// The bitmap will be a bit array where all valid jump
	// destinations are marked. A jump is valid if the
	// destination is a JUMPDEST opcode and it is not part
	// of push data.
	var (
		destinations = newBitvec(uint64(len(code)))
		i            = uint64(0)
		length       = uint64(len(code))
	)
	for i < length {
		op := OpCode(code[i])
		if op == JUMPDEST {
			destinations.set(i)
		} else if op >= PUSH1 && op <= PUSH32 {
			i += uint64(op - PUSH1 + 1)
		}
		i++
	}
	return destinations
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/genesis.go">
```go
// Genesis specifies the header fields, starting allocation and difficulty of a new
// chain.
type Genesis struct {
	Config     *params.ChainConfig `json:"config"`
	Nonce      uint64              `json:"nonce"`
	Timestamp  uint64              `json:"timestamp"`
	ExtraData  []byte              `json:"extraData"`
	GasLimit   uint64              `json:"gasLimit"`
	Difficulty *big.Int            `json:"difficulty"`
	Mixhash    common.Hash         `json:"mixHash"`
	Coinbase   common.Address      `json:"coinbase"`
	Alloc      GenesisAlloc        `json:"alloc" gencodec:"required"`

	// These fields are used for consensus tests. Please don't use them
	// in production.
	Number     uint64      `json:"number"`
	GasUsed    uint64      `json:"gasUsed"`
	ParentHash common.Hash `json:"parentHash"`

	// Following fields are used for post-merge genesis states.
	BaseFee         *big.Int       `json:"baseFeePerGas,omitempty"`
	ExcessBlobGas   *uint64        `json:"excessBlobGas,omitempty"`
	BlobGasUsed     *uint64        `json:blobGasUsed,omitempty"`
	Withdrawals     *[]Withdrawal  `json:"withdrawals,omitempty"`
	BeaconRoot      *common.Hash   `json:"parentBeaconBlockRoot,omitempty"`
}

// GenesisAlloc specifies the initial state that is part of the genesis block.
type GenesisAlloc map[common.Address]GenesisAccount

// GenesisAccount is an account in the state of the genesis block.
type GenesisAccount struct {
	Code       []byte                      `json:"code,omitempty"`
	Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
	Balance    *big.Int                    `json:"balance" gencodec:"required"`
	Nonce      uint64                      `json:"nonce,omitempty"`
	PrivateKey []byte                      `json:"secretKey,omitempty"` // For testing purpose only
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/fuzzers/bls12381/precompile_fuzzer.go">
```go
package bls

import (
	"bytes"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/vm"
)

// ... (constants)

func checkInput(id byte, inputLen int) bool {
	switch id {
	case blsG1Add:
		return inputLen == 256
	// ... (other cases)
	}
	panic("programmer error")
}

// The function must return
//
//   - 1 if the fuzzer should increase priority of the
//     given input during subsequent fuzzing (for example, the input is lexically
//     correct and was parsed successfully);
//   - -1 if the input must not be added to corpus even if gives new coverage; and
//   - 0 otherwise
//
// other values are reserved for future use.
func fuzz(id byte, data []byte) int {
	// Even on bad input, it should not crash, so we still test the gas calc
	precompile := vm.PrecompiledContractsBLS[common.BytesToAddress([]byte{id})]
	gas := precompile.RequiredGas(data)
	if !checkInput(id, len(data)) {
		return 0
	}
	// If the gas cost is too large (25M), bail out
	if gas > 25*1000*1000 {
		return 0
	}
	cpy := make([]byte, len(data))
	copy(cpy, data)
	_, err := precompile.Run(cpy)
	if !bytes.Equal(cpy, data) {
		panic(fmt.Sprintf("input data modified, precompile %d: %x %x", id, data, cpy))
	}
	if err != nil {
		return 0
	}
	return 1
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt's Zig implementation contains a `BytecodeFuzzer.is_valid_opcode` function. The list of valid opcodes there is incomplete and seems to be missing several opcodes introduced in later hardforks (e.g., `PUSH0`, `BLOBHASH`, `MCOPY`, `TLOAD`, `TSTORE`).

I've included the `opcodes.go` file from go-ethereum, which serves as a definitive reference for all valid EVM opcodes up to the latest hardforks. The implementer should cross-reference this list to ensure their `is_valid_opcode` function is comprehensive and accurate. An outdated opcode list could prevent the fuzzer from exploring execution paths involving newer instructions.

---

This is an excellent and detailed prompt for implementing a fuzzing infrastructure. The request is clear, and the proposed Zig code provides a solid foundation.

Based on your request, I've reviewed the go-ethereum codebase to find examples of their fuzzing implementations. While go-ethereum has extensive state and transaction tests, they are mostly pre-defined test cases rather than generative fuzzers. However, there are a couple of excellent examples of fuzzing that align well with your goal.

The most relevant is a custom fuzzer for the ABI encoder/decoder, which demonstrates intelligent, structured data generation. I've also included a simpler example using Go's native fuzzing engine for the keystore.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/accounts/abi/abifuzzer_test.go">
```go
// FuzzABI is the main entrypoint for fuzzing
func FuzzABI(f *testing.F) {
	f.Fuzz(func(t *testing.T, data []byte) {
		fuzzAbi(data)
	})
}

var (
	names    = []string{"_name", "name", "NAME", "name_", "__", "_name_", "n"}
	stateMut = []string{"pure", "view", "payable"}
	pays     = []string{"true", "false"}
	vNames   = []string{"a", "b", "c", "d", "e", "f", "g"}
	varNames = append(vNames, names...)
	varTypes = []string{"bool", "address", "bytes", "string",
		"uint8", "int8", "uint8", "int8", "uint16", "int16",
		"uint24", "int24", "uint32", "int32", "uint40", "int40", "uint48", "int48", "uint56", "int56",
		"uint64", "int64", "uint72", "int72", "uint80", "int80", "uint88", "int88", "uint96", "int96",
		"uint104", "int104", "uint112", "int112", "uint120", "int120", "uint128", "int128", "uint136", "int136",
		"uint144", "int144", "uint152", "int152", "uint160", "int160", "uint168", "int168", "uint176", "int176",
		"uint184", "int184", "uint192", "int192", "uint200", "int200", "uint208", "int208", "uint216", "int216",
		"uint224", "int224", "uint232", "int232", "uint240", "int240", "uint248", "int248", "uint256", "int256",
		"bytes1", "bytes2", "bytes3", "bytes4", "bytes5", "bytes6", "bytes7", "bytes8", "bytes9", "bytes10", "bytes11",
		"bytes12", "bytes13", "bytes14", "bytes15", "bytes16", "bytes17", "bytes18", "bytes19", "bytes20", "bytes21",
		"bytes22", "bytes23", "bytes24", "bytes25", "bytes26", "bytes27", "bytes28", "bytes29", "bytes30", "bytes31",
		"bytes32", "bytes"}
)

func unpackPack(abi ABI, method string, input []byte) ([]interface{}, bool) {
	if out, err := abi.Unpack(method, input); err == nil {
		_, err := abi.Pack(method, out...)
		if err != nil {
			// We have some false positives as we can unpack these type successfully, but not pack them
			if err.Error() == "abi: cannot use []uint8 as type [0]int8 as argument" ||
				err.Error() == "abi: cannot use uint8 as type int8 as argument" {
				return out, false
			}
			panic(err)
		}
		return out, true
	}
	return nil, false
}

type arg struct {
	name string
	typ  string
}

func createABI(name string, stateMutability, payable *string, inputs []arg) (ABI, error) {
	sig := fmt.Sprintf(`[{ "type" : "function", "name" : "%v" `, name)
	if stateMutability != nil {
		sig += fmt.Sprintf(`, "stateMutability": "%v" `, *stateMutability)
	}
	if payable != nil {
		sig += fmt.Sprintf(`, "payable": %v `, *payable)
	}
	if len(inputs) > 0 {
		sig += `, "inputs" : [ {`
		for i, inp := range inputs {
			sig += fmt.Sprintf(`"name" : "%v", "type" : "%v" `, inp.name, inp.typ)
			if i+1 < len(inputs) {
				sig += ","
			}
		}
		sig += "} ]"
		sig += `, "outputs" : [ {`
		for i, inp := range inputs {
			sig += fmt.Sprintf(`"name" : "%v", "type" : "%v" `, inp.name, inp.typ)
			if i+1 < len(inputs) {
				sig += ","
			}
		}
		sig += "} ]"
	}
	sig += `}]`
	return JSON(strings.NewReader(sig))
}

func fuzzAbi(input []byte) {
	var (
		fuzzer    = fuzz.NewFromGoFuzz(input)
		name      = oneOf(fuzzer, names)
		stateM    = oneOfOrNil(fuzzer, stateMut)
		payable   = oneOfOrNil(fuzzer, pays)
		arguments []arg
	)
	for i := 0; i < upTo(fuzzer, 10); i++ {
		argName := oneOf(fuzzer, varNames)
		argTyp := oneOf(fuzzer, varTypes)
		switch upTo(fuzzer, 10) {
		case 0: // 10% chance to make it a slice
			argTyp += "[]"
		case 1: // 10% chance to make it an array
			argTyp += fmt.Sprintf("[%d]", 1+upTo(fuzzer, 30))
		default:
		}
		arguments = append(arguments, arg{name: argName, typ: argTyp})
	}
	abi, err := createABI(name, stateM, payable, arguments)
	if err != nil {
		panic(err)
	}
	structs, _ := unpackPack(abi, name, input)
	_ = packUnpack(abi, name, &structs)
}

func upTo(fuzzer *fuzz.Fuzzer, max int) int {
	var i int
	fuzzer.Fuzz(&i)
	if i < 0 {
		return (-1 - i) % max
	}
	return i % max
}

func oneOf(fuzzer *fuzz.Fuzzer, options []string) string {
	return options[upTo(fuzzer, len(options))]
}

func oneOfOrNil(fuzzer *fuzz.Fuzzer, options []string) *string {
	if i := upTo(fuzzer, len(options)+1); i < len(options) {
		return &options[i]
	}
	return nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/accounts/keystore/keystore_fuzzing_test.go">
```go
package keystore

import (
	"testing"
)

func FuzzPassword(f *testing.F) {
	f.Fuzz(func(t *testing.T, password string) {
		ks := NewKeyStore(t.TempDir(), LightScryptN, LightScryptP)
		a, err := ks.NewAccount(password)
		if err != nil {
			t.Fatal(err)
		}
		if err := ks.Unlock(a, password); err != nil {
			t.Fatal(err)
		}
	})
}
```
</file>
</go-ethereum>

---

No response received

---

An analysis of the `go-ethereum` codebase reveals a well-structured fuzzing harness and several fuzz targets that are highly relevant to the requested feature. The following snippets provide a blueprint for setting up the EVM, generating fuzzed inputs, and executing them.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/fuzzing/harness.go">
```go
// This file contains a generic fuzzing harness that can be used to fuzz various
// parts of the Ethereum stack. It provides functions for generating various
// inputs from a stream of random bytes, which is the standard input for fuzzers
// like go-fuzz and libFuzzer.

package fuzzing

import (
	"bytes"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/trie"
)

// Harness is the generic fuzzing harness.
type Harness struct {
	sdb *state.StateDB

	chain  *core.BlockChain
	engine *fakeEngine
	gspec  *core.Genesis
}

// Setup initializes a new fuzzing harness.
func (h *Harness) Setup() {
	db := rawdb.NewMemoryDatabase()
	h.gspec = &core.Genesis{
		Config:     params.MainnetChainConfig,
		BaseFee:    big.NewInt(params.InitialBaseFee),
		Difficulty: common.Big1,
	}
	h.engine = &fakeEngine{
		eth:        &fakeEth{db: db, gspec: h.gspec},
		db:         db,
		chain:      nil,
		chainConfig: h.gspec.Config,
	}
	h.sdb, _ = state.New(common.Hash{}, state.NewDatabase(db, &trie.Config{}), nil)
}

// readGenesisAccounts reads a number of genesis accounts from the given byte
// stream and populates them in the state database.
func (h *Harness) readGenesisAccounts(r *bytes.Reader) {
	// Read number of accounts to create (max 255).
	num := readByte(r)
	for i := 0; i < int(num); i++ {
		// Create a new account and fill it with some data.
		addr := readAddress(r)
		acc := state.Account{
			Nonce:   readUint64(r),
			Balance: readBigInt(r),
			Code:    readBytes(r, 24*1024),
		}
		if len(acc.Code) > 0 {
			acc.CodeHash = crypto.Keccak256(acc.Code)
		}
		h.sdb.SetAccount(addr, acc)

		// Create some storage slots for the account.
		storageSlots := readByte(r)
		for j := 0; j < int(storageSlots); j++ {
			key := readHash(r)
			val := readHash(r)
			h.sdb.SetState(addr, key, val)
		}
	}
}

// Run executes a fuzzing test case.
func (h *Harness) Run(data []byte, vmconfig vm.Config) {
	// Setup the state and read genesis accounts from the input data.
	h.Setup()
	r := bytes.NewReader(data)
	h.readGenesisAccounts(r)

	// Commit the genesis accounts to the state database.
	root, err := h.sdb.Commit(false)
	if err != nil {
		return
	}
	h.gspec.Root = root
	// Setup the blockchain with the genesis state.
	h.chain, _ = core.NewBlockChain(h.engine.db, nil, h.gspec, nil, h.engine, vmconfig, nil)
	h.engine.chain = h.chain

	// Read transaction data from the input data.
	numTxs := readByte(r)
	for i := 0; i < int(numTxs); i++ {
		var (
			tx      *types.Transaction
			chainid *big.Int
		)
		// Based on a random byte, create a legacy or EIP-1559 transaction.
		if readByte(r)%2 == 0 {
			tx, chainid = readLegacyTx(r)
		} else {
			tx, chainid = readDynamicFeeTx(r)
		}
		// Apply the transaction to the state.
		if tx != nil {
			h.sdb.SetTxContext(tx.Hash(), i)
			h.applyTx(tx, chainid)
		}
	}
}

// applyTx applies a transaction to the state database.
func (h *Harness) applyTx(tx *types.Transaction, chainid *big.Int) {
	// Create a new block with the transaction.
	var (
		block  *types.Block
		header *types.Header
	)
	if chainid == nil {
		header = &types.Header{
			ParentHash: h.chain.CurrentBlock().Hash(),
			Number:     big.NewInt(int64(h.chain.CurrentBlock().NumberU64() + 1)),
			GasLimit:   h.chain.GasLimit(),
			Time:       h.chain.CurrentBlock().Time() + 1,
			Difficulty: common.Big1,
			BaseFee:    big.NewInt(params.InitialBaseFee),
		}
		block = types.NewBlockWithHeader(header).WithBody([]*types.Transaction{tx}, nil)
	} else {
		// ...
	}
	// Process the block.
	_, _, _, err := h.chain.Processor().Process(block, h.sdb, vm.Config{})
	if err != nil {
		return
	}
	// Write the block to the database. This is not strictly necessary for the
	// fuzzing, but it's good practice.
	h.chain.WriteBlock(block, nil, nil)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm_fuzz.go">
```go
// Fuzz is the entry point for go-fuzz.
func Fuzz(data []byte) int {
	// Small corpuses are usually malformed, reject them explicitly
	if len(data) < 32 {
		return 0
	}
	// Cap gas limit to 1M to avoid long execution times
	const gasLimit = 1000000

	r := bytes.NewReader(data)

	// Read fork, difficulty, and coinbase
	fork := readByte(r)
	difficulty := readBigInt(r)
	cb := readAddress(r)

	// Read transaction parameters
	origin := readAddress(r)
	gasprice := readBigInt(r)
	value := readBigInt(r)
	nonce := readUint64(r)
	to := readAddress(r)
	fuzzedTxData := readBytes(r, 4096)

	// Create transaction
	var tx *types.Transaction
	if fork%3 == 0 {
		// Legacy tx
		tx = types.NewTransaction(nonce, to, value, gasLimit, gasprice, fuzzedTxData)
	} else if fork%3 == 1 {
		// EIP-2930 access list tx
		// ...
	} else {
		// EIP-1559 dynamic fee tx
		tx = types.NewTx(&types.DynamicFeeTx{
			ChainID:   big.NewInt(1),
			Nonce:     nonce,
			GasTipCap: gasprice,
			GasFeeCap: big.NewInt(0).Add(gasprice, big.NewInt(params.InitialBaseFee)),
			Gas:       gasLimit,
			To:        &to,
			Value:     value,
			Data:      fuzzedTxData,
		})
	}
	// ... (setup stateDB, etc.)

	// Setup EVM context
	db := state.NewDatabase(rawdb.NewMemoryDatabase())
	statedb, _ := state.New(common.Hash{}, db, nil)
	statedb.AddBalance(origin, big.NewInt(0).Mul(gasprice, big.NewInt(int64(gasLimit))))
	statedb.AddBalance(origin, value)

	header := &types.Header{
		ParentHash:  common.Hash{},
		Coinbase:    cb,
		Root:        common.Hash{},
		Number:      new(big.Int),
		GasLimit:    gasLimit,
		GasUsed:     0,
		Time:        10,
		Difficulty:  difficulty,
		BaseFee:     big.NewInt(params.InitialBaseFee),
	}
	blockContext := core.NewEVMBlockContext(header, nil, nil)
	txContext := core.NewEVMTxContext(tx)

	// Create and run the EVM
	evm := vm.NewEVM(blockContext, txContext, statedb, params.MainnetChainConfig, vm.Config{
		NoBaseFee: fork%2 == 0,
	})
	gaspool := new(core.GasPool).AddGas(gasLimit)

	_, err := core.ApplyTransaction(evm, gaspool, statedb, nil, header, tx, &header.GasUsed)
	if err != nil {
		// The transaction failed, this is not a bug.
		return 0
	}
	return 1
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_fuzz.go">
```go
// Fuzz is the entry point for go-fuzz.
func Fuzz(data []byte) int {
	if len(data) == 0 {
		return 0
	}
	var (
		stateDB, _   = state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
		sender       = common.HexToAddress("0x1000")
		contractAddr = common.HexToAddress("0x1337")
		gas          = uint64(10000000)
		value        = new(big.Int)
	)
	stateDB.CreateAccount(sender)
	stateDB.AddBalance(sender, big.NewInt(1000000000000000000))

	// The passed-in data is split into two parts:
	// 1. The contract code
	// 2. The calldata
	var code, calldata []byte
	if len(data) > 1 {
		size := int(data[0])
		if size >= len(data) {
			size = len(data) - 1
		}
		code = data[1 : 1+size]
		calldata = data[1+size:]
	} else {
		code = data
	}

	// Setup EVM
	blockContext := vm.BlockContext{
		CanTransfer: vm.CanTransfer,
		Transfer:    vm.Transfer,
		GetHash:     func(n uint64) common.Hash { return common.Hash{} },
		Coinbase:    common.Address{},
		GasLimit:    100000000,
		BlockNumber: new(big.Int),
		Time:        new(big.Int),
		Difficulty:  new(big.Int),
	}
	txContext := vm.TxContext{
		Origin:   sender,
		GasPrice: new(big.Int),
	}
	evm := vm.NewEVM(blockContext, txContext, stateDB, params.MainnetChainConfig, vm.Config{})

	// Deploy the contract
	contractRef := vm.ContractRef(sender)
	_, addr, _, err := evm.Create(contractRef, code, gas, value)
	if err != nil {
		// A contract that can't be deployed is not a bug.
		// We should be able to handle that.
		return 0
	}
	stateDB.SetCode(contractAddr, code)

	// Call the contract
	_, _, err = evm.Call(contractRef, addr, calldata, gas, value)
	if err != nil {
		// A contract that results in an error is not a bug.
		return 0
	}
	return 1
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/miner/worker.go">
```go
// This snippet demonstrates how Geth applies transactions to build a block.
// The `commitTransaction` and `fillTransactions` functions show the process
// of selecting transactions from a pool and applying them to the state,
// which is a core part of the fuzzer's execution loop.

// commitTransaction applies a single transaction to the current state and miner
// environment.
func (miner *Miner) commitTransaction(env *environment, tx *types.Transaction) error {
	// ... (blob transaction handling omitted for brevity)
	receipt, err := miner.applyTransaction(env, tx)
	if err != nil {
		return err
	}
	env.txs = append(env.txs, tx)
	env.receipts = append(env.receipts, receipt)
	env.tcount++
	return nil
}

// applyTransaction runs the transaction. If execution fails, state and gas pool are reverted.
func (miner *Miner) applyTransaction(env *environment, tx *types.Transaction) (*types.Receipt, error) {
	var (
		snap = env.state.Snapshot()
		gp   = env.gasPool.Gas()
	)
	// Apply the transaction to the state.
	receipt, err := core.ApplyTransaction(env.evm, env.gasPool, env.state, env.header, tx, &env.header.GasUsed)
	if err != nil {
		// If the transaction fails, revert the state and gas pool.
		env.state.RevertToSnapshot(snap)
		env.gasPool.SetGas(gp)
	}
	return receipt, err
}

// fillTransactions retrieves the pending transactions from the txpool and fills them
// into the given sealing block.
func (miner *Miner) fillTransactions(interrupt *atomic.Int32, env *environment) error {
	// Retrieve pending transactions from the pool, sorted by price.
	pending, err := miner.txpool.Pending(true)
	if err != nil {
		return err
	}
	// Split the pending transactions into locals and remotes.
	// ... (prioritization logic omitted)

	// Create a transaction set for processing.
	txs := newTransactionsByPriceAndNonce(env.signer, pending, env.header.BaseFee)
	return miner.commitTransactions(env, txs, interrupt)
}

// commitTransactions iterates over the transactions and commits them to the
// block sealing environment.
func (miner *Miner) commitTransactions(env *environment, txs *transactionsByPriceAndNonce, interrupt *atomic.Int32) error {
	// ...
	for {
		// Check for interrupt signal
		if interrupt != nil {
			if signal := interrupt.Load(); signal != commitInterruptNone {
				return signalToErr(signal)
			}
		}
		// If we don't have enough gas for any further transactions then we're done.
		if env.gasPool.Gas() < params.TxGas {
			break
		}
		// Retrieve the next transaction and abort if all done.
		tx := txs.Peek()
		if tx == nil {
			break
		}
		// ... (gas and nonce checks)

		// Apply the transaction to the state.
		err := miner.commitTransaction(env, tx)
		switch {
		case errors.Is(err, core.ErrNonceTooLow):
			// ...
			txs.Shift()

		case errors.Is(err, nil):
			txs.Shift()

		default:
			// Invalid transaction, drop it and all subsequent from sender
			txs.Pop()
		}
	}
	return nil
}

```
</file>
</go-ethereum>

