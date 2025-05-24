const std = @import("std");

const EvmModule = @import("evm");
const Evm = EvmModule.Evm;
const Hardfork = EvmModule.Hardfork;
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const Interpreter = EvmModule.Interpreter;
const JumpTable = EvmModule.JumpTable;
const opcodes = EvmModule.opcodes;
const EvmLogger = EvmModule.EvmLogger;
const createLogger = EvmModule.createLogger;
const logHexBytes = EvmModule.logHexBytes;
const debugOnly = EvmModule.debugOnly;
const ENABLE_DEBUG_LOGS = EvmModule.ENABLE_DEBUG_LOGS;

const AddressModule = @import("address");
const Address = AddressModule.Address;

const UtilsModule = @import("utils");
const hex = UtilsModule.hex;

// Use the built-in u256 type
const u256_t = u256;
fn u256_t_from_be_bytes(bytes: []const u8) u256_t {
    if (bytes.len == 0) return 0;
    // Ensure bytes slice is 32 bytes for std.mem.bytesToValue
    var full_bytes: [32]u8 = std.mem.zeroes([32]u8);
    const offset = 32 - @min(32, bytes.len);
    @memcpy(full_bytes[offset..], bytes[0..@min(32, bytes.len)]);
    return std.mem.bytesToValue(u256_t, &full_bytes);
}

// Create a file-specific logger
// EvmLogger.init needs to be checked. Assuming it takes a []const u8 name.
const logger = createLogger("EvmTestHelpers"); // Using createLogger from EvmModule

// Result of an EVM execution
pub const EvmResult = struct {
    /// Error status (if any)
    status: ?EvmModule.InterpreterError = null,

    /// Remaining gas after execution
    gas_left: u64,

    /// Total gas used during execution
    gas_used: u64,

    /// Output data from the execution (if any)
    output: ?[]const u8 = null,

    /// Allocator that owns the output data memory
    allocator: std.mem.Allocator,

    /// Cleanup resources
    pub fn deinit(self: *EvmResult) void {
        if (self.output) |data| {
            self.allocator.free(data);
            self.output = null;
        }
    }

    /// Convert output to u256_t if possible
    pub fn asU256(self: *const EvmResult) ?u256_t {
        if (self.output) |data| {
            if (data.len == 32) {
                return u256_t_from_be_bytes(data);
            } else if (data.len < 32) {
                // Pad with zeros if less than 32 bytes
                var padded: [32]u8 = [_]u8{0} ** 32;
                @memcpy(padded[32 - data.len ..], data);
                return u256_t_from_be_bytes(&padded);
            }
        }
        return null;
    }

    /// Format the output as a hex string
    pub fn outputAsHex(self: *const EvmResult, allocator: std.mem.Allocator) !?[]const u8 {
        if (self.output) |data| {
            var buffer = try allocator.alloc(u8, data.len * 2 + 2);
            buffer[0] = '0';
            buffer[1] = 'x';

            for (data, 0..) |b, i| {
                const high = @as(u4, @truncate(b >> 4));
                const low = @as(u4, @truncate(b & 0x0F));
                buffer[2 + i * 2] = std.fmt.digitToChar(high, .lower);
                buffer[2 + i * 2 + 1] = std.fmt.digitToChar(low, .lower);
            }

            return buffer;
        }
        return null;
    }

    /// Format the result as a string
    pub fn format(self: *const EvmResult, allocator: std.mem.Allocator) ![]const u8 {
        var buffer = std.ArrayList(u8).init(allocator);
        errdefer buffer.deinit();

        try buffer.appendSlice("EvmResult {\n");

        if (self.status) |status| {
            try buffer.writer().print("  status: {s}\n", .{@errorName(status)});
        } else {
            try buffer.appendSlice("  status: success\n");
        }

        try buffer.writer().print("  gas_left: {d}\n", .{self.gas_left});
        try buffer.writer().print("  gas_used: {d}\n", .{self.gas_used});

        if (self.output) |output| {
            if (output.len == 0) {
                try buffer.appendSlice("  output: (empty)\n");
            } else if (output.len <= 64) {
                const hex_output = try self.outputAsHex(allocator);
                defer if (hex_output) |ho| allocator.free(ho);

                try buffer.writer().print("  output: {s} ({d} bytes)\n", .{
                    hex_output orelse "(encoding error)",
                    output.len,
                });

                // Try to interpret the output if it's 32 bytes (common for return values)
                if (output.len == 32) {
                    const value = u256_t_from_be_bytes(output);
                    try buffer.writer().print("  output as u256_t: {d}\n", .{value});
                }
            } else {
                // For large outputs, just show length and prefix
                const prefix_len = @min(output.len, 32);
                var hex_buf = try allocator.alloc(u8, prefix_len * 2 + 2);
                defer allocator.free(hex_buf);

                hex_buf[0] = '0';
                hex_buf[1] = 'x';

                for (output[0..prefix_len], 0..) |b, i| {
                    const high = @as(u4, @truncate(b >> 4));
                    const low = @as(u4, @truncate(b & 0x0F));
                    hex_buf[2 + i * 2] = std.fmt.digitToChar(high, .lower);
                    hex_buf[2 + i * 2 + 1] = std.fmt.digitToChar(low, .lower);
                }

                try buffer.writer().print("  output: {s}... ({d} bytes total)\n", .{
                    hex_buf,
                    output.len,
                });
            }
        } else {
            try buffer.appendSlice("  output: null\n");
        }

        try buffer.appendSlice("}");

        return buffer.toOwnedSlice();
    }
};

// Log level for test output
pub const TestLogLevel = enum {
    silent, // No output
    minimal, // Only basic test info
    verbose, // Detailed execution info
    trace, // Full execution trace
};

// Configuration for EVM tests
pub const EvmTestConfig = struct {
    /// Allocator for test resources
    allocator: std.mem.Allocator,

    /// EVM revision to use for tests (defaults to Byzantium)
    hardfork: Hardfork = .Byzantium,

    /// Maximum call depth
    max_call_depth: u16 = 1024,

    /// Maximum stack depth
    max_stack_depth: u16 = 1024,

    /// Verbosity level for test output
    log_level: TestLogLevel = .minimal,

    /// Whether to trace execution in verbose mode
    trace_execution: bool = false,

    /// Custom caller address (default: zero address)
    caller: ?Address = null,

    /// Custom contract address (default: zero address)
    contract_address: ?Address = null,

    /// Initial gas amount (default: max u64)
    initial_gas: u64 = std.math.maxInt(u64),

    /// Initial value to send with transaction (default: 0)
    value: u64 = 0,
};

// Test fixture for EVM execution tests
pub const EvmTest = struct {
    /// Memory allocator for all resources
    allocator: std.mem.Allocator,

    /// The EVM instance to use for execution
    evm: Evm,

    /// The jump table containing opcode implementations
    jump_table: JumpTable,

    /// EVM revision to use for tests
    hardfork: Hardfork,

    /// The result of the last execution
    result: ?EvmResult = null,

    /// Test configuration
    config: EvmTestConfig,

    /// The logger for this test
    test_logger: EvmLogger,

    /// Create a new EVM test fixture
    pub fn init(allocator: std.mem.Allocator) !EvmTest {
        var evm = try Evm.init(null);
        evm.setChainRules(Evm.ChainRules.forHardfork(.Byzantium));

        // Create a jump table
        const jump_table = try EvmModule.jumpTable.newJumpTable(allocator, "byzantium");

        return EvmTest{
            .allocator = allocator,
            .evm = evm,
            .jump_table = jump_table,
            .hardfork = .Byzantium,
            .config = .{
                .allocator = allocator,
            },
            .test_logger = EvmLogger.init("EvmTest"),
        };
    }

    /// Create a new EVM test fixture with custom configuration
    pub fn initWithConfig(config: EvmTestConfig) !EvmTest {
        var evm = try Evm.init(null);
        evm.setChainRules(Evm.ChainRules.forHardfork(config.hardfork));

        // Create a jump table
        const hardfork_name = @tagName(config.hardfork);
        const jump_table = try EvmModule.jumpTable.newJumpTable(config.allocator, hardfork_name);

        return EvmTest{
            .allocator = config.allocator,
            .evm = evm,
            .jump_table = jump_table,
            .hardfork = config.hardfork,
            .config = config,
            .test_logger = EvmLogger.init("EvmTest"),
        };
    }

    /// Free resources used by the test fixture
    pub fn deinit(self: *EvmTest) void {
        if (self.result) |*result| {
            result.deinit();
        }
    }

    /// Set the EVM revision for tests
    pub fn setHardfork(self: *EvmTest, hardfork: Hardfork) void {
        self.hardfork = hardfork;
        self.evm.setChainRules(Evm.ChainRules.forHardfork(hardfork));
    }

    /// Execute bytecode with the given gas limit and input data
    pub fn execute(self: *EvmTest, gas: u64, code: []const u8, input: []const u8) !void {
        // Clean up previous result if any
        if (self.result) |*result| {
            result.deinit();
            self.result = null;
        }

        // Log test execution
        if (ENABLE_DEBUG_LOGS) {
            if (self.config.log_level != .silent) {
                self.test_logger.debug("==== Executing EVM Test ====", .{});
                self.test_logger.debug("Hardfork: {s}", .{@tagName(self.hardfork)});
                self.test_logger.debug("Gas: {d}", .{gas});
                self.test_logger.debug("Code length: {d} bytes", .{code.len});

                if (self.config.log_level == .verbose or self.config.log_level == .trace) {
                    var hex_buf: [1024]u8 = undefined;
                    const code_display = if (code.len > 100)
                        try std.fmt.bufPrint(&hex_buf, "{s}... ({d} bytes total)", .{ hex.bytesToHex(code[0..32], hex_buf[0..64]) catch "??", code.len })
                    else
                        hex.bytesToHex(code, &hex_buf) catch "??";

                    self.test_logger.debug("Code: 0x{s}", .{code_display});

                    if (input.len > 0) {
                        const input_display = if (input.len > 100)
                            try std.fmt.bufPrint(&hex_buf, "{s}... ({d} bytes total)", .{ hex.bytesToHex(input[0..32], hex_buf[0..64]) catch "??", input.len })
                        else
                            hex.bytesToHex(input, &hex_buf) catch "??";

                        self.test_logger.debug("Input: 0x{s}", .{input_display});
                    } else {
                        self.test_logger.debug("Input: (empty)", .{});
                    }
                }
            }
        }

        // Create a contract
        const caller = self.config.caller orelse std.mem.zeroes(Address);
        const contract_addr = self.config.contract_address orelse std.mem.zeroes(Address);
        var contract = ContractModule.createContract(caller, contract_addr, self.config.value, gas);

        // Set the contract code
        const code_hash = [_]u8{0} ** 32; // Dummy hash, not used in tests
        contract.setCallCode(code_hash, code);

        // Create an interpreter
        var interpreter_instance = Interpreter.create(self.allocator, &self.evm, self.jump_table);
        defer interpreter_instance.deinit();

        // Set up tracing if requested
        if (ENABLE_DEBUG_LOGS and self.config.trace_execution) {
            // Install step tracing
            interpreter_instance.enableTracing();

            // Log start of execution
            self.test_logger.debug("==== Starting Execution Trace ====", .{});
        }

        // Execute the code
        const execution_result = interpreter_instance.run(&contract, input, false) catch |err| {
            if (ENABLE_DEBUG_LOGS and self.config.log_level != .silent) {
                self.test_logger.debug("==== Execution Failed ====", .{});
                self.test_logger.debug("Error: {s}", .{@errorName(err)});
                self.test_logger.debug("Gas used: {d}", .{gas - contract.gas});
                self.test_logger.debug("Gas left: {d}", .{contract.gas});
            }

            // Create result with error
            self.result = EvmResult{
                .status = err,
                .gas_left = contract.gas,
                .gas_used = gas - contract.gas,
                .output = null,
                .allocator = self.allocator,
            };
            return;
        };

        // Copy output data if any
        var output_copy: ?[]u8 = null;
        if (execution_result) |output| {
            output_copy = try self.allocator.dupe(u8, output);

            if (ENABLE_DEBUG_LOGS and self.config.log_level != .silent) {
                self.test_logger.debug("==== Execution Succeeded ====", .{});
                self.test_logger.debug("Gas used: {d}", .{gas - contract.gas});
                self.test_logger.debug("Gas left: {d}", .{contract.gas});

                if (output.len > 0) {
                    if (self.config.log_level == .verbose or self.config.log_level == .trace) {
                        var hex_buf: [1024]u8 = undefined;
                        const output_display = if (output.len > 100)
                            try std.fmt.bufPrint(&hex_buf, "{s}... ({d} bytes total)", .{ hex.bytesToHex(output[0..32], hex_buf[0..64]) catch "??", output.len })
                        else
                            hex.bytesToHex(output, &hex_buf) catch "??";

                        self.test_logger.debug("Output: 0x{s}", .{output_display});

                        // Try to interpret the output if it's 32 bytes (common for return values)
                        if (output.len == 32) {
                            const value = u256_t_from_be_bytes(output);
                            self.test_logger.debug("Output as u256_t: {d}", .{value});
                        }
                    } else {
                        self.test_logger.debug("Output: {d} bytes", .{output.len});
                    }
                } else {
                    self.test_logger.debug("Output: (empty)", .{});
                }
            }
        } else if (ENABLE_DEBUG_LOGS and self.config.log_level != .silent) {
            self.test_logger.debug("==== Execution Succeeded (No Output) ====", .{});
            self.test_logger.debug("Gas used: {d}", .{gas - contract.gas});
            self.test_logger.debug("Gas left: {d}", .{contract.gas});
        }

        // Create successful result
        self.result = EvmResult{
            .status = null,
            .gas_left = contract.gas,
            .gas_used = gas - contract.gas,
            .output = output_copy,
            .allocator = self.allocator,
        };
    }

    /// Execute bytecode with unlimited gas
    pub fn executeUnlimited(self: *EvmTest, code: []const u8, input: []const u8) !void {
        try self.execute(std.math.maxInt(u64), code, input);
    }

    /// Get the result of the last execution as a success value (fails if there was an error)
    pub fn getResult(self: *const EvmTest) !EvmResult {
        if (self.result) |result| {
            if (result.status) |err| {
                return err;
            }
            return result;
        }
        return error.NoResult;
    }

    /// Get the numeric result of the execution (assumes 32 byte output that can be interpreted as u256_t)
    pub fn getNumericResult(self: *const EvmTest) !u256_t {
        if (self.result) |result| {
            if (result.status) |err| {
                return err;
            }

            if (result.output) |output| {
                if (output.len == 32) {
                    return u256_t_from_be_bytes(output);
                } else if (output.len < 32) {
                    // Pad with zeros if less than 32 bytes
                    var padded: [32]u8 = [_]u8{0} ** 32;
                    @memcpy(padded[32 - output.len ..], output);
                    return u256_t_from_be_bytes(&padded);
                } else {
                    return error.InvalidNumericOutput;
                }
            }

            return error.NoOutput;
        }

        return error.NoResult;
    }

    /// Assert that the execution succeeded
    pub fn expectSuccess(self: *const EvmTest) !void {
        if (self.result) |result| {
            if (result.status) |err| {
                if (ENABLE_DEBUG_LOGS) {
                    self.test_logger.err("Expected successful execution but got error: {s}", .{@errorName(err)});
                }
                return err;
            }
        } else {
            if (ENABLE_DEBUG_LOGS) {
                self.test_logger.err("Expected successful execution but no result available", .{});
            }
            return error.NoResult;
        }
    }

    /// Assert that the execution failed with the expected error
    pub fn expectError(self: *const EvmTest, expected: EvmModule.InterpreterError) !void {
        if (self.result) |result| {
            if (result.status) |err| {
                if (err != expected) {
                    if (ENABLE_DEBUG_LOGS) {
                        self.test_logger.err("Expected error {s} but got {s}", .{
                            @errorName(expected),
                            @errorName(err),
                        });
                    }
                    return error.UnexpectedError;
                }
            } else {
                if (ENABLE_DEBUG_LOGS) {
                    self.test_logger.err("Expected error {s} but execution succeeded", .{
                        @errorName(expected),
                    });
                }
                return error.ExpectedError;
            }
        } else {
            if (ENABLE_DEBUG_LOGS) {
                self.test_logger.err("Expected error {s} but no result available", .{
                    @errorName(expected),
                });
            }
            return error.NoResult;
        }
    }

    /// Assert that the numeric result equals the expected value
    pub fn expectResult(self: *const EvmTest, expected: u256_t) !void {
        try self.expectSuccess();

        const result_value = try self.getNumericResult();
        if (result_value != expected) {
            if (ENABLE_DEBUG_LOGS) {
                self.test_logger.err("Expected result {d} but got {d}", .{
                    expected,
                    result_value,
                });
            }
            return error.UnexpectedResult;
        }
    }

    /// Assert that the execution used the expected amount of gas
    pub fn expectGasUsed(self: *const EvmTest, expected: u64) !void {
        if (self.result) |result| {
            if (result.gas_used != expected) {
                if (ENABLE_DEBUG_LOGS) {
                    self.test_logger.err("Expected {d} gas used but got {d}", .{
                        expected,
                        result.gas_used,
                    });
                }
                return error.UnexpectedGasUsed;
            }
        } else {
            if (ENABLE_DEBUG_LOGS) {
                self.test_logger.err("Expected {d} gas used but no result available", .{
                    expected,
                });
            }
            return error.NoResult;
        }
    }

    /// Assert that the execution used no more than the expected amount of gas
    pub fn expectMaxGasUsed(self: *const EvmTest, max_expected: u64) !void {
        if (self.result) |result| {
            if (result.gas_used > max_expected) {
                if (ENABLE_DEBUG_LOGS) {
                    self.test_logger.err("Expected at most {d} gas used but got {d}", .{
                        max_expected,
                        result.gas_used,
                    });
                }
                return error.GasUsageExceeded;
            }
        } else {
            if (ENABLE_DEBUG_LOGS) {
                self.test_logger.err("Expected at most {d} gas used but no result available", .{
                    max_expected,
                });
            }
            return error.NoResult;
        }
    }

    /// Format a diagnostic message about the last execution
    pub fn formatDiagnostic(self: *const EvmTest) ![]const u8 {
        var buffer = std.ArrayList(u8).init(self.allocator);
        errdefer buffer.deinit();

        try buffer.appendSlice("EVM Test Diagnostic:\n");
        try buffer.writer().print("  Hardfork: {s}\n", .{@tagName(self.hardfork)});

        if (self.result) |result| {
            try buffer.appendSlice("  Result:\n");

            const result_formatted = try result.format(self.allocator);
            defer self.allocator.free(result_formatted);

            // Indent the result
            var lines = std.mem.split(u8, result_formatted, "\n");
            while (lines.next()) |line| {
                try buffer.writer().print("    {s}\n", .{line});
            }
        } else {
            try buffer.appendSlice("  Result: none\n");
        }

        return buffer.toOwnedSlice();
    }
};

// Bytecode building utilities to simplify test creation
// Create a bytecode with PUSH instructions for the given number
pub fn push(n: u256_t) []const u8 {
    // Find the smallest PUSH opcode that can represent the number
    var bytes: [32]u8 = undefined;
    var byte_len: usize = 0;

    if (n == 0) {
        return &[_]u8{ @intFromEnum(opcodes.Opcode.PUSH1), 0 };
    }

    // Convert n to bytes and find significant byte length
    // (Ethereum uses big-endian encoding)
    var temp = n;
    var i: usize = 31;
    while (temp > 0) : (i -= 1) {
        bytes[i] = @intCast(temp & 0xFF);
        temp >>= 8;
        byte_len += 1;
    }

    // Create result bytecode: PUSH<n> followed by bytes
    const result_len = byte_len + 1;
    var result = std.heap.c_allocator.alloc(u8, result_len) catch unreachable;

    // Determine PUSH opcode (PUSH1...PUSH32)
    const push_opcode = @intFromEnum(opcodes.Opcode.PUSH1) + byte_len - 1;
    result[0] = push_opcode;

    // Copy significant bytes
    const source_start = 32 - byte_len;
    @memcpy(result[1..], bytes[source_start..]);

    return result;
}

// Create a bytecode with PUSH instruction for a string of hex digits
pub fn pushHex(hex_str: []const u8) []const u8 {
    const data = std.fmt.parseHexDigest(hex_str, std.heap.c_allocator.alloc(u8, hex_str.len / 2) catch unreachable) catch unreachable;
    const opcode = @intFromEnum(opcodes.Opcode.PUSH1) + data.len - 1;

    var result = std.heap.c_allocator.alloc(u8, data.len + 1) catch unreachable;
    result[0] = opcode;
    @memcpy(result[1..], data);

    return result;
}

// Create a sequence of PUSH0 instructions
pub fn push0() []const u8 {
    return &[_]u8{@intFromEnum(opcodes.Opcode.PUSH0)};
}

// Create a bytecode with DUP<n> instruction
pub fn dup(n: u8) []const u8 {
    if (n < 1 or n > 16) {
        @panic("DUP index must be between 1 and 16");
    }
    return &[_]u8{@intFromEnum(opcodes.Opcode.DUP1) + n - 1};
}

// Create a bytecode with SWAP<n> instruction
pub fn swap(n: u8) []const u8 {
    if (n < 1 or n > 16) {
        @panic("SWAP index must be between 1 and 16");
    }
    return &[_]u8{@intFromEnum(opcodes.Opcode.SWAP1) + n - 1};
}

// Create a bytecode with MSTORE instruction
pub fn mstore(offset: u256_t, value: u256_t) []const u8 {
    return push(value) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MSTORE)};
}

// Create a bytecode with MSTORE8 instruction
pub fn mstore8(offset: u256_t, value: u256_t) []const u8 {
    return push(value) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MSTORE8)};
}

// Create a bytecode with RETURN(offset, size)
pub fn ret(offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.RETURN)};
}

// Create a bytecode that returns the top stack item
pub fn ret_top() []const u8 {
    return mstore(0, u256_t(0)) ++ ret(0, u256_t(32));
}

// Create a bytecode with REVERT(offset, size)
pub fn revert(offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.REVERT)};
}

// Create a bytecode for the top stack item's NOT
pub fn not(value: u256_t) []const u8 {
    return push(value) ++ &[_]u8{@intFromEnum(opcodes.Opcode.NOT)};
}

// Create a bytecode with ADD operation
pub fn add(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.ADD)};
}

// Create a bytecode with SUB operation
pub fn sub(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SUB)};
}

// Create a bytecode with MUL operation
pub fn mul(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MUL)};
}

// Create a bytecode with DIV operation
pub fn div(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.DIV)};
}

// Create a bytecode with SDIV operation
pub fn sdiv(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SDIV)};
}

// Create a bytecode with MOD operation
pub fn mod(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MOD)};
}

// Create a bytecode with ADDMOD operation
pub fn addmod(a: u256_t, b: u256_t, m: u256_t) []const u8 {
    return push(a) ++ push(b) ++ push(m) ++ &[_]u8{@intFromEnum(opcodes.Opcode.ADDMOD)};
}

// Create a bytecode with MULMOD operation
pub fn mulmod(a: u256_t, b: u256_t, m: u256_t) []const u8 {
    return push(a) ++ push(b) ++ push(m) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MULMOD)};
}

// Create a bytecode with KECCAK256 operation
pub fn keccak256(offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SHA3)};
}

// Create a bytecode that loads from calldata
pub fn calldataload(offset: u256_t) []const u8 {
    return push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.CALLDATALOAD)};
}

// Create a bytecode that copies from calldata to memory
pub fn calldatacopy(destOffset: u256_t, offset: u256_t, size: u256_t) []const u8 {
    return push(size) ++ push(offset) ++ push(destOffset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.CALLDATACOPY)};
}

// Create a bytecode that compares for equality
pub fn eq(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.EQ)};
}

// Create a bytecode that tests if value is zero
pub fn iszero(a: u256_t) []const u8 {
    return push(a) ++ &[_]u8{@intFromEnum(opcodes.Opcode.ISZERO)};
}

// Create a bytecode with JUMP
pub fn jump(dest: u256_t) []const u8 {
    return push(dest) ++ &[_]u8{@intFromEnum(opcodes.Opcode.JUMP)};
}

// Create a bytecode with conditional JUMPI
pub fn jumpi(dest: u256_t, condition: u256_t) []const u8 {
    return push(condition) ++ push(dest) ++ &[_]u8{@intFromEnum(opcodes.Opcode.JUMPI)};
}

// Bytecode for JUMPDEST
pub const jumpdest = &[_]u8{@intFromEnum(opcodes.Opcode.JUMPDEST)};

// Create a bytecode with AND operation
pub fn @"and"(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.AND)};
}

// Create a bytecode with OR operation
pub fn @"or"(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.OR)};
}

// Create a bytecode with XOR operation
pub fn xor(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.XOR)};
}

// Create a bytecode with BYTE operation (get the nth byte)
pub fn byte(n: u256_t, val: u256_t) []const u8 {
    return push(val) ++ push(n) ++ &[_]u8{@intFromEnum(opcodes.Opcode.BYTE)};
}

// Create a bytecode with SHL operation (shift left)
pub fn shl(shift: u256_t, val: u256_t) []const u8 {
    return push(val) ++ push(shift) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SHL)};
}

// Create a bytecode with SHR operation (logical shift right)
pub fn shr(shift: u256_t, val: u256_t) []const u8 {
    return push(val) ++ push(shift) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SHR)};
}

// Create a bytecode with SAR operation (arithmetic shift right)
pub fn sar(shift: u256_t, val: u256_t) []const u8 {
    return push(val) ++ push(shift) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SAR)};
}

// Create a bytecode with comparison operations
pub fn lt(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.LT)};
}

pub fn gt(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.GT)};
}

pub fn slt(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SLT)};
}

pub fn sgt(a: u256_t, b: u256_t) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SGT)};
}

// Create full program that performs operation and returns the result
pub fn program(operation: []const u8) []const u8 {
    return operation ++ ret_top();
}
