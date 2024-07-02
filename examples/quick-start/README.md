# Tevm Getting Started

This repo demonstrates the [Tevm Getting Started Guide](https://tevm.sh/getting-started/getting-started/). Every step of the guide is it's own commit.

## Features demonstrated

- [Creating an in-memory EVM with `createMemoryClient`](https://github.com/evmts/quick-start/commit/14cc9ae57fdec784f9d779010b91df9b6935055a)
- [Making requests to the in-memory EVM with viem actions such as `memoryClient.getBlockNumber`](https://github.com/evmts/quick-start/commit/3ce876cb27022befebc22f64562afacc125da078) and [`memoryClient.getTransactionReceipt`](https://github.com/evmts/quick-start/commit/d3371fbec7e3ed5e8da7b6447c0845127a4bb064)
- [Querying account information with `memoryClient.tevmGetAccount`](https://github.com/evmts/quick-start/commit/6cf495c4ca5bfceeb1c21a0cf31f206458241791)
- [Modifying account information with `memoryClient.tevmSetAccount`](https://github.com/evmts/quick-start/commit/8079d4afcbb8f6494bab4100bf0d17109f3cf923)
- [Using the accounts prefunded with `1000 eth`](https://github.com/evmts/quick-start/commit/b00e2c3489c3dc2d38b7d31dc5d4d4fd25c0f622)
- [Executing the EVM and creating a transaction with `memoryClient.tevmCall`](https://github.com/evmts/quick-start/commit/831ad06fa7c7143a351edda0b02741048bd623d7)
- [Mining a new block with `memoryClient.tevmMine`](https://github.com/evmts/quick-start/commit/7418a4afc503335804bdc66834f4bda75d21631a)
- [Deploying a contract with `memoryClient.tevmDeploy`](https://github.com/evmts/quick-start/commit/dbbeb75ec1006d1639169b227858a819b37ffd53)
- [Calling a contract with `meoryClient.tevmContract`](https://github.com/evmts/quick-start/commit/9ca7d45a3004b5c4f362edab91b245b8955af4ee)
- [Reducing boilerplate of contract calls in Tevm and Viem with Tevm `Contracts`](https://github.com/evmts/quick-start/commit/aed4d8a4bcdbcda526da159402f138d44f628ad8)
- [Importing contracts into tests and running them as scripts](https://github.com/evmts/quick-start/commit/de0b4ace7cb192dc86e6d4fe7a36d847b7944853)
- [Running JavaScript in solidity scripts](https://github.com/evmts/quick-start/commit/2551ecb01eb5a01863b4b9a58592c7ebb256491b)

There are also commits showing the boilerplate needed to run Tevm in the browser and set up the automatic solidity contract imports.

## Main files

- [src/main.ts](./src/main.ts) demonstrates the most basic tevm features such as modifying accounts deploying and calling contracts and using the viem api.
- [src/counter.spec.ts](./src/counter.spec.ts) demonstrates more advanced tevm features such as solidity scripting and running javascript in solidity.

## Stack blitz

This repo is available as a stackblitz [here](https://stackblitz.com/~/github.com/evmts/quick-start?file=src/main.ts). You will have to enable the local version of typescript after starting the stakblitz. More information is in a comment at the top of `src/main.ts`.

## ⭐ [Consider starring on github](https://github.com/evmts/tevm-monorepo)

## [Join Telegram if you want to discuss tevm](https://t.me/+ANThR9bHDLAwMjUx)

## Advanced NEXT.js example

For a more advanced example using Tevm and NEXT.js to build a robust transaction simulator app see the [NEXT.js example](https://github.com/evmts/tevm-monorepo/tree/main/examples/next)

<img width="1494" alt="image" src="https://github.com/evmts/quick-start/assets/35039927/b7fca77e-9542-42ad-894a-3fe5eb838fed">


Shout out to polarzero who originally built this. [See his live version here](https://svvy.sh/)
