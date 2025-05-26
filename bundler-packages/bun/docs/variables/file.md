[**@tevm/bun-plugin**](../README.md)

***

[@tevm/bun-plugin](../globals.md) / file

# Variable: file()

> `const` **file**: \{(`path`, `options?`): `BunFile`; (`path`, `options?`): `BunFile`; (`fileDescriptor`, `options?`): `BunFile`; \}

Defined in: [bundler-packages/bun/src/bunFile.js:26](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bun/src/bunFile.js#L26)

Re-exports the Bun file API for working with files in the file system.
The Bun file API provides an optimized interface for file operations with
methods for reading, writing, and checking file existence.

## Call Signature

> (`path`, `options?`): `BunFile`

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.

This Blob is lazy. That means it won't do any work until you read from it.

- `size` will not be valid until the contents of the file are read at least once.
- `type` is auto-set based on the file extension when possible

### Parameters

#### path

The path to the file (lazily loaded) if the path starts with `s3://` it will behave like S3File

`string` | `URL`

#### options?

`BlobPropertyBag`

### Returns

`BunFile`

### Examples

```js
const file = Bun.file("./hello.json");
console.log(file.type); // "application/json"
console.log(await file.json()); // { hello: "world" }
```

```js
await Bun.write(
  Bun.file("./hello.txt"),
  "Hello, world!"
);
```

## Call Signature

> (`path`, `options?`): `BunFile`

`Blob` that leverages the fastest system calls available to operate on files.

This Blob is lazy. It won't do any work until you read from it. Errors propagate as promise rejections.

`Blob.size` will not be valid until the contents of the file are read at least once.
`Blob.type` will have a default set based on the file extension

### Parameters

#### path

The path to the file as a byte buffer (the buffer is copied) if the path starts with `s3://` it will behave like S3File

`ArrayBufferLike` | `Uint8Array`\<`ArrayBufferLike`\>

#### options?

`BlobPropertyBag`

### Returns

`BunFile`

### Example

```js
const file = Bun.file(new TextEncoder.encode("./hello.json"));
console.log(file.type); // "application/json"
```

## Call Signature

> (`fileDescriptor`, `options?`): `BunFile`

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.

This Blob is lazy. That means it won't do any work until you read from it.

- `size` will not be valid until the contents of the file are read at least once.

### Parameters

#### fileDescriptor

`number`

The file descriptor of the file

#### options?

`BlobPropertyBag`

### Returns

`BunFile`

### Example

```js
const file = Bun.file(fd);
```

## See

[Bun File I/O Documentation](https://bun.sh/docs/api/file-io)

## Example

```javascript
import { file } from '@tevm/bun'

// Create a file reference
const myFile = file('path/to/file.txt')

// Check if the file exists
const exists = await myFile.exists()

// Read file as text
const content = await myFile.text()

// Write to file
await myFile.write('Hello, world!')
```
