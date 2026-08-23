import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { services, webPrice } from "../app/services.ts";
import { descriptionsEn, ui } from "../app/content.ts";

test("preflights the complete bilingual retreat collection", () => {
  assert.equal(services.length, 21);
  assert.equal(services.filter((service) => service.category === "facial").length, 13);
  assert.equal(services.filter((service) => service.category === "body").length, 8);
  assert.equal(new Set(services.map((service) => service.id)).size, services.length);

  for (const service of services) {
    assert.ok(service.name.trim(), `${service.id} needs a Vietnamese name`);
    assert.ok(service.englishName.trim(), `${service.id} needs an English name`);
    assert.ok(service.description.trim(), `${service.id} needs a Vietnamese description`);
    assert.ok(descriptionsEn[service.id]?.trim(), `${service.id} needs an English description`);
    assert.ok(Number.isInteger(service.duration) && service.duration > 0, `${service.id} has an invalid duration`);
    assert.ok(Number.isInteger(service.price) && service.price > 0, `${service.id} has an invalid listed price`);
    assert.equal(webPrice(service.price), Math.round(service.price * 0.8), `${service.id} direct rate must be exactly 80%`);
    assert.ok(existsSync(`public${service.image}`), `${service.id} image is missing: ${service.image}`);
  }

  assert.match(ui.vi.common.legal, /không thay thế/i);
  assert.match(ui.en.common.legal, /do not replace/i);
  assert.match(ui.vi.collection.privilegeTitle, /20%/i);
  assert.match(ui.en.collection.privilegeTitle, /20%/i);
  assert.match(ui.vi.booking.readyEyebrow, /06 · YÊU CẦU ĐÃ SẴN SÀNG/i);
  assert.match(ui.en.booking.readyEyebrow, /06 · YOUR REQUEST IS READY/i);
});
