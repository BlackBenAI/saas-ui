import { hexToRgb } from "@/lib/color-utils";

export function generateShadow(
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: string,
  opacity: number,
): string {
  const [r, g, b] = hexToRgb(color);
  return `${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export function generateTransition(duration: number, easing: string): string {
  return `all ${duration}ms ${easing}`;
}
