<template>
	<svg
		focusable="false"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		class="fill-current"
	>
		<title>Chat Bubble</title>
		<g>
			<path
				fill="currentColor"
				d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5a8 8 0 0 0-1.5 8.7A7.83 7.83 0 0 0 8 480c66.3 0 116-31.8 140.6-51.4A305 305 0 0 0 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"
				:class="secondary"
			></path>
			<path
				fill="currentColor"
				d="M128 208a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm128 0a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm128 0a32 32 0 1 0 32 32 32 32 0 0 0-32-32z"
				:class="primary"
			></path>
		</g>
	</svg>
</template>
<script lang="ts">
import { BaseComponent, Prop, Component } from '@/component';

@Component
export default class ChatBubble extends BaseComponent {
	@Prop({ default: '' })
	readonly primary!: string;

	@Prop({ default: '' })
	readonly secondary!: string;
}
</script>
