<template>
	<button v-if="!link">{{ text }}</button>
	<a v-else :href="url">{{ text }}</a>
</template>

<script setup lang="ts">
	defineProps({
		text: {
			type: String,
			required: true,
		},
		link: {
			type: Boolean,
		},
		url: {
			type: String,
		},
	})
</script>

<style scoped>
	button,
	a {
		cursor: pointer;
		box-shadow: none;
		border: 1px solid var(--darkGray);
		padding: var(--s-5);
		font-size: var(--s-1);
		background-color: var(--lightBlue);
		border-radius: 6px;
		transition: 0.3s all var(--transition);
	}
	button:hover,
	a:hover {
		box-shadow: inset var(--s-10) var(--s-10) 0 var(--blue),
			inset calc(-1 * var(--s-10)) calc(-1 * var(--s-10)) 0 var(--blue),
			inset var(--s-10) calc(-1 * var(--s-10)) 0 var(--blue),
			inset calc(-1 * var(--s-10)) var(--s-10) 0 var(--blue);
	}
	a {
		text-decoration: none;
		color: var(--black);
	}
</style>
