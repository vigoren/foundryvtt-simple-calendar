# AGENTS.md - Simple Calendar

This file provides guidance for AI agents working on the Simple Calendar FoundryVTT module.

## Project Overview

-   **Name**: Simple Calendar
-   **Description**: A FoundryVTT module for managing custom game calendars, time tracking, notes, and events
-   **Repository**: https://github.com/vigoren/foundryvtt-simple-calendar
-   **License**: MIT
-   **Node.js**: >18.0.0 <21.0.0
-   **FoundryVTT Compatibility**: This version (2.4.x) supports Foundry V11-V13. Updates may be needed for V14+.

## V13 Compatibility (v13-compatibility branch)

The `v13-compatibility` branch contains updates for FoundryVTT V13 compatibility only. V12 backward compatibility is NOT required.

### Completed

-   Updated `src/module.json` for V13 (minimumCoreVersion: 11, compatibleCoreVersion: 13)
-   Updated author info to eCyclops
-   Fixed jQuery usage in `src/classes/applications/main-app.ts`:
    -   Replaced `$(template)` with DOMParser
    -   Updated `_activateHeaderButtons` to handle HTMLElement
    -   Wrap returned element in jQuery for V1 compatibility
-   Fixed `getSceneControlButtons` hook to handle both array (V12) and object (V13) formats
-   Fixed hook handlers in `src/classes/s-c-controller.ts` to accept both jQuery and HTMLElement

### Current Status (Testing)

-   Module loads without crashing
-   Calendar window should render
-   May show deprecation warnings (applications still extend V1 classes)

### Remaining Tasks

-   Migrate applications to ApplicationV2 (required for full V13 support):
    -   `MainApp extends FormApplication` - `src/classes/applications/main-app.ts`
    -   `ConfigurationApp extends FormApplication` - `src/classes/applications/configuration-app.ts`
    -   `NoteSheet extends JournalSheet` - `src/classes/notes/note-sheet.ts`
    -   `MigrationApp extends Application` - `src/classes/applications/migration-app.ts`
-   Update `@league-of-foundry-developers/foundry-vtt-types` to V13 (in progress: uses transpileOnly in webpack due to type incompatibilities)
-   Remove V12 compatibility code (can use HTMLElement directly instead of JQuery | HTMLElement unions)
-   Test in Foundry V13 environment
-   Test in Foundry V14 when available

## Development Commands

```bash
# Build the module
npm run build

# Run tests
npm run test

# Check unused i18n translations
npm run unusedI18N

# Build documentation
npm run writedocs
```

## Code Style

-   **Language**: TypeScript
-   **Formatting**: Prettier (4 spaces tab width, 150 print width)
-   **Linting**: ESLint with TypeScript support
-   **Testing**: Jest with ts-jest

### Prettier Config (.prettierrc.json)

```json
{
    "tabWidth": 4,
    "printWidth": 150,
    "trailingComma": "none"
}
```

### ESLint Rules

-   `eqeqeq`: error (use `===`/`!==`)
-   `arrow-body-style`: always
-   `default-case`: required
-   No `var` - use `const`/`let`
-   Ignore patterns: `*.test.*`, `*config.*`, `webpack.*`, `package.json`, `package-lock.json`

## Directory Structure

```
src/
├── classes/           # Main TypeScript classes
│   ├── api/          # Public API (hooks, handlebars helpers)
│   ├── applications/ # Foundry apps (config, main app, migration)
│   ├── calendar/     # Calendar logic (year, month, day, leap year, moon, season)
│   ├── chat/         # Chat timestamps
│   ├── configuration/# Settings and permissions
│   ├── date-selector/# Date selector UI
│   ├── foundry-interfacing/ # Foundry API wrappers
│   ├── notes/        # Note management
│   ├── renderer/     # UI rendering (calendar, clock, date-time controls)
│   ├── sockets/      # Multiplayer socket handling
│   ├── systems/      # Game system integrations
│   ├── time/         # Time keeping
│   ├── triggers/     # Note triggers
│   └── utilities/    # Utility functions
├── constants.ts       # Constants and theme definitions
├── index.ts          # Module entry point
├── lang/             # i18n translation files (JSON)
├── styles/           # SCSS styles
└── templates/        # Handlebars templates
```

## Key Files

-   `src/index.ts` - Module initialization and registration
-   `src/constants.ts` - Theme definitions, configuration constants
-   `src/module.json` - FoundryVTT module manifest
-   `src/classes/s-c-controller.ts` - Main controller class
-   `src/classes/calendar/calendar-manager.ts` - Calendar management

## Testing

-   Test files use `.test.ts` extension
-   Mock Foundry globals in `__mocks__/`
-   Jest config: `jest.config.ts`
-   Run tests: `npm run test`

## Module Output

Build output goes to `dist/` directory. Copy contents to FoundryVTT's `Data/modules/simple-calendar/` to test.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

-   Adding translations (via Weblate)
-   Adding predefined calendars
-   Creating themes

## i18n

-   Translation files in `src/lang/` (JSON format)
-   Check for unused translations: `npm run unusedI18N`
