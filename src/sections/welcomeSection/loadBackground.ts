export async function loadBackground(signal: AbortSignal): Promise<Blob> {
  const response = await fetch("/main_bg.avif", { signal, priority: "high" });
  if (!response.ok) throw new Error(`Background request failed: ${response.status}`);
  return response.blob();
}
