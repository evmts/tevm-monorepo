const std = @import("std");
const evm = @import("evm");
const Vm = evm.Vm;
const Database = evm.DatabaseInterface;
const DatabaseError = evm.DatabaseError;
const Account = evm.Account;
const Address = @import("Address").Address;
const ExecutionError = evm.ExecutionError;

// Export stub for __zig_probe_stack to satisfy linker
export fn __zig_probe_stack() callconv(.C) void {}

// Global state for the VM instance
// WARNING: This global state should be used minimally and only through the C API
// functions. Direct access to these globals outside of the exported functions
// can lead to undefined behavior, especially in multi-threaded environments.
var global_vm: ?Vm = null;
// Global allocator using WASM allocator
const global_allocator = std.heap.wasm_allocator;
var global_database: ?InMemoryDatabase = null;

// Simple in-memory database implementation for WASM
const InMemoryDatabase = struct {
    allocator: std.mem.Allocator,
    accounts: std.hash_map.HashMap([20]u8, InMemoryAccount, std.hash_map.AutoContext([20]u8), 80),
    storage: std.hash_map.HashMap(StorageKey, u256, StorageKey.HashContext, 80),
    
    const InMemoryAccount = struct {
        balance: u256,
        nonce: u64,
        code: []const u8,
    };
    
    const StorageKey = struct {
        address: [20]u8,
        key: u256,
        
        pub const HashContext = struct {
            pub fn hash(self: @This(), key: StorageKey) u64 {
                _ = self;
                var hasher = std.hash.Wyhash.init(0);
                hasher.update(&key.address);
                hasher.update(std.mem.asBytes(&key.key));
                return hasher.final();
            }
            
            pub fn eql(self: @This(), a: StorageKey, b: StorageKey) bool {
                _ = self;
                return std.mem.eql(u8, &a.address, &b.address) and a.key == b.key;
            }
        };
    };
    
    fn init(allocator: std.mem.Allocator) InMemoryDatabase {
        return .{
            .allocator = allocator,
            .accounts = std.hash_map.HashMap([20]u8, InMemoryAccount, std.hash_map.AutoContext([20]u8), 80).init(allocator),
            .storage = std.hash_map.HashMap(StorageKey, u256, StorageKey.HashContext, 80).init(allocator),
        };
    }
    
    fn deinit(self: *InMemoryDatabase) void {
        var account_iter = self.accounts.iterator();
        while (account_iter.next()) |entry| {
            self.allocator.free(entry.value_ptr.code);
        }
        self.accounts.deinit();
        self.storage.deinit();
    }
    
    // Database interface implementation
    fn get_account(ptr: *anyopaque, address: Address) DatabaseError!?Account {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        if (self.accounts.get(address)) |account| {
            return .{
                .balance = account.balance,
                .nonce = account.nonce,
                .code_hash = [_]u8{0} ** 32, // TODO: calculate hash
                .storage_root = [_]u8{0} ** 32,
            };
        }
        return null;
    }
    
    fn get_storage(ptr: *anyopaque, address: Address, key: u256) DatabaseError!u256 {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        const storage_key = StorageKey{ .address = address, .key = key };
        return self.storage.get(storage_key) orelse 0;
    }
    
    fn set_storage(ptr: *anyopaque, address: Address, key: u256, value: u256) DatabaseError!void {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        const storage_key = StorageKey{ .address = address, .key = key };
        try self.storage.put(storage_key, value);
    }
    
    fn get_code(ptr: *anyopaque, code_hash: [32]u8) DatabaseError![]const u8 {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        // For now, iterate through accounts to find matching code
        // In a real implementation, you'd have a separate code storage by hash
        var iter = self.accounts.iterator();
        while (iter.next()) |entry| {
            // TODO: Calculate actual code hash and compare
            _ = code_hash;
            if (entry.value_ptr.code.len > 0) {
                return entry.value_ptr.code;
            }
        }
        return &[_]u8{};
    }
    
    fn set_account(ptr: *anyopaque, address: Address, account: Account) DatabaseError!void {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        // For now, just update balance and nonce
        if (self.accounts.getPtr(address)) |acc| {
            acc.balance = account.balance;
            acc.nonce = account.nonce;
        } else {
            try self.accounts.put(address, .{
                .balance = account.balance,
                .nonce = account.nonce,
                .code = &[_]u8{},
            });
        }
    }
    
    fn delete_account(ptr: *anyopaque, address: Address) DatabaseError!void {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        if (self.accounts.fetchRemove(address)) |kv| {
            self.allocator.free(kv.value.code);
        }
    }
    
    fn account_exists(ptr: *anyopaque, address: Address) bool {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        return self.accounts.contains(address);
    }
    
    fn set_code(ptr: *anyopaque, code: []const u8) DatabaseError![32]u8 {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        // TODO: Calculate actual keccak256 hash
        const hash = [_]u8{0} ** 32;
        // Store code somewhere - for now just return dummy hash
        _ = self;
        _ = code;
        return hash;
    }
    
    fn get_state_root(_: *anyopaque) DatabaseError![32]u8 {
        // Return dummy state root for now
        return [_]u8{0} ** 32;
    }
    
    fn commit_changes(_: *anyopaque) DatabaseError![32]u8 {
        // No-op for simple implementation, return dummy root
        return [_]u8{0} ** 32;
    }
    
    fn create_snapshot(_: *anyopaque) DatabaseError!u64 {
        // Simple implementation - return current timestamp as snapshot id
        return 0;
    }
    
    fn revert_to_snapshot(_: *anyopaque, _: u64) DatabaseError!void {
        // No-op for simple implementation
    }
    
    fn commit_snapshot(_: *anyopaque, _: u64) DatabaseError!void {
        // No-op for simple implementation
    }
    
    fn begin_batch(_: *anyopaque) DatabaseError!void {
        // No-op for simple implementation
    }
    
    fn commit_batch(_: *anyopaque) DatabaseError!void {
        // No-op for simple implementation
    }
    
    fn rollback_batch(_: *anyopaque) DatabaseError!void {
        // No-op for simple implementation
    }
    
    fn deinit_interface(ptr: *anyopaque) void {
        const self: *InMemoryDatabase = @ptrCast(@alignCast(ptr));
        self.deinit();
    }
    
    fn to_database_interface(self: *InMemoryDatabase) Database {
        return .{
            .ptr = self,
            .vtable = &.{
                .get_account = get_account,
                .set_account = set_account,
                .delete_account = delete_account,
                .account_exists = account_exists,
                .get_storage = get_storage,
                .set_storage = set_storage,
                .get_code = get_code,
                .set_code = set_code,
                .get_state_root = get_state_root,
                .commit_changes = commit_changes,
                .create_snapshot = create_snapshot,
                .revert_to_snapshot = revert_to_snapshot,
                .commit_snapshot = commit_snapshot,
                .begin_batch = begin_batch,
                .commit_batch = commit_batch,
                .rollback_batch = rollback_batch,
                .deinit = deinit_interface,
            },
        };
    }
};

// Initialize the EVM
// Returns 0 on success, -1 on failure
export fn evm_init() callconv(.C) i32 {
    // Clean up any existing instance
    if (global_vm != null) {
        _ = evm_deinit();
    }
    
    // Create database
    global_database = InMemoryDatabase.init(global_allocator);
    const db_interface = global_database.?.to_database_interface();
    
    // Initialize VM
    global_vm = Vm.init(global_allocator, db_interface, null, null) catch {
        return -1;
    };
    
    return 0;
}

// Deinitialize the EVM and free resources
// Returns 0 on success, -1 on failure
export fn evm_deinit() callconv(.C) i32 {
    if (global_vm) |*vm| {
        vm.deinit();
        global_vm = null;
    }
    
    if (global_database) |*db| {
        db.deinit();
        global_database = null;
    }
    
    // WASM allocator doesn't need cleanup
    
    return 0;
}

// Get the current version
export fn evm_version() callconv(.C) u32 {
    return 100; // v1.0.0
}

// Memory allocation for WASM
export fn evm_alloc(len: usize) callconv(.C) ?[*]u8 {
    const allocator = std.heap.wasm_allocator;
    const slice = allocator.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn evm_free(ptr: [*]u8, len: usize) callconv(.C) void {
    const allocator = std.heap.wasm_allocator;
    const slice = ptr[0..len];
    allocator.free(slice);
}

// Set an account in the state
// address_ptr: pointer to 20-byte address
// balance_ptr: pointer to 32-byte balance (big-endian)
// nonce: account nonce
// Returns 0 on success, -1 on failure
export fn evm_set_account(
    address_ptr: [*]const u8,
    balance_ptr: [*]const u8,
    nonce: u64,
) callconv(.C) i32 {
    const vm = global_vm orelse return -1;
    var db = &(global_database orelse return -1);
    
    const address: Address = address_ptr[0..20].*;
    var balance: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        balance = (balance << 8) | balance_ptr[i];
    }
    
    const db_interface = db.to_database_interface();
    db_interface.vtable.set_account(db_interface.ptr, address, .{
        .balance = balance,
        .nonce = nonce,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    }) catch return -1;
    
    _ = vm;
    return 0;
}

// Get an account from the state
// address_ptr: pointer to 20-byte address
// balance_ptr: pointer to 32-byte buffer for balance output (big-endian)
// nonce_ptr: pointer to u64 for nonce output
// Returns 0 on success, -1 on failure, -2 if account not found
export fn evm_get_account(
    address_ptr: [*]const u8,
    balance_ptr: [*]u8,
    nonce_ptr: *u64,
) callconv(.C) i32 {
    var db = &(global_database orelse return -1);
    
    const address: Address = address_ptr[0..20].*;
    
    const db_interface = db.to_database_interface();
    const account = db_interface.vtable.get_account(db_interface.ptr, address) catch return -1;
    if (account == null) return -2;
    
    // Convert balance to big-endian bytes
    const balance = account.?.balance;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        balance_ptr[31 - i] = @intCast(balance >> @intCast(i * 8));
    }
    
    nonce_ptr.* = account.?.nonce;
    return 0;
}

// Simple test function to verify basic operations work
export fn evm_test_add(a: u32, b: u32) callconv(.C) u32 {
    return a + b;
}