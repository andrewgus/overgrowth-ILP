<template>
	<FeatureSection
		:title="title"
		feature-type="practice"
		:canContinue="canContinue"
	>
		<p>TEST</p>
	</FeatureSection>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import FeatureSection from '../components/features/FeatureSection.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	const canContinue = ref<boolean>(true)
</script>

<style module lang="scss">
	.practice {
		color: var(--black);
	}
</style>
