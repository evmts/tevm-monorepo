[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [parseJson](../README.md) / parseJson

# Function: parseJson()

> **parseJson**(`jsonStr`): `Effect`\<`unknown`, [`ParseJsonError`](../classes/ParseJsonError.md), `never`\>

Defined in: packages/effect/src/parseJson.js:33

Parses a json string

## Parameters

### jsonStr

`string`

## Returns

`Effect`\<`unknown`, [`ParseJsonError`](../classes/ParseJsonError.md), `never`\>

## Throws

when the tevm.json file is not valid json

## Example

```ts
const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@tevm/ts-plugin" }] } }')
````
@internal
