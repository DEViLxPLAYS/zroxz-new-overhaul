// Shared constants — avoids magic numbers scattered across the codebase
export const MAX_CHAT_MESSAGES = 20;       // conversation cap per session
export const CHAT_RATE_LIMIT_MAX = 15;     // messages/min per IP
export const CHAT_RATE_WINDOW_MS = 60_000; // 1 minute
export const CONTACT_RATE_LIMIT_MAX = 5;   // submissions per window
export const CONTACT_RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
