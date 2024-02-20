[@tevm/state](../README.md) / [Exports](../modules.md) / ForkStateManagerOpts

# Interface: ForkStateManagerOpts

## Table of contents

### Properties

- [blockTag](ForkStateManagerOpts.md#blocktag)
- [onCommit](ForkStateManagerOpts.md#oncommit)
- [url](ForkStateManagerOpts.md#url)

## Properties

### blockTag

• `Optional` **blockTag**: `bigint` \| `BlockTag`

#### Defined in

[packages/state/src/ForkStateManager.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ForkStateManager.ts#L29)

___

### onCommit

• `Optional` **onCommit**: (`stateManager`: [`ForkStateManager`](../classes/ForkStateManager.md)) => `void`

Called when state manager commits state

#### Type declaration

▸ (`stateManager`): `void`

Called when state manager commits state

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | [`ForkStateManager`](../classes/ForkStateManager.md) |

##### Returns

`void`

#### Defined in

[packages/state/src/ForkStateManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ForkStateManager.ts#L33)

___

### url

• **url**: `string`

#### Defined in

[packages/state/src/ForkStateManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ForkStateManager.ts#L28)
