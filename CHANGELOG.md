# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.4] - 2024-09-05

###### Goal of change is to ensure that quotes can be saved, updated, retrieved and deleted from the database

### Added
 
 - Added api endpoints for open quotes, deleting quotes, and saving quotes to the database
 - Added a tracker page to display quotes that are tied to your company
 
### Changed

### Fixed

- Fixed Building Sketches to work for multiple shapes and corrected bay and bracing lines to work with all shapes. 

## [0.1.3] - 2024-08-28

###### Goal of change is to correct some recent things in and test the deployment of the application

### Added

- Added production environment variables into Vercel and tested deloyment of application with database access
 
### Changed

- Corrected some dependent input in the building shape, eave heights and roof pitches

### Fixed

## [0.1.2] - 2024-08-24

###### Goal of change is to start work on Building Sketch and finish adding input fields and layout

### Added
- Added Building Sketches for other building shapes, singleSlope, leanTo, nonSymmetrical

- Added bay spacing and bracing lines for symmetrical buildings

- Added additional components for input validation

- Added Hooks for navigation and for Three.js 3D sketch

- Added Building Sketches for other building shapes, singleSlope, leanTo, nonSymmetrical

- Added bay spacing and bracing lines for symmetrical buildings

- Added additional components for input validation

- Added Hooks for navigation and for Three.js 3D sketch

### Changed

### Fixed

- Refactored codebase to separate logic for selected pages from their individual inputs in the form

## [0.1.1] - 2024-08-07

###### Goal of change is to finish the building-layout page and correct global styles application-wide

### Added

- Added Building Sketch and ReusableSelect components

- Added Deeply nested object handlers to handle state of canopies, partitions, and options

### Changed

- Changed the location of the repository to a pbsAdmin shared github account

- Changed layout structure to Grids over Flexboxes

### Fixed

- Fixed responsive layout on building pages

- Fixed remove functions for nested and deeply nested objects

## [0.1.0] - 2024-08-07

###### Goal of change is to move the application over to a shared Github and clean up the project after transferring

### Added

### Changed

- Changed the location of the repository to a pbsAdmin shared github account

### Fixed

## [0.0.5] - 2024-08-02

###### Goal of change is to layout input boxes and structure of state object to save Quote information as well as build out authorization structure

### Added

- Added Building Project page functions (Activate/Add/Remove/Copy buildings)

- Added Generic Delete and Copy building Dialogs to use to confirm user input

- Added Active Building and Dynamic switching of building pages

### Changed

- Changed formatting on input fields

- Changed authorization to be based on permissions level

### Fixed

- Fixed the id and names of inputs/labels to add building index

- Fixed state object on add and remove building functions

- Fixed registration to be protected behind admin permissions

## [0.0.4] - 2024-07-31

###### Goal of change is to complete layout for Quote input demo with functionality

### Added

- Responsive layout for mobile and tablets on the Quote input page with a bottom carousel navigation

### Changed

### Fixed

- Removed tracking from environment variables to prevent information from being exposed

## [0.0.3] - 2024-07-28

###### Goal of change is to add additional protected routes and complete build of initial page structure that matches PBS Quote Generator

### Added

- Added a Quote Input page with sidebar nav and corrected some of the styling on dashboard and login pages

### Changed

### Fixed

## [0.0.2] - 2024-07-26

###### Goal of change is to demo how we can update project in production and also update PWA structure.

### Added

- Added version to home page to demo updating project in production environment

### Changed

### Fixed

## [0.0.1] - 2024-07-23

###### Goal of change is to setup project and determine a working tech stack that has all the features we need

### Added

- [dealer-cloud-project](http://github.com/Temel00/dealer-cloud-project)
  Initial Setup

- Setup Next.js application with NextAuth and AppRouter for authentication and authorization.
- Created Login, Register, and protected Dashboard routes as well as connected mariaDB database to check Users for valid user and pass.
- Configured PWA using next-pwa for desktop use.

### Changed

### Fixed
