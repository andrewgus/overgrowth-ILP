<template>
	<transition name="opacity">
		<p v-show="show" aria-live="polite" :class="$style.alertText">
			<slot></slot>
		</p>
	</transition>
</template>

<script setup lang="ts">
	defineProps({
		show: {
			type: Boolean,
		},
	})
</script>

<style module lang="scss">
	.alertText {
		max-width: 60ch;
		text-align: center;
		padding: var(--s-4) var(--s0);
		margin: 0 auto var(--s2);
		background-color: var(--yellow5);
		border: 1px solid var(--darkGray);
		border-radius: var(--s10) var(--s0) var(--s10) var(--s0) / var(--s10)
			var(--s0) var(--s10) var(--s0);
	}
</style>
