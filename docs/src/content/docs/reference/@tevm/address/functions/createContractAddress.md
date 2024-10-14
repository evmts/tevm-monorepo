---
editUrl: false
next: false
prev: false
title: "createContractAddress"
---

> **createContractAddress**(`from`, `nonce`): [`Address`](/reference/tevm/address/classes/address/)

Generates an [Address](../../../../../../../../reference/tevm/address/classes/address) for a newly created contract.

## Parameters

• **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address of the account creating the contract.

• **nonce**: `bigint`

The nonce of the account creating the contract.

## Returns

[`Address`](/reference/tevm/address/classes/address/)

The generated contract address.

## Throws

If the 'from' parameter is not a valid EthjsAddress.

## See

[Contract Creation](https://ethereum.org/en/developers/docs/smart-contracts/deploying/#contract-creation-code|Ethereum)

## Defined in

[packages/address/src/createContractAddress.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/createContractAddress.js#L15)
