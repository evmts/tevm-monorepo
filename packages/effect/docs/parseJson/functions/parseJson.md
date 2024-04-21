**@tevm/effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [parseJson](../README.md) > parseJson

# Function: parseJson()

> **parseJson**(`jsonStr`): `Effect`\<`never`, [`ParseJsonError`](../classes/ParseJsonError.md), `unknown`\>

Parses a json string

## Parameters

▪ **jsonStr**: `string`

## Returns

## Throws

when the tevm.json file is not valid json

## Example

```ts
const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@tevm/ts-plugin" }] } }')
````
@internal

## Source

[packages/effect/src/parseJson.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L33)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
