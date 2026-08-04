/**
 * 상담신청(리드폼) 수집용 Google Apps Script — 사이트별 독립 시트
 * ────────────────────────────────────────────────────────────
 * 사이트 하나당 [구글시트 1개 + 이 스크립트 1개 + 웹앱 배포 1개] 세트로 운영합니다.
 *
 * [설치 방법]
 * 1. 시트를 만들 구글 계정으로 로그인
 *    - 1번 사이트: 기존 시트/스크립트 그대로 유지 (건드리지 않음)
 *    - 2번 사이트: a01094088814@gmail.com 계정으로 새 스프레드시트 생성
 * 2. 확장 프로그램 → Apps Script → 이 코드 전체 붙여넣기
 * 3. 아래 NOTIFY_EMAIL / SITE_NAME 값을 해당 사이트에 맞게 수정
 * 4. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자   ← 이걸 빠뜨리면 접수가 조용히 실패합니다
 * 5. 발급된 웹앱 URL을 Cloudflare `doanxi2` 프로젝트의
 *    빌드 변수 LEAD_ENDPOINT 에 입력 → 재배포
 *
 * [주의] 나중에 코드를 고치면 "배포 관리 → 기존 배포 수정 → 새 버전"으로 올려야
 *        웹앱 URL이 유지됩니다. "새 배포"를 만들면 URL이 바뀌어 접수가 끊깁니다.
 */

// ─── 사이트별 설정 ───────────────────────────────────────────
var NOTIFY_EMAIL = 'a01094088814@gmail.com'; // 접수 알림 받을 주소 (비우면 메일 발송 안 함)
var SITE_NAME = '2번사이트'; // 메일 제목에 표기 (사이트에서 보내온 값이 있으면 그 값 우선)
var SHEET_NAME = '상담신청';

var HEADERS = ['접수시각', '유입사이트', '성함', '연락처', '관심평형', '개인정보동의'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    var p = (e && e.parameter) || {};
    var sh = getSheet_();
    var now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    var label = p.site || SITE_NAME;

    sh.appendRow([
      now,
      label,
      p.name || '',
      // 앞자리 0이 날아가지 않도록 텍스트로 강제
      "'" + (p.phone || ''),
      p.interest || '',
      p.agree || '',
    ]);

    notify_(p, label, now);
  } finally {
    lock.releaseLock();
  }
  // 사이트는 no-cors로 보내 응답을 읽지 못하지만, 200을 돌려줘야 재시도가 안 걸립니다
  return ContentService.createTextOutput('ok');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange('D:D').setNumberFormat('@'); // 연락처 열 텍스트 서식
    sh.setColumnWidth(1, 150);
    sh.setColumnWidth(4, 130);
  }
  return sh;
}

function notify_(p, label, now) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '[도안자이 상담신청 · ' + label + '] ' + (p.name || '') + ' 님',
      body: [
        '유입사이트: ' + label,
        '성함: ' + (p.name || ''),
        '연락처: ' + (p.phone || ''),
        '관심평형: ' + (p.interest || '-'),
        '개인정보 동의: ' + (p.agree || ''),
        '접수시각: ' + now,
      ].join('\n'),
    });
  } catch (err) {
    // 메일 할당량 초과 등으로 실패해도 시트 기록은 이미 끝났으므로 접수는 유효
    console.error('mail failed: ' + err);
  }
}

/**
 * 설치 직후 동작 확인용 — Apps Script 편집기에서 이 함수만 실행해 보세요.
 * 시트에 테스트 행이 쌓이고 알림 메일이 오면 정상입니다. (확인 후 해당 행 삭제)
 */
function testRun() {
  doPost({
    parameter: {
      name: '테스트',
      phone: '010-0000-0000',
      interest: '84㎡',
      agree: '동의',
      site: SITE_NAME,
    },
  });
}
