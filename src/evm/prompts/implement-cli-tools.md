# Implement CLI Tools

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_cli_tools` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_cli_tools feat_implement_cli_tools`
3. **Work in isolation**: `cd g/feat_implement_cli_tools`
4. **Commit message**: `✨ feat: implement comprehensive CLI tools for EVM testing, debugging, and benchmarking`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive command-line interface tools for the EVM implementation, providing utilities for testing, debugging, benchmarking, and development workflows. This includes bytecode execution, state inspection, performance profiling, and developer-friendly debugging interfaces.

## ELI5

CLI tools are like having a Swiss Army knife for EVM development - they give you different specialized tools you can use from the command line to work with smart contracts and blockchain code. Just like how developers use command-line tools to compile code, run tests, or check file contents, these EVM CLI tools let you execute smart contract bytecode, inspect account states, analyze contract performance, and debug issues without needing a full graphical interface.

## CLI Tool Specifications

### Core CLI Tools

#### 1. EVM Executor (`tevm-exec`)
```zig
pub const EvmExecutor = struct {
    allocator: std.mem.Allocator,
    config: ExecutorConfig,
    
    pub const ExecutorConfig = struct {
        chain_id: u64,
        gas_limit: u64,
        gas_price: u64,
        block_number: u64,
        block_timestamp: u64,
        block_coinbase: Address,
        hardfork: []const u8,
        debug: bool,
        trace: bool,
        json_output: bool,
        
        pub fn default() ExecutorConfig {
            return ExecutorConfig{
                .chain_id = 1,
                .gas_limit = 30_000_000,
                .gas_price = 20_000_000_000, // 20 Gwei
                .block_number = 18_000_000,
                .block_timestamp = @as(u64, @intCast(std.time.timestamp())),
                .block_coinbase = Address.zero(),
                .hardfork = "cancun",
                .debug = false,
                .trace = false,
                .json_output = false,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ExecutorConfig) !EvmExecutor {
        return EvmExecutor{
            .allocator = allocator,
            .config = config,
        };
    }
    
    pub fn execute_bytecode(self: *EvmExecutor, bytecode: []const u8, call_data: []const u8) !ExecutionOutput {
        var vm = try Vm.init(self.allocator, self.config.chain_id);
        defer vm.deinit();
        
        // Configure VM with execution parameters
        try self.configure_vm(&vm);
        
        // Execute bytecode
        const start_time = std.time.nanoTimestamp();
        
        const result = vm.execute_contract(
            Address.zero(), // caller
            Address.zero(), // contract address  
            0, // value
            call_data,
            self.config.gas_limit,
            bytecode
        ) catch |err| {
            return ExecutionOutput{
                .success = false,
                .error = err,
                .gas_used = 0,
                .output = &[_]u8{},
                .execution_time_ns = std.time.nanoTimestamp() - start_time,
                .trace = if (self.config.trace) try self.get_execution_trace(&vm) else null,
            };
        };
        
        const execution_time = std.time.nanoTimestamp() - start_time;
        
        return ExecutionOutput{
            .success = result.is_success(),
            .error = null,
            .gas_used = result.gas_used,
            .output = try self.allocator.dupe(u8, result.output),
            .execution_time_ns = execution_time,
            .trace = if (self.config.trace) try self.get_execution_trace(&vm) else null,
        };
    }
    
    pub fn execute_transaction(self: *EvmExecutor, tx: Transaction) !ExecutionOutput {
        var vm = try Vm.init(self.allocator, self.config.chain_id);
        defer vm.deinit();
        
        try self.configure_vm(&vm);
        
        const start_time = std.time.nanoTimestamp();
        
        const result = if (tx.to) |to_address|
            vm.execute_call(tx.from, to_address, tx.value, tx.data, tx.gas_limit)
        else
            vm.execute_create(tx.from, tx.value, tx.data, tx.gas_limit);
        
        const execution_time = std.time.nanoTimestamp() - start_time;
        
        return ExecutionOutput{
            .success = result.is_success(),
            .error = null,
            .gas_used = result.gas_used,
            .output = try self.allocator.dupe(u8, result.output),
            .execution_time_ns = execution_time,
            .trace = if (self.config.trace) try self.get_execution_trace(&vm) else null,
        };
    }
    
    fn configure_vm(self: *EvmExecutor, vm: *Vm) !void {
        // Set block environment
        vm.context.block.number = self.config.block_number;
        vm.context.block.timestamp = self.config.block_timestamp;
        vm.context.block.coinbase = self.config.block_coinbase;
        vm.context.block.gas_limit = self.config.gas_limit;
        
        // Set hardfork
        vm.hardfork = try Hardfork.from_name(self.config.hardfork);
        
        // Configure tracing if enabled
        if (self.config.trace) {
            // Add tracing inspector
        }
    }
    
    fn get_execution_trace(self: *EvmExecutor, vm: *Vm) ![]TraceStep {
        _ = self;
        _ = vm;
        // Implementation would extract trace from VM
        return &[_]TraceStep{};
    }
};

pub const ExecutionOutput = struct {
    success: bool,
    error: ?anyerror,
    gas_used: u64,
    output: []u8,
    execution_time_ns: i128,
    trace: ?[]TraceStep,
    
    pub fn print_summary(self: *const ExecutionOutput) void {
        std.log.info("=== EXECUTION SUMMARY ===");
        std.log.info("Success: {}", .{self.success});
        std.log.info("Gas used: {}", .{self.gas_used});
        std.log.info("Execution time: {d:.2}ms", .{@as(f64, @floatFromInt(self.execution_time_ns)) / 1_000_000.0});
        
        if (self.error) |err| {
            std.log.err("Error: {}", .{err});
        }
        
        if (self.output.len > 0) {
            std.log.info("Output: 0x{s}", .{std.fmt.fmtSliceHexLower(self.output)});
        }
        
        if (self.trace) |trace| {
            std.log.info("Trace length: {} steps", .{trace.len});
        }
    }
    
    pub fn to_json(self: *const ExecutionOutput, allocator: std.mem.Allocator) ![]u8 {
        var buffer = std.ArrayList(u8).init(allocator);
        var writer = buffer.writer();
        
        try writer.writeAll("{");
        try writer.print("\"success\":{},", .{self.success});
        try writer.print("\"gasUsed\":{},", .{self.gas_used});
        try writer.print("\"executionTimeNs\":{},", .{self.execution_time_ns});
        
        if (self.error) |err| {
            try writer.print("\"error\":\"{}\",", .{err});
        }
        
        try writer.print("\"output\":\"0x{s}\"", .{std.fmt.fmtSliceHexLower(self.output)});
        
        if (self.trace) |trace| {
            try writer.writeAll(",\"trace\":[");
            for (trace, 0..) |step, i| {
                if (i > 0) try writer.writeAll(",");
                try step.to_json(writer);
            }
            try writer.writeAll("]");
        }
        
        try writer.writeAll("}");
        return buffer.toOwnedSlice();
    }
};

pub const TraceStep = struct {
    pc: u32,
    opcode: u8,
    opcode_name: []const u8,
    gas_remaining: u64,
    gas_cost: u64,
    depth: u32,
    stack: []U256,
    memory: []u8,
    storage_changes: []StorageChange,
    
    pub fn to_json(self: *const TraceStep, writer: anytype) !void {
        try writer.writeAll("{");
        try writer.print("\"pc\":{},", .{self.pc});
        try writer.print("\"op\":{},", .{self.opcode});
        try writer.print("\"opName\":\"{s}\",", .{self.opcode_name});
        try writer.print("\"gas\":{},", .{self.gas_remaining});
        try writer.print("\"gasCost\":{},", .{self.gas_cost});
        try writer.print("\"depth\":{}", .{self.depth});
        try writer.writeAll("}");
    }
};

pub const StorageChange = struct {
    key: U256,
    old_value: U256,
    new_value: U256,
};

pub const Transaction = struct {
    from: Address,
    to: ?Address,
    value: U256,
    data: []u8,
    gas_limit: u64,
    gas_price: u64,
    nonce: u64,
};
```

#### 2. State Inspector (`tevm-state`)
```zig
pub const StateInspector = struct {
    allocator: std.mem.Allocator,
    vm: Vm,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !StateInspector {
        return StateInspector{
            .allocator = allocator,
            .vm = try Vm.init(allocator, chain_id),
        };
    }
    
    pub fn deinit(self: *StateInspector) void {
        self.vm.deinit();
    }
    
    pub fn inspect_account(self: *StateInspector, address: Address) !AccountInfo {
        const balance = try self.vm.state.get_balance(address);
        const nonce = try self.vm.state.get_nonce(address);
        const code = try self.vm.state.get_code(address);
        const code_hash = try self.vm.state.get_code_hash(address);
        
        return AccountInfo{
            .address = address,
            .balance = balance,
            .nonce = nonce,
            .code = try self.allocator.dupe(u8, code),
            .code_hash = code_hash,
            .code_size = code.len,
            .is_contract = code.len > 0,
        };
    }
    
    pub fn inspect_storage(self: *StateInspector, address: Address, key: ?U256) !StorageInfo {
        if (key) |storage_key| {
            const value = try self.vm.state.get_storage(address, storage_key);
            return StorageInfo{
                .address = address,
                .entries = &[_]StorageEntry{StorageEntry{ .key = storage_key, .value = value }},
                .total_entries = 1,
            };
        } else {
            // Get all storage entries
            var entries = std.ArrayList(StorageEntry).init(self.allocator);
            defer entries.deinit();
            
            var storage_iterator = try self.vm.state.get_storage_iterator(address);
            defer storage_iterator.deinit();
            
            while (storage_iterator.next()) |entry| {
                try entries.append(StorageEntry{
                    .key = entry.key,
                    .value = entry.value,
                });
            }
            
            return StorageInfo{
                .address = address,
                .entries = try entries.toOwnedSlice(),
                .total_entries = entries.items.len,
            };
        }
    }
    
    pub fn get_state_summary(self: *StateInspector) !StateSummary {
        var account_count: u32 = 0;
        var contract_count: u32 = 0;
        var total_balance: U256 = 0;
        var total_storage_entries: u64 = 0;
        
        var account_iterator = try self.vm.state.get_account_iterator();
        defer account_iterator.deinit();
        
        while (account_iterator.next()) |entry| {
            const address = entry.key;
            const account = entry.value;
            
            account_count += 1;
            total_balance += account.balance;
            
            if (account.code.len > 0) {
                contract_count += 1;
            }
            
            var storage_iterator = try self.vm.state.get_storage_iterator(address);
            defer storage_iterator.deinit();
            
            while (storage_iterator.next()) |_| {
                total_storage_entries += 1;
            }
        }
        
        return StateSummary{
            .account_count = account_count,
            .contract_count = contract_count,
            .eoa_count = account_count - contract_count,
            .total_balance = total_balance,
            .total_storage_entries = total_storage_entries,
        };
    }
};

pub const AccountInfo = struct {
    address: Address,
    balance: U256,
    nonce: u64,
    code: []u8,
    code_hash: U256,
    code_size: usize,
    is_contract: bool,
    
    pub fn print(self: *const AccountInfo) void {
        std.log.info("=== ACCOUNT INFO ===");
        std.log.info("Address: {}", .{self.address});
        std.log.info("Balance: {} wei", .{self.balance});
        std.log.info("Nonce: {}", .{self.nonce});
        std.log.info("Code size: {} bytes", .{self.code_size});
        std.log.info("Code hash: 0x{x}", .{self.code_hash});
        std.log.info("Type: {s}", .{if (self.is_contract) "Contract" else "EOA"});
        
        if (self.code.len > 0) {
            std.log.info("Code: 0x{s}", .{std.fmt.fmtSliceHexLower(self.code[0..@min(32, self.code.len)])});
            if (self.code.len > 32) {
                std.log.info("  ... (truncated, {} total bytes)", .{self.code.len});
            }
        }
    }
    
    pub fn to_json(self: *const AccountInfo, allocator: std.mem.Allocator) ![]u8 {
        var buffer = std.ArrayList(u8).init(allocator);
        var writer = buffer.writer();
        
        try writer.writeAll("{");
        try writer.print("\"address\":\"{}\",", .{self.address});
        try writer.print("\"balance\":\"{}\",", .{self.balance});
        try writer.print("\"nonce\":{},", .{self.nonce});
        try writer.print("\"codeSize\":{},", .{self.code_size});
        try writer.print("\"codeHash\":\"0x{x}\",", .{self.code_hash});
        try writer.print("\"isContract\":{}", .{self.is_contract});
        
        if (self.code.len > 0) {
            try writer.print(",\"code\":\"0x{s}\"", .{std.fmt.fmtSliceHexLower(self.code)});
        }
        
        try writer.writeAll("}");
        return buffer.toOwnedSlice();
    }
};

pub const StorageInfo = struct {
    address: Address,
    entries: []StorageEntry,
    total_entries: usize,
    
    pub fn print(self: *const StorageInfo) void {
        std.log.info("=== STORAGE INFO ===");
        std.log.info("Address: {}", .{self.address});
        std.log.info("Total entries: {}", .{self.total_entries});
        
        for (self.entries) |entry| {
            std.log.info("  0x{x} => 0x{x}", .{ entry.key, entry.value });
        }
    }
};

pub const StorageEntry = struct {
    key: U256,
    value: U256,
};

pub const StateSummary = struct {
    account_count: u32,
    contract_count: u32,
    eoa_count: u32,
    total_balance: U256,
    total_storage_entries: u64,
    
    pub fn print(self: *const StateSummary) void {
        std.log.info("=== STATE SUMMARY ===");
        std.log.info("Total accounts: {}", .{self.account_count});
        std.log.info("  Contracts: {}", .{self.contract_count});
        std.log.info("  EOAs: {}", .{self.eoa_count});
        std.log.info("Total balance: {} wei", .{self.total_balance});
        std.log.info("Storage entries: {}", .{self.total_storage_entries});
    }
};
```

#### 3. Bytecode Analyzer (`tevm-analyze`)
```zig
pub const BytecodeAnalyzer = struct {
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) BytecodeAnalyzer {
        return BytecodeAnalyzer{ .allocator = allocator };
    }
    
    pub fn analyze_bytecode(self: *BytecodeAnalyzer, bytecode: []const u8) !AnalysisResult {
        var result = AnalysisResult.init(self.allocator);
        
        // Disassemble bytecode
        result.disassembly = try self.disassemble(bytecode);
        
        // Analyze opcodes
        result.opcode_stats = try self.analyze_opcodes(bytecode);
        
        // Find jump destinations
        result.jump_destinations = try self.find_jump_destinations(bytecode);
        
        // Analyze gas usage
        result.gas_analysis = try self.analyze_gas_usage(bytecode);
        
        // Security analysis
        result.security_issues = try self.analyze_security(bytecode);
        
        return result;
    }
    
    fn disassemble(self: *BytecodeAnalyzer, bytecode: []const u8) ![]Instruction {
        var instructions = std.ArrayList(Instruction).init(self.allocator);
        
        var pc: u32 = 0;
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            const opcode_info = get_opcode_info(opcode);
            
            var instruction = Instruction{
                .pc = pc,
                .opcode = opcode,
                .name = opcode_info.name,
                .immediate = null,
                .gas_cost = opcode_info.gas_cost,
            };
            
            // Handle PUSH instructions with immediate data
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                if (pc + push_size < bytecode.len) {
                    instruction.immediate = try self.allocator.dupe(u8, bytecode[pc + 1..pc + 1 + push_size]);
                    pc += push_size;
                }
            }
            
            try instructions.append(instruction);
            pc += 1;
        }
        
        return instructions.toOwnedSlice();
    }
    
    fn analyze_opcodes(self: *BytecodeAnalyzer, bytecode: []const u8) !OpcodeStats {
        var stats = OpcodeStats.init(self.allocator);
        
        var pc: usize = 0;
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            
            const count = stats.counts.get(opcode) orelse 0;
            try stats.counts.put(opcode, count + 1);
            
            stats.total_instructions += 1;
            
            // Skip immediate data for PUSH instructions
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
            
            pc += 1;
        }
        
        return stats;
    }
    
    fn find_jump_destinations(self: *BytecodeAnalyzer, bytecode: []const u8) ![]u32 {
        var destinations = std.ArrayList(u32).init(self.allocator);
        
        var pc: usize = 0;
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            
            if (opcode == 0x5B) { // JUMPDEST
                try destinations.append(@as(u32, @intCast(pc)));
            }
            
            // Skip immediate data for PUSH instructions
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
            
            pc += 1;
        }
        
        return destinations.toOwnedSlice();
    }
    
    fn analyze_gas_usage(self: *BytecodeAnalyzer, bytecode: []const u8) !GasAnalysis {
        var analysis = GasAnalysis.init();
        
        var pc: usize = 0;
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            const opcode_info = get_opcode_info(opcode);
            
            analysis.total_static_gas += opcode_info.gas_cost;
            analysis.max_dynamic_gas += opcode_info.max_dynamic_gas;
            
            // Track expensive operations
            if (opcode_info.gas_cost > 100) {
                analysis.expensive_operations += 1;
            }
            
            // Skip immediate data for PUSH instructions
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
            
            pc += 1;
        }
        
        return analysis;
    }
    
    fn analyze_security(self: *BytecodeAnalyzer, bytecode: []const u8) ![]SecurityIssue {
        var issues = std.ArrayList(SecurityIssue).init(self.allocator);
        
        var pc: usize = 0;
        while (pc < bytecode.len) {
            const opcode = bytecode[pc];
            
            // Check for potentially dangerous operations
            switch (opcode) {
                0xF1, 0xF2, 0xF4, 0xFA => { // CALL variants
                    try issues.append(SecurityIssue{
                        .type = .ExternalCall,
                        .severity = .Medium,
                        .pc = @as(u32, @intCast(pc)),
                        .description = "External call detected - potential reentrancy risk",
                    });
                },
                0xFF => { // SELFDESTRUCT
                    try issues.append(SecurityIssue{
                        .type = .SelfDestruct,
                        .severity = .High,
                        .pc = @as(u32, @intCast(pc)),
                        .description = "SELFDESTRUCT operation - contract can be destroyed",
                    });
                },
                0xF0, 0xF5 => { // CREATE, CREATE2
                    try issues.append(SecurityIssue{
                        .type = .ContractCreation,
                        .severity = .Low,
                        .pc = @as(u32, @intCast(pc)),
                        .description = "Contract creation operation",
                    });
                },
                else => {},
            }
            
            // Skip immediate data for PUSH instructions
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                pc += push_size;
            }
            
            pc += 1;
        }
        
        return issues.toOwnedSlice();
    }
};

pub const AnalysisResult = struct {
    disassembly: []Instruction,
    opcode_stats: OpcodeStats,
    jump_destinations: []u32,
    gas_analysis: GasAnalysis,
    security_issues: []SecurityIssue,
    
    pub fn init(allocator: std.mem.Allocator) AnalysisResult {
        return AnalysisResult{
            .disassembly = &[_]Instruction{},
            .opcode_stats = OpcodeStats.init(allocator),
            .jump_destinations = &[_]u32{},
            .gas_analysis = GasAnalysis.init(),
            .security_issues = &[_]SecurityIssue{},
        };
    }
    
    pub fn print_summary(self: *const AnalysisResult) void {
        std.log.info("=== BYTECODE ANALYSIS ===");
        std.log.info("Instructions: {}", .{self.disassembly.len});
        std.log.info("Jump destinations: {}", .{self.jump_destinations.len});
        std.log.info("Static gas cost: {}", .{self.gas_analysis.total_static_gas});
        std.log.info("Max dynamic gas: {}", .{self.gas_analysis.max_dynamic_gas});
        std.log.info("Security issues: {}", .{self.security_issues.len});
        
        // Print top opcodes
        std.log.info("\nTop opcodes:");
        // Implementation would sort and display most frequent opcodes
        
        // Print security issues
        if (self.security_issues.len > 0) {
            std.log.info("\nSecurity issues:");
            for (self.security_issues) |issue| {
                std.log.warn("  PC {}: {} - {s}", .{ issue.pc, issue.severity, issue.description });
            }
        }
    }
};

pub const Instruction = struct {
    pc: u32,
    opcode: u8,
    name: []const u8,
    immediate: ?[]u8,
    gas_cost: u32,
};

pub const OpcodeStats = struct {
    counts: std.HashMap(u8, u32, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
    total_instructions: u32,
    
    pub fn init(allocator: std.mem.Allocator) OpcodeStats {
        return OpcodeStats{
            .counts = std.HashMap(u8, u32, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage).init(allocator),
            .total_instructions = 0,
        };
    }
};

pub const GasAnalysis = struct {
    total_static_gas: u64,
    max_dynamic_gas: u64,
    expensive_operations: u32,
    
    pub fn init() GasAnalysis {
        return GasAnalysis{
            .total_static_gas = 0,
            .max_dynamic_gas = 0,
            .expensive_operations = 0,
        };
    }
};

pub const SecurityIssue = struct {
    type: SecurityIssueType,
    severity: Severity,
    pc: u32,
    description: []const u8,
    
    pub const SecurityIssueType = enum {
        ExternalCall,
        SelfDestruct,
        ContractCreation,
        UnprotectedEther,
        ReentrancyRisk,
    };
    
    pub const Severity = enum {
        Low,
        Medium,
        High,
        Critical,
    };
};

const OpcodeInfo = struct {
    name: []const u8,
    gas_cost: u32,
    max_dynamic_gas: u64,
};

fn get_opcode_info(opcode: u8) OpcodeInfo {
    return switch (opcode) {
        0x00 => OpcodeInfo{ .name = "STOP", .gas_cost = 0, .max_dynamic_gas = 0 },
        0x01 => OpcodeInfo{ .name = "ADD", .gas_cost = 3, .max_dynamic_gas = 0 },
        0x02 => OpcodeInfo{ .name = "MUL", .gas_cost = 5, .max_dynamic_gas = 0 },
        0x03 => OpcodeInfo{ .name = "SUB", .gas_cost = 3, .max_dynamic_gas = 0 },
        0x04 => OpcodeInfo{ .name = "DIV", .gas_cost = 5, .max_dynamic_gas = 0 },
        0x05 => OpcodeInfo{ .name = "SDIV", .gas_cost = 5, .max_dynamic_gas = 0 },
        // ... continue for all opcodes
        0x54 => OpcodeInfo{ .name = "SLOAD", .gas_cost = 2100, .max_dynamic_gas = 0 },
        0x55 => OpcodeInfo{ .name = "SSTORE", .gas_cost = 20000, .max_dynamic_gas = 0 },
        0xF1 => OpcodeInfo{ .name = "CALL", .gas_cost = 700, .max_dynamic_gas = 1000000 },
        else => OpcodeInfo{ .name = "UNKNOWN", .gas_cost = 0, .max_dynamic_gas = 0 },
    };
}
```

#### 4. Performance Benchmark (`tevm-bench`)
```zig
pub const PerformanceBench = struct {
    allocator: std.mem.Allocator,
    config: BenchConfig,
    results: std.ArrayList(BenchResult),
    
    pub const BenchConfig = struct {
        iterations: u32,
        warmup_iterations: u32,
        bytecode_sizes: []u32,
        gas_limits: []u64,
        parallel: bool,
        output_format: OutputFormat,
        
        pub const OutputFormat = enum {
            Human,
            Json,
            CSV,
        };
        
        pub fn default() BenchConfig {
            return BenchConfig{
                .iterations = 1000,
                .warmup_iterations = 100,
                .bytecode_sizes = &[_]u32{ 100, 1000, 10000 },
                .gas_limits = &[_]u64{ 100000, 1000000, 10000000 },
                .parallel = true,
                .output_format = .Human,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: BenchConfig) PerformanceBench {
        return PerformanceBench{
            .allocator = allocator,
            .config = config,
            .results = std.ArrayList(BenchResult).init(allocator),
        };
    }
    
    pub fn deinit(self: *PerformanceBench) void {
        self.results.deinit();
    }
    
    pub fn run_benchmarks(self: *PerformanceBench) !void {
        std.log.info("Starting performance benchmarks...");
        
        // Benchmark different scenarios
        try self.benchmark_arithmetic_operations();
        try self.benchmark_memory_operations();
        try self.benchmark_storage_operations();
        try self.benchmark_call_operations();
        try self.benchmark_bytecode_sizes();
        
        // Print results
        try self.print_results();
    }
    
    fn benchmark_arithmetic_operations(self: *PerformanceBench) !void {
        const bytecode = &[_]u8{
            0x60, 0x01, // PUSH1 1
            0x60, 0x02, // PUSH1 2
            0x01,       // ADD
            0x60, 0x03, // PUSH1 3
            0x02,       // MUL
            0x60, 0x04, // PUSH1 4
            0x03,       // SUB
            0x50,       // POP
            0x00,       // STOP
        };
        
        const result = try self.benchmark_bytecode("arithmetic", bytecode, 100000);
        try self.results.append(result);
    }
    
    fn benchmark_memory_operations(self: *PerformanceBench) !void {
        const bytecode = &[_]u8{
            0x60, 0x20, // PUSH1 32
            0x60, 0x00, // PUSH1 0
            0x52,       // MSTORE
            0x60, 0x00, // PUSH1 0
            0x51,       // MLOAD
            0x50,       // POP
            0x00,       // STOP
        };
        
        const result = try self.benchmark_bytecode("memory", bytecode, 100000);
        try self.results.append(result);
    }
    
    fn benchmark_storage_operations(self: *PerformanceBench) !void {
        const bytecode = &[_]u8{
            0x60, 0x42, // PUSH1 0x42
            0x60, 0x01, // PUSH1 1
            0x55,       // SSTORE
            0x60, 0x01, // PUSH1 1
            0x54,       // SLOAD
            0x50,       // POP
            0x00,       // STOP
        };
        
        const result = try self.benchmark_bytecode("storage", bytecode, 100000);
        try self.results.append(result);
    }
    
    fn benchmark_call_operations(self: *PerformanceBench) !void {
        // Create a simple contract to call
        const target_bytecode = &[_]u8{
            0x60, 0x42, // PUSH1 0x42
            0x60, 0x00, // PUSH1 0
            0x52,       // MSTORE
            0x60, 0x20, // PUSH1 32
            0x60, 0x00, // PUSH1 0
            0xF3,       // RETURN
        };
        
        const caller_bytecode = &[_]u8{
            0x60, 0x00, // PUSH1 0 (return size)
            0x60, 0x00, // PUSH1 0 (return offset)
            0x60, 0x00, // PUSH1 0 (input size)
            0x60, 0x00, // PUSH1 0 (input offset)
            0x60, 0x00, // PUSH1 0 (value)
            // Target address would be pushed here
            0x61, 0xFF, 0xFF, // PUSH2 0xFFFF (gas)
            0xF1,       // CALL
            0x50,       // POP
            0x00,       // STOP
        };
        
        const result = try self.benchmark_bytecode("calls", caller_bytecode, 1000000);
        try self.results.append(result);
    }
    
    fn benchmark_bytecode_sizes(self: *PerformanceBench) !void {
        for (self.config.bytecode_sizes) |size| {
            // Generate bytecode of specified size
            var bytecode = try self.allocator.alloc(u8, size);
            defer self.allocator.free(bytecode);
            
            // Fill with simple operations
            var i: usize = 0;
            while (i < size - 1) {
                bytecode[i] = 0x60; // PUSH1
                bytecode[i + 1] = @as(u8, @intCast(i % 256));
                i += 2;
            }
            if (i < size) {
                bytecode[i] = 0x00; // STOP
            }
            
            const name = try std.fmt.allocPrint(self.allocator, "size_{}", .{size});
            defer self.allocator.free(name);
            
            const result = try self.benchmark_bytecode(name, bytecode, 1000000);
            try self.results.append(result);
        }
    }
    
    fn benchmark_bytecode(self: *PerformanceBench, name: []const u8, bytecode: []const u8, gas_limit: u64) !BenchResult {
        var vm = try Vm.init(self.allocator, 1);
        defer vm.deinit();
        
        // Warmup
        for (0..self.config.warmup_iterations) |_| {
            _ = vm.execute_bytecode(bytecode, gas_limit) catch {};
            vm.reset_state();
        }
        
        // Actual benchmark
        var total_time: i128 = 0;
        var successful_runs: u32 = 0;
        var total_gas_used: u64 = 0;
        
        for (0..self.config.iterations) |_| {
            const start_time = std.time.nanoTimestamp();
            
            const result = vm.execute_bytecode(bytecode, gas_limit) catch {
                continue;
            };
            
            const end_time = std.time.nanoTimestamp();
            total_time += end_time - start_time;
            successful_runs += 1;
            total_gas_used += result.gas_used;
            
            vm.reset_state();
        }
        
        const avg_time_ns = if (successful_runs > 0) @divTrunc(total_time, successful_runs) else 0;
        const avg_gas = if (successful_runs > 0) total_gas_used / successful_runs else 0;
        
        return BenchResult{
            .name = try self.allocator.dupe(u8, name),
            .iterations = successful_runs,
            .avg_time_ns = avg_time_ns,
            .min_time_ns = avg_time_ns, // Simplified - would track actual min/max
            .max_time_ns = avg_time_ns,
            .avg_gas_used = avg_gas,
            .throughput_ops_per_sec = if (avg_time_ns > 0) @as(f64, 1_000_000_000.0) / @as(f64, @floatFromInt(avg_time_ns)) else 0,
        };
    }
    
    fn print_results(self: *PerformanceBench) !void {
        switch (self.config.output_format) {
            .Human => try self.print_human_results(),
            .Json => try self.print_json_results(),
            .CSV => try self.print_csv_results(),
        }
    }
    
    fn print_human_results(self: *PerformanceBench) !void {
        std.log.info("=== PERFORMANCE BENCHMARK RESULTS ===");
        
        for (self.results.items) |result| {
            std.log.info("");
            std.log.info("Benchmark: {s}", .{result.name});
            std.log.info("  Iterations: {}", .{result.iterations});
            std.log.info("  Avg time: {d:.2}μs", .{@as(f64, @floatFromInt(result.avg_time_ns)) / 1000.0});
            std.log.info("  Avg gas: {}", .{result.avg_gas_used});
            std.log.info("  Throughput: {d:.2} ops/sec", .{result.throughput_ops_per_sec});
        }
    }
    
    fn print_json_results(self: *PerformanceBench) !void {
        var buffer = std.ArrayList(u8).init(self.allocator);
        defer buffer.deinit();
        
        var writer = buffer.writer();
        
        try writer.writeAll("{\"benchmarks\":[");
        for (self.results.items, 0..) |result, i| {
            if (i > 0) try writer.writeAll(",");
            try writer.writeAll("{");
            try writer.print("\"name\":\"{s}\",", .{result.name});
            try writer.print("\"iterations\":{},", .{result.iterations});
            try writer.print("\"avgTimeNs\":{},", .{result.avg_time_ns});
            try writer.print("\"avgGasUsed\":{},", .{result.avg_gas_used});
            try writer.print("\"throughputOpsPerSec\":{d}", .{result.throughput_ops_per_sec});
            try writer.writeAll("}");
        }
        try writer.writeAll("]}");
        
        std.log.info("{s}", .{buffer.items});
    }
    
    fn print_csv_results(self: *PerformanceBench) !void {
        std.log.info("name,iterations,avg_time_ns,avg_gas_used,throughput_ops_per_sec");
        
        for (self.results.items) |result| {
            std.log.info("{s},{},{},{},{d}", .{
                result.name,
                result.iterations,
                result.avg_time_ns,
                result.avg_gas_used,
                result.throughput_ops_per_sec,
            });
        }
    }
};

pub const BenchResult = struct {
    name: []u8,
    iterations: u32,
    avg_time_ns: i128,
    min_time_ns: i128,
    max_time_ns: i128,
    avg_gas_used: u64,
    throughput_ops_per_sec: f64,
};
```

## Implementation Requirements

### Core Functionality
1. **Bytecode Execution**: Execute arbitrary bytecode with configurable parameters
2. **State Inspection**: Query and analyze EVM state (accounts, storage, code)
3. **Bytecode Analysis**: Disassemble, analyze, and report on bytecode
4. **Performance Benchmarking**: Measure and compare EVM performance
5. **Debugging Support**: Step-by-step execution and trace analysis
6. **Multiple Output Formats**: Human-readable, JSON, and CSV output

## Implementation Tasks

### Task 1: Implement Main CLI Interface
File: `/src/evm/cli/main.zig`
```zig
const std = @import("std");
const EvmExecutor = @import("executor.zig").EvmExecutor;
const StateInspector = @import("state_inspector.zig").StateInspector;
const BytecodeAnalyzer = @import("bytecode_analyzer.zig").BytecodeAnalyzer;
const PerformanceBench = @import("performance_bench.zig").PerformanceBench;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);
    
    if (args.len < 2) {
        print_usage();
        return;
    }
    
    const command = args[1];
    const command_args = args[2..];
    
    if (std.mem.eql(u8, command, "exec")) {
        try run_executor(allocator, command_args);
    } else if (std.mem.eql(u8, command, "state")) {
        try run_state_inspector(allocator, command_args);
    } else if (std.mem.eql(u8, command, "analyze")) {
        try run_bytecode_analyzer(allocator, command_args);
    } else if (std.mem.eql(u8, command, "bench")) {
        try run_performance_bench(allocator, command_args);
    } else if (std.mem.eql(u8, command, "help")) {
        print_help();
    } else {
        std.log.err("Unknown command: {s}", .{command});
        print_usage();
        std.process.exit(1);
    }
}

fn print_usage() void {
    std.log.info("Tevm EVM CLI Tools");
    std.log.info("");
    std.log.info("USAGE:");
    std.log.info("    tevm-cli <COMMAND> [OPTIONS]");
    std.log.info("");
    std.log.info("COMMANDS:");
    std.log.info("    exec      Execute bytecode or transactions");
    std.log.info("    state     Inspect EVM state and accounts");
    std.log.info("    analyze   Analyze bytecode for structure and security");
    std.log.info("    bench     Run performance benchmarks");
    std.log.info("    help      Show detailed help for commands");
    std.log.info("");
    std.log.info("Run 'tevm-cli help <COMMAND>' for command-specific help.");
}

fn print_help() void {
    std.log.info("Tevm EVM CLI Tools - Detailed Help");
    std.log.info("");
    std.log.info("EXEC COMMAND:");
    std.log.info("    tevm-cli exec [OPTIONS] <BYTECODE>");
    std.log.info("    Execute bytecode with specified parameters");
    std.log.info("");
    std.log.info("    Options:");
    std.log.info("      --gas <LIMIT>         Gas limit (default: 30000000)");
    std.log.info("      --gas-price <PRICE>   Gas price in wei (default: 20000000000)");
    std.log.info("      --value <VALUE>       Value to send in wei (default: 0)");
    std.log.info("      --data <DATA>         Call data (hex)");
    std.log.info("      --chain-id <ID>       Chain ID (default: 1)");
    std.log.info("      --hardfork <FORK>     Hardfork (default: cancun)");
    std.log.info("      --trace               Enable execution tracing");
    std.log.info("      --json                Output in JSON format");
    std.log.info("");
    std.log.info("STATE COMMAND:");
    std.log.info("    tevm-cli state [OPTIONS] <ADDRESS>");
    std.log.info("    Inspect account state and storage");
    std.log.info("");
    std.log.info("    Options:");
    std.log.info("      --storage <KEY>       Inspect specific storage slot");
    std.log.info("      --all-storage         Show all storage slots");
    std.log.info("      --summary             Show state summary");
    std.log.info("      --json                Output in JSON format");
    std.log.info("");
    std.log.info("ANALYZE COMMAND:");
    std.log.info("    tevm-cli analyze [OPTIONS] <BYTECODE>");
    std.log.info("    Analyze bytecode structure and security");
    std.log.info("");
    std.log.info("    Options:");
    std.log.info("      --disasm              Show disassembly");
    std.log.info("      --gas                 Show gas analysis");
    std.log.info("      --security            Show security analysis");
    std.log.info("      --stats               Show opcode statistics");
    std.log.info("      --json                Output in JSON format");
    std.log.info("");
    std.log.info("BENCH COMMAND:");
    std.log.info("    tevm-cli bench [OPTIONS]");
    std.log.info("    Run performance benchmarks");
    std.log.info("");
    std.log.info("    Options:");
    std.log.info("      --iterations <N>      Number of iterations (default: 1000)");
    std.log.info("      --warmup <N>          Warmup iterations (default: 100)");
    std.log.info("      --parallel            Use parallel execution");
    std.log.info("      --format <FORMAT>     Output format: human|json|csv");
}

fn run_executor(allocator: std.mem.Allocator, args: [][]const u8) !void {
    var config = EvmExecutor.ExecutorConfig.default();
    var bytecode: ?[]const u8 = null;
    var call_data: []const u8 = &[_]u8{};
    
    // Parse arguments
    var i: usize = 0;
    while (i < args.len) {
        const arg = args[i];
        
        if (std.mem.eql(u8, arg, "--gas")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--gas requires a value");
                return;
            }
            config.gas_limit = try std.fmt.parseInt(u64, args[i], 10);
        } else if (std.mem.eql(u8, arg, "--gas-price")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--gas-price requires a value");
                return;
            }
            config.gas_price = try std.fmt.parseInt(u64, args[i], 10);
        } else if (std.mem.eql(u8, arg, "--chain-id")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--chain-id requires a value");
                return;
            }
            config.chain_id = try std.fmt.parseInt(u64, args[i], 10);
        } else if (std.mem.eql(u8, arg, "--hardfork")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--hardfork requires a value");
                return;
            }
            config.hardfork = args[i];
        } else if (std.mem.eql(u8, arg, "--data")) {
            i += 1;
            if (i >= args.len) {
                std.log.err("--data requires a value");
                return;
            }
            call_data = try parse_hex_string(allocator, args[i]);
        } else if (std.mem.eql(u8, arg, "--trace")) {
            config.trace = true;
        } else if (std.mem.eql(u8, arg, "--json")) {
            config.json_output = true;
        } else if (!std.mem.startsWith(u8, arg, "--")) {
            // This should be the bytecode
            bytecode = try parse_hex_string(allocator, arg);
        } else {
            std.log.err("Unknown option: {s}", .{arg});
            return;
        }
        
        i += 1;
    }
    
    if (bytecode == null) {
        std.log.err("No bytecode provided");
        return;
    }
    
    // Execute bytecode
    var executor = try EvmExecutor.init(allocator, config);
    const result = try executor.execute_bytecode(bytecode.?, call_data);
    
    if (config.json_output) {
        const json = try result.to_json(allocator);
        defer allocator.free(json);
        std.log.info("{s}", .{json});
    } else {
        result.print_summary();
    }
}

fn run_state_inspector(allocator: std.mem.Allocator, args: [][]const u8) !void {
    _ = allocator;
    _ = args;
    std.log.info("State inspector not yet implemented");
}

fn run_bytecode_analyzer(allocator: std.mem.Allocator, args: [][]const u8) !void {
    _ = allocator;
    _ = args;
    std.log.info("Bytecode analyzer not yet implemented");
}

fn run_performance_bench(allocator: std.mem.Allocator, args: [][]const u8) !void {
    _ = allocator;
    _ = args;
    std.log.info("Performance benchmark not yet implemented");
}

fn parse_hex_string(allocator: std.mem.Allocator, hex_str: []const u8) ![]u8 {
    const clean_hex = if (std.mem.startsWith(u8, hex_str, "0x"))
        hex_str[2..]
    else
        hex_str;
    
    if (clean_hex.len % 2 != 0) {
        return error.InvalidHexLength;
    }
    
    const bytes = try allocator.alloc(u8, clean_hex.len / 2);
    _ = try std.fmt.hexToBytes(bytes, clean_hex);
    
    return bytes;
}
```

## Testing Requirements

### Test File
Create `/test/evm/cli/cli_tools_test.zig`

### Test Cases
```zig
test "executor command line parsing" {
    // Test argument parsing for executor
    // Test default values
    // Test error handling for invalid arguments
}

test "state inspector functionality" {
    // Test account inspection
    // Test storage queries
    // Test state summaries
}

test "bytecode analyzer output" {
    // Test disassembly generation
    // Test opcode statistics
    // Test security analysis
}

test "performance benchmark execution" {
    // Test benchmark execution
    // Test different output formats
    // Test timing accuracy
}

test "hex string parsing" {
    // Test valid hex strings
    // Test invalid hex strings
    // Test edge cases
}

test "json output formatting" {
    // Test JSON generation
    // Test output validity
    // Test escape handling
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/cli/main.zig` - Main CLI entry point
- `/src/evm/cli/executor.zig` - Bytecode execution CLI
- `/src/evm/cli/state_inspector.zig` - State inspection CLI
- `/src/evm/cli/bytecode_analyzer.zig` - Bytecode analysis CLI
- `/src/evm/cli/performance_bench.zig` - Performance benchmarking CLI
- `/src/evm/cli/utils.zig` - Shared CLI utilities
- `/src/evm/vm.zig` - Add CLI-friendly interfaces
- `/build.zig` - Add CLI build targets
- `/test/evm/cli/cli_tools_test.zig` - Comprehensive tests

## Success Criteria

1. **Complete Toolchain**: Full set of CLI tools for EVM development
2. **User-Friendly**: Clear interfaces with helpful error messages
3. **Flexible Output**: Support for human-readable, JSON, and CSV formats
4. **Performance**: Fast execution suitable for development workflows
5. **Integration Ready**: Easy integration with development pipelines
6. **Comprehensive**: Cover all major EVM debugging and analysis needs

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Error handling** - Graceful handling of invalid inputs and errors
3. **Performance** - Tools should be fast enough for interactive use
4. **Documentation** - Clear help and usage information
5. **Stability** - Reliable operation across different inputs and scenarios
6. **Cross-platform** - Work consistently across different operating systems

## References

- [Geth CLI Tools](https://geth.ethereum.org/docs/tools) - Reference implementation
- [Foundry CLI](https://book.getfoundry.sh/reference/cli) - Modern toolchain
- [Ethereum RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) - Standard interfaces
- [EIP-3155: EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155) - Tracing format
- [Clap (Zig CLI library)](https://github.com/Hejsil/zig-clap) - Argument parsing inspiration