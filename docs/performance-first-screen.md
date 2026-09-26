# First-screen performance fix

## Changes

- Render the hero heading, address and booking link immediately in server HTML.
- Load the background through CSS with an image preload, instead of waiting for a fetch, blob decoding and fonts before revealing content.
- Remove hero SplitText reveal animations and the mobile LiquidGlass/WebGL renderer. Retain the CSS glass surface and scroll parallax.
- Preload MontserratAlternates Light, which is the heading's actual weight, instead of Regular. Add a sans-serif fallback and reduce mobile heading padding to prevent overflow.
- Keep the global loader from covering an explicitly ready hero while its fonts or decorative assets load. Other pages retain their existing asset-readiness checks.

## Validation — 2026-09-26

Production build and TypeScript passed. ESLint passed with the existing Header `<img>` warning. `git diff --check` passed. Visually checked the first screen at a 412 px viewport and the browser's default viewport.

Compared the unchanged HEAD exported to a temporary directory with the modified working tree. Both used Next.js 16.2.3 and Lighthouse 12.8.2, mobile defaults with `--throttling-method=devtools`, headless Chrome, and separate localhost production servers. Runs were sequential; one measured run per version. The baseline used the same installed dependencies but did not copy `.env.local`.

| Metric | Before | After |
| --- | ---: | ---: |
| Performance | 61 | 90 |
| FCP | 1.9 s | 1.5 s |
| LCP | 7.8 s | 1.8 s |
| TBT | 260 ms | 260 ms |
| Speed Index | 7.5 s | 3.9 s |
| CLS | 0.078 | 0.087 |

The baseline LCP node was a SplitText line, “is not a dream”; the modified version's LCP node was the complete heading. The confirmed improvement is first-screen rendering, not a demonstrated reduction in TBT in this paired test. CLS remains below 0.1 but did not improve in this pair.

An earlier run of the modified version using Lighthouse's default *simulated* throttling returned Performance 71, LCP 8.0 s, TBT 50 ms and CLS 0. Those results use a different measurement method and must not be mixed with the DevTools-throttled comparison above. Local results do not guarantee the deployed Vercel score; repeat the production audit after deployment.

Full comparison reports from this session: `/tmp/beauty-room-before.report.html` and `/tmp/beauty-room-after.report.html` (with corresponding JSON files). Changes have not been deployed.
