<template>
	<div role="note" :class="[$style.alertText, { [$style.isWarning]: isWarning }]">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
type Props = {
	isWarning?: boolean
}
defineProps<Props>()
</script>

<style module lang="scss">
@use '../../styles/mixins/containerStyles.scss';

.alertText {
	max-width: 60ch;
	width: 100%;
	padding: 0 max(var(--s0, 1ch)) var(--s-4);
	overflow-x: hidden;
	margin: 0 auto var(--s6);
	display: flex;
	flex-flow: column nowrap;

	&.isWarning {
		@include containerStyles.alertWarning();

		&::before {
			background-color: var(--red1);
			background-image: url('../../assets/icon-alert.svg');
		}
	}

	&:not(.isWarning) {
		@include containerStyles.alert();

		&::before {
			background-color: var(--yellow);
			background-image: url('../../assets/icon-info.svg');
		}
	}

	&::before {
		content: '';
		display: inline-flex;
		background-repeat: no-repeat;
		background-size: var(--s1);
		background-position: center right var(--s0);
		width: 100%;
		min-height: var(--s1);
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
	}
}
</style>

