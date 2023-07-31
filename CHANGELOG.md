# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.3.1] — 2023-07-31

### Changed
- Fixed load issue in setSectionsHandler file. Will now properly show all sections when every activity is complete.
- FinaleReflectionReveal component fixed to properly be set that section to isActivityComplete: true when isLocked property is false.

## [0.3.0] — 2023-07-27

### Added
- New SubSection component for proper semantics and accessibility of headings between sections and their child subsections
- SideBySideImage & SideBySideText components created

### Changed
- SideBySide component removed. Differed to more specified components based on usage.
- Renamed A11yTextStyle to TextStyle. A11y not needed as it lives in A11y folder.
- FlipCards and FlipCards Widget props updated for strings, rather than Numbers, for better DX
- Updated semantics of TheLesson. Moved <header> into <main> as the header content is part of the main content
- Simplified TheScene to just use the one image with different aspect-ratio for smaller screens & zoom
- Added extra white space to any subsection used within a contentLayout component

## [0.2.1] — 2023-07-27

### Changed
- Updated semantics of TheLesson. Moved <header> into <main> as the header content is part of the main content
- Simplified TheScene to just use the one image with different aspect-ratio for smaller screens & zoom

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

## [0.1.0] — 2023-07-17

### Added
- New flip card interaction using vue.js

### Changed
- Name of TextDescriptor component to A11yTextStyle to clarify purpose of component in use