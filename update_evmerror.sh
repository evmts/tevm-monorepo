#!/bin/bash

cd /Users/williamcory/tevm/main/packages/errors/src/ethereum/ethereumjs

# List of files that need updating
files=(
  "InvalidInputLengthError.js"
  "InvalidEofFormatError.js"
  "InvalidCommitmentError.js"
  "InvalidBytecodeResultError.js"
  "InvalidBeginSubError.js"
  "InternalEvmError.js"
  "InsufficientBalanceError.js"
  "InitcodeSizeViolationError.js"
  "EvmRevertError.js"
  "CreateCollisionError.js"
  "CodeStoreOutOfGasError.js"
  "CodeSizeExceedsMaximumError.js"
  "BLS12381PointNotOnCurveError.js"
  "BLS12381InvalidInputLengthError.js"
  "BLS12381InputEmptyError.js"
  "BLS12381FpNotInFieldError.js"
  "AuthCallUnsetError.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    # Replace import statement
    sed -i '' 's/import { EVMError } from '\''@ethereumjs\/evm'\''/import { EvmError } from '\''@ethereumjs\/evm'\''/' "$file"
    # Replace EVMError.errorMessages
    sed -i '' 's/EVMError\.errorMessages/EvmError.errorMessages/g' "$file"
    # Replace JSDoc type reference
    sed -i '' 's/import('\''@ethereumjs\/evm'\'')\.EVMError/import('\''@ethereumjs\/evm'\'')\.EvmError/g' "$file"
  fi
done

echo "All files updated!"