[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / getAddress

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

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/address/getAddress.d.ts:20
