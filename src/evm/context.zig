const std = @import("std");
const Address = @import("Address");

const Self = @This();

tx_origin: Address.Address = Address.zero(),
gas_price: u256 = 0,
block_number: u64 = 0,
block_timestamp: u64 = 0,
block_coinbase: Address.Address = Address.zero(),
block_difficulty: u256 = 0,
block_gas_limit: u64 = 0,
chain_id: u256 = 1,
block_base_fee: u256 = 0,
blob_hashes: []const u256 = &[_]u256{},
blob_base_fee: u256 = 0,

pub fn init() Self {
    return .{};
}

pub fn init_with_values(
    tx_origin: Address.Address,
    gas_price: u256,
    block_number: u64,
    block_timestamp: u64,
    block_coinbase: Address.Address,
    block_difficulty: u256,
    block_gas_limit: u64,
    chain_id: u256,
    block_base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
) Self {
    return .{
        .tx_origin = tx_origin,
        .gas_price = gas_price,
        .block_number = block_number,
        .block_timestamp = block_timestamp,
        .block_coinbase = block_coinbase,
        .block_difficulty = block_difficulty,
        .block_gas_limit = block_gas_limit,
        .chain_id = chain_id,
        .block_base_fee = block_base_fee,
        .blob_hashes = blob_hashes,
        .blob_base_fee = blob_base_fee,
    };
}

pub fn is_eth_mainnet(self: Self) bool {
    return self.chain_id == 1;
}
