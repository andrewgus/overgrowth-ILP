<template>
	<SwitchGroup as="li">
		<SwitchLabel @click.stop>{{ type }}</SwitchLabel>
		<Switch
			v-model="enabled"
			:class="enabled ? 'true' : 'false'"
			class="switch"
		>
			<span aria-hidden="true">{{ enabled ? 'On' : 'Off' }}</span>
		</Switch>
	</SwitchGroup>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { SwitchGroup, Switch, SwitchLabel } from '@headlessui/vue'

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
</script>

<style>
	.switch {
		display: inline-flex;
		cursor: pointer;
		border-radius: 100px;
		width: 10ch;
		border: 1px solid gray;
		padding: 0;
		background: white;
	}
</style>

<style scoped>
	li {
		list-style: none;
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
		height: 4ch;
		width: 4ch;
		border-radius: 50%;
		transition: all 0.33s var(--transition);
	}

	.switch.true > span {
		background-color: #2ebfa2;
		transform: translateX(0);
	}
	.switch.false > span {
		transform: translateX(5.8ch);
		color: #fff;
		background: #c02e4c;
	}
</style>
