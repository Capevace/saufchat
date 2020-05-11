<template>
	<article class="flex mt-16">
		<div v-if="activeBoard !== null" class="w-full bg-gray-900 p-5">
			<!--				Here you'll see a little hack going on with the :spotify-state property.-->
			<!--				For reasons that are unclear to me, the component simply WILL NOT update when just passing the-->
			<!--				spotifyState variable here. I feel like it has to do with typescripts { [key: string]:... } stuff on-->
			<!--				the tracks property, but I don't know. Just leave it like this, should be fine.-->
			<!-- <spotify-board
				v-show="activeBoard === 'spotify'"
				:room-id="this.$route.params.roomId"
				:spotify-state="{
					// unideal, but don;t know how to fix the bug
					queue: this.spotifyState.queue,
					tracks: this.spotifyState.tracks,
					joinedPlayback: this.spotifyState.joinedPlayback,
					playbackState: this.spotifyState.playbackState,
					spotifyPlaybackState: this.spotifyState
						.spotifyPlaybackState,
					readyState: this.spotifyState.readyState
				}"
				@added-track="addSpotifyTrack"
				@toggle-playback="toggleSpotifyPlayback"
			></spotify-board> -->
		</div>
	</article>
</template>
<script lang="ts">
import { BaseComponent, Component, Prop } from '@/component';

@Component({})
export default class RoomBoards extends BaseComponent {
	@Prop()
	readonly activeBoard?: string;
}
</script>
