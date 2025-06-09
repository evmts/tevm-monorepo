# Implement Input Validation Framework

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_input_validation_framework` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_input_validation_framework feat_implement_input_validation_framework`
3. **Work in isolation**: `cd g/feat_implement_input_validation_framework`
4. **Commit message**: `🛡️ feat: implement comprehensive input validation and sanitization framework for secure EVM execution`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive input validation framework that provides robust validation and sanitization for all EVM inputs, including bytecode, transaction data, contract parameters, and runtime values. This framework ensures security, correctness, and performance while preventing common attack vectors and maintaining EVM compatibility.

## Input Validation Framework Specifications

### Core Validation Framework

#### 1. Input Validation Manager
```zig
pub const InputValidationManager = struct {
    allocator: std.mem.Allocator,
    config: ValidationConfig,
    validator_registry: ValidatorRegistry,
    sanitizer_registry: SanitizerRegistry,
    rule_engine: ValidationRuleEngine,
    performance_tracker: ValidationPerformanceTracker,
    security_monitor: SecurityMonitor,
    
    pub const ValidationConfig = struct {
        enable_input_validation: bool,
        validation_level: ValidationLevel,
        sanitization_level: SanitizationLevel,
        enable_security_monitoring: bool,
        enable_performance_tracking: bool,
        max_validation_time_ms: u64,
        allow_invalid_utf8: bool,
        strict_abi_validation: bool,
        enable_fuzzing_resistance: bool,
        
        pub const ValidationLevel = enum {
            None,           // No validation (unsafe)
            Basic,          // Basic type and range validation
            Standard,       // Standard EVM compliance validation
            Strict,         // Strict validation with additional checks
            Paranoid,       // Maximum validation with security focus
        };
        
        pub const SanitizationLevel = enum {
            None,           // No sanitization
            Basic,          // Basic data cleaning
            Standard,       // Standard sanitization practices
            Aggressive,     // Aggressive sanitization with normalization
        };
        
        pub fn production() ValidationConfig {
            return ValidationConfig{
                .enable_input_validation = true,
                .validation_level = .Standard,
                .sanitization_level = .Standard,
                .enable_security_monitoring = true,
                .enable_performance_tracking = false,
                .max_validation_time_ms = 100,
                .allow_invalid_utf8 = false,
                .strict_abi_validation = true,
                .enable_fuzzing_resistance = true,
            };
        }
        
        pub fn development() ValidationConfig {
            return ValidationConfig{
                .enable_input_validation = true,
                .validation_level = .Strict,
                .sanitization_level = .Standard,
                .enable_security_monitoring = true,
                .enable_performance_tracking = true,
                .max_validation_time_ms = 1000,
                .allow_invalid_utf8 = true,
                .strict_abi_validation = true,
                .enable_fuzzing_resistance = false,
            };
        }
        
        pub fn testing() ValidationConfig {
            return ValidationConfig{
                .enable_input_validation = true,
                .validation_level = .Paranoid,
                .sanitization_level = .Aggressive,
                .enable_security_monitoring = true,
                .enable_performance_tracking = true,
                .max_validation_time_ms = 5000,
                .allow_invalid_utf8 = true,
                .strict_abi_validation = false,
                .enable_fuzzing_resistance = true,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ValidationConfig) !InputValidationManager {
        return InputValidationManager{
            .allocator = allocator,
            .config = config,
            .validator_registry = try ValidatorRegistry.init(allocator, config),
            .sanitizer_registry = try SanitizerRegistry.init(allocator, config),
            .rule_engine = try ValidationRuleEngine.init(allocator, config),
            .performance_tracker = ValidationPerformanceTracker.init(),
            .security_monitor = try SecurityMonitor.init(allocator, config),
        };
    }
    
    pub fn deinit(self: *InputValidationManager) void {
        self.validator_registry.deinit();
        self.sanitizer_registry.deinit();
        self.rule_engine.deinit();
        self.security_monitor.deinit();
    }
    
    pub fn validate_transaction_input(
        self: *InputValidationManager,
        input: TransactionInput
    ) !ValidationResult {
        if (!self.config.enable_input_validation) {
            return ValidationResult.success();
        }
        
        const start_time = std.time.nanoTimestamp();
        
        // Create validation context
        const context = ValidationContext{
            .input_type = .Transaction,
            .validation_level = self.config.validation_level,
            .sanitization_level = self.config.sanitization_level,
            .security_monitoring = self.config.enable_security_monitoring,
            .timeout_ms = self.config.max_validation_time_ms,
        };
        
        // Execute validation pipeline
        var result = try self.execute_validation_pipeline(
            .{ .transaction = input },
            context
        );
        
        // Record performance metrics
        if (self.config.enable_performance_tracking) {
            const validation_time = std.time.nanoTimestamp() - start_time;
            self.performance_tracker.record_validation(
                .Transaction,
                validation_time,
                result.is_valid,
                result.violations.len
            );
        }
        
        return result;
    }
    
    pub fn validate_bytecode_input(
        self: *InputValidationManager,
        input: BytecodeInput
    ) !ValidationResult {
        if (!self.config.enable_input_validation) {
            return ValidationResult.success();
        }
        
        const start_time = std.time.nanoTimestamp();
        
        const context = ValidationContext{
            .input_type = .Bytecode,
            .validation_level = self.config.validation_level,
            .sanitization_level = self.config.sanitization_level,
            .security_monitoring = self.config.enable_security_monitoring,
            .timeout_ms = self.config.max_validation_time_ms,
        };
        
        var result = try self.execute_validation_pipeline(
            .{ .bytecode = input },
            context
        );
        
        if (self.config.enable_performance_tracking) {
            const validation_time = std.time.nanoTimestamp() - start_time;
            self.performance_tracker.record_validation(
                .Bytecode,
                validation_time,
                result.is_valid,
                result.violations.len
            );
        }
        
        return result;
    }
    
    pub fn validate_contract_call_input(
        self: *InputValidationManager,
        input: ContractCallInput
    ) !ValidationResult {
        if (!self.config.enable_input_validation) {
            return ValidationResult.success();
        }
        
        const start_time = std.time.nanoTimestamp();
        
        const context = ValidationContext{
            .input_type = .ContractCall,
            .validation_level = self.config.validation_level,
            .sanitization_level = self.config.sanitization_level,
            .security_monitoring = self.config.enable_security_monitoring,
            .timeout_ms = self.config.max_validation_time_ms,
        };
        
        var result = try self.execute_validation_pipeline(
            .{ .contract_call = input },
            context
        );
        
        if (self.config.enable_performance_tracking) {
            const validation_time = std.time.nanoTimestamp() - start_time;
            self.performance_tracker.record_validation(
                .ContractCall,
                validation_time,
                result.is_valid,
                result.violations.len
            );
        }
        
        return result;
    }
    
    pub fn sanitize_input(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext
    ) !SanitizedInput {
        if (self.config.sanitization_level == .None) {
            return SanitizedInput.from_raw(input);
        }
        
        // Get appropriate sanitizer
        const sanitizer = self.sanitizer_registry.get_sanitizer(context.input_type) orelse {
            return error.NoSanitizerAvailable;
        };
        
        // Apply sanitization
        return try sanitizer.sanitize(input, context);
    }
    
    fn execute_validation_pipeline(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext
    ) !ValidationResult {
        var result = ValidationResult.init(self.allocator);
        
        // Step 1: Basic type validation
        try self.validate_input_type(input, context, &result);
        
        // Step 2: Range and boundary validation
        try self.validate_input_ranges(input, context, &result);
        
        // Step 3: Format validation
        try self.validate_input_format(input, context, &result);
        
        // Step 4: Security validation
        if (context.security_monitoring) {
            try self.validate_security_constraints(input, context, &result);
        }
        
        // Step 5: ABI validation (if applicable)
        if (self.config.strict_abi_validation) {
            try self.validate_abi_compliance(input, context, &result);
        }
        
        // Step 6: Custom rule validation
        try self.rule_engine.validate_custom_rules(input, context, &result);
        
        // Step 7: Fuzzing resistance checks
        if (self.config.enable_fuzzing_resistance) {
            try self.validate_fuzzing_resistance(input, context, &result);
        }
        
        return result;
    }
    
    fn validate_input_type(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = self;
        
        switch (input) {
            .transaction => |tx_input| {
                if (context.input_type != .Transaction) {
                    try result.add_violation(.{
                        .violation_type = .TypeMismatch,
                        .severity = .Critical,
                        .message = "Input type mismatch: expected transaction",
                        .location = null,
                    });
                }
                
                // Validate transaction fields
                if (tx_input.to != null and tx_input.to.?.bytes.len != 20) {
                    try result.add_violation(.{
                        .violation_type = .InvalidAddress,
                        .severity = .Critical,
                        .message = "Invalid address length",
                        .location = .{ .field = "to" },
                    });
                }
                
                if (tx_input.data.len > 1024 * 1024) { // 1MB limit
                    try result.add_violation(.{
                        .violation_type = .ExcessiveSize,
                        .severity = .High,
                        .message = "Transaction data exceeds maximum size",
                        .location = .{ .field = "data" },
                    });
                }
            },
            .bytecode => |bc_input| {
                if (context.input_type != .Bytecode) {
                    try result.add_violation(.{
                        .violation_type = .TypeMismatch,
                        .severity = .Critical,
                        .message = "Input type mismatch: expected bytecode",
                        .location = null,
                    });
                }
                
                if (bc_input.code.len > 24 * 1024) { // EIP-170 limit
                    try result.add_violation(.{
                        .violation_type = .ExcessiveSize,
                        .severity = .Critical,
                        .message = "Bytecode exceeds EIP-170 size limit",
                        .location = .{ .field = "code" },
                    });
                }
            },
            .contract_call => |call_input| {
                if (context.input_type != .ContractCall) {
                    try result.add_violation(.{
                        .violation_type = .TypeMismatch,
                        .severity = .Critical,
                        .message = "Input type mismatch: expected contract call",
                        .location = null,
                    });
                }
                
                if (call_input.target.bytes.len != 20) {
                    try result.add_violation(.{
                        .violation_type = .InvalidAddress,
                        .severity = .Critical,
                        .message = "Invalid contract address length",
                        .location = .{ .field = "target" },
                    });
                }
            },
            .storage_key => |key_input| {
                if (key_input.len != 32) {
                    try result.add_violation(.{
                        .violation_type = .InvalidSize,
                        .severity = .Critical,
                        .message = "Storage key must be 32 bytes",
                        .location = .{ .field = "key" },
                    });
                }
            },
        }
    }
    
    fn validate_input_ranges(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = self;
        _ = context;
        
        switch (input) {
            .transaction => |tx_input| {
                // Validate gas limits
                if (tx_input.gas_limit == 0) {
                    try result.add_violation(.{
                        .violation_type = .InvalidRange,
                        .severity = .High,
                        .message = "Gas limit cannot be zero",
                        .location = .{ .field = "gas_limit" },
                    });
                }
                
                if (tx_input.gas_limit > 30000000) { // Block gas limit
                    try result.add_violation(.{
                        .violation_type = .InvalidRange,
                        .severity = .Medium,
                        .message = "Gas limit exceeds block gas limit",
                        .location = .{ .field = "gas_limit" },
                    });
                }
                
                // Validate gas price
                if (tx_input.gas_price != null and tx_input.gas_price.? == 0 and tx_input.value > 0) {
                    try result.add_violation(.{
                        .violation_type = .InvalidRange,
                        .severity = .Medium,
                        .message = "Zero gas price with non-zero value",
                        .location = .{ .field = "gas_price" },
                    });
                }
            },
            .contract_call => |call_input| {
                // Validate call depth
                if (call_input.call_depth > 1024) {
                    try result.add_violation(.{
                        .violation_type = .InvalidRange,
                        .severity = .Critical,
                        .message = "Call depth exceeds maximum limit",
                        .location = .{ .field = "call_depth" },
                    });
                }
                
                // Validate gas
                if (call_input.gas == 0 and call_input.data.len > 0) {
                    try result.add_violation(.{
                        .violation_type = .InvalidRange,
                        .severity = .High,
                        .message = "Zero gas with non-empty data",
                        .location = .{ .field = "gas" },
                    });
                }
            },
            else => {},
        }
    }
    
    fn validate_input_format(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = self;
        _ = context;
        
        switch (input) {
            .bytecode => |bc_input| {
                // Validate bytecode format
                if (bc_input.code.len == 0) {
                    try result.add_violation(.{
                        .violation_type = .InvalidFormat,
                        .severity = .Low,
                        .message = "Empty bytecode",
                        .location = .{ .field = "code" },
                    });
                    return;
                }
                
                // Check for invalid opcodes
                var i: usize = 0;
                while (i < bc_input.code.len) {
                    const opcode = bc_input.code[i];
                    
                    // Check for undefined opcodes
                    if (opcode >= 0x0C and opcode <= 0x0F) {
                        try result.add_violation(.{
                            .violation_type = .InvalidOpcode,
                            .severity = .High,
                            .message = "Undefined opcode in bytecode",
                            .location = .{ .byte_offset = i },
                        });
                    }
                    
                    // Skip PUSH data
                    if (opcode >= 0x60 and opcode <= 0x7F) {
                        const push_size = opcode - 0x5F;
                        i += push_size;
                    }
                    
                    i += 1;
                }
                
                // Validate JUMPDEST positions
                try self.validate_jumpdest_positions(bc_input.code, result);
            },
            .contract_call => |call_input| {
                // Validate function selector format
                if (call_input.data.len >= 4) {
                    const selector = call_input.data[0..4];
                    
                    // Check for known malicious selectors
                    const malicious_selectors = [_][4]u8{
                        .{ 0xDE, 0xAD, 0xBE, 0xEF }, // Example malicious selector
                        .{ 0x00, 0x00, 0x00, 0x00 }, // Null selector
                    };
                    
                    for (malicious_selectors) |mal_selector| {
                        if (std.mem.eql(u8, selector, &mal_selector)) {
                            try result.add_violation(.{
                                .violation_type = .SecurityViolation,
                                .severity = .High,
                                .message = "Potentially malicious function selector",
                                .location = .{ .byte_offset = 0 },
                            });
                        }
                    }
                }
            },
            else => {},
        }
    }
    
    fn validate_security_constraints(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = context;
        
        // Security monitoring
        try self.security_monitor.analyze_input(input, result);
        
        switch (input) {
            .transaction => |tx_input| {
                // Check for potential reentrancy patterns
                if (tx_input.data.len > 100) {
                    var call_count: u32 = 0;
                    var i: usize = 0;
                    while (i < tx_input.data.len - 3) {
                        if (tx_input.data[i] == 0xF1) { // CALL opcode
                            call_count += 1;
                        }
                        i += 1;
                    }
                    
                    if (call_count > 10) {
                        try result.add_violation(.{
                            .violation_type = .SecurityViolation,
                            .severity = .High,
                            .message = "Excessive CALL operations detected",
                            .location = .{ .field = "data" },
                        });
                    }
                }
                
                // Check for unusual gas patterns
                if (tx_input.gas_limit > 0 and tx_input.gas_price != null) {
                    const total_cost = tx_input.gas_limit * tx_input.gas_price.?;
                    if (total_cost > 1000000000000000000) { // 1 ETH
                        try result.add_violation(.{
                            .violation_type = .SecurityViolation,
                            .severity = .Medium,
                            .message = "Unusually high transaction cost",
                            .location = null,
                        });
                    }
                }
            },
            .bytecode => |bc_input| {
                // Check for potential backdoors
                if (self.contains_potential_backdoor(bc_input.code)) {
                    try result.add_violation(.{
                        .violation_type = .SecurityViolation,
                        .severity = .Critical,
                        .message = "Potential backdoor pattern detected",
                        .location = .{ .field = "code" },
                    });
                }
                
                // Check for infinite loops
                if (self.contains_potential_infinite_loop(bc_input.code)) {
                    try result.add_violation(.{
                        .violation_type = .SecurityViolation,
                        .severity = .High,
                        .message = "Potential infinite loop detected",
                        .location = .{ .field = "code" },
                    });
                }
            },
            else => {},
        }
    }
    
    fn validate_abi_compliance(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = self;
        _ = context;
        
        switch (input) {
            .contract_call => |call_input| {
                if (call_input.data.len < 4) {
                    try result.add_violation(.{
                        .violation_type = .AbiViolation,
                        .severity = .Medium,
                        .message = "Call data too short for function selector",
                        .location = .{ .field = "data" },
                    });
                    return;
                }
                
                // Validate ABI encoding
                const function_data = call_input.data[4..];
                if (function_data.len % 32 != 0) {
                    try result.add_violation(.{
                        .violation_type = .AbiViolation,
                        .severity = .Medium,
                        .message = "Function arguments not properly ABI-encoded",
                        .location = .{ .byte_offset = 4 },
                    });
                }
                
                // Check for potential ABI spoofing
                if (function_data.len > 1024 and self.is_potential_abi_spoof(function_data)) {
                    try result.add_violation(.{
                        .violation_type = .AbiViolation,
                        .severity = .High,
                        .message = "Potential ABI spoofing detected",
                        .location = .{ .field = "data" },
                    });
                }
            },
            else => {},
        }
    }
    
    fn validate_fuzzing_resistance(
        self: *InputValidationManager,
        input: InputData,
        context: ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = self;
        _ = context;
        
        switch (input) {
            .transaction => |tx_input| {
                // Check for fuzzing patterns
                if (self.is_fuzzing_pattern(tx_input.data)) {
                    try result.add_violation(.{
                        .violation_type = .FuzzingDetected,
                        .severity = .Low,
                        .message = "Potential fuzzing input detected",
                        .location = .{ .field = "data" },
                    });
                }
            },
            .bytecode => |bc_input| {
                // Check for unusual bytecode patterns
                if (self.has_unusual_bytecode_pattern(bc_input.code)) {
                    try result.add_violation(.{
                        .violation_type = .FuzzingDetected,
                        .severity = .Low,
                        .message = "Unusual bytecode pattern detected",
                        .location = .{ .field = "code" },
                    });
                }
            },
            else => {},
        }
    }
    
    fn validate_jumpdest_positions(
        self: *InputValidationManager,
        code: []const u8,
        result: *ValidationResult
    ) !void {
        _ = self;
        
        var i: usize = 0;
        while (i < code.len) {
            const opcode = code[i];
            
            // If this is a JUMP or JUMPI, validate the destination
            if (opcode == 0x56 or opcode == 0x57) { // JUMP or JUMPI
                // This is a simplified check - in practice, you'd need to
                // track stack state to know the jump destination
                if (i + 1 < code.len and code[i + 1] != 0x5B) { // Not followed by JUMPDEST
                    // This is just an example - real validation would be more complex
                }
            }
            
            // Skip PUSH data
            if (opcode >= 0x60 and opcode <= 0x7F) {
                const push_size = opcode - 0x5F;
                i += push_size;
            }
            
            i += 1;
        }
    }
    
    fn contains_potential_backdoor(self: *InputValidationManager, code: []const u8) bool {
        _ = self;
        
        // Look for suspicious patterns like hidden SELFDESTRUCT
        var i: usize = 0;
        while (i < code.len - 10) {
            // Look for pattern: CALLER, ORIGIN, EQ, some jumps, SELFDESTRUCT
            if (code[i] == 0x33 and // CALLER
                i + 4 < code.len and code[i + 1] == 0x32 and // ORIGIN
                code[i + 2] == 0x14) // EQ
            {
                // Scan ahead for SELFDESTRUCT
                var j: usize = i + 3;
                while (j < @min(i + 50, code.len)) {
                    if (code[j] == 0xFF) { // SELFDESTRUCT
                        return true;
                    }
                    j += 1;
                }
            }
            i += 1;
        }
        
        return false;
    }
    
    fn contains_potential_infinite_loop(self: *InputValidationManager, code: []const u8) bool {
        _ = self;
        
        // Look for tight loops without gas-consuming operations
        var i: usize = 0;
        while (i < code.len - 5) {
            // Look for JUMPDEST followed by immediate unconditional JUMP back
            if (code[i] == 0x5B) { // JUMPDEST
                var j: usize = i + 1;
                var gas_consuming_ops: u32 = 0;
                
                // Scan next few instructions
                while (j < @min(i + 20, code.len)) {
                    const op = code[j];
                    
                    // Count gas-consuming operations
                    if (op == 0x54 or op == 0x55 or // SLOAD, SSTORE
                        op == 0xF1 or op == 0xF4 or // CALL, DELEGATECALL
                        op == 0x20) // KECCAK256
                    {
                        gas_consuming_ops += 1;
                    }
                    
                    // If we find a JUMP back to same position with no gas consumption
                    if (op == 0x56 and gas_consuming_ops == 0) { // JUMP
                        return true;
                    }
                    
                    j += 1;
                }
            }
            i += 1;
        }
        
        return false;
    }
    
    fn is_potential_abi_spoof(self: *InputValidationManager, data: []const u8) bool {
        _ = self;
        
        // Check for repeated patterns that might indicate ABI spoofing
        if (data.len < 64) return false;
        
        var repeated_chunks: u32 = 0;
        var i: usize = 0;
        while (i < data.len - 32) {
            const chunk1 = data[i..i + 32];
            var j: usize = i + 32;
            while (j < data.len - 32) {
                const chunk2 = data[j..j + 32];
                if (std.mem.eql(u8, chunk1, chunk2)) {
                    repeated_chunks += 1;
                }
                j += 32;
            }
            i += 32;
        }
        
        // If more than 25% of chunks are repeated, it's suspicious
        const total_chunks = data.len / 32;
        return repeated_chunks > total_chunks / 4;
    }
    
    fn is_fuzzing_pattern(self: *InputValidationManager, data: []const u8) bool {
        _ = self;
        
        if (data.len < 16) return false;
        
        // Check for high entropy (random-looking data)
        var byte_counts = [_]u32{0} ** 256;
        for (data) |byte| {
            byte_counts[byte] += 1;
        }
        
        // Calculate simple entropy measure
        var non_zero_bytes: u32 = 0;
        for (byte_counts) |count| {
            if (count > 0) non_zero_bytes += 1;
        }
        
        // If more than 80% of possible byte values are present, it's likely fuzzing
        return non_zero_bytes > 204; // 80% of 256
    }
    
    fn has_unusual_bytecode_pattern(self: *InputValidationManager, code: []const u8) bool {
        _ = self;
        
        if (code.len < 32) return false;
        
        // Check for unusual opcode distribution
        var opcode_counts = [_]u32{0} ** 256;
        for (code) |opcode| {
            opcode_counts[opcode] += 1;
        }
        
        // Check for excessive use of rare opcodes
        const rare_opcodes = [_]u8{ 0x0A, 0x0B, 0x44, 0x45, 0xF0, 0xF5, 0xFF }; // EXP, SIGNEXTEND, DIFFICULTY, GASLIMIT, CREATE, CREATE2, SELFDESTRUCT
        var rare_count: u32 = 0;
        for (rare_opcodes) |opcode| {
            rare_count += opcode_counts[opcode];
        }
        
        // If more than 10% of instructions are rare opcodes, it's unusual
        return rare_count > code.len / 10;
    }
    
    pub const ValidationContext = struct {
        input_type: InputType,
        validation_level: ValidationConfig.ValidationLevel,
        sanitization_level: ValidationConfig.SanitizationLevel,
        security_monitoring: bool,
        timeout_ms: u64,
        
        pub const InputType = enum {
            Transaction,
            Bytecode,
            ContractCall,
            StorageKey,
            Custom,
        };
    };
    
    pub const TransactionInput = struct {
        to: ?Address,
        value: u256,
        data: []const u8,
        gas_limit: u64,
        gas_price: ?u64,
        max_fee_per_gas: ?u64,
        max_priority_fee_per_gas: ?u64,
        nonce: u64,
        from: Address,
    };
    
    pub const BytecodeInput = struct {
        code: []const u8,
        is_creation: bool,
        compiler_version: ?[]const u8,
        optimization_enabled: bool,
    };
    
    pub const ContractCallInput = struct {
        target: Address,
        data: []const u8,
        value: u256,
        gas: u64,
        call_depth: u32,
        is_static: bool,
    };
    
    pub const InputData = union(enum) {
        transaction: TransactionInput,
        bytecode: BytecodeInput,
        contract_call: ContractCallInput,
        storage_key: []const u8,
    };
    
    pub const SanitizedInput = struct {
        original: InputData,
        sanitized: InputData,
        changes_made: []const SanitizationChange,
        
        pub const SanitizationChange = struct {
            field: []const u8,
            change_type: ChangeType,
            description: []const u8,
            
            pub const ChangeType = enum {
                Normalization,
                Truncation,
                Padding,
                Encoding,
                Filtering,
            };
        };
        
        pub fn from_raw(input: InputData) SanitizedInput {
            return SanitizedInput{
                .original = input,
                .sanitized = input,
                .changes_made = &[_]SanitizationChange{},
            };
        }
    };
};
```

#### 2. Validation Result System
```zig
pub const ValidationResult = struct {
    allocator: std.mem.Allocator,
    is_valid: bool,
    violations: std.ArrayList(ValidationViolation),
    warnings: std.ArrayList(ValidationWarning),
    performance_metrics: ValidationMetrics,
    
    pub const ValidationViolation = struct {
        violation_type: ViolationType,
        severity: Severity,
        message: []const u8,
        location: ?Location,
        suggested_fix: ?[]const u8,
        
        pub const ViolationType = enum {
            TypeMismatch,
            InvalidRange,
            InvalidFormat,
            InvalidSize,
            InvalidAddress,
            InvalidOpcode,
            ExcessiveSize,
            SecurityViolation,
            AbiViolation,
            FuzzingDetected,
            CustomRule,
        };
        
        pub const Severity = enum {
            Low,
            Medium,
            High,
            Critical,
        };
        
        pub const Location = union(enum) {
            field: []const u8,
            byte_offset: usize,
            line_number: u32,
            opcode_position: u32,
        };
    };
    
    pub const ValidationWarning = struct {
        warning_type: WarningType,
        message: []const u8,
        location: ?ValidationViolation.Location,
        recommendation: ?[]const u8,
        
        pub const WarningType = enum {
            PerformanceImpact,
            CompatibilityIssue,
            BestPracticeViolation,
            SecurityConcern,
            GasInefficiency,
        };
    };
    
    pub const ValidationMetrics = struct {
        validation_time_ns: u64,
        rules_checked: u32,
        violations_found: u32,
        warnings_generated: u32,
        complexity_score: u32,
    };
    
    pub fn init(allocator: std.mem.Allocator) ValidationResult {
        return ValidationResult{
            .allocator = allocator,
            .is_valid = true,
            .violations = std.ArrayList(ValidationViolation).init(allocator),
            .warnings = std.ArrayList(ValidationWarning).init(allocator),
            .performance_metrics = std.mem.zeroes(ValidationMetrics),
        };
    }
    
    pub fn deinit(self: *ValidationResult) void {
        for (self.violations.items) |violation| {
            self.allocator.free(violation.message);
            if (violation.suggested_fix) |fix| {
                self.allocator.free(fix);
            }
        }
        for (self.warnings.items) |warning| {
            self.allocator.free(warning.message);
            if (warning.recommendation) |rec| {
                self.allocator.free(rec);
            }
        }
        self.violations.deinit();
        self.warnings.deinit();
    }
    
    pub fn success() ValidationResult {
        return ValidationResult{
            .allocator = std.heap.page_allocator,
            .is_valid = true,
            .violations = std.ArrayList(ValidationViolation).init(std.heap.page_allocator),
            .warnings = std.ArrayList(ValidationWarning).init(std.heap.page_allocator),
            .performance_metrics = std.mem.zeroes(ValidationMetrics),
        };
    }
    
    pub fn add_violation(self: *ValidationResult, violation: ValidationViolation) !void {
        self.is_valid = false;
        try self.violations.append(violation);
    }
    
    pub fn add_warning(self: *ValidationResult, warning: ValidationWarning) !void {
        try self.warnings.append(warning);
    }
    
    pub fn has_critical_violations(self: *const ValidationResult) bool {
        for (self.violations.items) |violation| {
            if (violation.severity == .Critical) {
                return true;
            }
        }
        return false;
    }
    
    pub fn get_severity_count(self: *const ValidationResult, severity: ValidationViolation.Severity) u32 {
        var count: u32 = 0;
        for (self.violations.items) |violation| {
            if (violation.severity == severity) {
                count += 1;
            }
        }
        return count;
    }
    
    pub fn print_summary(self: *const ValidationResult) void {
        std.log.info("=== VALIDATION RESULT SUMMARY ===");
        std.log.info("Valid: {}", .{self.is_valid});
        std.log.info("Violations: {}", .{self.violations.items.len});
        std.log.info("  Critical: {}", .{self.get_severity_count(.Critical)});
        std.log.info("  High: {}", .{self.get_severity_count(.High)});
        std.log.info("  Medium: {}", .{self.get_severity_count(.Medium)});
        std.log.info("  Low: {}", .{self.get_severity_count(.Low)});
        std.log.info("Warnings: {}", .{self.warnings.items.len});
        std.log.info("Rules checked: {}", .{self.performance_metrics.rules_checked});
        std.log.info("Validation time: {}ns", .{self.performance_metrics.validation_time_ns});
        
        if (self.violations.items.len > 0) {
            std.log.info("\nViolations:");
            for (self.violations.items) |violation| {
                std.log.info("  [{}] {}: {}", .{ violation.severity, violation.violation_type, violation.message });
            }
        }
        
        if (self.warnings.items.len > 0) {
            std.log.info("\nWarnings:");
            for (self.warnings.items) |warning| {
                std.log.info("  [{}] {}", .{ warning.warning_type, warning.message });
            }
        }
    }
};
```

#### 3. Validator Registry
```zig
pub const ValidatorRegistry = struct {
    allocator: std.mem.Allocator,
    config: InputValidationManager.ValidationConfig,
    validators: std.HashMap(InputValidationManager.ValidationContext.InputType, Validator, InputTypeContext, std.hash_map.default_max_load_percentage),
    custom_validators: std.ArrayList(CustomValidator),
    
    pub const Validator = struct {
        validate_fn: *const fn(InputValidationManager.InputData, InputValidationManager.ValidationContext, *ValidationResult) anyerror!void,
        sanitize_fn: ?*const fn(InputValidationManager.InputData, InputValidationManager.ValidationContext) anyerror!InputValidationManager.SanitizedInput,
        name: []const u8,
        version: []const u8,
        capabilities: ValidatorCapabilities,
        
        pub const ValidatorCapabilities = struct {
            supports_sanitization: bool,
            supports_security_analysis: bool,
            supports_performance_analysis: bool,
            supports_abi_validation: bool,
            max_input_size: ?usize,
        };
    };
    
    pub const CustomValidator = struct {
        rule_id: []const u8,
        input_types: []const InputValidationManager.ValidationContext.InputType,
        validate_fn: *const fn(InputValidationManager.InputData, InputValidationManager.ValidationContext, *ValidationResult) anyerror!void,
        priority: ValidatorPriority,
        enabled: bool,
        
        pub const ValidatorPriority = enum {
            Low,
            Normal,
            High,
            Critical,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, config: InputValidationManager.ValidationConfig) !ValidatorRegistry {
        var registry = ValidatorRegistry{
            .allocator = allocator,
            .config = config,
            .validators = std.HashMap(InputValidationManager.ValidationContext.InputType, Validator, InputTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .custom_validators = std.ArrayList(CustomValidator).init(allocator),
        };
        
        try registry.register_default_validators();
        return registry;
    }
    
    pub fn deinit(self: *ValidatorRegistry) void {
        self.validators.deinit();
        self.custom_validators.deinit();
    }
    
    fn register_default_validators(self: *ValidatorRegistry) !void {
        // Transaction validator
        try self.validators.put(.Transaction, Validator{
            .validate_fn = TransactionValidator.validate,
            .sanitize_fn = TransactionValidator.sanitize,
            .name = "transaction_validator",
            .version = "1.0.0",
            .capabilities = Validator.ValidatorCapabilities{
                .supports_sanitization = true,
                .supports_security_analysis = true,
                .supports_performance_analysis = false,
                .supports_abi_validation = false,
                .max_input_size = 1024 * 1024, // 1MB
            },
        });
        
        // Bytecode validator
        try self.validators.put(.Bytecode, Validator{
            .validate_fn = BytecodeValidator.validate,
            .sanitize_fn = BytecodeValidator.sanitize,
            .name = "bytecode_validator",
            .version = "1.0.0",
            .capabilities = Validator.ValidatorCapabilities{
                .supports_sanitization = false,
                .supports_security_analysis = true,
                .supports_performance_analysis = true,
                .supports_abi_validation = false,
                .max_input_size = 24 * 1024, // 24KB
            },
        });
        
        // Contract call validator
        try self.validators.put(.ContractCall, Validator{
            .validate_fn = ContractCallValidator.validate,
            .sanitize_fn = ContractCallValidator.sanitize,
            .name = "contract_call_validator",
            .version = "1.0.0",
            .capabilities = Validator.ValidatorCapabilities{
                .supports_sanitization = true,
                .supports_security_analysis = true,
                .supports_performance_analysis = false,
                .supports_abi_validation = true,
                .max_input_size = 1024 * 1024, // 1MB
            },
        });
    }
    
    pub fn get_validator(self: *const ValidatorRegistry, input_type: InputValidationManager.ValidationContext.InputType) ?*const Validator {
        return self.validators.getPtr(input_type);
    }
    
    pub fn register_custom_validator(self: *ValidatorRegistry, validator: CustomValidator) !void {
        try self.custom_validators.append(validator);
    }
    
    pub fn execute_custom_validators(
        self: *ValidatorRegistry,
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext,
        result: *ValidationResult
    ) !void {
        for (self.custom_validators.items) |validator| {
            if (!validator.enabled) continue;
            
            // Check if validator applies to this input type
            var applies = false;
            for (validator.input_types) |supported_type| {
                if (supported_type == context.input_type) {
                    applies = true;
                    break;
                }
            }
            
            if (applies) {
                try validator.validate_fn(input, context, result);
            }
        }
    }
    
    pub const InputTypeContext = struct {
        pub fn hash(self: @This(), key: InputValidationManager.ValidationContext.InputType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: InputValidationManager.ValidationContext.InputType, b: InputValidationManager.ValidationContext.InputType) bool {
            _ = self;
            return a == b;
        }
    };
};

// Default validator implementations
pub const TransactionValidator = struct {
    pub fn validate(
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = context;
        
        const tx = input.transaction;
        
        // Validate transaction structure
        if (tx.nonce > std.math.maxInt(u64) - 1000) {
            try result.add_violation(.{
                .violation_type = .InvalidRange,
                .severity = .High,
                .message = "Nonce approaching maximum value",
                .location = .{ .field = "nonce" },
                .suggested_fix = null,
            });
        }
        
        // Validate gas economics
        if (tx.gas_limit > 0 and tx.gas_price != null and tx.gas_price.? > 0) {
            const total_cost = tx.gas_limit * tx.gas_price.?;
            const max_reasonable_cost = 1000000000000000000; // 1 ETH in wei
            
            if (total_cost > max_reasonable_cost) {
                try result.add_warning(.{
                    .warning_type = .SecurityConcern,
                    .message = "Transaction cost exceeds reasonable limit",
                    .location = .{ .field = "gas_price" },
                    .recommendation = "Review gas price and limit",
                });
            }
        }
    }
    
    pub fn sanitize(
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext
    ) !InputValidationManager.SanitizedInput {
        _ = context;
        
        // For now, just return the input as-is
        // In practice, you might normalize addresses, truncate data, etc.
        return InputValidationManager.SanitizedInput.from_raw(input);
    }
};

pub const BytecodeValidator = struct {
    pub fn validate(
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = context;
        
        const bytecode = input.bytecode;
        
        // Validate bytecode length
        if (bytecode.code.len == 0 and bytecode.is_creation) {
            try result.add_violation(.{
                .violation_type = .InvalidSize,
                .severity = .Critical,
                .message = "Creation bytecode cannot be empty",
                .location = .{ .field = "code" },
                .suggested_fix = null,
            });
        }
        
        // Check for known problematic patterns
        if (bytecode.code.len > 1000) {
            var selfdestruct_count: u32 = 0;
            for (bytecode.code) |opcode| {
                if (opcode == 0xFF) { // SELFDESTRUCT
                    selfdestruct_count += 1;
                }
            }
            
            if (selfdestruct_count > 5) {
                try result.add_warning(.{
                    .warning_type = .SecurityConcern,
                    .message = "Unusually high number of SELFDESTRUCT opcodes",
                    .location = .{ .field = "code" },
                    .recommendation = "Review contract logic for potential issues",
                });
            }
        }
    }
    
    pub fn sanitize(
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext
    ) !InputValidationManager.SanitizedInput {
        _ = context;
        
        // Bytecode generally shouldn't be sanitized as it would break functionality
        return InputValidationManager.SanitizedInput.from_raw(input);
    }
};

pub const ContractCallValidator = struct {
    pub fn validate(
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext,
        result: *ValidationResult
    ) !void {
        _ = context;
        
        const call = input.contract_call;
        
        // Validate call parameters
        if (call.gas == 0 and call.data.len > 0) {
            try result.add_violation(.{
                .violation_type = .InvalidRange,
                .severity = .High,
                .message = "Zero gas provided for non-empty call data",
                .location = .{ .field = "gas" },
                .suggested_fix = "Provide adequate gas for the operation",
            });
        }
        
        // Check for reasonable call depth
        if (call.call_depth > 900) {
            try result.add_warning(.{
                .warning_type = .PerformanceImpact,
                .message = "High call depth may impact performance",
                .location = .{ .field = "call_depth" },
                .recommendation = "Consider optimizing contract design to reduce call depth",
            });
        }
        
        // Validate static call constraints
        if (call.is_static and call.value > 0) {
            try result.add_violation(.{
                .violation_type = .InvalidFormat,
                .severity = .Critical,
                .message = "Static calls cannot transfer value",
                .location = .{ .field = "value" },
                .suggested_fix = "Remove value from static call or use regular call",
            });
        }
    }
    
    pub fn sanitize(
        input: InputValidationManager.InputData,
        context: InputValidationManager.ValidationContext
    ) !InputValidationManager.SanitizedInput {
        _ = context;
        
        var call = input.contract_call;
        var changes = std.ArrayList(InputValidationManager.SanitizedInput.SanitizationChange).init(std.heap.page_allocator);
        defer changes.deinit();
        
        // Sanitize call data by removing null bytes at the end
        var sanitized_data = call.data;
        while (sanitized_data.len > 0 and sanitized_data[sanitized_data.len - 1] == 0) {
            sanitized_data = sanitized_data[0..sanitized_data.len - 1];
        }
        
        if (sanitized_data.len != call.data.len) {
            try changes.append(.{
                .field = "data",
                .change_type = .Truncation,
                .description = "Removed trailing null bytes",
            });
            call.data = sanitized_data;
        }
        
        return InputValidationManager.SanitizedInput{
            .original = input,
            .sanitized = .{ .contract_call = call },
            .changes_made = try changes.toOwnedSlice(),
        };
    }
};
```

#### 4. Security Monitor
```zig
pub const SecurityMonitor = struct {
    allocator: std.mem.Allocator,
    config: InputValidationManager.ValidationConfig,
    threat_patterns: ThreatPatternDatabase,
    anomaly_detector: AnomalyDetector,
    security_metrics: SecurityMetrics,
    
    pub const ThreatPatternDatabase = struct {
        known_malicious_selectors: std.HashMap([4]u8, ThreatInfo, SelectorContext, std.hash_map.default_max_load_percentage),
        suspicious_bytecode_patterns: std.ArrayList(BytecodePattern),
        known_vulnerable_patterns: std.ArrayList(VulnerabilityPattern),
        
        pub const ThreatInfo = struct {
            threat_type: ThreatType,
            severity: ValidationResult.ValidationViolation.Severity,
            description: []const u8,
            first_seen: i64,
            
            pub const ThreatType = enum {
                KnownMalicious,
                Phishing,
                Reentrancy,
                Overflow,
                Backdoor,
                Honeypot,
            };
        };
        
        pub const BytecodePattern = struct {
            pattern: []const u8,
            threat_type: ThreatInfo.ThreatType,
            description: []const u8,
        };
        
        pub const VulnerabilityPattern = struct {
            name: []const u8,
            opcodes: []const u8,
            context_requirements: []const u8,
            severity: ValidationResult.ValidationViolation.Severity,
        };
        
        pub fn init(allocator: std.mem.Allocator) ThreatPatternDatabase {
            return ThreatPatternDatabase{
                .known_malicious_selectors = std.HashMap([4]u8, ThreatInfo, SelectorContext, std.hash_map.default_max_load_percentage).init(allocator),
                .suspicious_bytecode_patterns = std.ArrayList(BytecodePattern).init(allocator),
                .known_vulnerable_patterns = std.ArrayList(VulnerabilityPattern).init(allocator),
            };
        }
        
        pub fn deinit(self: *ThreatPatternDatabase) void {
            self.known_malicious_selectors.deinit();
            self.suspicious_bytecode_patterns.deinit();
            self.known_vulnerable_patterns.deinit();
        }
        
        pub const SelectorContext = struct {
            pub fn hash(self: @This(), key: [4]u8) u64 {
                _ = self;
                return std.hash_map.hashString(&key);
            }
            
            pub fn eql(self: @This(), a: [4]u8, b: [4]u8) bool {
                _ = self;
                return std.mem.eql(u8, &a, &b);
            }
        };
    };
    
    pub const AnomalyDetector = struct {
        baseline_metrics: BaselineMetrics,
        current_metrics: CurrentMetrics,
        anomaly_threshold: f64,
        
        pub const BaselineMetrics = struct {
            average_transaction_size: f64,
            average_gas_usage: f64,
            common_function_selectors: std.HashMap([4]u8, u32, ThreatPatternDatabase.SelectorContext, std.hash_map.default_max_load_percentage),
            typical_call_depths: std.ArrayList(u32),
        };
        
        pub const CurrentMetrics = struct {
            transaction_size: usize,
            gas_usage: u64,
            function_selector: ?[4]u8,
            call_depth: u32,
            unusual_patterns: std.ArrayList([]const u8),
        };
        
        pub fn init(allocator: std.mem.Allocator) AnomalyDetector {
            return AnomalyDetector{
                .baseline_metrics = BaselineMetrics{
                    .average_transaction_size = 0,
                    .average_gas_usage = 0,
                    .common_function_selectors = std.HashMap([4]u8, u32, ThreatPatternDatabase.SelectorContext, std.hash_map.default_max_load_percentage).init(allocator),
                    .typical_call_depths = std.ArrayList(u32).init(allocator),
                },
                .current_metrics = CurrentMetrics{
                    .transaction_size = 0,
                    .gas_usage = 0,
                    .function_selector = null,
                    .call_depth = 0,
                    .unusual_patterns = std.ArrayList([]const u8).init(allocator),
                },
                .anomaly_threshold = 2.0, // 2 standard deviations
            };
        }
        
        pub fn deinit(self: *AnomalyDetector) void {
            self.baseline_metrics.common_function_selectors.deinit();
            self.baseline_metrics.typical_call_depths.deinit();
            self.current_metrics.unusual_patterns.deinit();
        }
    };
    
    pub const SecurityMetrics = struct {
        threats_detected: u64,
        anomalies_detected: u64,
        false_positives: u64,
        validation_bypasses: u64,
        performance_impact_ns: u64,
        
        pub fn init() SecurityMetrics {
            return std.mem.zeroes(SecurityMetrics);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: InputValidationManager.ValidationConfig) !SecurityMonitor {
        var monitor = SecurityMonitor{
            .allocator = allocator,
            .config = config,
            .threat_patterns = ThreatPatternDatabase.init(allocator),
            .anomaly_detector = AnomalyDetector.init(allocator),
            .security_metrics = SecurityMetrics.init(),
        };
        
        try monitor.load_threat_patterns();
        return monitor;
    }
    
    pub fn deinit(self: *SecurityMonitor) void {
        self.threat_patterns.deinit();
        self.anomaly_detector.deinit();
    }
    
    pub fn analyze_input(
        self: *SecurityMonitor,
        input: InputValidationManager.InputData,
        result: *ValidationResult
    ) !void {
        const start_time = std.time.nanoTimestamp();
        
        // Check against known threat patterns
        try self.check_threat_patterns(input, result);
        
        // Perform anomaly detection
        try self.detect_anomalies(input, result);
        
        // Check for known vulnerabilities
        try self.check_vulnerability_patterns(input, result);
        
        // Update security metrics
        const end_time = std.time.nanoTimestamp();
        self.security_metrics.performance_impact_ns += @intCast(end_time - start_time);
        
        if (result.violations.items.len > 0) {
            self.security_metrics.threats_detected += 1;
        }
    }
    
    fn load_threat_patterns(self: *SecurityMonitor) !void {
        // Load known malicious function selectors
        const malicious_selectors = [_]struct { selector: [4]u8, info: ThreatPatternDatabase.ThreatInfo }{
            .{
                .selector = .{ 0x1f, 0x4f, 0xc3, 0xa8 }, // Example malicious selector
                .info = .{
                    .threat_type = .KnownMalicious,
                    .severity = .Critical,
                    .description = "Known phishing function",
                    .first_seen = std.time.milliTimestamp(),
                },
            },
            .{
                .selector = .{ 0xa9, 0x05, 0x9c, 0xbb }, // Another example
                .info = .{
                    .threat_type = .Backdoor,
                    .severity = .High,
                    .description = "Potential backdoor function",
                    .first_seen = std.time.milliTimestamp(),
                },
            },
        };
        
        for (malicious_selectors) |entry| {
            try self.threat_patterns.known_malicious_selectors.put(entry.selector, entry.info);
        }
        
        // Load suspicious bytecode patterns
        const bytecode_patterns = [_]ThreatPatternDatabase.BytecodePattern{
            .{
                .pattern = &[_]u8{ 0x33, 0x32, 0x14, 0x56 }, // CALLER ORIGIN EQ JUMP pattern
                .threat_type = .Backdoor,
                .description = "Admin backdoor pattern",
            },
            .{
                .pattern = &[_]u8{ 0xFF }, // SELFDESTRUCT
                .threat_type = .KnownMalicious,
                .description = "Self-destruct pattern",
            },
        };
        
        for (bytecode_patterns) |pattern| {
            try self.threat_patterns.suspicious_bytecode_patterns.append(pattern);
        }
    }
    
    fn check_threat_patterns(
        self: *SecurityMonitor,
        input: InputValidationManager.InputData,
        result: *ValidationResult
    ) !void {
        switch (input) {
            .contract_call => |call| {
                if (call.data.len >= 4) {
                    const selector: [4]u8 = call.data[0..4].*;
                    
                    if (self.threat_patterns.known_malicious_selectors.get(selector)) |threat_info| {
                        try result.add_violation(.{
                            .violation_type = .SecurityViolation,
                            .severity = threat_info.severity,
                            .message = threat_info.description,
                            .location = .{ .byte_offset = 0 },
                            .suggested_fix = "Avoid calling this function",
                        });
                    }
                }
            },
            .bytecode => |bytecode| {
                for (self.threat_patterns.suspicious_bytecode_patterns.items) |pattern| {
                    if (self.contains_pattern(bytecode.code, pattern.pattern)) {
                        try result.add_violation(.{
                            .violation_type = .SecurityViolation,
                            .severity = .High,
                            .message = pattern.description,
                            .location = .{ .field = "code" },
                            .suggested_fix = "Review bytecode for security issues",
                        });
                    }
                }
            },
            else => {},
        }
    }
    
    fn detect_anomalies(
        self: *SecurityMonitor,
        input: InputValidationManager.InputData,
        result: *ValidationResult
    ) !void {
        switch (input) {
            .transaction => |tx| {
                // Check for unusual transaction size
                const size_deviation = self.calculate_size_deviation(tx.data.len);
                if (size_deviation > self.anomaly_detector.anomaly_threshold) {
                    try result.add_warning(.{
                        .warning_type = .SecurityConcern,
                        .message = "Unusual transaction size detected",
                        .location = .{ .field = "data" },
                        .recommendation = "Review transaction for potential anomalies",
                    });
                    self.security_metrics.anomalies_detected += 1;
                }
                
                // Check for unusual gas usage
                const gas_deviation = self.calculate_gas_deviation(tx.gas_limit);
                if (gas_deviation > self.anomaly_detector.anomaly_threshold) {
                    try result.add_warning(.{
                        .warning_type = .SecurityConcern,
                        .message = "Unusual gas limit detected",
                        .location = .{ .field = "gas_limit" },
                        .recommendation = "Verify gas limit is appropriate",
                    });
                    self.security_metrics.anomalies_detected += 1;
                }
            },
            .contract_call => |call| {
                // Check for unusual call depth
                if (call.call_depth > 500) {
                    try result.add_warning(.{
                        .warning_type = .SecurityConcern,
                        .message = "Unusually deep call stack detected",
                        .location = .{ .field = "call_depth" },
                        .recommendation = "Monitor for potential stack overflow attacks",
                    });
                    self.security_metrics.anomalies_detected += 1;
                }
            },
            else => {},
        }
    }
    
    fn check_vulnerability_patterns(
        self: *SecurityMonitor,
        input: InputValidationManager.InputData,
        result: *ValidationResult
    ) !void {
        switch (input) {
            .bytecode => |bytecode| {
                // Check for reentrancy vulnerability patterns
                if (self.has_reentrancy_pattern(bytecode.code)) {
                    try result.add_violation(.{
                        .violation_type = .SecurityViolation,
                        .severity = .High,
                        .message = "Potential reentrancy vulnerability detected",
                        .location = .{ .field = "code" },
                        .suggested_fix = "Implement reentrancy guards",
                    });
                }
                
                // Check for integer overflow patterns
                if (self.has_overflow_pattern(bytecode.code)) {
                    try result.add_warning(.{
                        .warning_type = .SecurityConcern,
                        .message = "Potential integer overflow risk",
                        .location = .{ .field = "code" },
                        .recommendation = "Use safe math libraries",
                    });
                }
            },
            else => {},
        }
    }
    
    fn contains_pattern(self: *SecurityMonitor, haystack: []const u8, needle: []const u8) bool {
        _ = self;
        
        if (needle.len == 0 or needle.len > haystack.len) return false;
        
        var i: usize = 0;
        while (i <= haystack.len - needle.len) {
            if (std.mem.eql(u8, haystack[i..i + needle.len], needle)) {
                return true;
            }
            i += 1;
        }
        return false;
    }
    
    fn calculate_size_deviation(self: *SecurityMonitor, size: usize) f64 {
        const baseline = self.anomaly_detector.baseline_metrics.average_transaction_size;
        if (baseline == 0) return 0;
        
        const size_f = @as(f64, @floatFromInt(size));
        return @abs(size_f - baseline) / baseline;
    }
    
    fn calculate_gas_deviation(self: *SecurityMonitor, gas: u64) f64 {
        const baseline = self.anomaly_detector.baseline_metrics.average_gas_usage;
        if (baseline == 0) return 0;
        
        const gas_f = @as(f64, @floatFromInt(gas));
        return @abs(gas_f - baseline) / baseline;
    }
    
    fn has_reentrancy_pattern(self: *SecurityMonitor, code: []const u8) bool {
        _ = self;
        
        // Look for CALL followed by SSTORE without proper guards
        var i: usize = 0;
        while (i < code.len - 10) {
            if (code[i] == 0xF1) { // CALL
                // Look for SSTORE within next few instructions
                var j: usize = i + 1;
                while (j < @min(i + 20, code.len)) {
                    if (code[j] == 0x55) { // SSTORE
                        return true;
                    }
                    j += 1;
                }
            }
            i += 1;
        }
        return false;
    }
    
    fn has_overflow_pattern(self: *SecurityMonitor, code: []const u8) bool {
        _ = self;
        
        // Look for ADD/MUL without overflow checks
        var i: usize = 0;
        while (i < code.len - 5) {
            if (code[i] == 0x01 or code[i] == 0x02) { // ADD or MUL
                // Check if followed by overflow detection patterns
                var has_check = false;
                var j: usize = i + 1;
                while (j < @min(i + 10, code.len)) {
                    if (code[j] == 0x10 or code[j] == 0x11) { // LT or GT (potential overflow check)
                        has_check = true;
                        break;
                    }
                    j += 1;
                }
                if (!has_check) {
                    return true;
                }
            }
            i += 1;
        }
        return false;
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Comprehensive Input Validation**: Validate all types of EVM inputs with configurable strictness levels
2. **Security Monitoring**: Real-time threat detection and anomaly analysis
3. **Sanitization Framework**: Clean and normalize inputs while preserving functionality
4. **Performance Optimization**: Efficient validation with minimal overhead
5. **Extensible Rule Engine**: Pluggable custom validation rules and patterns
6. **Detailed Reporting**: Comprehensive violation and warning reporting with suggested fixes

## Implementation Tasks

### Task 1: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const InputValidationManager = @import("input_validation/input_validation_manager.zig").InputValidationManager;

pub const Vm = struct {
    // Existing fields...
    input_validator: ?InputValidationManager,
    validation_enabled: bool,
    
    pub fn enable_input_validation(self: *Vm, config: InputValidationManager.ValidationConfig) !void {
        self.input_validator = try InputValidationManager.init(self.allocator, config);
        self.validation_enabled = true;
    }
    
    pub fn disable_input_validation(self: *Vm) void {
        if (self.input_validator) |*validator| {
            validator.deinit();
            self.input_validator = null;
        }
        self.validation_enabled = false;
    }
    
    pub fn validate_transaction_before_execution(
        self: *Vm,
        tx_input: InputValidationManager.TransactionInput
    ) !InputValidationManager.ValidationResult {
        if (self.input_validator) |*validator| {
            return try validator.validate_transaction_input(tx_input);
        }
        return InputValidationManager.ValidationResult.success();
    }
    
    pub fn validate_contract_call_before_execution(
        self: *Vm,
        call_input: InputValidationManager.ContractCallInput
    ) !InputValidationManager.ValidationResult {
        if (self.input_validator) |*validator| {
            return try validator.validate_contract_call_input(call_input);
        }
        return InputValidationManager.ValidationResult.success();
    }
    
    pub fn get_validation_stats(self: *Vm) ?InputValidationManager.ValidationPerformanceTracker.Metrics {
        if (self.input_validator) |*validator| {
            return validator.performance_tracker.get_metrics();
        }
        return null;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/input_validation/input_validation_test.zig`

### Test Cases
```zig
test "input validation manager initialization" {
    // Test manager creation with different configs
    // Test validator registry setup
    // Test security monitor initialization
}

test "transaction input validation" {
    // Test valid transaction validation
    // Test invalid transaction detection
    // Test security threat detection
}

test "bytecode input validation" {
    // Test valid bytecode validation
    // Test malicious bytecode detection
    // Test vulnerability pattern detection
}

test "contract call input validation" {
    // Test valid call validation
    // Test ABI compliance checking
    // Test security constraint validation
}

test "input sanitization functionality" {
    // Test data sanitization
    // Test normalization
    // Test sanitization change tracking
}

test "security monitoring and threat detection" {
    // Test threat pattern matching
    // Test anomaly detection
    // Test vulnerability scanning
}

test "performance and scalability" {
    // Test validation performance
    // Test large input handling
    // Test concurrent validation
}

test "integration with VM execution" {
    // Test VM integration
    // Test validation impact on execution
    // Test performance overhead measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/input_validation/input_validation_manager.zig` - Main validation framework
- `/src/evm/input_validation/validation_result.zig` - Result types and structures
- `/src/evm/input_validation/validator_registry.zig` - Validator management
- `/src/evm/input_validation/sanitizer_registry.zig` - Input sanitization
- `/src/evm/input_validation/validation_rule_engine.zig` - Custom rule processing
- `/src/evm/input_validation/security_monitor.zig` - Security analysis and monitoring
- `/src/evm/input_validation/performance_tracker.zig` - Performance monitoring
- `/src/evm/vm.zig` - VM integration with validation framework
- `/test/evm/input_validation/input_validation_test.zig` - Comprehensive tests

## Success Criteria

1. **Comprehensive Coverage**: Validation for all major input types (transactions, bytecode, calls)
2. **Security Enhancement**: Detection of known threats and vulnerability patterns
3. **Performance Efficiency**: <1% overhead for validation in performance-critical paths
4. **Flexibility**: Configurable validation levels for different use cases
5. **Extensibility**: Easy addition of custom validation rules and patterns
6. **Robust Reporting**: Detailed violation reports with actionable suggestions

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Security validation** - Must not introduce security vulnerabilities while validating inputs
3. **Performance validation** - Validation overhead must be minimal and measurable
4. **Correctness** - Validation must not reject valid EVM inputs
5. **Completeness** - Must handle all edge cases and malformed inputs gracefully
6. **Resource efficiency** - Memory and CPU usage must be optimized for production use

## References

- [Input Validation](https://owasp.org/www-project-proactive-controls/v3/en/c5-validate-inputs) - OWASP input validation guidelines
- [Security Patterns](https://en.wikipedia.org/wiki/Security_pattern) - Security design patterns
- [Anomaly Detection](https://en.wikipedia.org/wiki/Anomaly_detection) - Anomaly detection techniques
- [Data Sanitization](https://en.wikipedia.org/wiki/Data_sanitization) - Data cleaning and normalization
- [Threat Modeling](https://en.wikipedia.org/wiki/Threat_model) - Security threat analysis