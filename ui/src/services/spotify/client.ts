/**
 * Example Spotify Track: spotify:track:6wudfBRydM7LyUHpEtZz7C
 */
import EventBus from 'eev';

import {
	checkForSpotifyTokens,
	SpotifyTokens,
	saveSpotifyTokens
} from './auth';
import { API_URL } from '@/config';

import PlaybackStateListener = Spotify.PlaybackStateListener;

// / <reasference types="spotify-web-playback-sdk" />

const PLAYLIST_NAME = 'SAUF.CHAT – Queue';
const PLAYLIST_DESCRIPTION =
	'This playlist was automagically generated because you used enabled Spotify in SAUF.CHAT! Feel free to delete the playlist – it will be recreated next time you use SAUF.CHAT!';

export class SpotifyClient {
	/**
	 * The internal event bus.
	 */
	bus: EventBus = new EventBus();

	/**
	 * The Spotify auth tokens.
	 */
	tokens: SpotifyTokens;

	/**
	 * The Spotify Player Instance.
	 */
	player?: Spotify.SpotifyPlayer;

	/**
	 * Latest {@link Spotify.Player} playback state
	 */
	playback?: Spotify.PlaybackState;

	/**
	 * The queue playlistId. **Using this variable directly does not guarantee it will be available.**
	 * Use {@link SpotifyClient.getPlaylistId} instead.
	 */
	protected playlistId: string | null = null;

	/**
	 * The {@link Spotify.Player} device ID.
	 */
	protected playerDeviceId?: string;

	constructor(tokens: SpotifyTokens) {
		this.tokens = tokens;

		// Fetch the playlist ID in the BG.
		// (async () => {
		// 	this.playlistId = await this.getPlaylistId();
		// })()

		// Called when the Spotify Playback SDK is finished.
		// @ts-ignore
		window.SAUF_onSpotifyReady(this.setupSpotifyPlayer.bind(this));
	}

	protected async setupSpotifyPlayer() {
		this.player = new window.Spotify.Player({
			name: 'SAUF.CHAT',
			volume: 1,
			getOAuthToken: (cb: (token: string) => void): void => {
				cb(this.tokens.accessToken);
			}
		});
		this.player.addListener(
			'player_state_changed',
			(playback: Spotify.PlaybackState) => {
				console.info('playback', playback);
				this.bus.emit('playback-state-changed', playback);
			}
		);
		this.player.addListener('ready', (data: { device_id: string }) => {
			console.info('Successfully set up Spotify playback');
			this.playerDeviceId = data.device_id;
		});
		this.player.addListener('not_ready', (error: any) => {
			console.error('Could not set up Spotify', error);
		});
		this.player.addListener('initialization_error', (data: any) => {
			console.error('Failed to initialize', data);
		});
		this.player.addListener('authentication_error', (data: any) => {
			console.error('Failed to authenticate', data);
		});
		this.player.addListener('account_error', (data: any) => {
			console.error('Failed to account', data);
		});
		this.player.addListener('playback_error', (data: any) => {
			console.error('Failed to playback', data);
		});

		await this.player.connect();
	}

	onPlaybackStateChanged(callback: PlaybackStateListener): () => void {
		this.bus.on('playback-state-changed', callback);

		return () => {
			this.bus.off('playback-state-changed', callback);
		};
	}

	async getPlaylistId(): Promise<string> {
		if (this.playlistId) return this.playlistId;

		const storedPlaylistId = localStorage.getItem('spotify-playlist-id');

		if (storedPlaylistId) {
			this.playlistId = storedPlaylistId;
			return storedPlaylistId;
		}

		// Fetch all playlists and find our playlist in there.
		// Due to Spotify limiting the max number of playlists you can fetch at a time,
		// we need to paginate through by using the 'next' value in the response as a link to the next page.
		let nextUrl: string | null = 'https://api.spotify.com/v1/me/playlists';
		while (this.playlistId === null && nextUrl !== null) {
			const {
				data: { items: playlists, next }
			}: SpotifyResponse<ListResponse<Playlist>> = await this.fetchRaw(
				nextUrl,
				{
					query: {
						limit: 50
					}
				}
			);

			// Go through all playlists and try to find the correct one
			for (const item of playlists) {
				if (item.name && item.id && item.name === PLAYLIST_NAME) {
					this.playlistId = item.id;
					break;
				}
			}

			if (!this.playlistId && next) {
				nextUrl = next;
			} else {
				nextUrl = null;
			}
		}

		// If we still have not found the playlist ID, create a new one
		if (!this.playlistId) {
			const {
				data: { id }
			} = await this.fetch<{ id: string }>(`me/playlists`, {
				method: 'post',
				body: {
					name: PLAYLIST_NAME,
					description: PLAYLIST_DESCRIPTION,
					public: false
				}
			});

			this.playlistId = id;
			localStorage.setItem('spotify-playlist-id', id);
			return id;
		} else {
			localStorage.setItem('spotify-playlist-id', this.playlistId);
			return this.playlistId;
		}
	}

	/**
	 * Set the songs in the Spotify queue playlist.
	 * @param playlistId The ID of the playlist to update.
	 * @param queue A queue of song ids.
	 */
	async setPlaylistTracks(playlistId: string, queue: string[]) {
		// fetch playlist\
		await this.fetch(`playlists/${playlistId}/tracks`, {
			ignoreResponse: true,
			method: 'put',
			body: {
				uris: queue
			}
		});
		// const playlistItems = await getFullPlaylist(playlistId);
		// const playlistIds = playlistItems.map(track => track.id);

		// const itemsToAdd = queue.filter(trackId => !playlistIds.includes(trackId));
		// const itemsToRemove = playlistIds.filter(trackId => !queue.includes(trackId));
		// check what needs to be changed
		//
	}

	/**
	 * Fetch the tracks of a playlist from the Spotify Web API.
	 * @param playlistId The id of the playlist
	 */
	async getPlaylistTracks(playlistId: string): Promise<Track[]> {
		let nextUrl:
			| string
			| null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
		let allItems: Track[] = [];
		while (nextUrl !== null) {
			const {
				data: { items, next }
			}: SpotifyResponse<ListResponse<{
				track: Track;
			}>> = await this.fetchRaw(nextUrl, {
				query: {
					fields:
						'items(track(uri, name, duration_ms, artists, album(id, images))), next',
					limit: 100
				}
			});

			allItems = allItems.concat(
				items.map((item: { track: object }) => item.track as Track)
			);

			nextUrl = next;
		}

		return allItems;
	}

	/**
	 * Search for tracks in Spotify.
	 * @param query The search query
	 */
	async search(query: string): Promise<Track[]> {
		const {
			data: {
				tracks: { items }
			}
		}: SpotifyResponse<{ tracks: { items: Track[] } }> = await this.fetch(
			'search',
			{
				query: {
					q: query,
					type: 'track',
					fields:
						'items(track(uri, name, duration_ms, artists, album(id, images))), next',
					limit: 50
				}
			}
		);

		return items;
	}

	/**
	 * Get a track by it's URI
	 * @param trackUri The track's URI
	 */
	async getTrack(trackUri: string, fields?: string): Promise<Track> {
		const { data: track }: SpotifyResponse<Track> = await this.fetch(
			`tracks/${trackUri.replace('spotify:track:', '')}`, // Spotify wants ID instead of URI here, confusing
			{
				query: {
					fields
				}
			}
		);

		return track;
	}

	/**
	 * Start playing a playlist at a specific track and time offset.
	 * @param playlistUri
	 */
	async startPlayback(
		playlistUri: string,
		offsetTrackUri: string,
		offsetMs: number
	) {
		// fetch playlist\
		await this.fetch(`me/player/play`, {
			ignoreResponse: true,
			method: 'put',
			body: {
				context_uri: playlistUri,
				offset: { uri: offsetTrackUri },
				position_ms: offsetMs
			},
			query: {
				// If for some reason the player id is not set, we let Spotify figure out the device to play on I guess
				device_id: this.playerDeviceId
			}
		});
		// const playlistItems = await getFullPlaylist(playlistId);
		// const playlistIds = playlistItems.map(track => track.id);

		// const itemsToAdd = queue.filter(trackId => !playlistIds.includes(trackId));
		// const itemsToRemove = playlistIds.filter(trackId => !queue.includes(trackId));
		// check what needs to be changed
		//
	}

	/**
	 * Pause
	 * @param playlistUri
	 */
	async pausePlayback() {
		// fetch playlist\
		await this.fetch(`me/player/pause`, {
			ignoreResponse: true,
			method: 'put',
			query: {
				// If for some reason the player id is not set, we let Spotify figure out the device to play on I guess
				device_id: this.playerDeviceId
			}
		});
		// const playlistItems = await getFullPlaylist(playlistId);
		// const playlistIds = playlistItems.map(track => track.id);

		// const itemsToAdd = queue.filter(trackId => !playlistIds.includes(trackId));
		// const itemsToRemove = playlistIds.filter(trackId => !queue.includes(trackId));
		// check what needs to be changed
		//
	}

	/**
	 * Fetch a Spotify endpoint, authenticated with the classes SpotifyTokens.
	 * @param endpoint The endpoint to load.
	 * @param options The options to pass into the request.
	 * @async
	 *
	 * @example
	 * const { data: { id } } = await this.fetch<{ id: string }>(`me/playlists`, {
	 *      method: 'post',
	 *	    body: {
	 *		    name: PLAYLIST_NAME,
	 *			description: PLAYLIST_DESCRIPTION,
	 *			public: false,
	 *		},
	 *	});
	 */
	async fetch<DataType>(
		endpoint: string,
		options: Partial<SpotifyFetchOptions>
	): Promise<SpotifyResponse<DataType>> {
		return await this.fetchRaw(
			`https://api.spotify.com/v1/${endpoint}`,
			options
		);
	}

	/**
	 * Fetch a raw URL, authenticated with the classes SpotifyTokens.
	 *
	 * Attention: No checking on the URL is done, only pass Spotify API calls here.
	 * Otherwise, your tokens may get leaked.
	 *
	 * @param rawUrl The raw URL to load.
	 * @param options The options to pass into the request.
	 * @async
	 *
	 * @example
	 * const { data: { id } } = await this.fetch<{ id: string }>(`me/playlists`, {
	 *      method: 'post',
	 *	    body: {
	 *		    name: PLAYLIST_NAME,
	 *			description: PLAYLIST_DESCRIPTION,
	 *			public: false,
	 *		},
	 *	});
	 */
	async fetchRaw<DataType>(
		rawUrl: string,
		options: Partial<SpotifyFetchOptions>
	): Promise<SpotifyResponse<DataType>> {
		try {
			return await spotifyFetch(this.tokens, rawUrl, options);
		} catch (e) {
			// If we get an unauthorized status, try to get new tokens with the refresh token
			if (e instanceof SpotifyAuthError) {
				// Start reauth flow
				console.info('Starting Spotify reauth flow');

				const newTokens = await this.tryReauth();
				return await spotifyFetch(newTokens, rawUrl, options);
			} else {
				// Got another error, pass it on
				throw e;
			}
		}
	}

	async tryReauth() {
		try {
			const reauthResult = await fetch(
				`${API_URL}/spotify/refresh-token`,
				{
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						refreshToken: this.tokens.refreshToken
					})
				}
			);

			const body = await reauthResult.json();

			if (body.error) {
				throw new SpotifyAuthError(body.error);
			}

			this.tokens = {
				accessToken: body.accessToken,
				refreshToken: this.tokens.refreshToken
			};

			// Save tokens to session storage
			saveSpotifyTokens(this.tokens);

			// Reset the Spotify.Player instance. (Required so it actually queries the new source)
			await this.setupSpotifyPlayer();

			return this.tokens;
		} catch (e) {
			console.error('Error occurred refreshing access token', e);

			// Auth Errors have messages that are safe to show to the user
			if (e instanceof SpotifyAuthError) throw e;

			// All other errors are only shown in the console
			throw new SpotifyAuthError(
				`Can't refresh access token. Please login again.`
			);
		}
	}
}

/**
 * Check for Spotify tokens and create a Spotify client if found.
 */
export async function createSpotifyClient(): Promise<SpotifyClient> {
	console.info('Setting up Spotify');
	const tokens = await checkForSpotifyTokens();

	if (tokens) {
		console.info('Successfully authenticated Spotify!');
		return new SpotifyClient(tokens);
	}

	console.info('No Spotify auth available');
	throw new Error('No tokens found.');
}

/**
 * Types
 */

export interface Playlist {
	id: string;
	name: string;
}

export interface Track {
	duration_ms: number;
	uri: string;
	name: string;
	artists: Artist[];
	album: Album;
}

export interface Artist {
	id: string;
	name: string;
}

export interface Album {
	id: string;
	name: string;
	images: AlbumImage[];
}

export interface AlbumImage {
	width: number;
	height: number;
	url: string;
}

interface SpotifyFetchOptions {
	ignoreResponse: boolean;
	query: {
		[key: string]: any;
	};
	body: object;
	headers: object;
	method: string;
}

interface SpotifyResponse<DataType> {
	response: Response;
	data: DataType;
}

interface ListResponse<ItemType> {
	items: ItemType[];
	next: string | null;
}

async function spotifyFetch<DataType>(
	tokens: SpotifyTokens,
	rawUrl: string,
	options: Partial<SpotifyFetchOptions>
): Promise<SpotifyResponse<DataType>> {
	try {
		options = {
			ignoreResponse: false,
			...options
		};
		const url = new URL(rawUrl);

		// Build the query string
		for (const key in options.query) {
			url.searchParams.append(key, options.query[key]);
		}

		delete options.query;

		const response = await fetch(url.toString(), {
			...options,
			body: options.body ? JSON.stringify(options.body) : null,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${tokens.accessToken}`,
				...options.headers
			}
		});

		if (options.ignoreResponse) {
			return { response, data: {} as DataType };
		}

		const json = await response.json();

		if (json.error && json.error.status === 401) {
			// Handle Auth error
			throw new SpotifyAuthError(json.error.message);
		} else if (json.error) {
			// Handle normal error
			throw new SpotifyError(json.error.message);
		} else {
			return {
				data: json,
				response
			};
		}
	} catch (e) {
		console.error('error in spotify fetch', e);
		if (e instanceof SpotifyError) throw e;

		throw new SpotifyError(getErrorMessage(e));
	}
}

export class SpotifyError extends Error {}
export class SpotifyAuthError extends SpotifyError {}

function getErrorMessage(error: string | Error): string {
	return process.env.NODE_ENV === 'production'
		? `An error occurred connecting to Spotify (Code ${0})`
		: typeof error === 'string'
		? error
		: error.message;
}
