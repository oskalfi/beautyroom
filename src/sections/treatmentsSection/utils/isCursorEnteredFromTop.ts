export function isCursorEnteredFromTop(
  element: HTMLElement,
  previousCursorCoord: number,
): boolean {
  const elementTop = element.getBoundingClientRect().top;
  return elementTop - previousCursorCoord > 0 ? true : false;
}
