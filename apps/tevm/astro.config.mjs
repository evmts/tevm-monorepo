import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
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
			],
		}),
	],
})
