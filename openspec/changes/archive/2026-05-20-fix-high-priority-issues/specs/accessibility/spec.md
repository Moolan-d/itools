## ADDED Requirements

### Requirement: Tab navigation has ARIA semantics
The bottom tab navigation SHALL use proper ARIA roles (`tablist`, `tab`, `tabpanel`) and attributes (`aria-selected`, `aria-controls`, `aria-labelledby`).

#### Scenario: Screen reader announces tab state
- **WHEN** a screen reader encounters the tab navigation
- **THEN** it SHALL announce each tab's label and selected state (e.g. "QR Code, selected, tab 1 of 4")

#### Scenario: Keyboard navigation between tabs
- **WHEN** a tab is focused and user presses Left/Right arrow keys
- **THEN** focus SHALL move to the previous/next tab and activate it

### Requirement: Icon buttons have accessible labels
All icon-only buttons (Copy, Clear, Download) SHALL have `aria-label` attributes that describe their action.

#### Scenario: Screen reader describes icon button
- **WHEN** a screen reader encounters an icon-only button
- **THEN** it SHALL announce the button's purpose (e.g. "Copy to clipboard", "Clear input", "Download QR code")

### Requirement: Text inputs have associated labels
All textarea and input elements SHALL have an associated `<label>` element or `aria-label` attribute.

#### Scenario: Screen reader describes input
- **WHEN** a screen reader focuses on a textarea
- **THEN** it SHALL announce the input's purpose (e.g. "JSON input", "URL to encode")
