<template>
	<button
		v-if="!link"
		type="button"
		:class="btnStyles"
		:disabled="isDisabled"
		autocomplete="off"
		@click="$emit('btnClick', $event)"
	>
		<span v-if="!!srText" class="visuallyHidden">{{ srText }}:&nbsp;</span
		>{{ text }}
	</button>
	<a v-else :href="url" :class="btnStyles"
		><span v-if="!!srText" class="visuallyHidden">{{ srText }}:&nbsp;</span>
		{{ text }}</a
	>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import computedCssModule from '../../composables/UseComputedCssModule'

	const props = defineProps({
		text: {
			type: String,
			required: true,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		srText: {
			type: String,
		},
		isWarning: {
			type: Boolean,
		},
		link: {
			type: Boolean,
		},
		url: {
			type: String,
		},
	})

	const computedConditionalClasses = new Map([
		[computed(() => props.isDisabled), 'disabled'],
		[computed(() => props.isWarning), 'warning'],
	])
	const btnStyles = computedCssModule('btn', computedConditionalClasses)
</script>

<style module lang="scss">
	@use '../../styles/mixins/containerStyles.scss';
	@use '../../styles/mixins/shadows.scss';
	@use '../../styles/mixins/transitions.scss';

	.btn {
		@include containerStyles.flexCenter();
		color: var(--black);
		cursor: pointer;
		border: 1px solid var(--darkGray);
		padding: var(--s-4) var(--s-2);
		background-color: var(--lightBlue);
		border-radius: var(--s10);
		text-decoration: none;
		line-height: 1.6;
		@include shadows.blueDropShadow();
		@include transitions.button();

		&:hover,
		&:focus {
			background-color: var(--peach);
			filter: none;
		}

		&:hover {
			color: var(--blue);
			@include shadows.hoverBoxShadow();
		}

		&:focus {
			z-index: 10;
		}

		&.warning {
			background-color: var(--red);
			color: var(--white);
			&:hover {
				color: var(--red-3);
				background-color: var(--peach);
				@include shadows.hoverBoxShadowWarning();
			}
		}

		&.disabled {
			cursor: not-allowed;
			background-color: var(--lightGray);
			filter: drop-shadow(0px 0px 0 var(--blue));
			opacity: 0.75;

			&:hover {
				color: inherit;
				background-color: var(--lightGray);
				box-shadow: none;
			}
		}
	}
</style>
