// Mirror of stripFences() in src/lib/roaster-import-service.js.
// Keep the two in sync — both strip ```json … ``` fences before JSON.parse.
export function stripFences(text) {
  if (typeof text !== 'string') return text;
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '');
  }
  return t.trim();
}
