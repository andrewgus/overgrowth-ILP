<template>
	<FeatureSection
		feature-type="reflection"
		:title="title"
		:canContinue="canContinue"
	>
		<ReflectionInput :prompt="prompt" @userTyped="checkCompleted">
			<slot></slot>
		</ReflectionInput>
	</FeatureSection>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import FeatureSection from '../components/features/FeatureSection.vue'
	import ReflectionInput from '../components/features/reflection/ReflectionInput.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
		prompt: {
			type: String,
			required: true,
		},
	})

	const canContinue = ref<boolean>(false)

	const checkCompleted = (value: string) => {
		if (value.length > 5) {
			console.log('what?')
			canContinue.value = true
		}
	}
</script>
