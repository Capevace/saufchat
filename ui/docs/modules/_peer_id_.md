[saufchat-ui](../README.md) › [Globals](../globals.md) › ["peer-id"](_peer_id_.md)

# Module: "peer-id"

## Index

### Variables

* [SHOULD_CACHE_ID](_peer_id_.md#const-should_cache_id)
* [id](_peer_id_.md#let-id)

### Functions

* [createAndSavePeerID](_peer_id_.md#createandsavepeerid)

## Variables

### `Const` SHOULD_CACHE_ID

• **SHOULD_CACHE_ID**: *boolean* = false

*Defined in [peer-id.ts:3](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/peer-id.ts#L3)*

___

### `Let` id

• **id**: *string* = SHOULD_CACHE_ID
	? window.localStorage.getItem('peer-id') || createAndSavePeerID()
	: createAndSavePeerID()

*Defined in [peer-id.ts:7](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/peer-id.ts#L7)*

## Functions

###  createAndSavePeerID

▸ **createAndSavePeerID**(): *string*

*Defined in [peer-id.ts:16](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/peer-id.ts#L16)*

Create a PeerID (a CUID) and save it to localStorage.

PeerIDs currently have the format: 'P-' + CUID.

**Returns:** *string*
