const images = new Map<string, Promise<void>>();
export const media = {
  cabinet: "/media/hero-dragon-cabinet-v2.webp",
  mobile: "/media/hero-mobile-v2.webp",
  world: "/media/dragon-world-v2.webp",
} as const;
export function preloadImage(url: string) {
  if (!images.has(url))
    images.set(
      url,
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          img.decode().then(resolve).catch(resolve);
        };
        img.onerror = () => {
          images.delete(url);
          reject(new Error("Image unavailable: " + url));
        };
        img.src = url;
      }),
    );
  return images.get(url)!;
}
