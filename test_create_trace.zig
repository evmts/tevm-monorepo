const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize memory database
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();

    // Initialize VM
    var vm = try evm.Vm.init(allocator, db_interface, null, null);
    defer vm.deinit();

    // Set up creator account with balance
    const creator_address: [20]u8 = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    std.debug.print("=== Contract Creation Test ===\n", .{});

    // Simple contract that returns 0x42 when called
    // Constructor: push 0x42, push 0x00, mstore, push 0x20, push 0x00, return
    // Runtime: push 0x42, push 0x00, mstore, push 0x20, push 0x00, return
    const init_code = [_]u8{
        // Constructor code - just returns the runtime code
        0x60, 0x0A, // PUSH1 10 (length of runtime code)
        0x60, 0x0C, // PUSH1 12 (offset of runtime code in this bytecode)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x39,       // CODECOPY
        0x60, 0x0A, // PUSH1 10 (length of runtime code) 
        0x60, 0x00, // PUSH1 0 (memory offset)
        0xF3,       // RETURN
        // Runtime code starts here (offset 12)
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xF3,       // RETURN
    };

    std.debug.print("Init code length: {}\n", .{init_code.len});
    std.debug.print("Init code: ", .{});
    for (init_code) |byte| {
        std.debug.print("{:02x}", .{byte});
    }
    std.debug.print("\n", .{});

    // Deploy the contract
    std.debug.print("\n=== Deploying Contract ===\n", .{});
    const create_result = try vm.create_contract(
        creator_address, // creator
        0,               // value
        &init_code,      // init code
        1000000,         // gas
    );

    std.debug.print("Create result:\n", .{});
    std.debug.print("  Success: {}\n", .{create_result.success});
    std.debug.print("  Address: 0x{any}\n", .{Address.to_u256(create_result.address)});
    std.debug.print("  Gas left: {}\n", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.debug.print("  Output length: {}\n", .{output.len});
        std.debug.print("  Output: ", .{});
        for (output) |byte| {
            std.debug.print("{:02x}", .{byte});
        }
        std.debug.print("\n", .{});
    } else {
        std.debug.print("  Output: null\n", .{});
    }

    if (!create_result.success) {
        std.debug.print("Contract creation failed!\n", .{});
        return;
    }

    // Check if the code was actually deployed
    std.debug.print("\n=== Checking Deployed Code ===\n", .{});
    const deployed_code = vm.state.get_code(create_result.address);
    std.debug.print("Deployed code length: {}\n", .{deployed_code.len});
    if (deployed_code.len > 0) {
        std.debug.print("Deployed code: ", .{});
        for (deployed_code) |byte| {
            std.debug.print("{:02x}", .{byte});
        }
        std.debug.print("\n", .{});
    } else {
        std.debug.print("No code found at deployed address!\n", .{});
    }

    // Try calling the deployed contract
    std.debug.print("\n=== Calling Deployed Contract ===\n", .{});
    const caller_address: [20]u8 = [_]u8{0x20} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(caller_address, std.math.maxInt(u256));

    if (deployed_code.len > 0) {
        // Create a contract instance for execution
        var contract = evm.Contract.init(
            caller_address,       // caller
            create_result.address, // address
            0,                    // value
            100000,               // gas
            deployed_code,        // code
            [_]u8{0} ** 32,      // code_hash (not used for execution)
            &[_]u8{},            // input (empty)
            false,               // is_static
        );
        defer contract.deinit(allocator, null);

        const run_result = vm.interpret(&contract, &[_]u8{}) catch |err| {
            std.debug.print("Contract execution failed: {}\n", .{err});
            return;
        };

        std.debug.print("Call result:\n", .{});
        std.debug.print("  Status: {}\n", .{run_result.status});
        std.debug.print("  Gas used: {}\n", .{run_result.gas_used});
        
        if (run_result.output) |output| {
            std.debug.print("  Output length: {}\n", .{output.len});
            std.debug.print("  Output: ", .{});
            for (output) |byte| {
                std.debug.print("{:02x}", .{byte});
            }
            std.debug.print("\n", .{});
            
            if (output.len >= 32) {
                const result_value = std.mem.readInt(u256, output[0..32], .big);
                std.debug.print("  Returned value: 0x{any}\n", .{result_value});
            }
        } else {
            std.debug.print("  Output: null\n", .{});
        }
    }
}