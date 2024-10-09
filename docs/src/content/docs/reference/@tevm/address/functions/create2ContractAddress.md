---
editUrl: false
next: false
prev: false
title: "create2ContractAddress"
---

> **create2ContractAddress**(`from`, `salt`, `code`): [`Address`](/reference/tevm/address/classes/address/)

Generates an [Address](../../../../../../../../reference/tevm/address/classes/address) for a contract created using CREATE2.

## Parameters

• **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address which is creating this new address

• **salt**: \`0x$\{string\}\`

A 32-byte salt value as a hex string

• **code**: \`0x$\{string\}\`

The creation code of the contract

## Returns

[`Address`](/reference/tevm/address/classes/address/)

The generated contract address

## Throws

If salt is not 32 bytes or if inputs are invalid

## See

[https://eips.ethereum.org/EIPS/eip-1014|EIP-1014](https://eips.ethereum.org/EIPS/eip-1014|EIP-1014) for more information on CREATE2

## Defined in

[packages/address/src/create2ContractAddress.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/create2ContractAddress.js#L19)
