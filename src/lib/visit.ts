/**
 * 방문 1건의 유입분류·검색키워드 판정 (VisitLogger 가 사용)
 *
 * 브라우저가 주는 단서는 ① URL 파라미터 ② referrer ③ User-Agent 셋뿐입니다.
 * 셋 다 비어 있는 접속(주소 직접 입력·즐겨찾기·문자 링크 등)은 '직접 접속'으로 남고,
 * 그 이상은 구분할 방법이 없습니다.
 * → 문자·카톡으로 링크를 뿌릴 땐 주소 끝에 ?utm_source=문자 처럼 붙이면 '링크(문자)'로 잡힘
 */

export interface VisitInput {
  search: string; // location.search
  referrer: string; // document.referrer
  ua: string; // navigator.userAgent
  host: string; // location.hostname
  navType: string; // PerformanceNavigationTiming.type
}

// 광고 심사·검색 수집 로봇 (사람이 아닌 접속)
const BOT =
  /bot\b|bot\/|crawler|spider|Yeti|Daumoa|HeadlessChrome|Lighthouse|facebookexternalhit|kakaotalk-scrap|Google-InspectionTool|GoogleOther|Mediapartners/i;

// referrer 가 있을 때: 어느 사이트에서 넘어왔는지
const REFERRERS: [RegExp, string][] = [
  [/(^|\.)search\.naver\.com$/, '네이버 검색'],
  [/(^|\.)(blog|cafe|post|kin)\.naver\.com$/, '네이버 블로그·카페'],
  [/(^|\.)naver\.(com|me)$/, '네이버'],
  [/googleadservices|doubleclick|googlesyndication/, '구글 광고'],
  [/(^|\.)google\./, '구글 검색'],
  [/(^|\.)daum\.net$/, '다음'],
  [/(^|\.)bing\.com$/, '빙 검색'],
  [/(^|\.)(facebook|instagram|threads)\.(com|net)$/, '페이스북·인스타그램'],
  [/(^|\.)youtube\.com$/, '유튜브'],
  [/(^|\.)kakao(corp)?\.com$/, '카카오'],
];

// referrer 가 없을 때: 앱 안 브라우저(인앱)는 User-Agent 로만 알 수 있음
const INAPP: [RegExp, string][] = [
  [/KAKAOTALK/i, '카카오톡 링크'],
  [/NAVER\(inapp/i, '네이버 앱'],
  [/Instagram/i, '인스타그램 앱'],
  [/FBAN|FBAV|FB_IAB/i, '페이스북 앱'],
  [/DaumApps/i, '다음 앱'],
  [/BAND\//i, '밴드'],
  [/Line\//i, '라인'],
];

export function classifyVisit({ search, referrer, ua, host, navType }: VisitInput) {
  const q = new URLSearchParams(search);
  const has = (...keys: string[]) => keys.some((k) => q.has(k));

  let refHost = '';
  let refQ = new URLSearchParams();
  let refIsApp = false;
  try {
    const u = new URL(referrer);
    refHost = u.hostname.replace(/^www\./, '');
    refQ = u.searchParams;
    refIsApp = u.protocol === 'android-app:';
  } catch {
    /* referrer 없음 */
  }

  // 네이버 광고는 n_query(실제 검색어)·n_keyword(등록 키워드)를 URL로 넘겨줌.
  // 구글은 검색어를 절대 안 넘기므로, 광고 최종 URL 접미어에
  // utm_term={keyword} 를 걸어야 입찰 키워드라도 잡힘.
  // 광고가 아닌 검색 유입은 referrer 에 검색어가 남아 있을 때만(네이버 query, 다음·빙 q) 잡힘.
  const keyword =
    q.get('n_query') ||
    q.get('utm_term') ||
    q.get('keyword') ||
    q.get('n_keyword') ||
    (/(^|\.)(naver|daum|bing|zum|nate|yahoo|google)\./.test(refHost)
      ? refQ.get('query') || refQ.get('q') || refQ.get('p')
      : '') ||
    '';

  const utmSource = q.get('utm_source') || '';
  const paid = /cpc|ppc|paid|ad/i.test(q.get('utm_medium') || '');

  let channel: string;
  if (BOT.test(ua)) {
    channel = '봇·크롤러';
  } else if (has('gclid', 'gbraid', 'wbraid', 'gad_source', 'gad_campaignid') || (/^google$/i.test(utmSource) && paid)) {
    channel = '구글 광고';
  } else if (
    has('n_media', 'n_query', 'n_keyword', 'n_ad', 'n_ad_group', 'n_campaign_type', 'NaPm') ||
    (/^naver$/i.test(utmSource) && paid)
  ) {
    channel = '네이버 광고';
  } else if (has('fbclid')) {
    channel = '페이스북·인스타그램';
  } else if (utmSource) {
    channel = `링크(${utmSource})`;
  } else if (refHost && refHost === host.replace(/^www\./, '')) {
    channel = '사이트 내 이동';
  } else if (refIsApp) {
    channel = /googlequicksearchbox/.test(refHost) ? '구글 검색' : `앱(${refHost})`;
  } else if (refHost) {
    channel = REFERRERS.find(([re]) => re.test(refHost))?.[1] ?? `외부 사이트(${refHost})`;
  } else {
    channel = INAPP.find(([re]) => re.test(ua))?.[1] ?? '직접 접속';
  }

  // 같은 광고 주소로 여러 번 찍혀도 실제 클릭인지 새로고침인지 구분되도록 표시
  if (channel !== '봇·크롤러') {
    if (navType === 'reload') channel += ' · 새로고침';
    else if (navType === 'back_forward') channel += ' · 뒤로가기';
  }

  return { channel, keyword };
}
