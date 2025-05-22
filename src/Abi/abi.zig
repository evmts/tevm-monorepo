const std = @import("std");

/// A basic representation of an ABI (Application Binary Interface) for Ethereum contracts
pub const Abi = struct {
    /// The raw JSON ABI string
    raw: []const u8,
    
    /// An allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize an ABI from a JSON string
    pub fn init(allocator: std.mem.Allocator, json: []const u8) !Abi {
        const raw = try allocator.dupe(u8, json);
        
        return Abi{
            .raw = raw,
            .allocator = allocator,
        };
    }
    
    /// Free resources associated with this ABI
    pub fn deinit(self: *Abi) void {
        self.allocator.free(self.raw);
    }
    
    /// Get the raw JSON string
    pub fn getRawJson(self: *const Abi) []const u8 {
        return self.raw;
    }
};

/// Parse a JSON ABI string into a structured format
pub fn parseAbi(allocator: std.mem.Allocator, json: []const u8) !Abi {
    return Abi.init(allocator, json);
}

test "Parse ABI" {
    const test_abi = 
        \\[
        \\  {
        \\    "inputs": [],
        \\    "name": "get",
        \\    "outputs": [{"type": "uint256"}],
        \\    "stateMutability": "view",
        \\    "type": "function"
        \\  }
        \\]
    ;
    
    const allocator = std.testing.allocator;
    var abi = try parseAbi(allocator, test_abi);
    defer abi.deinit();
    
    try std.testing.expectEqualStrings(test_abi, abi.getRawJson());
}