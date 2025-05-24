const std = @import("std");

const EvmModule = @import("evm");
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const Evm = EvmModule.Evm;
const ChainRules = EvmModule.ChainRules;
const JumpTable = EvmModule.JumpTable;
const Interpreter = EvmModule.Interpreter;
const EvmLogger = EvmModule.EvmLogger;
const createLogger = EvmModule.createLogger;
const createScopedLogger = EvmModule.createScopedLogger;
const debugOnly = EvmModule.debugOnly;

const AddressModule = @import("Address");
const Address = AddressModule.Address;

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

// Helper function to convert hex string to Address (similar to eip2200.test.zig)
// This should ideally be in a shared test utilities file
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

// Create test contract with PUSH0 opcode (0x5F)
fn createTestContract(allocator: std.mem.Allocator) !Contract {
    var scoped = createScopedLogger(getLogger(), "createTestContract()");
    defer scoped.deinit();
    
    getLogger().debug("Creating test contract with PUSH0 opcode", .{});
    
    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    getLogger().debug("Contract setup: caller={any}, contract_addr={any}, value={d}, gas={d}", 
        .{caller, contract_addr, value, gas});

    var contract = createContract(caller, contract_addr, value, gas);

    // Simple contract that calls PUSH0 (0x5F) and returns it
    const code = [_]u8{ 0x5F, 0x60, 0x00, 0x53, 0x60, 0x20, 0x60, 0x00, 0xf3 };
    // 0x5F - PUSH0 (push 0 onto stack)
    // 0x6000 - PUSH1 0 (push storage slot 0)
    // 0x53 - SSTORE (store 0 at slot 0)
    // 0x6020 - PUSH1 32 (size of data to return - 32 bytes)
    // 0x6000 - PUSH1 0 (offset in memory to return)
    // 0xf3 - RETURN (return data)

    debugOnly({
        getLogger().debug("Contract bytecode:", .{});
        getLogger().debug("  0x5F - PUSH0 (push 0 onto stack)", .{});
        getLogger().debug("  0x6000 - PUSH1 0 (push storage slot 0)", .{});
        getLogger().debug("  0x53 - SSTORE (store 0 at slot 0)", .{});
        getLogger().debug("  0x6020 - PUSH1 32 (size to return)", .{});
        getLogger().debug("  0x6000 - PUSH1 0 (offset in memory)", .{});
        getLogger().debug("  0xf3 - RETURN (return data)", .{});
        
        var hex_buf: [100]u8 = undefined;
        _ = std.fmt.bufPrint(&hex_buf, "0x{}", .{std.fmt.fmtSliceHexLower(&code)}) catch unreachable;
        getLogger().debug("Raw bytecode: {s}", .{hex_buf});
    });

    const code_hash = [_]u8{0} ** 32; // Dummy hash
    contract.setCallCode(code_hash, &code);
    
    getLogger().debug("Test contract created successfully", .{});
    return contract;
}

// Test EIP-3855: PUSH0 opcode
test "EIP-3855: PUSH0 opcode with EIP-3855 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_push0_enabled");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-3855 test with PUSH0 opcode enabled ░▒▓│", .{});
    
    const allocator = std.testing.allocator;
    getLogger().debug("Using testing allocator", .{});

    // Create EVM with EIP-3855 enabled
    getLogger().debug("Creating EVM with EIP-3855 enabled", .{});
    var evm = try Evm.init(null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3855 = true;
    evm.setChainRules(chainRules);
    getLogger().debug("EVM chain rules configured: IsEIP3855={}", .{chainRules.IsEIP3855});

    // Create state manager
    getLogger().debug("Initializing state manager", .{});
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));
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

    // Create test contract with PUSH0 opcode
    getLogger().debug("Creating test contract with PUSH0 opcode", .{});
    var contract = try createTestContract(allocator);
    defer contract.deinit();
    getLogger().debug("Test contract created", .{});

    // Execute the contract
    getLogger().info("Executing contract with PUSH0 opcode (should succeed with EIP-3855 enabled)", .{});
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
    getLogger().debug("Return data: {any}", .{result.?.return_data});
    getLogger().info("│▓▒░ EIP-3855 PUSH0 enabled test completed successfully ░▒▓│", .{});
}

// Test that PUSH0 opcode fails when EIP-3855 is disabled
test "EIP-3855: PUSH0 opcode with EIP-3855 disabled" {
    var scoped = createScopedLogger(getLogger(), "test_push0_disabled");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-3855 test with PUSH0 opcode disabled ░▒▓│", .{});
    
    const allocator = std.testing.allocator;
    getLogger().debug("Using testing allocator", .{});

    // Create EVM with EIP-3855 disabled
    getLogger().debug("Creating EVM with EIP-3855 disabled", .{});
    var evm = try Evm.init(null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3855 = false;
    evm.setChainRules(chainRules);
    getLogger().debug("EVM chain rules configured: IsEIP3855={}", .{chainRules.IsEIP3855});

    // Create state manager
    getLogger().debug("Initializing state manager", .{});
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));
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

    // Create test contract with PUSH0 opcode
    getLogger().debug("Creating test contract with PUSH0 opcode", .{});
    var contract = try createTestContract(allocator);
    defer contract.deinit();
    getLogger().debug("Test contract created", .{});

    // Execute the contract - should fail with InvalidOpcode error
    getLogger().info("Executing contract with PUSH0 opcode (should fail with EIP-3855 disabled)", .{});
    const result = interpreter.run(&contract, &[_]u8{}, false);

    // Verify that the execution failed with InvalidOpcode error
    std.testing.expectError(EvmModule.InterpreterError.InvalidOpcode, result) catch |err| {
        getLogger().err("Test failed: Expected InterpreterError.InvalidOpcode but got: {}", .{err});
        if (result) |r| {
            getLogger().err("Execution unexpectedly succeeded with result: {any}", .{r});
        }
        return err;
    };
    
    getLogger().info("Contract execution failed as expected with InvalidOpcode error", .{});
    getLogger().info("│▓▒░ EIP-3855 PUSH0 disabled test completed successfully ░▒▓│", .{});
}
