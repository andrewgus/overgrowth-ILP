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
		<FinaleReveal v-else :prompt="prompt" />
	</FeatureSection>
</template>

<script setup lang="ts">
	import { ref, provide } from 'vue'
	import FinaleReveal from '../components/features/reflection/FinaleReveal.vue'
	import useCreateID from '../composables/useCreateID'
	import FeatureSection from '../components/features/FeatureSection.vue'
	import ReflectionInput from '../components/features/reflection/ReflectionInput.vue'

	// TODO: these provides are the same across the features. Figure out how to NOT repeat this. Do they belong in the FeatureSection component? How should I best go from a lesson layout directly to continueBtn component, without repeating?

	interface props {
		isFinaleReveal: boolean
		title: string
		prompt: string
		toSave?: boolean
	}

	const props = defineProps<props>()
	

	const sectionID = useCreateID(props.title)
	const canContinue = ref<boolean>(false)

	const checkCompleted = (value: string) => {
		if (value.length > 25) {
			canContinue.value = true
		} else {
			canContinue.value = false
		}
	}
	provide('isFeatureComplete', canContinue)
	provide('saveWorkAsPDF', props.toSave)
</script>
