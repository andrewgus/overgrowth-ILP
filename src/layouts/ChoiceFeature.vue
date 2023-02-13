<template>
	<section
		v-show="useStore(FeatureSettingsStore.features).value.choice"
		class="feature"
		:class="$style.choiceFeature"
	>
		<h2>{{ title }}</h2>
		<p></p>
	</section>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'

	import { NavigationStore, FeatureSettingsStore } from '../store'

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	FeatureSettingsStore.useDoesFeatureExist('choice')
</script>

<style module lang="scss">
	.choiceFeature {
		color: var(--black);
	}
</style>
