const std = @import("std");
const testing = std.testing;

// Use package-based imports for consistent module resolution
// NOTE: If running directly with `zig test`, you might need to use relative path @import("../evm.zig")
const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const ExecutionError = EvmModule.Frame.ExecutionError;
const Evm = EvmModule.Evm;
const Frame = EvmModule.Frame;
const JumpTable = EvmModule.JumpTable;
const calls = EvmModule.opcodes.calls;
const Contract = EvmModule.Contract;
const Memory = EvmModule.Memory.Memory;
const Stack = EvmModule.Stack.Stack;
// Import Address from the Address module for consistency
const Address = @import("Address").Address;
const EvmLogger = EvmModule.EvmLogger;
const createLogger = EvmModule.createLogger;
const createScopedLogger = EvmModule.createScopedLogger;
const debugOnly = EvmModule.debugOnly;

// Module-level logger initialization
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger(@src().file);
    }
    return _logger.?;
}

// Use u256 type alias for compatibility with tests
// In the real code this would be a proper 256-bit integer implementation
// but for testing purposes u64 is sufficient
const BigInt = u64;

// Test setup helper function
fn setupInterpreter(enable_eip3541: bool) !Interpreter {
    var scoped = createScopedLogger(getLogger(), "setupInterpreter()");
    defer scoped.deinit();
    
    getLogger().debug("Setting up interpreter with EIP-3541 {s}", .{if (enable_eip3541) "enabled" else "disabled"});
    
    // Create a custom chain rules configuration
    var custom_rules = EvmModule.ChainRules{};
    custom_rules.IsEIP3541 = enable_eip3541; // Control EIP-3541 (Reject new contracts starting with 0xEF)
    getLogger().debug("Chain rules configured: IsEIP3541={}", .{custom_rules.IsEIP3541});

    // Create an EVM instance with custom chain rules
    getLogger().debug("Initializing EVM with custom chain rules", .{});
    var custom_evm = try Evm.init(custom_rules);

    // Create jump table
    getLogger().debug("Creating jump table", .{});
    const jump_table = try JumpTable.newJumpTable(std.testing.allocator, "latest");
    
    // Create an interpreter with our custom EVM
    getLogger().debug("Creating interpreter", .{});
    const test_interpreter = try Interpreter.create(std.testing.allocator, &custom_evm, jump_table);
    
    getLogger().debug("Interpreter setup complete", .{});
    return test_interpreter;
}

// Test that CREATE rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE rejects contracts starting with 0xEF with EIP-3541 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_CREATE_rejects_0xEF_enabled");
    defer scoped.deinit();
    
    getLogger().info("Starting test: CREATE rejects contracts starting with 0xEF with EIP-3541 enabled", .{});
    
    // Set up the interpreter with EIP-3541 enabled
    getLogger().debug("Setting up interpreter with EIP-3541 enabled", .{});
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    getLogger().debug("Creating test contract", .{});
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    getLogger().debug("Initializing contract with minimal required fields", .{});
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };
    getLogger().debug("Contract initialized: gas={d}, address={}, caller={}", 
                     .{contract.gas, contract.address, contract.caller});

    // Create a frame for execution
    getLogger().debug("Creating execution frame", .{});
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE: value, offset, size
    getLogger().debug("Pushing CREATE parameters to stack", .{});
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    getLogger().debug("Stack prepared with CREATE parameters: value=0, offset=0, size=10", .{});

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    getLogger().debug("Allocating memory and setting first byte to 0xEF", .{});
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    debugOnly(struct {
        fn callback() void {
            getLogger().debug("Memory initialized: size={d}, first byte=0x{x}", .{mem.len, mem[0]});
        }
    }.callback);

    // Execute CREATE operation
    getLogger().debug("Executing CREATE operation", .{});
    const result = try calls.opCreate(0, &test_interpreter, &frame);

    // Verify CREATE executed (returned an empty string) but pushed 0 (failure) to the stack
    getLogger().debug("CREATE returned: '{s}'", .{result});
    try testing.expectEqualStrings("", result);
    
    const stack_value = try frame.stack.peek(0);
    getLogger().debug("Stack top after CREATE: {d}", .{stack_value});
    try testing.expectEqual(@as(BigInt, 0), stack_value); // Should return 0 (failure)
    
    getLogger().info("Test PASSED: CREATE rejected contract starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_CREATE_accepts_non_0xEF_enabled");
    defer scoped.deinit();
    
    getLogger().info("Starting test: CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled", .{});
    
    // Set up the interpreter with EIP-3541 enabled
    getLogger().debug("Setting up interpreter with EIP-3541 enabled", .{});
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    getLogger().debug("Creating test contract", .{});
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    getLogger().debug("Initializing contract with minimal required fields", .{});
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };
    getLogger().debug("Contract initialized: gas={d}, address={}, caller={}", 
                     .{contract.gas, contract.address, contract.caller});

    // Create a frame for execution
    getLogger().debug("Creating execution frame", .{});
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE: value, offset, size
    getLogger().debug("Pushing CREATE parameters to stack", .{});
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    getLogger().debug("Stack prepared with CREATE parameters: value=0, offset=0, size=10", .{});

    // We need to make sure memory is allocated and contains something other than 0xEF
    getLogger().debug("Allocating memory and setting first byte to 0x60 (not 0xEF)", .{});
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0x60; // First byte is not 0xEF
    
    debugOnly(struct {
        fn callback() void {
            getLogger().debug("Memory initialized: size={d}, first byte=0x{x}", .{mem.len, mem[0]});
        }
    }.callback);

    // Execute CREATE operation
    getLogger().debug("Executing CREATE operation", .{});
    const result = try calls.opCreate(0, &test_interpreter, &frame);

    // Verify CREATE executed successfully
    getLogger().debug("CREATE returned: '{s}'", .{result});
    try testing.expectEqualStrings("", result);
    
    const stack_value = try frame.stack.peek(0);
    getLogger().debug("Stack top after CREATE: 0x{x}", .{stack_value});
    try testing.expectEqual(@as(BigInt, 0x1234), stack_value); // Using our stub's fake address
    
    getLogger().info("Test PASSED: CREATE accepted contract not starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE2 rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE2 rejects contracts starting with 0xEF with EIP-3541 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_CREATE2_rejects_0xEF_enabled");
    defer scoped.deinit();
    
    getLogger().info("Starting test: CREATE2 rejects contracts starting with 0xEF with EIP-3541 enabled", .{});
    
    // Set up the interpreter with EIP-3541 enabled
    getLogger().debug("Setting up interpreter with EIP-3541 enabled", .{});
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    getLogger().debug("Creating test contract", .{});
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    getLogger().debug("Initializing contract with minimal required fields", .{});
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };
    getLogger().debug("Contract initialized: gas={d}, address={}, caller={}", 
                     .{contract.gas, contract.address, contract.caller});

    // Create a frame for execution
    getLogger().debug("Creating execution frame", .{});
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2: value, offset, size, salt
    getLogger().debug("Pushing CREATE2 parameters to stack", .{});
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    try frame.stack.push(0); // salt: 0
    getLogger().debug("Stack prepared with CREATE2 parameters: value=0, offset=0, size=10, salt=0", .{});

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    getLogger().debug("Allocating memory and setting first byte to 0xEF", .{});
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    debugOnly(struct {
        fn callback() void {
            getLogger().debug("Memory initialized: size={d}, first byte=0x{x}", .{mem.len, mem[0]});
        }
    }.callback);

    // Execute CREATE2 operation
    getLogger().debug("Executing CREATE2 operation", .{});
    const result = try calls.opCreate2(0, &test_interpreter, &frame);

    // Verify CREATE2 executed (returned an empty string) but pushed 0 (failure) to the stack
    getLogger().debug("CREATE2 returned: '{s}'", .{result});
    try testing.expectEqualStrings("", result);
    
    const stack_value = try frame.stack.peek(0);
    getLogger().debug("Stack top after CREATE2: {d}", .{stack_value});
    try testing.expectEqual(@as(BigInt, 0), stack_value); // Should return 0 (failure)
    
    getLogger().info("Test PASSED: CREATE2 rejected contract starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_CREATE2_accepts_non_0xEF_enabled");
    defer scoped.deinit();
    
    getLogger().info("Starting test: CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled", .{});
    
    // Set up the interpreter with EIP-3541 enabled
    getLogger().debug("Setting up interpreter with EIP-3541 enabled", .{});
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    getLogger().debug("Creating test contract", .{});
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    getLogger().debug("Initializing contract with minimal required fields", .{});
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };
    getLogger().debug("Contract initialized: gas={d}, address={}, caller={}", 
                     .{contract.gas, contract.address, contract.caller});

    // Create a frame for execution
    getLogger().debug("Creating execution frame", .{});
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2: value, offset, size, salt
    getLogger().debug("Pushing CREATE2 parameters to stack", .{});
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    try frame.stack.push(0); // salt: 0
    getLogger().debug("Stack prepared with CREATE2 parameters: value=0, offset=0, size=10, salt=0", .{});

    // We need to make sure memory is allocated and contains something other than 0xEF
    getLogger().debug("Allocating memory and setting first byte to 0x60 (not 0xEF)", .{});
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0x60; // First byte is not 0xEF
    
    debugOnly(struct {
        fn callback() void {
            getLogger().debug("Memory initialized: size={d}, first byte=0x{x}", .{mem.len, mem[0]});
        }
    }.callback);

    // Execute CREATE2 operation
    getLogger().debug("Executing CREATE2 operation", .{});
    const result = try calls.opCreate2(0, &test_interpreter, &frame);

    // Verify CREATE2 executed successfully
    getLogger().debug("CREATE2 returned: '{s}'", .{result});
    try testing.expectEqualStrings("", result);
    
    const stack_value = try frame.stack.peek(0);
    getLogger().debug("Stack top after CREATE2: 0x{x}", .{stack_value});
    try testing.expectEqual(@as(BigInt, 0x5678), stack_value); // Using our stub's fake address
    
    getLogger().info("Test PASSED: CREATE2 accepted contract not starting with 0xEF with EIP-3541 enabled", .{});
}

// Test that CREATE accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE accepts contracts starting with 0xEF with EIP-3541 disabled" {
    var scoped = createScopedLogger(getLogger(), "test_CREATE_accepts_0xEF_disabled");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting test: CREATE accepts contracts starting with 0xEF with EIP-3541 disabled ░▒▓│", .{});
    
    // Set up the interpreter with EIP-3541 disabled
    getLogger().debug("Setting up interpreter with EIP-3541 disabled", .{});
    const test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    getLogger().debug("Creating test contract", .{});
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    getLogger().debug("Initializing contract with minimal required fields", .{});
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };
    getLogger().debug("Contract initialized: gas={d}, address={}, caller={}", 
                     .{contract.gas, contract.address, contract.caller});

    // Create a frame for execution
    getLogger().debug("Creating execution frame", .{});
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE: value, offset, size
    getLogger().debug("Pushing CREATE parameters to stack", .{});
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    getLogger().debug("Stack prepared with CREATE parameters: value=0, offset=0, size=10", .{});

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    getLogger().debug("Allocating memory and setting first byte to 0xEF", .{});
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    debugOnly(struct {
        fn callback() void {
            getLogger().debug("Memory initialized: size={d}, first byte=0x{x}", .{mem.len, mem[0]});
        }
    }.callback);

    // Execute CREATE operation
    getLogger().info("Executing CREATE operation (should succeed with EIP-3541 disabled)", .{});
    const result = try calls.opCreate(0, &test_interpreter, &frame);

    // Verify CREATE executed successfully even with 0xEF as first byte
    getLogger().debug("CREATE returned: '{s}'", .{result});
    try testing.expectEqualStrings("", result);
    
    const stack_value = try frame.stack.peek(0);
    getLogger().debug("Stack top after CREATE: 0x{x}", .{stack_value});
    try testing.expectEqual(@as(BigInt, 0x1234), stack_value); // Using our stub's fake address
    
    getLogger().info("Test PASSED: CREATE accepted contract starting with 0xEF with EIP-3541 disabled", .{});
    getLogger().info("│▓▒░ Test completed successfully ░▒▓│", .{});
}

// Test that CREATE2 accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE2 accepts contracts starting with 0xEF with EIP-3541 disabled" {
    var scoped = createScopedLogger(getLogger(), "test_CREATE2_accepts_0xEF_disabled");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting test: CREATE2 accepts contracts starting with 0xEF with EIP-3541 disabled ░▒▓│", .{});
    
    // Set up the interpreter with EIP-3541 disabled
    getLogger().debug("Setting up interpreter with EIP-3541 disabled", .{});
    const test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    getLogger().debug("Creating test contract", .{});
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    getLogger().debug("Initializing contract with minimal required fields", .{});
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };
    getLogger().debug("Contract initialized: gas={d}, address={}, caller={}", 
                     .{contract.gas, contract.address, contract.caller});

    // Create a frame for execution
    getLogger().debug("Creating execution frame", .{});
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2: value, offset, size, salt
    getLogger().debug("Pushing CREATE2 parameters to stack", .{});
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    try frame.stack.push(0); // salt: 0
    getLogger().debug("Stack prepared with CREATE2 parameters: value=0, offset=0, size=10, salt=0", .{});

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    getLogger().debug("Allocating memory and setting first byte to 0xEF", .{});
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    debugOnly(struct {
        fn callback() void {
            getLogger().debug("Memory initialized: size={d}, first byte=0x{x}", .{mem.len, mem[0]});
        }
    }.callback);

    // Execute CREATE2 operation
    getLogger().info("Executing CREATE2 operation (should succeed with EIP-3541 disabled)", .{});
    const result = try calls.opCreate2(0, &test_interpreter, &frame);

    // Verify CREATE2 executed successfully even with 0xEF as first byte
    getLogger().debug("CREATE2 returned: '{s}'", .{result});
    try testing.expectEqualStrings("", result);
    
    const stack_value = try frame.stack.peek(0);
    getLogger().debug("Stack top after CREATE2: 0x{x}", .{stack_value});
    try testing.expectEqual(@as(BigInt, 0x5678), stack_value); // Using our stub's fake address
    
    getLogger().info("Test PASSED: CREATE2 accepted contract starting with 0xEF with EIP-3541 disabled", .{});
    getLogger().info("│▓▒░ Test completed successfully ░▒▓│", .{});
}
