export default function useCreateID(title: string) {
	return `${title
		.replaceAll(/[^\w\s]/g, '')
		.replaceAll(' ', '-')
		.substring(0, 25)
		.toLowerCase()}`
}
