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
	import useComputedCssModule from '../../composables/useComputedCssModule'
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
		color: {
			type: String,
		},
	})

	const btnColor = computed(() => {
		return `var(--${props.color ? props.color : 'lightBlue'})`
	})

	const computedConditionalClasses = new Map([
		[computed(() => props.isDisabled), 'disabled'],
		[computed(() => props.isForNav), 'navBtn'],
	])
	const btnStyles = useComputedCssModule('btn', computedConditionalClasses)
</script>

<style module lang="scss">
	@use '../../styles/mixins.scss';

	.btn {
		@include mixins.flexCenter();
		color: var(--black);
		cursor: pointer;
		border: 1px solid var(--darkGray);
		padding: var(--s-4) var(--s-2);
		background-color: v-bind(btnColor);
		border-radius: var(--s10);
		text-decoration: none;
		@include mixins.blueDropShadow();
		@include mixins.btnTransition();

		&:hover,
		&:focus {
			filter: drop-shadow(0px 0px 0 var(--blue));
		}

		&:focus {
			z-index: 10;
		}

		&:not(.navBtn):hover {
			color: var(--blue);
			background-color: var(--peach);
			@include mixins.hoverBoxShadow();
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
	.navBtn {
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
</style>
