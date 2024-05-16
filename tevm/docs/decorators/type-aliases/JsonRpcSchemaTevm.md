[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaTevm

# Type alias: JsonRpcSchemaTevm

> **JsonRpcSchemaTevm**: `object`

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

### tevm\_call.Method

> **Method**: `"tevm_call"`

### tevm\_call.Parameters

> **Parameters**: [`CallJsonRpcRequest`](../../procedures-types/type-aliases/CallJsonRpcRequest.md)\[`"params"`\]

### tevm\_call.ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`CallResult`](../../index/type-aliases/CallResult.md)\<`never`\>\>

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

### tevm\_dumpState.Method

> **Method**: `"tevm_dumpState"`

### tevm\_dumpState.Parameters?

> `optional` **Parameters**: [`DumpStateJsonRpcRequest`](../../procedures-types/type-aliases/DumpStateJsonRpcRequest.md)\[`"params"`\]

### tevm\_dumpState.ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`DumpStateResult`](../../actions-types/type-aliases/DumpStateResult.md)\<`never`\>\>

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

### tevm\_getAccount.Method

> **Method**: `"tevm_getAccount"`

### tevm\_getAccount.Parameters

> **Parameters**: [`GetAccountJsonRpcRequest`](../../procedures-types/type-aliases/GetAccountJsonRpcRequest.md)\[`"params"`\]

### tevm\_getAccount.ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`GetAccountResult`](../../index/type-aliases/GetAccountResult.md)\<`never`\>\>

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

### tevm\_loadState.Method

> **Method**: `"tevm_loadState"`

### tevm\_loadState.Parameters

> **Parameters**: [`LoadStateJsonRpcRequest`](../../procedures-types/type-aliases/LoadStateJsonRpcRequest.md)\[`"params"`\]

### tevm\_loadState.ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`LoadStateResult`](../../actions-types/type-aliases/LoadStateResult.md)\<`never`\>\>

### tevm\_script

> **tevm\_script**: `object`

#### Description

Execute supplied contract bytecode on the EVM

#### Link

https://tevm.sh/learn/json-rpc/#tevm-methods

#### Example

```ts
provider.request({ method: 'tevm_script', params: [{ deployedBytecode: '0x...', args: [...] }] })})
// => { address: '0x...', events: [{...}], ... }
```

### tevm\_script.Method

> **Method**: `"tevm_script"`

### tevm\_script.Parameters

> **Parameters**: [`ScriptJsonRpcRequest`](../../procedures-types/type-aliases/ScriptJsonRpcRequest.md)\[`"params"`\]

### tevm\_script.ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`CallResult`](../../index/type-aliases/CallResult.md)\<`never`\>\>

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

### tevm\_setAccount.Method

> **Method**: `"tevm_setAccount"`

### tevm\_setAccount.Parameters

> **Parameters**: [`SetAccountJsonRpcRequest`](../../procedures-types/type-aliases/SetAccountJsonRpcRequest.md)\[`"params"`\]

### tevm\_setAccount.ReturnType

> **ReturnType**: [`SerializeToJson`](../../utils/type-aliases/SerializeToJson.md)\<[`SetAccountResult`](../../index/type-aliases/SetAccountResult.md)\<`never`\>\>

## Source

packages/decorators/dist/index.d.ts:307
