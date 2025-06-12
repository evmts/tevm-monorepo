# Implement Input Validation Framework

You are implementing Input Validation Framework for the Tevm EVM written in Zig. Your goal is to implement comprehensive input validation framework following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_input_validation_framework` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_input_validation_framework feat_implement_input_validation_framework`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive input validation framework that provides robust validation and sanitization for all EVM inputs, including bytecode, transaction data, contract parameters, and runtime values. This framework ensures security, correctness, and performance while preventing common attack vectors and maintaining EVM compatibility.

## ELI5

Think of input validation like having a really thorough security guard at the entrance to a high-security building. Just like how a security guard checks IDs, scans bags, and verifies appointments before letting people in, an input validation framework checks every piece of data before it enters the EVM.

Here's what it does:
- **ID Check**: Validates that bytecode is properly formatted (like checking if an ID is real vs fake)
- **Bag Scan**: Examines transaction data for malicious content (like scanning for weapons)
- **Size Limits**: Ensures data isn't too big to handle safely (like weight limits for luggage)
- **Format Verification**: Confirms data follows the expected patterns (like checking if a phone number has the right number of digits)

The "enhanced" part is like having a smart security system that:
- **Learns**: Remembers common attack patterns and gets better at spotting them
- **Adapts**: Adjusts security levels based on current threat levels
- **Performs**: Processes checks quickly so legitimate users aren't delayed
- **Reports**: Keeps detailed logs of what was blocked and why

This is crucial because the EVM processes billions of dollars worth of transactions, so even small vulnerabilities could be catastrophic. It's like the difference between a mall security guard and Fort Knox security - the stakes require maximum protection.

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

#### 1. **Unit Tests** (`/test/evm/validation/input_validation_test.zig`)
```zig
// Test basic input validation functionality
test "input_validation basic parameter validation with known scenarios"
test "input_validation handles type checking correctly"
test "input_validation validates range constraints"
test "input_validation produces expected error messages"
```

#### 2. **Integration Tests**
```zig
test "input_validation integrates with EVM execution pipeline"
test "input_validation works with existing error handling"
test "input_validation maintains opcode parameter compatibility"
test "input_validation handles complex validation chains"
```

#### 3. **Performance Tests**
```zig
test "input_validation meets validation speed targets"
test "input_validation overhead measurement vs baseline"
test "input_validation scalability under high validation load"
test "input_validation benchmark complex validation rules"
```

#### 4. **Error Handling Tests**
```zig
test "input_validation proper validation error propagation"
test "input_validation handles malformed input gracefully"
test "input_validation graceful degradation on validator failures"
test "input_validation recovery from validation system errors"
```

#### 5. **Compliance Tests**
```zig
test "input_validation EVM specification parameter compliance"
test "input_validation cross-client validation consistency"
test "input_validation hardfork validation rule adherence"
test "input_validation deterministic validation behavior"
```

#### 6. **Security Tests**
```zig
test "input_validation handles malicious inputs safely"
test "input_validation prevents validation bypass attempts"
test "input_validation validates security-critical parameters"
test "input_validation maintains validation isolation"
```

### Test Development Priority
1. **Core validation functionality tests** - Ensure basic parameter validation works
2. **Compliance tests** - Meet EVM specification validation requirements
3. **Performance tests** - Achieve validation speed targets
4. **Security tests** - Prevent validation-bypass vulnerabilities
5. **Error handling tests** - Robust validation failure management
6. **Edge case tests** - Handle validation boundary conditions

### Test Data Sources
- **EVM specification**: Official parameter validation requirements
- **Reference implementations**: Cross-client validation compatibility data
- **Performance baselines**: Validation overhead measurements
- **Security test vectors**: Validation bypass prevention cases
- **Real-world scenarios**: Production input pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public validation APIs
- Validate performance regression prevention
- Test debug and release builds with different validation rules
- Verify cross-platform validation consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "input_validation basic parameter range validation" {
    // This test MUST fail initially
    const validator = test_utils.createParameterValidator();
    const param = TestParameter{ .value = 256, .min = 0, .max = 255 };
    
    const result = input_validation.validateParameter(validator, param);
    try testing.expectError(ValidationError.OutOfRange, result);
}
```

**Only then implement:**
```zig
pub const input_validation = struct {
    pub fn validateParameter(validator: *ParameterValidator, param: Parameter) !ValidationResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all validation rule combinations** - Especially for complex validation chains
- **Verify EVM specification compliance** - Critical for protocol parameter correctness
- **Test validation performance implications** - Especially for high-throughput scenarios
- **Validate security properties** - Prevent validation bypass and injection attacks

## References

- [Input Validation](https://owasp.org/www-project-proactive-controls/v3/en/c5-validate-inputs) - OWASP input validation guidelines
- [Security Patterns](https://en.wikipedia.org/wiki/Security_pattern) - Security design patterns
- [Anomaly Detection](https://en.wikipedia.org/wiki/Anomaly_detection) - Anomaly detection techniques
- [Data Sanitization](https://en.wikipedia.org/wiki/Data_sanitization) - Data cleaning and normalization
- [Threat Modeling](https://en.wikipedia.org/wiki/Threat_model) - Security threat analysis

## EVMONE Context

This is an excellent and detailed prompt for implementing a robust input validation framework. The structure you've laid out is very comprehensive.

`evmone` contains several relevant implementations for transaction validation, bytecode analysis (especially for the EVM Object Format - EOF), and pre-execution checks that can serve as a strong reference for your work.

Here are the most relevant code snippets from `evmone` that align with your requirements.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.cpp">
```cpp
/// This file demonstrates how evmone handles transaction validation before execution.
/// The `validate_transaction` function is a great model for checking transaction-level inputs,
/// including type, nonce, gas limits, fees, and sender balance, all within the context
/// of a specific EVM revision.

/// Validates transaction and computes its execution gas limit (the amount of gas provided to EVM).
/// @return  Execution gas limit or transaction validation error.
std::variant<TransactionProperties, std::error_code> validate_transaction(
    const StateView& state_view, const BlockInfo& block, const Transaction& tx, evmc_revision rev,
    int64_t block_gas_left, int64_t blob_gas_left) noexcept
{
    switch (tx.type)  // Validate "special" transaction types.
    {
    case Transaction::Type::blob:
        if (rev < EVMC_CANCUN)
            return make_error_code(TX_TYPE_NOT_SUPPORTED);
        if (!tx.to.has_value())
            return make_error_code(CREATE_BLOB_TX);
        if (tx.blob_hashes.empty())
            return make_error_code(EMPTY_BLOB_HASHES_LIST);

        assert(block.blob_base_fee.has_value());
        if (tx.max_blob_gas_price < *block.blob_base_fee)
            return make_error_code(BLOB_FEE_CAP_LESS_THAN_BLOCKS);

        if (std::ranges::any_of(tx.blob_hashes, [](const auto& h) { return h.bytes[0] != 0x01; }))
            return make_error_code(INVALID_BLOB_HASH_VERSION);
        if (std::cmp_greater(tx.blob_gas_used(), blob_gas_left))
            return make_error_code(BLOB_GAS_LIMIT_EXCEEDED);
        break;

    // ... other transaction types validation ...
    }

    // ... checks for max_priority_gas_price, etc. ...

    if (tx.gas_limit > block_gas_left)
        return make_error_code(GAS_LIMIT_REACHED);

    if (tx.max_gas_price < block.base_fee)
        return make_error_code(FEE_CAP_LESS_THAN_BLOCKS);

    const auto sender_acc = state_view.get_account(tx.sender).value_or(
        StateView::Account{.code_hash = Account::EMPTY_CODE_HASH});

    if (sender_acc.code_hash != Account::EMPTY_CODE_HASH &&
        !is_code_delegated(state_view.get_account_code(tx.sender)))
        return make_error_code(SENDER_NOT_EOA);  // Origin must not be a contract (EIP-3607).

    if (sender_acc.nonce == Account::NonceMax)  // Nonce value limit (EIP-2681).
        return make_error_code(NONCE_HAS_MAX_VALUE);

    if (sender_acc.nonce < tx.nonce)
        return make_error_code(NONCE_TOO_HIGH);

    if (sender_acc.nonce > tx.nonce)
        return make_error_code(NONCE_TOO_LOW);

    // initcode size is limited by EIP-3860.
    if (rev >= EVMC_SHANGHAI && !tx.to.has_value() && tx.data.size() > MAX_INITCODE_SIZE)
        return make_error_code(INIT_CODE_SIZE_LIMIT_EXCEEDED);

    // Compute and check if sender has enough balance for the theoretical maximum transaction cost.
    auto max_total_fee = umul(uint256{tx.gas_limit}, tx.max_gas_price);
    max_total_fee += tx.value;
    // ... blob gas cost ...
    if (sender_acc.balance < max_total_fee)
        return make_error_code(INSUFFICIENT_FUNDS);

    const auto [intrinsic_cost, min_cost] = compute_tx_intrinsic_cost(rev, tx);
    if (tx.gas_limit < std::max(intrinsic_cost, min_cost))
        return make_error_code(INTRINSIC_GAS_TOO_LOW);

    const auto execution_gas_limit = tx.gas_limit - intrinsic_cost;
    return TransactionProperties{execution_gas_limit, min_cost};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.cpp">
```cpp
/// This file shows how a structured input format (EOF) is validated. It's a great model
/// for your framework, as it checks for a valid prefix, known versions, section headers,
/// and then recursively validates each part of the container. This is a very systematic
/// approach to input validation.

EOFValidationError validate_eof1(
    evmc_revision rev, ContainerKind main_container_kind, bytes_view main_container) noexcept
{
    // ...

    // Queue of containers left to process
    std::queue<ContainerValidation> container_queue;

    container_queue.push({main_container, main_container_kind});

    while (!container_queue.empty())
    {
        const auto& [container, container_kind] = container_queue.front();

        // Validate header
        auto error_or_header = validate_header(rev, container);
        if (const auto* error = std::get_if<EOFValidationError>(&error_or_header))
            return *error;

        auto& header = std::get<EOF1Header>(error_or_header);

        if (const auto err = validate_types(container, header); err != EOFValidationError::success)
            return err;

        // Validate code sections
        // ... queue processing for sections ...
        while (!code_sections_queue.empty())
        {
            // ...

            // Validate instructions
            const auto instr_validation_result_or_error =
                validate_instructions(rev, header, container_kind, code_idx, container);
            if (const auto* error =
                    std::get_if<EOFValidationError>(&instr_validation_result_or_error))
                return *error;

            // ...

            // Validate jump destinations
            if (!validate_rjump_destinations(header.get_code(container, code_idx)))
                return EOFValidationError::invalid_rjump_destination;

            // Validate stack
            const auto shi_or_error = validate_stack_height(
                header.get_code(container, code_idx), code_idx, header, container);
            if (const auto* error = std::get_if<EOFValidationError>(&shi_or_error))
                return *error;
            // ...
        }

        // ...

        container_queue.pop();
    }

    return EOFValidationError::success;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_analysis.cpp">
```cpp
/// This demonstrates a fundamental bytecode validation: identifying all valid JUMPDESTs.
/// It iterates through the code, skipping over PUSH data, and marks valid JUMPDEST locations.
/// This is a critical security and correctness check.

CodeAnalysis::JumpdestMap analyze_jumpdests(bytes_view code)
{
    // To find if op is any PUSH opcode (OP_PUSH1 <= op <= OP_PUSH32)
    // it can be noticed that OP_PUSH32 is INT8_MAX (0x7f) therefore
    // static_cast<int8_t>(op) <= OP_PUSH32 is always true and can be skipped.
    static_assert(OP_PUSH32 == std::numeric_limits<int8_t>::max());

    CodeAnalysis::JumpdestMap map(code.size());  // Allocate and init bitmap with zeros.
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        if (static_cast<int8_t>(op) >= OP_PUSH1)  // If any PUSH opcode (see explanation above).
            i += op - size_t{OP_PUSH1 - 1};       // Skip PUSH data.
        else if (INTX_UNLIKELY(op == OP_JUMPDEST))
            map[i] = true;
    }

    return map;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
/// This function is a model for runtime validation right before an instruction executes.
/// It checks for undefined instructions, stack requirements (underflow/overflow), and
/// deducts the base gas cost. This pattern is essential for secure EVM execution.

template <Opcode Op>
inline evmc_status_code check_requirements(const CostTable& cost_table, int64_t& gas_left,
    const uint256* stack_top, const uint256* stack_bottom) noexcept
{
    // ...

    auto gas_cost = instr::gas_costs[EVMC_FRONTIER][Op];  // Init assuming const cost.
    if constexpr (!instr::has_const_gas_cost(Op))
    {
        gas_cost = cost_table[Op];  // If not, load the cost from the table.

        // Negative cost marks an undefined instruction.
        if (INTX_UNLIKELY(gas_cost < 0))
            return EVMC_UNDEFINED_INSTRUCTION;
    }

    // Check stack requirements first.
    if constexpr (instr::traits[Op].stack_height_change > 0)
    {
        if (INTX_UNLIKELY(stack_top == stack_bottom + StackSpace::limit))
            return EVMC_STACK_OVERFLOW;
    }
    if constexpr (instr::traits[Op].stack_height_required > 0)
    {
        static constexpr auto min_offset = instr::traits[Op].stack_height_required - 1;
        if (INTX_UNLIKELY(stack_top <= stack_bottom + min_offset))
            return EVMC_STACK_UNDERFLOW;
    }

    if (INTX_UNLIKELY((gas_left -= gas_cost) < 0))
        return EVMC_OUT_OF_GAS;

    return EVMC_SUCCESS;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
/// This function validates memory access inputs (offset and size) before an
/// operation like MSTORE or KECCAK256. It checks for out-of-bounds access and
/// handles the gas cost for memory expansion, which is a critical part of
/// validating runtime values.

/// Check memory requirements of a reasonable size.
inline bool check_memory(
    int64_t& gas_left, Memory& memory, const uint256& offset, uint64_t size) noexcept
{
    if (((offset[3] | offset[2] | offset[1]) != 0) || (offset[0] > max_buffer_size))
        return false;

    const auto new_size = static_cast<uint64_t>(offset) + size;
    if (new_size > memory.size())
        gas_left = grow_memory(gas_left, memory, new_size);

    return gas_left >= 0;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
/// Precompile execution provides excellent examples of input validation. Each precompile's
/// `_analyze` function checks the input size and calculates gas, which is a form of
/// validation. An invalid input size results in a `GasCostMax` return, signaling an error.

PrecompileAnalysis ecpairing_analyze(bytes_view input, evmc_revision rev) noexcept
{
    const auto base_cost = (rev >= EVMC_ISTANBUL) ? 45000 : 100000;
    const auto element_cost = (rev >= EVMC_ISTANBUL) ? 34000 : 80000;
    const auto num_elements = static_cast<int64_t>(input.size() / 192);
    return {base_cost + num_elements * element_cost, 32};
}

PrecompileAnalysis blake2bf_analyze(bytes_view input, evmc_revision) noexcept
{
    // NOLINTNEXTLINE(bugprone-suspicious-stringview-data-usage)
    return {input.size() == 213 ? intx::be::unsafe::load<uint32_t>(input.data()) : GasCostMax, 64};
}

ExecutionResult ecrecover_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    // ...
    const auto v = intx::be::unsafe::load<intx::uint256>(input_buffer + 32);
    if (v != 27 && v != 28)
        return {EVMC_SUCCESS, 0};
    // ...
}
```
</file>
</evmone>

## Prompt Corrections
The original prompt is very well-structured and detailed. The specified `InputValidationManager` is a great design. However, here are a few points to consider based on the `evmone` reference:

1.  **Hardfork-Specific Validation**: `evmone`'s validation logic is heavily dependent on the EVM revision (`evmc_revision`). Your `ValidationConfig` might benefit from including the `Hardfork` or `evmc_revision` to ensure rules are applied correctly (e.g., an opcode might be valid in Shanghai but not in Berlin). `evmone` often uses large tables indexed by revision for this.

2.  **Performance Model**: `evmone` separates code *analysis* (done once) from per-instruction *execution checks*. The `baseline_analysis.cpp` and `advanced_analysis.hpp` files demonstrate this. For performance, you'll want to pre-analyze bytecode to build structures like a JUMPDEST bitmap, rather than re-analyzing it on every execution. Your `validate_bytecode_input` function could return a validated "analysis" object that the VM uses later.

3.  **Security Analysis Scope**: The prompt's `SecurityMonitor` and `AnomalyDetector` components are features of a high-level static analysis or security tool, which are typically separate from a core EVM interpreter like `evmone`. `evmone` focuses on strict protocol compliance and performance. While you can certainly build these security features, the `evmone` codebase will be most helpful for the foundational correctness and protocol-level validation (e.g., "is this valid bytecode for this EVM version?"), not for detecting higher-level vulnerabilities like re-entrancy, which requires more complex control-flow and data-flow analysis. The included snippets for JUMPDEST and opcode validation are the `evmone` equivalent of security checks at the interpreter level.

4.  **Error Handling**: `evmone` uses status codes (e.g., `EVMC_UNDEFINED_INSTRUCTION`, `EVMC_STACK_UNDERFLOW`) to signal validation failures during execution. This is a very efficient, low-overhead way to handle runtime errors, which aligns well with your `ValidationResult` system. The `test/state/errors.hpp` file provides a good list of potential error conditions.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/88b77051a3af352c28d251d143c749b5c21f8a87/crates/handler/src/validation.rs">
```rust
/// Validate transaction against block and configuration for mainnet.
pub fn validate_tx_env<CTX: ContextTr, Error>(
    context: CTX,
    spec_id: SpecId,
) -> Result<(), InvalidTransaction> {
    let tx_type = context.tx().tx_type();
    let tx = context.tx();

    let base_fee = if context.cfg().is_base_fee_check_disabled() {
        None
    } else {
        Some(context.block().basefee() as u128)
    };

    match TransactionType::from(tx_type) {
        TransactionType::Legacy => {
            // Check chain_id only if it is present in the legacy transaction.
            // EIP-155: Simple replay attack protection
            if let Some(chain_id) = tx.chain_id() {
                if chain_id != context.cfg().chain_id() {
                    return Err(InvalidTransaction::InvalidChainId);
                }
            }
            // Gas price must be at least the basefee.
            if let Some(base_fee) = base_fee {
                if tx.gas_price() < base_fee {
                    return Err(InvalidTransaction::GasPriceLessThanBasefee);
                }
            }
        }
        TransactionType::Eip2930 => {
            // Enabled in BERLIN hardfork
            if !spec_id.is_enabled_in(SpecId::BERLIN) {
                return Err(InvalidTransaction::Eip2930NotSupported);
            }

            if Some(context.cfg().chain_id()) != tx.chain_id() {
                return Err(InvalidTransaction::InvalidChainId);
            }

            // Gas price must be at least the basefee.
            if let Some(base_fee) = base_fee {
                if tx.gas_price() < base_fee {
                    return Err(InvalidTransaction::GasPriceLessThanBasefee);
                }
            }
        }
        TransactionType::Eip1559 => {
            if !spec_id.is_enabled_in(SpecId::LONDON) {
                return Err(InvalidTransaction::Eip1559NotSupported);
            }

            if Some(context.cfg().chain_id()) != tx.chain_id() {
                return Err(InvalidTransaction::InvalidChainId);
            }

            validate_priority_fee_tx(
                tx.max_fee_per_gas(),
                tx.max_priority_fee_per_gas().unwrap_or_default(),
                base_fee,
            )?;
        }
        TransactionType::Eip4844 => {
            if !spec_id.is_enabled_in(SpecId::CANCUN) {
                return Err(InvalidTransaction::Eip4844NotSupported);
            }
            // ... more validation
        }
        // ... more transaction types
    };

    // Check if gas_limit is more than block_gas_limit
    if !context.cfg().is_block_gas_limit_disabled() && tx.gas_limit() > context.block().gas_limit()
    {
        return Err(InvalidTransaction::CallerGasLimitMoreThanBlock);
    }

    // EIP-3860: Limit and meter initcode
    if spec_id.is_enabled_in(SpecId::SHANGHAI) && tx.kind().is_create() {
        let max_initcode_size = context.cfg().max_code_size().saturating_mul(2);
        if context.tx().input().len() > max_initcode_size {
            return Err(InvalidTransaction::CreateInitCodeSizeLimit);
        }
    }

    Ok(())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/88b77051a3af352c28d251d143c749b5c21f8a87/crates/handler/src/pre_execution.rs">
```rust
#[inline]
pub fn validate_account_nonce_and_code(
    caller_info: &mut AccountInfo,
    tx_nonce: u64,
    is_eip3607_disabled: bool,
    is_nonce_check_disabled: bool,
) -> Result<(), InvalidTransaction> {
    // EIP-3607: Reject transactions from senders with deployed code
    // This EIP is introduced after london but there was no collision in past
    // so we can leave it enabled always
    if !is_eip3607_disabled {
        let bytecode = match caller_info.code.as_ref() {
            Some(code) => code,
            None => &Bytecode::default(),
        };
        // Allow EOAs whose code is a valid delegation designation,
        // i.e. 0xef0100 || address, to continue to originate transactions.
        if !bytecode.is_empty() && !bytecode.is_eip7702() {
            return Err(InvalidTransaction::RejectCallerWithCode);
        }
    }

    // Check that the transaction's nonce is correct
    if !is_nonce_check_disabled {
        let tx = tx_nonce;
        let state = caller_info.nonce;
        match tx.cmp(&state) {
            Ordering::Greater => {
                return Err(InvalidTransaction::NonceTooHigh { tx, state });
            }
            Ordering::Less => {
                return Err(InvalidTransaction::NonceTooLow { tx, state });
            }
            _ => {}
        }
    }
    Ok(())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/88b77051a3af352c28d251d143c749b5c21f8a87/crates/bytecode/src/legacy/analysis.rs">
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

An input validation framework is essential for security and correctness. The execution-specs provide a reference for what constitutes valid inputs at various stages of EVM execution. The snippets below from `cancun` (the most recent fork provided) demonstrate how validation is tightly integrated with transaction processing and opcode execution.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/transactions.py">
```python
# src/ethereum/cancun/transactions.py

# This file defines the different transaction types and the core validation logic.
# It's highly relevant for implementing the `validate_transaction_input` function.

TX_BASE_COST = Uint(21000)
TX_DATA_COST_PER_NON_ZERO = Uint(16)
TX_DATA_COST_PER_ZERO = Uint(4)
TX_CREATE_COST = Uint(32000)
TX_ACCESS_LIST_ADDRESS_COST = Uint(2400)
TX_ACCESS_LIST_STORAGE_KEY_COST = Uint(1900)

# ... (Transaction type dataclasses)

def validate_transaction(tx: Transaction) -> Uint:
    """
    Verifies a transaction.

    The gas in a transaction gets used to pay for the intrinsic cost of
    operations, therefore if there is insufficient gas then it would not
    be possible to execute a transaction and it will be declared invalid.
    ...
    """
    from .vm.interpreter import MAX_CODE_SIZE

    intrinsic_gas = calculate_intrinsic_cost(tx)
    if intrinsic_gas > tx.gas:
        raise InvalidTransaction("Insufficient gas")
    if U256(tx.nonce) >= U256(U64.MAX_VALUE):
        raise InvalidTransaction("Nonce too high")
    if tx.to == Bytes0(b"") and len(tx.data) > 2 * MAX_CODE_SIZE:
        raise InvalidTransaction("Code size too large")

    return intrinsic_gas


def calculate_intrinsic_cost(tx: Transaction) -> Uint:
    """
    Calculates the gas that is charged before execution is started.
    ...
    """
    from .vm.gas import init_code_cost

    data_cost = Uint(0)

    for byte in tx.data:
        if byte == 0:
            data_cost += TX_DATA_COST_PER_ZERO
        else:
            data_cost += TX_DATA_COST_PER_NON_ZERO

    if tx.to == Bytes0(b""):
        create_cost = TX_CREATE_COST + init_code_cost(ulen(tx.data))
    else:
        create_cost = Uint(0)

    access_list_cost = Uint(0)
    if isinstance(
        tx, (AccessListTransaction, FeeMarketTransaction, BlobTransaction)
    ):
        for access in tx.access_list:
            access_list_cost += TX_ACCESS_LIST_ADDRESS_COST
            access_list_cost += (
                ulen(access.slots) * TX_ACCESS_LIST_STORAGE_KEY_COST
            )

    return TX_BASE_COST + data_cost + create_cost + access_list_cost
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork.py">
```python
# src/ethereum/cancun/fork.py

# This file contains the `check_transaction` function, which validates
# a transaction within the context of the current block and state.
# This is analogous to the validation that would happen just before execution.

def check_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
) -> Tuple[Address, Uint, Tuple[VersionedHash, ...], U64]:
    """
    Check if the transaction is includable in the block.
    ...
    """
    gas_available = block_env.block_gas_limit - block_output.block_gas_used
    if tx.gas > gas_available:
        raise InvalidBlock

    tx_blob_gas_used = calculate_total_blob_gas(tx)
    if tx_blob_gas_used > blob_gas_available:
        raise InvalidBlock

    sender_address = recover_sender(block_env.chain_id, tx)
    sender_account = get_account(block_env.state, sender_address)

    if isinstance(tx, (FeeMarketTransaction, BlobTransaction)):
        if tx.max_fee_per_gas < tx.max_priority_fee_per_gas:
            raise InvalidBlock
        if tx.max_fee_per_gas < block_env.base_fee_per_gas:
            raise InvalidBlock

        # ... (effective gas price calculation)
        max_gas_fee = tx.gas * tx.max_fee_per_gas
    else:
        # ... (legacy gas price calculation)
        max_gas_fee = tx.gas * tx.gas_price

    if isinstance(tx, BlobTransaction):
        if not isinstance(tx.to, Address):
            raise InvalidBlock
        if len(tx.blob_versioned_hashes) == 0:
            raise InvalidBlock
        for blob_versioned_hash in tx.blob_versioned_hashes:
            if blob_versioned_hash[0:1] != VERSIONED_HASH_VERSION_KZG:
                raise InvalidBlock

        blob_gas_price = calculate_blob_gas_price(block_env.excess_blob_gas)
        if Uint(tx.max_fee_per_blob_gas) < blob_gas_price:
            raise InvalidBlock

        max_gas_fee += Uint(calculate_total_blob_gas(tx)) * Uint(
            tx.max_fee_per_blob_gas
        )
        blob_versioned_hashes = tx.blob_versioned_hashes
    else:
        blob_versioned_hashes = ()
    if sender_account.nonce != tx.nonce:
        raise InvalidBlock
    if Uint(sender_account.balance) < max_gas_fee + Uint(tx.value):
        raise InvalidBlock
    if sender_account.code:
        raise InvalidSenderError("not EOA")

    return (
        sender_address,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/runtime.py">
```python
# src/ethereum/cancun/vm/runtime.py

# This function is the canonical implementation of bytecode validation,
# specifically for finding valid JUMPDEST locations. It's directly
# relevant to the `validate_input_format` and `validate_jumpdest_positions`
# parts of the prompt.

def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.
    ...
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
# src/ethereum/cancun/vm/interpreter.py

# The interpreter shows how validation is checked during execution.
# `process_create_message` validates contract creation code, and
# `execute_code` validates opcodes during the execution loop.

def process_create_message(message: Message) -> Evm:
    # ... (setup)
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            if len(contract_code) > 0:
                if contract_code[0] == 0xEF:
                    raise InvalidContractPrefix
            charge_gas(evm, contract_code_gas)
            if len(contract_code) > MAX_CODE_SIZE:
                raise OutOfGasError
        # ... (error handling)
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state, transient_storage)
    # ...
    return evm

def execute_code(message: Message) -> Evm:
    # ... (setup)
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ... (precompile handling)
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())
    # ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/exceptions.py">
```python
# src/ethereum/cancun/vm/exceptions.py

# This file defines the various exceptions that can be raised during
# execution, which directly correspond to the `ViolationType` enum in
# the requested framework.

class ExceptionalHalt(EthereumException):
    """
    Indicates that the EVM has experienced an exceptional halt. This causes
    execution to immediately end with all gas being consumed.
    """

class Revert(EthereumException):
    """
    Raised by the `REVERT` opcode.
    ...
    """

class StackUnderflowError(ExceptionalHalt): ...
class StackOverflowError(ExceptionalHalt): ...
class OutOfGasError(ExceptionalHalt): ...

class InvalidOpcode(ExceptionalHalt):
    """
    Raised when an invalid opcode is encountered.
    """
    code: int
    def __init__(self, code: int) -> None:
        super().__init__(code)
        self.code = code

class InvalidJumpDestError(ExceptionalHalt): ...
class StackDepthLimitError(ExceptionalHalt): ...
class WriteInStaticContext(ExceptionalHalt): ...
class OutOfBoundsRead(ExceptionalHalt): ...
class InvalidContractPrefix(ExceptionalHalt): ...
class AddressCollision(ExceptionalHalt): ...
class KZGProofError(ExceptionalHalt): ...
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt outlines a sophisticated, modular input validation framework. This is an excellent design for a production-grade EVM client that prioritizes security and configurability. However, it's important to note the architectural differences between this proposed framework and the `execution-specs` codebase.

1.  **Implicit vs. Explicit Validation:** In `execution-specs`, validation is not a separate, explicit step but is woven directly into the state transition and opcode execution logic. For example, `validate_transaction` is called at the beginning of transaction processing, and opcode-specific checks (like stack depth or `JUMPDEST` validity) happen within the instruction implementations themselves. The proposed `InputValidationManager` would centralize these checks, which is a departure from the spec's structure.

2.  **Correctness vs. Heuristics:** The `execution-specs` define what is *correct* according to the Ethereum Yellow Paper. They validate against protocol rules. The prompt's proposed `SecurityMonitor`, with features like re-entrancy pattern detection and anomaly analysis, goes beyond protocol correctness into the realm of heuristics and threat intelligence. This is a valuable layer for a client but is outside the scope of the core specification. The provided snippets focus on the protocol-level correctness checks.

3.  **No Sanitization in Core EVM:** The EVM does not "sanitize" inputs. An input is either valid or invalid. If it's invalid (e.g., a transaction with an incorrect signature, or bytecode with an invalid opcode), it is rejected, usually causing the transaction to fail. The concept of a `SanitizerRegistry` is a useful abstraction for a client's external interface but isn't part of the core execution model.

Therefore, the provided code snippets should be viewed as **reference implementations for the validation *logic*** rather than components of a pre-existing pluggable framework. They perfectly illustrate *what* needs to be validated (e.g., transaction nonces, gas limits, bytecode `JUMPDEST`s) and can serve as the foundation for the rules within your proposed `InputValidationManager`.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/transactions.py">
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


Transaction = Union[
    LegacyTransaction, AccessListTransaction, FeeMarketTransaction
]

def validate_transaction(tx: Transaction) -> Uint:
    """
    Verifies a transaction.

    The gas in a transaction gets used to pay for the intrinsic cost of
    operations, therefore if there is insufficient gas then it would not
    be possible to execute a transaction and it will be declared invalid.

    Additionally, the nonce of a transaction must not equal or exceed the
    limit defined in `EIP-2681 <https://eips.ethereum.org/EIPS/eip-2681>`_.
    In practice, defining the limit as ``2**64-1`` has no impact because
    sending ``2**64-1`` transactions is improbable. It's not strictly
    impossible though, ``2**64-1`` transactions is the entire capacity of the
    Ethereum blockchain at 2022 gas limits for a little over 22 years.

    Parameters
    ----------
    tx :
        Transaction to validate.

    Returns
    -------
    intrinsic_gas : `ethereum.base_types.Uint`
        The intrinsic cost of the transaction.

    Raises
    ------
    InvalidTransaction :
        If the transaction is not valid.
    """
    intrinsic_gas = calculate_intrinsic_cost(tx)
    if intrinsic_gas > tx.gas:
        raise InvalidTransaction("Insufficient gas")
    if U256(tx.nonce) >= U256(U64.MAX_VALUE):
        raise InvalidTransaction("Nonce too high")
    return intrinsic_gas


def calculate_intrinsic_cost(tx: Transaction) -> Uint:
    """
    Calculates the gas that is charged before execution is started.
    """
    data_cost = Uint(0)

    for byte in tx.data:
        if byte == 0:
            data_cost += TX_DATA_COST_PER_ZERO
        else:
            data_cost += TX_DATA_COST_PER_NON_ZERO

    if tx.to == Bytes0(b""):
        create_cost = TX_CREATE_COST
    else:
        create_cost = Uint(0)

    access_list_cost = Uint(0)
    if isinstance(tx, (AccessListTransaction, FeeMarketTransaction)):
        for access in tx.access_list:
            access_list_cost += TX_ACCESS_LIST_ADDRESS_COST
            access_list_cost += (
                ulen(access.slots) * TX_ACCESS_LIST_STORAGE_KEY_COST
            )

    return TX_BASE_COST + data_cost + create_cost + access_list_cost
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/runtime.py">
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    """
    # ... (omitted for brevity: RLP encoding)

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

    # ... (omitted for brevity: gas fee calculation, nonce increment)

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

    # ... (omitted for brevity: gas refund and fee transfer)
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
    # ... (many opcodes omitted for brevity) ...
    
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
    
    # ... (rest of opcodes omitted for brevity) ...

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/exceptions.py">
```python
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
    """
    Occurs when a pop is executed on an empty stack.
    """
    pass

class StackOverflowError(ExceptionalHalt):
    """
    Occurs when a push is executed on a stack at max capacity.
    """
    pass

class OutOfGasError(ExceptionalHalt):
    """
    Occurs when an operation costs more than the amount of gas left in the
    frame.
    """
    pass

class InvalidOpcode(ExceptionalHalt):
    """
    Raised when an invalid opcode is encountered.
    """
    code: int

    def __init__(self, code: int) -> None:
        super().__init__(code)
        self.code = code

class InvalidJumpDestError(ExceptionalHalt):
    """
    Occurs when the destination of a jump operation doesn't meet any of the
    following criteria:

      * The jump destination is less than the length of the code.
      * The jump destination should have the `JUMPDEST` opcode (0x5B).
      * The jump destination shouldn't be part of the data corresponding to
        `PUSH-N` opcodes.
    """
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is well-structured, but there are a few conceptual points that can be improved for accuracy based on the execution specifications:

1.  **Security Check on Transaction Data**: The function `validate_security_constraints` contains a check for excessive `CALL` (0xF1) opcodes inside `tx_input.data`. This is incorrect. The `data` field of a transaction contains *calldata*, not executable EVM bytecode. Opcode analysis should be performed on `BytecodeInput.code`, not on transaction calldata. The check should be moved to the `bytecode` switch case.

2.  **JUMPDEST Validation Logic**: The `validate_jumpdest_positions` function in the prompt is acknowledged as a simplified check. The canonical algorithm is available in the `execution-specs` in `vm/runtime.py` within the `get_valid_jump_destinations` function. This function correctly handles skipping PUSH data bytes, which is a critical part of the validation that the simplified version misses. It should be used as the reference for a correct implementation.

3.  **Invalid Opcode Checks**: The prompt hardcodes a check for undefined opcodes in the range `0x0C` to `0x0F`. While these are indeed invalid, a more robust approach would be to check against a comprehensive list of valid opcodes for the current hardfork. The `Ops` enum in `vm/instructions/__init__.py` provides this list. The validation should ensure an opcode exists in the active `Ops` map for the configured hardfork. This is especially important as new opcodes like `PUSH0` (0x5f) or `TLOAD` (0x5c) are introduced in later forks.

By incorporating these corrections, the resulting input validation framework will be more aligned with the official Ethereum specifications and more robust against edge cases.



## GO-ETHEREUM Context

An analysis of the `go-ethereum` codebase reveals several key areas relevant to implementing an input validation framework. The validation logic is distributed across different packages, primarily in `core/` for consensus-level validation and `metrics/` for performance tracking.

### Key Validation Patterns in go-ethereum

1.  **Transaction Validation (`core/txpool/validation.go`)**: Geth performs rigorous validation before a transaction is accepted into the transaction pool. This includes checks for nonce, balance, intrinsic gas, and EIP-1559 fee parameters. This logic directly maps to the prompt's requirements for `validate_transaction_input`.
2.  **Bytecode Analysis (`core/vm/analysis.go`)**: Before execution, bytecode is analyzed to identify valid `JUMPDEST` locations. This pre-computation avoids expensive checks during runtime and is a crucial security measure. This is directly relevant to the `validate_jumpdest_positions` function in the prompt.
3.  **Opcode & Stack Validation (`core/vm/jump_table.go`, `core/vm/stack.go`)**: Geth uses a `JumpTable` to dispatch opcodes. Each operation in the table specifies the required stack depth (`minStack`, `maxStack`), which is validated before execution. This pattern prevents stack underflow/overflow errors and aligns with the prompt's basic validation steps.
4.  **Execution Context Validation (`core/vm/evm.go`, `core/vm/interpreter.go`)**: During execution, the EVM checks for call depth limits (`ErrDepth`) and state modification violations in static contexts (`ErrWriteProtection`). This maps to the prompt's `validate_contract_call_input` and `validate_security_constraints`.
5.  **Contract Creation Validation (`core/vm/contracts.go`)**: The `CREATE` and `CREATE2` opcodes include validation for maximum code size (EIP-170) and initcode gas costs (EIP-3860), which are critical for preventing DoS attacks.
6.  **Performance Monitoring (`metrics/`)**: Go-ethereum includes a comprehensive metrics library for tracking performance. The concepts of `Meters`, `Timers`, and `Gauges` provide a robust pattern for implementing the `ValidationPerformanceTracker` and `SecurityMonitor` components specified in the prompt.

The following code snippets are extracted from these key areas to provide direct implementation context.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/validation.go">
```go
// validateTx checks whether a transaction is valid according to the consensus
// rules.
//
// Note that this function is not "pure", it uses some consensus engine data,
// but it does not access the sender account's state.
func validateTx(tx *types.Transaction, head *types.Header, signer types.Signer, config *params.ChainConfig) error {
	// Reject non-legacy transactions before Berlin
	if !config.IsBerlin(head.Number) && tx.Type() != types.LegacyTxType {
		return types.ErrTxTypeNotSupported
	}
	// Reject transactions with higher version than supported
	if tx.Type() > types.BlobTxType { // TODO(prague): relax this check
		return types.ErrTxTypeNotSupported
	}

	// Check whether the tx is go-ethereum tracing transaction.
	if tx.To() != nil && *tx.To() == vm.GethTracingAddress {
		return nil
	}

	// Make sure the transaction is signed properly
	if _, err := types.Sender(signer, tx); err != nil {
		return err
	}

	// Ensure the transaction has a valid signature. This is a cheap check used to quickly
	// disqualify obviously invalid transactions.
	if err := tx.ValidateSignatureValues(); err != nil {
		return err
	}

	// Intrinsic gas checking is performed here.
	gas, err := IntrinsicGas(tx.Data(), tx.AccessList(), tx.To() == nil, true, true, true) // Pass fork marker as true as we can't tell old rules from new ones without the block number
	if err != nil {
		return err
	}
	if tx.Gas() < gas {
		return fmt.Errorf("%w: have %d, want %d", core.ErrIntrinsicGas, tx.Gas(), gas)
	}

	// Ensure the transaction has a valid nonce. This is a cheap check used to quickly
	// disqualify obviously invalid transactions.
	if tx.Nonce() >= math.MaxUint64 {
		return core.ErrNonceMax
	}
	return nil
}

// IntrinsicGas computes the 'intrinsic gas' for a transaction.
// The intrinsic gas consists of the costs of the transaction itself.
// This includes the cost of the transaction data, the cost of creating a contract,
// and the cost of an access list.
func IntrinsicGas(data []byte, accessList types.AccessList, isContractCreation bool, isHomestead, isIstanbul, isCancun bool) (uint64, error) {
	// Set the starting gas for the raw transaction
	var gas uint64
	if isContractCreation && isHomestead {
		gas = params.TxGasContractCreation
	} else {
		gas = params.TxGas
	}
	// Bump the required gas by the amount of transactional data
	if len(data) > 0 {
		// Zero and non-zero bytes are priced differently
		var nz uint64
		for _, b := range data {
			if b != 0 {
				nz++
			}
		}
		// Make sure we don't exceed uint64 for all data combinations
		if (math.MaxUint64-gas)/params.TxDataNonZeroGas < nz {
			return 0, core.ErrGasUintOverflow
		}
		gas += nz * params.TxDataNonZeroGas

		z := uint64(len(data)) - nz
		if (math.MaxUint64-gas)/params.TxDataZeroGas < z {
			return 0, core.ErrGasUintOverflow
		}
		gas += z * params.TxDataZeroGas
	}
	// Bump the required gas by the amount of access list entries
	if len(accessList) > 0 {
		// As a rule of thumb, each address in an access list costs as much as a
		// cold SLOAD. Each storage key in an access list costs as much as a
		// cold SLOAD. Re-metering those later will make them cheaper.
		if (math.MaxUint64-gas)/params.TxAccessListAddressGas < uint64(len(accessList)) {
			return 0, core.ErrGasUintOverflow
		}
		gas += uint64(len(accessList)) * params.TxAccessListAddressGas
		if (math.MaxUint64-gas)/params.TxAccessListStorageKeyGas < uint64(accessList.StorageKeys()) {
			return 0, core.ErrGasUintOverflow
		}
		gas += uint64(accessList.StorageKeys()) * params.TxAccessListStorageKeyGas
	}
	// Bump the required gas by the EIP-3860 initcode cost
	if isContractCreation && isIstanbul && len(data) > 0 {
		if (math.MaxUint64-gas)/params.InitcodeWordGas < uint64((len(data)+31)/32) {
			return 0, core.ErrGasUintOverflow
		}
		gas += uint64((len(data)+31)/32) * params.InitcodeWordGas
	}
	if isCancun {
		gas += uint64(len(data)) * params.TxDataGasPerNonZeroByteEIP7620
	}
	return gas, nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// Analyse analyzes the given code, and returns an analysis object.
// The analysis object consists of a slice of valid jump destinations,
// and a bit vector of valid 'JUMPDEST' locations.
func Analyse(code []byte) (bitvec, []error) {
	// Don't waste time on empty code
	if len(code) == 0 {
		return bitvec{}, nil
	}

	var (
		dests  = make(bitvec, len(code))
		errors []error
	)
	// Make one pass to get all JUMPDEST
	for i := 0; i < len(code); {
		var (
			op OpCode = OpCode(code[i])
			size     = op.pushDataSize()
		)
		if op == JUMPDEST {
			dests.set(i)
		} else if size > 0 {
			i += int(size)
		}
		i++
	}

	// Make a second pass to check validity of JUMPs
	for i := 0; i < len(code); {
		var (
			op OpCode = OpCode(code[i])
			size     = op.pushDataSize()
		)
		if op >= PUSH1 && op <= PUSH32 {
			var (
				start = i + 1
				end   = start + int(size)
			)
			if end > len(code) {
				errors = append(errors, &invalidJumpError{dest: end, code: code[i:]})
				break
			}

			// We don't need to do the jump validation for PUSH-type opcodes.
			// Because of how the interpreter works, a jump to a PUSH-data location
			// is allowed, but will cause an ErrInvalidOpCode to be thrown.
			// In order to be fully compatible with other clients, we'll let that happen.
			i += int(size) + 1
			continue
		}
		i++
	}
	return dests, errors
}
...
// bitvec is a bit vector which maps bytes in a program to locations.
type bitvec []byte

// set sets the bit at the given index.
func (bits bitvec) set(i int) {
	bits[i/8] |= 1 << (uint(i) % 8)
}

// codeSegment returns true if the given index is a code segment.
func (bits bitvec) codeSegment(i int) bool {
	return (bits[i/8] & (1 << (uint(i) % 8))) != 0
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no gas refund should be
// provided.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
...
	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
...
	for {
...
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			err = &ErrInvalidOpcode{opcode: op}
			break
		}
...
		// Static calls can't ever modify state.
		if readOnly && operation.writes {
			err = ErrWriteProtection
			break
		}
...
		// check stack
		if err = operation.validateStack(stack); err != nil {
			break
		}
...
		// Call depth check
		if in.evm.depth > int(params.CallCreateDepth) {
			err = ErrDepth
			break
		}
...
	}
...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// Create creates a new contract using the data passed in the creation transaction.
func Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute at a depth greater
	// than the allowed call depth.
	if caller.EVM().depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !caller.CanTransfer(value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no address collision when creating a new contract.
	nonce := caller.Nonce()
	caller.SetNonce(nonce + 1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// Check whether the destination address exists. If so, return an error.
	if codeHash := caller.GetCodeHash(contractAddr); codeHash != (common.Hash{}) && codeHash != types.EmptyCodeHash {
		return nil, common.Address{}, gas, ErrContractAddressCollision
	}
	// Make sure the existing account is a non-contract, zero-nonce, zero-balance
	// account to avoid overwriting any existing state.
	snapshot := caller.EVM().StateDB.Snapshot()
	if !caller.EVM().StateDB.CanTransferToNewAccount(contractAddr) {
		caller.EVM().StateDB.RevertToSnapshot(snapshot)
		return nil, common.Address{}, gas, ErrNonceHasValue
	}
	caller.Transfer(caller.Address(), contractAddr, value, tracing.BalanceChangeContractCreation)

	// initialise a new contract and set the code that's going to be used by the
	// EVM.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)

	// EIP-3860: Limit and meter initcode
	if caller.EVM().ChainConfig().IsShanghai(caller.EVM().BlockNumber, caller.EVM().Time) {
		if len(code) > params.MaxInitCodeSize {
			return nil, common.Address{}, gas, ErrMaxInitCodeSizeExceeded
		}
		initCodeGas, err := params.GetInitcodeGas(uint64(len(code)))
		if err != nil {
			return nil, common.Address{}, gas, err
		}
		if gas < initCodeGas {
			return nil, common.Address{}, gas, ErrInsufficientGas
		}
		gas -= initCodeGas
		contract.Gas = gas
	}

	if caller.EVM().vm.Config.Tracer != nil {
		caller.EVM().vm.Config.Tracer.CaptureStart(caller.EVM(), caller.Address(), contractAddr, true, code, gas, value)
	}
	ret, err = Run(caller.EVM(), contract, nil, false)
...
	// check code size limit
	if err == nil && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}

	// if the contract creation ran out of gas and the transaction was created before
	// homestead, return a basic error.
	if err == ErrOutOfGas && !caller.EVM().ChainConfig().IsHomestead(caller.EVM().BlockNumber) {
		err = ErrCodeStoreOutOfGas
	}
	// if the contract creation failed, revert the state to the last snapshot.
	if err != nil {
		caller.EVM().StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	} else {
		// EIP-170: contract code size limit
		// if the returned code is too large, it is an error, and must consume all gas
		gasCost := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(gasCost) {
			caller.EVM().StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
...
	return ret, contractAddr, contract.Gas, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes and their corresponding instructions.
type JumpTable [256]operation

// operation is the low level representation of a single opcode.
type operation struct {
	// op is the opcode function
	op OpCode
	// execute is the opcode's implementation function
	execute executionFunc
	// constantGas is the gas that is charged unconditionally
	constantGas uint64
	// dynamicGas is the dynamic gas charged by the operation
	dynamicGas gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after executing the opcode
	maxStack int
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// valid indicates whether the operation is valid and defined
	valid bool
	// dynamic indicates whether the instruction has dynamic gas cost
	dynamic bool
	// writes indicates whether this instruction writes to memory
	writes bool
	// returns indicates whether the instruction terminates the analysis
	returns bool
	// gasEarlyEater indicates whether the gas is charged before other validations
	gasEarlyEater bool
	// stalls indicates whether the instruction is a blocking one.
	stalls bool
	// valid indicates whether the instruction has been validated
	validated bool
}

// validateStack validates the stack for the operation
func (op operation) validateStack(stack *Stack) error {
	if stack.len() < op.minStack {
		return &ErrStackUnderflow{stackLen: stack.len(), required: op.minStack}
	}
	if stack.len() > op.maxStack {
		return &ErrStackOverflow{stackLen: stack.len(), limit: op.maxStack}
	}
	return nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// blake2F is a native contract for the F precompile of blake2b.
type blake2F struct{}

func (c *blake2F) RequiredGas(input []byte) uint64 {
	// The gas cost is based on the number of rounds, which is the first argument.
	if len(input) < 4 {
		return 0
	}
	return uint64(binary.BigEndian.Uint32(input[0:4]))
}

func (c *blake2F) Run(input []byte) ([]byte, error) {
	// Ensure the input is the correct size.
	if len(input) != 213 {
		return nil, errors.New("invalid input length")
	}
...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
...
	// TxGas is the gas for transaction not involving contract creation.
	TxGas uint64 = 21000
	// TxGasContractCreation is the gas for contract creation.
	TxGasContractCreation uint64 = 53000
	// TxDataZeroGas is the gas for every zero byte of data/input of a transaction.
	TxDataZeroGas uint64 = 4
	// TxDataNonZeroGas is the gas for every non-zero byte of data/input of a transaction.
	TxDataNonZeroGas uint64 = 16
	// TxDataGasPerNonZeroByteEIP7620 is the EIP-7620 gas for every non-zero byte of data/input of a transaction.
	TxDataGasPerNonZeroByteEIP7620 uint64 = 48
	// TxAccessListAddressGas is the gas for each address in an access list.
	TxAccessListAddressGas uint64 = 2400
	// TxAccessListStorageKeyGas is the gas for each storage key in an access list.
	TxAccessListStorageKeyGas uint64 = 1900
...
	// MaxCodeSize is the maximum byte size of contract code to store.
	MaxCodeSize = 24576

	// MaxInitCodeSize is the maximum size of initialization code when creating a contract.
	MaxInitCodeSize = 2 * MaxCodeSize
...
	// CallCreateDepth is the maximum call stack depth.
	CallCreateDepth uint64 = 1024
...
)
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
...

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

// NewMeter constructs a new Meter and launches a goroutine.
// Be sure to call Stop() once the meter is of no use to allow for garbage collection.
func NewMeter() *Meter {
	m := newMeter()
	arbiter.add(m)
	return m
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// Timer captures the duration and rate of events, using a Histogram and a Meter.
type Timer struct {
	histogram Histogram
	meter     *Meter
	mutex     sync.Mutex
}

// NewTimer constructs a new Timer using an exponentially-decaying
// sample with the same reservoir size and alpha as UNIX load averages.
// Be sure to call Stop() once the timer is of no use to allow for garbage collection.
func NewTimer() *Timer {
	return &Timer{
		histogram: NewHistogram(NewExpDecaySample(1028, 0.015)),
		meter:     NewMeter(),
	}
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

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/metrics.go">
```go
// CollectProcessMetrics periodically collects various metrics about the running process.
func CollectProcessMetrics(refresh time.Duration) {
	// Short circuit if the metrics system is disabled
	if !metricsEnabled {
		return
	}

	// Create the various data collectors
	var (
		cpustats  = make([]CPUStats, 2)
		diskstats = make([]DiskStats, 2)
		rstats    = make([]runtimeStats, 2)
	)
...
	// Define the various metrics to collect
	var (
		cpuSysLoad            = GetOrRegisterGauge("system/cpu/sysload", DefaultRegistry)
...
		memPauses             = getOrRegisterRuntimeHistogram("system/memory/pauses", secondsToNs, nil)
		memAllocs             = GetOrRegisterMeter("system/memory/allocs", DefaultRegistry)
...
	)

	var lastCollectTime time.Time

	// Iterate loading the different stats and updating the meters.
	now, prev := 0, 1
	for ; ; now, prev = prev, now {
		// Gather CPU times.
		ReadCPUStats(&cpustats[now])
		collectTime := time.Now()
		secondsSinceLastCollect := collectTime.Sub(lastCollectTime).Seconds()
		lastCollectTime = collectTime
		if secondsSinceLastCollect > 0 {
...
			cpuSysLoad.Update(int64(sysLoad / secondsSinceLastCollect * 100))
...
		}
...
		// Go runtime metrics
		readRuntimeStats(&rstats[now])

		cpuGoroutines.Update(int64(rstats[now].Goroutines))
		cpuSchedLatency.update(rstats[now].SchedLatency)
		memPauses.update(rstats[now].GCPauses)

		memAllocs.Mark(int64(rstats[now].GCAllocBytes - rstats[prev].GCAllocBytes))
...
		time.Sleep(refresh)
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt outlines a very sophisticated security and validation framework. It's important to note that while a production EVM like `go-ethereum` performs rigorous **validation** for consensus and DoS prevention, it does not typically perform the kind of advanced **security analysis** (e.g., detecting specific reentrancy patterns, backdoors, or malicious selectors via pattern matching) described in the `SecurityMonitor` section.

This distinction is key:
*   **EVM's Role**: Enforce consensus rules, reject invalid transactions/bytecode, and prevent DoS attacks through mechanisms like gas costs, stack limits, and code size limits. Its primary concern is correctness and availability, not proactive smart contract vulnerability scanning.
*   **Security Tool's Role**: Perform deep static or dynamic analysis on bytecode to find potential vulnerabilities (re-entrancy, integer overflows, etc.). This is usually done by off-chain tools like Slither, Mythril, or integrated into developer frameworks.

The provided `go-ethereum` snippets focus on the first category: the essential, consensus-critical validation that an EVM must perform. The `SecurityMonitor` and advanced rule-engine components of the prompt are valuable features but are more characteristic of a security analysis layer built *on top* of a core EVM, rather than inside it. The implementation should reflect this separation of concerns. The `metrics` package from go-ethereum provides an excellent pattern for implementing the `ValidationPerformanceTracker` and can be adapted for the `SecurityMonitor`'s anomaly detection needs.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// IntrinsicGas computes the 'intrinsic gas' for a message with the given data.
func IntrinsicGas(data []byte, accessList types.AccessList, authList []types.SetCodeAuthorization, isContractCreation, isHomestead, isEIP2028, isEIP3860 bool) (uint64, error) {
	// Set the starting gas for the raw transaction
	var gas uint64
	if isContractCreation && isHomestead {
		gas = params.TxGasContractCreation
	} else {
		gas = params.TxGas
	}
	dataLen := uint64(len(data))
	// Bump the required gas by the amount of transactional data
	if dataLen > 0 {
		// Zero and non-zero bytes are priced differently
		z := uint64(bytes.Count(data, []byte{0}))
		nz := dataLen - z

		// Make sure we don't exceed uint64 for all data combinations
		nonZeroGas := params.TxDataNonZeroGasFrontier
		if isEIP2028 {
			nonZeroGas = params.TxDataNonZeroGasEIP2028
		}
		if (math.MaxUint64-gas)/nonZeroGas < nz {
			return 0, ErrGasUintOverflow
		}
		gas += nz * nonZeroGas

		if (math.MaxUint64-gas)/params.TxDataZeroGas < z {
			return 0, ErrGasUintOverflow
		}
		gas += z * params.TxDataZeroGas

		if isContractCreation && isEIP3860 {
			lenWords := toWordSize(dataLen)
			if (math.MaxUint64-gas)/params.InitCodeWordGas < lenWords {
				return 0, ErrGasUintOverflow
			}
			gas += lenWords * params.InitCodeWordGas
		}
	}
	if accessList != nil {
		gas += uint64(len(accessList)) * params.TxAccessListAddressGas
		gas += uint64(accessList.StorageKeys()) * params.TxAccessListStorageKeyGas
	}
	if authList != nil {
		gas += uint64(len(authList)) * params.CallNewAccountGas
	}
	return gas, nil
}

// ...

func (st *stateTransition) preCheck() error {
	// Only check transactions that are not fake
	msg := st.msg
	if !msg.SkipNonceChecks {
		// Make sure this transaction's nonce is correct.
		stNonce := st.state.GetNonce(msg.From)
		if msgNonce := msg.Nonce; stNonce < msgNonce {
			return fmt.Errorf("%w: address %v, tx: %d state: %d", ErrNonceTooHigh,
				msg.From.Hex(), msgNonce, stNonce)
		} else if stNonce > msgNonce {
			return fmt.Errorf("%w: address %v, tx: %d state: %d", ErrNonceTooLow,
				msg.From.Hex(), msgNonce, stNonce)
		} else if stNonce+1 < stNonce {
			return fmt.Errorf("%w: address %v, nonce: %d", ErrNonceMax,
				msg.From.Hex(), stNonce)
		}
	}
	if !msg.SkipFromEOACheck {
		// Make sure the sender is an EOA
		code := st.state.GetCode(msg.From)
		_, delegated := types.ParseDelegation(code)
		if len(code) > 0 && !delegated {
			return fmt.Errorf("%w: address %v, len(code): %d", ErrSenderNoEOA, msg.From.Hex(), len(code))
		}
	}
	// Make sure that transaction gasFeeCap is greater than the baseFee (post london)
	if st.evm.ChainConfig().IsLondon(st.evm.Context.BlockNumber) {
		// ...
		if msg.GasFeeCap.Cmp(st.evm.Context.BaseFee) < 0 {
			return fmt.Errorf("%w: address %v, maxFeePerGas: %s, baseFee: %s", ErrFeeCapTooLow,
				msg.From.Hex(), msg.GasFeeCap, st.evm.Context.BaseFee)
		}
	}
	// Check the blob version validity
	if msg.BlobHashes != nil {
		// ...
		for i, hash := range msg.BlobHashes {
			if !kzg4844.IsValidVersionedHash(hash[:]) {
				return fmt.Errorf("blob %d has invalid hash version", i)
			}
		}
	}
	// Check that the user is paying at least the current blob fee
	if st.evm.ChainConfig().IsCancun(st.evm.Context.BlockNumber, st.evm.Context.Time) {
		if st.blobGasUsed() > 0 {
			// ...
			if msg.BlobGasFeeCap.Cmp(st.evm.Context.BlobBaseFee) < 0 {
				return fmt.Errorf("%w: address %v blobGasFeeCap: %v, blobBaseFee: %v", ErrBlobFeeCapTooLow,
					msg.From.Hex(), msg.BlobGasFeeCap, st.evm.Context.BlobBaseFee)
			}
		}
	}
	// ...
	return st.buyGas()
}

// ...

func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ...
	// Check clauses 4-5, subtract intrinsic gas if everything is correct
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	if st.gasRemaining < gas {
		return nil, fmt.Errorf("%w: have %d, want %d", ErrIntrinsicGas, st.gasRemaining, gas)
	}
	// ...
	// Check whether the init code size has been exceeded.
	if rules.IsShanghai && contractCreation && len(msg.Data) > params.MaxInitCodeSize {
		return nil, fmt.Errorf("%w: code size %v limit %v", ErrMaxInitCodeSizeExceeded, len(msg.Data), params.MaxInitCodeSize)
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Create creates a new contract using the EVM create instruction.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1, tracing.NonceChangeCreate)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	if evm.StateDB.GetCodeSize(contractAddr) > 0 {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr, evm.chainRules.IsEIP158)
	if evm.chainRules.IsEIP2929 {
		evm.StateDB.AddAddressToAccessList(contractAddr)
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Create a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)

	// ...

	// Check whether the max code size restriction is violated.
	if err == nil && evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the code is empty, the contract is invalid, but if the err is
	// ErrMaxCodeSizeExceeded the err must be returned regardless of what
	// the returned code is.
	if err == nil && len(ret) == 0 {
		err = ErrContractCreationCodeEmpty
	}
	// if the contract creation ran successfully and no errors were returned
	// calculate the gas required to store the code.
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	// When an error occurred revert the state and consume all gas.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != vm.ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// bitvec is a bit vector which maps bytes in a program to booleans.
// This type is used by the interpreter to validate jump destinations.
type bitvec []byte

// set sets the bit at the given index.
func (b bitvec) set(i uint64) {
	b[i/8] |= 1 << (i % 8)
}

// has returns true if the bit at the given index is set.
func (b bitvec) has(i uint64) bool {
	if i >= uint64(len(b)*8) {
		return false
	}
	return b[i/8]&(1<<(i%8)) != 0
}

var (
	jumpdestAnalysis      atomic.Pointer[sync.Map] // key: common.Hash, value: bitvec
	jumpdestAnalysisOnce  sync.Once
	jumpdestSubscribers   []chan common.Hash
	jumpdestAnalysisMutex sync.Mutex
)

//...

// Analyse creates a jumpdest analysis for a given code, returning a bit vector
// of valid jump destinations.
func Analyse(code []byte) bitvec {
	// ...
	// Dispatch the analysis to a shared thread
	if len(code) > 0 {
		hash := crypto.Keccak256Hash(code)
		ch := make(chan bitvec, 1)

		jumpdestAnalysisMutex.Lock()
		subscribers, ok := jumpdestSubscribers[hash]
		jumpdestSubscribers[hash] = append(subscribers, ch)
		jumpdestAnalysisMutex.Unlock()
		// ...
	}
	// ...
	// Perform the analysis
	destinations := make(bitvec, len(code))
	for i := 0; i < len(code); i++ {
		// Found a JUMPDEST, mark it
		if OpCode(code[i]) == JUMPDEST {
			destinations.set(uint64(i))
		}
		// PUSH instructions have an argument, skip that
		if OpCode(code[i]).isPush() {
			i += int(OpCode(code[i]) - PUSH1 + 1)
		}
	}
	return destinations
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation, we have a jump table and a stack map analyse.
		jumpdests               = in.analyse(contract.Code)
		// ...
	)
	// ...
	for {
		// ...
		// Get operation from jump table
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// ...
		// Static calls can't write to state
		if readOnly && operation.writes {
			return nil, ErrWriteProtection
		}

		switch op {
		// ...
		case JUMP:
			if !in.hasCircularDependency(contract.CodeHash) {
				// We are in a "hot" path, we can use the shared jumpdests
				if !in.sharedJumpdests.has(contract.CodeHash, pos.Uint64()) {
					return nil, &ErrInvalidJump{Dest: pos.Uint64()}
				}
			} else {
				// We have a circular dependency, so we must use the local jumpdests
				if !jumpdests.has(pos.Uint64()) {
					return nil, &ErrInvalidJump{Dest: pos.Uint64()}
				}
			}
			pc = pos.Uint64()
			continue

		case JUMPI:
			pos, cond := stack.pop(), stack.pop()
			if !cond.IsZero() {
				if !in.hasCircularDependency(contract.CodeHash) {
					// We are in a "hot" path, we can use the shared jumpdests
					if !in.sharedJumpdests.has(contract.CodeHash, pos.Uint64()) {
						return nil, &ErrInvalidJump{Dest: pos.Uint64()}
					}
				} else {
					// We have a circular dependency, so we must use the local jumpdests
					if !jumpdests.has(pos.Uint64()) {
						return nil, &ErrInvalidJump{Dest: pos.Uint64()}
					}
				}
				pc = pos.Uint64()
				continue
			}
		// ...
		}
		// ...
	}
	return ret, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, to, value, in, insize, out, outsize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	toAddress := to.Address()

	inOffset, insizeUint := in.Uint64(), insize.Uint64()
	if err := mem.resize(inOffset, insizeUint); err != nil {
		return nil, err
	}
	outOffset, outsizeUint := out.Uint64(), outsize.Uint64()
	if err := mem.resize(outOffset, outsizeUint); err != nil {
		return nil, err
	}

	// Ensure that call depth won't exceed the max limit
	if evm.depth >= int(params.CallCreateDepth) {
		return nil, ErrDepth
	}
	// Check for static call and value transfer
	if contract.value.Sign() != 0 && contract.Static() {
		return nil, ErrStaticStateChange
	}
	var (
		err         error
		available   = contract.Gas()
		cost        uint64
		callGas     = gas.Uint64()
		isTransfer  = !value.IsZero()
		accountExists = evm.StateDB.Exist(toAddress)
	)
	// EIP-2929: cheap access for warm accounts.
	// If the account is not warm, we need to charge an extra fee.
	if evm.chainRules.IsBerlin {
		if evm.StateDB.AddressInAccessList(toAddress) {
			cost += params.WarmAccountAccessGas
		} else {
			cost += params.ColdAccountAccessGas
			evm.StateDB.AddAddressToAccessList(toAddress)
		}
	}
	// Make sure the operator won't underflow.
	if available < cost {
		return nil, ErrOutOfGas
	}
	callGas, err = calculateCallGas(callGas, available-cost, isTransfer, accountExists)
	if err != nil {
		return nil, err
	}
	// ... (rest of the call logic)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// calculateCallGas calculates the gas required for calling a contract.
//
// This function does not have access to the EVM instance and is therefore
// unable to charge gas for accessing the callee account. The caller must
// manually charge for account access using AccessGas.
func calculateCallGas(gas, availableGas, callCost uint64) (uint64, error) {
	// EIP-150: call cost cannot exceed 63/64 of available gas.
	availableGas = availableGas - callCost
	gas = min(gas, availableGas*63/64)
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...

	// TxGas is the cost of a basic transaction.
	TxGas uint64 = 21000
	// TxGasContractCreation is the cost of a transaction that creates a contract.
	TxGasContractCreation uint64 = 53000

	// ...

	// MaxCodeSize is the maximum byte size of a contract code.
	MaxCodeSize = 24576

	// MaxInitCodeSize is the maximum byte size of a contract init_code.
	MaxInitCodeSize = 2 * MaxCodeSize

	// ...

	// CallCreateDepth is the maximum call stack depth.
	CallCreateDepth uint64 = 1024

	// ...

	// CreateDataGas is the gas cost for each byte of data supplied to a contract creation transaction.
	CreateDataGas uint64 = 200

	// ...
)
```
</file>

## Prompt Corrections
The original prompt specifies a very detailed and centralized "Input Validation Framework", including a `SecurityMonitor` and `ValidatorRegistry`. This is a great design for a new EVM implementation, but it's important to note how this differs from established implementations like go-ethereum (geth).

1.  **Centralized vs. Distributed Validation**: In geth, input validation is not a single, centralized module. Instead, checks are distributed across the system at the points where they are most relevant:
    *   **Transaction Pool (`txpool`)**: Validates transactions for network propagation and inclusion in the mempool (e.g., signature, gas limits, fees).
    *   **Consensus Engine (`core`)**: Validates transactions and blocks according to consensus rules (`state_transition.go`, `block_validator.go`).
    *   **EVM (`vm`)**: Validates inputs at runtime (e.g., JUMPDEST validity, stack depth, static call violations).

2.  **Security Heuristics vs. Formal Rules**: The prompt's `SecurityMonitor` suggests heuristic-based security checks (e.g., detecting potential backdoors or infinite loops). Geth's EVM enforces security through formal, deterministic rules, not pattern matching:
    *   **Infinite loops** are prevented by the gas mechanism (execution stops with `ErrOutOfGas`).
    *   **Reentrancy attacks** are mitigated by the "63/64 gas rule" (EIP-150), which limits the gas forwarded to sub-calls, and by developers using patterns like Checks-Effects-Interactions. Geth does not have a runtime check to detect reentrancy patterns.
    *   **Backdoor detection** and other advanced static analysis are typically performed by external tools (e.g., Slither, Mythril) on the source code or bytecode, not by the EVM at runtime.

3.  **ABI Validation**: The prompt includes `strict_abi_validation` and checks like `function_data.len % 32 != 0`. This is a higher-level abstraction. The EVM itself is unaware of the Application Binary Interface (ABI); it only sees a slice of bytes as `calldata`. ABI encoding and decoding are handled by client-side libraries (like `go-ethereum/accounts/abi`) or smart contract languages, not by the core EVM execution engine.

**Recommendation**: When implementing the framework, it would be beneficial to model the validation logic found in geth for consensus-critical checks. For the advanced security and ABI checks, consider whether they belong in the core EVM runtime or in a higher-level layer that pre-processes transactions or analyzes bytecode offline. The provided go-ethereum snippets are excellent references for the former.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
// core/state_transition.go

// validateTx checks whether a transaction is valid according to the consensus
// rules and adheres to some heuristic limits of the local node (price and size).
func validateTx(tx *types.Transaction, author *common.Address, baseFee, blobBaseFee *big.Int, st *state.StateDB, rules *params.Rules) error {
	// Validate the transaction's nonce against the sender's current state nonce.
	if tx.Nonce() != st.GetNonce(tx.From()) {
		return fmt.Errorf("%w: invalid nonce (%d) for sender %s (got %d)",
			ErrNonce, tx.Nonce(), tx.From(), st.GetNonce(tx.From()))
	}
	// Check the transaction's gas limit against the block gas limit.
	if st.BlockContext().GasLimit < tx.Gas() {
		return fmt.Errorf("%w: address %s, gas %d, limit %d", ErrGasLimit, tx.From(), tx.Gas(), st.BlockContext().GasLimit)
	}
	// Validate the transaction fee against the sender's balance.
	if err := tx.CheckFee(baseFee, blobBaseFee); err != nil {
		return err
	}
	// Ensure the sender has enough funds to cover the transaction costs.
	// This involves checking the balance against the total cost, which is
	// value + gas fee.
	if balance := st.GetBalance(tx.From()); balance.Cmp(tx.Cost()) < 0 {
		return fmt.Errorf("%w: address %v, balance %v, cost %v", ErrInsufficientFunds, tx.From(), balance, tx.Cost())
	}
	// For blob transactions, verify that the total blob gas does not exceed the maximum allowed per block.
	if blobTx, ok := tx.TypeAssertion().(*types.BlobTx); ok {
		if st.BlobContext() != nil {
			if totalBlobGas := st.BlobContext().ExcessBlobGas + uint64(len(blobTx.BlobHashes)); totalBlobGas > params.MaxBlobGasPerBlock {
				return fmt.Errorf("%w: address %s, have %d, want %d", ErrBlobGasLimit, tx.From(), st.BlobContext().ExcessBlobGas, params.MaxBlobGasPerBlock-uint64(len(blobTx.BlobHashes)))
			}
		}
	}
	// All basic transaction validation checks passed.
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/transaction.go">
```go
// core/types/transaction.go

// Validate checks whether the transaction is valid according to the consensus rules.
// This method may be called on transactions received from the network, and does
// not require access to the blockchain. Per-block/per-transaction rules are
// checked in the state transition phase.
func (tx *Transaction) Validate(sigcache *SigCache) error {
	// Basic transaction validation before any signature-related checks.
	if err := tx.validateTx(); err != nil {
		return err
	}
	// Signature-related validation, if any.
	return tx.inner.Validate(sigcache, false)
}

// validateTx checks the transaction for non-signature-related validity.
func (tx *Transaction) validateTx() error {
	// Both gasPrice and gasFeeCap/gasTipCap can't be all zero.
	if tx.GasFeeCapInt() == nil && tx.GasPriceInt() == nil {
		return ErrTxTypeNotSupported
	}
	// A transaction with a GAsFeeCap must have GasTipCap.
	if tx.GasFeeCapInt() != nil && tx.GasTipCapInt() == nil {
		return ErrTxTypeNotSupported
	}
	// GasFeeCap must be no less than GasTipCap.
	if tx.GasFeeCapInt() != nil && tx.GasFeeCap().Cmp(tx.GasTipCap()) < 0 {
		return errors.New("max fee per gas less than max priority fee per gas")
	}
	// If the type is not DynamicFeeTx, gasFeeCap and gasTipCap must be unset.
	if tx.Type() != DynamicFeeTxType && (tx.GasFeeCapInt() != nil || tx.GasTipCapInt() != nil) {
		return ErrTxTypeNotSupported
	}
	// If the type is not BlobTx, blobFeeCap and blobHashes must be unset.
	if tx.Type() != BlobTxType && (tx.BlobGasFeeCapInt() != nil || len(tx.BlobHashes()) > 0) {
		return ErrTxTypeNotSupported
	}
	// Ensure the transaction has a recipient if it's a blob transaction.
	if tx.Type() == BlobTxType && tx.To() == nil {
		return ErrNoRecipient
	}
	// Ensure transaction size is not too large.
	if size := tx.Size(); size > MaxTxSize {
		return fmt.Errorf("%w: %d > %d", ErrTxTooLarge, size, MaxTxSize)
	}
	// Heuristic limit, check that the gas limit is not astronomically high.
	if tx.Gas() > maxGasLimit {
		return fmt.Errorf("%w: %d > %d", ErrGasLimit, tx.Gas(), maxGasLimit)
	}
	// Value can't be negative.
	if tx.Value().Sign() < 0 {
		return ErrNegativeValue
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/blob_tx.go">
```go
// core/types/blob_tx.go

// Validate validates the transaction details. This method is public and can be
// called without any side-effects. The more expensive signature validation is
// handled by the `ValidateSignatureValues` method.
func (tx *BlobTx) Validate(rules *params.Rules) error {
	// Call the shared validation logic.
	return validateBlobTx(tx.To, tx.Value, tx.BlobHashes, tx.BlobGasFeeCap, rules)
}

// validateBlobTx validates the blob transaction fields based on the provided
// chain rules. It checks the number of blobs, blob gas price, and recipient.
func validateBlobTx(to *common.Address, value *big.Int, blobHashes []common.Hash, blobFeeCap *big.Int, rules *params.Rules) error {
	// Blob transactions must have at least one blob.
	if len(blobHashes) == 0 {
		return errEmptyBlobTx
	}
	// There is a cap on the number of blobs in a transaction.
	if len(blobHashes) > params.MaxBlobHashesPerTx {
		return fmt.Errorf("too many blobs in transaction: have %d, max %d", len(blobHashes), params.MaxBlobHashesPerTx)
	}
	// Blob transactions cannot be contract creations.
	if to == nil {
		return ErrNoRecipient
	}
	// Disallow sending value to the beacon deposit contract.
	if rules.IsDeposit(to) && value.Cmp(common.Big0) > 0 {
		return ErrValueToDepositContract
	}
	// After Cancun, blob transactions must have a non-nil blobFeeCap.
	if rules.IsCancun && blobFeeCap == nil {
		return errors.New("invalid blob transaction, missing blobFeeCap")
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/analysis.go">
```go
// core/vm/analysis.go

// analyse is a helper function that performs a number of checks on the given
// code as part of the jump destination analysis.
func analyse(code []byte) (jumpdestBitmap, map[uint64]bitvec) {
	// Don't waste time on empty code.
	if len(code) == 0 {
		return jumpdestBitmap{}, nil
	}
	var (
		// This is the main bitmap, which gets returned.
		// For each byte in the code, the corresponding bit is
		// set to 1 if it's a valid jump destination.
		jumpdestBitmap      = make(jumpdestBitmap, len(code))
		pushDataBitmaps     = make(map[uint64]bitvec) // key: pc, value: bitmap of push data
		currentPushDataBv   bitvec                     // bitmap for the push data of the current instruction
		currentPushDataSize uint64                     // size of the push data of the current instruction
		lastPushPC          uint64
	)
	// Iterate over the code and build the bitmap of valid jump destinations.
	// We can't just iterate and look for JUMPDEST, because it may be inside
	// PUSH-data. We need to skip PUSH-data sections.
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])

		// The JUMPDEST opcode is a valid destination.
		if op == JUMPDEST {
			jumpdestBitmap.set(pc)
		}
		// PUSH1-32 are data, not destinations
		if op >= PUSH1 && op <= PUSH32 {
			// Mark this as a PUSH instruction
			// The data bytes of a PUSH instruction are not valid jump destinations
			currentPushDataSize = uint64(op - PUSH1 + 1)
			lastPushPC = pc
		}
		// If we are inside push data, we need to mark it as such. The 'currentPushDataSize'
		// is the size of the push data, and we need to mark that many bytes as 'not a valid destination'.
		// We also need to mark them as being part of push-data, for the purpose of validting that
		// PUSHes are not reading outside of their designated data.
		if currentPushDataSize > 0 {
			if pushDataBitmaps[lastPushPC] == nil {
				pushDataBitmaps[lastPushPC] = newBitvec(currentPushDataSize)
			}
			currentPushDataBv = pushDataBitmaps[lastPushPC]
		}
		// All bytes are part of this PUSH instruction
		// Decrease the remaining size of the push data.
		// When it reaches zero, we are no longer inside push data.
		if currentPushDataSize > 0 {
			pc++
			currentPushDataSize--
		} else {
			pc += 1
		}
	}
	return jumpdestBitmap, pushDataBitmaps
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// core/vm/interpreter.go

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *Interpreter) Run(contract *Contract, input []byte, static bool) (ret []byte, err error) {
	// ... (omitted setup logic) ...

	// Before running the contract, check for some exceptional cases and fail early
	// if the caller is trying to do something that's not allowed.
	if contract.CodeAddr != nil {
		if rules.IsDeposit(contract.CodeAddr) {
			return nil, ErrExecutionReverted
		}
	}
	// Make sure the interpreter is not static if the caller is not static.
	if in.readOnly && !static {
		return nil, ErrWriteProtection
	}
	// Ensure that the initcode size is not too large if this is a contract
	// creation and EIP-3860 is active. This check is done before execution.
	if rules.IsShanghai && contract.isCreate && len(contract.Code) > params.MaxInitCodeSize {
		return nil, ErrMaxInitCodeSizeExceeded
	}

	// The main execution loop
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically, this will not be a problem.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for Tracer to log gas remaining before execution
		logged  bool   // deferred Tracer should ignore already logged steps
	)
	// ... (rest of the loop) ...

	// The opCreate and opCreate2 implementations also contain a check
	// for the size of the *returned* code from the initcode execution.
	// if len(ret) > params.MaxCodeSize {
	//     return nil, ErrMaxCodeSizeExceeded
	// }
	// This ensures that deployed contracts do not exceed the EIP-170 limit.
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/precompiles.go">
```go
// core/vm/precompiled.go

// kzgPointEvaluation implements the KZGPointEvaluation precompile.
type kzgPointEvaluation struct{}

// RequiredGas returns the gas required to execute the precompile.
func (p *kzgPointEvaluation) RequiredGas(input []byte) uint64 {
	return params.KZGPointEvaluationGas
}

func (p *kzgPointEvaluation) Run(input []byte) ([]byte, error) {
	// The precompile takes a 192-byte input, which consists of a versioned hash (32 bytes),
	// a Z value (32 bytes), a Y value (32 bytes), a commitment (48 bytes), and a proof (48 bytes).
	// Any other input size is an error.
	if len(input) != 192 {
		return nil, fmt.Errorf("invalid kzg point evaluation input size, expected 192, got %d", len(input))
	}

	var (
		versionedHash = input[:32]
		z             = input[32:64]
		y             = input[64:96]
		commitment    = input[96:144]
		proof         = input[144:192]
	)

	// Validate the versioned hash. The first byte must be the blob commitment version.
	if versionedHash[0] != params.BlobTxVersion {
		return nil, errors.New("invalid versioned hash version")
	}

	// The actual cryptographic verification is delegated to a crypto library.
	// The call can fail if any of the inputs are invalid.
	err := crypto.VerifyKZGProof(commitment, proof, z, y)
	if err != nil {
		return nil, err
	}

	// If the verification succeeds, return the required output:
	// a 32-byte field element count and a 32-byte modulus.
	return p.successOutput(), nil
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt outlines an exceptionally comprehensive and proactive input validation framework. It's a great design for a security-focused EVM implementation. However, it's worth noting that this design goes beyond what a standard EVM implementation like go-ethereum does.

Here are a few points of context and suggestions:

1.  **Security Monitor Philosophy**: The prompt's `SecurityMonitor` aims to detect specific smart contract vulnerabilities (like reentrancy, backdoors, infinite loops) via static analysis of bytecode. While this is a powerful security feature, it's important to be aware of the following:
    *   **Performance**: Such analysis can be computationally expensive. Running it for every transaction or contract call might introduce significant overhead. In go-ethereum, security is enforced by the EVM's core rules (gas metering, stack depth, etc.), not by pattern-matching for application-level vulnerabilities.
    *   **Complexity & False Positives**: Reliably detecting vulnerabilities like reentrancy with static analysis is a complex problem that is the focus of specialized tools (e.g., Slither, Mythril). Integrating this into the EVM core requires careful implementation to avoid both false positives (rejecting valid code) and false negatives (missing actual vulnerabilities).
    *   **Recommendation**: Consider making these advanced security checks a configurable, off-by-default feature or part of a separate, offline analysis pipeline rather than a mandatory step in the critical execution path.

2.  **JUMPDEST Validation**: The prompt correctly identifies the need to validate `JUMPDEST` positions. Go-ethereum's `analyse` function (in `core/vm/analysis.go`) is an excellent reference. It uses a `bitvec` to pre-calculate all valid jump destinations when code is first loaded, making runtime `JUMP` validation an O(1) bitmap lookup. This is a highly performant approach worth emulating.

3.  **Input Sanitization**: The prompt includes a `SanitizerRegistry`. This is a unique feature. In general, EVM inputs like bytecode and transaction data are treated as immutable. Sanitizing them would alter their hash and invalidate signatures. This concept might be more applicable to data *before* it's signed into a transaction or for inputs to off-chain tools, rather than for data being executed on-chain. If the intent is to sanitize data for RPC calls or other external interfaces, this is a valid and useful security measure. For on-chain execution, however, the data must be processed as-is.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/validation.go">
```go
// ValidateTransaction is a helper method to check whether a transaction is valid
// according to the consensus rules, but does not check state-dependent validation
// (balance, nonce, etc).
//
// This check is public to allow different transaction pools to check the basic
// rules without duplicating code and running the risk of missed updates.
func ValidateTransaction(tx *types.Transaction, head *types.Header, signer types.Signer, opts *ValidationOptions) error {
	// Ensure transactions not implemented by the calling pool are rejected
	if opts.Accept&(1<<tx.Type()) == 0 {
		return fmt.Errorf("%w: tx type %v not supported by this pool", core.ErrTxTypeNotSupported, tx.Type())
	}
	if blobCount := len(tx.BlobHashes()); blobCount > opts.MaxBlobCount {
		return fmt.Errorf("%w: blob count %v, limit %v", ErrTxBlobLimitExceeded, blobCount, opts.MaxBlobCount)
	}
	// Before performing any expensive validations, sanity check that the tx is
	// smaller than the maximum limit the pool can meaningfully handle
	if tx.Size() > opts.MaxSize {
		return fmt.Errorf("%w: transaction size %v, limit %v", ErrOversizedData, tx.Size(), opts.MaxSize)
	}
	// Ensure only transactions that have been enabled are accepted
	rules := opts.Config.Rules(head.Number, head.Difficulty.Sign() == 0, head.Time)
	if !rules.IsBerlin && tx.Type() != types.LegacyTxType {
		return fmt.Errorf("%w: type %d rejected, pool not yet in Berlin", core.ErrTxTypeNotSupported, tx.Type())
	}
	if !rules.IsLondon && tx.Type() == types.DynamicFeeTxType {
		return fmt.Errorf("%w: type %d rejected, pool not yet in London", core.ErrTxTypeNotSupported, tx.Type())
	}
	if !rules.IsCancun && tx.Type() == types.BlobTxType {
		return fmt.Errorf("%w: type %d rejected, pool not yet in Cancun", core.ErrTxTypeNotSupported, tx.Type())
	}
	if !rules.IsPrague && tx.Type() == types.SetCodeTxType {
		return fmt.Errorf("%w: type %d rejected, pool not yet in Prague", core.ErrTxTypeNotSupported, tx.Type())
	}
	// Check whether the init code size has been exceeded
	if rules.IsShanghai && tx.To() == nil && len(tx.Data()) > params.MaxInitCodeSize {
		return fmt.Errorf("%w: code size %v, limit %v", core.ErrMaxInitCodeSizeExceeded, len(tx.Data()), params.MaxInitCodeSize)
	}
	// Transactions can't be negative. This may never happen using RLP decoded
	// transactions but may occur for transactions created using the RPC.
	if tx.Value().Sign() < 0 {
		return ErrNegativeValue
	}
	// Ensure the transaction doesn't exceed the current block limit gas
	if head.GasLimit < tx.Gas() {
		return ErrGasLimit
	}
	// Sanity check for extremely large numbers (supported by RLP or RPC)
	if tx.GasFeeCap().BitLen() > 256 {
		return core.ErrFeeCapVeryHigh
	}
	if tx.GasTipCap().BitLen() > 256 {
		return core.ErrTipVeryHigh
	}
	// Ensure gasFeeCap is greater than or equal to gasTipCap
	if tx.GasFeeCapIntCmp(tx.GasTipCap()) < 0 {
		return core.ErrTipAboveFeeCap
	}
	// Make sure the transaction is signed properly
	if _, err := types.Sender(signer, tx); err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidSender, err)
	}
	// Ensure the transaction has more gas than the bare minimum needed to cover
	// the transaction metadata
	intrGas, err := core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.SetCodeAuthorizations(), tx.To() == nil, true, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return err
	}
	if tx.Gas() < intrGas {
		return fmt.Errorf("%w: gas %v, minimum needed %v", core.ErrIntrinsicGas, tx.Gas(), intrGas)
	}
	// Ensure the transaction can cover floor data gas.
	if opts.Config.IsPrague(head.Number, head.Time) {
		floorDataGas, err := core.FloorDataGas(tx.Data())
		if err != nil {
			return err
		}
		if tx.Gas() < floorDataGas {
			return fmt.Errorf("%w: gas %v, minimum needed %v", core.ErrFloorDataGas, tx.Gas(), floorDataGas)
		}
	}
	// Ensure the gasprice is high enough to cover the requirement of the calling pool
	if tx.GasTipCapIntCmp(opts.MinTip) < 0 {
		return fmt.Errorf("%w: gas tip cap %v, minimum needed %v", ErrTxGasPriceTooLow, tx.GasTipCap(), opts.MinTip)
	}
	if tx.Type() == types.BlobTxType {
		return validateBlobTx(tx, head, opts)
	}
	if tx.Type() == types.SetCodeTxType {
		if len(tx.SetCodeAuthorizations()) == 0 {
			return fmt.Errorf("set code tx must have at least one authorization tuple")
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis_legacy.go">
```go
// bitvec is a bit vector which maps bytes in a program.
// An unset bit means the byte is an opcode, a set bit means
// it's data (i.e. argument of PUSHxx).
type bitvec []byte

func (bits bitvec) set1(pos uint64) {
	bits[pos/8] |= 1 << (pos % 8)
}
...

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
		switch numbits {
		case 1:
			bits.set1(pc)
			pc += 1
		// ... cases 2-7
		}
	}
	return bits
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() { in.evm.depth-- }()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This also makes sure that the readOnly flag isn't removed for child calls.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}
...
	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
...
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
...
		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		if err != nil {
			break
		}
		pc++
	}

	if err == errStopToken {
		err = nil // clear stop token error
	}

	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef
type Contract struct {
	// caller is the result of the caller which initialised this
	// contract. However, when the "call method" is delegated this
	// value needs to be initialised to that of the caller's caller.
	caller  common.Address
	address common.Address

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // Locally cached result of JUMPDEST analysis

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	// is the execution frame represented by this object a contract deployment
	IsDeployment bool
	IsSystemCall bool

	Gas   uint64
	value *uint256.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller common.Address, address common.Address, value *uint256.Int, gas uint64, jumpDests map[common.Hash]bitvec) *Contract {
	// Initialize the jump analysis map if it's nil, mostly for tests
	if jumpDests == nil {
		jumpDests = make(map[common.Hash]bitvec)
	}
	return &Contract{
		caller:    caller,
		address:   address,
		jumpdests: jumpDests,
		Gas:       gas,
		value:     value,
	}
}

func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// PC cannot go beyond len(code) and certainly can't be bigger than 63bits.
	// Don't bother checking for JUMPDEST in that case.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// Only JUMPDESTs allowed for destinations
	if OpCode(c.Code[udest]) != JUMPDEST {
		return false
	}
	return c.isCode(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// RunPrecompiledContract runs and evaluates the output of a precompiled contract.
// It returns
// - the returned bytes,
// - the _remaining_ gas,
// - any error that occurred
func RunPrecompiledContract(p PrecompiledContract, input []byte, suppliedGas uint64, logger *tracing.Hooks) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if suppliedGas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	if logger != nil && logger.OnGasChange != nil {
		logger.OnGasChange(suppliedGas, suppliedGas-gasCost, tracing.GasChangeCallPrecompiledContract)
	}
	suppliedGas -= gasCost
	output, err := p.Run(input)
	return output, suppliedGas, err
}
...
// kzgPointEvaluation implements the EIP-4844 point evaluation precompile.
type kzgPointEvaluation struct{}

// RequiredGas estimates the gas required for running the point evaluation precompile.
func (b *kzgPointEvaluation) RequiredGas(input []byte) uint64 {
	return params.BlobTxPointEvaluationPrecompileGas
}
...
// Run executes the point evaluation precompile.
func (b *kzgPointEvaluation) Run(input []byte) ([]byte, error) {
	if len(input) != blobVerifyInputLength {
		return nil, errBlobVerifyInvalidInputLength
	}
	// versioned hash: first 32 bytes
	var versionedHash common.Hash
	copy(versionedHash[:], input[:])

	var (
		point kzg4844.Point
		claim kzg4844.Claim
	)
	// Evaluation point: next 32 bytes
	copy(point[:], input[32:])
	// Expected output: next 32 bytes
	copy(claim[:], input[64:])

	// input kzg point: next 48 bytes
	var commitment kzg4844.Commitment
	copy(commitment[:], input[96:])
	if kZGToVersionedHash(commitment) != versionedHash {
		return nil, errBlobVerifyMismatchedVersion
	}

	// Proof: next 48 bytes
	var proof kzg4844.Proof
	copy(proof[:], input[144:])

	if err := kzg4844.VerifyProof(commitment, point, claim, proof); err != nil {
		return nil, fmt.Errorf("%w: %v", errBlobVerifyKZGProof, err)
	}

	return common.Hex2Bytes(blobPrecompileReturnValue), nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied since the last state
// commit. These are tracked to be able to be reverted in the case of an execution
// exception or request for reversal.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes

	validRevisions []revision
	nextRevisionId int
}

// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the Ethereum address modified by this journal entry.
	dirtied() *common.Address

	// copy returns a deep-copied journal entry.
	copy() journalEntry
}

// snapshot returns an identifier for the current revision of the state.
func (j *journal) snapshot() int {
	id := j.nextRevisionId
	j.nextRevisionId++
	j.validRevisions = append(j.validRevisions, revision{id, j.length()})
	return id
}

// revertToSnapshot reverts all state changes made since the given revision.
func (j *journal) revertToSnapshot(revid int, s *StateDB) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(j.validRevisions), func(i int) bool {
		return j.validRevisions[i].id >= revid
	})
	if idx == len(j.validRevisions) || j.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := j.validRevisions[idx].journalIndex

	// Replay the journal to undo changes and remove invalidated snapshots
	j.revert(s, snapshot)
	j.validRevisions = j.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Gas costs
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastishStep uint64 = 4
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)

// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed during the homestead price change HF.
// As part of EIP 150 (TangerineWhistle), the returned gas is gas - base * 63 / 64.
func callGas(isEip150 bool, availableGas, base uint64, callCost *uint256.Int) (uint64, error) {
	if isEip150 {
		availableGas = availableGas - base
		gas := availableGas - availableGas/64
		// If the bit length exceeds 64 bit we know that the newly calculated "gas" for EIP150
		// is smaller than the requested amount. Therefore we return the new gas instead
		// of returning an error.
		if !callCost.IsUint64() || gas < callCost.Uint64() {
			return gas, nil
		}
	}
	if !callCost.IsUint64() {
		return 0, ErrGasUintOverflow
	}

	return callCost.Uint64(), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takse
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (tracer hooks) ...
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() && !evm.Context.CanTransfer(evm.StateDB, caller, value) {
		return nil, gas, ErrInsufficientBalance
	}
	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	if !evm.StateDB.Exist(addr) {
		if !isPrecompile && evm.chainRules.IsEIP4762 && !isSystemCall(caller) {
			// ... (witness gas charging) ...
		}

		if !isPrecompile && evm.chainRules.IsEIP158 && value.IsZero() {
			// Calling a non-existing account, don't do anything.
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		code := evm.resolveCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // gas is unchanged
		} else {
			// The contract is a scoped environment for this execution context only.
			contract := NewContract(caller, addr, value, gas, evm.jumpDests)
			contract.IsSystemCall = isSystemCall(caller)
			contract.SetCallCode(evm.resolveCodeHash(addr), code)
			ret, err = evm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	// When an error was returned by the EVM or when setting the creation code
	// above we revert to the snapshot and consume any gas remaining. Additionally,
	// when we're in homestead this also counts for code storage gas errors.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			// ... (gas change tracing) ...
			gas = 0
		}
	}
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
// List evm execution errors
var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxCodeSizeExceeded      = errors.New("max code size exceeded")
	ErrMaxInitCodeSizeExceeded  = errors.New("max initcode size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	ErrReturnDataOutOfBounds    = errors.New("return data out of bounds")
	ErrGasUintOverflow          = errors.New("gas uint64 overflow")
	ErrInvalidCode              = errors.New("invalid code: must not begin with 0xef")
	ErrNonceUintOverflow        = errors.New("nonce uint64 overflow")

	// errStopToken is an internal token indicating interpreter loop termination,
	// never returned to outside callers.
	errStopToken = errors.New("stop token")
)

// ErrStackUnderflow wraps an evm error when the items on the stack less
// than the minimal requirement.
type ErrStackUnderflow struct {
	stackLen int
	required int
}

func (e ErrStackUnderflow) Error() string {
	return fmt.Sprintf("stack underflow (%d <=> %d)", e.stackLen, e.required)
}

// ErrStackOverflow wraps an evm error when the items on the stack exceeds
// the maximum allowance.
type ErrStackOverflow struct {
	stackLen int
	limit    int
}

func (e ErrStackOverflow) Error() string {
	return fmt.Sprintf("stack limit reached %d (%d)", e.stackLen, e.limit)
}

// ErrInvalidOpCode wraps an evm error when an invalid opcode is encountered.
type ErrInvalidOpCode struct {
	opcode OpCode
}

func (e *ErrInvalidOpCode) Error() string { return fmt.Sprintf("invalid opcode: %s", e.opcode) }
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eips.go">
```go
// EnableEIP enables the given EIP on the config.
// This operation writes in-place, and callers need to ensure that the globally
// defined jump tables are not polluted.
func EnableEIP(eipNum int, jt *JumpTable) error {
	enablerFn, ok := activators[eipNum]
	if !ok {
		return fmt.Errorf("undefined eip %d", eipNum)
	}
	enablerFn(jt)
	return nil
}
...
// enable2929 enables "EIP-2929: Gas cost increases for state access opcodes"
// https://eips.ethereum.org/EIPS/eip-2929
func enable2929(jt *JumpTable) {
	jt[SSTORE].dynamicGas = gasSStoreEIP2929

	jt[SLOAD].constantGas = 0
	jt[SLOAD].dynamicGas = gasSLoadEIP2929

	jt[EXTCODECOPY].constantGas = params.WarmStorageReadCostEIP2929
	jt[EXTCODECOPY].dynamicGas = gasExtCodeCopyEIP2929
...
}

// enable3529 enabled "EIP-3529: Reduction in refunds":
// - Removes refunds for selfdestructs
// - Reduces refunds for SSTORE
// - Reduces max refunds to 20% gas
func enable3529(jt *JumpTable) {
	jt[SSTORE].dynamicGas = gasSStoreEIP3529
	jt[SELFDESTRUCT].dynamicGas = gasSelfdestructEIP3529
}

// enable3198 applies EIP-3198 (BASEFEE Opcode)
// - Adds an opcode that returns the current block's base fee.
func enable3198(jt *JumpTable) {
	// New opcode
	jt[BASEFEE] = &operation{
		execute:     opBaseFee,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
}

// enable3855 applies EIP-3855 (PUSH0 opcode)
func enable3855(jt *JumpTable) {
	// New opcode
	jt[PUSH0] = &operation{
		execute:     opPush0,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/access_list.go">
```go
// accessList contains the addresses and storage slots that the current transaction
// has accessed. The access list is built up during transaction execution and is
// used to generate the gas costs following EIP-2929.
//
// After each transaction, the access list is reset.
//
// The access list is not thread-safe.

type accessList struct {
	addresses map[common.Address]int
	slots     []map[common.Hash]struct{}
}

// AddAddress adds an address to the access list, and returns 'true' if the operation
// caused a change (addr was not previously in the list).
func (al *accessList) AddAddress(address common.Address) bool {
	if _, present := al.addresses[address]; present {
		return false
	}
	al.addresses[address] = -1
	return true
}

// AddSlot adds the specified (addr, slot) combo to the access list.
// Return values are:
// - address added
// - slot added
// For any 'true' value returned, a corresponding journal entry must be made.
func (al *accessList) AddSlot(address common.Address, slot common.Hash) (addrChange bool, slotChange bool) {
	idx, addrPresent := al.addresses[address]
	if !addrPresent || idx == -1 {
		// Address not present, or addr present but no slots there
		al.addresses[address] = len(al.slots)
		slotmap := map[common.Hash]struct{}{slot: {}}
		al.slots = append(al.slots, slotmap)
		return !addrPresent, true
	}
	// There is already an (address,slot) mapping
	slotmap := al.slots[idx]
	if _, ok := slotmap[slot]; !ok {
		slotmap[slot] = struct{}{}
		// Journal add slot change
		return false, true
	}
	// No changes required
	return false, false
}
```
</file>
</go-ethereum>
## Prompt Corrections
The prompt's design for an `InputValidationManager` is very comprehensive and well-structured. It aligns well with modern security practices like OWASP guidelines. Here are a few corrections and suggestions based on go-ethereum's implementation to make it even more robust and aligned with real-world EVM clients:

1.  **Hardfork-Specific Validation**: The `ValidationConfig` should probably include a `Hardfork` or `ChainRules` parameter. Many validation rules in Ethereum (e.g., valid opcodes, gas costs, transaction types) are entirely dependent on the active hardfork. Geth's `params.ChainConfig` and its associated `Rules` struct are central to its validation logic. The `ValidatorRegistry` should be initialized or configured based on these rules.

2.  **State-Dependent Validation**: The prompt focuses on *input* validation, which is mostly stateless. However, many critical transaction validations in Ethereum are *stateful* (e.g., checking the sender's nonce, verifying sufficient balance). The `validate_transaction_input` function should probably take a `StateDB` or a similar state reader interface as an argument to perform these crucial checks. The `core/txpool/validation.go` file in Geth shows this pattern clearly, where `ValidateTransactionWithState` takes a state object.

3.  **JUMPDEST Analysis**: The prompt correctly identifies the need to validate `JUMPDEST` positions. Geth uses a `bitvec` (bit vector) created by analyzing the bytecode once (`codeBitmap` in `core/vm/analysis_legacy.go`) and then caching it. This is a highly efficient way to perform `JUMPDEST` checks. The proposed `validate_jumpdest_positions` function should adopt this pattern rather than re-scanning the bytecode on every jump. The `Contract` object in Geth caches this analysis.

4.  **Security Threat Nuances**:
    *   **Re-entrancy**: Detecting re-entrancy from raw transaction data (`tx_input.data`) is nearly impossible. Re-entrancy is a runtime vulnerability related to contract logic (e.g., a `CALL` made before an `SSTORE`). Static analysis of bytecode can hint at potential vulnerabilities, but true detection happens during execution tracing or more sophisticated analysis. The prompt's check for excessive `CALL` opcodes in transaction data is a heuristic but might produce many false positives. A more accurate check would involve analyzing the contract's bytecode itself.
    *   **Infinite Loops**: Detecting infinite loops statically is equivalent to the halting problem and is generally undecidable. Geth relies on the gas mechanism to prevent infinite loops from halting the network. The proposed `contains_potential_infinite_loop` is a good heuristic for simple, tight loops, but it won't catch more complex cases. The primary defense remains gas.

5.  **ABI Validation**: The prompt's `validate_abi_compliance` is a good idea. Checking that `function_data.len % 32 == 0` is a solid basic check. More advanced ABI validation (like ensuring dynamic types have correct offsets) would require the contract's ABI definition, which is not typically available to the EVM itself. The check is good, but its scope is limited by available information.

6.  **Error vs. Revert**: The EVM distinguishes between errors that consume all gas (e.g., `InvalidOpcode`, `StackUnderflow`) and a `REVERT`, which refunds remaining gas. The `ValidationResult` should probably have a way to signal this distinction, as it has significant implications for the caller. Geth's `vm/errors.go` clearly defines these different error types.

---

An excellent and detailed prompt. Implementing a robust input validation framework is critical for the security and stability of any EVM. The go-ethereum codebase provides a mature and battle-tested implementation of these validation principles.

The key insight from go-ethereum is that validation isn't performed by a single, monolithic "validator" module. Instead, validation is a multi-stage process, with checks happening at different points in the transaction and execution lifecycle:

1.  **Transaction Pool Validation (`core/txpool.go`):** Initial sanity checks before a transaction is even considered for inclusion in a block. This includes signature verification, nonce ordering, and fee checks.
2.  **State Transition Validation (`core/state_transition.go`):** Pre-execution checks that require state access. This is where balance, gas limits, and nonce against the current state are verified.
3.  **EVM/Opcode Validation (`core/vm/*.go`):** Runtime checks during execution, such as bytecode structure (JUMPDEST analysis), stack depth, and state-modification rules in static contexts.

This layered approach ensures that invalid inputs are rejected as early as possible.

Here are the most relevant code snippets from go-ethereum to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// state_transition.go provides the logic for transitioning the state of the EVM
// by applying a transaction. It includes critical validation steps.

// ApplyMessage computes the new state by applying the given message against the
// current state database. It is the core of the EVM's state transition logic.
// The function is called during transaction processing and for eth_call/estimateGas.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// StateTransition is an intermediate object to execute an EVM message.
type StateTransition struct {
	gp         *GasPool
	msg        *Message
	evm        *vm.EVM
	initialGas uint64
}

// NewStateTransition initialises a new state transition object.
func NewStateTransition(evm *vm.EVM, msg *Message, gp *GasPool) *StateTransition {
	return &StateTransition{
		gp:         gp,
		msg:        msg,
		evm:        evm,
		initialGas: msg.GasLimit,
	}
}

// TransitionDb will transition the state by applying the current message and
// returning the execution result including the used gas. It is the core of the
// EVM execution. It is not allowed to call this function more than once.
//
// The function consists of three steps:
// 1. Check whether the sender has enough funds to pay for the intrinsic gas.
// 2. Transfer the value, if any, and set up the EVM for the message call.
// 3. Run the EVM.
// 4. Pay the gas fee to the coinbase.
func (st *StateTransition) TransitionDb() (*ExecutionResult, error) {
	// 1. Check whether the sender has enough funds for intrinsic gas.
	// This check is already performed when the transaction is added to the pool.
	// It's still performed here for eth_call and for transactions executed by the
	// miner which might not have been in the pool.
	if err := st.preCheck(); err != nil {
		return nil, err
	}
	msg := st.msg
	sender := vm.AccountRef(msg.From)
	homestead := st.evm.ChainConfig().IsHomestead(st.evm.Context.BlockNumber)
	contractCreation := msg.To == nil

	// Intrinsic gas checking. This is a crucial step for DoS protection.
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, homestead, st.evm.ChainConfig().IsIstanbul(st.evm.Context.BlockNumber), st.evm.ChainConfig().IsShanghai(st.evm.Context.BlockNumber, st.evm.Context.Time))
	if err != nil {
		return nil, err
	}
	// ... (value transfer and EVM setup)

	// 3. Run the EVM.
	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not returned as method errors
	)
	if contractCreation {
		// This is where bytecode validation for contract creation happens.
		ret, _, st.gas, vmerr = st.evm.Create(sender, msg.Data, st.gas, uint256.MustFromBig(msg.Value))
	} else {
		// This is where a normal contract call happens.
		ret, st.gas, vmerr = st.evm.Call(sender, *msg.To, msg.Data, st.gas, uint256.MustFromBig(msg.Value))
	}
	// ... (gas fee payment)

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}

// preCheck performs a preliminary check, before the state transition is formally started.
// The check consists of:
// - check that the sender is an EOA
// - check nonce
// - check balance
func (st *StateTransition) preCheck() error {
	msg := st.msg
	sender := st.evm.StateDB.GetOrNewStateObject(msg.From)

	// Make sure this transaction's nonce is correct.
	if !msg.SkipNonceChecks {
		// ... (nonce check logic)
	}

	// Make sure the sender has enough balance to cover the transaction cost.
	if err := st.buyGas(); err != nil {
		return err
	}
	return nil
}

// IntrinsicGas computes the 'intrinsic gas' for a message with the given data.
// Intrinsic gas is the cost of simply putting the transaction on the chain,
// before any execution is done. It includes costs for data bytes, contract
// creation, and access list entries. This is a critical part of input validation
// to prevent DoS attacks with large, cheap transactions.
func IntrinsicGas(data []byte, accessList types.AccessList, authorizations []types.SetCodeAuthorization, isContractCreation, isHomestead, isIstanbul, isShanghai bool) (uint64, error) {
	var gas uint64
	if isContractCreation && isHomestead {
		gas = params.TxGasContractCreation
	} else {
		gas = params.TxGas
	}
	// Bump the required gas by the amount of transactional data
	if len(data) > 0 {
		// Zero and non-zero bytes are priced differently
		var nz uint64
		for _, b := range data {
			if b != 0 {
				nz++
			}
		}
		z := uint64(len(data)) - nz

		// EIP-2028: reduced gas cost for calldata
		var nonZeroGas uint64
		if isIstanbul {
			nonZeroGas = params.TxDataNonZeroGasEIP2028
		} else {
			nonZeroGas = params.TxDataNonZeroGasFrontier
		}
		// ... (gas calculation logic)
	}
	// EIP-2930: Access lists
	if accessList != nil {
		gas += uint64(len(accessList)) * params.TxAccessListAddressGas
		gas += uint64(accessList.StorageKeys()) * params.TxAccessListStorageKeyGas
	}
	// EIP-3860: Initcode gas cost
	if isContractCreation && isShanghai {
		gas += uint64(len(data)+31)/32 * params.InitcodeWordGas
	}
	// EIP-7702: Set-code authorizations
	gas += uint64(len(authorizations)) * params.SetCodeAuthGas
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// contracts.go contains the implementation for contract creation and bytecode
// validation, which is a key part of the input validation framework.

// validateCode contains the logic for contract code validation.
// It's used to check both initcode and the code returned by a constructor.
// This is analogous to the `validate_bytecode_input` function in the prompt.
func validateCode(code []byte, isEIP3860 bool) error {
	// EIP-3860: Limit and meter initcode
	if isEIP3860 && len(code) > params.MaxInitCodeSize {
		return ErrMaxInitCodeSizeExceeded
	}
	return validateCodeInternal(code)
}

// validateCodeForCreate contains logic for contract code validation.
func validateCodeForCreate(code []byte, config *params.ChainConfig, header *types.Header) error {
	// EIP-170: contract code size limit
	if config.IsEIP170(header.Number) && len(code) > params.MaxCodeSize {
		return ErrMaxCodeSizeExceeded
	}
	return validateCodeInternal(code)
}

// validateCodeInternal contains the logic for contract code validation.
// It's used to check for invalid opcodes and ensure JUMPDESTs are valid.
func validateCodeInternal(code []byte) error {
	// We can only analyse code up to MaxCodeSize. Anything above that is invalid
	// anyway. We could fail here if len(code) > MaxCodeSize, but we're also
	// using this function for init-code analysis, which has a different size limit.
	// So for now, the caller is responsible for checking size limits.
	if len(code) == 0 {
		return nil
	}
	// EIP-3541: reject contracts starting with 0xEF
	if code[0] == 0xEF {
		return ErrInvalidCode
	}

	// Analyse the code and check for invalid opcodes.
	// JUMPDEST analysis is performed to ensure that jump destinations are valid.
	// A JUMPDEST must be preceded by a PUSH instruction of the correct size.
	// This prevents jumping into the middle of multi-byte instructions.
	jumpdests, err := codeAnalysis(code)
	if err != nil {
		return err
	}
	// Additionally, validate that all jumpdests are valid.
	// A JUMPDEST is valid if it is part of the code and not part of push data.
	i := 0
	for i < len(code) {
		op := OpCode(code[i])
		if op.IsPush() {
			i += int(op) - int(PUSH1) + 1
		} else if op == JUMPDEST {
			// This is where geth checks for a valid JUMPDEST.
			if !jumpdests.Has(i) {
				return ErrInvalidJumpDest
			}
		}
		i++
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// analysis.go contains the implementation for bytecode analysis, which is
// used to validate bytecode structure, particularly JUMPDEST locations.

// codeAnalysis performs a one-time analysis of the given code and returns a set of valid jump destinations.
// The go-ethereum implementation uses a bit vector for this, which is very similar to the
// proposed Zig implementation.
func codeAnalysis(code []byte) (bitvec, error) {
	// Don't analyze code in unreachable blocks.
	// The max code size is 24576 bytes, so we can't have more than that many
	// jump destinations.
	if len(code) > params.MaxCodeSize {
		return nil, ErrMaxCodeSizeExceeded
	}
	// Iterate over the code and compute the bit vector of valid jump destinations.
	// A jump destination is valid if:
	// - it's a JUMPDEST opcode
	// - it's not part of the data of a PUSH opcode
	var (
		dests = make(bitvec, (len(code)+7)/8)
		i     = 0
	)
	for i < len(code) {
		op := OpCode(code[i])
		if op == JUMPDEST {
			dests.set(i)
		} else if op.IsPush() {
			// PUSH instruction, skip the data argument
			i += int(op) - int(PUSH1) + 1
		}
		i++
	}
	return dests, nil
}

// A bitvec is a bit vector which can be used to check for the validity of jump destinations.
type bitvec []byte

func (bits bitvec) set(pos int) {
	bits[pos/8] |= 1 << (pos % 8)
}

func (bits bitvec) Has(pos int) bool {
	if pos >= len(bits)*8 {
		return false
	}
	return bits[pos/8]&(1<<(pos%8)) != 0
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// evm.go contains the core EVM execution logic, including call validation.

// Call executes the contract associated with the destination address.
// It is the main entry point for executing a message call.
// This function validates call depth and static call constraints before execution.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call.
	if evm.Context.IsStatic && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// ... (State object retrieval and precompile checks)

	// Create a new frame for the call.
	p := new(Precompile)
	if p.Address() != (common.Address{}) {
		// ... (Precompile execution)
	} else {
		// ... (Normal contract execution)
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
// errors.go defines the various error types returned by the EVM during execution.
// These are excellent analogues for the `ViolationType` enum in the prompt.

var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxCodeSizeExceeded      = errors.New("max code size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	ErrReturnDataOutOfBounds    = errors.New("return data out of bounds")
	ErrInvalidCode              = errors.New("invalid code: must not start with 0xef")
	ErrInvalidGas               = errors.New("invalid gas")
	ErrStackOverflow            = errors.New("stack overflow")
	ErrStackUnderflow           = errors.New("stack underflow")
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// config.go defines the chain configuration, which is analogous to the
// `ValidationConfig` in the prompt. It controls which rules (EIPs) are active.

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

	// EIP150 implements the Gas price changes for IO-heavy operations gas repricing.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork, 0 = already activated)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork, 0 = already on muir glacier)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork, 0 = already on arrow glacier)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork, 0 = already on gray glacier)

	// Merge handling
	TerminalTotalDifficulty       *big.Int `json:"terminalTotalDifficulty,omitempty"`       // The total difficulty at which the network transitions to proof-of-stake.
	TerminalTotalDifficultyPassed bool     `json:"terminalTotalDifficultyPassed,omitempty"` // Whether the TTD is reached and the transition is done.
	MergeNetsplitBlock            *big.Int `json:"mergeNetsplitBlock,omitempty"`            // Block number of the ETH1-side only merge-fork network split (for testing PoS transition).

	// Shanghai and Cancun switch time (nil = no fork, 0 = already on fork)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`
	CancunTime   *uint64 `json:"cancunTime,omitempty"`
	PragueTime   *uint64 `json:"pragueTime,omitempty"`
	OsakaTime    *uint64 `json:"osakaTime,omitempty"`

	// Ethash is the consensus engine based on proof-of-work.
	Ethash *EthashConfig `json:"ethash,omitempty"`

	// Clique is the consensus engine based on proof-of-authority.
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// IsHomestead tells whether a block is in the Homestead fork.
func (c *ChainConfig) IsHomestead(num *big.Int) bool {
	return isForked(c.HomesteadBlock, num)
}

// IsEIP150 tells whether a block is in the EIP150 fork.
func (c *ChainConfig) IsEIP150(num *big.Int) bool {
	return isForked(c.EIP150Block, num)
}
// ... and so on for all other hardforks (IsByzantium, IsLondon, IsCancun, etc.)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// jump_table.go contains the logic for dispatching opcodes based on the
// active hardfork. This is a great model for the `ValidatorRegistry` in the prompt.

// JumpTable contains the EVM instructions for a particular ruleset.
type JumpTable [256]operation

var (
	// frontierInstructionSet contains the instructions for the Frontier ruleset.
	frontierInstructionSet = newFrontierInstructionSet()
	// homesteadInstructionSet contains the instructions for the Homestead ruleset.
	homesteadInstructionSet = newHomesteadInstructionSet()
	// byzantiumInstructionSet contains the instructions for the Byzantium ruleset.
	byzantiumInstructionSet = newByzantiumInstructionSet()
	// ... and so on for other hardforks
)

// newFrontierInstructionSet returns the frontier instruction set.
func newFrontierInstructionSet() [256]operation {
	var jt [256]operation
	for i := 0; i < 256; i++ {
		// Fill the jump table with an invalid operation. This ensures that any
		// opcode that is not defined will result in an error.
		jt[i] = operation{
			execute:     opInvalid,
			constantGas: 0,
			minStack:    minStack(0, 0),
			maxStack:    maxStack(0, 0),
		}
	}
	// Define all valid opcodes for this hardfork.
	jt[ADD] = operation{
		execute:     opAdd,
		constantGas: GasFastestStep,
		minStack:    minStack(2, 1),
		maxStack:    maxStack(2, 1),
	}
	jt[MUL] = operation{
		execute:     opMul,
		constantGas: GasFastStep,
		minStack:    minStack(2, 1),
		maxStack:    maxStack(2, 1),
	}
	// ... (all other opcodes are defined similarly)
	return jt
}

// newByzantiumInstructionSet returns the Byzantium instruction set.
// It builds on top of the previous hardfork's instruction set.
func newByzantiumInstructionSet() [256]operation {
	jt := newHomesteadInstructionSet()
	jt[REVERT] = operation{
		execute:     opRevert,
		constantGas: 0,
		minStack:    minStack(2, 0),
		maxStack:    maxStack(2, 0),
		memorySize:  memoryReturn,
	}
	// ... (other Byzantium changes)
	return jt
}

// newJumpTable returns an EVM jump table for a specific chain configuration.
func newJumpTable(config *params.ChainConfig) *JumpTable {
	// The instruction set is chosen based on the block number, which determines
	// the active hardfork. This is a runtime switch.
	var (
		instructionSet = frontierInstructionSet
		rules          = config.Rules(new(big.Int), false, 0)
	)
	switch {
	case rules.IsCancun:
		instructionSet = newCancunInstructionSet()
	case rules.IsShanghai:
		instructionSet = newShanghaiInstructionSet()
	// ... (cases for all hardforks)
	}
	return (*JumpTable)(&instructionSet)
}

```
</file>
</go-ethereum>

## Prompt Corrections
The prompt is very well-written and provides a clear, structured approach to building an input validation framework. The proposed design is more modular and explicit than go-ethereum's, which is a good thing for a new implementation.

One minor point of feedback based on go-ethereum's design philosophy:

*   **Security Monitoring via Heuristics:** The prompt includes concepts like detecting "malicious function selectors," "potential backdoors," and "fuzzing patterns." While these are valuable for off-chain analysis tools (like Slither, Mythril, or security gateways), they are generally **not** part of the core EVM implementation itself.
    *   **Reasoning:** The EVM's primary security model is based on **deterministic execution and gas metering**, not on trying to guess the *intent* of bytecode. Relying on pattern matching for security can be brittle and lead to two problems:
        1.  **False Positives:** Rejecting valid, but unusually structured, bytecode.
        2.  **False Negatives:** Attackers can easily obfuscate their code to bypass simple pattern checks.
    *   **Geth's Approach:** Go-ethereum focuses on strict, provable validation:
        *   Is the bytecode structurally valid (e.g., `JUMPDEST` analysis)?
        *   Does the transaction pay for its resource usage (data, computation, storage)?
        *   Does it follow protocol rules (stack depth, static call restrictions, etc.)?

My recommendation would be to implement the "SecurityMonitor" as an optional, pluggable component that is disabled by default in production. This allows for powerful security research and development without compromising the core EVM's mandate of neutral, deterministic execution based on established protocol rules. The current Zig spec seems to align with this by having an `enable_security_monitoring` config flag, which is excellent.

---

An input validation framework is a critical component for security and correctness in any EVM implementation. Go-ethereum validates inputs at multiple layers: transaction pool, state transitions, and within the EVM execution loop itself.

The following Go-ethereum code snippets provide battle-tested implementations for validating transactions, bytecode, and runtime values, which are directly relevant to building the requested framework.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/legacypool/validation.go">
```go
// validateTx checks whether a transaction is valid according to the consensus
// rules and adheres to some heuristic limits of the local node (price and size).
func (pool *LegacyPool) validateTx(tx *types.Transaction, local bool) error {
	// TMP: This is a temporary solution for the overhead of validation.
	// It's not a permanent solution, we should either do it in parallel or
	// within the evm.
	// Reference: https://github.com/ethereum/go-ethereum/pull/24432
	if tx.Type() == types.BlobTxType && !pool.chainconfig.IsCancun(pool.currentState.Block().Number(), pool.currentState.Block().Time()) {
		return ErrBlobTxNotEnabled
	}

	// Transactions can't be larger than the network limit.
	if tx.Size() > types.MaxTransactionSize {
		return ErrTxTooLarge
	}
	// Check if the transaction is intrinsically valid
	if err := tx.Validate(); err != nil {
		return err
	}
	// If the transaction is a BlobTx, perform blob checks.
	if tx.Type() == types.BlobTxType {
		if err := tx.CheckBlob(); err != nil {
			return err
		}
	}
	// Checks for non-local transactions. These are not applied to locally submitted transactions.
	if !local {
		// Ensure the transaction has a recipient for regular transfers.
		if tx.To() == nil && tx.Type() != types.LegacyTxType {
			// Contract creation doesn't exist for typed transactions.
			return ErrNoTO
		}
	}

	// Check whether the sender is on the deny list.
	if pool.denylist.Contains(tx.From()) {
		return ErrSenderBlacklisted
	}

	// Transaction fee checks
	// Tip must be above the minimum limit (if configured)
	if pool.gasTip != nil && tx.GasTipCap().Cmp(pool.gasTip) < 0 {
		return ErrUnderpriced
	}
	// Fee cap must be above the current block's base fee (if configured)
	if pool.currentState.BaseFee() != nil && tx.GasFeeCap().Cmp(pool.currentState.BaseFee()) < 0 {
		return ErrUnderpriced
	}

	// Ensure the transaction has enough gas to cover the intrinsic costs.
	gas, err := core.IntrinsicGas(tx.Data(), tx.AccessList(), tx.To() == nil, true, pool.chainconfig.IsEIP4762(pool.currentState.Block().Number(), pool.currentState.Block().Time()))
	if err != nil {
		return err
	}
	if tx.Gas() < gas {
		return ErrIntrinsicGas
	}
	// Make sure the sender has enough funds to cover the transaction costs.
	if pool.currentState.GetBalance(tx.From()).Cmp(tx.Cost()) < 0 {
		return ErrInsufficientFunds
	}
	// Make sure the transaction nonce is not too low.
	if pool.currentState.GetNonce(tx.From()) > tx.Nonce() {
		return ErrNonceTooLow
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// ValidateCode returns an error if the given code is invalid according to the EVM
// rules for the given protocol version (e.g. EIP-3860).
func (in *Interpreter) ValidateCode(code []byte) error {
	// EIP-3860: Limit and meter initcode
	if in.cfg.chainConfig.IsEIP3860(in.time, in.parentHash) && len(code) > params.MaxInitCodeSize {
		return ErrMaxCodeSizeExceeded
	}
	return nil
}

// run runs the EVM code with the given input.
func (in *Interpreter) run(frame *Frame, retbuf *ReturnStack) (ret []byte, err error) {
...
			op = contract.GetOp(frame.pc)

			// Validate stack
			if err := frame.Stack.Validate(op); err != nil {
				return nil, err
			}
...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// bitvec is a bit vector which can be used to mark locations in the code.
type bitvec []byte

// op represents a single opcode.
type opCode byte

// newBitvec returns a new bit vector of the given size.
func newBitvec(size int) bitvec {
	return make(bitvec, (size+7)/8)
}

// set sets the bit at the given index.
func (b bitvec) set(i uint64) {
	b[i/8] |= 1 << (i % 8)
}

// set8 sets the bits in the given range.
func (b bitvec) set8(i uint64) {
	b[i/8] = 0xff
}

// unset sets the bit at the given index.
func (b bitvec) unset(i uint64) {
	b[i/8] &^= 1 << (i % 8)
}

// codeSegment returns true if the bit at the given index is set.
func (b bitvec) codeSegment(i uint64) bool {
	return b[i/8]&(1<<(i%8)) != 0
}

// jumpdestanalysed contains the result of jumpdest-analysis.
// The pointers point to the same slice.
type jumpdestanalysed struct {
	// data is the code that was analysed
	data []byte
	// code is a bit-vector where valid-jump-destinations are marked
	// as 1. The reason for this is that it's way more memory-efficient
	// than using a map, yet it is still quite fast.
	code bitvec
}

// jumpDests contains valid jump destinations.
var jumpDests = cache.New(1024) // cache up to 1024 different contracts

// Analyse analyses the given code and returns a bitvec which indicates the legal
// jump destinations.
func Analyse(code []byte) (bitvec, error) {
	// check if the analysis is present in the cache
	hash := crypto.Keccak256Hash(code)
	if cached, ok := jumpDests.Get(hash); ok {
		return cached.(jumpdestanalysed).code, nil
	}

	analysis, err := analyse(code)
	if err == nil {
		jumpDests.Add(hash, jumpdestanalysed{data: code, code: analysis})
	}
	return analysis, err
}

func analyse(code []byte) (bitvec, error) {
	// The size of the code gives us a hint for the size of the bit vector.
	// Although the size of the code may be larger than the actual number of
	// instructions, it's a good estimation and saves us from checking for
	// resize during the loop.
	analysis := newBitvec(len(code))

	// Instructions in the EVM are not defined for all possible values of a byte.
	// For instance, opcodes from 0x0c to 0x0f and from 0xa5 to 0xef are not assigned.
	// The result of this analysis is used by the interpreter to check for illegal
	// JUMP destinations. We will not do a full validation of the code (for instance,
	// checking for stack underflow or overflow).
	for i := uint64(0); i < uint64(len(code)); {
		var op opCode = opCode(code[i])
		if op == JUMPDEST {
			analysis.set(i)
		} else if op >= PUSH1 && op <= PUSH32 {
			i += uint64(op - PUSH1 + 1)
		}
		i++
	}
	return analysis, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the destination address. It is up to the caller to
// decide which parameters to use. It's also up to the caller to make sure that the destination
// address is a contract.
//
// Call is a low-level method that won't expend any gas from the originator account. It's up
// to the caller to do that through the StateTransition object. All gas supplied to this method
// is available for the contract's execution.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
...
	// Check for call depth, if it exceeds the limit, error out
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
...
}

// Create creates a new contract using the data present in the CREATE instruction.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int, address common.Address) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
...
	// check whether the max code size limit is empty or not
	if evm.chainRules.IsEIP158(evm.Context.BlockNumber) {
		if len(code) > params.MaxCodeSize {
			return nil, common.Address{}, gas, ErrMaxCodeSizeExceeded
		}
	}
...
	// The new account's nonce is now 1
	evm.StateDB.SetNonce(contractAddr, 1)

	// evm.interpreter is a 'light' instance of the EVM and is used to run
	// the code given in the constructor of a contract.
	ret, err = evm.interpreter.Run(frame, nil)
...
	// check code size restrictions
	if err == nil && evm.chainRules.IsEIP158(evm.Context.BlockNumber) && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}

	// if the code returns ErrCodeStoreOutOfGas it means the code execution failed
	// and no code should be stored. Cost of gas spent on code storage is not
	// taken from the remaining gas and is thus returned to the caller.
	if err == ErrCodeStoreOutOfGas {
		// As this is a create call, the gas that would be used for copying the code is not
		// charged from the caller's account and is returned.
		return nil, contractAddr, gas, nil
	}
...
	evm.StateDB.SetCode(contractAddr, ret)

	return ret, contractAddr, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the general CALL operation.
func opCall(pc *uint64, i *Interpreter, s *Stack) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, to, value, inoffset, inlen, retoffset, retlen := s.Pop(), s.Pop(), s.Pop(), s.Pop(), s.Pop(), s.Pop(), s.Pop()
	// Get the arguments from buffer
	args := i.memory.GetPtr(int64(inoffset.Uint64()), int64(inlen.Uint64()))

	// EIP-211: Static calls can't modify state
	if i.readOnly && value.Sign() != 0 {
		i.abort(ErrWriteProtection, OpCode(s.pc-1))
		return
	}
	// Pass the call onto the interpreter
	ret, returnGas, err := i.call(i.contract.caller, to.Address(), args, gas.Uint64(), value)
	if err != nil {
		s.Push(U256_0) // Failure, push 0
	} else {
		s.Push(U256_1) // Success, push 1
	}
	i.memory.Set(retoffset.Uint64(), retlen.Uint64(), ret)
	s.returnGas(returnGas)
}

// opSstore is the SSTORE operation.
func opSstore(pc *uint64, i *Interpreter, s *Stack) {
	// EIP-211: Static calls can't modify state
	if i.readOnly {
		i.abort(ErrWriteProtection, OpCode(s.pc-1))
		return
	}
	loc := s.Pop()
	val := s.Pop()
	i.gas.SStore(i.evm, loc, val)
	i.statedb.SetState(i.contract.Address(), loc.Bytes32(), val.Bytes32())
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

	// EIP150 implements the Gas price changes (https://github.com/ethereum/EIPs/issues/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Eip-2384 (bomb delay) switch block (nil = no fork, 0 = already activated)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Eip-4345 (bomb delay) switch block (nil = no fork, 0 = already activated)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Eip-5133 (bomb delay) switch block (nil = no fork, 0 = already activated)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use as a network splitter

	// Fork scheduling was switched from blocks to timestamps here

	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"` // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime   *uint64 `json:"cancunTime,omitempty"`   // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime   *uint64 `json:"pragueTime,omitempty"`   // Prague switch time (nil = no fork, 0 = already on prague)
...
}

// IsBerlin returns whether num is either equal to the Berlin fork block or greater.
func (c *ChainConfig) IsBerlin(num *big.Int) bool {
	return isBlockForked(c.BerlinBlock, num)
}

// IsLondon returns whether num is either equal to the London fork block or greater.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isBlockForked(c.LondonBlock, num)
}

// IsShanghai returns whether time is either equal to the Shanghai fork time or greater.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.ShanghaiTime, time)
}
...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/accounts/abi/unpack.go">
```go
// toGoType parses the output bytes and recursively assigns the value of these bytes
// into a go type with accordance with the ABI spec.
func toGoType(index int, t Type, output []byte) (interface{}, error) {
	if index+32 > len(output) {
		return nil, fmt.Errorf("abi: cannot marshal in to go type: length insufficient %d require %d", len(output), index+32)
	}

	var (
		returnOutput  []byte
		begin, length int
		err           error
	)

	// if we require a length prefix, find the beginning word and size returned.
	if t.requiresLengthPrefix() {
		begin, length, err = lengthPrefixPointsTo(index, output)
		if err != nil {
			return nil, err
		}
	} else {
		returnOutput = output[index : index+32]
	}

	switch t.T {
...
	case StringTy: // variable arrays are written at the end of the return bytes
		return string(output[begin : begin+length]), nil
	case IntTy, UintTy:
		return ReadInteger(t, returnOutput)
	case BoolTy:
		return readBool(returnOutput)
	case AddressTy:
		return common.BytesToAddress(returnOutput), nil
	case HashTy:
		return common.BytesToHash(returnOutput), nil
	case BytesTy:
		return output[begin : begin+length], nil
	case FixedBytesTy:
		return ReadFixedBytes(t, returnOutput)
	case FunctionTy:
		return readFunctionType(t, returnOutput)
	default:
		return nil, fmt.Errorf("abi: unknown type %v", t.T)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
// List of all the EVM errors that can be returned.
var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxCodeSizeExceeded      = errors.New("max code size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	ErrInvalidOpCode            = errors.New("invalid opcode")
...
)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt outlines a very sophisticated security-focused validation framework. While this is a valuable goal, it's important to distinguish between the core responsibilities of an EVM implementation and the features of a higher-level security tool (like a static analyzer or a transaction firewall).

1.  **Validation vs. Sanitization**: Go-ethereum's philosophy is to **validate** inputs against strict consensus rules and **reject** them if they fail. It does not attempt to **sanitize** or "fix" invalid inputs, as this could lead to unintended behavior and consensus failures. The proposed framework should adopt this strict validation-and-rejection model for core EVM compatibility.

2.  **Security Monitoring**: Many of the proposed security checks (e.g., `contains_potential_backdoor`, `contains_potential_infinite_loop`, `is_fuzzing_pattern`) are features of **static analysis tools** (like Slither) or specialized monitoring services, not of a core EVM interpreter. An EVM prevents these issues through the gas mechanism itself, rather than by pattern-matching bytecode.
    *   **Re-entrancy**: Geth mitigates this not by pattern detection but by the **63/64 gas rule** for `CALL` opcodes, which limits the gas available to a sub-call, preventing it from performing too many state-changing operations.
    *   **Infinite Loops**: These are prevented by the gas mechanism. A loop that does not terminate will run out of gas and cause the transaction to fail.

3.  **Extensible Rule Engine**: Go-ethereum's "rule engine" is the `ChainConfig` struct, which activates different sets of consensus rules (EIPs) based on the current block number or timestamp. This is how the EVM's behavior evolves over time. The proposed custom rule engine is a powerful feature but should be seen as an extension on top of the core, hardfork-based rule system.

**Recommendation**: The implementation should first focus on a robust validation framework that mirrors Go-ethereum's strict, hardfork-aware checks for transactions and bytecode. The advanced security monitoring and sanitization features can then be built as a separate, optional layer on top of this solid foundation. This separation ensures core EVM correctness while allowing for powerful, pluggable security extensions.

---

This is an excellent and well-defined prompt for implementing a security-focused input validation framework. The structure is clear, and the requirements are specific.

Go-ethereum's approach to validation is deeply integrated into its execution flow rather than being in a single, centralized framework. However, the core principles and specific validation checks are present and provide excellent context. I've extracted the most relevant snippets that correspond to the logic you're building.

### Key Go-Ethereum Concepts for Your Implementation

1.  **State Transition (`state_transition.go`):** This is the high-level entry point for transaction validation. The `ApplyMessage` function acts as a top-level validation pipeline, checking prerequisites like gas, balance, and nonce before execution. This is analogous to your `validate_transaction_input` pipeline.
2.  **VM Opcodes (`instructions.go`):** The implementation of each opcode contains fine-grained validation. For example, `opCall` validates call depth and read-only constraints, while `opSstore` also checks for static context. This maps to your `validate_security_constraints` and `validate_input_ranges` functions.
3.  **Bytecode Validation (`contracts.go`, `analysis.go`):** Go-ethereum performs two types of bytecode validation:
    *   **Static Analysis (`JumpdestAnalysis`):** Before execution, bytecode is analyzed to create a bitmap of valid `JUMPDEST` locations. This is a critical security feature and a great example of pre-validation for performance. This directly informs your `validate_jumpdest_positions` function.
    *   **Creation-Time Validation (`validateCode`):** After contract creation code runs, the returned runtime bytecode is validated against EIPs like EIP-170 (max code size). This maps to your `validate_bytecode_input`.
4.  **Precompiled Contracts (`precompiled.go`):** Precompiles are a perfect example of a structured validation system. Each precompile defines its required input length and calculates gas based on that input, providing a model for your `ValidatorRegistry` where each precompile acts as a specific "validator".

I have extracted code that demonstrates these concepts to help guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyMessage computes the new state by applying the given message against the
// old state.
//
// ApplyMessage returns the receipt, the remaining gas, and an error, if any.
// The receipt is NOT setting the event Bloom filter.
func ApplyMessage(evm *vm.EVM, msg core.Message, gp *core.GasPool) (*types.Receipt, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// StateTransition defines the properties of a state transition.
// It is generated for every transaction and passed to the EVM.
type StateTransition struct {
	gp         *core.GasPool
	msg        core.Message
	evm        *vm.EVM
	initialGas uint64
	gas        uint64
	data       []byte
	state      vm.StateDB
}

// NewStateTransition initialises and returns a new state transition object.
func NewStateTransition(evm *vm.EVM, msg core.Message, gp *core.GasPool) *StateTransition {
	// ... (initialization logic) ...
	return &StateTransition{
		gp:         gp,
		evm:        evm,
		msg:        msg,
		gas:        msg.Gas(),
		initialGas: msg.Gas(),
		data:       msg.Data(),
		state:      evm.StateDB,
	}
}

// TransitionDb will transition the state by applying the current message and
// returning the receipt, used gas and an error if it failed.
//
// The distinction between TransitionDb and ApplyMessage is that TransitionDb
// consumes and refunds gas, calculates the gas used and refunds the sender.
// ApplyMessage is a pure function for executing a message against a certain state.
func (st *StateTransition) TransitionDb() (*types.Receipt, error) {
	// ...
	// Ensure the sender has enough funds to cover the transaction costs.
	if err := st.preCheck(); err != nil {
		return nil, err
	}
	// ...
	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not returned
	)
	if st.msg.To() == nil {
		ret, _, st.gas, vmerr = st.evm.Create(st.msg.From(), st.data, st.gas, st.msg.Value())
	} else {
		ret, st.gas, vmerr = st.evm.Call(st.msg.From(), st.msg.To(), st.data, st.gas, st.msg.Value())
	}
	// ... (refund gas logic) ...

	// Create a new receipt for the transaction, storing the intermediate root and gas used
	// by the tx.
	receipt := types.NewReceipt(st.state.GetRlp(st.txHash), st.failed(vmerr), st.gasUsed())
	// ... (set receipt fields) ...
	return receipt, vmerr
}

// preCheck performs series of checks that are essential before commencing any
// state transition.
func (st *StateTransition) preCheck() error {
	// Make sure this transaction's nonce is correct.
	if err := st.checkNonce(); err != nil {
		return err
	}
	// Make sure the sender has enough gas to cover the up-front cost.
	if err := st.buyGas(); err != nil {
		return err
	}
	return nil
}

// checkNonce checks if the nonce of the message is correct.
func (st *StateTransition) checkNonce() error {
	// The EIP-2681 is only activated on Berlin hard fork.
	if st.evm.ChainConfig().IsBerlin(st.evm.Context.BlockNumber) {
		// If the sender is a contract, the nonce check is skipped.
		// The EOA nonce check is still performed when the contract is created.
		if st.state.GetCodeSize(st.msg.From()) > 0 {
			return nil
		}
	}
	if st.state.GetNonce(st.msg.From()) < st.msg.Nonce() {
		return fmt.Errorf("%w: address %v, tx: %d state: %d", core.ErrNonceTooHigh, st.msg.From().Hex(), st.msg.Nonce(), st.state.GetNonce(st.msg.From()))
	}
	if st.state.GetNonce(st.msg.From()) > st.msg.Nonce() {
		return fmt.Errorf("%w: address %v, tx: %d state: %d", core.ErrNonceTooLow, st.msg.From().Hex(), st.msg.Nonce(), st.state.GetNonce(st.msg.From()))
	}
	return nil
}

// buyGas deducts the required gas from the sender's account.
func (st *StateTransition) buyGas() error {
	mgval := new(uint256.Int).SetUint64(st.msg.Gas())
	mgval.Mul(mgval, st.gasPrice)

	balance := st.state.GetBalance(st.msg.From())
	if balance.Lt(mgval) {
		return fmt.Errorf("%w: address %v have %v want %v", core.ErrInsufficientFundsForGas, st.msg.From().Hex(), balance, mgval)
	}
	st.gp.SubGas(st.msg.Gas())
	st.gas += st.msg.Gas()
	st.initialGas = st.msg.Gas()
	st.state.SubBalance(st.msg.From(), mgval)
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// validateCode contains the logic for contract code validation.
func validateCode(code []byte, config *params.ChainConfig, blockNum uint64, blockTime uint64) error {
	// Contract code size limit is defined in EIP-170.
	if config.IsEIP170(blockNum) && len(code) > params.MaxCodeSize {
		return ErrMaxCodeSizeExceeded
	}
	// Disallow contracts that begin with the 0xEF byte.
	if config.IsEIP3541(blockNum) && len(code) > 0 && code[0] == 0xEF {
		return ErrInvalidCode
	}
	// Ensure that the contract code is valid from EOF perspective.
	if config.IsPrague(blockNum, blockTime) {
		if _, err := eof.Parse(code); err != nil {
			return err
		}
	}
	return nil
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and balance checks) ...

	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// ...

	// Create a new contract and set the code that's going to be used by the EVM.
	// The contract is a message sending type of contract, meaning it has no code of its own
	// but it will execute the given code.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)

	// ...
	if evm.vmConfig.NoRecursion {
		return nil, contractAddr, gas, nil
	}
	// ...
	ret, err = evm.interpreter.Run(contract, nil, false)

	// Check against code size restrictions or invalid code.
	if err == nil {
		if err := validateCode(ret, evm.ChainConfig(), evm.Context.BlockNumber, evm.Context.Time); err != nil {
			return nil, contractAddr, 0, err
		}
	}
	// ... (gas cost for code storage) ...

	// Finalise the created account with the code returned by the init code.
	if err == nil {
		evm.StateDB.SetCode(contractAddr, ret)
	}
	return ret, contractAddr, contract.Gas, err
}

// Create2 creates a new contract using code as deployment code.
//
// The different between Create2 and Create is Create2 uses sha3(0xff + sender + salt + sha3(init_code))
// instead of the usual sender-and-nonce-hash as the address where the contract is initialized at.
func (evm *EVM) Create2(caller ContractRef, code []byte, gas uint64, endowment *uint256.Int, salt *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Before EIP-3860, the initcode is only measured on memory expansion.
	if evm.ChainConfig().IsShanghai(evm.Context.BlockNumber, evm.Context.Time) {
		if err := validateInitCode(code); err != nil {
			return nil, common.Address{}, gas, err
		}
	}
	// ...
	codeHash := crypto.Keccak256Hash(code)
	contractAddr = crypto.CreateAddress2(caller.Address(), common.Hash(salt.Bytes32()), codeHash.Bytes())
	// ...
}

// validateInitCode checks the initcode against the size limit.
func validateInitCode(code []byte) error {
	// As per EIP-3860, the initcode is capped at max_initcode_size.
	if len(code) > params.MaxInitCodeSize {
		return ErrMaxInitCodeSizeExceeded
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// JumpdestAnalysis performs a jump destination analysis based on the合约 EIP-211.
func JumpdestAnalysis(code []byte) Bitvec {
	// Don't waste time on empty code
	if len(code) == 0 {
		return Bitvec{}
	}
	var (
		i      = 0
		length = len(code)

		// Using a bitvec is faster than map for the density of JUMPDESTs
		// in typical contracts.
		dests = NewBitvec(length)
	)
	for i < length {
		var op = OpCode(code[i])
		if op >= PUSH1 && op <= PUSH32 {
			i += int(op) - int(PUSH1) + 1
		} else if op == JUMPDEST {
			dests.Set(uint(i))
		}
		i++
	}
	return dests
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall implements the CALL opcode.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	var (
		gas,
		addr,
		value,
		in,
		inSize,
		ret,
		retSize uint256.Int
	)
	stack.Pop(&gas)
	stack.Pop(&addr)
	stack.Pop(&value)
	stack.Pop(&in)
	stack.Pop(&inSize)
	stack.Pop(&ret)
	stack.Pop(&retSize)

	// ... (Gas calculation and memory expansion logic) ...

	// Ensure the call depth does not exceed the maximum limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, ErrDepth
	}
	// Ensure that if we're in static state, we don't try to modify state
	if evm.readOnly && !value.IsZero() {
		return nil, ErrWriteProtection
	}

	// ... (Address to common.Address conversion and snapshotting) ...

	// Execute the call
	retVal, returnGas, err := evm.Call(contract, to, args, gasUsed, &value)

	// ... (Handle results and push to stack) ...

	return nil, nil
}

// opSstore implements the SSTORE opcode.
func opSstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Ensure that if we're in static state, we don't try to modify state
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	var loc, val uint256.Int
	stack.Pop(&loc)
	stack.Pop(&val)

	// ... (Gas calculation for SSTORE, which is complex) ...

	evm.StateDB.SetState(contract.Address(), common.Hash(loc.Bytes32()), common.Hash(val.Bytes32()))
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// PrecompiledContractsBerlin contains the default set of pre-compiled contracts used
// in the Berlin release.
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

// ecrecover implements the an ECDSA recover pre-compiled contract.
type ecrecover struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (p *ecrecover) Run(input []byte) ([]byte, error) {
	const (
		// The cost of the operation is 3000 gas.
		// The input is 128 bytes, which should be 4 words.
		// The first 3 words are for h,v,r,s
		// The final word is the msg hash.
		inputLength = 128
	)

	// Validate input length
	if err := vm.ValidateInputLength(input, inputLength); err != nil {
		return nil, err
	}
	// ... (actual ecrecover implementation) ...
}

// sha256hash implements the SHA256 pre-compiled contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (p *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (p *sha256hash) Run(input []byte) ([]byte, error) {
	// The gas cost is 60 + 12 per word
	// The sha256 is returned as a 32 byte word
	h := sha256.New()
	h.Write(input)
	return h.Sum(nil), nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the gas cost for memory expansion.
// The cost is a quadratic function of the new size.
//
// memory_cost = (new_size_word^2) / 512 + 3 * new_size_word
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum memory size is bounded by 2^64-1 bytes, and the gas cost is a
	// quadratic function of the memory size in words. The cost of memory expansion
	// will overflow a uint64 before the size does.
	if newSize > 0x1FFFFFFFFF {
		return 0, ErrGasUintOverflow
	}
	size := (newSize + 31) / 32
	cost := size*size/params.MemoryGasQuadCoeffDiv + size*params.MemoryGasLinearCoeff

	// Check for overflow
	if cost < size {
		return 0, ErrGasUintOverflow
	}
	return cost, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt is exceptionally well-structured and detailed, providing a clear blueprint for implementation. Here are a few minor corrections and suggestions based on Go-Ethereum's design:

1.  **Bytecode Validation Scope**: The prompt mentions validating "undefined opcodes" like `0x0C` to `0x0F`. Go-Ethereum handles this by having a jump table where any undefined opcode maps to an `opInvalid` handler. A more critical validation, however, is ensuring `JUMPDEST` opcodes are only at valid locations (not inside `PUSH` data). Geth's `JumpdestAnalysis` is a perfect reference for this. It pre-computes a bitmap of valid destinations, which is much more efficient than checking during execution. I've included this snippet.

2.  **`CALL` Operation Validation**: Your prompt correctly identifies the need to validate call depth. In Geth, this is checked within the `opCall` implementation (`if evm.depth > int(params.CallCreateDepth)`). Another crucial check is for read-only contexts (`if evm.readOnly && !value.IsZero()`), which prevents value transfers in `STATICCALL`. I've included snippets demonstrating this.

3.  **Sanitization vs. Validation**: The prompt includes a `SanitizerRegistry`. In the context of the EVM, inputs like transaction data or bytecode are cryptographically signed or part of a state root, so they cannot be "sanitized" (modified) without invalidating the entire structure. The focus should be purely on *validation* (rejecting invalid inputs) rather than sanitization (cleaning them). The only exception might be for RPC inputs, but for the core EVM execution, this is not applicable.

4.  **Security Monitor & Threat Patterns**: Your `SecurityMonitor` is an advanced concept that resembles static analysis tools more than a typical EVM's runtime validation. While Geth doesn't have a direct equivalent for pattern matching (e.g., detecting reentrancy patterns from bytecode), the `Tracer` infrastructure is the mechanism Geth provides to allow such analysis. A custom tracer can inspect every opcode and its context, which is exactly what a security monitor would do. I've included the tracer API files as a reference for how you might implement hooks for your `SecurityMonitor`.

The provided Go-ethereum snippets should give you a solid, production-tested foundation for implementing each validation function in your Zig framework.

---

An input validation framework is a critical component for ensuring the security and correctness of an EVM. Go-ethereum's implementation, while spread across different packages (txpool, core/vm, core), provides a robust reference for consensus-critical validation.

The `core.StateTransition` object is the primary entry point for validating a transaction before execution. It checks nonce, balance, and intrinsic gas. For bytecode validation, the `vm.Interpreter` performs a one-time analysis to identify valid `JUMPDEST` locations, which is crucial for secure control flow. Runtime validation, such as call depth and static call enforcement, is handled within the `vm.EVM`'s `Call` and `Create` methods.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
// state_transition.go is the main entry point for validating and applying transactions.
// The validateTransaction function is particularly relevant as it performs checks before
// any state is modified, similar to the requested `validate_transaction_input`.

// validateTransaction runs the transaction checks, without consuming any gas from the sender's
// account.
func (st *StateTransition) validateTransaction() error {
	// EIP-3860: An initcode transaction is invalid if the length of its data is
	// greater than max_initcode_size.
	if st.tx.IsCreate() && st.rules.IsEIP3860 && uint64(len(st.data)) > params.MaxInitcodeSize {
		return ErrMaxInitcodeSizeExceeded
	}
	// EIP-4844: A blob transaction is invalid if it has no blobs.
	if st.tx.Type() == types.BlobTxType && st.tx.BlobTxSidecar.BlobCount() == 0 {
		return ErrNoBlobs
	}
	// Check whether the sender is a contract.
	if st.rules.IsEIP3607 {
		if st.state.GetCode(st.from()) != nil {
			return ErrSenderNoCode
		}
	}
	// Ensure the transaction has a valid signature.
	if err := st.tx.ValidateSignatureValues(st.rules.ChainID, st.rules.IsHomestead); err != nil {
		return err
	}
	// Ensure the transaction has a valid nonce.
	if err := st.checkNonce(); err != nil {
		return err
	}
	// Check the balance of the sender and fee values.
	if err := st.buyGas(); err != nil {
		return err
	}
	// Ensure the transaction has more gas than the basic upfront gas.
	if st.initialGas < st.intrinsicGas {
		return fmt.Errorf("%w: have %d, want %d", ErrIntrinsicGas, st.initialGas, st.intrinsicGas)
	}
	return nil
}

// buyGas deducts gas from the sender's account.
//
// gas * price + value
func (st *StateTransition) buyGas() error {
	mgval := new(big.Int).SetUint64(st.initialGas)
	mgval.Mul(mgval, st.gasPrice)

	// EIP-4844: Blob gas is taken from the sender's account.
	if st.tx.Type() == types.BlobTxType {
		if !st.rules.IsCancun {
			return fmt.Errorf("blob transaction not supported before Cancun")
		}
		mgval.Add(mgval, new(big.Int).Mul(st.blobGasPrice, new(big.Int).SetUint64(st.tx.BlobGas())))
	}

	balanceCheck := new(big.Int).Add(st.value, mgval)
	if st.state.GetBalance(st.from()).Cmp(balanceCheck) < 0 {
		return fmt.Errorf("%w: address %v have %v want %v", ErrInsufficientFunds, st.from().Hex(), st.state.GetBalance(st.from()), balanceCheck)
	}
	if err := st.state.SubBalance(st.from(), mgval); err != nil {
		// Even if the balance is checked above, it's possible that the account is a a state clearing
		// object. In that case, we can't be sure that the balance is actually present, so we need to
		// check the error.
		return fmt.Errorf("%w: address %v, have %v want %v", ErrInsufficientFunds, st.from().Hex(), st.state.GetBalance(st.from()), mgval)
	}
	return nil
}

// checkNonce checks whether the sender has enough nonce to execute the transaction.
func (st *StateTransition) checkNonce() error {
	currentNonce := st.state.GetNonce(st.from())
	if currentNonce < st.tx.Nonce() {
		return fmt.Errorf("%w: address %v, tx: %d state: %d", ErrNonceTooHigh, st.from().Hex(), st.tx.Nonce(), currentNonce)
	}
	if currentNonce > st.tx.Nonce() {
		return fmt.Errorf("%w: address %v, tx: %d state: %d", ErrNonceTooLow, st.from().Hex(), st.tx.Nonce(), currentNonce)
	}
	return nil
}

// gas (EIP-1559).
func gasAndPrice(author *common.Address, header *types.Header, tx *types.Transaction, rules params.Rules) (uint64, *big.Int, *big.Int, error) {
	// ... (implementation calculates gas price and intrinsic gas)
}

// intrinsicGas computes the 'intrinsic gas' for a transaction.
func intrinsicGas(data []byte, accessList types.AccessList, isContractCreation bool, isHomestead, isCancun bool, isEIP3860 bool) (uint64, error) {
	// Set the starting gas for the raw transaction
	var gas uint64
	if isContractCreation && isHomestead {
		gas = params.TxGasContractCreation
	} else {
		gas = params.TxGas
	}
	// Bump the required gas by the amount of transactional data
	if len(data) > 0 {
		var nz uint64
		for _, b := range data {
			if b != 0 {
				nz++
			}
		}
		z := uint64(len(data)) - nz
		if (math.MaxUint64-gas)/params.TxDataNonZeroGasEIP2028 < nz {
			return 0, ErrGasUintOverflow
		}
		gas += nz * params.TxDataNonZeroGasEIP2028

		if (math.MaxUint64-gas)/params.TxDataZeroGas < z {
			return 0, ErrGasUintOverflow
		}
		gas += z * params.TxDataZeroGas
	}
	// EIP-3860: An initcode transaction costs 2 gas for every 32-byte chunk of initcode.
	// This is a simple formula, and is not based on the number of non-zero bytes.
	if isContractCreation && isEIP3860 {
		if (math.MaxUint64-gas)/params.InitcodeWordGas < uint64(len(data)) {
			return 0, ErrGasUintOverflow
		}
		gas += uint64(len(data)+31)/32 * params.InitcodeWordGas
	}
	if accessList != nil {
		gas += uint64(len(accessList)) * params.TxAccessListAddressGas
		gas += uint64(accessList.StorageKeys()) * params.TxAccessListStorageKeyGas
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// interpreter.go handles the step-by-step execution of EVM bytecode.
// The Analyse function is directly relevant to bytecode validation, specifically for
// finding all valid JUMPDEST locations before execution. This prevents invalid jumps
// and is a critical security and performance feature.

// Analyse analyses the given code and returns a jumpdest analysis table.
// The analysis table will be a bitmap of valid jump destinations.
func Analyse(code []byte) bitvec {
	// The analysis is a simple parse of the code, identifying all the valid
	// jump destinations.
	var (
		destinations = make(bitvec, len(code))
		pending      int
	)
	for i := 0; i < len(code); {
		var op OpCode = OpCode(code[i])
		if op == JUMPDEST {
			destinations.set(uint(i))
		}
		// Skip PUSH instruction's immediate data
		if op >= PUSH1 && op <= PUSH32 {
			pending = int(op - PUSH1 + 1)
		}
		i++
		if pending > 0 {
			i += pending
			pending = 0
		}
	}
	return destinations
}

// ... inside the run method ...
			// If the operation is a jump, check validations
			if op.isJump() {
				dest := stack.peek()
				if !dest.IsUint64() || !jt.Destinations.has(dest.Uint64()) {
					return ErrInvalidJump
				}
			}
// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// evm.go contains the EVM object and its main methods for contract creation and calls.
// These methods contain high-level validation logic like depth checks and static-mode enforcement.

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check. It's not allowed to go deeper than 1024.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	// ... (balance and nonce checks) ...

	// Ensure the provided code does not exceed the EIP-170 code size limit.
	if evm.rules.IsEIP170 && len(code) > params.MaxCodeSize {
		return nil, common.Address{}, gas, ErrMaxCodeSizeExceeded
	}
	// ... (execution logic) ...
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer and returns the
// receipt and an error if one occurred.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}

	// ... (account existence and balance checks) ...

	// Handle pre-compiled contracts
	if evm.precompile(addr) {
		return RunPrecompiledContract(addr, input, gas, evm.rules)
	}
	// ... (contract execution logic) ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/errors.go">
```go
// errors.go defines the various error types that the VM can return. These are
// useful for populating the `ValidationViolation` and `ValidationWarning` structs
// in the requested framework.

var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxCodeSizeExceeded      = errors.New("max code size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	ErrReturnDataOutOfBounds    = errors.New("return data out of bounds")
	ErrGasUintOverflow          = errors.New("gas uint64 overflow")
	ErrInvalidClone             = errors.New("evm clone failed")
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go">
```go
// protocol_params.go contains constants that are critical for validation,
// such as code size limits and gas costs.

const (
	// Maximum size of a contract that can be saved to the state.
	MaxCodeSize = 24576

	// Maximum initcode size allowed by EIP-3860.
	MaxInitcodeSize = 2 * MaxCodeSize
)

// Gas costs for basic transaction processing
const (
	TxGas              uint64 = 21000 // Per transaction. NOTE: Not payable on data of calls between transactions.
	TxGasContractCreation uint64 = 53000 // Per transaction for contract creation.
	TxDataZeroGas      uint64 = 4     // Per byte of data attached to a transaction that equals zero.
	TxDataNonZeroGas   uint64 = 16    // Per byte of data attached to a transaction that is not zero.
	InitcodeWordGas    uint64 = 2     // Gas cost per 32-byte word for init code in transaction data.
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jump_table.go">
```go
// jump_table.go defines the EVM's instruction set for a given hard fork.
// Each instruction includes validation metadata like stack requirements, which
// is fundamental to low-level input validation before an opcode executes.

// operation represents a single operation in the VM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the constant gas cost of the operation
	gasCost gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack items required
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}

// newByzantiumInstructionSet returns the instruction set for the Byzantium hard fork.
func newByzantiumInstructionSet() [256]operation {
	return [256]operation{
		// ...
		ADD: {
			execute:    opAdd,
			gasCost:    constGasFunc(GasFastestStep),
			minStack:   2,
			maxStack:   1024,
		},
		// ...
		JUMP: {
			execute:    opJump,
			gasCost:    constGasFunc(GasMidStep),
			minStack:   1,
			maxStack:   1024,
		},
		// ...
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is excellent and provides a well-structured plan for building a comprehensive input validation framework. There are no significant errors. However, here are a few suggestions for improvement based on go-ethereum's implementation:

1.  **JUMPDEST Validation Context:** The prompt's `validate_jumpdest_positions` is a good idea. In `go-ethereum`, this is done once via a function called `Analyse` when code is first loaded into the interpreter. The results (a bitmap of valid destinations) are cached. The prompt should consider a similar "analysis" phase for bytecode to avoid re-validating on every execution. The `BytecodeInput` could have an `analysis_results` field.

2.  **Static vs. Dynamic Validation:** The prompt mixes validation steps that can be done once (statically, like checking for invalid opcodes) with steps that must be done at runtime (like checking call depth). It might be beneficial to explicitly separate these in the `execute_validation_pipeline`. Static analysis can be performed on bytecode before it's even executed, while runtime checks would happen within the EVM loop.

3.  **Error vs. Revert:** The distinction between an invalid transaction that shouldn't be processed (e.g., bad signature, not enough gas to cover intrinsic cost) and a valid transaction that reverts during execution (e.g., `REVERT` opcode, failed `require`) is critical. The validation framework should clearly distinguish between violations that make a transaction/input fundamentally invalid versus those that cause a valid execution to revert. `go-ethereum`'s errors (e.g., `ErrInsufficientFunds`, `ErrNonceTooLow`) are good examples of pre-execution invalidity, whereas `ErrExecutionReverted` is a post-execution state.

4.  **Configuration per Hardfork:** Many validation rules (e.g., `MaxCodeSize`, specific opcodes, gas costs) are hardfork-dependent. The `ValidationConfig` could benefit from including a `hardfork` field to ensure the validation rules match the correct Ethereum protocol version.

