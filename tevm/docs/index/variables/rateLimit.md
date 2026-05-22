[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / rateLimit

# Variable: rateLimit

> `const` **rateLimit**: (`_transport`, `{ requestsPerSecond, browser, }`) => `Transport`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `_transport` | `Transport` |
| `{ requestsPerSecond, browser, }` | \{ `browser?`: `boolean`; `requestsPerSecond`: `number`; \} |
| `{ requestsPerSecond, browser, }.browser?` | `boolean` |
| `{ requestsPerSecond, browser, }.requestsPerSecond` | `number` |

## Returns

`Transport`

## Description

Creates a rate limited transport that throttles request throughput.
