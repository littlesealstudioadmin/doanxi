# 도안자이 센텀리체 — 영업용 랜딩 페이지

대전 도안신도시 GS건설 자이 분양 단지(도안자이 센텀리체)의 **분양 상담사 개인 홍보용** 원페이지 랜딩.
Astro(정적 사이트) 기반으로 SEO·로딩 속도에 최적화했고, 이미지는 빌드 시 자동으로 WebP/반응형 변환됩니다.

> ⚠️ 비공식 홍보물입니다. 공식 사이트: https://xi.co.kr/DAX

---

## 실행

```bash
npm install
npm run dev      # http://localhost:4321 개발 서버
npm run build    # dist/ 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

요구: Node 18+ (개발 환경 Node 22 확인).

---

## 콘텐츠 수정 — `src/data/site.ts` 한 곳에서

문구·수치·연락처·메뉴 등 거의 모든 내용은 **`src/data/site.ts`** 에서 수정합니다.
컴포넌트(`src/components/*.astro`)는 레이아웃/스타일만 담당합니다.

### ✅ 배포 전 꼭 채워야 할 항목 (`site.ts`의 `TODO` 표시)

| 위치 | 항목 | 설명 |
|---|---|---|
| `agent.phone` | **담당자 휴대폰 번호** | 전화/문자 CTA, 푸터, 플로팅바에 전부 연결됨 (현재 `010-0000-0000` 임시값) |
| `agent.kakaoUrl` | 카카오톡 링크(선택) | 오픈채팅/채널 URL. 비우면 버튼 미노출 |
| `leadForm.endpoint` | **폼 전송 주소** | 비우면 제출 시 문자(SMS) 앱으로 폴백. 채우면 해당 주소로 전송 |
| `leadForm.askInterestType` | 관심평형 수집 여부 | `false` 면 이름+연락처만 수집 |

### 리드폼 백엔드 (택1, 무료로 가능)
- **Formspree**: formspree.io 가입 → 폼 생성 → 받은 `https://formspree.io/f/xxxx` 를 `endpoint` 에 입력
- **Google Apps Script / 네이버 폼 / Tally** 등도 동일하게 endpoint URL만 넣으면 됨
- 미설정 시: 모바일에서 제출하면 담당자에게 보내는 **문자(SMS)** 가 자동 작성됨

---

## 이미지 교체 — `src/assets/images/`

현재 이미지는 공식 사이트에서 받은 **임시 자료**입니다. 클라이언트 제공 고화질본으로 교체하세요.
**같은 폴더에 같은 파일명**으로 덮어쓰면 코드 수정 없이 반영됩니다.

```
src/assets/images/
├── hero/        hero-1-pc.jpg, hero-2-pc.jpg, hero-3-pc.jpg   (첫 화면 캐러셀)
├── sections/    overview / location / premium / design / site-layout /
│                dong-layout / community / system / provided .jpg
├── floorplans/  84a 84b 84c 99a 115b 134p .jpg  (라벨=실제 평형 일치 확인됨)
└── popup/       promo-1.jpg, promo-2.jpg  (현재 미사용, 참고용)
```

- `public/og.jpg` : 카카오톡/SNS 공유 미리보기 이미지 (현재 히어로 1번 복사본)
- `public/favicon.svg` : 파비콘

### 공식 사이트 원본 이미지 출처 (추가로 받을 때)
- 메인 비주얼: `https://xi.co.kr/Files/cmsMain/...`
- 섹션 이미지: `https://xi.co.kr/Files/cmsPage/...`
- 평면도: `https://xi.co.kr/Files/apt_area_kind/...`
- 각 페이지: `https://xi.co.kr/dax/view?cmsMenuSeq=<번호>` (사업개요 29265, 입지 29267, 프리미엄 29277, 단지설계 29414, 배치도 29415, 동호수 29416, CLUB XIAN 29417, SYSTEM 29418, 기본제공 29420, 평면 29421)

---

## 배포 (Vercel / Cloudflare Pages)

빌드 산출물은 정적(`dist/`)이라 어디든 올라갑니다.

**Vercel**: 저장소 연결 → Framework `Astro` 자동 감지 → Deploy (Build `npm run build`, Output `dist`)
**Cloudflare Pages**: Build command `npm run build`, Output dir `dist`

배포 도메인 확정 후 `astro.config.mjs` 의 `SITE_URL`(또는 환경변수 `SITE_URL`)을 실제 도메인으로 변경 → canonical·OG·사이트맵 절대경로가 맞춰집니다.

---

## 구성된 섹션 (협의된 범위)

사업개요 · 입지환경 · 프리미엄(PREMIUM 6) · 단지설계+배치도 · CLUB XIAN 커뮤니티 ·
SYSTEM+기본제공품목 · 평면안내(84·99·115·134㎡) · 상담신청(리드폼)

> 협의에 따라 제외: 분양안내 전체, 세대안내의 e-모델하우스·마감재리스트.
> 프로모션 띠(계약금 1천만원·3회 분납·전매가능 등)는 상담 유도용으로 포함 — 불필요 시 `site.ts`의 `promos` 비우면 숨겨짐.

---

## 기술 메모
- Astro 5 + `astro:assets` 자동 이미지 최적화(WebP) + `@astrojs/sitemap`
- JSON-LD(ApartmentComplex/RealEstateAgent), Open Graph, canonical 적용 — 공식 사이트에 없던 SEO 요소
- 무빌드 추적코드 없음(필요 시 GA4 추가). 외부 폰트는 Pretendard CDN.
