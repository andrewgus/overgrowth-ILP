<template>
	<div :class="$style.titleCard">
		<h1 id="lessonHeading" tabindex="-1">{{ title }}</h1>
		<fieldset :class="$style.options" v-if="featuresOn">
			<legend aria-describedby="featureToggleInstructions">
				Included in this lesson are&hellip;
				<span :class="$style.instructions"
					>(You&nbsp;can toggle&nbsp;activities on/off)</span
				>
			</legend>
			<div v-if="useFeatureExists('reflection')">
				<BaseSwitch
					type="Reflection"
					:set="getFeatureValue('reflection')"
					@toggleSwitch="useToggleFeature('reflection')"
				/>
			</div>
			<BaseSeparator
				orientation="vertical"
				hidden
				v-if="multiFeatures.reflectionAndOther"
			/>
			<div v-if="useFeatureExists('practice')">
				<BaseSwitch
					type="Practice"
					:set="getFeatureValue('practice')"
					@toggleSwitch="useToggleFeature('practice')"
				/>
			</div>
			<BaseSeparator
				orientation="vertical"
				hidden
				v-if="multiFeatures.practiceAndChoice"
			/>
			<div v-if="useFeatureExists('choice')">
				<BaseSwitch
					type="Choice"
					:set="getFeatureValue('choice')"
					@toggleSwitch="useToggleFeature('choice')"
				/>
			</div>
		</fieldset>
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
	@use '../../styles/mixins.scss';
	.titleCard {
		grid-area: card-start/landing-top/card-indicator/landing-bottom;
		justify-self: center;
		align-self: start;
		display: flex;
		align-items: center;
		flex-flow: column nowrap;
		justify-content: space-between;
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
		border: 0;
		padding: 0 0 0 0;
		margin: var(--s-2) 0 0 0;
		display: flex;
		justify-content: center;
		flex-flow: row nowrap;
		gap: var(--s-5);

		> legend {
			text-align: center;
			margin: 0 auto var(--s-4);
			> .instructions {
				@include mixins.visuallyHidden();
			}
		}
		&:hover .instructions,
		&:focus-within .instructions {
			all: unset;
			@include mixins.basicTransition();
			display: block;
			padding: 0 var(--s-10);
			margin-top: var(--s-4);
			background-color: var(--yellow5);
			border-radius: var(--s-10);
			@include mixins.darkBorder();
		}
		> div {
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
