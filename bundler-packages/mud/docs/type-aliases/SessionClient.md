[**@tevm/mud**](../README.md)

***

[@tevm/mud](../globals.md) / SessionClient

# Type Alias: SessionClient

> **SessionClient** = `BundlerClient`\<`Transport`, `Chain`, `SmartAccount`, `Client`\> & `object`

Defined in: [types.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/types.ts#L4)

## Type Declaration

### userAddress

> `readonly` **userAddress**: `Address`

### writeContract()

> **writeContract**: (`args`) => `Promise`\<`WriteContractReturnType`\>

#### Parameters

##### args

`WriteContractParameters`

#### Returns

`Promise`\<`WriteContractReturnType`\>
