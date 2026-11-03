// crypto.randomUUID() only exists in secure contexts (HTTPS or localhost), so it
// is undefined when the app is opened over plain http on another host, such as
// the in-cluster service URL. crypto.getRandomValues() works in every context.
export function newThreadId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
