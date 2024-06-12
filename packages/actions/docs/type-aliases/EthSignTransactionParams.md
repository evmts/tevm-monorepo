[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / EthSignTransactionParams

# Type alias: EthSignTransactionParams

`Experimental`

> **EthSignTransactionParams**: `object`

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Type declaration

### data?

> `optional` `readonly` **data**: [`Hex`](Hex.md)

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

### from

> `readonly` **from**: [`Address`](Address.md)

The address from which the transaction is sent from

### gas?

> `optional` `readonly` **gas**: `bigint`

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

### gasPrice?

> `optional` `readonly` **gasPrice**: `bigint`

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

### nonce?

> `optional` `readonly` **nonce**: `bigint`

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

### to?

> `optional` `readonly` **to**: [`Address`](Address.md)

The address the transaction is directed to. Optional if
creating a contract

### value?

> `optional` `readonly` **value**: `bigint`

Integer of the value sent with this transaction, in Wei.

## Source

[packages/actions/src/eth/EthParams.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L249)
