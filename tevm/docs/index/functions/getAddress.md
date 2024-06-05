[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / getAddress

# Function: getAddress()

> **getAddress**(`address`, `chainId`?): `Address`

## Parameters

• **address**: `string`

• **chainId?**: `number`

Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
wider Ethereum ecosystem, meaning it will break when validated against an application/tool
that relies on EIP-55 checksum encoding (checksum without chainId).

It is highly recommended to not use this feature unless you
know what you are doing.

See more: https://github.com/ethereum/EIPs/issues/1121

## Returns

`Address`

## Source

node\_modules/.pnpm/viem@2.13.6\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/address/getAddress.d.ts:22
