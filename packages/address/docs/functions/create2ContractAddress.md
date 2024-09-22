[**@tevm/address**](../README.md) • **Docs**

***

[@tevm/address](../globals.md) / create2ContractAddress

# Function: create2ContractAddress()

> **create2ContractAddress**(`from`, `salt`, `code`): [`Address`](../classes/Address.md)

## Parameters

• **from**: `Address`

The address which is creating this new address

• **salt**: \`0x$\{string\}\`

A 32-byte salt value as a hex string

• **code**: \`0x$\{string\}\`

The creation code of the contract

## Returns

[`Address`](../classes/Address.md)

The generated contract address

## Defined in

[packages/address/src/create2ContractAddress.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/create2ContractAddress.js#L19)
