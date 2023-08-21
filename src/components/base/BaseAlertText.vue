<template>
	<transition name="opacity">
		<div v-show="show" role="note" :class="[$style.alertText, { [$style.isWarning]: isWarning }]">
			<slot></slot>
		</div>
	</transition>
</template>

<script setup lang="ts">
type Props = {
	show?: boolean
	isWarning?: boolean
}
withDefaults(defineProps<Props>(), {
	show: true,
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

	&.isWarning {
		@include containerStyles.alertWarning();

		&::before {
			background-color: var(--red1);
			background-image: url(/alert.svg);
		}
	}

	&:not(.isWarning) {
		@include containerStyles.alert();

		&::before {
			background-color: var(--yellow);
			background-image: url(/info.svg);
		}
	}

	&::before {
		content: '';
		display: inline-flex;
		background-repeat: no-repeat;
		background-size: var(--s0);
		background-position: center right var(--s0);
		width: 100%;
		height: var(--s0);
		padding: var(--s-10) var(--s-4);
		margin-bottom: var(--s-4);
		border-bottom: 1px dashed var(--darkGray);
	}

	>* {
		padding-left: var(--s0);
		padding-right: var(--s0);

		&:first-child {
			padding-top: var(--s-6);
		}

		&:last-child {
			padding-bottom: var(--s-6);
		}
	}
}
</style>
<style scoped lang="scss">
@use '../../styles/mixins/transitions.scss';
@include transitions.vueOpacity();</style>
