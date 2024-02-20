[tevm](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / ForkStateManagerOpts

# Interface: ForkStateManagerOpts

[index](../modules/index.md).ForkStateManagerOpts

## Table of contents

### Properties

- [blockTag](index.ForkStateManagerOpts.md#blocktag)
- [onCommit](index.ForkStateManagerOpts.md#oncommit)
- [url](index.ForkStateManagerOpts.md#url)

## Properties

### blockTag

• `Optional` **blockTag**: `bigint` \| [`BlockTag`](../modules/index.md#blocktag)

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:12

___

### onCommit

• `Optional` **onCommit**: (`stateManager`: [`ForkStateManager`](../classes/state.ForkStateManager.md)) => `void`

Called when state manager commits state

#### Type declaration

▸ (`stateManager`): `void`

Called when state manager commits state

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | [`ForkStateManager`](../classes/state.ForkStateManager.md) |

##### Returns

`void`

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:16

___

### url

• **url**: `string`

#### Defined in

evmts-monorepo/packages/state/types/ForkStateManager.d.ts:11
