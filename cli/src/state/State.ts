export type Page = 'interactive' | 'creating' | 'complete'

export type State = {
	name: string
	currentStep: number
	path: string
	nameInput: string
	framework: 'hardhat' | 'foundry'
	useCase: 'ui'
	packageManager: 'npm' | 'pnpm' | 'yarn'
	noGit: boolean
	noInstall: boolean
	currentPage: Page
	walletConnectProjectId: string
}
