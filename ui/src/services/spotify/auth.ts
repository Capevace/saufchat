import { RawLocation } from 'vue-router';

import { API_URL } from '@/config';
import router from '@/router';

export interface SpotifyTokens {
	accessToken: string;
	refreshToken: string;
}

// let savedTokens: SpotifyTokens | undefined;

/**
 * Redirect the browser window to the spotify-login endpoint of our API server.
 * This page redirects to the correct SpotifyWebAPI page to login and obtain auth tokens.
 */
export function redirectToSpotifyLogin() {
	window.location.href = API_URL + '/spotify-login';
}

/**
 * Check the SessionStorage and the current URL for spotify tokens.
 */
export function checkForSpotifyTokens(): SpotifyTokens | undefined {
	try {
		// Check URL query for new tokens
		const query = router.currentRoute.query;
		if (query.access_token && query.refresh_token) {
			removeQueryFromHistory();

			const tokens = {
				accessToken: String(query.access_token),
				refreshToken: String(query.refresh_token)
			};

			saveSpotifyTokens(tokens);

			return tokens;
		} else {
			const savedTokens = loadSavedSpotifyTokens();

			return savedTokens;
		}
	} catch (e) {
		console.error('Error checking for spotify tokens', e);
	}
}

/**
 * Load tokens from SessionStorage. (They will be deleted after current use)
 */
function loadSavedSpotifyTokens(): SpotifyTokens | undefined {
	// return savedTokens;

	try {
		const tokenJson = window.sessionStorage.getItem('spotify-tokens');

		if (!tokenJson) return undefined;

		return JSON.parse(tokenJson);
	} catch (e) {
		console.error('error loading saved spotify tokens', e);
	}
}

/**
 * Save tokens to SessionStorage.
 * @param tokens The tokens to save.
 */
export function saveSpotifyTokens(tokens: SpotifyTokens) {
	// savedTokens = tokens;
	window.sessionStorage.setItem('spotify-tokens', JSON.stringify(tokens));
}

/**
 * Logout by removing tokens from SessionStorage.
 * @param tokens The tokens to save.
 */
export function removeSpotifyTokens() {
	window.sessionStorage.removeItem('spotify-tokens');
}

// Set this as a global so users can fix their spotify if it bricks for some reason
// TODO: Replace this with an actual logout button
// @ts-ignore
window.removeSpotifyTokens = removeSpotifyTokens;

/**
 * Remove the query from the current route.
 *
 * This is intended to remove the query parameters from the URL as to mitigate possible security questions
 * and also to not confuse the user about the current state of the page.
 */
function removeQueryFromHistory() {
	const current = router.currentRoute;

	let location: RawLocation = {
		params: current.params
	};

	if (current.name) {
		location.name = current.name;
	} else {
		location.path = current.path;
	}

	router.replace(location);
}
