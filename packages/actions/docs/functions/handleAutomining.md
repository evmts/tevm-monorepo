[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handleAutomining

# Function: handleAutomining()

> **handleAutomining**(`client`, `txHash`?): `Promise`\<`undefined` \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

Defined in: [packages/actions/src/Call/handleAutomining.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleAutomining.js#L11)

Runs the mining logic if the client is set to automine

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### txHash?

`` `0x${string}` ``

## Returns

`Promise`\<`undefined` \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

undefined if noop, errors if automining fails, blockHashes if automining succeeds

## Throws

returns errors as values
