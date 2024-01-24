import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			editLink: {
				baseUrl: 'https://github.com/evmts/tevm-monorepo/edit/main/apps/tevm',
			},
			tableOfContents: true,
			plugins: [
				starlightTypeDoc({
					entryPoints: [
						'../packages/actions',
						'../packages/actions-types',
						'../packages/client-types',
						'../packages/contract',
						'../packages/errors',
						'../packages/jsonrpc',
						'../packages/memory-client',
						'../packages/predeploys',
						'../packages/procedures',
						'../packages/procedures-types',
						'../packages/predeploys',
						'../packages/http-client',
						'../packages/server',
						'../extensions/viem',
						'../extensions/ethers',
						'../bundler-packages/bun',
						'../bundler-packages/config',
						'../bundler-packages/esbuild',
						'../bundler-packages/rollup',
						'../bundler-packages/rspack',
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
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Quick start', link: '/getting-started/quick-start/' },
					],
				},
				{
					label: 'Learn',
					items: [
						{ label: 'Clients', link: '/learn/clients/' },
						{ label: 'Actions', link: '/learn/actions/' },
						{ label: 'JSON RPC', link: '/learn/json-rpc/' },
						{ label: 'Contracts', link: '/learn/contracts/' },
						{ label: 'Bundler', link: '/learn/solidity-imports/' },
						{ label: 'Advanced Scripting', link: '/learn/scripting/' },
						{ label: 'CLI', link: '/learn/cli/' },
					],
				},
				typeDocSidebarGroup,
			],
		}),
	],
})
