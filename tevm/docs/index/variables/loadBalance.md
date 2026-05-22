[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / loadBalance

# Variable: loadBalance

> `const` **loadBalance**: (`_transports`) => `Transport`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `_transports` | `Transport`[] |

## Returns

`Transport`

## Description

Creates a load balanced transport that spreads requests between child transports using a round robin algorithm.
