<template v-if="doesLocalStorageExist">
	<dialog ref="dialogEl" :class="$style.dialog" open>
		<h2>Hey there!</h2>
		<p>
			Looks like you have some saved work on this lesson. Would you like to
			continue where you left off or reset this lesson?
		</p>
		<div :class="$style.dialog__btns">
			<BaseButton
				text="Continue lesson?"
				@btnClick="continueAndClose"
			></BaseButton>
			<BaseButton text="Reset lesson" @btnClick="resetAndClose"></BaseButton>
		</div>
	</dialog>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import { useStore } from '@nanostores/vue'
	import getLocalStorage from '../../composables/useGetLocalStorage'
	import BaseButton from '../base/BaseButton.vue'
	import { lessonIDAtom } from '../../store/lessonStore'

	const lessonID = useStore(lessonIDAtom)

	const dialogEl = ref()
	const doesLocalStorageExist = ref<boolean>()
	onMounted(() => (doesLocalStorageExist.value = !!getLocalStorage()))

	const continueAndClose = () => {}
	const resetAndClose = () => {
		// FIXME: these actions below work as intended, but it is **NOT** reactive. Need to fix so the proper store items are also updated. Need to somehow watch the localStorage for changes too here.
		localStorage.removeItem(lessonID.value)
		dialogEl.value!.close() as HTMLDialogElement
	}
</script>

<style module lang="scss">
	@use '../../styles/mixins.scss';
	.dialog {
		position: fixed;
		width: clamp(340px, 96vw, 800px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
		@include mixins.alert();

		&::backdrop {
			background-color: hsla(0, 0%, 98%, 0.5);
		}
		> h2 {
			margin-left: var(--s2);
			margin-top: 0;
		}

		&__btns {
			margin-top: var(--s-2);
			display: flex;
			flex-flow: row nowrap;
			gap: var(--s-2);
		}
	}
</style>
