## krome/contracts

Krome supports compiling contracts and scripts via importing directly into JavaScript using [tevm](https://tevm.sh)

```typescript
import {BankV1} from './BankV1.s.sol'
```

Doing this compiles the contract into [an object with contract bytecode and abi](https://tevm.sh/learn/contracts/) called a Tevm Contract.

This can be useful especially when optimizing [clientside latency](https://tevm.sh/why/avoid-waterfalls/)

## Files

- [BankV1.s.sol](./BankV1.s.sol) Contains an example solidity contract
- [BankV1.spec.ts](./BankV1.spec.ts) contains a test exploiting the bank in typescript.

Use BankV1.spec.ts for an example of how to both import solidity into typescript as well as execute the solidity in a local VM using Tevm.