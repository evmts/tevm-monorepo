**@tevm/state** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/state](../README.md) / ForkStateManagerOpts

# Interface: ForkStateManagerOpts

## Properties

### blockTag?

> **`optional`** **blockTag**: `bigint` \| `BlockTag`

#### Source

[packages/state/src/ForkStateManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ForkStateManager.ts#L28)

***

### onCommit()?

> **`optional`** **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`ForkStateManager`](../classes/ForkStateManager.md)

#### Returns

`void`

#### Source

[packages/state/src/ForkStateManager.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ForkStateManager.ts#L32)

***

### url

> **url**: `string`

#### Source

[packages/state/src/ForkStateManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ForkStateManager.ts#L27)
