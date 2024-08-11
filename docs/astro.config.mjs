import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightLinksValidatorPlugin from 'starlight-links-validator'
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

// TODO fix this
const ENABLE_LINK_CHECKER = false

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            logo: {
                light: './src/assets/tevm-logo-light.png',
                dark: './src/assets/tevm-logo-dark.png',
            },
            lastUpdated: true,
            customCss: ['./src/styles/custom.css'],
            editLink: {
                baseUrl: 'https://github.com/evmts/tevm-monorepo/edit/main/docs',
            },
            tableOfContents: true,
            favicon: './src/assets/tevm-logo-dark.png',
            plugins: [
                ...(ENABLE_LINK_CHECKER
                    ? [
                        starlightLinksValidatorPlugin({
                            errorOnRelativeLinks: true,
                        }),
                    ]
                    : []),
                starlightTypeDoc({
                    entryPoints: [
                        '../packages/actions',
                        '../packages/node',
                        '../packages/block',
                        '../packages/blockchain',
                        '../packages/client-types',
                        '../packages/common',
                        '../packages/contract',
                        '../packages/decorators',
                        '../packages/evm',
                        '../packages/errors',
                        '../extensions/ethers',
                        '../packages/evm',
                        '../packages/http-client',
                        '../packages/jsonrpc',
                        '../packages/logger',
                        '../packages/memory-client',
                        '../packages/precompiles/',
                        '../packages/predeploys',
                        '../packages/procedures',
                        '../packages/receipt-manager',
                        '../packages/rlp',
                        '../packages/server',
                        '../packages/state',
                        '../packages/sync-storage-persister',
                        '../test/test-utils',
                        '../packages/trie',
                        '../packages/tx',
                        '../packages/txpool',
                        '../packages/utils',
                        '../extensions/viem',
                        '../packages/vm',
                        '../bundler-packages/base-bundler',
                        '../bundler-packages/bun',
                        '../bundler-packages/bundler-cache',
                        '../bundler-packages/compiler',
                        '../bundler-packages/config',
                        '../bundler-packages/esbuild',
                        '../packages/address',
                        '../packages/effect',
                        '../bundler-packages/resolutions',
                        '../bundler-packages/rollup',
                        '../bundler-packages/rspack',
                        '../bundler-packages/runtime',
                        '../bundler-packages/solc',
                        '../bundler-packages/unplugin',
                        '../bundler-packages/ts-plugin',
                        '../bundler-packages/vite',
                        '../bundler-packages/webpack',
                    ],
                    tsconfig: '../tevm/tsconfig.json',
                    output: 'reference',
                    sidebar: {
                        label: 'Reference (auto-generated)',
                        collapsed: true,
                    },
                    typeDoc: {
                        gitRevision: 'main',
                        entryPointStrategy: 'packages',
                    },
                }),
            ],
            title: 'Tevm Docs',
            social: {
                github: 'https://github.com/evmts/tevm-monorepo',
                twitter: 'https://twitter.com/FUCORY',
                telegram: 'https://t.me/+ANThR9bHDLAwMjUx',
            },
            sidebar: [
                {
                    label: 'Getting Started',
                    items: [{ label: 'Getting Started Guide', link: '/getting-started/getting-started/' }],
                },
                {
                    label: 'Learn',
                    items: [
                        { label: 'Clients', link: '/learn/clients/' },
                        { label: 'Actions', link: '/learn/actions/' },
                        { label: 'Low-level API', link: '/learn/low-level-api/' },
                        { label: 'JSON RPC', link: '/learn/json-rpc/' },
                        { label: 'Contracts', link: '/learn/contracts/' },
                        { label: 'Bundler', link: '/learn/solidity-imports/' },
                        { label: 'Advanced Scripting', link: '/learn/scripting/' },
                        { label: 'Reference', link: '/learn/reference/' },
                    ],
                },
                typeDocSidebarGroup,
            ],
        }),
    ],
})
