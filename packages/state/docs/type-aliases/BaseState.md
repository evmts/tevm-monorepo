[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / BaseState

# Type Alias: BaseState

> **BaseState** = `object`

Defined in: [tevm-monorepo/packages/state/src/BaseState.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L9)

**`Internal`**

The core data structure powering the state manager internally

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="caches"></a> `caches` | [`StateCache`](StateCache.md) | - | [tevm-monorepo/packages/state/src/BaseState.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L18) |
| <a id="forkcache"></a> `forkCache` | [`StateCache`](StateCache.md) | - | [tevm-monorepo/packages/state/src/BaseState.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L20) |
| <a id="getcurrentstateroot"></a> `getCurrentStateRoot` | () => `Hex` | - | [tevm-monorepo/packages/state/src/BaseState.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L29) |
| <a id="logger"></a> `logger` | `Logger` | - | [tevm-monorepo/packages/state/src/BaseState.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L12) |
| <a id="options"></a> `options` | [`StateOptions`](StateOptions.md) | - | [tevm-monorepo/packages/state/src/BaseState.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L17) |
| <a id="ready"></a> `ready` | () => `Promise`\<`true`\> | - | [tevm-monorepo/packages/state/src/BaseState.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L11) |
| <a id="setcurrentstateroot"></a> `setCurrentStateRoot` | (`newStateRoot`) => `void` | - | [tevm-monorepo/packages/state/src/BaseState.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L30) |
| <a id="stateroots"></a> `stateRoots` | [`StateRoots`](StateRoots.md) | Mapping of hashes to State roots | [tevm-monorepo/packages/state/src/BaseState.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L16) |
| <a id="tombstones"></a> `tombstones` | `object` | - | [tevm-monorepo/packages/state/src/BaseState.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L21) |
| `tombstones.accounts` | `Set`\<`string`\> | - | [tevm-monorepo/packages/state/src/BaseState.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L22) |
| `tombstones.checkpoints` | `object`[] | - | [tevm-monorepo/packages/state/src/BaseState.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L24) |
| `tombstones.storageCleared` | `Set`\<`string`\> | - | [tevm-monorepo/packages/state/src/BaseState.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L23) |
