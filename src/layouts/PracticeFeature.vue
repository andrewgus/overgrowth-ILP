<template>
	<FeatureSection feature-type="practice" :title="title">
		<slot></slot>
	</FeatureSection>
</template>

<script setup lang="ts">
	import { ref, provide } from 'vue'
	import FeatureSection from '../components/features/FeatureSection.vue'

	interface props {
		title: string
		toSave?: boolean
	}

	const props = defineProps<props>()

	const canContinue = ref<boolean>(true)
	provide('isFeatureComplete', canContinue)
	provide('saveWorkAsPDF', props.toSave)
</script>
