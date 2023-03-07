<template>
	<section
		v-show="$features[featureType]"
		class="section feature"
		:class="$style[featureType]"
	>
		<div>
			<h2>{{ title }}</h2>
			<p v-if="prompt">{{ prompt }}</p>
			<slot></slot>
			<ContinueBtn :canContinue="canContinue" />
		</div>
	</section>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import {
		featuresMap,
		useDoesFeatureExist,
		type FeatureType,
	} from '../../store/lessonStore.js'
	import ContinueBtn from './ContinueBtn.vue'

	interface Props {
		featureType: FeatureType
		title: string
		prompt?: string
		canContinue: boolean
	}

	const props = defineProps<Props>()
	const $features = useStore(featuresMap)

	useDoesFeatureExist(props.featureType)
</script>

<style lang="scss" module>
	.reflection > div,
	.practice > div,
	.choice > div {
		font-size: var(--s0);
		margin: 0 auto;
		max-width: 60ch;
		widows: 100%;
	}
</style>
