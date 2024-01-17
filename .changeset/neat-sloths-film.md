---
"@tevm/contract": major
---

- Changed name of `TevmContract` to `Contract` 
- Changed name of `createTevmContract` to `createContract` 
- Added `Script` to be a Contract with bytecode
- Removed bytecode from `Contract`
- Added a new `withAddress` method for adding an address to a contract
- Removed need to explicitly pass in undefined for optional params

## withAddress

Before we had to spred contracts like this:

```typescript
client.readContract({
  address: contractAddress,
  ...Erc20Contract.read.balanceOf(userAddress)
})
```

Now Tevm can create a contract with an address attatched


```typescript
client.readContract(
  Erc20Contract.withAddress(contractAddress).read.balanceOf(userAddress)
)
```

