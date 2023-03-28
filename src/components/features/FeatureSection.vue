<template>
	<section class="section feature" :class="$style[featureType]">
		<div>
			<h2>{{ title }}</h2>
			<slot></slot>
			<ContinueBtn
				v-if="
					areSectionsAvailable && Object.keys($allSections).at(-1) !== sectionID
				"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import {
		useDoesFeatureExist,
		allSectionsMap,
		type FeatureType,
	} from '../../store/lessonStore.js'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import useCreateID from '../../composables/useCreateID'
	import ContinueBtn from './ContinueBtn.vue'

	const $allSections = useStore(allSectionsMap)
	const areSectionsAvailable = useAreSectionsAvailable()

	interface Props {
		featureType: FeatureType
		title: string
	}

	const props = defineProps<Props>()

	const sectionID = useCreateID(props.title)
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
