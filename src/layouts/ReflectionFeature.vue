<template>
	<FeatureSection feature-type="reflection" :title="title">
		<FinaleReflectionsReveal v-if="isFinaleReveal" :prompt="prompt" />
		<ReflectionInput
			v-else
			:prompt="prompt"
			@userTyped="checkCompleted"
			:id="sectionID"
		>
			<slot></slot>
		</ReflectionInput>
	</FeatureSection>
</template>

<script setup lang="ts">
	import { reactive, provide } from 'vue'
	import FinaleReflectionsReveal from '../components/features/reflection/FinaleReflectionsReveal.vue'
	import useCreateID from '../composables/useCreateID'
	import FeatureSection from '../components/features/FeatureSection.vue'
	import ReflectionInput from '../components/features/reflection/ReflectionInput.vue'

	// TODO: how much of the repeating code in each of these Feature layouts can be placed inside the FeatureSection component? Can I make one singe Feature layout with dynamic component based on prop (this includes all of this repeat code), and then that component (reflection, practice, or choice) has all the possible feature options. Would bring the featureComplete btn up a level and inject would no longer be required. Would create a big issue with the numerous props required (and different based on if the feature is of a specific type). That might make it not work. Need to think this through more. Some parts would be easier to go with a single feature layout and some parts would be easier with layouts for each feature type... need to weigh the pros and cons here...

	interface props {
		title: string
		prompt: string
		toSave?: boolean
		isFinaleReveal?: boolean
	}

	const props = withDefaults(defineProps<props>(), {
		toSave: false,
		isFinaleReveal: false,
	})

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
