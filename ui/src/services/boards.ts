/**
 * Boards are this and that bla blab la
 * @packageDocumentation
 */

import EventBus from 'eev';

import { createSpotifyClient, SpotifyClient, Track } from '@/services/spotify';
import cuid from 'cuid';

/**
 * The data format, that the API server returns via the socket connection.
 */
interface ServerResponse {
	/**
	 * Optional error that may have been emitted.
	 */
	error?: string;

	/**
	 * Key-value based data that got returned.
	 */
	[key: string]: any;
}

/**
 * An abstract board, used to hold functionality and server communication for a given board.
 */
export abstract class Board<StateType extends BoardState> {
	/**
	 * The API server socket (connection handled by {@link RoomClient})
	 */
	socket: SocketIOClient.Socket;

	/**
	 * The internal event bus used to handle callbacks.
	 */
	bus: EventBus;

	/**
	 * The boards reactive state object.
	 */
	state!: StateType;

	protected constructor(socket: SocketIOClient.Socket) {
		this.socket = socket;
		this.bus = new EventBus();
	}

	setState(state: Partial<StateType>) {
		this.state = {
			...this.state,
			...state
		};
		this.emitStateChange();
	}

	/**
	 * Setup a callback that's fired when the boards' state changed.
	 * @param callback
	 * @return Function to unbind the callback.
	 * @listens 'state-changed'
	 */
	onStateUpdate(callback: (state: StateType) => void): () => void {
		this.bus.on('state-changed', callback);

		return () => {
			this.bus.off('state-changed', callback);
		};
	}

	/**
	 * Emit an event to the API server with given data, and wait for a response.
	 * @param event The event name to send.
	 * @param data The event data
	 */
	protected async emitWithResponse(
		event: string,
		data: object = {}
	): Promise<ServerResponse> {
		return new Promise((resolve, reject) => {
			this.socket.emit(event, data, (data: ServerResponse) => {
				if (data.error) {
					reject(new Error(data.error));
				} else {
					resolve(data);
				}
			});
		});
	}

	/**
	 * Emits a state change on the internal bus, and causes callbacks created with onStateUpdate to fire.
	 * @emits 'state-changed'
	 */
	protected emitStateChange() {
		this.bus.emit('state-changed', this.state);
	}
}

export enum SpotifyReadyState {
	unauthenticated,
	loading,
	ready
}

export interface QueueItem {
	id: string;
	track: { uri: string; length: number };
}

export interface BoardState {}

export function emptySpotifyBoardState(): SpotifyBoardState {
	return {
		spotifyStatus: SpotifyReadyState.loading,
		queue: [],
		trackCache: {},
		userWantsPlayback: false,
		remotePlaybackState: null,
		localPlayerState: null

		// DEBUG
		/*currentTrack: {
			uri: 'spotify:track',
			name: 'Superstition',
			duration_ms: 300000,
			artists: [
				{
					id: '',
					name: 'Stevie Wonder'
				}
			],
			album: {
				id: '',
				name: 'Shit',
				images: [
					{
						width: 0,
						height: 0,
						url: ''
					}
				]
			}
		}*/
	};
}

export interface RemotePlaybackState {
	id: string;
	queueId: string;
	startedAt: number;
	track: {
		uri: string;
		length: number;
	};
}

export interface LocalPlayerState {
	/** The progressed time of the song in milliseconds. */
	progressMs: number;
	currentTrack: Track;
}

export interface SpotifyBoardState extends BoardState {
	spotifyStatus: SpotifyReadyState;
	queue: QueueItem[];
	trackCache: { [key: string]: Track };

	userWantsPlayback: boolean;

	remotePlaybackState: RemotePlaybackState | null;
	localPlayerState: LocalPlayerState | null;
}
/**
 * The Spotify Board.
 */
export class SpotifyBoard extends Board<SpotifyBoardState> {
	state: SpotifyBoardState = emptySpotifyBoardState();

	/**
	 * The Spotify client we use to update our playlist.
	 */
	spotify?: SpotifyClient;

	/**
	 * The id of the setInterval timer to tick the seconds.
	 */
	secondTimerIntervalId?: number;

	constructor(socket: SocketIOClient.Socket) {
		super(socket);

		// When the queue changes server-side, update it locally
		this.socket.on(
			'spotify:queue-changed',
			(data: { queue: QueueItem[] }) => this.updateQueue(data.queue)
		);

		// When the playback changes server-side, update it locally
		this.socket.on(
			'spotify:playback-changed',
			async (data: { playback: RemotePlaybackState | undefined }) => {
				if (data.playback) {
					const playback = data.playback;

					this.setState({
						remotePlaybackState: playback
					});

					const currentTrack =
						this.state.trackCache[playback.track.uri] ||
						(await this.spotify?.getTrack(playback.track.uri));

					this.setState({
						localPlayerState: {
							currentTrack,
							progressMs: Math.abs(
								Date.now() - playback.startedAt
							)
						}
					});

					if (this.secondTimerIntervalId)
						clearInterval(this.secondTimerIntervalId);

					this.secondTimerIntervalId = setInterval(() => {
						const localPlayerState = this.state.localPlayerState;
						if (localPlayerState) {
							this.setState({
								localPlayerState: {
									...localPlayerState,
									progressMs: Math.abs(
										Date.now() - playback.startedAt
									)
								}
							});
						} else {
							clearInterval(this.secondTimerIntervalId);
							this.secondTimerIntervalId = undefined;
						}
					}, 1000);
				} else {
					this.setState({
						remotePlaybackState: undefined,
						localPlayerState: undefined
					});
				}
			}
		);

		(async () => {
			try {
				this.spotify = await createSpotifyClient();
				// this changes when spotify's own playback state changes
				// this.spotify.onPlaybackStateChanged(
				// 	async (spotifyPlaybackState: PlaybackState) => {
				// 		if (spotifyPlaybackState.paused) {
				// 			// await this.stopRemotePlayback();
				// 			// this.setState({
				// 			// 	playbackState: undefined,
				// 			// 	spotifyPlaybackState: undefined
				// 			// });
				// 			this.setState({
				// 				spotifyPlaybackState: undefined
				// 			});
				// 		} else {
				// 			this.setState({
				// 				spotifyPlaybackState
				// 			});
				// 		}
				// 	}
				// );
				this.setState({
					spotifyStatus: SpotifyReadyState.ready
				});

				await this.refetchQueue();
			} catch (e) {
				console.error(e);
				this.setState({
					spotifyStatus: SpotifyReadyState.unauthenticated
				});
			}
		})();
	}

	/**
	 * Refetch the queue list from the API server.
	 */
	protected async refetchQueue() {
		const data = await this.emitWithResponse('spotify:get-queue');

		if (data.queue) await this.updateQueue(data.queue);
	}

	/**
	 * Refetch the track data for the current queue from Spotify.
	 *
	 * @remarks
	 * Note: this function may be called when the queue Spotify playlist still holds stale track data from a
	 * previous SAUF.CHAT session.
	 */
	protected async refetchPlaylist() {
		if (!this.spotify) throw new Error('Spotify client not ready');

		const playlistId = await this.spotify.getPlaylistId();
		const tracks = await this.spotify.getPlaylistTracks(playlistId);

		for (const track of tracks) {
			this.state.trackCache[track.uri] = track;
		}

		this.emitStateChange();
	}

	/**
	 * Update the local queue state and save the queue songs in the Spotify playlist.
	 * @param queue
	 */
	protected async updateQueue(queue: QueueItem[]) {
		if (!this.spotify) throw new Error('Spotify client not ready');

		this.setState({
			queue
		});

		// If Spotify is ready by the time we updated the queue
		if (this.spotify) {
			const playlistId = await this.spotify.getPlaylistId();
			await this.spotify.setPlaylistTracks(
				playlistId,
				queue.map(item => item.track.uri) // Map QueueItems to Spotify track URIs
			);

			await this.refetchPlaylist();
		}
	}

	/**
	 * Add a track to the queue
	 * @param trackUri The track's uri
	 */
	async addTrack(trackUri: string) {
		if (!this.spotify) throw new Error('Spotify is not ready yet');

		const track: Track | undefined =
			this.state.trackCache[trackUri] ||
			(await this.spotify.getTrack(trackUri));

		if (!track) {
			throw new Error('Track not found');
		}

		await this.emitWithResponse('spotify:add-track', {
			trackUri,
			length: track.duration_ms
		});
	}

	/**
	 * Remove a track from the queue.
	 * @param index The index to remove from the queue
	 */
	async removeTrack(index: number) {
		await this.emitWithResponse('spotify:remove-track', { index });
	}

	/**
	 * Synchronize your Spotify playback to the server's playback state.
	 *
	 * If there currently is no server playback state, we start playback here.
	 */
	async syncPlayback() {
		if (!this.spotify) throw new Error('Spotify not ready');

		this.setState({ userWantsPlayback: true });

		let remotePlaybackState: RemotePlaybackState | null = this.state
			.remotePlaybackState;

		if (!remotePlaybackState) {
			try {
				const data = await this.emitWithResponse(
					'spotify:get-playback'
				);
				remotePlaybackState = data.playback;
			} catch (e) {
				console.error('error getting playback during join', e);
			}
		}

		if (!remotePlaybackState) {
			try {
				const data = await this.emitWithResponse(
					'spotify:start-playback',
					{
						startedAt: Date.now()
					}
				);
				remotePlaybackState = data.playback;
			} catch (e) {
				console.error('error starting playback during join', e);
			}
		}

		if (!remotePlaybackState)
			throw new Error('Playback could not be started');

		const offsetMs = Math.abs(
			Date.now() - (remotePlaybackState?.startedAt || 0)
		);

		const playlistId = await this.spotify.getPlaylistId();
		await this.spotify.startPlayback(
			`spotify:playlist:${playlistId}`,
			remotePlaybackState.track.uri,
			offsetMs
		);

		this.setState({
			remotePlaybackState
		});
	}

	/**
	 * Leave the playback locally. The playback on the server keep's running.
	 */
	async leavePlayback() {
		this.setState({
			userWantsPlayback: false
		});

		await this.spotify?.pausePlayback();
	}

	/**
	 * Emit a stop-playback event to stop playback on the server.
	 * @emits 'spotify:stop-playback'
	 */
	async voteNextTrack(previousTrackUri: string, trackUri: string) {
		const playbackId = `PB-${cuid()}`;

		const response = await this.emitWithResponse('spotify:vote-next', {
			previousTrackUri,
			trackUri,
			playbackId,
			startedAt: Date.now()
		});

		if (!response.success) {
			throw new Error(
				`Could not start playback: couldn't create new playback state (${response.error})`
			);
		}

		return playbackId;
	}

	/**
	 * Emit a stop-playback event to stop playback on the server.
	 * @emits 'spotify:stop-playback'
	 */
	async stopRemotePlayback() {
		const response = await this.emitWithResponse('spotify:stop-playback');

		if (!response.success) {
			throw new Error(
				`Could not start playback: couldn't create new playback state (${response.error})`
			);
		}
	}
}
