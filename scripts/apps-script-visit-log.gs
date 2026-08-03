/**
 * 방문 로그 수집용 Google Apps Script — 파워링크 유입경로·무효클릭 확인
 *
 * [설치 방법]
 * 1. 새 구글 스프레드시트 생성 (리드폼 시트와 별도 권장)
 * 2. 확장 프로그램 → Apps Script → 이 코드 붙여넣기
 * 3. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자
 * 4. 발급된 웹앱 URL을 src/data/site.ts 의 visitLog.endpoint 에 입력
 *
 * [무효클릭 확인 팁]
 * - IP 열을 기준으로 정렬/필터하면 같은 IP의 반복 접속이 바로 보임
 * - 의심 IP는 네이버 광고시스템 → 도구 → 광고노출제한 관리에 등록(최대 600개)
 */

var SHEET_NAME = '방문로그';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow([
        '접속시각',
        'IP',
        '검색키워드',
        '유입경로(referrer)',
        'URL 파라미터',
        '기기',
        '화면크기',
        'User-Agent',
      ]);
      sh.setFrozenRows(1);
    }

    var p = (e && e.parameter) || {};
    var ua = p.ua || '';
    var device = /Mobile|Android|iPhone|iPad/i.test(ua) ? '모바일' : 'PC';

    sh.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
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
