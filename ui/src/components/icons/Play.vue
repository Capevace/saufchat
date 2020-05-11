<template>
	<svg
		focusable="false"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 448 512"
		class="fill-current"
	>
		<title>Play</title>
		<g class="fa-group">
			<path
				fill="currentColor"
				d="M424.41 214.66L72.41 6.55C43.81-10.34 0 6.05 0 47.87V464c0 37.5 40.69 60.09 72.41 41.3l352-208c31.4-18.54 31.5-64.14 0-82.64zM321.89 283.5L112.28 407.35C91 420 64 404.58 64 379.8V132c0-24.78 27-40.16 48.28-27.54l209.61 123.95a32 32 0 0 1 0 55.09z"
				:class="secondary"
			></path>
			<path
				fill="currentColor"
				d="M112.28 104.48l209.61 123.93a32 32 0 0 1 0 55.09L112.28 407.35C91 420 64 404.58 64 379.8V132c0-24.76 27-40.14 48.28-27.52z"
				:class="primary"
			></path>
		</g>
	</svg>
</template>
<script lang="ts">
import { BaseComponent, Prop, Component } from '@/component';

@Component
export default class PlayIcon extends BaseComponent {
	@Prop({ default: '' })
	readonly primary!: string;

	@Prop({ default: '' })
	readonly secondary!: string;
}
</script>
