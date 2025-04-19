# Krome - Native Blockchain Apps Made Simple

Build blazingly fast, tiny blockchain applications that run natively on all major desktop and mobile platforms.

## What is Krome?

Krome is a framework for building blockchain applications that compile to tiny, native binaries for all major platforms. By leveraging Rust and advanced optimizations, Krome apps are typically under 10MB in size while delivering unmatched performance. It combines the best of modern development tools and frameworks:

- **[Tauri](https://tauri.app)** for secure native cross-platform applications
- **[Svelte 5](https://svelte.dev)** for performant, intuitive UI development
- **[TEVM](https://tevm.sh)** for Ethereum Virtual Machine integration
- **[Deno (TODO)](https://deno.land)** for secure JavaScript runtime
- **[Helios](https://github.com/a16z/helios)** (optional) for trustless light client capabilities

What sets Krome apart is its uncompromising focus on both user experience and developer productivity. Through its opinionated framework, it delivers a polished, native feel for users while maximizing development speed and maintainability for developers.

## ✨ Features

- 🖥️ **True Native Performance**: Build once, run anywhere with [Tauri](https://tauri.app)'s native capabilities
- 🔗 **Blockchain-Ready**: Pre-configured with [TEVM](https://tevm.sh) for seamless blockchain integration
- 🔄 **Multi-Language Support**:
  - [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)/[TypeScript](https://www.typescriptlang.org)
  - [Golang](https://go.dev)
  - [Rust](https://www.rust-lang.org)
  - [Solidity](https://soliditylang.org)
- 🎨 **Performant UI**:
  - Faster than React-based alternatives
  - Intuitive for blockchain and systems developers
  - Simple, declarative syntax
- 📱 **Mobile First**: First-class mobile support out of the box
- 🔒 **Security First**:
  - [Deno](https://deno.land)'s secure-by-default runtime
  - [Tauri](https://tauri.app/v1/guides/security/security)'s security-focused architecture
  - Audited dependencies and minimal attack surface
- ⚡ **Optimistic Updates**: Built-in support for snappy UIs with optimistic operations
- 👛 **Wallet Integration**:
  - Simple, secure wallet connection with broad provider support
  - Built-in embedded wallet support for seamless onboarding
  - Secure key management using the system's native keychain
- 🧪 **Testing Ready**: Comprehensive testing setup for all supported languages

![image](https://github.com/user-attachments/assets/01666351-a2e6-4a09-879e-533a1f8ea06b)

## Requirements

- [Deno](https://deno.land/manual/getting_started/installation) 1.41 or later
- [Rust](https://www.rust-lang.org/tools/install) toolchain
- [Go](https://go.dev/doc/install) 1.22 or later
- [Node.js](https://nodejs.org) 20 or later (for npm packages)
- For iOS development: [Xcode](https://developer.apple.com/xcode/) 15+
- For Android development: [Android Studio](https://developer.android.com/studio) Hedgehog+

## Quick Start

Run app in dev mode

```bash
pnpm install

tauri dev
```

See [tauri 2.0](https://v2.tauri.app/) docs for tauri specific information

## File structure

App logic

- [src/](./src/) contains the source code for the svelte app
- Svelte uses file based routing in [src/routes](./src/routes/) folder
- Context to help your llm write svelte is in [src/svelte.llm.txt](./src/svelte.llm.txt)
- [src-tauri](./src-tauri) contains the rust code
- Rust code is binded to svelte app in [src-tauri/lib.rs](./src-tauri/lib.rs)

Tauri specific files

- [src-tauri/](./src-tauri/tauri.conf.json) contains the [tauri config](https://v2.tauri.app/reference/config/)
- Additional configuration is in the capabilities file [src-tauri/capabilities](./src-tauri/capabilities/)

## Community

Join our community to get help, share your projects, and contribute:

- [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE)
