## ADDED Requirements

### Requirement: Tailwind CSS installed and configured
The system SHALL use Tailwind CSS v4 as a PostCSS plugin for all utility class generation. A `postcss.config.js` file SHALL exist at the project root. The main stylesheet SHALL import Tailwind via `@import "tailwindcss"`.

#### Scenario: Tailwind classes render correctly
- **WHEN** a component uses Tailwind utility classes (e.g. `bg-white`, `font-semibold`, `flex`, `rounded-lg`)
- **THEN** the corresponding styles SHALL be applied in the built output

#### Scenario: Build succeeds with Tailwind
- **WHEN** `npm run build` is executed
- **THEN** the build SHALL complete without errors and the dist output SHALL include compiled Tailwind utilities

### Requirement: Hand-written utility classes removed
All manually defined utility classes in `main.css` that duplicate Tailwind functionality SHALL be removed. The system SHALL NOT contain both hand-written and Tailwind-generated versions of the same utility.

#### Scenario: No duplicate utility definitions
- **WHEN** the build output CSS is inspected
- **THEN** there SHALL be no duplicate class definitions for utilities provided by Tailwind (e.g. `.flex`, `.items-center`, `.bg-slate-50`)

### Requirement: Custom styles preserved
Component-specific CSS classes (`.app-container`, `.nav-bar`, `.nav-item`, `.active-pill`, `.btn-modern`, `.icon-btn`, `.content-area`) and CSS custom properties (`:root` variables) SHALL remain in `main.css` and continue to function.

#### Scenario: Custom component styles work
- **WHEN** the popup renders
- **THEN** the nav bar, active pill, buttons, and content area SHALL display with their custom styles intact
