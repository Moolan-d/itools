## ADDED Requirements

### Requirement: Version type parameter accepted
The `bump-version.js` script SHALL accept a version type argument (`patch`, `minor`, or `major`) from command line and use it to determine the version bump. If no argument is provided, it SHALL default to `patch`.

#### Scenario: Minor version bump
- **WHEN** `node scripts/bump-version.js minor` is executed with current version 1.0.3
- **THEN** both `package.json` and `manifest.json` SHALL be updated to version 1.1.0

#### Scenario: Major version bump
- **WHEN** `node scripts/bump-version.js major` is executed with current version 1.0.3
- **THEN** both `package.json` and `manifest.json` SHALL be updated to version 2.0.0

#### Scenario: Default to patch
- **WHEN** `node scripts/bump-version.js` is executed with no arguments and current version 1.0.3
- **THEN** both `package.json` and `manifest.json` SHALL be updated to version 1.0.4

### Requirement: Package script passes version type
The `npm run package` script SHALL forward the version type argument to `package-release.js`, which SHALL pass it to `bump-version.js`.

#### Scenario: Package with minor flag
- **WHEN** `npm run package -- minor` is executed
- **THEN** the release zip SHALL contain a build with the minor version bumped

### Requirement: No shell command injection
All shell commands in the release scripts SHALL use `execFileSync` or `spawnSync` with argument arrays instead of `execSync` with string interpolation.

#### Scenario: Safe command execution
- **WHEN** `package-release.js` runs shell commands for `rm`, `zip`, and `cp`
- **THEN** all arguments SHALL be passed as array elements, not interpolated into shell strings

### Requirement: Version auto-injected at build time
The application version SHALL be automatically injected from `package.json` at build time via Vite's `define` configuration. The SettingsPage SHALL display this injected version.

#### Scenario: SettingsPage shows current version
- **WHEN** user views the Settings page
- **THEN** the version displayed SHALL match the version in `package.json` without manual updates
