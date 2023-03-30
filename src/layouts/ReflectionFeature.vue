<template>
	<FeatureSection feature-type="reflection" :title="title">
		<ReflectionInput
			v-if="!isFinaleReveal"
			:prompt="prompt"
			@userTyped="checkCompleted"
			:id="sectionID"
		>
			<slot></slot>
		</ReflectionInput>
		<FinaleReflectionsReveal v-else :prompt="prompt" />
	</FeatureSection>
</template>

<script setup lang="ts">
	import { reactive, provide } from 'vue'
	import FinaleReflectionsReveal from '../components/features/reflection/FinaleReflectionsReveal.vue'
	import useCreateID from '../composables/useCreateID'
	import FeatureSection from '../components/features/FeatureSection.vue'
	import ReflectionInput from '../components/features/reflection/ReflectionInput.vue'

	interface props {
		isFinaleReveal: boolean
		title: string
		prompt: string
		toSave?: boolean
	}

	const props = defineProps<props>()

	const sectionID = useCreateID(props.title)

	const canContinueFrom = reactive({
		id: sectionID,
		isComplete: false,
	})

	const checkCompleted = (value: string) => {
		if (value.length > 25) {
			canContinueFrom.isComplete = true
		} else {
			canContinueFrom.isComplete = false
		}
	}
	provide('isFeatureComplete', canContinueFrom)
	provide('willSaveAsPDF', props.toSave)
</script>
