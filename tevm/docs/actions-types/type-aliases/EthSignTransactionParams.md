**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > EthSignTransactionParams

# Type alias: EthSignTransactionParams

> **EthSignTransactionParams**: `object`

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Type declaration

### data

> **data**?: [`Hex`](Hex.md)

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

### from

> **from**: [`Address`](Address.md)

The address from which the transaction is sent from

### gas

> **gas**?: `bigint`

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

### gasPrice

> **gasPrice**?: `bigint`

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

### nonce

> **nonce**?: `bigint`

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

### to

> **to**?: [`Address`](Address.md)

The address the transaction is directed to. Optional if
creating a contract

### value

> **value**?: `bigint`

Integer of the value sent with this transaction, in Wei.

## Source

packages/actions-types/types/params/EthParams.d.ts:232

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
