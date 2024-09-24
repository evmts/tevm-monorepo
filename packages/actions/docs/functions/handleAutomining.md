[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / handleAutomining

# Function: handleAutomining()

> **handleAutomining**(`client`, `txHash`?): `Promise`\<`undefined` \| `object`\>

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **txHash?**: \`0x$\{string\}\`

## Returns

`Promise`\<`undefined` \| `object`\>

undefined if noop, errors if automining fails, blockHashes if automining succeeds

## Defined in

[packages/actions/src/Call/handleAutomining.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleAutomining.js#L11)
