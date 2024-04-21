import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import { pluginLinkValidator } from './pluginLinkValidator.mjs'
import { pluginTypedoc } from './pluginTypedoc.mjs'
import { sidebar } from './sidebar.mjs'
import { social } from './social.mjs'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/evmts/tevm-monorepo/edit/main/docs',
			},
			lastUpdated: true,
			plugins: [pluginLinkValidator(), pluginTypedoc()],
			social,
			sidebar,
			tableOfContents: true,
			title: 'Tevm Docs',
		}),
	],
})
