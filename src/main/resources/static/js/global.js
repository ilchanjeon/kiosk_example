
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
    if (passwordInput.value.length < 4) {
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
            let result = forceCloseWindow();
            if(!result) {
                alert('브라우저 설정으로 인해 자동으로 닫을 수 없습니다. 수동으로 창을 닫아주세요.');
            }
            // window.close();
            // setTimeout(() => {alert('브라우저 설정으로 인해 자동으로 닫을 수 없습니다. 수동으로 창을 닫아주세요.');}, 2500);
        }
    } else {
        alert('비밀번호가 올바르지 않습니다.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// 마우스 우클릭 방지
document.addEventListener('contextmenu', e => e.preventDefault());

// 마우스 드래그 및 블록 선택 방지
document.addEventListener('selectstart', e => e.preventDefault());

// 텍스트 드래그 방지
document.addEventListener('mousedown', e => {
    if (e.detail > 1) e.preventDefault(); // 더블 클릭 방지
});

// 드래그 시작 방지
document.ondragstart = function() {
    return false;
};

// 이미지 드래그 방지 (추가 처리)
document.addEventListener('dragstart', function(event) {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
}, false);

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

/**
 * 바코드 입력 가능 상태 체크
 */
let barcodeInputEnabled = false;

function waitForBarcode() {
    return new Promise((resolve) => {
        const input = document.getElementById('barcodeInput');
        let checkInterval;
        input.focus();

        const handleInput = () => {
            const barcode = input.value.trim();

            if (barcode && barcodeInputEnabled) {
                clearInterval(checkInterval);
                input.removeEventListener('input', handleInput);
                resolve(barcode);
            }
        };

        checkInterval = setInterval(() => {
            if (!barcodeInputEnabled) {
                clearInterval(checkInterval);
                input.removeEventListener('input', handleInput);
                resolve("event_cancelled");
            }
        }, 1000);


        document.getElementById('barcodeInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleInput();
            }
        });
    });
}

/**
 * -------------------------------------------------------------
 * 거리 센서 확인 및 활동감지를 통해 첫 시작 페이지로 이동
 * -------------------------------------------------------------
 */
let pageCheck = ""; // 현재 페이지 체크 변수
let distanceCount = 0;

setInterval(() => {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            if(!isNaN(data.distance) && pageCheck !== "home") {
                // 거리 cm 단위로 소수점 없음
                data.distance = data.distance.toFixed();

                if(data.distance >= 70) distanceCount++; // 70cm 이상 멀어지면 카운트 증가
                else distanceCount = 0;

                if(distanceCount === 20) {
                    showAlert("일정 시간 동안 사용이 없어 잠시 후 첫 화면으로 돌아갑니다.");
                    setTimeout(closeAlert, 9000);
                }

                // 30초 동안 멀어지면 홈으로 이동
                if(distanceCount > 30) {
                    reloadPage('home');
                }
            }
        });
}, 1000);

// 알림창 보이기
function showAlert(message) {
    document.getElementById('alert').style.display = 'flex';
    document.getElementById('alert-message').textContent = message;

    document.addEventListener('keydown', handleAlertKey);
}

// 알림창 숨기기
function closeAlert() {
    document.getElementById('alert').style.display = 'none';
    barcodeInputEnabled = false;

    document.removeEventListener('keydown', handleAlertKey);
}

function handleAlertKey(e) {
    const closeBtn = document.querySelector('#alert button');

    // 방향키 차단
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeBtn.focus();
        return false;
    }

    // Enter 키로 닫기
    if (e.key === 'Enter' && document.activeElement === closeBtn) {
        console.log("hi");
        closeAlert();
    }
}

function forceCloseWindow() {
    // 반드시 사용자 제스처(클릭 등)에서 호출해야 허용되는 경우가 많음.
    try {
        // 기본 시도
        window.close();
        if (window.closed) return true;
    } catch (e) {}

    try {
        // 시도 2: 자기 자신을 새창으로 열어 닫기
        window.open('', '_self');
        window.close();
        if (window.closed) return true;
    } catch (e) {}

    try {
        // 시도 3: 부모/상위 대상으로 시도
        window.open('', '_parent');
        window.close();
        if (window.closed) return true;
    } catch (e) {}

    try {
        // 시도 4: about:blank 로 대체한 뒤 닫기 시도 (대체 후 브라우저가 허용하면 닫힘)
        window.location.replace('about:blank');
        setTimeout(function () {
            try { window.close(); } catch (e) {}
        }, 100);
        return true; // 리다이렉트는 수행됨
    } catch (e) {}

    // 마지막 보루(브라우저 정책상 여전히 막히는 경우가 존재함)
    // 새 탭을 열어 바로 닫는 방식(일부 환경에서 유효) — 사용자 제스처 필요
    try {
        var tmp = window.open('about:blank', '_blank');
        if (tmp) {
            tmp.close();
            // 현재 창은 닫을 수 없으므로 about:blank 로 이동
            window.location.replace('about:blank');
            return true;
        }
    } catch (e) {}

    return false; // 모든 시도 실패
}

/**
 * 이벤트 리스너 설정
 */
document.addEventListener('DOMContentLoaded', function() {
    pageCheck = sessionStorage.getItem('pageName');

    switch (pageCheck) {
        case "home": {
            homeLoad();
            break;
        }
        case "memberVisit": {
            memberVisit();
            break;
        }
        case "monthMember": {
            monthMemberSumbmit();
            break;
        }
        case "onedayClass" : {
            onedayClassBuying();
            break;
        }
        case "cancel1" : {
            payCancel1();
            break;
        }
        case "cancel2" : {
            payCancel2();
            break;
        }
        default: {
            homeLoad();
            break;
        }
    }

    // homeLoad();  // 메인 페이지 로드
});
