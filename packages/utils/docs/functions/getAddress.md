[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / getAddress

# Function: getAddress()

> **getAddress**(`address`, `chainId?`): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/address/getAddress.d.ts:20

## Parameters

### address

`string`

### chainId?

`number`

Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
wider Ethereum ecosystem, meaning it will break when validated against an application/tool
that relies on EIP-55 checksum encoding (checksum without chainId).

It is highly recommended to not use this feature unless you
know what you are doing.

See more: https://github.com/ethereum/EIPs/issues/1121

## Returns

`` `0x${string}` ``
