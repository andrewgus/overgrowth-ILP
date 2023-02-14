<template>
	<section
		v-show="features.practice"
		class="feature"
		:class="$style.practiceFeature"
	>
		<h2>{{ title }}</h2>
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

	FeatureSettingsStore.useDoesFeatureExist('practice')
</script>

<style module lang="scss">
	.practiceFeature {
		color: var(--black);
	}
</style>
