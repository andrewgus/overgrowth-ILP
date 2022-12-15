<template>
	<SwitchGroup>
		<div>
			<SwitchLabel @click.stop>{{ name }}</SwitchLabel>
			<Switch
				v-model="enabled"
				:class="enabled ? 'true' : 'false'"
				class="switch"
			>
				<span aria-hidden="true">{{ enabled ? 'On' : 'Off' }}</span>
			</Switch>
		</div>
	</SwitchGroup>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { SwitchGroup, Switch, SwitchLabel } from '@headlessui/vue'

	const props = defineProps({
		name: {
			type: String,
			required: true,
		},
		setting: {
			type: Boolean,
			required: true,
		},
	})

	const enabled = ref(props.setting)
</script>

<style>
	.switch {
		display: inline-flex;
		cursor: pointer;
		border-radius: 16px;
		width: 10ch;
		border: 1px solid gray;
		padding: 0;
	}
</style>

<style scoped>
	div {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: start;
	}
	.sr-only {
		position: fixed;
		top: -99999px;
		left: -99999px;
	}
	.switch > span {
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		height: 30px;
		width: 30px;
		border-radius: 50%;
		background-color: #005f7f;
		transition: transform 0.33s cubic-bezier(0.68, -0.3, 0.32, 1.03);
	}
	.switch.true > span {
		transform: translateX(0);
	}
	.switch.false > span {
		transform: translateX(6.2ch);
	}
</style>
