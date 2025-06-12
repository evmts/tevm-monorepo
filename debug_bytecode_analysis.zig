const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // This is the TenThousandHashes bytecode that's failing
    const bytecode_hex = "6080604052348015600e575f5ffd5b50609780601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106026575f3560e01c806330627b7c14602a575b5f5ffd5b60306032565b005b5f5b614e20811015605e5760408051602081018390520160408051601f19818403019052526001016034565b5056fea26469706673582212202c247f39d615d7f66942cd6ed505d8ea34fbfcbe16ac875ed08c4a9c229325f364736f6c634300081e0033";
    
    // Decode hex to bytes
    const bytecode = try allocator.alloc(u8, bytecode_hex.len / 2);
    defer allocator.free(bytecode);
    _ = try std.fmt.hexToBytes(bytecode, bytecode_hex);

    std.debug.print("=== BYTECODE ANALYSIS ===\n", .{});
    std.debug.print("Total bytecode length: {} bytes\n", .{bytecode.len});
    std.debug.print("Full bytecode: {any}\n", .{bytecode});
    
    std.debug.print("\n=== OPCODE BREAKDOWN ===\n", .{});
    for (bytecode, 0..) |byte, i| {
        std.debug.print("  [{:3}] 0x{:02x} ", .{i, byte});
        switch (byte) {
            0x60 => std.debug.print("PUSH1"),
            0x80 => std.debug.print("DUP1"),
            0x52 => std.debug.print("MSTORE"),
            0x34 => std.debug.print("CALLVALUE"),
            0x15 => std.debug.print("ISZERO"),
            0x57 => std.debug.print("JUMPI"),
            0x5f => std.debug.print("PUSH0"),
            0xfd => std.debug.print("REVERT"),
            0x5b => std.debug.print("JUMPDEST"),
            0x50 => std.debug.print("POP"),
            0x39 => std.debug.print("CODECOPY"),
            0xf3 => std.debug.print("RETURN"),
            0xfe => std.debug.print("INVALID"),
            else => std.debug.print("DATA({})", .{byte}),
        }
        std.debug.print("\n", .{});
        
        // Stop at the first INVALID opcode (0xfe) which separates constructor from runtime
        if (byte == 0xfe) {
            std.debug.print("\n*** FOUND CONSTRUCTOR/RUNTIME SEPARATOR (INVALID 0xfe) ***\n", .{});
            std.debug.print("Constructor section: bytes 0-{}\n", .{i});
            std.debug.print("Runtime section: bytes {}-{}\n", .{i+1, bytecode.len-1});
            break;
        }
    }

    // Find the CODECOPY instruction and what it's trying to copy
    std.debug.print("\n=== CODECOPY ANALYSIS ===\n", .{});
    for (bytecode, 0..) |byte, i| {
        if (byte == 0x39) { // CODECOPY
            std.debug.print("CODECOPY found at position {}\n", .{i});
            
            // Look at the preceding PUSH instructions to see what it's copying
            if (i >= 4) {
                const size_byte = bytecode[i-1];  // Size is the last PUSH before CODECOPY
                const offset_byte = bytecode[i-3]; // Offset is typically 2 PUSHes before
                std.debug.print("  Likely copying {} bytes from offset {}\n", .{size_byte, offset_byte});
                
                if (offset_byte < bytecode.len and (offset_byte + size_byte) <= bytecode.len) {
                    std.debug.print("  That would copy: {any}\n", .{bytecode[offset_byte..offset_byte + size_byte]});
                }
            }
            break;
        }
    }
}