# Implement CLI Tools

You are implementing CLI Tools for the Tevm EVM written in Zig. Your goal is to implement command-line tools for EVM testing and debugging following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_cli_tools` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_cli_tools feat_implement_cli_tools`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive command-line interface tools for the EVM implementation, providing utilities for testing, debugging, benchmarking, and development workflows. This includes bytecode execution, state inspection, performance profiling, and developer-friendly debugging interfaces.

## ELI5

Think of CLI tools as the Swiss Army knife for blockchain developers - they're specialized command-line utilities that help you work with smart contracts without needing a full graphical interface. Just like how you might use command-line tools to manage files (`ls`, `cd`, `mkdir`), these enhanced CLI tools let you test smart contracts, inspect blockchain state, debug transaction failures, and benchmark performance - all from your terminal. It's like having a developer's toolbox where each tool has a specific job: one tool runs contract code, another shows you what's in blockchain storage, and another tells you how fast your code executes. These enhanced versions add advanced features like detailed execution tracing, gas optimization analysis, and performance profiling that help developers build better, more efficient smart contracts.

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

#### 1. **Unit Tests** (`/test/evm/cli/cli_tools_test.zig`)
```zig
// Test basic CLI tool functionality
test "evm_executor basic functionality with known scenarios"
test "evm_executor handles edge cases correctly"
test "evm_executor validates input parameters"
test "evm_executor produces correct output format"
test "state_inspector inspects state correctly"
test "bytecode_analyzer analyzes bytecode correctly"
test "performance_profiler profiles execution correctly"
test "debugger_cli debugs contracts correctly"
```

#### 2. **Integration Tests**
```zig
test "cli_tools integrate with EVM execution context"
test "cli_tools work with existing EVM systems"
test "cli_tools maintain compatibility with hardforks"
test "cli_tools handle system-level interactions"
test "cli_output integrates with external tools"
test "cli_configuration persists across sessions"
test "cli_scripts support automation workflows"
test "cli_plugins extend functionality correctly"
```

#### 3. **Functional Tests**
```zig
test "cli_tools end-to-end functionality works correctly"
test "cli_tools handle realistic usage scenarios"
test "cli_tools maintain behavior under load"
test "cli_tools process complex inputs correctly"
test "tevm_exec executes bytecode correctly"
test "tevm_debug provides debugging capabilities"
test "tevm_bench measures performance accurately"
test "tevm_analyze produces useful analysis"
```

#### 4. **Performance Tests**
```zig
test "cli_tools meet performance requirements"
test "cli_tools memory usage within bounds"
test "cli_tools scalability with large inputs"
test "cli_tools benchmark against baseline"
test "cli_startup_time acceptable"
test "cli_execution_overhead minimal"
test "cli_memory_footprint optimized"
test "cli_responsiveness maintained"
```

#### 5. **Error Handling Tests**
```zig
test "cli_tools error propagation works correctly"
test "cli_tools proper error types and messages"
test "cli_tools graceful handling of invalid inputs"
test "cli_tools recovery from failure states"
test "cli_validation rejects invalid commands"
test "cli_execution handles gas exhaustion"
test "cli_file_handling manages file errors"
test "cli_network_handling manages network errors"
```

#### 6. **Compatibility Tests**
```zig
test "cli_tools maintain EVM specification compliance"
test "cli_tools cross-client behavior consistency"
test "cli_tools backward compatibility preserved"
test "cli_tools platform-specific behavior verified"
test "cli_output compatible with standard tools"
test "cli_formats match industry standards"
test "cli_interfaces consistent with conventions"
test "cli_behavior predictable across platforms"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic CLI commands work correctly
2. **Add integration tests** - Verify system-level interactions with file system and network
3. **Implement performance tests** - Meet efficiency requirements for CLI responsiveness
4. **Add error handling tests** - Robust failure management for user input errors
5. **Test edge cases** - Handle boundary conditions like large files and network timeouts
6. **Verify compatibility** - Ensure cross-platform consistency and standard compliance

### Test Data Sources
- **CLI specification requirements**: Command behavior and output format verification
- **Reference implementation data**: Cross-tool compatibility testing
- **Performance benchmarks**: CLI responsiveness and throughput baseline
- **Real-world usage scenarios**: Production workflow validation
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
test "evm_executor basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    
    var executor = EvmExecutor.init(allocator, EvmExecutor.ExecutorConfig.default());
    defer executor.deinit();
    
    const bytecode = test_data.simple_add_contract;
    const input = test_data.function_call_data;
    
    const result = try executor.execute(bytecode, input);
    
    try testing.expectEqual(test_data.expected_return_value, result.return_value);
    try testing.expect(result.gas_used > 0);
    try testing.expectEqual(ExecutionResult.Success, result.status);
}
```

**Only then implement:**
```zig
pub const EvmExecutor = struct {
    pub fn execute(self: *EvmExecutor, bytecode: []const u8, input: []const u8) !ExecutionResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test CLI argument parsing** - Ensure proper command-line interface handling
- **Verify tool integration** - Test compatibility with external development tools
- **Test cross-platform CLI behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [Geth CLI Tools](https://geth.ethereum.org/docs/tools) - Reference implementation
- [Foundry CLI](https://book.getfoundry.sh/reference/cli) - Modern toolchain
- [Ethereum RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) - Standard interfaces
- [EIP-3155: EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155) - Tracing format
- [Clap (Zig CLI library)](https://github.com/Hejsil/zig-clap) - Argument parsing inspiration

## EVMONE Context

An excellent and detailed prompt for building a comprehensive EVM toolkit. The `evmone` codebase provides robust, real-world examples for each of the specified tools. Here are the most relevant snippets to guide your implementation.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/t8n/t8n.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2023 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "../state/mpt_hash.hpp"
#include "../state/rlp.hpp"
#include "../statetest/statetest.hpp"
#include <evmone/evmone.h>
#include <nlohmann/json.hpp>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string_view>

// This file is the main entry point for evmone-t8n, a state transition tool.
// It's highly relevant for implementing `tevm-exec` and `tevm-state` as it
// demonstrates command-line parsing, loading state/environment/transactions,
// executing them, and writing out the resulting state.

int main(int argc, const char* argv[])
{
    evmc_revision rev = {};
    fs::path alloc_file;
    fs::path env_file;
    fs::path txs_file;
    fs::path output_dir;
    fs::path output_result_file;
    fs::path output_alloc_file;
    // ... other variables

    try
    {
        // Example of CLI argument parsing loop
        for (int i = 0; i < argc; ++i)
        {
            const std::string_view arg{argv[i]};

            if (arg == "--state.fork" && ++i < argc)
                rev = to_rev(argv[i]);
            else if (arg == "--input.alloc" && ++i < argc)
                alloc_file = argv[i];
            else if (arg == "--input.env" && ++i < argc)
                env_file = argv[i];
            else if (arg == "--input.txs" && ++i < argc)
                txs_file = argv[i];
            else if (arg == "--output.basedir" && ++i < argc)
            {
                output_dir = argv[i];
                fs::create_directories(output_dir);
            }
            // ... more arguments
        }

        // Loading environment and state from files
        state::BlockInfo block;
        TestBlockHashes block_hashes;
        TestState state;

        if (!alloc_file.empty())
        {
            const auto j = json::json::parse(std::ifstream{alloc_file}, nullptr, false);
            state = from_json<TestState>(j);
            validate_state(state, rev);
        }
        if (!env_file.empty())
        {
            const auto j = json::json::parse(std::ifstream{env_file});
            block = from_json_with_rev(j, rev); // Analogous to `ExecutorConfig`
            block_hashes = from_json<TestBlockHashes>(j);
        }

        json::json j_result;
        // ... (difficulty and base fee calculation)

        // Main transaction processing loop
        if (!txs_file.empty())
        {
            const auto j_txs = json::json::parse(std::ifstream{txs_file});
            evmc::VM vm{evmc_create_evmone()};

            if (trace)
                vm.set_option("trace", "1"); // How tracing is enabled

            for (size_t i = 0; i < j_txs.size(); ++i)
            {
                auto tx = test::from_json<state::Transaction>(j_txs[i]);
                // ...

                // Here is the core state transition
                auto res = test::transition(
                    state, block, block_hashes, tx, rev, vm, block_gas_left, blob_gas_left);

                // ... (processing results and rejected txs)
            }

            // ... (finalize block state)

            // Writing out results
            j_result["stateRoot"] = hex0x(state::mpt_hash(state));
        }

        std::ofstream{output_dir / output_result_file} << std::setw(2) << j_result;
        std::ofstream{output_dir / output_alloc_file} << std::setw(2) << to_json(TestState{state});
    }
    catch (const std::exception& e)
    {
        std::cerr << e.what() << '\n';
        return 1;
    }

    return 0;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/synthetic_benchmarks.cpp">
```cpp
// This file is an excellent reference for `tevm-bench`. It demonstrates how to
// generate bytecode for various benchmark scenarios, isolating different EVM features.

#include "synthetic_benchmarks.hpp"
#include "helpers.hpp"
#include "test/utils/bytecode.hpp"
#include <evmone/instructions_traits.hpp>

namespace evmone::test
{
namespace
{
// ... (helper enums and functions for categorizing instructions)

/// Generates the EVM benchmark loop inner code for the given opcode and "mode".
bytecode generate_loop_inner_code(CodeParams params)
{
    const auto [opcode, mode] = params;
    const auto category = get_instruction_category(opcode);
    switch (mode)
    {
    case Mode::min_stack:
        switch (category)
        {
        // Example for binary operations (like ADD, MUL)
        case InstructionCategory::binop:
            // DUP1 DUP1 ADD DUP1 ADD DUP1 ADD ... POP
            return OP_DUP1 + (stack_limit - 1) * (OP_DUP1 + bytecode{opcode}) + OP_POP;

        // Example for PUSH operations
        case InstructionCategory::push:
            // PUSH1 POP PUSH1 POP ...
            return stack_limit * (push(opcode, {}) + OP_POP);
        // ... (other categories)
        }
        break;

    case Mode::full_stack:
        // ... (similar logic for benchmarks that fill the stack)
        break;
    }
    return {};
}

/// Generates a benchmark loop with given inner code.
bytecode generate_loop_v2(const bytecode& inner_code)
{
    const auto counter =
        push("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01");  // -255
    const auto jumpdest_offset = counter.size();
    return counter + OP_JUMPDEST + inner_code +  // loop label + inner code
           push(1) + OP_ADD + OP_DUP1 +          // counter += 1
           push(jumpdest_offset) + OP_JUMPI;     // jump to jumpdest_offset if counter != 0
}

} // namespace

void register_synthetic_benchmarks()
{
    std::vector<CodeParams> params_list;

    // Binops.
    for (const auto opcode : {OP_ADD, OP_MUL, OP_SUB, OP_SIGNEXTEND, OP_LT, OP_GT, OP_SLT, OP_SGT,
             OP_EQ, OP_AND, OP_OR, OP_XOR, OP_BYTE, OP_SHL, OP_SHR, OP_SAR})
        params_list.insert(
            params_list.end(), {{opcode, Mode::min_stack}, {opcode, Mode::full_stack}});

    // ... (registering other opcodes for benchmarking)

    // Example of registering a benchmark case
    for (const auto params : params_list)
    {
        for (auto& [vm_name, vm] : registered_vms)
        {
            RegisterBenchmark(std::string{vm_name} + "/total/synth/" + to_string(params),
                [&vm, params](
                    State& state) { bench_evmc_execute(state, vm, generate_code(params)); })
                ->Unit(kMicrosecond);
        }
    }
}
}  // namespace evmone::test
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_analysis.cpp">
```cpp
// This file contains the logic for bytecode analysis, directly relevant to `tevm-analyze`.

#include "baseline.hpp"
#include "eof.hpp"
#include "instructions.hpp"
#include <memory>

namespace evmone::baseline
{
namespace
{
// This function is exactly what's needed for the `find_jump_destinations`
// part of the `tevm-analyze` tool. It correctly handles skipping PUSH data.
CodeAnalysis::JumpdestMap analyze_jumpdests(bytes_view code)
{
    // ...
    CodeAnalysis::JumpdestMap map(code.size());  // Allocate and init bitmap with zeros.
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        if (static_cast<int8_t>(op) >= OP_PUSH1)  // If any PUSH opcode.
            i += op - size_t{OP_PUSH1 - 1};       // Skip PUSH data.
        else if (INTX_UNLIKELY(op == OP_JUMPDEST))
            map[i] = true;
    }
    return map;
}

// The main analysis function. This structure can be adapted for other
// analysis tasks like opcode statistics or security checks.
CodeAnalysis analyze_legacy(bytes_view code)
{
    // TODO: The padded code buffer and jumpdest bitmap can be created with single allocation.
    return {pad_code(code), code.size(), analyze_jumpdests(code)};
}
} // namespace
} // namespace evmone::baseline
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
// This file is essential for `tevm-analyze`. It provides a compile-time table
// of traits for every opcode, including its name, stack requirements, and the
// EVM revision it was introduced in. This is a more robust approach than the
// `get_opcode_info` function in the prompt.

#include "instructions_opcodes.hpp"
#include <array>
#include <optional>

namespace evmone::instr
{
// ... (gas cost tables)

/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    /// Size of the immediate argument in bytes.
    uint8_t immediate_size = 0;

    /// Whether the instruction terminates execution.
    bool is_terminating = false;

    /// The number of stack items the instruction accesses during execution.
    uint8_t stack_height_required = 0;

    /// The stack height change caused by the instruction execution. Can be negative.
    int8_t stack_height_change = 0;

    /// The EVM revision in which the instruction has been defined.
    std::optional<evmc_revision> since;

    // ...
};

/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    table[OP_MUL] = {"MUL", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    // ... and so on for all 256 opcodes
    table[OP_SSTORE] = {"SSTORE", 0, false, 2, -2, EVMC_FRONTIER, REV_EOF1};
    table[OP_PUSH1] = {"PUSH1", 1, false, 0, 1, EVMC_FRONTIER, REV_EOF1};
    table[OP_DUP1] = {"DUP1", 0, false, 1, 1, EVMC_FRONTIER, REV_EOF1};
    table[OP_SWAP1] = {"SWAP1", 0, false, 2, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_SELFDESTRUCT] = {"SELFDESTRUCT", 0, true, 1, -1, EVMC_FRONTIER};

    return table;
}();

}  // namespace evmone::instr
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.cpp">
```cpp
// This file contains the implementation for EVM execution tracing. The
// `InstructionTracer` class is a perfect reference for the `TraceStep` struct
// and its `to_json` function in the prompt.

#include "tracing.hpp"
#include "execution_state.hpp"
#include "instructions_traits.hpp"
#include <evmc/hex.hpp>
#include <stack>

namespace evmone
{
namespace
{
// ...

class InstructionTracer : public Tracer
{
    // ...

    void output_stack(const intx::uint256* stack_top, int stack_height)
    {
        m_out << R"(,"stack":[)";
        const auto stack_end = stack_top + 1;
        const auto stack_begin = stack_end - stack_height;
        for (auto it = stack_begin; it != stack_end; ++it)
        {
            if (it != stack_begin)
                m_out << ',';
            m_out << R"("0x)" << to_string(*it, 16) << '"';
        }
        m_out << ']';
    }

    void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept override
    {
        const auto& ctx = m_contexts.top();
        const auto opcode = ctx.code[pc];

        // This demonstrates building a JSON object for a single execution step,
        // mirroring the `TraceStep` struct from the prompt.
        m_out << "{";
        m_out << R"("pc":)" << std::dec << pc;
        m_out << R"(,"op":)" << std::dec << int{opcode};
        m_out << R"(,"gas":"0x)" << std::hex << gas << '"';
        m_out << R"(,"gasCost":"0x)" << std::hex << instr::gas_costs[state.rev][opcode] << '"';
        m_out << R"(,"memSize":)" << std::dec << state.memory.size();

        output_stack(stack_top, stack_height);

        m_out << R"(,"depth":)" << std::dec << (ctx.depth + 1);
        m_out << R"(,"refund":)" << std::dec << state.gas_refund;
        m_out << R"(,"opName":")" << get_name(opcode) << '"';

        m_out << "}\n";
    }

    // ...
};
}  // namespace

std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out)
{
    return std::make_unique<InstructionTracer>(out);
}
}  // namespace evmone
```
</file>
</evmone>

## Prompt Corrections
The original prompt is well-defined and provides a solid foundation. Here are a few suggested improvements based on `evmone`'s implementation patterns:

1.  **Opcode Information**: Instead of a `get_opcode_info` function that returns a new struct for each call, consider a static, compile-time generated table of opcode traits. This is more performant and type-safe. The `evmone/lib/evmone/instructions_traits.hpp` file is an excellent example of this pattern. It provides not just the name and gas cost, but also stack requirements and the EVM revision in which the opcode was introduced.

2.  **Execution Tracing**: The `TraceStep` struct in the prompt is good. For a more complete implementation, consider including `memory` and `storage` changes in the trace output, as these are often critical for debugging. The `evmone` `InstructionTracer` provides a good starting point, which could be extended to dump memory or a diff of storage changes at each step.

3.  **Bytecode Analysis**: For the `BytecodeAnalyzer`, the `analyze_jumpdests` function is a great start. `evmone`'s implementation uses a `std::vector<bool>` (a bitset) for O(1) JUMPDEST validation after the initial O(n) analysis. This is more efficient than searching a list of destinations for every jump. This bitmap could also be used to distinguish between code and PUSH data, which is a more robust way to handle analysis than simply skipping a certain number of bytes after each PUSH.

4.  **CLI Tool Naming**: The proposed tool names are clear. For inspiration, `evmone`'s equivalent tools are `evmone-t8n` (state **t**ransitio**n** tool, like `tevm-exec` and `tevm-state`), `evmone-bench` (benchmarking), and `eofparse` (bytecode analysis). Using a single binary with subcommands (e.g., `tevm exec`, `tevm state`) is a common and effective pattern.



## REVM Context

An excellent and well-structured prompt. Here is the most relevant context from the `revm` codebase to assist in the implementation of the specified CLI tools.

The provided snippets showcase:
*   How `revm` structures its core EVM execution context, including environment configuration (`CfgEnv`, `BlockEnv`, `TxEnv`) and state (`Database`).
*   The `Inspector` trait, a powerful mechanism for tracing and debugging, which directly maps to your requirements for `tevm-exec --trace`.
*   The `statetest-types` crate, which provides a practical example of deserializing test case configurations, useful for building robust testing tools.
*   The `Precompile` infrastructure, showing how to handle these special contracts based on the active hardfork.
*   A complete `InstructionTable` and opcode analysis logic, which is essential for implementing `tevm-analyze`.

This context should provide a solid foundation and reference for building out your comprehensive EVM CLI toolchain.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/revm/src/lib.rs">
```rust
//! Revm is a Rust EVM implementation.

// reexport dependencies
pub use bytecode;
pub use context;
pub use context_interface;
pub use database;
pub use database_interface;
pub use handler;
pub use inspector;
pub use interpreter;
pub use precompile;
pub use primitives;
pub use state;

// Export items.

pub use context::journal::{Journal, JournalEntry};
pub use context::Context;
pub use database_interface::{Database, DatabaseCommit, DatabaseRef};
pub use handler::{
    ExecuteCommitEvm, ExecuteEvm, MainBuilder, MainContext, MainnetEvm, SystemCallCommitEvm,
    SystemCallEvm,
};
pub use inspector::{InspectCommitEvm, InspectEvm, Inspector};
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/api.rs">
```rust
/// Execute EVM transactions. Main trait for transaction execution.
pub trait ExecuteEvm {
    /// Output of transaction execution.
    type ExecutionResult;
    // Output state
    type State;
    /// Error type
    type Error;
    /// Transaction type.
    type Tx: Transaction;
    /// Block type.
    type Block: Block;

    /// Set the block.
    fn set_block(&mut self, block: Self::Block);

    /// Execute transaction and store state inside journal. Returns output of transaction execution.
    fn transact(&mut self, tx: Self::Tx) -> Result<Self::ExecutionResult, Self::Error>;

    /// Finalize execution, clearing the journal and returning the accumulated state changes.
    fn finalize(&mut self) -> Self::State;

    /// Transact the given transaction and finalize in a single operation.
    fn transact_finalize(
        &mut self,
        tx: Self::Tx,
    ) -> Result<ResultAndState<Self::ExecutionResult, Self::State>, Self::Error> {
        let output_or_error = self.transact(tx);
        // finalize will clear the journal
        let state = self.finalize();
        let output = output_or_error?;
        Ok(ResultAndState::new(output, state))
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/evm.rs">
```rust
//! This module contains [`Evm`] struct.
use core::fmt::Debug;
use core::ops::{Deref, DerefMut};

/// Main EVM structure that contains all data needed for execution.
#[derive(Debug, Clone)]
pub struct Evm<CTX, INSP, I, P> {
    /// [`context_interface::ContextTr`] of the EVM it is used to fetch data from database.
    pub ctx: CTX,
    /// Inspector of the EVM it is used to inspect the EVM.
    /// Its trait are defined in revm-inspector crate.
    pub inspector: INSP,
    /// Instructions provider of the EVM it is used to execute instructions.
    /// `InstructionProvider` trait is defined in revm-handler crate.
    pub instruction: I,
    /// Precompile provider of the EVM it is used to execute precompiles.
    /// `PrecompileProvider` trait is defined in revm-handler crate.
    pub precompiles: P,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/context.rs">
```rust
//! This module contains [`Context`] struct and implements [`ContextTr`] trait for it.
use crate::{block::BlockEnv, cfg::CfgEnv, journal::Journal, tx::TxEnv, LocalContext};
use context_interface::{
    context::{ContextError, ContextSetters},
    Block, Cfg, ContextTr, JournalTr, LocalContextTr, Transaction,
};
use database_interface::{Database, DatabaseRef, EmptyDB, WrapDatabaseRef};
use derive_where::derive_where;
use primitives::hardfork::SpecId;

/// EVM context contains data that EVM needs for execution.
#[derive_where(Clone, Debug; BLOCK, CFG, CHAIN, TX, DB, JOURNAL, <DB as Database>::Error, LOCAL)]
pub struct Context<
    BLOCK = BlockEnv,
    TX = TxEnv,
    CFG = CfgEnv,
    DB: Database = EmptyDB,
    JOURNAL: JournalTr<Database = DB> = Journal<DB>,
    CHAIN = (),
    LOCAL: LocalContextTr = LocalContext,
> {
    /// Block information.
    pub block: BLOCK,
    /// Transaction information.
    pub tx: TX,
    /// Configurations.
    pub cfg: CFG,
    /// EVM State with journaling support and database.
    pub journaled_state: JOURNAL,
    /// Inner context.
    pub chain: CHAIN,
    /// Local context that is filled by execution.
    pub local: LOCAL,
    /// Error that happened during execution.
    pub error: Result<(), ContextError<DB::Error>>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/cfg.rs">
```rust
//! This module contains [`CfgEnv`] and implements [`Cfg`] trait for it.
pub use context_interface::Cfg;

use primitives::{eip170::MAX_CODE_SIZE, hardfork::SpecId};

/// EVM configuration
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
#[non_exhaustive]
pub struct CfgEnv<SPEC = SpecId> {
    /// Chain ID of the EVM
    pub chain_id: u64,
    /// Specification for EVM represent the hardfork
    pub spec: SPEC,
    /// If some it will effects EIP-170: Contract code size limit.
    pub limit_contract_code_size: Option<usize>,
    // ... other optional configurations ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/block.rs">
```rust
//! This module contains [`BlockEnv`] and it implements [`Block`] trait.
use context_interface::block::{BlobExcessGasAndPrice, Block};
use primitives::{eip4844::BLOB_BASE_FEE_UPDATE_FRACTION_PRAGUE, Address, B256, U256};

/// The block environment
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
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
    pub difficulty: U256,
    /// The output of the randomness beacon provided by the beacon chain
    pub prevrandao: Option<B256>,
    /// Excess blob gas and blob gasprice
    pub blob_excess_gas_and_price: Option<BlobExcessGasAndPrice>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/tx.rs">
```rust
//! This module contains [`TxEnv`] struct and implements [`Transaction`] trait for it.
use crate::TransactionType;
use context_interface::{
    either::Either,
    transaction::{
        AccessList, AccessListItem, Authorization, RecoveredAuthority, RecoveredAuthorization,
        SignedAuthorization, Transaction,
    },
};
use core::fmt::Debug;
use primitives::{Address, Bytes, TxKind, B256, U256};
use std::{vec, vec::Vec};

/// The Transaction Environment is a struct that contains all fields that can be found in all Ethereum transaction
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct TxEnv {
    /// Transaction type
    pub tx_type: u8,
    /// Caller aka Author aka transaction signer
    pub caller: Address,
    /// The gas limit of the transaction.
    pub gas_limit: u64,
    /// The gas price of the transaction.
    pub gas_price: u128,
    /// The destination of the transaction
    pub kind: TxKind,
    /// The value sent to `transact_to`
    pub value: U256,
    /// The data of the transaction
    pub data: Bytes,
    /// The nonce of the transaction
    pub nonce: u64,
    // ... other transaction fields ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/interface/src/lib.rs">
```rust
//! EVM database interface.
#[auto_impl(&mut, Box)]
pub trait Database {
    /// The database error type.
    type Error: DBErrorMarker + Error;

    /// Gets basic account information.
    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error>;

    /// Gets account code by its hash.
    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode, Self::Error>;

    /// Gets storage value of address at index.
    fn storage(&mut self, address: Address, index: StorageKey)
        -> Result<StorageValue, Self::Error>;

    /// Gets block hash by block number.
    fn block_hash(&mut self, number: u64) -> Result<B256, Self::Error>;
}

/// EVM database commit interface.
#[auto_impl(&mut, Box)]
pub trait DatabaseCommit {
    /// Commit changes to the database.
    fn commit(&mut self, changes: HashMap<Address, Account>);
}

/// EVM database interface.
///
/// Contains the same methods as [`Database`], but with `&self` receivers instead of `&mut self`.
#[auto_impl(&, &mut, Box, Rc, Arc)]
pub trait DatabaseRef {
    // ... same methods as Database but with &self ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/in_memory_db.rs">
```rust
use database_interface::{Database, DatabaseCommit, DatabaseRef, EmptyDB};
use primitives::{
    address, hash_map::Entry, Address, HashMap, Log, StorageKey, StorageValue, B256, KECCAK_EMPTY,
    U256,
};
use state::{Account, AccountInfo, Bytecode};
use std::vec::Vec;

/// A [Database] implementation that stores all state changes in memory.
pub type InMemoryDB = CacheDB<EmptyDB>;

/// A [Database] implementation that stores all state changes in memory.
///
/// This implementation wraps a [DatabaseRef] that is used to load data ([AccountInfo]).
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CacheDB<ExtDB> {
    /// The cache that stores all state changes.
    pub cache: Cache,
    /// The underlying database ([DatabaseRef]) that is used to load data.
    pub db: ExtDB,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/opcode.rs">
```rust
//! EVM opcode definitions and utilities. It contains opcode information and utilities to work with opcodes.
// ...

/// Information about opcode, such as name, and stack inputs and outputs
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct OpCodeInfo {
    // ...
    name_ptr: NonNull<u8>,
    name_len: u8,
    /// Stack inputs
    inputs: u8,
    /// Stack outputs
    outputs: u8,
    /// Number of intermediate bytes
    immediate_size: u8,
    // ...
}

// ...

/// Maps each opcode to its info.
pub static OPCODE_INFO: [Option<OpCodeInfo>; 256] = {
    // ...
};

opcodes! {
    0x00 => STOP     => stack_io(0, 0), terminating;
    0x01 => ADD      => stack_io(2, 1);
    0x02 => MUL      => stack_io(2, 1);
    // ... more opcodes ...
    0x54 => SLOAD    => stack_io(1, 1);
    0x55 => SSTORE   => stack_io(2, 0);
    // ... more opcodes ...
    0x60 => PUSH1  => stack_io(0, 1), immediate_size(1);
    // ... more opcodes ...
    0xf1 => CALL         => stack_io(7, 1), not_eof;
    // ... more opcodes ...
    0xff => SELFDESTRUCT => stack_io(1, 0), not_eof, terminating;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/legacy/analysis.rs">
```rust
use super::JumpTable;
use crate::opcode;
use bitvec::{bitvec, order::Lsb0, vec::BitVec};
use primitives::Bytes;
use std::{sync::Arc, vec, vec::Vec};

/// Analyze the bytecode to find the jumpdests. Used to create a jump table
/// that is needed for [`crate::LegacyAnalyzedBytecode`].
pub fn analyze_legacy(bytecode: Bytes) -> (JumpTable, Bytes) {
    if bytecode.is_empty() {
        return (JumpTable::default(), Bytes::from_static(&[opcode::STOP]));
    }

    let mut jumps: BitVec<u8> = bitvec



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/evm_tools/t8n/__init__.py">
```python
# ethereum_spec_tools/evm_tools/t8n/__init__.py

# ... (imports)

def t8n_arguments(subparsers: argparse._SubParsersAction) -> None:
    """
    Adds the arguments for the t8n tool subparser.
    """
    t8n_parser = subparsers.add_parser("t8n", help="This is the t8n tool.")

    t8n_parser.add_argument(
        "--input.alloc", dest="input_alloc", type=str, default="alloc.json"
    )
    t8n_parser.add_argument(
        "--input.env", dest="input_env", type=str, default="env.json"
    )
    t8n_parser.add_argument(
        "--input.txs", dest="input_txs", type=str, default="txs.json"
    )
    t8n_parser.add_argument(
        "--output.alloc", dest="output_alloc", type=str, default="alloc.json"
    )
    t8n_parser.add_argument(
        "--output.basedir", dest="output_basedir", type=str, default="."
    )
    t8n_parser.add_argument("--output.body", dest="output_body", type=str)
    t8n_parser.add_argument(
        "--output.result",
        dest="output_result",
        type=str,
        default="result.json",
    )
    t8n_parser.add_argument(
        "--state.chainid", dest="state_chainid", type=int, default=1
    )
    t8n_parser.add_argument(
        "--state.fork", dest="state_fork", type=str, default="Frontier"
    )
    # ... (other arguments)
    t8n_parser.add_argument("--trace", action="store_true")
    t8n_parser.add_argument("--trace.memory", action="store_true")
    t8n_parser.add_argument("--trace.nomemory", action="store_true")
    t8n_parser.add_argument("--trace.noreturndata", action="store_true")
    t8n_parser.add_argument("--trace.nostack", action="store_true")
    t8n_parser.add_argument("--trace.returndata", action="store_true")

    t8n_parser.add_argument("--state-test", action="store_true")


class T8N(Load):
    # ... (implementation)
    def run_state_test(self) -> Any:
        """
        Apply a single transaction on pre-state. No system operations
        are performed.
        """
        block_env = self.block_environment()
        block_output = self.fork.BlockOutput()
        self.backup_state()
        if len(self.txs.transactions) > 0:
            tx = self.txs.transactions[0]
            try:
                self.fork.process_transaction(
                    block_env=block_env,
                    block_output=block_output,
                    tx=tx,
                    index=Uint(0),
                )
            except EthereumException as e:
                self.txs.rejected_txs[0] = f"Failed transaction: {e!r}"
                self.restore_state()
                self.logger.warning(f"Transaction {0} failed: {str(e)}")

        self.result.update(self, block_env, block_output)
        self.result.rejected = self.txs.rejected_txs

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/__init__.py">
```python
# ethereum/cancun/vm/instructions/__init__.py

import enum
from typing import Callable, Dict

from . import arithmetic as arithmetic_instructions
# ... (other instruction imports)
from . import system as system_instructions


class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # Arithmetic Ops
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ... (all opcodes)
    SSTORE = 0x55
    TLOAD = 0x5C
    TSTORE = 0x5D
    # ...
    PUSH0 = 0x5F
    PUSH1 = 0x60
    # ...
    PUSH32 = 0x7F
    # ...
    LOG0 = 0xA0
    LOG1 = 0xA1
    LOG2 = 0xA2
    LOG3 = 0xA3
    LOG4 = 0xA4
    # ...
    CREATE = 0xF0
    CALL = 0xF1
    # ...
    SELFDESTRUCT = 0xFF


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ... (maps all opcodes to their implementation function)
    Ops.SSTORE: storage_instructions.sstore,
    Ops.TLOAD: storage_instructions.tload,
    Ops.TSTORE: storage_instructions.tstore,
    # ...
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/runtime.py">
```python
# ethereum/cancun/vm/runtime.py

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# ethereum/cancun/state.py

from dataclasses import dataclass, field
# ...

@dataclass
class State:
    # ...
    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    # ...

def get_account(state: State, address: Address) -> Account:
    """
    Get the `Account` object at an address. Returns `EMPTY_ACCOUNT` if there
    is no account at the address.
    # ...
    """
    account = get_account_optional(state, address)
    if isinstance(account, Account):
        return account
    else:
        return EMPTY_ACCOUNT

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account. Returns `U256(0)` if the
    storage key has not been set previously.
    # ...
    """
    trie = state._storage_tries.get(address)
    if trie is None:
        return U256(0)

    value = trie_get(trie, key)

    assert isinstance(value, U256)
    return value

def get_transient_storage(
    transient_storage: TransientStorage, address: Address, key: Bytes32
) -> U256:
    # ...

def set_transient_storage(
    transient_storage: TransientStorage,
    address: Address,
    key: Bytes32,
    value: U256,
) -> None:
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
# ethereum/cancun/vm/interpreter.py

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
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/evm_tools/t8n/evm_trace.py">
```python
# ethereum_spec_tools/evm_tools/t8n/evm_trace.py

# ... (imports)

@dataclass
class Trace:
    """
    The class implements the raw EVM trace.
    """

    pc: int
    op: Optional[Union[str, int]]
    gas: str
    gasCost: str
    memory: Optional[str]
    memSize: int
    stack: Optional[List[str]]
    returnData: Optional[str]
    depth: int
    refund: int
    opName: str
    gasCostTraced: bool = False
    errorTraced: bool = False
    precompile: bool = False
    error: Optional[str] = None


@dataclass
class FinalTrace:
    """
    The class implements final trace for a tx.
    """

    output: str
    gasUsed: str
    error: Optional[str] = None

    def __init__(
        self, gas_used: int, output: bytes, error: Optional[EthereumException]
    ) -> None:
        self.output = "0x" + output.hex()
        self.gasUsed = hex(gas_used)
        if error:
            self.error = type(error).__name__

# ... (EvmTracer implementation)

def evm_trace(
    evm: Any,
    event: TraceEvent,
    trace_memory: bool = False,
    trace_stack: bool = True,
    trace_return_data: bool = False,
    output_basedir: str | TextIO = ".",
) -> None:
    """
    Create a trace of the event.
    """
    # ... (implementation details)
    if isinstance(event, TransactionEnd):
        final_trace = FinalTrace(event.gas_used, event.output, event.error)
        traces.append(final_trace)

        output_traces(
            traces,
            evm.message.tx_env.index_in_block,
            evm.message.tx_env.tx_hash,
            output_basedir,
        )
    elif isinstance(event, OpStart):
        op = event.op.value
        if op == "InvalidOpcode":
            op = "Invalid"
        new_trace = Trace(
            pc=int(evm.pc),
            op=op,
            gas=hex(evm.gas_left),
            gasCost="0x0",
            memory=memory,
            memSize=len_memory,
            stack=stack,
            returnData=return_data,
            depth=int(evm.message.depth) + 1,
            refund=refund_counter,
            opName=str(event.op).split(".")[-1],
        )

        traces.append(new_trace)
    # ... (other event handlers)

def output_op_trace(
    trace: Union[Trace, FinalTrace], json_file: TextIO
) -> None:
    """
    Output a single trace to a json file.
    """
    json.dump(trace, json_file, separators=(",", ":"), cls=_TraceJsonEncoder)
    json_file.write("\n")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
# ethereum/cancun/vm/__init__.py

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
```
</file>
</execution-specs>
## Prompt Corrections
The prompt's specification for `EvmExecutor` and its configuration is well-structured and aligns closely with the concepts in the `execution-specs`. The following corrections and suggestions can improve its accuracy and completeness:

1.  **`ExecutorConfig`**:
    -   The `block_coinbase` field should be of type `Address`, not `[]const u8`. This is corrected in the provided struct definition.
    -   The `hardfork` field should ideally be an `enum` type for better type safety, mirroring how `execution-specs` handles hardforks (`Hardfork.CANCUN`, etc.). Using a string is acceptable but less robust. The `Hardfork.from_name` function is a good way to handle this.
    -   Consider adding `tx_origin: Address` to the config. While for simple bytecode execution `caller` might be sufficient, `tx.origin` is a distinct and important part of the execution context.

2.  **`EvmExecutor.execute_bytecode`**:
    -   The `caller` and `contract_address` are both set to `Address.zero()`. This is a reasonable default for simple execution, but for more advanced testing, it would be beneficial to allow these to be configured. The `EvmExecutor` could have fields for `default_caller` and `default_address`.
    -   The `vm.execute_contract` call in the prompt doesn't exist in the specs. The standard way is to prepare a `Message` and use `process_message_call` or `execute_code`. The current approach in the prompt is a valid abstraction for a CLI tool.

3.  **Trace Implementation**:
    -   The `get_execution_trace` function is a stub. When implementing it, you should look at `src/ethereum_spec_tools/evm_tools/t8n/evm_trace.py`. The `Trace` dataclass in that file is an excellent model for the `TraceStep` struct in the prompt. It shows what information is typically captured at each step (pc, op, gas, gasCost, depth, stack, memory).
    -   The `ExecutionOutput.to_json` method will need to correctly serialize the array of `TraceStep` structs. The `_TraceJsonEncoder` in `evm_trace.py` can serve as inspiration for how to format the JSON output.

4.  **`StateInspector`**:
    -   The `get_all_storage_entries` and `get_account_iterator` methods are good abstractions. In a real implementation backed by a database like the `execution-specs`' `State` object, these would be implemented by iterating over the underlying trie or database keys. The `Trie` class in `src/ethereum/cancun/trie.py` shows the basic structure.

Overall, the prompt provides a solid high-level design. The provided `execution-specs` code will be most useful for filling in the low-level implementation details, particularly around the EVM's execution loop, state access, and trace generation.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/runtime.py">
```python
"""
Ethereum Virtual Machine (EVM) Runtime Operations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Runtime related operations used while executing EVM code.
"""
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
"""
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Machine readable representations of EVM instructions, and a mapping to their
implementations.
"""

import enum
from typing import Callable, Dict

from . import arithmetic as arithmetic_instructions
from . import bitwise as bitwise_instructions
from . import block as block_instructions
from . import comparison as comparison_instructions
from . import control_flow as control_flow_instructions
from . import environment as environment_instructions
from . import keccak as keccak_instructions
from . import log as log_instructions
from . import memory as memory_instructions
from . import stack as stack_instructions
from . import storage as storage_instructions
from . import system as system_instructions


class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # ... (Arithmetic, Comparison, Bitwise, Keccak, etc.)

    # Control Flow Ops
    STOP = 0x00
    JUMP = 0x56
    JUMPI = 0x57
    PC = 0x58
    GAS = 0x5A
    JUMPDEST = 0x5B

    # ... (Storage, Pop, Push, Dup, Swap, Memory, Log ops)

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


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ...
    Ops.LOG4: log_instructions.log4,
    Ops.CREATE: system_instructions.create,
    Ops.RETURN: system_instructions.return_,
    Ops.CALL: system_instructions.call,
    Ops.CALLCODE: system_instructions.callcode,
    Ops.DELEGATECALL: system_instructions.delegatecall,
    Ops.SELFDESTRUCT: system_instructions.selfdestruct,
    Ops.STATICCALL: system_instructions.staticcall,
    Ops.REVERT: system_instructions.revert,
    Ops.CREATE2: system_instructions.create2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
"""
Ethereum Virtual Machine (EVM) Interpreter
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

A straightforward interpreter that executes EVM code.
"""

# ... (imports)

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
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        touched_accounts=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
# ... (imports)

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

    intrinsic_gas = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    sender_account = get_account(block_env.state, sender)

    effective_gas_fee = tx.gas * effective_gas_price

    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    sender_balance_after_gas_fee = (
        Uint(sender_account.balance) - effective_gas_fee
    )
    set_account_balance(
        block_env.state, sender, U256(sender_balance_after_gas_fee)
    )

    access_list_addresses = set()
    access_list_storage_keys = set()
    if isinstance(tx, (AccessListTransaction, FeeMarketTransaction)):
        for access in tx.access_list:
            access_list_addresses.add(access.account)
            for slot in access.slots:
                access_list_storage_keys.add((access.account, slot))

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        access_list_addresses=access_list_addresses,
        access_list_storage_keys=access_list_storage_keys,
        index_in_block=index,
        tx_hash=get_transaction_hash(encode_transaction(tx)),
        traces=[],
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... (gas refund and fee transfer logic)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
# ... (imports)

def get_account(state: State, address: Address) -> Account:
    """
    Get the `Account` object at an address. Returns `EMPTY_ACCOUNT` if there
    is no account at the address.
    ...
    """
    account = get_account_optional(state, address)
    if isinstance(account, Account):
        return account
    else:
        return EMPTY_ACCOUNT


def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account. Returns `U256(0)` if the
    storage key has not been set previously.
    ...
    """
    trie = state._storage_tries.get(address)
    if trie is None:
        return U256(0)

    value = trie_get(trie, key)

    assert isinstance(value, U256)
    return value
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork_types.py">
```python
# ... (imports)

@slotted_freezable
@dataclass
class Account:
    """
    State associated with an address.
    """

    nonce: Uint
    balance: U256
    code: Bytes
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
# ... (imports)

def generic_create(
    evm: Evm,
    endowment: U256,
    contract_address: Address,
    memory_start_position: U256,
    memory_size: U256,
) -> None:
    """
    Core logic used by the `CREATE*` family of opcodes.
    """
    # ...
    child_message = Message(
        # ...
        code=call_data,
        current_target=contract_address,
        # ...
    )
    child_evm = process_create_message(child_message)

    if child_evm.error:
        #...
        push(evm.stack, U256(0))
    else:
        #...
        push(evm.stack, U256.from_be_bytes(child_evm.message.current_target))

def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    ...
    """
    # ...
    if evm.message.is_static:
        raise WriteInStaticContext

    # ... (transfer balance logic)

    # register account for deletion
    evm.accounts_to_delete.add(originator)

    # HALT the execution
    evm.running = False
```
</file>
</execution-specs>

## Prompt Corrections
The prompt provides an excellent and comprehensive outline for building the CLI tools. The following are suggested improvements based on the `execution-specs` implementation:

1.  **Hardfork-specific Gas Costs**: The `get_opcode_info` function in the prompt hard-codes gas costs. In a real EVM, gas costs change between hardforks (e.g., `SLOAD` cost changes in Berlin). The `execution-specs` approach uses different `JumpTable` configurations per hardfork, which is a more accurate model. Consider making your gas cost logic dependent on the selected `hardfork` parameter.

2.  **Transaction Types**: The `Transaction` struct in the prompt is a simplified model. The EVM has multiple transaction types (Legacy, EIP-2930 AccessList, EIP-1559 FeeMarket). The `tevm-exec` tool would be more powerful if it could decode and execute these different formats. You can see these different types defined in `src/ethereum/london/transactions.py`.

3.  **Static Analysis of JUMPDESTs**: The `BytecodeAnalyzer`'s `find_jump_destinations` can be made more accurate by also checking that a `JUMPDEST` opcode is not part of PUSH data. The `get_valid_jump_destinations` function from `execution-specs/src/ethereum/london/vm/runtime.py` provides a perfect reference for this logic, as it correctly skips over PUSH data when scanning the bytecode.

4.  **Tracing**: The prompt correctly identifies the need for tracing. The `execution-specs` use a decorator-like `evm_trace` function that is called at the start and end of each opcode execution. This is a common and effective pattern for building execution traces, as seen in `.../vm/interpreter.py`. Adopting a similar event-based tracing mechanism would be robust.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/main.go">
```go
// evm executes EVM code snippets.
package main

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/ethereum/go-ethereum/cmd/evm/internal/t8ntool"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/eth/tracers/logger"
	"github.comcom/ethereum/go-ethereum/internal/debug"
	"github.com/ethereum/go-ethereum/internal/flags"
	"github.com/urfave/cli/v2"

	// Force-load the tracer engines to trigger registration
	_ "github.com/ethereum/go-ethereum/eth/tracers/js"
	_ "github.com/ethereum/go-ethereum/eth/tracers/native"
)

// ... (flag definitions omitted for brevity) ...

// Command definitions.
var (
	stateTransitionCommand = &cli.Command{
		Name:    "transition",
		Aliases: []string{"t8n"},
		Usage:   "Executes a full state transition",
		Action:  t8ntool.Transition,
		// ...
	}
	transactionCommand = &cli.Command{
		Name:    "transaction",
		Aliases: []string{"t9n"},
		Usage:   "Performs transaction validation",
		Action:  t8ntool.Transaction,
		// ...
	}

	blockBuilderCommand = &cli.Command{
		Name:    "block-builder",
		Aliases: []string{"b11r"},
		Usage:   "Builds a block",
		Action:  t8ntool.BuildBlock,
		// ...
	}
)

// traceFlags contains flags that configure tracing output.
var traceFlags = []cli.Flag{
	TraceFlag,
	TraceFormatFlag,
	TraceDisableStackFlag,
	TraceDisableMemoryFlag,
	TraceDisableStorageFlag,
	TraceDisableReturnDataFlag,

	// deprecated
	DebugFlag,
	MachineFlag,
}

var app = flags.NewApp("the evm command line interface")

func init() {
	app.Flags = debug.Flags
	app.Commands = []*cli.Command{
		runCommand,
		blockTestCommand,
		stateTestCommand,
		stateTransitionCommand,
		transactionCommand,
		blockBuilderCommand,
		eofParseCommand,
		eofDumpCommand,
	}
	app.Before = func(ctx *cli.Context) error {
		flags.MigrateGlobalFlags(ctx)
		return debug.Setup(ctx)
	}
	app.After = func(ctx *cli.Context) error {
		debug.Exit()
		return nil
	}
}

func main() {
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

// tracerFromFlags parses the cli flags and returns the specified tracer.
func tracerFromFlags(ctx *cli.Context) *tracing.Hooks {
	config := &logger.Config{
		EnableMemory:     !ctx.Bool(TraceDisableMemoryFlag.Name),
		DisableStack:     ctx.Bool(TraceDisableStackFlag.Name),
		DisableStorage:   ctx.Bool(TraceDisableStorageFlag.Name),
		EnableReturnData: !ctx.Bool(TraceDisableReturnDataFlag.Name),
	}
	switch {
	case ctx.Bool(TraceFlag.Name):
		switch format := ctx.String(TraceFormatFlag.Name); format {
		case "struct":
			return logger.NewStreamingStructLogger(config, os.Stderr).Hooks()
		case "json":
			return logger.NewJSONLogger(config, os.Stderr)
		case "md", "markdown":
			return logger.NewMarkdownLogger(config, os.Stderr).Hooks()
		default:
			fmt.Fprintf(os.Stderr, "unknown trace format: %q\n", format)
			os.Exit(1)
			return nil
		}
	// ... (deprecated flags omitted) ...
	default:
		return nil
	}
}

// dump returns a state dump for the most current trie.
func dump(s *state.StateDB) *state.Dump {
	root := s.IntermediateRoot(false)
	cpy, _ := state.New(root, s.Database())
	dump := cpy.RawDump(nil)
	return &dump
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/runner.go">
```go
func runCmd(ctx *cli.Context) error {
	var (
		tracer      *tracing.Hooks
		prestate    *state.StateDB
		chainConfig *params.ChainConfig
		sender      = common.BytesToAddress([]byte("sender"))
		receiver    = common.BytesToAddress([]byte("receiver"))
		preimages   = ctx.Bool(DumpFlag.Name)
		blobHashes  []common.Hash  // TODO (MariusVanDerWijden) implement blob hashes in state tests
		blobBaseFee = new(big.Int) // TODO (MariusVanDerWijden) implement blob fee in state tests
	)
	tracer = tracerFromFlags(ctx)
	initialGas := ctx.Uint64(GasFlag.Name)
	genesisConfig := new(core.Genesis)
	genesisConfig.GasLimit = initialGas
	if ctx.String(GenesisFlag.Name) != "" {
		genesisConfig = readGenesis(ctx.String(GenesisFlag.Name))
		if genesisConfig.GasLimit != 0 {
			initialGas = genesisConfig.GasLimit
		}
	} else {
		genesisConfig.Config = params.AllDevChainProtocolChanges
	}

	db := rawdb.NewMemoryDatabase()
	triedb := triedb.NewDatabase(db, &triedb.Config{
		Preimages: preimages,
		HashDB:    hashdb.Defaults,
	})
	defer triedb.Close()
	genesis := genesisConfig.MustCommit(db, triedb)
	sdb := state.NewDatabase(triedb, nil)
	prestate, _ = state.New(genesis.Root(), sdb)
	chainConfig = genesisConfig.Config

	// ... (flag parsing for sender/receiver omitted) ...

	var code []byte
	// ... (code loading from file or arg omitted) ...
	code = common.FromHex(hexcode)

	runtimeConfig := runtime.Config{
		Origin:      sender,
		State:       prestate,
		GasLimit:    initialGas,
		GasPrice:    flags.GlobalBig(ctx, PriceFlag.Name),
		Value:       flags.GlobalBig(ctx, ValueFlag.Name),
		Difficulty:  genesisConfig.Difficulty,
		Time:        genesisConfig.Timestamp,
		Coinbase:    genesisConfig.Coinbase,
		BlockNumber: new(big.Int).SetUint64(genesisConfig.Number),
		BaseFee:     genesisConfig.BaseFee,
		BlobHashes:  blobHashes,
		BlobBaseFee: blobBaseFee,
		EVMConfig: vm.Config{
			Tracer: tracer,
		},
	}

	// ... (chainConfig setup omitted) ...

	// ... (input loading omitted) ...

	var execFunc func() ([]byte, uint64, error)
	if ctx.Bool(CreateFlag.Name) {
		input = append(code, input...)
		execFunc = func() ([]byte, uint64, error) {
			// don't mutate the state!
			runtimeConfig.State = prestate.Copy()
			output, _, gasLeft, err := runtime.Create(input, &runtimeConfig)
			return output, gasLeft, err
		}
	} else {
		if len(code) > 0 {
			prestate.SetCode(receiver, code)
		}
		execFunc = func() ([]byte, uint64, error) {
			// don't mutate the state!
			runtimeConfig.State = prestate.Copy()
			output, gasLeft, err := runtime.Call(receiver, input, &runtimeConfig)
			return output, initialGas - gasLeft, err
		}
	}

	bench := ctx.Bool(BenchFlag.Name)
	output, stats, err := timedExec(bench, execFunc)

	// ... (dumping, logging, printing results omitted) ...

	if tracer == nil {
		fmt.Printf("%#x\n", output)
		if err != nil {
			fmt.Printf(" error: %v\n", err)
		}
	}

	return nil
}

type execStats struct {
	Time           time.Duration `json:"time"`           // The execution Time.
	Allocs         int64         `json:"allocs"`         // The number of heap allocations during execution.
	BytesAllocated int64         `json:"bytesAllocated"` // The cumulative number of bytes allocated during execution.
	GasUsed        uint64        `json:"gasUsed"`        // the amount of gas used during execution
}

func timedExec(bench bool, execFunc func() ([]byte, uint64, error)) ([]byte, execStats, error) {
	if bench {
		testing.Init()
		// Do one warm-up run
		output, gasUsed, err := execFunc()
		result := testing.Benchmark(func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				haveOutput, haveGasUsed, haveErr := execFunc()
				if !bytes.Equal(haveOutput, output) {
					panic(fmt.Sprintf("output differs\nhave %x\nwant %x\n", haveOutput, output))
				}
				if haveGasUsed != gasUsed {
					panic(fmt.Sprintf("gas differs, have %v want %v", haveGasUsed, gasUsed))
				}
				if haveErr != err {
					panic(fmt.Sprintf("err differs, have %v want %v", haveErr, err))
				}
			}
		})
		// Get the average execution time from the benchmarking result.
		// There are other useful stats here that could be reported.
		stats := execStats{
			Time:           time.Duration(result.NsPerOp()),
			Allocs:         result.AllocsPerOp(),
			BytesAllocated: result.AllocedBytesPerOp(),
			GasUsed:        gasUsed,
		}
		return output, stats, err
	}
	// ... (non-bench execution) ...
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/geth/snapshot.go">
```go
func dumpState(ctx *cli.Context) error {
	stack, _ := makeConfigNode(ctx)
	defer stack.Close()

	db := utils.MakeChainDatabase(ctx, stack, true)
	defer db.Close()

	conf, root, err := parseDumpConfig(ctx, db)
	if err != nil {
		return err
	}
	triedb := utils.MakeTrieDatabase(ctx, db, false, true, false)
	defer triedb.Close()

	snapConfig := snapshot.Config{
		CacheSize:  256,
		Recovery:   false,
		NoBuild:    true,
		AsyncBuild: false,
	}
	snaptree, err := snapshot.New(snapConfig, db, triedb, root)
	if err != nil {
		return err
	}
	accIt, err := snaptree.AccountIterator(root, common.BytesToHash(conf.Start))
	if err != nil {
		return err
	}
	defer accIt.Release()

	log.Info("Snapshot dumping started", "root", root)
	var (
		start    = time.Now()
		logged   = time.Now()
		accounts uint64
	)
	enc := json.NewEncoder(os.Stdout)
	enc.Encode(struct {
		Root common.Hash `json:"root"`
	}{root})
	for accIt.Next() {
		account, err := types.FullAccount(accIt.Account())
		if err != nil {
			return err
		}
		da := &state.DumpAccount{
			Balance:     account.Balance.String(),
			Nonce:       account.Nonce,
			Root:        account.Root.Bytes(),
			CodeHash:    account.CodeHash,
			AddressHash: accIt.Hash().Bytes(),
		}
		if !conf.SkipCode && !bytes.Equal(account.CodeHash, types.EmptyCodeHash.Bytes()) {
			da.Code = rawdb.ReadCode(db, common.BytesToHash(account.CodeHash))
		}
		if !conf.SkipStorage {
			da.Storage = make(map[common.Hash]string)

			stIt, err := snaptree.StorageIterator(root, accIt.Hash(), common.Hash{})
			if err != nil {
				return err
			}
			for stIt.Next() {
				da.Storage[stIt.Hash()] = common.Bytes2Hex(stIt.Slot())
			}
		}
		enc.Encode(da)
		accounts++
		// ... (logging and limit checks omitted) ...
	}
	log.Info("Snapshot dumping complete", "accounts", accounts,
		"elapsed", common.PrettyDuration(time.Since(start)))
	return nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// Analyse analyzes the given code and returns an analysis object.
func Analyse(code []byte) JumpdestMap {
	// The analysis identifies valid jump destinations.
	// JUMPDESTs are not allowed to be inside push data.
	// JUMPDESTs inside data are not considered valid jump destinations.
	analysis := make(JumpdestMap)

	for i := 0; i < len(code); {
		var (
			op     = OpCode(code[i])
			opdata = int(op) - int(PUSH1) + 1
		)
		if op >= PUSH1 && op <= PUSH32 {
			i += opdata
		} else if op == JUMPDEST {
			analysis[i] = struct{}{}
		}
		i++
	}

	return analysis
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// Timer captures the duration and rate of events, using a Histogram and a Meter.
type Timer struct {
	histogram Histogram
	meter     *Meter
	mutex     sync.Mutex
}

// Time record the duration of the execution of the given function.
func (t *Timer) Time(f func()) {
	ts := time.Now()
	f()
	t.Update(time.Since(ts))
}

// Update the duration of an event, in nanoseconds.
func (t *Timer) Update(d time.Duration) {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	t.histogram.Update(d.Nanoseconds())
	t.meter.Mark(1)
}

// TimerSnapshot is a read-only copy of another Timer.
type TimerSnapshot struct {
	histogram HistogramSnapshot
	meter     *MeterSnapshot
}

// Count returns the number of events recorded at the time the snapshot was
// taken.
func (t *TimerSnapshot) Count() int64 { return t.histogram.Count() }

// Max returns the maximum value at the time the snapshot was taken.
func (t *TimerSnapshot) Max() int64 { return t.histogram.Max() }

// Mean returns the mean value at the time the snapshot was taken.
func (t *TimerSnapshot) Mean() float64 { return t.histogram.Mean() }

// Min returns the minimum value at the time the snapshot was taken.
func (t *TimerSnapshot) Min() int64 { return t.histogram.Min() }

// Percentiles returns a slice of arbitrary percentiles of sampled values at
// the time the snapshot was taken.
func (t *TimerSnapshot) Percentiles(ps []float64) []float64 {
	return t.histogram.Percentiles(ps)
}

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (t *TimerSnapshot) Rate1() float64 { return t.meter.Rate1() }
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
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
func LogScaled(r Registry, freq time.Duration, scale time.Duration, l Logger) {
	du := float64(scale)
	duSuffix := scale.String()[1:]

	for range time.Tick(freq) {
		r.Each(func(name string, i interface{}) {
			switch metric := i.(type) {
			case *Counter:
				l.Printf("counter %s\n", name)
				l.Printf("  count:       %9d\n", metric.Snapshot().Count())
			// ... (other types omitted) ...
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
				// ... (more percentiles) ...
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
</go-ethereum>
## Prompt Corrections

1.  **Bytecode Analyzer Security Analysis**: The `analyze_security` function in the prompt suggests scanning for specific opcodes like `CALL` and `SELFDESTRUCT`. While a good start, a more robust security analysis would also consider the context of these opcodes. For example, a `CALL` to a trusted, known contract is very different from a `CALL` to an address provided by an external user. The Geth codebase doesn't have a standalone "security analyzer" CLI, as this logic is deeply integrated into the VM and higher-level tooling. The provided logic is a reasonable simplification for a standalone tool.

2.  **`tevm-bench` Implementation**: The prompt's `benchmark_bytecode` function re-initializes the VM (`Vm.init`) for every benchmark scenario. For more accurate benchmarking of just the execution loop, it would be better to initialize the VM once and reset its state between runs, similar to how Go's `b.ResetTimer()` works. The provided Go-Ethereum `timedExec` function in `cmd/evm/runner.go` correctly shows this pattern.

3.  **Hardfork Configuration**: The prompt correctly includes a `hardfork` string in the `ExecutorConfig`. It's important to note that in Geth, this string is used to select a `params.ChainConfig` object, which in turn configures the `vm.EVM`'s behavior (e.g., which opcodes are active, gas costs). The `vm.NewEVM` call takes this `ChainConfig`. The prompt's `configure_vm` function correctly reflects this concept.

4.  **CLI Argument Parsing**: The prompt uses a manual loop to parse command-line arguments. While functional, mature CLI applications in Go often use libraries like `urfave/cli` (as seen in Geth) or `cobra` for more robust parsing, subcommand handling, and help text generation. The provided code is a valid way to implement this in Zig without external dependencies, but referencing Geth's usage of `urfave/cli` in `cmd/evm/main.go` and `cmd/geth/main.go` could be beneficial for a more complex tool.

---

An excellent and detailed prompt. The specifications for the CLI tools are clear and comprehensive. The Zig code structure is well-thought-out.

Here are the most relevant code snippets from `go-ethereum` that will help you implement these features. I've focused on the `evm` command, state management, bytecode analysis, and the EVM execution flow, as these map directly to your requested tools.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/geth/evm.go">
```go
// This file contains the implementation of the `geth evm` command, which is
// a direct parallel to your requested `tevm-exec` tool. It demonstrates how
// to parse CLI flags, set up an EVM environment from a genesis or state file,
// and execute bytecode.

var (
	evmCodeFlag = &cli.StringFlag{
		Name:  "code",
		Usage: "EVM code for execution",
	}
	evmGasFlag = &cli.Uint64Flag{
		Name:  "gas",
		Usage: "Gas limit for execution",
		Value: 10000000000,
	}
	evmPriceFlag = &cli.StringFlag{
		Name:  "price",
		Usage: "Gas price for execution",
		Value: "0",
	}
	evmValueFlag = &cli.StringFlag{
		Name:  "value",
		Usage: "Value to transfer",
		Value: "0",
	}
	evmSenderFlag = &cli.StringFlag{
		Name:  "sender",
		Usage: "Sender of the transaction",
	}
	evmInputFlag = &cli.StringFlag{
		Name:  "input",
		Usage: "Input data for execution",
	}
	// ... and many more flags for block context, state, etc.
)

var evmCommand = &cli.Command{
	Action:      runEVMCmd,
	Name:        "evm",
	Usage:       "Executes EVM code",
	ArgsUsage:   "",
	Description: `The evm command executes EVM code.`,
	Flags: []cli.Flag{
		evmCodeFlag,
		evmGasFlag,
		evmPriceFlag,
		// ... all flags ...
		utils.DebugFlag,
		utils.TracerFlag,
		utils.TracerJSONConfigFlag,
		utils.VMTraceFlag,
		utils.VMTraceJSONFlag,
	},
}

// runEVMCmd is the entry point for the `evm` command.
func runEVMCmd(ctx *cli.Context) error {
	// ... setup logging and debugging ...

	// Create the execution environment from genesis and state files.
	// This shows how to set up a state database from a JSON file, which
	// is a powerful feature for testing and debugging.
	statedb, header, err := makeEVMEnv(ctx)
	if err != nil {
		return err
	}
	chainConfig, _, err := core.SetupGenesisBlock(statedb.Database(), new(core.Genesis).MustCommit(statedb.Database()))
	if err != nil {
		return err
	}

	// Create the EVM configuration, including a tracer if requested.
	// This directly maps to your `ExecutorConfig`.
	vmcfg, err := makeVMConfig(ctx)
	if err != nil {
		return err
	}

	// Gather execution parameters from CLI flags.
	var (
		sender   = common.HexToAddress(ctx.String("sender"))
		receiver = common.HexToAddress(ctx.String("receiver"))
		code     = common.FromHex(ctx.String("code"))
		input    = common.FromHex(ctx.String("input"))
		gas      = ctx.Uint64("gas")
		gasPrice = math.MustParseBig256(ctx.String("gas-price"))
		value    = math.MustParseBig256(ctx.String("value"))
		vmenv    *vm.EVM
	)
	// ... more setup ...

	// Create the EVM instance.
	blockCtx := core.NewEVMBlockContext(header, &testChainContext{}, nil)
	txCtx := core.NewEVMTxContext(
		types.NewMessage(sender, &receiver, 0, value, gas, gasPrice, gasPrice, gasPrice, input, nil, false),
	)
	vmenv = vm.NewEVM(blockCtx, txCtx, statedb, chainConfig, *vmcfg)

	// Execute the bytecode.
	var (
		ret   []byte
		left  uint64
		vmErr error
	)
	if len(code) > 0 {
		ret, left, vmErr = vmenv.Call(vm.AccountRef(sender), receiver, input, gas, value)
	} else {
		// If no code is provided, the call is a simple value transfer.
		gas, err = core.IntrinsicGas(input, nil, nil, true, chainConfig.IsHomestead(header.Number), chainConfig.IsEIP2028(header.Number), chainConfig.IsEIP3860(header.Number))
		if err != nil {
			return err
		}
		mgval := new(big.Int).SetUint64(gas)
		mgval.Mul(mgval, gasPrice)
		if vmenv.StateDB.GetBalance(sender).Cmp(mgval) < 0 {
			return fmt.Errorf("insufficient funds for gas * price + value")
		}
		gaspool := new(core.GasPool).AddGas(gas)
		vmenv.StateDB.SetNonce(sender, vmenv.StateDB.GetNonce(sender)+1) // ugly but this is what state transition does.
		_, left, vmErr = vmenv.Call(vm.AccountRef(sender), receiver, input, gas, value)
	}

	// Print the execution summary, which is very similar to your `ExecutionOutput.print_summary`.
	if vmcfg.Tracer == nil {
		// If we're not tracing, print the output
		fmt.Printf("0x%x\n", ret)
		if vmErr != nil {
			fmt.Printf("error: %v\n", vmErr)
		}
	}
	fmt.Printf("gas left: %d\n", left)
	// ... more output and state dump logic ...
	return nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// This file contains the core logic for executing a transaction and producing
// a result, which is highly relevant for your `EvmExecutor`.

// ExecutionResult includes all output after executing given evm
// message no matter the execution itself is successful or not.
type ExecutionResult struct {
	UsedGas    uint64 // Total used gas, not including the refunded gas
	MaxUsedGas uint64 // Maximum gas consumed during execution, excluding gas refunds.
	Err        error  // Any error encountered during the execution(listed in core/vm/errors.go)
	ReturnData []byte // Returned data from evm(function result or data supplied with revert opcode)
}

// Failed returns the indicator whether the execution is successful or not
func (result *ExecutionResult) Failed() bool { return result.Err != nil }

// Revert returns the concrete revert reason if the execution is aborted by `REVERT`
// opcode. Note the reason can be nil if no data supplied with revert opcode.
func (result *ExecutionResult) Revert() []byte {
	if result.Err != vm.ErrExecutionReverted {
		return nil
	}
	return common.CopyBytes(result.ReturnData)
}

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	return newStateTransition(evm, msg, gp).execute()
}

// The core execution logic inside the stateTransition struct.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... pre-check logic (nonce, balance, gas limits) ...
	// ... intrinsic gas calculation ...

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

	// ... refund gas logic ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// This file defines the StructLogger, which is exactly what your `tevm-exec`
// needs for its `--trace` functionality. The `StructLog` is a direct analog
// to your `TraceStep` struct.

// StructLogger is a EVM state logger and implements Tracer.
// StructLogger can be used to capture execution traces of a transaction on a
// state for debugging purposes.
type StructLogger struct {
	cfg *Config

	storage map[common.Address]map[common.Hash]common.Hash
	logs    []StructLog
	err     error

	mu sync.Mutex
}

// StructLog is a structured log emitted by the EVM while replaying a
// transaction in debug mode.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            OpCode                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*uint256.Int              `json:"stack"`
	ReturnData    []byte                      `json:"returnData"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"` // Not marshalled, only for internal use
	OpName        string                      `json:"opName"` // Added for web3-style traces
	ErrorString   string                      `json:"error,omitempty"` // Added for web3-style traces
}

// CaptureState captures the EVM state before the execution of an opcode.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (logic to copy stack, memory, etc.) ...

	// Create the structured log object
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: scope.Memory.Len(),
		Stack:      stack,
		Depth:      depth,
		RefundCounter: scope.Contract.Gas,
		Err:        err,
		OpName:     op.String(),
	}
	if err != nil {
		log.ErrorString = err.Error()
	}
	if len(rData) > 0 {
		log.ReturnData = common.CopyBytes(rData)
	}
	if l.cfg != nil && l.cfg.EnableStorage {
		log.Storage = l.captureStorage(scope.Contract.Address(), scope.StateDB)
	}
	l.logs = append(l.logs, log)
}

// ... (other capture methods like CaptureFault, CaptureEnter, etc.) ...

// StructLogs returns the captured log entries.
func (l *StructLogger) StructLogs() []StructLog {
	return l.logs
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/statedb.go">
```go
// This file defines the StateDB interface, which is the primary API for
// inspecting and modifying EVM state. It's essential for your `tevm-state` tool.

// StateDB is an EVM database for full state querying.
type StateDB interface {
	CreateAccount(common.Address)

	SubBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
	AddBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
	GetBalance(common.Address) *uint256.Int

	GetNonce(common.Address) uint64
	SetNonce(common.Address, uint64, tracing.NonceChangeReason)

	GetCodeHash(common.Address) common.Hash
	GetCode(common.Address) []byte
	SetCode(common.Address, []byte)
	GetCodeSize(common.Address) int

	AddRefund(uint64)
	SubRefund(uint64)
	GetRefund() uint64

	GetCommittedState(common.Address, common.Hash) common.Hash
	GetState(common.Address, common.Hash) common.Hash
	SetState(common.Address, common.Hash, common.Hash)

	Suicide(common.Address) bool
	HasSuicided(common.Address) bool

	// Exist reports whether the given account exists in state.
	// Notably this should also return true for suicided accounts.
	Exist(common.Address) bool
	// Empty returns whether the given account is empty. Empty
	// is defined according to EIP161 (balance = nonce = code = 0).
	Empty(common.Address) bool

	// Prepare handles the preparatory steps for a state transition with regard to
	// EIP-2929, EIP-2930 and EIP-3529. It should be called before the execution
	// of a transaction.
	Prepare(rules params.Rules, sender common.Address, coinbase common.Address, dest *common.Address, precompiles []common.Address, txAccesses types.AccessList)

	RevertToSnapshot(int)
	Snapshot() int

	AddLog(*types.Log)
	AddPreimage(common.Hash, []byte)

	ForEachStorage(common.Address, func(key, value common.Hash) bool) error
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// This file contains the bytecode analysis logic, which is a perfect match for
// your `tevm-analyze` tool's requirements, especially for finding JUMPDESTs.

// analyse analyses the given code and returns the indexed valid jump destinations.
func analyse(code []byte) []bool {
	// Don't waste memory on empty code.
	if len(code) == 0 {
		return nil
	}
	// Iterate over the code and catalog the valid jump destinations
	dests := make([]bool, len(code))
	for i := 0; i < len(code); {
		// Grab the current opcode and jump if it's a push
		op := OpCode(code[i])
		if op >= PUSH1 && op <= PUSH32 {
			i += int(op) - int(PUSH1) + 2
		} else {
			// If the opcode is a JUMPDEST, catalog it
			if op == JUMPDEST {
				dests[i] = true
			}
			i++
		}
	}
	return dests
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// This file defines all EVM opcodes and their properties, which is invaluable
// for your `tevm-analyze` tool's `get_opcode_info` function.

// OpCode is a single byte representing an instruction.
type OpCode byte

// Defines the list of all opcodes.
const (
	STOP OpCode = 0x00
	ADD  OpCode = 0x01
	// ... all other opcodes ...
	SSTORE   OpCode = 0x55
	JUMPDEST OpCode = 0x5b
	// ...
	CALL    OpCode = 0xf1
	INVALID OpCode = 0xfe
)

// opCodeToString contains the string representation of each opcode.
var opCodeToString = [256]string{
	STOP: "STOP",
	ADD:  "ADD",
	// ...
}

// String returns the string representation of the opcode.
func (op OpCode) String() string {
	return opCodeToString[op]
}

// instruction contains the details of a particular instruction.
type instruction struct {
	// gasCreateFn is the gas function for contract creation
	gasCreateFn gasFunc
	// gasCallFn is the gas function for message calls
	gasCallFn gasFunc
	// validateStack validates the stack
	validateStack stackValidate
	// operation is the main function of the instruction
	operation operationFunc

	// ... other properties ...
}

// operationSet contains the corresponding instruction for each opcode.
var operationSet = [256]*instruction{
	// 0x0 range - arithmetic ops.
	STOP: {
		gasCallFn:     gasCallGas_0,
		validateStack: makeStackFunc(0, 0),
		operation:     opStop,
	},
	ADD: {
		gasCallFn:     gasCallGas_3,
		validateStack: makeStackFunc(2, 1),
		operation:     opAdd,
	},
	// ... all other instruction definitions ...
}
```
</file>

## Prompt Corrections
The prompt is very well-structured. Here are a couple of minor suggestions based on the go-ethereum implementation which might improve the design:

1.  **Refined `ExecutionOutput`**: The `error: ?anyerror` field is good, but you might consider a more structured error system. Go-ethereum distinguishes between normal halts (`STOP`), reverts (`vm.ErrExecutionReverted`), and other VM errors (`vm.ErrOutOfGas`, `vm.ErrStackUnderflow`, etc.). When an error is `vm.ErrExecutionReverted`, the `output` field contains the revert reason. This is a common pattern that makes error handling more robust. Your `ExecutionOutput.success` field can be derived from the specific error type.

2.  **Tracer Design**: The `StructLogger` in go-ethereum shows that a tracer often needs to capture state at multiple points in the EVM's execution cycle (e.g., `CaptureStart`, `CaptureState`, `CaptureFault`, `CaptureEnd`). Your `TraceStep` is an excellent representation of a single state capture. The `EvmExecutor`'s tracing implementation will involve hooking a tracer object into the VM's execution loop, which then populates the list of `TraceStep`s. This is a more robust pattern than trying to extract the trace *after* execution has completed.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/cmd/evm/main.go">
```go
package main

import (
	"fmt"
	"math/big"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/console/prompt"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/ethdb/memorydb"
	"github.com/ethereum/go-ethereum/params"
	"github.com/urfave/cli/v2"
)

var (
	evmFlags = []cli.Flag{
		// Execution options
		&cli.StringFlag{
			Name:  "code",
			Usage: "Hex-encoded code for execution",
		},
		&cli.StringFlag{
			Name:  "codefile",
			Usage: "File containing hex-encoded code for execution",
		},
		&cli.StringFlag{
			Name:  "gas",
			Usage: "Gas limit for execution",
			Value: "10000000000",
		},
		&cli.StringFlag{
			Name:  "price",
			Usage: "Gas price for execution",
			Value: "1",
		},
		&cli.StringFlag{
			Name:  "value",
			Usage: "Value to transfer for execution",
			Value: "0",
		},
		&cli.StringFlag{
			Name:  "input",
			Usage: "Input data for execution",
		},
		&cli.StringFlag{
			Name:  "inputfile",
			Usage: "File containing input data for execution",
		},
		// State options
		&cli.StringFlag{
			Name:  "prestate",
			Usage: "JSON file with pre-state (genesis style)",
		},
		// Chain options
		&cli.StringFlag{
			Name:  "chain",
			Usage: "Specify the chain name ('mainnet', 'sepolia', etc)",
		},
		&cli.StringFlag{
			Name:  "fork",
			Usage: "Specify the fork name ('Cancun', 'Shanghai', etc)",
		},
		&cli.Int64Flag{
			Name:  "block-number",
			Usage: "Block number to use for the context",
		},
		&cli.StringFlag{
			Name:  "block-time",
			Usage: "Block timestamp to use for the context",
		},
		&cli.StringFlag{
			Name:  "block-coinbase",
			Usage: "Coinbase to use for the context",
			Value: "0x0000000000000000000000000000000000000000",
		},
		// Tracing options
		&cli.BoolFlag{
			Name:  "json",
			Usage: "Output trace logs in JSON format",
		},
		&cli.BoolFlag{
			Name:  "debug",
			Usage: "Output full trace logs",
		},
		&cli.StringFlag{
			Name:  "trace",
			Usage: "Trace a single transaction hash",
		},
		// Output options
		&cli.BoolFlag{
			Name:  "dump",
			Usage: "Dump the state after the run",
		},
		// Other commands
		&cli.BoolFlag{
			Name:  "statetest",
			Usage: "Execute a state test",
		},
		&cli.BoolFlag{
			Name:  "bench",
			Usage: "Benchmark the execution",
		},
	}
)

// ...

func main() {
	app := &cli.App{
		Name:   "evm",
		Usage:  "a tool to run evm code",
		Action: run,
		Flags:  evmFlags,
		Commands: []*cli.Command{
			{
				Name:   "disasm",
				Usage:  "disassemble evm code",
				Action: disasm,
			},
			{
				Name:      "run",
				Usage:     "run code",
				ArgsUsage: "<code>",
				Action:    run,
				Flags:     evmFlags,
			},
			{
				Name:      "bench",
				Usage:     "benchmark code",
				ArgsUsage: "<code>",
				Action:    bench,
				Flags:     evmFlags,
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

// ...

func run(ctx *cli.Context) error {
	var (
		chainConfig *params.ChainConfig
		err         error
	)
	if name := ctx.String("chain"); name != "" {
		chainConfig, err = chainConfigFromName(name)
		if err != nil {
			return err
		}
	} else {
		chainConfig = params.AllEthashProtocolChanges
	}
	if name := ctx.String("fork"); name != "" {
		chainConfig, err = chainConfigFromFork(chainConfig, name)
		if err != nil {
			return err
		}
	}
	// ... (code for setting up environment)

	cfg := Config{
		ChainConfig: chainConfig,
		Difficulty:  big.NewInt(1), // Legacy, not used anymore
		Origin:      sender,
		Coinbase:    coinbase,
		BlockNumber: big.NewInt(int64(ctx.Int64("block-number"))),
		Time:        time,
		GasLimit:    gas,
		GasPrice:    price,
		Value:       value,
		Debug:       ctx.Bool("debug"),
		EVMConfig:   vm.Config{Tracer: tracer, Debug: ctx.Bool("debug"), NoBaseFee: true},
	}

	// Setup state.
	var gspec *core.Genesis
	if f := ctx.String("prestate"); f != "" {
		// ...
	}
	db := memorydb.New()
	statedb, err := state.New(common.Hash{}, state.NewDatabase(db), nil)
	if err != nil {
		return err
	}
	if gspec != nil {
		if err = gspec.Setup(statedb); err != nil {
			return err
		}
	}
	// Run the code.
	result, err := runEVM(code, input, statedb, cfg)
	if err != nil {
		return err
	}
	// ... (handle result)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/cmd/evm/runner.go">
```go
package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

type Config struct {
	ChainConfig *params.ChainConfig `json:"chainConfig"`
	Difficulty  *big.Int            `json:"difficulty"`
	Origin      common.Address      `json:"origin"`
	Coinbase    common.Address      `json:"coinbase"`
	BlockNumber *big.Int            `json:"blockNumber"`
	Time        *big.Int            `json:"timeStamp"`
	GasLimit    uint64              `json:"gasLimit"`
	GasPrice    *big.Int            `json:"gasPrice"`
	Value       *big.Int            `json:"value"`
	Debug       bool                `json:"debug"`

	EVMConfig vm.Config
}

type ExecutionResult struct {
	UsedGas    uint64         `json:"gasUsed"`
	Err        error          `json:"error,omitempty"`
	ReturnData []byte         `json:"returnData,omitempty"`
	State      *state.StateDB `json:"-"`
}

func runEVM(code, input []byte, statedb *state.StateDB, cfg Config) (*ExecutionResult, error) {
	var (
		from  = cfg.Origin
		to    = common.Address{}
		value = cfg.Value
	)
	if cfg.EVMConfig.Tracer == nil && cfg.Debug {
		cfg.EVMConfig.Tracer = vm.NewStructLogger(&vm.LogConfig{
			Debug: true,
		})
	}
	// Create the EVM and context objects.
	ctx := vm.NewEVMBlockContext(core.Header(cfg), core.ChainContext(cfg), &cfg.Coinbase)
	evm := vm.NewEVM(ctx, vm.NewEVMTxContext(from, cfg.GasPrice, value, to), statedb, cfg.ChainConfig, cfg.EVMConfig)
	var (
		ret   []byte
		gas   uint64
		vmerr error
	)
	if code != nil {
		ret, gas, vmerr = evm.Call(vm.AccountRef(from), to, input, cfg.GasLimit, value)
	} else {
		ret, _, gas, vmerr = evm.Create(vm.AccountRef(from), input, cfg.GasLimit, value)
	}
	return &ExecutionResult{
		UsedGas:    cfg.GasLimit - gas,
		Err:        vmerr,
		ReturnData: ret,
		State:      statedb,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/logger.go">
```go
package vm

import (
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

// StructLog is a structured log emitted by the EVM while replaying a transaction in
// debug mode
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            OpCode             `json:"op"`
	Gas           uint64             `json:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        []byte             `json:"memory"`
	MemorySize    int                `json:"memSize"`
	Stack         []*big.Int         `json:"stack"`
	ReturnData    []byte             `json:"returnData"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           error              `json:"-"`
	OpName        string             `json:"opName"`
}

// StructLogger is a EVM state logger that prints execution steps as JSON objects
// on a given writer.
type StructLogger struct {
	cfg *LogConfig

	logs          []StructLog
	storage       map[common.Hash]common.Hash
	gas           uint64
	memory        *Memory
	stack         *Stack
	rval          *ReturnData
	statedb       StateDB
	err           error
	refund        uint64
	callErr       error
	reason        string
	output        []byte
	interrupt     bool
	txStart       time.Time
	txGas         uint64
}

// CaptureStart is called when the EVM starts executing a new transaction.
func (l *StructLogger) CaptureStart(evm *EVM, from, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.txStart = time.Now()
	l.txGas = gas
}

// CaptureState is called after each EVM opcode execution.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// Copy stack
	var stack []*big.Int
	for _, val := range scope.Stack.Data() {
		stack = append(stack, new(big.Int).Set(val.ToBig()))
	}
	// Copy memory
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// Copy return data
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}
	// Create and store the log
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: scope.Memory.Len(),
		Stack:      stack,
		ReturnData: returnData,
		Depth:      depth,
		OpName:     op.String(),
	}
	if err != nil {
		log.Err = err
	}
	l.logs = append(l.logs, log)
}

// StructLogs returns the captured log entries.
func (l *StructLogger) StructLogs() []StructLog {
	return l.logs
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/statedb.go">
```go
package state

import (
	"fmt"
	"math/big"
	"sort"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
)

// StateDB is an EVM database for full state processing.
type StateDB struct {
	db   Database
	trie Trie

	// ...

	// Per-transaction state
	journal        *journal
	stateObjects        map[common.Address]*stateObject
	stateObjectsDirty   map[common.Address]struct{}
	// ...
}

// GetBalance retrieves the balance from the given address or 0 if object not found
func (s *StateDB) GetBalance(addr common.Address) *big.Int {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Balance()
	}
	return common.Big0
}

// GetNonce retrieves the nonce from the given address or 0 if object not found
func (s *StateDB) GetNonce(addr common.Address) uint64 {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Nonce()
	}
	return 0
}

// GetCode retrieves the code from the given address or nil if object not found
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// GetCodeHash returns the code hash for the given address.
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return common.Hash{}
	}
	return common.BytesToHash(stateObject.CodeHash())
}

// GetState retrieves a value from the given address' storage.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(s.db, hash)
	}
	return common.Hash{}
}

// ForEachStorage iterate over the storage of an account.
func (s *StateDB) ForEachStorage(addr common.Address, cb func(key, value common.Hash) bool) error {
	so := s.getStateObject(addr)
	if so == nil {
		return nil
	}
	it := trie.NewIterator(so.getTrie(s.db).NodeIterator(nil))
	for it.Next() {
		key := common.BytesToHash(s.trie.GetKey(it.Key))
		if !cb(key, common.BytesToHash(it.Value)) {
			return nil
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/analysis.go">
```go
package vm

// Analyse analyzes the given code and returns an analysis result.
// The code analysis result contains determined jump destinations and optionally
// (if configured) the maximum stack complexity.
//
// The analysis performs a single pass over the code. It does not recurse into
// call or create instructions.
func Analyse(code []byte) (jumpdests bitvec, maxstack int, err error) {
	// Don't bother analyzing, every JUMP is invalid.
	if len(code) == 0 {
		return bitvec{}, 0, nil
	}

	var (
		stack      int
		op         OpCode
		pc         uint64
		pd         uint64 // push data counter
		ignore     bool   // result of an analysis op; we can't be sure of the stack
		destinations = bitvec_unexported{}
	)

	// We need to keep track of the last push operation in order to determine
	// the valid jump destinations.
	var lastPushData []byte

	destinations.resize(uint(len(code)))
	for pc < uint64(len(code)) {
		op = OpCode(code[pc])

		// The maxstack should be tracked after the operation has been evaluated.
		// So we do a pre-calculation, and cast it to an int.
		newstack := stack
		if min, max, err := stackReqs(op, int(newstack)); err != nil {
			return nil, 0, err
		} else {
			newstack = newstack - min + max
		}
		if newstack > maxstack {
			maxstack = newstack
		}
		// If we're ignoring, we can't be certain of the stack height.
		if ignore {
			maxstack = -1
		}
		stack = newstack

		switch {
		case op == PUSH1:
			pd = 1
		// ... (cases for PUSH2 to PUSH32)
		case op == JUMPDEST:
			destinations.set(uint(pc))
		case op == JUMP || op == JUMPI:
			if lastPushData != nil {
				// We can only check for literal jump destinations
				// if the value has been pushed just prior to the JUMP-op.
				var (
					// PUSH1 will be at least two bytes, so we can't have underflow here
					pushop = OpCode(code[pc-uint64(len(lastPushData))-1])
					// The JUMP op is not counted in lastPushData, so we check
					// that first.
					opSize = pushop.pushDataSize()
				)
				if opSize == uint8(len(lastPushData)) {
					dest := new(big.Int).SetBytes(lastPushData).Uint64()
					if dest < uint64(len(code)) && OpCode(code[dest]) == JUMPDEST {
						destinations.set(uint(dest))
					}
				}
			}
			// JUMP and JUMPI are special, because they are the only ops that can
			// change the control flow, apart from STOP and RETURN.
			// After this, we can't be certain what the stack looks like.
			ignore = true
		}
		// ... (handle push data)
	}
	return destinations.toBitVec(), maxstack, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/cmd/evm/disasm.go">
```go
package main

import (
	"fmt"
	"io"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/urfave/cli/v2"
)

func disasm(ctx *cli.Context) error {
	// ... (code to read bytecode)

	// Create a new reader and disassemble
	it := vm.NewInstructionIterator(code)
	for it.Next() {
		// Also print the PC and the opcode in hex.
		fmt.Printf("%05x: %02x: %-12s", it.PC(), it.Op(), it.Opcode())
		// If the opcode is a push, print the pushed value.
		if it.IsPush() {
			fmt.Printf("0x%x", it.Arg())
		}
		fmt.Println()
	}
	return it.Error()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/opcodes.go">
```go
package vm

import "math/big"

// OpCode is a single byte representing an opcode in the Ethereum Virtual Machine.
type OpCode byte

// ... (OpCode constants defined here, e.g., PUSH1, ADD, etc.)

// opCodeToString contains the string representation of an opcode.
var opCodeToString = [256]string{
	STOP: "STOP",

	ADD: "ADD",
	MUL: "MUL",
	SUB: "SUB",
	// ... all other opcodes
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/cmd/evm/bench.go">
```go
package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"runtime"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/ethdb/memorydb"
	"github.com/ethereum/go-ethereum/params"
	"github.com/urfave/cli/v2"
)

// ...

// runBenchmark runs the benchmark given by the code and input.
func runBenchmark(code, input []byte, cfg Config) error {
	// ... (setup)

	var (
		start = time.Now()
		runs  = 0
		totalGas uint64
	)
	for time.Since(start) < 2*time.Second {
		// Note: The EVM is not thread safe, so we can't run these in parallel.
		// We'd need to create a new EVM for each thread.
		var (
			statedb, _ = state.New(common.Hash{}, state.NewDatabase(memorydb.New()), nil)
			vmenv      = vm.NewEVM(vm.NewEVMBlockContext(core.Header(cfg), core.ChainContext(cfg), &cfg.Coinbase), vm.NewEVMTxContext(from, cfg.GasPrice, cfg.Value, to), statedb, cfg.ChainConfig, cfg.EVMConfig)
		)
		_, gas, err := vmenv.Call(
			vm.AccountRef(from), // caller
			to,                  // contract
			input,               // input
			cfg.GasLimit,        // gas
			cfg.Value,           // value
		)
		if err != nil {
			return err
		}
		runs++
		totalGas += cfg.GasLimit - gas
	}

	var (
		duration = time.Since(start)
		nsOp     = float64(duration.Nanoseconds()) / float64(runs)
		gasOp    = float64(totalGas) / float64(runs)
	)
	fmt.Printf("Benchmark run for %v\n", duration)
	fmt.Printf("Total runs: %d\n", runs)
	fmt.Printf("Total gas: %d\n", totalGas)
	fmt.Printf("ns/op: %f\n", nsOp)
	fmt.Printf("gas/op: %f\n", gasOp)
	fmt.Printf("mgas/s: %f\n", (float64(totalGas)/1e6)/(float64(duration)/float64(time.Second)))

	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go">
```go
package params

import "math/big"

var (
	// GasTableEIP150 contains gas prices for the homestead fork.
	GasTableEIP150 = GasTable{
		ExtcodeSize: 700,
		ExtcodeCopy: 700,
		Balance:     400,
		Sload:       200,
		// ...
	}
	// GasTableEIP2200 contains gas prices for the Istanbul fork.
	GasTableEIP2200 = GasTable{
		// ...
		Sload: 800,
		// ...
	}
	// GasTableBerlin contains gas prices for the Berlin fork.
	GasTableBerlin = GasTable{
		// ...
		ExtcodeSize: 100,
		Balance:     100,
		ExtcodeCopy: 100,
		Sload:       100,
		// ...
	}
)

// GasTable returns the gas table for the given fork configuration.
func (c *ChainConfig) GasTable(num uint64) GasTable {
	if num >= c.CancunBlock.Uint64() {
		return GasTableCancun
	}
	if num >= c.ShanghaiBlock.Uint64() {
		return GasTableShanghai
	}
	// ... (other forks)
	if num >= c.BerlinBlock.Uint64() {
		return GasTableBerlin
	}
	// ...
	return GasTableEIP150
}
```
</file>
</go-ethereum>

## Prompt Corrections
The provided prompt is very detailed and well-structured. Here are a few suggestions for improvement based on the Go-Ethereum implementation:

1.  **Hardfork-Specific Gas Costs**: The `get_opcode_info` function in `BytecodeAnalyzer` uses hardcoded gas costs. In a real EVM, these costs change with different hardforks (e.g., `SLOAD` cost has changed multiple times). Instead of a single info function, it's better to use a `GasTable` struct that is selected based on the active hardfork. You can see this pattern in `params/protocol_params.go`. The `Vm` struct should hold a reference to the active `GasTable`.

2.  **State Initialization**: The `StateInspector` in the prompt initializes a new, empty `Vm` and `State`. A real-world tool would need to load state from a source, like a database or a JSON file. Geth's `evm` tool uses a `--prestate` flag to load a genesis-style JSON file into the state database before execution. Consider adding a method to `StateInspector` like `load_state_from_json(path: []const u8)` that populates the `vm.state`.

3.  **Transaction Execution**: The `run_executor` function only handles raw bytecode via the `--code` flag. While useful, a comprehensive tool should also be able to execute a signed transaction. You could add a `--tx <RLP_HEX>` flag to `tevm-exec` which would parse a full transaction, validate its signature, and then execute it using the `EvmExecutor.execute_transaction` method. This would make the tool much more powerful for testing and debugging.

4.  **JUMPDEST Analysis**: The `find_jump_destinations` method in `BytecodeAnalyzer` implements a simple scan for the `JUMPDEST` opcode. A more robust implementation, like Geth's `core/vm/analysis.go`, would also validate that these opcodes are not part of `PUSH` data. The Geth implementation uses a bit vector to mark valid code locations before identifying `JUMPDEST`s, which is a more accurate approach.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/geth/evm.go">
```go
// evmCommand is the 'evm' command.
var evmCommand = &cli.Command{
	Action:      evmCmd,
	Name:        "evm",
	Usage:       "Executes EVM code",
	ArgsUsage:   "",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  CodeFlag.Name,
			Usage: "EVM code for execution",
		},
		&cli.StringFlag{
			Name:  CodeFileFlag.Name,
			Usage: "File containing EVM code for execution",
		},
		&cli.StringFlag{
			Name:  GasFlag.Name,
			Usage: "Gas limit for execution",
			Value: "1000000",
		},
		&cli.StringFlag{
			Name:  PriceFlag.Name,
			Usage: "Gas price for execution",
			Value: "0",
		},
		&cli.StringFlag{
			Name:  ValueFlag.Name,
			Usage: "Value for execution",
			Value: "0",
		},
		&cli.StringFlag{
			Name:  InputFlag.Name,
			Usage: "Input data for execution",
		},
		&cli.StringFlag{
			Name:  InputFileFlag.Name,
			Usage: "File containing input data for execution",
		},
		&cli.StringFlag{
			Name:  VerbosityFlag.Name,
			Usage: "Sets the verbosity of the EVM output",
		},
		&cli.BoolFlag{
			Name:  DisasmFlag.Name,
			Usage: "Disassemble the code instead of executing",
		},
		&cli.StringFlag{
			Name:  TracerFlag.Name,
			Usage: "Enable a custom JS tracer",
		},
		// ... more flags for state, block context etc.
	},
	Description: `
The evm command requires a mandatory --code or --codefile argument to specify
the code to be executed. The optional arguments are:
--gas: the amount of gas for the execution.
--price: the gas price to use in the execution.
--value: the value to use in the execution.
--input or --inputfile: the input data.
--dump: dump the state after execution.
--debug: output full trace logs.
--disasm: disassemble the code instead of executing.
`,
}

func evmCmd(ctx *cli.Context) error {
	// ... (flag and argument parsing logic)

	// Create a state database with some test accounts.
	statedb, err := makeConfiguredStateDB(ctx, gspec)
	if err != nil {
		return err
	}
	// ... (setting up sender, receiver accounts)

	// Setup the execution environment.
	cfg := &runtime.Config{
		ChainConfig: chainConfig,
		Difficulty:  difficulty,
		Origin:      origin,
		Coinbase:    coinbase,
		BlockNumber: blockNumber,
		Time:        timestamp,
		GasLimit:    gasLimit,
		GasPrice:    gasPrice,
		Value:       value,
		State:       statedb,
		EVMConfig: vm.Config{
			Tracer:                  tracer,
			NoBaseFee:               ctx.Bool(NoBaseFeeFlag.Name),
			EnablePreimageRecording: ctx.Bool(EnablePreimageRecordingFlag.Name),
			ExtraEips:               extraEips,
		},
	}

	// Disassemble the code if requested
	if ctx.Bool(DisasmFlag.Name) {
		program, err := program.Parse(string(code))
		if err != nil {
			return err
		}
		fmt.Printf("%v\n", program)
		return nil
	}

	// Execute the code
	ret, _, err := runtime.Execute(code, input, cfg)
	if err != nil {
		return err
	}

	// Print the results
	fmt.Printf("Return: %x\n", ret)
	if ctx.Bool(DumpFlag.Name) {
		cfg.State.Commit(cfg.ChainConfig.LondonBlock.Uint64(), false, false)
		cfg.State.IntermediateRoot(false)

		var b bytes.Buffer
		json.Indent(&b, cfg.State.Dump(nil), "", "\t")
		fmt.Println(b.String())
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/runtime/runtime.go">
```go
// Execute executes the code using the input as call data during the execution.
// It returns the EVM's return value, the new state and an error if it failed.
//
// Execute sets up an in-memory, temporary, environment for the execution of
// the given code. It makes sure that it's restored to its original state afterwards.
func Execute(code, input []byte, cfg *Config) ([]byte, *state.StateDB, error) {
	if cfg == nil {
		cfg = new(Config)
	}
	setDefaults(cfg)

	if cfg.State == nil {
		cfg.State, _ = state.New(types.EmptyRootHash, state.NewDatabaseForTesting())
	}
	var (
		address = common.BytesToAddress([]byte("contract"))
		vmenv   = NewEnv(cfg)
		rules   = cfg.ChainConfig.Rules(vmenv.Context.BlockNumber, vmenv.Context.Random != nil, vmenv.Context.Time)
	)
	// ...
	// Execute the preparatory steps for state transition which includes:
	// - prepare accessList(post-berlin)
	// - reset transient storage(eip 1153)
	cfg.State.Prepare(rules, cfg.Origin, cfg.Coinbase, &address, vm.ActivePrecompiles(rules), nil)
	cfg.State.CreateAccount(address)
	// set the receiver's (the executing contract) code for execution.
	cfg.State.SetCode(address, code)
	// Call the code with the given configuration.
	ret, leftOverGas, err := vmenv.Call(
		cfg.Origin,
		common.BytesToAddress([]byte("contract")),
		input,
		cfg.GasLimit,
		uint256.MustFromBig(cfg.Value),
	)
	// ...
	return ret, cfg.State, err
}

// Create executes the code using the EVM create method
func Create(input []byte, cfg *Config) ([]byte, common.Address, uint64, error) {
	// ...
	// Call the code with the given configuration.
	code, address, leftOverGas, err := vmenv.Create(
		cfg.Origin,
		input,
		cfg.GasLimit,
		uint256.MustFromBig(cfg.Value),
	)
	// ...
	return code, address, leftOverGas, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/runtime/env.go">
```go
func NewEnv(cfg *Config) *vm.EVM {
	txContext := vm.TxContext{
		Origin:     cfg.Origin,
		GasPrice:   cfg.GasPrice,
		BlobHashes: cfg.BlobHashes,
		BlobFeeCap: cfg.BlobFeeCap,
	}
	blockContext := vm.BlockContext{
		CanTransfer: core.CanTransfer,
		Transfer:    core.Transfer,
		GetHash:     cfg.GetHashFn,
		Coinbase:    cfg.Coinbase,
		BlockNumber: cfg.BlockNumber,
		Time:        cfg.Time,
		Difficulty:  cfg.Difficulty,
		GasLimit:    cfg.GasLimit,
		BaseFee:     cfg.BaseFee,
		BlobBaseFee: cfg.BlobBaseFee,
		Random:      cfg.Random,
	}

	evm := vm.NewEVM(blockContext, cfg.State, cfg.ChainConfig, cfg.EVMConfig)
	evm.SetTxContext(txContext)
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// ApplyMessage computes the new state by applying the given message against the
// old state.
func ApplyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	// ... (gas setup and intrinsic gas deduction)

	// Create a new state scope for the execution of the given message.
	snapshot := evm.StateDB.Snapshot()

	// ... (pre-transfer checks and balance deductions)
	
	// If the recipient is nil, it's a contract creation
	var (
		ret   []byte
		vmerr error
	)
	if msg.To() == nil {
		ret, _, evm.gas, vmerr = evm.Create(contract, msg.Data(), evm.gas, msg.Value())
	} else {
		// Increment the nonce for the next transaction.
		evm.StateDB.SetNonce(msg.From(), evm.StateDB.GetNonce(msg.From())+1, tracing.NonceChangeTx)
		ret, evm.gas, vmerr = evm.Call(contract, *msg.To(), msg.Data(), evm.gas, msg.Value())
	}
	// ... (post-execution error handling and refund calculation)

	return &ExecutionResult{
		UsedGas:    usedGas,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/dump.go">
```go
// DumpToCollector iterates the state according to the given options and inserts
// the items into a collector for aggregation or serialization.
func (s *StateDB) DumpToCollector(c DumpCollector, conf *DumpConfig) (nextKey []byte) {
	// Sanitize the input to allow nil configs
	if conf == nil {
		conf = new(DumpConfig)
	}
	var (
		missingPreimages int
		accounts         uint64
		start            = time.Now()
		logged           = time.Now()
	)
	log.Info("Trie dumping started", "root", s.trie.Hash())
	c.OnRoot(s.trie.Hash())

	trieIt, err := s.trie.NodeIterator(conf.Start)
	if err != nil {
		log.Error("Trie dumping error", "err", err)
		return nil
	}
	it := trie.NewIterator(trieIt)
	for it.Next() {
		var data types.StateAccount
		if err := rlp.DecodeBytes(it.Value, &data); err != nil {
			panic(err)
		}
		var (
			account = DumpAccount{
				Balance:     data.Balance.String(),
				Nonce:       data.Nonce,
				Root:        data.Root[:],
				CodeHash:    data.CodeHash,
				AddressHash: it.Key,
			}
			address   *common.Address
			addr      common.Address
			addrBytes = s.trie.GetKey(it.Key)
		)
		if addrBytes == nil {
			missingPreimages++
			if conf.OnlyWithAddresses {
				continue
			}
		} else {
			addr = common.BytesToAddress(addrBytes)
			address = &addr
			account.Address = address
		}
		obj := newObject(s, addr, &data)
		if !conf.SkipCode {
			account.Code = obj.Code()
		}
		if !conf.SkipStorage {
			account.Storage = make(map[common.Hash]string)
			tr, err := obj.getTrie()
			if err != nil {
				log.Error("Failed to load storage trie", "err", err)
				continue
			}
			trieIt, err := tr.NodeIterator(nil)
			if err != nil {
				log.Error("Failed to create trie iterator", "err", err)
				continue
			}
			storageIt := trie.NewIterator(trieIt)
			for storageIt.Next() {
				_, content, _, err := rlp.Split(storageIt.Value)
				if err != nil {
					log.Error("Failed to decode the value returned by iterator", "error", err)
					continue
				}
				account.Storage[common.BytesToHash(s.trie.GetKey(storageIt.Key))] = common.Bytes2Hex(content)
			}
		}
		c.OnAccount(address, account)
		// ... (logging and max items logic)
	}
	// ...
	return nextKey
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis_legacy.go">
```go
// bitvec is a bit vector which maps bytes in a program.
// An unset bit means the byte is an opcode, a set bit means
// it's data (i.e. argument of PUSHxx).
type bitvec []byte

// ...

// codeSegment checks if the position is in a code segment.
func (bits *bitvec) codeSegment(pos uint64) bool {
	return (((*bits)[pos/8] >> (pos % 8)) & 1) == 0
}

// codeBitmap collects data locations in code.
func codeBitmap(code []byte) bitvec {
	// The bitmap is 4 bytes longer than necessary, in case the code
	// ends with a PUSH32, the algorithm will set bits on the
	// bitvector outside the bounds of the actual code.
	bits := make(bitvec, len(code)/8+1+4)
	return codeBitmapInternal(code, bits)
}

// codeBitmapInternal is the internal implementation of codeBitmap.
// It exists for the purpose of being able to run benchmark tests
// without dynamic allocations affecting the results.
func codeBitmapInternal(code, bits bitvec) bitvec {
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])
		pc++
		if int8(op) < int8(PUSH1) { // If not PUSH (the int8(op) > int(PUSH32) is always false).
			continue
		}
		numbits := op - PUSH1 + 1
		if numbits >= 8 {
			for ; numbits >= 16; numbits -= 16 {
				bits.set16(pc)
				pc += 16
			}
			for ; numbits >= 8; numbits -= 8 {
				bits.set8(pc)
				pc += 8
			}
		}
		// ... (switch for remaining numbits)
	}
	return bits
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

// new...InstructionSet returns the frontier instructions
// that can be executed during the frontier phase.
func newFrontierInstructionSet() JumpTable {
	tbl := JumpTable{
		STOP: {
			execute:     opStop,
			constantGas: 0,
			minStack:    minStack(0, 0),
			maxStack:    maxStack(0, 0),
		},
		ADD: {
			execute:     opAdd,
			constantGas: GasFastestStep,
			minStack:    minStack(2, 1),
			maxStack:    maxStack(2, 1),
		},
		// ... more opcodes
	}
	// ...
	return validate(tbl)
}

// newByzantiumInstructionSet returns the frontier, homestead and
// byzantium instructions.
func newByzantiumInstructionSet() JumpTable {
	instructionSet := newSpuriousDragonInstructionSet()
	instructionSet[STATICCALL] = &operation{
		execute:     opStaticCall,
		constantGas: params.CallGasEIP150,
		dynamicGas:  gasStaticCall,
		minStack:    minStack(6, 1),
		maxStack:    maxStack(6, 1),
		memorySize:  memoryStaticCall,
	}
	// ... more opcodes for byzantium
	return validate(instructionSet)
}

// ... other new...InstructionSet functions for each hardfork
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup)

	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
		// ... (tracing and gas checks)

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		// Validate stack
		if sLen := stack.len(); sLen < operation.minStack {
			return nil, &ErrStackUnderflow{stackLen: sLen, required: operation.minStack}
		} else if sLen > operation.maxStack {
			return nil, &ErrStackOverflow{stackLen: sLen, limit: operation.maxStack}
		}
		// ... (gas consumption logic)
		
		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		if err != nil {
			break
		}
		pc++
	}
	// ... (error handling)
	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
// genValueTx returns a block generator that includes a single
// value-transfer transaction with n bytes of extra data in each
// block.
func genValueTx(nbytes int) func(int, *BlockGen) {
	// We can reuse the data for all transactions.
	data := make([]byte, nbytes)
	return func(i int, gen *BlockGen) {
		toaddr := common.Address{}
		gas, _ := IntrinsicGas(data, nil, nil, false, false, false, false)
		signer := gen.Signer()
		gasPrice := big.NewInt(0)
		if gen.header.BaseFee != nil {
			gasPrice = gen.header.BaseFee
		}
		tx, _ := types.SignNewTx(benchRootKey, signer, &types.LegacyTx{
			Nonce:    gen.TxNonce(benchRootAddr),
			To:       &toaddr,
			Value:    big.NewInt(1),
			Gas:      gas,
			Data:     data,
			GasPrice: gasPrice,
		})
		gen.AddTx(tx)
	}
}

func benchInsertChain(b *testing.B, disk bool, gen func(int, *BlockGen)) {
	// Create the database in memory or in a temporary directory.
	var db ethdb.Database
	// ... (database setup)

	// Generate a chain of b.N blocks using the supplied block
	// generator function.
	gspec := &Genesis{
		Config: params.TestChainConfig,
		Alloc:  types.GenesisAlloc{benchRootAddr: {Balance: benchRootFunds}},
	}
	_, chain, _ := GenerateChainWithGenesis(gspec, ethash.NewFaker(), b.N, gen)

	// Time the insertion of the new chain.
	// State and blocks are stored in the same DB.
	chainman, _ := NewBlockChain(db, nil, gspec, nil, ethash.NewFaker(), vm.Config{}, nil)
	defer chainman.Stop()
	b.ReportAllocs()
	b.ResetTimer()
	if i, err := chainman.InsertChain(chain); err != nil {
		b.Fatalf("insert error (block %d): %v\n", i, err)
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides an excellent and detailed plan for implementing a comprehensive CLI toolchain for a Zig-based EVM. The structure of the `EvmExecutor`, `StateInspector`, `BytecodeAnalyzer`, and `PerformanceBench` modules is well-thought-out and covers the essential features.

Here are a few minor suggestions and clarifications based on the go-ethereum implementation:

1.  **Hardfork-Specific Logic (`tevm-exec` & `tevm-analyze`)**: The `get_opcode_info` function in `BytecodeAnalyzer` is a good starting point, but a production-grade EVM needs to handle changes in opcodes and gas costs across different hardforks. Instead of a single static map, consider a structure similar to Geth's `JumpTable`. Geth pre-constructs a jump table for each hardfork, where each entry contains not just the gas cost but also a pointer to the execution function, stack validation requirements, and memory expansion logic. This makes the VM highly configurable and ensures historical correctness. The `core/vm/jump_table.go` snippet shows how these tables are constructed for each fork.

2.  **State Iteration (`tevm-state`)**: The `get_state_summary` function in `StateInspector` implies iterating over all accounts. Geth's `core/state/dump.go` shows how this is done by creating a `trie.NodeIterator` on the state trie. This is the standard and most efficient way to traverse the entire state. For storage, a similar iterator can be created on an account's storage trie.

3.  **Bytecode Analysis (`tevm-analyze`)**: The `find_jump_destinations` function is a crucial part of bytecode analysis. Geth uses a `bitvec` (bit vector) to efficiently determine valid `JUMPDEST` locations. It pre-analyzes the bytecode to create a bitmap where each bit indicates whether the corresponding byte is an opcode or PUSH data. This prevents jumping into the middle of an instruction's data, which is an invalid operation. The `core/vm/analysis_legacy.go` snippet provides this `codeBitmap` logic, which is highly recommended for a correct and performant implementation.

4.  **Transaction Execution (`tevm-exec`)**: The `execute_transaction` function correctly identifies the need to differentiate between a contract call (`tx.to` is not null) and a contract creation (`tx.to` is null). Geth's `ApplyMessage` function in `core/state_processor.go` provides a clear reference for this logic, showing how it calls `evm.Call` or `evm.Create` accordingly.

These points are not corrections to errors but rather suggestions for incorporating battle-tested patterns from go-ethereum to enhance the robustness and correctness of the final implementation. The provided prompt is already of very high quality.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/runner.go">
```go
// package evm is the entry point for the evm command.
package evm

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/consensus/misc"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/eth/tracers/logger"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/triedb"
)

// run runs the EVM code with the given configuration.
func run(code []byte, c *config) error {
	// Create the state database and initial head block
	db := rawdb.NewMemoryDatabase()
	gspec := &core.Genesis{
		Config:     params.MainnetChainConfig,
		Alloc:      c.precompiles,
		Difficulty: c.difficulty,
		GasLimit:   c.gasLimit,
		Number:     c.blockNumber.Uint64(),
		Timestamp:  c.timestamp,
	}
	genesis := gspec.MustCommit(db)

	statedb, err := state.New(genesis.Root(), state.NewDatabase(triedb.NewDatabase(db, nil)))
	if err != nil {
		db.Close()
		return err
	}
	// Create the EVM context
	author := &c.coinbase
	txContext := vm.TxContext{
		Origin:   c.origin,
		GasPrice: c.gasPrice,
	}
	blockContext := vm.BlockContext{
		CanTransfer: core.CanTransfer,
		Transfer:    core.Transfer,
		GetHash:     core.GetHashFn(rawdb.NewHeaderChainReader(db)),
		Coinbase:    *author,
		GasLimit:    c.gasLimit,
		BlockNumber: c.blockNumber,
		Time:        c.timestamp,
		Difficulty:  c.difficulty,
		BaseFee:     c.baseFee,
		Random:      &c.random,
	}
	// Create the EVM
	vmConfig := vm.Config{
		Debug:                   c.debug,
		Tracer:                  nil,
		NoBaseFee:               c.baseFee == nil,
		EnablePreimageRecording: c.preimages,
	}
	if c.json {
		vmConfig.Tracer = logger.NewJSONLogger(&logger.Config{
			Debug: c.debug,
		}, os.Stdout)
	} else if c.debug {
		vmConfig.Tracer = vm.NewStructLogger(&vm.LogConfig{
			Debug: true,
		})
	}
	evm := vm.NewEVM(blockContext, txContext, statedb, gspec.Config, vmConfig)

	// Execute the code and extract the results
	var (
		ret   []byte
		gas   = c.gasLimit
		mstart = new(big.Int)
		mend   = new(big.Int)
	)
	mstart.SetUint64(statedb.Balance(c.sender))

	if len(c.create) > 0 {
		var p common.Address
		ret, p, gas, err = evm.Create(c.sender, c.create, c.gasLimit, c.value)
		fmt.Printf("Contract Addr: %x\n", p)
	} else {
		ret, gas, err = evm.Call(c.sender, c.receiver, c.input, c.gasLimit, c.value)
	}
	mend.SetUint64(statedb.Balance(c.sender))
	if err != nil {
		fmt.Printf("err: %v\n", err)
	}
	// Print the results and any tracer logs
	if c.json {
		result := struct {
			Output      string              `json:"output"`
			GasUsed     string              `json:"gasused"`
			Time        time.Duration       `json:"time"`
			Error       string              `json:"error,omitempty"`
			Memory      string              `json:"memory,omitempty"`
			Preimages   map[common.Hash]hexutil.Bytes `json:"preimages,omitempty"`
		}{
			Output:  fmt.Sprintf("0x%x", ret),
			GasUsed: fmt.Sprintf("%d", c.gasLimit-gas),
			Time:    evm.Throttler.Total(),
		}
		if err != nil {
			result.Error = err.Error()
		}
		if c.debug {
			result.Memory = fmt.Sprintf("0x%x", evm.Interpreter().Memory().Data())
		}
		if c.preimages {
			result.Preimages = make(map[common.Hash]hexutil.Bytes)
			for hash, preimage := range statedb.Preimages() {
				result.Preimages[hash] = preimage
			}
		}
		out, _ := json.MarshalIndent(result, "", "  ")
		fmt.Println(string(out))
	} else {
		if c.debug {
			// Print the VM trace and returned data
			if tracer, ok := evm.Tracer().(*vm.StructLogger); ok {
				fmt.Fprintln(os.Stderr, "--- TRACE ---")
				vm.WriteTrace(os.Stderr, tracer.StructLogs())
			}
			fmt.Fprintln(os.Stderr, "--- RETURN ---")
			if err != nil {
				fmt.Fprintf(os.Stderr, "REVERT: %v\n", err)
			} else {
				fmt.Fprintf(os.Stderr, "%x\n", ret)
			}
		}
		// Print the consumed gas and the received refund
		fmt.Fprintln(os.Stderr, "--- GAS ---")
		fmt.Fprintf(os.Stderr, "Gas used: %d\n", c.gasLimit-gas)
		fmt.Fprintln(os.Stderr, "--- COST ---")
		cost := new(big.Int).Sub(mstart, mend)
		fmt.Fprintf(os.Stderr, "%v\n", cost)
		if c.debug {
			fmt.Fprintln(os.Stderr, "--- MEMORY ---")
			fmt.Fprintf(os.Stderr, "0x%x\n", evm.Interpreter().Memory().Data())
			fmt.Fprintln(os.Stderr, "--- PREIMAGES ---")
			for hash, preimage := range statedb.Preimages() {
				fmt.Fprintf(os.Stderr, "%x: %x\n", hash, preimage)
			}
		}
		fmt.Fprintln(os.Stderr, "--- DUMP ---")
		statedb.Dump(nil)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/main.go">
```go
package evm

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/params"
	"github.com/urfave/cli/v2"
)

type config struct {
	// Execution options
	code        []byte
	gasLimit    uint64
	gasPrice    *big.Int
	value       *big.Int
	input       []byte
	create      []byte
	debug       bool
	json        bool
	preimages   bool

	// State options
	precompiles map[common.Address][]byte
	stateRoot   common.Hash
	alloc       core.GenesisAlloc

	// Chain options
	origin      common.Address
	sender      common.Address
	receiver    common.Address
	coinbase    common.Address
	blockNumber *big.Int
	timestamp   uint64
	difficulty  *big.Int
	baseFee     *big.Int
	random      common.Hash
}

var runCommand = &cli.Command{
	Action:      runCmd,
	Name:        "run",
	Usage:       "run arbitrary EVM code",
	ArgsUsage:   "<evm_code>",
	Description: `The run command executes the given EVM code in a temporary environment.`,
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  "code",
			Usage: "EVM code",
		},
		&cli.StringFlag{
			Name:  "code-file",
			Usage: "File containing EVM code",
		},
		&cli.Uint64Flag{
			Name:  "gas",
			Usage: "Gas limit for the transaction",
			Value: 1000000000,
		},
		&cli.StringFlag{
			Name:  "price",
			Usage: "Gas price for the transaction",
			Value: "1",
		},
		&cli.StringFlag{
			Name:  "value",
			Usage: "Value for the transaction",
			Value: "0",
		},
		&cli.StringFlag{
			Name:  "input",
			Usage: "Input data for the transaction",
		},
		&cli.BoolFlag{
			Name:  "create",
			Usage: "Create a new contract",
		},
		&cli.BoolFlag{
			Name:  "debug",
			Usage: "Outputs structured logs to the terminal",
		},
		&cli.BoolFlag{
			Name:  "json",
			Usage: "Outputs the trace as JSON",
		},
		&cli.BoolFlag{
			Name:  "preimages",
			Usage: "Outputs the SHA3 preimages",
		},
		&cli.StringFlag{
			Name:  "sender",
			Usage: "The transaction origin",
			Value: "0x0000000000000000000000000000000000000000",
		},
		&cli.StringFlag{
			Name:  "receiver",
			Usage: "The transaction receiver",
			Value: "0x0000000000000000000000000000000000000000",
		},
		&cli.StringFlag{
			Name:  "stateless",
			Usage: "The genesis state root",
		},
		&cli.StringFlag{
			Name:  "alloc",
			Usage: "The genesis block allocation",
		},
		&cli.StringFlag{
			Name:  "genesis",
			Usage: "The genesis block",
		},
		&cli.StringFlag{
			Name:  "chain-id",
			Usage: "The chain id for the transaction",
		},
		&cli.StringFlag{
			Name:  "fork",
			Usage: "The fork rule for the execution",
		},
		&cli.StringFlag{
			Name:  "block-number",
			Usage: "The current block number",
		},
		&cli.StringFlag{
			Name:  "block-time",
			Usage: "The current block time",
		},
		&cli.StringFlag{
			Name:  "difficulty",
			Usage: "The current block difficulty",
		},
		&cli.StringFlag{
			Name:  "base-fee",
			Usage: "The current base fee",
		},
		&cli.StringFlag{
			Name:  "random",
			Usage: "The current random number",
		},
		&cli.StringFlag{
			Name:  "coinbase",
			Usage: "The current block coinbase",
			Value: "0x0000000000000000000000000000000000000000",
		},
	},
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyMessage computes the new state by applying the given message
// against the old state.
func ApplyMessage(evm *vm.EVM, msg *core.Message, gp *core.GasPool) (*core.ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// StateTransition is the main object for executing a state transition.
type StateTransition struct {
	gp         *core.GasPool
	msg        *core.Message
	gas        uint64
	gasPrice   *big.Int
	initialGas uint64
	value      *uint256.Int
	data       []byte
	state      vm.StateDB
	evm        *vm.EVM
}

// NewStateTransition initialises a new state transition object.
func NewStateTransition(evm *vm.EVM, msg *core.Message, gp *core.GasPool) *StateTransition {
	return &StateTransition{
		gp:       gp,
		evm:      evm,
		msg:      msg,
		gasPrice: msg.GasPrice,
		value:    uint256.MustFromBig(msg.Value),
		data:     msg.Data,
		state:    evm.StateDB,
	}
}

// TransitionDb will transition the state by applying the current message and returning the evm execution result
// with the amount of gas used. It does not commit the state, the responsibility is left to the caller.
func (st *StateTransition) TransitionDb() (*core.ExecutionResult, error) {
	// ... (intrinsic gas calculation, pre-checks etc.) ...

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not returned as method errors
	)
	if st.msg.To == nil {
		ret, _, st.gas, vmerr = st.evm.Create(st.msg.From, st.data, st.gas, st.value)
	} else {
		ret, st.gas, vmerr = st.evm.Call(st.msg.From, *st.msg.To, st.data, st.gas, st.value)
	}

	// ... (gas refund logic, etc.) ...

	return &core.ExecutionResult{
		UsedGas:    st.gasUsed(),
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run contracts on the
// Ethereum state transition function.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// TxContext provides the current transaction hash and index for tracing.
	TxContext TxContext
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chain rules
	chainConfig *params.ChainConfig

	// virtual machine configuration options used to initialise the
	// virtual machine.
	vmConfig Config

	// interpreter is the contract interpreter that will be used to
	// execute the byte code.
	interpreter *Interpreter

	// readOnly is the flag indicating whether the state can be modified or not.
	// It's required to forbid the state modification for eth_call and eth_estimateGas.
	readOnly bool

	// returnData is the buffer for the RETURN opcode, holding the last return data.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		TxContext:   txCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		vmConfig:    vmConfig,
	}
	// The interpreter is internal, and can be configured with the top-level
	// EVM config.
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// Call executes the contract associated with the destination address. It is up to the caller to
// decide whether the created contract should be committed to the state with statedb.Commit.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the gas limit
	if gas > evm.Context.GasLimit {
		panic("call gas limit exceeded")
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// snapshot := evm.StateDB.Snapshot() // Don't snapshot anymore, statedb is copied

	// Transfer value from caller to called account
	ok, err := evm.Context.Transfer(evm.StateDB, caller.Address(), addr, value)
	if err != nil {
		return nil, gas, err
	}
	if !ok {
		return nil, gas, ErrInsufficientBalance
	}

	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	p := PrecompiledContracts[addr]
	if p != nil {
		// Only state-modifying precompiles are allowed to be called with a
		// value transfer.
		if value.Sign() != 0 && !p.Stateful() {
			return nil, gas, ErrWriteProtection
		}
		return RunPrecompiledContract(p, input, gas)
	}

	// Try to fetch the code of the given account.
	code := evm.StateDB.GetCode(addr)

	// If the account has no code, terminate immediately.
	// The call is still successful and the gas is consumed.
	if len(code) == 0 {
		return nil, gas, nil
	}
	ret, err = run(evm, caller, addr, input, code, gas, value)
	// if err != nil {
	//  evm.StateDB.RevertToSnapshot(snapshot)
	// }
	return ret, evm.gas, err
}

// Create executes a new contract creation transaction, which takes the
// code as input, executes the code, and ultimately returns the processed
// executable code to be stored at the newly created address.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if evm.readOnly {
		return nil, common.Address{}, gas, ErrWriteProtection
	}
	// Ensure there's enough balance for the endowment
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Increment the nonce of the caller's account
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	// Create a new account on the state
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	if evm.StateDB.GetCodeHash(contractAddr) != types.EmptyCodeHash {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	evm.StateDB.CreateAccount(contractAddr)
	if evm.ChainConfig().IsEIP158(evm.Context.BlockNumber) {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	ok, err := evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)
	if err != nil {
		return nil, common.Address{}, gas, err
	}
	if !ok {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Execute the code. The returned bytes will be the code of the contract.
	ret, err = run(evm, caller, contractAddr, nil, code, gas, value)
	// Check whether the max code size has been exceeded, assign an error and returning 0
	if err == nil && evm.ChainConfig().IsEIP158(evm.Context.BlockNumber) && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the contract creation ran out of gas or errored, fail the whole thing
	if err != nil {
		return nil, contractAddr, evm.gas, err
	}
	// Otherwise code creation was successful, set the code and return
	gasCost := uint64(len(ret)) * params.CreateDataGas
	if evm.gas < gasCost {
		err = ErrCodeStoreOutOfGas
		return nil, contractAddr, evm.gas, err
	}
	evm.gas -= gasCost
	evm.StateDB.SetCode(contractAddr, ret)

	return ret, contractAddr, evm.gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a native Go tracer which pumps out structured log messages for
// every step of the EVM execution. It can be used to stream the events to a
// file, or to display them on the console.
type StructLogger struct {
	cfg     Config
	logs    []StructLog
	storage map[common.Hash]common.Hash
	gas     uint64
	err     error

	callstack []callFrame
	rlp       *bytes.Buffer
}

// StructLog is a structured log message captures by the EVM tracer.
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            vm.OpCode          `json:"op"`
	Gas           uint64             `json://:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        []byte             `json:"memory,omitempty"`
	MemorySize    int                `json:"memSize"`
	Stack         []*big.Int         `json:"stack,omitempty"`
	ReturnData    []byte             `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           error              `json:"err,omitempty"`
	OpName        string             `json:"opName"`
	ErrorString   string             `json:"error,omitempty"`
}

// CaptureState is called for each step of the EVM Interpreter.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// Skip if tracing was interrupted
	if err != nil && err == errTraceLimitReached {
		return
	}
	// Memory snapshot
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// Stack snapshot
	var stack []*big.Int
	if l.cfg.EnableStack {
		stack = make([]*big.Int, len(scope.Stack.Data()))
		for i, value := range scope.Stack.Data() {
			stack[i] = new(big.Int).Set(value.ToBig())
		}
	}
	// Storage snapshot
	var storage map[common.Hash]common.Hash
	if l.cfg.EnableStorage {
		storage = l.storage
		l.storage = make(map[common.Hash]common.Hash)
	}
	// Assemble the log object and injector into the tracer
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    rData,
		Storage:       storage,
		Depth:         depth,
		RefundCounter: scope.StateDB.GetRefund(),
		Err:           err,
		OpName:        op.String(),
	}
	if err != nil {
		log.ErrorString = err.Error()
	}
	l.logs = append(l.logs, log)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/disasm.go">
```go
package evm

import (
	"fmt"
	"io"
	"os"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/vm"
)

// The Disasm command disassembles compiled EVM code.
var disasmCommand = &cli.Command{
	Action:      disasmCmd,
	Name:        "disasm",
	Usage:       "disassembles EVM code",
	ArgsUsage:   "<input_file>",
	Description: `The disasm command dissasembles EVM code.`,
}

func disasmCmd(ctx *cli.Context) error {
	var (
		err  error
		code []byte
	)
	if args := ctx.Args().Slice(); len(args) > 0 {
		code, err = os.ReadFile(args[0])
		if err != nil {
			return fmt.Errorf("could not read file: %v", err)
		}
	} else {
		code, err = io.ReadAll(os.Stdin)
		if err != nil {
			return fmt.Errorf("could not read from stdin: %v", err)
		}
	}
	return disasm(code, os.Stdout)
}

func disasm(code []byte, out io.Writer) error {
	var (
		opCounter  = make(map[vm.OpCode]int)
		jumpdests  = make(map[uint64]struct{})
		codeString = string(code)
	)

	// first pass, identify all JUMPDESTs
	it := vm.NewInstructionIterator(code)
	for it.Next() {
		if it.Op() == vm.JUMPDEST {
			jumpdests[it.PC()] = struct{}{}
		}
	}

	it = vm.NewInstructionIterator(code)
	for it.Next() {
		opCounter[it.Op()]++
		if it.Op() == vm.JUMPDEST {
			fmt.Fprintf(out, "label-%d:\n", it.PC())
		}
		if it.Arg() != nil {
			if it.Op().IsPush() {
				if _, ok := jumpdests[it.ArgBig().Uint64()]; ok {
					fmt.Fprintf(out, "\t%v label-%v\n", it.Op(), it.ArgBig())
				} else {
					fmt.Fprintf(out, "\t%v 0x%v\n", it.Op(), it.ArgBig().Text(16))
				}
			} else {
				fmt.Fprintf(out, "\t%v %v\n", it.Op(), hexutil.Encode(it.Arg()))
			}
		} else {
			fmt.Fprintf(out, "\t%v\n", it.Op())
		}
	}

	if err := it.Error(); err != nil {
		fmt.Fprintf(os.Stderr, "ERROR: %v\n", err)
	}

	if len(opCounter) > 0 {
		fmt.Fprintln(out, "\nOpcode usage:")
		for i := 0; i < 256; i++ {
			op := vm.OpCode(i)
			if c := opCounter[op]; c > 0 {
				fmt.Fprintf(out, "\t%v: %d\n", op, c)
			}
		}
	}

	fmt.Fprintln(out, "\nRaw output:")
	fmt.Fprintf(out, "%x\n", codeString)
	return nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/tests/state_test_util.go">
```go
// StateTest checks transaction processing without block context.
type StateTest struct {
	json stJSON
}

type stJSON struct {
	Env  stEnv                    `json:"env"`
	Pre  types.GenesisAlloc       `json:"pre"`
	Tx   stTransaction            `json:"transaction"`
	Out  hexutil.Bytes            `json:"out"`
	Post map[string][]stPostState `json:"post"`
}

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

// Run executes a specific subtest and verifies the post-state and logs
func (t *StateTest) Run(subtest StateSubtest, vmconfig vm.Config, snapshotter bool, scheme string, postCheck func(err error, st *StateTestState)) (result error) {
	st, root, _, err := t.RunNoVerify(subtest, vmconfig, snapshotter, scheme)
	// ... (error checking and post-state verification logic) ...
	return nil
}

// RunNoVerify runs a specific subtest and returns the statedb and post-state root.
func (t *StateTest) RunNoVerify(subtest StateSubtest, vmconfig vm.Config, snapshotter bool, scheme string) (st StateTestState, root common.Hash, gasUsed uint64, err error) {
	config, eips, err := GetChainConfig(subtest.Fork)
	// ...
	vmconfig.ExtraEips = eips

	block := t.genesis(config).ToBlock()
	st = MakePreState(rawdb.NewMemoryDatabase(), t.json.Pre, snapshotter, scheme)
	
	// ... (baseFee calculation) ...

	msg, err := t.json.Tx.toMessage(post, baseFee)
	// ...

	// Prepare the EVM.
	context := core.NewEVMBlockContext(block.Header(), &dummyChain{config: config}, &t.json.Env.Coinbase)
	context.GetHash = vmTestBlockHash
	context.BaseFee = baseFee
	// ...
	
	evm := vm.NewEVM(context, st.StateDB, config, vmconfig)

	// ...
	// Execute the message.
	snapshot := st.StateDB.Snapshot()
	gaspool := new(core.GasPool)
	gaspool.AddGas(block.GasLimit())
	vmRet, err := core.ApplyMessage(evm, msg, gaspool)
	if err != nil {
		st.StateDB.RevertToSnapshot(snapshot)
		// ...
		return st, common.Hash{}, 0, err
	}
	
	// Commit state mutations into database.
	root, _ = st.StateDB.Commit(block.NumberU64(), config.IsEIP158(block.Number()), config.IsCancun(block.Number(), block.Time()))
	// ...
	return st, root, vmRet.UsedGas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/flags/flags.go">
```go
// Package flags provides helper functions for urfave/cli.
package flags

import (
	"flag"
	"fmt"
	"math/big"
	"os"
	"os/user"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/ethereum/go-ethereum/common/math"
	"github.com/urfave/cli/v2"
)

// DirectoryString is custom type which is registered in the flags library which cli uses for
// argument parsing. This allows us to expand Value to an absolute path when
// the argument is parsed
type DirectoryString string

func (s *DirectoryString) String() string {
	return string(*s)
}

func (s *DirectoryString) Set(value string) error {
	*s = DirectoryString(expandPath(value))
	return nil
}

// BigFlag is a command line flag that accepts 256 bit big integers in decimal or
// hexadecimal syntax.
type BigFlag struct {
	Name string

	Category    string
	DefaultText string
	Usage       string

	Required   bool
	Hidden     bool
	HasBeenSet bool

	Value        *big.Int
	defaultValue *big.Int

	Aliases []string
	EnvVars []string
}

// bigValue turns *big.Int into a flag.Value
type bigValue big.Int

func (b *bigValue) String() string {
	if b == nil {
		return ""
	}
	return (*big.Int)(b).String()
}

func (b *bigValue) Set(s string) error {
	intVal, ok := math.ParseBig256(s)
	if !ok {
		return errors.New("invalid integer syntax")
	}
	*b = (bigValue)(*intVal)
	return nil
}

// Expands a file path
// 1. replace tilde with users home dir
// 2. expands embedded environment variables
// 3. cleans the path, e.g. /a/b/../c -> /a/c
// Note, it has limitations, e.g. ~someuser/tmp will not be expanded
func expandPath(p string) string {
	if strings.HasPrefix(p, "~/") || strings.HasPrefix(p, "~\\") {
		if home := HomeDir(); home != "" {
			p = home + p[1:]
		}
	}
	return filepath.Clean(os.ExpandEnv(p))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
package params

const (
	// These are the multipliers for the transaction gas costs.
	// See https://github.com/ethereum/yellowpaper/blob/8951f274a7b7e6113c834a36f236b158097d627c/Paper.pdf, appendix G
	TxGas          uint64 = 21000 // Per transaction.
	TxGasContractCreation uint64 = 53000 // Per transaction that creates a contract.
)
```
</file>
</go-ethereum>
## Prompt Corrections
The prompt provides an excellent and detailed specification for a suite of EVM command-line tools. The design is comprehensive and covers the essential functionalities needed for EVM development and testing. I have one minor correction regarding the `execute_transaction` function in the `EvmExecutor` struct.

### Correction for `EvmExecutor.execute_transaction`

The provided `execute_transaction` implementation has a potential ambiguity in its contract creation logic:
```zig
// Original snippet from the prompt
vm.execute_create(tx.from, tx.value, tx.data, tx.gas_limit);
```

In the EVM, when a transaction creates a contract (i.e., the `to` address is null), the `data` field of the transaction serves as the **initialization code** (initcode). This initcode is executed, and its *return value* becomes the bytecode of the newly created contract. There is no separate "calldata" for a creation transaction.

The Geth implementation in `core/state_transition.go` demonstrates this:
```go
// go-ethereum/core/state_transition.go
func (st *StateTransition) TransitionDb() (*core.ExecutionResult, error) {
	// ...
	if st.msg.To == nil {
		ret, _, st.gas, vmerr = st.evm.Create(st.msg.From, st.data, st.gas, st.value)
	} else {
		// ...
	}
	// ...
}
```
Here, `st.data` (from the transaction's data field) is passed directly as the initcode to `evm.Create`.

**Recommendation:**

The function signature in the prompt is correct, but ensure the implementation of `vm.execute_create` uses the `data` parameter as the initcode to be executed, and not as calldata for an empty contract. The current structure implies this is handled correctly within `vm.execute_create`, so this is more of a clarification for the implementation phase rather than a required change to the provided Zig code.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/geth/evm.go">
```go
package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rpc"
)

// [...]

var evmCmd = &cli.Command{
	Name:      "evm",
	Usage:     "Executes EVM code",
	ArgsUsage: "<hex-code>",
	// [...]
	Subcommands: []*cli.Command{
		disasmCmd,
	},
	Flags: []cli.Flag{
		utils.CodeFlag,
		utils.GasFlag,
		utils.PriceFlag,
		utils.ValueFlag,
		utils.InputFlag,
		utils.SenderFlag,
		utils.ReceiverFlag,
		utils.NonceFlag,
		utils.CreateFlag,
		utils.GenesisFlag,
		utils.StateRootFlag,
		utils.VerbosityFlag,
		utils.DumpFlag,
		utils.StatelessFlag,
		utils.MachineFlag,
	},
	Action: runEVMCmd,
}

var disasmCmd = &cli.Command{
	Action:    disasm,
	Name:      "disasm",
	Usage:     "Disassembles EVM code",
	ArgsUsage: "<hex-code>",
}

func disasm(ctx *cli.Context) error {
	var code []byte
	if codeFile := ctx.String("codefile"); codeFile != "" {
		var err error
		code, err = os.ReadFile(codeFile)
		if err != nil {
			return fmt.Errorf("can't read code file: %w", err)
		}
	} else {
		var err error
		code, err = hexutil.Decode(ctx.Args().First())
		if err != nil {
			return fmt.Errorf("argument must be hex-encoded code: %w", err)
		}
	}
	// TODO: support multiple hard forks
	evm.Disassemble(code)
	return nil
}

// runEVMCmd is the command line entry point for running EVM
// simulations.
func runEVMCmd(ctx *cli.Context) error {
	// [...]
	var (
		chainConfig *params.ChainConfig
		err         error
	)
	// [...]
	// Set up the VM context.
	var (
		statedb *state.StateDB
		gaspool = new(core.GasPool)
	)

	statedb, err = state.New(root, db, nil)
	if err != nil {
		utils.Fatalf("Could not create new state: %v", err)
	}

	// [...]

	// Create the EVM
	evm, vmError, resultData := runEVM(statedb, sender, receiver, input, value, gas, gasPrice, nonce, chainConfig, evmConfig)
	// [...]

	// Print the results.
	if ctx.Bool("json") {
		result := struct {
			Result      string              `json:"result,omitempty"`
			GasUsed     uint64              `json:"gas_used,omitempty"`
			GasLeft     uint64              `json:"gas_left,omitempty"`
			Error       string              `json:"error,omitempty"`
			Logs        []*vm.StructLog     `json:"logs,omitempty"`
			Output      string              `json:"output,omitempty"`
			Time        string              `json:"time,omitempty"`
			TimeTotal   string              `json:"time_total,omitempty"`
			Memory      map[string]string   `json:"memory,omitempty"`
			Storage     map[string]string   `json:"storage,omitempty"`
			ReturnData  map[string][]string `json:"returnData,omitempty"`
			Depth       int                 `json:"depth,omitempty"`
			Snapshot    map[string][]string `json:"snapshot,omitempty"`
			Reverted    bool                `json:"reverted"`
			Addr        common.Address      `json:"address,omitempty"`
			Code        string              `json:"code,omitempty"`
			Halted      bool                `json:"halted"`
			EVMError    string              `json:"evmError"`
			Return      string              `json:"return"`
			Gas         string              `json:"gas"`
			Elapsed     time.Duration       `json:"elapsed"`
			GasRefunded uint64              `json:"gasRefunded"`
			HaltErr     string              `json:"haltError"`
			Err         string              `json:"err"`
			ErrFmt      string              `json:"errFmt"`
		}{
			EVMError:    evm.Err.Error(),
			GasLeft:     evm.Gas(),
			Return:      fmt.Sprintf("%x", evm.ReturnData),
			Gas:         fmt.Sprintf("%d", evm.gas),
			Elapsed:     evm.Config.Tracer.(*vm.Tracer).GetTime(),
			GasRefunded: evm.StateDB.GetRefund(),
		}
		if vmError != nil {
			result.HaltErr = vmError.Error()
		}
		result.Halted = vmError != nil

		if len(resultData) > 0 {
			result.Result = fmt.Sprintf("0x%x", resultData)
		}
		if evm.Context.IsCreate {
			result.Addr = crypto.CreateAddress(evm.Context.Address, evm.Context.Nonce)
		}
		result.GasUsed = gas - evm.Gas()

		if log, ok := evm.Config.Tracer.(*vm.StructLogger); ok {
			result.Logs = log.StructLogs()
		}

		out, _ := json.MarshalIndent(result, "", "  ")
		fmt.Println(string(out))
		return nil
	}
	// [...]
}

// runEVM is the main entry point for the EVM execution.
func runEVM(statedb *state.StateDB, sender, receiver common.Address, input []byte, value *big.Int, gas uint64, gasPrice *big.Int, nonce uint64, chainConfig *params.ChainConfig, evmConfig vm.Config) (*vm.EVM, error, []byte) {
	// Ensure the sender has enough balance for value transfer.
	if balance := statedb.GetBalance(sender); balance.Cmp(value) < 0 {
		return nil, nil, fmt.Errorf("sender doesn't have enough funds to send %v. Has %v", value, balance).Bytes()
	}
	statedb.SetNonce(sender, nonce)

	var (
		vmenv       = vm.NewEVM(vm.BlockContext{}, vm.TxContext{GasPrice: gasPrice, Origin: sender}, statedb, chainConfig, evmConfig)
		gaspool     = new(core.GasPool).AddGas(gas)
		ret, left  []byte
		vmerr      error
		resultData []byte
	)
	if evmConfig.Create {
		ret, _, left, vmerr = vmenv.Create(vm.AccountRef(sender), input, gas, value)
	} else {
		ret, left, vmerr = vmenv.Call(vm.AccountRef(sender), receiver, input, gas, value)
	}
	resultData = ret
	if vmerr != nil {
		return vmenv, vmerr, resultData
	}
	gaspool.SubGas(gas - vmenv.Gas())
	return vmenv, nil, resultData
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
package vm

import (
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

// [...]

// StructLogger is a EVM state logger and captures structured logs of the same format
// as the debug_traceTransaction API method.
//
// Note, this logger is not thread safe.
type StructLogger struct {
	cfg Config

	storage map[common.Address]map[common.Hash]common.Hash
	logs    []StructLog
	err     error

	start      time.Time
	statedb    StateDB
	gas        uint64
	refund     uint64
	depth      int
	lastOpTime time.Time
}

// NewStructLogger returns a new logger that is used for structured logging.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		storage: make(map[common.Address]map[common.Hash]common.Hash),
	}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

// CaptureStart is called when the EVM starts executing a new transaction or a call.
func (l *StructLogger) CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.start = time.Now()
	l.statedb = evm.StateDB
	l.refund = evm.StateDB.GetRefund()
	l.depth = evm.depth
	l.lastOpTime = l.start
}

// CaptureState is called before each instruction is executed.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *Scope, rData []byte, depth int, err error) {
	// Skip if tracing was interrupted
	if l.err != nil {
		return
	}
	// Memory snapshot
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// Stack snapshot
	var stack []*big.Int
	if l.cfg.EnableStack {
		stack = make([]*big.Int, len(scope.Stack.Data()))
		for i, value := range scope.Stack.Data() {
			stack[i] = new(big.Int).Set(value)
		}
	}
	// Storage snapshot
	var storage map[common.Hash]common.Hash
	if l.cfg.EnableStorage {
		// Only create a new map if the address is different
		if l.storage[scope.Contract.Address()] == nil {
			l.storage[scope.Contract.Address()] = make(map[common.Hash]common.Hash)
		}
		// We can't just copy the returned map because it's a reference, and the next log might modify it
		l.statedb.ForEachStorage(scope.Contract.Address(), func(key, value common.Hash) bool {
			l.storage[scope.Contract.Address()][key] = value
			return true
		})
		storage = l.storage[scope.Contract.Address()]
	}
	// Add a new log to the tracer
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    rData,
		Storage:       storage,
		Depth:         depth,
		RefundCounter: l.statedb.GetRefund(),
		Err:           err,
	}
	l.logs = append(l.logs, log)
}

// CaptureFault is called when an error occurs during the execution of an instruction.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *Scope, depth int, err error) {
	l.CaptureState(pc, op, gas, cost, scope, nil, depth, err)
}

// CaptureEnd is called when the EVM finishes executing a transaction or a call.
func (l *StructLogger) CaptureEnd(output []byte, gasUsed uint64, err error) {
	l.err = err // Any error encountered during execution will invalidate the traces
}

// [...]

// StructLog is emitted to the EVM tracer on each step of the execution.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            OpCode                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack"`
	ReturnData    []byte                      `json:"returnData"`
	Storage       map[common.Hash]common.Hash `json:"storage"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

// [...]

// MarshalJSON marshals as JSON.
func (s *StructLog) MarshalJSON() ([]byte, error) {
	// [...]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
package vm

import (
	"fmt"
	"math/big"
)

// OpCode is a EVM opcode
type OpCode byte

// [...] various opcode definitions

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

// [...] more opcodes

// opCodeToString contains the name of each opcode.
var opCodeToString = [256]string{
	STOP:       "STOP",
	ADD:        "ADD",
	MUL:        "MUL",
	SUB:        "SUB",
	DIV:        "DIV",
	SDIV:       "SDIV",
	MOD:        "MOD",
	SMOD:       "SMOD",
	ADDMOD:     "ADDMOD",
	MULMOD:     "MULMOD",
	EXP:        "EXP",
	SIGNEXTEND: "SIGNEXTEND",
	// [...]
}

// String returns the string representation of the opcode
func (op OpCode) String() string {
	return opCodeToString[op]
}

// IsPush returns whether the opcode is a PUSHn.
func (op OpCode) IsPush() bool {
	return op >= PUSH1 && op <= PUSH32
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm_test.go">
```go
package vm

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/consensus/ethash"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
)

func BenchmarkEVM_fibonacci(b *testing.B) {
	// This benchmark runs the fibonacci contract from the whisper-contract-demos
	// repository: https://github.com/whisper-system-private/whisper-contract-demos/blob/master/fib.sol
	/*
		contract Fibonacci {
		    function fib(uint n) constant returns (uint) {
		        if (n < 2) {
		            return 1;
		        } else {
		            return fib(n-1) + fib(n-2);
		        }
		    }
		}
	*/
	// This contract has been compiled with solc --asm --bin
	var (
		code     = common.Hex2Bytes("60606040525b60008060026000350463212624a68114601a575b005b60216000556000600055600c6000546001016001555b5b60708060376000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063212624a6146039575b6002600435101560345760016000555b5b604b565b6060908152600090815260209020546001016001555b565b6000600160008282540160000181548110606657fe5b906000526020600020906002020160005b50600060016000600184540154600260008282540160000181548110609e57fe5b906000526020600020906002020160005b5060000154905091905056")
		gas      = uint64(1000000)
		db       = rawdb.NewMemoryDatabase()
		gspec    = new(core.Genesis).MustCommit(db)
		statedb, _ = state.New(gspec.Root, state.NewDatabase(db), nil)

		fromaddr = common.Address{1}
		toaddr   = common.Address{2}

		config = params.TestChainConfig
		engine = ethash.NewFaker()
		header = core.MakeHeader(&types.Header{GasLimit: 10000000}, nil)
		ctx    = core.NewEVMBlockContext(header, nil, engine)
		txctx  = core.NewEVMTxContext(core.NewTestTx(fromaddr, toaddr, 0, gas, nil, nil))
		evm    = NewEVM(ctx, txctx, statedb, config, Config{})
	)
	statedb.CreateAccount(fromaddr)
	statedb.CreateAccount(toaddr)

	_, _, err := evm.Call(AccountRef(fromaddr), toaddr, code, gas, big.NewInt(0))
	if err != nil {
		b.Fatalf("failed to create contract: %v", err)
	}

	b.ReportAllocs()
	b.ResetTimer()

	// "fib(10)"
	data := common.Hex2Bytes("212624a6000000000000000000000000000000000000000000000000000000000000000a")
	for i := 0; i < b.N; i++ {
		// clear snapshot and state so we don't snapshot the same state
		// over and over again.
		statedb.Snapshot()

		_, _, err := evm.Call(AccountRef(fromaddr), toaddr, data, gas, big.NewInt(0))
		if err != nil {
			b.Fatal(err)
		}

		statedb.RevertToSnapshot(0)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/utils/flags.go">
```go
package utils

import (
	"crypto/ecdsa"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/urfave/cli/v2"
)

// [...]

var (
	// [...]
	GasFlag = &cli.Uint64Flag{
		Name:  "gas",
		Usage: "Gas limit for the transaction",
		Value: 25000000,
	}
	PriceFlag = &cli.StringFlag{
		Name:  "price",
		Usage: "Gas price in wei for the transaction",
		Value: "0",
	}
	ValueFlag = &cli.StringFlag{
		Name:  "value",
		Usage: "Value in wei to send with the transaction",
		Value: "0",
	}
	// [...]
	NonceFlag = &cli.Uint64Flag{
		Name:  "nonce",
		Usage: "Nonce of the transaction",
		Value: 0,
	}
	// [...]
	DebugFlag = &cli.BoolFlag{
		Name:  "debug",
		Usage: "output full trace logs",
	}
	// [...]
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/geth/main.go">
```go
package main

import (
	"fmt"
	"os"
	"runtime"
	"strings"

	"github.com/ethereum/go-ethereum/internal/debug"
	"github.com/ethereum/go-ethereum/log"
	"github.com/urfave/cli/v2"
)

var app = utils.NewApp(gitCommit, gitDate, "the official command-line interface for Ethereum")

func init() {
	// Initialize the CLI app and start Geth
	app.Action = geth
	app.Copyright = "Copyright 2013-2024 The go-ethereum Authors"
	app.Commands = []*cli.Command{
		// See chaincmd.go:
		initCommand,
		importCommand,
		exportCommand,
		importPreimagesCommand,
		exportPreimagesCommand,
		copydbCommand,
		removedbCommand,
		dumpCommand,
		dumpGenesisCommand,
		// See accountcmd.go:
		accountCommand,
		walletCommand,
		// See consolecmd.go:
		consoleCommand,
		attachCommand,
		javascriptCommand,
		// See misccmd.go:
		makeCacheCommand,
		makeDAGCommand,
		versionCommand,
		bugCommand,
		licenseCommand,
		// See config.go
		dumpConfigCommand,
		// See dbcmd.go
		dbCommand,
		// See snapshot.go
		snapshotCommand,
		// See verkle.go
		verkleCommand,
		// See evm.go
		evmCmd,
	}
	sort.Sort(cli.CommandsByName(app.Commands))

	app.Flags = append(app.Flags, nodeFlags...)
	app.Flags = append(app.Flags, rpcFlags...)
	app.Flags = append(app.Flags, whisperFlags...)
	app.Flags = append(app.Flags, metricsFlags...)

	app.Before = func(ctx *cli.Context) error {
		// [...]
	}

	app.After = func(ctx *cli.Context) error {
		// [...]
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
package state

import (
	"fmt"
	"math/big"
	"sort"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/metrics"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
)

// StateDB is an EVM database for full state querying.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which are committed to the trie at the end of
	// the transaction. State objects are copied on first access and any change
	// writes to the copy. Further accesses will get the copy.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the stateObjects map.
	// When the query of state objects fails, this error will be set and not nil.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// setting up framework for testing returning snapshots and creating
	// bigger scale testing frameworks that can also be used to check
	// correctness of transaction execution.
	journal        *journal
	validRevisions []revision
	nextRevisionId int
}

// [...]

// GetBalance retrieves the balance from the given address or 0 if object not found
func (s *StateDB) GetBalance(addr common.Address) *big.Int {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Balance()
	}
	return common.Big0
}

// GetNonce retrieves the nonce from the given address or 0 if object not found
func (s *StateDB) GetNonce(addr common.Address) uint64 {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Nonce()
	}
	return 0
}

// GetCode retrieves the code from the given address or nil if object not found
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// GetCodeSize retrieves the code size from the given address or 0 if object not found
func (s *StateDB) GetCodeSize(addr common.Address) int {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return 0
	}
	if stateObject.code != nil {
		return len(stateObject.code)
	}
	size, err := s.db.ContractCodeSize(stateObject.addrHash, common.BytesToHash(stateObject.CodeHash()))
	if err != nil {
		s.setError(err)
	}
	return size
}

// GetCodeHash retrieves the code hash from the given address or nil if object not found
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return common.Hash{}
	}
	return common.BytesToHash(stateObject.CodeHash())
}

// GetState retrieves a value from the given address' storage.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(s.db, hash)
	}
	return common.Hash{}
}

// [...]

// ForEachStorage iterates over the storage of an account.
func (s *StateDB) ForEachStorage(addr common.Address, cb func(key, value common.Hash) bool) error {
	so := s.getStateObject(addr)
	if so == nil {
		return nil
	}
	it := trie.NewIterator(so.getTrie(s.db).NodeIterator(nil))
	for it.Next() {
		key := common.BytesToHash(s.trie.GetKey(it.Key))
		if len(it.Value) > 0 {
			_, content, _, err := rlp.Split(it.Value)
			if err != nil {
				return err
			}
			if !cb(key, common.BytesToHash(content)) {
				return nil
			}
		}
	}
	return nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is excellent and very detailed. The Zig code provides a clear specification for the required tools. The following are not corrections but rather suggestions for refinement based on the Go-Ethereum implementation:

1.  **`EvmExecutor` - Tracing**: In your `TraceStep` struct, consider adding more context that Geth's `StructLogger` provides, which can be invaluable for debugging:
    *   `error: ?anyerror` to capture opcode-level errors.
    *   `memory_size: u64` to track memory expansion costs.
    *   `output: []u8` for capturing the return data of operations like `CALL`.
    *   A field for the call/create depth.

2.  **`EvmExecutor` - Configuration**: The `ExecutorConfig` is good. Geth's `vm.Config` also includes options to disable specific EIPs (e.g., `DisableEIP3860: true`). While not strictly necessary for a basic executor, this level of granularity is useful for advanced testing and historical transaction simulation.

3.  **`StateInspector` - State Representation**: The prompt's design implies a flat key-value store for state. While the `StateDB` interface in Geth abstracts this, it's worth noting that the underlying structure is a Merkle Patricia Trie. This has performance implications for operations like iterating over all accounts or storage slots, which your implementation of `get_state_summary` will need to handle efficiently. The `ForEachStorage` method in Geth's `StateDB` is the correct pattern for this.

4.  **`BytecodeAnalyzer` - Gas Analysis**: Your `GasAnalysis` struct is a great start. Geth's `disasm` doesn't do this level of analysis, but for a complete tool, you could also analyze:
    *   **Basic Block Costs**: Statically calculate the gas cost of code blocks between jump instructions. This is more complex but provides a more accurate minimum gas cost than just summing static opcode costs.
    *   **Dynamic Opcode Costs**: Note which opcodes have dynamic gas costs that can't be determined statically (e.g., `CALL`, `SSTORE`, `LOG`).

5.  **CLI Argument Parsing**: Geth uses the `urfave/cli` library (formerly `codegangsta/cli`) to structure its command-line tools. The way it defines commands, subcommands, and flags (as seen in `cmd/geth/main.go` and `cmd/utils/flags.go`) is a battle-tested pattern that could serve as inspiration for structuring your Zig CLI parser. It cleanly separates the definition of the CLI from the action handlers.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/main.go">
```go
package main

import (
	"fmt"
	"os"
	"sort"

	"github.com/ethereum/go-ethereum/log"
	"github.com/urfave/cli/v2"
)

var app = cli.NewApp()

func init() {
	app.Name = "evm"
	app.Usage = "the evm command is a developer utility"
	app.Commands = []*cli.Command{
		runCmd,
		stateTestCmd,
		blockTestCmd,
		disasmCmd,
		benchCmd,
		statedbCmpCmd,
		rlpCmd,
	}
	app.Flags = []cli.Flag{
		debugFlag,
		verbosityFlag,
	}
	sort.Sort(cli.CommandsByName(app.Commands))
}

var (
	debugFlag = &cli.BoolFlag{
		Name:  "debug",
		Usage: "output full trace logs",
	}
	verbosityFlag = &cli.IntFlag{
		Name:  "verbosity",
		Usage: "sets the verbosity level",
	}
)

func main() {
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/run.go">
```go
package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/eth/tracers/logger"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/triedb"
	"github.com/urfave/cli/v2"
)

var runCmd = &cli.Command{
	Action:      run,
	Name:        "run",
	Usage:       "run arbitrary EVM code",
	ArgsUsage:   "<evm_code>",
	Description: `The run command runs arbitrary EVM code.`,
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  "sender",
			Usage: "sender address",
		},
		&cli.StringFlag{
			Name:  "receiver",
			Usage: "receiver address (defaults to contract address)",
		},
		&cli.StringFlag{
			Name:  "input",
			Usage: "input data",
		},
		&cli.StringFlag{
			Name:  "value",
			Value: "0",
			Usage: "value in ether",
		},
		&cli.Uint64Flag{
			Name:  "gas",
			Value: 10000000,
			Usage: "gas limit",
		},
		&cli.StringFlag{
			Name:  "price",
			Value: "0",
			Usage: "gas price in wei",
		},
		&cli.StringFlag{
			Name:  "state.root",
			Usage: "root of the state trie",
		},
		&cli.Uint64Flag{
			Name:  "block.number",
			Usage: "block number",
		},
		&cli.StringFlag{
			Name:  "block.coinbase",
			Usage: "coinbase address",
		},
		&cli.StringFlag{
			Name:  "block.difficulty",
			Usage: "block difficulty",
		},
		&cli.Int64Flag{
			Name:  "block.gaslimit",
			Value: 10000000000,
			Usage: "block gas limit",
		},
		&cli.StringFlag{
			Name:  "block.timestamp",
			Usage: "block timestamp",
		},
		&cli.StringFlag{
			Name:  "block.hash",
			Usage: "block hash",
		},
		&cli.StringFlag{
			Name:  "tx.origin",
			Usage: "transaction origin",
		},
		&cli.BoolFlag{
			Name:  "create",
			Usage: "create contract",
		},
		&cli.StringFlag{
			Name:  "chain",
			Value: "mainnet",
			Usage: "chain",
		},
		&cli.StringFlag{
			Name:  "db",
			Usage: "path to state database",
		},
		&cli.StringFlag{
			Name:  "stateless",
			Usage: "a json file containing the accounts to be touched",
		},
		&cli.BoolFlag{
			Name:  "json",
			Usage: "output trace logs in JSON format",
		},
	},
}

func run(ctx *cli.Context) error {
	var (
		tracer  vm.EVMLogger
		debug   = ctx.Bool("debug")
		code    = common.FromHex(ctx.Args().First())
		input   = common.FromHex(ctx.String("input"))
		chainid *big.Int
	)
	//...
	if debug {
		if ctx.Bool("json") {
			tracer = logger.NewJSONLogger(&logger.Config{
				EnableMemory:     true,
				EnableReturnData: true,
			}, os.Stdout)
		} else {
			tracer = logger.NewStructLogger(&logger.Config{
				EnableMemory:     true,
				EnableReturnData: true,
			})
		}
	}
	ret, stateroot, err := runCode(cfg, snapshot, code, input, origin)
	//...
}

func runCode(cfg *vm.Config, snapshot *state.StateDB, code, input []byte, origin common.Address) (ret []byte, postState common.Hash, err error) {
	//...
	statedb, err := state.New(cfg.StateRoot, state.NewDatabase(triedb.NewDatabase(rawdb.NewMemoryDatabase(), nil)), nil)
	//...
	addr := common.BytesToAddress(crypto.Keccak256(code)[:20])
	if cfg.Create {
		statedb.CreateAccount(addr)
		statedb.SetCode(addr, code)
	}

	evm := vm.NewEVM(cfg.BlockCtx, cfg.TxCtx, statedb, cfg.ChainConfig, *cfg.EVMConfig)

	var (
		retData []byte
		leftGas = cfg.GasLimit
		reason  error
	)
	if cfg.Create {
		retData, _, leftGas, reason = evm.Create(vm.AccountRef(origin), code, cfg.GasLimit, cfg.Value)
	} else {
		retData, leftGas, reason = evm.Call(vm.AccountRef(origin), addr, input, cfg.GasLimit, cfg.Value)
	}

	if reason != nil {
		fmt.Printf("EVN returned an error: %v\n", reason)
	}
	fmt.Printf("0x%x\n", retData)

	if reason == nil {
		fmt.Println("gas left", leftGas)
	}

	// Dump the state now, after the execution.
	fmt.Println("post-state root", statedb.IntermediateRoot(cfg.ChainConfig.IsEIP158(cfg.BlockCtx.BlockNumber)))

	return retData, statedb.IntermediateRoot(cfg.ChainConfig.IsEIP158(cfg.BlockCtx.BlockNumber)), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
package logger

import (
	// ...
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/holiman/uint256"
)

// StructLog is emitted to the EVM each cycle and lists information about the
// current internal state prior to the execution of the statement.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []uint256.Int               `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

// StructLogger is an EVM state logger and implements EVMLogger.
//
// StructLogger can capture state based on the given Log configuration and also keeps
// a track record of modified storage which is used in reporting snapshots of the
// contract their storage.
//
// A StructLogger can either yield it's output immediately (streaming) or store for
// later output.
type StructLogger struct {
	cfg Config
	env *tracing.VMContext

	storage map[common.Address]Storage
	output  []byte
	err     error
	usedGas uint64

	writer     io.Writer         // If set, the logger will stream instead of store logs
	logs       []json.RawMessage // buffer of json-encoded logs
	resultSize int

	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
	skip      bool        // skip processing hooks.
}


// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// If tracing was interrupted, exit
	if l.interrupt.Load() {
		return
	}
	// ...
	var (
		op           = vm.OpCode(opcode)
		memory       = scope.MemoryData()
		contractAddr = scope.Address()
		stack        = scope.StackData()
		stackLen     = len(stack)
	)
	log := StructLog{pc, op, gas, cost, nil, len(memory), nil, nil, nil, depth, l.env.StateDB.GetRefund(), err}
	if l.cfg.EnableMemory {
		log.Memory = memory
	}
	if !l.cfg.DisableStack {
		log.Stack = scope.StackData()
	}
	if l.cfg.EnableReturnData {
		log.ReturnData = rData
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/api_debug.go">
```go
package eth

import (
	// ...
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/ethereum/go-ethereum/trie"
)

// AccountRangeMaxResults is the maximum number of results to be returned per call
const AccountRangeMaxResults = 256

// AccountRange enumerates all accounts in the given block and start point in paging request
func (api *DebugAPI) AccountRange(blockNrOrHash rpc.BlockNumberOrHash, start hexutil.Bytes, maxResults int, nocode, nostorage, incompletes bool) (state.Dump, error) {
	var stateDb *state.StateDB
	var err error
	// ... code to get stateDb ...

	opts := &state.DumpConfig{
		SkipCode:          nocode,
		SkipStorage:       nostorage,
		OnlyWithAddresses: !incompletes,
		Start:             start,
		Max:               uint64(maxResults),
	}
	if maxResults > AccountRangeMaxResults || maxResults <= 0 {
		opts.Max = AccountRangeMaxResults
	}
	return stateDb.RawDump(opts), nil
}

// StorageRangeResult is the result of a debug_storageRangeAt API call.
type StorageRangeResult struct {
	Storage storageMap   `json:"storage"`
	NextKey *common.Hash `json:"nextKey"` // nil if Storage includes the last key in the trie.
}

type storageMap map[common.Hash]storageEntry

type storageEntry struct {
	Key   *common.Hash `json:"key"`
	Value common.Hash  `json:"value"`
}

// StorageRangeAt returns the storage at the given block height and transaction index.
func (api *DebugAPI) StorageRangeAt(ctx context.Context, blockNrOrHash rpc.BlockNumberOrHash, txIndex int, contractAddress common.Address, keyStart hexutil.Bytes, maxResult int) (StorageRangeResult, error) {
	// ... code to get block and statedb ...
	_, _, statedb, release, err := api.eth.stateAtTransaction(ctx, block, txIndex, 0)
	if err != nil {
		return StorageRangeResult{}, err
	}
	defer release()

	return storageRangeAt(statedb, block.Root(), contractAddress, keyStart, maxResult)
}

func storageRangeAt(statedb *state.StateDB, root common.Hash, address common.Address, start []byte, maxResult int) (StorageRangeResult, error) {
	storageRoot := statedb.GetStorageRoot(address)
	if storageRoot == types.EmptyRootHash || storageRoot == (common.Hash{}) {
		return StorageRangeResult{}, nil // empty storage
	}
	id := trie.StorageTrieID(root, crypto.Keccak256Hash(address.Bytes()), storageRoot)
	tr, err := trie.NewStateTrie(id, statedb.Database().TrieDB())
	if err != nil {
		return StorageRangeResult{}, err
	}
	trieIt, err := tr.NodeIterator(start)
	if err != nil {
		return StorageRangeResult{}, err
	}
	it := trie.NewIterator(trieIt)
	result := StorageRangeResult{Storage: storageMap{}}
	for i := 0; i < maxResult && it.Next(); i++ {
		_, content, _, err := rlp.Split(it.Value)
		if err != nil {
			return StorageRangeResult{}, err
		}
		e := storageEntry{Value: common.BytesToHash(content)}
		if preimage := tr.GetKey(it.Key); preimage != nil {
			preimage := common.BytesToHash(preimage)
			e.Key = &preimage
		}
		result.Storage[common.BytesToHash(it.Key)] = e
	}
	// Add the 'next key' so clients can continue downloading.
	if it.Next() {
		next := common.BytesToHash(it.Key)
		result.NextKey = &next
	}
	return result, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/disasm.go">
```go
package main

import (
	"fmt"
	"io"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/urfave/cli/v2"
)

var disasmCmd = &cli.Command{
	Action:      disasm,
	Name:        "disasm",
	Usage:       "disassemble EVM code",
	ArgsUsage:   "<evm_code>",
	Description: `The disasm command prints a disassembly of EVM code.`,
}

func disasm(ctx *cli.Context) error {
	var (
		code []byte
		err  error
	)
	if ctx.NArg() > 0 {
		code = common.FromHex(ctx.Args().First())
	} else {
		code, err = io.ReadAll(os.Stdin)
		if err != nil {
			return err
		}
	}
	it := vm.NewInstructionIterator(code)
	for it.Next() {
		// print the PC as a decimal, then as a hex
		fmt.Printf("%05d %0*x ", it.PC(), 2, it.PC())
		if it.Arg() != nil {
			fmt.Printf("%-10s 0x%x\n", it.Op().String(), it.Arg())
		} else {
			fmt.Printf("%s\n", it.Op().String())
		}
	}
	return it.Error()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
package vm

// OpCode is a EVM opcode
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
	// ...

// IsPush returns true if the opcode is a PUSHn.
func (op OpCode) IsPush() bool {
	return op >= PUSH1 && op <= PUSH32
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/bench.go">
```go
package main

import (
	"fmt"
	"math/big"
	"os"
	"runtime"
	"strings"
	"text/tabwriter"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/triedb"
	"github.com/urfave/cli/v2"
)

var benchCmd = &cli.Command{
	Action:      benchmark,
	Name:        "bench",
	Usage:       "benchmark arbitrary EVM code",
	ArgsUsage:   "<evm_code>",
	Description: `The bench command runs the given EVM code in a loop and measures performance.`,
	Flags: []cli.Flag{
		&cli.Uint64Flag{
			Name:  "repeat",
			Value: 1000,
			Usage: "number of times to repeat the benchmark",
		},
	},
}

var (
	benchSender    = common.HexToAddress("0xba5e000000000000000000000000000000000000")
	benchReceiver  = common.HexToAddress("0xbe95000000000000000000000000000000000000")
	benchGasLimit  = uint64(10000000)
	benchGasPrice  = big.NewInt(1)
	benchValue     = new(big.Int)
	benchNonce     = uint64(0)
	benchChainConfig *params.ChainConfig
)

func benchmark(ctx *cli.Context) error {
	// ... (code to setup benchmarks)

	var benchmarks = []struct {
		name string
		code []byte
		gas  uint64
		mem  int
	}{
		{
			name: "ADD",
			code: []byte{
				byte(vm.PUSH1), 0x01,
				byte(vm.PUSH1), 0x01,
				byte(vm.ADD),
				byte(vm.POP),
			},
		},
		{
			name: "Fibonacci",
			code: common.FromHex(fibonacci),
		},
		{
			name: "Memory",
			code: []byte{
				byte(vm.PUSH2), 0x04, 0x00, // 1k
				byte(vm.PUSH1), 0x00,
				byte(vm.MSTORE),
			},
		},
		// ... more benchmarks ...
	}
	// ... (code to run and print benchmarks)
	return nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethclient/simulated/backend.go">
```go
package simulated

import (
	"errors"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/eth"
	"github.com/ethereum/go-ethereum/eth/catalyst"
	"github.com/ethereum/go-ethereum/eth/ethconfig"
	"github.com/ethereum/go-ethereum/eth/filters"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/node"
	"github.com/ethereum/go-ethereum/p2p"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rpc"
)

// ... (interface definitions)

// Backend is a simulated blockchain. You can use it to test your contracts or
// other code that interacts with the Ethereum chain.
type Backend struct {
	node   *node.Node
	beacon *catalyst.SimulatedBeacon
	client simClient
}

// NewBackend creates a new simulated blockchain that can be used as a backend for
// contract bindings in unit tests.
//
// A simulated backend always uses chainID 1337.
func NewBackend(alloc types.GenesisAlloc, options ...func(nodeConf *node.Config, ethConf *ethconfig.Config)) *Backend {
	// Create the default configurations for the outer node shell and the Ethereum
	// service to mutate with the options afterwards
	nodeConf := node.DefaultConfig
	nodeConf.DataDir = ""
	nodeConf.P2P = p2p.Config{NoDiscovery: true}

	ethConf := ethconfig.Defaults
	ethConf.Genesis = &core.Genesis{
		Config:   params.AllDevChainProtocolChanges,
		GasLimit: ethconfig.Defaults.Miner.GasCeil,
		Alloc:    alloc,
	}
	ethConf.SyncMode = ethconfig.FullSync
	ethConf.TxPool.NoLocals = true

	for _, option := range options {
		option(&nodeConf, &ethConf)
	}
	// Assemble the Ethereum stack to run the chain with
	stack, err := node.New(&nodeConf)
	if err != nil {
		panic(err) // this should never happen
	}
	sim, err := newWithNode(stack, &ethConf, 0)
	if err != nil {
		panic(err) // this should never happen
	}
	return sim
}

// Commit seals a block and moves the chain forward to a new empty block.
func (n *Backend) Commit() common.Hash {
	return n.beacon.Commit()
}

// Client returns a client that accesses the simulated chain.
func (n *Backend) Client() Client {
	return n.client
}
```
</file>
</go-ethereum>

---

An excellent and detailed prompt. Here are the most relevant code snippets from the go-ethereum codebase that will help in implementing the specified CLI tools.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/runner.go">
```go
// This file contains the core logic for the 'evm run' command, which is analogous
// to the requested `tevm-exec` tool. It demonstrates how to set up the EVM
// environment, execute code, and handle tracing.

// run is the entry point for the run command.
func run(ctx *cli.Context) error {
	// ... (setup code for logging, profiling, etc. is omitted) ...

	var (
		tracer vm.Tracer
		debug  = ctx.GlobalBool(DebugFlag.Name)
	)
	if debug {
		tracer = vm.NewStructLogger(&vm.LogConfig{
			Debug: true,
		})
	}
	g := new(core.Genesis).MustCommit(chainDb)
	// ...

	// Setup the execution environment.
	var (
		from   = common.HexToAddress(ctx.GlobalString(FromFlag.Name))
		to     = common.HexToAddress(ctx.GlobalString(ToFlag.Name))
		gas    = ctx.GlobalUint64(GasFlag.Name)
		value  = math.MustParseBig256(ctx.GlobalString(ValueFlag.Name))
		input  = common.FromHex(ctx.GlobalString(InputFlag.Name))
		code   = common.FromHex(ctx.GlobalString(CodeFlag.Name))
		sender = vm.AccountRef(from)
		rules  = chain.Config().Rules(new(big.Int).SetUint64(1), true, g.Timestamp)
	)
	// ... (message and header setup omitted) ...

	// Create a new state database.
	statedb, err := state.New(g.Root, chainDb, nil)
	// ... (error handling) ...

	// Set up the VM and context.
	chainCtx := core.NewEVMBlockContext(header, chain, nil)
	vmctx := core.NewEVMContext(msg, header, chain, nil)
	vmcfg := vm.Config{
		Tracer:                  tracer,
		NoBaseFee:               true,
		EnablePreimageRecording: debug,
		JumpTable:               params.GetJumpTable(chain.Config(), vmctx.BlockNumber),
	}
	evm := vm.NewEVM(chainCtx, vmctx, statedb, chain.Config(), vmcfg)

	// ... (code for handling contract creation vs. call omitted) ...
	ret, left, err := evm.Call(sender, to, input, gas, value)

	if err != nil {
		fmt.Printf("EVN execution error: %v\n", err)
	}
	if ctx.GlobalBool(JSONFlag.Name) {
		dump.Gas = left
		dump.Return = ret
		dump.Error = err
		if logs, ok := tracer.(*vm.StructLogger); ok {
			dump.StructLogs = logs.StructLogs()
		}
		out, _ := json.MarshalIndent(dump, "", "  ")
		fmt.Println(string(out))
		return nil
	}

	// ... (non-JSON output formatting omitted) ...

	// If the tracer was a struct logger, output the captured structured logs.
	if logger, ok := tracer.(*vm.StructLogger); ok {
		fmt.Printf("------ TRACE ------\n")
		vm.WriteTrace(os.Stdout, logger.StructLogs())
		fmt.Printf("-------------------\n")
	}
	return nil
}

// The benchmark-related part of the `run` function, demonstrating a simple
// execution loop for performance measurement. This is relevant for `tevm-bench`.
func run(ctx *cli.Context) error {
	// ... (setup code is identical to the snippet above) ...

	if bench := ctx.GlobalBool(BenchFlag.Name); bench {
		// ...
		var (
			start    = time.Now()
			gasUsed  uint64
			txs      int
			results  []float64
			errCount int
		)
		for i := 0; i < n; i++ {
			// ... reset state ...
			statedb, _ := state.New(g.Root, chainDb, nil)
			evm.StateDB = statedb
			// ...

			tstart := time.Now()
			if contractCreation {
				_, _, left, err = evm.Create(caller, code, gas, value)
			} else {
				_, left, err = evm.Call(caller, to, input, gas, value)
			}
			if err != nil {
				errCount++
			}
			telapsed := time.Since(tstart)
			results = append(results, telapsed.Seconds()*1000)
			gasUsed += (gas - left)
			txs++
		}
		end := time.Now()
		elapsed := end.Sub(start)
		// ... (metric calculation and printing) ...
		return nil
	}
	// ... (non-benchmark execution) ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// This file defines the StructLogger, which is a perfect reference for the
// tracing functionality and the `TraceStep` struct requested in `tevm-exec`.

// StructLogger is a EVM state logger and implements Tracer.
//
// StructLogger can be used to capture execution traces of the EVM.
// To get the structured logs, Tracer has to be set in EVMConfig.
//
// Captured logs can be retrieved by calling StructLogs().
type StructLogger struct {
	cfg LogConfig

	logs          []StructLog
	gas           uint64
	memory        *Memory
	stack         *Stack
	depth         int
	storage       map[common.Hash]common.Hash
	preimages     map[common.Hash][]byte
	inJump        bool // true if the current trace is for a jump
	loggedExecute bool // true if the execute event has been logged

	// mu protects the struct fields
	mu sync.Mutex
}

// StructLog is a structured log emitted by the EVM while replaying a
// transaction in debug mode
type StructLog struct {
	Pc            uint64          `json:"pc"`
	Op            OpCode          `json:"op"`
	Gas           uint64          `json:"gas"`
	GasCost       uint64          `json:"gasCost"`
	Memory        []hexutil.Bytes `json:"memory"`
	MemorySize    int             `json:"memSize"`
	Stack         []*uint256.Int  `json:"stack"`
	ReturnData    hexutil.Bytes   `json:"returnData"`
	Depth         int             `json:"depth"`
	RefundCounter uint64          `json:"refund"`
	Err           error           `json:"-"`
	ErrString     string          `json:"error,omitempty"`

	// OpName is the name of the opcode.
	OpName string `json:"opName"` // TODO(holiman): Move to OpCode.String()
}

// CaptureState is called each time the EVM executes an instruction.
func (l *StructLogger) CaptureState(evm *EVM, pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (implementation of capturing stack, memory, etc. omitted for brevity) ...
	// The key takeaway is how it populates the StructLog with data from the EVM's
	// internal state at each step.
	stack := scope.Stack.slice()
	stackData := make([]*uint256.Int, len(stack))
	for i, item := range stack {
		stackData[i] = item.ToUint256()
	}

	log := StructLog{
		Pc:         pc,
		Op:         op,
		OpName:     op.String(),
		Gas:        gas,
		GasCost:    cost,
		Depth:      depth,
		Err:        err,
		Stack:      stackData,
		ReturnData: rData,
	}

	if !l.cfg.DisableMemory {
		log.Memory = memoryToHexSlice(scope.Memory.Data())
		log.MemorySize = scope.Memory.Len()
	}
	// ...
	l.logs = append(l.logs, log)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/geth/dump.go">
```go
// This file contains the `dump` command, which is a great reference for `tevm-state`.
// It shows how to iterate over the state trie to inspect all accounts and their storage.

var dumpCommand = &cli.Command{
	Action:      utils.MigrateFlags(dump),
	Name:        "dump",
	Usage:       "Dump a specific block from storage",
	ArgsUsage:   "<block number or hash>",
	// ... (flags omitted) ...
}

func dump(ctx *cli.Context) error {
	// ... (setup code for opening the database is omitted) ...

	// Open the state trie at the requested root.
	state, err := db.OpenState(root)
	if err != nil {
		return err
	}
	// ... (account iteration and printing logic) ...
	it := state.NodeIterator(nil)
	for it.Next(true) { // Move to the next key-value pair
		if it.Hash() {
			continue // Don't decode hash nodes
		}
		// Decode the account and print it
		var acc types.Account
		if err := rlp.DecodeBytes(it.Value(), &acc); err != nil {
			// ...
		}
		key := db.TrieDB().Key(it.Path())
		fmt.Printf("found account %x: %s\n", key, common.PrettyJSON(acc))

		// If storage dump was requested, iterate that too
		if dumpStorage {
			storageIt := state.StorageNodeIterator(key, nil)
			for storageIt.Next(true) {
				if storageIt.Hash() {
					continue // Don't decode hash nodes
				}
				var (
					storageKey  = db.TrieDB().Key(storageIt.Path())
					storageData []byte
				)
				if err := rlp.DecodeBytes(storageIt.Value(), &storageData); err != nil {
					// ...
				}
				fmt.Printf("  storage %x: %x\n", storageKey, storageData)
			}
			// ...
		}
	}
	return it.Error()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/disasm/disasm.go">
```go
// This file is a simple EVM disassembler, providing a direct reference for
// the `disassemble` function in the `BytecodeAnalyzer`. It shows how to iterate
// bytecode and handle PUSH opcodes with their immediate data.

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "Usage: disasm <hex-EVM-code>")
		os.Exit(1)
	}
	// Decode the hex encoded machine code
	code, err := hex.DecodeString(os.Args[1])
	if err != nil {
		fmt.Fprintf(os.Stderr, "Invalid hex input: %v\n", err)
		os.Exit(1)
	}
	// Iterate over the code and pretty print it
	for pc := 0; pc < len(code); {
		op := vm.OpCode(code[pc])
		fmt.Printf("%05d: %s", pc, op)

		// If the opcode has data, print it
		if op.IsPush() {
			// Get the number of bytes to read
			num := int(op) - int(vm.PUSH1) + 1
			// Prevent reading past the end of the contract
			end := pc + 1 + num
			if end > len(code) {
				end = len(code)
			}
			// Slice out the data and print it
			data := code[pc+1 : end]
			fmt.Printf(" %s\n", common.Bytes2Hex(data))
			pc += num
		} else {
			fmt.Printf("\n")
		}
		pc++
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is excellent and provides a clear, well-structured specification for the CLI tools. The provided Zig code is a great starting point for implementation. There are no major corrections needed, but here are a few minor points of comparison with the go-ethereum implementation that might be helpful:

1.  **Tracer Output**: The `TraceStep` struct in the prompt is very good. In go-ethereum's `StructLog`, there is also an `Err` field. Capturing errors at each step can be very useful for debugging, especially for invalid opcodes or stack violations.
2.  **State Inspection**: The prompt's `get_account_iterator` and `get_storage_iterator` are good abstractions. The go-ethereum `dump` command shows that this is typically implemented by iterating over the underlying state trie. Mentioning this connection might provide useful context for the implementer.
3.  **Opcode Information**: The prompt's `get_opcode_info` function uses a `switch` statement. Go-ethereum uses a `map[OpCode]string` for opcode names. For a dense set of keys like opcodes (0-255), an array or a `comptime` generated map/switch can be very efficient. The current approach is perfectly fine.
4.  **Benchmarking**: The `tevm-bench` tool specified in the prompt is more comprehensive than geth's built-in benchmark flag, as it defines different scenarios. The geth implementation is a good reference for the core looping and timing logic and for the kinds of metrics to report (e.g., ops/sec, gas/sec, min/max/avg time).

