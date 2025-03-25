# Solc Version Hash Utility

This utility helps you determine the version hash for a specific version of the Solidity compiler (solc).

## Manual Process

To find the version hash for a new solc version:

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

5. Update the following files:
   - `src/solcTypes.ts`: Add the new version to the `SolcVersions` type union
   - `src/solcTypes.ts`: Add the new version to the `Releases` type
   - `src/solc.js`: Add the new version to the `releases` object
   - Update the `solc` dependency in `package.json`

6. Clean up:
```bash
cd .. && rm -rf tmp-solc
```

## Example

For Solc version 0.8.29:

1. Install and check the version:
```bash
mkdir -p tmp-solc && cd tmp-solc
npm init -y
npm install solc@0.8.29
node -e "const solc = require('solc'); console.log(solc.version());"
```

2. Output: `0.8.29+commit.ab55807c.Emscripten.clang`

3. Format as: `v0.8.29+commit.ab55807c.js`

4. Add to `releases` objects and update types