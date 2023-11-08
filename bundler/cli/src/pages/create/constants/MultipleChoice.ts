export type Choice = {
  value: string, label: number | string | boolean
}
export type MultipleChoice = {
  [choice in string]: Choice
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

