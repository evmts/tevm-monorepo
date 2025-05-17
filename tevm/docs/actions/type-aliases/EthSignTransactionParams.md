[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSignTransactionParams

# Type Alias: EthSignTransactionParams

> **EthSignTransactionParams** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:232

**`Experimental`**

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Properties

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:260

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

***

### from

> `readonly` **from**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:236

The address from which the transaction is sent from

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:246

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:251

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

***

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:264

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:241

The address the transaction is directed to. Optional if
creating a contract

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: packages/actions/types/eth/EthParams.d.ts:255

Integer of the value sent with this transaction, in Wei.
