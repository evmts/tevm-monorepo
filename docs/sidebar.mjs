import { typeDocSidebarGroup } from 'starlight-typedoc'

export const typedocSidebar = {
	label: 'Reference (auto-generated)',
	collapsed: true,
}

export const sidebar = [
	{
		label: 'Getting Started',
		items: [{ label: 'Quick start', link: '/getting-started/quick-start/' }],
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
			{ label: 'Ethers extension', link: '/learn/ethers/' },
			{ label: 'Reference', link: '/learn/reference/' },
		],
	},
	typeDocSidebarGroup,
]
