# Update Solidity Versions

I need your help to update the Solidity compiler version support in the @tevm/solc package. This involves checking for new Solidity releases, using the version script to get their version hashes, and updating the appropriate files.

## Steps:

1. First, let's do a smoke test with the last supported version to verify the script is working correctly.
   - Check the `bundler-packages/solc/src/solcTypes.ts` and `bundler-packages/solc/src/solc.js` files to find the latest supported version.
   - Run the version script against that version to verify it works: `cd bundler-packages/solc && npm run solc:version <last_supported_version>`

2. Check what's the next unreleased version we need to add:
   - Run the npm command to check the latest available solc version: `npm view solc versions --json`
   - Identify the latest versions that aren't supported yet in our codebase.

3. For each new version, use our script to get the version hash:
   - `cd bundler-packages/solc && npm run solc:version <new_version>`
   - The output will be the version hash in the format: `v<version>+commit.<hash>`

4. Update the following files in the project:
   - `bundler-packages/solc/src/solcTypes.ts`: Add the new version(s) to the `SolcVersions` type union
   - `bundler-packages/solc/src/solc.js`: Add the new version hash(es) to the `releases` object

5. Consider updating the `solc` dependency in package.json if appropriate.

Please help me execute these steps to add support for any new Solidity compiler versions. Start with the smoke test to verify the script works with an already supported version before proceeding with adding new versions.

## Example workflow:

1. You find that 0.8.28 is our latest supported version.
2. Run the smoke test: `cd bundler-packages/solc && npm run solc:version 0.8.28`
3. Check for newer versions: `npm view solc versions --json`
4. Find that 0.8.29 and 0.8.30 are available but not supported.
5. For each new version, get the hash: `npm run solc:version 0.8.29`
6. Update the appropriate files with the new version information.
7. Suggest updating package.json dependencies if needed.

Thank you for your help!