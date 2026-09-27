/** Missing timing information is not evidence of a cache hit. */
export function scriptsCameFromCache(entries: readonly PerformanceResourceTiming[]) {
  const scripts = entries.filter(entry => entry.initiatorType === "script");
  return scripts.length > 0 && scripts.every(entry =>
    entry.transferSize === 0 && entry.decodedBodySize > 0,
  );
}
