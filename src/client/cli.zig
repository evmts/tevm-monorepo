const std = @import("std");
const clap = @import("clap");

const Network = enum {
    mainnet,
    sepolia,
    holesky,
};

const SyncMode = enum {
    full,
    light,
};

const LogLevel = enum {
    @"error",
    warn,
    info,
    debug,
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Define the parameters
    const params = comptime clap.parseParamsComptime(
        \\-h, --help                    Display this help and exit.
        \\    --network <str>           Network (default: mainnet)
        \\    --customChain <str>       Path to custom chain parameters json file
        \\    --bootnodes <str>         Comma-separated list of network bootnodes
        \\    --port <u16>              RLPx listening port (default: 30303)
        \\    --sync <str>              Blockchain sync mode (default: full)
        \\    --rpc                     Enable the JSON-RPC server
        \\    --rpcPort <u16>           HTTP-RPC server listening port (default: 8545)
        \\    --rpcAddr <str>           HTTP-RPC server listening interface address (default: localhost)
        \\    --ws                      Enable the WS-RPC server
        \\    --wsPort <u16>            WS-RPC server listening port (default: 8546)
        \\    --rpcEngine               Enable the Engine JSON-RPC server
        \\    --rpcEnginePort <u16>     Engine RPC server listening port (default: 8551)
        \\    --rpcEngineAuth           Enable jwt authentication for Engine RPC (default: true)
        \\    --jwtSecret <str>         Path to a hex-encoded JWT secret file
        \\    --logLevel <str>          Logging verbosity (default: info)
        \\    --prometheus              Enable the Prometheus metrics server
        \\    --prometheusPort <u16>    Prometheus metrics server port (default: 8000)
        \\    --accountCache <usize>    Size for the account cache (default: 10000)
        \\    --storageCache <usize>    Size for the storage cache (default: 10000)
        \\    --mine                    Enable private network mining
        \\    --unlock <str>            Path to file or comma-separated list of accounts to unlock
        \\    --dev                     Start an ephemeral PoA dev chain
        \\    --startBlock <u64>        Block number to start syncing from (destructive)
        \\    --executeBlocks <str>     Debug mode for re-executing a block range (e.g., "5-10")
        \\
    );

    // Parse arguments
    var diag = clap.Diagnostic{};
    var res = clap.parse(clap.Help, &params, clap.parsers.default, .{
        .diagnostic = &diag,
        .allocator = allocator,
    }) catch |err| {
        diag.report(std.io.getStdErr().writer(), err) catch {};
        return err;
    };
    defer res.deinit();

    // Handle help
    if (res.args.help != 0) {
        return clap.help(std.io.getStdOut().writer(), clap.Help, &params, .{});
    }

    // Parse configuration with defaults
    const network = if (res.args.network) |n| 
        std.meta.stringToEnum(Network, n) orelse .mainnet
    else 
        .mainnet;

    const sync_mode = if (res.args.sync) |s|
        std.meta.stringToEnum(SyncMode, s) orelse .full
    else
        .full;

    const log_level = if (res.args.logLevel) |l|
        std.meta.stringToEnum(LogLevel, l) orelse .info
    else
        .info;

    const port = res.args.port orelse 30303;
    const rpc_port = res.args.rpcPort orelse 8545;
    const ws_port = res.args.wsPort orelse 8546;
    const rpc_engine_port = res.args.rpcEnginePort orelse 8551;
    const prometheus_port = res.args.prometheusPort orelse 8000;
    const account_cache = res.args.accountCache orelse 10000;
    const storage_cache = res.args.storageCache orelse 10000;
    const start_block = res.args.startBlock;

    // Print the parsed parameters for verification
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Ethereum Client Configuration:\n", .{});
    try stdout.print("==============================\n\n", .{});

    try stdout.print("Network Configuration:\n", .{});
    try stdout.print("  Network: {s}\n", .{@tagName(network)});
    if (res.args.customChain) |chain| {
        try stdout.print("  Custom Chain: {s}\n", .{chain});
    }
    if (res.args.bootnodes) |nodes| {
        try stdout.print("  Bootnodes: {s}\n", .{nodes});
    }
    try stdout.print("  Port: {}\n", .{port});
    try stdout.print("  Sync Mode: {s}\n\n", .{@tagName(sync_mode)});

    try stdout.print("RPC Server Options:\n", .{});
    try stdout.print("  RPC Enabled: {}\n", .{res.args.rpc != 0});
    if (res.args.rpc != 0) {
        try stdout.print("  RPC Port: {}\n", .{rpc_port});
        try stdout.print("  RPC Address: {s}\n", .{res.args.rpcAddr orelse "localhost"});
    }
    try stdout.print("  WebSocket Enabled: {}\n", .{res.args.ws != 0});
    if (res.args.ws != 0) {
        try stdout.print("  WebSocket Port: {}\n", .{ws_port});
    }
    try stdout.print("\n", .{});

    try stdout.print("Engine API Options:\n", .{});
    try stdout.print("  Engine RPC Enabled: {}\n", .{res.args.rpcEngine != 0});
    if (res.args.rpcEngine != 0) {
        try stdout.print("  Engine RPC Port: {}\n", .{rpc_engine_port});
        try stdout.print("  Engine RPC Auth: {}\n", .{res.args.rpcEngineAuth == 0 or res.args.rpcEngineAuth != 0});
        if (res.args.jwtSecret) |secret| {
            try stdout.print("  JWT Secret Path: {s}\n", .{secret});
        }
    }
    try stdout.print("\n", .{});

    try stdout.print("Logging and Metrics:\n", .{});
    try stdout.print("  Log Level: {s}\n", .{@tagName(log_level)});
    try stdout.print("  Prometheus Enabled: {}\n", .{res.args.prometheus != 0});
    if (res.args.prometheus != 0) {
        try stdout.print("  Prometheus Port: {}\n", .{prometheus_port});
    }
    try stdout.print("\n", .{});

    try stdout.print("Performance Tuning:\n", .{});
    try stdout.print("  Account Cache Size: {}\n", .{account_cache});
    try stdout.print("  Storage Cache Size: {}\n\n", .{storage_cache});

    try stdout.print("Mining and Development:\n", .{});
    try stdout.print("  Mining Enabled: {}\n", .{res.args.mine != 0});
    if (res.args.unlock) |unlock| {
        try stdout.print("  Unlock Accounts: {s}\n", .{unlock});
    }
    try stdout.print("  Dev Mode: {}\n\n", .{res.args.dev != 0});

    if (start_block != null or res.args.executeBlocks != null) {
        try stdout.print("Special Modes:\n", .{});
        if (start_block) |block| {
            try stdout.print("  Start Block: {}\n", .{block});
        }
        if (res.args.executeBlocks) |blocks| {
            try stdout.print("  Execute Blocks: {s}\n", .{blocks});
        }
    }
}