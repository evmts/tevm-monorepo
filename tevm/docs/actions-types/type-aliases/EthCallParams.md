**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > EthCallParams

# Type alias: EthCallParams

> **EthCallParams**: `object`

Based on the JSON-RPC request for `eth_call` procedure

## Type declaration

### blockOverride

> **blockOverride**?: [`BlockOverrideSet`](BlockOverrideSet.md)

The block override set to provide different block values while executing the call

### blockTag

> **blockTag**?: [`BlockParam`](../../index/type-aliases/BlockParam.md)

The block number hash or block tag

### data

> **data**?: [`Hex`](Hex.md)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

### from

> **from**?: [`Address`](Address.md)

The address from which the transaction is sent. Defaults to zero address

### gas

> **gas**?: `bigint`

The integer of gas provided for the transaction execution

### gasPrice

> **gasPrice**?: `bigint`

The integer of gasPrice used for each paid gas

### stateOverrideSet

> **stateOverrideSet**?: [`StateOverrideSet`](StateOverrideSet.md)

The state override set to provide different state values while executing the call

### to

> **to**?: [`Address`](Address.md)

The address to which the transaction is addressed. Defaults to zero address

### value

> **value**?: `bigint`

The integer of value sent with this transaction

## Source

packages/actions-types/types/params/EthParams.d.ts:14

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
