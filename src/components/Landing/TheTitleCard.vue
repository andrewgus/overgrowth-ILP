<template>
	<div :class="$style.titleCard">
		<h1>{{ title }}</h1>
		<div v-if="featuresOn">
			<p>Included in this lesson are&hellip;</p>
			<!-- TODO: FIX this so that, if a feature is off, that is sent to store to turn off feature there too. -->
			<ul
				aria-label="each item can be toggled on and off for this lesson"
				:class="$style.options"
			>
				<li>
					<BaseSwitch
						v-if="useFeatureExists('reflection')"
						@toggleSwitch="featureSettings.reflectionToggle"
						:set="useGetFeature('reflection')"
						type="Reflection"
					/>
				</li>
				<BaseSeparator hidden v-if="multiFeatures.reflectionAndOther" />
				<li>
					<BaseSwitch
						v-if="useFeatureExists('practice')"
						@toggleSwitch="featureSettings.practiceToggle"
						:set="useGetFeature('practice')"
						type="Practice"
					/>
				</li>
				<BaseSeparator hidden v-if="multiFeatures.practiceAndChoice" />
				<li>
					<BaseSwitch
						v-if="useFeatureExists('choice')"
						@toggleSwitch="featureSettings.choiceToggle"
						:set="useGetFeature('choice')"
						type="Choice"
					/>
				</li>
			</ul>
			<!-- /.options -->
		</div>
	</div>
	<!-- /.info -->
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import BaseSwitch from '../base/BaseSwitch.vue'
	import BaseSeparator from '../base/BaseSeparator.vue'
	import { featureSettings } from '../../store/index.js'
	import {
		useGetFeature,
		useFeatureExists,
	} from '../../composables/useFeatureHelpers'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	const featuresOn = computed(() => {
		useFeatureExists('reflection')
		return (
			useFeatureExists('reflection') ||
			useFeatureExists('practice') ||
			useFeatureExists('choice')
		)
	})
	const multiFeatures = computed(() => {
		const reflectionAndOther =
			(useFeatureExists('reflection') && useFeatureExists('practice')) ||
			(useFeatureExists('reflection') && useFeatureExists('choice'))
		const practiceAndChoice =
			useFeatureExists('practice') && useFeatureExists('choice')

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
