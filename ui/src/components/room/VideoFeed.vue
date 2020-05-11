<template>
	<div>
		<video
			ref="video"
			:srcObject.prop="stream"
			autoplay="true"
			muted="true"
		/>
		<div
			class="absolute bottom-0 p-2 bg-gray-800 w-full opacity-50 text-gray-100 flex items-center justify-between"
		>
			<div class="flex">
				<button @click="muted = !muted" :disabled="alwaysMuted">
					{{ muted ? '🔇' : '🔈' }}
				</button>
				<input
					class="block bg-red-500 w-24 bg-red-500"
					type="range"
					min="0"
					max="2"
					step="0.01"
					v-model="volume"
					name="volume"
					:disabled="alwaysMuted"
				/>
			</div>
			<span class="flex-1 text-xs text-right">{{ peerId }}</span>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class VideoFeed extends Vue {
	@Prop({ type: String, required: true })
	readonly peerId!: string;

	@Prop({ type: MediaStream })
	readonly stream: MediaStream | undefined;

	@Prop({ default: false })
	readonly alwaysMuted!: boolean;

	muted: boolean = process.env.NODE_ENV !== 'production';
	volume: number = 1;
	showSettings: boolean = false;

	private audioContext: AudioContext = new AudioContext();
	private gainNode?: GainNode;

	$refs!: {
		video: HTMLMediaElement;
	};

	created() {
		if (this.alwaysMuted) this.muted = true;
	}

	mounted() {
		const source = this.audioContext.createMediaElementSource(
			this.$refs.video
		);

		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value = this.muted ? 0 : this.volume;
		this.gainNode.connect(this.audioContext.destination);

		source.connect(this.gainNode);
	}

	@Watch('volume')
	onVolumeChanged() {
		if (this.gainNode)
			this.gainNode.gain.value = this.muted ? 0 : this.volume;
	}

	@Watch('muted')
	onMutedChanged() {
		if (this.gainNode)
			this.gainNode.gain.value = this.muted ? 0 : this.volume;
	}
}
</script>
