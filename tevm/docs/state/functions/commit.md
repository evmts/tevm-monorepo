**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > commit

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
> packages/state/dist/index.d.ts:137
>

## Source

packages/state/dist/index.d.ts:196

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
