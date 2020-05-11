[saufchat-ui](../README.md) › [Globals](../globals.md) › ["room"](../modules/_room_.md) › [RoomState](_room_.roomstate.md)

# Interface: RoomState

The "reactive" state type interface that a room has.

## Hierarchy

* **RoomState**

## Index

### Properties

* [calls](_room_.roomstate.md#calls)
* [connectionState](_room_.roomstate.md#connectionstate)
* [mediaStream](_room_.roomstate.md#mediastream)
* [peers](_room_.roomstate.md#peers)
* [peersInCall](_room_.roomstate.md#peersincall)

## Properties

###  calls

• **calls**: *Map‹string, [Call](_room_.call.md)›*

*Defined in [room.ts:42](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L42)*

A map of all current P2P calls indexed by the respective PeerIDs the calls are to.

___

###  connectionState

• **connectionState**: *[ServerConnectionState](../enums/_room_.serverconnectionstate.md)*

*Defined in [room.ts:27](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L27)*

The connection state to the API server.

___

###  mediaStream

• **mediaStream**: *MediaStream | null*

*Defined in [room.ts:47](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L47)*

The user's camera and mic stream.

___

###  peers

• **peers**: *Set‹string›*

*Defined in [room.ts:32](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L32)*

A list of all PeerIDs connected to the Room.

___

###  peersInCall

• **peersInCall**: *Set‹string›*

*Defined in [room.ts:37](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/room.ts#L37)*

A list of all PeerIDs that have joined the group call.
