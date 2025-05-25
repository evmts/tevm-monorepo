[**@tevm/contract**](../README.md)

***

[@tevm/contract](../globals.md) / CreateContractParams

# Type Alias: CreateContractParams\<TName, TAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **CreateContractParams**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> = \{ `abi?`: `never`; `address?`: `TAddress`; `bytecode?`: `TBytecode`; `code?`: `TCode`; `deployedBytecode?`: `TDeployedBytecode`; `humanReadableAbi`: `TAbi` *extends* readonly `string`[] ? `TAbi` : `FormatAbi`\<`TAbi`\>; `name?`: `TName`; \} \| \{ `abi`: `TAbi` *extends* readonly `string`[] ? `ParseAbi`\<`TAbi`\> : `TAbi` *extends* `Abi` ? `TAbi` : `never`; `address?`: `TAddress`; `bytecode?`: `TBytecode`; `code?`: `TCode`; `deployedBytecode?`: `TDeployedBytecode`; `humanReadableAbi?`: `never`; `name?`: `TName`; \}

Defined in: CreateContractParams.ts:49

Parameters for creating a [Contract](Contract.md) instance.
This type allows for two mutually exclusive ways of specifying the ABI:
either as a human-readable ABI or as a JSON ABI.

## Type Parameters

### TName

`TName` *extends* `string` \| `undefined` \| `never`

The name of the contract (optional)

### TAbi

`TAbi` *extends* readonly `string`[] \| `Abi`

The ABI type (either string[] for human readable or Abi for JSON)

### TAddress

`TAddress` *extends* `undefined` \| `Address` \| `never`

The contract address type (optional)

### TBytecode

`TBytecode` *extends* `undefined` \| `Hex` \| `never`

The contract creation bytecode type (optional)

### TDeployedBytecode

`TDeployedBytecode` *extends* `undefined` \| `Hex` \| `never`

The deployed bytecode type (optional)

### TCode

`TCode` *extends* `undefined` \| `Hex` \| `never`

The runtime bytecode type (optional)

## Type declaration

\{ `abi?`: `never`; `address?`: `TAddress`; `bytecode?`: `TBytecode`; `code?`: `TCode`; `deployedBytecode?`: `TDeployedBytecode`; `humanReadableAbi`: `TAbi` *extends* readonly `string`[] ? `TAbi` : `FormatAbi`\<`TAbi`\>; `name?`: `TName`; \}

### abi?

> `optional` **abi**: `never`

### address?

> `optional` **address**: `TAddress`

Optional address of the deployed contract

### bytecode?

> `optional` **bytecode**: `TBytecode`

Optional creation bytecode of the contract

### code?

> `optional` **code**: `TCode`

Optional runtime bytecode of the contract

### deployedBytecode?

> `optional` **deployedBytecode**: `TDeployedBytecode`

Optional deployed bytecode of the contract

### humanReadableAbi

> **humanReadableAbi**: `TAbi` *extends* readonly `string`[] ? `TAbi` : `FormatAbi`\<`TAbi`\>

Human-readable ABI of the contract

### name?

> `optional` **name**: `TName`

Optional name of the contract

\{ `abi`: `TAbi` *extends* readonly `string`[] ? `ParseAbi`\<`TAbi`\> : `TAbi` *extends* `Abi` ? `TAbi` : `never`; `address?`: `TAddress`; `bytecode?`: `TBytecode`; `code?`: `TCode`; `deployedBytecode?`: `TDeployedBytecode`; `humanReadableAbi?`: `never`; `name?`: `TName`; \}

### abi

> **abi**: `TAbi` *extends* readonly `string`[] ? `ParseAbi`\<`TAbi`\> : `TAbi` *extends* `Abi` ? `TAbi` : `never`

JSON ABI of the contract

### address?

> `optional` **address**: `TAddress`

Optional address of the deployed contract

### bytecode?

> `optional` **bytecode**: `TBytecode`

Optional creation bytecode of the contract

### code?

> `optional` **code**: `TCode`

Optional runtime bytecode of the contract

### deployedBytecode?

> `optional` **deployedBytecode**: `TDeployedBytecode`

Optional deployed bytecode of the contract

### humanReadableAbi?

> `optional` **humanReadableAbi**: `never`

### name?

> `optional` **name**: `TName`

Optional name of the contract

## See

CreateContract

## Examples

Using human-readable ABI:
```typescript
const params: CreateContractParams = {
  name: 'ERC20',
  humanReadableAbi: [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
}
```

Using JSON ABI:
```typescript
const params: CreateContractParams = {
  name: 'ERC20',
  abi: [
    {
      "inputs": [{"name": "owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
  ],
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
}
```
