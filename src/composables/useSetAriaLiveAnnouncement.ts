import { ref } from 'vue'

/**
 * the aria-live message to be heard
 */
const ariaLiveAnnouncement = ref<string>('')


/**
 * Sets an aria-live message to inform people using screen readers of UI updates/contextual changes
 * @param message What should be announced
 */
const setAriaLiveAnnouncement = (message: string) => {
	setTimeout(() => {
		ariaLiveAnnouncement.value = message
	}, 1000)
	setTimeout(() => {
		ariaLiveAnnouncement.value = ''
	}, 2000)
}

export { ariaLiveAnnouncement, setAriaLiveAnnouncement }
