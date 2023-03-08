<template>
	<button
		v-if="!link"
		:class="btnStyles"
		:disabled="isDisabled"
		autocomplete="off"
		:aria-label="isDisabled ? 'Complete the activity to continue' : ''"
		@click="$emit('btnClick', $event)"
	>
		{{ text }}
	</button>
	<a v-else :href="url" :class="btnStyles">{{ text }}</a>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import useComputedCssModule from '../../composables/useComputedCssModule'

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
	.btn {
		color: var(--black);
		cursor: pointer;
		border: 1px solid var(--darkGray);
		padding: var(--s-5);
		font-size: var(--s-1);
		background-color: v-bind(btnColor);
		border-radius: var(--s-8);
		-webkit-transition: var(--timeLong) all var(--transitionFlourish);
		transition: var(--timeLong) all var(--transitionFlourish);
		text-decoration: none;

		&:not(.navBtn):hover {
			color: var(--blue);
			background-color: var(--peach);
			box-shadow: inset var(--s-10) var(--s-10) 0 var(--blue),
				inset calc(-1 * var(--s-10)) calc(-1 * var(--s-10)) 0 var(--blue),
				inset var(--s-10) calc(-1 * var(--s-10)) 0 var(--blue),
				inset calc(-1 * var(--s-10)) var(--s-10) 0 var(--blue);
		}
		&.disabled {
			cursor: not-allowed;
			pointer-events: none;
			opacity: 0.5;
			background-color: var(--lightGray);
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
