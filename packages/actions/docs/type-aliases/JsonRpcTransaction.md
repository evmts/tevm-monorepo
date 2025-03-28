[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcTransaction

# Type Alias: JsonRpcTransaction

> **JsonRpcTransaction**: `object`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L11)

the transaction call object for methods like `eth_call`

## Type declaration

### data?

> `optional` **data**: `Hex`

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

### from?

> `optional` **from**: `Address`

The address from which the transaction is sent

### gas?

> `optional` **gas**: `Hex`

The integer of gas provided for the transaction execution

### gasPrice?

> `optional` **gasPrice**: `Hex`

The integer of gasPrice used for each paid gas encoded as hexadecimal

### to?

> `optional` **to**: `Address`

The address to which the transaction is addressed

### value?

> `optional` **value**: `Hex`

The integer of value sent with this transaction encoded as hexadecimal
