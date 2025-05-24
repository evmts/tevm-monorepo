# JumpTable Implementation Issue

## Overview

JumpTable.zig implements an efficient opcode dispatch mechanism for the EVM interpreter using function pointer arrays, supporting different hardfork configurations and providing O(1) opcode lookup performance.

## Requirements

- Create jump tables for all Ethereum hardforks
- Map opcodes to their handler functions
- Support dynamic opcode enabling/disabling
- Handle invalid opcodes gracefully
- Optimize for CPU cache locality
- Support EOF (EVM Object Format) opcodes
- Provide hardfork-specific behavior
- Enable runtime jump table switching
- Track gas costs per opcode
- Support opcode metadata (stack requirements, etc.)

## Interface

```zig
const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const Gas = @import("../Gas.zig").Gas;

pub const JumpTableError = error{
    InvalidOpcode,
    OpcodeNotSupported,
    InvalidHardfork,
};

/// Opcode handler function signature
pub const OpcodeFn = *const fn (*Interpreter, *Frame) anyerror!void;

/// Opcode metadata for validation and gas calculation
pub const OpcodeInfo = struct {
    /// Handler function
    handler: OpcodeFn,
    /// Base gas cost (static)
    gas_cost: u64,
    /// Minimum stack items required
    stack_min: u8,
    /// Maximum stack items after execution
    stack_max: u8,
    /// Whether opcode is enabled
    enabled: bool,
    /// Whether opcode modifies state
    writes: bool,
    /// Whether opcode is a jump
    jumps: bool,
    /// Whether opcode halts execution
    halts: bool,
    /// Mnemonic name
    name: []const u8,
};

/// Hardfork specification
pub const Hardfork = enum {
    Frontier,
    Homestead,
    TangerineWhistle,
    SpuriousDragon,
    Byzantium,
    Constantinople,
    Petersburg,
    Istanbul,
    Berlin,
    London,
    Paris,
    Shanghai,
    Cancun,
    Prague,
};

/// Jump table containing opcode handlers
pub const JumpTable = struct {
    /// Array of opcode information (256 entries)
    opcodes: [256]OpcodeInfo,
    /// Hardfork this table is configured for
    hardfork: Hardfork,
    /// Whether EOF opcodes are enabled
    eof_enabled: bool,

    /// Create jump table for specific hardfork
    pub fn init(hardfork: Hardfork) JumpTable {
        var table = JumpTable{
            .opcodes = undefined,
            .hardfork = hardfork,
            .eof_enabled = hardfork.isEOFEnabled(),
        };

        // Initialize all opcodes as invalid
        for (&table.opcodes, 0..) |*op, i| {
            op.* = OpcodeInfo{
                .handler = &invalidOpcode,
                .gas_cost = 0,
                .stack_min = 0,
                .stack_max = 0,
                .enabled = false,
                .writes = false,
                .jumps = false,
                .halts = false,
                .name = std.fmt.comptimePrint("INVALID_{X:0>2}", .{i}),
            };
        }

        // Configure opcodes based on hardfork
        table.configureFrontier();
        
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Homestead)) {
            table.configureHomestead();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.TangerineWhistle)) {
            table.configureTangerineWhistle();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.SpuriousDragon)) {
            table.configureSpuriousDragon();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Byzantium)) {
            table.configureByzantium();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Constantinople)) {
            table.configureConstantinople();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Istanbul)) {
            table.configureIstanbul();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Berlin)) {
            table.configureBerlin();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.London)) {
            table.configureLondon();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Shanghai)) {
            table.configureShanghai();
        }
        if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.Cancun)) {
            table.configureCancun();
        }

        return table;
    }

    /// Get opcode info
    pub fn getOpcode(self: *const JumpTable, opcode: u8) *const OpcodeInfo {
        return &self.opcodes[opcode];
    }

    /// Execute opcode
    pub fn execute(self: *const JumpTable, interpreter: *Interpreter, frame: *Frame, opcode: u8) !void {
        const info = self.getOpcode(opcode);
        
        if (!info.enabled) {
            return error.OpcodeNotSupported;
        }

        // Check stack requirements
        if (frame.stack.len() < info.stack_min) {
            return error.StackUnderflow;
        }

        // Check if we have room for stack growth
        const stack_after = frame.stack.len() - info.stack_min + info.stack_max;
        if (stack_after > 1024) {
            return error.StackOverflow;
        }

        // Check static context
        if (info.writes and frame.is_static) {
            return error.WriteProtection;
        }

        // Charge gas
        try frame.gas.consume(info.gas_cost);

        // Execute handler
        try info.handler(interpreter, frame);
    }

    // Hardfork configurations

    fn configureFrontier(self: *JumpTable) void {
        // Arithmetic
        self.opcodes[0x01] = makeOpcode("ADD", &opcodes.add, 3, 2, 1);
        self.opcodes[0x02] = makeOpcode("MUL", &opcodes.mul, 5, 2, 1);
        self.opcodes[0x03] = makeOpcode("SUB", &opcodes.sub, 3, 2, 1);
        self.opcodes[0x04] = makeOpcode("DIV", &opcodes.div, 5, 2, 1);
        self.opcodes[0x05] = makeOpcode("SDIV", &opcodes.sdiv, 5, 2, 1);
        self.opcodes[0x06] = makeOpcode("MOD", &opcodes.mod, 5, 2, 1);
        self.opcodes[0x07] = makeOpcode("SMOD", &opcodes.smod, 5, 2, 1);
        self.opcodes[0x08] = makeOpcode("ADDMOD", &opcodes.addmod, 8, 3, 1);
        self.opcodes[0x09] = makeOpcode("MULMOD", &opcodes.mulmod, 8, 3, 1);
        self.opcodes[0x0a] = makeOpcode("EXP", &opcodes.exp, 10, 2, 1);
        self.opcodes[0x0b] = makeOpcode("SIGNEXTEND", &opcodes.signextend, 5, 2, 1);

        // Comparison & Bitwise
        self.opcodes[0x10] = makeOpcode("LT", &opcodes.lt, 3, 2, 1);
        self.opcodes[0x11] = makeOpcode("GT", &opcodes.gt, 3, 2, 1);
        self.opcodes[0x12] = makeOpcode("SLT", &opcodes.slt, 3, 2, 1);
        self.opcodes[0x13] = makeOpcode("SGT", &opcodes.sgt, 3, 2, 1);
        self.opcodes[0x14] = makeOpcode("EQ", &opcodes.eq, 3, 2, 1);
        self.opcodes[0x15] = makeOpcode("ISZERO", &opcodes.iszero, 3, 1, 1);
        self.opcodes[0x16] = makeOpcode("AND", &opcodes.bitAnd, 3, 2, 1);
        self.opcodes[0x17] = makeOpcode("OR", &opcodes.bitOr, 3, 2, 1);
        self.opcodes[0x18] = makeOpcode("XOR", &opcodes.bitXor, 3, 2, 1);
        self.opcodes[0x19] = makeOpcode("NOT", &opcodes.bitNot, 3, 1, 1);
        self.opcodes[0x1a] = makeOpcode("BYTE", &opcodes.byte, 3, 2, 1);

        // SHA3
        self.opcodes[0x20] = makeOpcode("SHA3", &opcodes.sha3, 30, 2, 1);

        // Environmental
        self.opcodes[0x30] = makeOpcode("ADDRESS", &opcodes.address, 2, 0, 1);
        self.opcodes[0x31] = makeOpcode("BALANCE", &opcodes.balance, 700, 1, 1);
        self.opcodes[0x32] = makeOpcode("ORIGIN", &opcodes.origin, 2, 0, 1);
        self.opcodes[0x33] = makeOpcode("CALLER", &opcodes.caller, 2, 0, 1);
        self.opcodes[0x34] = makeOpcode("CALLVALUE", &opcodes.callvalue, 2, 0, 1);
        self.opcodes[0x35] = makeOpcode("CALLDATALOAD", &opcodes.calldataload, 3, 1, 1);
        self.opcodes[0x36] = makeOpcode("CALLDATASIZE", &opcodes.calldatasize, 2, 0, 1);
        self.opcodes[0x37] = makeOpcode("CALLDATACOPY", &opcodes.calldatacopy, 3, 3, 0);
        self.opcodes[0x38] = makeOpcode("CODESIZE", &opcodes.codesize, 2, 0, 1);
        self.opcodes[0x39] = makeOpcode("CODECOPY", &opcodes.codecopy, 3, 3, 0);
        self.opcodes[0x3a] = makeOpcode("GASPRICE", &opcodes.gasprice, 2, 0, 1);

        // Block
        self.opcodes[0x40] = makeOpcode("BLOCKHASH", &opcodes.blockhash, 20, 1, 1);
        self.opcodes[0x41] = makeOpcode("COINBASE", &opcodes.coinbase, 2, 0, 1);
        self.opcodes[0x42] = makeOpcode("TIMESTAMP", &opcodes.timestamp, 2, 0, 1);
        self.opcodes[0x43] = makeOpcode("NUMBER", &opcodes.number, 2, 0, 1);
        self.opcodes[0x44] = makeOpcode("DIFFICULTY", &opcodes.difficulty, 2, 0, 1);
        self.opcodes[0x45] = makeOpcode("GASLIMIT", &opcodes.gaslimit, 2, 0, 1);

        // Stack, Memory, Storage and Flow
        self.opcodes[0x50] = makeOpcode("POP", &opcodes.pop, 2, 1, 0);
        self.opcodes[0x51] = makeOpcode("MLOAD", &opcodes.mload, 3, 1, 1);
        self.opcodes[0x52] = makeOpcode("MSTORE", &opcodes.mstore, 3, 2, 0);
        self.opcodes[0x53] = makeOpcode("MSTORE8", &opcodes.mstore8, 3, 2, 0);
        self.opcodes[0x54] = makeOpcode("SLOAD", &opcodes.sload, 200, 1, 1);
        self.opcodes[0x55] = makeOpcodeWrite("SSTORE", &opcodes.sstore, 0, 2, 0); // Dynamic gas
        self.opcodes[0x56] = makeOpcodeJump("JUMP", &opcodes.jump, 8, 1, 0);
        self.opcodes[0x57] = makeOpcodeJump("JUMPI", &opcodes.jumpi, 10, 2, 0);
        self.opcodes[0x58] = makeOpcode("PC", &opcodes.pc, 2, 0, 1);
        self.opcodes[0x59] = makeOpcode("MSIZE", &opcodes.msize, 2, 0, 1);
        self.opcodes[0x5a] = makeOpcode("GAS", &opcodes.gas, 2, 0, 1);
        self.opcodes[0x5b] = makeOpcode("JUMPDEST", &opcodes.jumpdest, 1, 0, 0);

        // Push operations
        inline for (0..32) |i| {
            const n = i + 1;
            self.opcodes[0x60 + i] = makeOpcode(
                std.fmt.comptimePrint("PUSH{}", .{n}),
                @field(opcodes, std.fmt.comptimePrint("push{}", .{n})),
                3,
                0,
                1,
            );
        }

        // Dup operations
        inline for (1..17) |i| {
            self.opcodes[0x80 + i - 1] = makeOpcode(
                std.fmt.comptimePrint("DUP{}", .{i}),
                @field(opcodes, std.fmt.comptimePrint("dup{}", .{i})),
                3,
                i,
                i + 1,
            );
        }

        // Swap operations
        inline for (1..17) |i| {
            self.opcodes[0x90 + i - 1] = makeOpcode(
                std.fmt.comptimePrint("SWAP{}", .{i}),
                @field(opcodes, std.fmt.comptimePrint("swap{}", .{i})),
                3,
                i + 1,
                i + 1,
            );
        }

        // Logging
        inline for (0..5) |i| {
            self.opcodes[0xa0 + i] = makeOpcodeWrite(
                std.fmt.comptimePrint("LOG{}", .{i}),
                @field(opcodes, std.fmt.comptimePrint("log{}", .{i})),
                375 + 375 * i,
                i + 2,
                0,
            );
        }

        // System operations
        self.opcodes[0xf0] = makeOpcodeWrite("CREATE", &opcodes.create, 32000, 3, 1);
        self.opcodes[0xf1] = makeOpcode("CALL", &opcodes.call, 700, 7, 1);
        self.opcodes[0xf2] = makeOpcode("CALLCODE", &opcodes.callcode, 700, 7, 1);
        self.opcodes[0xf3] = makeOpcodeHalt("RETURN", &opcodes.return_, 0, 2, 0);
        self.opcodes[0xff] = makeOpcodeHalt("SELFDESTRUCT", &opcodes.selfdestruct, 5000, 1, 0);

        // Invalid by default
        self.opcodes[0x00] = makeOpcodeHalt("STOP", &opcodes.stop, 0, 0, 0);
        self.opcodes[0xfe] = makeOpcodeHalt("INVALID", &opcodes.invalid, 0, 0, 0);
    }

    fn configureHomestead(self: *JumpTable) void {
        // DELEGATECALL
        self.opcodes[0xf4] = makeOpcode("DELEGATECALL", &opcodes.delegatecall, 700, 6, 1);
    }

    fn configureTangerineWhistle(self: *JumpTable) void {
        // Increase gas costs for state operations
        self.opcodes[0x31].gas_cost = 400; // BALANCE
        self.opcodes[0x3b].gas_cost = 700; // EXTCODESIZE
        self.opcodes[0x3c].gas_cost = 700; // EXTCODECOPY
        self.opcodes[0x54].gas_cost = 200; // SLOAD
        self.opcodes[0xf1].gas_cost = 700; // CALL
        self.opcodes[0xf2].gas_cost = 700; // CALLCODE
        self.opcodes[0xf4].gas_cost = 700; // DELEGATECALL
        self.opcodes[0xff].gas_cost = 5000; // SELFDESTRUCT
    }

    fn configureSpuriousDragon(self: *JumpTable) void {
        // EXP gas cost changes
        self.opcodes[0x0a].gas_cost = 10; // EXP base cost
    }

    fn configureByzantium(self: *JumpTable) void {
        // New opcodes
        self.opcodes[0x3d] = makeOpcode("RETURNDATASIZE", &opcodes.returndatasize, 2, 0, 1);
        self.opcodes[0x3e] = makeOpcode("RETURNDATACOPY", &opcodes.returndatacopy, 3, 3, 0);
        self.opcodes[0xfa] = makeOpcode("STATICCALL", &opcodes.staticcall, 700, 6, 1);
        self.opcodes[0xfd] = makeOpcodeHalt("REVERT", &opcodes.revert, 0, 2, 0);

        // REVERT with EIP-140
        self.opcodes[0xfd].enabled = true;
    }

    fn configureConstantinople(self: *JumpTable) void {
        // New opcodes
        self.opcodes[0x1b] = makeOpcode("SHL", &opcodes.shl, 3, 2, 1);
        self.opcodes[0x1c] = makeOpcode("SHR", &opcodes.shr, 3, 2, 1);
        self.opcodes[0x1d] = makeOpcode("SAR", &opcodes.sar, 3, 2, 1);
        self.opcodes[0x3f] = makeOpcode("EXTCODEHASH", &opcodes.extcodehash, 700, 1, 1);
        self.opcodes[0xf5] = makeOpcodeWrite("CREATE2", &opcodes.create2, 32000, 4, 1);
    }

    fn configureIstanbul(self: *JumpTable) void {
        // CHAINID
        self.opcodes[0x46] = makeOpcode("CHAINID", &opcodes.chainid, 2, 0, 1);
        
        // SELFBALANCE
        self.opcodes[0x47] = makeOpcode("SELFBALANCE", &opcodes.selfbalance, 5, 0, 1);
        
        // Reduce gas costs
        self.opcodes[0x31].gas_cost = 700; // BALANCE
        self.opcodes[0x54].gas_cost = 800; // SLOAD
        self.opcodes[0x3f].gas_cost = 700; // EXTCODEHASH
    }

    fn configureBerlin(self: *JumpTable) void {
        // EIP-2929: Gas cost increases for cold access
        // These are now dynamic based on access lists
        self.opcodes[0x31].gas_cost = 0; // BALANCE (dynamic)
        self.opcodes[0x3b].gas_cost = 0; // EXTCODESIZE (dynamic)
        self.opcodes[0x3c].gas_cost = 0; // EXTCODECOPY (dynamic)
        self.opcodes[0x3f].gas_cost = 0; // EXTCODEHASH (dynamic)
        self.opcodes[0x54].gas_cost = 0; // SLOAD (dynamic)
        self.opcodes[0x55].gas_cost = 0; // SSTORE (dynamic)
        self.opcodes[0xf1].gas_cost = 0; // CALL (dynamic)
        self.opcodes[0xf2].gas_cost = 0; // CALLCODE (dynamic)
        self.opcodes[0xf4].gas_cost = 0; // DELEGATECALL (dynamic)
        self.opcodes[0xfa].gas_cost = 0; // STATICCALL (dynamic)
    }

    fn configureLondon(self: *JumpTable) void {
        // BASEFEE
        self.opcodes[0x48] = makeOpcode("BASEFEE", &opcodes.basefee, 2, 0, 1);
    }

    fn configureShanghai(self: *JumpTable) void {
        // PUSH0
        self.opcodes[0x5f] = makeOpcode("PUSH0", &opcodes.push0, 2, 0, 1);
    }

    fn configureCancun(self: *JumpTable) void {
        // EIP-4844: Shard Blob Transactions
        self.opcodes[0x49] = makeOpcode("BLOBHASH", &opcodes.blobhash, 3, 1, 1);
        self.opcodes[0x4a] = makeOpcode("BLOBBASEFEE", &opcodes.blobbasefee, 2, 0, 1);
        
        // EIP-5656: MCOPY
        self.opcodes[0x5e] = makeOpcode("MCOPY", &opcodes.mcopy, 3, 3, 0);
        
        // EIP-1153: Transient storage
        self.opcodes[0x5c] = makeOpcode("TLOAD", &opcodes.tload, 100, 1, 1);
        self.opcodes[0x5d] = makeOpcodeWrite("TSTORE", &opcodes.tstore, 100, 2, 0);
        
        // EIP-7516: BLOBBASEFEE
        self.opcodes[0x4a].enabled = true;
    }

    // Helper functions

    fn makeOpcode(
        name: []const u8,
        handler: OpcodeFn,
        gas: u64,
        stack_min: u8,
        stack_max: u8,
    ) OpcodeInfo {
        return OpcodeInfo{
            .handler = handler,
            .gas_cost = gas,
            .stack_min = stack_min,
            .stack_max = stack_max,
            .enabled = true,
            .writes = false,
            .jumps = false,
            .halts = false,
            .name = name,
        };
    }

    fn makeOpcodeWrite(
        name: []const u8,
        handler: OpcodeFn,
        gas: u64,
        stack_min: u8,
        stack_max: u8,
    ) OpcodeInfo {
        var info = makeOpcode(name, handler, gas, stack_min, stack_max);
        info.writes = true;
        return info;
    }

    fn makeOpcodeJump(
        name: []const u8,
        handler: OpcodeFn,
        gas: u64,
        stack_min: u8,
        stack_max: u8,
    ) OpcodeInfo {
        var info = makeOpcode(name, handler, gas, stack_min, stack_max);
        info.jumps = true;
        return info;
    }

    fn makeOpcodeHalt(
        name: []const u8,
        handler: OpcodeFn,
        gas: u64,
        stack_min: u8,
        stack_max: u8,
    ) OpcodeInfo {
        var info = makeOpcode(name, handler, gas, stack_min, stack_max);
        info.halts = true;
        return info;
    }

    /// Check if hardfork supports EOF
    fn isEOFEnabled(hardfork: Hardfork) bool {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.Prague);
    }
};

/// Invalid opcode handler
fn invalidOpcode(interpreter: *Interpreter, frame: *Frame) !void {
    _ = interpreter;
    _ = frame;
    return error.InvalidOpcode;
}

// Opcode namespace (would import from opcodes module)
const opcodes = struct {
    // Stubs for the example - actual implementations in opcodes/*.zig
    pub fn add(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn mul(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn sub(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn div(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn sdiv(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn mod(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn smod(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn addmod(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn mulmod(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn exp(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn signextend(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    
    // ... all other opcodes
    pub fn stop(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; }
    pub fn invalid(i: *Interpreter, f: *Frame) !void { _ = i; _ = f; return error.InvalidOpcode; }
};
```

## Code Reference from Existing Implementation

From the existing JumpTable.zig:

```zig
//! A Jump Table is a critical performance optimization used in interpreters and virtual machines
//! to efficiently dispatch opcodes to their implementation functions. Instead of using a large
//! switch statement or if-else chain, which can cause branch prediction misses and poor CPU cache
//! utilization, a jump table provides direct indexed access to function pointers.
//!
//! This approach provides:
//! - O(1) dispatch time regardless of opcode value
//! - Better CPU cache locality
//! - Eliminates branch prediction misses
//! - Simplified hardfork management (different tables for different forks)
```

## Reference Implementations

### Go-Ethereum (core/vm/jump_table.go)

```go
type executionFunc func(pc *uint64, interpreter *EVMInterpreter, callContext *ScopeContext) ([]byte, error)

// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

// operation contains the execution function and other info for a given opcode.
type operation struct {
    execute     executionFunc
    constantGas uint64
    dynamicGas  gasFunc
    minStack    int
    maxStack    int
    memorySize  memorySizeFunc
    writes      bool   // determines whether op is a state-modifying operation
    jumps       bool   // determines whether op is a jump operation
    reverts     bool   // determines whether op reverts state
    halts       bool   // determines whether op halts execution
    undefined   bool   // determines whether op is undefined
    returns     bool   // determines whether op returns from the current call
}

// newFrontierInstructionSet returns the frontier instructions.
func newFrontierInstructionSet() JumpTable {
    tbl := JumpTable{
        STOP: {
            execute:     opStop,
            constantGas: 0,
            minStack:    minStack(0, 0),
            maxStack:    maxStack(0, 0),
            halts:       true,
        },
        ADD: {
            execute:     opAdd,
            constantGas: GasFastestStep,
            minStack:    minStack(2, 1),
            maxStack:    maxStack(2, 1),
        },
        // ... more opcodes
    }
    return tbl
}
```

### evmone (lib/evmone/instruction_table.hpp)

```cpp
struct instruction_table_entry
{
    exec_fn_t fn = nullptr;
    int16_t gas_cost = 0;
    int8_t stack_req = 0;
    int8_t stack_change = 0;
};

using instruction_table = std::array<instruction_table_entry, 256>;

constexpr instruction_table make_instruction_table() noexcept
{
    instruction_table table{};
    
    table[OP_STOP] = {stop, 0, 0, 0};
    table[OP_ADD] = {add, 3, 2, -1};
    table[OP_MUL] = {mul, 5, 2, -1};
    table[OP_SUB] = {sub, 3, 2, -1};
    table[OP_DIV] = {div, 5, 2, -1};
    // ... more opcodes
    
    return table;
}

// evmone uses computed goto for even better performance:
#define ON(name) &&on_##name
#define DISPATCH() goto *jump_table[*pc]
#define DISPATCH_POST(name) on_##name : DISPATCH()
```

### revm (crates/interpreter/src/instructions/opcode.rs)

```rust
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum OpCode {
    STOP = 0x00,
    ADD = 0x01,
    MUL = 0x02,
    SUB = 0x03,
    DIV = 0x04,
    // ... all opcodes
}

impl OpCode {
    /// Returns the gas cost of the opcode.
    pub const fn gas(&self) -> u64 {
        match self {
            OpCode::STOP => 0,
            OpCode::ADD => 3,
            OpCode::MUL => 5,
            OpCode::SUB => 3,
            OpCode::DIV => 5,
            // ...
        }
    }
    
    /// Returns the minimum stack size required by the opcode.
    pub const fn min_stack(&self) -> usize {
        match self {
            OpCode::STOP => 0,
            OpCode::ADD => 2,
            OpCode::MUL => 2,
            // ...
        }
    }
}

// revm uses macro-generated match for dispatch:
macro_rules! dispatch {
    ($op:expr, $interp:expr) => {
        match $op {
            OpCode::STOP => instructions::control::stop($interp),
            OpCode::ADD => instructions::arithmetic::add($interp),
            OpCode::MUL => instructions::arithmetic::mul($interp),
            // ... all opcodes
        }
    };
}
```

## Usage Example

```zig
// Create jump table for Shanghai hardfork
const jump_table = JumpTable.init(.Shanghai);

// In interpreter main loop
while (frame.pc < frame.contract.code.len) {
    const opcode = frame.contract.code[frame.pc];
    
    // Get opcode info
    const info = jump_table.getOpcode(opcode);
    
    // Log opcode execution
    std.log.debug("Executing {} at PC={}", .{ info.name, frame.pc });
    
    // Execute opcode
    jump_table.execute(&interpreter, &frame, opcode) catch |err| {
        frame.halt_reason = switch (err) {
            error.InvalidOpcode => .InvalidOpcode,
            error.StackUnderflow => .StackUnderflow,
            error.OutOfGas => .OutOfGas,
            else => .InvalidOpcode,
        };
        break;
    };
    
    // Advance PC if opcode doesn't jump
    if (!info.jumps and !info.halts) {
        frame.pc += 1;
    }
    
    // Check if execution should halt
    if (frame.shouldHalt()) {
        break;
    }
}
```

## Testing Requirements

1. **Hardfork Compatibility**:
   - Test each hardfork configuration
   - Verify opcode availability per fork
   - Test gas cost changes

2. **Opcode Validation**:
   - Test stack requirements
   - Test gas consumption
   - Test invalid opcodes

3. **Performance**:
   - Benchmark dispatch speed
   - Test cache efficiency
   - Compare with switch statement

4. **Edge Cases**:
   - Test all 256 opcodes
   - Test EOF opcodes
   - Test disabled opcodes

5. **Integration**:
   - Test with interpreter
   - Test with different contracts
   - Test hardfork transitions

## References

- [EVM Opcodes](https://www.evm.codes/) - Interactive opcode reference
- [Go-Ethereum jump_table.go](https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go)
- [evmone instruction_table.hpp](https://github.com/ethereum/evmone/blob/master/lib/evmone/instruction_table.hpp)
- [revm opcode.rs](https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/opcode.rs)