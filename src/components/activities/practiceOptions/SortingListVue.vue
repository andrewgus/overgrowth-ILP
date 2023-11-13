<template>
    <p class='visuallyHidden' :id='`${uniqueID}-instructions`'>Press space bar on a list item to toggle drag and
        drop
        mode,
        use
        arrow keys to move the selected list item.</p>
    <ul role='listbox' :class='$style.reorderList' aria-label='Sort the following items in this list'
        :aria-describedby='`${uniqueID}-instructions ${promptID}`' ref='listEl'>
        <li v-for='(item, index ) in  itemsList ' :key='item.id' :id='`${uniqueID}-${index}`' class='draggable-listItem'
            :class='{ [$style.isSelected]: selectedItemIndex === index }' role='option' :draggable='true'
            @keyup.space='setSelected($event, index)' :tabindex='index === 0 ? "0" : "-1"'>
            <span aria-hidden='true'>&vellip;&vellip;</span>
            {{ item.name }}
        </li>
    </ul>
    <div :class='$style.nextStepBtns'>
        <BaseButtonVue v-if='isMultisteps' text='Go to next step' isForActivity @click='readyForNext' />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, reactive } from 'vue';
import createNanoID from '../../../composables/useCreateNanoID';
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { setAriaLiveAnnouncement } from '../../../store/ariaLiveStore';
import { onKeyStroke } from '@vueuse/core';
import BaseButtonVue from '../../base/BaseButtonVue.vue';
import getLocalStorage from '../../../composables/useGetLocalStorage';
import { includeUserCreatedListInPracticeStore } from '../../../store/activityOptionsStore';

const emits = defineEmits<{
    readyForNext: [isReadyForNextStep: boolean]
}>()


type Props = {
    id: string
    promptID: string
    isMultisteps: boolean
    isStepComplete: boolean
    listItems: string[]
    canAddAdditionalItems?: boolean
}

const props = defineProps<Props>()

const readyForNext = () => {
    emits('readyForNext', true)
    includeUserCreatedListInPracticeStore(props.id, itemsList)
}
const localStorageCreatedList = getLocalStorage(props.id, 'userCreatedList') as { id: number, name: string }[]

const uniqueID = createNanoID('SortingList')
const listEl = ref<HTMLElement | null>()
const selectedItemIndex = ref<number | null>(null)


// Creating a reactive computed value of the list of sortable items
const itemsList = reactive<{
    id: number;
    name: string;
}[]>([]);
// listItems as object, for if localStorage does not exist
const listItemsObj = props.listItems.map((item, index) => ({
    id: index + 1,
    name: item,
}))
// Setting itemsList depending on whether there is localStorage or not
const computedItemsList = computed(() => {
    // If the list already exists in localStorage, pull from there.
    if (!!localStorageCreatedList) {
        return localStorageCreatedList
    } else {
        // Else, create from the listItems prop
        return listItemsObj
    }
});
// Initialize itemsList with the computed value
onMounted(() => itemsList.push(...computedItemsList.value))

// updating tabIndex with focus
const updateTabIndex = (selectedEl: HTMLLIElement) => ([...listEl.value!.children] as HTMLLIElement[]).forEach((item) =>
    item.tabIndex = item === selectedEl ? 0 : -1)

// track an items previous index for aria-live
const itemsPreviousIndex = ref<number | null>(null)
// Using spacebar key to select item for resorting list.
const setSelected = async ({ target }: Event, index: number) => {
    const selectedEl = target as HTMLLinkElement
    // updated selectedItemIndex on index of item selected
    selectedItemIndex.value = selectedItemIndex.value === index ? null : index;
    selectedEl.setAttribute('aria-selected', `${selectedItemIndex.value !== null}`)
    // set the previous index if there is none, then compare to index param. If different, keep prev, but if the same, set to index
    itemsPreviousIndex.value = itemsPreviousIndex.value === null ? index : itemsPreviousIndex.value !== index ? itemsPreviousIndex.value : index
    // only fire aria-live update if user has changed the order
    if (itemsPreviousIndex.value !== index) {
        setAriaLiveAnnouncement(`${selectedEl.innerText.replace('⋮', '')} is now at list number ${index + 1}`);
    }
    await nextTick();
    // once updated, reset itemsPrevious for next change
    itemsPreviousIndex.value = selectedItemIndex.value
}

// keyboard resorting list. Need to have a selectedItemIndex first though.
const moveItem = async (selectedIndex: number, UpOrDown: 'up' | 'down') => {
    // Down goes to next down the list, up goes to previously up the list
    const newIndex = UpOrDown === 'down' ? selectedIndex + 1 : selectedIndex - 1
    // grab item from itemsList based on currentIndex
    const itemToMove = itemsList[selectedIndex]
    // item at currentIndex becomes item at newIndex
    itemsList[selectedIndex] = itemsList[newIndex]
    // item currently at newIndex becomes item at currentIndex
    itemsList[newIndex] = itemToMove
    // Update selectedItemIndex to match the item's new index
    selectedItemIndex.value = newIndex;
    await nextTick()
    const trackedEl = listEl.value!.children[selectedItemIndex.value] as HTMLLIElement
    trackedEl.focus()
    updateTabIndex(trackedEl)
}
// to move from one item to the next, when no item is selected
const traverseList = (e: Event, UpOrDown: 'up' | 'down') => {
    let currListItem = e.target as HTMLLIElement
    // Down goes to next down the list, up goes to previously up the list
    const goToItem = UpOrDown === 'down' ? (currListItem.nextElementSibling as HTMLLIElement) : (currListItem.previousElementSibling as HTMLLIElement)
    // focus on correct item
    goToItem ? goToItem.focus() : currListItem.focus()
    updateTabIndex(goToItem ? goToItem : currListItem)
}

// Keys for going up in list
onKeyStroke(['ArrowUp', 'ArrowLeft'], (e: Event) => {
    e.preventDefault()
    if (selectedItemIndex.value !== null && selectedItemIndex.value > 0) {
        // Move the selected item up in the list (decrease index value)
        moveItem(selectedItemIndex.value, 'up')
    } else {
        // if there is no selectedItemIndex, then just move focus to previous element, if it exists
        traverseList(e, 'up')
    }
}, { target: listEl })
// Keys for going down in list
onKeyStroke(['ArrowDown', 'ArrowRight'], (e: Event) => {
    e.preventDefault()
    if (selectedItemIndex.value !== null && selectedItemIndex.value < itemsList.length - 1) {
        // Move the selected item down in the list (increase index value)
        moveItem(selectedItemIndex.value, 'down')
    } else {
        // if there is no selectedItemIndex, then just move focus to next element, if it exists
        traverseList(e, 'down')
    }
}, { target: listEl })

// Mouse-user sorting items in list
useSortable(listEl, itemsList, {
    sort: true,
    draggable: '.draggable-listItem',
    direction: 'vertical',
    animation: 150,
    onChoose: (e: any) => {
        // What happpens when user grabs item
        const selectedItem = e.item as HTMLLinkElement
        selectedItem.setAttribute('aria-selected', 'true')
    },
    onUnchoose: (e: any) => {
        // What happens after user is drops item
        const selectedItem = e.item as HTMLLinkElement
        selectedItem.setAttribute('aria-selected', 'false')
        selectedItem.setAttribute('draggable', 'true') // Fixes issue where draggable is set to false when unchoosen
    },
    onUpdate: (e: any) => {
        // what happens when the list order updates based on reordering
        moveArrayElement(itemsList, e.oldIndex, e.newIndex)
        const selectedItem = e.item as HTMLLinkElement
        const itemName = selectedItem.innerText.replace('⋮', '')
        const newListOrderPosition = e.newDraggableIndex + 1
        setAriaLiveAnnouncement(`${itemName} is now at list number ${newListOrderPosition}`)
    }
})
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';

.reorderList {
    display: flex;
    flex-flow: column nowrap;
    margin: var(--s6) auto 0;
    width: 100%;
    background-color: var(--white);
    list-style-type: none;
    background-color: var(--offWhite);
    border-radius: var(--s-8);
    border: 1px solid var(--darkGray);
    max-width: max-content;
    padding: var(--s-6) max(var(--s-6), .5ch);

    >li {
        display: flex;
        align-items: center;
        cursor: grab;

        >span {
            letter-spacing: min(-4px, -.2ch);
            margin: 0 max(var(--s-6), .5ch) 0 max(var(--s-10), .5ch);
        }

        &:hover {
            background-color: var(--lightGray);
        }

        &:focus {
            cursor: grabbing;
        }

        &.isSelected {
            font-style: italic;
            background-color: var(--lightGray);
        }

    }
}

.nextStepBtns {
    @include containerStyles.interactionMenuBar();
}
</style>
<style scoped lang='scss'>
.sortable-chosen {
    font-style: italic;
    background-color: var(--lightGray);
}
</style>