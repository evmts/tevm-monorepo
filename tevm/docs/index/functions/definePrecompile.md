[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TContract`\>(`__namedParameters`): `Precompile`\<`TContract`\>

Defined in: packages/precompiles/dist/index.d.ts:109

## Type Parameters

• **TContract** *extends* [`Contract`](../type-aliases/Contract.md)\<`any`, `any`, `` `0x${string}` ``, `any`, `any`, `any`\> = [`Contract`](../type-aliases/Contract.md)\<`string`, readonly `string`[], `` `0x${string}` ``, `any`, `any`, `any`\>

## Parameters

### \_\_namedParameters

#### call

(`context`) => `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\>

#### contract

`TContract`

## Returns

`Precompile`\<`TContract`\>
