/**
 * Memorable Passwords — Background service worker.
 * Manifest v3 requires a service worker for background tasks.
 * Currently minimal — can be extended with context menus, shortcuts, etc.
 */

chrome.runtime.onInstalled.addListener(() => {
	console.log("Memorable Passwords installed");
});
