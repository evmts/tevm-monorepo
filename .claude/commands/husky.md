Run CI checks and fix issues until repo is in a good state and then add files to staging. All commands are run from repo root.
0. Make sure repo is up to date via running `pnpm i`
1. Check that the linter passes by running `pnpm lint`
2. Check that types and build pass by running `pnpm nx run-many --targets=build:types,build:dist,build:app,generate:docs,dev:run,typecheck`. 
   If one of the specific commands fail, save tokens via only running that command while debugging
3. Check that tests pass via running `pnpm nx run-many --target=test:coverage`
   Source the .env file first before running if it exists
4. Check package.json is sorted via running `pnpm run sort-package-json`
5. Check packages are linted via running `pnpm nx run-many --targets=lint:package,lint:deps`
6. Add files to staging with `git status` and `git add`. Make sure you don't add any git submodules in the `lib/*` folders though

