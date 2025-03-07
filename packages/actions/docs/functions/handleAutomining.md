[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / handleAutomining

# Function: handleAutomining()

> **handleAutomining**(`client`, `txHash`?): `Promise`\<`undefined` \| `object`\>

Runs the mining logic if the client is set to automine

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **txHash?**: \`0x$\{string\}\`

## Returns

`Promise`\<`undefined` \| `object`\>

undefined if noop, errors if automining fails, blockHashes if automining succeeds

## Throws

returns errors as values

## Defined in

[packages/actions/src/Call/handleAutomining.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleAutomining.js#L11)
