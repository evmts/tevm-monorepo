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

> **Method**: `"tevm_call"`

### tevm\_call.Parameters

> **Parameters**: `CallJsonRpcRequest`\[`"params"`\]

### tevm\_call.ReturnType

> **ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<`never`\>\>

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

> `optional` **Parameters**: `DumpStateJsonRpcRequest`\[`"params"`\]

### tevm\_dumpState.ReturnType

> **ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult/)\<`never`\>\>

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

> **Parameters**: `GetAccountJsonRpcRequest`\[`"params"`\]

### tevm\_getAccount.ReturnType

> **ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\<`never`\>\>

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

> **Parameters**: `LoadStateJsonRpcRequest`\[`"params"`\]

### tevm\_loadState.ReturnType

> **ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`LoadStateResult`](/reference/tevm/actions/type-aliases/loadstateresult/)\<`never`\>\>

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

> **Parameters**: `ScriptJsonRpcRequest`\[`"params"`\]

### tevm\_script.ReturnType

> **ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<`never`\>\>

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

> **Parameters**: `SetAccountJsonRpcRequest`\[`"params"`\]

### tevm\_setAccount.ReturnType

> **ReturnType**: [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<[`SetAccountResult`](/reference/tevm/actions/type-aliases/setaccountresult/)\<`never`\>\>

## Source

[eip1193/JsonRpcSchemaTevm.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L13)
