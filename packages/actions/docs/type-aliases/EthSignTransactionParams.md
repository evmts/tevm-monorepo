[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSignTransactionParams

# Type Alias: EthSignTransactionParams

> **EthSignTransactionParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L280)

**`Experimental`**

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Properties

### data?

> `readonly` `optional` **data**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthParams.ts:308](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L308)

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

***

### from

> `readonly` **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:284](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L284)

The address from which the transaction is sent from

***

### gas?

> `readonly` `optional` **gas**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:294](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L294)

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

***

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:299](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L299)

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

***

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:312](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L312)

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

***

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:289](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L289)

The address the transaction is directed to. Optional if
creating a contract

***

### value?

> `readonly` `optional` **value**: `bigint`

Defined in: [packages/actions/src/eth/EthParams.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L303)

Integer of the value sent with this transaction, in Wei.
