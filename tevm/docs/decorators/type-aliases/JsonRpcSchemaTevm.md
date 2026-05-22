[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaTevm

# Type Alias: JsonRpcSchemaTevm

> **JsonRpcSchemaTevm** = `object`

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

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="tevm_call"></a> `tevm_call` | `object` | **Description** A versatile way of executing an EVM call with many options and detailed return data **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })}) // => { data: '0x...', events: [{...}], ... }` |
| `tevm_call.Method` | `"tevm_call"` | - |
| `tevm_call.Parameters` | [`CallJsonRpcRequest`](../../actions/type-aliases/CallJsonRpcRequest.md)\[`"params"`\] | - |
| `tevm_call.ReturnType` | [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`CallResult`](../../actions/type-aliases/CallResult.md)\<`never`\>\> | - |
| <a id="tevm_dumpstate"></a> `tevm_dumpState` | `object` | **Description** Dumps the current cached state of the EVM. **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_dumpState' })})` |
| `tevm_dumpState.Method` | `"tevm_dumpState"` | - |
| `tevm_dumpState.Parameters?` | [`DumpStateJsonRpcRequest`](../../actions/type-aliases/DumpStateJsonRpcRequest.md)\[`"params"`\] | - |
| `tevm_dumpState.ReturnType` | [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`DumpStateResult`](../../actions/type-aliases/DumpStateResult.md)\<`never`\>\> | - |
| <a id="tevm_getaccount"></a> `tevm_getAccount` | `object` | **Description** Returns the account state of the given address **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])})` |
| `tevm_getAccount.Method` | `"tevm_getAccount"` | - |
| `tevm_getAccount.Parameters` | [`GetAccountJsonRpcRequest`](../../actions/type-aliases/GetAccountJsonRpcRequest.md)\[`"params"`\] | - |
| `tevm_getAccount.ReturnType` | [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`GetAccountResult`](../../actions/type-aliases/GetAccountResult.md)\<`never`\>\> | - |
| <a id="tevm_loadstate"></a> `tevm_loadState` | `object` | **Description** Loads the provided state into the EVM **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])}) // => { success: true }` |
| `tevm_loadState.Method` | `"tevm_loadState"` | - |
| `tevm_loadState.Parameters` | [`LoadStateJsonRpcRequest`](../../actions/type-aliases/LoadStateJsonRpcRequest.md)\[`"params"`\] | - |
| `tevm_loadState.ReturnType` | [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`LoadStateResult`](../../actions/type-aliases/LoadStateResult.md)\<`never`\>\> | - |
| <a id="tevm_mine"></a> `tevm_mine` | `object` | **Description** Mines one or more blocks. **Link** https://tevm.sh/learn/json-rpc/#tevm-methods |
| `tevm_mine.Method` | `"tevm_mine"` | - |
| `tevm_mine.Parameters` | [`MineJsonRpcRequest`](../../actions/type-aliases/MineJsonRpcRequest.md)\[`"params"`\] | - |
| `tevm_mine.ReturnType` | [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`MineResult`](../../actions/type-aliases/MineResult.md)\> | - |
| <a id="tevm_setaccount"></a> `tevm_setAccount` | `object` | **Description** Sets the account state of the given address **Link** https://tevm.sh/learn/json-rpc/#tevm-methods **Example** `provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])}) r` |
| `tevm_setAccount.Method` | `"tevm_setAccount"` | - |
| `tevm_setAccount.Parameters` | [`SetAccountJsonRpcRequest`](../../actions/type-aliases/SetAccountJsonRpcRequest.md)\[`"params"`\] | - |
| `tevm_setAccount.ReturnType` | [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`SetAccountResult`](../../actions/type-aliases/SetAccountResult.md)\<`never`\>\> | - |
