const std = @import("std");
const Evm = @import("../evm.zig").Evm;
const Hardfork = @import("../evm.zig").Hardfork;
const Address = @import("../../Address/address.zig").Address;
const Contract = @import("../Contract.zig");
const interpreter = @import("../interpreter.zig");
const Interpreter = interpreter.Interpreter;
const JumpTable = @import("../JumpTable.zig").JumpTable;
const buildJumpTable = @import("../JumpTable.zig").buildJumpTable;
const opcodes = @import("../opcodes.zig");
const EvmLogger = @import("../EvmLogger.zig").EvmLogger;
const createLogger = @import("../EvmLogger.zig").createLogger;
const u256 = @import("../../Types/U256.ts").u256;
const u256_from_be_bytes = @import("../../Types/U256.ts").u256_from_be_bytes;

// Create a file-specific logger
const logger = createLogger(@src().file);

/// Result of an EVM execution
pub const EvmResult = struct {
    /// Error status (if any)
    status: ?interpreter.InterpreterError = null,
    
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
};

/// Test fixture for EVM execution tests
pub const EvmTest = struct {
    /// Memory allocator for all resources
    allocator: std.mem.Allocator,
    
    /// The EVM instance to use for execution
    evm: Evm,
    
    /// The jump table containing opcode implementations
    jump_table: JumpTable,
    
    /// EVM revision to use for tests (defaults to Byzantium)
    hardfork: Hardfork = .Byzantium,
    
    /// The result of the last execution
    result: ?EvmResult = null,
    
    /// Create a new EVM test fixture
    pub fn init(allocator: std.mem.Allocator) !EvmTest {
        var evm = Evm.init();
        evm.setChainRules(Evm.ChainRules.forHardfork(.Byzantium));
        
        // Create a jump table
        var jump_table = try buildJumpTable(allocator);
        
        return EvmTest{
            .allocator = allocator,
            .evm = evm,
            .jump_table = jump_table,
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
        
        // Create a contract
        const caller = try Address.fromHexString("0x0000000000000000000000000000000000000000");
        const contract_addr = try Address.fromHexString("0x0000000000000000000000000000000000000000");
        var contract = Contract.createContract(caller, contract_addr, 0, gas);
        
        // Set the contract code
        const code_hash = [_]u8{0} ** 32; // Dummy hash, not used in tests
        contract.setCallCode(code_hash, code);
        
        // Create an interpreter
        var interpreter_instance = Interpreter.create(self.allocator, &self.evm, self.jump_table);
        defer interpreter_instance.deinit();
        
        // Execute the code
        const execution_result = interpreter_instance.run(&contract, input, false) catch |err| {
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
};

/// Bytecode building utilities to simplify test creation

/// Create a bytecode with PUSH instructions for the given number
pub fn push(n: u256) []const u8 {
    // Find the smallest PUSH opcode that can represent the number
    var bytes: [32]u8 = undefined;
    var byte_len: usize = 0;
    
    if (n == 0) {
        return &[_]u8{@intFromEnum(opcodes.Opcode.PUSH1), 0};
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

/// Create a bytecode with PUSH instruction for a string of hex digits
pub fn pushHex(hex: []const u8) []const u8 {
    const data = std.fmt.parseHexDigest(hex, std.heap.c_allocator.alloc(u8, hex.len / 2) catch unreachable) catch unreachable;
    const opcode = @intFromEnum(opcodes.Opcode.PUSH1) + data.len - 1;
    
    var result = std.heap.c_allocator.alloc(u8, data.len + 1) catch unreachable;
    result[0] = opcode;
    @memcpy(result[1..], data);
    
    return result;
}

/// Create a sequence of PUSH0 instructions
pub fn push0() []const u8 {
    return &[_]u8{@intFromEnum(opcodes.Opcode.PUSH0)};
}

/// Create a bytecode with DUP<n> instruction
pub fn dup(n: u8) []const u8 {
    if (n < 1 or n > 16) {
        @panic("DUP index must be between 1 and 16");
    }
    return &[_]u8{@intFromEnum(opcodes.Opcode.DUP1) + n - 1};
}

/// Create a bytecode with SWAP<n> instruction
pub fn swap(n: u8) []const u8 {
    if (n < 1 or n > 16) {
        @panic("SWAP index must be between 1 and 16");
    }
    return &[_]u8{@intFromEnum(opcodes.Opcode.SWAP1) + n - 1};
}

/// Create a bytecode with MSTORE instruction
pub fn mstore(offset: u256, value: u256) []const u8 {
    return push(value) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MSTORE)};
}

/// Create a bytecode with MSTORE8 instruction
pub fn mstore8(offset: u256, value: u256) []const u8 {
    return push(value) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MSTORE8)};
}

/// Create a bytecode with RETURN(offset, size)
pub fn ret(offset: u256, size: u256) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.RETURN)};
}

/// Create a bytecode that returns the top stack item
pub fn ret_top() []const u8 {
    return mstore(0, u256(0)) ++ ret(0, u256(32));
}

/// Create a bytecode with REVERT(offset, size)
pub fn revert(offset: u256, size: u256) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.REVERT)};
}

/// Create a bytecode for the top stack item's NOT
pub fn not(value: u256) []const u8 {
    return push(value) ++ &[_]u8{@intFromEnum(opcodes.Opcode.NOT)};
}

/// Create a bytecode with ADD operation
pub fn add(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.ADD)};
}

/// Create a bytecode with SUB operation
pub fn sub(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SUB)};
}

/// Create a bytecode with MUL operation
pub fn mul(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MUL)};
}

/// Create a bytecode with DIV operation
pub fn div(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.DIV)};
}

/// Create a bytecode with SDIV operation
pub fn sdiv(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SDIV)};
}

/// Create a bytecode with MOD operation
pub fn mod(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MOD)};
}

/// Create a bytecode with ADDMOD operation
pub fn addmod(a: u256, b: u256, m: u256) []const u8 {
    return push(a) ++ push(b) ++ push(m) ++ &[_]u8{@intFromEnum(opcodes.Opcode.ADDMOD)};
}

/// Create a bytecode with MULMOD operation
pub fn mulmod(a: u256, b: u256, m: u256) []const u8 {
    return push(a) ++ push(b) ++ push(m) ++ &[_]u8{@intFromEnum(opcodes.Opcode.MULMOD)};
}

/// Create a bytecode with KECCAK256 operation
pub fn keccak256(offset: u256, size: u256) []const u8 {
    return push(size) ++ push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.SHA3)};
}

/// Create a bytecode that loads from calldata
pub fn calldataload(offset: u256) []const u8 {
    return push(offset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.CALLDATALOAD)};
}

/// Create a bytecode that copies from calldata to memory
pub fn calldatacopy(destOffset: u256, offset: u256, size: u256) []const u8 {
    return push(size) ++ push(offset) ++ push(destOffset) ++ &[_]u8{@intFromEnum(opcodes.Opcode.CALLDATACOPY)};
}

/// Create a bytecode that compares for equality
pub fn eq(a: u256, b: u256) []const u8 {
    return push(a) ++ push(b) ++ &[_]u8{@intFromEnum(opcodes.Opcode.EQ)};
}

/// Create a bytecode that tests if value is zero
pub fn iszero(a: u256) []const u8 {
    return push(a) ++ &[_]u8{@intFromEnum(opcodes.Opcode.ISZERO)};
}

/// Create a bytecode with JUMP
pub fn jump(dest: u256) []const u8 {
    return push(dest) ++ &[_]u8{@intFromEnum(opcodes.Opcode.JUMP)};
}

/// Create a bytecode with conditional JUMPI
pub fn jumpi(dest: u256, condition: u256) []const u8 {
    return push(condition) ++ push(dest) ++ &[_]u8{@intFromEnum(opcodes.Opcode.JUMPI)};
}

/// Bytecode for JUMPDEST
pub const jumpdest = &[_]u8{@intFromEnum(opcodes.Opcode.JUMPDEST)};