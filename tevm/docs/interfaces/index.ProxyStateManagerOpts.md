[tevm](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

[index](../modules/index.md).ProxyStateManagerOpts

## Table of contents

### Properties

- [expectedBlockTime](index.ProxyStateManagerOpts.md#expectedblocktime)
- [onCommit](index.ProxyStateManagerOpts.md#oncommit)
- [url](index.ProxyStateManagerOpts.md#url)

## Properties

### expectedBlockTime

• `Optional` **expectedBlockTime**: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Defined in

evmts-monorepo/packages/state/types/ProxyStateManager.d.ts:20

___

### onCommit

• `Optional` **onCommit**: (`stateManager`: [`ProxyStateManager`](../classes/state.ProxyStateManager.md)) => `void`

Called when state manager commits state

#### Type declaration

▸ (`stateManager`): `void`

Called when state manager commits state

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | [`ProxyStateManager`](../classes/state.ProxyStateManager.md) |

##### Returns

`void`

#### Defined in

evmts-monorepo/packages/state/types/ProxyStateManager.d.ts:24

___

### url

• **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Defined in

evmts-monorepo/packages/state/types/ProxyStateManager.d.ts:14
