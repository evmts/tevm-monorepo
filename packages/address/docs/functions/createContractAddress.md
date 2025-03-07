[**@tevm/address**](../README.md)

***

[@tevm/address](../globals.md) / createContractAddress

# Function: createContractAddress()

> **createContractAddress**(`from`, `nonce`): [`Address`](../classes/Address.md)

Defined in: [packages/address/src/createContractAddress.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/createContractAddress.js#L15)

Generates an [Address](../classes/Address.md) for a newly created contract.

## Parameters

### from

`Address`

The address of the account creating the contract.

### nonce

`bigint`

The nonce of the account creating the contract.

## Returns

[`Address`](../classes/Address.md)

The generated contract address.

## Throws

If the 'from' parameter is not a valid EthjsAddress.

## See

[Contract Creation](https://ethereum.org/en/developers/docs/smart-contracts/deploying/#contract-creation-code|Ethereum)
