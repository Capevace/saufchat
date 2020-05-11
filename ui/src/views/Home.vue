<template>
	<div class="home">
		<section class="text-gray-100 font-mono font-bold mt-16">
			<h1 class="text-4xl">
				🍻 SAUF.CHAT
			</h1>
		</section>

		<p class="text-lg text-gray-600">
			Peer-to-peer group calls to hang out with your friends!
		</p>
		<div
			class="m-auto mt-24 max-w-lg bg-gray-800 rounded-lg shadow px-5 py-6 text-gray-100"
		>
			<button
				class="w-full text-lg text-indigo-100 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 hover:text-white rounded p-3 mb-5 font-semibold"
				@click.prevent="createRoom"
			>
				Create Room
			</button>

			<div class="text-gray-500 mb-5 flex items-center">
				<hr class="flex-1 border-gray-700" />
				<span class="mx-2">or</span>
				<hr class="flex-1 border-gray-700" />
			</div>

			<form class="w-full flex" @submit.prevent="joinRoom(roomName)">
				<label>
					<input
						class="flex-1 text-lg bg-gray-100 text-gray-900 rounded px-3 py-3 mr-2"
						type="text"
						name="room"
						placeholder="Room Name"
						v-model="roomName"
					/>
				</label>
				<button
					class="text-lg bg-indigo-500 rounded p-3 font-medium"
					type="submit"
				>
					Join Room
				</button>
			</form>
		</div>

		<span
			class="fixed bottom-0 left-0 m-1 text-gray-100 font-mono text-xs opacity-25"
		>
			sauf.chat v{{ clientVersion }}
		</span>
	</div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component } from 'vue-property-decorator';
import cuid from 'cuid';

@Component
export default class Home extends Vue {
	name = 'home';

	roomName = '';

	createRoom() {
		const id = `R-${cuid()}`;
		this.joinRoom(id);
	}

	joinRoom(roomId: string) {
		console.log(this.$router);
		this.$router.push({ name: 'room', params: { roomId } });
	}

	get clientVersion(): string {
		return process.env.PACKAGE_VERSION;
	}
}
</script>
