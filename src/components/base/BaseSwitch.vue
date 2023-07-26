<template>
	<button
		@click="toggleSwitch"
		:class="[$style.switchBtn, { [$style.isOff]: !enabled }]"
		type="button"
		role="switch"
		:aria-checked="enabled">
		<span>{{ name }}</span>
		<span :class="$style.visualSwitch" aria-hidden="true">
			<span :class="$style.toggleText">
				{{ enabled ? 'On' : 'Off' }}
			</span>
		</span>
	</button>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	const props = defineProps({
		name: {
			type: String,
			required: true,
		},
		set: {
			type: Boolean,
			required: true,
		},
	})
	const enabled = ref(props.set)

	const emit = defineEmits(['toggleSwitch'])

	const toggleSwitch = () => {
		enabled.value = !enabled.value
		emit('toggleSwitch')
	}
</script>

<style module lang="scss">
	@use '../../styles/mixins/containerStyles.scss';
	@use '../../styles/mixins/transitions.scss';
	@use '../../styles/mixins/shadows.scss';
	.switchBtn {
		@include containerStyles.flexCenter();
		@include transitions.flourishLong();
		flex: 0 1 auto;
		min-width: var(--s9);
		color: var(--black);
		background-color: transparent;
		border: none;
		border-radius: var(--s-10);
		flex-flow: column nowrap;

		> .visualSwitch {
			@include containerStyles.darkBorder();
			display: flex;
			align-items: center;
			justify-content: start;
			margin-top: var(--s-8);
			background-color: var(--lightGray);
			border-radius: var(--s10);
			width: 70%;

			> .toggleText {
				@include transitions.flourishShort();
				display: inline-flex;
				justify-content: center;
				align-items: center;
				font-size: var(--s-1);
				pointer-events: none;
				padding: var(--s-10);
				aspect-ratio: 1/1;
				border-radius: 50%;
				background-color: var(--green1);
				width: 50%;
			}
		}
		&:hover {
			> .visualSwitch {
				@include shadows.blueDropShadow();
			}
			&:not(.isOff) .toggleText {
				animation: switchJiggle var(--timeMed) var(--transitionFlourish);
			}
		}
		&.isOff .toggleText {
			background-color: var(--red-1);
			color: var(--white);
			transform: translateX(100%);
		}
	}

	@keyframes switchJiggle {
		0% {
			background-color: var(--yellow-1);
			transform: translateX(0);
		}
		50% {
			background-color: var(--yellow-1);
			transform: translateX(var(--s-8));
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
