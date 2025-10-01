[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcTransaction

# Type Alias: JsonRpcTransaction

> **JsonRpcTransaction** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L10)

the transaction call object for methods like `eth_call`

## Properties

### data?

> `optional` **data**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L34)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

***

### from?

> `optional` **from**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L14)

The address from which the transaction is sent

***

### gas?

> `optional` **gas**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L22)

The integer of gas provided for the transaction execution

***

### gasPrice?

> `optional` **gasPrice**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L26)

The integer of gasPrice used for each paid gas encoded as hexadecimal

***

### nonce?

> `optional` **nonce**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L38)

The integer of the nonce. If not provided a nonce will automatically be generated

***

### to?

> `optional` **to**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L18)

The address to which the transaction is addressed

***

### value?

> `optional` **value**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L30)

The integer of value sent with this transaction encoded as hexadecimal
