<template>
	<section
		v-show="features.choice"
		class="feature"
		:class="$style.choiceFeature"
	>
		<h2>{{ title }}</h2>
		<p></p>
	</section>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { FeatureSettingsStore } from '../store'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	const features = useStore(FeatureSettingsStore.features)

	FeatureSettingsStore.useDoesFeatureExist('choice')
</script>

<style module lang="scss">
	.choiceFeature {
		color: var(--black);
	}
</style>
