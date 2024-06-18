---
editUrl: false
next: false
prev: false
title: "parseJson"
---

> **parseJson**(`jsonStr`): `Effect`\<`never`, [`ParseJsonError`](/reference/tevm/effect/parsejson/classes/parsejsonerror/), `unknown`\>

Parses a json string

## Parameters

• **jsonStr**: `string`

## Returns

`Effect`\<`never`, [`ParseJsonError`](/reference/tevm/effect/parsejson/classes/parsejsonerror/), `unknown`\>

## Throws

when the tevm.json file is not valid json

## Example

```ts
const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@tevm/ts-plugin" }] } }')
````
@internal

## Source

[packages/effect/src/parseJson.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/parseJson.js#L33)
