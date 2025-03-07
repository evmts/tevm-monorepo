[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthCallParams

# Type Alias: EthCallParams

> **EthCallParams**: `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:14

Based on the JSON-RPC request for `eth_call` procedure

## Type declaration

### blockOverride?

> `readonly` `optional` **blockOverride**: [`BlockOverrideSet`](BlockOverrideSet.md)

The block override set to provide different block values while executing the call

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

The block number hash or block tag

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

### from?

> `readonly` `optional` **from**: [`Address`](Address.md)

The address from which the transaction is sent. Defaults to zero address

### gas?

> `readonly` `optional` **gas**: `bigint`

The integer of gas provided for the transaction execution

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

The integer of gasPrice used for each paid gas

### stateOverrideSet?

> `readonly` `optional` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

The state override set to provide different state values while executing the call

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

The address to which the transaction is addressed. Defaults to zero address

### value?

> `readonly` `optional` **value**: `bigint`

The integer of value sent with this transaction
