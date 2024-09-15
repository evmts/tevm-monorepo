[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / CreateContractFn

# Type Alias: CreateContractFn()

> **CreateContractFn**: \<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`{
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

## Type Parameters

• **TName** *extends* `string`

• **TAbi** *extends* readonly `string`[] \| `Abi`

• **TAddress** *extends* `undefined` \| `Address` = `undefined`

• **TBytecode** *extends* `undefined` \| `Hex` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| `Hex` = `undefined`

• **TCode** *extends* `undefined` \| `Hex` = `undefined`

• **THumanReadableAbi** *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi` : `TAbi` *extends* `Abi` ? `FormatAbi`\<`TAbi`\> : `never`

## Parameters

• **\{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
\}**: [`CreateContractParams`](CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Defined in

[CreateContractFn.ts:33](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/contract/src/CreateContractFn.ts#L33)
