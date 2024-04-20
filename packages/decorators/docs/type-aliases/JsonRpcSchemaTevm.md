**@tevm/decorators** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonRpcSchemaTevm

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

> **tevm\_call.Method**: `"tevm_call"`

### tevm\_call.Parameters

> **tevm\_call.Parameters**: `CallJsonRpcRequest`[`"params"`]

### tevm\_call.ReturnType

> **tevm\_call.ReturnType**: `SerializeToJson`\<`CallResult`\<`never`\>\>

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

### tevm\_dumpState.Parameters

> **tevm\_dumpState.Parameters**?: `DumpStateJsonRpcRequest`[`"params"`]

### tevm\_dumpState.ReturnType

> **tevm\_dumpState.ReturnType**: `SerializeToJson`\<`DumpStateResult`\<`never`\>\>

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

> **tevm\_getAccount.Parameters**: `GetAccountJsonRpcRequest`[`"params"`]

### tevm\_getAccount.ReturnType

> **tevm\_getAccount.ReturnType**: `SerializeToJson`\<`GetAccountResult`\<`never`\>\>

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

> **tevm\_loadState.Parameters**: `LoadStateJsonRpcRequest`[`"params"`]

### tevm\_loadState.ReturnType

> **tevm\_loadState.ReturnType**: `SerializeToJson`\<`LoadStateResult`\<`never`\>\>

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

> **tevm\_script.Method**: `"tevm_script"`

### tevm\_script.Parameters

> **tevm\_script.Parameters**: `ScriptJsonRpcRequest`[`"params"`]

### tevm\_script.ReturnType

> **tevm\_script.ReturnType**: `SerializeToJson`\<`CallResult`\<`never`\>\>

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

> **tevm\_setAccount.Parameters**: `SetAccountJsonRpcRequest`[`"params"`]

### tevm\_setAccount.ReturnType

> **tevm\_setAccount.ReturnType**: `SerializeToJson`\<`SetAccountResult`\<`never`\>\>

## Source

[packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
