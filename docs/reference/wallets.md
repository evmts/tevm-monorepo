# Wallets

Wallets are used to sign transactions. They can proxy to other wallet implementations or use a private key directly

## Type

```typescript
type Wallet = {
  
}
```

## createWalletFromPrivateKey

- **Type**

```typescript
function createWalletFromPrivateKey(): Wallet
```
## createWalletFromMmenomic

- **Type**

```typescript
function createWalletFromMmenomic(): Wallet
```

## createWalletFromWindow

- **Type**

```typescript
function createWalletFromWindow(windowWallet: typeof window.ethereum): Wallet
```

