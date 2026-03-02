/**
 * Shim to expose FoundryVTT V13 ApplicationV2 classes as globals.
 * In V13, these live under foundry.applications.api but TypeScript
 * and our code reference them as bare globals.
 * This must be loaded before any class that extends these.
 */
// @ts-ignore
globalThis.ApplicationV2 = foundry.applications.api.ApplicationV2;
// @ts-ignore
globalThis.HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
// @ts-ignore
globalThis.DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
