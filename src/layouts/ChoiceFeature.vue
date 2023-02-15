<template>
	<section v-show="features.choice" class="feature" :class="$style.choice">
		<h2>{{ title }}</h2>
		<p></p>
	</section>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import {
		featuresMap,
		useDoesFeatureExist,
	} from '../store/FeatureSettingsStore'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	const features = useStore(featuresMap)

	useDoesFeatureExist('choice')
</script>

<style module lang="scss">
	.choice {
		color: var(--black);
	}
</style>
