// Placeholder ABI module
// The actual ABI implementation is in g/compilers/src/Abi/
const std = @import("std");

pub const AbiError = error{
    InvalidInput,
};

test {
    std.testing.refAllDeclsRecursive(@This());
}