// Normalize Unsplash URL (smaller, fast)

// Build a proxy URL for Unsplash (works when Unsplash is blocked)
export function proxyUnsplash(url: string | null | undefined) {
  const u = String(url ?? "").trim();
  if (!u || !u.startsWith("https://images.unsplash.com")) return "";
  // images.weserv.nl is a public image proxy
  const encoded = encodeURIComponent(u.replace(/^https?:\/\//, ""));
  // Add sizing too so it stays fast
  return `https://images.weserv.nl/?url=${encoded}&w=800&fit=cover&q=60`;
}

export function normalizeUnsplash(url: string) {
  if (!url) return "/recipes/fallback.jpg";
  if (url.includes("unsplash.com") && !url.includes("?")) {
    return `${url}?auto=format&fit=crop&w=800&q=80`;
  }
  return url;
}
