[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / webSocket

# Function: webSocket()

> **webSocket**(`url?`, `config?`): `WebSocketTransport`

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url?` | `string` | URL of the JSON-RPC API. Defaults to the chain's public RPC URL. |
| `config?` | `WebSocketTransportConfig` | - |

## Returns

`WebSocketTransport`

## Description

Creates a WebSocket transport that connects to a JSON-RPC API.
