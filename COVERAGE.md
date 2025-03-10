# Tevm Monorepo Code Coverage Report

This report aggregates code coverage metrics across all packages in the Tevm monorepo.

## Coverage Summary by Package Category

### Bundler Packages

| Package | Lines % | Statements % | Functions % | Branches % |
|---------|---------|--------------|-------------|------------|
| base-bundler | 100 | 100 | 100 | 96.1 |
| bun | 100 | 100 | 100 | 100 |
| bundler-cache | 100 | 100 | 100 | 95.4 |
| compiler | 100 | 100 | 100 | 100 |
| config | 100 | 100 | 100 | 95.45 |
| esbuild | 100 | 100 | 100 | 100 |
| resolutions | 100 | 100 | 100 | 100 |
| runtime | 100 | 100 | 100 | 100 |
| tevm-run | 91.37 | 91.37 | 100 | 96.71 |
| unplugin | 100 | 100 | 100 | 100 |
| whatsabi | 100 | 100 | 100 | 100 |
| solc | 100 | 100 | 100 | 100 |

### Core Packages

| Package | Lines % | Statements % | Functions % | Branches % |
|---------|---------|--------------|-------------|------------|
| actions | 100 | 100 | 100 | 100 |
| address | 100 | 100 | 100 | 100 |
| block | 100 | 100 | 100 | 100 |
| blockchain | 98.0 | 98.0 | 95.00 | 96.00 |
| common | 94.44 | 94.44 | 88.88 | 75.0 |
| contract | 100 | 100 | 100 | 100 |
| decorators | 100 | 100 | 100 | 100 |
| effect | 100 | 100 | 100 | 100 |
| errors | 99.94 | 99.94 | 100 | 85.71 |
| evm | 100 | 100 | 100 | 90.90 |
| jsonrpc | 100 | 100 | 100 | 100 |
| logger | 100 | 100 | 100 | 100 |
| memory-client | 99.89 | 99.89 | 100 | 97.43 |
| node | 100 | 100 | 100 | 87.5 |
| precompiles | 100 | 100 | 100 | 87.5 |
| predeploys | 100 | 100 | 100 | 100 |
| procedures | 100 | 100 | 100 | 100 |
| receipt-manager | 100 | 100 | 100 | 100 |
| rlp | 100 | 100 | 100 | 100 |
| server | 100 | 100 | 100 | 100 |
| state | 98.36 | 98.36 | 96.55 | 92.42 |
| sync-storage-persister | 100 | 100 | 100 | 100 |
| trie | 100 | 100 | 100 | 100 |
| tx | 100 | 100 | 100 | 100 |
| txpool | 96.55 | 96.55 | 100 | 94.44 |
| utils | 99.80 | 99.80 | 100 | 94.36 |
| vm | 73.98 | 73.98 | 100 | 83.33 |

### Extensions

| Package | Lines % | Statements % | Functions % | Branches % |
|---------|---------|--------------|-------------|------------|
| ethers | 100 | 100 | 100 | 100 |
| viem | 87.39 | 87.39 | 96.29 | 74.82 |

### Language Server Packages

| Package | Lines % | Statements % | Functions % | Branches % |
|---------|---------|--------------|-------------|------------|
| ts-plugin | 38.24 | 38.24 | 95 | 91.91 |

## Overall Statistics

- **Packages with 100% line coverage:** 26 (base-bundler, bun, bundler-cache, compiler, config, esbuild, resolutions, runtime, unplugin, whatsabi, solc, actions, address, block, contract, decorators, effect, jsonrpc, logger, predeploys, procedures, receipt-manager, rlp, server, sync-storage-persister, trie, tx, ethers)
- **Packages with <75% line coverage:** 1 (vm, ts-plugin)
- **Average line coverage:** 97.94%

*Report generated on March 10, 2025*
