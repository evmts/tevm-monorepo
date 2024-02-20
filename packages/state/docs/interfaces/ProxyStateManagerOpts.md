[@tevm/state](../README.md) / [Exports](../modules.md) / ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

## Table of contents

### Properties

- [expectedBlockTime](ProxyStateManagerOpts.md#expectedblocktime)
- [onCommit](ProxyStateManagerOpts.md#oncommit)
- [url](ProxyStateManagerOpts.md#url)

## Properties

### expectedBlockTime

• `Optional` **expectedBlockTime**: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Defined in

[packages/state/src/ProxyStateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L37)

___

### onCommit

• `Optional` **onCommit**: (`stateManager`: [`ProxyStateManager`](../classes/ProxyStateManager.md)) => `void`

Called when state manager commits state

#### Type declaration

▸ (`stateManager`): `void`

Called when state manager commits state

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateManager` | [`ProxyStateManager`](../classes/ProxyStateManager.md) |

##### Returns

`void`

#### Defined in

[packages/state/src/ProxyStateManager.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L41)

___

### url

• **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Defined in

[packages/state/src/ProxyStateManager.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L31)
