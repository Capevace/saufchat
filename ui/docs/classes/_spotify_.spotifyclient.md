[saufchat-ui](../README.md) › [Globals](../globals.md) › ["spotify"](../modules/_spotify_.md) › [SpotifyClient](_spotify_.spotifyclient.md)

# Class: SpotifyClient

## Hierarchy

* **SpotifyClient**

## Index

### Constructors

* [constructor](_spotify_.spotifyclient.md#constructor)

### Properties

* [playlistId](_spotify_.spotifyclient.md#protected-playlistid)
* [tokens](_spotify_.spotifyclient.md#tokens)

### Methods

* [fetch](_spotify_.spotifyclient.md#fetch)
* [fetchRaw](_spotify_.spotifyclient.md#fetchraw)
* [getPlaylistId](_spotify_.spotifyclient.md#getplaylistid)
* [updateQueuePlaylist](_spotify_.spotifyclient.md#updatequeueplaylist)

## Constructors

###  constructor

\+ **new SpotifyClient**(`tokens`: [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md)): *[SpotifyClient](_spotify_.spotifyclient.md)*

*Defined in [spotify.ts:17](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`tokens` | [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) |

**Returns:** *[SpotifyClient](_spotify_.spotifyclient.md)*

## Properties

### `Protected` playlistId

• **playlistId**: *string | null* = null

*Defined in [spotify.ts:17](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L17)*

The queue playlistId. **Using this variable directly does not guarantee it will be available.**
Use [SpotifyClient.getPlaylistId](_spotify_.spotifyclient.md#getplaylistid) instead.

___

###  tokens

• **tokens**: *[SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md)*

*Defined in [spotify.ts:11](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L11)*

The Spotify auth tokens.

## Methods

###  fetch

▸ **fetch**<**DataType**>(`endpoint`: string, `options`: Partial‹[SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)›): *Promise‹[SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)‹DataType››*

*Defined in [spotify.ts:123](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L123)*

Fetch a Spotify endpoint, authenticated with the classes SpotifyTokens.

**`async`** 

**`example`** 
const { data: { id } } = await this.fetch<{ id: string }>(`me/playlists`, {
     method: 'post',
	    body: {
		    name: PLAYLIST_NAME,
			description: PLAYLIST_DESCRIPTION,
			public: false,
		},
	});

**Type parameters:**

▪ **DataType**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`endpoint` | string | The endpoint to load. |
`options` | Partial‹[SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)› | The options to pass into the request. |

**Returns:** *Promise‹[SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)‹DataType››*

___

###  fetchRaw

▸ **fetchRaw**<**DataType**>(`rawUrl`: string, `options`: Partial‹[SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)›): *Promise‹[SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)‹DataType››*

*Defined in [spotify.ts:148](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L148)*

Fetch a raw URL, authenticated with the classes SpotifyTokens.

Attention: No checking on the URL is done, only pass Spotify API calls here.
Otherwise, your tokens may get leaked.

**`async`** 

**`example`** 
const { data: { id } } = await this.fetch<{ id: string }>(`me/playlists`, {
     method: 'post',
	    body: {
		    name: PLAYLIST_NAME,
			description: PLAYLIST_DESCRIPTION,
			public: false,
		},
	});

**Type parameters:**

▪ **DataType**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rawUrl` | string | The raw URL to load. |
`options` | Partial‹[SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)› | The options to pass into the request. |

**Returns:** *Promise‹[SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)‹DataType››*

___

###  getPlaylistId

▸ **getPlaylistId**(): *Promise‹string›*

*Defined in [spotify.ts:28](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L28)*

**Returns:** *Promise‹string›*

___

###  updateQueuePlaylist

▸ **updateQueuePlaylist**(`queue`: string[]): *Promise‹void›*

*Defined in [spotify.ts:88](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L88)*

Set the songs in the Spotify queue playlist.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`queue` | string[] | [] |   |

**Returns:** *Promise‹void›*
