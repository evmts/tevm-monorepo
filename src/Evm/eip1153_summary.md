# EIP-1153: Transient Storage

## Summary

EIP-1153 introduces two new opcodes: `TLOAD` and `TSTORE`, which enable **transient storage** in the EVM. Transient storage provides a way to store data that persists only for the duration of the current transaction and is automatically cleared afterward. This is in contrast to regular storage (`SLOAD`/`SSTORE`), which persists across transactions and is stored in the blockchain state.

## Key Features

1. **Transaction-bounded:** Data in transient storage only persists for the duration of a single transaction, including all internal calls made during that transaction.

2. **Cost efficiency:** Transient storage operations are cheaper than regular storage operations since they don't modify the blockchain state.

3. **No refunds:** Unlike `SSTORE`, which has complex gas refund mechanics, transient storage has no refund mechanics, simplifying gas cost calculations.

4. **No pre-warming:** Unlike regular storage slots accessed via `SLOAD`/`SSTORE`, transient storage cells don't need to be pre-warmed for EIP-2929 gas cost reductions.

## Opcodes Introduced

1. **TLOAD** (0x5C)
   - Takes a 32-byte key from the stack
   - Returns a 32-byte value from transient storage for that key
   - Gas cost: 100 gas

2. **TSTORE** (0x5D)
   - Takes a 32-byte key and a 32-byte value from the stack
   - Stores the value in transient storage at the specified key
   - Gas cost: 100 gas

## Use Cases

1. **Re-entrancy locks:** Maintain a re-entrancy counter without paying for persistent storage.

2. **Multi-step calculations:** Store intermediate results across contract calls within the same transaction.

3. **Multicall optimizations:** Share data between multiple calls in a transaction batch without state changes.

4. **Cross-contract communication:** Pass information between contracts during complex call chains without using persistent storage or event logs.

## Benefits

- Reduces gas costs for temporary data
- Simplifies contract logic by providing an additional storage tier
- Enables new patterns for cross-contract communication within a transaction
- Helps avoid storage slot conflicts when using delegate call proxies
- Improves gas efficiency of commonly used patterns like reentrancy guards

## Added in Hardfork

- Cancun (March 2024)