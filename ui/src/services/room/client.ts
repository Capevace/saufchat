import Peer from 'peerjs';
import EventBus from 'eev';
import io from 'socket.io-client';

import {
	RoomState,
	emptyRoomState,
	Boards,
	ServerConnectionState,
	ReactiveCall,
	Call,
	ReactiveRoomState
} from './state';
import { API_URL } from '@/config';
import { SpotifyBoard } from '@/services/boards';
import { getMediaStream } from '@/services/media';
import peerId from '@/services/peer-id';

/**
 * The room client handling the room logic and data communication with the API server.
 *
 * @example
 * let room = new RoomClient('room-id');
 * room.onStateUpdate((state) => {
 *     // Update UI state
 * });
 *
 * // Join the video call
 * await room.joinCall();
 *
 * // Disconnect
 * room.disconnect();
 */
export class RoomClient {
	/**
	 * The RoomID we are connected to.
	 */
	id: string;

	/**
	 * The reactive room state that the UI can easily access.
	 */
	state: RoomState = emptyRoomState();

	/**
	 * The internal event bus used to handle callbacks.
	 */
	bus: EventBus;

	/**
	 * The PeerID of this client.
	 */
	peerId: string;

	/**
	 * The Peer instance responsible for setting up and handling Peer-to-Peer connections.
	 */
	peer: Peer;

	/**
	 * The socket instance for connection to the API server.
	 */
	socket: SocketIOClient.Socket;

	/**
	 * The boards the room uses.
	 */
	boards: Boards;

	constructor(roomId: string) {
		this.id = roomId;

		this.bus = new EventBus();

		// Setup Peer
		this.peerId = peerId;
		this.peer = new Peer(peerId, {
			config: {
				iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
			}
		});
		this.peer.on('open', function(id) {
			console.log('My peer ID is: ' + id);
		});
		this.peer.on('call', connection => {
			// Answer call with video stream
			connection.answer(this.state.mediaStream || undefined); // converting null to undefined because fuck typescript

			this.startCallWithPeer(connection);
			this.emitStateChange();
		});

		// Setup Socket
		this.socket = io(API_URL, {
			query: {
				roomId: roomId,
				peerId: peerId
			}
			// transports: ['websocket', 'polling'],
		});
		// TODO: handle these errors better (collect and join them all i dunno)
		this.socket.on('connect', () => console.info('connect'));
		this.socket.on('connect_error', (error: any) =>
			console.info('connect_error', error)
		);
		this.socket.on('connect_timeout', () =>
			console.info('connect_timeout')
		);
		this.socket.on('error', (error: any) => console.info('error', error));
		this.socket.on('disconnect', () => console.info('disconnect'));
		this.socket.on('reconnect', () => console.info('reconnect'));
		this.socket.on('reconnect_attempt', () => console.info('reconnect'));
		this.socket.on('reconnect_error', (error: any) =>
			console.info('reconnect_error', error)
		);
		this.socket.on('reconnect_failed', () =>
			console.info('reconnect_failed')
		);

		this.socket.on('connect', () =>
			this.setState({
				connectionState: ServerConnectionState.connected
			})
		);

		this.socket.on('disconnect', () =>
			this.setState({
				connectionState: ServerConnectionState.disconnected
			})
		);

		this.socket.on('peers-update', (data: { peers: string[] }) =>
			this.setState({
				peers: new Set<string>(data.peers)
			})
		);
		this.socket.on('peers-in-call-update', (data: { peers: string[] }) =>
			this.updatePeersInCall(data.peers)
		);

		const spotifyBoard = new SpotifyBoard(this.socket);

		// Setup boards
		this.boards = {
			spotify: spotifyBoard
		};
	}

	/**
	 * Set the state and emit a state change.
	 * @param state
	 * @emits state-changed
	 */
	private setState(state: Partial<RoomState>) {
		this.state = {
			...this.state,
			...state
		};
		this.emitStateChange();
	}

	/**
	 * Set the peersInCall state and start/end calls accordingly.
	 * @param peersInCall
	 * @emits state-changed
	 */
	private updatePeersInCall(peersInCall: string[]) {
		// Only make calls if we have joined the call.
		if (peersInCall.includes(this.peerId)) {
			// The peers that have been added to the call.
			const newPeers = peersInCall.filter(
				peerId => !this.state.peersInCall.has(peerId)
			);
			// The peers that have been removed from the call.
			const removedPeers = Array.from(this.state.peersInCall).filter(
				peerId => !peersInCall.includes(peerId)
			);

			// End all calls to the removed peers.
			for (const removedPeer of removedPeers) {
				const call = this.state.calls.get(removedPeer);

				if (call) {
					call.connection.close();
					this.state.calls.delete(removedPeer);
				}
			}

			for (const newPeer of newPeers) {
				if (!newPeer || this.state.mediaStream === null) {
					continue;
				}

				const connection = this.peer.call(
					newPeer,
					this.state.mediaStream
				);
				this.startCallWithPeer(connection);
			}
		}

		this.setState({
			peersInCall: new Set<string>(peersInCall)
		});
	}

	/**
	 * Start/setup a call with a peer connection.
	 *
	 * Makes sure all state variables are updated accordingly to the peer connection state.
	 *
	 * @param peerConnection
	 */
	private startCallWithPeer(peerConnection: Peer.MediaConnection) {
		const remotePeerId = peerConnection.peer;

		peerConnection.on('stream', stream => {
			const call = this.state.calls.get(remotePeerId);

			if (!call) return;

			this.state.calls.set(remotePeerId, {
				...call,
				stream: stream
			});
			this.emitStateChange();
		});

		peerConnection.on('error', (error: any) =>
			console.error('error in peer', error)
		);
		peerConnection.on('close', () => {
			this.state.calls.delete(remotePeerId);
			this.emitStateChange();
		});

		this.state.calls.set(remotePeerId, {
			connection: peerConnection
		});
	}

	/**
	 * Emit a state change.
	 * @emits 'state-changed'
	 */
	private emitStateChange() {
		let filteredCalls: { [key: string]: ReactiveCall } = {};

		this.state.calls.forEach((call: Call, remotePeerId: string) => {
			filteredCalls[remotePeerId] = { stream: call.stream };
		});

		const reactiveState = {
			connectionState: this.state.connectionState,
			peers: Array.from(this.state.peers),
			peersInCall: Array.from(this.state.peersInCall),
			calls: filteredCalls,
			mediaStream: this.state.mediaStream
		};

		this.bus.emit('state-changed', reactiveState);
	}

	/**
	 * Join the group call.
	 */
	async joinCall() {
		// If we're already in the call,
		if (this.state.peersInCall.has(this.peerId)) {
			return console.info(
				`You can't join a call if you're already part of it.`
			);
		}

		// Get the user's camera and mic stream
		this.state.mediaStream = await getMediaStream();

		// Start a Peer to Peer call with every joined peer
		for (const peerId of this.state.peersInCall) {
			const connection = this.peer.call(peerId, this.state.mediaStream);
			this.startCallWithPeer(connection);
		}

		// Emit 'join-call' AFTER we've started the calls as we don't want multiple to be started.
		this.socket.emit('join-call');

		// We emit a state change as state has changed due to the calls we started.
		this.emitStateChange();
	}

	/**
	 * Leave the group call.
	 */
	leaveCall() {
		this.state.mediaStream = null;

		// Close every call connection
		this.state.calls.forEach(call => {
			call.connection.close();
		});

		this.socket.emit('leave-call');
		this.state.calls = new Map<string, Call>();

		this.emitStateChange();
	}

	/**
	 * Setup a callback for when the room's reactive state changes.
	 * @param callback
	 * @returns A function to unbind the callback from the event.
	 * @listens 'state-changed'
	 */
	onStateUpdate(callback: (state: ReactiveRoomState) => void): () => void {
		this.bus.on('state-changed', callback);

		return () => {
			this.bus.off('state-changed', callback);
		};
	}

	disconnect() {
		// TODO make this work properly
		this.peer.destroy();
		this.socket.close();
	}
}
