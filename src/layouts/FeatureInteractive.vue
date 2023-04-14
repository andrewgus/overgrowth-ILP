<template>
	<section class="section feature" :class="$style[featureType]">
		<div>
			<h2>{{ title }}</h2>
			<component :is="feature" v-bind="conditionalProps">
				<slot></slot>
			</component>
		</div>
		<FeatureCompleteBtns :id="sectionID" />
	</section>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue'
	import { useDoesFeatureExist, type FeatureType } from '../store/lessonStore'
	import { initFeatureProgressStore } from '../components/features/featureOptionsStore'
	import useCreateID from '../composables/useCreateID'
	import FeatureCompleteBtns from '../components/features/FeatureCompleteBtns.vue'
	import { computed } from '@vue/reactivity'

	interface Props {
		featureType: FeatureType
		title: string
		prompt: string
		isFinaleReveal?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		toSave: false,
		isFinaleReveal: false,
	})

	const feature = defineAsyncComponent(() =>
		import(
			`../components/features/${props.featureType}/${
				props.featureType.charAt(0).toUpperCase() + props.featureType.slice(1)
			}Options.vue`
		).finally(() => {
			useDoesFeatureExist(props.featureType)
		})
	)

	const sectionID = useCreateID(props.title)
	initFeatureProgressStore(sectionID)

	const conditionalProps = computed(() => {
		const universalProps = {
			id: sectionID,
			prompt: props.prompt,
		}
		let featureProps: {}
		switch (props.featureType) {
			case 'reflection':
				featureProps = {
					isFinaleReveal: props.isFinaleReveal,
				}
				break
			case 'practice':
				featureProps = {}
				break
			case 'choice':
				featureProps = {}
				break
		}
		return { ...universalProps, ...featureProps }
	})
</script>

<style lang="scss" module>
	.reflection,
	.choice,
	.practice {
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;

		> div {
			font-size: var(--s0);
			max-width: 60ch;
			width: 100%;
			margin: 0 auto;
		}
	}
</style>
