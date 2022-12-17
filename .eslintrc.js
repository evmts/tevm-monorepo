// TODO move eslint config to a shared package in monorepo https://linear.app/optimism/issue/FE-475/move-eslint-config-to-shared-package-in-monorepo
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: [
    '**/node_modules',
    '**/dist',
    '**/coverage',
    '**/.eslintrc.js',
  ],
  root: true,
  // the built in import sort rule doesn't autofix which is annoying
  // so we use a third party library that does work
  plugins: [
    'simple-import-sort',
    'eslint-plugin-jsdoc',
    'eslint-plugin-import',
  ],
  rules: {
    // to help build tools we want to force a consistent import style for types
    '@typescript-eslint/consistent-type-imports': 'error',
    // autofix 'let' to 'const' when possible
    'prefer-const': 'error',
    // always include a new line at end of file
    // START TYPESCRIPT RULES
    // turn on to enforce a specific member ordering in classes e.g. static first
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    // Don't do any ts-anything
    // allow ts-expect-error as long as it's formatted with a comment
    // e.g. ts-expect-error:
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
      },
    ],
    // TODO https://linear.app/optimism/issue/FE-501/turn-on-no-floating-promises
    // This is a useful rule but requires a ts parser
    // A ts parser massively slows down our linting process
    '@typescript-eslint/no-floating-promises': 'off',
    // We expect to have to use any but anywhere we use any
    // we want to add a eslint-ignore.  This increased friction
    // will encourage us to think twice about using any.
    // TODO fix current instances and switch this to 'error' https://linear.app/optimism/issue/FE-476/switch-no-explicit-any-to-error
    '@typescript-eslint/no-explicit-any': 'warn',
    // This autofixes consistent use of array types.  If the array type
    // is simple e.g. number[] it will use Foo[].  If complicated like
    // (number | string)[] it will use more readable Array<number | string>
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    // END TYPESCRIPT RULES

    // Enforcing a consistent style for imports helps prevent merge conflicts
    // START IMPORT LINT RULES
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    // END IMPORT LINT RULES

    // START JSDOC LINT RULES
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/newline-after-description': 'error',
    // END JSDOC LINT RULES
  },
}
