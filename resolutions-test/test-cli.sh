#!/bin/bash
set -e

echo "Building Go CLI..."
cd ../resolutions-go
go build -o bin/cli cmd/cli/main.go
echo "Go CLI built successfully!"

echo "Testing resolveImports function..."
echo '{"absolutePath":"/test/Contract.sol","code":"// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\nimport \"./Dependency.sol\";\n\ncontract Contract {}","remappings":{},"libs":[],"sync":false,"files":{}}' | ./bin/cli resolveImports

echo "Testing moduleFactory function..."
echo '{"absolutePath":"/test/Contract.sol","rawCode":"// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\nimport \"./Dependency.sol\";\n\ncontract Contract {}","remappings":{},"libs":[],"sync":false,"files":{"/test/Contract.sol":"// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\nimport \"./Dependency.sol\";\n\ncontract Contract {}","/test/Dependency.sol":"// SPDX-License-Identifier: MIT\npragma solidity ^0.7.0;\n\ncontract Dependency {}"}}' | ./bin/cli moduleFactory

echo "All tests completed!"