export type Page = 'interactive' | 'creating' | 'complete'

export type State = {
  name: string
  currentStep: number
  path: string
  nameInput: string
  framework: string
  useCase: string
  packageManager: string
  noGit: boolean
  noInstall: boolean
  currentPage: Page
  walletConnectProjectId: string
} 