---
title: Getting started guide
description: Tevm introduction
---

# Tevm Getting Started Guide

## Introduction

We will be creating a simple counter app using the following technologies:

- Tevm + [Viem](https://viem.sh)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) + [TypeScript](https://www.typescriptlang.org/) to build a ui with no framework
- [Vite](https://vitejs.dev/) + Tevm Bundler as a minimal build setup and dev server

This guide intentionally uses a straightforward setup to focus on the most essential features of Tevm, so every piece is understood.

## Prerequisites

- [Node.js >18.0](https://nodejs.org/en)
- Basic knowledge of [JavaScript](https://www.youtube.com/watch?v=g7T23Xzys-A)
- Basic knowledge of [Solidity](https://docs.soliditylang.org/en/v0.8.25/)
- Familiarity with [viem](https://viem.sh) or a similar library like [ethers.js](https://docs.ethers.org/v6/)

## Creating your Tevm project

1. Create a new project directory.

    ```bash
    mkdir tevm-app && cd tevm-app
    mkdir src
    ```

1. Initialize your project

    ```bash
    npm init --yes
    ```

1. Install the runtime dependencies.

    ```bash
    npm install tevm viem
    ```

1. Install the buildtime dependencies.
    [TypeScript](https://www.typescriptlang.org/) is the language we're using.
    Vite provides us a minimal setup to import TypeScript into our HTML and start a dev server.

    ```bash
    npm install --save-dev typescript vite
    ```

1. Create a TypeScript configuration file.

    Tevm has these requirements from the TypeScript configuration:
    - Use strict mode
    - Support bigint (ES2020 or later)

    See the [tsconfig docs](https://www.typescriptlang.org/tsconfig) for more information about these options.

    You can use this file.

    ```typescript title="tsconfig.json"
    {
      "compilerOptions": {
        "target": "ES2021",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2021", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,

        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,

        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"]
    }
    ```

1. Create the `index.html` file.

    The HTML file will be the entrypoint to our app.

    ```html title="index.html"
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tevm Example</title>
    </head>

    <body>
      <div id="app"></div>
      <script type="module" src="/src/main.ts"></script>
    </body>

    </html>
    ```

1. Add a typescript file.

    You will see the HTML file is importing a `src/main.ts` file in a script tag. Go ahead and add that too.

    ```typescript title="src/main.ts"
    const app = document.querySelector("#app") as Element;
    app.innerHTML = `<div>Hello Tevm</div>`;
    ```

1. Create a Vite configuration file.

    ```javascript title="vite.config.js"
    import { defineConfig } from "vite"

    // https://vitejs.dev/config/
    export default defineConfig({})
    ```

1. Run your application.

    ```bash
    npx vite .
    ```

    Hit `o` key and then `<Enter>` to open up [`http://localhost:5173`](http://localhost:5173) in your browser

    You should see `Hello Tevm` rendered.

1. Add a shortcut script to `package.json`.

    ```json title="package.json" {8}
    {
      "name": "tevm-app",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "npx vite ."
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "tevm": "^1.0.0-next.110",
        "viem": "^2.21.2"
      },
      "devDependencies": {
        "typescript": "^5.5.4",
        "vite": "^5.4.3"
      }
    }
    ```    

## Create a forked blockchain

With the project created, the next step is to create a fork of a real-world blockchain. 
The simplest way to do this is the use a [`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient), a [Viem client](https://viem.sh/docs/clients/intro.html) that uses an in-memory [transport](https://viem.sh/docs/clients/intro#transports). 
Instead of sending requests to an RPC provider like [Alchemy](https://www.alchemy.com/) this client processes requests with tevm in a local EVM instance running in JavaScript.

Memory client has similar features to [`anvil`](https://book.getfoundry.sh/anvil/):

- Optionally fork an existing network.
- Run special scripts that have advanced functionality.
- Allow you to view and modify the chain state, so you can mint yourself ETH, run traces, modify storage, etc.
- Be Extremely hackable. You can mint yourself ETH, run traces, modify storage, and more.

:::tip[Use tree shakable actions]

MemoryClient is an all-inclusive client. 
This client helps make exploring tevm for the first time easier.
If you are building a UI with tevm, it is highly recomended you use [`createClient`](https://viem.sh/docs/clients/custom) from Viem along with [`createTevmTransport`](/reference/tevm/memory-client/functions/createtevmtransport) and [tree shakable actions](https://en.wikipedia.org/wiki/Tree_shaking).

See [the client guide](/learn/clients/) for more info.

:::

Replace `src/main.ts` with the file below, and see you can get the block number from [Redstone](https://redstone.xyz/docs/what-is-redstone).

```typescript title="src/main.ts"
import { createMemoryClient, http } from "tevm";
import { redstone } from "tevm/common";

const app = document.querySelector("#app") as Element;

const memoryClient = createMemoryClient({
  common: redstone,
  fork: {
    // @warning we may face throttling using the public endpoint
    // In production apps consider using `loadBalance` and `rateLimit` transports
    transport: http("https://rpc.redstonechain.com")({}),
  },
});

async function runApp() {
  app.innerHTML = `
    <b>Status:</b> <span id="status">initializing</span>

    <details>
    <summary>memoryClient content</summary>
    <div id="content"></div>
    </details>
      
    <b>Forked at block:</b> <span id="blocknumber">???</span>      
    `;
  
  document.querySelector("#content")!.innerHTML = `
    <table>
      <tr>
        <th>Key</th>
        <th>Type</th>
        <th>Value</th>
      </tr>
      ${Object.keys(memoryClient)
        .map(key => `
          <tr>
            <td>${key}</td>
            <td>${typeof memoryClient[key]}</td>
            <td>${typeof memoryClient[key] != "function" && memoryClient[key] || ""}</td>
          </tr>`)
     .reduce((a,b) => a+b, "")
    }
    </table>
`;
  
  const status = app.querySelector("#status")!;
  
  status.innerHTML = "Working";
  const blockNumber = await memoryClient.getBlockNumber();
  
  document.querySelector("#blocknumber")!.innerHTML = blockNumber;

  status.innerHTML = "Done";
}
 
runApp();
```

<details>

<summary>Explanation</summary>

```typescript
import { createMemoryClient, http } from "tevm";
import { redstone } from "tevm/common";
```

Import the functions we need.

```typescript
const app = document.querySelector("#app") as Element;
```

Use the `app` element in `index.html`.

```typescript
const memoryClient = createMemoryClient({  
  common: redstone,
  fork: {
    // @warning we may face throttling using the public endpoint
    // In production apps consider using `loadBalance` and `rateLimit` transports
    transport: http("https://rpc.redstonechain.com")({}),
  },
});
```

Create a [`MemoryClient`](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient) that forks the [Redstone](https://redstone.xyz/docs/what-is-redstone) network.
We use Redstone because it does not have throttling.

It is recomended you also pass in a [`Common`](/reference/tevm/common/type-aliases/common/) chain object when forking. 
This improves the performance of fork and guarantees tevm has all the correct chain information such as which EIPs and hardforks to use.

```typescript
async function runApp() {
```

This function actually does the work and runs the app.

```typescript
  app.innerHTML = `
    <b>Status:</b> <span id="status">initializing</span>

    <details>
    <summary>memoryClient content</summary>
    <div id="content"></div>
    </details>
      
    <b>Forked at block:</b> <span id="blocknumber">???</span>      
    `;
```    

This sets the HTML inside the `app` element. 
  
```typescript  
  document.querySelector("#content")!.innerHTML = `
```

Specify the content of the `content` element.

```typescript
    <table>
      <tr>
        <th>Key</th>
        <th>Type</th>
        <th>Value</th>
      </tr>
      ${Object.keys(memoryClient)
        .map(key => `
          <tr>
            <td>${key}</td>
            <td>${typeof memoryClient[key]}</td>
            <td>${typeof memoryClient[key] != "function" && memoryClient[key] || ""}</td>
          </tr>`)
     .reduce((a,b) => a+b, "")
   }
</table>
`;
```

The content is a table of the keys of `memoryClient`, and their types, and their values.
The table is created using [MapReduce](https://en.wikipedia.org/wiki/MapReduce).

```typescript
  const status = app.querySelector("#status")!;
  
  status.innerHTML = "Working";
```

At this point we start running asynchronous functions and waiting for them to finish, so we change our status to "Working".

```typescript
  const blockNumber = await memoryClient.getBlockNumber();
```

Get the [current block number](/reference/tevm/ethers/classes/tevmprovider/#getblocknumber) at the time of the fork. Note that while the blockchain continues to update, the tevm fork is "frozen" and does not get those updates.

```typescript
  document.querySelector("#blocknumber")!.innerHTML = blockNumber;

  status.innerHTML = "Done";
}
```

Update the block number, and change the status to done.

```typescript
runApp();
```

Run the async function.

</details>

When we fork a blockchain the block number will be pinned to the block number at the time of the fork.
Any future changes will not be reflected in tevm unless you create another fork.

## Actions

As you can see when you expand **memoryClient content** actions, many of the Viem actions are available under the same name. 

-  [Public actions](https://viem.sh/docs/actions/public/introduction)
-  [Test actions](https://viem.sh/docs/actions/test/introduction)
-  [Wallet actions](https://viem.sh/docs/actions/wallet/introduction)

For example, you can modify `src/main.ts` to see how they work.

```typescript title="src/main.ts" {19-20,23-30,38-48,50-63}
import { createMemoryClient, http } from "tevm";
import { redstone } from "tevm/common";
    
const app = document.querySelector("#app") as Element;
   
const memoryClient = createMemoryClient({
  common: redstone,
  fork: {
    // @warning we may face throttling using the public endpoint
    // In production apps consider using `loadBalance` and `rateLimit` transports
    transport: http("https://rpc.redstonechain.com")({}),
  },
});
      
async function runApp() {
  app.innerHTML = `
    <b>Status:</b> <span id="status">initializing</span> <br />
    <b>Forked at block:</b> <span id="blocknumber">???</span> <br />
    <h2>Output</h2>
    <div id="outputPanel"></div>
    `;
   
  const addToOutput = (obj, title) => {
    output.innerHTML += `
      <h4>${title}</h4>
      <pre>
${JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 4)}
      </pre>
  `
  }
  
  const status = app.querySelector("#status")!;
    
  status.innerHTML = "Working";
  const blockNumber = await memoryClient.getBlockNumber();
         
  document.querySelector("#blocknumber")!.innerHTML = blockNumber;
  const output = document.querySelector("#outputPanel") as Element;
    
  const txn = await memoryClient.getTransaction({
    hash: "0x58d3e6c9f7b66ec3cd984219dd48fae465a6e7fc0f51688ef4864045a363b4c2"
  });
  addToOutput(txn, "Transaction")
   
  const block = await memoryClient.getBlock({
    blockNumber: txn.blockNumber
  });
  addToOutput(block, "Transaction block");

  const address = "0x" + "BAD060A7".padStart(40, "0")
  addToOutput(address, "Account address")
  
  const balanceT0 = BigInt(await memoryClient.getBalance({address}))        
  await memoryClient.setBalance({
    address,
    value: 1000
  })
  const balanceT1 = BigInt(await memoryClient.getBalance({address}))
  
  addToOutput({
    initialBalance: balanceT0,
    afterSetBalance: balanceT1 
  }, "Balances") 
  
  status.innerHTML = "Done";
}   
  
runApp();
```

<details>

<summary>Explanation</summary>

```typescript
    <h2>Output</h2>
    <div id="outputPanel"></div>
```

We need an output panel.

```typescript
  const addToOutput = (obj, title) => {
```

A function to write to the output panel.

```typescript
    output.innerHTML += `
      <h4>${title}</h4>
      <pre>
${JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 4)}
      </pre>
  `
  }
```

The second parameter of [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer) lets us replace values that we don't want `JSON.stringify` to display.
Here, the function replaces values of [type `bigint`](https://www.w3schools.com/js/js_bigint.asp), which are not part of the JSON standard, with strings, which are. 


```typescript
  const output = document.querySelector("#outputPanel") as Element;

  const txn = await memoryClient.getTransaction({
    hash: "0x58d3e6c9f7b66ec3cd984219dd48fae465a6e7fc0f51688ef4864045a363b4c2"
  });
  addToOutput(txn, "Transaction")

  const block = await memoryClient.getBlock({
    blockNumber: txn.blockNumber
  });
  addToOutput(block, "Transaction block");
```

Use Viem's [`getTransaction`](https://viem.sh/docs/actions/public/getTransaction) and [`gtBlock`](https://viem.sh/docs/actions/public/getBlock).

``typescript
  const address = "0x" + "BAD060A7".padStart(40, "0")
  addToOutput(address, "Account address")
```

Get an address that [isn't in use](https://explorer.redstone.xyz/address/0x00000000000000000000000000000000BAd060A7).
  
```typescript  
  const balanceT0 = BigInt(await memoryClient.getBalance({address}))
```  

Use [`getBalance`](https://viem.sh/docs/actions/public/getBalance) to get the address's balance.

```typescript
  await memoryClient.setBalance({
    address,
    value:  1_000_000_000_000_000_000n
  })
  const balanceT1 = BigInt(await memoryClient.getBalance({address}))
```

Use the test action [`setBalance`](https://viem.sh/docs/actions/test/setBalance) to "give" `address` 1 ETH.

```typescript  
  addToOutput({
    initialBalance: balanceT0,
    afterSetBalance: balanceT1 
  }, "Balances") 
```

Report the change on the output panel.

</details>

## Calling tevm

We want to create transactions and see how they affect the local copy (and therefore how they would affect the blockchain).
To do this we need to call several functions:

1. [`setBalance`](/reference/tevm/memory-client/functions/creatememoryclient/#setbalance) to give an address ETH (only locally, of course).
1. [`tevmContract`](/reference/tevm/memory-client/functions/tevmcontract) to call `greet`, a [`view` function](https://docs.soliditylang.org/en/develop/contracts.html#view-functions) that gets us the current greeting. 
1. `tevmContract` again, to send out a transaction to change the greeting.
1. [`tevmMine`](/reference/tevm/memory-client/functions/tevmmine/) to create a block to include the transaction.
1. `tevmContract` a third time to see the greeting has changed.

Optionally, to see what we've done, we can use these functions:

1. [`getBlock`](/reference/tevm/blockchain/functions/getblock/) to examine the block we created. 
1. [`getTransactionReceipt`](/reference/tevm/state/functions/getforkclient/#gettransactionreceipt) to examine the transaction.

We will access an instance of [Hardhat's Greeter contract](https://explorer.redstone.xyz/address/0x8B7CFA6e4684037f4b4c1F439422fF5B2D0Ab523?tab=contract), deployed on [Redstone](https://redstone.xyz/docs/what-is-redstone).


Replace `src/main.ts` with this file.

```typescript title="src/main.ts"  {15-42,70-112} copy
import { createMemoryClient, http } from "tevm";
import { redstone } from "tevm/common";

const app = document.querySelector("#app") as Element;

const memoryClient = createMemoryClient({
  common: redstone,
  fork: {
    // @warning we may face throttling using the public endpoint
    // In production apps consider using `loadBalance` and `rateLimit` transports
    transport: http("https://rpc.redstonechain.com")({}),
  },
});

const greeterABI = [
  {
      "inputs": [],
      "name": "greet",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_greeting",
              "type": "string"
          }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
] as const


async function runApp() {
  app.innerHTML = `
    <b>Status:</b> <span id="status">initializing</span> <br />
    <b>Forked at block:</b> <span id="blocknumber">???</span> <br />
    <h2>Output</h2>
    <div id="outputPanel"></div>
    `;

  const addToOutput = (obj, title) => {
    output.innerHTML += `
      <h4>${title}</h4>
      <pre>
${JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 4)}
      </pre>
  `
  }

  const status = app.querySelector("#status")!;

  status.innerHTML = "Working";
  const blockNumber = await memoryClient.getBlockNumber();

  document.querySelector("#blocknumber")!.innerHTML = blockNumber;
  const output = document.querySelector("#outputPanel") as Element;

  const address = "0x" + "BAD060A7".padStart(40, "0")
  const setBalanceResult = await memoryClient.setBalance({
    address,
    value: 10n**18n    
  })
  addToOutput(setBalanceResult, `setBalance for ${address}`)

  const greetingResult1 = await memoryClient.tevmContract({
    abi: greeterABI,
    to: "0x8B7CFA6e4684037f4b4c1F439422fF5B2D0Ab523",
    functionName: "greet",
  })
  addToOutput(greetingResult1, "first call to greet()")  

  const setGreetingResult = await memoryClient.tevmContract({
    abi: greeterABI,
    to: "0x8B7CFA6e4684037f4b4c1F439422fF5B2D0Ab523",
    from: address,
    functionName: "setGreeting",
    args: ["Change to this greeting"],
    createTransaction: "on-success"
  })
  addToOutput(setGreetingResult, "call to setGreeting(string)")  

  const mineResult = await memoryClient.tevmMine();
  addToOutput(mineResult, "mineResult")    

  const greetingResult2 = await memoryClient.tevmContract({
    abi: greeterABI,
    to: "0x8B7CFA6e4684037f4b4c1F439422fF5B2D0Ab523",
    functionName: "greet",
  })
  addToOutput(greetingResult2, "second call to greet()")  

  const blockData = await memoryClient.getBlock({
    blockHash: mineResult.blockHashes[0]
  })
  addToOutput(blockData, "Block data")  

  const txnData = await memoryClient.getTransactionReceipt({
    hash: blockData.transactions[0]
  })
  addToOutput(txnData, "Transaction data")  

  status.innerHTML = "Done";
}

runApp();
```

<details>

<summary>Explanation</summary>

```typescript
const greeterABI = [
  {
    .
    .
    .
  }
] as const
```

This is the part of the Greeter contract's ABI we need.
On a production system you might want to serve it from a separate file, but this is simpler.

```typescript
  const address = "0x" + "BAD060A7".padStart(40, "0")
  const setBalanceResult = await memoryClient.setBalance({
    address,
    value: 10n**18n
  })
```

Create our source address and provide it with ETH to run transactions.

```typescript
  const greetingResult1 = await memoryClient.tevmContract({
    abi: greeterABI,
    to: "0x8B7CFA6e4684037f4b4c1F439422fF5B2D0Ab523",
    functionName: "greet",
  })
  addToOutput(greetingResult1, "first call to greet()")  
```

Use [`tevmContract`](/reference/tevm/memory-client/functions/tevmcontract/) to issue a call to a `view` function.
Normally, we would need to provide the ABI, the address, and name of the function, and the arguments.
However, `greet()` does not take any arguments, so we can either provide an empty list or just omit the parameter.

```typescript
  const setGreetingResult = await memoryClient.tevmContract({
```

The same `tevmContract` function is also used to send transactions.

```typescript
    abi: greeterABI,
    to: "0x8B7CFA6e4684037f4b4c1F439422fF5B2D0Ab523",
    functionName: "setGreeting",
    args: ["Change to this greeting"],
```

`setGreeting` takes one argument, a `string`, so we provide that in the `args` list.

```typescript
    from: address,
```

The ability to specify `from` lets us figure the results of actions by other users, and to anticipate the actions of our user without a need to ask the wallet extension for a signature.

```typescript
    createTransaction: "on-success"
  })
  addToOutput(setGreetingResult, "call to setGreeting(string)")
```

`createTransaction` lets us specify if tevm should create a transaction.
Here we are modifying the blockchain state, so we need one.

```typescript
  const mineResult = await memoryClient.tevmMine();
  addToOutput(mineResult, "mineResult")
```

Transactions only modify the blockchain state when they are mined into a block that is then added to the blockchain.

The remainder of the code should be self-explanatory. 
We call `greet()` again to see the new greeting, and then read the block we mined and the transaction inside it.
The transaction data lets us verify that the transaction really did come from `address`.

</details>

## Conclusion

At this point you should be able to use `tevmClient` for the basics, to fork a blockchain and then observe the results of user actions before sending a real-life transaction.

This is just the basic use, there are more advanced things you can do with tevm:

- Run Typescript as part a tevm contract call
- Compile contracts
- Deploy contracts

More tutorials are coming soon.
