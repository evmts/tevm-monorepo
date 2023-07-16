# useContractRead()

[Wagmi hook](https://wagmi.sh/react/hooks/useContractRead) for calling a read method on the contract.

To use this hook import it directly from wagmi. This guide will show how to integrate it with Evmts.

For more documentation specific to useContractRead see [wagmi documentation](https://wagmi.sh/react/hooks/useContractRead)

- **Example**

To use with wagmi just call `Contract.read.methodName(...args)` just like you are calling the solidity function directly. Pass the result into useContractRead

::: code-group

```ts [example.ts]
import { useAccount, useContractRead } from "wagmi";
import { ERC20 } from "./ERC20.sol";

export const ReadContract = () => {
  const { address, isConnected } = useAccount();

  const { data } = useContractRead({
    ...ERC20.read({chainId: 1}).balanceOf(address!),
    enabled: isConnected,
  });
  return (
    <div>
      <div>balance: {data?.toString()}</div>
    </div>
  );
};
```

```solidity [ERC20.sol]
pragma solidity ^0.8.17;

contract ERC20 {
    ...
}
```

```ts [evmts.config.ts]
import { defineConfig } from "@evmts/config";

/**
 * @see https://evmts.dev/reference/config.html
 */
export default defineConfig(() => ({
  /**
   * Deployments allow evmts to configure default addresses for different networks
   */
  deployments: [
    {
      name: "ERC20",
      address: "0x4204204204204204204204204204204204204204",
    },
  ],
  /**
   * Keep this in sync with package.json and foundry.toml
   */
  solcVersion: "0.8.19",
}));
```

:::

- **Live example**

TODO stackblitz

- **See also:** [Viem docs](https://viem.sh/)
