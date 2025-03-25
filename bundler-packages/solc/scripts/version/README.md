# Solc Version Hash Utility

This utility helps you determine the version hash for a specific version of the Solidity compiler (solc).

## Automated Process

To find the version hash for a new solc version, use the provided script:

```bash
npm run solc:version <version>
```

Example:
```bash
npm run solc:version 0.8.29
```

The script will:
1. Create a temporary directory in your system's temp folder
2. Install the specified solc version
3. Extract the version hash
4. Format it correctly
5. Provide instructions for updating the codebase
6. Clean up the temporary directory automatically

## What to Update After Running the Script

After running the script, you'll need to update the following files:

1. `src/solcTypes.ts`: 
   - Add the new version to the `SolcVersions` type union
   - Add the new version to the `Releases` type if necessary

2. `src/solc.js`: 
   - Add the new version to the `releases` object

3. `package.json`:
   - Update the `solc` dependency to the new version

## Manual Process (Backup Method)

If the automated script fails, you can follow these manual steps:

1. Install the desired version temporarily:
```bash
mkdir -p tmp-solc && cd tmp-solc
npm init -y
npm install solc@x.y.z  # Replace x.y.z with the version you want
```

2. Extract the version hash:
```bash
node -e "const solc = require('solc'); console.log(solc.version());"
```

3. The output will look similar to: `0.8.29+commit.ab55807c.Emscripten.clang`

4. Format the version hash as: `vx.y.z+commit.ab55807c.js` 
   (where `x.y.z` is the version number and `ab55807c` is the commit hash)

5. Update the files as described above

6. Clean up:
```bash
cd .. && rm -rf tmp-solc
```