import { QueueItem, PlaybackState } from './models';

const { promisify } = require('util');
const redis = require('redis');
const cuid = require('cuid');
const logger = require('./logger');

const client =
	process.env.NODE_ENV === 'production'
		? redis.createClient(process.env.REDIS_URL)
		: redis.createClient();

client.on('error', function (error: any) {
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

export async function getPeers(roomId: string): Promise<string[]> {
	return await smembers(`rooms:${roomId}:peers`);
}

export async function addPeer(roomId: string, peerId: string) {
	return await sadd(`rooms:${roomId}:peers`, peerId);
}
export async function removePeer(roomId: string, peerId: string) {
	return await srem(`rooms:${roomId}:peers`, peerId);
}

export function cleanupPeer(roomId: string, peerId: string) {
	return new Promise((resolve, reject) => {
		redis
			.multi()
			.srem(`rooms:${roomId}:peers`, peerId)
			.srem(`rooms:${roomId}:peers-in-call`, peerId)
			.exec((err: Error, result: any) => {
				if (err) reject(err);
				else resolve();
			});
	});
}

export async function getPeersInCall(roomId: string): Promise<string[]> {
	return await smembers(`rooms:${roomId}:peers-in-call`);
}
export async function addPeerToCall(roomId: string, peerId: string) {
	return await sadd(`rooms:${roomId}:peers-in-call`, peerId);
}
export async function removePeerFromCall(roomId: string, peerId: string) {
	return await srem(`rooms:${roomId}:peers-in-call`, peerId);
}

export async function saveSpotifyLoginId(
	loginId: string,
	originRoomId: string
) {
	// Key will expire in 30 minutes, after which the user will have
	// to restart authentication, if they haven't completed already
	return await set(`spotify:${loginId}`, originRoomId, 'EX', 60 * 30);
}
export async function getOriginRoomForLoginId(
	loginId: string
): Promise<string> {
	return await get(`spotify:${loginId}`);
}
export async function removeSpotifyLoginId(loginId: string) {
	return await del(`spotify:${loginId}`);
}
export async function isValidSpotifyLoginId(loginId: string): Promise<boolean> {
	const result = await get(`spotify:${loginId}`);

	return !!result;
}

export async function getQueue(roomId: string): Promise<QueueItem[]> {
	const jsonArray = await lrange(`rooms:${roomId}:spotify-queue`, 0, -1);
	return jsonArray.map((json: string) => JSON.parse(json) as QueueItem);
}
export async function getQueueAtIndex(
	roomId: string,
	index: number = 0
): Promise<QueueItem> {
	const jsonArray = await lrange(
		`rooms:${roomId}:spotify-queue`,
		index,
		index
	);
	return jsonArray.map((json: string) => JSON.parse(json))[0];
}
export async function getQueueLength(roomId: string): Promise<number> {
	return await llen(`rooms:${roomId}:spotify-queue`);
}
export async function addItemToQueue(roomId: string, queueItem: QueueItem) {
	return await rpush(
		`rooms:${roomId}:spotify-queue`,
		JSON.stringify(queueItem)
	);
}
export function removeFromQueueAtIndex(roomId: string, index: number) {
	return new Promise((resolve, reject) => {
		client
			.multi([
				['lset', `rooms:${roomId}:spotify-queue`, index, 'DELETED'],
				['lrem', `rooms:${roomId}:spotify-queue`, 0, 'DELETED']
			])
			.exec((err: Error) => {
				if (err) reject(err);
				else resolve();
			});
	});
}

export async function getPlaybackState(roomId: string): Promise<PlaybackState> {
	const json = await get(`rooms:${roomId}:spotify:playback-state`);
	return JSON.parse(json) as PlaybackState;
}
export async function setPlaybackState(
	roomId: string,
	playbackState: PlaybackState
) {
	await set(
		`rooms:${roomId}:spotify:playback-state`,
		JSON.stringify(playbackState)
	);
}
export async function deletePlaybackState(roomId: string) {
	await del(`rooms:${roomId}:spotify:playback-state`);
}
