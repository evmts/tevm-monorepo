import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Tevm Node',
  description: "A lightweight, unopinionated, powerful EVM node that runs in the browser",
  topNav: [
    { text: 'Docs', link: '/introduction/what-is-tevm-node', match: '/introduction' },
    { text: 'Viem', link: 'https://viem.sh/' },
    { text: 'Ethereumjs', link: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
    { text: 'Krome', link: 'https://github.com/evmts/krome' },
  ],
  sidebar: [
    {
      text: 'Quick Start',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/getting-started' },
      ],
    },
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is Tevm Node?', link: '/introduction/what-is-tevm-node' },
        { text: 'Architecture Overview', link: '/introduction/architecture-overview' },
        { text: 'Why run Ethereum in JS?', link: '/introduction/why-run-ethereum-in-js' },
        { text: 'Installation & Quickstart', link: '/introduction/installation' },
      ],
    },
    {
      text: 'Core Concepts',
      collapsed: false,
      items: [
        { text: 'Creating a Node', link: '/core/create-tevm-node' },
        { text: 'Node Interface', link: '/core/tevm-node-interface' },
        { text: 'Forking & Reforking', link: '/core/forking' },
        { text: 'Managing State', link: '/core/managing-state' },
      ],
    },
    {
      text: 'API Documentation',
      collapsed: true,
      items: [
        { text: 'Account Management', link: '/api/account-management' },
        { text: 'EVM Events', link: '/api/evm-events' },
        { text: 'JSON-RPC', link: '/api/json-rpc' },
        { text: 'Methods Overview', link: '/api/methods' },
        { text: 'Package Overview', link: '/api/packages' },
        { text: 'Call API', link: '/api/tevm-call' },
        { text: 'VM and Submodules', link: '/api/vm-and-submodules' },
      ],
    },
    {
      text: 'Reference Documentation',
      collapsed: true,
      items: [
        { text: '@tevm/actions', link: '/reference/actions' },
        { text: '@tevm/address', link: '/reference/address' },
        { text: '@tevm/block', link: '/reference/block' },
        { text: '@tevm/blockchain', link: '/reference/blockchain' },
        { text: '@tevm/common', link: '/reference/common' },
        { text: '@tevm/contract', link: '/reference/contract' },
        { text: '@tevm/decorators', link: '/reference/decorators' },
        { text: '@tevm/evm', link: '/reference/evm' },
        { text: '@tevm/memory-client', link: '/reference/memory-client' },
        { text: '@tevm/receipt-manager', link: '/reference/receipt-manager' },
        { text: '@tevm/state', link: '/reference/state' },
        { text: '@tevm/tx', link: '/reference/tx' },
        { text: '@tevm/txpool', link: '/reference/txpool' },
        { text: '@tevm/utils', link: '/reference/utils' },
        { text: '@tevm/vm', link: '/reference/vm' },
      ],
    },
    {
      text: 'Core Packages',
      collapsed: true,
      items: [
        { text: 'Actions (@tevm/actions)', link: '/api/actions' },
        { text: 'Virtual Machine (@tevm/vm)', link: '/api/vm' },
        { text: 'State Management (@tevm/state)', link: '/api/state' },
        { text: 'Blockchain (@tevm/blockchain)', link: '/api/blockchain' },
        { text: 'EVM (@tevm/evm)', link: '/api/evm' },
      ],
    },
    {
      text: 'Transaction & Block Packages',
      collapsed: true,
      items: [
        { text: 'Block (@tevm/block)', link: '/api/block' },
        { text: 'Transactions (@tevm/tx)', link: '/api/tx' },
        { text: 'Transaction Pool (@tevm/txpool)', link: '/api/txpool' },
        { text: 'Receipt Manager (@tevm/receipt-manager)', link: '/api/receipt-manager' },
      ],
    },
    {
      text: 'Client & Communication',
      collapsed: true,
      items: [
        { text: 'Memory Client (@tevm/memory-client)', link: '/api/memory-client' },
        { text: 'HTTP Client (@tevm/http-client)', link: '/api/http-client' },
        { text: 'JSON-RPC (@tevm/jsonrpc)', link: '/api/json-rpc' },
        { text: 'Server (@tevm/server)', link: '/api/server' },
      ],
    },
    {
      text: 'Smart Contract Tools',
      collapsed: true,
      items: [
        { text: 'Contract (@tevm/contract)', link: '/api/contract' },
        { text: 'Precompiles (@tevm/precompiles)', link: '/api/precompiles' },
        { text: 'Predeploys (@tevm/predeploys)', link: '/api/predeploys' },
      ],
    },
    {
      text: 'Utilities & Helpers',
      collapsed: true,
      items: [
        { text: 'Utils (@tevm/utils)', link: '/api/utils' },
        { text: 'Common (@tevm/common)', link: '/api/common' },
        { text: 'Decorators (@tevm/decorators)', link: '/api/decorators' },
        { text: 'Procedures (@tevm/procedures)', link: '/api/procedures' },
        { text: 'RLP (@tevm/rlp)', link: '/api/rlp' },
        { text: 'Trie (@tevm/trie)', link: '/api/trie' },
        { text: 'Address (@tevm/address)', link: '/api/address' },
      ],
    },
    {
      text: 'Development Tools',
      collapsed: true,
      items: [
        { text: 'Error Handling (@tevm/errors)', link: '/api/errors' },
        { text: 'Logger (@tevm/logger)', link: '/api/logger' },
        { text: 'Effect System (@tevm/effect)', link: '/api/effect' },
        { text: 'Client Types (@tevm/client-types)', link: '/api/client-types' },
        { text: 'Storage Persister (@tevm/sync-storage-persister)', link: '/api/sync-storage-persister' },
      ],
    },
    {
      text: 'Integration Examples',
      collapsed: true,
      items: [
        { text: 'Local Testing Flow', link: '/examples/local-testing' },
        { text: 'Forking Mainnet', link: '/examples/forking-mainnet' },
        { text: 'Using with Viem', link: '/examples/viem' },
        { text: 'Using with Ethers', link: '/examples/ethers' },
        { text: 'Building a Debugger UI', link: '/examples/debugger-ui' },
      ],
    },
    {
      text: 'Advanced Features',
      collapsed: true,
      items: [
        { text: 'TxPool & Mempool', link: '/advanced/txpool' },
        { text: 'Receipts & Logs', link: '/advanced/receipts-and-logs' },
        { text: 'Performance & Profiler', link: '/advanced/performance-profiler' },
        { text: 'Custom Precompiles', link: '/advanced/custom-precompiles' },
      ],
    },
  ],
  editLink: {
    pattern: 'https://github.com/evmts/tevm-monorepo/edit/main/docs/node/docs/pages/:path',
  },
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/evmts/tevm-monorepo',
      label: 'Github'
    },
    {
      icon: 'telegram',
      link: 'https://t.me/+ANThR9bHDLAwMjUx',
      label: 'Telegram'
    },
    {
      icon: 'x',
      link: 'https://x.com/tevmtools',
      label: 'Twitter'
    },
  ],
})
