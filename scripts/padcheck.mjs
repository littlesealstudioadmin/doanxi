// 상단 패딩 점검 도구 — 배경/테두리가 있는 "박스" 요소에서
// 박스 상단과 첫 텍스트 사이의 실제 픽셀 간격을 측정해 작은 순으로 보고.
// 사용: node scripts/padcheck.mjs [url] [width]
import { chromium } from 'playwright-core';

const URL = process.argv[2] || 'http://localhost:4321/';
const WIDTH = Number(process.argv[3] || 1440);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle' });
// 등장 애니메이션으로 인한 위치 오차 제거
await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
await page.waitForTimeout(300);

const rows = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    const hasBg = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const hasBorderTop = parseFloat(cs.borderTopWidth) > 0;
    if (!hasBg && !hasBorderTop) continue;
    if (cs.position === 'fixed' || cs.position === 'sticky') continue; // 헤더/플로팅 제외
    const rect = el.getBoundingClientRect();
    if (rect.width < 120 || rect.height < 48) continue;

    // 박스 내부 첫 텍스트의 top
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let minTop = Infinity;
    let sample = '';
    while (walker.nextNode()) {
      const v = walker.currentNode.nodeValue.trim();
      if (!v) continue;
      const r = document.createRange();
      r.selectNodeContents(walker.currentNode);
      const rr = r.getBoundingClientRect();
      if (rr.height === 0 || rr.width === 0) continue;
      if (rr.top < minTop) {
        minTop = rr.top;
        sample = v.slice(0, 18);
      }
    }
    if (minTop === Infinity) continue;
    const gap = Math.round(minTop - rect.top); // 박스 상단(테두리 바깥) → 첫 텍스트 top
    out.push({
      gap,
      padTop: cs.paddingTop,
      tag: el.tagName.toLowerCase(),
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 34),
      text: sample,
    });
  }
  // 같은 위치 중복 줄이기: gap+text 키로 dedupe
  const seen = new Set();
  const uniq = out.filter((r) => {
    const k = r.gap + '|' + r.text + '|' + r.cls;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return uniq.sort((a, b) => a.gap - b.gap).slice(0, 24);
});

console.log(`\n[${WIDTH}px] 상단 간격(작은 순) — 박스top→첫텍스트top, padTop=CSS padding-top`);
console.log('gap  padTop  element'.padEnd(10) + '  text');
for (const r of rows) {
  const flag = r.gap < 12 ? ' ⚠️' : '';
  console.log(
    String(r.gap).padStart(3) + 'px  ' + r.padTop.padEnd(6) + '  ' + (r.tag + '.' + r.cls).padEnd(40) + '  "' + r.text + '"' + flag,
  );
}
await browser.close();
