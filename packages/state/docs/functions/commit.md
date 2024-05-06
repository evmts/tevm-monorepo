**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > commit

# Function: commit()

> **commit**(`baseState`): (`createNewStateRoot`?) => `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`createNewStateRoot`?): `Promise`\<`void`\>
>
> Commits the current state.
>
> ### Parameters
>
> ▪ **createNewStateRoot?**: `boolean`
>
> Whether to create a new state root
> Defaults to true.
> This api is not stable
>
> ### Source
>
> [packages/state/src/StateManager.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L32)
>

## Source

[packages/state/src/actions/commit.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/commit.js#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
