<template>
	<v-popover class="flex mr-5">
		<WidgetButton />
		<WidgetBody slot="popover" />
	</v-popover>
</template>
<script lang="ts">
import { BaseComponent, Component } from '@/component';

import WidgetButton from './WidgetButton.vue';
import WidgetBody from './WidgetBody.vue';

@Component({
	components: {
		WidgetButton,
		WidgetBody
	}
})
export default class SpotifyWidget extends BaseComponent {}
</script>
