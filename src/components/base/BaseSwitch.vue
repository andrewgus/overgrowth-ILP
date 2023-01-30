<template>
	<!-- TODO: implicit label instead? Wrap the button inside the label element? -->
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
		<span :class="$style.onOff" aria-hidden="true">{{
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
	.switch {
		display: grid;
		grid-template: 1fr/ 1fr;
		align-items: center;

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

			&.off + .onOff {
				transform: translateX(var(--s2));
				margin: 0 0 0 2px;
				color: #fff;
				background: var(--red);
			}
		}
		> .onOff {
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
			-webkit-transition: all 0.33s var(--transition);
			transition: all 0.33s var(--transition);
			background-color: var(--green1);
		}
	}
</style>
