const std = @import("std");

const ZERO_ADDRESS: [20]u8 = .{0} ** 20;

const Block = struct {
    number: u64,
    coinbase: [20]u8,
    timestamp: u64,
    difficulty: u256,
    prevRandao: [32]u8,
    gasLimit: u265,
    baseFeePerGas: ?u256,
    getBlobGasPrice: u256,
};

const ExecuteParams = struct {
    block: Block = Block{
        .number = 0,
        .coinbase = ZERO_ADDRESS,
        .timestamp = 0,
        .difficulty = 0,
        .prevRandao = .{0} ** 32,
        .gasLimit = 0,
        .getBlobGasPrice = 0,
    },
    gasPrice: u256 = 0,
    origin: [20]u8 = ZERO_ADDRESS,
    caller: [20]u8 = ZERO_ADDRESS,
    code: []u8,
    data: []u8,
    gasLimit: u256 = 0xffffff,
    value: u256 = 0,
    depth: u16 = 0,
    isStatic: bool = false,
    selfdestruct: []const [20]u8 = .{},
    to: [20]u8 = ZERO_ADDRESS,
    blobVersionedHashes: []const [32]u8 = .{},
};

const Log = struct {
    address: []const u8,
    topics: []const []const u8,
    data: []const u8,
};

const ExecuteResult = struct {
    gas: ?u256,
    executionGasUsed: u256,
    returnValue: []u8,
    logs: ?[]Log,
    selfdestruct: ?[][20]u8,
    createdAddresses: ?[][20]u8,
    gasRefund: ?u256,
    blobGasUsed: ?u256,
};

const ExecutionError = error{
    OUT_OF_GAS,
    CODESTORE_OUT_OF_GAS,
    CODESIZE_EXCEEDS_MAXIMUM,
    STACK_UNDERFLOW,
    STACK_OVERFLOW,
    INVALID_JUMP,
    INVALID_OPCODE,
    OUT_OF_RANGE,
    REVERT,
    STATIC_STATE_CHANGE,
    INTERNAL_ERROR,
    CREATE_COLLISION,
    STOP,
    REFUND_EXHAUSTED,
    VALUE_OVERFLOW,
    INSUFFICIENT_BALANCE,
    INVALID_BYTECODE_RESULT,
    INITCODE_SIZE_VIOLATION,
    INVALID_INPUT_LENGTH,
    INVALID_EOF_FORMAT,
    BLS_12_381_INVALID_INPUT_LENGTH,
    BLS_12_381_POINT_NOT_ON_CURVE,
    BLS_12_381_INPUT_EMPTY,
    BLS_12_381_FP_NOT_IN_FIELD,
    BN254_FP_NOT_IN_FIELD,
    INVALID_COMMITMENT,
    INVALID_INPUTS,
    INVALID_PROOF,
};

pub const EVM = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) !EVM {
        return EVM{
            .allocator = allocator,
        };
    }

    pub fn execute(
        _: ExecuteParams,
    ) ExecutionError!ExecuteResult {
        return ExecuteResult{
            .executionGasUsed = 0,
            .returnValue = .{},
        };
    }
};
