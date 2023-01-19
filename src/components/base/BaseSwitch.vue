<template>
	<label :for="`${type}Switch`">{{ type }}</label>
	<button
		@click="toggleSwitch"
		:id="`${type}Switch`"
		:class="enabled ? 'true' : 'false'"
		role="switch"
		type="button"
		:aria-checked="enabled"
	>
		<span aria-hidden="true">{{ enabled ? 'On' : 'Off' }}</span>
	</button>
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

<style scoped>
	button {
		display: inline-flex;
		cursor: pointer;
		border-radius: 100px;
		width: 10ch;
		border: 1px solid gray;
		padding: 0;
		background: white;
	}
	button > span {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 4ch;
		width: 4ch;
		border-radius: 50%;
		transition: all 0.33s var(--transition);
	}

	button.true > span {
		background-color: #2ebfa2;
		transform: translateX(0);
	}
	button.false > span {
		transform: translateX(5.8ch);
		color: #fff;
		background: #c02e4c;
	}
</style>
