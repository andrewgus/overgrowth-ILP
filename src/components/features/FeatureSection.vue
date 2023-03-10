<template>
	<section
		class="section feature"
		:class="$style[featureType]"
	>
		<div>
			<h2>{{ title }}</h2>
			<slot></slot>
			<ContinueBtn />
		</div>
	</section>
</template>

<script setup lang="ts">
	import {
		useDoesFeatureExist,
		type FeatureType,
	} from '../../store/lessonStore.js'
	import ContinueBtn from './ContinueBtn.vue'

	interface Props {
		featureType: FeatureType
		title: string
	}

	const props = defineProps<Props>()

	useDoesFeatureExist(props.featureType)
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
