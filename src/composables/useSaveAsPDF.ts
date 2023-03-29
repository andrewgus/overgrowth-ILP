import { jsPDF } from 'jspdf'
import type { SectionDetails } from '../store/lessonStore'

/**
 * To generate a PDF download of a learner's work they've completed (practice and/or reflection)
 * @param sectionID currSectionMap
 */
export default function generatePDF(currSection: SectionDetails) {
	const doc = new jsPDF({
		orientation: 'l',
		unit: 'pt',
		format: 'a4',
		putOnlyUsedFonts: true,
		floatPrecision: 'smart',
	})

	const pdfElement: HTMLElement = document.getElementById(currSection.id)!

	doc.html(pdfElement, {
		callback: (pdf) => {
			pdf.save(`${currSection.title.replaceAll(' ', '-').trim()}.pdf'`)
		},
		margin: 0, // optional: page margin
	})
}
