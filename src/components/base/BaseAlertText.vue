<template>
	<transition name="opacity">
		<p v-show="show" role="note" :class="$style.alertText">
			<span class="visuallyHidden">Important: </span>
			<slot></slot>
		</p>
	</transition>
</template>

<script setup lang="ts">
	// TODO: include a checkbox&label for "don't show this for any future activities" which will provide/inject and boolean value, sent to the activityCompleteBtn. If checked (therefore, true), then update the activityProgress store prop "wantsNoMoreAlerts", and if that is true (defaults to false), then do not show the alert at all on activity activity sections.
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
			background-image: url(../catalog/info.svg);
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
