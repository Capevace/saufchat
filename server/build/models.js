import cuid from 'cuid';
/**
 * Create a new {@link SpotifyTrack}
 * @param {string} uri The Spotify track URI.
 * @param {number} length The tracks length in ms.
 * @returns {SpotifyTrack}
 */
export function createSpotifyTrack(uri, length) {
    return {
        uri,
        length
    };
}
/**
 * Create a new {@link QueueItem}
 * @param {SpotifyTrack} track The Spotify track in queue.
 * @returns {QueueItem}
 */
export function createQueueItem(track) {
    return {
        id: `Q-${cuid()}`,
        track
    };
}
/**
 * Create a new {@link PlaybackState}
 * @param {QueueItem} queueItem The QueueItem to play.
 * @param {number} startedAt The timestamp when the playback was started.
 * @returns {PlaybackState}
 */
export function createPlaybackState(queueItem, startedAt) {
    return {
        id: `PB-${cuid()}`,
        queueId: queueItem.id,
        startedAt,
        track: queueItem.track
    };
}
/**
 * Create a new {@link SkipTask}
 * @param {PlaybackState} playbackState The PlaybackState to skip.
 * @param {string} roomId The Room the playback state originates from.
 * @param {number} executeAt The timestamp of when to skip the playback state.
 * @returns {SkipTask}
 */
export function createSkipTask(playbackState, roomId, executeAt) {
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
export class UserError extends Error {
}
//# sourceMappingURL=models.js.map