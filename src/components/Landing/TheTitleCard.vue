<template>
	<div :class="$style.titleCard">
		<h1>{{ title }}</h1>
		<div v-if="featuresOn">
			<p>Included in this lesson are&hellip;</p>
			<ul
				aria-label="each item can be toggled on and off for this lesson"
				:class="$style.options"
			>
				<li v-if="useFeatureExists('reflection')">
					<BaseSwitch
						type="Reflection"
						:set="getFeatureValue('reflection')"
						@toggleSwitch="useToggleFeature('reflection')"
					/>
				</li>
				<BaseSeparator
					orientation="vertical"
					hidden
					v-if="multiFeatures.reflectionAndOther"
				/>
				<li v-if="useFeatureExists('practice')">
					<BaseSwitch
						type="Practice"
						:set="getFeatureValue('practice')"
						@toggleSwitch="useToggleFeature('practice')"
					/>
				</li>
				<BaseSeparator
					orientation="vertical"
					hidden
					v-if="multiFeatures.practiceAndChoice"
				/>
				<li v-if="useFeatureExists('choice')">
					<BaseSwitch
						type="Choice"
						:set="getFeatureValue('choice')"
						@toggleSwitch="useToggleFeature('choice')"
					/>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		featuresMap,
		useFeatureExists,
		useToggleFeature,
		type FeatureType,
	} from '../../store/lessonStore'
	import type { localStorageDataObjProps } from '../../scripts/updateLocalStorage'
	import getLocalStorage from '../../composables/useGetLocalStorage'
	import BaseSeparator from '../base/BaseSeparator.vue'
	import BaseSwitch from '../base/BaseSwitch.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})
	const $features = useStore(featuresMap)

	const twoFeatures = (feature1: FeatureType, feature2: FeatureType) => {
		return useFeatureExists(feature1) && useFeatureExists(feature2)
	}
	const getFeatureValue = (feature: FeatureType) => {
		return $features.value[feature] as boolean
	}

	const featuresOn = computed(() => {
		return (
			useFeatureExists('reflection') ||
			useFeatureExists('practice') ||
			useFeatureExists('choice')
		)
	})
	const multiFeatures = computed(() => {
		const reflectionAndOther =
			twoFeatures('reflection', 'practice') ||
			twoFeatures('reflection', 'choice')

		const practiceAndChoice = twoFeatures('practice', 'choice')

		return { reflectionAndOther, practiceAndChoice }
	})
</script>

<style module lang="scss">
	.titleCard {
		grid-area: card-start/landing-top/card-indicator/landing-bottom;
		justify-self: center;
		align-self: start;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		border-radius: var(--s5);
		background-color: hsla(0deg, 0%, 98%, 0.5);
		filter: drop-shadow(0 0 var(--s1) var(--white));
		padding: var(--s0);
		margin-top: var(--s2);

		> h1 {
			margin: 0;
			text-align: center;
		}
		> div p {
			text-align: center;
			margin: var(--s-3);
		}
	}
	.options {
		padding-left: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		flex-flow: row nowrap;
		gap: var(--s-5);
		> li {
			list-style: none;
			display: flex;
			flex-flow: column nowrap;
			align-items: center;
			justify-content: start;
		}
	}

	/* media queries */
	@media only screen and (max-width: 950px) {
		.titleCard {
			> h1 {
				line-height: 1.1;
			}
			> p {
				margin: var(--s-6);
			}
		}
	}
	@media only screen and (max-height: 950px) and (max-width: 950px) {
		.titleCard {
			padding: var(--s-10);
			margin-top: 0;
			width: 100%;
		}
	}
</style>
