[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / tevmDefault

# Variable: tevmDefault

> `const` **tevmDefault**: `object`

The default chain if no fork url is passed

## Type declaration

### blockExplorers?

> `optional` **blockExplorers**: `object`

#### Index Signature

 \[`key`: `string`\]: `object`

### blockExplorers.default

> **default**: `object`

### blockExplorers.default.apiUrl?

> `optional` **apiUrl**: `string`

### blockExplorers.default.name

> **name**: `string`

### blockExplorers.default.url

> **url**: `string`

### contracts?

> `optional` **contracts**: `Prettify`

### copy()

> **copy**: () => `Common`

#### Returns

`Common`

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

### ethjsCommon

> **ethjsCommon**: `Common`

### fees?

> `optional` **fees**: `ChainFees`

### formatters?

> `optional` **formatters**: `ChainFormatters`

### id

> **id**: `number`

### name

> **name**: `string`

### nativeCurrency

> **nativeCurrency**: `object`

### nativeCurrency.decimals

> **decimals**: `number`

### nativeCurrency.name

> **name**: `string`

### nativeCurrency.symbol

> **symbol**: `string`

### rpcUrls

> **rpcUrls**: `object`

#### Index Signature

 \[`key`: `string`\]: `object`

### rpcUrls.default

> **default**: `object`

### rpcUrls.default.http

> **http**: readonly `string`[]

### rpcUrls.default.webSocket?

> `optional` **webSocket**: readonly `string`[]

### serializers?

> `optional` **serializers**: `ChainSerializers`

### sourceId?

> `optional` **sourceId**: `number`

### testnet?

> `optional` **testnet**: `boolean`

## Defined in

packages/common/types/presets/tevmDefault.d.ts:4
