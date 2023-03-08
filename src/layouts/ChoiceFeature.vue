<template>
	<FeatureSection
		feature-type="choice"
		:title="title"
		:canContinue="canContinue"
	>
		<slot></slot>
	</FeatureSection>
</template>

<script setup lang="ts">
	import { ref, provide } from 'vue'
	import FeatureSection from '../components/features/FeatureSection.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	const canContinue = ref<boolean>(true)
	provide('isFeatureComplete', canContinue)
</script>
