# Implement DoS Protection

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_dos_protection` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_dos_protection feat_implement_dos_protection`
3. **Work in isolation**: `cd g/feat_implement_dos_protection`
4. **Commit message**: `✨ feat: implement comprehensive DoS protection mechanisms for EVM execution`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive Denial of Service (DoS) protection mechanisms to ensure the EVM implementation can safely handle malicious or resource-intensive inputs. This includes gas limit enforcement, execution timeouts, memory limits, call depth protection, and other attack vectors that could potentially crash or slow down the EVM.

## DoS Protection Specifications

### Core Protection Categories

#### 1. Gas Limit Enforcement
```zig
pub const GasLimitEnforcer = struct {
    max_gas_per_tx: u64,
    max_gas_per_block: u64,
    gas_price_minimum: u64,
    gas_limit_buffer: u64,
    
    pub const GasLimitConfig = struct {
        max_transaction_gas: u64,
        max_block_gas: u64,
        min_gas_price: u64,
        gas_overhead_buffer: u64,
        enable_strict_mode: bool,
        
        pub fn mainnet() GasLimitConfig {
            return GasLimitConfig{
                .max_transaction_gas = 30_000_000,
                .max_block_gas = 30_000_000,
                .min_gas_price = 1_000_000_000, // 1 Gwei
                .gas_overhead_buffer = 21_000,
                .enable_strict_mode = true,
            };
        }

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation demonstrates key DoS protection patterns: gas limit constants defining boundaries, call depth tracking and enforcement, and interpreter-level protections. The key insight is that DoS protection is implemented at multiple layers: protocol level (gas limits), interpreter level (call depth), and execution level (gas consumption tracking).
</explanation>

**Gas Limit Constants** - `/go-ethereum/params/protocol_params.go` (lines 26-29):
```go
GasLimitBoundDivisor uint64 = 1024               // The bound divisor of the gas limit, used in update calculations.
MinGasLimit          uint64 = 5000               // Minimum the gas limit may ever be.
MaxGasLimit          uint64 = 0x7fffffffffffffff // Maximum the gas limit (2^63-1).
GenesisGasLimit      uint64 = 4712388            // Gas limit of the Genesis block.
```

**Call Depth Tracking** - `/go-ethereum/core/vm/interpreter.go` (lines 163-165):
```go
// Increment the call depth which is restricted to 1024
in.evm.depth++
defer func() { in.evm.depth-- }()
```

### evmone

<explanation>
The evmone implementation shows explicit call depth protection checks at 1024 depth limit. This is implemented in multiple call-related operations and demonstrates the standard pattern for preventing call stack overflow attacks.
</explanation>

**Call Depth Protection** - `/evmone/lib/evmone/instructions_calls.cpp` (lines 167, 270, 345, 411):
```cpp
// In call operations
if (state.msg->depth >= 1024)
    return {EVMC_SUCCESS, gas_left};  // "Light" failure.

// In extcall operations  
if (msg.gas < MIN_CALLEE_GAS || state.msg->depth >= 1024 ||
    (has_value &&
        intx::be::load<uint256>(state.host.get_balance(state.msg->recipient)) < value))
{
    stack.top() = EXTCALL_REVERT;
    return {EVMC_SUCCESS, gas_left};  // "Light" failure.
}

// In create operations
if (state.msg->depth >= 1024)
    return {EVMC_SUCCESS, gas_left};  // "Light" failure.
```
        
        pub fn testnet() GasLimitConfig {
            return GasLimitConfig{
                .max_transaction_gas = 50_000_000,
                .max_block_gas = 50_000_000,
                .min_gas_price = 1,
                .gas_overhead_buffer = 21_000,
                .enable_strict_mode = false,
            };
        }
    };
    
    pub fn init(config: GasLimitConfig) GasLimitEnforcer {
        return GasLimitEnforcer{
            .max_gas_per_tx = config.max_transaction_gas,
            .max_gas_per_block = config.max_block_gas,
            .gas_price_minimum = config.min_gas_price,
            .gas_limit_buffer = config.gas_overhead_buffer,
        };
    }
    
    pub fn validate_gas_limit(self: *const GasLimitEnforcer, gas_limit: u64) !void {
        if (gas_limit > self.max_gas_per_tx) {
            return DoSError.GasLimitTooHigh;
        }
        
        if (gas_limit < self.gas_limit_buffer) {
            return DoSError.GasLimitTooLow;
        }
    }
    
    pub fn validate_gas_price(self: *const GasLimitEnforcer, gas_price: u64) !void {
        if (gas_price < self.gas_price_minimum) {
            return DoSError.GasPriceTooLow;
        }
        
        // Prevent overflow attacks with extremely high gas prices
        if (gas_price > std.math.maxInt(u64) / self.max_gas_per_tx) {
            return DoSError.GasPriceTooHigh;
        }
    }
    
    pub fn check_gas_consumption(
        self: *const GasLimitEnforcer,
        gas_used: u64,
        gas_remaining: u64,
        gas_cost: u64
    ) !void {
        // Check for gas overflow
        if (gas_used > std.math.maxInt(u64) - gas_cost) {
            return DoSError.GasOverflow;
        }
        
        // Check sufficient gas remaining
        if (gas_remaining < gas_cost) {
            return DoSError.OutOfGas;
        }
        
        // Check against maximum limits
        const new_gas_used = gas_used + gas_cost;
        if (new_gas_used > self.max_gas_per_tx) {
            return DoSError.GasLimitExceeded;
        }
    }
};
```

#### 2. Memory Protection
```zig
pub const MemoryProtector = struct {
    max_memory_size: u64,
    max_memory_expansion_per_step: u64,
    memory_growth_factor: f64,
    allocation_tracking: AllocationTracker,
    
    pub const MemoryConfig = struct {
        max_memory_bytes: u64,
        max_expansion_per_op: u64,
        growth_limit_factor: f64,
        enable_allocation_tracking: bool,
        emergency_limit: u64,
        
        pub fn production() MemoryConfig {
            return MemoryConfig{
                .max_memory_bytes = 128 * 1024 * 1024, // 128MB
                .max_expansion_per_op = 32 * 1024, // 32KB per operation
                .growth_limit_factor = 2.0,
                .enable_allocation_tracking = true,
                .emergency_limit = 1024 * 1024 * 1024, // 1GB absolute limit
            };
        }
        
        pub fn development() MemoryConfig {
            return MemoryConfig{
                .max_memory_bytes = 512 * 1024 * 1024, // 512MB
                .max_expansion_per_op = 64 * 1024, // 64KB per operation
                .growth_limit_factor = 4.0,
                .enable_allocation_tracking = true,
                .emergency_limit = 2 * 1024 * 1024 * 1024, // 2GB absolute limit
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: MemoryConfig) MemoryProtector {
        return MemoryProtector{
            .max_memory_size = config.max_memory_bytes,
            .max_memory_expansion_per_step = config.max_expansion_per_op,
            .memory_growth_factor = config.growth_limit_factor,
            .allocation_tracking = AllocationTracker.init(allocator, config.enable_allocation_tracking),
        };
    }
    
    pub fn validate_memory_expansion(
        self: *MemoryProtector,
        current_size: u64,
        new_offset: u64,
        data_size: u64
    ) !u64 {
        // Calculate required memory size
        const required_size = if (data_size > 0) 
            new_offset + data_size 
        else 
            new_offset;
        
        // Check if expansion is needed
        if (required_size <= current_size) {
            return current_size; // No expansion needed
        }
        
        // Calculate expansion amount
        const expansion = required_size - current_size;
        
        // Check expansion limits
        if (expansion > self.max_memory_expansion_per_step) {
            return DoSError.MemoryExpansionTooLarge;
        }
        
        // Check maximum memory size
        if (required_size > self.max_memory_size) {
            return DoSError.MemoryLimitExceeded;
        }
        
        // Check growth rate to prevent exponential attacks
        const growth_ratio = @as(f64, @floatFromInt(required_size)) / @as(f64, @floatFromInt(current_size + 1));
        if (growth_ratio > self.memory_growth_factor) {
            return DoSError.MemoryGrowthTooFast;
        }
        
        // Track allocation
        try self.allocation_tracking.track_allocation(expansion);
        
        return required_size;
    }
    
    pub fn validate_copy_operation(
        self: *MemoryProtector,
        dest_offset: u64,
        src_offset: u64,
        length: u64,
        memory_size: u64
    ) !void {
        // Check for overflow in copy parameters
        if (dest_offset > std.math.maxInt(u64) - length or
            src_offset > std.math.maxInt(u64) - length) {
            return DoSError.MemoryCopyOverflow;
        }
        
        // Check bounds
        if (dest_offset + length > memory_size or
            src_offset + length > memory_size) {
            return DoSError.MemoryCopyOutOfBounds;
        }
        
        // Check for excessive copy size
        if (length > self.max_memory_expansion_per_step) {
            return DoSError.MemoryCopyTooLarge;
        }
    }
};

pub const AllocationTracker = struct {
    total_allocated: u64,
    peak_allocation: u64,
    allocation_count: u64,
    enabled: bool,
    
    pub fn init(allocator: std.mem.Allocator, enabled: bool) AllocationTracker {
        _ = allocator;
        return AllocationTracker{
            .total_allocated = 0,
            .peak_allocation = 0,
            .allocation_count = 0,
            .enabled = enabled,
        };
    }
    
    pub fn track_allocation(self: *AllocationTracker, size: u64) !void {
        if (!self.enabled) return;
        
        self.total_allocated += size;
        self.allocation_count += 1;
        
        if (self.total_allocated > self.peak_allocation) {
            self.peak_allocation = self.total_allocated;
        }
        
        // Alert on suspicious allocation patterns
        if (self.allocation_count > 100_000) {
            return DoSError.TooManyAllocations;
        }
    }
    
    pub fn track_deallocation(self: *AllocationTracker, size: u64) void {
        if (!self.enabled) return;
        
        if (self.total_allocated >= size) {
            self.total_allocated -= size;
        }
    }
};
```

#### 3. Call Depth Protection
```zig
pub const CallDepthProtector = struct {
    max_call_depth: u32,
    current_depth: u32,
    depth_history: std.ArrayList(CallInfo),
    
    pub const CallInfo = struct {
        caller: Address,
        callee: Address,
        call_type: CallType,
        gas_sent: u64,
        value_sent: U256,
        
        pub const CallType = enum {
            Call,
            CallCode,
            DelegateCall,
            StaticCall,
            Create,
            Create2,
        };
    };
    
    pub const CallDepthConfig = struct {
        max_depth: u32,
        track_call_history: bool,
        detect_recursive_calls: bool,
        max_recursive_depth: u32,
        
        pub fn default() CallDepthConfig {
            return CallDepthConfig{
                .max_depth = 1024, // EVM spec limit
                .track_call_history = true,
                .detect_recursive_calls = true,
                .max_recursive_depth = 100,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: CallDepthConfig) CallDepthProtector {
        return CallDepthProtector{
            .max_call_depth = config.max_depth,
            .current_depth = 0,
            .depth_history = std.ArrayList(CallInfo).init(allocator),
        };
    }
    
    pub fn deinit(self: *CallDepthProtector) void {
        self.depth_history.deinit();
    }
    
    pub fn enter_call(
        self: *CallDepthProtector,
        caller: Address,
        callee: Address,
        call_type: CallInfo.CallType,
        gas_sent: u64,
        value_sent: U256
    ) !void {
        // Check depth limit
        if (self.current_depth >= self.max_call_depth) {
            return DoSError.CallDepthExceeded;
        }
        
        // Check for recursive call patterns
        if (try self.detect_recursion(caller, callee)) {
            return DoSError.RecursiveCallDetected;
        }
        
        // Record call information
        const call_info = CallInfo{
            .caller = caller,
            .callee = callee,
            .call_type = call_type,
            .gas_sent = gas_sent,
            .value_sent = value_sent,
        };
        
        try self.depth_history.append(call_info);
        self.current_depth += 1;
    }
    
    pub fn exit_call(self: *CallDepthProtector) !void {
        if (self.current_depth == 0) {
            return DoSError.CallStackUnderflow;
        }
        
        _ = self.depth_history.pop();
        self.current_depth -= 1;
    }
    
    fn detect_recursion(self: *CallDepthProtector, caller: Address, callee: Address) !bool {
        var recursive_count: u32 = 0;
        
        // Check recent call history for recursion patterns
        const history_len = @min(self.depth_history.items.len, 50); // Check last 50 calls
        const start_idx = if (self.depth_history.items.len > 50) 
            self.depth_history.items.len - 50 
        else 
            0;
        
        for (self.depth_history.items[start_idx..]) |call_info| {
            if (std.mem.eql(u8, &call_info.caller.bytes, &caller.bytes) and
                std.mem.eql(u8, &call_info.callee.bytes, &callee.bytes)) {
                recursive_count += 1;
                
                if (recursive_count > 10) { // Allow some recursion but limit it
                    return true;
                }
            }
        }
        
        return false;
    }
};
```

#### 4. Execution Timeout Protection
```zig
pub const ExecutionTimeoutProtector = struct {
    max_execution_time_ns: i128,
    execution_start_time: i128,
    timeout_enabled: bool,
    check_interval: u32,
    operation_count: u32,
    
    pub const TimeoutConfig = struct {
        max_execution_ms: u32,
        enable_timeout: bool,
        check_every_n_operations: u32,
        emergency_timeout_ms: u32,
        
        pub fn production() TimeoutConfig {
            return TimeoutConfig{
                .max_execution_ms = 5000, // 5 seconds
                .enable_timeout = true,
                .check_every_n_operations = 1000,
                .emergency_timeout_ms = 30000, // 30 seconds absolute limit
            };
        }
        
        pub fn development() TimeoutConfig {
            return TimeoutConfig{
                .max_execution_ms = 60000, // 60 seconds
                .enable_timeout = true,
                .check_every_n_operations = 10000,
                .emergency_timeout_ms = 300000, // 5 minutes absolute limit
            };
        }
    };
    
    pub fn init(config: TimeoutConfig) ExecutionTimeoutProtector {
        return ExecutionTimeoutProtector{
            .max_execution_time_ns = @as(i128, config.max_execution_ms) * std.time.ns_per_ms,
            .execution_start_time = 0,
            .timeout_enabled = config.enable_timeout,
            .check_interval = config.check_every_n_operations,
            .operation_count = 0,
        };
    }
    
    pub fn start_execution(self: *ExecutionTimeoutProtector) void {
        if (!self.timeout_enabled) return;
        
        self.execution_start_time = std.time.nanoTimestamp();
        self.operation_count = 0;
    }
    
    pub fn check_timeout(self: *ExecutionTimeoutProtector) !void {
        if (!self.timeout_enabled) return;
        
        self.operation_count += 1;
        
        // Only check time occasionally to avoid overhead
        if (self.operation_count % self.check_interval != 0) {
            return;
        }
        
        const current_time = std.time.nanoTimestamp();
        const elapsed_time = current_time - self.execution_start_time;
        
        if (elapsed_time > self.max_execution_time_ns) {
            return DoSError.ExecutionTimeout;
        }
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Comprehensive Protection**: Guard against all known DoS attack vectors
2. **Configurable Limits**: Environment-specific protection levels
3. **Performance Monitoring**: Track resource usage and detect anomalies
4. **Graceful Degradation**: Handle protection triggers without crashing
5. **Attack Detection**: Identify and log potential DoS attempts
6. **Resource Recovery**: Clean up resources when limits are exceeded

## Implementation Tasks

### Task 1: Implement DoS Error Types
File: `/src/evm/dos_protection/dos_error.zig`
```zig
const std = @import("std");

pub const DoSError = error{
    // Gas-related errors
    GasLimitTooHigh,
    GasLimitTooLow,
    GasPriceTooLow,
    GasPriceTooHigh,
    GasOverflow,
    OutOfGas,
    GasLimitExceeded,
    
    // Memory-related errors
    MemoryLimitExceeded,
    MemoryExpansionTooLarge,
    MemoryGrowthTooFast,
    MemoryCopyOverflow,
    MemoryCopyOutOfBounds,
    MemoryCopyTooLarge,
    TooManyAllocations,
    
    // Call depth errors
    CallDepthExceeded,
    CallStackUnderflow,
    RecursiveCallDetected,
    
    // Execution timeout errors
    ExecutionTimeout,
    OperationTimeout,
    
    // Input validation errors
    InvalidInputSize,
    InvalidParameterRange,
    MaliciousInput,
    
    // Resource exhaustion
    ResourceExhaustion,
    SystemOverload,
    
    // General DoS protection
    RateLimitExceeded,
    SuspiciousActivity,
    ProtectionTriggered,
};

pub const DoSErrorInfo = struct {
    error_type: DoSError,
    message: []const u8,
    context: []const u8,
    resource_usage: ResourceUsage,
    timestamp: i64,
    
    pub const ResourceUsage = struct {
        gas_used: u64,
        memory_used: u64,
        call_depth: u32,
        execution_time_ns: i128,
    };
    
    pub fn create(
        error_type: DoSError,
        message: []const u8,
        context: []const u8,
        usage: ResourceUsage
    ) DoSErrorInfo {
        return DoSErrorInfo{
            .error_type = error_type,
            .message = message,
            .context = context,
            .resource_usage = usage,
            .timestamp = std.time.milliTimestamp(),
        };
    }
};
```

### Task 2: Implement Input Validation Protection
File: `/src/evm/dos_protection/input_validator.zig`
```zig
const std = @import("std");
const DoSError = @import("dos_error.zig").DoSError;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;

pub const InputValidator = struct {
    max_input_size: u64,
    max_code_size: u64,
    enable_pattern_detection: bool,
    
    pub const ValidationConfig = struct {
        max_transaction_input_size: u64,
        max_contract_code_size: u64,
        max_create_input_size: u64,
        enable_malicious_pattern_detection: bool,
        strict_validation: bool,
        
        pub fn production() ValidationConfig {
            return ValidationConfig{
                .max_transaction_input_size = 128 * 1024, // 128KB
                .max_contract_code_size = 24 * 1024, // 24KB (EIP-170)
                .max_create_input_size = 256 * 1024, // 256KB
                .enable_malicious_pattern_detection = true,
                .strict_validation = true,
            };
        }
        
        pub fn testing() ValidationConfig {
            return ValidationConfig{
                .max_transaction_input_size = 1024 * 1024, // 1MB
                .max_contract_code_size = 1024 * 1024, // 1MB
                .max_create_input_size = 2 * 1024 * 1024, // 2MB
                .enable_malicious_pattern_detection = false,
                .strict_validation = false,
            };
        }
    };
    
    pub fn init(config: ValidationConfig) InputValidator {
        return InputValidator{
            .max_input_size = config.max_transaction_input_size,
            .max_code_size = config.max_contract_code_size,
            .enable_pattern_detection = config.enable_malicious_pattern_detection,
        };
    }
    
    pub fn validate_transaction_input(self: *const InputValidator, input: []const u8) !void {
        // Check input size
        if (input.len > self.max_input_size) {
            return DoSError.InvalidInputSize;
        }
        
        // Check for malicious patterns
        if (self.enable_pattern_detection) {
            try self.detect_malicious_patterns(input);
        }
    }
    
    pub fn validate_contract_code(self: *const InputValidator, code: []const u8) !void {
        // Check code size (EIP-170)
        if (code.len > self.max_code_size) {
            return DoSError.InvalidInputSize;
        }
        
        // Validate bytecode structure
        try self.validate_bytecode_structure(code);
        
        // Check for malicious patterns
        if (self.enable_pattern_detection) {
            try self.detect_malicious_bytecode_patterns(code);
        }
    }
    
    pub fn validate_call_parameters(
        self: *const InputValidator,
        gas: u64,
        value: U256,
        input: []const u8
    ) !void {
        // Validate gas parameter
        if (gas > 2_000_000_000) { // Reasonable upper bound
            return DoSError.InvalidParameterRange;
        }
        
        // Validate value parameter (prevent overflow attacks)
        if (value > U256.max_value()) {
            return DoSError.InvalidParameterRange;
        }
        
        // Validate input size
        if (input.len > self.max_input_size) {
            return DoSError.InvalidInputSize;
        }
    }
    
    fn detect_malicious_patterns(self: *const InputValidator, input: []const u8) !void {
        _ = self;
        
        // Check for repeated byte patterns (zip bombs)
        if (input.len > 1024) {
            var pattern_count: u32 = 0;
            var i: usize = 0;
            while (i < input.len - 32) : (i += 32) {
                const chunk = input[i..i + 32];
                
                // Check if chunk is all same byte
                const first_byte = chunk[0];
                var all_same = true;
                for (chunk) |byte| {
                    if (byte != first_byte) {
                        all_same = false;
                        break;
                    }
                }
                
                if (all_same) {
                    pattern_count += 1;
                    if (pattern_count > 10) {
                        return DoSError.MaliciousInput;
                    }
                }
            }
        }
        
        // Check for excessive null bytes
        var null_count: u32 = 0;
        for (input) |byte| {
            if (byte == 0) {
                null_count += 1;
            }
        }
        
        if (null_count > input.len / 2) {
            return DoSError.MaliciousInput;
        }
    }
    
    fn validate_bytecode_structure(self: *const InputValidator, code: []const u8) !void {
        _ = self;
        
        if (code.len == 0) return;
        
        var pc: usize = 0;
        while (pc < code.len) {
            const opcode = code[pc];
            
            // Check PUSH instruction immediate data
            if (opcode >= 0x60 and opcode <= 0x7F) { // PUSH1-PUSH32
                const push_size = opcode - 0x5F;
                pc += push_size;
                
                // Ensure we don't read past end of code
                if (pc >= code.len) {
                    return DoSError.MaliciousInput;
                }
            }
            
            pc += 1;
        }
    }
    
    fn detect_malicious_bytecode_patterns(self: *const InputValidator, code: []const u8) !void {
        _ = self;
        
        var jump_count: u32 = 0;
        var invalid_count: u32 = 0;
        
        for (code) |opcode| {
            switch (opcode) {
                0x56, 0x57 => { // JUMP, JUMPI
                    jump_count += 1;
                },
                0xFE => { // INVALID
                    invalid_count += 1;
                },
                else => {},
            }
        }
        
        // Detect excessive jumping (potential infinite loop)
        if (jump_count > code.len / 4) {
            return DoSError.MaliciousInput;
        }
        
        // Detect excessive invalid opcodes
        if (invalid_count > 10) {
            return DoSError.MaliciousInput;
        }
    }
};
```

### Task 3: Integrate DoS Protection with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const DoSProtector = @import("dos_protection/dos_protector.zig").DoSProtector;

pub const Vm = struct {
    // Existing fields...
    dos_protector: DoSProtector,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !Vm {
        var vm = Vm{
            // Existing initialization...
            .dos_protector = DoSProtector.init(allocator, DoSProtector.Config.production()),
        };
        
        return vm;
    }
    
    pub fn execute_with_protection(
        self: *Vm,
        bytecode: []const u8,
        gas_limit: u64,
        input: []const u8
    ) !ExecutionResult {
        // Start DoS protection monitoring
        try self.dos_protector.start_execution();
        defer self.dos_protector.end_execution();
        
        // Validate inputs
        try self.dos_protector.validate_inputs(bytecode, gas_limit, input);
        
        // Execute with monitoring
        var gas_used: u64 = 0;
        var pc: u32 = 0;
        
        while (pc < bytecode.len) {
            // Check for timeouts and resource limits
            try self.dos_protector.check_limits(gas_used, self.memory.size(), self.call_depth);
            
            const opcode = bytecode[pc];
            const operation = self.jump_table.get_operation(opcode);
            
            // Validate operation before execution
            try self.dos_protector.validate_operation(operation, &self.stack, &self.memory);
            
            // Execute operation with monitoring
            const result = try operation.execute(&self.frame);
            
            gas_used += result.gas_used;
            pc = result.new_pc;
            
            // Check post-execution state
            try self.dos_protector.check_post_execution_state(gas_used, self.memory.size());
        }
        
        return ExecutionResult{
            .success = true,
            .gas_used = gas_used,
            .output = &[_]u8{},
        };
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/dos_protection/dos_protection_test.zig`

### Test Cases
```zig
test "gas limit enforcement" {
    // Test gas limit validation
    // Test gas overflow protection
    // Test gas consumption monitoring
}

test "memory protection" {
    // Test memory expansion limits
    // Test memory growth rate limits
    // Test memory copy protection
}

test "call depth protection" {
    // Test call depth limits
    // Test recursive call detection
    // Test call stack management
}

test "execution timeout protection" {
    // Test execution timeout enforcement
    // Test timeout configuration
    // Test timeout recovery
}

test "input validation" {
    // Test malicious input detection
    // Test bytecode validation
    // Test parameter validation
}

test "DoS attack scenarios" {
    // Test known DoS attack vectors
    // Test resource exhaustion attacks
    // Test performance under attack
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/dos_protection/dos_protector.zig` - Main DoS protection coordinator
- `/src/evm/dos_protection/dos_error.zig` - DoS-specific error types
- `/src/evm/dos_protection/gas_limit_enforcer.zig` - Gas limit protection
- `/src/evm/dos_protection/memory_protector.zig` - Memory protection
- `/src/evm/dos_protection/call_depth_protector.zig` - Call depth protection
- `/src/evm/dos_protection/timeout_protector.zig` - Execution timeout protection
- `/src/evm/dos_protection/input_validator.zig` - Input validation protection
- `/src/evm/vm.zig` - Integrate DoS protection into VM execution
- `/src/evm/execution/` - Add protection hooks to opcode implementations
- `/test/evm/dos_protection/dos_protection_test.zig` - Comprehensive tests

## Success Criteria

1. **Attack Resistance**: Resist all known EVM DoS attack vectors
2. **Resource Protection**: Prevent resource exhaustion under any input
3. **Performance**: <2% overhead during normal execution
4. **Configurability**: Easy to adjust protection levels for different environments
5. **Monitoring**: Clear visibility into resource usage and protection triggers
6. **Recovery**: Graceful handling of protection violations without crashes

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Zero false positives** - Legitimate operations must not be blocked
3. **Performance** - Protection overhead must be minimal
4. **Comprehensive** - Cover all attack vectors documented in security research
5. **Configurable** - Support different protection levels for different use cases
6. **Monitoring** - Provide detailed information about protection triggers

## References

- [Ethereum Security Considerations](https://consensys.github.io/smart-contract-best-practices/)
- [EVM DoS Attack Vectors](https://blog.sigmaprime.io/solidity-security.html)
- [Gas Limit Attack Prevention](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md)
- [Memory Expansion Attacks](https://blog.positive.com/smart-contract-vulnerabilities-in-ethereum-b3d0c0a14e4f)
- [Call Depth Attack Mitigation](https://ethereum.stackexchange.com/questions/25616/what-is-the-call-stack-depth-limit)