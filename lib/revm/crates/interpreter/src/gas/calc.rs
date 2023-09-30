use super::constants::*;
use crate::inner_models::SelfDestructResult;
use crate::primitives::{Spec, SpecId::*, B160, U256};
use alloc::vec::Vec;

#[allow(clippy::collapsible_else_if)]
pub fn sstore_refund<SPEC: Spec>(original: U256, current: U256, new: U256) -> i64 {
    if SPEC::enabled(ISTANBUL) {
        // EIP-3529: Reduction in refunds
        let sstore_clears_schedule = if SPEC::enabled(LONDON) {
            (SSTORE_RESET - COLD_SLOAD_COST + ACCESS_LIST_STORAGE_KEY) as i64
        } else {
            REFUND_SSTORE_CLEARS
        };
        if current == new {
            0
        } else {
            if original == current && new == U256::ZERO {
                sstore_clears_schedule
            } else {
                let mut refund = 0;

                if original != U256::ZERO {
                    if current == U256::ZERO {
                        refund -= sstore_clears_schedule;
                    } else if new == U256::ZERO {
                        refund += sstore_clears_schedule;
                    }
                }

                if original == new {
                    let (gas_sstore_reset, gas_sload) = if SPEC::enabled(BERLIN) {
                        (SSTORE_RESET - COLD_SLOAD_COST, WARM_STORAGE_READ_COST)
                    } else {
                        (SSTORE_RESET, sload_cost::<SPEC>(false))
                    };
                    if original == U256::ZERO {
                        refund += (SSTORE_SET - gas_sload) as i64;
                    } else {
                        refund += (gas_sstore_reset - gas_sload) as i64;
                    }
                }

                refund
            }
        }
    } else {
        if current != U256::ZERO && new == U256::ZERO {
            REFUND_SSTORE_CLEARS
        } else {
            0
        }
    }
}

#[inline]
pub fn create2_cost(len: usize) -> Option<u64> {
    let base = CREATE;
    // ceil(len / 32.0)
    let len = len as u64;
    let sha_addup_base = (len / 32) + u64::from((len % 32) != 0);
    let sha_addup = KECCAK256WORD.checked_mul(sha_addup_base)?;
    let gas = base.checked_add(sha_addup)?;

    Some(gas)
}

#[inline]
fn log2floor(value: U256) -> u64 {
    assert!(value != U256::ZERO);
    let mut l: u64 = 256;
    for i in 0..4 {
        let i = 3 - i;
        if value.as_limbs()[i] == 0u64 {
            l -= 64;
        } else {
            l -= value.as_limbs()[i].leading_zeros() as u64;
            if l == 0 {
                return l;
            } else {
                return l - 1;
            }
        }
    }
    l
}

#[inline]
pub fn exp_cost<SPEC: Spec>(power: U256) -> Option<u64> {
    if power == U256::ZERO {
        Some(EXP)
    } else {
        // EIP-160: EXP cost increase
        let gas_byte = U256::from(if SPEC::enabled(SPURIOUS_DRAGON) {
            50u64
        } else {
            10
        });
        let gas = U256::from(EXP)
            .checked_add(gas_byte.checked_mul(U256::from(log2floor(power) / 8 + 1))?)?;

        u64::try_from(gas).ok()
    }
}

#[inline]
pub fn verylowcopy_cost(len: u64) -> Option<u64> {
    let wordd = len / 32;
    let wordr = len % 32;
    VERYLOW.checked_add(COPY.checked_mul(if wordr == 0 { wordd } else { wordd + 1 })?)
}

#[inline]
pub fn extcodecopy_cost<SPEC: Spec>(len: u64, is_cold: bool) -> Option<u64> {
    let wordd = len / 32;
    let wordr = len % 32;

    let base_gas: u64 = if SPEC::enabled(BERLIN) {
        if is_cold {
            COLD_ACCOUNT_ACCESS_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else if SPEC::enabled(TANGERINE) {
        700
    } else {
        20
    };
    base_gas.checked_add(COPY.checked_mul(if wordr == 0 { wordd } else { wordd + 1 })?)
}

pub fn account_access_gas<SPEC: Spec>(is_cold: bool) -> u64 {
    if SPEC::enabled(BERLIN) {
        if is_cold {
            COLD_ACCOUNT_ACCESS_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else if SPEC::enabled(ISTANBUL) {
        700
    } else {
        20
    }
}

pub fn log_cost(n: u8, len: u64) -> Option<u64> {
    LOG.checked_add(LOGDATA.checked_mul(len)?)?
        .checked_add(LOGTOPIC * n as u64)
}

pub fn keccak256_cost(len: u64) -> Option<u64> {
    let wordd = len / 32;
    let wordr = len % 32;
    KECCAK256.checked_add(KECCAK256WORD.checked_mul(if wordr == 0 { wordd } else { wordd + 1 })?)
}

/// EIP-3860: Limit and meter initcode
///
/// Apply extra gas cost of 2 for every 32-byte chunk of initcode.
///
/// This cannot overflow as the initcode length is assumed to be checked.
#[inline]
pub fn initcode_cost(len: u64) -> u64 {
    let wordd = len / 32;
    let wordr = len % 32;
    INITCODE_WORD_COST * if wordr == 0 { wordd } else { wordd + 1 }
}

#[inline]
pub fn sload_cost<SPEC: Spec>(is_cold: bool) -> u64 {
    if SPEC::enabled(BERLIN) {
        if is_cold {
            COLD_SLOAD_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else if SPEC::enabled(ISTANBUL) {
        // EIP-1884: Repricing for trie-size-dependent opcodes
        800
    } else if SPEC::enabled(TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        200
    } else {
        50
    }
}

#[allow(clippy::collapsible_else_if)]
pub fn sstore_cost<SPEC: Spec>(
    original: U256,
    current: U256,
    new: U256,
    gas: u64,
    is_cold: bool,
) -> Option<u64> {
    // TODO untangle this mess and make it more elegant
    let (gas_sload, gas_sstore_reset) = if SPEC::enabled(BERLIN) {
        (WARM_STORAGE_READ_COST, SSTORE_RESET - COLD_SLOAD_COST)
    } else {
        (sload_cost::<SPEC>(is_cold), SSTORE_RESET)
    };

    // https://eips.ethereum.org/EIPS/eip-2200
    // It’s a combined version of EIP-1283 and EIP-1706
    let gas_cost = if SPEC::enabled(ISTANBUL) {
        // EIP-1706
        if gas <= CALL_STIPEND {
            return None;
        }

        // EIP-1283
        if new == current {
            gas_sload
        } else {
            if original == current {
                if original == U256::ZERO {
                    SSTORE_SET
                } else {
                    gas_sstore_reset
                }
            } else {
                gas_sload
            }
        }
    } else {
        if current == U256::ZERO && new != U256::ZERO {
            SSTORE_SET
        } else {
            gas_sstore_reset
        }
    };
    // In EIP-2929 we charge extra if the slot has not been used yet in this transaction
    if SPEC::enabled(BERLIN) && is_cold {
        Some(gas_cost + COLD_SLOAD_COST)
    } else {
        Some(gas_cost)
    }
}

pub fn selfdestruct_cost<SPEC: Spec>(res: SelfDestructResult) -> u64 {
    // EIP-161: State trie clearing (invariant-preserving alternative)
    let should_charge_topup = if SPEC::enabled(SPURIOUS_DRAGON) {
        res.had_value && !res.target_exists
    } else {
        !res.target_exists
    };

    // EIP-150: Gas cost changes for IO-heavy operations
    let selfdestruct_gas_topup = if SPEC::enabled(TANGERINE) && should_charge_topup {
        25000
    } else {
        0
    };

    // EIP-150: Gas cost changes for IO-heavy operations
    let selfdestruct_gas = if SPEC::enabled(TANGERINE) { 5000 } else { 0 };

    let mut gas = selfdestruct_gas + selfdestruct_gas_topup;
    if SPEC::enabled(BERLIN) && res.is_cold {
        gas += COLD_ACCOUNT_ACCESS_COST
    }
    gas
}

pub fn call_cost<SPEC: Spec>(
    value: U256,
    is_new: bool,
    is_cold: bool,
    is_call_or_callcode: bool,
    is_call_or_staticcall: bool,
) -> u64 {
    let transfers_value = value != U256::default();

    let call_gas = if SPEC::enabled(BERLIN) {
        if is_cold {
            COLD_ACCOUNT_ACCESS_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else if SPEC::enabled(TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        700
    } else {
        40
    };

    call_gas
        + xfer_cost(is_call_or_callcode, transfers_value)
        + new_cost::<SPEC>(is_call_or_staticcall, is_new, transfers_value)
}

#[inline]
pub fn warm_cold_cost<SPEC: Spec>(is_cold: bool, regular_value: u64) -> u64 {
    if SPEC::enabled(BERLIN) {
        if is_cold {
            COLD_ACCOUNT_ACCESS_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else {
        regular_value
    }
}

#[inline]
fn xfer_cost(is_call_or_callcode: bool, transfers_value: bool) -> u64 {
    if is_call_or_callcode && transfers_value {
        CALLVALUE
    } else {
        0
    }
}

#[inline]
fn new_cost<SPEC: Spec>(is_call_or_staticcall: bool, is_new: bool, transfers_value: bool) -> u64 {
    if is_call_or_staticcall {
        // EIP-161: State trie clearing (invariant-preserving alternative)
        if SPEC::enabled(SPURIOUS_DRAGON) {
            if transfers_value && is_new {
                NEWACCOUNT
            } else {
                0
            }
        } else if is_new {
            NEWACCOUNT
        } else {
            0
        }
    } else {
        0
    }
}

#[inline]
pub fn memory_gas(a: usize) -> u64 {
    let a = a as u64;
    MEMORY
        .saturating_mul(a)
        .saturating_add(a.saturating_mul(a) / 512)
}

/// Initial gas that is deducted for transaction to be included.
/// Initial gas contains initial stipend gas, gas for access list and input data.
pub fn initial_tx_gas<SPEC: Spec>(
    input: &[u8],
    is_create: bool,
    access_list: &[(B160, Vec<U256>)],
) -> u64 {
    let mut initial_gas = 0;
    let zero_data_len = input.iter().filter(|v| **v == 0).count() as u64;
    let non_zero_data_len = input.len() as u64 - zero_data_len;

    // initdate stipend
    initial_gas += zero_data_len * TRANSACTION_ZERO_DATA;
    // EIP-2028: Transaction data gas cost reduction
    initial_gas += non_zero_data_len * if SPEC::enabled(ISTANBUL) { 16 } else { 68 };

    // get number of access list account and storages.
    if SPEC::enabled(BERLIN) {
        let accessed_slots = access_list
            .iter()
            .fold(0, |slot_count, (_, slots)| slot_count + slots.len() as u64);
        initial_gas += access_list.len() as u64 * ACCESS_LIST_ADDRESS;
        initial_gas += accessed_slots * ACCESS_LIST_STORAGE_KEY;
    }

    // base stipend
    initial_gas += if is_create {
        if SPEC::enabled(HOMESTEAD) {
            // EIP-2: Homestead Hard-fork Changes
            53000
        } else {
            21000
        }
    } else {
        21000
    };

    // EIP-3860: Limit and meter initcode
    // Initcode stipend for bytecode analysis
    if SPEC::enabled(SHANGHAI) && is_create {
        initial_gas += initcode_cost(input.len() as u64)
    }

    initial_gas
}
