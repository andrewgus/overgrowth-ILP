# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.6.4] — 2023-09-05

### Changed

- Updated Astro to 3.0

## [0.6.3] — 2023-08-23

- Removed presentational folder. Moved all child folders up a level to be direct child of components.
- Reconfigured aria-live to be a global div at the top of the page. Added ariaLiveStore in /store to manage that.
- Fixed mobile-width issue with math practice equations.

## [0.6.2] — 2023-08-22

### Changed

- Changed how References page works to be a prop on StaticContent
- Changed styles for fade on non-interactive elements
- Imrpvoed saveAsPDF composable to save better
- Added flash to Matching Item change based on feedback
- Section break styles updated based on feedback
- Made callOutBox styles global so it can be used in Vue and Astro files

## [0.6.1] — 2023-08-20

### Changed

- FinaleReflectionReveal component updated to only mark as complete when seen.

## [0.6.0] — 2023-08-18

### Added

- Practice Components added: Math and Matching
- Content layout components: ReferenceItem component for reference sections & StepsList for a dramatic list effect

### Changed

- Updated to localStorage, PracticeSwitchBoard, and activityStore for better functionality
- Updated Flip card component to also include non-flip content
- Had to exclude "save to PDF" button on practice activities due to some more serious bugs. Will come back to it later. PDF button still functions on reflection finale reveal.
- Visual updates to tables
- Visual updates to Reflection finale reveal.
- Included ability to choose highlight color in TextAlert component

## [0.5.5] — 2023-08-16

### Added

- Math practice activity type (WIP)
- useIsActivityCompleted composable to check with practices
- useSwapTabIndexAndFocusWithKeys composable to manage tabindex for keyboard users

### Changed

- Changes to InteractiveActivity and PracticeSwitchBoard components to allow for multiple practice types in one practice activity

## [0.5.4] — 2023-08-15

### Changed

- Fixed ActivityCompleteBtn component to properly show completeBtn
- Adjusted table styles and added a tables.scss for those styles to make them global
- Adjusted TheScene component for better visual of scene, but may require more tweaking
- Ongoing work on Matching component. Added default table styles for results.

## [0.5.3] — 2023-08-14

### Changed

- CallOut component updates & color classes updated in ContainerStyles.scss
- Added @supports css at-rule for svh length value whenever possible. Fallback to vh.
- Updated typography. This is still subject to change.
- Updated ResponsiveVideo component styles.

## [0.5.2] — 2023-08-10

### Changed

- Continued progress on Matching component
- ActivityCompleteBtn component fix for when to show completedBtn or not.
- Clearer error messages for Table componenets
- BaseButton updates for use in practice components

## [0.5.1] — 2023-08-09

### Added

- useShuffleArray composable created

### Changed

- ActivityCompleteBtn component updated to fix save as PDF button bug. ensureCorrectSection function added to make sure the section sets to that reflection section before saving as PDF.
- Changes to InteractiveActivity and PracticeSwitchBoard components as start to new Matching component (a Practice Actvivity type). Matching component is WIP.
- Updated to BaseButton component for clarity when used a link and for use in activity context
- Other minor style updates via components and their associated styles
- Updated to StaticContent component to play around with Conic gradient being used as background.

## [0.5.0] — 2023-08-07

### Added

- ResponsiveVideo component for embedding Videos. Option for transcript download included.
- TableAttribution component for ResponiveTable component when there is an attribution

### Changed

- Updated Typography to include definition lists
- Updated FullWidthImage to SoloImage to reflect that it may or may not be fullWidth, but it is a single image
- Updated MathEq component for conditional displayMode
- Updated ResponsiveTable to function better
- Various minor style tweaks
- Updated SubSection & SideBySideText components for easier use

## [0.4.1] — 2023-08-07

### Changed

- Fixed lessonStore issue where nextIncompleteActivity was not properly registering in all contexts.
- Fixed updatedLocalStorage to assist with the above change
- Fixed ActivitiesOffFooter z-index to always be on top.
- Adjusted KaTex options
- Changed isFinaleReveal prop name to isReflectionFinaleReveal for InteractiveActivity component to be more clear on purpose

## [0.4.0] — 2023-07-31

### Added

- KaTex for typesetting math equations

### Changed

- Updated BaseImage component for .svg use
- Updated SideBySideImage component to fix image width

## [0.3.1] — 2023-07-31

### Changed

- Fixed load issue in setSectionsHandler file. Will now properly show all sections when every activity is complete.
- FinaleReflectionReveal component fixed to properly be set that section to isActivityComplete: true when isLocked property is false.

## [0.3] — 2023-07-27

### Added

- New SubSection component for proper semantics and accessibility of headings between sections and their child subsections

### Changed

- Renamed A11yTextStyle to TextStyle. A11y not needed as it lives in A11y folder.
- FlipCards and FlipCards Widget props updated for strings, rather than Numbers, for better DX
- Updated semantics of TheLesson. Moved <header> into <main> as the header content is part of the main content
- Simplified TheScene to just use the one image with different aspect-ratio for smaller screens & zoom
- Added extra white space to any subsection used within a contentLayout component

## [0.2.0] — 2023-07-26

### Added

- new composable for setting & using ariaLive messages
- new footer to reminder users if activities are turned on, lest they forget later on in the lesson.

### Changed

- refactored useActivityExists function in the lesson store for simplicity
- updated TheLesson layout to make use of the newly created footer component
- update FlipCard component to fix an import bug

## [0.1.1] — 2023-07-19

### Changed

- Fixed flipcard accessibility with aria-controls

## [0.1] — 2023-06-21

### Added

- New flip card interaction using vue.js

### Changed

- Name of TextDescriptor component to A11yTextStyle to clarify purpose of component in use
