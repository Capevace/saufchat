[saufchat-ui](../README.md) › [Globals](../globals.md) › ["room"](../modules/_room_.md) › [RoomClient](_room_.roomclient.md)

# Class: RoomClient

The room client handling the room logic and data communication with the API server.

**`example`** 
let room = new RoomClient('room-id');
room.onStateUpdate((state) => {
    // Update UI state
});

// Join the video call
await room.joinCall();

// Disconnect
room.disconnect();

## Hierarchy

* **RoomClient**

## Index

### Constructors

* [constructor](_room_.roomclient.md#constructor)

### Properties

* [boards](_room_.roomclient.md#boards)
* [bus](_room_.roomclient.md#bus)
* [id](_room_.roomclient.md#id)
* [peer](_room_.roomclient.md#peer)
* [peerId](_room_.roomclient.md#peerid)
* [socket](_room_.roomclient.md#socket)
* [state](_room_.roomclient.md#state)

### Methods

* [disconnect](_room_.roomclient.md#disconnect)
* [emitStateChange](_room_.roomclient.md#private-emitstatechange)
* [joinCall](_room_.roomclient.md#joincall)
* [leaveCall](_room_.roomclient.md#leavecall)
* [onStateUpdate](_room_.roomclient.md#onstateupdate)
* [setState](_room_.roomclient.md#private-setstate)
* [startCallWithPeer](_room_.roomclient.md#private-startcallwithpeer)
* [updatePeersInCall](_room_.roomclient.md#private-updatepeersincall)

## Constructors

###  constructor

\+ **new RoomClient**(`roomId`: string): *[RoomClient](_room_.roomclient.md)*

*Defined in [room.ts:131](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`roomId` | string |

**Returns:** *[RoomClient](_room_.roomclient.md)*

## Properties

###  boards

• **boards**: *object*

*Defined in [room.ts:129](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L129)*

The boards the room uses.

#### Type declaration:

* **spotify**: *[SpotifyBoard](_boards_.spotifyboard.md)*

___

###  bus

• **bus**: *EventBus*

*Defined in [room.ts:109](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L109)*

The internal event bus used to handle callbacks.

___

###  id

• **id**: *string*

*Defined in [room.ts:99](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L99)*

The RoomID we are connected to.

___

###  peer

• **peer**: *Peer*

*Defined in [room.ts:119](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L119)*

The Peer instance responsible for setting up and handling Peer-to-Peer connections.

___

###  peerId

• **peerId**: *string*

*Defined in [room.ts:114](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L114)*

The PeerID of this client.

___

###  socket

• **socket**: *Socket*

*Defined in [room.ts:124](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L124)*

The socket instance for connection to the API server.

___

###  state

• **state**: *[RoomState](../interfaces/_room_.roomstate.md)* = emptyRoomState()

*Defined in [room.ts:104](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L104)*

The reactive room state that the UI can easily access.

## Methods

###  disconnect

▸ **disconnect**(): *void*

*Defined in [room.ts:368](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L368)*

**Returns:** *void*

___

### `Private` emitStateChange

▸ **emitStateChange**(): *void*

*Defined in [room.ts:308](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L308)*

Emit a state change.

**`emits`** 'state-changed'

**Returns:** *void*

___

###  joinCall

▸ **joinCall**(): *Promise‹void›*

*Defined in [room.ts:315](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L315)*

Join the group call.

**Returns:** *Promise‹void›*

___

###  leaveCall

▸ **leaveCall**(): *void*

*Defined in [room.ts:340](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L340)*

Leave the group call.

**Returns:** *void*

___

###  onStateUpdate

▸ **onStateUpdate**(`callback`: function): *function*

*Defined in [room.ts:360](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L360)*

Setup a callback for when the room's reactive state changes.

**`listens`** 'state-changed'

**Parameters:**

▪ **callback**: *function*

▸ (`state`: [RoomState](../interfaces/_room_.roomstate.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [RoomState](../interfaces/_room_.roomstate.md) |

**Returns:** *function*

A function to unbind the callback from the event.

▸ (): *void*

___

### `Private` setState

▸ **setState**(`state`: Partial‹[RoomState](../interfaces/_room_.roomstate.md)›): *void*

*Defined in [room.ts:215](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L215)*

Set the state and emit a state change.

**`emits`** state-changed

**Parameters:**

Name | Type |
------ | ------ |
`state` | Partial‹[RoomState](../interfaces/_room_.roomstate.md)› |

**Returns:** *void*

___

### `Private` startCallWithPeer

▸ **startCallWithPeer**(`peerConnection`: MediaConnection): *void*

*Defined in [room.ts:275](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L275)*

Start/setup a call with a peer connection.

Makes sure all state variables are updated accordingly to the peer connection state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peerConnection` | MediaConnection |   |

**Returns:** *void*

___

### `Private` updatePeersInCall

▸ **updatePeersInCall**(`peersInCall`: string[]): *void*

*Defined in [room.ts:228](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L228)*

Set the peersInCall state and start/end calls accordingly.

**`emits`** state-changed

**Parameters:**

Name | Type |
------ | ------ |
`peersInCall` | string[] |

**Returns:** *void*
