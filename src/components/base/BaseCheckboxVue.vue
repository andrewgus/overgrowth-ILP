<template>
    <div :class='[$style.checkbox,]'>
        <input type="checkbox" :name="label.replaceAll(' ', '-')" :id="!!id ? id : uniqueID"
            :aria-describedby='!!ariaDescribedByText ? ariaDescribedByText : ""' @input='userCheckedBox'
            :tabindex='setTabIndex' :disabled='isDisabled ?? false'>
        <label :for="!!id ? id : uniqueID" :class='[{ [$style.checked]: isChecked }]'>{{ label }}</label>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import createNanoID from '../../composables/useCreateNanoID';

const uniqueID = createNanoID('checkbox')
type Props = {
    label: string
    id?: string,
    isDisabled?: boolean
    ariaDescribedByText?: string
    setTabIndex?: 0 | -1
}

defineProps<Props>()
const isChecked = ref<boolean>(false)
const emits = defineEmits(['userSelected'])

const userCheckedBox = (e: Event) => {
    const checkedValue = e.target as HTMLInputElement
    if (!checkedValue) return
    isChecked.value = checkedValue.checked
    emits('userSelected', checkedValue.checked)
}
</script>

<style module lang='scss'>
@use '../../styles/mixins/containerStyles.scss';

.checkbox {
    @include containerStyles.flexCenter();
    max-width: max-content;
    border-radius: var(--s-8);
    border: 2px solid transparent;
    padding: 0 var(--s-6);

    input {
        -webkit-appearance: none;
        appearance: none;
        position: relative;
        background-color: var(--white);
        width: max(24px, 1ch);
        height: max(24px, 1ch);
        border: 2px solid var(--blue);
        border-radius: var(--s-10);
        margin-right: var(--s-6);

        &:checked::before {
            content: "\002714";
            position: absolute;
            left: 3px;
            top: 0;
            font-size: var(--s-1);
            color: var(--blue);
            visibility: hidden;
        }

        &:checked::before {
            visibility: visible;
        }

        &:disabled {
            background-color: var(--lightGray);
            border: 1px solid var(--darkGray);

            +label {
                color: var(--darkGray);

            }
        }
    }

    label {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        &.checked {
            font-style: italic;
        }
    }
}
</style>