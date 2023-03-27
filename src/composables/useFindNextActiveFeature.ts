import type {
	SectionDetails,
	FeatureType,
	FeatureMap,
} from '../store/lessonStore'

/**
 * To locate the next active feature
 * @param sectionsArray use allSectionsMap from lessonStore
 * @param features use featuresMap from lessonStore
 * @returns [sectionKey, SectionDetails] for next active feature
 */
export default function findNextActiveFeature(
	sectionsArray: [string, SectionDetails][],
	features: FeatureMap
): [string, SectionDetails] | undefined {
	const next = sectionsArray.find(([_, sectionDetails]) => {
		return (
			// it is a feature && the feature is on && the feature is not complete
			sectionDetails.featureType !== null &&
			features[sectionDetails.featureType as FeatureType] &&
			!sectionDetails.isFeatureComplete
		)
	})
	return next
}
