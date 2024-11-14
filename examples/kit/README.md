# tevm/kit Stores

`tevm/kit` provides reactive Ethereum contract stores that integrate seamlessly with Svelte. These stores follow Svelte's intuitive store pattern while enabling both local and blockchain-based interactions.

The advantage to using tevm/kit stores include

- Extremely easy intuitive rune-based api for interacting with contracts
- Advanced functionality such as optimistic updates
- Control over whether contract calls occur during SSG, SSR, or on client only
- Reactive to contract writes with 0 configuration via Tevm Engine watching storage slot changes in background

## Writable Stores

The simplest way to use a contract is with the `writable` store:

### writable

For separate Solidity files:

```solidity contracts/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
```

```typescript src/lib/counter.ts
import { writable } from 'tevm/kit';
import { configs } from '@/chains';
import { Counter } from '../contracts/Counter.sol';

// Local instance (no config)
const counter = writable(Counter);

// Forked instance
const forkedCounter = writable(Counter, { fork: configs.mainnet });

// Forked instance that follows the tip
const liveCounter = writable(Counter, { 
  fork: { 
    ...configs.mainnet,
    rebase: true 
  } 
});
```

#### Example with Inline Solidity

```svelte
<script>
  import { writable } from 'tevm/kit';
  import { configs } from '@/chains';

  const counter = writable(Counter, { 
    fork: { 
      ...configs.mainnet,
      rebase: true 
    } 
  });

  async function increment() {
    await counter.increment();
  }
</script>

<sol>
contract Counter {
    uint256 public count;

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
</sol>

<main>
  <p>Count: {$counter.count}</p>
  <button on:click={increment}>Increment</button>
</main>
```

**Configuration Options:**
- No config: Runs in local mode
- `fork`: Uses forked network state
  - `rebase`: When true, automatically updates with new blocks. Any pending transactions will be reorged to front of the chain on top of the latest blocks.

## Configuring an account

If broadcasting transactions you must configure a signer. Simulating writes does not require a signer as support for impersonating any account is available.

When it comes to configuring a signer you have two options

1. You can set a global signer using the `setSigners` context api.

```svelte
<script>
import {setSigners} from 'tevm/kit'
// TODO I forgot viem api for this
import {accountFromPrivateKey, createRandomPrivateKey} from 'tevm/account'

const account = accountFromPrivateKey(createRandomPrivateKey)
setSigners(account)
</script>
```

2. You can explitly pass in a signer

```svelte
<script>
// TODO I forgot viem api for this
import {accountFromPrivateKey, createRandomPrivateKey} from 'tevm/account'
import { writable } from 'tevm/kit';
import { configs } from '@/chains';

const account = accountFromPrivateKey(createRandomPrivateKey)
setSigners(account)

const counter = writable(Counter, { 
  fork: { 
    ...configs.mainnet,
    rebase: true 
  } 
});

async function increment() {
  await counter.increment();
}
</script>
```

## Readable Stores

For scenarios where you only need to observe state without the ability to modify it, readable stores provide a lightweight alternative. They accept the same configuration options as writable stores.

### readable

```typescript
import { readable } from 'tevm/kit';
import { configs } from '@/chains';

// Local read-only instance
const localCounter = readable(Counter);

// Forked read-only instance that follows the tip
const liveCounter = readable(Counter, { 
  fork: { 
    ...configs.mainnet,
    rebase: true 
  } 
});
```

#### Example

```html
<script>
  import { readable } from 'tevm/kit';
  import { configs } from '@/chains';

  // Read-only contract that follows the latest block
  const counter = readable(Counter, { 
    fork: { 
      ...configs.mainnet,
      rebase: true 
    } 
  });
</script>

<main>
  <p>Read-only Count: {counter.count}</p>
</main>
```

## Summary

The tevm/kit package offers versatile contract stores for building reactive Ethereum applications in Svelte. By providing both writable and readable variants with flexible configuration options, developers can easily create local or network-connected instances that suit their specific needs.
