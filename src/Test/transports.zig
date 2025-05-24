const std = @import("std");

pub const EnvUrls = struct {
    /// Parse a comma-separated list of RPC URLs from an environment variable
    /// Returns a string slice array containing each URL
    pub fn fromEnv(allocator: std.mem.Allocator, env_var_name: []const u8) !std.ArrayList([]const u8) {
        var urls = std.ArrayList([]const u8).init(allocator);
        
        // Get the environment variable
        const env_value = std.process.getEnvVarOwned(allocator, env_var_name) catch |err| {
            if (err == error.EnvironmentVariableNotFound) {
                std.debug.print("Warning: {s} is not set\n", .{env_var_name});
                return urls;
            }
            return err;
        };
        defer allocator.free(env_value);
        
        // Handle empty env var
        if (env_value.len == 0) {
            return urls;
        }
        
        // Split by comma
        var iter = std.mem.splitScalar(u8, env_value, ',');
        while (iter.next()) |url| {
            const trimmed_url = std.mem.trim(u8, url, &std.ascii.whitespace);
            if (trimmed_url.len > 0) {
                try urls.append(try allocator.dupe(u8, trimmed_url));
            }
        }
        
        return urls;
    }
    
    /// Free the memory allocated for the URLs
    pub fn deinit(self: *std.ArrayList([]const u8)) void {
        for (self.items) |url| {
            self.allocator.free(url);
        }
        self.clearAndFree();
    }
};

// Parses environment variables for RPC URLs
// Returns a struct with arrays of URLs for different networks
pub fn getTransports(allocator: std.mem.Allocator) !struct {
    mainnet: std.ArrayList([]const u8),
    optimism: std.ArrayList([]const u8),
} {
    const mainnet_urls = try EnvUrls.fromEnv(allocator, "TEVM_RPC_URLS_MAINNET");
    const optimism_urls = try EnvUrls.fromEnv(allocator, "TEVM_RPC_URLS_OPTIMISM");
    
    return .{
        .mainnet = mainnet_urls,
        .optimism = optimism_urls,
    };
}