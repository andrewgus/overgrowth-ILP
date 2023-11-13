<template>
    <template v-if='waitForData'>
        <template v-if='!!wantSortedListItemNum'>
            <span v-if='isInline' :class='$style.inline'>
                <mark :class='`highlight${highlightColor(listItemFromStore)}`'>
                    <q v-if='!!listItemFromStore'>{{ listItemFromStore }}</q>
                    <template v-else>{{ noPracticeDataResponse }}</template>
                </mark>
                <WidgetToolTipVue v-if='!!!listItemFromStore' btnLabel='View options' isDialog
                    :shouldCloseDialog='shouldCloseDialog'>
                    <a href="#" @click="goToNextIncomplete($event, 'practice')">Turn on &
                        go to
                        practice activity</a>
                </WidgetToolTipVue>
            </span>
            <div v-else :class='$style.display'>
                <p v-if='!!listItemFromStore'><q>{{ listItemFromStore }}</q></p>
                <p v-else>{{ noPracticeDataResponse }}</p>
                <WidgetToolTipVue v-if='!!!listItemFromStore' btnLabel='View options' isDialog
                    :shouldCloseDialog='shouldCloseDialog'>
                    <a href="#" @click="goToNextIncomplete($event, 'practice')">Turn on &
                        go to
                        practice activity</a>
                </WidgetToolTipVue>
            </div>
        </template>
        <template v-if='wantReflectionAnswer'>
            <mark v-if='isInline' :class='[$style.inline, `highlight${highlightColor(reflectionAnswerFromStore)}`]'>
                <q v-if='!!reflectionAnswerFromStore'>{{ reflectionAnswerFromStore }}</q>
                <template v-else>{{ noReflectionDataResponse }}</template>
                <WidgetToolTipVue v-if='!!!reflectionAnswerFromStore' btnLabel='View options' isDialog
                    :shouldCloseDialog='shouldCloseDialog'>
                    <a href="#" @click="goToNextIncomplete($event, 'reflection')">Turn on &
                        go to
                        reflection activity</a>
                </WidgetToolTipVue>
            </mark>
            <div v-else :class='$style.display'>
                <p v-if='!!reflectionAnswerFromStore'><q>{{ reflectionAnswerFromStore }}</q></p>
                <p v-else>{{ noReflectionDataResponse }}</p>
                <WidgetToolTipVue v-if='!!!reflectionAnswerFromStore' btnLabel='View options' isDialog
                    :shouldCloseDialog='shouldCloseDialog'>
                    <a href="#" @click="goToNextIncomplete($event, 'reflection')">Turn on &
                        go to
                        reflection activity</a>
                </WidgetToolTipVue>
            </div>
        </template>
    </template>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import useCreateID from '../../composables/useCreateID'
import { userPracticeStore, userReflectionsStore } from '../../store/activityOptionsStore';
import { useToggleActivity, nextIncompleteActivityMap } from '../../store/lessonStore'
import getLocalStorage from '../../composables/useGetLocalStorage';
import WidgetToolTipVue from './WidgetToolTipVue.vue';
import { useStore } from '@nanostores/vue';
import type { SectionDetails } from '../../types/SectionTypes';
import type { ActivityType } from '../../types/ActivityTypes';


type Props = {
    nameOfActivityForData: string
    wantSortedListItemNum?: number
    wantReflectionAnswer?: boolean
    isInline?: boolean
}
const props = defineProps<Props>()

const activityID = useCreateID(props.nameOfActivityForData)

const listItemFromStore = ref<string | undefined>()
const reflectionAnswerFromStore = ref<string | undefined>()

const noPracticeDataResponse = 'Complete the previous practice activity for your answer to appear here.'
const noReflectionDataResponse = 'Complete the previous reflection activity for your answer to appear here.'

// wait for mounted before showing anything...
const waitForData = ref<boolean>(false)
onMounted(() => waitForData.value = true)

// if sorted list number is requested...
if (!!props.wantSortedListItemNum) {
    // check if there's anything in localStorage first
    onMounted(async () => {
        const data = getLocalStorage(activityID, 'userCreatedList') as {
            id: number
            name: string
        }[]
        listItemFromStore.value = !!data ? data.at(props.wantSortedListItemNum! - 1)!.name : ''

        await nextTick()
        // And watch for practiceStore changes...
        watch(userPracticeStore, (newValue) => {
            if (!!props.wantSortedListItemNum && !!newValue[activityID]) {
                listItemFromStore.value = newValue[activityID].userCreatedList?.at(props.wantSortedListItemNum - 1)?.name ?? ''
            }
        })
    })
}
// if reflection answer is requested...
if (props.wantReflectionAnswer) {
    // check if there's anything in localStorage first
    onMounted(async () => {
        const data = getLocalStorage(activityID, 'reflectionAnswer') as string
        reflectionAnswerFromStore.value = !!data ? data : ''
        await nextTick()
        // And watch for reflectionStore changes...
        watch(userReflectionsStore, (newValue) => {
            if (props.wantReflectionAnswer) reflectionAnswerFromStore.value = !!newValue[activityID] ? newValue[activityID].answer : ''
        })
    })
}

// Determine highlightColor based on whether store content is available or not
const highlightColor = (store: string | undefined) => !!store ? 'green' : 'red'

// For toolTip dialog, first grab the nextIncompleteActivity (this will now be the one that the user jumps to)
const $nextIncompleteActivity = useStore(nextIncompleteActivityMap)
const shouldCloseDialog = ref<boolean>(false)

const goToNextIncomplete = async (e: Event, activityType: ActivityType) => {
    e.preventDefault()
    // toggle on the activity
    useToggleActivity(activityType)

    const target = e.target as HTMLAnchorElement
    if (!target) return

    // get the ID from the nextIncompleteActivity object
    const nextIncompleteActivity = !!$nextIncompleteActivity.value && ($nextIncompleteActivity.value! as SectionDetails)
    if (!nextIncompleteActivity) return;
    const nextIncompleteActivityID = nextIncompleteActivity.id;

    // Find the section with that ID
    const nextIncompleteActivityEl = document.getElementById(nextIncompleteActivityID);

    if (nextIncompleteActivityEl) {
        // Update the href attribute
        target.href = `#${nextIncompleteActivityID}`;

        // Use location.hash to navigate
        location.hash = nextIncompleteActivityID;

        // Scroll to the section
        nextIncompleteActivityEl.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

        // Focus on the section
        nextIncompleteActivityEl.focus();
    }
    // Fall back just to make sure focus is correct. This helps specifically with some Mac VoiceOver wierdness that I cannot explain.
    setTimeout(() => {
        nextIncompleteActivityEl?.focus()
    }, 500)
    // Close the dialog
    shouldCloseDialog.value = true
}
</script>

<style module lang='scss'>
.inline {
    &[class*="highlightred"] {
        font-style: italic;
    }
}


.display {
    text-align: center;
    padding: var(--s-2) var(--s2);
    font-size: var(--s1);
}
</style>