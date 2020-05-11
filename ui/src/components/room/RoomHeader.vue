<template>
	<header
		class="fixed w-full p-1 md:p-5 h-16 top-0 flex items-center justify-between w-full bg-gray-800 border-b-2 border-gray-900 px-2 py-1"
	>
		<h1
			class="text-left font-mono text-gray-200 font-bold flex items-center mr-4"
		>
			<img src="/img/logo-md.png" alt="SAUF.CHAT" class="w-8 mr-3" />
			<p class="hidden md:block">
				<span class="w-full block h-8 text-2xl">SAUF.CHAT</span>
				<span class="text-xs text-gray-600 block"
					>Beta v{{ clientVersion }}</span
				>
			</p>
		</h1>

		<div class="flex items-center justify-end">
			<SpotifyWidget />

			<router-link
				class="bg-gray-700 p-2 rounded text-gray-400 text-xs"
				to="/"
				>Leave Room</router-link
			>
		</div>
	</header>
</template>
<script lang="ts">
import { BaseComponent, Component, Prop } from '@/component';
import { RoomClient } from '@/services/room';

import SpotifyWidget from '@/components/spotify/widget/SpotifyWidget.vue';

@Component({
	components: {
		SpotifyWidget
	}
})
export default class RoomHeader extends BaseComponent {
	@Prop({ default: null })
	readonly room!: RoomClient | null;

	get clientVersion(): string {
		return process.env.PACKAGE_VERSION;
	}

	get roomId(): string {
		return this.$route.params.roomId;
	}
}
</script>
