[saufchat-ui](../README.md) › [Globals](../globals.md) › ["boards"](../modules/_boards_.md) › [Board](_boards_.board.md)

# Class: Board <**StateType**>

An abstract board, used to hold functionality and server communication for a given board.

## Type parameters

▪ **StateType**

## Hierarchy

* **Board**

  ↳ [SpotifyBoard](_boards_.spotifyboard.md)

## Index

### Constructors

* [constructor](_boards_.board.md#protected-constructor)

### Properties

* [bus](_boards_.board.md#bus)
* [socket](_boards_.board.md#socket)
* [state](_boards_.board.md#state)

### Methods

* [emitStateChange](_boards_.board.md#protected-emitstatechange)
* [emitWithResponse](_boards_.board.md#protected-emitwithresponse)
* [onStateUpdate](_boards_.board.md#onstateupdate)
* [setState](_boards_.board.md#setstate)

## Constructors

### `Protected` constructor

\+ **new Board**(`socket`: Socket): *[Board](_boards_.board.md)*

*Defined in [boards.ts:42](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`socket` | Socket |

**Returns:** *[Board](_boards_.board.md)*

## Properties

###  bus

• **bus**: *EventBus*

*Defined in [boards.ts:37](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L37)*

The internal event bus used to handle callbacks.

___

###  socket

• **socket**: *Socket*

*Defined in [boards.ts:32](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L32)*

The API server socket (connection handled by [RoomClient](_room_.roomclient.md))

___

###  state

• **state**: *StateType*

*Defined in [boards.ts:42](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L42)*

The boards reactive state object.

## Methods

### `Protected` emitStateChange

▸ **emitStateChange**(): *void*

*Defined in [boards.ts:92](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L92)*

Emits a state change on the internal bus, and causes callbacks created with onStateUpdate to fire.

**`emits`** 'state-changed'

**Returns:** *void*

___

### `Protected` emitWithResponse

▸ **emitWithResponse**(`event`: string, `data`: object): *Promise‹[ServerResponse](../interfaces/_boards_.serverresponse.md)›*

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

*Defined in [boards.ts:63](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L63)*

Setup a callback that's fired when the boards' state changed.

**`listens`** 'state-changed'

**Parameters:**

▪ **callback**: *function*

▸ (`state`: StateType): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | StateType |

**Returns:** *function*

Function to unbind the callback.

▸ (): *void*

___

###  setState

▸ **setState**(`state`: Partial‹StateType›): *void*

*Defined in [boards.ts:49](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/boards.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | Partial‹StateType› |

**Returns:** *void*
