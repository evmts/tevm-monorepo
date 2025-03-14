[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handleGasMining

# Function: handleGasMining()

> **handleGasMining**(`client`, `txHash`): `Promise`\<`undefined` \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

Defined in: [packages/actions/src/Call/handleGasMining.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleGasMining.js#L11)

Handle gas mining based on gas threshold configuration

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### txHash

Transaction hash that triggered gas mining

`undefined` | `` `0x${string}` ``

## Returns

`Promise`\<`undefined` \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](../type-aliases/TevmMineError.md)[]; \}\>

## Throws

returns errors as values
