# .github/workflows

Workflows that are run in CI

### lint.yml

Runs prettier and eslint

### publish-dry.yml

Runs npm publish without actually publishing to check that publishing will still work

### tests.yml

Runs test script

### typecheck.yml

Runs the typechecker. Since build is done (faster) with babel typechecker must be run as a seperate lint step.

## CD

### docker.yml

Builds docker container and deploys to dockerhub on release

### publish.yml

Publishes package to npm on release
