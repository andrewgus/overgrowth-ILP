<template>
	<dialog role="alertdialog" ref="dialogEl" :class="$style.dialog">
		<h1 tabindex="-1" ref="dialogHeadingEl">
			{{ !confirmDelete ? 'Hey there! &#128075;' : 'Are You Sure?' }}
		</h1>
		<p v-if="!confirmDelete">
			<span class="visuallyHidden">Important:</span>
			Looks like you have some saved work on this lesson. Would you like to
			continue where you left off
			<strong>or</strong>
			reset this lesson?
		</p>
		<p v-else id="doubleCheck">
			<span class="visuallyHidden">Warning:</span>
			Resetting this lesson
			<strong>cannot</strong>
			be undone. All saved data will be lost forever.
		</p>
		<div :class="$style.dialog__btns">
			<template v-if="!confirmDelete">
				<BaseButtonVue text="Continue lesson?" @btnClick="dialogEl?.close()" />
				<BaseButtonVue text="Reset lesson?" isWarning @btnClick="doubleCheckDelete" />
			</template>
			<template v-else>
				<BaseButtonVue text="Nevermind. Let&rsquo;s continue." @btnClick="dialogEl?.close()" />
				<BaseButtonVue text="Yes. Reset this lesson." aria-describedby="doubleCheck" isWarning
					@btnClick="resetAndClose" />
			</template>
		</div>
	</dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { lessonIDAtom } from '../../store/lessonStore'
import { useResetLocalStorageUserData } from '../../scripts/updateLocalStorage'
import BaseButtonVue from '../base/BaseButtonVue.vue'
import getLocalStorage from '../../composables/useGetLocalStorage'

const doesLocalStorageExist = ref<boolean>(false)
const dialogEl = ref<HTMLDialogElement | null>(null)
const dialogHeadingEl = ref<HTMLHeadingElement | null>(null)

const confirmDelete = ref<boolean>(false)

onMounted(() => {
	doesLocalStorageExist.value = !!getLocalStorage()
	doesLocalStorageExist.value && dialogEl.value!.showModal()
})

const doubleCheckDelete = () => {
	dialogHeadingEl.value?.focus()
	confirmDelete.value = true
}

const resetAndClose = () => {
	useResetLocalStorageUserData()
	localStorage.removeItem(lessonIDAtom.get())
	dialogEl.value?.close()
}
</script>

<style module lang="scss">
@use '../../styles/mixins/containerStyles.scss';

.dialog {
	&[open] {
		position: fixed;
		margin: 0;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		width: clamp(360px, 96vw, 800px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		@include containerStyles.alert();
	}

	&::backdrop {
		background-color: hsl(0deg 0% 98% / 50%);
	}

	>h1 {
		font-size: var(--s4);
		margin-top: 0;
	}

	&__btns {
		margin-top: var(--s-2);
		display: flex;
		flex-flow: row wrap;
		gap: var(--s-2);

		>button {
			flex: 1 1 auto;
		}
	}
}

@media only screen and (max-width: 520px) {
	.dialog[open] {
		padding: var(--s4);
	}
}
</style>
