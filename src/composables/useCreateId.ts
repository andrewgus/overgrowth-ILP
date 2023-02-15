export default function useCreateID(heading: string) {
	return `${heading
		.replaceAll(/[^\w\s]/g, '')
		.replaceAll(' ', '-')
		.substring(0, 25)
		.toLowerCase()}`
}
