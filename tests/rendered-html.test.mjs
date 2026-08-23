import assert from "node:assert/strict";
import test from "node:test";

test("renders the finished SĀKURĀ page metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>SĀKURĀ RETREAT \| Private Botanical Skin &amp; Body Retreat<\/title>/i);
  assert.match(html, /og-sakura-retreat\.jpg/i);
  assert.match(html, /lang=["']vi["']/i);
  assert.match(html, /Rời nhịp phố/i);
  assert.match(html, /Từng chi tiết, dành trọn cho thời gian của bạn/i);
  assert.match(html, /Bạn muốn dành khoảng thời gian này cho điều gì/i);
  assert.match(html, /Những trải nghiệm làm nên dấu ấn SĀKURĀ/i);
  assert.match(html, /SĀKURĀ Concierge luôn sẵn sàng đón tiếp/i);
  assert.match(html, /cinematic-journey/i);
  assert.match(html, /signature-journey/i);
  assert.match(html, /Khoảng thời gian của bạn, được chuẩn bị chu đáo/i);
  assert.match(html, /DIRECT RESERVATION PRIVILEGE/i);
  assert.match(html, /09123 555 03/i);
  assert.match(html, /google\.com\/maps\/embed/i);
  assert.match(html, /KakaoTalk/i);
  assert.match(html, /WeChat/i);
  assert.doesNotMatch(html, /không bị thúc giục/i);
  assert.doesNotMatch(html, /Hai mươi mốt lựa chọn\. Một tiêu chuẩn đón tiếp/i);
});
