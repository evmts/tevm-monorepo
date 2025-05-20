const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const ExecutionError = EvmModule.InterpreterError;
const Evm = EvmModule.Evm;
const JumpTable = EvmModule.JumpTable;
const B256 = EvmModule.B256;
const EvmLoggerModule = EvmModule.EvmLogger;
const EvmLogger = EvmLoggerModule.EvmLogger;
const createLogger = EvmLoggerModule.createLogger;
const createScopedLogger = EvmLoggerModule.createScopedLogger;
const debugOnly = EvmLoggerModule.debugOnly;

// Module-level logger initialization
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger(@src().file);
    }
    return _logger.?;
}

const StateManagerModule = @import("StateManager");
const StateManager = StateManagerModule.StateManager;

const AddressModule = @import("Address");
const Address = AddressModule.Address;

// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    var scoped = createScopedLogger(getLogger(), "hexToAddress()");
    defer scoped.deinit();
    
    getLogger().debug("Converting hex to address: {s}", .{hex_str});
    
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        getLogger().err("Invalid address format: {s}, must start with 0x and be 42 chars long", .{hex_str});
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    _ = try std.fmt.hexToBytes(&addr, hex_str[2..]);
    
    debugOnly(getLogger(), {
        var hex_buf: [42]u8 = undefined;
        _ = std.fmt.bufPrint(&hex_buf, "0x{}", .{std.fmt.fmtSliceHexLower(&addr)}) catch unreachable;
        getLogger().debug("Converted address: {s}", .{hex_buf});
    });
    
    return addr;
}

// Test constants
const TEST_GAS = 10000000;

test "EIP-2929: SLOAD warm and cold access" {
    var scoped = createScopedLogger(getLogger(), "test_sload_warm_cold_access");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-2929 test: SLOAD warm and cold access ░▒▓│", .{});
    
    const allocator = testing.allocator;
    getLogger().debug("Creating contract for testing warm/cold access", .{});
    var contract = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    defer contract.deinit();

    // Initial state: everything is cold
    getLogger().debug("Checking initial state (should be cold)", .{});
    try testing.expect(contract.isStorageSlotCold(123));
    getLogger().debug("Verified storage slot 123 is initially cold", .{});

    // Mark a slot as warm
    getLogger().debug("Marking storage slot 123 as warm", .{});
    const was_cold = contract.markStorageSlotWarm(123);
    try testing.expect(was_cold);
    getLogger().debug("Verified slot was cold before marking: {}", .{was_cold});

    // Now the slot should be warm
    getLogger().debug("Checking if slot is now warm", .{});
    try testing.expect(!contract.isStorageSlotCold(123));
    getLogger().debug("Verified storage slot 123 is now warm", .{});

    // Marking again should return false (was not cold)
    getLogger().debug("Marking storage slot 123 as warm again", .{});
    const was_still_cold = contract.markStorageSlotWarm(123);
    try testing.expect(!was_still_cold);
    getLogger().debug("Verified slot was not cold before marking again: {}", .{!was_still_cold});

    // Other slots should still be cold
    getLogger().debug("Checking if other slots remain cold", .{});
    try testing.expect(contract.isStorageSlotCold(456));
    getLogger().debug("Verified storage slot 456 is still cold", .{});
    
    getLogger().info("│▓▒░ EIP-2929 SLOAD warm/cold test completed successfully ░▒▓│", .{});
}

test "EIP-2929: Account warm and cold access" {
    var scoped = createScopedLogger(getLogger(), "test_account_warm_cold_access");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-2929 test: Account warm and cold access ░▒▓│", .{});
    
    const allocator = testing.allocator;
    getLogger().debug("Creating contract for testing account warm/cold access", .{});
    var contract = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    defer contract.deinit();

    // Initial state: account is cold
    getLogger().debug("Checking initial account state (should be cold)", .{});
    try testing.expect(contract.isAccountCold());
    getLogger().debug("Verified account is initially cold", .{});

    // Mark account as warm
    getLogger().debug("Marking account as warm", .{});
    const was_cold = contract.markAccountWarm();
    try testing.expect(was_cold);
    getLogger().debug("Verified account was cold before marking: {}", .{was_cold});

    // Now the account should be warm
    getLogger().debug("Checking if account is now warm", .{});
    try testing.expect(!contract.isAccountCold());
    getLogger().debug("Verified account is now warm", .{});

    // Marking again should return false (was not cold)
    getLogger().debug("Marking account as warm again", .{});
    const was_still_cold = contract.markAccountWarm();
    try testing.expect(!was_still_cold);
    getLogger().debug("Verified account was not cold before marking again: {}", .{!was_still_cold});
    
    getLogger().info("│▓▒░ EIP-2929 Account warm/cold test completed successfully ░▒▓│", .{});
}

// Mock StateManager for testing
const MockStateManager = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) MockStateManager {
        return MockStateManager{
            .allocator = allocator,
        };
    }

    pub fn getContractStorage(self: *MockStateManager, address: Address, key: B256) ![]u8 {
        _ = address;
        _ = key;
        // Don't discard self since we use it below

        // Return empty data
        const result = try self.allocator.alloc(u8, 32);
        @memset(result, 0);
        return result;
    }

    pub fn putContractStorage(self: *MockStateManager, address: Address, key: B256, value: *const [32]u8) !void {
        _ = address;
        _ = key;
        _ = value;
        _ = self;
    }

    pub fn getAccount(self: *MockStateManager, address: Address) !?struct {
        balance: struct { value: u256 },
        codeHash: struct { bytes: [32]u8 },
    } {
        _ = address;
        _ = self;

        return null;
    }

    pub fn getContractCode(self: *MockStateManager, address: Address) ![]u8 {
        _ = address;
        _ = self;

        // Return empty code
        return &[_]u8{};
    }
};

test "EIP-2929: SLOAD Gas Cost Differences" {
    var scoped = createScopedLogger(getLogger(), "test_sload_gas_cost_differences");
    defer scoped.deinit();
    
    getLogger().info("│▓▒░ Starting EIP-2929 test: SLOAD Gas Cost Differences ░▒▓│", .{});
    
    const allocator = testing.allocator;
    getLogger().debug("Initializing mock state manager", .{});
    var state_manager = MockStateManager.init(allocator);

    getLogger().debug("Initializing EVM", .{});
    var evm_instance = try Evm.init(allocator, null);
    var chain_rules = evm_instance.chainRules;
    chain_rules.IsEIP2929 = true; // Ensure EIP-2929 is enabled
    evm_instance.setChainRules(chain_rules);
    getLogger().debug("EVM chain rules configured: IsEIP2929={}", .{chain_rules.IsEIP2929});
    
    evm_instance.setStateManager(@ptrCast(&state_manager));
    getLogger().debug("State manager set in EVM", .{});

    // Create jump table for the interpreter
    getLogger().debug("Creating jump table", .{});
    var jt = try JumpTable.newJumpTable(allocator, "latest");
    defer jt.deinit(allocator);
    getLogger().debug("Jump table created", .{});

    // Create interpreter with properly configured jump table 
    getLogger().debug("Creating interpreter", .{});
    var interpreter = try Interpreter.create(allocator, &evm_instance, jt);
    defer interpreter.deinit();
    getLogger().debug("Interpreter created", .{});

    // Create contract with bytecode: PUSH1 0, SLOAD, PUSH1 0, SLOAD, STOP
    getLogger().debug("Creating contract bytecode for SLOAD test", .{});
    const bytecode = &[_]u8{ 0x60, 0x00, 0x54, 0x60, 0x00, 0x54, 0x00 };
    
    debugOnly(getLogger(), {
        getLogger().debug("Bytecode explanation:", .{});
        getLogger().debug("  0x60 0x00 - PUSH1 0x00 (push storage slot 0)", .{});
        getLogger().debug("  0x54      - SLOAD (load from storage slot 0, cold access)", .{});
        getLogger().debug("  0x60 0x00 - PUSH1 0x00 (push storage slot 0 again)", .{});
        getLogger().debug("  0x54      - SLOAD (load from storage slot 0, warm access)", .{});
        getLogger().debug("  0x00      - STOP", .{});
    });
    
    getLogger().debug("Creating contract instance", .{});
    var contract_instance = createContract(
        try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), 
        try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 
        0, TEST_GAS
    );
    contract_instance.code = bytecode;
    getLogger().debug("Contract created and code set", .{});

    getLogger().debug("Running contract execution", .{});
    _ = try interpreter.run(&contract_instance, &[_]u8{}, false);
    getLogger().debug("Contract execution completed", .{});

    const gas_used = TEST_GAS - contract_instance.gas;
    getLogger().debug("Gas used: {d}", .{gas_used});
    
    try testing.expect(gas_used < 2100 * 2);
    try testing.expect(gas_used > 2100);
    getLogger().debug("Gas usage expectations met: {d} < {d} < {d}", .{2100, gas_used, 2100 * 2});
    
    getLogger().info("│▓▒░ EIP-2929 SLOAD Gas Cost test completed successfully ░▒▓│", .{});
}

test "EIP-2929: EXTCODEHASH Gas Cost Differences" {
    const allocator = testing.allocator;
    var state_manager = MockStateManager.init(allocator);

    var evm_instance = try Evm.init(allocator, null);
    evm_instance.state_manager = @ptrCast(@alignCast(&state_manager));

    // Cast the evm_instance to the expected type for Interpreter.init
    var interpreter = try Interpreter.create(allocator, &evm_instance, undefined);

    var bytecode = [_]u8{ 0x73, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0x3F, 0x73, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0x3F, 0x00 };

    var contract_instance = createContract(try hexToAddress(allocator, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), try hexToAddress(allocator, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), 0, TEST_GAS);
    contract_instance.code = &bytecode;

    _ = try interpreter.run(&contract_instance, &[_]u8{}, false);

    const gas_used = TEST_GAS - contract_instance.gas;
    try testing.expect(gas_used < 2600 * 2);
    try testing.expect(gas_used > 2600);
}
