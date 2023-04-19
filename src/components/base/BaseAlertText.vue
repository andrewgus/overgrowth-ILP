<template>
	<transition name="opacity">
		<p v-show="show" role="note" :class="$style.alertText">
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
			content: '';
			display: inline-flex;
			background-image: url(../info.svg);
			background-repeat: no-repeat;
			background-size: var(--s0);
			background-position: 97% center;
			width: 100%;
			height: var(--s0);
			background-color: var(--yellow);
			padding: var(--s-10) var(--s-8);
			margin-bottom: var(--s-4);
			border-bottom: 1px dashed var(--darkGray);
		}
	}
</style>
