const AccessListStorageKey = @import("access_list_storage_key.zig");

/// HashMap context for AccessListStorageKey
const AccessListStorageKeyContext = @This();

pub fn hash(ctx: AccessListStorageKeyContext, key: AccessListStorageKey) u64 {
    _ = ctx;
    return key.hash();
}

pub fn eql(ctx: AccessListStorageKeyContext, a: AccessListStorageKey, b: AccessListStorageKey) bool {
    _ = ctx;
    return a.eql(b);
}
