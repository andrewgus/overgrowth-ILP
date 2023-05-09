<template>
	<article class="section feature" :class="featureType" tabindex="-1">
		<h2>{{ title }}</h2>
		<BaseAlertText
			:show="
				!isFinaleReveal && !featureProgressStore[sectionID].isAttemptsFinished
			"
		>
			Heads&nbsp;up!&nbsp;Once&nbsp;completed, this&nbsp;{{
				featureType
			}}&nbsp;activity
			<strong>cannot</strong>&nbsp;be&nbsp;turned&nbsp;off&nbsp;later.
		</BaseAlertText>
		<component :is="feature" v-bind="conditionalProps">
			<slot></slot>
		</component>
		<FeatureCompleteBtns :class="$style.featureCompleteBtns" :id="sectionID" />
	</article>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent } from 'vue'
	import { useDoesFeatureExist, type FeatureType } from '../store/lessonStore'
	import {
		initFeatureProgressStore,
		featureProgressStore,
	} from '../store/featureOptionsStore'
	import createID from '../composables/useCreateID'
	import FeatureCompleteBtns from '../components/features/FeatureCompleteBtns.vue'
	import BaseAlertText from '../components/base/BaseAlertText.vue'

	type Props = {
		featureType: FeatureType
		title: string
		prompt: string
		isFinaleReveal?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		toSave: false,
		isFinaleReveal: false,
	})
	const sectionID = createID(props.title)
	initFeatureProgressStore(sectionID)

	const feature = defineAsyncComponent(() =>
		import(
			`../components/features/${
				props.featureType.charAt(0).toUpperCase() + props.featureType.slice(1)
			}SwitchBoard.vue`
		).finally(() => {
			useDoesFeatureExist(props.featureType)
			// only need setLocksHandler && updateLocalStorage scripts if features are being used within a given lesson
			import('../scripts/setLocksHandler.js')
			import('../scripts/updateLocalStorage.js')
		})
	)

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

<style module lang="scss">
	p[class*='alertText'] {
		align-self: start;
	}
	
	.featureCompleteBtns {
		align-self: end;
		display: grid;
		grid-template-rows: [pdfSave-Start] min-content [pdfSave-indicator] min-content [indicator-end];
		grid-template-columns: [topLine] 1fr [bottomLine];
		align-items: end;
		justify-content: center;
		margin: var(--s2) auto;
	}
</style>
