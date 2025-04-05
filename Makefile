.PHONY: build-go test test-docker setup-ts-go-test build-all

# Build the Go CLI
build-go:
	cd resolutions-go && go build -o bin/cli cmd/cli/main.go

# Run the tests
test: build-go
	cd resolutions-test && npm test

# Build and run tests in Docker
test-docker:
	docker-compose up --build

# Setup the ts-go-test package
setup-ts-go-test:
	cd ts-go-test && npm install && npm run build

# Build all packages
build-all: build-go setup-ts-go-test
	cd resolutions-test && npm install