[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSignTransactionParams

# Type Alias: EthSignTransactionParams

> **EthSignTransactionParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L249)

**`Experimental`**

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Properties

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthParams.ts:277](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L277)

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

***

### from

> `readonly` **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L253)

The address from which the transaction is sent from

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:263](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L263)

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:268](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L268)

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

***

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:281](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L281)

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:258](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L258)

The address the transaction is directed to. Optional if
creating a contract

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:272](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L272)

Integer of the value sent with this transaction, in Wei.
