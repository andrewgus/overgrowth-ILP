<template>
	<FeatureSection feature-type="choice" :title="title">
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
	.choice {
		color: var(--black);
	}
</style>
