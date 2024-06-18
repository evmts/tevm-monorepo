[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / CreateContractFn

# Type alias: CreateContractFn()

> **CreateContractFn**: \<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>(`{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
}`) => [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

## Examples

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract: Contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| `Address` = `undefined`

• **TBytecode** *extends* `undefined` \| `Hex` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| `Hex` = `undefined`

• **TCode** *extends* `undefined` \| `Hex` = `undefined`

## Parameters

• **\{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
\}**: [`CreateContractParams`](CreateContractParams.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Source

[CreateContractFn.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateContractFn.ts#L33)
