[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handleAutomining

# Function: handleAutomining()

> **handleAutomining**(`client`, `txHash`?, `isGasMining`?): `Promise`\<`undefined` \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

Defined in: [packages/actions/src/Call/handleAutomining.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleAutomining.js#L12)

Runs the mining logic if the client is set to automine or gas mining threshold is reached

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### txHash?

`` `0x${string}` ``

### isGasMining?

`boolean` = `false`

Whether this is being triggered by gas mining

## Returns

`Promise`\<`undefined` \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

undefined if noop, errors if automining fails, blockHashes if automining succeeds

## Throws

returns errors as values
