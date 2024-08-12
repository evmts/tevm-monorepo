---
editUrl: false
next: false
prev: false
title: "create2ContractAddress"
---

> **create2ContractAddress**(`from`, `salt`, `code`): [`Address`](/reference/tevm/address/classes/address/)

Generates an [Address](../../../../../../../reference/tevm/address/classes/address) for a contract created using CREATE2.

## Parameters

• **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address which is creating this new address

• **salt**: \`0x$\{string\}\`

A 32-byte salt value as a hex string

• **code**: \`0x$\{string\}\`

THe creation code of the contract

## Returns

[`Address`](/reference/tevm/address/classes/address/)

## Throws

if salt is not 32 bytes or input is wrong in some other way

## Defined in

[packages/address/src/create2ContractAddress.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/create2ContractAddress.js#L18)
