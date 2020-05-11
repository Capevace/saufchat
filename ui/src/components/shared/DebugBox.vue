<template>
	<div
		v-if="visible"
		class="bg-gray-900 rounded w-auto p-5 pt-0 mb-5 text-gray-100 font-mono text-left` shadow"
	>
		<h3 class="text-xs text-gray-500 text-center py-2">Debug</h3>
		<div v-for="(value, key) in data" :key="key" class="text-left mb-2">
			<b class="block text-xs text-gray-500">{{ key }}:</b>
			<pre class="inline-block">{{ value }}</pre>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

const BOX_INITIALLY_VISIBLE = window.localStorage.getItem('DEBUG')
	? window.localStorage.getItem('DEBUG') === '1'
	: process.env.NODE_ENV !== 'production';

@Component
export default class DebugBox extends Vue {
	@Prop({ default: {} })
	readonly data!: { [key: string]: any };

	visible: boolean = BOX_INITIALLY_VISIBLE;

	created() {
		window.addEventListener('keypress', this.onKeypress);
	}

	destroyed() {
		window.removeEventListener('keypress', this.onKeypress);
	}

	onKeypress(e: KeyboardEvent) {
		if (e.charCode === 96) {
			this.visible = !this.visible;
		}
	}
}
</script>
