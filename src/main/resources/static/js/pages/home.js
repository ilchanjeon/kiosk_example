/**
 * 바코드 전송 함수
 * @result_Parameter : data.barcode;
 */
// function submitBarcode() {
//     fetch('/api/barcode', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({barcode: barcode})
//     })
//         .then(response => response.json())
//         .then(data => { if(data.result) return true;
//                         else return false;
//         })
//         .catch(error => {
//             console.error('오류:', error);
//             return false;
//         });
// }

/**
 * 바코드 입력란에서 엔터 키 감지
 */
// document.getElementById('barcodeInput').addEventListener('keypress', function(e) {
//     if (e.key === 'Enter') {
//         submitBarcode();
//     }
// });

/**
 * 거리 센서 상태 주기적 확인
 */
// setInterval(() => {
//     fetch('/api/status')
//         .then(response => response.json())
//         .then(data => {
//             processDistance(data.distance);
//             if(data.userDetected) document.getElementById('sensorStatus').textContent = '사용자 감지됨';
//             else document.getElementById('sensorStatus').textContent = '대기 중';
//         });
// }, 1000);

$(function () {
    const $focusables = $('.item a');
    let idx = -1;

    function focusAt(newIdx) {
        if (!$focusables.length) return;

        idx = (newIdx + $focusables.length) % $focusables.length;
        $focusables.removeClass('is-focus');
        $focusables.eq(idx).addClass('is-focus').trigger('focus');
    }

    function focusNext() { focusAt(idx === -1 ? 0 : idx + 1); }
    function focusPrev() { focusAt(idx === -1 ? $focusables.length - 1 : idx - 1); }

    $(document).on('keydown', function (e) {
        const key = e.key;

        if (document.getElementById('alert').style.display === 'flex') {
            return;
        }

        if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            focusNext();
            return;
        }

        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            focusPrev();
            return;
        }

        if (key === 'Enter' || key === 'NumpadEnter') {
            e.preventDefault();
            const targetIdx = (idx === -1) ? 0 : idx;
            const el = $focusables.get(targetIdx);

            if (el) el.click();
        }
    });

    // 마우스 / 터치 / 탭 포커스 동기화
    $focusables.on('focus', function () {
        idx = $focusables.index(this);
        $focusables.removeClass('is-focus');
        $(this).addClass('is-focus');
    });
});
