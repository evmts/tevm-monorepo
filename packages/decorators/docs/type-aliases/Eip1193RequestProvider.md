[**@tevm/decorators**](../README.md) • **Docs**

***

[@tevm/decorators](../globals.md) / Eip1193RequestProvider

# Type alias: Eip1193RequestProvider

> **Eip1193RequestProvider**: `object`

The default EIP1193 compatable provider request method with enabled tevm methods.

## Type declaration

### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)\<[`...PublicRpcSchema`, ...TestRpcSchema\<"anvil" \| "ganache" \| "hardhat"\>, [`JsonRpcSchemaTevm`](JsonRpcSchemaTevm.md)\[`"tevm_call"`\], [`JsonRpcSchemaTevm`](JsonRpcSchemaTevm.md)\[`"tevm_script"`\], [`JsonRpcSchemaTevm`](JsonRpcSchemaTevm.md)\[`"tevm_dumpState"`\], [`JsonRpcSchemaTevm`](JsonRpcSchemaTevm.md)\[`"tevm_loadState"`\], [`JsonRpcSchemaTevm`](JsonRpcSchemaTevm.md)\[`"tevm_getAccount"`\], [`JsonRpcSchemaTevm`](JsonRpcSchemaTevm.md)\[`"tevm_setAccount"`\]]\>

## Source

[request/Eip1193RequestProvider.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/request/Eip1193RequestProvider.ts#L12)
