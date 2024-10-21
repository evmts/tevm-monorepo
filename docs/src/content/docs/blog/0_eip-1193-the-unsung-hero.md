---
title: "EIP-1193: The Unsung Hero of Ethereum Development"
description: "Discover how EIP-1193 is revolutionizing JavaScript libraries in the Ethereum ecosystem, with practical examples and a vision for the future."
date: 2024-10-20
author: "fucory"
---

### The Power of Standards in Ethereum Development

You are likely building your SDK wrong if it accepts a string rpc url parameter.

In the ever-evolving world of blockchain technology, standards are the unsung heroes that keep our digital universe from descending into chaos. They're the silent guardians of interoperability, the champions of frictionless development, and the backbone of seamless integration. Among these standards, [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) stands out as a beacon of hope for JavaScript libraries interacting with Ethereum.

Imagine building a LEGO masterpiece where every set has slightly different brick sizes. Frustrating, right? That's Ethereum development without EIP-1193. With it, every piece fits perfectly. Let's explore why this standard is revolutionizing blockchain development.

#### Demystifying EIP-1193: The Standard Powering JavaScript Software Pluggability

At its core, EIP-1193 is a standardized interface for Ethereum providers in JavaScript applications. It's like a universal remote control for your Ethereum interactions. The heart of EIP-1193 is the `request` function, your gateway to the Ethereum blockchain for sending JSON-RPC requests and listening for critical events.

Let's see EIP-1193 in action:

```typescript
import { createMemoryClient } from 'tevm';
import { http } from 'viem';

const eip1193ForkTransport = http('https://mainnet.optimism.io')({});
const tevmClient = createMemoryClient({
  fork: { transport: eip1193ForkTransport }
}) satisfies EIP1193Provider;

tevmClient.on('connect', () => console.log('Blockchain connection established. Ready for action!'));

const balance = await tevmClient.request({
  method: 'eth_getBalance',
  params: ['0x1234567890abcdef1234567890abcdef12345678', 'latest'],
});

await tevmClient.request({
  method: 'anvil_setBalance',
  params: ['0x1234567890abcdef1234567890abcdef12345678', '0xDE0B6B3A7640000'], // 1 ETH
});
```

This example demonstrates the power of EIP-1193 in orchestrating various blockchain interactions through a single, consistent interface. It uses the [HTTP transport](https://viem.sh/docs/clients/transports/http.html) from Viem, a powerful Ethereum library that fully embraces EIP-1193, and the [MemoryClient](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) from Tevm, showcasing the interoperability that EIP-1193 enables.

#### The EIP-1193 Advantage: Flexibility, Composability, and Future-Proofing

EIP-1193 offers several key benefits:

1. **Unparalleled Flexibility**: Seamlessly switch between different transports without rewriting core logic.
2. **Composability at Its Finest**: Mix and match tools and libraries with ease.
3. **Future-Proof Your Code**: Adapt to new features with minimal code changes as the Ethereum ecosystem evolves.

Let's see how we can refactor a traditional SDK to leverage the power of EIP-1193:

```typescript
// Traditional approach
class LegacySDK {
  constructor(rpcUrl) {
    this.rpcUrl = rpcUrl;
  }

  async getBalance(address) {
    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    });
    return await response.json();
  }
}

// Refactored EIP-1193 compatible SDK
type EIP1193Provider = {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
};

class ImprovedSDK implements EIP1193Provider {
  private transport: EIP1193Provider;

  constructor(transport: EIP1193Provider) {
    this.transport = transport;
  }

  async request({ method, params }: { method: string; params?: any[] }): Promise<any> {
    return this.transport.request({ method, params });
  }

  async getBalance(address: string): Promise<string> {
    const result = await this.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    return result;
  }

  async setBalance(address: string, balance: string): Promise<void> {
    await this.request({
      method: 'anvil_setBalance',
      params: [address, balance],
    });
  }
}

// Usage example
import { http } from 'viem';

const transport = http('https://mainnet.infura.io/v3/YOUR_API_KEY');
const sdk = new ImprovedSDK(transport);

const balance = await sdk.getBalance('0x1234567890abcdef1234567890abcdef12345678');
await sdk.setBalance('0x1234567890abcdef1234567890abcdef12345678', '0xDE0B6B3A7640000'); // 1 ETH

```

This refactored SDK demonstrates the power of EIP-1193:

1. It accepts any EIP-1193 compatible transport, not just a URL string.
2. The SDK itself implements the EIP-1193 interface, making it composable with other tools.
3. It maintains high-level methods (`getBalance`, `setBalance`) while exposing the flexible `request` method.
4. Switching between different transports (HTTP, WebSocket, IPC) becomes trivial.

By adopting EIP-1193, we've transformed a rigid, single-purpose SDK into a flexible, composable tool that can easily adapt to different Ethereum environments and future changes in the ecosystem.

#### Embracing the Future: Building an Optimistic Transport

To showcase EIP-1193's potential, let's create a custom transport handling [optimistic updates](https://medium.com/@kyledeguzmanx/what-are-optimistic-updates-483662c3e171). We'll use Ponder's `loadBalance` and `rateLimit` transports, which can significantly optimize performance in Ethereum interactions:

```typescript
import { custom, http } from 'viem';
import { createMemoryClient } from 'tevm';
import { loadBalance, rateLimit } from '@ponder/core';

const httpTransport = loadBalance([
  rateLimit(http('https://cloudflare-eth.com'), { requestsPerSecond: 75 }),
  rateLimit(http('https://eth-mainnet.public.blastapi.io'), { requestsPerSecond: 75 }),
]);

let pendingTxs = [];
let tevmClient = createMemoryClient({
  fork: { transport: httpTransport },
});

const optimisticTransport = custom({
  request: async (request) => {
    const { method, params } = request;

    if (method === 'eth_sendRawTransaction') {
      pendingTxs.push(request);
      let newTevmClient = createMemoryClient({
        fork: { transport: httpTransport },
      });
      await newTevmClient.ready()
      tevmClient = newTevmClient
      return httpTransport.request(request);
    }

    if (method === 'eth_getTransactionReceipt') {
      const receipt = await httpTransport.request(request);
      const pendingIndex = pendingTxs.findIndex(tx => tx.params[0] === params[0]);
      if (receipt && pendingIndex !== -1) {
        pendingTxs.splice(pendingIndex, 1);
      }
      return receipt;
    }

    if (method === 'eth_call' && params[1] === 'pending') {
      for (const pendingTx of pendingTxs) {
        await tevmClient.request(pendingTx);
      }
      await tevmClient.mine();
      return tevmClient.request(request);
    }

    return httpTransport.request(request);
  }
});
```

This implementation showcases advanced concepts like load balancing, rate limiting, optimistic updates, and state simulation, all encapsulated within the EIP-1193 `request` function. Ponder's [transport utilities](https://www.ponder.sh/docs/guides/transports) (`loadBalance` and `rateLimit`) are key here, demonstrating how EIP-1193 compatibility enables the creation of highly optimized and flexible blockchain interactions. By balancing requests across multiple endpoints and controlling request rates, we can significantly enhance performance and reliability in high-load scenarios.

#### Cross-Chain Potential: EIP-1193 Beyond Ethereum

EIP-1193's principles can be extended to facilitate cross-chain development:

```typescript
type TransportRequestParams = {
  method: string;
  params?: any;
  chainId?: number;
};

type JsonRpcResponse = {
  jsonrpc: string;
  result?: any;
  error?: { code: number; message: string };
  id: number;
};

type Transport = {
  request: (params: TransportRequestParams) => Promise<any>;
};

type TransportMap = { [chainId: number]: Transport };

interface Options {
  defaultChainId?: number;
}

export function multiTransport(
  transportOrMap: Transport | TransportMap,
  options?: Options
): Transport {
  return {
    async request({ method, params, chainId }: TransportRequestParams): Promise<JsonRpcResponse> {
      const chain = chainId ?? options?.defaultChainId ?? 1;
      const isSingleTransport = typeof (transportOrMap as Transport).request === 'function';

      try {
        const transport = isSingleTransport
          ? (transportOrMap as Transport)
          : (transportOrMap as TransportMap)[chain];

        if (!transport) throw new Error(`Transport not found for chainId: ${chain}`);

        const response = await transport.request({ method, params: { ...params, chainId: chain } });
        return response;
      } catch (error) {
        return {
          jsonrpc: '2.0',
          error: { code: -32603, message: error instanceof Error ? error.message : 'Unknown error' },
          id: 1,
        };
      }
    },
  };
}
```

This approach enables chain-agnostic development via adding a chainId property and progressive enhancement for rpcs that do and do not supporting it. If this became an actual standard this transport allows you to use it without breaking users using legacy rpcs, showcasing the versatility of [Viem's transport system](https://viem.sh/docs/clients/intro).

#### Beyond the Basics: Additional Benefits of EIP-1193

EIP-1193 offers several other advantages:

1. **Improved Testing and Mocking**: Easier creation of mock providers for robust testing.
2. **Stable APIs**: Reduces the need for breaking changes as the ecosystem evolves.
3. **Enhanced Security**: Clear, auditable API surface simplifies security measures.
4. **Inter-App Communication**: Facilitates standardized communication in mini-app ecosystems.

#### The Road Ahead: EIP-1193 and the Future of Ethereum Tooling

As blockchain technology advances, EIP-1193 is set to play a pivotal role. It paves the way for innovations like [light client integration](https://x.com/VitalikButerin/status/1847810314735436180) and faster local execution, shaping the future of decentralized applications.

#### Your EIP-1193 Journey Starts Now

EIP-1193 is more than a technical standard; it's a paradigm shift in Ethereum development. It unlocks a world of composable, flexible, and future-proof blockchain interactions. Whether you're building complex DeFi systems or exploring Web3, EIP-1193 is your key to cutting-edge Ethereum development.

Start by refactoring an existing project to use an EIP-1193 provider. Embrace this standard in both your internal and external library code to fully leverage its power.

Remember, in blockchain development, standards like EIP-1193 aren't just guidelines – they're superpowers that elevate your capabilities as a developer.

For more information:
- [EIP-1193 Specification](https://eips.ethereum.org/EIPS/eip-1193)
- [Tevm GitHub Repository](https://github.com/evmts/tevm-monorepo)
- [Ponder transport documentation](https://www.ponder.sh/docs/guides/transports)
- [Viem Documentation](https://viem.sh/)
