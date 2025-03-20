# remix-example

Remix implementation of the Tevm interface explorer.

## Table of contents

- [Overview](#overview)
- [About the project](#about-the-project)
  - [How to use](#how-to-use)
  - [Notes](#notes)
- [Architecture](#architecture)
  - [Actions (libraries, state management)](#actions-libraries-state-management)
  - [Components](#components)
- [Getting started](#getting-started)
- [Acknowledgments](#acknowledgments)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Think ~ Etherscan + Remix**

Basically, it's a way to interact with contracts and externally owned accounts (EOAs) **in a simulated environment, from a forked chain**, with [a comprehensive set of actions](https://tevm.sh/learn/actions/) exposed by [a Tevm memory client](https://tevm.sh/learn/clients/).

As you interact with accounts, all [transactions are processed](https://tevm.sh/reference/tevm/actions/type-aliases/callhandler) and recorded by the client, which always considers the latest state of the chain; i.e. the initial state at the time of the fork, plus all the local transactions.

When you search for a contract, it will attempt to retrieve its
ABI with [WhatsABI](https://github.com/shazow/whatsabi). You can then interact with it using the interface, or perform any arbitrary call with encoded data.

The clients for each chain are synced with the local storage, as well as the transaction history. When the chain is reset, the client forks the chain again at the latest block, which incidentally resets the local transactions history.

## About the project

### How to use

- **Search**
  - Select a chain and paste the address of a contract, or click `Try with an example`.
  - Click `Fork chain` to fork the chain again at the latest block.
- **Caller**
  - Enter an address to impersonate during calls; you can click `owner` to impersonate the owner of the contract if it found an appropriate method.
  - Toggle `skip balance` to [ignore or not the native tokens balance](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams/#skipbalance) during calls.
- **Low-level call**
  - Call the current account with an arbitrary amount of native tokens and/or arbitrary encoded data.
- **Contract interface**
  - The ABI is displayed inside a table you can navigate through; fill the inputs if relevant, and click `Call` to send a transaction.
  - Read methods are highlighted when they were found with certitude.
- **Local transactions**
  - The history of transactions displayed is the one recorded by the client for the selected chain, since the last fork.
  - You can navigate through the history, click ↓ to see more details (data, errors, logs, inputs...), and click on an address to search for it.

### Notes

There are a few issues/pitfalls to be aware of:

- Obviously, there might (will probably) be some unhandled errors, rejections, or bugs. Please report them so we can fix them and improve either Tevm or this example!
- WhatsABI might struggle with proxies, currently the app doesn't support redirecting to the implementation contract.
- Currently, to use Tevm on the browser, we need to expose the API keys to the browser (for RPC queries). This is definitely not ideal, but the only way to be able to use Tevm clients synced with local storage.

### Implementation Status

This Remix implementation is a work in progress with the following features:

- ✅ Basic UI components and layout
- ✅ Chain selection and forking
- ✅ Contract and account state display
- ✅ Contract ABI fetching and detection
- ✅ Caller selection and impersonation
- ✅ Skip balance toggle
- ✅ Contract read function interface
- 🚧 Contract write function interface (coming soon)
- 🚧 Arbitrary call interface (coming soon)
- 🚧 Transaction history tracking (coming soon)
- 🚧 ChainID validation and network switching (coming soon)

## Architecture

```ml
app - "Main entry points for pages, layout and routing"
├── routes - "Route-specific pages"
│   ├── _index.tsx - "Home page"
│   ├── $account.tsx - "Account page (whenever an address is searched)"
components - "Everything related to the UI"
├── common - "Recurrent components across the app"
├── config - "Independent config-related components (e.g. theme)"
├── core - "Components related to the main logic/purpose of the app"
├── layouts - "Layouts for the app used across all pages"
├── templates - "Generic templates for better consistency"
├── ui - "shadcn/ui components"
lib - "Libraries, utilities and state management"
├─ constants - "Constants for the site, default config, starting points"
├─ hooks - "Custom hooks (n.b. we're mostly using stores for state management)"
├─ store - "State management (providers, config, transactions, etc.)"
├─ types - "Type definitions that are used across multiple files"
styles - "Global styles, theme, and tailwind classes"
```

See the following sections for the code specific to the libraries, state management and components used.

### Actions (libraries, state management)

- **Tevm**: [lib/tevm](./app/lib/tevm.ts)
- **WhatsABI**: [lib/whatsabi](./app/lib/whatsabi.ts)
- Providers
  - **constants**: [lib/constants/providers](./app/lib/constants/providers.ts)
  - **store**: [lib/store/use-provider](./app/lib/store/use-provider.ts)
- Config (other parameters)
  - **store**: [lib/store/use-config](./app/lib/store/use-config.ts)
- Transactions
  - **store** (history & inputs): [lib/store/use-tx](./app/lib/store/use-tx.ts)

### Components

- App
  - Layout: [root.tsx](./app/root.tsx)
  - Main entry point (**/**): [_index.tsx](./app/routes/_index.tsx)
  - Main entry point (**/0x...**): [$account.tsx](./app/routes/$account.tsx)
- Header
  - **search bar**: [search-bar](./app/components/core/search-bar.tsx)
  - **chain selection**: [chain](./app/components/core/selection/chain.tsx)
  - **account state**: [account-state](./app/components/core/account-state.tsx)
- Interact
  - **caller selection**: [caller](./app/components/core/selection/caller.tsx)
  - **skip balance selection**: [skip-balance](./app/components/core/selection/skip-balance.tsx)
  - **contract interface**: [interface](./app/components/core/interface/index.tsx)
    - **read functions**: [read-functions](./app/components/core/interface/read-functions.tsx)
    - **result display**: [result](./app/components/core/interface/result.tsx)
- History
  - **tx history**: [tx-history](./app/components/core/tx-history/index.tsx) (Coming soon)

## Getting started

This is a [Remix](https://remix.run/) project, using [shadcn/ui](https://ui.shadcn.com/) components and design, as well as the overall project's organization.

The minimal steps to get started are:

1. Clone the repository and navigate to this directory
   ```bash
   git clone git@github.com:evmts/tevm-monorepo.git && cd tevm-monorepo/examples/remix
   ```
2. Install the dependencies (preferably with [pnpm](https://pnpm.io))
   ```bash
   pnpm install
   ```
3. Copy the `.env.local.example` file to `.env.local` and fill in the required environment variables
   ```bash
   cp .env.local.example .env.local
   # Then edit .env.local
   # ALCHEMY_API_KEY
   # ETHERSCAN_API_KEY
   # ARBISCAN_API_KEY
   # BASESCAN_API_KEY
   # OPTIMISTIC_ETHERSCAN_API_KEY
   # POLYGONSCAN_API_KEY
   # ZORA_SUPERSCAN_API_KEY
   ```

We're using Alchemy for better modularity when creating providers and Tevm clients, but you can replace it with any other provider, and update the way urls are created.

4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

For any other considerations, please refer to the respective documentation for each package:

- [Remix](https://remix.run/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tevm](https://tevm.sh/learn/reference)
- [WhatsABI](https://github.com/shazow/whatsabi)

## Acknowledgments

You will find references to any code or ideas that were used in the project directly in the code, but here are some of the main ones:

- [shadcn/ui](https://ui.shadcn.com/): components, design, code/application structure and best practices
- [fiveoutofnine](https://www.fiveoutofnine.com/): inspiration, best practices, organization

## Contributing

See [Contributing](../../README.md#contributing-💻) at the root of the repository.

## License

See [License](../../LICENSE) at the root of the repository.