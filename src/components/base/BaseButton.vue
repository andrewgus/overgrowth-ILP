<template>
	<button
		v-if="!link"
		type="button"
		:class="btnStyles"
		:disabled="isDisabled"
		autocomplete="off"
		@click="$emit('btnClick', $event)"
	>
		{{ text }}
	</button>
	<a v-else :href="url" :class="btnStyles">{{ text }}</a>
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
	@use '../../styles/mixins/buttons.scss';
	@use '../../styles/mixins/shadows.scss';

	.btn {
		@include buttons.primary();
		@include shadows.blueDropShadow();
		border-radius: var(--s10);
		text-decoration: none;
		line-height: 1.6;

		&.warning {
			@include buttons.warning();
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
