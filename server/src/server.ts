import cuid from 'cuid';
import http from 'http';
import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ExpressPeerServer } from 'peer';
import socketIO from 'socket.io';

import * as config from '@/config';
import logger from '@/logger';
import quotes from '@/quotes';

import setupSocketIO from '@/io';
import * as redis from '@/redis';

export default function startServer(callback: (server: http.Server) => void) {
	/**
	 * Setup Express Server
	 */
	const app = express();
	app.use(
		cors({
			origin: config.APP_URL
		})
	);
	app.use(bodyParser.json());

	const server = http.createServer(app);

	const peerServer = ExpressPeerServer(server, {
		path: '/endpoint'
	});

	// Serve UI for ease of development
	if (process.env.NODE_ENV !== 'production')
		app.use(express.static('ui-dist'));

	app.use('/peer', peerServer);

	// Spotify Routes
	app.get('/spotify/login/:roomId', async (req, res) => {
		const { roomId } = req.params;
		const loginId = cuid();
		await redis.saveSpotifyLoginId(loginId, roomId);

		const params = new URLSearchParams();
		params.append('response_type', 'code');
		params.append('redirect_uri', config.SPOTIFY_REDIRECT_URI);
		params.append('state', loginId);
		params.append('scope', config.SPOTIFY_CLIENT_SCOPE);
		params.append('client_id', config.SPOTIFY_CLIENT_ID);

		res.redirect(`https://accounts.spotify.com/authorize?${params}`);
	});

	app.get(
		'/spotify/webhook',
		async (req: express.Request, res: express.Response) => {
			const loginId: string = String(req.query['state']);
			const code = String(req.query['code']);
			const error = String(req.query['error']);

			if (error) {
				res.status(401).json({
					error
				});
				logger.error('spotify error', error);
				return;
			}

			if (!redis.isValidSpotifyLoginId(loginId)) {
				res.status(401).json({
					error: 'Session expired. Please try again.'
				});
				return;
			}

			const tokenParams = new URLSearchParams();
			tokenParams.append('grant_type', 'authorization_code');
			tokenParams.append('code', code);
			tokenParams.append('redirect_uri', config.SPOTIFY_REDIRECT_URI);
			tokenParams.append('client_id', config.SPOTIFY_CLIENT_ID);
			tokenParams.append('client_secret', config.SPOTIFY_CLIENT_SECRET);

			try {
				const response = await fetch(
					'https://accounts.spotify.com/api/token',
					{
						method: 'POST',
						body: tokenParams
					}
				);
				const {
					access_token,
					expires_in,
					refresh_token
				} = await response.json();

				const redirectParams = new URLSearchParams();
				redirectParams.append('access_token', access_token);
				redirectParams.append('refresh_token', refresh_token);
				redirectParams.append('exprires_at', Date.now() + expires_in);

				// TODO: fix the fucking security holes that this imposes
				// Putting the parameters in the URL works for now as a quick implement, but it is DANGEROUS!
				const originRoomId = await redis.getOriginRoomForLoginId(
					loginId
				);
				res.redirect(
					`${config.APP_URL}/#/room/${originRoomId}?${redirectParams}`
				);
			} catch (e) {
				res.status(500).json({
					error: 'Unable to request tokens'
				});
				logger.error('spotify error 2', e);
			}
		}
	);

	// Spotify Routes
	app.post('/spotify/refresh-token', async (req, res) => {
		const { refreshToken } = req.body;
		logger.http(`Spotify refresh token, ${refreshToken}`);

		const tokenParams = new URLSearchParams();
		tokenParams.append('redirect_uri', config.SPOTIFY_REDIRECT_URI);
		tokenParams.append('grant_type', 'refresh_token');
		tokenParams.append('refresh_token', refreshToken);

		try {
			const response = await fetch(
				'https://accounts.spotify.com/api/token',
				{
					method: 'POST',
					body: tokenParams,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Basic ${Buffer.from(
							`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
						).toString('base64')}`
					}
				}
			);
			const body = await response.json();

			if (body.error) {
				res.status(response.status).json({
					error: body.error_description
				});
			} else {
				res.status(200).json({
					accessToken: body.access_token,
					expiresIn: body.expires_in
				});
			}
		} catch (e) {
			res.status(500).json({
				error: 'Unable to request tokens'
			});
			logger.error('spotify error 2', e);
		}
	});

	app.get('*', (req, res) => {
		logger.http(`Invalid Route: someone requested URL: ${req.url}`);

		const randomIndex = Math.floor(Math.random() * quotes.length);

		res.status(404).send(
			`<body style="background:black;color:#12db12;font-family:monospace;">${
				'Successfully deployed api.sauf.chat' || quotes[randomIndex]
			}</body>`
		);
	});

	const io: SocketIO.Server = socketIO.listen(server);

	setupSocketIO(io);

	callback(server);
}

/**
 * Server State
 */
// let rooms = {};

// await redis.set('rooms:${room.id}', {
// 	boards: ['<ids>']
// }, 'NX')

// await redis.set('boards:${board.id}', {
// 	state: {}
// }, 'NX')

// 	}

// 	/**
// 	 * Setup Socket.IO Server
// 	 */
// 	const io = require('socket.io').listen(server);

// 	io.on('connection', (socket) => {
// 		log('New Connection', socket.id);

// 		socket.on('join-room', ({ roomId, peerId }) => {
// 			log('Join Room', `RoomID: ${roomId}, PeerID: ${peerId}`);
// 			if (!roomId || !peerId) {
// 				// Something went wrong, don't mess up the room
// 				return;
// 			}

// 			let room = rooms[roomId] || (log('Create Room', `RoomID: ${roomId}`), new Room(roomId));

// 			if(socket.roomId || room.sockets[peerId]) {
// 				log('Join Room', `already in room. RoomID: ${roomId}, PeerID: ${peerId}`);
// 				return;
// 			}

// 			socket.roomId = roomId;
// 			socket.peerId = peerId;
// 			room.join(socket);
// 			rooms[roomId] = room;

// 			log('Join Room', `success. RoomID: ${roomId}, PeerID: ${peerId}`);
// 		});

// 		socket.on('board-update', ({ boardId, state }) => {
// 			if (!socket.roomId)
// 				return;

// 			log('Update Board', `RoomID: ${roomId}, state: ${state}`);

// 			const room = rooms[socket.roomId];

// 			if (!room) {
// 				log('Update Board', `unknown room. RoomID: ${socket.roomId}`);
// 				return;
// 			}

// 			const board = room.boards[boardId];

// 			if (!board) {
// 				log('Update Board', `unknown board. RoomID: ${socket.roomId} BoardID: ${boardId}`);
// 				return;
// 			}

// 			board.setState({
// 				...board.state,
// 				...state
// 			});
// 		});

// 		socket.on('board-event', ({ boardId, event, data }) => {
// 			if (!socket.roomId, !event)
// 				return;

// 			log('Board Event', `RoomID: ${socket.roomId}, BoardID: ${boardId}, Event: ${event}, Data: ${data}`);

// 			const room = rooms[socket.roomId];

// 			if (!room) {
// 				log('Board Event', `unknown room. RoomID: ${socket.roomId}`);
// 				return;
// 			}

// 			const board = room.boards[boardId];

// 			if (!this.boards[boardId]) {
// 				log('Board Event', `unknown board. RoomID: ${this.id}, BoardID: ${boardId}`);
// 				return;
// 			}

// 			board.onEvent(event, data || {});
// 		});

// 		socket.on('disconnect', (reason) => {
// 			if (socket.roomId && rooms[socket.roomId]) {
// 				rooms[socket.roomId].leave(socket);
// 				log('Left Room', `RoomID: ${socket.roomId}, PeerID: ${socket.peerId}`);

// 				if (Object.keys(rooms[socket.roomId].sockets).length === 0) {
// 					delete rooms[socket.roomId];
// 					log('Close Room', `RoomID: ${socket.roomId}`);
// 				}
// 			}

// 			log('Disconnect', `Reason: ${reason}, PeerID: ${socket.peerId}`);
// 		});
// 	});

// 	class Room {
// 		constructor(roomId) {
// 			this.id = roomId;
// 			this.sockets = {};
// 			this.boards = {
// 				spotify: new SpotifyBoard(this.id, this.emit.bind(this))
// 			};
// 		}

// 		emit(message, data) {
// 			Object.values(this.sockets).forEach(socket => socket.emit(message, data));
// 		}

// 		join(socket) {
// 			this.sockets[socket.peerId] = socket;

// 			this.emit('room-update', this.getRoomData());
// 		}

// 		leave(socket) {
// 			// socket.leave(this.id);

// 			delete this.sockets[socket.peerId];
// 			this.emit('room-update', this.getRoomData());
// 		}

// 		getRoomData() {
// 			return {
// 				id: this.id,
// 				numberOfPeers: Object.keys(this.sockets).length,
// 				peers: Object.values(this.sockets).map(socket => socket.peerId),
// 				boards: Object.values(this.boards).map(board => ({ id: board.id, state: board.state }))
// 			};
// 		}
// 	}

// 	class Board {
// 		constructor(roomId, emitToAll) {
// 			this.id = 'generic';
// 			this.roomId = roomId;
// 			this.state = {};
// 			this.emitToAll = emitToAll;
// 		}

// 		onEvent(event, data) {

// 		}

// 		setState(newState) {
// 			this.state = {
// 				...this.state,
// 				...newState
// 			};

// 			this.emitState();
// 		}

// 		getPublicState() {
// 			return this.state;
// 		}

// 		emitState() {
// 			this.emitToAll(`${this.id}-${this.type}-board-state`, {
// 				state: this.getState()
// 			});
// 		}

// 		emitEvent(event, data) {
// 			this.emitToAll(`${this.id}-${this.type}-board-event`, {
// 				event,
// 				data
// 			});
// 		}
// 	}

// 	class SpotifyBoard extends Board {
// 		constructor(roomId, emitToAll) {
// 			super(roomId, emitToAll);
// 			this.id = 'spotify';

// 			// We move it out of the state object, in order for it to be public, but not publicly editable
// 			this.player = {
// 				playing: false,
// 				songId: null,
// 				startAt: null, // timestamp,
// 				endAt: null,
// 				timeoutId: null
// 			};

// 			this.state = {
// 				queue: [],
// 			};
// 		}

// 		getPublicState() {
// 			return {
// 				...this.state,
// 				player: {
// 					...this.player,
// 					timeoutId: undefined
// 				}
// 			};
// 		}

// 		setState(newState) {
// 			if (newState.player)
// 				delete newState.player;

// 			if (!newState.queue || !Array.isArray(newState.queue)) {
// 				log('Spotify', `invalid new queue state. RoomID: ${roomId} NewState: ${newState.queue}`);
// 				return;
// 			}

// 			super.setState(newState);
// 		}

// 		onEvent(event, data) {
// 			if (event === 'play' && !this.player.playing) {
// 				this.playNextSong();
// 			}
// 		}

// 		playNextSong() {
// 			const song = this.state.queue.shift();

// 			if(!song) {
// 				log('Spotify: play', `no songs in queue. RoomID: ${roomId} SongID: ${songId}`);
// 				return;
// 			}

// 			if(song.id === null || song.length === null || typeof song.length !== 'number') {
// 				log('Spotify: play', `invalid song. RoomID: ${roomId} SongID: ${songId}`);
// 				return;
// 			}

// 			const now = Date.now();

// 			this.player.playing = true;
// 			this.player.songId = song.id;
// 			this.player.startAt = now + 1500; // Start the song in 1,5 seconds
// 			this.player.endAt = this.player.startAt + song.length;
// 			this.player.timeoutId = setTimeout(() => {
// 				log('Spotify: play', `ended. RoomID: ${roomId} SongID: ${songId}`);

// 				this.playNextSong();
// 			}, Math.abs(now - this.player.endAt));

// 			log('Spotify: play', `Song Start. RoomID: ${roomId} SongID: ${songId}`);

// 			// Since we modified private state, and not the public state object,
// 			// we have to emit state manually here.
// 			this.emitState();
// 		}
// 	}

// 	// Pass the callback in order to start the server instance
// 	callback(server);
// }
