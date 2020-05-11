<template>
	<button
		class="tooltip-target flex max-w-24"
		@click="toggleSpotify"
		v-tooltip="{
			content: 'Try out our Spotify integration!',
			classes:
				'bg-spotify text-gray-900 font-medium border-spotify p-2 rounded text-xs mt-1',
			placement: 'bottom',
			show: true
		}"
	>
		<div
			v-if="currentTrack"
			class="flex-1 text-gray-100 hidden md:flex text-left bg-gray-900 rounded px-2 py-px text-xs items-center"
		>
			<div class="flex flex-wrap flex-1">
				<span class="w-full font-bold truncate">{{
					currentTrack.name
				}}</span>
				<span class="w-full truncate">{{ artists }}</span>
			</div>

			<div class="flex flex-wrap items-center">
				<span class="mr-2">{{ currentProgessTime }}</span>
				<VolumeUp class="w-5 h-5" />
			</div>
		</div>
		<SpotifyIcon
			class="w-8 text-gray-100 mx-2 relative"
			:class="{ 'mr-2': true }"
		/>
	</button>
</template>
<script lang="ts">
import { BaseComponent, Component, Emit } from '@/component';
import { msToTime } from '@/helpers';

import { Track, Artist } from '@/services/spotify';
import { SpotifyBoardState } from '@/services/boards';

import SpotifyIcon from '@/components/icons/SpotifyIcon.vue';
import VolumeUp from '@/components/icons/VolumeUp.vue';

@Component({
	components: {
		SpotifyIcon,
		VolumeUp
	}
})
export default class WidgetButton extends BaseComponent {
	get spotifyState(): SpotifyBoardState {
		return this.$store.state.spotify;
	}

	get currentTrack(): Track | undefined {
		return this.spotifyState.localPlayerState?.currentTrack;
	}

	get currentProgessTime(): string {
		return msToTime(this.spotifyState.localPlayerState?.progressMs || 0);
	}

	get artists(): string {
		if (!this.currentTrack) return '';

		return this.currentTrack.artists.reduce(
			(str: string, artist: Artist, index: number) => {
				if (index === 0) return artist.name;

				return `, ${artist.name}`;
			},
			''
		);
	}

	@Emit('toggle-spotify')
	toggleSpotify() {}
}
</script>
