export type Choice = {
  value: string | boolean | number
  label: string
}
export type MultipleChoice = Record<string, Choice>
export type Step = {
  type: string
  prompt: string,
  stateKey: string,
}
export type InputStep = Step & {
  type: 'input'
}
export type MultipleChoiceStep = Step & {
  type: 'multiple-choice',
  choices: MultipleChoice,
}
export type AutomatedStep = Step & {
  type: 'automated',
  loadingMessage: string,
  successMessage: string,
}

export const packageManagers = {
  npm: { value: 'npm', label: 'npm: The official package manager for node.js' },
  pnpm: { value: 'pnpm', label: 'pnpm(recomended): An extremely popular npm alternative known for it\'s speed' },
  bun: { value: 'bun', label: 'bun: A bleeding edge package manager known for it\'s speed' },
  yarn: { value: 'yarn', label: 'yarn: A popular npm alternative with a unique feature set' },
} as const satisfies MultipleChoice
export const useCases = {
  simple: { value: 'simple', label: 'simple - Just give me a bare bones project' },
  ui: { value: 'ui', label: 'ui - I want to build a simple UI' },
  scripting: { value: 'scripting', label: 'scripting - I want to build a script or CLI' },
  server: { value: 'server', label: 'server - I want to build a server' },
  all: { value: 'all', label: 'all - Just show me all the choices' },
} as const satisfies MultipleChoice
export const frameworks = {
  simple: { value: 'simple', label: 'simple - Bare bones EVMts project' },
  mud: { value: 'mud', label: 'mud(recomended) - Framework for ambitious Ethereum applications' },
  server: { value: 'server', label: 'server: A fastify server app. Fastify is the spirutual successor to express and supports express middleware' },
  pwa: { value: 'pwa', label: 'pwa - Simple React+Vite PWA app' },
  next: { value: 'next', label: 'next - The most popular SSR react framework' },
  remix: { value: 'remix', label: 'remix - React framework emphasizing tighter integration with the web platform, offering enhanced data handling' },
  astro: { value: 'astro', label: 'astro - A popular choice for mostly static content' },
  svelte: { value: 'svelte', label: 'svelte - UI framework that shifts much of the work to compile time, producing highly efficient JavaScript' },
  vue: { value: 'vue', label: 'vue - Approachable and versatile JavaScript framework that facilitates building interactive user interfaces' },
  bun: { value: 'simple-bun', label: 'bun: The bleeding edge bun runtime and test framework' },
  cli: { value: 'server', label: 'cli: A scaffold for a ethereum CLI application using clack' },
  elysia: { value: 'elysia', label: 'Elysia: A Bun based framework for building very peformant APIs' },
  htmx: { value: 'htmx', label: 'htmx: A server' },
} as const satisfies MultipleChoice
export const frameworksByUseCase = {
  all: frameworks,
  simple: {
    simple: frameworks.simple,
    bun: frameworks.bun,
  },
  ui: {
    mud: frameworks.mud,
    pwa: frameworks.pwa,
    next: frameworks.next,
    remix: frameworks.remix,
    astro: frameworks.astro,
    svelte: frameworks.svelte,
    vue: frameworks.vue,
    htmx: frameworks.htmx,
  },
  scripting: {
    cli: frameworks.cli,
    simple: frameworks.simple,
    bun: frameworks.bun,
  },
  server: {
    server: frameworks.server,
    elysia: frameworks.elysia,
    htmx: frameworks.htmx,
  }
} as const satisfies Record<keyof typeof useCases, MultipleChoice>
export const solidityFrameworks = {
  foundry: { value: 'foundry', label: 'foundry - A popular solidity toolchain that heavily inspires EVMts apis' },
  hardhat: { value: 'hardhat', label: 'hardhat - A popular JavaScript solidity framework with a mature feature set' },
  evmts: { value: 'none', label: 'evmts - Just deploy and test my contracts with EVMts' },
} as const satisfies MultipleChoice
export const linters = {
  biome: { value: 'biome', label: 'biome(recomended) - A blazing fast rust alternative' },
  eslintPrettier: { value: 'eslint-prettier', label: 'eslint-prettier - The most popular choice for linting and formatting with robust plugin ecosystem' },
  none: { value: 'none', label: 'none - No linting or formatting' },
} as const satisfies MultipleChoice
export const testFrameworks = {
  vitest: { value: 'vitest', label: 'vitest(recomended) - A fast and simple test framework' },
  none: { value: 'none', label: 'vitest(recomended) - A fast and simple test framework' },
} as const satisfies MultipleChoice
export const gitChoices = {
  git: { value: 'git', label: 'yes - use git' },
  none: { value: 'none', label: 'no - skip git init' },
} as const satisfies MultipleChoice
export const installChoices = {
  install: { value: 'install', label: 'yes - install dependencies' },
  none: { value: 'none', label: 'no - skip install' },
} as const satisfies MultipleChoice

export const nameStep = {
  type: 'input',
  prompt: 'What is the name of your project?',
  stateKey: 'name' as const,
} as const satisfies InputStep
export const packageManagerStep = {
  type: 'multiple-choice',
  prompt: 'Which package manager would you like to use?',
  stateKey: 'packageManager' as const,
  choices: packageManagers,
} as const satisfies MultipleChoiceStep
export const useCaseStep = {
  type: 'multiple-choice',
  prompt: 'What type of project would you like to create?',
  stateKey: 'useCase' as const,
  choices: useCases,
} as const satisfies MultipleChoiceStep
export const frameworkStep = {
  all: {
    type: 'multiple-choice',
    prompt: 'Which framework would you like to use?',
    stateKey: 'framework' as const,
    choices: frameworks,
  } as const satisfies MultipleChoiceStep,
  simple: {
    type: 'multiple-choice',
    prompt: 'Which scaffold would you like to use?',
    stateKey: 'framework' as const,
    choices: frameworksByUseCase.simple,
  } as const satisfies MultipleChoiceStep,
  ui: {
    type: 'multiple-choice',
    prompt: 'Which ui framework would you like to use?',
    stateKey: 'framework' as const,
    choices: frameworksByUseCase.ui,
  } as const satisfies MultipleChoiceStep,
  scripting: {
    type: 'multiple-choice',
    prompt: 'Which scripting framework would you like to use?',
    stateKey: 'framework' as const,
    choices: frameworksByUseCase.scripting,
  } as const satisfies MultipleChoiceStep,
  server: {
    type: 'multiple-choice',
    prompt: 'Which server framework would you like to use?',
    stateKey: 'framework' as const,
    choices: frameworksByUseCase.server,
  } as const satisfies MultipleChoiceStep,
} as const satisfies Record<keyof typeof useCases, MultipleChoiceStep>
export const solidityFrameworkStep = {
  type: 'multiple-choice',
  prompt: 'Which solidity framework would you like to use?',
  stateKey: 'solidityFramework' as const,
  choices: solidityFrameworks,
} as const satisfies MultipleChoiceStep
export const gitStep = {
  type: 'multiple-choice',
  prompt: 'Do you want to initialize a git repo?',
  stateKey: 'noGit' as const,
  choices: {
    yes: { label: 'yes', value: true },
    no: { label: 'no', value: false },
  },
} as const satisfies MultipleChoiceStep
export const installStep = {
  type: 'multiple-choice',
  prompt: 'Do you want to install dependencies?',
  stateKey: 'noInstall' as const,
  choices: {
    yes: { label: 'yes', value: true },
    no: { label: 'no', value: false },
  },
} as const satisfies MultipleChoiceStep

export const creatingProject = {
  type: 'automated',
  prompt: 'Creating project',
  stateKey: 'creatingProject' as const,
  loadingMessage: 'Creating project',
  successMessage: 'Project created',
} as const satisfies AutomatedStep
export const initializingGit = {
  type: 'automated',
  prompt: 'Initializing git',
  stateKey: 'initializingGit' as const,
  loadingMessage: 'Initializing git',
  successMessage: 'Git initialized',
} as const satisfies AutomatedStep
export const installingDependencies = {
  type: 'automated',
  prompt: 'Installing dependencies',
  stateKey: 'installingDependencies' as const,
  loadingMessage: 'Installing dependencies',
  successMessage: 'Dependencies installed',
} as const satisfies AutomatedStep

export const steps = [
  nameStep,
  packageManagerStep,
  useCaseStep,
  frameworkStep,
  gitStep,
  installStep,
] as const 
