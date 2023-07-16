import { footer } from './footer'
import { nav } from './nav'
import { sidebar } from './sidebar'
import { socialLinks } from './socialLinks'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Evmts alpha docs',
	description: 'Execute solidity scripts in the browser',
	// https://vitepress.dev/reference/default-theme-config
	themeConfig: {
		nav,
		footer,
		sidebar,
		socialLinks,
		editLink: {
			pattern: 'https://github.com/evmts/evmts-monorepo/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},
	},
})
