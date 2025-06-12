const std = @import("std");
const primitives = @import("primitives");
const eip7702 = @import("eip7702");

pub const Bytes = []const u8; // alias; replace with actual Bytes type
pub const Address = primitives.Address;
pub const B256 = primitives.B256;
pub const KECCAK_EMPTY = primitives.KECCAK_EMPTY;

pub const BytecodeDecodeError = error{InvalidFormat};

/// Legacy raw bytecode wrapper
pub const LegacyRawBytecode = struct {
    raw: Bytes,
    pub fn into_analyzed(self: LegacyRawBytecode) LegacyAnalyzedBytecode {
        unreachable; // stub
    }
};

/// Legacy bytecode with jump table analysis
pub const LegacyAnalyzedBytecode = struct {
    pub fn default() LegacyAnalyzedBytecode { unreachable; }
    pub fn new(raw: Bytes, original_len: usize, jump_table: JumpTable) LegacyAnalyzedBytecode { unreachable; }
    pub fn jump_table(self: *const LegacyAnalyzedBytecode) *JumpTable { unreachable; }
    pub fn bytecode(self: *const LegacyAnalyzedBytecode) Bytes { unreachable; }
    pub fn original_bytes(self: *const LegacyAnalyzedBytecode) Bytes { unreachable; }
    pub fn original_byte_slice(self: *const LegacyAnalyzedBytecode) []const u8 { unreachable; }
};

/// Jump table for legacy bytecode
pub const JumpTable = struct {
    // stub
};

/// EOF (Ethereum Object Format) bytecode
pub const Eof = struct {
    pub const Body = struct { code: Bytes };
    raw: Bytes,
    body: Body,
    pub fn decode(bytes: Bytes) !Eof { unreachable; }
};

/// Main bytecode enum with all supported variants
pub const Bytecode = union(enum) {
    LegacyAnalyzed: LegacyAnalyzedBytecode,
    Eof:            *Eof,
    Eip7702:        eip7702.Eip7702Bytecode,

    pub fn init() Bytecode {
        return Bytecode{ .LegacyAnalyzed = LegacyAnalyzedBytecode.default() };
    }

    pub fn legacy_jump_table(self: *const Bytecode) ?*JumpTable {
        return switch (self.*) {
            .LegacyAnalyzed => (|b| b.jump_table()),
            else => null,
        };
    }

    pub fn hash_slow(self: *const Bytecode) B256 {
        const slice = self.original_byte_slice();
        if (self.is_empty()) return KECCAK_EMPTY;
        return primitives.keccak256(slice);
    }

    pub fn is_eof(self: *const Bytecode) bool {
        return switch (self.*) { .Eof => true, else => false };
    }

    pub fn is_eip_7702(self: *const Bytecode) bool {
        return switch (self.*) { .Eip7702 => true, else => false };
    }

    pub fn new_legacy(raw: Bytes) Bytecode {
        return Bytecode{ .LegacyAnalyzed = LegacyRawBytecode{ .raw = raw }.into_analyzed() };
    }

    pub fn new_raw(bytes: Bytes) Bytecode {
        return try!(@call .new_raw_checked(slice, allocator));
    }

    pub fn new_raw_checked(bytes: Bytes) !Bytecode {
        // EOF not supported
        if (bytes.len >= 2 and bytes[0..2] == eip7702.EIP7702_MAGIC_BYTES) {
            const e2 = try eip7702.Eip7702Bytecode.newRaw(bytes);
            return Bytecode{ .Eip7702 = e2 };
        } else {
            return Bytecode.new_legacy(bytes);
        }
    }

    pub fn new_eip_7702(address: Address) Bytecode {
        return Bytecode{ .Eip7702 = eip7702.Eip7702Bytecode.new(address) };
    }

    pub fn new_analyzed(bytecode: Bytes, original_len: usize, jump_table: JumpTable) Bytecode {
        return Bytecode{ .LegacyAnalyzed = LegacyAnalyzedBytecode.new(bytecode, original_len, jump_table) };
    }

    pub fn bytecode(self: *const Bytecode) Bytes {
        return switch (self.*) {
            .LegacyAnalyzed => |b| b.bytecode(),
            .Eof => |e| e.body.code,
            .Eip7702 => |e| e.raw(),
        };
    }

    pub fn bytecode_ptr(self: *const Bytecode) *const u8 {
        return self.bytecode().ptr;
    }

    pub fn bytes(self: *const Bytecode) Bytes {
        return self.bytes_ref().*;
    }

    pub fn bytes_ref(self: *const Bytecode) *const Bytes {
        return switch (self.*) {
            .LegacyAnalyzed => |b| &b.bytecode(),
            .Eof => |e| &e.raw,
            .Eip7702 => |e| &e.raw(),
        };
    }

    pub fn bytes_slice(self: *const Bytecode) []const u8 {
        return self.bytes_ref().*;
    }

    pub fn original_bytes(self: *const Bytecode) Bytes {
        return switch (self.*) {
            .LegacyAnalyzed => |b| b.original_bytes(),
            .Eof => |e| e.raw,
            .Eip7702 => |e| e.raw(),
        };
    }

    pub fn original_byte_slice(self: *const Bytecode) []const u8 {
        return switch (self.*) {
            .LegacyAnalyzed => |b| b.original_byte_slice(),
            .Eof => |e| e.raw,
            .Eip7702 => |e| e.raw(),
        };
    }

    pub fn len(self: *const Bytecode) usize {
        return self.original_byte_slice().len;
    }

    pub fn is_empty(self: *const Bytecode) bool {
        return self.len() == 0;
    }

    pub fn iter_opcodes(self: *const Bytecode) BytecodeIterator {
        return BytecodeIterator.init(self);
    }
};

/// Iterator over opcodes (skips immediates)
pub const BytecodeIterator = struct {
    // stub fields
    pub fn init(bc: *const Bytecode) BytecodeIterator { unreachable; }
    pub fn next(self: *BytecodeIterator) ?RawOpCode { unreachable; }
};

// EOF magic bytes for detection
pub const EOF_MAGIC_BYTES = [2]u8{0xEF, 0x1C}; // example
