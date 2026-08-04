/**
 * 방문 로그 수집용 Google Apps Script — 파워링크 유입경로·무효클릭 확인
 *
 * 사이트별로 독립된 시트를 씁니다.
 *   1번 사이트 — 기존 시트/스크립트 그대로 (건드리지 않음)
 *   2번 사이트 — a01094088814@gmail.com 계정으로 새로 생성
 *
 * [설치 방법]
 * 1. 새 구글 스프레드시트 생성 (리드폼 시트와 별도 권장)
 * 2. 확장 프로그램 → Apps Script → 이 코드 붙여넣기
 * 3. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자   ← 빠뜨리면 수집이 조용히 실패합니다
 * 4. 발급된 웹앱 URL을 넣는 곳
 *    - 1번 사이트: src/data/site.ts 의 visitLog.endpoint (기본값)
 *    - 2번 사이트: Cloudflare `doanxi2` 프로젝트의 빌드 변수 VISITLOG_ENDPOINT
 *
 * [주의] 코드를 고쳐 다시 올릴 때는 "배포 관리 → 기존 배포 수정 → 새 버전"으로
 *        올려야 웹앱 URL이 유지됩니다. "새 배포"는 URL이 바뀝니다.
 *
 * [무효클릭 확인 팁]
 * - IP 열을 기준으로 정렬/필터하면 같은 IP의 반복 접속이 바로 보임
 * - 의심 IP는 네이버 광고시스템 → 도구 → 광고노출제한 관리에 등록(최대 600개)
 */

var SHEET_NAME = '방문로그';

var HEADERS = [
  '접속시각',
  '유입사이트',
  'IP',
  '검색키워드',
  '유입경로(referrer)',
  'URL 파라미터',
  '기기',
  '화면크기',
  'User-Agent',
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    } else {
      // '유입사이트' 열 추가 이전에 만들어진 기존 시트 보정 — B열을 밀어 넣고 헤더만 채움
      // (기존 데이터 행의 B열은 공란으로 남고, 그건 전부 1번사이트 유입분)
      var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      if (head.indexOf('유입사이트') === -1) {
        sh.insertColumnAfter(1);
        sh.getRange(1, 2).setValue('유입사이트');
      }
    }

    var p = (e && e.parameter) || {};
    var ua = p.ua || '';
    var device = /Mobile|Android|iPhone|iPad/i.test(ua) ? '모바일' : 'PC';

    sh.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      p.site || '(미상)',
      p.ip || '',
      p.keyword || '',
      p.referrer || '(직접 접속)',
      p.query || '',
      device,
      p.screen || '',
      ua,
    ]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
