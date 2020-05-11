/**
 * Convert a Map structure to a JS object.
 * @type Type
 * @param map The map to convert.
 */
export function mapToObject<Type>(
	map: Map<string, Type>
): { [key: string]: Type } {
	let out = Object.create(null);

	map.forEach((value, key) => {
		out[key] = value;
	});

	return out;
}

/**
 * Transform a number in ms to HH:MM:SS format
 * @param duration
 */
export function msToTime(duration: number): string {
	let seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	const hoursPart = hours > 0 ? `${hours < 10 ? '0' + hours : hours}:` : '';

	return `${hoursPart}${minutes < 10 ? '0' + minutes : minutes}:${
		seconds < 10 ? '0' + seconds : seconds
	}`;
}
