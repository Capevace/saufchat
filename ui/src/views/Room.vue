<template>
	<div class="">
		<RoomHeader @toggle-spotify="toggleSpotify" />

		<main class="h-screen pt-16">
			<!-- Room Call -->
			<RoomCall :minimized="activeBoard !== null" />

			<!-- Room Boards -->
			<!-- <RoomBoards :active-board="activeBoard" /> -->
		</main>

		<DebugBox
			class="fixed right-0 top-0 bottom-0 overflow-y-scroll m-10"
			:data="debugState"
		></DebugBox>
	</div>
</template>
<script lang="ts">
import { Route } from 'vue-router';

import { BaseComponent, Component } from '@/component';
import { Action } from '@/store';

import DebugBox from '@/components/shared/DebugBox.vue';
import RoomHeader from '@/components/room/RoomHeader.vue';
import RoomCall from '@/components/room/RoomCall.vue';
import RoomBoards from '@/components/room/RoomBoards.vue';

@Component({
	components: {
		DebugBox,
		RoomHeader,
		RoomCall,
		RoomBoards
	}
})
export default class Room extends BaseComponent {
	activeBoard: string = 'spotify';

	spotifyVisible: boolean = true;

	get joinedCall(): boolean {
		return this.$store.state.room.peersInCall.includes(
			this.$store.state.peerId
		);
	}

	get debugState(): object {
		return {
			PeerID: this.$store.state.peerId,
			RoomID: this.$store.state.roomId,
			Peers: this.$store.state.room.peers,
			PeersInCall: this.$store.state.room.peersInCall,
			Calls: this.$store.state.room.calls,
			JoinedCall: this.joinedCall,
			Queue: this.$store.state.spotify.queue,
			PlaybackState: this.$store.state.spotify.remotePlaybackState,
			TrackCache: this.$store.state.spotify.trackCache,
			UserWantsPlayback: this.$store.state.spotify.userWantsPlayback
		};
	}

	created() {
		this.setup(this.$route.params.roomId);
	}

	updated() {
		if (this.$store.state.roomId !== this.$route.params.roomId) {
			this.setup(this.$route.params.roomId);
		}
	}

	beforeRouteLeave(to: Route, from: Route, next: Function) {
		if (confirm('Do you really want to leave this room?')) {
			this.$store.dispatch<Action>({
				type: 'leaveRoom'
			});

			next();
		} else {
			next(false);
		}
	}

	private async setup(roomId: string) {
		this.$store.dispatch<Action>({
			type: 'connectToRoom',
			roomId: roomId
		});
	}

	joinCall() {
		this.$store.dispatch<Action>({
			type: 'joinCall'
		});
	}

	toggleSpotify() {
		this.spotifyVisible = !this.spotifyVisible;
	}

	toggleSpotifyPlayback() {
		if (this.$store.state.spotify.userWantsPlayback) {
			this.$store.dispatch<Action>({
				type: 'leavePlayback'
			});
		} else {
			this.$store.dispatch<Action>({
				type: 'syncPlayback'
			});
		}
	}
}
</script>
