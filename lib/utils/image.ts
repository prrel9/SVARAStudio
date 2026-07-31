export function getValidImageSrc(
  src: unknown,
  fallback: string = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80"
): string {
  if (typeof src === "string" && src.trim().length > 0 && src !== "[object Object]") {
    return src.trim();
  }

  if (
    src &&
    typeof src === "object" &&
    "src" in src &&
    typeof (src as { src?: string }).src === "string"
  ) {
    const objSrc = (src as { src: string }).src;
    if (objSrc.trim().length > 0 && objSrc !== "[object Object]") {
      return objSrc.trim();
    }
  }

  return fallback;
}
