<template>
	<FeatureSection feature-type="practice" :title="title">
		<slot></slot>
	</FeatureSection>
</template>

<script setup lang="ts">
	import { reactive, provide } from 'vue'
	import FeatureSection from '../components/features/FeatureSection.vue'
	import useCreateID from '../composables/useCreateID'

	interface props {
		title: string
		toSave?: boolean
	}

	const props = defineProps<props>()

	const sectionID = useCreateID(props.title)

	const canContinueFrom = reactive({
		id: sectionID,
		isComplete: true,
	})

	provide('isFeatureComplete', canContinueFrom)
	provide('willSaveAsPDF', props.toSave)
</script>
