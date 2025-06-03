// Main entry point for opcodes tests

// Import test helpers
const test_helpers = @import("test_helpers.zig");

// Import all test files
test {
    // Test helpers are already imported above
    
    // Arithmetic tests
    _ = @import("arithmetic_test.zig");
    
    // Bitwise tests
    _ = @import("bitwise_test.zig");
    
    // Comparison tests
    _ = @import("comparison_test.zig");
    
    // Block tests  
    _ = @import("block_test.zig");
    
    // TODO: Add more test files as they are created
    // _ = @import("crypto_test.zig");
    // _ = @import("environment_test.zig");
    // _ = @import("log_test.zig");
    // _ = @import("memory_test.zig");
    // _ = @import("stack_test.zig");
    // _ = @import("storage_test.zig");
    // _ = @import("system_test.zig");
    // _ = @import("control_test.zig");
}