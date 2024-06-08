[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / EthCallParams

# Type alias: EthCallParams

> **EthCallParams**: `object`

Based on the JSON-RPC request for `eth_call` procedure

## Type declaration

### blockOverride?

> `optional` `readonly` **blockOverride**: [`BlockOverrideSet`](BlockOverrideSet.md)

The block override set to provide different block values while executing the call

### blockTag?

> `optional` `readonly` **blockTag**: [`BlockParam`](BlockParam.md)

The block number hash or block tag

### data?

> `optional` `readonly` **data**: [`Hex`](Hex.md)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

### from?

> `optional` `readonly` **from**: [`Address`](Address.md)

The address from which the transaction is sent. Defaults to zero address

### gas?

> `optional` `readonly` **gas**: `bigint`

The integer of gas provided for the transaction execution

### gasPrice?

> `optional` `readonly` **gasPrice**: `bigint`

The integer of gasPrice used for each paid gas

### stateOverrideSet?

> `optional` `readonly` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

The state override set to provide different state values while executing the call

### to?

> `optional` `readonly` **to**: [`Address`](Address.md)

The address to which the transaction is addressed. Defaults to zero address

### value?

> `optional` `readonly` **value**: `bigint`

The integer of value sent with this transaction

## Source

[params/EthParams.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L26)
