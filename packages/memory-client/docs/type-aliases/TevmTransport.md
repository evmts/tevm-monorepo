[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / TevmTransport

# Type Alias: TevmTransport()\<TName\>

> **TevmTransport**\<`TName`\>: \<`TChain`\>(`{
	chain,
	pollingInterval,
	retryCount,
	timeout,
}`) => `object`

A type representing a custom TEVM Transport for viem.

## Type Parameters

• **TName** *extends* `string` = `string`

The name of the transport.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain`

The blockchain configuration.

## Parameters

• **\{
	chain,
	pollingInterval,
	retryCount,
	timeout,
\}**

• **\{
	chain,
	pollingInterval,
	retryCount,
	timeout,
\}.chain?**: `TChain`

• **\{
	chain,
	pollingInterval,
	retryCount,
	timeout,
\}.pollingInterval?**: `ClientConfig`\[`"pollingInterval"`\]

• **\{
	chain,
	pollingInterval,
	retryCount,
	timeout,
\}.retryCount?**: `TransportConfig`\[`"retryCount"`\]

• **\{
	chain,
	pollingInterval,
	retryCount,
	timeout,
\}.timeout?**: `TransportConfig`\[`"timeout"`\]

## Returns

`object`

The configured TEVM transport.

### config

> **config**: `TransportConfig`\<`TName`\>

### request

> **request**: `EIP1193RequestFn`

### value

> **value**: `object`

### value.tevm

> **tevm**: `TevmNode` & `object`

#### Type declaration

##### request

> **request**: `EIP1193RequestFn`

## Defined in

[packages/memory-client/src/TevmTransport.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmTransport.ts#L18)
