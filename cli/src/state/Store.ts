import { create} from 'zustand'
import type { State } from './State.js'

export type Store = State & {
  goToPreviousStep: (params: {}) => void
  setInput: (params: { input: 'nameInput' | 'walletConnectIdInput'; value: string }) => void
  selectAndContinue: (params: {
    name: keyof State
    value: string | boolean
    nextPage?: boolean
  }) => void
}

export const useStore = create<Store>((set) => ({
  name: '',
  currentStep: 0,
  path: '.',
  nameInput: '',
  framework: 'hardhat',
  useCase: 'ui',
  packageManager: 'npm',
  noGit: false,
  noInstall: false,
  currentPage: 'interactive',
  walletConnectProjectId: '',

  goToPreviousStep: () =>
    set((state: State) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  setInput: ({ input, value }: { input: 'nameInput' | 'walletConnectIdInput'; value: string }) =>
    set(() => ({
      [input]: value,
    })),

  selectAndContinue: ({ name, value, nextPage }: {
    name: keyof State
    value: string | boolean
    nextPage?: boolean
  }) =>
    set((state: State) => ({
      [name]: value,
      currentStep: state.currentStep + 1,
      currentPage: nextPage ? 'creating' : state.currentPage,
    })),
}))