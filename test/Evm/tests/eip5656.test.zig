const std = @import("std");
const builtin = @import("builtin");

// Use module imports for consistency
const EvmModule = @import("evm");
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const Evm = EvmModule.Evm;
const ChainRules = EvmModule.ChainRules;
const JumpTable = EvmModule.JumpTable;
const Interpreter = EvmModule.Interpreter;
const InterpreterError = EvmModule.InterpreterError;
const EvmLogger = EvmModule.EvmLogger;
const createLogger = EvmModule.createLogger;
const createScopedLogger = EvmModule.createScopedLogger;
const debugOnly = EvmModule.debugOnly;

// Import Address module
const AddressModule = @import("address");
const Address = AddressModule.Address;

// Import StateManager module
const StateManagerModule = @import("StateManager");
const StateManager = StateManagerModule.StateManager;

// Module-level logger initialization
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger(@src().file);
    }
    return _logger.?;
}

// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    var scoped = createScopedLogger(getLogger(), "hexToAddress()");
    defer scoped.deinit();
    
    getLogger().debug("Converting hex to address: {s}", .{hex_str});
    
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        getLogger().err("Invalid address format: {s}, must start with 0x and be 42 chars long", .{hex_str});
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    _ = allocator;
    
    debugOnly({
        var hex_buf: [42]u8 = undefined;
        _ = std.fmt.bufPrint(&hex_buf, "0x{}", .{std.fmt.fmtSliceHexLower(&addr)}) catch unreachable;
        getLogger().debug("Converted address: {s}", .{hex_buf});
    });
    
    return addr;
}

// Create test contract with MCOPY opcode (0x5E)
fn createTestContract(allocator: std.mem.Allocator) !Contract {
    var scoped = createScopedLogger(getLogger(), "createTestContract()");
    defer scoped.deinit();
    
    getLogger().debug("Creating test contract with MCOPY opcode", .{});
    
    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    getLogger().debug("Contract setup: caller={any}, contract_addr={any}, value={d}, gas={d}", 
        .{caller, contract_addr, value, gas});

    var contract = createContract(caller, contract_addr, value, gas);

    // Contract that initializes memory, uses MCOPY, and returns a portion
    // 1. Initialize first 64 bytes of memory with MSTORE operations
    // 2. Use MCOPY to copy bytes from offset 0 to offset 64
    // 3. Return 32 bytes from offset 64 (which should contain the copied data)

    getLogger().debug("Creating contract bytecode with MCOPY operation", .{});
    debugOnly({
        getLogger().debug("Contract operation sequence:", .{});
        getLogger().debug("1. Initialize memory[0:32] with 0x1234...", .{});
        getLogger().debug("2. Initialize memory[32:64] with 0xABCD...", .{});
        getLogger().debug("3. MCOPY memory[0:64] to memory[64:128]", .{});
        getLogger().debug("4. Return memory[64:96] (should be copy of memory[0:32])", .{});
    });

    // bytecode:
    // Initialize memory at offset 0 with value 0x1234...
    // 0x7F123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF - PUSH32 0x1234...
    // 0x6000 - PUSH1 0x00 (destination in memory)
    // 0x52 - MSTORE (store value at memory offset 0)
    //
    // Initialize memory at offset 32 with a different value 0xABCD...
    // 0x7FABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF01234567 - PUSH32 0xABCD...
    // 0x6020 - PUSH1 0x20 (destination in memory)
    // 0x52 - MSTORE (store value at memory offset 32)
    //
    // Copy memory from offset 0-63 to offset 64-127
    // 0x6040 - PUSH1 0x40 (64 bytes to copy)
    // 0x6000 - PUSH1 0x00 (source offset)
    // 0x6040 - PUSH1 0x40 (destination offset)
    // 0x5E - MCOPY (0x5E = 94 in decimal)
    //
    // Return the copied data from memory[64:96]
    // 0x6020 - PUSH1 0x20 (length 32 bytes)
    // 0x6040 - PUSH1 0x40 (offset 64)
    // 0xF3 - RETURN

    const code = [_]u8{
        // Initialize memory[0:32]
        0x7F, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE,
        0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE,
        0xF0, 0x60, 0x00, 0x52,

        // Initialize memory[32:64]
        0x7F, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF,
        0x01, 0x23, 0x45, 0x67, 0x89, 0x60, 0x20, 0x52,

        // MCOPY memory[0:64] to memory[64:128]
        0x60, 0x40, 0x60, 0x00, 0x60, 0x40, 0x5E,

        // Return memory[64:96]
        0x60,
        0x20, 0x60, 0x40, 0xF3,
    };

    debugOnly({
        getLogger().debug("Bytecode length: {d} bytes", .{code.len});
        var hex_buf: [256]u8 = undefined;
        _ = std.fmt.bufPrint(&hex_buf, "0x{}", .{std.fmt.fmtSliceHexLower(&code)}) catch unreachable;
        getLogger().debug("Raw bytecode: {s}", .{hex_buf});
    });

    const code_hash = [_]u8{0} ** 32; // Dummy hash
    contract.setCallCode(code_hash, &code);
    
    getLogger().debug("Test contract created successfully", .{});
    return contract;
}

// Test EIP-5656: MCOPY opcode
test "EIP-5656: MCOPY opcode with EIP-5656 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_mcopy_enabled");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-5656 test with MCOPY opcode enabled ░▒▓│", .{});
    
    const allocator = std.testing.allocator;
    getLogger().debug("Using testing allocator", .{});

    // Create EVM with EIP-5656 enabled
    getLogger().debug("Creating EVM with EIP-5656 enabled", .{});
    var evm = try Evm.init(null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP5656 = true;
    evm.setChainRules(chainRules);
    getLogger().debug("EVM chain rules configured: IsEIP5656={}", .{chainRules.IsEIP5656});

    // Create state manager
    getLogger().debug("Initializing state manager", .{});
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(&state_manager));
    getLogger().debug("State manager initialized and set in EVM", .{});

    // Create jump table
    getLogger().debug("Creating jump table with latest fork", .{});
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);
    getLogger().debug("Jump table created", .{});

    // Create interpreter
    getLogger().debug("Creating interpreter", .{});
    var interpreter = try Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();
    getLogger().debug("Interpreter created", .{});

    // Create test contract with MCOPY opcode
    getLogger().debug("Creating test contract with MCOPY opcode", .{});
    var contract = try createTestContract(allocator);
    defer contract.deinit();
    getLogger().debug("Test contract created", .{});

    // Execute the contract
    getLogger().info("Executing contract with MCOPY opcode (should succeed with EIP-5656 enabled)", .{});
    const result = interpreter.run(&contract, &[_]u8{}, false) catch |err| {
        getLogger().err("Contract execution failed unexpectedly: {}", .{err});
        return err;
    };

    // Verify that the execution completed successfully (result is non-null)
    std.testing.expect(result != null) catch |err| {
        getLogger().err("Test failed: Expected successful execution but result was null: {}", .{err});
        return err;
    };
    
    getLogger().info("Contract execution succeeded as expected", .{});

    // The result should be the first 32 bytes that were copied
    // This should match the data we initialized at memory offset 0
    if (result) |data| {
        getLogger().debug("Result data length: {d} bytes", .{data.len});
        
        debugOnly({
            var hex_buf: [100]u8 = undefined;
            _ = std.fmt.bufPrint(&hex_buf, "0x{}", .{std.fmt.fmtSliceHexLower(data)}) catch unreachable;
            getLogger().debug("Return data: {s}", .{hex_buf});
        });
        
        // Expected value is what we stored at memory[0:32]
        const expected = [_]u8{ 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0 };

        debugOnly({
            var hex_buf: [100]u8 = undefined;
            _ = std.fmt.bufPrint(&hex_buf, "0x{}", .{std.fmt.fmtSliceHexLower(&expected)}) catch unreachable;
            getLogger().debug("Expected data: {s}", .{hex_buf});
        });

        std.testing.expectEqualSlices(u8, &expected, data) catch |err| {
            getLogger().err("Data verification failed: return data does not match expected data", .{});
            return err;
        };
        getLogger().debug("Return data matched expected data successfully", .{});
    }
    
    getLogger().info("│▓▒░ EIP-5656 MCOPY enabled test completed successfully ░▒▓│", .{});
}

// Test that MCOPY opcode fails when EIP-5656 is disabled
test "EIP-5656: MCOPY opcode with EIP-5656 disabled" {
    var scoped = createScopedLogger(getLogger(), "test_mcopy_disabled");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-5656 test with MCOPY opcode disabled ░▒▓│", .{});
    
    const allocator = std.testing.allocator;
    getLogger().debug("Using testing allocator", .{});

    // Create EVM with EIP-5656 disabled
    getLogger().debug("Creating EVM with EIP-5656 disabled", .{});
    var evm = try Evm.init(null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP5656 = false;
    evm.setChainRules(chainRules);
    getLogger().debug("EVM chain rules configured: IsEIP5656={}", .{chainRules.IsEIP5656});

    // Create state manager
    getLogger().debug("Initializing state manager", .{});
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(&state_manager));
    getLogger().debug("State manager initialized and set in EVM", .{});

    // Create jump table
    getLogger().debug("Creating jump table with latest fork", .{});
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);
    getLogger().debug("Jump table created", .{});

    // Create interpreter
    getLogger().debug("Creating interpreter", .{});
    var interpreter = try Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();
    getLogger().debug("Interpreter created", .{});

    // Create test contract with MCOPY opcode
    getLogger().debug("Creating test contract with MCOPY opcode", .{});
    var contract = try createTestContract(allocator);
    defer contract.deinit();
    getLogger().debug("Test contract created", .{});

    // Execute the contract - should fail with InvalidOpcode error
    getLogger().info("Executing contract with MCOPY opcode (should fail with EIP-5656 disabled)", .{});
    const result = interpreter.run(&contract, &[_]u8{}, false);

    // Verify that the execution failed with InvalidOpcode error
    std.testing.expectError(InterpreterError.InvalidOpcode, result) catch |err| {
        getLogger().err("Test failed: Expected InterpreterError.InvalidOpcode but got: {}", .{err});
        if (result) |r| {
            getLogger().err("Execution unexpectedly succeeded with result: {any}", .{r});
        }
        return err;
    };
    
    getLogger().info("Contract execution failed as expected with InvalidOpcode error", .{});
    getLogger().info("│▓▒░ EIP-5656 MCOPY disabled test completed successfully ░▒▓│", .{});
}
