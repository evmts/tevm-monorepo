import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Tevm Node',
  topNav: [
    { text: 'Docs', link: '/introduction/what-is-tevm-node', match: '/introduction' },
    { text: 'Viem', link: 'https://viem.sh/' },
    { text: 'Ethereumjs', link: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
    { text: 'Helios', link: 'https://github.com/a16z/helios' },
    { text: 'Krome', link: 'https://github.com/evmts/krome' },
  ],
  sidebar: [
    {
      text: 'Getting Started',
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
        { text: 'createTevmNode', link: '/core/create-tevm-node' },
        { text: 'TevmNode Interface', link: '/core/tevm-node-interface' },
        { text: 'Forking & Reforking', link: '/core/forking' },
        { text: 'Managing State', link: '/core/managing-state' },
        { text: 'Mining Config', link: '/core/mining-config' },
      ],
    },
    {
      text: 'API Reference',
      collapsed: true,
      items: [
        { text: 'Methods & Properties', link: '/api/methods' },
        { text: 'VM & Submodules', link: '/api/vm-and-submodules' },
        { text: 'JSON-RPC Guide', link: '/api/json-rpc' },
        { text: 'tevmCall API', link: '/api/tevm-call' },
        { text: 'Account Management', link: '/api/account-management' },
        { text: 'Contract Utilities', link: '/api/contracts' },
        { text: 'Utilities & Addresses', link: '/api/utils' },
      ],
    },
    {
      text: 'Advanced',
      collapsed: true,
      items: [
        { text: 'TxPool & Mempool', link: '/advanced/txpool' },
        { text: 'Receipts & Logs', link: '/advanced/receipts-and-logs' },
        { text: 'Performance & Profiler', link: '/advanced/performance-profiler' },
        { text: 'Custom Precompiles', link: '/advanced/custom-precompiles' },
      ],
    },
    {
      text: 'Examples',
      collapsed: true,
      items: [
        { text: 'Local Testing Flow', link: '/examples/local-testing' },
        { text: 'Forking Mainnet', link: '/examples/forking-mainnet' },
        { text: 'Using with Viem', link: '/examples/viem' },
        { text: 'Using with Ethers', link: '/examples/ethers' },
      ],
    },
  ],
  editLink: {
    pattern: 'https://github.com/evmts/tevm-monorepo/edit/main/docs/:path',
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
