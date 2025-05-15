// Re-export all signature module functionality
pub const Signature = @import("signature.zig").Signature;
pub const SignatureError = @import("error.zig").SignatureError;
pub const utils = @import("utils.zig");
pub const eip712 = @import("eip712.zig");

// Export common utility functions
pub const normalizeV = utils.normalizeV;
pub const toEip155V = utils.toEip155V;
pub const isLowerS = utils.isLowerS;
pub const publicKeyToAddress = utils.publicKeyToAddress;

// Export EIP-712 types
pub const Eip712Domain = eip712.Eip712Domain;
pub const Eip712Type = eip712.Eip712Type;
pub const Eip712Encoder = eip712.Eip712Encoder;
pub const Eip712Error = eip712.Eip712Error;