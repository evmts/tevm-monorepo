[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / http

# Function: http()

> **http**\<`rpcSchema`, `raw`\>(`url?`, `config?`): `HttpTransport`\<`rpcSchema`, `raw`\>

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/clients/transports/http.d.ts:52

## Type Parameters

### rpcSchema

`rpcSchema` *extends* `undefined` \| `RpcSchema` = `undefined`

### raw

`raw` *extends* `boolean` = `false`

## Parameters

### url?

`string`

URL of the JSON-RPC API. Defaults to the chain's public RPC URL.

### config?

`HttpTransportConfig`\<`rpcSchema`, `raw`\>

## Returns

`HttpTransport`\<`rpcSchema`, `raw`\>

## Description

Creates a HTTP transport that connects to a JSON-RPC API.
