import { test } from "node:test";
import assert from "node:assert/strict";
import { alertCopy, alertLang } from "../app/alerts.js";

test("English and Hindi alarm lines stay distinct", () => {
  assert.match(alertCopy(false, false), /about to boil/);
  assert.match(alertCopy(true, false), /is boiling/);
  assert.match(alertCopy(false, true), /उबलने वाला/);
  assert.match(alertCopy(true, true), /उबल रहा/);
  assert.equal(alertLang(true), "hi-IN");
  assert.equal(alertLang(false), "en-IN");
});
