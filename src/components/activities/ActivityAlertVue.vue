<template>
    <BaseAlertTextVue v-if="shouldShowAlert && !activityProgressStore.activtyAlertViewed">
        <p :id='`${id}-activityAlert`'>
            <span class="visuallyHidden">Important:</span>
            Yes, you correctly turned off {{ activityType }} activities. Any incomplete {{ activityType }} activities are
            hidden. This one is shown because you completed it. You&rsquo;ll always be able to review completed
            work.
        </p>
        <BaseButtonVue :class='$style.activityAlertBtn' text='Thanks. Got it.' :aria-describedBy='`${id}-activityAlert`'
            @click='hideAlerts($event)'>
        </BaseButtonVue>
    </BaseAlertTextVue>
</template>

<script setup lang="ts">
import BaseAlertTextVue from '../base/BaseAlertTextVue.vue'
import type { ActivityType } from '../../types/ActivityTypes';
import { watch, ref } from 'vue';
import { activitiesMap, filteredNavSectionsComputed } from '../../store/lessonStore'
import { useStore } from '@nanostores/vue';
import BaseButtonVue from '../base/BaseButtonVue.vue';
import { activityProgressStore } from '../../store/activityOptionsStore';

const $activities = useStore(activitiesMap)
const $navSections = useStore(filteredNavSectionsComputed)

type Props = {
    id: string
    activityType: ActivityType
}
const props = defineProps<Props>()
const shouldShowAlert = ref<boolean>(false)

const hideAlerts = ({ target }: Event) => {
    const activityContainer = (target as HTMLButtonElement).closest('.section.activity') as HTMLElement
    !!activityContainer && activityContainer.focus()
    activityProgressStore.activtyAlertViewed = true

}


watch($activities, (newValue) => {
    const navSectionKeys = Object.keys($navSections.value)
    // if user turns off activity type, and the activity is complete, isSectionShown.value should be true
    if (!newValue[props.activityType]) shouldShowAlert.value = navSectionKeys.includes(props.id)
})

</script>

<style module lang='scss'>
.activityAlertBtn {
    width: max-content;
    margin: var(--s-2) auto 0;
}
</style>