[**@tevm/decorators**](../README.md) • **Docs**

***

[@tevm/decorators](../globals.md) / EIP1193EventMap

# Type alias: EIP1193EventMap

> **EIP1193EventMap**: `object`

## Type declaration

### accountsChanged()

#### Parameters

• **accounts**: \`0x$\{string\}\`[]

#### Returns

`void`

### chainChanged()

#### Parameters

• **chainId**: `string`

#### Returns

`void`

### connect()

#### Parameters

• **connectInfo**: [`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

### disconnect()

#### Parameters

• **error**: [`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

### message()

#### Parameters

• **message**: [`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

## Source

[packages/decorators/src/eip1193/EIP1193Events.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L28)
