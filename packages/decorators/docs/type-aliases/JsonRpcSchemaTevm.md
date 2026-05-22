[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaTevm

# Type Alias: JsonRpcSchemaTevm

> **JsonRpcSchemaTevm** = `object`

Defined in: [eip1193/JsonRpcSchemaTevm.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L44)

Type definitions for Tevm-specific JSON-RPC methods.
Includes methods for state manipulation, EVM calls, and account management.

## Example

```typescript
import { JsonRpcSchemaTevm } from '@tevm/decorators'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from '@tevm/decorators'

const node = createTevmNode().extend(requestEip1193())

// Execute a call with detailed return data
const result = await node.request({
  method: 'tevm_call',
  params: [{
    to: '0x1234567890123456789012345678901234567890',
    data: '0xa9059cbb000000000000000000000000deadbeefdeadbeefdeadbeefdeadbeefdeadbeef0000000000000000000000000000000000000000000000000de0b6b3a7640000'
  }]
})

// Get the state of an account
const account = await node.request({
  method: 'tevm_getAccount',
  params: [{ address: '0x1234567890123456789012345678901234567890' }]
})
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="tevm_call"></a> `tevm_call` | `object` | **Description** A versatile way of executing an EVM call with many options and detailed return data **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })}) // => { data: '0x...', events: [{...}], ... }` | [eip1193/JsonRpcSchemaTevm.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L52) |
| `tevm_call.Method` | `"tevm_call"` | - | [eip1193/JsonRpcSchemaTevm.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L53) |
| `tevm_call.Parameters` | `CallJsonRpcRequest`\[`"params"`\] | - | [eip1193/JsonRpcSchemaTevm.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L54) |
| `tevm_call.ReturnType` | `SerializeToJson`\<`CallResult`\<`never`\>\> | - | [eip1193/JsonRpcSchemaTevm.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L55) |
| <a id="tevm_dumpstate"></a> `tevm_dumpState` | `object` | **Description** Dumps the current cached state of the EVM. **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_dumpState' })})` | [eip1193/JsonRpcSchemaTevm.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L75) |
| `tevm_dumpState.Method` | `"tevm_dumpState"` | - | [eip1193/JsonRpcSchemaTevm.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L76) |
| `tevm_dumpState.Parameters?` | `DumpStateJsonRpcRequest`\[`"params"`\] | - | [eip1193/JsonRpcSchemaTevm.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L77) |
| `tevm_dumpState.ReturnType` | `SerializeToJson`\<`DumpStateResult`\<`never`\>\> | - | [eip1193/JsonRpcSchemaTevm.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L78) |
| <a id="tevm_getaccount"></a> `tevm_getAccount` | `object` | **Description** Returns the account state of the given address **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])})` | [eip1193/JsonRpcSchemaTevm.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L86) |
| `tevm_getAccount.Method` | `"tevm_getAccount"` | - | [eip1193/JsonRpcSchemaTevm.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L87) |
| `tevm_getAccount.Parameters` | `GetAccountJsonRpcRequest`\[`"params"`\] | - | [eip1193/JsonRpcSchemaTevm.ts:88](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L88) |
| `tevm_getAccount.ReturnType` | `SerializeToJson`\<`GetAccountResult`\<`never`\>\> | - | [eip1193/JsonRpcSchemaTevm.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L89) |
| <a id="tevm_loadstate"></a> `tevm_loadState` | `object` | **Description** Loads the provided state into the EVM **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])}) // => { success: true }` | [eip1193/JsonRpcSchemaTevm.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L64) |
| `tevm_loadState.Method` | `"tevm_loadState"` | - | [eip1193/JsonRpcSchemaTevm.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L65) |
| `tevm_loadState.Parameters` | `LoadStateJsonRpcRequest`\[`"params"`\] | - | [eip1193/JsonRpcSchemaTevm.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L66) |
| `tevm_loadState.ReturnType` | `SerializeToJson`\<`LoadStateResult`\<`never`\>\> | - | [eip1193/JsonRpcSchemaTevm.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L67) |
| <a id="tevm_mine"></a> `tevm_mine` | `object` | **Description** Mines one or more blocks. **Link** https://tevm.sh/learn/json-rpc/#tevm-methods | [eip1193/JsonRpcSchemaTevm.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L106) |
| `tevm_mine.Method` | `"tevm_mine"` | - | [eip1193/JsonRpcSchemaTevm.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L107) |
| `tevm_mine.Parameters` | `MineJsonRpcRequest`\[`"params"`\] | - | [eip1193/JsonRpcSchemaTevm.ts:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L108) |
| `tevm_mine.ReturnType` | `SerializeToJson`\<`MineResult`\> | - | [eip1193/JsonRpcSchemaTevm.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L109) |
| <a id="tevm_setaccount"></a> `tevm_setAccount` | `object` | **Description** Sets the account state of the given address **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])}) r` | [eip1193/JsonRpcSchemaTevm.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L97) |
| `tevm_setAccount.Method` | `"tevm_setAccount"` | - | [eip1193/JsonRpcSchemaTevm.ts:98](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L98) |
| `tevm_setAccount.Parameters` | `SetAccountJsonRpcRequest`\[`"params"`\] | - | [eip1193/JsonRpcSchemaTevm.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L99) |
| `tevm_setAccount.ReturnType` | `SerializeToJson`\<`SetAccountResult`\<`never`\>\> | - | [eip1193/JsonRpcSchemaTevm.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L100) |
