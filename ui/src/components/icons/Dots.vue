<template>
	<svg
		focusable="false"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 320 512"
		class="fill-current"
	>
		<title>More</title>
		<path
			fill="currentColor"
			d="M192 256c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm88-32c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-240 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"
			class=""
		></path>
	</svg>
</template>
<script lang="ts">
import { BaseComponent, Prop, Component } from '@/component';

@Component
export default class ChevronDown extends BaseComponent {
	@Prop({ default: '' })
	readonly primary!: string;

	@Prop({ default: '' })
	readonly secondary!: string;
}
</script>
