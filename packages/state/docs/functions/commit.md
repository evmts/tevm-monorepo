[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / commit

# Function: commit()

> **commit**(`baseState`, `skipFetchingFromFork`?): (`createNewStateRoot`?) => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/commit.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/commit.js#L9)

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

Commits the current state.

### Parameters

#### createNewStateRoot?

`boolean`

**`Experimental`**

Whether to create a new state root
Defaults to true.
This api is not stable

### Returns

`Promise`\<`void`\>
