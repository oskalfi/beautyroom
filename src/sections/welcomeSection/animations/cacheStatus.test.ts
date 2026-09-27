import assert from "node:assert/strict";
import { test } from "node:test";
import { scriptsCameFromCache } from "./cacheStatus";

const resource = (transferSize: number, decodedBodySize: number, initiatorType = "script") =>
  ({ transferSize, decodedBodySize, initiatorType }) as PerformanceResourceTiming;

test("cached animation scripts allow playback", () => {
  assert.equal(scriptsCameFromCache([resource(0, 2000), resource(0, 4000)]), true);
});

test("Disable cache/network responses and revalidation must skip playback", () => {
  assert.equal(scriptsCameFromCache([resource(2300, 2000)]), false);
  assert.equal(scriptsCameFromCache([resource(300, 2000)]), false);
  assert.equal(scriptsCameFromCache([resource(0, 2000), resource(4300, 4000)]), false);
});

test("missing resource data must not be mistaken for a cache hit", () => {
  assert.equal(scriptsCameFromCache([]), false);
  assert.equal(scriptsCameFromCache([resource(0, 0)]), false);
  assert.equal(scriptsCameFromCache([resource(0, 2000, "img")]), false);
});

test("unrelated image downloads do not invalidate cached scripts", () => {
  assert.equal(scriptsCameFromCache([resource(0, 2000), resource(9000, 8000, "img")]), true);
});
