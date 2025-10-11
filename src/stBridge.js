// src/stBridge.js
// Minimal bridge used only by the new regex feature.
// Uses SillyTavern's regex engine as a CATALOG (to list/resolve scripts by name),
// and applies selected scripts LOCALLY via standard JS RegExp.replace.

import { debug } from "../lib/utils.js";

/* -------------------------------------------------------------------------- */
/* Engine catalog bootstrap (async)                                           */
/* -------------------------------------------------------------------------- */

let engineLoaded = false;
let getRegexScriptsRef = null;

(async function initRegexEngine() {
	try {
		// Update this path only if SillyTavern moves the regex engine.
		const engine = await import('../../../../../../scripts/extensions/regex/engine.js');
		getRegexScriptsRef = engine?.getRegexScripts || null;
		engineLoaded = typeof getRegexScriptsRef === 'function';
	} catch (err) {
		console.warn('[Tracker Enhanced] Regex engine catalog failed to load:', err);
		engineLoaded = false;
	}
})();

export function isRegexEngineAvailable() {
	return engineLoaded === true;
}

export function getRegexScriptNames() {
	if (!engineLoaded || typeof getRegexScriptsRef !== 'function') return [];
	try {
		const arr = getRegexScriptsRef() || [];
		const out = [];
		for (const s of arr) {
			const n = s?.scriptName || s?.name;
			if (n) out.push(n);
		}
		return out;
	} catch {
		return [];
	}
}

/* -------------------------------------------------------------------------- */
/* Local application helpers                                                  */
/* -------------------------------------------------------------------------- */

// Parse a "/pattern/flags" string (as stored in script.findRegex) to a real RegExp.
// Falls back to treating the entire string as a pattern with 'g' flag if not slash-delimited.
function parseFindRegex(findRegex) {
	if (typeof findRegex !== 'string' || !findRegex.length) return null;

	// Expect formats like "/foo/gi" or plain "foo"
	if (findRegex.startsWith('/')) {
		const lastSlash = findRegex.lastIndexOf('/');
		if (lastSlash > 0) {
			const pattern = findRegex.slice(1, lastSlash);
			const flags = findRegex.slice(lastSlash + 1);
			try {
				return new RegExp(pattern, flags);
			} catch {
				return null;
			}
		}
	}

	// Fallback: treat as a plain pattern with 'g' by default
	try {
		return new RegExp(findRegex, 'g');
	} catch {
		return null;
	}
}

function escapeRegExpLiteral(s) {
	// Escape user-provided literal text so it cannot act as a regex
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Apply a single script locally to text using JS RegExp.replace.
// Supports: findRegex + replaceString, and trimStrings (as LITERALS).
function applyScriptLocally(text, script) {
	let out = String(text ?? '');
	if (!script || typeof script !== 'object') return out;

	// Primary find/replace
	const re = parseFindRegex(script.findRegex);
	const replace = typeof script.replaceString === 'string' ? script.replaceString : '';
	if (re) {
		try {
			out = out.replace(re, replace);
		} catch {
			/* ignore and return current out */
		}
	}

	// Optional literal trims
	if (Array.isArray(script.trimStrings) && script.trimStrings.length) {
		for (const s of script.trimStrings) {
			if (typeof s === 'string' && s.length) {
				try {
					const lit = new RegExp(escapeRegExpLiteral(s), 'g');
					out = out.replace(lit, '');
				} catch {
					/* ignore invalid patterns */
				}
			}
		}
	}

	return out;
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

// Run multiple scripts (by name) on text in sequence; returns a string.
// Engine is used only to map script names -> script objects; the application is local.
export function runRegexScriptsOnText(text, names) {
	let out = String(text ?? '');
	if (!Array.isArray(names) || names.length === 0) return out;

	// Resolve selected names to script objects using the catalog
	const byName = Object.create(null);
	try {
		if (engineLoaded && typeof getRegexScriptsRef === 'function') {
			const all = getRegexScriptsRef() || [];
			for (const s of all) {
				const n = s?.scriptName || s?.name;
				if (n) byName[n] = s;
			}
		}
	} catch {
		// If catalog isn't available yet, byName stays empty and we fall through.
	}

	for (const name of names) {
		const sc = byName[name];
		if (!sc) continue; // if engine not yet loaded or script missing, skip gracefully

		const before = out;
		const after = applyScriptLocally(before, sc);
		const changed = before !== after;

		// Debug log is gated by extension debug mode via utils.debug()
		debug(`[Tracker Enhanced][Regex] applied "${name}" changed=${changed}`);
		out = after;
	}

	return out;
}

// (end bridge)
