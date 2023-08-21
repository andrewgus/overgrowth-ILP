import { onKeyStroke } from '@vueuse/core';
import type { Ref } from 'vue';

/**
 * To manage which element recieving TabIndex = 0 in a widget (widgets use arrow keys within)
 * @param thisEl Element to swap TabIndex for focus
 */
function useSwapTabIndex(thisEl: HTMLElement) {
    const allEls = [...thisEl.parentElement!.children] as HTMLElement[]
    allEls.forEach((el) => el === thisEl ? el.tabIndex = 0 : el.tabIndex = -1)
}

/**
 * To manage tabIndex and Focus for keyboard users
 * @param targetEl ref on the parent div containing elements to swap TabIndex/focus between, typically buttons
 */
function useSwapTabIndexAndFocusWithKeys(targetEl: Ref<HTMLElement | null | undefined>) {

    const findPrevSiblingEl = (el: HTMLButtonElement, elIndex: number) => {
        const prevSibling = [...el.parentElement!.children].find((_, i) => i < elIndex) as HTMLButtonElement
        if (prevSibling) return prevSibling
    }
    const findNextSiblingEl = (el: HTMLButtonElement, elIndex: number) => {
        const nextSibling = [...el.parentElement!.children].find((_, i) => i > elIndex) as HTMLButtonElement
        if (nextSibling) return nextSibling
    }
    const swapTabIndexAndFocus = (target: EventTarget, dir: 'left' | 'right') => {
        const el = target as HTMLButtonElement;
        const findElIndex = [...el.parentElement!.children].findIndex((sib) => sib === el)
        const findSibling = dir === 'left' ? findPrevSiblingEl(el, findElIndex) : findNextSiblingEl(el, findElIndex)
    
        if (findSibling) {
            useSwapTabIndex(findSibling)
            findSibling.focus()
        }
    }
    onKeyStroke('ArrowRight', ({ target }) => {
        if (target) swapTabIndexAndFocus(target, 'right')
    }, { target: targetEl })
    onKeyStroke('ArrowLeft', ({ target }) => {
        if (target) swapTabIndexAndFocus(target, 'left')
    }, { target: targetEl })
}

export {useSwapTabIndexAndFocusWithKeys, useSwapTabIndex}

