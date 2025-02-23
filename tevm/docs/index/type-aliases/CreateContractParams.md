[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateContractParams

# Type Alias: CreateContractParams\<TName, TAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **CreateContractParams**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object` \| `object`

Parameters for creating a [Contract](Contract.md) instance.
This type allows for two mutually exclusive ways of specifying the ABI:
either as a human-readable ABI or as a JSON ABI.

## Type Parameters

• **TName** *extends* `string` \| `undefined` \| `never`

The name of the contract (optional)

• **TAbi** *extends* readonly `string`[] \| [`Abi`](Abi.md)

The ABI type (either string[] for human readable or Abi for JSON)

• **TAddress** *extends* `undefined` \| [`Address`](Address.md) \| `never`

The contract address type (optional)

• **TBytecode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

The contract creation bytecode type (optional)

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

The deployed bytecode type (optional)

• **TCode** *extends* `undefined` \| [`Hex`](Hex.md) \| `never`

The runtime bytecode type (optional)

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

## Defined in

packages/contract/types/CreateContractParams.d.ts:47
