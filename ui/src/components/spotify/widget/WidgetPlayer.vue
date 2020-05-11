<template>
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
							currentTrack ? currentTrack.name : 'Nothing playing'
						}}
					</div>
					<!-- Track Artists -->
					<div class="text-gray-500 text-xs" v-if="currentTrack">
						<a
							v-for="(artist, index) in currentTrack.artists"
							:key="artist.id"
							>{{ index === 0 ? '' : ', ' }}{{ artist.name }}</a
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
							`width: ${currentTrackProgressPercentage * 100}%;`
						"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { BaseComponent, Component, Prop } from '@/component';
import { msToTime } from '@/helpers';

import { Track } from '@/services/spotify';
import { SpotifyBoardState } from '@/services/boards';

@Component
export default class WidgetPlayer extends BaseComponent {
	@Prop({ default: undefined })
	readonly spotifyState!: SpotifyBoardState | undefined;

	get joinedPlayback(): boolean {
		return this.spotifyState?.userWantsPlayback || false;
	}

	get currentTrack(): Track | undefined {
		return this.spotifyState?.localPlayerState?.currentTrack;
	}

	get currentTrackProgressTime(): string {
		return msToTime(this.spotifyState?.localPlayerState?.progressMs || 0);
	}

	get currentTrackDurationTime(): string {
		return msToTime(
			this.spotifyState?.localPlayerState?.currentTrack.duration_ms || 0
		);
	}

	get currentTrackProgressPercentage(): number {
		if (this.spotifyState?.localPlayerState) {
			return (
				this.spotifyState.localPlayerState.progressMs /
				this.spotifyState.localPlayerState.currentTrack.duration_ms
			);
		}

		return 0;
	}

	get currentTrackCoverUrl(): string | undefined {
		return this.spotifyState?.localPlayerState?.currentTrack.album.images[0]
			.url;
	}
}
</script>
