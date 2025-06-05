/// ExecutionResult holds the result of executing an opcode
const Self = @This();

/// Number of bytes consumed by this opcode (including immediate data)
/// For most opcodes this is 1, but PUSH opcodes consume 1 + n bytes
bytes_consumed: usize = 1,
/// Return data if the execution should halt (empty means continue)
output: []const u8 = "",