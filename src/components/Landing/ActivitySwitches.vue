<template>
	<fieldset :class="$style.options" v-if="areSectionsAvailable && activitiesOn">
		<legend aria-describedby="activityToggleInstructions">
			Included in this lesson are&hellip;
			<span :class="$style.instructions"
				>(You&nbsp;can toggle&nbsp;activities on/off)</span
			>
		</legend>
		<div v-if="useActivityExists('reflection')">
			<BaseSwitch
				type="Reflection"
				:set="getActivityValue('reflection')"
				@toggleSwitch="useToggleActivity('reflection')"
			/>
		</div>
		<BaseSeparator
			orientation="vertical"
			hidden
			v-if="multiActivities.reflectionAndOther"
		/>
		<div v-if="useActivityExists('practice')">
			<BaseSwitch
				type="Practice"
				:set="getActivityValue('practice')"
				@toggleSwitch="useToggleActivity('practice')"
			/>
		</div>
		<BaseSeparator
			orientation="vertical"
			hidden
			v-if="multiActivities.practiceAndChoice"
		/>
		<div v-if="useActivityExists('choice')">
			<BaseSwitch
				type="Choice"
				:set="getActivityValue('choice')"
				@toggleSwitch="useToggleActivity('choice')"
			/>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		activitiesMap,
		useActivityExists,
		useToggleActivity,
		type ActivityType,
	} from '../../store/lessonStore'
	import BaseSeparator from '../base/BaseSeparator.vue'
	import BaseSwitch from '../base/BaseSwitch.vue'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	const { areSectionsAvailable } = useAreSectionsAvailable()

	const $activities = useStore(activitiesMap)

	const twoActivities = (activity1: ActivityType, activity2: ActivityType) => {
		return useActivityExists(activity1) && useActivityExists(activity2)
	}
	const getActivityValue = (activity: ActivityType) => {
		return $activities.value[activity] as boolean
	}

	const activitiesOn = computed(() => {
		return (
			useActivityExists('reflection') ||
			useActivityExists('practice') ||
			useActivityExists('choice')
		)
	})
	const multiActivities = computed(() => {
		const reflectionAndOther =
			twoActivities('reflection', 'practice') ||
			twoActivities('reflection', 'choice')

		const practiceAndChoice = twoActivities('practice', 'choice')

		return { reflectionAndOther, practiceAndChoice }
	})
</script>

<style module lang="scss">
	@use '../../styles/mixins/accessibility.scss';
	@use '../../styles/mixins/transitions.scss';
	@use '../../styles/mixins/containerStyles.scss';
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
				@include accessibility.visuallyHidden();
			}
		}
		&:hover .instructions,
		&:focus-within .instructions {
			all: unset;
			@include transitions.short();
			display: block;
			padding: 0 var(--s-10);
			margin-top: var(--s-4);
			background-color: var(--yellow5);
			border-radius: var(--s-10);
			@include containerStyles.darkBorder();
		}
		> div {
			display: flex;
			flex-flow: column nowrap;
			align-items: center;
			justify-content: start;
		}
	}
</style>
