import cuid from 'cuid';

const SHOULD_CACHE_ID: boolean = false;

// If SHOULD_CACHE_ID is true, it is attempted to get a cached PeerID from localStorage.
// If none is found we create and save a new one.
let id: string = SHOULD_CACHE_ID
	? window.localStorage.getItem('peer-id') || createAndSavePeerID()
	: createAndSavePeerID();

/**
 * Create a PeerID (a CUID) and save it to localStorage.
 *
 * PeerIDs currently have the format: 'P-' + CUID.
 */
function createAndSavePeerID(): string {
	const id = `P-${cuid()}`;
	window.localStorage.setItem('peer-id', id);

	return id;
}

export default id;
