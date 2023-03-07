<template>
	<FeatureSection
		feature-type="choice"
		:title="title"
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
	.choice {
		color: var(--black);
	}
</style>
