[**@tevm/address**](../README.md) • **Docs**

***

[@tevm/address](../globals.md) / create2ContractAddress

# Function: create2ContractAddress()

> **create2ContractAddress**(`from`, `salt`, `code`): [`Address`](../classes/Address.md)

Generates an [Address](../classes/Address.md) for a contract created using CREATE2.

## Parameters

• **from**: `Address`

The address which is creating this new address

• **salt**: \`0x$\{string\}\`

A 32-byte salt value as a hex string

• **code**: \`0x$\{string\}\`

THe creation code of the contract

## Returns

[`Address`](../classes/Address.md)

## Throws

if salt is not 32 bytes or input is wrong in some other way

## Defined in

[packages/address/src/create2ContractAddress.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/create2ContractAddress.js#L18)
