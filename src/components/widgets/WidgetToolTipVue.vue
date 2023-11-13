<template>
    <div v-if='isDialog' :class='[$style.toolTipContainer, { [$style.toolTipVisible]: isTooltipShown }]'
        ref='dialogToolTipContainerEl'>
        <BaseButtonVue isForToolTipDialog text='' :aria-label='btnLabel' @click='toggleDialog()' />
        <div role='dialog' v-show='isTooltipShown' :class='$style.tooltip' ref='dialogToolTipContentEl' tabindex='-1'>
            <slot></slot>
            <BaseButtonVue text='Close' @click='closeDialog()' />
        </div>
    </div>
    <div v-else :class='[$style.toolTipContainer, { [$style.toolTipVisible]: isTooltipShown }]'>
        <BaseButtonVue isForToolTipDialog text='' :aria-label='btnLabel' :aria-describedby='uniqueID'
            @mouseover='isTooltipShown = true' @mouseout='isTooltipShown = false' @focus='isTooltipShown = true'
            @blur='isTooltipShown = false' />
        <span :id='uniqueID' v-show='isTooltipShown' aria-hidden='true' :class='$style.tooltip'>
            {{ toolTipText }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import BaseButtonVue from '../base/BaseButtonVue.vue';
import createNanoID from '../../composables/useCreateNanoID';
import { onKeyStroke } from '@vueuse/core';

const uniqueID = createNanoID('toolTip')

type Props = {
    btnLabel: string
    toolTipText?: string
    isDialog?: boolean
    shouldCloseDialog?: boolean
}
const props = defineProps<Props>()

const isTooltipShown = ref<boolean>(false)
const dialogToolTipContainerEl = ref<HTMLElement | null>(null)
const dialogToolTipContentEl = ref<HTMLElement | null>(null)


// toggle dialogBox on/off
const toggleDialog = async () => {
    isTooltipShown.value = !isTooltipShown.value
    // send focus to dialog box, if exists
    await nextTick()
    if (props.isDialog && isTooltipShown.value) dialogToolTipContentEl.value?.focus()
}
const closeDialog = () => {
    isTooltipShown.value = false;
    // send focus back to the tooltip button
    (dialogToolTipContainerEl.value?.firstElementChild as HTMLButtonElement).focus()
}

const watchShouldCloseDialog = computed(() => props.shouldCloseDialog);
// watch for whether the props.shouldCloseDialog is set to true. If true, close the dialog box
watch(watchShouldCloseDialog, (newValue) => !!newValue && closeDialog());

// For keyboard trap: watch whether the toolTip is shown or not.
watch(isTooltipShown, async (newValue) => {
    // if it is and it's a dialog box, create a keyboard trap so users *must* make a selection
    if (newValue === true && props.isDialog) {
        await nextTick()
        // grab all children of the dialog box that can be focused
        const focusableChildren = ([...dialogToolTipContentEl.value!.children] as HTMLElement[]).filter((el) => el.tabIndex === 0)
        // So long as at least one exists...
        if (focusableChildren.length > 0) {
            const firstFocusableChild = focusableChildren.at(0)
            const lastFocusableChild = focusableChildren.at(-1)
            // on tab keydown event...
            onKeyStroke('Tab', (e) => {
                // if Shift key is pressed, handle reverse tabbing
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableChild) {
                        e.preventDefault(); // Prevent default tab behavior
                        lastFocusableChild?.focus();
                    }
                } else {
                    // Handle forward tabbing
                    if (document.activeElement === lastFocusableChild) {
                        e.preventDefault(); // Prevent default tab behavior
                        firstFocusableChild?.focus();
                    }
                }
            }, { target: dialogToolTipContentEl, eventName: 'keydown', })

        }
    }
})
</script>

<style module lang='scss'>
@use '../../styles/mixins/containerStyles.scss';

.toolTipContainer {
    display: inline;
    margin: 0 max(var(--s-10), .25ch);
    position: relative;

    &.toolTipVisible {
        z-index: 999;
    }

    >div[role='dialog']>* {
        display: block;
        width: 100%;

        +* {
            margin-top: var(--s-3)
        }

        >button:last-child {
            padding: var(--s-6);
        }
    }
}

.tooltip {
    @include containerStyles.toolTipBox();
}
</style>