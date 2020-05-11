<template>
	<section>
		<!-- Queue Header -->
		<nav
			class="flex justify-between items-center text-gray-600 text-xs px-2 pt-2"
		>
			<h2 class="font-bold">
				Queue
			</h2>
			<button
				class="bg-gray-600 rounded-full text-gray-900 px-2 py"
				@click.prevent="goToBrowserPage"
			>
				Add Song +
			</button>
		</nav>

		<!-- Queue -->
		<ol
			class="text-gray-500 text-sm max-h-64 px-2 py-2 overflow-y-scroll"
			v-if="queue.length > 0"
		>
			<li v-for="item in queue" :key="item.queueItem.id">
				<spotify-track
					:track="
						$store.state.spotify.trackCache[
							item.queueItem.track.uri
						]
					"
				></spotify-track>
			</li>
		</ol>

		<div
			v-else
			class="flex flex-wrap items-center justify-center h-40 py-5"
		>
			<Playlist
				class="w-full h-12"
				primary="text-gray-900"
				secondary="text-gray-700"
			/>
			<p class="text-gray-600 font-medium">
				Your room's queue is empty.<br />
				<button
					class="bg-gray-900 px-2 py-1 rounded mt-1 font-bold"
					@click.prevent="goToBrowserPage"
				>
					Add a Song +
				</button>
				to get started!
			</p>
		</div>
	</section>
</template>

<script lang="ts">
import { BaseComponent, Component, Prop, Emit } from '@/component';
import { Track } from '@/services/spotify';
import { QueueItem } from '@/services/boards';
import { msToTime } from '@/helpers';

import SpotifyTrack from '@/components/spotify/SpotifyTrack.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import Playlist from '@/components/icons/Playlist.vue';

import MoreButton from '@/components/shared/MoreButton.vue';

@Component({
	components: {
		ChevronUp,
		ChevronDown,
		Playlist,
		MoreButton,
		SpotifyTrack
	},
	filters: {
		msToTime: msToTime
	}
})
export default class WidgetQueuePage extends BaseComponent {
	@Prop({ default: () => [] })
	readonly queue!: { queueItem: QueueItem; track: Track | null }[];

	@Emit('add-track')
	goToBrowserPage() {}
}
</script>
