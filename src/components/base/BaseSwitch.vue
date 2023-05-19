<template>
	<button
		@click="toggleSwitch"
		:class="[$style.switchBtn, { [$style.isOff]: !enabled }]"
		type="button"
		role="switch"
		:aria-checked="enabled"
	>
		<span>{{ switchName }}</span>
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
		switchName: {
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
		min-width: var(--s8);
		cursor: pointer;
		color: var(--black);
		background-color: transparent;
		border: none;
		border-radius: var(--s-10);
		@include containerStyles.flexCenter();
		flex-flow: column nowrap;
		@include transitions.button();

		> .visualSwitch {
			margin-top: var(--s-8);
			min-width: var(--s7);
			background-color: var(--lightGray);
			border-radius: var(--s10);
			@include containerStyles.darkBorder();
			height: max(auto, var(--s7));

			> .toggleText {
				float: left;
				-webkit-transition: all var(--timeShort) var(--transitionFlourish);
				transition: all var(--timeShort) var(--transitionFlourish);
				font-size: var(--s-1);
				pointer-events: none;
				padding: var(--s-10);
				aspect-ratio: 1/1;
				border-radius: 50%;
				background-color: var(--green1);
			}
		}
		&:hover {
			> .visualSwitch {
				@include shadows.blueDropShadow();
			}
			&:not(.isOff) .toggleText {
				animation: switchJiggle var(--timeLong) var(--transitionFlourish);
			}
		}
		&.isOff .toggleText {
			background-color: var(--red-1);
			color: var(--white);
			float: right;
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
