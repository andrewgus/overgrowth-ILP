<template>
	<!-- <SwitchGroup as="li">
		<SwitchLabel @click.stop>{{ type }}</SwitchLabel>
		<Switch
			v-model="enabled"
			:class="enabled ? 'true' : 'false'"
			class="switch"
		>
			<span aria-hidden="true">{{ enabled ? 'On' : 'Off' }}</span>
		</Switch>
	</SwitchGroup> -->

	<li>
		<label :for="`${type}Switch`">{{ type }}</label>
		<button
			@click="$emit('toggleFeature')"
			:id="`${type}Switch`"
			class="toggleSwitch"
			:class="enabled ? 'true' : 'false'"
			role="switch"
			type="button"
			:aria-checked="enabled"
		>
			<span aria-hidden="true">{{ enabled ? 'On' : 'Off' }}</span>
		</button>
	</li>
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

	const emits = defineEmits(['toggleFeature'])

	const enabled = ref(props.set)
</script>

<style scoped>
	li {
		list-style: none;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: start;
	}
	.toggleSwitch {
		display: inline-flex;
		cursor: pointer;
		border-radius: 100px;
		width: 10ch;
		border: 1px solid gray;
		padding: 0;
		background: white;
	}
	.toggleSwitch > span {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 4ch;
		width: 4ch;
		border-radius: 50%;
		transition: all 0.33s var(--transition);
	}

	.toggleSwitch.true > span {
		background-color: #2ebfa2;
		transform: translateX(0);
	}
	.toggleSwitch.false > span {
		transform: translateX(5.8ch);
		color: #fff;
		background: #c02e4c;
	}
</style>
