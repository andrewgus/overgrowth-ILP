<template v-if="doesLocalStorageExist">
	<dialog ref="dialogEl" :class="$style.dialog">
		<h2>Hey there! &#128075;</h2>
		<p>
			Looks like you have some saved work on this lesson. Would you like to
			continue where you left off <strong>or</strong> reset this lesson?
		</p>
		<div :class="$style.dialog__btns">
			<BaseButton
				text="Continue lesson?"
				@btnClick="continueAndClose"
			></BaseButton>
			<!-- TODO: create a warning button prop to change the styles of this and any other warning btn. Consider primary, secondary, tert buttons instead? -->
			<BaseButton text="Reset lesson?" @btnClick="resetAndClose"></BaseButton>
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

	onMounted(() => {
		if (!!getLocalStorage()) dialogEl.value.showModal() as HTMLDialogElement
	})

	const continueAndClose = ({ target }: Event) => {
		const clicked = target as HTMLButtonElement
		if (!clicked) return

		const dialog = clicked.closest('dialog') as HTMLDialogElement
		dialog.close()
	}

	const resetAndClose = () => {
		// FIXME: these actions below work as intended, but it is **NOT** reactive. Need to fix so the proper store items are also updated. Need to somehow watch the localStorage for changes too here.
		localStorage.removeItem(lessonID.value)
		// continueAndClose()
	}
</script>

<style module lang="scss">
	@use '../../styles/mixins.scss';
	.dialog {
		position: fixed;
		margin: 0;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		width: clamp(340px, 96vw, 800px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
		box-shadow: var(--s-6) var(--s-6) var(--s10) var(--yellow-5),
			calc(-1 * var(--s-6)) calc(-1 * var(--s-6)) var(--s10) var(--yellow-5);
		@include mixins.alert();

		&::backdrop {
			background-color: hsla(0deg, 0%, 100%, 33%);
		}
		> h2 {
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
