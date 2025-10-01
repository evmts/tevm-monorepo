[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaTevm

# Type Alias: JsonRpcSchemaTevm

> **JsonRpcSchemaTevm** = `object`

Defined in: [eip1193/JsonRpcSchemaTevm.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L42)

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

Defined in: [eip1193/JsonRpcSchemaTevm.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L50)

#### Method

> **Method**: `"tevm_call"`

#### Parameters

> **Parameters**: `CallJsonRpcRequest`\[`"params"`\]

#### ReturnType

> **ReturnType**: `SerializeToJson`\<`CallResult`\<`never`\>\>

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

Defined in: [eip1193/JsonRpcSchemaTevm.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L73)

#### Method

> **Method**: `"tevm_dumpState"`

#### Parameters?

> `optional` **Parameters**: `DumpStateJsonRpcRequest`\[`"params"`\]

#### ReturnType

> **ReturnType**: `SerializeToJson`\<`DumpStateResult`\<`never`\>\>

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

Defined in: [eip1193/JsonRpcSchemaTevm.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L84)

#### Method

> **Method**: `"tevm_getAccount"`

#### Parameters

> **Parameters**: `GetAccountJsonRpcRequest`\[`"params"`\]

#### ReturnType

> **ReturnType**: `SerializeToJson`\<`GetAccountResult`\<`never`\>\>

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

Defined in: [eip1193/JsonRpcSchemaTevm.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L62)

#### Method

> **Method**: `"tevm_loadState"`

#### Parameters

> **Parameters**: `LoadStateJsonRpcRequest`\[`"params"`\]

#### ReturnType

> **ReturnType**: `SerializeToJson`\<`LoadStateResult`\<`never`\>\>

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

Defined in: [eip1193/JsonRpcSchemaTevm.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L95)

#### Method

> **Method**: `"tevm_setAccount"`

#### Parameters

> **Parameters**: `SetAccountJsonRpcRequest`\[`"params"`\]

#### ReturnType

> **ReturnType**: `SerializeToJson`\<`SetAccountResult`\<`never`\>\>

#### Description

Sets the account state of the given address

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])})
r
```
