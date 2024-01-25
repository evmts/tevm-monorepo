---
title: Tevm clients guide
description: Introduction to clients and actions
---

## Tevm Clients

The interface to Tevm api is called [TevmClient](/reference/tevm/client-types/type-aliases/tevmclient). This api provides a uniform API for interacting with Tevm whether interacting with a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) directly or remotely interacting via an [HttpCLient](/reference/tevm/http-client/type-aliases/httpclient). Tevm clients share the same [actions](/learn/actions) based interface along with a [`request`](/reference/tevm/client-types/type-aliases/tevmclient#request) method for handling JSON-RPC requests.

The following clients are available

- [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) - An in memory instance of the EVM that can run in Node.js, bun or the browser
- [HttpClient](/reference/tevm/http-client/type-aliases/httpclient) - A client that talks to a remote `MemoryClient` running in an [http server](/reference/tevm/server/api) 
- [Viem extensions](/reference/tevm/viem/api) - Provides a viem based client instance and some experimental optimistic updating apis.
- 🚧 Under construction [Ethers extensions](/reference/tevm/ethers/api) - An ethers based memory client and http client
- 🚧 Under construction `WebsocketClient` - A web socket based TevmClient similar to the `HttpClient`

## Actions

The main interface for interacting with any Tevm client is it's `actions api`. See [actions api](/learn/actions) guide or the [TevmClient reference](/reference/tevm/client-types/type-aliases/tevmclient) for more information.

## Procedures

Tevm also has an `client.request` method for doing JSON procedure calls.  For `MemoryClient` this procedure call happens in memory and for `HttpClient` this procedure call is resolved remotely using JSON-RPC (json remote procedure call). For more information see the [JSON-RPC](/learn/json-rpc) docs and the [`client.request`](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequesthandler) generated reference docs.
