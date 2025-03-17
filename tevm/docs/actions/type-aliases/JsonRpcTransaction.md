[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcTransaction

# Type Alias: JsonRpcTransaction

> **JsonRpcTransaction**: `object`

Defined in: packages/actions/dist/index.d.ts:3719

the transaction call object for methods like `eth_call`

## Type declaration

### data?

> `optional` **data**: [`Hex`](../../index/type-aliases/Hex.md)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

### from?

> `optional` **from**: [`Address`](../../index/type-aliases/Address.md)

The address from which the transaction is sent

### gas?

> `optional` **gas**: [`Hex`](../../index/type-aliases/Hex.md)

The integer of gas provided for the transaction execution

### gasPrice?

> `optional` **gasPrice**: [`Hex`](../../index/type-aliases/Hex.md)

The integer of gasPrice used for each paid gas encoded as hexadecimal

### to?

> `optional` **to**: [`Address`](../../index/type-aliases/Address.md)

The address to which the transaction is addressed

### value?

> `optional` **value**: [`Hex`](../../index/type-aliases/Hex.md)

The integer of value sent with this transaction encoded as hexadecimal
