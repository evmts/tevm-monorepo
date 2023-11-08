import { type Step } from './types.js'

export type Choice = {
  label: string, value: number | string | boolean
}

export type MultipleChoice = {
  [choice in string]: Choice
}

export type MultipleChoiceStep = Step & {
  type: 'multiple-choice',
  choices: MultipleChoice,
}

export const useCases = {
  type: 'multiple-choice',
  prompt: 'What do you want to build?',
  stateKey: 'useCase',
  choices: {
    simple: { value: 'simple', label: 'simple - Just give me a bare bones project' },
    ui: { value: 'ui', label: 'ui - I want to build a simple UI' },
    scripting: { value: 'scripting', label: 'scripting - I want to build a script or CLI' },
    server: { value: 'server', label: 'server - I want to build a server' },
    all: { value: 'all', label: 'all - Just show me all the choices' },
  }
} as const satisfies MultipleChoiceStep
export const packageManagers = {
  type: 'multiple-choice',
  prompt: 'What package manager do you want to use?',
  stateKey: 'packageManager',
  choices: {
    npm: { value: 'npm', label: 'npm: The official package manager for node.js' },
    pnpm: { value: 'pnpm', label: 'pnpm(recomended): An extremely popular npm alternative known for it\'s speed' },
    bun: { value: 'bun', label: 'bun: A bleeding edge package manager known for it\'s speed' },
    yarn: { value: 'yarn', label: 'yarn: A popular npm alternative with a unique feature set' },
  }
} as const satisfies MultipleChoiceStep
export const frameworks = {
  type: 'multiple-choice',
  prompt: 'Pick a template',
  stateKey: 'framework',
  choices: {
    simple: { value: 'simple', label: 'simple - Bare bones EVMts project' },
    mud: { value: 'mud', label: 'mud(recomended) - Framework for ambitious Ethereum applications' },
    server: { value: 'server', label: 'server: A fastify server app. Fastify is the spirutual successor to express and supports express middleware' },
    pwa: { value: 'pwa', label: 'pwa - Simple React+Vite PWA app' },
    next: { value: 'next', label: 'next - The most popular SSR react framework' },
    remix: { value: 'remix', label: 'remix - React framework emphasizing tighter integration with the web platform, offering enhanced data handling' },
    astro: { value: 'astro', label: 'astro - A popular choice for mostly static content' },
    svelte: { value: 'svelte', label: 'svelte - UI framework that shifts much of the work to compile time, producing highly efficient JavaScript' },
    vue: { value: 'vue', label: 'vue - Approachable and versatile JavaScript framework that facilitates building interactive user interfaces' },
    bun: { value: 'bun', label: 'bun: The bleeding edge bun runtime and test framework' },
    cli: { value: 'server', label: 'cli: A scaffold for a ethereum CLI application using clack' },
    elysia: { value: 'elysia', label: 'Elysia: A Bun based framework for building very peformant APIs' },
    htmx: { value: 'htmx', label: 'htmx: A server' },
  }
} as const satisfies MultipleChoiceStep
export const solidityFrameworks = {
  type: 'multiple-choice',
  prompt: 'Do you want to use a solidity development framework?',
  stateKey: 'solidityFramework',
  choices: {
    foundry: { value: 'foundry', label: 'foundry - A popular solidity toolchain that heavily inspires EVMts apis' },
    hardhat: { value: 'hardhat', label: 'hardhat - A popular JavaScript solidity framework with a mature feature set' },
    none: { value: 'none', label: 'none - Just deploy and test my contracts with EVMts' },
  }
} as const satisfies MultipleChoiceStep
export const typescriptStrictness = {
  type: 'multiple-choice',
  prompt: 'How strict do you want your TypeScript?',
  stateKey: 'solidityFramework',
  choices: {
    strictist: { value: 'strictist', label: 'strictist(recomended) - Safest option' },
    strict: { value: 'strict', label: 'strict - Moderately strict TypeScript' },
    loose: { value: 'loose', label: 'loose - Very forgiving TypeScript useful for prototyping' },
  }
} as const satisfies MultipleChoiceStep
export const contractStrategy = {
  type: 'multiple-choice',
  prompt: 'What type of contracts are you using?',
  stateKey: 'contractStrategy',
  choices: {
    local: { value: 'local', label: 'local: I\'m writing contracts in this project or monorepo or installing them with npm' },
    external: { value: 'external', label: 'external: I\'m using verified contracts that are on a blockexplorer' },
    both: { value: 'both', label: 'both: I\'m using both local and external contracts' },
  }
} as const satisfies MultipleChoiceStep
export const linters = {
  type: 'multiple-choice',
  prompt: 'Do you wish to use a linter?',
  stateKey: 'linter',
  choices: {
    biome: { value: 'biome', label: 'biome(recomended) - A blazing fast rust alternative' },
    'eslint-prettier': { value: 'eslint-prettier', label: 'eslint-prettier - The most popular choice for linting and formatting with robust plugin ecosystem' },
    none: { value: 'none', label: 'none - No linting or formatting' },
  }
} as const satisfies MultipleChoiceStep
export const testFrameworks = {
  type: 'multiple-choice',
  prompt: 'What do you want to build?',
  stateKey: 'testFramework',
  choices: {
    vitest: { value: 'vitest', label: 'vitest(recomended) - A fast and simple test framework' },
    none: { value: 'none', label: 'vitest(recomended) - A fast and simple test framework' },
  }
} as const satisfies MultipleChoiceStep
export const gitChoices = {
  type: 'multiple-choice',
  prompt: 'Do you want to initialize a git repo?',
  stateKey: 'gitChoice',
  choices: {
    git: { value: 'git', label: 'yes - use git' },
    none: { value: 'none', label: 'no - skip git init' },
  }
} as const satisfies MultipleChoiceStep
export const installChoices = {
  type: 'multiple-choice',
  prompt: 'Do you want to install dependencies?',
  stateKey: 'installChoice',
  choices: {
    install: { value: 'install', label: 'yes - install dependencies' },
    none: { value: 'none', label: 'no - skip install' },
  }
} as const satisfies MultipleChoiceStep
export const ciChoices = {
  type: 'multiple-choice',
  prompt: 'Do you want to use github actions?',
  stateKey: 'ciChoice',
  choices: {
    githubActions: { value: 'install', label: 'yes - Use github actions' },
    none: { value: 'none', label: 'no - Do not use github actions' },
  }
} as const satisfies MultipleChoiceStep

