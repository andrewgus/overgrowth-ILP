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

	const props = defineProps({
		isFinaleReveal: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		prompt: {
			type: String,
			required: true,
		},
	})

	const sectionID = useCreateID(props.title)
	const canContinue = ref<boolean>(false)

	const checkCompleted = (value: string) => {
		if (value.length > 15) {
			canContinue.value = true
		} else {
			canContinue.value = false
		}
	}
	provide('isFeatureComplete', canContinue)
</script>
