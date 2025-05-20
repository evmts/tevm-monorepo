const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
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
const StateOptions = StateManagerModule.StateOptions;

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
    
    getLogger().debug("Converting hex string to address: {s}", .{hex_str});
    
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        getLogger().err("Invalid address format: {s}", .{hex_str});
        return error.InvalidAddressFormat;
    }
    
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    
    debugOnly(struct {
        fn callback() void {
            var addr_str_buf: [128]u8 = undefined;
            var addr_str_len = std.fmt.bufPrint(&addr_str_buf, "{}", .{addr}) catch return;
            getLogger().debug("Address conversion result: {s}", .{addr_str_buf[0..addr_str_len]});
        }
    }.callback);
    
    return addr;
}

// Create test contract with BASEFEE opcode (0x48)
fn createTestContract(allocator: std.mem.Allocator) !Contract {
    var scoped = createScopedLogger(getLogger(), "createTestContract()");
    defer scoped.deinit();
    
    getLogger().debug("Creating test contract with BASEFEE opcode", .{});
    
    const caller = try hexToAddress(allocator, "0x1111111111111111111111111111111111111111");
    const contract_addr = try hexToAddress(allocator, "0x2222222222222222222222222222222222222222");
    const value = 0;
    const gas = 100000;

    getLogger().debug("Contract parameters: caller={}, contract_addr={}, value={d}, gas={d}", 
                     .{caller, contract_addr, value, gas});

    var contract = createContract(caller, contract_addr, value, gas);

    // Simple contract that calls BASEFEE (0x48) and returns it
    const code = [_]u8{ 0x48, 0x60, 0x00, 0x53, 0x60, 0x20, 0x60, 0x00, 0xf3 };
    // 0x48 - BASEFEE (push block's base fee to stack)
    // 0x6000 - PUSH1 0 (push storage slot 0)
    // 0x53 - SSTORE (store base fee at slot 0)
    // 0x6020 - PUSH1 32 (size of data to return - 32 bytes)
    // 0x6000 - PUSH1 0 (offset in memory to return)
    // 0xf3 - RETURN (return data)

    getLogger().debug("Contract bytecode: BASEFEE + SSTORE + RETURN", .{});
    debugOnly(struct {
        fn callback() void {
            // Log bytecode in detail if debug logging is enabled
            var bytecode_buf: [256]u8 = undefined;
            var bytecode_fbs = std.io.fixedBufferStream(&bytecode_buf);
            const bytecode_writer = bytecode_fbs.writer();
            
            for (code) |byte| {
                std.fmt.format(bytecode_writer, "{x:0>2} ", .{byte}) catch return;
            }
            
            getLogger().debug("Bytecode: {s}", .{bytecode_buf[0..bytecode_fbs.pos]});
        }
    }.callback);

    const code_hash = [_]u8{0} ** 32; // Dummy hash
    contract.setCallCode(code_hash, &code);
    getLogger().debug("Contract code set successfully", .{});

    return contract;
}

// Test EIP-3198: BASEFEE opcode
test "EIP-3198: BASEFEE opcode with EIP-3198 enabled" {
    var scoped = createScopedLogger(getLogger(), "test_basefee_enabled");
    defer scoped.deinit();
    
    getLogger().info("Starting EIP-3198 test with BASEFEE opcode enabled", .{});
    const allocator = std.testing.allocator;

    // Create EVM with EIP-3198 enabled
    getLogger().debug("Initializing EVM with EIP-3198 enabled", .{});
    var evm = try Evm.init(allocator, null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3198 = true;
    evm.setChainRules(chainRules);
    getLogger().debug("EVM chain rules configured: IsEIP3198={}", .{chainRules.IsEIP3198});

    // Set up state manager
    getLogger().debug("Initializing state manager", .{});
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));

    // Set up jump table
    getLogger().debug("Creating jump table", .{});
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);

    // Create interpreter
    getLogger().debug("Creating interpreter", .{});
    var interpreter = try Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();

    // Create test contract
    getLogger().debug("Creating test contract with BASEFEE opcode", .{});
    var contract = try createTestContract(allocator);
    defer contract.deinit();

    // Execute the contract
    getLogger().debug("Executing contract with BASEFEE opcode", .{});
    const result = try interpreter.run(&contract, &[_]u8{}, false);

    // Verify result
    getLogger().debug("Verifying test result", .{});
    std.testing.expect(result != null) catch |err| {
        getLogger().err("Test failed: {}", .{err});
        std.debug.print("Test failed: {}\n", .{err});
        return err;
    };

    // Log result details if debug is enabled
    debugOnly(struct {
        fn callback() void {
            if (result) |data| {
                getLogger().debug("BASEFEE opcode returned data of length: {d}", .{data.len});
                
                if (data.len > 0) {
                    var hex_buf: [256]u8 = undefined;
                    var hex_fbs = std.io.fixedBufferStream(&hex_buf);
                    const hex_writer = hex_fbs.writer();
                    
                    // Only print first few bytes if large
                    const display_len = @min(data.len, 16);
                    for (data[0..display_len]) |byte| {
                        std.fmt.format(hex_writer, "{x:0>2} ", .{byte}) catch return;
                    }
                    
                    if (data.len > display_len) {
                        std.fmt.format(hex_writer, "... ({d} more bytes)", .{data.len - display_len}) catch return;
                    }
                    
                    getLogger().debug("Result data: {s}", .{hex_buf[0..hex_fbs.pos]});
                }
            }
        }
    }.callback);
    
    getLogger().info("EIP-3198 test with BASEFEE opcode enabled - PASSED", .{});
}

// Test that BASEFEE opcode fails when EIP-3198 is disabled
test "EIP-3198: BASEFEE opcode with EIP-3198 disabled" {
    var scoped = createScopedLogger(getLogger(), "test_basefee_disabled");
    defer scoped.deinit();
    
    getLogger().info("Starting EIP-3198 test with BASEFEE opcode disabled", .{});
    const allocator = std.testing.allocator;

    // Create EVM with EIP-3198 disabled
    getLogger().debug("Initializing EVM with EIP-3198 disabled", .{});
    var evm = try Evm.init(allocator, null);
    var chainRules = evm.chainRules;
    chainRules.IsEIP3198 = false;
    evm.setChainRules(chainRules);
    getLogger().debug("EVM chain rules configured: IsEIP3198={}", .{chainRules.IsEIP3198});

    // Set up state manager
    getLogger().debug("Initializing state manager", .{});
    var state_manager = try StateManager.init(allocator, .{});
    defer state_manager.deinit();
    evm.setStateManager(@ptrCast(@alignCast(&state_manager)));

    // Set up jump table
    getLogger().debug("Creating jump table", .{});
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);

    // Create interpreter
    getLogger().debug("Creating interpreter", .{});
    var interpreter = try Interpreter.create(allocator, &evm, jt);
    defer interpreter.deinit();

    // Create test contract
    getLogger().debug("Creating test contract with BASEFEE opcode", .{});
    var contract = try createTestContract(allocator);
    defer contract.deinit();

    // Execute the contract - should fail with InvalidOpcode
    getLogger().debug("Executing contract with BASEFEE opcode (expecting failure)", .{});
    const result = interpreter.run(&contract, &[_]u8{}, false);

    // Verify result - should be an InvalidOpcode error
    getLogger().debug("Verifying test failure with InvalidOpcode error", .{});
    testing.expectError(EvmModule.InterpreterError.InvalidOpcode, result) catch |err| {
        getLogger().err("Test failed: expected InvalidOpcode error but got: {}", .{err});
        std.debug.print("Test failed: {}\n", .{err});
        return err;
    };
    
    getLogger().info("EIP-3198 test with BASEFEE opcode disabled - PASSED", .{});
}
