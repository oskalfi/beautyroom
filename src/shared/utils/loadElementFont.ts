/** Wait for the font selected by the element's computed theme styles. */
export function loadElementFont(element: Element | null): Promise<FontFace[]> {
  if (!element) return Promise.resolve([]);
  const { fontStyle, fontWeight, fontSize, fontFamily } = getComputedStyle(element);
  return document.fonts.load(`${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`, element.textContent || " ");
}
