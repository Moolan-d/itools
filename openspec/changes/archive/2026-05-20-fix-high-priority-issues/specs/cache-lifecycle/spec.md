## ADDED Requirements

### Requirement: Cache data cleared when caching disabled
When the user toggles the cache setting to off, the `useCachedInput` hook SHALL remove the corresponding localStorage key for that input. Re-enabling caching SHALL start with a clean state.

#### Scenario: Disable cache clears stored data
- **WHEN** user disables caching in Settings and a cached input exists in localStorage
- **THEN** the localStorage entry for that input SHALL be removed

#### Scenario: Re-enable cache starts fresh
- **WHEN** user re-enables caching after disabling it
- **THEN** the input field SHALL be empty (no stale data restored from localStorage)

### Requirement: JSONTool preserves cached format
The JSONTool SHALL NOT re-format cached JSON input on mount. If the user stored minified JSON, it SHALL remain minified when the popup reopens.

#### Scenario: Minified JSON preserved
- **WHEN** user pastes minified JSON, closes the popup, and reopens it
- **THEN** the cached JSON SHALL be displayed in its original minified format (not auto-prettified)

#### Scenario: Prettified JSON preserved
- **WHEN** user prettifies JSON, closes the popup, and reopens it
- **THEN** the cached JSON SHALL be displayed in its prettified format
