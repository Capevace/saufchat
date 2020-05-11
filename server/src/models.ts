import cuid from 'cuid';

/**
 * MODELS
 *
 * SpotifyTrack: { uri: <TrackURI>, length: <Track length> }
 * QueueItem: { id: <Queue-ID>, track: SpotifyTrack }
 * PlaybackState: { id: <Playback-ID>, queueId: QueueItem.id, startedAt: <Timestamp of playback start>, track: SpotifyTrack }
 * PlaybackSkipTask { id: <Task-ID>, playbackId: <Playback-ID to skip (verification)>, roomId: <RoomID>, executeAt: <Timestamp when to skip> }
 */

export interface IOResponse {
	[key: string]: any;
	error?: string;
}

export interface SpotifyTrack {
	uri: string;
	length: number;
}

/**
 * Create a new {@link SpotifyTrack}
 * @param {string} uri The Spotify track URI.
 * @param {number} length The tracks length in ms.
 * @returns {SpotifyTrack}
 */
export function createSpotifyTrack(uri: string, length: number) {
	return {
		uri,
		length
	};
}

export interface QueueItem {
	id: string;
	track: SpotifyTrack;
}

/**
 * Create a new {@link QueueItem}
 * @param {SpotifyTrack} track The Spotify track in queue.
 * @returns {QueueItem}
 */
export function createQueueItem(track: SpotifyTrack) {
	return {
		id: `Q-${cuid()}`,
		track
	};
}

export interface PlaybackState {
	id: string;
	queueId: QueueItem['id'];
	track: SpotifyTrack;
	startedAt: number;
}

/**
 * Create a new {@link PlaybackState}
 * @param {QueueItem} queueItem The QueueItem to play.
 * @param {number} startedAt The timestamp when the playback was started.
 * @returns {PlaybackState}
 */
export function createPlaybackState(queueItem: QueueItem, startedAt: number) {
	return {
		id: `PB-${cuid()}`,
		queueId: queueItem.id,
		startedAt,
		track: queueItem.track
	};
}

export interface PlaybackSkipTask {
	id: string;
	playbackId: PlaybackState['id'];
	roomId: string;
	executeAt: number;
}

/**
 * Create a new {@link SkipTask}
 * @param {PlaybackState} playbackState The PlaybackState to skip.
 * @param {string} roomId The Room the playback state originates from.
 * @param {number} executeAt The timestamp of when to skip the playback state.
 * @returns {SkipTask}
 */
export function createSkipTask(
	playbackState: PlaybackState,
	roomId: string,
	executeAt: number
) {
	return {
		id: `ST-${cuid()}`,
		playbackId: playbackState.id,
		roomId,
		executeAt
	};
}

/**
 * A UserError is an error that has an error message which is safe to display to the user.
 */
export class UserError extends Error {}
