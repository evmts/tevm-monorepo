# Why EVMts imports?

Why did we even waste time building a bundler for solidity? What problems is this even solving?

## Bundlers are important
 
We use bundlers all the time in our JavaScript code. We bundle in JSON files, Graphql files, CSS/SASS files, but there is yet to be a way to bundle contracts. EVMts exists for the same reason these other bundlers exist. A streamlined dev experience where one doesn't have to manually wire up contract build artifacts to their app. 

## No more copy-paste configuration

The current developer experience involves a lot of searching and copy pasting

- Copy paste abis
- Copy paste contract names
- Copy paste contract addresses
- Copy paste contract method names

Evmts solves this by melting all this configuration the developer used to do into the build tooling itself so developers can focus on their applications

1. `Contract abis` - Evmts bundler bundles contract into `EvmtsContract` objects that interop with tooling like `Wagmi`. You can use Evmts without even knowing what an ABI is.
2. `Contract names` - Evmts has tight integration with your typescript language server. This means your editor will have autoimport and autocompletion for your `.sol` contracts! 🏗️🚧 note language features are currently minimal and not fully implemented
3. `Contract addresses` - Addresses are configured in the `evmts.config.ts` file will be bundled into your contracts. Additionally, if you use forge-deploy or hardhat-deploy the address detection happens automatically based on deploy artifacts. You even can see the addresses via hovering over the contract in your editor
4. `Method names` - Evmts uses [abitype](todo.link) under the hood to provide full autocompletion and typesafety for method names and their arguments

## Language server support

We touched on this in the previous section, but let's linger on the language server support with some tangible problems and how Evmts solves them

- **Where is the solidity code for `MyERC20.balanceOf`**

Have you ever had the experience of hopelessly grepping trying to find the implementation for a contract method?   In Evmts you can simply `go-to-definition` in your editor and it will jump you straight to the documentation.

- **Is the contract address right?**

When you hover over a contract it will display what chains/contracts are globally configured for that contract. It will even show you an etherscan link directly to your contract in your editor!

- **This ABI is unreadable**

Evmts converts all ABIs into human readable form using abitype. No more trying to visually parse an ABI.

## No build step interrupting flow state

For those building full stack applications you will get editor support and typesafety in your typescript code without needing to remember to seperately build the contracts first for a TRPC like experience. When your solidity code changes your TypeScript langauge server will update right away without a manual build step.

## Modular design

Evmts is originally built to provide the optimal dev experience for the [@evmts/core](../future-plans.md) library that will include forge scripting and optimistic VM execution in the browser. It is modularly built however to be a industry standard build tool that interops with all other tooling including [ethers](todo.link), [wagmi](https://wagmi.sh), [web3.js](todo.link) and more.
If you are writing TypeScript code that interops with a blockchain you likely will benifit from utilizing Evmts imports in your workflow

## Just try it

The best way to see if Evmts can help your workflow is to try it out!  Try our [live demo](todo.link) to play with Evmts without needing to install or download anything.

