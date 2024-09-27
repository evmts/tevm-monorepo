---
editUrl: false
next: false
prev: false
title: "JsonRpcSchemaTevm"
---

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

> **tevm\_call.Method**: `"tevm_call"`

### tevm\_call.Parameters

> **tevm\_call.Parameters**: [`CallJsonRpcRequest`](/reference/tevm/actions/type-aliases/calljsonrpcrequest/)\[`"params"`\]

### tevm\_call.ReturnType

> **tevm\_call.ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<`never`\>\>

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

> **tevm\_dumpState.Method**: `"tevm_dumpState"`

### tevm\_dumpState.Parameters?

> `optional` **tevm\_dumpState.Parameters**: [`DumpStateJsonRpcRequest`](/reference/tevm/actions/type-aliases/dumpstatejsonrpcrequest/)\[`"params"`\]

### tevm\_dumpState.ReturnType

> **tevm\_dumpState.ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult/)\<`never`\>\>

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

> **tevm\_getAccount.Method**: `"tevm_getAccount"`

### tevm\_getAccount.Parameters

> **tevm\_getAccount.Parameters**: [`GetAccountJsonRpcRequest`](/reference/tevm/actions/type-aliases/getaccountjsonrpcrequest/)\[`"params"`\]

### tevm\_getAccount.ReturnType

> **tevm\_getAccount.ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\<`never`\>\>

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

> **tevm\_loadState.Method**: `"tevm_loadState"`

### tevm\_loadState.Parameters

> **tevm\_loadState.Parameters**: [`LoadStateJsonRpcRequest`](/reference/tevm/actions/type-aliases/loadstatejsonrpcrequest/)\[`"params"`\]

### tevm\_loadState.ReturnType

> **tevm\_loadState.ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\<`never`\>\>

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

> **tevm\_setAccount.Method**: `"tevm_setAccount"`

### tevm\_setAccount.Parameters

> **tevm\_setAccount.Parameters**: [`SetAccountJsonRpcRequest`](/reference/tevm/actions/type-aliases/setaccountjsonrpcrequest/)\[`"params"`\]

### tevm\_setAccount.ReturnType

> **tevm\_setAccount.ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`SetAccountResult`](/reference/tevm/actions/type-aliases/setaccountresult/)\<`never`\>\>

## Defined in

[eip1193/JsonRpcSchemaTevm.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L12)
