import { type Step } from './types.js'

export type Choice = {
	label: string
	value: number | string | boolean
}

export type MultipleChoice = {
	[choice in string]: Choice
}

export type MultipleChoiceStep = Step & {
	type: 'multiple-choice'
	choices: MultipleChoice
}

export const useCases = {
	type: 'multiple-choice',
	prompt: 'What do you want to build?',
	stateKey: 'useCase',
	choices: {
		simple: { value: 'simple', label: 'simple' },
		ui: { value: 'ui', label: 'ui' },
		//     game: { value: 'game', label: 'game' },
		//     scripting: { value: 'scripting', label: 'scripting' },
		server: { value: 'server', label: 'server' },
		all: { value: 'all', label: 'all' },
	},
} as const satisfies MultipleChoiceStep
export const packageManagers = {
	type: 'multiple-choice',
	prompt: 'What package manager do you want to use?',
	stateKey: 'packageManager',
	choices: {
		npm: { value: 'npm', label: 'npm' },
		pnpm: { value: 'pnpm', label: 'pnpm(recommended)' },
		bun: { value: 'bun', label: 'bun' },
		yarn: { value: 'yarn', label: 'yarn' },
	},
} as const satisfies MultipleChoiceStep
export const frameworks = {
	type: 'multiple-choice',
	prompt: 'Pick a template',
	stateKey: 'framework',
	choices: {
		simple: { value: 'simple', label: 'simple - Bare bones EVMts project' },
		bun: {
			value: 'bun',
			label: 'bun: Fast-growing Node.js alternative emphasizing peformance',
		},
		cli: {
			value: 'server',
			label: 'cli: Ethereum CLI application using clack',
		},
		mud: {
			value: 'mud',
			label: 'mud(recommended) - Ethereum framework for ambitious applications',
		},
		pwa: { value: 'pwa', label: 'pwa - Simple React+Vite PWA' },
		next: { value: 'next', label: 'next - The most popular react framework' },
		remix: {
			value: 'remix',
			label:
				'remix - React framework emphasizing tighter integration with the web platform',
		},
		//     astro: { value: 'astro', label: 'astro - A popular choice for mostly static content' },
		//     svelte: { value: 'svelte', label: 'svelte - UI framework producing highly efficient JavaScript' },
		//     vue: { value: 'vue', label: 'vue - Approachable and versatile JavaScript framework' },
		server: { value: 'server', label: 'server: A fastify Node.js server' },
		//     elysia: { value: 'elysia', label: 'Elysia: A highly peformant Bun based server' },
	},
} as const satisfies MultipleChoiceStep
// export const solidityFrameworks = {
//   type: 'multiple-choice',
//   prompt: 'Do you want to use a solidity development framework?',
//   stateKey: 'solidityFramework',
//   choices: {
//     none: { value: 'none', label: 'none - Just deploy and test my contracts with EVMts' },
//     foundry: { value: 'foundry', label: 'foundry(recommended) - A popular solidity toolchain that heavily inspires EVMts apis' },
//     hardhat: { value: 'hardhat', label: 'hardhat - A popular JavaScript solidity framework with a mature feature set' },
//   }
// } as const satisfies MultipleChoiceStep
// export const typescriptStrictness = {
//   type: 'multiple-choice',
//   prompt: 'How strict do you want your TypeScript?',
//   stateKey: 'solidityFramework',
//   choices: {
//     strictist: { value: 'strictist', label: 'strictist(recommended) - Safest option' },
//     strict: { value: 'strict', label: 'strict - What most projects tend to use' },
//     loose: { value: 'loose', label: 'loose - Very forgiving TypeScript useful for prototyping' },
//   }
// } as const satisfies MultipleChoiceStep
// export const contractStrategy = {
//   type: 'multiple-choice',
//   prompt: 'What type of contracts are you using?',
//   stateKey: 'contractStrategy',
//   choices: {
//     local: { value: 'local', label: 'local: I\'m writing contracts in this project or monorepo or installing them with npm' },
//     external: { value: 'external', label: 'external: I\'m using verified contracts that are on a blockexplorer' },
//     both: { value: 'both', label: 'both: I\'m using both local and external contracts' },
//   }
// } as const satisfies MultipleChoiceStep
// export const linters = {
//   type: 'multiple-choice',
//   prompt: 'Do you wish to use a linter?',
//   stateKey: 'linter',
//   choices: {
//     'eslint-prettier': { value: 'eslint-prettier', label: 'eslint-prettier - The most popular choice for linting and formatting with robust plugin ecosystem' },
//     biome: { value: 'biome', label: 'biome(recommended) - A blazing fast rust alternative' },
//     none: { value: 'none', label: 'none - No linting or formatting' },
//   }
// } as const satisfies MultipleChoiceStep
// export const testFrameworks = {
//   type: 'multiple-choice',
//   prompt: 'What do you want to build?',
//   stateKey: 'testFramework',
//   choices: {
//     vitest: { value: 'vitest', label: 'vitest(recommended) - A fast and simple test framework' },
//     none: { value: 'none', label: 'none - No test framework' },
//   }
// } as const satisfies MultipleChoiceStep
export const gitChoices = {
	type: 'multiple-choice',
	prompt: 'Do you want to initialize a git repo?',
	stateKey: 'gitChoice',
	choices: {
		git: { value: 'git', label: 'yes - Use git' },
		none: { value: 'none', label: 'no' },
	},
} as const satisfies MultipleChoiceStep
export const installChoices = {
	type: 'multiple-choice',
	prompt: 'Do you want to install dependencies?',
	stateKey: 'installChoice',
	choices: {
		install: { value: 'install', label: 'yes - install dependencies' },
		none: { value: 'none', label: 'no - skip install' },
	},
} as const satisfies MultipleChoiceStep
// export const ciChoices = {
//   type: 'multiple-choice',
//   prompt: 'Do you want to use github actions?',
//   stateKey: 'ciChoice',
//   choices: {
//     githubActions: { value: 'githubActions', label: 'yes - Use github actions' },
//     none: { value: 'none', label: 'no - Do not use github actions' },
//   }
// } as const satisfies MultipleChoiceStep
