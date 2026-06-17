// 이미지 자체의 가장자리 여백(균일 배경) 측정 도구.
// 각 이미지에서 상/하/좌/우로 "코너 배경색과 동일한" 균일 줄이 몇 px 이어지는지 측정.
// top 이 0~몇 px면 = 내용물이 이미지 위 끝에 붙어 있음(내부 상단 여백 없음).
// 사용: node scripts/imgmargin.mjs
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/assets/images';
const TOL = 16; // 채널당 허용 오차
const BADRATE = 0.02; // 한 줄에서 배경과 다른 픽셀 비율이 이보다 크면 '내용 있음'

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function analyze(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: CH } = info;
  const px = (x, y) => {
    const i = (y * W + x) * CH;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const diff = (a, b) => Math.abs(a[0] - b[0]) > TOL || Math.abs(a[1] - b[1]) > TOL || Math.abs(a[2] - b[2]) > TOL;

  const stepX = Math.max(1, Math.floor(W / 80));
  const stepY = Math.max(1, Math.floor(H / 80));

  const rowUniform = (y, bg) => {
    let bad = 0, n = 0;
    for (let x = 0; x < W; x += stepX) { n++; if (diff(px(x, y), bg)) bad++; }
    return bad / n < BADRATE;
  };
  const colUniform = (x, bg) => {
    let bad = 0, n = 0;
    for (let y = 0; y < H; y += stepY) { n++; if (diff(px(x, y), bg)) bad++; }
    return bad / n < BADRATE;
  };

  const bgTop = px(0, 0);
  const bgBot = px(0, H - 1);
  let top = 0; while (top < H && rowUniform(top, bgTop)) top++;
  let bottom = 0; while (bottom < H && rowUniform(H - 1 - bottom, bgBot)) bottom++;
  let left = 0; while (left < W && colUniform(left, bgTop)) left++;
  let right = 0; while (right < W && colUniform(W - 1 - right, px(W - 1, 0))) right++;

  return { W, H, top, bottom, left, right, bg: bgTop };
}

const files = walk(ROOT).filter((f) => !f.includes('/popup/')); // 미사용 popup 제외
const rows = [];
for (const f of files) {
  try { rows.push({ f: f.replace(ROOT + '/', ''), ...(await analyze(f)) }); }
  catch (e) { console.log('ERR', f, e.message); }
}
rows.sort((a, b) => a.top - b.top);

console.log('\n이미지 내부 여백(px) — top 작은 순.  bg=코너 배경색(rgb)');
console.log('top  bot  L    R    size        bg            file');
for (const r of rows) {
  const flag = r.top <= 4 ? ' ⚠️ 상단여백 거의 없음' : r.top < 16 ? ' ⚠ 빠듯' : '';
  console.log(
    String(r.top).padStart(3) + '  ' + String(r.bottom).padStart(3) + '  ' +
    String(r.left).padStart(3) + '  ' + String(r.right).padStart(3) + '  ' +
    (r.W + 'x' + r.H).padEnd(11) + ' ' +
    ('(' + r.bg.join(',') + ')').padEnd(14) + ' ' + r.f + flag,
  );
}
