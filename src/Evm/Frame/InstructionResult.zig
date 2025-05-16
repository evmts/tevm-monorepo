/// Result of instruction execution
pub const InstructionResult = enum {
    Success,
    Revert,
    OutOfGas,
    InvalidOpcode,
    StackOverflow,
    StackUnderflow,
    InvalidJump,
    CallTooDeep,
    OutOfFunds,
};