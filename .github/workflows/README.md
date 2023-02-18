# .github/workflows

Workflows that are run in CI

### docker.yml

Builds all docker containers and deploys to dockerhub on release

## e2e.yml

Runs playwright tests vs the example apps

### lint.yml

Runs prettier and eslint

### npm.yml

Runs npm publish in dry mode. On workflow releases it will actually publish

### typecheck.yml

Runs the typechecker. Since build is done (faster) with babel typechecker must be run as a seperate lint step.

### unit.yml

Runs run unit tests for all packages
