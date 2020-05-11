<template>
	<v-popover placement="down" boundariesElement="body">
		<button class="tooltip-target flex"><Dots :class="dotsClass" /></button>

		<template slot="popover">
			<div
				class="bg-gray-800 border border-gray-700 shadow px-2 py-1 rounded text-gray-200 text-sm"
			>
				<button
					class="block hover:text-gray-400  w-full text-left"
					v-for="item in items"
					:key="item"
					@click="clicked(item)"
					v-close-popover
				>
					{{ item }}
				</button>
			</div>
		</template>
	</v-popover>
</template>
<script lang="ts">
import { BaseComponent, Component, Prop } from '@/component';
import { Emit } from 'vue-property-decorator';

import Dots from '@/components/icons/Dots.vue';

@Component({
	components: {
		Dots
	}
})
export default class MoreButton extends BaseComponent {
	@Prop({ default: () => {} })
	readonly items!: object;

	@Prop({ default: '' })
	readonly dotsClass!: string;

	@Emit('click')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	clicked(item: string) {}
}
</script>
