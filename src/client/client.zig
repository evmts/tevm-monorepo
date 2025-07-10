const Config = @import("config.zig");
const Blockchain = @import("blockchain.zig");
const Db = @import("db.zig");
const Address = @import("address");
const GenesisState = @import("genesis_state.zig");

const Client = @This();

config: Config = Config{},
blockchain: Blockchain = Blockchain{},
db: Db = Db{},
// make me comptime known slice of Address
bootnodes: []const Address,
refreshInterval: ?u32 = null,
genesisState: ?GenesisState,

const ClientError = error{};

pub fn init(bootnodes: []const Address) ClientError!void {
    return .{ .bootnodes = bootnodes };
}
