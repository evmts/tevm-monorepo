const std = @import("std");

pub fn main() void {
    // TenThousandHashes constructor bytecode  
    _ = "6080604052348015600e575f5ffd5b50609780601a5f395ff3fe";
    
    std.debug.print("=== EXACT BUG LOCATION ===\n", .{});
    std.debug.print("Problematic constructor ends with:\n", .{});
    std.debug.print("Hex: 609780601a5f395ff3\n", .{});
    std.debug.print("\n", .{});
    
    // Decode the problem section
    std.debug.print("Opcode breakdown:\n", .{});
    std.debug.print("60 97    PUSH1 0x97 (151)  ; size for CODECOPY\n", .{});
    std.debug.print("80       DUP1              ; duplicate size\n", .{});  
    std.debug.print("60 1a    PUSH1 0x1a (26)   ; offset for CODECOPY\n", .{});
    std.debug.print("5f       PUSH0             ; destOffset=0 for CODECOPY\n", .{});
    std.debug.print("39       CODECOPY          ; copy 151 bytes from offset 26 to memory[0]\n", .{});
    std.debug.print("5f       PUSH0             ; offset=0 for RETURN\n", .{});
    std.debug.print("f3       RETURN            ; *** BUG: returns 0 bytes (stack has 0 for size) ***\n", .{});
    
    std.debug.print("\nTHE PROBLEM:\n", .{});
    std.debug.print("- CODECOPY copies runtime code to memory\n", .{});
    std.debug.print("- DUP1 puts the size (151) on stack\n", .{});
    std.debug.print("- But then PUSH0 overwrites it with 0\n", .{});
    std.debug.print("- RETURN uses 0 as size -> returns empty!\n", .{});
    
    std.debug.print("\nFIX: The code should be:\n", .{});
    std.debug.print("60 97    PUSH1 0x97 (151)\n", .{});
    std.debug.print("60 1a    PUSH1 0x1a (26) \n", .{});
    std.debug.print("5f       PUSH0\n", .{});
    std.debug.print("39       CODECOPY\n", .{});
    std.debug.print("60 97    PUSH1 0x97 (151)  ; *** SHOULD PUSH SIZE AGAIN ***\n", .{});
    std.debug.print("5f       PUSH0\n", .{});
    std.debug.print("f3       RETURN            ; return 151 bytes\n", .{});
}