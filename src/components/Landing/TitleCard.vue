<template>
	<div class="titleCard">
		<h1>{{ title }}</h1>
		<div v-if="featuresOn">
			<p>Included in this lesson are&hellip;</p>
			<ul class="options">
				<ToggleFeature
					v-if="isReflectionOn"
					@click="featureSettings.reflectionToggle"
					:set="useStore(featureSettings.isReflectionOn).value"
					type="Reflection"
				/>
				<div
					v-if="
						(isReflectionOn && isPracticeOn) || (isReflectionOn && isChoiceOn)
					"
					role="separator"
					aria-hidden="true"
					aria-orientation="vertical"
				></div>
				<ToggleFeature
					v-if="isPracticeOn"
					@click="featureSettings.practiceToggle"
					:set="useStore(featureSettings.isPracticeOn).value"
					type="Practice"
				/>
				<div
					v-if="isPracticeOn && isChoiceOn"
					role="separator"
					aria-hidden="true"
					aria-orientation="vertical"
				></div>
				<ToggleFeature
					v-if="isChoiceOn"
					@click="featureSettings.choiceToggle"
					:set="useStore(featureSettings.isChoiceOn).value"
					type="Choice"
				/>
			</ul>
			<!-- /.options -->
		</div>
	</div>
	<!-- /.info -->
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { computed, withDefaults } from 'vue'
	import { isChoiceOn } from '../../store/FeatureSettings'
	import featureSettings from '../../store/index.js'

	import ToggleFeature from '../base/ToggleSwitch.vue'

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
</script>

<style scoped>
	.titleCard {
		grid-area: 1/1/-1/-1;
		justify-self: center;
		align-self: start;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		border-radius: 30px;
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
		margin-bottom: var(--s-3);
	}
	.options {
		padding-left: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		flex-flow: row nowrap;
		gap: var(--s-5);
	}
	.options > div[role='separator'] {
		flex-grow: 0;
		border: 1.25px solid var(--lightGray);
		border-radius: var(--s5);
	}
</style>
