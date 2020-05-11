import * as redis from '@/redis';
import logger from '@/logger';
import {
	IOResponse,
	UserError,
	createPlaybackState,
	createSkipTask,
	PlaybackSkipTask,
	SpotifyTrack,
	createQueueItem,
	createSpotifyTrack
} from './models';

export default function setupSpotifySocket(
	io: SocketIO.Server,
	socket: SocketIO.Socket,
	roomId: string,
	peerId: string
) {
	/**
	 * MODELS
	 *
	 * SpotifyTrack: { uri: <TrackURI>, length: <Track length> }
	 * QueueItem: { id: <Queue-ID>, track: SpotifyTrack }
	 * PlaybackState: { id: <Playback-ID>, queueId: QueueItem.id, startedAt: <Timestamp of playback start>, track: SpotifyTrack }
	 * PlaybackSkipTask { id: <Task-ID>, playbackId: <Playback-ID to skip (verification)>, roomId: <RoomID>, executeAt: <Timestamp when to skip> }
	 */

	/**
	 * ACTIONS
	 */

	/**
	 * Synchronize the spotify queue with all clients.
	 * @async
	 */
	const syncQueue = async () => {
		const queue = await redis.getQueue(roomId);

		io.to(roomId).emit('spotify:queue-changed', {
			queue
		});
	};

	/**
	 * Synchronize the current playback state with all clients.
	 * @async
	 */
	const syncPlayback = async () => {
		io.to(roomId).emit('spotify:playback-changed', {
			playback: await redis.getPlaybackState(roomId)
		});
	};

	/**
	 * Run actions safely by catching their errors and only outputting safe error messages.
	 * @param {Function} action The action function to execute safely.
	 * @param {Function} done The optional completion function.
	 * @param {string} message The error message displayed to the user, if no safe error message can be determined.
	 */
	const safeAction = async (
		action: CallableFunction,
		done = (message: IOResponse) => {},
		message: string = 'Internal Server Error'
	) => {
		try {
			// Run our action
			const result = (await action()) || {};

			done({ ok: true, ...result });
		} catch (e) {
			logger.error(`Safe Action: ${message}, Error: `, e);
			// UserError messages are safe to pass down to the user.
			// If we encounter a UserError we pass down the message to the user.
			// If the error is NOT a UserError, we play it safe and give an Internal Server Error type message.
			// This message can be customized tho.
			if (e instanceof UserError) {
				done({ error: e.message });
			} else {
				done({ error: message });
			}
		}
	};

	/**
	 * Set playback to the first track in the current queue.
	 *
	 * This function will also create a new SkipTask in order to skip to the next track in the queue
	 * once the one we are setting has ended.
	 *
	 * @param {string} roomId The room to do business with.
	 * @param {number} startedAt When the playback was started.
	 */
	async function playFirstTrackInQueue(roomId: string, startedAt: number) {
		const nextQueueItem = await redis.getQueueAtIndex(roomId, 0);

		if (!nextQueueItem) {
			throw new UserError('The queue is empty');
		}

		// We calculate the executeAt here, because the redis communication will introduce delay
		const executeSkipAt = Date.now() + nextQueueItem.track.length;

		const playbackState = createPlaybackState(nextQueueItem, startedAt);
		await redis.setPlaybackState(roomId, playbackState);
		await syncPlayback();

		const skipTask = createSkipTask(playbackState, roomId, executeSkipAt);

		// Proper:
		// Push skip task to worker queue in redis
		// Let worker handle the requests

		// Right now:
		// We let the API instance that received the initial 'new-playback' event to the job
		// by using setTimeout instead. Doesn't scale well though but should be fine for now.

		const executeIn = Math.abs(Date.now() - skipTask.executeAt);
		logger.info(
			`Spotify skip task scheduled in ${
				executeIn / 1000
			}s, SkipTask ${JSON.stringify(skipTask)}`
		);

		const timeoutId = setTimeout(async () => {
			try {
				await runSkipTask(skipTask);
			} catch (e) {
				logger.error(`Spotify skip task error. Error `, e);
			}
		}, executeIn);

		return playbackState;
	}

	/**
	 * Run a SkipTask.
	 * @param {SkipTask} skipTask
	 */
	async function runSkipTask(skipTask: PlaybackSkipTask) {
		logger.info(`Spotify skip task. Task: ${JSON.stringify(skipTask)}`);

		const playbackState = await redis.getPlaybackState(skipTask.roomId);

		// If the playback is not the one we should have skipped, close worker
		if (playbackState && playbackState.id !== skipTask.playbackId) {
			throw new Error(
				'We already have a different thing playing, not skipping'
			);
		}

		// Remove currently playing song from queue
		await redis.removeFromQueueAtIndex(skipTask.roomId, 0);
		await syncQueue();

		// We could simply create a new startedAt time here by just using Date.now().
		// However, by taking the previous startedAt time and add the track length to it
		// we get a more accurate one, as this worker function may not be executed EXACTLY on skip time.
		const startedAt = playbackState.startedAt + playbackState.track.length;

		try {
			await playFirstTrackInQueue(skipTask.roomId, startedAt);
		} catch (e) {
			// If the task above fails, we want to make sure we clear out the playback state
			await stopPlayback();

			logger.error(
				`Spotify could not play first track in queue after skip task`,
				e
			);
			// throw e;
		}
	}

	/**
	 * Delete the current playback state.
	 */
	async function stopPlayback() {
		logger.info(`Spotify stop playback. RoomID ${roomId}`);
		await redis.deletePlaybackState(roomId);
		await syncPlayback();
	}

	/**
	 * Adds a track to the room's queue.
	 * @param {SpotifyTrack} track The track to add.
	 */
	async function addTrackToQueue(track: SpotifyTrack) {
		const queueLength = await redis.getQueueLength(roomId);
		if (queueLength >= 100) {
			throw new UserError(
				'No more than 100 songs can be added to a queue'
			);
		}

		const queueItem = createQueueItem(track);

		await redis.addItemToQueue(roomId, queueItem);
		await syncQueue();
	}

	/**
	 * Remove a {@link QueueItem} at the given index from the queue.
	 * @param {number} index The index to remove.
	 */
	async function removeQueueItemAtIndex(index: number) {
		if (index === null || index < 0) {
			throw new UserError('Invalid Index');
		}

		await redis.removeFromQueueAtIndex(roomId, index);
		await syncQueue();
	}

	/*
	 * SOCKET ROUTES
	 */
	// Queue Routes
	socket.on(
		'spotify:get-queue',
		async (_data: any, done: (message: IOResponse) => void) => {
			logger.http(
				`Spotify get queue. RoomID: ${roomId}, PeerID: ${peerId}`
			);

			safeAction(
				async () => {
					const queue = await redis.getQueue(roomId);
					return {
						queue
					};
				},
				done,
				'Could not fetch queue'
			);
		}
	);

	socket.on('spotify:add-track', async ({ trackUri, length }, done) => {
		logger.http(
			`Spotify add track. RoomID: ${roomId}, PeerID: ${peerId}, TrackURI: ${trackUri} Length: ${length}`
		);

		safeAction(
			async () => {
				if (!trackUri || !length) {
					throw new UserError('Track not found');
				}

				const track = createSpotifyTrack(trackUri, length);
				await addTrackToQueue(track);
			},
			done,
			'Could not add track'
		);
	});

	socket.on('spotify:remove-track', async ({ index }, done) => {
		logger.http(
			`Spotify remove track. RoomID: ${roomId}, PeerID: ${peerId}, Index: ${index}`
		);

		safeAction(
			async () => {
				await removeQueueItemAtIndex(index);
			},
			done,
			'Could not add track'
		);
	});

	// Playback Routes

	// Get the current playback information
	socket.on('spotify:get-playback', async (data, done) => {
		logger.http(
			`Spotify get playback. RoomID: ${roomId}, PeerID: ${peerId}`
		);

		safeAction(
			async () => {
				return {
					playback: await redis.getPlaybackState(roomId)
				};
			},
			done,
			'Could not get playback'
		);
	});

	// Called when there's not current playback, and the user started it.
	socket.on('spotify:start-playback', async ({ startedAt }, done) => {
		logger.http(
			`Spotify new playback. RoomID: ${roomId}, PeerID: ${peerId}, Data: ${JSON.stringify(
				{ startedAt }
			)}`
		);

		safeAction(
			async () => {
				const currentPlayback = await redis.getPlaybackState(roomId);

				if (currentPlayback) {
					throw new UserError('Playback ongoing');
				}

				return {
					playback: await playFirstTrackInQueue(
						roomId,
						startedAt || Date.now()
					)
				};
			},
			done,
			'Could not start playback'
		);
	});

	socket.on('spotify:stop-playback', async (data, done) => {
		logger.http(
			`Spotify stop playback. RoomID: ${roomId}, PeerID: ${peerId}`
		);

		safeAction(
			async () => {
				await stopPlayback();
			},
			done,
			'Could not start playback'
		);
	});

	// Sync Queue and playback with client so they're up to date
	syncQueue();
	syncPlayback();
}
