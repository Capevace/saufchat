require('dotenv').config();
if (!process.env.SPOTIFY_CLIENT_ID) {
    console.error('Cannot initialize server: no SPOTIFY_CLIENT_ID provided.');
    process.exit(1);
}
if (!process.env.SPOTIFY_CLIENT_SECRET) {
    console.error('Cannot initialize server: no SPOTIFY_CLIENT_SECRET provided.');
    process.exit(1);
}
export const API_URL = process.env.API_URL || 'http://localhost:8080'; // api url: https://api.sauf.chat
export const APP_URL = process.env.APP_URL || 'http://localhost:8081'; // api url: https://api.sauf.chat
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
export const SPOTIFY_CLIENT_SCOPE = 'playlist-modify-private playlist-read-private user-modify-playback-state streaming user-read-playback-state user-read-currently-playing user-read-email user-read-private';
export const SPOTIFY_REDIRECT_URI = `${API_URL}/spotify/webhook`;
// localhost:8080/spotify/login/test
//# sourceMappingURL=config.js.map