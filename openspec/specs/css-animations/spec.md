## ADDED Requirements

### Requirement: Tab content transitions via CSS
Tab content switching SHALL use CSS animations instead of framer-motion. When the active tab changes, the outgoing content SHALL fade out and the incoming content SHALL fade in with a subtle vertical slide.

#### Scenario: Tab switch animation
- **WHEN** user clicks a different tab in the navigation bar
- **THEN** the current content SHALL animate out (fade + slide up) and the new content SHALL animate in (fade + slide down) within 200ms

#### Scenario: No animation library dependency
- **WHEN** `npm ls framer-motion` is run
- **THEN** framer-motion SHALL NOT appear in the dependency tree

### Requirement: Active tab indicator transitions
The active tab indicator (pill/highlight) in the bottom navigation bar SHALL visually indicate the active tab using CSS transitions. A smooth transition between tabs is acceptable but not required.

#### Scenario: Active tab visually distinct
- **WHEN** a tab is active
- **THEN** it SHALL have a visually distinct appearance (background highlight or color change) that differentiates it from inactive tabs

### Requirement: QR code display animation
When a QR code is generated and displayed, it SHALL appear with a scale-in + fade animation using CSS.

#### Scenario: QR code appears with animation
- **WHEN** user enters text and a QR code is generated
- **THEN** the QR code display SHALL animate in with a scale + opacity transition
