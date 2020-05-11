<template>
	<div class="w-full flex bg-gray-800 rounded-lg items-center">
		<div
			class="w-10 h-10 bg-gray-900 rounded mr-3 bg-contain"
			:style="`background-image: url(${imageUrl})`"
		></div>

		<div class="flex-1 text-left" v-if="track">
			<div class="font-medium text-gray-300">{{ track.name }}</div>
			<div class="text-gray-500">
				<a v-for="(artist, index) in track.artists" :key="artist.id"
					>{{ index === 0 ? '' : ', ' }}{{ artist.name }}</a
				>
			</div>
		</div>
		<div class="flex-1" v-else>
			Loading Track...
		</div>

		<div class="px-2">{{ trackDuration }}</div>

		<div class="flex text-gray-100" v-if="moreButton">
			<MoreButton
				class="flex w-4"
				:items="{
					moveUp: 'Move up',
					moveDown: 'Move down',
					remove: 'Remove from Queue'
				}"
				@click="moreButtonAction"
			/>
		</div>
		<slot v-else></slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Track } from '@/services/spotify';
import { msToTime } from '@/helpers';

import ChevronUp from '@/components/icons/ChevronUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';

import MoreButton from '@/components/shared/MoreButton.vue';

@Component({
	components: {
		ChevronUp,
		ChevronDown,
		MoreButton
	},
	filters: {
		msToTime: msToTime
	}
})
export default class SpotifyQueuePage extends Vue {
	@Prop({ default: undefined })
	readonly track!: Track | undefined;

	@Prop({ default: false })
	readonly moreButton!: boolean;

	get imageUrl(): string | undefined {
		if (this.track) return this.track.album.images[0].url;

		return undefined;
	}

	get trackDuration(): string {
		if (this.track) return msToTime(this.track.duration_ms);

		return '';
	}

	get hasTrack(): boolean {
		return !!this.track;
	}

	moreButtonAction(action: string) {
		console.log(action);
	}
}
</script>

<style scoped></style>
