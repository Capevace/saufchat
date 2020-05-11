<template>
	<section class="">
		<nav
			class="flex justify-between items-center text-gray-600 text-xs px-2 pt-2"
		>
			<button
				class="text-xs flex items-center hover:bg-gray-700 hover:text-gray-900 p-1 rounded"
				@click.prevent="goBack"
			>
				<ChevronLeft class="w-1 mr-1" />
				Back
			</button>
			<div class="w-px h-6 bg-gray-900 mx-3"></div>
			<form class="flex-1">
				<input
					class="text-xs px-1 py-1 bg-gray-900 rounded-sm w-full focus:shadow-lg focus:border-gray-700 focus:text-gray-400 text-gray-600 border border-transparent transition-colors transition-shadow duration-200 ease-in-out"
					type="text"
					placeholder="Search for song..."
					v-model="searchValue"
				/>
			</form>
		</nav>
		<div
			v-if="isLoading"
			class="flex flex-wrap items-center justify-center h-32 py-5"
		>
			<Spinner
				class="w-full h-12 animation-rotate"
				primary="text-gray-900"
				secondary="text-gray-700"
			/>
			<strong class="text-gray-600 font-medium">Loading</strong>
		</div>

		<div
			v-else-if="!isLoading && searchValue === '' && results.length === 0"
			class="flex flex-wrap items-center justify-center h-32 py-5"
		>
			<Search
				class="w-full h-12"
				primary="text-gray-900"
				secondary="text-gray-700"
			/>
			<strong class="text-gray-600 font-medium">
				Search for a song!
			</strong>
		</div>

		<!-- Search Results -->
		<ol
			v-else-if="!isLoading && results.length > 0"
			class="text-gray-500 text-sm max-h-64 overflow-y-scroll px-2 py-2 pt-3"
		>
			<li v-for="result in filteredResults" :key="result.track.uri">
				<spotify-track :track="result.track">
					<div class="flex w-20 justify-end">
						<button
							class="text-gray-400 bg-gray-900 px-2 py-px rounded-full flex text-xs"
							@click.prevent="onAddTrackClicked(result.track.uri)"
							:disabled="result.isInQueue"
						>
							<template v-if="result.isInQueue">
								Added
								<Check
									class="ml-2 w-3"
									primary="text-gray-600"
									secondary="text-gray-700"
								/>
							</template>
							<template v-else>
								Add
								<PlaylistIcon
									class="ml-2 w-3"
									primary="text-gray-600"
									secondary="text-gray-700"
								/>
							</template>
						</button>
					</div>
				</spotify-track>
			</li>
		</ol>

		<div
			v-else
			class="flex flex-wrap items-center justify-center h-32 py-5"
		>
			<Search
				class="w-full h-12"
				primary="text-gray-900"
				secondary="text-gray-700"
			/>
			<strong class="text-gray-600 font-medium">
				Nothing found :(
			</strong>
		</div>
	</section>
</template>
<script lang="ts">
import debounce from 'lodash.debounce';
import cuid from 'cuid';
import { Emit } from 'vue-property-decorator';
import { BaseComponent, Component, Watch } from '@/component';
import { emptySpotifyBoardState } from '@/services/boards';
import { createSpotifyClient, SpotifyClient, Track } from '@/services/spotify';
import { Action } from '@/store';

import Dots from '@/components/icons/Dots.vue';
import ChevronLeft from '@/components/icons/ChevronLeft.vue';
import Search from '@/components/icons/Search.vue';
import Spinner from '@/components/icons/Spinner.vue';
import Check from '@/components/icons/Check.vue';
import PlaylistIcon from '@/components/icons/Playlist.vue';
import SpotifyTrack from '@/components/spotify/SpotifyTrack.vue';

const track = emptySpotifyBoardState().localPlayerState?.currentTrack;

@Component({
	components: {
		Dots,
		ChevronLeft,
		Search,
		SpotifyTrack,
		Spinner,
		Check,
		PlaylistIcon
	}
})
export default class WidgetBrowserPage extends BaseComponent {
	searchValue: string = '';

	results: Track[] = track ? [] : [];
	spotifyClient?: SpotifyClient;

	searchRequestId: string | null = null;
	isLoading: boolean = false;

	get currentlyPlayingTrack(): Track | undefined {
		return this.$store.state.spotify.localPlayerState?.currentTrack;
	}

	get issLoading(): boolean {
		return this.searchRequestId !== null;
	}

	async mounted() {
		this.search = debounce(this.search.bind(this), 500);

		this.spotifyClient = await createSpotifyClient();
	}

	get filteredResults(): { track: Track; isInQueue: boolean }[] {
		return this.results.map(track => ({
			track,
			isInQueue: this.isTrackInQueue(track)
		}));
	}

	isTrackInQueue(track: Track): boolean {
		for (const queueItem of this.$store.state.spotify.queue) {
			if (track.uri === queueItem.track.uri) {
				return true;
			}
		}

		return false;
	}

	@Watch('searchValue')
	onSearchValueChanged(searchValue: string) {
		if (searchValue !== '') {
			this.isLoading = true;
			this.search(searchValue);
		} else {
			this.searchRequestId = cuid(); // ignore all running searches
			this.isLoading = false;
			this.results = [];
		}
	}

	async search(searchValue: string) {
		if (!this.spotifyClient) return;

		const requestId = cuid();
		this.searchRequestId = requestId;
		this.$forceUpdate();

		const results = await this.spotifyClient.search(searchValue);

		if (this.searchRequestId === requestId) {
			this.searchRequestId = null;
			this.isLoading = false;
			this.results = results;
		}
	}

	@Emit('back')
	goBack() {}

	onAddTrackClicked(trackUri: string) {
		this.$store.dispatch<Action>({
			type: 'addTrackToQueue',
			uri: trackUri
		});
	}
}
</script>
