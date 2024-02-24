# eip1193 types

This folder is adapted from viem
See it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5

We change a few things though:

1. We move every type to it's own file
2. We rename JsonRpcSchemas JsonRpcSchemaFoo as a convention
3. We make the schemas a map of request method name to schema definitions instead of an array

We copy it here for easier developer experience internally and also to lock in these types independent of viem potentially making changes.

Because it's typescript types only there is no downside to 'vendoring' some of this code in terms of code splitting concerns
