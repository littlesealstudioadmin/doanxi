// 시각 검수용 스크린샷 — lazy 이미지를 전부 로드시킨 뒤 PC/모바일 전 섹션 캡처
// 사용: node scripts/shot2.mjs [url] [outPrefix] [width]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] || 'http://localhost:4321/';
const PREFIX = process.argv[3] || '/tmp/shots5/dax';
const WIDTH = Number(process.argv[4] || 1440);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

mkdirSync(PREFIX.replace(/\/[^/]+$/, ''), { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'domcontentloaded' });
// 등장 애니메이션 무력화 → 최종 상태로 캡처
await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });

// 1) 작은 보폭으로 끝까지 스크롤하며 lazy 로딩 트리거 (2패스)
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y <= document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await sleep(150);
    }
  }
  window.scrollTo(0, 0);
});

// 2) 모든 <img> 가 complete 될 때까지 최대 20초 대기 (hang 방지)
try {
  await page.waitForFunction(
    () => [...document.images].every((im) => im.complete && im.naturalWidth > 0),
    { timeout: 20000, polling: 300 },
  );
} catch {
  const pending = await page.evaluate(
    () => [...document.images].filter((im) => !(im.complete && im.naturalWidth > 0)).map((im) => im.currentSrc).slice(0, 5),
  );
  console.log('⚠️ 일부 이미지 미완료:', pending);
}
await page.waitForTimeout(400);

await page.screenshot({ path: `${PREFIX}-full.png`, fullPage: true });
const sections = ['hero', 'overview', 'location', 'premium', 'design', 'community', 'system', 'floorplans', 'contact'];
for (const id of sections) {
  const el = page.locator(`#${id}`).first();
  if (await el.count()) {
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await el.screenshot({ path: `${PREFIX}-${id}.png` });
    } catch (e) {
      console.log(`skip ${id}: ${e.message}`);
    }
  }
}
await browser.close();
console.log('done', WIDTH);
