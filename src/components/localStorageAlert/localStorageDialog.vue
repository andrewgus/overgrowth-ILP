<template v-if="doesLocalStorageExist">
	<dialog ref="dialogEl" :class="$style.dialog">
		<h2>Hey there! &#128075;</h2>
		<p>
			Looks like you have some saved work on this lesson. Would you like to
			continue where you left off <strong>or</strong> reset this lesson?
		</p>
		<div :class="$style.dialog__btns">
			<BaseButton text="Continue lesson?" @btnClick="dialogEl?.close()" />
			<!-- TODO: create a warning button prop to change the styles of this and any other warning btn. Consider primary, secondary, tert buttons instead? -->
			<BaseButton text="Reset lesson?" @btnClick="resetAndClose" />
		</div>
	</dialog>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { lessonIDAtom } from '../../store/lessonStore'
	import { useResetLocalStorageUserData } from '../../scripts/updateLocalStorage'
	import BaseButton from '../base/BaseButton.vue'
	import getLocalStorage from '../../composables/useGetLocalStorage'

	const doesLocalStorageExist = ref<boolean>(false)
	const dialogEl = ref<HTMLDialogElement>()

	onMounted(() => {
		doesLocalStorageExist.value = !!getLocalStorage()
		doesLocalStorageExist.value && dialogEl.value!.showModal()
	})

	const resetAndClose = () => {
		// BUG: local storage removeItem NOT WORKING
		// console.log(lessonIDAtom.get())
		console.log(localStorage.getItem(lessonIDAtom.get()))
		// localStorage.removeItem(lessonIDAtom.get())
		localStorage.clear()
		console.log(localStorage.getItem(lessonIDAtom.get()))

		useResetLocalStorageUserData()
		dialogEl.value?.close()
	}
</script>

<style module lang="scss">
	@use '../../styles/mixins.scss';

	.dialog {
		&[open] {
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
		}

		&::backdrop {
			background-color: hsla(0deg, 0%, 100%, 60%);
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
