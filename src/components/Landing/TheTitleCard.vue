<template>
	<div :class="$style.titleCard">
		<h1>{{ title }}</h1>
		<div v-if="featuresOn">
			<p>Included in this lesson are&hellip;</p>
			<!-- TESTING 👇 -->
			<p>STORE CHOICE: {{ useStore(featureSettings.isChoiceOn).value }}</p>
			<p>CHOICE: {{ getFeature('isChoiceOn') }}</p>
			<!-- TESTING 👆 -->
			<!-- TODO: FIX this so that, if a feature is off, that is sent to store to turn off feature there too. -->
			<ul
				aria-label="each item can be toggled on and off for this lesson"
				:class="$style.options"
			>
				<li>
					<BaseSwitch
						v-if="getFeature('isReflectionOn')"
						@toggleSwitch="featureSettings.reflectionToggle"
						:set="getFeature('isReflectionOn')"
						type="Reflection"
					/>
				</li>
				<BaseSeparator hidden v-if="multiFeatures.reflectionAndOther" />
				<li>
					<BaseSwitch
						v-if="isPracticeOn"
						@toggleSwitch="featureSettings.practiceToggle"
						:set="getFeature('isPracticeOn')"
						type="Practice"
					/>
				</li>
				<BaseSeparator hidden v-if="multiFeatures.practiceAndChoice" />
				<li>
					<BaseSwitch
						v-if="isChoiceOn"
						@toggleSwitch="featureSettings.choiceToggle"
						:set="getFeature('isChoiceOn')"
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
	import { useStore } from '@nanostores/vue'
	import { featureSettings } from '../../store/index.js'
	import BaseSwitch from '../base/BaseSwitch.vue'
	import BaseSeparator from '../base/BaseSeparator.vue'

	export interface Props {
		title: string
		isReflectionOn?: boolean
		isPracticeOn?: boolean
		isChoiceOn?: boolean
	}
	const props = defineProps<Props>()

	const getFeature = (
		featureType: 'isReflectionOn' | 'isPracticeOn' | 'isChoiceOn'
	) => {
		return useStore(featureSettings[featureType]).value
	}

	const featuresOn = computed(() => {
		// return props.isChoiceOn || props.isPracticeOn || props.isChoiceOn
		return (
			getFeature('isReflectionOn') ||
			getFeature('isPracticeOn') ||
			getFeature('isChoiceOn')
		)
	})
	const multiFeatures = computed(() => {
		const reflectionAndOther =
			(getFeature('isReflectionOn') && getFeature('isPracticeOn')) ||
			(getFeature('isReflectionOn') && getFeature('isChoiceOn'))
		const practiceAndChoice =
			getFeature('isPracticeOn') && getFeature('isChoiceOn')

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
