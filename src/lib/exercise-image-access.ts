export function exerciseImagePath(value: string, backendUrl: string): string | null {
  if (!value.includes('://') && !value.startsWith('/') && /^[^/]+\/.+$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.origin !== new URL(backendUrl).origin) return null;
    const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|sign|authenticated)\/exercise-uploads\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch { return null; }
}