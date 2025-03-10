[**@tevm/address**](../README.md)

***

[@tevm/address](../globals.md) / create2ContractAddress

# Function: create2ContractAddress()

> **create2ContractAddress**(`from`, `salt`, `code`): [`Address`](../classes/Address.md)

Defined in: [packages/address/src/create2ContractAddress.js:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/create2ContractAddress.js#L86)

Generates an [Address](../classes/Address.md) for a contract deployed using the CREATE2 opcode.

CREATE2 enables deterministic contract deployment regardless of deployer's nonce,
allowing contracts to be deployed at predetermined addresses known before deployment.
This is useful for:

- Creating counterfactual contracts (contracts whose address is known before deployment)
- Enabling deterministic cross-chain deployments
- Supporting contract interactions before a contract is deployed
- Factory patterns with predictable addresses

The CREATE2 address is calculated using the formula:

`address = keccak256(0xff + sender_address + salt + keccak256(init_code))[12:]`

Where:
- 0xff is a constant prefix byte
- salt is a 32-byte value chosen by the deployer
- init_code is the contract creation bytecode
- [12:] means taking the last 20 bytes of the 32-byte hash

## Parameters

### from

`Address`

The address of the account or factory contract initiating the deployment

### salt

`` `0x${string}` ``

A 32-byte value as a hex string that makes the address unique

### code

`` `0x${string}` ``

The contract creation bytecode (not the deployed bytecode)

## Returns

[`Address`](../classes/Address.md)

The deterministic contract address that will be generated

## Throws

If salt is not 32 bytes or if other inputs are invalid

## Examples

```javascript
import { createAddress, create2ContractAddress } from '@tevm/address'

// Factory address (e.g., a contract that deploys other contracts)
const factoryAddress = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')

// Create a unique salt value (must be 32 bytes)
const salt = '0x' + '00'.repeat(31) + '01' // 0x0000...0001

// Contract bytecode (the initialization/creation code, not the runtime code)
const initCode = '0x608060405234801561001057600080fd5b5060f78061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146053578063d09de08a14606d575b600080fd5b6051604c3660046083565b600055565b005b605b60005481565b60405190815260200160405180910390f35b6051600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220d5d906d4f57c58cc85c7308e5d75b7f703100f6c46a6f59a07159c2104d4d25264736f6c63430008130033' 

// Calculate the address where the contract will be deployed
const contractAddress = create2ContractAddress(
  factoryAddress, 
  salt,
  initCode
)

console.log('Contract will be deployed at:', contractAddress.toString())
```

```javascript
// Using different salts to deploy multiple instances of the same contract
import { createAddress, create2ContractAddress } from '@tevm/address'
import { hexToBytes } from '@tevm/utils'

const factoryAddress = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
const initCode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b61004361006e565b60405190815260200160405180910390f35b610043610067366004610105565b600055565b60008054905090565b600060208284031215610089578081fd5b5035919050565b60006020828403121561009c57600080fd5b81516001600160a01b03811681146100b257600080fd5b9392505050565b6000602082840312156100ca57600080fd5b5035919050565b6000602082840312156100e257600080fd5b5035919050565b6000602082840312156100fa57600080fd5b5035919050565b60006020828403121561011657600080fd5b5035919050565b6000602082840312156100e257600080fd5b5035919050565b60006020828403121561011657600080fd5b503591905056fea2646970667358221220d5d906d4f57c58cc85c7308e5d75b7f703100f6c46a6f59a07159c2104d4d25264736f6c63430008130033'

// Generate addresses with sequential salts
const addresses = [];
for (let i = 0; i < 5; i++) {
  // Create a salt with the index as the last byte
  const salt = '0x' + '00'.repeat(31) + i.toString(16).padStart(2, '0')
  addresses.push(
    create2ContractAddress(factoryAddress, salt, initCode).toString()
  )
}

console.log('Deterministic contract addresses:', addresses)
```

## See

 - [Skinny CREATE2](https://eips.ethereum.org/EIPS/eip-1014|EIP-1014:)
 - [Usage Example in Solidity](https://solidity-by-example.org/app/create2/|CREATE2)
