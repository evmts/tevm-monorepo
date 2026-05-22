[**@tevm/predeploys**](../README.md)

***

[@tevm/predeploys](../globals.md) / Predeploy

# Type Alias: Predeploy\<TName, THumanReadableAbi\>

> **Predeploy**\<`TName`, `THumanReadableAbi`\> = `object`

Defined in: [Predeploy.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L7)

Type of predeploy contract for tevm

## Type Parameters

| Type Parameter |
| ------ |
| `TName` *extends* `string` |
| `THumanReadableAbi` *extends* readonly `string`[] |

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="contract"></a> `contract` | `readonly` | `Contract`\<`TName`, `THumanReadableAbi`, `Address`, `Hex`, `Hex`\> | [Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8) |
| <a id="predeploy"></a> `predeploy` | `readonly` | () => `object` | [Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9) |
