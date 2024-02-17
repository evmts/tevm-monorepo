[@tevm/state](../README.md) / [Exports](../modules.md) / ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

## Table of contents

### Properties

- [expectedBlockTime](ProxyStateManagerOpts.md#expectedblocktime)
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

### url

• **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Defined in

[packages/state/src/ProxyStateManager.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L31)
