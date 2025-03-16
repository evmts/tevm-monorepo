[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaTevm

# Type Alias: JsonRpcSchemaTevm

> **JsonRpcSchemaTevm**: `object`

Defined in: [eip1193/JsonRpcSchemaTevm.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L39)

Type definitions for Tevm-specific JSON-RPC methods.
Includes methods for state manipulation, EVM calls, and account management.

## Type declaration

### tevm\_call

> **tevm\_call**: `object`

#### Description

A versatile way of executing an EVM call with many options and detailed return data

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })})
// => { data: '0x...', events: [{...}], ... }
```

#### tevm\_call.Method

> **Method**: `"tevm_call"`

#### tevm\_call.Parameters

> **Parameters**: `CallJsonRpcRequest`\[`"params"`\]

#### tevm\_call.ReturnType

> **ReturnType**: `SerializeToJson`\<`CallResult`\<`never`\>\>

### tevm\_dumpState

> **tevm\_dumpState**: `object`

#### Description

Dumps the current cached state of the EVM.

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_dumpState' })})
```

#### tevm\_dumpState.Method

> **Method**: `"tevm_dumpState"`

#### tevm\_dumpState.Parameters?

> `optional` **Parameters**: `DumpStateJsonRpcRequest`\[`"params"`\]

#### tevm\_dumpState.ReturnType

> **ReturnType**: `SerializeToJson`\<`DumpStateResult`\<`never`\>\>

### tevm\_getAccount

> **tevm\_getAccount**: `object`

#### Description

Returns the account state of the given address

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])})
```

#### tevm\_getAccount.Method

> **Method**: `"tevm_getAccount"`

#### tevm\_getAccount.Parameters

> **Parameters**: `GetAccountJsonRpcRequest`\[`"params"`\]

#### tevm\_getAccount.ReturnType

> **ReturnType**: `SerializeToJson`\<`GetAccountResult`\<`never`\>\>

### tevm\_loadState

> **tevm\_loadState**: `object`

#### Description

Loads the provided state into the EVM

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])})
// => { success: true }
```

#### tevm\_loadState.Method

> **Method**: `"tevm_loadState"`

#### tevm\_loadState.Parameters

> **Parameters**: `LoadStateJsonRpcRequest`\[`"params"`\]

#### tevm\_loadState.ReturnType

> **ReturnType**: `SerializeToJson`\<`LoadStateResult`\<`never`\>\>

### tevm\_setAccount

> **tevm\_setAccount**: `object`

#### Description

Sets the account state of the given address

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])})
r
```

#### tevm\_setAccount.Method

> **Method**: `"tevm_setAccount"`

#### tevm\_setAccount.Parameters

> **Parameters**: `SetAccountJsonRpcRequest`\[`"params"`\]

#### tevm\_setAccount.ReturnType

> **ReturnType**: `SerializeToJson`\<`SetAccountResult`\<`never`\>\>

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
