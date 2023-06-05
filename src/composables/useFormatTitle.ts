/**
 * To format a file name into a properly styled heading
 * @param title title string via file name
 * @returns formatting title string
 */

function useFormatTitle(title: string) {
	return title
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

export default useFormatTitle
