## ADDED Requirements

### Requirement: App-level Error Boundary
The application SHALL wrap the root component in a React Error Boundary. When an unhandled rendering error occurs, the user SHALL see a friendly fallback UI instead of a blank popup.

#### Scenario: Rendering error shows fallback
- **WHEN** a component throws an error during rendering
- **THEN** the Error Boundary SHALL catch the error, log it to console, and display a fallback UI with an error message and a "Reload" button

#### Scenario: Reload button restores app
- **WHEN** user clicks the "Reload" button in the error fallback UI
- **THEN** the application SHALL reload (via `window.location.reload()` or equivalent)

### Requirement: QR generation error feedback
The QR Code tool SHALL display a visible error message when QR code generation fails, instead of silently logging to console.

#### Scenario: QR generation failure shown to user
- **WHEN** QR code generation throws an error (e.g. input too long)
- **THEN** the user SHALL see an error message in the UI indicating the QR code could not be generated

### Requirement: Clipboard operation feedback
All clipboard copy operations SHALL provide user-visible feedback on both success and failure.

#### Scenario: Copy success feedback
- **WHEN** user clicks a copy button and the clipboard write succeeds
- **THEN** the button SHALL show a brief success indication (e.g. icon change or tooltip)

#### Scenario: Copy failure feedback
- **WHEN** user clicks a copy button and the clipboard write fails
- **THEN** the user SHALL see an error indication (e.g. "Copy failed" message or icon change)
