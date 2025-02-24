[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions](../README.md) / EthSignTransactionParams

# Type Alias: EthSignTransactionParams

> **EthSignTransactionParams**: `object`

**`Experimental`**

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Type declaration

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

**`Experimental`**

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

### from

> `readonly` **from**: [`Address`](Address.md)

**`Experimental`**

The address from which the transaction is sent from

### gas?

> `readonly` `optional` **gas**: `bigint`

**`Experimental`**

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

**`Experimental`**

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

### nonce?

> `readonly` `optional` **nonce**: `bigint`

**`Experimental`**

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

**`Experimental`**

The address the transaction is directed to. Optional if
creating a contract

### value?

> `readonly` `optional` **value**: `bigint`

**`Experimental`**

Integer of the value sent with this transaction, in Wei.

## Defined in

packages/actions/types/eth/EthParams.d.ts:232
