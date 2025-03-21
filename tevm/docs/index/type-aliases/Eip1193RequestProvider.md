[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Eip1193RequestProvider

# Type Alias: Eip1193RequestProvider

> **Eip1193RequestProvider**: `object`

Defined in: packages/decorators/dist/index.d.ts:1819

The default EIP1193 compatable provider request method with enabled tevm methods.

## Type declaration

### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)\<\[`...PublicRpcSchema`, ...TestRpcSchema$1\<"anvil" \| "ganache" \| "hardhat"\>, [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_call"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_dumpState"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_loadState"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_getAccount"`\], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)\[`"tevm_setAccount"`\]\]\>
