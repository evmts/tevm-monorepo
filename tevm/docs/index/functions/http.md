[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / http

# Function: http()

> **http**\<`rpcSchema`, `raw`\>(`url?`, `config?`): `HttpTransport`\<`rpcSchema`, `raw`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `rpcSchema` *extends* `RpcSchema` \| `undefined` | `undefined` |
| `raw` *extends* `boolean` | `false` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url?` | `string` | URL of the JSON-RPC API. Defaults to the chain's public RPC URL. |
| `config?` | `HttpTransportConfig`\<`rpcSchema`, `raw`\> | - |

## Returns

`HttpTransport`\<`rpcSchema`, `raw`\>

## Description

Creates a HTTP transport that connects to a JSON-RPC API.
