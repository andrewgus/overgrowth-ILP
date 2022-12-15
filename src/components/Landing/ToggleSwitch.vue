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
		border-radius: 100px;
		width: 20ch;
		border: 1px solid gray;
		padding: 0;
		background: white;
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
		height: clamp(48px, var(--s3), var(--s4));
		width: clamp(48px, var(--s3), var(--s3));
		border-radius: 50%;
		transition: all 0.33s cubic-bezier(0.68, -0.3, 0.32, 1.03);
	}

	.switch.true > span {
		background-color: #2ebfa2;
		transform: translateX(0);
	}
	.switch.false > span {
		transform: translateX(14.1ch);
		color: #fff;
		background: #c02e4c;
	}
</style>
