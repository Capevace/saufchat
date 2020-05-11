[saufchat-ui](../README.md) › [Globals](../globals.md) › ["spotify"](_spotify_.md)

# Module: "spotify"

## Index

### Classes

* [SpotifyClient](../classes/_spotify_.spotifyclient.md)

### Interfaces

* [ListResponse](../interfaces/_spotify_.listresponse.md)
* [Playlist](../interfaces/_spotify_.playlist.md)
* [SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)
* [SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)
* [Track](../interfaces/_spotify_.track.md)

### Variables

* [PLAYLIST_DESCRIPTION](_spotify_.md#const-playlist_description)
* [PLAYLIST_NAME](_spotify_.md#const-playlist_name)

### Functions

* [createSpotifyClient](_spotify_.md#createspotifyclient)
* [getErrorMessage](_spotify_.md#geterrormessage)
* [spotifyFetch](_spotify_.md#spotifyfetch)

## Variables

### `Const` PLAYLIST_DESCRIPTION

• **PLAYLIST_DESCRIPTION**: *"This playlist was automagically generated because you used enabled Spotify in SAUF.CHAT! Feel free to delete the playlist – it will be recreated next time you use SAUF.CHAT!"* = "This playlist was automagically generated because you used enabled Spotify in SAUF.CHAT! Feel free to delete the playlist – it will be recreated next time you use SAUF.CHAT!"

*Defined in [spotify.ts:4](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L4)*

___

### `Const` PLAYLIST_NAME

• **PLAYLIST_NAME**: *"SAUF.CHAT – Queue"* = "SAUF.CHAT – Queue"

*Defined in [spotify.ts:3](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L3)*

## Functions

###  createSpotifyClient

▸ **createSpotifyClient**(): *Promise‹[SpotifyClient](../classes/_spotify_.spotifyclient.md)›*

*Defined in [spotify.ts:157](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L157)*

Check for Spotify tokens and create a Spotify client if found.

**Returns:** *Promise‹[SpotifyClient](../classes/_spotify_.spotifyclient.md)›*

___

###  getErrorMessage

▸ **getErrorMessage**(`error`: string | Error): *string*

*Defined in [spotify.ts:261](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L261)*

**Parameters:**

Name | Type |
------ | ------ |
`error` | string &#124; Error |

**Returns:** *string*

___

###  spotifyFetch

▸ **spotifyFetch**<**DataType**>(`tokens`: [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md), `rawUrl`: string, `options`: Partial‹[SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)›): *Promise‹[SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)‹DataType››*

*Defined in [spotify.ts:223](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify.ts#L223)*

**Type parameters:**

▪ **DataType**

**Parameters:**

Name | Type |
------ | ------ |
`tokens` | [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) |
`rawUrl` | string |
`options` | Partial‹[SpotifyFetchOptions](../interfaces/_spotify_.spotifyfetchoptions.md)› |

**Returns:** *Promise‹[SpotifyResponse](../interfaces/_spotify_.spotifyresponse.md)‹DataType››*
