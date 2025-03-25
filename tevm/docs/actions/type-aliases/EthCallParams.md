[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthCallParams

# Type Alias: EthCallParams

> **EthCallParams** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:14

Based on the JSON-RPC request for `eth_call` procedure

## Properties

### blockOverride?

> `readonly` `optional` **blockOverride**: [`BlockOverrideSet`](BlockOverrideSet.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:51

The block override set to provide different block values while executing the call

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:43

The block number hash or block tag

***

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:39

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

***

### from?

> `readonly` `optional` **from**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:18

The address from which the transaction is sent. Defaults to zero address

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:26

The integer of gas provided for the transaction execution

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:30

The integer of gasPrice used for each paid gas

***

### stateOverrideSet?

> `readonly` `optional` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:47

The state override set to provide different state values while executing the call

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:22

The address to which the transaction is addressed. Defaults to zero address

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:34

The integer of value sent with this transaction
