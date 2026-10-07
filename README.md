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
| `leadForm.askInterestType` | 관심평형 수집 여부 | `false` 면 닉네임+연락처만 수집 |

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

## 두 번째 사이트 배포 (같은 내용 · 다른 주소/번호)

**코드는 이 저장소 하나만 유지**하고, 빌드 환경변수만 다르게 준 배포를 하나 더 붙입니다.
→ 콘텐츠·이미지 수정은 한 번만 하면 양쪽에 같이 반영됩니다.

| | 주소 | Worker 프로젝트 | 대표번호 | 수집 시트 계정 |
|---|---|---|---|---|
| 1번 사이트 | `doanxi.littlesealstudio.workers.dev` | `doanxi` | `1844-1831` | 기존 계정 |
| 2번 사이트 | `doanxi2.littlesealstudio.workers.dev` | `doanxi2` | `1668-5253` | `a01094088814@gmail.com` |

상담신청·방문로그 **시트는 사이트별로 완전히 분리**합니다(같은 시트 공유 아님).

### 환경변수 (전부 선택 — 없으면 괄호 안 기본값 = 1번 사이트)

| 변수 | 기본값 | 용도 |
|---|---|---|
| `SITE_URL` | `https://doanxi.littlesealstudio.workers.dev` | canonical·OG·사이트맵 절대경로 |
| `SITE_LABEL` | `1번사이트` | 상담신청/방문로그 시트의 **유입사이트** 열에 기록 |
| `AGENT_PHONE` | `1844-1831` | 전화 CTA·플로팅바·푸터 대표번호 |
| `AGENT_KAKAO_URL` | (없음) | 카카오톡 상담 버튼 (비우면 버튼 미노출) |
| `LEAD_ENDPOINT` | 1번 시트 웹앱 URL | 상담신청 수집 주소 — **2번 사이트는 반드시 지정** |
| `VISITLOG_ENDPOINT` | 1번 시트 웹앱 URL | 방문로그 수집 주소 — **2번 사이트는 반드시 지정** |
| `GTM_ID` | `site.ts` 의 `gtm.id` | Google Tag Manager 컨테이너 ID(`GTM-XXXXXXX`). 2번 사이트에서 끄려면 `off` |

> `LEAD_ENDPOINT`·`VISITLOG_ENDPOINT` 를 비워두면 **2번 사이트 상담신청이 1번 시트로 들어갑니다.**
> 2번 프로젝트에는 반드시 채워 넣으세요.

> `.env` 파일로는 적용되지 않습니다. Astro는 `PUBLIC_` 접두사가 없는 값을 `.env`에서 읽지 않으므로,
> **셸 앞에 붙이거나 배포 플랫폼의 빌드 환경변수**로 넣어야 합니다.

### 로컬에서 2번 사이트로 확인

```bash
SITE_LABEL=2번사이트 AGENT_PHONE=1600-0000 npm run dev

SITE_LABEL=2번사이트 \
AGENT_PHONE=1600-0000 \
SITE_URL=https://doanxi2.littlesealstudio.workers.dev \
npm run build
```

### Cloudflare에 2번 배포 추가

1. Cloudflare 대시보드 → **Workers & Pages → Create → 기존 GitHub 저장소(`doanxi`) 연결**
   (1번 사이트와 **같은 저장소·같은 브랜치**를 그대로 연결합니다)
2. 프로젝트 이름을 `doanxi2` 로 지정 → `doanxi2.littlesealstudio.workers.dev`
3. Build command `npm run build` / Output `dist`
4. **Settings → Variables and Secrets → 빌드 변수(Build)** 에 아래 5개 입력

   | 변수 | 값 |
   |---|---|
   | `SITE_URL` | `https://doanxi2.littlesealstudio.workers.dev` |
   | `SITE_LABEL` | `2번사이트` |
   | `AGENT_PHONE` | `1668-5253` |
   | `LEAD_ENDPOINT` | 2번 상담신청 웹앱 URL (아래 '수집 시트' 먼저 진행) |
   | `VISITLOG_ENDPOINT` | 2번 방문로그 웹앱 URL |

   ※ 런타임 변수가 아니라 **빌드 변수**여야 합니다. 정적 빌드라 값이 빌드 시점에 HTML로 박힙니다.
5. Deploy
6. 1번 사이트(`doanxi`)는 환경변수를 건드리지 않습니다 — 기본값이 곧 1번 사이트 설정입니다.

> 환경변수를 바꾼 뒤에는 **재배포(Retry deployment)** 해야 반영됩니다. 빌드 시점에 값이 박히기 때문입니다.

### 수집 시트 (사이트별 완전 분리)

2번 사이트는 **`a01094088814@gmail.com` 계정**으로 스프레드시트 2개를 새로 만들고,
각각 Apps Script 웹앱으로 배포한 뒤 그 URL을 Cloudflare 빌드 변수에 넣습니다.

| 용도 | 붙여넣을 스크립트 | 배포 후 넣을 곳 |
|---|---|---|
| 상담신청 | [`scripts/apps-script-lead-form.gs`](scripts/apps-script-lead-form.gs) | `LEAD_ENDPOINT` |
| 방문로그 | [`scripts/apps-script-visit-log.gs`](scripts/apps-script-visit-log.gs) | `VISITLOG_ENDPOINT` |

절차 (각 시트마다 동일):

1. `a01094088814@gmail.com` 로 로그인 → 새 스프레드시트 생성
2. 확장 프로그램 → Apps Script → 위 파일 내용 붙여넣기
3. 상담신청 스크립트는 상단 `NOTIFY_EMAIL` / `SITE_NAME` 확인
   (기본값이 이미 `a01094088814@gmail.com` / `2번사이트`)
4. 배포 → **새 배포** → 유형 **웹 앱** / 실행 계정 **나** / 액세스 **모든 사용자**
5. 발급된 `https://script.google.com/macros/s/.../exec` URL 복사 → Cloudflare 빌드 변수에 입력
6. 상담신청 스크립트는 편집기에서 `testRun` 실행 → 시트 기록·알림 메일 확인 후 테스트 행 삭제

> ⚠️ **액세스 권한 "모든 사용자"** 를 빠뜨리면 접수가 조용히 실패합니다.
> 사이트는 `no-cors` 로 보내서 오류를 감지하지 못하고, 사용자에게는 "접수되었습니다"가 뜹니다.
> 설치 후 실제 사이트에서 한 건 넣어보고 시트에 쌓이는지 반드시 확인하세요.

> ⚠️ 나중에 스크립트를 수정할 때는 **"배포 관리 → 기존 배포 수정 → 새 버전"** 으로 올려야
> 웹앱 URL이 유지됩니다. "새 배포"를 만들면 URL이 바뀌어 수집이 끊깁니다.

1번 사이트의 기존 시트·스크립트는 **그대로 두면 됩니다.**

### SEO 주의

내용이 100% 동일한 사이트 2개는 검색엔진에서 중복 콘텐츠로 처리될 수 있습니다.
광고(파워링크) 유입 위주면 실무상 문제되지 않지만, 자연 검색 노출은 한쪽이 밀릴 수 있습니다.
필요 시 2번 사이트의 `meta.title`/`description` 만 다르게 주는 것도 방법입니다.

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
- Google Tag Manager: `site.ts` 의 `gtm.id` 에 컨테이너 ID를 넣으면 `<head>`·`<body>` 에 공식 스니펫이 출력됨(비우면 미출력).
  상담신청 접수 성공 시 dataLayer 에 `generate_lead` 이벤트를 push → GTM 에서 '맞춤 이벤트' 트리거로 전환 태그 연결.
- 외부 폰트는 Pretendard CDN.
