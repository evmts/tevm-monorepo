// Re-export all signature module functionality
pub const Signature = @import("signature.zig").Signature;
pub const SignatureError = @import("error.zig").SignatureError;
pub const utils = @import("utils.zig");
pub const eip712 = @import("eip712.zig");

// Export common utility functions
pub const normalize_v = utils.normalize_v;
pub const to_eip155_v = utils.to_eip155_v;
pub const is_lower_s = utils.is_lower_s;
pub const public_key_to_address = utils.public_key_to_address;

// Export EIP-712 types
pub const Eip712Domain = eip712.Eip712Domain;
pub const Eip712Type = eip712.Eip712Type;
pub const Eip712Encoder = eip712.Eip712Encoder;
pub const Eip712Error = eip712.Eip712Error;