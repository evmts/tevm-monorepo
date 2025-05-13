const std = @import("std");

pub const ZERO_ADDRESS: [20]u8 = .{0} ** 20;

pub const Block = struct {
    number: u64,
    coinbase: [20]u8,
    timestamp: u64,
    difficulty: u256,
    prevRandao: [32]u8,
    gasLimit: u265,
    baseFeePerGas: ?u256 = null,
    getBlobGasPrice: u256,
};

pub const ExecuteParams = struct {
    block: Block = Block{
        .number = 0,
        .coinbase = ZERO_ADDRESS,
        .timestamp = 0,
        .difficulty = 0,
        .prevRandao = .{0} ** 32,
        .gasLimit = 0,
        .getBlobGasPrice = 0,
        .baseFeePerGas = null,
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
    selfdestruct: []const [20]u8 = &[_][20]u8{},
    to: [20]u8 = ZERO_ADDRESS,
    blobVersionedHashes: []const [32]u8 = &[_][32]u8{},
};

pub const Log = struct {
    address: []const u8,
    topics: []const []const u8,
    data: []const u8,
};

pub const ExecuteResult = struct {
    gas: ?u256 = null,
    executionGasUsed: u256,
    returnValue: []u8,
    logs: ?[]Log = null,
    selfdestruct: ?[][20]u8 = null,
    createdAddresses: ?[][20]u8 = null,
    gasRefund: ?u256 = null,
    blobGasUsed: ?u256 = null,
};

pub const ExecuteError = error{
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

pub const Evm = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) !Evm {
        return Evm{
            .allocator = allocator,
        };
    }

    pub fn execute(
        _: ExecuteParams,
    ) ExecuteError!ExecuteResult {
        return ExecuteResult{
            .executionGasUsed = 0,
            .returnValue = &[_]u8{},
        };
    }
};

test "Evm.execute" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    // we currently aren't using the allocator yet
    _ = try Evm.init(allocator);

    const params = ExecuteParams{
        .code = &[_]u8{},
        .data = &[_]u8{},
    };

    const result = try Evm.execute(params);

    try std.testing.expect(result.executionGasUsed == 0);
    try std.testing.expect(result.returnValue.len == 0);
}
