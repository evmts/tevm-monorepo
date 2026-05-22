[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugDumpBlockAccountState

# Type Alias: DebugDumpBlockAccountState

> **DebugDumpBlockAccountState** = `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L168)

Account state in debug_dumpBlock result

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="balance"></a> `balance` | [`Hex`](Hex.md) | Account balance in hex | [packages/actions/src/debug/DebugResult.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L172) |
| <a id="code"></a> `code?` | [`Hex`](Hex.md) | Contract code (if present) | [packages/actions/src/debug/DebugResult.ts:188](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L188) |
| <a id="codehash"></a> `codeHash` | [`Hex`](Hex.md) | Account code hash | [packages/actions/src/debug/DebugResult.ts:180](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L180) |
| <a id="nonce"></a> `nonce` | [`Hex`](Hex.md) | Account nonce in hex | [packages/actions/src/debug/DebugResult.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L176) |
| <a id="root"></a> `root` | [`Hex`](Hex.md) | Account storage root | [packages/actions/src/debug/DebugResult.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L184) |
| <a id="storage"></a> `storage?` | `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\> | Account storage | [packages/actions/src/debug/DebugResult.ts:192](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L192) |
