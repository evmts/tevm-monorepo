[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / StorageRange

# Interface: StorageRange

Object that can contain a set of storage keys associated with an account.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="nextkey"></a> `nextKey` | `string` \| `null` | The next (hashed) storage key after the greatest storage key contained in `storage`. |
| <a id="storage"></a> `storage` | `object` | A dictionary where the keys are hashed storage keys, and the values are objects containing the preimage of the hashed key (in `key`) and the storage key (in `value`). Currently, there is no way to retrieve preimages, so they are always `null`. |
