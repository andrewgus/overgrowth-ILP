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
	import computedCssModule from '../../composables/useComputedCssModule'
	import '../../styles/mixins.scss'

	const props = defineProps({
		text: {
			type: String,
			required: true,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		link: {
			type: Boolean,
		},
		url: {
			type: String,
		},
		isForNav: {
			type: Boolean,
		},
		isWarning: {
			type: Boolean,
		},
	})

	const computedConditionalClasses = new Map([
		[computed(() => props.isDisabled), 'disabled'],
		[computed(() => props.isForNav), 'btn__nav'],
		[computed(() => props.isWarning), 'btn__warning'],
	])
	const btnStyles = computedCssModule('btn', computedConditionalClasses)
</script>

<style module lang="scss">
	@use '../../styles/mixins.scss';

	.btn {
		@include mixins.flexCenter();
		color: var(--black);
		cursor: pointer;
		border: 1px solid var(--darkGray);
		padding: var(--s-4) var(--s-2);
		background-color: var(--lightBlue);
		border-radius: var(--s10);
		text-decoration: none;
		@include mixins.blueDropShadow();
		@include mixins.btnTransition();

		&:hover {
			filter: none;
			@include mixins.hoverBoxShadow();
		}
		&:not(.btn__nav):not(.btn__warning):hover {
			color: var(--blue);
			background-color: var(--peach);
			@include mixins.hoverBoxShadow();
		}
		&:focus {
			z-index: 10;
			&,
			&:hover {
				filter: drop-shadow(0px 0px 0 var(--blue));
			}
		}

		&__nav {
			&:hover,
			&:focus {
				outline: none;
				background-color: var(--blue);
				color: var(--white);
				z-index: 2;
			}
			&:visited:not(:hover):not(:focus) {
				color: var(--black);
			}
		}
		&__warning {
			background-color: var(--red);
			color: var(--white);
			&:hover {
				color: var(--red-3);
				background-color: var(--peach);
				@include mixins.hoverBoxShadowWarning();
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
