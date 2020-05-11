/**
 * The URL of the API server.
 */
export const API_URL: string =
	process.env.NODE_ENV === 'production'
		? 'https://api.sauf.chat'
		: 'http://localhost:8080';

export function SPOTIFY_AUTH_URL(roomId: string) {
	return `${API_URL}/spotify/login/${roomId}`;
}
