//! Optimism-specific constants, types, and helpers.

use core::ops::Mul;
use revm_interpreter::primitives::{
    db::Database, hex_literal::hex, Bytes, Spec, SpecId, B160, U256,
};

const ZERO_BYTE_COST: u64 = 4;
const NON_ZERO_BYTE_COST: u64 = 16;

const L1_BASE_FEE_SLOT: U256 = U256::from_limbs([1u64, 0, 0, 0]);
const L1_OVERHEAD_SLOT: U256 = U256::from_limbs([5u64, 0, 0, 0]);
const L1_SCALAR_SLOT: U256 = U256::from_limbs([6u64, 0, 0, 0]);

/// The address of L1 fee recipient.
pub const L1_FEE_RECIPIENT: B160 = B160(hex!("420000000000000000000000000000000000001A"));

/// The address of the base fee recipient.
pub const BASE_FEE_RECIPIENT: B160 = B160(hex!("4200000000000000000000000000000000000019"));

/// The address of the L1Block contract.
pub const L1_BLOCK_CONTRACT: B160 = B160(hex!("4200000000000000000000000000000000000015"));

/// L1 block info
///
/// We can extract L1 epoch data from each L2 block, by looking at the `setL1BlockValues`
/// transaction data. This data is then used to calculate the L1 cost of a transaction.
///
/// Here is the format of the `setL1BlockValues` transaction data:
///
/// setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash,
/// uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)
///
/// For now, we only care about the fields necessary for L1 cost calculation.
#[derive(Clone, Debug)]
pub struct L1BlockInfo {
    /// The base fee of the L1 origin block.
    pub l1_base_fee: U256,
    /// The current L1 fee overhead.
    pub l1_fee_overhead: U256,
    /// The current L1 fee scalar.
    pub l1_fee_scalar: U256,
}

impl L1BlockInfo {
    pub fn try_fetch<DB: Database>(
        db: &mut DB,
        is_optimism: bool,
    ) -> Result<Option<L1BlockInfo>, DB::Error> {
        is_optimism
            .then(|| {
                let l1_base_fee = db.storage(L1_BLOCK_CONTRACT, L1_BASE_FEE_SLOT)?;
                let l1_fee_overhead = db.storage(L1_BLOCK_CONTRACT, L1_OVERHEAD_SLOT)?;
                let l1_fee_scalar = db.storage(L1_BLOCK_CONTRACT, L1_SCALAR_SLOT)?;

                Ok(L1BlockInfo {
                    l1_base_fee,
                    l1_fee_overhead,
                    l1_fee_scalar,
                })
            })
            .map_or(Ok(None), |v| v.map(Some))
    }

    /// Calculate the data gas for posting the transaction on L1. Calldata costs 16 gas per non-zero
    /// byte and 4 gas per zero byte.
    ///
    /// Prior to regolith, an extra 68 non-zero bytes were included in the rollup data costs to
    /// account for the empty signature.
    pub fn data_gas<SPEC: Spec>(&self, input: &Bytes) -> U256 {
        let mut rollup_data_gas_cost = U256::from(input.iter().fold(0, |acc, byte| {
            acc + if *byte == 0x00 {
                ZERO_BYTE_COST
            } else {
                NON_ZERO_BYTE_COST
            }
        }));

        // Prior to regolith, an extra 68 non zero bytes were included in the rollup data costs.
        if !SPEC::enabled(SpecId::REGOLITH) {
            rollup_data_gas_cost += U256::from(NON_ZERO_BYTE_COST).mul(U256::from(68));
        }

        rollup_data_gas_cost
    }

    /// Calculate the gas cost of a transaction based on L1 block data posted on L2
    pub fn calculate_tx_l1_cost<SPEC: Spec>(&self, input: &Bytes, is_deposit: bool) -> U256 {
        let rollup_data_gas_cost = self.data_gas::<SPEC>(input);

        if is_deposit || rollup_data_gas_cost == U256::ZERO {
            return U256::ZERO;
        }

        rollup_data_gas_cost
            .saturating_add(self.l1_fee_overhead)
            .saturating_mul(self.l1_base_fee)
            .saturating_mul(self.l1_fee_scalar)
            .checked_div(U256::from(1_000_000))
            .unwrap_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::primitives::specification::*;

    #[test]
    fn test_data_gas_non_zero_bytes() {
        let l1_block_info = L1BlockInfo {
            l1_base_fee: U256::from(1_000_000),
            l1_fee_overhead: U256::from(1_000_000),
            l1_fee_scalar: U256::from(1_000_000),
        };

        // 0xFACADE = 6 nibbles = 3 bytes
        // 0xFACADE = 1111 1010 . 1100 1010 . 1101 1110

        // Pre-regolith (ie bedrock) has an extra 68 non-zero bytes
        // gas cost = 3 non-zero bytes * NON_ZERO_BYTE_COST + NON_ZERO_BYTE_COST * 68
        // gas cost = 3 * 16 + 68 * 16 = 1136
        let input = Bytes::from(hex!("FACADE").to_vec());
        let bedrock_data_gas = l1_block_info.data_gas::<BedrockSpec>(&input);
        assert_eq!(bedrock_data_gas, U256::from(1136));

        // Regolith has no added 68 non zero bytes
        // gas cost = 3 * 16 = 48
        let regolith_data_gas = l1_block_info.data_gas::<RegolithSpec>(&input);
        assert_eq!(regolith_data_gas, U256::from(48));
    }

    #[test]
    fn test_data_gas_zero_bytes() {
        let l1_block_info = L1BlockInfo {
            l1_base_fee: U256::from(1_000_000),
            l1_fee_overhead: U256::from(1_000_000),
            l1_fee_scalar: U256::from(1_000_000),
        };

        // 0xFA00CA00DE = 10 nibbles = 5 bytes
        // 0xFA00CA00DE = 1111 1010 . 0000 0000 . 1100 1010 . 0000 0000 . 1101 1110

        // Pre-regolith (ie bedrock) has an extra 68 non-zero bytes
        // gas cost = 3 non-zero * NON_ZERO_BYTE_COST + 2 * ZERO_BYTE_COST + NON_ZERO_BYTE_COST * 68
        // gas cost = 3 * 16 + 2 * 4 + 68 * 16 = 1144
        let input = Bytes::from(hex!("FA00CA00DE").to_vec());
        let bedrock_data_gas = l1_block_info.data_gas::<BedrockSpec>(&input);
        assert_eq!(bedrock_data_gas, U256::from(1144));

        // Regolith has no added 68 non zero bytes
        // gas cost = 3 * 16 + 2 * 4 = 56
        let regolith_data_gas = l1_block_info.data_gas::<RegolithSpec>(&input);
        assert_eq!(regolith_data_gas, U256::from(56));
    }

    #[test]
    fn test_calculate_tx_l1_cost() {
        let l1_block_info = L1BlockInfo {
            l1_base_fee: U256::from(1_000),
            l1_fee_overhead: U256::from(1_000),
            l1_fee_scalar: U256::from(1_000),
        };

        // The gas cost here should be zero since the tx is a deposit
        let input = Bytes::from(hex!("FACADE").to_vec());
        let gas_cost = l1_block_info.calculate_tx_l1_cost::<BedrockSpec>(&input, true);
        assert_eq!(gas_cost, U256::ZERO);

        let gas_cost = l1_block_info.calculate_tx_l1_cost::<RegolithSpec>(&input, false);
        assert_eq!(gas_cost, U256::from(1048));

        // Zero rollup data gas cost should result in zero for non-deposits
        let input = Bytes::from(hex!("").to_vec());
        let gas_cost = l1_block_info.calculate_tx_l1_cost::<RegolithSpec>(&input, false);
        assert_eq!(gas_cost, U256::ZERO);
    }
}
