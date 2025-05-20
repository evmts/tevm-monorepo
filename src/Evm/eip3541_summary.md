# EIP-3541: Reject New Contracts Starting With The 0xEF Byte

## Summary

EIP-3541 introduces a simple restriction that rejects new contract creation (deployment) if the contract bytecode begins with the byte `0xEF`. This EIP was introduced as part of the London hard fork.

## Motivation

The motivation behind EIP-3541 was to prepare for a future upgrade to the Ethereum Virtual Machine (EVM) that would add new instructions beginning with the `0xEF` prefix, specifically targeting EVM Object Format (EOF). By rejecting contracts that start with `0xEF`, this EIP reserves this prefix for future upgrades without worrying about backward compatibility with existing deployed contracts.

## Implementation Requirements

1. All new contract creation operations must reject contract creation if the contract bytecode starts with the byte `0xEF`.
2. This applies to both `CREATE` (opcode 0xF0) and `CREATE2` (opcode 0xF5) operations.
3. The EIP must be enabled conditionally based on the chain rules (active from London hard fork onward).
4. When EIP-3541 rejects a contract creation, the operation should return a 0 value (contract creation failure) on the stack.
5. All other aspects of contract creation should continue to work normally if the first byte is not `0xEF`.

## Affected Operations

- `CREATE` (0xF0): Creates a new contract with a deterministic address based on the sender and nonce
- `CREATE2` (0xF5): Creates a new contract with a deterministic address based on a salt value

## Effect on Gas Calculation

This EIP does not modify gas calculation for contract creation. The gas is consumed as usual, even if the contract creation fails due to the `0xEF` first byte check.

## Cross-EIP Interactions

EIP-3541 interacts with:

- **EIP-3860** (Limit and meter initcode): EIP-3860 also modifies contract creation by adding an initcode size limit of 49152 bytes and per-word gas cost. When both EIPs are active, both restrictions (no `0xEF` first byte AND size/gas limits) must be enforced.