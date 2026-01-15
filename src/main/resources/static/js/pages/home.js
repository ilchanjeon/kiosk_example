
/**
 * 로그 추가 함수
 * @param containerId
 * @param message
 * @param type
 */
function addLog(containerId, message, type = 'info') {
    const logContainer = document.getElementById(containerId);
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    const time = new Date().toLocaleTimeString('ko-KR');
    logEntry.innerHTML = '<span class="log-time">[' + time + ']</span>' + message;

    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;

}

/**\
 * 거리 데이터 처리 함수
 * @param distance
 */
function processDistance(distance) {
    if (!isNaN(distance)) {
        document.getElementById('distanceValue').textContent = distance.toFixed(0);
        addLog('sensorLog', '거리 측정: ' + distance.toFixed() + ' cm');
    } else {
        addLog('sensorLog', '수신 데이터: ' + data);
    }
}

/**
 * 바코드 전송 함수
 */
function submitBarcode() {
    const barcode = document.getElementById('barcodeInput').value.trim();
    if (!barcode) {
        addLog('barcodeLog','바코드를 입력하세요');
        return;
    }

    fetch('/api/barcode', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({barcode: barcode})
    })
        .then(response => response.json())
        .then(data => { if(data.result) addLog('barcodeLog','바코드 전송 완료: '+ data.barcode);
        else addLog('barcodeLog','전송 실패' + data.barcode);})
        .catch(error => {
            console.error('오류:', error);
            addLog('barcodeLog','전송 실패');
        });
}

/**
 * 테스트 출력 함수
 */
function testPrint() {
    fetch('/api/test-print', {method: 'POST'})
        .then(response => response.json())
        .then(data => { if(data.result) addLog('printerLog','테스트 출력 시작');
        else addLog('printerLog','출력 실패');})
        .catch(error => addLog('printerLog','출력 실패'));
}

/**
 * 바코드 입력란에서 엔터 키 감지
 */
document.getElementById('barcodeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitBarcode();
    }
});

/**
 * 거리 센서 상태 주기적 확인
 */
setInterval(() => {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            processDistance(data.distance);
            if(data.userDetected) document.getElementById('sensorStatus').textContent = '사용자 감지됨';
            else document.getElementById('sensorStatus').textContent = '대기 중';
        });
}, 1000);

