<template>
	<article
		class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-w-sm overflow-hidden"
	>
		<header
			class="w-full flex flex-wrap items-center justify-between border-b-2 border-gray-900"
		>
			<nav class="flex w-full items-center justify-between p-2">
				<h1 class="flex">
					<SpotifyLogo class="inline-block h-5"></SpotifyLogo>
				</h1>

				<!-- Track Actions -->
				<div
					class="flex-1 flex mb-1 justify-end text-xs text-gray-100"
					v-if="joinedPlayback"
				>
					<button
						class="py-1 px-3 rounded bg-gray-700 mr-1 font-medium"
						@click.prevent="voteSkip"
					>
						Vote Skip
					</button>
					<button
						class="py-1 px-3 rounded bg-gray-700 font-semibold"
						@click.prevent="stopPlayback"
					>
						Stop Listening
					</button>
				</div>
				<button
					v-else
					class="py-1 px-3 rounded bg-spotify font-semibold text-gray-900 text-xs disabled:opacity-75 disabled:cursor-not-allowed flex justify-between"
					@click.prevent="startPlayback"
					:disabled="!canStartMusic"
				>
					<span class="mr-2">Play</span>
					<PlayIcon class="w-3" />
				</button>
			</nav>

			<WidgetPlayer :spotify-state="spotifyState" />
		</header>

		<!-- Board Queue Body -->
		<section class="">
			<!-- Login Button if unauthenticated -->
			<template v-if="statusIs('unauthenticated')">
				<div
					class="bg-gray-900 absolute inset-0 w-full h-full z-0 opacity-75 rounded"
				></div>
				<a
					:href="spotifyAuthURL"
					class="flex px-5 py-2 bg-spotify rounded text-white font-bold justify-center items-center m-5 z-10 relative"
				>
					<span class="inline-block mr-2">Login with</span>
					<SpotifyLogo class="inline-block h-8"></SpotifyLogo>
				</a>
			</template>

			<!-- Board Pages when ready -->
			<template v-if="statusIs('ready')">
				<!-- Queue Page -->
				<WidgetQueuePage
					v-if="page === 'queue'"
					:queue="spotifyQueue"
					@add-track="page = 'add'"
				/>

				<!-- Add Page -->
				<WidgetBrowserPage
					v-if="page === 'add'"
					@back="page = 'queue'"
				/>
			</template>
		</section>
	</article>
</template>
<script lang="ts">
import { BaseComponent, Component } from '@/component';
import { SPOTIFY_AUTH_URL } from '@/config';
import { Track } from '@/services/spotify';
import { Action } from '@/store';

import {
	SpotifyReadyState,
	QueueItem,
	SpotifyBoardState
} from '@/services/boards';
import SpotifyLogo from '@/components/icons/SpotifyLogo.vue';
import PlayIcon from '@/components/icons/Play.vue';
import WidgetQueuePage from './WidgetQueuePage.vue';
import WidgetBrowserPage from './WidgetBrowserPage.vue';
import WidgetPlayer from './WidgetPlayer.vue';

@Component({
	components: {
		SpotifyLogo,
		WidgetQueuePage,
		WidgetBrowserPage,
		WidgetPlayer,
		PlayIcon
	}
})
export default class WidgetBody extends BaseComponent {
	get spotifyState(): SpotifyBoardState {
		return this.$store.state.spotify;
	}

	get spotifyAuthURL(): string {
		return this.$store.state.roomId
			? SPOTIFY_AUTH_URL(this.$store.state.roomId)
			: '';
	}

	get canStartMusic(): boolean {
		return (
			!!this.spotifyState.remotePlaybackState ||
			this.spotifyState.queue.length > 0
		);
	}

	get joinedPlayback(): boolean {
		return this.spotifyState?.userWantsPlayback || false;
	}

	get currentTrack(): Track | undefined {
		return this.spotifyState.localPlayerState?.currentTrack;
	}

	get spotifyQueue(): { queueItem: QueueItem; track: Track | null }[] {
		let queue = this.$store.state.spotify.queue.map((item: QueueItem) => ({
			queueItem: item,
			track: this.$store.state.spotify.trackCache[item.track.uri] || null
		}));

		// Remove the first element from the list if there is currently a track playing
		// as that one will still be in the queue while its playing.
		if (this.currentTrack && queue[0]) queue.shift();

		return queue;
	}

	statusIs(statusName: 'ready' | 'loading' | 'unauthenticated'): boolean {
		return (
			this.spotifyState.spotifyStatus === SpotifyReadyState[statusName]
		);
	}

	page: 'queue' | 'add' = 'queue';

	startPlayback() {
		this.$store.dispatch<Action>({
			type: 'syncPlayback'
		});
	}

	stopPlayback() {
		this.$store.dispatch<Action>({
			type: 'leavePlayback'
		});
	}

	voteSkip() {}
}
</script>
