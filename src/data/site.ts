/**
 * ───────────────────────────────────────────────────────────
 *  도안자이 센텀리체 · 영업용 랜딩 페이지 — 콘텐츠 단일 소스
 * ───────────────────────────────────────────────────────────
 *  ※ 사이트의 모든 문구/수치/연락처는 이 파일에서만 수정하면 됩니다.
 *  ※ "TODO" 표시는 실제 정보 입력이 필요한 항목입니다.
 */

export const site = {
  /** 기본 메타 / SEO */
  meta: {
    title: '도안자이 센텀리체 | 대전 도안신도시 GS건설 자이 대단지',
    description:
      '대전 유성구 도안신도시 GS건설 자이 2,293세대 대단지. 트램 역세권(예정)·트리플 학세권·서남부종합스포츠타운 인접. 전용 84·99·115·134㎡. 선착순 동·호 지정 계약 상담.',
    keywords:
      '도안자이, 도안자이 센텀리체, 대전 자이, 도안신도시, 용계동 분양, 유성구 아파트, GS건설, 도안2지구',
    ogImage: '/og.jpg', // public/og.jpg
  },

  /** 영업 담당자(이 페이지의 광고 주체) — 리드/전화상담 핵심 */
  agent: {
    name: '송형규', // 분양 상담 담당
    title: '분양 상담사',
    phone: '1844-1831',
    kakaoUrl: '', // TODO(선택): 카카오톡 오픈채팅/채널 링크
    phoneOfficialLabel: '대표 분양문의',
    phoneOfficial: '1533-5400', // 공식 분양문의(참고)
  },

  /** 리드폼(관심고객/상담신청) 전송 설정
   *  → 백엔드 없이 동작하는 방법(택1): Formspree / Google Apps Script / 네이버 폼 등
   *  → endpoint 가 비어 있으면 "전화/문자"로 유도하는 폴백 동작 */
  leadForm: {
    endpoint: 'https://script.google.com/macros/s/AKfycbytFDVaRpF9hnk3ggbSmFMRg1UvjKZEr00kS1Tb8xtImI959HwJ07KSWohAIYPEvazK/exec', // Google Apps Script 웹앱 → 구글 시트 누적
    // 수집 항목: 별도(관심평형 포함) vs 연락처만 — 클라이언트 확정 후 fields 조정
    askInterestType: true, // false 면 이름+연락처만 수집
    gift: '관심고객 등록·방문 상담 시 방문 사은품(신세계상품권)을 드립니다.',
    privacyNote:
      '수집된 개인정보(성함·연락처)는 분양 상담 목적에 한해 이용되며, 상담 완료 후 파기됩니다.',
  },

  /** 히어로(첫 화면) */
  hero: {
    headline: ['대전의 새로운 중심,', '도안자이 센텀리체'],
    subcopy: '도안신도시 2,293세대 자이 대단지 · 선착순 동·호 지정 계약',
    badges: ['GS건설 자이', '총 2,293세대', '트램 역세권(예정)', '트리플 학세권'],
    slides: ['hero/hero-1-pc.jpg'], // 빌딩 조감도만 사용(지하철·도서관은 프리미엄 슬라이드라 제외)
  },

  /** 특별 계약 혜택(프로모션 띠) — 공식 프로모션 배너 기반, 상담 유도용
   *  ※ 분양안내(상세) 메뉴는 제외, 단 핵심 혜택은 영업 소구점으로 노출 */
  promos: [
    { label: '계약금', value: '1차 1,000만원', note: '정액제' },
    { label: '분납', value: '계약금 3회 분납', note: '초기 부담 ↓' },
    { label: '전매', value: '중도금 납입 전 전매 가능', note: '계약금 완납 시' },
    { label: '혜택', value: '무상 제공품목', note: '3연동 중문·이태리산 타일' },
  ],

  /** ① 사업개요 */
  overview: {
    title: '사업개요',
    image: 'sections/overview.jpg',
    rows: [
      ['단지명', '도안자이 센텀리체'],
      ['시공', 'GS건설 (자이 / XI)'],
      ['위치', '대전광역시 유성구 용계동 일원 (도안신도시 / 도안2지구)'],
      ['규모', '총 2,293세대 (임대 포함) · 일반분양 1,780세대'],
      ['1단지', '지하2~지상42층 8개동 1,209세대 (일반분양 946)'],
      ['2단지', '지하2~지상39층 10개동 1,084세대 (일반분양 834)'],
      ['전용면적', '84㎡ · 99㎡ · 115㎡ · 134㎡(펜트하우스)'],
      ['입주예정', '1단지 2029년 10월 / 2단지 2029년 12월'],
      ['시행 / 신탁', 'HM도안·HM파트너스 / 교보자산신탁'],
    ],
  },

  /** ② 입지환경 */
  location: {
    title: '입지환경',
    image: 'sections/location.jpg',
    lead: '도안신도시 중심에서 누리는 교통·교육·생활 인프라',
    points: [
      {
        icon: 'train',
        title: '트램 역세권 (예정)',
        desc: '대전도시철도 2호선 트램 용계역(예정) 도보권 · 동서대로 등 광역 교통망',
      },
      {
        icon: 'school',
        title: '트리플 학세권',
        desc: '단지 인근 초·중·고 신설 추진 · 도보 통학 가능한 교육 환경(계획)',
      },
      {
        icon: 'park',
        title: '서남부종합스포츠타운 · 중앙공원',
        desc: '서남부종합스포츠타운 인접 · 대규모 근린공원/녹지 생활권(조성 예정)',
      },
      {
        icon: 'store',
        title: '생활 인프라',
        desc: '롯데마트·홈플러스·백화점·종합병원 등 유성구 기존 생활권 이용',
      },
    ],
    disclaimer: '※ 교통·학군·인프라 일부는 계획/예정 사항으로 추진 과정에서 변경될 수 있습니다.',
  },

  /** ③ 프리미엄 */
  premium: {
    title: '프리미엄',
    image: 'sections/premium.jpg',
    lead: '남다른 미래, 압도적 브랜드 — 도안자이 센텀리체의 6가지 프리미엄',
    items: [
      { no: '01', title: '브랜드 프리미엄', desc: 'GS건설 자이(XI) 1군 브랜드 가치' },
      { no: '02', title: '역세권 프리미엄', desc: '트램 2호선 용계역(예정) 생활권' },
      { no: '03', title: '명품설계 프리미엄', desc: '총 2,293세대 대단지 · 4Bay 판상형 위주 설계' },
      { no: '04', title: '교육 프리미엄', desc: '초·중·고 트리플 학세권(계획)' },
      { no: '05', title: '생활인프라 프리미엄', desc: '도안신도시 상업·문화·의료 인프라' },
      { no: '06', title: '미래가치 프리미엄', desc: '서남부스포츠타운·도안 후속개발 기대' },
    ],
  },

  /** ④ 단지설계 + 배치도 */
  design: {
    title: '단지설계',
    image: 'sections/design.jpg',
    lead: '삶의 여유까지 설계한 명품단지',
    features: [
      { title: '4Bay 판상형 설계', desc: '일조량·통풍을 높인 개방감 있는 평면 (일부 타입 제외)' },
      { title: '통경축 단지배치', desc: '동 간 시야를 확보한 개방적 배치와 편안한 휴식 공간' },
      { title: '특화 외관 계획', desc: '야경을 수놓는 옥탑 경관조명(일부 동) 및 개방형 발코니 특화' },
    ],
    layouts: [
      { title: '단지 배치도', image: 'sections/site-layout.jpg', zoom: true, pad: true },
      { title: '동·호수 배치도 · 101~104동', image: 'sections/dong-layout_1.jpg', zoom: true, pad: false },
      { title: '동·호수 배치도 · 105~108동', image: 'sections/dong-layout_2.jpg', zoom: true, pad: false },
    ],
  },

  /** ⑤ CLUB XIAN 커뮤니티 */
  community: {
    title: 'CLUB XIAN',
    image: 'sections/community.jpg',
    lead: '다채로운 문화생활의 시작, 프리미엄 커뮤니티',
    groups: [
      { title: '운동·웰니스', items: ['피트니스', 'GX룸', '필라테스', '골프연습장(GDR)', '스크린골프', '사우나(남/여)'] },
      { title: '생활·교육', items: ['카페테리아', 'PDR', '키즈/실내놀이터', '독서실·1인독서실', '작은도서관(교보문고)'] },
      { title: '제휴 서비스', items: ['솔닥 원격진료', '세라젬 척추 온열 의료기기'] },
    ],
  },

  /** ⑥ SYSTEM + 기본제공품목 */
  system: {
    title: 'SYSTEM',
    image: 'sections/system.jpg',
    lead: '스마트하게, 더 쾌적하게 — 자이의 차세대 주거 시스템',
    items: [
      { title: '스마트 IoT', desc: '월패드·스마트폰 연동 홈 컨트롤, 자이패스(스마트 출입)' },
      { title: '차세대 환기 시스템', desc: '전열교환 + HEPA급 필터 · 미세먼지/CO₂ 자동 제어' },
      { title: '자이 에너지관리', desc: '세대 비례제어 난방(자체 특허) · 원격검침으로 관리비 절감' },
      { title: 'EV 충전 인프라', desc: '단지 내 급속·완속 전기차 충전 설비' },
    ],
    provided: {
      title: '기본 제공품목',
      image: 'sections/provided.jpg',
      items: ['3연동 자동중문', '이탈리아산 포셀린 타일', '시트패널', '강마루', '엔지니어드스톤 주방상판'],
      note: '※ 일부 마감/사양은 유상 선택품목이며, 제공 품목은 동·타입별로 상이할 수 있습니다.',
    },
  },

  /** ⑦ 평면안내 */
  floorplans: {
    title: '평면안내',
    lead: '실수요 중심 84㎡부터 펜트하우스 134㎡까지',
    plans: [
      { name: '84㎡ A', area: '전용 84.27㎡ · 1단지', image: 'floorplans/84a.jpg', tag: '주력' },
      { name: '84㎡ B', area: '전용 84.96㎡ · 1단지', image: 'floorplans/84b.jpg', tag: '주력' },
      { name: '84㎡ C', area: '전용 84.99㎡ · 1단지', image: 'floorplans/84c.jpg', tag: '' },
      { name: '99㎡ A', area: '전용 99.10㎡ · 1단지', image: 'floorplans/99a.jpg', tag: '1단지' },
      { name: '115㎡ B', area: '전용 115.33㎡ · 2단지', image: 'floorplans/115b.jpg', tag: '2단지' },
      { name: '134㎡ PH', area: '전용 134.56㎡ · 2단지', image: 'floorplans/134p.jpg', tag: '펜트하우스' },
    ],
    note: '※ 평면도는 소비자의 이해를 돕기 위한 것으로 실제 시공 시 다를 수 있습니다.',
  },

  /** 네비게이션(앵커) */
  nav: [
    { label: '사업개요', href: '#overview' },
    { label: '입지환경', href: '#location' },
    { label: '프리미엄', href: '#premium' },
    { label: '단지설계', href: '#design' },
    { label: '커뮤니티', href: '#community' },
    { label: '시스템', href: '#system' },
    { label: '평면안내', href: '#floorplans' },
    { label: '상담신청', href: '#contact' },
  ],
};

export type Site = typeof site;
