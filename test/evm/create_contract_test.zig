const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Address = @import("Address");

test "CREATE contract deployment stores runtime bytecode at contract address" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize memory database and VM
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch unreachable;
    defer vm.deinit();

    // Creator address with sufficient balance
    const creator_address = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    // Simple constructor that returns a single STOP opcode (0x00) as runtime code
    // Store value in 32-byte word and return the specific byte
    const constructor_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 (STOP opcode to store)
        0x60, 0x00, // PUSH1 0x00 (memory offset for 32-byte word)
        0x52,       // MSTORE (store 32-byte word to memory)
        0x60, 0x01, // PUSH1 0x01 (size to return - 1 byte)
        0x60, 0x1F, // PUSH1 0x1F (offset 31 - last byte of 32-byte word)
        0xF3,       // RETURN
    };

    std.log.info("Testing CREATE with constructor bytecode length: {}", .{constructor_bytecode.len});

    // Deploy the contract using CREATE
    const create_result = vm.create_contract(
        creator_address, // creator
        0, // value
        &constructor_bytecode, // init code
        1000000, // gas limit
    ) catch |err| {
        std.log.err("CREATE failed with error: {}", .{err});
        return err;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.log.info("CREATE result: success={}, address={any}", .{ create_result.success, create_result.address });

    // The CREATE operation should succeed
    try testing.expect(create_result.success);

    // Now check if the deployed code exists at the contract address
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("Deployed code length: {} bytes", .{deployed_code.len});
    
    if (deployed_code.len > 0) {
        std.log.info("Deployed code: {any}", .{deployed_code});
    } else {
        std.log.err("ERROR: No code found at contract address after successful CREATE!", .{});
    }

    // The deployed code should be 1 byte containing the STOP opcode
    try testing.expect(deployed_code.len == 1);
    try testing.expect(deployed_code[0] == 0x00); // Should be STOP opcode
}

test "CREATE with STOP runtime bytecode" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize memory database and VM
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch unreachable;
    defer vm.deinit();

    // Creator address with sufficient balance
    const creator_address = [_]u8{0x20} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    // Constructor that returns a single STOP opcode (0x00) as runtime code
    const constructor_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 (STOP opcode to store)
        0x60, 0x00, // PUSH1 0x00 (memory offset for 32-byte word)
        0x52,       // MSTORE (store 32-byte word to memory)
        0x60, 0x01, // PUSH1 0x01 (size to return - 1 byte)
        0x60, 0x1F, // PUSH1 0x1F (offset 31 - last byte of 32-byte word)
        0xF3,       // RETURN
    };

    std.log.info("Testing CREATE with STOP runtime constructor, bytecode length: {}", .{constructor_bytecode.len});

    // Deploy the contract using CREATE
    const create_result = vm.create_contract(
        creator_address,
        0,
        &constructor_bytecode,
        1000000,
    ) catch |err| {
        std.log.err("CREATE failed: {}", .{err});
        return err;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.log.info("CREATE result: success={}, address={any}", .{ create_result.success, create_result.address });

    // Check that CREATE succeeded
    try testing.expect(create_result.success);

    // Check deployed code
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("Deployed code length: {}, content: {any}", .{ deployed_code.len, deployed_code });

    // Should have 1 byte of runtime code (the STOP opcode)
    try testing.expect(deployed_code.len == 1);
    try testing.expect(deployed_code[0] == 0x00); // STOP opcode
}

test "CREATE with TenThousandHashes bytecode - DETAILED DEBUG" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize memory database and VM
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch unreachable;
    defer vm.deinit();

    // Creator address with sufficient balance
    const creator_address = [_]u8{0x30} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    // TenThousandHashes bytecode from evm-bench (hex decoded)
    const bytecode_hex = "6080604052348015600e575f5ffd5b50609780601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106026575f3560e01c806330627b7c14602a575b5f5ffd5b60306032565b005b5f5b614e20811015605e5760408051602081018390520160408051601f19818403019052526001016034565b5056fea26469706673582212202c247f39d615d7f66942cd6ed505d8ea34fbfcbe16ac875ed08c4a9c229325f364736f6c634300081e0033";
    
    // Decode hex to bytes
    const bytecode = try allocator.alloc(u8, bytecode_hex.len / 2);
    defer allocator.free(bytecode);
    _ = try std.fmt.hexToBytes(bytecode, bytecode_hex);

    std.log.info("=== DETAILED TenThousandHashes CREATE DEBUG ===", .{});
    std.log.info("Creator address: {any}", .{creator_address});
    std.log.info("Creator balance: {}", .{vm.state.get_balance(creator_address)});
    std.log.info("Constructor bytecode length: {} bytes", .{bytecode.len});
    std.log.info("Constructor bytecode (first 32 bytes): {any}", .{bytecode[0..@min(32, bytecode.len)]});

    // Deploy the contract using CREATE with detailed error handling
    const create_result = vm.create_contract(
        creator_address,
        0,
        bytecode,
        10000000, // Higher gas limit for complex contract
    ) catch |err| {
        std.log.err("CREATE FAILED with error: {}", .{err});
        std.log.err("This means the constructor execution itself failed", .{});
        return err;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.log.info("=== CREATE EXECUTION COMPLETED ===", .{});
    std.log.info("CREATE success: {}", .{create_result.success});
    std.log.info("CREATE address: {any}", .{create_result.address});
    std.log.info("CREATE gas_left: {}", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.log.info("CREATE output length: {} bytes", .{output.len});
        if (output.len > 0) {
            std.log.info("CREATE output (first 32 bytes): {any}", .{output[0..@min(32, output.len)]});
        } else {
            std.log.warn("CREATE output is EMPTY - this is the problem!", .{});
        }
    } else {
        std.log.warn("CREATE output is NULL - this is the problem!", .{});
    }

    // Check that CREATE succeeded  
    if (!create_result.success) {
        std.log.err("CREATE reported failure - constructor execution failed", .{});
        try testing.expect(false);
    }

    // Check what code is actually stored at the address
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("=== POST-CREATE CODE VERIFICATION ===", .{});
    std.log.info("Code stored at address length: {} bytes", .{deployed_code.len});
    
    if (deployed_code.len == 0) {
        std.log.err("CRITICAL: No code stored at contract address!", .{});
        std.log.err("This means either:", .{});
        std.log.err("1. Constructor returned empty output (RETURN with 0 length)", .{});
        std.log.err("2. set_code() failed to store the code", .{});
        std.log.err("3. get_code() failed to retrieve the code", .{});
    } else {
        std.log.info("SUCCESS: Code was stored! First 32 bytes: {any}", .{deployed_code[0..@min(32, deployed_code.len)]});
    }

    // TenThousandHashes should deploy runtime code
    try testing.expect(deployed_code.len > 0);
}