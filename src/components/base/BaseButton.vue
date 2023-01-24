<template>
	<button v-if="!link" :class="{ navBtn: isForNav }">{{ text }}</button>
	<a v-else :href="url" :class="{ disabled: isDisabled, navBtn: isForNav }">{{
		text
	}}</a>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

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
</script>

<style scoped>
	button,
	a {
		color: var(--black);
		cursor: pointer;
		border: 1px solid var(--darkGray);
		padding: var(--s-5);
		font-size: var(--s-1);
		background-color: v-bind(btnColor);
		border-radius: var(--s-8);
		-webkit-transition: 0.5s all var(--transition);
		transition: 0.5s all var(--transition);
	}
	a {
		text-decoration: none;
	}
	button:not(.navBtn):hover,
	a:not(.navBtn):hover {
		color: var(--blue);
		background-color: var(--peach);
		box-shadow: inset var(--s-10) var(--s-10) 0 var(--blue),
			inset calc(-1 * var(--s-10)) calc(-1 * var(--s-10)) 0 var(--blue),
			inset var(--s-10) calc(-1 * var(--s-10)) 0 var(--blue),
			inset calc(-1 * var(--s-10)) var(--s-10) 0 var(--blue);
	}

	.disabled {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.5;
		background-color: var(--lightGray);
	}
	.navBtn:hover,
	.navBtn:focus {
		outline: none;
		background-color: var(--blue);
		color: var(--white);
		z-index: 2;
	}
	.navBtn:visited:not(:hover):not(:focus) {
		color: var(--black);
	}
</style>
