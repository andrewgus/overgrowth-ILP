<template>
	<transition name="opacity">
		<div v-show="show" role="note" :class="$style.alertText">
			<slot></slot>
		</div>
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
	@use '../../styles/mixins/containerStyles.scss';
	.alertText {
		max-width: 60ch;
		text-align: center;
		padding: 0 var(--s-2) var(--s-4);
		overflow-x: hidden;
		margin: 0 auto var(--s2);
		@include containerStyles.alert();

		&::before {
			content: '';
			display: inline-flex;
			background-image: url(/catalog/info.svg);
			background-repeat: no-repeat;
			background-size: var(--s0);
			background-position: center right var(--s0);
			width: 100%;
			height: var(--s0);
			background-color: var(--yellow);
			padding: var(--s-10) var(--s-4);
			margin-bottom: var(--s-4);
			border-bottom: 1px dashed var(--darkGray);
		}
	}
</style>
<style scoped lang="scss">
	@use '../../styles/mixins/transitions.scss';
	@include transitions.vueOpacity();
</style>
