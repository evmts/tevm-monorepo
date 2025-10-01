[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaTevm

# Type Alias: JsonRpcSchemaTevm

> **JsonRpcSchemaTevm** = `object`

Defined in: packages/decorators/dist/index.d.ts:1367

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

### tevm\_call

> **tevm\_call**: `object`

Defined in: packages/decorators/dist/index.d.ts:1375

#### Method

> **Method**: `"tevm_call"`

#### Parameters

> **Parameters**: [`CallJsonRpcRequest`](../../actions/type-aliases/CallJsonRpcRequest.md)\[`"params"`\]

#### ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`CallResult`](../../actions/type-aliases/CallResult.md)\<`never`\>\>

#### Description

A versatile way of executing an EVM call with many options and detailed return data

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })})
// => { data: '0x...', events: [{...}], ... }
```

***

### tevm\_dumpState

> **tevm\_dumpState**: `object`

Defined in: packages/decorators/dist/index.d.ts:1398

#### Method

> **Method**: `"tevm_dumpState"`

#### Parameters?

> `optional` **Parameters**: [`DumpStateJsonRpcRequest`](../../actions/type-aliases/DumpStateJsonRpcRequest.md)\[`"params"`\]

#### ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`DumpStateResult`](../../actions/type-aliases/DumpStateResult.md)\<`never`\>\>

#### Description

Dumps the current cached state of the EVM.

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_dumpState' })})
```

***

### tevm\_getAccount

> **tevm\_getAccount**: `object`

Defined in: packages/decorators/dist/index.d.ts:1409

#### Method

> **Method**: `"tevm_getAccount"`

#### Parameters

> **Parameters**: [`GetAccountJsonRpcRequest`](../../actions/type-aliases/GetAccountJsonRpcRequest.md)\[`"params"`\]

#### ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`GetAccountResult`](../../actions/type-aliases/GetAccountResult.md)\<`never`\>\>

#### Description

Returns the account state of the given address

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])})
```

***

### tevm\_loadState

> **tevm\_loadState**: `object`

Defined in: packages/decorators/dist/index.d.ts:1387

#### Method

> **Method**: `"tevm_loadState"`

#### Parameters

> **Parameters**: [`LoadStateJsonRpcRequest`](../../actions/type-aliases/LoadStateJsonRpcRequest.md)\[`"params"`\]

#### ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`LoadStateResult`](../../actions/type-aliases/LoadStateResult.md)\<`never`\>\>

#### Description

Loads the provided state into the EVM

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])})
// => { success: true }
```

***

### tevm\_setAccount

> **tevm\_setAccount**: `object`

Defined in: packages/decorators/dist/index.d.ts:1420

#### Method

> **Method**: `"tevm_setAccount"`

#### Parameters

> **Parameters**: [`SetAccountJsonRpcRequest`](../../actions/type-aliases/SetAccountJsonRpcRequest.md)\[`"params"`\]

#### ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`SetAccountResult`](../../actions/type-aliases/SetAccountResult.md)\<`never`\>\>

#### Description

Sets the account state of the given address

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])})
r
```
