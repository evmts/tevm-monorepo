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
			plugins: [
				starlightTypeDoc({
					entryPoints: [
						'../../vm/api',
						'../../vm/client',
						'../../vm/procedures',
						'../../vm/server',
						'../../vm/predeploys',
						'../../vm/state',
						'../../extensions/viem',
						'../../vm/vm',
						'../../bundler/base-bundler',
						'../../bundler/bun',
						'../../bundler/compiler',
						'../../bundler/config',
						'../../bundler/esbuild',
						'../../bundler/rollup',
						'../../bundler/rspack',
						'../../bundler/ts-plugin',
						'../../bundler/solc',
						'../../bundler/vite',
						'../../bundler/webpack',
						'../../packages/contract',
						'../../packages/jsonrpc',
					],
					tsconfig: '../../tevm/tsconfig.json',
					output: 'generated',
					sidebar: {
						label: 'API (auto-generated)',
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
						{ label: 'Quick start (5m)', link: '/guides/quick-start/' },
						{ label: 'Tutorial (5m)', link: '/guides/tutorial/' },
						{ label: 'Solidity imports', link: '/guides/solidity-imports/' },
						{ label: 'Community', link: '/guides/community/' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				typeDocSidebarGroup,
			],
		}),
	],
})
