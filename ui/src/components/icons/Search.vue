<template>
	<svg
		focusable="false"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		class="fill-current"
	>
		<title>Search</title>
		<g class="fa-group">
			<path
				fill="currentColor"
				d="M208 80a128 128 0 1 1-90.51 37.49A127.15 127.15 0 0 1 208 80m0-80C93.12 0 0 93.12 0 208s93.12 208 208 208 208-93.12 208-208S322.88 0 208 0z"
				:class="secondary"
			></path>
			<path
				fill="currentColor"
				d="M504.9 476.7L476.6 505a23.9 23.9 0 0 1-33.9 0L343 405.3a24 24 0 0 1-7-17V372l36-36h16.3a24 24 0 0 1 17 7l99.7 99.7a24.11 24.11 0 0 1-.1 34z"
				:class="primary"
			></path>
		</g>
	</svg>
</template>
<script lang="ts">
import { BaseComponent, Prop, Component } from '@/component';

@Component
export default class SearchIcon extends BaseComponent {
	@Prop({ default: '' })
	readonly primary!: string;

	@Prop({ default: '' })
	readonly secondary!: string;
}
</script>
