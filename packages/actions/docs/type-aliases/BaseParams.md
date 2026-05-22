[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / BaseParams

# Type Alias: BaseParams\<TThrowOnFail\>

> **BaseParams**\<`TThrowOnFail`\> = `object`

Defined in: [packages/actions/src/common/BaseParams.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BaseParams.ts#L4)

The base parameters shared across all actions

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TThrowOnFail` *extends* `boolean` | `boolean` |

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="throwonfail"></a> `throwOnFail?` | `readonly` | `TThrowOnFail` | Whether to throw on errors or return errors as value on the 'errors' property Defaults to `true` | [packages/actions/src/common/BaseParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BaseParams.ts#L9) |
