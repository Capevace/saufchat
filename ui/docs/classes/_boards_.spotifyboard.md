[saufchat-ui](../README.md) › [Globals](../globals.md) › ["boards"](../modules/_boards_.md) › [SpotifyBoard](_boards_.spotifyboard.md)

# Class: SpotifyBoard

The Spotify Board.

## Hierarchy

* [Board](_boards_.board.md)‹[SpotifyBoardState](../interfaces/_boards_.spotifyboardstate.md)›

  ↳ **SpotifyBoard**

## Index

### Constructors

* [constructor](_boards_.spotifyboard.md#constructor)

### Properties

* [bus](_boards_.spotifyboard.md#bus)
* [socket](_boards_.spotifyboard.md#socket)
* [spotify](_boards_.spotifyboard.md#optional-spotify)
* [state](_boards_.spotifyboard.md#state)

### Methods

* [addTrack](_boards_.spotifyboard.md#addtrack)
* [emitStateChange](_boards_.spotifyboard.md#protected-emitstatechange)
* [emitWithResponse](_boards_.spotifyboard.md#protected-emitwithresponse)
* [onStateUpdate](_boards_.spotifyboard.md#onstateupdate)
* [refetchQueue](_boards_.spotifyboard.md#refetchqueue)
* [removeTrack](_boards_.spotifyboard.md#removetrack)
* [setState](_boards_.spotifyboard.md#setstate)
* [updateQueue](_boards_.spotifyboard.md#protected-updatequeue)

## Constructors

###  constructor

\+ **new SpotifyBoard**(`socket`: Socket): *[SpotifyBoard](_boards_.spotifyboard.md)*

*Overrides [Board](_boards_.board.md).[constructor](_boards_.board.md#protected-constructor)*

*Defined in [boards.ts:127](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | Socket |

**Returns:** *[SpotifyBoard](_boards_.spotifyboard.md)*

## Properties

###  bus

• **bus**: *EventBus*

*Inherited from [Board](_boards_.board.md).[bus](_boards_.board.md#bus)*

*Defined in [boards.ts:37](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L37)*

The internal event bus used to handle callbacks.

___

###  socket

• **socket**: *Socket*

*Inherited from [Board](_boards_.board.md).[socket](_boards_.board.md#socket)*

*Defined in [boards.ts:32](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L32)*

The API server socket (connection handled by [RoomClient](_room_.roomclient.md))

___

### `Optional` spotify

• **spotify**? : *[SpotifyClient](_spotify_.spotifyclient.md)*

*Defined in [boards.ts:127](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L127)*

The Spotify client we use to update our playlist.

___

###  state

• **state**: *[SpotifyBoardState](../interfaces/_boards_.spotifyboardstate.md)*

*Overrides [Board](_boards_.board.md).[state](_boards_.board.md#state)*

*Defined in [boards.ts:122](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L122)*

## Methods

###  addTrack

▸ **addTrack**(`trackId`: string): *Promise‹void›*

*Defined in [boards.ts:178](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`trackId` | string |

**Returns:** *Promise‹void›*

___

### `Protected` emitStateChange

▸ **emitStateChange**(): *void*

*Inherited from [Board](_boards_.board.md).[emitStateChange](_boards_.board.md#protected-emitstatechange)*

*Defined in [boards.ts:92](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L92)*

Emits a state change on the internal bus, and causes callbacks created with onStateUpdate to fire.

**`emits`** 'state-changed'

**Returns:** *void*

___

### `Protected` emitWithResponse

▸ **emitWithResponse**(`event`: string, `data`: object): *Promise‹[ServerResponse](../interfaces/_boards_.serverresponse.md)›*

*Inherited from [Board](_boards_.board.md).[emitWithResponse](_boards_.board.md#protected-emitwithresponse)*

*Defined in [boards.ts:76](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L76)*

Emit an event to the API server with given data, and wait for a response.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`event` | string | - | The event name to send. |
`data` | object | {} | The event data  |

**Returns:** *Promise‹[ServerResponse](../interfaces/_boards_.serverresponse.md)›*

___

###  onStateUpdate

▸ **onStateUpdate**(`callback`: function): *function*

*Inherited from [Board](_boards_.board.md).[onStateUpdate](_boards_.board.md#onstateupdate)*

*Defined in [boards.ts:63](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L63)*

Setup a callback that's fired when the boards' state changed.

**`listens`** 'state-changed'

**Parameters:**

▪ **callback**: *function*

▸ (`state`: [SpotifyBoardState](../interfaces/_boards_.spotifyboardstate.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [SpotifyBoardState](../interfaces/_boards_.spotifyboardstate.md) |

**Returns:** *function*

Function to unbind the callback.

▸ (): *void*

___

###  refetchQueue

▸ **refetchQueue**(): *Promise‹void›*

*Defined in [boards.ts:156](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L156)*

**Returns:** *Promise‹void›*

___

###  removeTrack

▸ **removeTrack**(`index`: number): *Promise‹void›*

*Defined in [boards.ts:182](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L182)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: Partial‹[SpotifyBoardState](../interfaces/_boards_.spotifyboardstate.md)›): *void*

*Inherited from [Board](_boards_.board.md).[setState](_boards_.board.md#setstate)*

*Defined in [boards.ts:49](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | Partial‹[SpotifyBoardState](../interfaces/_boards_.spotifyboardstate.md)› |

**Returns:** *void*

___

### `Protected` updateQueue

▸ **updateQueue**(`queue`: string[]): *Promise‹void›*

*Defined in [boards.ts:167](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L167)*

Update the local queue state and save the queue songs in the Spotify playlist.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`queue` | string[] |   |

**Returns:** *Promise‹void›*
