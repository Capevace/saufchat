import Peer from 'peerjs';

import { SpotifyBoard } from '@/services/boards';

/**
 * State of the socket connection to the API-Server.
 */
export enum ServerConnectionState {
	disconnected,
	connecting,
	connected,
	error
}

/**
 * The "reactive" state type interface that a room has.
 */
export interface RoomState {
	/**
	 * The connection state to the API server.
	 */
	connectionState: ServerConnectionState;

	/**
	 * A list of all PeerIDs connected to the Room.
	 */
	peers: Set<string>;

	/**
	 * A list of all PeerIDs that have joined the group call.
	 */
	peersInCall: Set<string>;

	/**
	 * A map of all current P2P calls indexed by the respective PeerIDs the calls are to.
	 */
	calls: Map<string, Call>;

	/**
	 * The user's camera and mic stream.
	 */
	mediaStream: MediaStream | null;
}

/**
 * Get the default empty room state.
 */
export function emptyRoomState(): RoomState {
	return {
		connectionState: ServerConnectionState.disconnected,
		peers: new Set<string>(),
		peersInCall: new Set<string>(),

		calls: new Map<string, Call>(),
		mediaStream: null
	};
}

/**
 * {@link RoomState}, but adapted for Vue's reactiveness.
 *
 * @remarks
 * This is done because Vue does not support reactiveness on Set / Map, which we use internally as data structures in the room.
 */
export interface ReactiveRoomState {
	connectionState: ServerConnectionState;
	peers: string[];
	peersInCall: string[];
	calls: { [key: string]: ReactiveCall };
	mediaStream: MediaStream | null;
}

/**
 * Get the default empty room state.
 */
export function emptyReactiveRoomState(): ReactiveRoomState {
	return {
		connectionState: ServerConnectionState.disconnected,
		peers: [],
		peersInCall: [],

		calls: {},
		mediaStream: null
	};
}

/**
 * Interface for a Call object.
 */
export interface Call {
	/**
	 * The media stream of the callees camera and mic.
	 */
	stream?: MediaStream;

	/**
	 * The peer connection to the other user.
	 */
	connection: Peer.MediaConnection;
}

/**
 * Interface for a Call object, but optimized for Vue reactiveness.
 *
 * The Peer.MediaConnection object has circular references, which should be avoided when setting Vue state.
 */
export interface ReactiveCall {
	/**
	 * The media stream of the callees camera and mic.
	 */
	stream?: MediaStream;
}

export interface Boards {
	spotify: SpotifyBoard;
}
