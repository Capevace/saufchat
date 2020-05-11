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
					class="py-1 px-3 rounded bg-spotify font-semibold text-xs"
					@click.prevent="startPlayback"
				>
					Start Music
				</button>
			</nav>

			<div
				class="w-full flex bg-gray-800 px-2 pr-3 py-2 pt-0 items-center"
				:class="{ 'opacity-50': !joinedPlayback }"
			>
				<!-- Cover Image -->
				<div
					class="w-16 h-16 bg-gray-900 rounded mr-3 bg-contain"
					:style="`background-image: url(${currentTrackCoverUrl})`"
				></div>

				<div class="flex-1">
					<div class="w-full flex">
						<!-- Track Meta -->
						<div
							class="flex-1 text-left text-sm flex items-center flex-wrap"
						>
							<!-- Track Name -->
							<div class="font-medium text-gray-300 w-full">
								{{
									currentTrack
										? currentTrack.name
										: 'Loading...'
								}}
							</div>
							<!-- Track Artists -->
							<div
								class="text-gray-500 text-xs"
								v-if="currentTrack"
							>
								<a
									v-for="(artist,
									index) in currentTrack.artists"
									:key="artist.id"
									>{{ index === 0 ? '' : ', '
									}}{{ artist.name }}</a
								>
							</div>
						</div>
					</div>

					<div>
						<!-- Playback Times -->
						<div
							class="w-full flex justify-between text-gray-600 mb-px select-none"
							style="font-size: 0.7rem;"
						>
							<span>{{ currentTrackProgressTime }}</span>
							<span>{{ currentTrackDurationTime }}</span>
						</div>
						<!-- Progression Bar -->
						<div class="bg-gray-900 w-full h-1 rounded-full">
							<div
								class="bg-gray-700 h-1 relative rounded-full"
								:style="
									`width: ${currentTrackProgressPercentage *
										100}%;`
								"
							></div>
						</div>
					</div>
				</div>
			</div>
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
				<template v-if="page === 'queue'">
					<!-- Queue Header -->
					<nav
						class="flex justify-between items-center text-gray-600 text-xs px-2 pt-2"
					>
						<h2 class="font-bold">
							Queue
						</h2>
						<button
							class="bg-gray-600 rounded-full text-gray-900 px-2 py"
							@click.prevent="page = 'add'"
						>
							Add Song +
						</button>
					</nav>

					<!-- Queue -->
					<ol
						class="text-gray-500 text-sm max-h-64 px-2 py-2 overflow-y-scroll"
					>
						<li
							v-for="item in spotifyQueue"
							:key="item.queueItem.id"
						>
							<spotify-track :track="item.track"></spotify-track>
						</li>
					</ol>
				</template>

				<!-- Add Page -->
				<SpotifyBrowser v-if="page === 'add'" @back="page = 'queue'" />
			</template>
		</section>
	</article>
</template>
<script lang="ts">
import { SPOTIFY_AUTH_URL } from '@/config';
import { Track } from '@/services/spotify';
import { Action } from '@/store';

import {
	SpotifyReadyState,
	QueueItem,
	SpotifyBoardState
} from '@/services/boards';
import SpotifyLogo from '@/components/icons/SpotifyLogo.vue';
import SpotifyTrack from '@/components/spotify/SpotifyTrack.vue';
import SpotifyBrowser from '@/components/spotify/SpotifyBrowser.vue';
import { msToTime } from '@/helpers';
import { BaseComponent, Component } from '@/component';

@Component({
	components: {
		SpotifyTrack,
		SpotifyLogo,
		SpotifyBrowser
	},
	filters: {
		msToTime
	}
})
export default class SpotifyBoard extends BaseComponent {
	get spotifyState(): SpotifyBoardState {
		return this.$store.state.spotify;
	}

	get joinedPlayback(): boolean {
		return this.spotifyState.userWantsPlayback;
	}

	get currentTrack(): Track | undefined {
		return this.spotifyState.localPlayerState?.currentTrack;
	}

	get currentTrackProgressTime(): string {
		return msToTime(this.spotifyState.localPlayerState?.progressMs || 0);
	}

	get currentTrackDurationTime(): string {
		return msToTime(
			this.spotifyState.localPlayerState?.currentTrack.duration_ms || 0
		);
	}

	get currentTrackProgressPercentage(): number {
		if (this.spotifyState.localPlayerState) {
			return (
				this.spotifyState.localPlayerState.progressMs /
				this.spotifyState.localPlayerState.currentTrack.duration_ms
			);
		}

		return 0;
	}

	get currentTrackCoverUrl(): string | undefined {
		return this.currentTrack?.album.images[0].url;
	}

	get spotifyAuthURL(): string {
		return this.$store.state.roomId
			? SPOTIFY_AUTH_URL(this.$store.state.roomId)
			: '';
	}

	get spotifyQueue(): { queueItem: QueueItem; track?: Track }[] {
		let queue = this.$store.state.spotify.queue.map(item => ({
			queueItem: item,
			track: this.$store.state.spotify.trackCache[item.track.uri]
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
