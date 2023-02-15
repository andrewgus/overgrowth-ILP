<template>
	<section v-show="features.practice" class="feature" :class="$style.practice">
		<h2>{{ title }}</h2>
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

	useDoesFeatureExist('practice')
</script>

<style module lang="scss">
	.practice {
		color: var(--black);
	}
</style>
