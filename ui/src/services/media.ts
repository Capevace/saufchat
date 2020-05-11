let mediaStream: MediaStream | null = null;

/**
 * Get a MediaStream for the current users camera and microphone.
 * TODO: Remove the deprecated usage and also make this easier to modify somehow.
 */
export function getMediaStream(): Promise<MediaStream> {
	return new Promise((resolve, reject) => {
		if (mediaStream) {
			return resolve(mediaStream);
		}

		const nav: any = window.navigator;
		const getUserMedia =
			nav.getUserMedia ||
			nav.webkitGetUserMedia ||
			nav.mozGetUserMedia ||
			nav.msGetUserMedia;

		getUserMedia(
			{ audio: true, video: true },
			(stream: MediaStream) => {
				mediaStream = stream;
				resolve(stream);
			},
			reject
		);
	});
}
