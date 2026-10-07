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
 * [기존 시트에 새 버전을 올릴 때]
 * - 시트는 손대지 않아도 됩니다. 없는 열(유입분류·체류시간·방문ID)은 첫 접속 때
 *   기존 데이터를 밀지 않고 제자리에 자동으로 끼워 넣습니다.
 * - 1행 제목은 바꾸지 마세요. 제목으로 열을 찾기 때문에, 바꾸면 같은 열이 새로 생깁니다.
 *   (열 순서를 옮기는 건 괜찮습니다)
 * - 사이트 코드보다 이 스크립트를 먼저 올려야 합니다. 순서가 바뀌면 그 사이 방문이
 *   2줄씩 쌓입니다.
 *
 * [열 설명]
 * - 유입분류: 구글 광고 / 네이버 광고 / 네이버 검색 / 카카오톡 링크 / 봇·크롤러 / 직접 접속 등
 *             뒤에 '· 새로고침'이 붙으면 광고 클릭이 아니라 같은 화면을 다시 불러온 것
 * - 체류시간(초): 화면이 실제로 보인 시간. 공란이면 이탈 신호를 못 받은 방문
 * - 방문ID: 진입 기록과 체류시간을 한 행으로 합치는 데 쓰는 값(지우지 마세요)
 *
 * [무효클릭 확인 팁]
 * - IP 열을 기준으로 정렬/필터하면 같은 IP의 반복 접속이 바로 보임
 * - 의심 IP는 네이버 광고시스템 → 도구 → 광고노출제한 관리에 등록(최대 600개)
 */

var SHEET_NAME = '방문로그';

// 열 순서 — 시트에 없는 열은 이 순서상 앞 열 바로 뒤에 자동 삽입됨
var HEADERS = [
  '접속시각',
  '유입사이트',
  'IP',
  '유입분류',
  '검색키워드',
  '체류시간(초)',
  '유입경로(referrer)',
  'URL 파라미터',
  '기기',
  '화면크기',
  'User-Agent',
  '방문ID',
];

// 체류시간을 덮어쓸 행을 찾을 때 뒤에서부터 살펴볼 행 수
var LOOKBACK_ROWS = 1000;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sh = getSheet_();
    var head = ensureHeaders_(sh);
    var p = (e && e.parameter) || {};
    var vid = p.vid || '';
    var dwell = p.dwell === undefined || p.dwell === '' || isNaN(Number(p.dwell)) ? '' : Number(p.dwell);

    // 사이트는 한 방문에 대해 진입 때 1번, 이탈 때(체류시간 포함) 1번 이상 보냅니다.
    // 같은 방문ID의 행이 이미 있으면 새 행을 만들지 않고 그 행만 보완합니다.
    var row = vid ? findRow_(sh, head, vid) : 0;
    if (row) {
      if (dwell !== '') sh.getRange(row, head.indexOf('체류시간(초)') + 1).setValue(dwell);
      if (p.ip) {
        var ipCell = sh.getRange(row, head.indexOf('IP') + 1);
        if (!ipCell.getValue()) ipCell.setValue(text_(p.ip));
      }
      return ContentService.createTextOutput('ok');
    }

    var ua = p.ua || '';
    var values = {
      '접속시각': Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      '유입사이트': text_(p.site || '(미상)'),
      'IP': text_(p.ip),
      '유입분류': text_(p.channel),
      '검색키워드': text_(p.keyword),
      '체류시간(초)': dwell,
      '유입경로(referrer)': text_(p.referrer || '(직접 접속)'),
      'URL 파라미터': text_(p.query),
      '기기': /Mobile|Android|iPhone|iPad/i.test(ua) ? '모바일' : 'PC',
      '화면크기': text_(p.screen),
      'User-Agent': text_(ua),
      '방문ID': text_(vid),
    };
    sh.appendRow(
      head.map(function (h) {
        return values.hasOwnProperty(h) ? values[h] : '';
      })
    );
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** 1행 제목을 읽고, HEADERS 에 있는데 시트에 없는 열을 제자리에 끼워 넣은 뒤 현재 제목 배열을 돌려줌 */
function ensureHeaders_(sh) {
  var head = sh
    .getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1))
    .getValues()[0]
    .map(String);
  HEADERS.forEach(function (h, i) {
    if (head.indexOf(h) !== -1) return;
    // 순서상 앞 열의 위치(1부터). 앞 열은 이미 있거나 방금 넣었으므로 항상 찾아짐
    var after = i === 0 ? 0 : head.indexOf(HEADERS[i - 1]) + 1;
    if (after === 0) sh.insertColumnBefore(1);
    else sh.insertColumnAfter(after);
    sh.getRange(1, after + 1).setValue(h);
    head.splice(after, 0, h);
  });
  return head;
}

/** 방문ID가 같은 행 번호(없으면 0). 최근 행부터 거꾸로 찾음 */
function findRow_(sh, head, vid) {
  var col = head.indexOf('방문ID') + 1;
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var start = Math.max(2, last - LOOKBACK_ROWS + 1);
  var ids = sh.getRange(start, col, last - start + 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === vid) return start + i;
  }
  return 0;
}

/** 방문자가 보낸 글자가 시트에서 수식으로 실행되지 않도록 = + - @ 로 시작하면 글자로 고정 */
function text_(v) {
  v = String(v == null ? '' : v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
