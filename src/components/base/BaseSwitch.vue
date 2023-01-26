<template>
	<label :for="`${type.toLowerCase()}Switch`">{{ type }}</label>
	<button
		@click="toggleSwitch"
		:id="`${type.toLowerCase()}Switch`"
		:class="switchStyles"
		type="button"
		role="switch"
		:aria-checked="enabled"
	>
		<span :class="$style.onOff" aria-hidden="true">{{
			enabled ? 'On' : 'Off'
		}}</span>
	</button>
</template>

<script setup lang="ts">
	import { ref, computed, useCssModule } from 'vue'

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

	const style = useCssModule()

	const switchStyles = computed(() => {
		const styles = [style.btn]
		enabled.value ? styles.push(style.true) : styles.push(style.false)
		return styles
	})
</script>

<style module lang="scss">
	.btn {
		display: inline-flex;
		cursor: pointer;
		border-radius: var(--s10);
		width: 10ch;
		border: 1px solid var(--darkGray);
		padding: 0;
		background: var(--white);

		& > .onOff {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 4ch;
			width: 4ch;
			border-radius: 50%;
			-webkit-transition: all 0.33s var(--transition);
			transition: all 0.33s var(--transition);
		}
	}
	.true > .onOff {
		background-color: var(--green1);
		transform: translateX(0);
	}
	.false > .onOff {
		transform: translateX(5.8ch);
		color: #fff;
		background: var(--red);
	}
</style>
