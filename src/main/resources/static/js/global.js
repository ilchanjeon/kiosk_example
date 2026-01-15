
// ============================================
// 전역 유틸리티 함수 - 모든 페이지에서 사용
// ============================================

/**
 * 관리자 비밀번호
 * @type {string}
 */
const ADMIN_PASSWORD = '1234';

/**
 * 관리자 창 열기용 클릭 카운트
 * @type {number}
 */
let secretClickCount = 0;
let secretClickTimeout = null;


/**
 * 비밀 영역 클릭 처리
 */
function handleSecretClick() {
    secretClickCount++;

    clearTimeout(secretClickTimeout);

    if (secretClickCount >= 6) {
        secretClickCount = 0;
        showPasswordModal();
    } else {
        secretClickTimeout = setTimeout(function() {
            secretClickCount = 0;
        }, 2000);
    }
}

/**
 * 비밀번호 입력 관련 함수들
 */
function deleteLastDigit() {
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.value = passwordInput.value.slice(0, -1);
}

/**
 * 비밀번호 초기화
 */
function clearPassword() {
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.value = '';
}

/**
 * 비밀번호 자릿수 추가
 * @param digit
 */
function addPasswordDigit(digit) {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput.value.length < 10) {
        passwordInput.value += digit;
    }
}

/**
 * 비밀번호 모달 표시
 */
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    modal.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
}

/**
 * 비밀번호 모달 닫기
 */
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'none';
}

/**
 * 비밀번호 확인
 */
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const inputPassword = passwordInput.value;

    if (inputPassword === ADMIN_PASSWORD) {
        closePasswordModal();
        if (confirm('키오스크를 종료하시겠습니까?')) {
            window.close();
            setTimeout(() => {alert('브라우저 설정으로 인해 자동으로 닫을 수 없습니다. 수동으로 창을 닫아주세요.');}, 2500);
        }
    } else {
        alert('비밀번호가 올바르지 않습니다.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

/**
 * 이벤트 리스너 설정
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * @description 엔터 키로 비밀번호 확인
     * @type {HTMLElement}
     */
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    /**
     * @description 모달 외부 클릭 시 닫기
     * @type {HTMLElement}
     */
    const modal = document.getElementById('passwordModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePasswordModal();
        }
    });

    console.log("DOM 로드 완료 - 전역 스크립트 실행됨");

    homeLoad();  // 메인 페이지 로드

});
