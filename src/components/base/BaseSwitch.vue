<template>
	<label :for="`${type.toLowerCase()}Switch`">{{ type }}</label>
	<div :class="$style.switch">
		<input
			@click="toggleSwitch"
			:id="`${type.toLowerCase()}Switch`"
			:class="[$style.input, { [$style.off]: !enabled }]"
			type="button"
			role="switch"
			:aria-checked="enabled"
			:value="enabled ? 'on' : 'off'"
		/>
		<span :class="$style.toggleText" aria-hidden="true">{{
			enabled ? 'On' : 'Off'
		}}</span>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	const props = defineProps({
		type: {
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
	@use '../../styles/mixins.scss';
	.switch {
		display: grid;
		grid-template: 1fr/ 1fr;
		align-items: center;
		@include mixins.btnTransition();

		&:hover:not(:focus-within) {
			@include mixins.blueDropShadow();

			> :not(.off) + .switch__toggleText {
				animation: switchJiggle var(--timeLong) var(--transitionFlourish);
			}
		}
		> * {
			grid-area: 1/1/-1/-1;
		}
		> .input {
			cursor: pointer;
			padding: 0;
			border-radius: var(--s10);
			width: var(--s6);
			height: calc(var(--s2) + 1px);
			border: 1px solid var(--darkGray);
			background: var(--white);
			color: transparent;

			&.off + .toggleText {
				transform: translateX(var(--s2));
				margin: 0 0 0 2px;
				color: #fff;
				background: var(--red);
			}
		}
	}
	.toggleText {
		font-size: var(--s-1);
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--s0);
		height: var(--s0);
		padding: var(--s-2);
		border-radius: 50%;
		margin: 0 0 0 1px;
		-webkit-transition: var(--timeShort) all var(--transitionFlourish);
		transition: var(--timeShort) all var(--transitionFlourish);
		background-color: var(--green1);
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
