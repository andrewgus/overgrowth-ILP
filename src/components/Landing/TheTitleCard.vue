<template>
	<div class="titleCard">
		<h1>{{ title }}</h1>
		<div v-if="featuresOn">
			<p>Included in this lesson are&hellip;</p>
			<!-- TODO: Incorporate some sort of aria-label/description to signal that the user has the options to turn these features on and off -->
			<ul class="options">
				<li>
					<BaseSwitch
						v-if="isReflectionOn"
						@toggleSwitch="featureSettings.reflectionToggle"
						:set="useStore(featureSettings.isReflectionOn).value"
						type="Reflection"
					/>
				</li>
				<BaseSeparator hidden v-if="multiFeatures.reflectionAnd" />
				<li>
					<BaseSwitch
						v-if="isPracticeOn"
						@toggleSwitch="featureSettings.practiceToggle"
						:set="useStore(featureSettings.isPracticeOn).value"
						type="Practice"
					/>
				</li>
				<BaseSeparator hidden v-if="multiFeatures.practiceAndChoice" />
				<li>
					<BaseSwitch
						v-if="isChoiceOn"
						@toggleSwitch="featureSettings.choiceToggle"
						:set="useStore(featureSettings.isChoiceOn).value"
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
	import { useStore } from '@nanostores/vue'
	import { computed, withDefaults } from 'vue'
	import { featureSettings } from '../../store/index.js'

	import BaseSwitch from '../base/BaseSwitch.vue'
	import BaseSeparator from '../base/BaseSeparator.vue'

	export interface Props {
		title: string
		isReflectionOn?: boolean
		isPracticeOn?: boolean
		isChoiceOn?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		isReflectionOn: false,
		isPracticeOn: false,
		isChoiceOn: false,
	})

	const featuresOn = computed(() => {
		return props.isChoiceOn || props.isPracticeOn || props.isChoiceOn
	})
	const multiFeatures = computed(() => {
		const reflectionAnd =
			(props.isReflectionOn && props.isPracticeOn) ||
			(props.isReflectionOn && props.isChoiceOn)
		const practiceAndChoice = props.isPracticeOn && props.isChoiceOn

		return { reflectionAnd, practiceAndChoice }
	})
</script>

<style scoped>
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
	}
	.titleCard h1 {
		margin: 0;
		text-align: center;
	}
	.titleCard p {
		text-align: center;
		margin: var(--s-3);
	}
	.options {
		padding-left: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		flex-flow: row nowrap;
		gap: var(--s-5);
	}
	li {
		list-style: none;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: start;
	}

	/* media queries */
	@media only screen and (max-width: 950px) {
		.titleCard h1 {
			line-height: 1.1;
		}
		.titleCard p {
			margin: var(--s-6);
		}
	}
	@media only screen and (max-height: 950px) {
		.titleCard {
			padding: var(--s-10);
			margin-top: 0;
		}
	}
</style>


