## Whatsabi support

Whatsabi provides code generation capabilities for third party contracts

## Ways of using contracts

So far we have seen 3 ways of using [Tevm contracts](../contracts).

1. Writing the contract and importing it with [tevm bundler](../bundler/)

This is a great way to handle a contract you are developing.

2. Installing npm package that has Tevm contract solidity or contract artifacts and importing it.

This is a great way to handle third party contracts

3. Instanciating a contract with `createContract` or `createScript` and a human readable abi.

This is always a great option but less streamlined and more error prone than using the `bundler` to build the abi.

But what if we want to use a contract that is deployed on chain but does't have any npm package we can use? 

## Contract

[Whatsabi](https://github.com/shazow/whatsabi) is used by tevm to resolve contract artifacts from a simple config. 

First add the contract config to your `tevm.config.json`. 

```typescript tevm.json
{
  "whatsabi": [
    {
      "name": "Example",
      "description": "An optional description of the contract",
      "address": "0x420420420420420420420420420420420",
      "rpcUrl": "https://infura.quicknode.alchemy/$API_KEY",
      // supports outputing to .js, .mjs, .cjs, .ts, .json and .d.ts
      "out": ["src/generated/Example.sol.ts"]
    }
  ]
}
```

Generate the contracts with tevm cli

```bash usage.sh
tevm whatsabi 
```

It will generate a [tevm script](/reference/tevm/contract/type-defs/Script) to the out file which you can now import and use.

