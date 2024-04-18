**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / ForkStateManagerOpts

# Interface: ForkStateManagerOpts

## Properties

### blockTag?

> **`optional`** **blockTag**: `bigint` \| [`BlockTag`](../type-aliases/BlockTag.md)

#### Source

packages/state/types/ForkStateManager.d.ts:11

***

### onCommit()?

> **`optional`** **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`ForkStateManager`](../../state/classes/ForkStateManager.md)

#### Returns

`void`

#### Source

packages/state/types/ForkStateManager.d.ts:15

***

### url

> **url**: `string`

#### Source

packages/state/types/ForkStateManager.d.ts:10
