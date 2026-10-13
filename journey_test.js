// Data-integrity tests for the 16-stage journey fallback data.
// Run with: deno test -A
const REQUIRED_FIELDS = [
  "id",
  "image",
  "motion",
  "tag_en",
  "tag_te",
  "title_en",
  "title_te",
  "desc_en",
  "desc_te",
  "alt_en",
  "alt_te",
];

function loadJourneyData() {
  const url = new URL("./journey.js", import.meta.url);
  const code = Deno.readTextFileSync(url);
  // journey.js is a browser IIFE ending with:
  //   })(typeof window !== 'undefined' ? window : this);
  // Redirect its global into a sandbox so tests stay hermetic.
  const sandbox = {};
  const testable = code.replace(
    "})(typeof window !== 'undefined' ? window : this);",
    "})(sandbox);",
  );
  new Function("sandbox", testable)(sandbox);
  return sandbox.RAJA_JOURNEY;
}

function assert(cond, msg) {
  if (!cond) throw new Error("assertion failed: " + msg);
}

Deno.test("journey exposes 16 stages", () => {
  const data = loadJourneyData();
  assert(data, "RAJA_JOURNEY is defined");
  assertEquals(data.count, 16, "count is 16");
  assertEquals(data.stages.length, 16, "stages array has 16 entries");
});

Deno.test("stage ids are sequential 1..16", () => {
  const data = loadJourneyData();
  data.stages.forEach((s, i) => {
    assertEquals(s.id, i + 1, "stage id at index " + i);
  });
});

Deno.test("every stage has all required bilingual fields", () => {
  const data = loadJourneyData();
  for (const s of data.stages) {
    for (const f of REQUIRED_FIELDS) {
      assert(
        s[f] !== undefined && s[f] !== null && String(s[f]).length > 0,
        "stage " + s.id + " missing/empty field: " + f,
      );
    }
  }
});

Deno.test("stage images follow stage-NN.jpg naming", () => {
  const data = loadJourneyData();
  for (const s of data.stages) {
    assert(
      /^stage-\d{2}\.jpg$/.test(s.image),
      "stage " + s.id + " has unexpected image name: " + s.image,
    );
  }
});

function assertEquals(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(
      "assertion failed: " + msg + " (expected " + expected + ", got " + actual +
        ")",
    );
  }
}
