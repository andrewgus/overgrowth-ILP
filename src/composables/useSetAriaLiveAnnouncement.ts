import { ref } from 'vue'

const ariaLiveAnnouncement = ref<string>('')

const setAriaLiveAnnouncement = (message: string) => {
	setTimeout(() => {
		ariaLiveAnnouncement.value = message
	}, 1000)
	setTimeout(() => {
		ariaLiveAnnouncement.value = ''
	}, 2000)
}

export { ariaLiveAnnouncement, setAriaLiveAnnouncement }
