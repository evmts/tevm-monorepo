[**@tevm/jsonrpc**](../README.md)

***

[@tevm/jsonrpc](../globals.md) / http

# Function: http()

> **http**\<`rpcSchema`, `raw`\>(`url`?, `config`?): `HttpTransport`\<`rpcSchema`, `raw`\>

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3/node\_modules/viem/\_types/clients/transports/http.d.ts:51

## Type Parameters

• **rpcSchema** *extends* `undefined` \| `RpcSchema` = `undefined`

• **raw** *extends* `boolean` = `false`

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
