[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / TevmTransport

# Type Alias: TevmTransport()\<TName\>

> **TevmTransport**\<`TName`\> = \<`TChain`\>(`{
	chain,
	pollingInterval,
	retryCount,
	timeout,
}`) => `object`

Defined in: [packages/memory-client/src/TevmTransport.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmTransport.ts#L18)

A type representing a custom TEVM Transport for viem.

## Type Parameters

### TName

`TName` *extends* `string` = `string`

The name of the transport.

## Type Parameters

### TChain

`TChain` *extends* `Chain` \| `undefined` = `Chain`

The blockchain configuration.

## Parameters

### \{
	chain,
	pollingInterval,
	retryCount,
	timeout,
\}

#### chain?

`TChain`

#### pollingInterval?

`ClientConfig`\[`"pollingInterval"`\]

#### retryCount?

`TransportConfig`\[`"retryCount"`\]

#### timeout?

`TransportConfig`\[`"timeout"`\]

## Returns

`object`

The configured TEVM transport.

### config

> **config**: `TransportConfig`\<`TName`\>

### request

> **request**: `EIP1193RequestFn`

### value

> **value**: `object`

#### value.tevm

> **tevm**: `TevmNode` & `object`

##### Type Declaration

###### request

> **request**: `EIP1193RequestFn`
