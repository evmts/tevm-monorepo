[**@tevm/address**](../README.md)

***

[@tevm/address](../globals.md) / createContractAddress

# Function: createContractAddress()

> **createContractAddress**(`from`, `nonce`): [`Address`](../classes/Address.md)

Defined in: packages/address/src/createContractAddress.js:69

Generates an [Address](../classes/Address.md) for a contract deployed using the standard CREATE opcode.

In Ethereum, contract addresses are deterministically generated based on the deployer's
address and their current nonce. This function implements that calculation, following
the formula:

`address = keccak256(rlp([sender_address, sender_nonce]))[12:]`

Where:
- rlp is the RLP encoding function
- keccak256 is the hash function
- [12:] means taking the last 20 bytes of the 32-byte hash

This is useful for:
- Predicting contract addresses before deployment
- Generating contract addresses in test environments
- Verifying contract deployment addresses

## Parameters

### from

`Address`

The address of the account deploying the contract

### nonce

`bigint`

The nonce of the deploying account at the time of deployment

## Returns

[`Address`](../classes/Address.md)

The contract address that will be (or was) generated

## Throws

If the 'from' parameter is not a valid EthjsAddress

## Examples

```javascript
import { createAddress, createContractAddress } from '@tevm/address'

// Predict a contract's address before deployment
const deployerAddress = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
const deployerNonce = 5n // Current nonce of the deployer

const predictedAddress = createContractAddress(deployerAddress, deployerNonce)
console.log('Contract will be deployed at:', predictedAddress.toString())

// Using with a zero nonce (first deployment from an account)
const firstContractAddress = createContractAddress(deployerAddress, 0n)
```

```javascript
// Example of calculating multiple contract addresses in sequence
import { createAddress, createContractAddress } from '@tevm/address'

const deployerAddress = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
const startingNonce = 10n

// Calculate addresses for a series of contracts to be deployed
const contractAddresses = []
for (let i = 0; i < 5; i++) {
  const nonce = startingNonce + BigInt(i)
  contractAddresses.push(
    createContractAddress(deployerAddress, nonce).toString()
  )
}

console.log('Upcoming contract addresses:', contractAddresses)
```

## See

 - [Contract Creation](https://ethereum.org/en/developers/docs/smart-contracts/deploying/#contract-creation-code|Ethereum)
 - [State trie clearing](https://eips.ethereum.org/EIPS/eip-161|EIP-161:) for nonce rules
