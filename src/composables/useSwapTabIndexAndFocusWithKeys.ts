import { onKeyStroke } from '@vueuse/core'
import type { Ref } from 'vue'

/**
 * To manage which element recieving TabIndex = 0 in a widget (widgets use arrow keys within)
 * @param thisEl HTMLElement to swap TabIndex for focus
 * @param useArray Array of HTMLElement to swap TabIndex between
 */
function useSwapTabIndex(thisEl: HTMLElement, useArray?: HTMLElement[]) {
	const allEls = !!useArray
		? useArray
		: ([...thisEl.parentElement!.children] as HTMLElement[])

	allEls.forEach((el) =>
		el === thisEl ? (el.tabIndex = 0) : (el.tabIndex = -1)
	)
}

/**
 * To manage tabIndex and Focus for keyboard users
 * @param targetEl Ref<HTMLElement> on the parent div containing elements to swap TabIndex/focus
 * @param useArray Array of elements to tab between
 * @param includeUpDownKeys boolean to determine whether to include up and down keys
 */
function useSwapTabIndexAndFocusWithKeys(
	targetEl: Ref<HTMLElement | null | undefined>,
	useArray?: HTMLElement[],
	includeUpDownKeys?: boolean
) {
	const findPrevSiblingEl = (el: HTMLButtonElement, elIndex: number) => {
		// find the next lowest indexed element, starting from the end
		const prevSibling = !!useArray
			? useArray.findLast((_, i) => i < elIndex)
			: ([...el.parentElement!.children].findLast(
					(_, i) => i < elIndex
			  ) as HTMLButtonElement)
		if (prevSibling) return prevSibling
	}
	const findNextSiblingEl = (el: HTMLButtonElement, elIndex: number) => {
		// find the next highest indexed element, starting from the beginning
		const nextSibling = !!useArray
			? useArray.find((_, i) => i > elIndex)
			: ([...el.parentElement!.children].find(
					(_, i) => i > elIndex
			  ) as HTMLButtonElement)
		if (nextSibling) return nextSibling
	}
	const swapTabIndexAndFocus = (target: EventTarget, dir: 'left' | 'right') => {
		const el = target as HTMLButtonElement
		// find the index of the current Element
		const findElIndex = !!useArray
			? useArray.findIndex((sib) => sib === el)
			: [...el.parentElement!.children].findIndex((sib) => sib === el)
		// if we're going left, find previous, if we're going right, find next
		const findSibling =
			dir === 'left'
				? findPrevSiblingEl(el, findElIndex)
				: findNextSiblingEl(el, findElIndex)
		// if a sibling is found, swap tab index and focus on that sibling
		if (findSibling) {
			useSwapTabIndex(findSibling, useArray ?? undefined)
			findSibling.focus()
		}
	}
	onKeyStroke(
		'ArrowRight',
		(e) => {
			e.preventDefault()
			if (e.target) swapTabIndexAndFocus(e.target, 'right')
		},
		{ target: targetEl }
	)
	onKeyStroke(
		'ArrowLeft',
		(e) => {
			e.preventDefault()
			if (e.target) swapTabIndexAndFocus(e.target, 'left')
		},
		{ target: targetEl }
	)
	if (includeUpDownKeys) {
		onKeyStroke(
			'ArrowDown',
			(e) => {
				e.preventDefault()
				if (e.target) swapTabIndexAndFocus(e.target, 'right')
			},
			{ target: targetEl }
		)
		onKeyStroke(
			'ArrowUp',
			(e) => {
				e.preventDefault()
				if (e.target) swapTabIndexAndFocus(e.target, 'left')
			},
			{ target: targetEl }
		)
	}
}

export { useSwapTabIndexAndFocusWithKeys, useSwapTabIndex }
