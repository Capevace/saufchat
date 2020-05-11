[saufchat-ui](../README.md) › [Globals](../globals.md) › ["spotify-auth"](_spotify_auth_.md)

# Module: "spotify-auth"

## Index

### Interfaces

* [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md)

### Functions

* [checkForSpotifyTokens](_spotify_auth_.md#checkforspotifytokens)
* [loadSavedSpotifyTokens](_spotify_auth_.md#loadsavedspotifytokens)
* [redirectToSpotifyLogin](_spotify_auth_.md#redirecttospotifylogin)
* [saveSpotifyTokens](_spotify_auth_.md#savespotifytokens)

## Functions

###  checkForSpotifyTokens

▸ **checkForSpotifyTokens**(): *[SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) | null*

*Defined in [spotify-auth.ts:19](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify-auth.ts#L19)*

Check the SessionStorage and the current URL for spotify tokens.

**Returns:** *[SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) | null*

___

###  loadSavedSpotifyTokens

▸ **loadSavedSpotifyTokens**(): *[SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) | null*

*Defined in [spotify-auth.ts:68](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify-auth.ts#L68)*

Load tokens from SessionStorage. (They will be deleted after current use)

**Returns:** *[SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) | null*

___

###  redirectToSpotifyLogin

▸ **redirectToSpotifyLogin**(): *void*

*Defined in [spotify-auth.ts:12](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify-auth.ts#L12)*

Redirect the browser window to the spotify-login endpoint of our API server.
This page redirects to the correct SpotifyWebAPI page to login and obtain auth tokens.

**Returns:** *void*

___

###  saveSpotifyTokens

▸ **saveSpotifyTokens**(`tokens`: [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md)): *void*

*Defined in [spotify-auth.ts:85](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/spotify-auth.ts#L85)*

Save tokens to SessionStorage.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tokens` | [SpotifyTokens](../interfaces/_spotify_auth_.spotifytokens.md) | The tokens to save.  |

**Returns:** *void*
