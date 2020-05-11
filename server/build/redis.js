const { promisify } = require('util');
const redis = require('redis');
const cuid = require('cuid');
const logger = require('./logger');
const client = process.env.NODE_ENV === 'production'
    ? redis.createClient(process.env.REDIS_URL)
    : redis.createClient();
client.on('error', function (error) {
    logger.error('redis error', error);
});
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);
const mset = promisify(client.mset).bind(client);
const smembers = promisify(client.smembers).bind(client);
const sadd = promisify(client.sadd).bind(client);
const srem = promisify(client.srem).bind(client);
const incr = promisify(client.incr).bind(client);
const rpush = promisify(client.rpush).bind(client);
const lset = promisify(client.lset).bind(client);
const lrange = promisify(client.lrange).bind(client);
const llen = promisify(client.llen).bind(client);
// const srem = promisify(client.srem).bind(client);
export async function getPeers(roomId) {
    return await smembers(`rooms:${roomId}:peers`);
}
export async function addPeer(roomId, peerId) {
    return await sadd(`rooms:${roomId}:peers`, peerId);
}
export async function removePeer(roomId, peerId) {
    return await srem(`rooms:${roomId}:peers`, peerId);
}
export function cleanupPeer(roomId, peerId) {
    return new Promise((resolve, reject) => {
        redis
            .multi()
            .srem(`rooms:${roomId}:peers`, peerId)
            .srem(`rooms:${roomId}:peers-in-call`, peerId)
            .exec((err, result) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
export async function getPeersInCall(roomId) {
    return await smembers(`rooms:${roomId}:peers-in-call`);
}
export async function addPeerToCall(roomId, peerId) {
    return await sadd(`rooms:${roomId}:peers-in-call`, peerId);
}
export async function removePeerFromCall(roomId, peerId) {
    return await srem(`rooms:${roomId}:peers-in-call`, peerId);
}
export async function saveSpotifyLoginId(loginId, originRoomId) {
    // Key will expire in 30 minutes, after which the user will have
    // to restart authentication, if they haven't completed already
    return await set(`spotify:${loginId}`, originRoomId, 'EX', 60 * 30);
}
export async function getOriginRoomForLoginId(loginId) {
    return await get(`spotify:${loginId}`);
}
export async function removeSpotifyLoginId(loginId) {
    return await del(`spotify:${loginId}`);
}
export async function isValidSpotifyLoginId(loginId) {
    const result = await get(`spotify:${loginId}`);
    return !!result;
}
export async function getQueue(roomId) {
    const jsonArray = await lrange(`rooms:${roomId}:spotify-queue`, 0, -1);
    return jsonArray.map((json) => JSON.parse(json));
}
export async function getQueueAtIndex(roomId, index = 0) {
    const jsonArray = await lrange(`rooms:${roomId}:spotify-queue`, index, index);
    return jsonArray.map((json) => JSON.parse(json))[0];
}
export async function getQueueLength(roomId) {
    return await llen(`rooms:${roomId}:spotify-queue`);
}
export async function addItemToQueue(roomId, queueItem) {
    return await rpush(`rooms:${roomId}:spotify-queue`, JSON.stringify(queueItem));
}
export function removeFromQueueAtIndex(roomId, index) {
    return new Promise((resolve, reject) => {
        client
            .multi([
            ['lset', `rooms:${roomId}:spotify-queue`, index, 'DELETED'],
            ['lrem', `rooms:${roomId}:spotify-queue`, 0, 'DELETED']
        ])
            .exec((err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
export async function getPlaybackState(roomId) {
    const json = await get(`rooms:${roomId}:spotify:playback-state`);
    return JSON.parse(json);
}
export async function setPlaybackState(roomId, playbackState) {
    await set(`rooms:${roomId}:spotify:playback-state`, JSON.stringify(playbackState));
}
export async function deletePlaybackState(roomId) {
    await del(`rooms:${roomId}:spotify:playback-state`);
}
//# sourceMappingURL=redis.js.map