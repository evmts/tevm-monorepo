[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / JsonRpcTransaction

# Type Alias: JsonRpcTransaction

> **JsonRpcTransaction**: `object`

the transaction call object for methods like `eth_call`

## Type declaration

### data?

> `optional` **data**: `Hex`

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

### from

> **from**: `Address`

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

## Defined in

[procedures/src/eth/EthJsonRpcRequest.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/eth/EthJsonRpcRequest.ts#L9)
