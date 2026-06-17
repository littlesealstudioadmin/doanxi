// 로컬 시스템 Chrome으로 페이지 스크린샷을 찍는 도구
// 사용: node scripts/shot.mjs [url] [outPrefix] [width]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] || 'http://localhost:4321/';
const PREFIX = process.argv[3] || '/tmp/shots/page';
const WIDTH = Number(process.argv[4] || 1440);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

mkdirSync('/tmp/shots', { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle' });
// 검증용: 등장 애니메이션(.reveal) 강제 해제해 최종 상태로 캡처
await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
await page.waitForTimeout(600);

// 전체 페이지
await page.screenshot({ path: `${PREFIX}-full.png`, fullPage: true });

// 섹션별 캡처
const sections = ['hero', 'overview', 'location', 'premium', 'design', 'community', 'system', 'floorplans', 'contact'];
for (const id of sections) {
  const el = page.locator(`#${id}`).first();
  if (await el.count()) {
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await el.screenshot({ path: `${PREFIX}-${id}.png` });
    } catch (e) {
      console.log(`skip ${id}: ${e.message}`);
    }
  }
}

await browser.close();
console.log('done');
