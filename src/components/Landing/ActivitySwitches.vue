<template>
	<fieldset :class="$style.options" v-if="areSectionsAvailable && activitiesOn">
		<legend aria-describedby="activityToggleInstructions">
			This lesson includes&hellip;
			<span :class="$style.instructions"
				>(You&nbsp;can toggle activities on/off)</span
			>
		</legend>
		<BaseSwitch
			v-if="useActivityExists('reflection')"
			switchName="Reflection"
			:set="getActivityValue('reflection')"
			@toggleSwitch="useToggleActivity('reflection')"
		/>
		<BaseSwitch
			v-if="useActivityExists('practice')"
			switchName="Practice"
			:set="getActivityValue('practice')"
			@toggleSwitch="useToggleActivity('practice')"
		/>
		<BaseSwitch
			v-if="useActivityExists('choice')"
			switchName="Choice"
			:set="getActivityValue('choice')"
			@toggleSwitch="useToggleActivity('choice')"
		/>
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
	import BaseSwitch from '../base/BaseSwitch.vue'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import { onKeyStroke } from '@vueuse/core'
	const { areSectionsAvailable } = useAreSectionsAvailable()

	const $activities = useStore(activitiesMap)

	const getActivityValue = (activity: ActivityType) => {
		return $activities.value[activity] as boolean
	}

	const focusOnNextButton = (el: HTMLButtonElement, dir: 'left' | 'right') => {
		if (
			dir === 'left' &&
			el.previousElementSibling instanceof HTMLButtonElement
		)
			el.previousElementSibling.focus()

		if (dir === 'right' && el.nextElementSibling instanceof HTMLButtonElement)
			el.nextElementSibling.focus()
	}
	onKeyStroke('ArrowLeft', ({ target }) => {
		focusOnNextButton(target as HTMLButtonElement, 'left')
	})
	onKeyStroke('ArrowRight', ({ target }) => {
		focusOnNextButton(target as HTMLButtonElement, 'right')
	})

	const activitiesOn = computed(() => {
		return (
			useActivityExists('reflection') ||
			useActivityExists('practice') ||
			useActivityExists('choice')
		)
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
		flex-flow: row wrap;
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
