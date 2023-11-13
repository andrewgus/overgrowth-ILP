<template>
    <div :class='$style.theList'>
        <ul :class='$style.listItems' tabindex='-1' :aria-describedby='promptID'>
            <template v-if='itemsList.length > 0'>
                <li v-for='(item) in itemsList' :key='item.id'>
                    <span>{{ item.name }}</span>
                    <BaseButtonVue :class='$style.removeItemBtn' isWarning text='' title='delete item'
                        :aria-label='`Delete ${item.name}`' isForActivity
                        @btnClick='removeItemFromList($event, item.id, item.name)' />
                </li>
            </template>
            <li v-else>Please add items to this list</li>
        </ul>
        <BaseButtonVue text='Reset list' @click='resetToInitialList' isForActivity isWarning />
    </div>
    <div :class='$style.nextStepBtns'>
        <BaseTextInputVue label='Add your own items to the list. When adding multiple items, use a comma to separate them.'
            isBtnRequired btnText='Add Items' @userTyped='addItemsToList' />
        <BaseButtonVue v-if='isMultisteps' :class='$style.readyForNextBtn' text='Go to next step' @click='readyForNext'
            isForActivity :isDisabled='itemsList.length === 0' />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import BaseTextInputVue from '../../base/BaseTextInputVue.vue';
import BaseButtonVue from '../../base/BaseButtonVue.vue';
import { setAriaLiveAnnouncement } from '../../../store/ariaLiveStore';
import { includeUserCreatedListInPracticeStore } from '../../../store/activityOptionsStore';
import getLocalStorage from '../../../composables/useGetLocalStorage';


const emits = defineEmits<{
    readyForNext: [isReadyForNextStep: boolean]
}>()
const readyForNext = () => {
    emits('readyForNext', true)
    includeUserCreatedListInPracticeStore(props.id, itemsList)
}

type Props = {
    id: string
    promptID: string
    isMultisteps: boolean
    isStepComplete: boolean
    listItems: string[]
    canAddAdditionalListItems?: boolean
}
const props = defineProps<Props>()

const localStorageCreatedList = getLocalStorage(props.id, 'userCreatedList') as { id: number, name: string }[]

// reactive object for items in list
const itemsList = reactive<{
    id: number;
    name: string;
}[]>([]);

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


// Used to add additional items to list, if allowed
const addItemsToList = (additionalItems: string) => {
    const additionalItemArray = additionalItems.split(',')
    const lettersOnlyRegex = /[a-zA-Z]/
    // filter out any items that do not contain letters
    const filteredItems = additionalItemArray.filter((item) => lettersOnlyRegex.test(item))
    // add items to computed itemsList. Trim any space before/after
    filteredItems.forEach((item) => {
        itemsList.push({
            id: itemsList.length + 1, // Assign a unique ID
            name: item.trimStart().trimEnd()
        });
    });
    // If items are added, also add them to the practiceStore and localStorage
    includeUserCreatedListInPracticeStore(props.id, itemsList)
    // Alert screen readers of how many items were added
    setAriaLiveAnnouncement(`${filteredItems.length} items added to the list`)
}
const removeItemFromList = (e: Event, id: number, name: string) => {
    const listWithoutRemovedItem = itemsList.filter((item) => item.id !== id)
    itemsList.length = 0; // clear the list
    itemsList.push(...listWithoutRemovedItem)
    // If items are removed, update  the practiceStore and localStorage
    includeUserCreatedListInPracticeStore(props.id, itemsList)
    setAriaLiveAnnouncement(`Removed ${name} from list. You are now focused on the list.`);
    // Move focus to <ul> element
    (e.target as HTMLElement).closest('ul')?.focus()
}
const resetToInitialList = () => {
    itemsList.length = 0
    itemsList.push(...listItemsObj)
    includeUserCreatedListInPracticeStore(props.id, itemsList)
    setAriaLiveAnnouncement('List reset')
}
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';


.theList {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin: var(--s6) auto 0;
    padding: 0 var(--s2);
    width: 100%;
    background-color: var(--white);

    .listItems {
        list-style-type: none;
        background-color: var(--offWhite);
        border-radius: var(--s-8);
        border: 1px solid var(--darkGray);
        padding: 0;
        min-width: 40%;
        max-width: 25ch;
        width: 100%;
        margin-bottom: 0;

        >li {
            display: flex;
            align-items: stretch;
            align-content: stretch;
            justify-content: space-between;


            +li {
                border-top: 1px solid var(--lightGray);
                margin-top: 0;
            }


            >span {
                padding: var(--s-4) var(--s-6);
                margin: 0 var(--s-6) 0 var(--s-10);
            }
        }

        .removeItemBtn {
            background-image: url('../../../assets/icon-trashCan.svg');
            background-repeat: no-repeat;
            background-position: center center;
            font-size: var(--s-2);
            background-color: inherit;
            border-width: 0;
            border-radius: 0;
            padding: 0 var(--s0);
            margin-top: 0;

            &:hover,
            &:focus {
                box-shadow: none;
                background-color: var(--red5);
            }
        }

        +button {
            display: block;
            margin: 0 0 var(--s6);
            border-radius: 0 0 var(--s0) var(--s0);
            padding: 0 var(--s2);
        }
    }
}

.nextStepBtns {
    @include containerStyles.interactionMenuBar();
    flex-flow: column nowrap;
    gap: var(--s2) 0;

    >* {
        max-width: 40ch;
    }
}
</style>