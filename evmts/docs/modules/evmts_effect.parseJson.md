[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/effect](evmts_effect.md) / parseJson

# Module: parseJson

## Table of contents

### Classes

- [ParseJsonError](../classes/evmts_effect.parseJson.ParseJsonError.md)

### Functions

- [parseJson](evmts_effect.parseJson.md#parsejson)

## Functions

### parseJson

▸ **parseJson**(`jsonStr`): `Effect`\<`never`, [`ParseJsonError`](../classes/evmts_effect.parseJson.ParseJsonError.md), \{ `compilerOptions?`: \{ `plugins`: \{ `name`: `string`  }[]  }  }\>

Parses a json string

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonStr` | `string` |

#### Returns

`Effect`\<`never`, [`ParseJsonError`](../classes/evmts_effect.parseJson.ParseJsonError.md), \{ `compilerOptions?`: \{ `plugins`: \{ `name`: `string`  }[]  }  }\>

**`Throws`**

when the tsconfig.json file is not valid json

**`Example`**

```ts
const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@evmts/ts-plugin" }] } }')
````
@internal

#### Defined in

[packages/effect/src/parseJson.js:33](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/parseJson.js#L33)
