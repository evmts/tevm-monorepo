# Hello world

## Create a contract

Now let's create a simple hello-world contract `src/HelloWorld.s.sol`.

The `.s.sol` is a convention from [forge scripts](https://book.getfoundry.sh/reference/forge/forge-script). You can think of evmts scripts as being forge scripts you are executing in the browser.

```solidity
pragma solidity 0.8.13;
contract HelloWorld {
    function run() public pure returns (string memory) {
        return "Hello World";
    }
}
```

## Use contract in typescript code

Now we can import our contract and execute it with `@evmts/core`

```typescript
import { executeScript } from "@evmts/core";
import { HelloWorld } from "./HelloWorld.s.sol";

executeScript(HelloWorld).then((greeting) => {
  console.log(greeting);
});
```
