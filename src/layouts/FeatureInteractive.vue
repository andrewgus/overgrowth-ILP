<template>
	<section class="section feature" :class="$style[featureType]">
		<div>
			<h2>{{ title }}</h2>
			<component :is="feature" v-bind="conditionalProps">
				<slot></slot>
			</component>
		</div>
		<FeatureCompleteBtn :id="sectionID" />
	</section>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue'
	import { useDoesFeatureExist, type FeatureType } from '../store/lessonStore'
	import {
		canContinueStore,
		initCanContinueStore,
		initPdfGeneratorStatusStore,
	} from '../components/features/featureOptionsStore'
	import useCreateID from '../composables/useCreateID'
	import FeatureCompleteBtn from '../components/features/FeatureCompleteBtn.vue'
	import { computed } from '@vue/reactivity'

	interface Props {
		featureType: FeatureType
		title: string
		prompt: string
		toSave?: boolean
		isFinaleReveal?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		toSave: false,
		isFinaleReveal: false,
	})
	const sectionID = useCreateID(props.title)

	const feature = defineAsyncComponent(() =>
		import(
			`../components/features/${props.featureType}/${
				props.featureType.charAt(0).toUpperCase() + props.featureType.slice(1)
			}Option.vue`
		).finally(() => {
			useDoesFeatureExist(props.featureType)
		})
	)

	const conditionalProps = computed(() => {
		switch (props.featureType) {
			case 'reflection':
				return {
					id: sectionID,
					prompt: props.prompt,
					isFinaleReveal: props.isFinaleReveal,
					toSave: props.toSave,
				}
			case 'practice':
				return {
					id: sectionID,
					prompt: props.prompt,
				}

			case 'choice':
				return {
					id: sectionID,
					prompt: props.prompt,
				}
		}
	})

	initCanContinueStore(sectionID)
	if (props.toSave) initPdfGeneratorStatusStore(sectionID)

	// FOR TESTING
	if (props.featureType === 'choice' || props.featureType === 'practice')
		canContinueStore[sectionID].attemptFinished = true
</script>

<style lang="scss" module>
	.reflection > div,
	.practice > div,
	.choice > div {
		font-size: var(--s0);
		margin: 0 auto;
		max-width: 60ch;
		width: 100%;
	}
</style>
