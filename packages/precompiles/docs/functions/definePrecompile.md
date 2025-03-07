[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TContract`\>(`__namedParameters`): `Precompile`\<`TContract`\>

Defined in: [definePrecompile.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/definePrecompile.ts#L6)

## Type Parameters

• **TContract** *extends* `Contract`\<`any`, `any`, `` `0x${string}` ``, `any`, `any`, `any`\> = `Contract`\<`string`, readonly `string`[], `` `0x${string}` ``, `any`, `any`, `any`\>

## Parameters

### \_\_namedParameters

#### call

(`context`) => `Promise`\<`ExecResult`\>

#### contract

`TContract`

## Returns

`Precompile`\<`TContract`\>
