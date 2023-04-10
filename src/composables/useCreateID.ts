/**
 * To generate an ID from a section's title
 * @param title H2 title for a section
 * @returns ID version of title
 */
export default function createID(title: string) {
	return `${title
		.trim()
		.replaceAll(/[^\w\s]/g, '')
		.replaceAll(' ', '-')
		.substring(0, 25)
		.toLowerCase()}`
}
