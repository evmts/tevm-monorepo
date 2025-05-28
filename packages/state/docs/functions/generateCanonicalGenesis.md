[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / generateCanonicalGenesis

# Function: generateCanonicalGenesis()

> **generateCanonicalGenesis**(`baseState`, `skipFetchingFromFork?`): (`state`) => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/generateCannonicalGenesis.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/generateCannonicalGenesis.js#L12)

Loads a [TevmState](../type-aliases/TevmState.md) into the state manager

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`state`): `Promise`\<`void`\>

Loads a state from a given state root

### Parameters

#### state

[`TevmState`](../type-aliases/TevmState.md)

### Returns

`Promise`\<`void`\>
