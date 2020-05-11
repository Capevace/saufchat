import Vue from 'vue';
import Vuex from 'vuex';
import { SpotifyBoardState, emptySpotifyBoardState } from '@/services/boards';
import {
	ReactiveRoomState,
	emptyReactiveRoomState,
	RoomClient
} from '@/services/room';
import localPeerId from '@/services/peer-id';
import { Track } from '@/services/spotify';

Vue.use(Vuex);

let roomClient: RoomClient | null = null;

export interface AppState {
	spotify: SpotifyBoardState;
	room: ReactiveRoomState;
	peerId: string;
	roomId: string | null;
}

const store = new Vuex.Store<AppState>({
	state: {
		spotify: emptySpotifyBoardState(),
		room: emptyReactiveRoomState(),
		roomId: null,
		peerId: localPeerId
	},
	mutations: {
		setRoomState(
			state: AppState,
			payload: { roomState: ReactiveRoomState }
		) {
			state.room = { ...payload.roomState };

			const currentKeys = Object.keys(state.room.calls);
			const newKeys = Object.keys(payload.roomState.calls);
			const addedCalls = newKeys.filter(
				key => !currentKeys.includes(key)
			);
			const removedCalls = currentKeys.filter(
				key => !newKeys.includes(key)
			);

			for (const peerId of addedCalls) {
				Vue.set(
					state.room.calls,
					peerId,
					payload.roomState.calls[peerId]
				);
			}

			for (const peerId of removedCalls) {
				Vue.delete(state.room.calls, peerId);
			}
		},

		setSpotifyState(
			state: AppState,
			payload: { spotifyState: SpotifyBoardState }
		) {
			state.spotify = {
				...payload.spotifyState
			};

			const currentKeys = Object.keys(state.spotify.trackCache);
			const newKeys = Object.keys(payload.spotifyState.trackCache);
			const addedUris = newKeys.filter(key => !currentKeys.includes(key));
			const removedUris = currentKeys.filter(
				key => !newKeys.includes(key)
			);

			for (const uri of addedUris) {
				Vue.set(
					state.spotify.trackCache,
					uri,
					payload.spotifyState.trackCache[uri]
				);
			}

			for (const uri of removedUris) {
				Vue.delete(state.spotify.trackCache, uri);
			}
		},

		setRoomId(state: AppState, payload: { roomId: string }) {
			state.roomId = payload.roomId;
		},

		setLocalPlayerProgress(state, payload: { progressMs: number }) {
			if (state.spotify.localPlayerState) {
				state.spotify.localPlayerState.progressMs = payload.progressMs;
			}
		}
	},
	actions: {
		connectToRoom(context, payload: { roomId: string }) {
			if (roomClient) {
				roomClient.disconnect();
			}

			context.commit<Commit>({
				type: 'setRoomId',
				roomId: payload.roomId
			});
			context.commit<Commit>({
				type: 'setRoomState',
				roomState: emptyReactiveRoomState()
			});
			context.commit<Commit>({
				type: 'setSpotifyState',
				spotifyState: emptySpotifyBoardState()
			});

			roomClient = new RoomClient(payload.roomId);
			roomClient.onStateUpdate(state => {
				// Remove the call to ourselves in case theere is one
				// To be honest I don't know why this is here but it keeps it working
				// Should probably find the root of this problem soon, but i GOT SHIT TO DO
				if (state.calls[context.state.peerId])
					delete state.calls[context.state.peerId];

				context.commit<Commit>({
					type: 'setRoomState',
					roomState: state
				});
			});

			roomClient.boards.spotify.onStateUpdate(
				(state: SpotifyBoardState) => {
					// For some reason the spotify state property won't update automatically. Probably due to Typescript,
					// but I don't know. Just leave the $forceUpdate here and also "recreate" the object when passing it
					// in props like this: { queue: this.spotifyState.queue, ... }
					// See spotify-board component for implementation details.

					context.commit<Commit>({
						type: 'setSpotifyState',
						spotifyState: state
					});

					// this.$forceUpdate();
				}
			);
		},

		joinCall() {
			if (roomClient) {
				roomClient.joinCall();
			} else {
				console.warn('Store dispatched to join call with no room');
			}
		},

		addTrackToQueue(context, payload: { uri: string }) {
			if (roomClient) {
				roomClient.boards.spotify.addTrack(payload.uri);
			} else {
				console.warn(
					'Store dispatched to add track to queue with no room'
				);
			}
		},

		syncPlayback() {
			if (roomClient) {
				roomClient.boards.spotify.syncPlayback();
			} else {
				console.warn('Store dispatched to sync playback with no room');
			}
		},

		leavePlayback() {
			if (roomClient) {
				roomClient.boards.spotify.leavePlayback();
			} else {
				console.warn('Store dispatched to leave playback with no room');
			}
		},

		leaveRoom(context) {
			if (roomClient) {
				roomClient.disconnect();
				roomClient = null;

				context.commit<Commit>({
					type: 'setRoomId',
					roomId: null
				});
				context.commit<Commit>({
					type: 'setRoomState',
					roomState: emptyReactiveRoomState()
				});
				context.commit<Commit>({
					type: 'setSpotifyState',
					spotifyState: emptySpotifyBoardState()
				});
			} else {
				console.warn(
					'Store dispatched to leave room with no room present'
				);
			}
		}
	},
	modules: {}
});

export type SetSpotifyStateCommit = {
	type: 'setSpotifyState';
	spotifyState: SpotifyBoardState;
};

export type SetRoomStateCommit = {
	type: 'setRoomState';
	roomState: ReactiveRoomState;
};

export type SetRoomIdCommit = {
	type: 'setRoomId';
	roomId: string | null;
};

export type SetTrackCacheCommit = {
	type: 'setTrackCache';
	trackCache: { [key: string]: Track };
};

export type Commit =
	| SetSpotifyStateCommit
	| SetRoomStateCommit
	| SetRoomIdCommit
	| SetTrackCacheCommit;

export type ConnectToRoomAction = {
	type: 'connectToRoom';
	roomId: string;
};

export type JoinCallAction = {
	type: 'joinCall';
};

export type AddTrackToQueueAction = {
	type: 'addTrackToQueue';

	/**
	 * The Spotify TrackURI to add to the queue.
	 */
	uri: string;
};

export type SyncPlaybackAction = {
	type: 'syncPlayback';
};

export type LeavePlaybackAction = {
	type: 'leavePlayback';
};

export type LeaveRoomAction = {
	type: 'leaveRoom';
};

export type Action =
	| ConnectToRoomAction
	| JoinCallAction
	| AddTrackToQueueAction
	| SyncPlaybackAction
	| LeavePlaybackAction
	| LeaveRoomAction;

export default store;
