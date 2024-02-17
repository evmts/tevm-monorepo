[@tevm/effect](../README.md) / [Modules](../modules.md) / parseJson

# Module: parseJson

## Table of contents

### Classes

- [ParseJsonError](../classes/parseJson.ParseJsonError.md)

### Functions

- [parseJson](parseJson.md#parsejson)

## Functions

### parseJson

▸ **parseJson**(`jsonStr`): `Effect`\<`never`, [`ParseJsonError`](../classes/parseJson.ParseJsonError.md), `unknown`\>

Parses a json string

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonStr` | `string` |

#### Returns

`Effect`\<`never`, [`ParseJsonError`](../classes/parseJson.ParseJsonError.md), `unknown`\>

**`Throws`**

when the tevm.json file is not valid json

**`Example`**

```ts
const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@tevm/ts-plugin" }] } }')
````
@internal

#### Defined in

[evmts-monorepo/packages/effect/src/parseJson.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L33)
