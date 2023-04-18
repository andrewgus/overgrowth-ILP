<template>
	<transition name="opacity">
		<p v-show="show" :class="$style.alertText">
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
		padding: 0 var(--s-4) var(--s-4);
		overflow-x: hidden;
		margin: 0 auto var(--s2);
		background-color: var(--yellow5);
		border: 1px solid var(--darkGray);
		border-radius: var(--s10) var(--s0) var(--s10) var(--s0) / var(--s10)
			var(--s0) var(--s10) var(--s0);

		&::before {
			content: '\0024d8';
			font-size: var(--s4);
			width: 100%;
			height: var(--s2);
			display: inline-flex;
			justify-content: flex-end;
			align-items: center;
			background-color: var(--yellow);
			padding: var(--s-10) var(--s10) var(--s-10) 0;
			margin-bottom: var(--s-4);
			border-bottom: 1px dashed var(--lightGray);
		}
	}
</style>
