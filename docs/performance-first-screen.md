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

## TBT follow-up — 2026-09-26

Following a deployed Lighthouse result of 700 ms TBT, removed repeated inline vector paths for the wordmark and fingerprint. The components now reference cached external SVG groups through `<use>`, retaining currentColor, dimensions and vector geometry. Animated silhouette paths remain inline.

Deferred SplitText/ScrollTrigger preparation for the introduction, treatment headings, results heading, shared reveal headings and footer until their sections approach the viewport. Carousel positioning/animation preparation and geometry measurements also wait until it approaches the viewport. Animations retain GSAP context cleanup.

Home page build output, uncompressed:

| Quantity | Before | After |
| --- | ---: | ---: |
| HTML bytes | 592,060 | 127,488 |
| Inline script bytes | 222,044 | 43,119 |
| Inline path elements | 509 | 43 |

Two sequential comparison pairs, Lighthouse 12.8.2 mobile defaults with `--throttling-method=devtools`, Next.js 16.2.3 production builds on localhost. The control was exported from HEAD before this follow-up and used a copy of the same installed dependencies; `.env.local` was not copied. These are not measurements of the Vercel deployment and do not establish a change from the user's 700 ms result.

| Metric | Before #1 | After #1 | Before #2 | After #2 |
| --- | ---: | ---: | ---: | ---: |
| Performance | 88 | 93 | 86 | 94 |
| TBT | 250 ms | 140 ms | 340 ms | 130 ms |
| LCP | 2.4 s | 2.2 s | 2.2 s | 2.2 s |
| Speed Index | 3.6 s | 3.1 s | 4.0 s | 3.1 s |
| CLS | 0.087 | 0.087 | 0.087 | 0.087 |

Build/TypeScript, ESLint (existing Header image warning only), and diff whitespace checks passed. Visually checked desktop wordmark and buttons, the mobile Lighthouse screenshot, introduction/results headings and the video carousel after scrolling into view. The first HTML reports are `/tmp/beauty-tbt-before.report.html` and `/tmp/beauty-tbt-after.report.html`; repeat JSON reports are `/tmp/beauty-tbt-before-repeat` and `/tmp/beauty-tbt-after-repeat`.
