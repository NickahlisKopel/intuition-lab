## Copilot / AI Agent Instructions for intuition-lab

Purpose
- Help contributors and AI agents make safe, focused changes in this Expo Router + React Native codebase.

Big picture
- This is an Expo app using file-based routing via `app/` (Expo Router). The app entry is `expo-router/entry` (see `package.json`).
- Native Android code lives under `android/` with `MainActivity.kt` and `MainApplication.kt` for native integrations.
- UI code is TypeScript React components in `app/` and `components/`. Shared hooks and platform variants exist (e.g. `useClientOnlyValue.ts` and `useClientOnlyValue.web.ts`).

Key commands (how to run locally)
- `npm install` — install deps.
- `npm run start` (or `expo start`) — start Metro / Expo dev server.
- `npm run android` — runs `expo run:android` (or use `cd android && gradlew.bat assembleDebug` on Windows).
- `npm run ios` — runs `expo run:ios` (macOS only).

Project conventions and patterns
- File-based routing: add routes by creating files under `app/` (e.g. `app/index.tsx`, `app/(tabs)/index.tsx`).
- Layouts use `_layout.tsx` files in route directories.
- Platform-specific overrides use filename suffixes (see `useClientOnlyValue.web.ts`). Prefer adding platform files rather than runtime platform checks when appropriate.
- Small presentational components live in `components/` (e.g. `StyledText.tsx`, `Themed.tsx`). Use these for consistent styling.
- Global constants live in `constants/` (e.g. `Colors.ts`).

Integration points & dependencies to watch
- Expo ecosystem: `expo`, `expo-router`, `expo-splash-screen`, `expo-constants`, etc. Changes that touch native modules may require rebuilding native projects.
- `react-native-reanimated` is present — check plugin/setup if modifying animations or Babel.
- Native Android changes: modify files under `android/` and test via the Android build flow.

Testing and quick checks
- Component tests live under `components/__tests__/`. Use `react-test-renderer` for snapshot-like tests.
- Quick manual test: `npm run start` then open simulator/device via Expo CLI (`a` for Android, `i` for iOS on macOS).

Code-change guidance for AI
- Be minimal and surgical: prefer changing the smallest set of files needed and avoid reformatting unrelated files.
- When adding routes, ensure `_layout.tsx` patterns are followed (see `app/_layout.tsx` and `(tabs)/_layout.tsx`).
- When touching native code, include platform-specific verification steps (how to build/run the native app) in the PR description.
- Use existing helper components (`Themed`, `StyledText`, `ExternalLink`) rather than introducing new global patterns unless necessary.

Files to inspect when making changes
- App routing & layouts: `app/_layout.tsx`, `app/index.tsx`, `app/modal.tsx`.
- Components & hooks: `components/`, `useClientOnlyValue.ts`, `useColorScheme.ts`.
- Native entrypoints: `android/app/src/main/java/com/nickkopel/intuitionlab/MainActivity.kt` and `MainApplication.kt`.
- Project config: `package.json`, `tsconfig.json`, `app.json`.

When in doubt
- Run the app locally via `npm run start` and reproduce the flow before opening a PR.
- If a change affects native behavior or dependencies, note exact build steps and platform(s) tested in the PR.

Ask the repo owner for clarification on any ambiguous UX/flow before making broad UI changes.

Feedback
- If any part of this guidance is unclear or missing details, reply with the area you want expanded and example files to reference.
