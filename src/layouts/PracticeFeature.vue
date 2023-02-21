<template>
	<FeatureSection :title="title" feature-type="practice">
		<p>TEST</p>
	</FeatureSection>
</template>

<script setup lang="ts">
	import FeatureSection from '../components/features/FeatureSection.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})
</script>

<style module lang="scss">
	.practice {
		color: var(--black);
	}
</style>
