#\!/bin/bash

# Array of package.json files with viem in peerDependencies
declare -a files=(
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/actions/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/vm/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/node/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/tevm/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/memory-client/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/test/test-utils/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/test/bench/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/utils/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/state/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/jsonrpc/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/http-client/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/errors/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/decorators/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/common/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/blockchain/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/packages/address/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/extensions/viem/package.json"
  "/Users/williamcory/tevm-monorepo/tree/implement_interval_and_gas_mining/bundler-packages/whatsabi/package.json"
)

# The new version to set
NEW_VERSION="^2.23.11"

# Loop through each file and update the viem version
for file in "${files[@]}"; do
  echo "Updating viem version in $file"
  
  # Use perl for the replacement to handle the JSON format reliably
  perl -i -pe 's/("viem"\s*:\s*)"(\^[0-9]+\.[0-9]+\.[0-9]+)"/$1"'"$NEW_VERSION"'"/g' "$file"
  
  # Check if the replacement was successful
  if grep -q "\"viem\": \"$NEW_VERSION\"" "$file"; then
    echo "✅ Successfully updated viem version to $NEW_VERSION in $file"
  else
    echo "❌ Failed to update viem version in $file"
  fi
done

echo "All package.json files have been processed."
