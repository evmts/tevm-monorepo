[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / EthCallParams

# Type alias: EthCallParams

> **EthCallParams**: `object`

Based on the JSON-RPC request for `eth_call` procedure

## Type declaration

### blockOverride?

> `optional` **blockOverride**: [`BlockOverrideSet`](BlockOverrideSet.md)

The block override set to provide different block values while executing the call

### blockTag?

> `optional` **blockTag**: [`BlockParam`](BlockParam.md)

The block number hash or block tag

### data?

> `optional` **data**: [`Hex`](Hex.md)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

### from?

> `optional` **from**: [`Address`](Address.md)

The address from which the transaction is sent. Defaults to zero address

### gas?

> `optional` **gas**: `bigint`

The integer of gas provided for the transaction execution

### gasPrice?

> `optional` **gasPrice**: `bigint`

The integer of gasPrice used for each paid gas

### stateOverrideSet?

> `optional` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

The state override set to provide different state values while executing the call

### to?

> `optional` **to**: [`Address`](Address.md)

The address to which the transaction is addressed. Defaults to zero address

### value?

> `optional` **value**: `bigint`

The integer of value sent with this transaction

## Source

[params/EthParams.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L26)
