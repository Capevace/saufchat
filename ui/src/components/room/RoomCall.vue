<template>
	<article class="w-full h-full bg-gray-800 flex justify-center items-start">
		<section v-if="!joinedCall" class="self-center">
			<h1 class="text-3xl text-gray-500 mb-5">
				{{ peopleInCallMessage }}
			</h1>
			<button
				class="text-3xl text-gray-500 bg-gray-900 p-5 rounded-lg"
				@click.prevent="joinCall"
			>
				Join Call
			</button>
		</section>
		<section v-else class="w-full bg-gray-800 overflow-y-scroll">
			{{ roomState.calls }}
			<div class="flex flex-wrap pt-5">
				<video-feed
					class="bg-gray-900 rounded-lg shadow w-1/3 overflow-hidden mb-5 mx-5 relative"
					:class="{ 'w-full max-w-md': minimized }"
					peer-id="You"
					:stream="roomState.mediaStream"
					:always-muted="true"
				></video-feed>

				<video-feed
					class="bg-gray-900 rounded-lg shadow w-1/3 overflow-hidden mb-5 mx-5 relative"
					:class="{ 'w-full max-w-md': minimized }"
					v-for="(reactiveCall, remotePeerId) in roomState.calls"
					:key="remotePeerId"
					:peer-id="remotePeerId"
					:stream="reactiveCall.stream"
				></video-feed>
			</div>
			<div
				class="text-gray-100 bg-gray-900 rounded-full p-1 absolute font-bold"
				style="top: 50%; right: -3px;"
			>
				:
			</div>
		</section>
	</article>
</template>
<script lang="ts">
import { BaseComponent, Component, Prop } from '@/component';
import { ReactiveRoomState } from '@/services/room';
import { Action } from '@/store';

import VideoFeed from './VideoFeed.vue';

@Component({
	components: {
		VideoFeed
	}
})
export default class RoomCall extends BaseComponent {
	@Prop({ default: false })
	readonly minimized!: boolean;

	get peopleInCallMessage(): string {
		if (this.roomState.peers.length === 1) {
			return `There is currently 1 person online and ${this.roomState.peersInCall.length} video-calling.`;
		}

		return `There are currently ${this.roomState.peers.length} people online and ${this.roomState.peersInCall.length} video-calling.`;
	}

	get roomState(): ReactiveRoomState {
		return this.$store.state.room;
	}

	get joinedCall(): boolean {
		return this.roomState.peersInCall.includes(this.$store.state.peerId);
	}

	joinCall() {
		this.$store.dispatch<Action>({
			type: 'joinCall'
		});
	}
}
</script>
