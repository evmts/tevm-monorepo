const Address = @import("Address");

/// Magic bytes that identify EIP-7702 delegated code
/// 
/// EIP-7702 introduces a new transaction type that allows EOAs (Externally Owned Accounts)
/// to temporarily delegate their code execution to a contract address. This is marked
/// by prepending the contract address with these magic bytes: 0xE7 0x02
pub const EIP7702_MAGIC_BYTES = [2]u8{ 0xE7, 0x02 };

/// EIP-7702 bytecode representation for delegated EOA code
/// 
/// This struct represents the bytecode format introduced by EIP-7702, which allows
/// EOAs to delegate their code execution to a contract address. The bytecode format
/// consists of the magic bytes (0xE7, 0x02) followed by a 20-byte address.
/// 
/// ## EIP-7702 Overview
/// 
/// EIP-7702 enables EOAs to temporarily act like smart contracts by delegating
/// their code execution to an existing contract. This is useful for:
/// - Account abstraction without deploying new contracts
/// - Batched transactions from EOAs
/// - Sponsored transactions
/// - Enhanced wallet functionality
/// 
/// ## Bytecode Format
/// 
/// The delegated bytecode format is exactly 22 bytes:
/// - Bytes 0-1: Magic bytes (0xE7, 0x02)
/// - Bytes 2-21: Contract address to delegate to
/// 
/// When the EVM encounters this bytecode format, it executes the code at the
/// specified contract address in the context of the EOA.
const Eip7702Bytecode = @This();

/// The contract address that this EOA delegates execution to
address: Address.Address,

/// Creates a new EIP-7702 bytecode representation
/// 
/// ## Parameters
/// - `address`: The contract address to delegate execution to
/// 
/// ## Returns
/// A new EIP7702Bytecode instance
/// 
/// ## Example
/// ```zig
/// const delegate_address = Address.from_hex("0x742d35Cc6634C0532925a3b844Bc9e7595f62d3c");
/// const bytecode = EIP7702Bytecode.new(delegate_address);
/// ```
pub fn new(address: Address.Address) Eip7702Bytecode {
    return .{ .address = address };
}

/// Creates an EIP-7702 bytecode representation from raw bytes
/// 
/// Parses the bytecode format to extract the delegation address.
/// This function expects the input to include the magic bytes.
/// 
/// ## Parameters
/// - `bytes`: Raw bytecode bytes, should be at least 22 bytes (2 magic + 20 address)
/// 
/// ## Returns
/// A new EIP7702Bytecode instance
/// 
/// ## Errors
/// Currently this function doesn't validate the magic bytes or length,
/// but may return malformed results if the input is invalid.
/// 
/// ## Example
/// ```zig
/// const raw_bytecode = &[_]u8{0xE7, 0x02} ++ address_bytes;
/// const bytecode = try EIP7702Bytecode.new_raw(raw_bytecode);
/// ```
pub fn new_raw(bytes: []const u8) !Eip7702Bytecode {
    var address: Address.Address = undefined;
    if (bytes.len > 20) {
        @memcpy(&address, bytes[2..22]);
    }
    return Eip7702Bytecode.new(address);
}

/// Returns the raw bytecode representation
/// 
/// **NOTE**: This function is currently incomplete and returns an empty slice.
/// It should return the full 22-byte bytecode including magic bytes and address.
/// 
/// ## Parameters
/// - `self`: The EIP7702Bytecode instance
/// 
/// ## Returns
/// The raw bytecode bytes (currently returns empty slice - TODO: implement properly)
/// 
/// ## TODO
/// This function should be implemented to return:
/// - Bytes 0-1: EIP7702_MAGIC_BYTES
/// - Bytes 2-21: The delegation address
pub fn raw(self: *const Eip7702Bytecode) []const u8 {
    _ = self;
    return &[_]u8{};
}
