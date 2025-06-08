const AccessListStorageKey = @import("access_list_storage_key.zig");

/// HashMap context for AccessListStorageKey
const Self = @This();

pub fn hash(ctx: Self, key: AccessListStorageKey) u64 {
    _ = ctx;
    return key.hash();
}

pub fn eql(ctx: Self, a: AccessListStorageKey, b: AccessListStorageKey) bool {
    _ = ctx;
    return a.eql(b);
}
